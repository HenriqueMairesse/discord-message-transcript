import { Guild, TextBasedChannel } from "discord.js";
import { JsonData, JsonMessage, TranscriptOptions } from "../../types/types";
export declare class Json {
    guild: Guild | null;
    channel: TextBasedChannel;
    messages: JsonMessage[];
    options: TranscriptOptions;
    constructor(guild: Guild | null, channel: TextBasedChannel, options: TranscriptOptions);
    addMessages(messages: JsonMessage[]): void;
    sliceMessages(size: number): void;
    toJson(): Promise<JsonData>;
}
