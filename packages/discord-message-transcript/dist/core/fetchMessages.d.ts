import { TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base";
import { MapMentions } from "@/types";
export declare function fetchMessages(ctx: FetchMessagesContext): Promise<{
    messages: JsonMessage[];
    end: boolean;
    newLastMessageId: string | undefined;
}>;
export type FetchMessagesContext = {
    channel: TextBasedChannel;
    options: TranscriptOptionsBase;
    transcriptState: TranscriptState;
    lastMessageId: string | undefined;
};
type TranscriptState = {
    authors: Map<string, JsonAuthor>;
    mentions: MapMentions;
};
export {};
