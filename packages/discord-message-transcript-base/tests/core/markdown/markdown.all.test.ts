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

describe("markdownToHTML()", () => {

  // -------------------------
  // CODE BLOCKS
  // -------------------------
  describe("code blocks", () => {
    test("should render code block", () => {
      const input = "```js\nconsole.log(1)\n```";
      const html = md(input);

      expect(html).toContain("<pre><code");
      expect(html).toContain("console.log(1)");
    });

    test("should sanitize code block", () => {
      const input = "```js\n<script>alert(1)</script>\n```";
      const html = md(input);

      expect(html).toContain("&lt;script&gt;");
    });

    test("should fallback to plaintext language", () => {
      const input = "```unknown\nhello\n```";
      const html = md(input);

      expect(html).toContain("language-plaintext");
    });

    test("snapshot code block", () => {
      const input = "```ts\nconst a = 1;\n```";
      expect(md(input)).toMatchSnapshot();
    });
  });

  // -------------------------
  // INLINE CODE
  // -------------------------
  describe("inline code", () => {
    test("should render inline code", () => {
      const html = md("hello `world`");
      expect(html).toContain("<code>world</code>");
    });

    test("should sanitize inline code", () => {
      const html = md("`<script>`");
      expect(html).toContain("&lt;script&gt;");
    });
  });

  // -------------------------
  // FORMATTING
  // -------------------------
  describe("formatting", () => {
    test("bold", () => {
      expect(md("**bold**")).toContain("<strong>bold</strong>");
    });

    test("italic", () => {
      expect(md("*italic*")).toContain("<em>italic</em>");
    });

    test("underline", () => {
      expect(md("__u__")).toContain("<u>u</u>");
    });

    test("strike", () => {
      expect(md("~~s~~")).toContain("<s>s</s>");
    });

    test("bold italic", () => {
      expect(md("***x***")).toContain("<strong><em>x</em></strong>");
    });

    test("spoiler", () => {
      expect(md("||secret||")).toContain("spoilerMsg");
    });
  });

  // -------------------------
  // HEADERS
  // -------------------------
  describe("headers", () => {
    test("h1", () => {
      expect(md("# Title")).toContain("<h1>Title</h1>");
    });

    test("h2", () => {
      expect(md("## Title")).toContain("<h2>Title</h2>");
    });
  });

  // -------------------------
  // LINKS
  // -------------------------
  describe("links", () => {
    test("normal link", () => {
      const html = md("https://google.com");
      expect(html).toContain("<a href=");
    });

    test("masked link", () => {
      const html = md("[Google](https://google.com)");
      expect(html).toContain(">Google</a>");
    });
  });

  // -------------------------
  // CITATIONS
  // -------------------------
  describe("citations", () => {
    test("single citation", () => {
      const html = md("> hello");
      expect(html).toContain("<blockquote");
    });

    test("multi citation", () => {
      const html = md(">>> hello");
      expect(html).toContain("quote-multi");
    });
  });

  // -------------------------
  // LISTS
  // -------------------------
  describe("lists", () => {
    test("bullet list", () => {
      const html = md("- item");
      expect(html).toContain("•");
    });
  });

  // -------------------------
  // MENTIONS
  // -------------------------
  describe("mentions", () => {
    test("user mention", () => {
      const m = {
        users: [{ id: "1", name: "John", color: "#ff0000" }],
        roles: [],
        channels: [],
      };

      const html = markdownToHTML("<@1>", m, false, dateFormat);
      expect(html).toContain("@John");
    });

    test("@everyone", () => {
      const html = markdownToHTML("@everyone", mentions, true, dateFormat);
      expect(html).toContain("mention");
    });
  });

  // -------------------------
  // TIMESTAMP
  // -------------------------
  describe("timestamps", () => {
    test("default timestamp", () => {
      const html = md("<t:1700000000>");
      expect(html).toContain("<time");
    });

    test("relative timestamp", () => {
      const html = md("<t:1700000000:R>");
      expect(html).toContain("<time");
    });
  });

  // -------------------------
  // SECURITY
  // -------------------------
  describe("security", () => {
    test("should sanitize HTML", () => {
      const html = md("<script>alert(1)</script>");
      expect(html).toContain("&lt;script&gt;");
    });

    test("should not break code block", () => {
      const html = md("```html\n<b>\n```");
      expect(html).toContain("&lt;b&gt;");
    });
  });

  // -------------------------
  // SNAPSHOT FULL
  // -------------------------
  describe("snapshot full message", () => {
    test("complex message snapshot", () => {
      const input = `
# Title
Hello **world**
- item
> quote
https://google.com
\`\`\`js
const x = 1
\`\`\`
      `.trim();

      expect(md(input)).toMatchSnapshot();
    });
  });

  test("fuzz random input should not crash", () => {
    const random = Array.from({ length: 1000 })
      .map(() => String.fromCharCode(Math.random() * 255))
      .join("");

    expect(() => md(random)).not.toThrow();
  });

  test("mega snapshot", () => {
    const input = `
# Title
Hello **world**
- item
> quote
||spoiler||
https://google.com
<t:1700000000:R>
\`\`\`js
const x = 1
\`\`\`
`.trim();
    expect(md(input)).toMatchSnapshot();
  });

});