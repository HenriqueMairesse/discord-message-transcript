import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHTMLFromJSON } from "../src/index";
import { createBaseJsonData } from "./helpers/fixtures";

const mocks = vi.hoisted(() => ({
  outputMock: vi.fn(),
}));

vi.mock("../src/core/output.js", () => ({
  output: mocks.outputMock,
}));

describe("index.ts (discord-message-transcript-base)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderHTMLFromJSON forces HTML format and forwards to output", async () => {
    mocks.outputMock.mockResolvedValue("<html>ok</html>");

    const jsonString = JSON.stringify(
      createBaseJsonData({
        fileName: "example",
        returnFormat: "JSON",
        returnType: "buffer",
        selfContained: false,
        watermark: true,
      }),
    );

    const result = await renderHTMLFromJSON(jsonString, {
      returnType: "string",
      selfContained: true,
      watermark: false,
    } as any);

    expect(result).toBe("<html>ok</html>");
    expect(mocks.outputMock).toHaveBeenCalledTimes(1);
    const payload = mocks.outputMock.mock.calls[0]?.[0];
    expect(payload.options.returnFormat).toBe("HTML");
    expect(payload.options.returnType).toBe("string");
    expect(payload.options.selfContained).toBe(true);
    expect(payload.options.watermark).toBe(false);
  });

  it("wraps JSON parse error with CustomError message", async () => {
    await expect(renderHTMLFromJSON("{broken json", {} as any)).rejects.toThrow("Error converting JSON to HTML:");
  });

  it("keeps wrapped parse error prefix stable (snapshot first line)", async () => {
    let firstLine = "";
    try {
      await renderHTMLFromJSON("{broken json", {} as any);
    } catch (error: any) {
      firstLine = String(error?.message ?? error).split("\n")[0] ?? "";
    }
    expect(firstLine).toContain("Error converting JSON to HTML:");
    expect(firstLine).toContain("SyntaxError:");
  });
});
