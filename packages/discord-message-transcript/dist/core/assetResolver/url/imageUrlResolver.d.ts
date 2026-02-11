import { JsonAttachment, TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { safeUrlReturn } from "../../../types/private/network.js";
export declare function imageUrlResolver(url: string, options: TranscriptOptionsBase, canReturnNull: false, attachments?: JsonAttachment[]): Promise<safeUrlReturn>;
export declare function imageUrlResolver(url: string | null, options: TranscriptOptionsBase, canReturnNull: true, attachments?: JsonAttachment[]): Promise<safeUrlReturn | null>;
