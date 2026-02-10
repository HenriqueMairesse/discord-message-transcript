import { CDNOptions, safeUrlReturn } from "@/types/types.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base";
export declare function urlResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string>;
