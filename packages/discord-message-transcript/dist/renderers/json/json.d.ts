import { Guild, TextBasedChannel } from "discord.js";
import { ArrayMentions, JsonAuthor, JsonMessage, TranscriptOptionsBase, JsonData } from "discord-message-transcript-base";
import { CDNOptions } from "@/types";
export declare class Json {
    private guild;
    private channel;
    private authors;
    private messages;
    private options;
    private mentions;
    private cdnOptions;
    private urlCache;
    constructor(guild: Guild | null, channel: TextBasedChannel, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>);
    addMessages(messages: JsonMessage[]): void;
    sliceMessages(size: number): void;
    setMessages(messages: JsonMessage[]): void;
    getMessages(): JsonMessage[];
    setAuthors(authors: JsonAuthor[]): void;
    setMentions(mentions: ArrayMentions): void;
    toJson(): Promise<JsonData>;
}
