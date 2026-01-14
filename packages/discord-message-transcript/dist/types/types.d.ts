import { JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers, ReturnType, TranscriptOptions, Uploadable } from "discord-message-transcript-base";
import { AttachmentBuilder } from "discord.js";
import Stream from 'stream';
export type OutputType<T extends ReturnType> = T extends ReturnType.Buffer ? Buffer : T extends ReturnType.Stream ? Stream : T extends ReturnType.String ? string : T extends ReturnType.Uploadable ? Uploadable : AttachmentBuilder;
export type CreateTranscriptOptions<T extends ReturnType> = Partial<TranscriptOptions<T>>;
export type ConvertTranscriptOptions<T extends ReturnType> = Partial<{
    /**
     * The type of the returned value.
     * - ReturnType.Attachment - The transcript content as a `Attachment`
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.Attachment
     */
    returnType: T;
    /**
     * Whether the generated HTML should be self-contained (CSS and JS in HTML).
     * @default false
     */
    selfContained: boolean;
}>;
export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}
