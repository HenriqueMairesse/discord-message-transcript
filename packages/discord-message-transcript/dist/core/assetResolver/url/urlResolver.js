import { FALLBACK_PIXEL } from "discord-message-transcript-base";
import { cdnResolver } from "../cdn/cdnResolver.js";
import { imageToBase64 } from "../base64/imageToBase64.js";
export async function urlResolver(safeUrlObject, options, cdnOptions, urlCache) {
    if (safeUrlObject.safe == false)
        return "";
    if (safeUrlObject.url == FALLBACK_PIXEL)
        return safeUrlObject.url;
    if (urlCache.has(safeUrlObject.url)) {
        const cache = urlCache.get(safeUrlObject.url);
        if (cache)
            return await cache;
    }
    let returnUrl;
    if (cdnOptions)
        returnUrl = cdnResolver(safeUrlObject, options, cdnOptions);
    else if (options.saveImages)
        returnUrl = imageToBase64(safeUrlObject, options.disableWarnings);
    if (returnUrl) {
        urlCache.set(safeUrlObject.url, returnUrl);
        return await returnUrl;
    }
    return safeUrlObject.url;
}
