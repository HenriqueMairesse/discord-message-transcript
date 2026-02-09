import { TranscriptOptionsBase } from "discord-message-transcript-base";
import { safeUrlReturn } from "@/types";
export declare function isSafeForHTML(url: string, options: TranscriptOptionsBase): Promise<safeUrlReturn>;
