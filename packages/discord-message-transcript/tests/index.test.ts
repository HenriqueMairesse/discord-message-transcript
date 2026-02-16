import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  outputMock: vi.fn(),
  outputBaseMock: vi.fn(),
  discordParserMock: vi.fn(),
  jsonAssetResolverMock: vi.fn(),
  returnTypeMapperMock: vi.fn(() => "string"),
  customWarnMock: vi.fn(),
}));

vi.mock("../src/core/output", () => ({
  output: mocks.outputMock,
}));

vi.mock("../src/core/discordParser/index", () => ({
  discordParser: mocks.discordParserMock,
}));

vi.mock("../src/core/assetResolver/index", () => ({
  jsonAssetResolver: mocks.jsonAssetResolverMock,
  setBase64Concurrency: vi.fn(),
  setCDNConcurrency: vi.fn(),
}));

vi.mock("../src/core/mappers", () => ({
  returnTypeMapper: mocks.returnTypeMapperMock,
}));

vi.mock("discord-message-transcript-base/internal", async () => {
  const actual = await vi.importActual<any>("discord-message-transcript-base/internal");
  return {
    ...actual,
    outputBase: mocks.outputBaseMock,
    CustomWarn: mocks.customWarnMock,
  };
});

vi.mock("discord.js", async () => {
  const actual = await vi.importActual<any>("discord.js");
  class AttachmentBuilderMock {
    public data: Buffer;
    public options: { name: string };
    constructor(data: Buffer, options: { name: string }) {
      this.data = data;
      this.options = options;
    }
  }
  return {
    ...actual,
    AttachmentBuilder: AttachmentBuilderMock,
  };
});

import { createTranscript, renderHTMLFromJSON } from "../src/index";
import { ReturnFormat } from "discord-message-transcript-base/internal";
import { createDmChannel, createGuildChannelWithoutPermissions, createMaps } from "./helpers/fixtures";

describe("index.ts (discord-message-transcript)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createTranscript returns attachment by default", async () => {
    const jsonTranscript = {
      toJson: vi.fn(async () => ({
        options: { returnFormat: "HTML", fileName: "Transcript-test" },
      })),
      getMessages: vi.fn(() => []),
    };
    const maps = createMaps();
    mocks.discordParserMock.mockResolvedValue([jsonTranscript, maps]);
    mocks.outputMock.mockResolvedValue(Buffer.from("<html>ok</html>"));
    const channel = createDmChannel();

    const result: any = await createTranscript(channel, {});

    expect(mocks.discordParserMock).toHaveBeenCalledTimes(1);
    expect(mocks.jsonAssetResolverMock).toHaveBeenCalledTimes(1);
    expect(result.options.name.endsWith(".html")).toBe(true);
  });

  it("createTranscript returns non-attachment output when requested", async () => {
    const jsonTranscript = {
      toJson: vi.fn(async () => ({
        options: { returnFormat: "JSON", fileName: "Transcript-test" },
      })),
      getMessages: vi.fn(() => []),
    };
    const maps = createMaps();
    mocks.discordParserMock.mockResolvedValue([jsonTranscript, maps]);
    mocks.outputMock.mockResolvedValue('{"ok":true}');
    const channel = createDmChannel();

    const result = await createTranscript(channel, { returnType: "string", returnFormat: ReturnFormat.JSON } as any);

    expect(mocks.returnTypeMapperMock).toHaveBeenCalledWith("string");
    expect(result).toBe('{"ok":true}');
  });

  it("renderHTMLFromJSON uses outputBase and returns attachment by default", async () => {
    mocks.outputBaseMock.mockResolvedValue(Buffer.from("<html>ok</html>"));

    const jsonString = JSON.stringify({
      options: {
        fileName: "my-transcript",
        watermark: true,
      },
    });

    const result: any = await renderHTMLFromJSON(jsonString, {});

    expect(mocks.outputBaseMock).toHaveBeenCalledTimes(1);
    expect(result.options.name).toBe("my-transcript.html");
  });

  it("throws when bot lacks required permissions in guild channels", async () => {
    const channel = createGuildChannelWithoutPermissions("123", "locked-channel", (perm: string) => perm !== "ViewChannel");

    await expect(createTranscript(channel, {})).rejects.toThrow("can't be used to create a transcript");
    expect(mocks.discordParserMock).not.toHaveBeenCalled();
  });

  it("uses quantity fallback 0 when quantity is negative and warns", async () => {
    const jsonTranscript = {
      toJson: vi.fn(async () => ({
        options: { returnFormat: "HTML", fileName: "Transcript-test" },
      })),
      getMessages: vi.fn(() => []),
    };
    const maps = createMaps();
    mocks.discordParserMock.mockResolvedValue([jsonTranscript, maps]);
    mocks.outputMock.mockResolvedValue(Buffer.from("<html>ok</html>"));
    const channel = createDmChannel();

    await createTranscript(channel, { quantity: -5 } as any);

    expect(mocks.customWarnMock).toHaveBeenCalledTimes(1);
    const internalOptions = mocks.discordParserMock.mock.calls[0]?.[1];
    expect(internalOptions.quantity).toBe(0);
  });

  it("throws if attachment return type is requested and output is not Buffer", async () => {
    const jsonTranscript = {
      toJson: vi.fn(async () => ({
        options: { returnFormat: "HTML", fileName: "Transcript-test" },
      })),
      getMessages: vi.fn(() => []),
    };
    const maps = createMaps();
    mocks.discordParserMock.mockResolvedValue([jsonTranscript, maps]);
    mocks.outputMock.mockResolvedValue("<html>not-buffer</html>");
    const channel = createDmChannel();

    await expect(createTranscript(channel, {})).rejects.toThrow("Expected buffer from output");
  });

  it("supports parallel calls without cross-contaminating outputs", async () => {
    mocks.discordParserMock.mockImplementation(async (channel: any) => {
      const jsonTranscript = {
        toJson: vi.fn(async () => ({
          options: { returnFormat: "JSON", fileName: `Transcript-${channel.id}` },
          id: channel.id,
        })),
        getMessages: vi.fn(() => []),
      };
      const maps = {
        authors: new Map(),
        mentions: { channels: new Map(), roles: new Map(), users: new Map() },
        urlCache: new Map<string, Promise<string>>(),
      };
      return [jsonTranscript, maps];
    });
    mocks.outputMock.mockImplementation(async (json: any) => `out:${json.id}`);

    const channelA = createDmChannel("A", "a");
    const channelB = createDmChannel("B", "b");

    const [resA, resB] = await Promise.all([
      createTranscript(channelA, { returnType: "string", returnFormat: ReturnFormat.JSON } as any),
      createTranscript(channelB, { returnType: "string", returnFormat: ReturnFormat.JSON } as any),
    ]);

    expect(resA).toBe("out:A");
    expect(resB).toBe("out:B");
    expect(mocks.discordParserMock).toHaveBeenCalledTimes(2);
  });

  it("keeps public wrapped error prefix stable (snapshot first line)", async () => {
    const channel = createGuildChannelWithoutPermissions();

    let firstLine = "";
    try {
      await createTranscript(channel, {});
    } catch (error: any) {
      firstLine = String(error?.message ?? error).split("\n")[0] ?? "";
    }

    expect(firstLine).toContain("Error creating transcript:");
    expect(firstLine).toContain("Channel selected, locked-channel with id: 123");
  });
});
