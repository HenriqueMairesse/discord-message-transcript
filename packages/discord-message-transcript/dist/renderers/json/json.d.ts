import { Guild, TextBasedChannel } from "discord.js";
import { ArrayMentions, JsonAuthor, JsonMessage, TranscriptOptionsBase, JsonData } from "discord-message-transcript-base";
export declare class Json {
    guild: Guild | null;
    channel: TextBasedChannel;
    authors: JsonAuthor[];
    messages: JsonMessage[];
    options: TranscriptOptionsBase;
    mentions: ArrayMentions;
    constructor(guild: Guild | null, channel: TextBasedChannel, options: TranscriptOptionsBase);
    addMessages(messages: JsonMessage[]): void;
    sliceMessages(size: number): void;
    setAuthors(authors: JsonAuthor[]): void;
    setMentions(mentions: ArrayMentions): void;
    toJson(): Promise<JsonData>;
}
