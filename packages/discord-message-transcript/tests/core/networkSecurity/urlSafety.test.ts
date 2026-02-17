import { describe, it, expect, vi, beforeEach } from "vitest";
import type { LookupResult } from "../../../src/types/private/network";

const { resolveAllIpsMock } = vi.hoisted(() => ({
  resolveAllIpsMock: vi.fn(async (_host: string): Promise<LookupResult[]> => []),
}));

vi.mock("../../../src/core/networkSecurity/dns", () => {
  return {
    resolveAllIps: resolveAllIpsMock,
  };
});

import { ReturnFormat } from "discord-message-transcript-base/internal";
import { ReturnType } from "../../../../discord-message-transcript-base/dist/types/public/return";

const loadIsSafeForHTML = async () => {
  const mod = await import("../../../src/core/networkSecurity/urlSafety");
  return mod.isSafeForHTML;
};

function createTestOptions(overrides: Partial<any> = {}) {
  return {
    fileName: "test",
    disableWarnings: false,
    includeAttachments: true,
    includeButtons: true,
    includeComponents: true,
    includeEmpty: false,
    includeEmbeds: true,
    includePolls: true,
    includeReactions: true,
    includeV2Components: true,
    localDate: "en-GB",
    quantity: 0,
    returnFormat: ReturnFormat.HTML,
    returnType: ReturnType.Buffer,
    safeMode: true,
    saveImages: false,
    selfContained: false,
    timeZone: "UTC",
    watermark: true,
    ...overrides,
  };
}

describe("urlSafety.ts - isSafeForHTML", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    resolveAllIpsMock.mockResolvedValue([]);
  });

  it("accepts valid discord https urls", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "https://cdn.discordapp.com/image.png";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(true);
    expect(result.url).toBe(url);
  });

  it("blocks invalid urls", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "notaurl";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("blocks non-http protocols", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "ftp://example.com";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("blocks urls with username or password", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "https://user:pass@example.com";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("blocks non-standard ports", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "https://example.com:1234/path";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("blocks localhost and loopback", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const urls = ["http://localhost", "http://127.0.0.1", "http://0.1.2.3"];
    for (const url of urls) {
      const result = await isSafeForHTML(url, createTestOptions());
      expect(result.safe).toBe(false);
    }
  });

  it("blocks non-discord external svgs", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "https://example.com/image.svg";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("returns safe ips for public hosts", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    resolveAllIpsMock.mockResolvedValue([
      { address: "8.8.8.8", family: 4 },
      { address: "8.8.4.4", family: 4 },
    ]);

    const url = "https://example.com/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(true);
    expect(result.safeIps).toContain("8.8.8.8");
    expect(result.safeIps).toContain("8.8.4.4");
    expect(resolveAllIpsMock).toHaveBeenCalledWith("example.com");
  });

  it("returns false when dns resolves private ip", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    resolveAllIpsMock.mockResolvedValue([
      { address: "127.0.0.1", family: 4 },
      { address: "10.0.0.1", family: 4 },
    ]);

    const url = "https://example.com/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(false);
    expect(resolveAllIpsMock).toHaveBeenCalledWith("example.com");
  });

  it("returns false when dns fails", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    resolveAllIpsMock.mockRejectedValue(new Error("DNS fail"));

    const url = "https://example.com/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(false);
    expect(resolveAllIpsMock).toHaveBeenCalledWith("example.com");
  });

  it("uses cache and avoids repeated dns lookups", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const spy = resolveAllIpsMock.mockResolvedValue([{ address: "8.8.4.4", family: 4 }]);

    const url = "https://example.com/path";
    const opts = createTestOptions();

    const result1 = await isSafeForHTML(url, opts);
    const result2 = await isSafeForHTML(url, opts);

    expect(result1.safe).toBe(true);
    expect(result2.safe).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("accepts trusted discord subdomains", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    const url = "https://media.discordapp.com/path";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(true);
  });

  it("blocks private hosts even when hostname is not localhost", async () => {
    const isSafeForHTML = await loadIsSafeForHTML();
    resolveAllIpsMock.mockResolvedValue([{ address: "192.168.1.1", family: 4 }]);

    const url = "https://my.private.host/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(false);
    expect(resolveAllIpsMock).toHaveBeenCalledWith("my.private.host");
  });
});
