import { CustomWarn } from "discord-message-transcript-base/internal";
import { getCDNLimiter } from "../limiter.js";
import { createLookup } from "../../networkSecurity/index.js";
import https from 'https';
import http from 'http';
import { uploadCareCdnResolver } from "./uploadCareCdnResolver.js";
import { cloudinaryCdnResolver } from "./cloudinaryCdnResolver.js";
import { validateCdnUrl } from "./validateCdnUrl.js";
import { USER_AGENT } from "../contants.js";
export async function cdnResolver(safeUrlObject, options, cdnOptions) {
    const url = safeUrlObject.url;
    const limit = getCDNLimiter();
    return limit(async () => {
        return new Promise((resolve, reject) => {
            const client = safeUrlObject.url.startsWith('https') ? https : http;
            const lookup = createLookup(safeUrlObject.safeIps);
            const request = client.get(url, {
                headers: { "User-Agent": USER_AGENT },
                lookup: lookup
            }, async (response) => {
                if (response.statusCode !== 200) {
                    response.destroy();
                    CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Failed to fetch attachment with status code: ${response.statusCode} from ${safeUrlObject.url}.`, options.disableWarnings);
                    return resolve(url);
                }
                const contentType = response.headers["content-type"];
                const splitContentType = contentType ? contentType?.split('/') : [];
                if (!contentType || splitContentType.length != 2 || splitContentType[0].length == 0 || splitContentType[1].length == 0) {
                    response.destroy();
                    CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Failed to receive a valid content-type from ${url}.`, options.disableWarnings);
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
                    return resolve(await cdnRedirectType(url, options, contentType, cdnOptions));
                }
                return resolve(url);
            });
            request.on('error', (err) => {
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Error: ${err.message}`, options.disableWarnings);
                return resolve(url);
            });
            request.setTimeout(15000, () => {
                request.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Request timeout for ${url}.`, options.disableWarnings);
                return resolve(url);
            });
            request.end();
        });
    });
}
async function cdnRedirectType(url, options, contentType, cdnOptions) {
    let newUrl;
    switch (cdnOptions.provider) {
        case "CUSTOM": {
            try {
                newUrl = await cdnOptions.resolver(url, contentType, cdnOptions.customData);
                break;
            }
            catch (error) {
                CustomWarn(`Custom CDN resolver threw an error. Falling back to original URL.
This is most likely an issue in the custom CDN implementation provided by the user.
URL: ${url}
Error: ${error?.message ?? error}`, options.disableWarnings);
                return url;
            }
        }
        case "CLOUDINARY": {
            newUrl = await cloudinaryCdnResolver(url, options.fileName, cdnOptions.cloudName, cdnOptions.apiKey, cdnOptions.apiSecret, options.disableWarnings);
            break;
        }
        case "UPLOADCARE": {
            newUrl = await uploadCareCdnResolver(url, cdnOptions.publicKey, cdnOptions.cdnDomain, options.disableWarnings);
            break;
        }
    }
    if (validateCdnUrl(newUrl, options.disableWarnings))
        return newUrl;
    return url;
}
