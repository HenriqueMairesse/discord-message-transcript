import { beforeEach, describe, expect, it, vi } from "vitest";
import { cloudinaryCdnResolver } from "../../../../src/core/assetResolver/cdn/cloudinaryCdnResolver";
import { warnCdnError } from "../../../../src/core/assetResolver/cdn/cdnCustomError";
import crypto from "crypto";

vi.mock("../../../../src/core/assetResolver/cdn/cdnCustomError", async () => {
  const actual = await vi.importActual<any>("../../../../src/core/assetResolver/cdn/cdnCustomError");
  return {
    ...actual,
    warnCdnError: vi.fn(),
  };
});

vi.mock("../../../../src/core/assetResolver/cdn/sanitizeFileName", () => ({
  sanitizeFileName: vi.fn(() => "safe-file"),
}));

vi.mock("crypto", () => ({
  default: {
    createHash: vi.fn(() => ({
      update: vi.fn(() => ({
        digest: vi.fn(() => "signed-hash"),
      })),
    })),
  },
}));

describe("cloudinaryCdnResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn() as any;
  });

  it("returns uploaded secure_url when Cloudinary responds successfully", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ secure_url: "https://res.cloudinary.com/demo/image/upload/v1/img.png" }),
    } as any);

    const result = await cloudinaryCdnResolver(
      "https://origin.test/image.png",
      "image.png",
      "demo",
      "key",
      "secret",
      false,
    );

    expect(result).toBe("https://res.cloudinary.com/demo/image/upload/v1/img.png");
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(crypto.createHash).toHaveBeenCalledWith("sha256");
    expect(warnCdnError).not.toHaveBeenCalled();
  });

  it("falls back to original URL when config is missing", async () => {
    const result = await cloudinaryCdnResolver(
      "https://origin.test/image.png",
      "image.png",
      "",
      "key",
      "secret",
      false,
    );

    expect(result).toBe("https://origin.test/image.png");
    expect(warnCdnError).toHaveBeenCalledTimes(1);
  });

  it("falls back to original URL when API returns 401", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: "invalid credentials" } }),
    } as any);

    const result = await cloudinaryCdnResolver(
      "https://origin.test/image.png",
      "image.png",
      "demo",
      "key",
      "secret",
      false,
    );

    expect(result).toBe("https://origin.test/image.png");
    expect(warnCdnError).toHaveBeenCalledTimes(1);
  });

  it("falls back to original URL when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("network down"));

    const result = await cloudinaryCdnResolver(
      "https://origin.test/image.png",
      "image.png",
      "demo",
      "key",
      "secret",
      false,
    );

    expect(result).toBe("https://origin.test/image.png");
    expect(warnCdnError).toHaveBeenCalledTimes(1);
  });
});
