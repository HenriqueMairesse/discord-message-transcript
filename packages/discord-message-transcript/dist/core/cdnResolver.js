import https from 'https';
import http from 'http';
import { CustomWarn } from "discord-message-transcript-base";
export async function cdnResolver(url, cdnOptions) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, { headers: { "User-Agent": "discord-message-transcript" } }, async (response) => {
            if (response.statusCode !== 200) {
                response.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nFailed to fetch attachment with status code: ${response.statusCode} from ${url}.`);
                return resolve(url);
            }
            const contentType = response.headers["content-type"];
            const splitContentType = contentType ? contentType?.split('/') : [];
            if (!contentType || splitContentType.length != 2 || splitContentType[0].length == 0 || splitContentType[1].length == 0) {
                response.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nFailed to receive a valid content-type from ${url}.`);
                return resolve(url);
            }
            response.destroy();
            const isImage = contentType.startsWith('image/') && contentType !== 'image/gif';
            const isAudio = contentType.startsWith('audio/');
            const isVideo = contentType.startsWith('video/') || contentType === 'image/gif';
            if ((cdnOptions.includeImage && isImage) ||
                (cdnOptions.includeAudio && isAudio) ||
                (cdnOptions.includeVideo && isVideo) ||
                (cdnOptions.includeOthers && !isAudio && !isImage && !isVideo)) {
                return resolve(await cdnRedirectType(url, contentType, cdnOptions));
            }
            return resolve(url);
        });
        request.on('error', (err) => {
            CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nError message: ${err.message}`);
            return resolve(url);
        });
        request.setTimeout(15000, () => {
            request.destroy();
            CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nRequest timeout for ${url}. Using original URL.`);
            resolve(url);
        });
        request.end();
    });
}
async function cdnRedirectType(url, contentType, cdnOptions) {
    switch (cdnOptions.type) {
        case "CUSTOM": {
            return await cdnOptions.resolver(url, contentType, cdnOptions.customData);
        }
        case "CLOUDFLARE_R2": {
            return await cdnCloudflareR2(url, contentType, cdnOptions);
        }
    }
}
async function cdnCloudflareR2(url, contentType, cdnOptions) {
    return '';
}
