import { JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { CDNOptions } from "../../../types/private/cdn.js";
export declare function messagesUrlResolver(messages: JsonMessage[], options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonMessage[]>;
