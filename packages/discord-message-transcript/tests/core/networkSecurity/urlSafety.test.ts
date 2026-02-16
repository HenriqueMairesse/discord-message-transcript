import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../src/core/networkSecurity/dns", () => {
  return {
    resolveAllIps: vi.fn(() => Promise.resolve([])),
  };
});

import { isSafeForHTML, clearUrlSafetyCache } from "../../../src/core/networkSecurity/urlSafety";
import * as dnsModule from "../../../src/core/networkSecurity/dns";
import { ReturnFormat } from "discord-message-transcript-base/internal";
import { ReturnType } from "../../../../discord-message-transcript-base/dist/types/public/return";

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
    localDate: 'en-GB',
    quantity: 0,
    returnFormat: ReturnFormat.HTML,
    returnType: ReturnType.Buffer,
    safeMode: true,
    saveImages: false,
    selfContained: false,
    timeZone: 'UTC',
    watermark: true,
    ...overrides,
  };
}

describe("urlSafety.ts - isSafeForHTML", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearUrlSafetyCache();
  });

  it("aceita URLs válidas https do Discord", async () => {
    const url = "https://cdn.discordapp.com/image.png";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(true);
    expect(result.url).toBe(url);
  });

  it("bloqueia URLs inválidas", async () => {
    const url = "notaurl";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("bloqueia protocolos não http/https", async () => {
    const url = "ftp://example.com";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("bloqueia URLs com username ou password", async () => {
    const url = "https://user:pass@example.com";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("bloqueia portas não padrão", async () => {
    const url = "https://example.com:1234/path";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("bloqueia localhost e loopback", async () => {
    const urls = ["http://localhost", "http://127.0.0.1", "http://0.1.2.3"];
    for (const url of urls) {
      const result = await isSafeForHTML(url, createTestOptions());
      expect(result.safe).toBe(false);
    }
  });

  it("bloqueia SVGs externos que não são do Discord CDN", async () => {
    const url = "https://example.com/image.svg";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(false);
  });

  it("retorna safeIps corretos para hosts públicos", async () => {
    // Mock DNS público
    vi.mocked(dnsModule.resolveAllIps).mockResolvedValue([
      { address: "8.8.8.8", family: 4 },
      { address: "8.8.4.4", family: 4 },
    ]);

    const url = "https://example.com/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(true);
    expect(result.safeIps).toContain("8.8.8.8");
    expect(result.safeIps).toContain("8.8.4.4");
    expect(dnsModule.resolveAllIps).toHaveBeenCalledWith("example.com");
  });

  it("retorna falso se DNS resolve IP privado", async () => {
    vi.mocked(dnsModule.resolveAllIps).mockResolvedValue([
      { address: "127.0.0.1", family: 4 },
      { address: "10.0.0.1", family: 4 },
    ]);

    const url = "https://example.com/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(false);
    expect(dnsModule.resolveAllIps).toHaveBeenCalledWith("example.com");
  });

  it("retorna falso se DNS falha", async () => {
    vi.mocked(dnsModule.resolveAllIps).mockRejectedValue(new Error("DNS fail"));

    const url = "https://example.com/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(false);
    expect(dnsModule.resolveAllIps).toHaveBeenCalledWith("example.com");
  });

  it("cache funciona e não refaz DNS se dentro do tempo", async () => {
    const spy = vi.mocked(dnsModule.resolveAllIps).mockResolvedValue([
      { address: "8.8.4.4", family: 4 },
    ]);

    const url = "https://example.com/path";
    const opts = createTestOptions();

    const result1 = await isSafeForHTML(url, opts);
    const result2 = await isSafeForHTML(url, opts);

    expect(result1.safe).toBe(true);
    expect(result2.safe).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("aceita subdomínios de hosts Discord confiáveis", async () => {
    const url = "https://media.discordapp.com/path";
    const result = await isSafeForHTML(url, createTestOptions());
    expect(result.safe).toBe(true);
  });

  it("bloqueia hosts privados mesmo se o hostname não é 'localhost'", async () => {
    vi.mocked(dnsModule.resolveAllIps).mockResolvedValue([
      { address: "192.168.1.1", family: 4 },
    ]);

    const url = "https://my.private.host/path";
    const result = await isSafeForHTML(url, createTestOptions());

    expect(result.safe).toBe(false);
    expect(dnsModule.resolveAllIps).toHaveBeenCalledWith("my.private.host");
  });
});
