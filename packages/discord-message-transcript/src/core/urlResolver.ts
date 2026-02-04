import { TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions } from "../types/types.js";
import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";

export async function urlResolver(url: string, options: TranscriptOptionsBase, cdnOptions: CDNOptions<unknown> | null): Promise<string> {
    if (cdnOptions) {
        return await cdnResolver(url, cdnOptions);
    } 
    if (options.saveImages) {
        return await imageToBase64(url);
    }
    return url; 
}