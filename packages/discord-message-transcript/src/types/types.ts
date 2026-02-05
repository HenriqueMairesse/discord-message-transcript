import { JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers, LocalDate, TimeZone, Uploadable, ReturnFormat } from "discord-message-transcript-base";
import { AttachmentBuilder } from "discord.js";
import Stream from 'stream';

export const ReturnType = {
    Attachment: "attachment",
    Buffer: "buffer",
    Stream: "stream",
    String: "string",
    Uploadable: "uploadable"
} as const;

export type ReturnType = typeof ReturnType[keyof typeof ReturnType];


export type OutputType<T extends ReturnType> = 
    T extends typeof ReturnType.Buffer ? Buffer 
    : T extends typeof ReturnType.Stream ? Stream
    : T extends typeof ReturnType.String ? string
    : T extends typeof ReturnType.Uploadable ? Uploadable
    : AttachmentBuilder

export type CreateTranscriptOptions<T extends ReturnType> = Partial<TranscriptOptions<T>>

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
    returnType: T,
    /**
     * Whether the generated HTML should be self-contained (CSS and JS in HTML).
     * @default false
     */
    selfContained: boolean,
    /**
     * If you want to include the watermark.
     * @default true
     */
    watermark: boolean
}>;

export interface TranscriptOptions<T extends ReturnType, Other = unknown> {
    /**
     * CDN Options
     */
    cdnOptions: CDNOptions,
    /**
     * The name of the file to be created.
     * Default depends if is DM or Guild
     */
    fileName: string,
    /**
     * Whether to include attachments in the transcript.
     * @default true
     */
    includeAttachments: boolean,
    /**
     * Whether to include buttons in the transcript.
     * @default true
     */
    includeButtons: boolean,
    /**
     * Whether to include components in the transcript.
     * @default true
     */
    includeComponents: boolean,
    /**
     * Whether to include empty messages in the transcript.
     * @default false
     */
    includeEmpty: boolean,
    /**
     * Whether to include embeds in the transcript.
     * @default true
     */
    includeEmbeds: boolean,
    /**
     * Whether to include polls in the transcript.
     * @default true
     */
    includePolls: boolean,
    /**
     * Whether to include reactions in the transcript.
     * @default true
     */
    includeReactions: boolean,
    /**
     * Whether to include V2 components in the transcript.
     * @default true
     */
    includeV2Components: boolean,
    /**
     * The locale to use for formatting dates.
     * Can be any BCP 47 language tag.
     * @default 'en-GB'
     */
    localDate: LocalDate,
    /**
     * The maximum number of messages to fetch. Set to 0 to fetch all messages.
     * @default 0
     */
    quantity: number,
    /**
     * The format of the returned transcript.
     * - ReturnFormat.HTML - Returns the transcript as HTML
     * - ReturnFormat.JSON - Returns the transcript as JSON
     * @default ReturnFormat.HTML
     */
    returnFormat: ReturnFormat,
    /**
     * The type of the returned value.
     * - ReturnType.Attachment - The transcript content as a `Attachment`
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.Attachment
     */
    returnType: T,
    /**
     * Whether to save images locally or use remote URLs.
     * @default false
     */
    saveImages: boolean,
    /**
     * Whether the generated HTML should be self-contained.
     * Only matters if `returnFormat` is `HTML`.
     * @default false
     */
    selfContained: boolean,
    /**
     * The timezone to use for formatting dates.
     * Can be any IANA time zone name.
     * @default 'UTC'
     */
    timeZone: TimeZone,
    /**
     * If you want to include the watermark.
     * @default true
     */
    watermark: boolean
}
    
export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}

export type MimeType = `${string}/${string}`;

export type CDNBase = Partial<{
  includeAudio: boolean;
  includeImage: boolean;
  includeVideo: boolean;
  includeOthers: boolean;
}>;

export type CDNOptions = 
    (CDNBase & CDNOptionsCustom<any>)
  | (CDNBase & CDNOptionsCloudinary)
  | (CDNBase & CDNOptionsUploadcare);

export type CDNOptionsCustom<T = unknown> = {
    provider: "CUSTOM",
    resolver: (
        url: string,
        contentType: MimeType | null,
        customData: T
        ) => Promise<string> | string,
    customData: T,
}

export type CDNOptionsCloudinary = {
    provider: "CLOUDINARY",
    cloudName: string;
    apiKey: string;
    apiSecret: string;
}

export type CDNOptionsUploadcare = {
    provider: "UPLOADCARE",
    publicKey: string
}