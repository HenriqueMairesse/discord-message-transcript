import { JsonAuthor, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions } from "@/types/types.js";
export declare function authorUrlResolver(authors: Map<string, JsonAuthor>, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonAuthor[]>;
