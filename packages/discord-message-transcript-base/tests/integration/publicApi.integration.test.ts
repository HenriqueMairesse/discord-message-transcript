import { describe, expect, it } from "vitest";
import { renderHTMLFromJSON } from "../../src/index";
import { createBaseJsonData } from "../helpers/fixtures";

describe("public API integration (discord-message-transcript-base)", () => {
  it("renders HTML string with special fileName using real output/html", async () => {
    const jsonString = JSON.stringify(
      createBaseJsonData({
        fileName: "Transcript <safe>.html",
        localDate: "en-US",
        timeZone: "UTC",
        watermark: false,
      }),
    );

    const html = await renderHTMLFromJSON(jsonString, {
      returnType: "string",
      selfContained: true,
    } as any);

    expect(typeof html).toBe("string");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<title>Transcript &lt;safe&gt;.html</title>");
  });
});
