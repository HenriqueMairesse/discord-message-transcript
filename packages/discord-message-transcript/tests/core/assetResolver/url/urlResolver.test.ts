import { describe, it, expect, vi, beforeEach } from "vitest";
import { urlResolver } from "../../../../src/core/assetResolver/url/urlResolver";
import { FALLBACK_PIXEL } from "discord-message-transcript-base/internal";
import { cdnResolver } from "../../../../src/core/assetResolver/cdn/cdnResolver";
import { imageToBase64 } from "../../../../src/core/assetResolver/base64/imageToBase64";

vi.mock("../../../../src/core/assetResolver/cdn/cdnResolver", () => ({
  cdnResolver: vi.fn(),
}));

vi.mock("../../../../src/core/assetResolver/base64/imageToBase64", () => ({
  imageToBase64: vi.fn(),
}));

describe("urlResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an empty string when safeUrlObject is unsafe", async () => {
    const result = await urlResolver(
      { safe: false, safeIps: [], url: "https://unsafe.test/file.png" },
      { saveImages: true, disableWarnings: false, fileName: "x" } as any,
      null,
      new Map(),
    );

    expect(result).toBe("");
    expect(cdnResolver).not.toHaveBeenCalled();
    expect(imageToBase64).not.toHaveBeenCalled();
  });

  it("returns fallback pixel without processing", async () => {
    const result = await urlResolver(
      { safe: true, safeIps: [], url: FALLBACK_PIXEL },
      { saveImages: true, disableWarnings: false, fileName: "x" } as any,
      null,
      new Map(),
    );

    expect(result).toBe(FALLBACK_PIXEL);
    expect(cdnResolver).not.toHaveBeenCalled();
    expect(imageToBase64).not.toHaveBeenCalled();
  });

  it("reuses cached resolved URL", async () => {
    const cache = new Map<string, Promise<string>>();
    cache.set("https://cached.test/a.png", Promise.resolve("https://cdn.test/a.png"));

    const result = await urlResolver(
      { safe: true, safeIps: [], url: "https://cached.test/a.png" },
      { saveImages: true, disableWarnings: false, fileName: "x" } as any,
      { provider: "CUSTOM", resolver: vi.fn(), customData: null } as any,
      cache,
    );

    expect(result).toBe("https://cdn.test/a.png");
    expect(cdnResolver).not.toHaveBeenCalled();
    expect(imageToBase64).not.toHaveBeenCalled();
  });

  it("uses CDN resolver when cdnOptions is provided and caches the promise", async () => {
    vi.mocked(cdnResolver).mockResolvedValue("https://cdn.test/image.png");
    const cache = new Map<string, Promise<string>>();
    const safeUrl = { safe: true, safeIps: [], url: "https://origin.test/image.png" };

    const first = await urlResolver(
      safeUrl,
      { saveImages: true, disableWarnings: false, fileName: "sample.txt" } as any,
      { provider: "CUSTOM", resolver: vi.fn(), customData: null } as any,
      cache,
    );
    const second = await urlResolver(
      safeUrl,
      { saveImages: true, disableWarnings: false, fileName: "sample.txt" } as any,
      { provider: "CUSTOM", resolver: vi.fn(), customData: null } as any,
      cache,
    );

    expect(first).toBe("https://cdn.test/image.png");
    expect(second).toBe("https://cdn.test/image.png");
    expect(cdnResolver).toHaveBeenCalledTimes(1);
    expect(cache.has("https://origin.test/image.png")).toBe(true);
  });

  it("uses base64 conversion when saveImages is enabled and there is no CDN", async () => {
    vi.mocked(imageToBase64).mockResolvedValue("data:image/png;base64,AAA=");
    const cache = new Map<string, Promise<string>>();

    const result = await urlResolver(
      { safe: true, safeIps: ["1.1.1.1"], url: "https://origin.test/base64.png" },
      { saveImages: true, disableWarnings: false, fileName: "x" } as any,
      null,
      cache,
    );

    expect(result).toBe("data:image/png;base64,AAA=");
    expect(imageToBase64).toHaveBeenCalledTimes(1);
    expect(cdnResolver).not.toHaveBeenCalled();
    expect(cache.has("https://origin.test/base64.png")).toBe(true);
  });

  it("returns original URL when no resolver is applicable", async () => {
    const url = "https://origin.test/raw.bin";
    const result = await urlResolver(
      { safe: true, safeIps: [], url },
      { saveImages: false, disableWarnings: false, fileName: "x" } as any,
      null,
      new Map(),
    );

    expect(result).toBe(url);
    expect(imageToBase64).not.toHaveBeenCalled();
    expect(cdnResolver).not.toHaveBeenCalled();
  });
});
