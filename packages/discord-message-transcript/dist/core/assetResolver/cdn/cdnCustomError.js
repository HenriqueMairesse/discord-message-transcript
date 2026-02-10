import { CustomWarn } from "discord-message-transcript-base";
export class CDNProviderError extends Error {
    provider;
    code;
    status;
    hint;
    errorMessage;
    constructor(opts) {
        super(opts.message);
        this.provider = opts.provider;
        this.code = opts.code;
        this.status = opts.status;
        this.hint = opts.hint;
        this.errorMessage = opts.errorMessage;
    }
}
export function warnCdnError(provider, url, err, disableWarnings) {
    if (err instanceof CDNProviderError) {
        CustomWarn(`[CDN:${err.provider}] Upload failed → fallback to original URL
URL: ${url}
Reason: ${err.message}
Code: ${err.code}${err.status ? ` (HTTP ${err.status})` : ""}${err.hint ? `\nHint: ${err.hint}` : ""}`, disableWarnings);
        return;
    }
    CustomWarn(`[CDN:${provider}] Unknown error → fallback to original URL
URL: ${url}
Error: ${err?.message ?? err}`, disableWarnings);
}
