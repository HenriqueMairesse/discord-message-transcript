import { Json } from "@/renderers/json/json.js";
import { CDNOptions, Maps } from "@/types/types.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base";
export * from "./limiter.js";
export declare function jsonAssetResolver(jsonTranscript: Json, maps: Maps, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<void>;
