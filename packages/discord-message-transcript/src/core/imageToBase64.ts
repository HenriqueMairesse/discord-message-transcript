import https from 'https';
import http from 'http';
import { CustomWarn } from 'discord-message-transcript-base';

export async function imageToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, { headers: { "User-Agent": "discord-message-transcript" } }, (response) => {
            if (response.statusCode !== 200) {
                response.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.\nFailed to fetch image with status code: ${response.statusCode} from ${url}.`);
                return resolve(url);
            }

            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.startsWith('image/') || contentType === 'image/gif') {
                response.destroy();
                return resolve(url);
            }

            const chunks: Buffer[] = [];
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(`data:${contentType};base64,${base64}`);
            });

            response.on('error', (err) => {
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.\nStream error while fetching from ${url}.\nError message: ${err.message}`);
                resolve(url);
            });
        });

        request.on('error', (err) => {
            CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.\nError fetching image from ${url}\nError message: ${err.message}`);
            return resolve(url);
        });

        request.setTimeout(15000, () => {
            request.destroy();
            CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of converting to base64.\nRequest timeout for ${url}. Using original URL.`);
            resolve(url);
        });

        request.end();
    });
}
