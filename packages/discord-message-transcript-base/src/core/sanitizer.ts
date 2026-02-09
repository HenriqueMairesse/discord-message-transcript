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

export function isPrivateIp(ip: string): boolean {
  const family = net.isIP(ip);
  if (!family) return true;

  if (family === 4) return isPrivateIPv4(ip);
  return isPrivateIPv6(ip);
}

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(n => isNaN(n))) return true;

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

function parseIPv6(ip: string): number[] | null {
  if (net.isIP(ip) !== 6) return null;

  // handle IPv4 at end
  if (ip.includes(".")) {
    const lastColon = ip.lastIndexOf(":");
    const ipv4Part = ip.slice(lastColon + 1);
    const nums = ipv4Part.split(".").map(Number);

    if (nums.length === 4 && nums.every(n => !isNaN(n))) {
      const hex =
        ((nums[0] << 8) | nums[1]).toString(16) +
        ":" +
        ((nums[2] << 8) | nums[3]).toString(16);

      ip = ip.slice(0, lastColon) + ":" + hex;
    }
  }

  const sections = ip.split("::");

  let head = sections[0] ? sections[0].split(":") : [];
  let tail = sections[1] ? sections[1].split(":") : [];

  if (sections.length === 2) {
    const missing = 8 - (head.length + tail.length);
    head = [...head, ...Array(missing).fill("0"), ...tail];
  }

  if (head.length !== 8) return null;

  const bytes: number[] = [];

  for (const part of head) {
    const n = parseInt(part || "0", 16);
    if (isNaN(n)) return null;
    bytes.push((n >> 8) & 0xff);
    bytes.push(n & 0xff);
  }

  return bytes;
}

function extractEmbeddedIPv4(bytes: number[]): string | null {
  const isMapped =
    bytes.slice(0, 10).every(b => b === 0) &&
    bytes[10] === 0xff &&
    bytes[11] === 0xff;

  if (isMapped) {
    return `${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`;
  }

  const isCompat = bytes.slice(0, 12).every(b => b === 0);
  if (isCompat) {
    return `${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`;
  }

  const isNat64 =
    bytes[0] === 0x00 &&
    bytes[1] === 0x64 &&
    bytes[2] === 0xff &&
    bytes[3] === 0x9b &&
    bytes.slice(4, 12).every(b => b === 0);

  if (isNat64) {
    return `${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`;
  }

  return null;
}

function isPrivateIPv6(ip: string): boolean {
  const bytes = parseIPv6(ip);
  if (!bytes) return true;

  const embedded = extractEmbeddedIPv4(bytes);
  if (embedded) return isPrivateIPv4(embedded);

  // ::
  if (bytes.every(b => b === 0)) return true;

  // ::1
  if (bytes.slice(0, 15).every(b => b === 0) && bytes[15] === 1) return true;

  const first = bytes[0];
  const second = bytes[1];

  // fc00::/7
  if ((first & 0xfe) === 0xfc) return true;

  // fe80::/10
  if (first === 0xfe && (second & 0xc0) === 0x80) return true;

  // multicast
  if (first === 0xff) return true;

  // 2001:db8::/32
  if (
    bytes[0] === 0x20 &&
    bytes[1] === 0x01 &&
    bytes[2] === 0x0d &&
    bytes[3] === 0xb8
  ) return true;

  return false;
}

function isTrustedDiscordHost(host: string): boolean {
  host = host.toLowerCase();
  return TRUSTED_DISCORD_HOSTS.some(trusted => {
    return host === trusted || host.endsWith("." + trusted);
  });
}
