import { beforeEach, describe, expect, it, vi } from "vitest";
import { discordParser } from "../../../src/core/discordParser";
import { fetchMessages } from "../../../src/core/discordParser/fetchMessages";
import { Json } from "../../../src/renderers/json/json";

vi.mock("../../../src/core/discordParser/fetchMessages", () => ({
  fetchMessages: vi.fn(),
}));

vi.mock("../../../src/renderers/json/json", () => ({
  Json: vi.fn(),
}));

function createJsonMock() {
  const messages: any[] = [];
  return {
    addMessages: vi.fn((batch: any[]) => messages.push(...batch)),
    getMessages: vi.fn(() => messages),
    sliceMessages: vi.fn((qty: number) => {
      messages.splice(0, messages.length - qty);
    }),
  };
}

describe("discordParser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses DM Json context, paginates with fetchMessages and enforces quantity", async () => {
    const jsonMock = createJsonMock();
    vi.mocked(Json).mockImplementation(function () {
      return jsonMock as any;
    });

    let callCount = 0;
    const seenLastIds: Array<string | undefined> = [];
    vi.mocked(fetchMessages).mockImplementation(async (ctx: any) => {
      seenLastIds.push(ctx.lastMessageId);
      callCount++;
      if (callCount === 1) {
        return { messages: [{ id: "1" } as any], end: false, newLastMessageId: "1" };
      }
      return { messages: [{ id: "2" } as any, { id: "3" } as any], end: false, newLastMessageId: "3" };
    });

    const channel = {
      isDMBased: () => true,
      guild: { id: "g1" },
    } as any;
    const options = { quantity: 2 } as any;

    const [jsonTranscript, state] = await discordParser(channel, options, null);

    expect(jsonTranscript).toBe(jsonMock);
    expect(Json).toHaveBeenCalledWith(null, channel, options, null, expect.any(Map));
    expect(fetchMessages).toHaveBeenCalledTimes(2);
    expect(seenLastIds).toEqual([undefined, "1"]);
    expect(jsonMock.sliceMessages).toHaveBeenCalledWith(2);
    expect(state.urlCache).toBeInstanceOf(Map);
    expect(state.authors).toBeInstanceOf(Map);
    expect(state.mentions.channels).toBeInstanceOf(Map);
    expect(state.mentions.roles).toBeInstanceOf(Map);
    expect(state.mentions.users).toBeInstanceOf(Map);
  });

  it("uses guild Json context and stops when fetch signals end", async () => {
    const jsonMock = createJsonMock();
    vi.mocked(Json).mockImplementation(function () {
      return jsonMock as any;
    });

    vi.mocked(fetchMessages).mockResolvedValueOnce({
      messages: [{ id: "x" } as any],
      end: true,
      newLastMessageId: "x",
    });

    const guild = { id: "guild-1" };
    const channel = {
      isDMBased: () => false,
      guild,
    } as any;
    const options = { quantity: 0 } as any;

    await discordParser(channel, options, null);

    expect(Json).toHaveBeenCalledWith(guild, channel, options, null, expect.any(Map));
    expect(fetchMessages).toHaveBeenCalledTimes(1);
    expect(jsonMock.sliceMessages).not.toHaveBeenCalled();
  });
});
