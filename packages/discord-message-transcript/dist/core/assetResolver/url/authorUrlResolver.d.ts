import { JsonAuthor, TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { CDNOptions } from "../../../types/private/cdn.js";
export declare function authorUrlResolver(authors: Map<string, JsonAuthor>, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonAuthor[]>;
