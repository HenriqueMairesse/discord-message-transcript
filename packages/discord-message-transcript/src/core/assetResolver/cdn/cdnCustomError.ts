import { CustomWarn } from "discord-message-transcript-base/internal";

export class CDNProviderError extends Error {
  provider: "CLOUDINARY" | "UPLOADCARE" | "CUSTOM";
  code: string;
  status?: number;
  hint?: string;
  errorMessage?: string

  constructor(opts: {
    provider: "CLOUDINARY" | "UPLOADCARE" | "CUSTOM";
    message: string;
    code: string;
    status?: number;
    hint?: string;
    errorMessage?: string
  }) {
    super(opts.message);
    this.provider = opts.provider;
    this.code = opts.code;
    this.status = opts.status;
    this.hint = opts.hint;
    this.errorMessage = opts.errorMessage
  }
}

export function warnCdnError(
  provider: string,
  url: string,
  err: any,
  disableWarnings: boolean
) {
  if (err instanceof CDNProviderError) {
    CustomWarn(
`[CDN:${err.provider}] Upload failed → fallback to original URL
URL: ${url}
Reason: ${err.message}
Code: ${err.code}${err.status ? ` (HTTP ${err.status})` : ""}${
err.hint ? `\nHint: ${err.hint}` : ""} ${
err.errorMessage ? `\nError Message: ${err.errorMessage}` : ""
        }`,
      disableWarnings
    );
    return;
  }

  CustomWarn(
`[CDN:${provider}] Unknown error → fallback to original URL
URL: ${url}
Error: ${err?.message ?? err}`,
    disableWarnings
  );
}