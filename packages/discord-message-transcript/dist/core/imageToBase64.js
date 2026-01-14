import https from 'https';
import { CustomError } from 'discord-message-transcript-base';
export async function urlToBase64(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new CustomError(`Failed to fetch image with status code: ${response.statusCode} from ${url}`));
                return;
            }
            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.startsWith('image/')) {
                reject(new CustomError(`URL did not point to an image. Content-Type: ${contentType} from ${url}`));
                return;
            }
            const chunks = [];
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });
            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                resolve(`data:${contentType};base64,${base64}`);
            });
        });
        request.on('error', (err) => {
            reject(new CustomError(`Error fetching image from ${url}: ${err.message}`));
        });
        request.end();
    });
}
