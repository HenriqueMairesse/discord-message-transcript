import { Guild, TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonData, JsonMessage, TranscriptOptions } from "../../types/types";
export declare class Json {
    guild: Guild | null;
    channel: TextBasedChannel;
    authors: JsonAuthor[];
    messages: JsonMessage[];
    options: TranscriptOptions;
    constructor(guild: Guild | null, channel: TextBasedChannel, options: TranscriptOptions);
    addMessages(messages: JsonMessage[]): void;
    sliceMessages(size: number): void;
    setAuthors(authors: JsonAuthor[]): void;
    toJson(): Promise<JsonData>;
}
