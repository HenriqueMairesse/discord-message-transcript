import { describe, test, expect } from "vitest";
import { markdownToHTML } from "../../../src/core/markdown";

const mentions = {
  users: [],
  roles: [],
  channels: [],
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
});

function md(input: string) {
  return markdownToHTML(input, mentions, false, dateFormat);
}

describe("timestamp", () => {
  test("invalid timestamp", () => {
    const html = md("<t:abc>");
    expect(html).toContain("&lt;t:abc&gt;");
  });

  test("all formats", () => {
    const styles = ["t","T","d","D","f","F","R"] as const;

    for (const s of styles) {
      const html = md(`<t:1700000000:${s}>`);
      expect(html).toContain("<time");
    }
  });
});