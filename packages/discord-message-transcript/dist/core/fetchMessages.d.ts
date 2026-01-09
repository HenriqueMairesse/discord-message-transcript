import { TextBasedChannel } from "discord.js";
import { JsonMessage, TranscriptOptions } from "../types/types";
export declare function fetchMessages(channel: TextBasedChannel, options: TranscriptOptions, after?: string): Promise<{
    messages: JsonMessage[];
    end: boolean;
}>;
