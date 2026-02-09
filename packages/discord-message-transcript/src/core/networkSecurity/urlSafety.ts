import { CustomWarn, TranscriptOptionsBase } from "discord-message-transcript-base";
import { TRUSTED_DISCORD_HOSTS } from "./constants.js";
import { isPrivateIp } from "./ip.js";
import { LookupResult, safeUrlReturn } from "@/types";
import { resolveAllIps } from "./dns.js";

export async function isSafeForHTML(url: string, options: TranscriptOptionsBase): Promise<safeUrlReturn> {
  const { safeMode, disableWarnings } = options;
  if (!safeMode) return { safe: true, safeIps: [], url: url};

  let u: URL;

  try {
    u = new URL(url);
  } catch {
    CustomWarn(`Unsafe URL rejected: Invalid URL format\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  const host = u.hostname.toLowerCase();

  // If is from discord accept
  if (isTrustedDiscordHost(host)) return { safe: true, safeIps: [], url: url };

  // Don't accept if isn't https or http
  if (!["http:", "https:"].includes(u.protocol)) {
    CustomWarn(`Unsafe URL rejected: Invalid protocol "${u.protocol}"\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  if (u.username || u.password) {
    CustomWarn(`Unsafe URL rejected: Contains username or password\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  if (u.port && !["80", "443", ""].includes(u.port)) {
    CustomWarn(`Unsafe URL rejected: Invalid port "${u.port}"\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  // Block localhost and loopback addresses (SSRF protection)
  if (host === "localhost" ||
      host === "127.0.0.1" || 
      host.startsWith("0.")
  ) {
    CustomWarn(`Unsafe URL rejected: Blacklisted host "${host}"\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  let ips: LookupResult[];
  try {
    ips = await resolveAllIps(host);
  } catch (e: any) {
    CustomWarn(`Unsafe URL rejected: DNS lookup failed or timed out for host "${host}". Error: ${e.message}\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  const safeIps: string[] = []

  // Block private/internal network IPs (SSRF protection)
  for (const ip of ips) {
    if (isPrivateIp(ip.address)) {
      CustomWarn(`Unsafe URL rejected: Private IP address "${ip.address}" resolved for host "${host}"\nURL: ${url}`, disableWarnings);
      return { safe: false, safeIps: [], url: url };
    }
    safeIps.push(ip.address);
  }

  const path = u.pathname.toLowerCase();

  // External SVGs can execute scripts → allow only from Discord CDN
  if (path.endsWith(".svg")) {
    CustomWarn(`Unsafe URL rejected: External SVG not from Discord CDN\nURL: ${url}`, disableWarnings);
    return { safe: false, safeIps: [], url: url };
  }

  return { safe: true, safeIps: safeIps, url: url };
}

function isTrustedDiscordHost(host: string): boolean {
  host = host.toLowerCase();
  return TRUSTED_DISCORD_HOSTS.some(trusted => {
    return host === trusted || host.endsWith("." + trusted);
  });
}