import { CDNOptions } from "@/types/types.js";
import { JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base";
export declare function messagesUrlResolver(messages: JsonMessage[], options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonMessage[]>;
