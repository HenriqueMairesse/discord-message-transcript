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

describe("formatting interactions", () => {
  test("bold inside italic", () => {
    const html = md("*hello **world***");
    expect(html).toContain("<strong>");
    expect(html).toContain("<em>");
  });

  test("italic inside bold", () => {
    const html = md("**hello *world***");
    expect(html).toContain("<strong>");
    expect(html).toContain("<em>");
  });

  test("formatting inside spoiler", () => {
    const html = md("||**secret**||");
    expect(html).toContain("spoilerMsg");
    expect(html).toContain("<strong>");
  });

  test("formatting inside citation", () => {
    const html = md("> **hello**");
    expect(html).toContain("<blockquote");
    expect(html).toContain("<strong>");
  });
});