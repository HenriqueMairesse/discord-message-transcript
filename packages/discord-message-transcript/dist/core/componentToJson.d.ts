import { TopLevelComponent } from "discord.js";
import { JsonTopLevelComponent, JsonComponentInContainer, TranscriptOptionsBase } from "discord-message-transcript-base";
export declare function componentsToJson(components: TopLevelComponent[], options: TranscriptOptionsBase): Promise<JsonTopLevelComponent[]>;
export declare function isJsonComponentInContainer(component: JsonTopLevelComponent): component is JsonComponentInContainer;
