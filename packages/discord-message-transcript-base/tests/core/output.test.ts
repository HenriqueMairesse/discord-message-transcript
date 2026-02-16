import { beforeEach, describe, expect, it, vi } from "vitest";
import { output } from "../../src/core/output";

vi.mock("../../src/renderers/html/html", () => ({
  Html: vi.fn().mockImplementation(function () {
    return {
      toHTML: async () => "<html>rendered</html>",
    };
  }),
}));

async function readStream(stream: NodeJS.ReadableStream): Promise<string> {
  let data = "";
  for await (const chunk of stream as any) {
    data += chunk.toString();
  }
  return data;
}

describe("core/output.ts (discord-message-transcript-base)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns html as string/buffer/stream/uploadable", async () => {
    const base = {
      authors: [],
      channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
      guild: null,
      messages: [],
      mentions: { channels: [], roles: [], users: [] },
    };

    const asString = await output({ ...base, options: { returnType: "string", fileName: "a.html" } } as any);
    const asBuffer = await output({ ...base, options: { returnType: "buffer", fileName: "a.html" } } as any);
    const asStream = await output({ ...base, options: { returnType: "stream", fileName: "a.html" } } as any);
    const asUpload = await output({ ...base, options: { returnType: "uploadable", fileName: "a.html" } } as any);

    expect(asString).toBe("<html>rendered</html>");
    expect(Buffer.isBuffer(asBuffer)).toBe(true);
    expect(await readStream(asStream as any)).toBe("<html>rendered</html>");
    expect(asUpload).toEqual({
      content: "<html>rendered</html>",
      contentType: "text/html",
      fileName: "a.html",
    });
  });

  it("throws for invalid returnType", async () => {
    await expect(
      output({
        options: { returnType: "invalid", fileName: "x" },
        authors: [],
        channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
        guild: null,
        messages: [],
        mentions: { channels: [], roles: [], users: [] },
      } as any),
    ).rejects.toThrow("Return format or return type invalid!");
  });
});
