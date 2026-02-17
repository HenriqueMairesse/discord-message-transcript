import { beforeEach, describe, expect, it, vi } from "vitest";
import { EmbedType } from "discord.js";
import { fetchMessages } from "../../../src/core/discordParser/fetchMessages";
import { componentsToJson } from "../../../src/core/discordParser/componentToJson";
import { getMentions } from "../../../src/core/discordParser/getMentions";

vi.mock("../../../src/core/discordParser/componentToJson", () => ({
  componentsToJson: vi.fn(),
}));

vi.mock("../../../src/core/discordParser/getMentions", () => ({
  getMentions: vi.fn(),
}));

vi.mock("discord-message-transcript-base/internal", async () => {
  const actual = await vi.importActual<any>("discord-message-transcript-base/internal");
  return {
    ...actual,
    sanitize: vi.fn((value: string) => `san:${value}`),
    isValidHexColor: vi.fn((value: string | null) => (value ? `clr:${value}` : null)),
  };
});

function createCollection(messages: any[], size = messages.length) {
  return {
    size,
    map: (cb: (message: any) => any) => messages.map(cb),
    last: () => messages[messages.length - 1],
  };
}

function buildMessage(overrides: Record<string, any> = {}) {
  return {
    id: "m1",
    content: "hello",
    createdTimestamp: 1111,
    system: false,
    attachments: [{ contentType: "image/png", name: "a.png", size: 10, spoiler: false, url: "https://a.png" }],
    embeds: [
      {
        author: { name: "ea", url: "https://a", iconURL: "https://i" },
        description: "desc",
        fields: [{ inline: true, name: "f1", value: "v1" }],
        footer: { iconURL: "https://f", text: "ft" },
        hexColor: "#112233",
        image: { url: "https://img" },
        thumbnail: { url: "https://thumb" },
        timestamp: 123,
        title: "title",
        data: { type: "rich" },
        url: "https://embed",
      },
    ],
    author: {
      id: "u1",
      bot: false,
      displayName: "author",
      primaryGuild: { tag: "guild-tag" },
      system: false,
      displayAvatarURL: () => "https://avatar",
    },
    member: { displayHexColor: "#445566", displayName: "member-name" },
    components: [{ type: 1 }],
    mentions: { everyone: false },
    poll: null,
    reactions: { cache: [{ count: 2, emoji: { name: "x" } }, { count: 1, emoji: { name: null } }] },
    reference: { messageId: "ref-1" },
    ...overrides,
  };
}

