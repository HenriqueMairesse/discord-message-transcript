import { CDNOptions, safeUrlReturn } from "@/types/types.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base";
export declare function cdnResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions): Promise<string>;
