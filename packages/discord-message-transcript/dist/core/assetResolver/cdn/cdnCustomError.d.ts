export declare class CDNProviderError extends Error {
    provider: "CLOUDINARY" | "UPLOADCARE" | "CUSTOM";
    code: string;
    status?: number;
    hint?: string;
    errorMessage?: string;
    constructor(opts: {
        provider: "CLOUDINARY" | "UPLOADCARE" | "CUSTOM";
        message: string;
        code: string;
        status?: number;
        hint?: string;
        errorMessage?: string;
    });
}
export declare function warnCdnError(provider: string, url: string, err: any, disableWarnings: boolean): void;
