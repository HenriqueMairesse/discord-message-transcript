import { CustomError } from "discord-message-transcript-base";
import { CDNOptions, MimeType } from "../types/types.js";
import https from 'https';
import { CustomWarn } from "../../../discord-message-transcript-base/src/core/customMessages.js";

export async function cdnResolver(url: string, cdnOptions: CDNOptions<unknown>): Promise<string> {
    return new Promise((resolve, reject) => {
        const request = https.get(url, async (response) => {
            if (response.statusCode !== 200) {
                CustomWarn(`Failed to fetch attachment with status code: ${response.statusCode} from ${url}.\nUsing default url instead uploading to CDN`);
                response.destroy()
                return resolve(url);
            }
            const contentType = response.headers["content-type"];
            response.destroy();
            const splitContentType = contentType ? contentType?.split('/') : [];
            if (!contentType || splitContentType.length != 2 || splitContentType[0].length == 0 || splitContentType[1].length == 0) {
                CustomWarn(`Failed to receive a valid content-type from ${url}.\nUsing default url instead uploading to CDN`);
                return resolve(url);
            }
            const isAudio = contentType.startsWith('audio/');
            if (!cdnOptions.includeAudio && isAudio) {
                return resolve(url);
            }
            const isImage = contentType.startsWith('image/');
            if (!cdnOptions.includeImage && isImage) {
                return resolve(url);
            }
            const isVideo = contentType.startsWith('video/');
            if (!cdnOptions.includeVideo && isVideo) {
                return resolve(url);
            }
            if (!cdnOptions.includeOthers && !isAudio && !isImage && !isVideo) {
                return resolve(url);
            }

            switch (cdnOptions.type) {
                case "CLOUDFLARE": {
                    // TODO: Implement cloudflare cdn code
                    break;
                }
                
                case "CUSTOM": {
                    return resolve(await cdnOptions.customCdnResolver(url, contentType as MimeType, cdnOptions.other));
                }
                            
                default: {
                    return reject(new CustomError("CDN type invalid!"));
                }
            }
        })

        request.on('error', (err) => {
            return reject(new CustomError(`Error fetching image from ${url}: ${err.message}`));
        });
    })
}