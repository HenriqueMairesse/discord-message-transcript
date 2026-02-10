import { CustomWarn } from "discord-message-transcript-base";
export function validateCdnUrl(url, disableWarnings) {
    if (url.includes('"') || url.includes('<') || url.includes('>')) {
        CustomWarn(`Unsafe URL received from CDN, using fallback.\nURL: ${url}`, disableWarnings);
        return false;
    }
    return true;
}
