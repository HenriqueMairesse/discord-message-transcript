import { CustomWarn } from "discord-message-transcript-base/internal";

export function validateCdnUrl(url: string, disableWarnings: boolean): boolean {
  if (url.includes('"') || url.includes('<') || url.includes('>')) {
    CustomWarn(`Unsafe URL received from CDN, using fallback.\nURL: ${url}`, disableWarnings);
    return false;
  }
  return true;
}