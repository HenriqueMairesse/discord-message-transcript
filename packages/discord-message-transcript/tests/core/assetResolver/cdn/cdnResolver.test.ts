import { EventEmitter } from "events";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cdnResolver } from "../../../../src/core/assetResolver/cdn/cdnResolver";
import { createLookup } from "../../../../src/core/networkSecurity";
import { getCDNLimiter } from "../../../../src/core/assetResolver/limiter";
import { cloudinaryCdnResolver } from "../../../../src/core/assetResolver/cdn/cloudinaryCdnResolver";
import { uploadCareCdnResolver } from "../../../../src/core/assetResolver/cdn/uploadCareCdnResolver";
import { validateCdnUrl } from "../../../../src/core/assetResolver/cdn/validateCdnUrl";
import { CustomWarn } from "discord-message-transcript-base/internal";
import https from "https";

vi.mock("https", () => ({
  default: { get: vi.fn() },
}));

vi.mock("../../../../src/core/networkSecurity", () => ({
  createLookup: vi.fn(() => vi.fn()),
}));

vi.mock("../../../../src/core/assetResolver/limiter", () => ({
  getCDNLimiter: vi.fn(() => (fn: () => Promise<any>) => fn()),
}));

vi.mock("../../../../src/core/assetResolver/cdn/cloudinaryCdnResolver", () => ({
  cloudinaryCdnResolver: vi.fn(),
}));

vi.mock("../../../../src/core/assetResolver/cdn/uploadCareCdnResolver", () => ({
  uploadCareCdnResolver: vi.fn(),
}));

vi.mock("../../../../src/core/assetResolver/cdn/validateCdnUrl", () => ({
  validateCdnUrl: vi.fn(() => true),
}));

vi.mock("discord-message-transcript-base/internal", async () => {
  const actual = await vi.importActual<any>("discord-message-transcript-base/internal");
  return {
    ...actual,
    CustomWarn: vi.fn(),
  };
});

function createRequestMock() {
  const request = new EventEmitter() as any;
  request.destroy = vi.fn();
  request.end = vi.fn();
  request.setTimeout = vi.fn((_ms: number, cb: () => void) => {
    request.__timeout = cb;
    return request;
  });
  return request;
}

function createResponseMock(statusCode: number, contentType?: string) {
  const response = new EventEmitter() as any;
  response.statusCode = statusCode;
  response.headers = { "content-type": contentType };
  response.destroy = vi.fn();
  return response;
}

describe("cdnResolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("falls back to original URL on non-200 response", async () => {
    const request = createRequestMock();
    const response = createResponseMock(500, "image/png");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const url = "https://origin.test/file.png";
    const result = await cdnResolver(
      { safe: true, safeIps: ["1.1.1.1"], url },
      { disableWarnings: false, fileName: "file.txt" } as any,
      { provider: "CUSTOM", resolver: vi.fn(), customData: null } as any,
    );

    expect(result).toBe(url);
    expect(CustomWarn).toHaveBeenCalledTimes(1);
    expect(createLookup).toHaveBeenCalledWith(["1.1.1.1"]);
    expect(getCDNLimiter).toHaveBeenCalledTimes(1);
  });

  it("uses custom provider and returns validated CDN URL", async () => {
    const request = createRequestMock();
    const response = createResponseMock(200, "image/png");
    const customResolver = vi.fn(async () => "https://cdn.test/custom.png");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const result = await cdnResolver(
      { safe: true, safeIps: [], url: "https://origin.test/file.png" },
      { disableWarnings: false, fileName: "file.txt" } as any,
      {
        provider: "CUSTOM",
        resolver: customResolver,
        customData: { bucket: "x" },
        includeImage: true,
      } as any,
    );

    expect(result).toBe("https://cdn.test/custom.png");
    expect(customResolver).toHaveBeenCalledWith("https://origin.test/file.png", "image/png", { bucket: "x" });
    expect(validateCdnUrl).toHaveBeenCalledWith("https://cdn.test/custom.png", false);
  });

  it("falls back to original URL if custom resolver throws", async () => {
    const request = createRequestMock();
    const response = createResponseMock(200, "image/png");
    const customResolver = vi.fn(() => {
      throw new Error("resolver failed");
    });

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const result = await cdnResolver(
      { safe: true, safeIps: [], url: "https://origin.test/file.png" },
      { disableWarnings: false, fileName: "file.txt" } as any,
      { provider: "CUSTOM", resolver: customResolver, customData: null, includeImage: true } as any,
    );

    expect(result).toBe("https://origin.test/file.png");
    expect(CustomWarn).toHaveBeenCalledTimes(1);
  });

  it("returns original URL when content-type category is excluded", async () => {
    const request = createRequestMock();
    const response = createResponseMock(200, "image/png");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const result = await cdnResolver(
      { safe: true, safeIps: [], url: "https://origin.test/file.png" },
      { disableWarnings: false, fileName: "file.txt" } as any,
      { provider: "CUSTOM", resolver: vi.fn(), customData: null, includeImage: false } as any,
    );

    expect(result).toBe("https://origin.test/file.png");
  });

  it("falls back when provider URL fails validation", async () => {
    const request = createRequestMock();
    const response = createResponseMock(200, "image/png");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });
    vi.mocked(cloudinaryCdnResolver).mockResolvedValue("https://bad.test/<x>");
    vi.mocked(validateCdnUrl).mockReturnValue(false);

    const result = await cdnResolver(
      { safe: true, safeIps: [], url: "https://origin.test/file.png" },
      { disableWarnings: false, fileName: "file.txt" } as any,
      {
        provider: "CLOUDINARY",
        cloudName: "cloud",
        apiKey: "key",
        apiSecret: "secret",
        includeImage: true,
      } as any,
    );

    expect(result).toBe("https://origin.test/file.png");
    expect(uploadCareCdnResolver).not.toHaveBeenCalled();
  });
});
