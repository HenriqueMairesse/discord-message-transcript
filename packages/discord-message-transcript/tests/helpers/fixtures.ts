import type { TextBasedChannel } from "discord.js";

export function createBaseJsonData(options: Record<string, unknown> = {}) {
  return {
    options: {
      fileName: "fixture",
      localDate: "en-US",
      timeZone: "UTC",
      watermark: true,
      ...options,
    },
    authors: [],
    channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
    guild: null,
    messages: [],
    mentions: { channels: [], roles: [], users: [] },
  };
}

export function createDmChannel(id = "123", name = "test") {
  const channel = {
    id,
    name,
    client: { user: { id: "bot" } },
    isDMBased: () => true,
  };
  return channel as unknown as TextBasedChannel;
}

export function createGuildChannelWithoutPermissions(
  id = "123",
  name = "locked-channel",
  hasPermission: (perm: string) => boolean = () => false,
) {
  const channel = {
    id,
    name,
    client: { user: { id: "bot" } },
    isDMBased: () => false,
    permissionsFor: () => ({
      has: hasPermission,
    }),
  };
  return channel as unknown as TextBasedChannel;
}

export function createMaps() {
  return {
    authors: new Map(),
    mentions: { channels: new Map(), roles: new Map(), users: new Map() },
    urlCache: new Map<string, Promise<string>>(),
  };
}
