import { describe, it, expect, vi, beforeEach } from "vitest";
import { imageUrlResolver } from "../../../../src/core/assetResolver/url/imageUrlResolver";
import { isSafeForHTML } from "../../../../src/core/networkSecurity";
import { FALLBACK_PIXEL } from "discord-message-transcript-base/internal";

vi.mock("../../../../src/core/networkSecurity", () => ({
  isSafeForHTML: vi.fn(),
}));

describe("imageUrlResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when URL is null and canReturnNull is true", async () => {
    const result = await imageUrlResolver(null, {} as any, true);
    expect(result).toBeNull();
    expect(isSafeForHTML).not.toHaveBeenCalled();
  });

  it("resolves attachment:// URLs using attachments list", async () => {
    vi.mocked(isSafeForHTML).mockResolvedValue({
      safe: true,
      safeIps: [],
      url: "https://discord.test/files/avatar.png",
    });

    const result = await imageUrlResolver(
      "attachment://avatar.png",
      {} as any,
      false,
      [{ name: "avatar.png", url: "https://discord.test/files/avatar.png" } as any],
    );

    expect(isSafeForHTML).toHaveBeenCalledWith("https://discord.test/files/avatar.png", expect.anything());
    expect(result).toEqual({
      safe: true,
      safeIps: [],
      url: "https://discord.test/files/avatar.png",
    });
  });

  it("returns fallback pixel when attachment:// reference is not found", async () => {
    const result = await imageUrlResolver(
      "attachment://missing.png",
      {} as any,
      false,
      [{ name: "other.png", url: "https://discord.test/files/other.png" } as any],
    );

    expect(result).toEqual({
      safe: true,
      safeIps: [],
      url: FALLBACK_PIXEL,
    });
    expect(isSafeForHTML).not.toHaveBeenCalled();
  });

  it("returns null for unsafe URL when canReturnNull is true", async () => {
    vi.mocked(isSafeForHTML).mockResolvedValue({
      safe: false,
      safeIps: [],
      url: "https://bad.test/a.png",
    });

    const result = await imageUrlResolver("https://bad.test/a.png", {} as any, true);

    expect(result).toBeNull();
  });

  it("returns fallback pixel for unsafe URL when canReturnNull is false", async () => {
    vi.mocked(isSafeForHTML).mockResolvedValue({
      safe: false,
      safeIps: [],
      url: "https://bad.test/a.png",
    });

    const result = await imageUrlResolver("https://bad.test/a.png", {} as any, false);

    expect(result).toEqual({
      safe: true,
      safeIps: [],
      url: FALLBACK_PIXEL,
    });
  });

  it("returns isSafeForHTML result when URL is safe", async () => {
    vi.mocked(isSafeForHTML).mockResolvedValue({
      safe: true,
      safeIps: ["8.8.8.8"],
      url: "https://good.test/a.png",
    });

    const result = await imageUrlResolver("https://good.test/a.png", {} as any, false);

    expect(result).toEqual({
      safe: true,
      safeIps: ["8.8.8.8"],
      url: "https://good.test/a.png",
    });
  });
});
