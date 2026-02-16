export function createBaseJsonData(options: Record<string, unknown>) {
  return {
    options,
    authors: [],
    channel: { id: "c1", img: null, name: "chan", parent: null, topic: null },
    guild: null,
    messages: [],
    mentions: { channels: [], roles: [], users: [] },
  };
}
