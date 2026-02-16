import { expect, test, describe } from "vitest";
import { sanitize, isValidHexColor } from "../../src/core/sanitizer";

describe("sanitize()", () => {
  test("should sanitize HTML special characters", () => {
    const input = `<div>Hello & "World" < 'test' ></div>`;
    const expected =
      `&lt;div&gt;Hello &amp; &quot;World&quot; &lt; &#39;test&#39; &gt;&lt;/div&gt;`;
    expect(sanitize(input)).toBe(expected);
  });

  test("should return same string when no special characters", () => {
    const input = "Hello World";
    expect(sanitize(input)).toBe(input);
  });

  test("should handle empty string", () => {
    expect(sanitize("")).toBe("");
  });

  test("should handle only special characters", () => {
    const input = `&<>"'`;
    const expected = `&amp;&lt;&gt;&quot;&#39;`;
    expect(sanitize(input)).toBe(expected);
  });

  test("should sanitize repeated special characters", () => {
    const input = "<<<&&&>>>\"\"''";
    const expected =
      "&lt;&lt;&lt;&amp;&amp;&amp;&gt;&gt;&gt;&quot;&quot;&#39;&#39;";
    expect(sanitize(input)).toBe(expected);
  });

  test("should handle long strings", () => {
    const input = "<".repeat(1000);
    expect(sanitize(input)).toBe("&lt;".repeat(1000));
  });

  test("should double escape already escaped entities", () => {
    expect(sanitize("&lt;")).toBe("&amp;lt;");
  });

  test("should not mutate original string", () => {
    const input = "<>";
    const copy = input;
    sanitize(input);
    expect(input).toBe(copy);
  });

  test("snapshot basic sanitize", () => {
    const input = `<b>Hello</b> & "test"`;
    expect(sanitize(input)).toMatchInlineSnapshot(
      `"&lt;b&gt;Hello&lt;/b&gt; &amp; &quot;test&quot;"`
    );
  });
});

describe("isValidHexColor()", () => {
  describe("valid inputs", () => {
    test.each([
      ["#FFFFFF", "#ffffff"],
      ["000", "#000"],
      ["F000", "#f000"],
      ["#ffcc00", "#ffcc00"],
      ["FFF", "#fff"],
      ["000000", "#000000"],
      ["fFcC00", "#ffcc00"],
      ["#12345678", "#12345678"],
      ["ABC", "#abc"],
      ["abc", "#abc"],
      ["123456", "#123456"],
    ])("should accept %s", (input, expected) => {
      expect(isValidHexColor(input as string, false)).toBe(expected);
    });

    test("should trim spaces", () => {
      expect(isValidHexColor("  FFF  ", false)).toBe("#fff");
      expect(isValidHexColor("  #ABC  ", false)).toBe("#abc");
    });

    test("should always return lowercase", () => {
      expect(isValidHexColor("#ABCDEF", false)).toBe("#abcdef");
    });
  });

  describe("invalid inputs with fallback", () => {
    test.each([
      "invalid",
      "##123",
      "12345",
      "#123Z",
      "#1234567",
      "#",
      "#".repeat(100),
    ])("should fallback to default for %s", (input) => {
      expect(isValidHexColor(input as string, false)).toBe("#000000");
    });

    test("should fallback for empty string", () => {
      expect(isValidHexColor("", false)).toBe("#000000");
    });

    test("should fallback for null when canReturnNull=false", () => {
      // @ts-ignore runtime JS case
      expect(isValidHexColor(null, false)).toBe("#000000");
    });

    test("should fallback for undefined", () => {
      // @ts-ignore runtime JS case
      expect(isValidHexColor(undefined, false)).toBe("#000000");
    });
  });

  describe("null return mode", () => {
    test.each([
      "invalid",
      "##123",
      "12345",
      "#123Z",
      "#",
    ])("should return null for %s", (input) => {
      expect(isValidHexColor(input as string, true)).toBeNull();
    });

    test("should return null for empty string", () => {
      expect(isValidHexColor("", true)).toBeNull();
    });

    test("should return null for null input", () => {
      expect(isValidHexColor(null, true)).toBeNull();
    });
  });
});