describe("fetchMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(componentsToJson).mockResolvedValue([{ type: 999 } as any]);
    vi.mocked(getMentions).mockResolvedValue(undefined);
  });

  it("maps messages, applies include flags and returns pagination metadata", async () => {
    const message = buildMessage();
    const collection = createCollection([message], 1);
    const fetchMock = vi.fn(async () => collection);

    const ctx = {
      channel: { messages: { fetch: fetchMock } },
      options: {
        includeAttachments: false,
        includeEmbeds: false,
        includePolls: false,
        includeReactions: false,
        includeEmpty: true,
      },
      transcriptState: {
        authors: new Map<string, any>(),
        mentions: { channels: new Map(), roles: new Map(), users: new Map() },
      },
      lastMessageId: "before-id",
    } as any;

    const result = await fetchMessages(ctx);

    expect(fetchMock).toHaveBeenCalledWith({ limit: 100, cache: false, before: "before-id" });
    expect(result.end).toBe(true);
    expect(result.newLastMessageId).toBe("m1");
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].attachments).toEqual([]);
    expect(result.messages[0].embeds).toEqual([]);
    expect(result.messages[0].reactions).toEqual([]);
    expect(result.messages[0].components).toEqual([{ type: 999 }]);
    expect(result.messages[0].references).toEqual({ messageId: "ref-1" });
    expect(ctx.transcriptState.authors.get("u1")).toEqual({
      avatarURL: "https://avatar",
      bot: false,
      displayName: "san:author",
      guildTag: "guild-tag",
      id: "u1",
      member: {
        displayHexColor: "clr:#445566",
        displayName: "member-name",
      },
      system: false,
    });
    expect(getMentions).toHaveBeenCalledTimes(1);
  });

  it("filters empty messages and keeps poll payload when includePolls is enabled", async () => {
    vi.mocked(componentsToJson).mockResolvedValue([]);

    const emptyMessage = buildMessage({
      id: "m-empty",
      content: "",
      attachments: [],
      embeds: [],
      components: [],
      poll: null,
    });
    const pollMessage = buildMessage({
      id: "m-poll",
      content: "",
      attachments: [],
      embeds: [],
      system: true,
      poll: {
        answers: new Map([
          [
            "a1",
            {
              id: "a1",
              voteCount: 3,
              text: "yes",
              emoji: { id: null, name: "👍", animated: false },
            },
          ],
        ]),
        expiresTimestamp: Date.now() + 3600_000,
        resultsFinalized: false,
        question: { text: "question?" },
      },
    });

    const collection = createCollection([emptyMessage, pollMessage], 100);
    const fetchMock = vi.fn(async () => collection);

    const ctx = {
      channel: { messages: { fetch: fetchMock } },
      options: {
        includeAttachments: false,
        includeEmbeds: true,
        includePolls: true,
        includeReactions: false,
        includeEmpty: false,
      },
      transcriptState: {
        authors: new Map<string, any>(),
        mentions: { channels: new Map(), roles: new Map(), users: new Map() },
      },
      lastMessageId: undefined,
    } as any;

    const result = await fetchMessages(ctx);

    expect(result.end).toBe(false);
    expect(result.newLastMessageId).toBe("m-poll");
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].id).toBe("m-poll");
    expect(result.messages[0].poll?.question).toBe("question?");
    expect(result.messages[0].poll?.answers[0]).toEqual({
      count: 3,
      emoji: { animated: false, id: null, name: "👍" },
      id: "a1",
      text: "yes",
    });
    expect(result.messages[0].poll?.expiry).toMatch(/left|now/);
  });

  it("removes poll_result embeds for system messages when includePolls is false", async () => {
    vi.mocked(componentsToJson).mockResolvedValue([]);

    const pollResultEmbedMessage = buildMessage({
      id: "m-poll-result",
      system: true,
      embeds: [
        {
          data: { type: EmbedType.PollResult },
          fields: [],
        },
      ],
      attachments: [],
      components: [],
      poll: null,
      content: "content to avoid empty filtering",
    });

    const collection = createCollection([pollResultEmbedMessage], 1);
    const fetchMock = vi.fn(async () => collection);

    const ctx = {
      channel: { messages: { fetch: fetchMock } },
      options: {
        includeAttachments: false,
        includeEmbeds: true,
        includePolls: false,
        includeReactions: false,
        includeEmpty: false,
      },
      transcriptState: {
        authors: new Map<string, any>(),
        mentions: { channels: new Map(), roles: new Map(), users: new Map() },
      },
      lastMessageId: undefined,
    } as any;

    const result = await fetchMessages(ctx);
    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].embeds).toEqual([]);
  });

  it("keeps non-empty messages by attachment/component/content when includeEmpty is false", async () => {
    vi.mocked(componentsToJson).mockImplementation(async (components: any[]) => components as any);

    const emptyMessage = buildMessage({
      id: "m-empty-2",
      content: "",
      attachments: [],
      embeds: [],
      components: [],
      poll: null,
    });
    const withAttachment = buildMessage({
      id: "m-attachment",
      content: "",
      attachments: [{ contentType: "text/plain", name: "f.txt", size: 1, spoiler: false, url: "https://f" }],
      embeds: [],
      components: [],
      poll: null,
    });
    const withComponent = buildMessage({
      id: "m-component",
      content: "",
      attachments: [],
      embeds: [],
      components: [{ type: 999 }],
      poll: null,
    });
    const withContent = buildMessage({
      id: "m-content",
      content: "hello",
      attachments: [],
      embeds: [],
      components: [],
      poll: null,
    });

    const collection = createCollection([emptyMessage, withAttachment, withComponent, withContent], 4);
    const fetchMock = vi.fn(async () => collection);

    const ctx = {
      channel: { messages: { fetch: fetchMock } },
      options: {
        includeAttachments: true,
        includeEmbeds: false,
        includePolls: false,
        includeReactions: false,
        includeEmpty: false,
      },
      transcriptState: {
        authors: new Map<string, any>(),
        mentions: { channels: new Map(), roles: new Map(), users: new Map() },
      },
      lastMessageId: undefined,
    } as any;

    const result = await fetchMessages(ctx);
    expect(result.messages.map(m => m.id)).toEqual(["m-attachment", "m-component", "m-content"]);
  });
});
