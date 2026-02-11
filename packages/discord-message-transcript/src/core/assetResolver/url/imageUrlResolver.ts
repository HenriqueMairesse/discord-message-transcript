import { FALLBACK_PIXEL, JsonAttachment, TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { isSafeForHTML } from "@/networkSecurity";
import { safeUrlReturn } from "@/types/private/network.js";

export async function imageUrlResolver(url: string, options: TranscriptOptionsBase, canReturnNull: false, attachments?: JsonAttachment[]): Promise<safeUrlReturn>;
export async function imageUrlResolver(url: string | null, options: TranscriptOptionsBase, canReturnNull: true, attachments?: JsonAttachment[]): Promise<safeUrlReturn | null>;
export async function imageUrlResolver(url: string | null, options: TranscriptOptionsBase, canReturnNull: boolean, attachments?: JsonAttachment[]): Promise<safeUrlReturn | null> {
  if (!url) return null;

  // Resolve attachment:// references to actual attachment URL
  if (url.startsWith("attachment://")) {
    const name = url.slice("attachment://".length).trim();
    const found = attachments?.find(a => a.name === name);
    if (!found) return { safe: true, safeIps: [], url: FALLBACK_PIXEL};
    url = found.url
  }

  const safeUrlReturn = await isSafeForHTML(url, options);

  if (safeUrlReturn.safe) return safeUrlReturn;

  if (canReturnNull) return null;
  return { safe: true, safeIps: [], url: FALLBACK_PIXEL};
}