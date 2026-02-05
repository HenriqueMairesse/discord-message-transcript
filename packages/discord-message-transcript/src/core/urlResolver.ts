import { TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions } from "../types/types.js";
import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";

export async function urlResolver(url: string, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string> {
    if (urlCache.has(url)) {
        const cache = urlCache.get(url);
        if (cache) return await cache;
    }
    let returnUrl;
    if (cdnOptions) returnUrl = cdnResolver(url, cdnOptions);
    else if (options.saveImages) returnUrl = imageToBase64(url);
    if (returnUrl) {
        urlCache.set(url, returnUrl);
        return await returnUrl;
    }
    return url;
}