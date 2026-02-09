import { JsonAuthor, JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions, safeUrlReturn } from "@/types";
export declare function urlResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string>;
export declare function messagesUrlResolver(messages: JsonMessage[], options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonMessage[]>;
export declare function authorUrlResolver(authors: Map<string, JsonAuthor>, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonAuthor[]>;
