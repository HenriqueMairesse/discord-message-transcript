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

describe("placeholder safety", () => {
  test("multiple code blocks", () => {
    const html = md(`
\`\`\`js
1
\`\`\`

text

\`\`\`ts
2
\`\`\`
`);

    expect(html.match(/<pre>/g)?.length).toBe(2);
  });

  test("inline + block code", () => {
    const html = md("`a` ```js\nb\n```");
    expect(html.match(/<code/g)?.length).toBe(2);
  });
});