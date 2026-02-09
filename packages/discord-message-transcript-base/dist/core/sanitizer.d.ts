import { hexColor } from "@/types";
export declare const FALLBACK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
export declare function sanitize(text: string): string;
export declare function isValidHexColor(colorInput: string, canReturnNull: false): hexColor;
export declare function isValidHexColor(colorInput: string | null, canReturnNull: true): hexColor | null;
