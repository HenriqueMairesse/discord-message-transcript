import { TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions, MapMentions } from "../types/types.js";
export declare function fetchMessages(channel: TextBasedChannel, options: TranscriptOptionsBase, cdnOptions: CDNOptions<unknown> | null, authors: Map<string, JsonAuthor>, mentions: MapMentions, after?: string): Promise<{
    messages: JsonMessage[];
    end: boolean;
}>;
