import { CDNOptions } from "../types/types.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base";
export declare function cdnResolver(url: string, options: TranscriptOptionsBase, cdnOptions: CDNOptions): Promise<string>;
export declare function uploadCareResolver(url: string, publicKey: string, cdnDomain: string, disableWarnings: boolean): Promise<string>;
export declare function cloudinaryResolver(url: string, fileName: string, cloudName: string, apiKey: string, apiSecret: string, disableWarnings: boolean): Promise<string>;
