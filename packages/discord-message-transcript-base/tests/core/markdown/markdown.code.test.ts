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

describe("code precedence", () => {
  test("bold inside code block should NOT render", () => {
    const html = md("```js\n**bold**\n```");
    expect(html).not.toContain("<strong>");
  });

  test("inline code precedence", () => {
    const html = md("`**bold**`");
    expect(html).not.toContain("<strong>");
    expect(html).toContain("<code>");
  });

  test("code inside spoiler", () => {
    const html = md("||`code`||");
    expect(html).toContain("<code>");
    expect(html).toContain("spoilerMsg");
  });
});