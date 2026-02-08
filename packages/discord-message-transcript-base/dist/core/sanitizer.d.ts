import { hexColor, JsonAttachment, TranscriptOptionsBase } from "../types/types.js";
export declare const FALLBACK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
export declare function sanitize(text: string): string;
export declare function isValidHexColor(colorInput: string, canReturnNull: false): hexColor;
export declare function isValidHexColor(colorInput: string | null, canReturnNull: true): hexColor | null;
export declare function resolveImageURL(url: string, options: TranscriptOptionsBase, canReturnNull: false, attachments?: JsonAttachment[]): Promise<string>;
export declare function resolveImageURL(url: string | null, options: TranscriptOptionsBase, canReturnNull: true, attachments?: JsonAttachment[]): Promise<string | null>;
export declare function isSafeForHTML(url: string, options: TranscriptOptionsBase): Promise<boolean>;
