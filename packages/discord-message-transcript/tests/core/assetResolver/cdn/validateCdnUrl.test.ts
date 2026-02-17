import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { validateCdnUrl } from "../../../../src/core/assetResolver/cdn/validateCdnUrl";
import * as internal from "discord-message-transcript-base/internal";

describe("validateCdnUrl", () => {
  let customWarnSpy: Mock<(message: string, disableWarnings: boolean) =>  (() => {}) | void>;

  beforeEach(() => {
    // Mock CustomWarn before each test
    customWarnSpy = vi.spyOn(internal, "CustomWarn").mockImplementation(() => {});
  });

  it("should return true for a safe URL and not call CustomWarn", () => {
    const url = "https://example.com/safe-url";
    const result = validateCdnUrl(url, false);
    expect(result).toBe(true);
    expect(customWarnSpy).not.toHaveBeenCalled();
  });

  it("should return false for a URL with double quotes and call CustomWarn", () => {
    const url = 'https://example.com/unsafe"url';
    const result = validateCdnUrl(url, false);
    expect(result).toBe(false);
    expect(customWarnSpy).toHaveBeenCalledWith(
      `Unsafe URL received from CDN, using fallback.
URL: ${url}`,
      false
    );
  });

  it("should return false for a URL with a less than sign and call CustomWarn", () => {
    const url = "https://example.com/unsafe<url";
    const result = validateCdnUrl(url, false);
    expect(result).toBe(false);
    expect(customWarnSpy).toHaveBeenCalledWith(
      `Unsafe URL received from CDN, using fallback.
URL: ${url}`,
      false
    );
  });

  it("should return false for a URL with a greater than sign and call CustomWarn", () => {
    const url = "https://example.com/unsafe>url";
    const result = validateCdnUrl(url, false);
    expect(result).toBe(false);
    expect(customWarnSpy).toHaveBeenCalledWith(
      `Unsafe URL received from CDN, using fallback.
URL: ${url}`,
      false
    );
  });

  it("should return false for a URL with multiple unsafe characters and call CustomWarn", () => {
    const url = 'https://example.com/unsafe"<url>';
    const result = validateCdnUrl(url, false);
    expect(result).toBe(false);
    expect(customWarnSpy).toHaveBeenCalledWith(
      `Unsafe URL received from CDN, using fallback.
URL: ${url}`,
      false
    );
  });

  it("should return false for an unsafe URL but pass disableWarnings to CustomWarn", () => {
    const url = 'https://example.com/unsafe"url';
    const result = validateCdnUrl(url, true);
    expect(result).toBe(false);
    expect(customWarnSpy).toHaveBeenCalledWith(
      `Unsafe URL received from CDN, using fallback.
URL: ${url}`,
      true
    );
  });
});
