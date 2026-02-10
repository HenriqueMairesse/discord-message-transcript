import { CustomWarn } from 'discord-message-transcript-base';
import { getBase64Limiter } from '../limiter.js';
import https from 'https';
import http from 'http';
import { createLookup } from '@/networkSecurity';
import { USER_AGENT } from '../contants.js';
const MAX_BYTES = 25 * 1024 * 1024; // 25MB
export async function imageToBase64(safeUrlObject, disableWarnings) {
    const url = safeUrlObject.url;
    const limit = getBase64Limiter();
    return limit(async () => {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http;
            const lookup = createLookup(safeUrlObject.safeIps);
            const request = client.get(url, {
                headers: { "User-Agent": USER_AGENT },
                lookup: lookup
            }, (response) => {
                if (response.statusCode !== 200) {
                    response.destroy();
                    CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.
Failed to fetch image with status code: ${response.statusCode} from ${url}.`, disableWarnings);
                    return resolve(url);
                }
                const contentType = response.headers['content-type'];
                if (!contentType || !contentType.startsWith('image/') || contentType === 'image/gif') {
                    response.destroy();
                    return resolve(url);
                }
                let total = 0;
                const chunks = [];
                response.on('data', (chunk) => {
                    total += chunk.length;
                    if (total > MAX_BYTES) {
                        response.destroy();
                        return resolve(url);
                    }
                    chunks.push(chunk);
                });
                response.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    const base64 = buffer.toString('base64');
                    resolve(`data:${contentType};base64,${base64}`);
                });
                response.on('error', (err) => {
                    CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.
Stream error while fetching from ${url}.
Error: ${err.message}`, disableWarnings);
                    resolve(url);
                });
            });
            request.on('error', (err) => {
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.
Error fetching image from ${url}
Error: ${err.message}`, disableWarnings);
                return resolve(url);
            });
            request.setTimeout(15000, () => {
                request.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.
Request timeout for ${url}.`, disableWarnings);
                resolve(url);
            });
            request.end();
        });
    });
}
