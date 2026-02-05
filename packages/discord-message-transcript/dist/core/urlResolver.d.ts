import { TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions } from "../types/types.js";
export declare function urlResolver(url: string, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<string>;
