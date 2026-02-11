import { Json } from "../../renderers/json/json.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { Maps } from "../../types/private/maps.js";
import { CDNOptions } from "../../types/private/cdn.js";
export * from "./limiter.js";
export * from "./url/imageUrlResolver.js";
export * from "./url/urlResolver.js";
export declare function jsonAssetResolver(jsonTranscript: Json, maps: Maps, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<void>;
