import { TopLevelComponent } from "discord.js";
import { JsonTopLevelComponent, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions } from "../types/types.js";
export declare function componentsToJson(components: TopLevelComponent[], options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<JsonTopLevelComponent[]>;
