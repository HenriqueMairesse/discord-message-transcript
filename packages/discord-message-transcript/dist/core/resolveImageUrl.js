import { FALLBACK_PIXEL } from "discord-message-transcript-base";
import { isSafeForHTML } from "@/networkSecurity";
export async function resolveImageURL(url, options, canReturnNull, attachments) {
    if (!url)
        return null;
    // Resolve attachment:// references to actual attachment URL
    if (url.startsWith("attachment://")) {
        const name = url.slice("attachment://".length).trim();
        const found = attachments?.find(a => a.name === name);
        if (!found)
            return { safe: true, safeIps: [], url: FALLBACK_PIXEL };
        url = found.url;
    }
    const safeUrlReturn = await isSafeForHTML(url, options);
    if (safeUrlReturn.safe)
        return safeUrlReturn;
    if (canReturnNull)
        return null;
    return { safe: true, safeIps: [], url: FALLBACK_PIXEL };
}
