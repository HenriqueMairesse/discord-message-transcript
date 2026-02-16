import { beforeEach, describe, expect, it, vi } from "vitest";
import { output } from "../../src/core/output";
import { outputBase } from "discord-message-transcript-base/internal";

vi.mock("discord-message-transcript-base/internal", async () => {
  const actual = await vi.importActual<any>("discord-message-transcript-base/internal");
  return {
    ...actual,
    outputBase: vi.fn(),
  };
});

async function readStream(stream: NodeJS.ReadableStream): Promise<string> {
  let data = "";
  for await (const chunk of stream as any) {
    data += chunk.toString();
  }
  return data;
}

describe("core/output.ts (discord-message-transcript)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns JSON as string/buffer/stream/uploadable based on returnType", async () => {
    const base = {
      authors: [],
      channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
      guild: null,
      messages: [],
      mentions: { channels: [], roles: [], users: [] },
    };

    const asString = await output({ ...base, options: { returnFormat: "JSON", returnType: "string", fileName: "a.json" } } as any);
    const asBuffer = await output({ ...base, options: { returnFormat: "JSON", returnType: "buffer", fileName: "a.json" } } as any);
    const asStream = await output({ ...base, options: { returnFormat: "JSON", returnType: "stream", fileName: "a.json" } } as any);
    const asUpload = await output({ ...base, options: { returnFormat: "JSON", returnType: "uploadable", fileName: "a.json" } } as any);

    expect(typeof asString).toBe("string");
    expect(JSON.parse(asString as string).options.returnType).toBe("string");
    expect(Buffer.isBuffer(asBuffer)).toBe(true);
    expect(JSON.parse((asBuffer as Buffer).toString("utf-8")).options.returnType).toBe("buffer");
    expect(JSON.parse(await readStream(asStream as any)).options.returnType).toBe("stream");
    expect(asUpload).toEqual({
      content: expect.any(String),
      contentType: "application/json",
      fileName: "a.json",
    });
    expect(JSON.parse((asUpload as any).content).options.returnType).toBe("uploadable");
  });

  it("delegates to outputBase when returnFormat is HTML", async () => {
    vi.mocked(outputBase).mockResolvedValue("<html>ok</html>");

    const result = await output({
      options: { returnFormat: "HTML", returnType: "string", fileName: "x.html" },
      authors: [],
      channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
      guild: null,
      messages: [],
      mentions: { channels: [], roles: [], users: [] },
    } as any);

    expect(result).toBe("<html>ok</html>");
    expect(outputBase).toHaveBeenCalledTimes(1);
  });

  it("uses HTML path even when returnType resembles JSON converters", async () => {
    vi.mocked(outputBase).mockResolvedValue(Buffer.from("<html>binary</html>"));

    const result = await output({
      options: { returnFormat: "HTML", returnType: "uploadable", fileName: "x.html" },
      authors: [],
      channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
      guild: null,
      messages: [],
      mentions: { channels: [], roles: [], users: [] },
    } as any);

    expect(Buffer.isBuffer(result)).toBe(true);
    expect(outputBase).toHaveBeenCalledTimes(1);
  });

  it("throws when format/type are invalid", async () => {
    await expect(
      output({
        options: { returnFormat: "INVALID", returnType: "string", fileName: "x" },
        authors: [],
        channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
        guild: null,
        messages: [],
        mentions: { channels: [], roles: [], users: [] },
      } as any),
    ).rejects.toThrow("Return format or return type invalid!");
  });
});
