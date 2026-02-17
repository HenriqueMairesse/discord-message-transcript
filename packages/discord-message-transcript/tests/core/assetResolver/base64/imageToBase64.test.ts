import { EventEmitter } from "events";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { imageToBase64 } from "../../../../src/core/assetResolver/base64/imageToBase64";
import { createLookup } from "../../../../src/core/networkSecurity";
import { CustomWarn } from "discord-message-transcript-base/internal";
import { getBase64Limiter } from "../../../../src/core/assetResolver/limiter";
import https from "https";
import http from "http";

vi.mock("https", () => ({
  default: { get: vi.fn() },
}));

vi.mock("http", () => ({
  default: { get: vi.fn() },
}));

vi.mock("../../../../src/core/networkSecurity", () => ({
  createLookup: vi.fn(() => vi.fn()),
}));

vi.mock("../../../../src/core/assetResolver/limiter", () => ({
  getBase64Limiter: vi.fn(() => (fn: () => Promise<any>) => fn()),
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

describe("imageToBase64", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns base64 data URL for valid image response", async () => {
    const request = createRequestMock();
    const response = createResponseMock(200, "image/png");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const promise = imageToBase64({ safe: true, safeIps: ["1.1.1.1"], url: "https://img.test/a.png" }, false);
    response.emit("data", Buffer.from("abc"));
    response.emit("end");
    const result = await promise;

    expect(result).toBe("data:image/png;base64,YWJj");
    expect(createLookup).toHaveBeenCalledWith(["1.1.1.1"]);
    expect(getBase64Limiter).toHaveBeenCalledTimes(1);
    expect(CustomWarn).not.toHaveBeenCalled();
  });

  it("returns original URL for non-200 response and warns", async () => {
    const request = createRequestMock();
    const response = createResponseMock(404, "image/png");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const result = await imageToBase64({ safe: true, safeIps: [], url: "https://img.test/not-found.png" }, false);

    expect(result).toBe("https://img.test/not-found.png");
    expect(CustomWarn).toHaveBeenCalledTimes(1);
  });

  it("returns original URL for gif content", async () => {
    const request = createRequestMock();
    const response = createResponseMock(200, "image/gif");

    vi.mocked(https.get).mockImplementation((_url: any, _opts: any, cb: any) => {
      cb(response);
      return request;
    });

    const result = await imageToBase64({ safe: true, safeIps: [], url: "https://img.test/anim.gif" }, false);
    expect(result).toBe("https://img.test/anim.gif");
  });

  it("returns original URL when request emits error", async () => {
    const request = createRequestMock();

    vi.mocked(http.get).mockImplementation((_url: any, _opts: any, _cb: any) => request);

    const pending = imageToBase64({ safe: true, safeIps: [], url: "http://img.test/a.png" }, false);
    request.emit("error", new Error("boom"));
    const result = await pending;

    expect(result).toBe("http://img.test/a.png");
    expect(CustomWarn).toHaveBeenCalledTimes(1);
  });
});
