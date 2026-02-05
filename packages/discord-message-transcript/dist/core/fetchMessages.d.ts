import { TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base";
import { MapMentions } from "../types/types.js";
export declare function fetchMessages(channel: TextBasedChannel, options: TranscriptOptionsBase, authors: Map<string, JsonAuthor>, mentions: MapMentions, before?: string): Promise<{
    messages: JsonMessage[];
    end: boolean;
    lastMessageId?: string;
}>;
