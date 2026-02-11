import { TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { safeUrlReturn } from "../../../types/private/network.js";
import { CDNOptions } from "../../../types/private/cdn.js";
export declare function cdnResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions): Promise<string>;
