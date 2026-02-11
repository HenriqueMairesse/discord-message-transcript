import { TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { safeUrlReturn } from "../../../types/private/network.js";
import { CDNOptions } from "../../../types/private/cdn.js";
export declare function urlResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string>;
