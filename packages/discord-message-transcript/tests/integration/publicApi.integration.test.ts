import { describe, expect, it } from "vitest";
import { renderHTMLFromJSON } from "../../src/index";
import { createBaseJsonData } from "../helpers/fixtures";

describe("public API integration (discord-message-transcript)", () => {
  it("renders HTML string from JSON using real pipeline", async () => {
    const jsonString = JSON.stringify(
      createBaseJsonData({
        fileName: "Integration Main",
        localDate: "en-US",
        timeZone: "UTC",
        watermark: true,
      }),
    );

    const html = await renderHTMLFromJSON(jsonString, {
      returnType: "string",
      selfContained: true,
    } as any);

    expect(typeof html).toBe("string");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Integration Main</title>");
  });
});
