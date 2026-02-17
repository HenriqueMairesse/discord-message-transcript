import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChannelType } from "discord.js";
import { getMentions } from "../../../src/core/discordParser/getMentions";

vi.mock("discord-message-transcript-base/internal", async () => {
  const actual = await vi.importActual<any>("discord-message-transcript-base/internal");
  return {
    ...actual,
    sanitize: vi.fn((value: string) => `san:${value}`),
    isValidHexColor: vi.fn((value: string | null) => (value ? `clr:${value}` : null)),
  };
});

describe("getMentions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("collects mentions from message payload and fetches missing references from content", async () => {
    const mentions = {
      channels: new Map<string, any>(),
      roles: new Map<string, any>(),
      users: new Map<string, any>(),
    };

    const rolesFetch = vi.fn(async (id: string) =>
      id === "99" ? { id: "99", hexColor: "#990000", name: "ops" } : null,
    );
    const channelsFetch = vi.fn(async (id: string) =>
      id === "88" ? { id: "88", name: "logs" } : null,
    );
    const membersFetch = vi.fn(async () => {
      throw new Error("not found");
    });
    const clientUsersFetch = vi.fn(async (id: string) =>
      id === "77" ? { id: "77", hexAccentColor: "#777777", displayName: "fallback-user" } : null,
    );

    const message = {
      content: "hi <@&99> <#88> <@77>",
      mentions: {
        channels: new Map([["10", { id: "10", type: ChannelType.GuildText, name: "general" }]]),
        roles: new Map([["20", { id: "20", hexColor: "#200000", name: "admin" }]]),
        members: new Map([["30", { id: "30", displayHexColor: "#003000", displayName: "member-30" }]]),
        users: new Map(),
      },
      guild: {
        roles: { fetch: rolesFetch },
        channels: { fetch: channelsFetch },
        members: { fetch: membersFetch },
      },
      client: {
        users: { fetch: clientUsersFetch },
      },
    } as any;

    await getMentions(message, mentions as any);

    expect(mentions.channels.get("10")).toEqual({ id: "10", name: "san:general" });
    expect(mentions.channels.get("88")).toEqual({ id: "88", name: "san:logs" });
    expect(mentions.roles.get("20")).toEqual({ id: "20", color: "clr:#200000", name: "san:admin" });
    expect(mentions.roles.get("99")).toEqual({ id: "99", color: "clr:#990000", name: "san:ops" });
    expect(mentions.users.get("30")).toEqual({ id: "30", color: "clr:#003000", name: "san:member-30" });
    expect(mentions.users.get("77")).toEqual({ id: "77", color: null, name: "san:fallback-user" });

    expect(rolesFetch).toHaveBeenCalledWith("99");
    expect(channelsFetch).toHaveBeenCalledWith("88");
    expect(membersFetch).toHaveBeenCalledWith("77");
    expect(clientUsersFetch).toHaveBeenCalledWith("77");
  });

  it("uses message.mentions.users when members collection is unavailable", async () => {
    const mentions = {
      channels: new Map<string, any>(),
      roles: new Map<string, any>(),
      users: new Map<string, any>(),
    };

    const message = {
      content: "",
      mentions: {
        channels: new Map(),
        roles: new Map(),
        members: null,
        users: new Map([["u1", { id: "u1", hexAccentColor: "#abcdef", displayName: "direct-user" }]]),
      },
      guild: null,
      client: { users: { fetch: vi.fn() } },
    } as any;

    await getMentions(message, mentions as any);

    expect(mentions.users.get("u1")).toEqual({
      id: "u1",
      color: "clr:#abcdef",
      name: "san:direct-user",
    });
  });
});
