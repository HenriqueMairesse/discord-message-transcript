import { describe, it, expect, vi, beforeEach } from "vitest";
import { authorUrlResolver } from "../../../../src/core/assetResolver/url/authorUrlResolver";
import { imageUrlResolver } from "../../../../src/core/assetResolver/url/imageUrlResolver";
import { urlResolver } from "../../../../src/core/assetResolver/url/urlResolver";

vi.mock("../../../../src/core/assetResolver/url/imageUrlResolver", () => ({
  imageUrlResolver: vi.fn(),
}));

vi.mock("../../../../src/core/assetResolver/url/urlResolver", () => ({
  urlResolver: vi.fn(),
}));

describe("authorUrlResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves author avatars through imageUrlResolver and urlResolver", async () => {
    vi.mocked(imageUrlResolver)
      .mockResolvedValueOnce({ safe: true, safeIps: [], url: "https://safe/a1.png" })
      .mockResolvedValueOnce({ safe: true, safeIps: [], url: "https://safe/a2.png" });
    vi.mocked(urlResolver)
      .mockResolvedValueOnce("https://cdn/a1.png")
      .mockResolvedValueOnce("https://cdn/a2.png");

    const authors = new Map<string, any>([
      ["1", { id: "1", username: "u1", avatarURL: "https://origin/a1.png" }],
      ["2", { id: "2", username: "u2", avatarURL: "https://origin/a2.png" }],
    ]);

    const options = { disableWarnings: false, saveImages: false, fileName: "file" } as any;
    const cdnOptions = { provider: "CUSTOM", resolver: vi.fn(), customData: null } as any;
    const cache = new Map<string, Promise<string>>();

    const result = await authorUrlResolver(authors, options, cdnOptions, cache);

    expect(result).toEqual([
      { id: "1", username: "u1", avatarURL: "https://cdn/a1.png" },
      { id: "2", username: "u2", avatarURL: "https://cdn/a2.png" },
    ]);

    expect(imageUrlResolver).toHaveBeenNthCalledWith(1, "https://origin/a1.png", options, false);
    expect(imageUrlResolver).toHaveBeenNthCalledWith(2, "https://origin/a2.png", options, false);
    expect(urlResolver).toHaveBeenCalledTimes(2);
  });
});
