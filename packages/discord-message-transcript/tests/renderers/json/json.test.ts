import { beforeEach, describe, expect, it, vi } from "vitest";
import { Json } from "../../../src/renderers/json/json";
import { imageUrlResolver, urlResolver } from "../../../src/core/assetResolver/index";

vi.mock("../../../src/core/assetResolver/index", () => ({
  imageUrlResolver: vi.fn(),
  urlResolver: vi.fn(),
}));

describe("renderers/json/json.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("supports message mutators and slice behavior", () => {
    const json = new Json(null, {} as any, {} as any, null, new Map());

    json.addMessages([{ id: "1" } as any, { id: "2" } as any]);
    expect(json.getMessages().map((m: any) => m.id)).toEqual(["1", "2"]);

    json.sliceMessages(1);
    expect(json.getMessages().map((m: any) => m.id)).toEqual(["1"]);

    json.setMessages([{ id: "x" } as any]);
    expect(json.getMessages().map((m: any) => m.id)).toEqual(["x"]);
  });

  it("builds JsonData, resolves guild icon URL and reverses messages order", async () => {
    vi.mocked(imageUrlResolver)
      .mockResolvedValueOnce(null) // channel image
      .mockResolvedValueOnce({ safe: true, safeIps: [], url: "https://safe/guild.png" }); // guild icon
    vi.mocked(urlResolver).mockResolvedValue("https://cdn/guild.png");

    const fetchedChannel = {
      id: "c1",
      name: "general",
      parent: { id: "p1", name: "parent" },
      isDMBased: () => false,
    };

    const channel = {
      fetch: async () => fetchedChannel,
    } as any;

    const guild = {
      id: "g1",
      name: "Guild Name",
      iconURL: () => "https://origin/guild.png",
    } as any;

    const json = new Json(guild, channel, { fileName: "out", disableWarnings: false } as any, null, new Map());
    json.setAuthors([{ id: "a1" } as any]);
    json.setMentions({ channels: [{ id: "ch" } as any], roles: [], users: [] });
    json.setMessages([{ id: "m1" } as any, { id: "m2" } as any]);

    const result = await json.toJson();

    expect(result.guild).toEqual({
      id: "g1",
      name: "Guild Name",
      icon: "https://cdn/guild.png",
    });
    expect(result.channel).toEqual({
      id: "c1",
      name: "general",
      parent: { id: "p1", name: "parent" },
      topic: null,
      img: null,
    });
    expect(result.messages.map((m: any) => m.id)).toEqual(["m2", "m1"]);
    expect(urlResolver).toHaveBeenCalledTimes(1);
  });

  it("handles DM-like channels and resolves channel image through owner fallback", async () => {
    vi.mocked(imageUrlResolver).mockResolvedValueOnce({ safe: true, safeIps: [], url: "https://safe/dm-owner.png" });
    vi.mocked(urlResolver).mockResolvedValueOnce("https://cdn/dm-owner.png");

    const fetchedChannel = {
      id: "dm1",
      name: null,
      recipients: ["alice", "bob"],
      isDMBased: () => true,
      iconURL: () => null,
      fetchOwner: async () => ({ displayAvatarURL: () => "https://origin/owner.png" }),
      parent: null,
    };

    const channel = {
      fetch: async () => fetchedChannel,
    } as any;

    const json = new Json(null, channel, { fileName: "out", disableWarnings: false } as any, null, new Map());
    json.setMessages([]);
    json.setAuthors([]);
    json.setMentions({ channels: [], roles: [], users: [] });

    const result = await json.toJson();

    expect(result.guild).toBeNull();
    expect(result.channel.name).toBe("alice, bob");
    expect(result.channel.img).toBe("https://cdn/dm-owner.png");
  });

  it("keeps channel image null when image resolver returns null", async () => {
    vi.mocked(imageUrlResolver).mockResolvedValueOnce(null);

    const fetchedChannel = {
      id: "dm2",
      name: "dm",
      recipients: [],
      isDMBased: () => true,
      iconURL: () => null,
      fetchOwner: async () => ({ displayAvatarURL: () => "https://origin/owner.png" }),
      parent: null,
    };

    const channel = {
      fetch: async () => fetchedChannel,
    } as any;

    const json = new Json(null, channel, { fileName: "out", disableWarnings: false } as any, null, new Map());
    json.setMessages([]);
    json.setAuthors([]);
    json.setMentions({ channels: [], roles: [], users: [] });

    const result = await json.toJson();

    expect(result.channel.img).toBeNull();
    expect(urlResolver).not.toHaveBeenCalled();
  });
});
