import { beforeEach, describe, expect, it, vi } from "vitest";
import { uploadCareCdnResolver } from "../../../../src/core/assetResolver/cdn/uploadCareCdnResolver";
import { warnCdnError } from "../../../../src/core/assetResolver/cdn/cdnCustomError";
import { sleep } from "../../../../src/utils/sleep";

vi.mock("../../../../src/core/assetResolver/cdn/cdnCustomError", async () => {
  const actual = await vi.importActual<any>("../../../../src/core/assetResolver/cdn/cdnCustomError");
  return {
    ...actual,
    warnCdnError: vi.fn(),
  };
});

vi.mock("../../../../src/utils/sleep", () => ({
  sleep: vi.fn(async () => {}),
}));

describe("uploadCareCdnResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn() as any;
  });

  it("returns CDN URL when upload endpoint returns uuid", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: "abc-123" }),
    } as any);

    const result = await uploadCareCdnResolver(
      "https://origin.test/a.png",
      "public-key",
      "mycdn.ucarecdn.com",
      false,
    );

    expect(result).toBe("https://mycdn.ucarecdn.com/abc-123/");
    expect(warnCdnError).not.toHaveBeenCalled();
  });

  it("polls token status and returns file_id when upload is async", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "tok-1" }),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "success", file_id: "file-xyz" }),
      } as any);

    const result = await uploadCareCdnResolver(
      "https://origin.test/a.png",
      "public-key",
      "mycdn.ucarecdn.com",
      false,
    );

    expect(result).toBe("https://mycdn.ucarecdn.com/file-xyz/");
    expect(sleep).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("falls back to original URL when config is missing", async () => {
    const result = await uploadCareCdnResolver(
      "https://origin.test/a.png",
      "",
      "mycdn.ucarecdn.com",
      false,
    );

    expect(result).toBe("https://origin.test/a.png");
    expect(warnCdnError).toHaveBeenCalledTimes(1);
  });

  it("falls back to original URL when upload endpoint fails", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 403,
      text: async () => "forbidden",
    } as any);

    const result = await uploadCareCdnResolver(
      "https://origin.test/a.png",
      "public-key",
      "mycdn.ucarecdn.com",
      false,
    );

    expect(result).toBe("https://origin.test/a.png");
    expect(warnCdnError).toHaveBeenCalledTimes(1);
  });
});
