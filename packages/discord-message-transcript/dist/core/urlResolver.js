import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";
export async function urlResolver(url, options, cdnOptions, isImage) {
    if (!cdnOptions) {
        if (options.saveImages && isImage)
            return await imageToBase64(url);
        return url;
    }
    return await cdnResolver(url, cdnOptions);
}
