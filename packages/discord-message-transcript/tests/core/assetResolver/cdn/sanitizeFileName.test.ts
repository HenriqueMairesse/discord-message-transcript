import { describe, it, expect, vi, beforeEach } from "vitest";
import { sanitizeFileName } from "../../../../src/core/assetResolver/cdn/sanitizeFileName";
import * as crypto from "crypto";

vi.mock("crypto", () => ({
  randomUUID: vi.fn(() => "00000000-0000-4000-8000-000000000000"),
}));

describe("sanitizeFileName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return the same name for a basic valid file name", () => {
    const fileName = "my_document.pdf";
    expect(sanitizeFileName(fileName)).toBe("my_document.pdf");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should trim leading and trailing whitespace", () => {
    const fileName = "  my file name.txt  ";
    expect(sanitizeFileName(fileName)).toBe("my file name.txt");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should remove invalid characters", () => {
    const fileName = "file<>:/\\|?*name.jpg";
    expect(sanitizeFileName(fileName)).toBe("filename.jpg");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should replace multiple spaces with a single space", () => {
    const fileName = "my    file   name.docx";
    expect(sanitizeFileName(fileName)).toBe("my file name.docx");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should remove trailing dots or spaces", () => {
    let fileName = "document...";
    expect(sanitizeFileName(fileName)).toBe("document");
    expect(crypto.randomUUID).not.toHaveBeenCalled();

    fileName = "document   ";
    expect(sanitizeFileName(fileName)).toBe("document");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should truncate file names exceeding MAX_LENGTH", () => {
    const longFileName = "a".repeat(150) + ".txt";
    const expectedTruncatedName = "a".repeat(100); // MAX_LENGTH is 100
    expect(sanitizeFileName(longFileName)).toBe(expectedTruncatedName);
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should return a fallback name if sanitized name is empty", () => {
    const emptyFileName = "  <>:/\\|?*  ";
    expect(sanitizeFileName(emptyFileName)).toBe("fallbackFile-00000000-0000-4000-8000-000000000000");
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it("should handle mixed valid and invalid characters correctly", () => {
    const mixedFileName = "My File_Name!@#$%^&*( ).zip";
    expect(sanitizeFileName(mixedFileName)).toBe("My File_Name .zip");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should preserve international characters", () => {
    const internationalFileName = "árbol_árvore.jpg";
    expect(sanitizeFileName(internationalFileName)).toBe("árbol_árvore.jpg");
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });

  it("should handle file names that become only dots or spaces after sanitization", () => {
    const fileName = " . . . ";
    expect(sanitizeFileName(fileName)).toBe("fallbackFile-00000000-0000-4000-8000-000000000000");
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it("should handle file names that are only invalid characters and become empty", () => {
    const fileName = "<>";
    expect(sanitizeFileName(fileName)).toBe("fallbackFile-00000000-0000-4000-8000-000000000000");
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });
});
