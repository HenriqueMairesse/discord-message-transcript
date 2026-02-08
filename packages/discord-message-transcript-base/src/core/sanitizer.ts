import { hexColor, JsonAttachment, LookupResult, TranscriptOptionsBase } from "../types/types.js";
import dns from "node:dns/promises";
import net from "node:net";
import { CustomWarn } from "./customMessages.js";

export const FALLBACK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const DNS_LOOKUP_TIMEOUT = 5000;

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

  const host = u.hostname.toLowerCase();

  // Block localhost and loopback addresses (SSRF protection)
  if (host === "localhost" ||
      host === "127.0.0.1" || 
      host.startsWith("0.")
  ) {
    CustomWarn(`Unsafe URL rejected: Blacklisted host "${host}"\nURL: ${url}`, disableWarnings);
    return false;
  }

  async function lookupWithTimeout(host: string): Promise<LookupResult[]> {
    return await Promise.race([
      dns.lookup(host, { all: true }),
      new Promise<LookupResult[]>((_, reject) =>
        setTimeout(() => {
          CustomWarn(`DNS lookup timeout for ${host}`, disableWarnings);
          reject(new Error())
        }, DNS_LOOKUP_TIMEOUT)
      )
    ]);
  }

  let ips: LookupResult[];
  try {
    ips = await lookupWithTimeout(host);
  } catch {
    CustomWarn(`Unsafe URL rejected: DNS lookup failed or timed out for host "${host}"\nURL: ${url}`, disableWarnings);
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
    if (!(host.endsWith("discordapp.com") || host.endsWith("discordapp.net"))) {
      CustomWarn(`Unsafe URL rejected: External SVG not from Discord CDN\nURL: ${url}`, disableWarnings);
      return false;
    }
  }

  return true;
}

function isPrivateIp(ip: string): boolean {
  if (!net.isIP(ip)) return true;

  // Detects private IPv6 ranges
  if (ip.includes(":")) {
    return (
      ip === "::1" ||
      ip.startsWith("fc") ||
      ip.startsWith("fd") ||
      ip.startsWith("fe80")
    );
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