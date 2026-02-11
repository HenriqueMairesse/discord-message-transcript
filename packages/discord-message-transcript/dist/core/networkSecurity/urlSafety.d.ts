import { TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { safeUrlReturn } from "../../types/private/network.js";
export declare function isSafeForHTML(url: string, options: TranscriptOptionsBase): Promise<safeUrlReturn>;
