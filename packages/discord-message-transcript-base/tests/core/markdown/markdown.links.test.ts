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

describe("links interactions", () => {
  test("link inside bold", () => {
    const html = md("**https://google.com**");
    expect(html).toContain("<a");
    expect(html).toContain("<strong>");
  });

  test("masked link inside spoiler", () => {
    const html = md("||[x](https://a.com)||");
    expect(html).toContain("spoilerMsg");
    expect(html).toContain("<a");
  });

  test("link should not double wrap", () => {
    const html = md("[x](https://a.com)");
    const matches = html.match(/<a/g);
    expect(matches?.length).toBe(1);
  });
});