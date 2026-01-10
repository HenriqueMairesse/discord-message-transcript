import { TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptions } from "../types/types";
export declare function fetchMessages(channel: TextBasedChannel, options: TranscriptOptions, authors: Map<string, JsonAuthor>, after?: string): Promise<{
    messages: JsonMessage[];
    end: boolean;
}>;
