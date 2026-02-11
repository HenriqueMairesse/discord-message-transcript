import { FALLBACK_PIXEL, TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { cdnResolver } from "../cdn/cdnResolver.js";
import { imageToBase64 } from "../base64/imageToBase64.js";
import { safeUrlReturn } from "@/types/private/network.js";
import { CDNOptions } from "@/types/private/cdn.js";

export async function urlResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string> {
    if (safeUrlObject.safe == false) return "";
    if (safeUrlObject.url == FALLBACK_PIXEL) return safeUrlObject.url;    
    if (urlCache.has(safeUrlObject.url)) {
        const cache = urlCache.get(safeUrlObject.url);
        if (cache) return await cache;
    }

    let returnUrl;
    if (cdnOptions) returnUrl = cdnResolver(safeUrlObject, options, cdnOptions);
    else if (options.saveImages) returnUrl = imageToBase64(safeUrlObject, options.disableWarnings);

    if (returnUrl) {
        urlCache.set(safeUrlObject.url, returnUrl);
        return await returnUrl;
    }
    return safeUrlObject.url;
}