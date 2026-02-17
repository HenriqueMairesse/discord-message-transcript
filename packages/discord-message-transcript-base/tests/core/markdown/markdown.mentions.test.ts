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

describe("mentions", () => {
  test("unknown user fallback", () => {
    const html = md("<@123>");
    expect(html).toContain("&lt;@123&gt;");
  });

  test("role mention", () => {
    const m = {
      users: [],
      roles: [{ id: "1", name: "Admin", color: "#ff0" }],
      channels: [],
    };

    const html = markdownToHTML("<@&1>", m, false, dateFormat);
    expect(html).toContain("@Admin");
  });

  test("channel mention", () => {
    const m = {
      users: [],
      roles: [],
      channels: [{ id: "1", name: "general" }],
    };

    const html = markdownToHTML("<#1>", m, false, dateFormat);
    expect(html).toContain("#general");
  });
});