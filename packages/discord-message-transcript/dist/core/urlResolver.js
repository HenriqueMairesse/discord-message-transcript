import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";
export async function urlResolver(url, options, cdnOptions) {
    if (cdnOptions)
        return await cdnResolver(url, cdnOptions);
    if (options.saveImages)
        return await imageToBase64(url);
    return url;
}
