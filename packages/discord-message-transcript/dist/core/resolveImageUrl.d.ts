import { JsonAttachment, TranscriptOptionsBase } from "discord-message-transcript-base";
import { safeUrlReturn } from "@/types";
export declare function resolveImageURL(url: string, options: TranscriptOptionsBase, canReturnNull: false, attachments?: JsonAttachment[]): Promise<safeUrlReturn>;
export declare function resolveImageURL(url: string | null, options: TranscriptOptionsBase, canReturnNull: true, attachments?: JsonAttachment[]): Promise<safeUrlReturn | null>;
