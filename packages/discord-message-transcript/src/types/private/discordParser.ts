import { Json } from "@/renderers/json/json.js";
import { MapMentions, Maps } from "./maps.js";
import { TextBasedChannel } from "discord.js";
import { JsonAuthor, TranscriptOptionsBase } from "discord-message-transcript-base/internal";

export type ReturnDiscordParser = [
    json: Json,
    maps: Maps
]

export type FetchMessagesContext = {
    channel: TextBasedChannel,
    options: TranscriptOptionsBase,
    transcriptState: TranscriptState,
    lastMessageId: string | undefined,
};

export type TranscriptState = {
    authors: Map<string, JsonAuthor>,
    mentions: MapMentions,
}