import { Guild, TextBasedChannel } from "discord.js";
import { JsonData, JsonMessage } from "../../types/types";
export declare class Json {
    guild: Guild | null;
    channel: TextBasedChannel;
    messages: JsonMessage[];
    constructor(guild: Guild | null, channel: TextBasedChannel);
    addMessages(messages: JsonMessage[]): void;
    sliceMessages(size: number): void;
    toJson(): Promise<JsonData>;
}
