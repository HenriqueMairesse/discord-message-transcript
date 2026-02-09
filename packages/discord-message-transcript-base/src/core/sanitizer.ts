import { hexColor, JsonAttachment, LookupResult, TranscriptOptionsBase } from "../types/types.js";
import net from "node:net";
import { CustomWarn } from "./customMessages.js";
import { Resolver } from "dns/promises";

export const FALLBACK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const DNS_SERVERS = ["1.1.1.1", "8.8.8.8"];
const DNS_LOOKUP_TIMEOUT = 5000;
const TRUSTED_DISCORD_HOSTS = ["discordapp.com", "discordapp.net"];

export function sanitize(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isValidHexColor(colorInput: string, canReturnNull: false): hexColor;
export function isValidHexColor(colorInput: string | null, canReturnNull: true): hexColor | null;
export function isValidHexColor(colorInput: string | null, canReturnNull: boolean): hexColor | null {
  if (!colorInput) return null;

  const hexColorRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}([A-Fa-f0-9]{2})?)$/;

  let color = colorInput.trim();

  if (/^[A-Fa-f0-9]+$/.test(color)) {
    color = "#" + color;
  }

  if (hexColorRegex.test(color)) {
    return color as hexColor;
  }

  if (canReturnNull) {
    return null;
  }

  return "#000000"; // Falback to a default hexColor if can't be null
}

export async function resolveImageURL(url: string, options: TranscriptOptionsBase, canReturnNull: false, attachments?: JsonAttachment[]): Promise<string>;
export async function resolveImageURL(url: string | null, options: TranscriptOptionsBase, canReturnNull: true, attachments?: JsonAttachment[]): Promise<string | null>;
export async function resolveImageURL(url: string | null, options: TranscriptOptionsBase, canReturnNull: boolean, attachments?: JsonAttachment[]): Promise<string | null> {
  if (!url) return null;

  // Resolve attachment:// references to actual attachment URL
  if (url.startsWith("attachment://")) {
    const name = url.slice("attachment://".length).trim();
    const found = attachments?.find(a => a.name === name);
    if (found && await isSafeForHTML(found.url, options)) return found.url;
    return FALLBACK_PIXEL;
  }
  if (await isSafeForHTML(url, options)) return url;

  if (canReturnNull) return null;
  return FALLBACK_PIXEL;
}

export async function isSafeForHTML(url: string, options: TranscriptOptionsBase): Promise<boolean> {
  const { safeMode, disableWarnings } = options;
  if (!safeMode) return true;

  let u: URL;

  try {
    u = new URL(url);
  } catch {
    CustomWarn(`Unsafe URL rejected: Invalid URL format\nURL: ${url}`, disableWarnings);
    return false;
  }

  const host = u.hostname.toLowerCase();

  // If is from discord accept
  if (isTrustedDiscordHost(host)) return true;

  // Don't accept if isn't https or http
  if (!["http:", "https:"].includes(u.protocol)) {
    CustomWarn(`Unsafe URL rejected: Invalid protocol "${u.protocol}"\nURL: ${url}`, disableWarnings);
    return false;
  }

  if (u.username || u.password) {
    CustomWarn(`Unsafe URL rejected: Contains username or password\nURL: ${url}`, disableWarnings);
    return false;
  }

  if (u.port && !["80", "443", ""].includes(u.port)) {
    CustomWarn(`Unsafe URL rejected: Invalid port "${u.port}"\nURL: ${url}`, disableWarnings);
    return false;
  }

  // Block localhost and loopback addresses (SSRF protection)
  if (host === "localhost" ||
      host === "127.0.0.1" || 
      host.startsWith("0.")
  ) {
    CustomWarn(`Unsafe URL rejected: Blacklisted host "${host}"\nURL: ${url}`, disableWarnings);
    return false;
  }

  let ips: LookupResult[];
  try {
    ips = await resolveAllIps(host);
  } catch (e: any) {
    CustomWarn(`Unsafe URL rejected: DNS lookup failed or timed out for host "${host}". Error: ${e.message}\nURL: ${url}`, disableWarnings);
    return false;
  }

  // Block private/internal network IPs (SSRF protection)
  for (const ip of ips) {
    if (isPrivateIp(ip.address)) {
      CustomWarn(`Unsafe URL rejected: Private IP address "${ip.address}" resolved for host "${host}"\nURL: ${url}`, disableWarnings);
      return false;
    }
  }

  const path = u.pathname.toLowerCase();

  // External SVGs can execute scripts → allow only from Discord CDN
  if (path.endsWith(".svg")) {
    CustomWarn(`Unsafe URL rejected: External SVG not from Discord CDN\nURL: ${url}`, disableWarnings);
    return false;
  }

  return true;
}

export async function resolveAllIps(host: string): Promise<LookupResult[]> {
  const resolver = new Resolver();
  resolver.setServers(DNS_SERVERS);

  const lookupPromise = (async () => {
    const results: LookupResult[] = [];

    const [v4, v6] = await Promise.allSettled([
      resolver.resolve4(host),
      resolver.resolve6(host)
    ]);

    if (v4.status === "fulfilled") {
      for (const ip of v4.value) {
        results.push({ address: ip, family: 4 });
      }
    }

    if (v6.status === "fulfilled") {
      for (const ip of v6.value) {
        results.push({ address: ip, family: 6 });
      }
    }

    if (results.length === 0) {
      throw new Error(`No DNS records found for ${host}`);
    }

    return results;
  })();

  const timeoutPromise = new Promise<LookupResult[]>((_, reject) =>
    setTimeout(() => reject(new Error(`DNS timeout for ${host}`)), DNS_LOOKUP_TIMEOUT)
  );

  return Promise.race([lookupPromise, timeoutPromise]);
}

function isPrivateIp(ip: string): boolean {
  if (!net.isIP(ip)) return true;

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:192.168.1.1)
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  // Detects private IPv6 ranges
  if (ip.includes(":")) {
    const lowercasedIp = ip.toLowerCase();

    if (lowercasedIp === "::1") return true;

    // Unique Local (fc00::/7)
    if (lowercasedIp.startsWith('fc') || lowercasedIp.startsWith('fd')) return true;

    // Link-Local (fe80::/10)
    if (
      lowercasedIp.startsWith('fe8') ||
      lowercasedIp.startsWith('fe9') ||
      lowercasedIp.startsWith('fea') ||
      lowercasedIp.startsWith('feb')
    ) {
      return true;
    }

    return false;
  }

  const parts = ip.split(".").map(Number);

  // Detects private IPv4 ranges
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
  );
}

function isTrustedDiscordHost(host: string): boolean {
  host = host.toLowerCase();
  return TRUSTED_DISCORD_HOSTS.some(trusted => {
    return host === trusted || host.endsWith("." + trusted);
  });
}