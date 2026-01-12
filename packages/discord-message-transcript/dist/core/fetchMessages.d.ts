import { TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptions } from "discord-message-transcript-base/types/types";
import { MapMentions } from "../types/types.js";
export declare function fetchMessages(channel: TextBasedChannel, options: TranscriptOptions, authors: Map<string, JsonAuthor>, mentions: MapMentions, after?: string): Promise<{
    messages: JsonMessage[];
    end: boolean;
}>;
