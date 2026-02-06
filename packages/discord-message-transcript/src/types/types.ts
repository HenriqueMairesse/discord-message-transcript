import { JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers, LocalDate, TimeZone, Uploadable, ReturnFormat } from "discord-message-transcript-base";
import { AttachmentBuilder } from "discord.js";
import Stream from 'stream';

/**
 * An enum-like object providing the possible return types for the transcript functions.
 */
export const ReturnType = {
    /**
     * Returns a `discord.js` AttachmentBuilder.
     */
    Attachment: "attachment",
    /**
     * Returns a `Buffer`.
     */
    Buffer: "buffer",
    /**
     * Returns a `Stream.Readable`.
     * */
    Stream: "stream",
    /**
     * Returns a `string`.
     * */
    String: "string",
    /**
     * Returns an `Uploadable` object with content, contentType, and fileName.
     */
    Uploadable: "uploadable"
} as const;

/**
 * The type representing the possible values of the `ReturnType` enum.
 */
export type ReturnType = typeof ReturnType[keyof typeof ReturnType];


/**
 * A conditional type that maps the `ReturnType` string literal to the actual TypeScript type returned by the function.
 * @template T The `ReturnType` literal.
 */
export type OutputType<T extends ReturnType> = 
    T extends typeof ReturnType.Buffer ? Buffer 
    : T extends typeof ReturnType.Stream ? Stream
    : T extends typeof ReturnType.String ? string
    : T extends typeof ReturnType.Uploadable ? Uploadable
    : AttachmentBuilder;

/**
 * Options for creating a transcript, with all properties being optional.
 * @see TranscriptOptions
 */
export type CreateTranscriptOptions<T extends ReturnType> = Partial<TranscriptOptions<T>>;

/**
 * Options for converting a JSON transcript to an HTML transcript.
 */
export type ConvertTranscriptOptions<T extends ReturnType> = Partial<{
    /**
     * The desired output type for the transcript.
     * - ReturnType.Attachment - The transcript content as a `Attachment`
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.Attachment
     */
    returnType: T,
    /**
     * Whether the generated HTML should have its CSS and JS embedded directly in the file.
     * @default false
     */
    selfContained: boolean,
    /**
     * Whether to include the 'Generated with discord-message-transcript' watermark in the footer.
     * @default true
     */
    watermark: boolean
}>;

/**
 * Defines the complete set of options for creating a transcript.
 */
export interface TranscriptOptions<T extends ReturnType> {
    /**
     * Configuration for uploading attachments and other assets to a CDN.
     */
    cdnOptions: CDNOptions,
    /**
     * The name of the generated file (without extension).
     * @default `Transcript-channel-name-channel-id`
     */
    fileName: string,
    /**
     * Whether to include attachments in the transcript.
     * @default true
     */
    includeAttachments: boolean,
    /**
     * Whether to include message component buttons in the transcript.
     * @default true
     */
    includeButtons: boolean,
    /**
     * Whether to include non-button message components (like select menus) in the transcript.
     * @default true
     */
    includeComponents: boolean,
    /**
     * Whether to include messages that have no content.
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
     * Whether to include message reactions in the transcript.
     * @default true
     */
    includeReactions: boolean,
    /**
     * Whether to include newer (V2) components like `Container`, `MediaGallery`, etc.
     * @default true
     */
    includeV2Components: boolean,
    /**
     * The locale to use for formatting dates (e.g., 'en-US', 'pt-BR').
     * Must be a valid BCP 47 language tag.
     * @default 'en-GB'
     */
    localDate: LocalDate,
    /**
     * The maximum number of messages to fetch. Set to `0` to fetch all messages in the channel.
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
     * The desired output type for the transcript.
     * - ReturnType.Attachment - The transcript content as a `Attachment`
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.Attachment
     */
    returnType: T,
    /**
     * Whether to save images as base64 data directly in the transcript.
     * This is an alternative to using a CDN and results in larger file sizes.
     * Will not work if using CDN.
     * @default false
     */
    saveImages: boolean,
    /**
     * Whether the generated HTML should have its CSS and JS embedded directly in the file.
     * Only applicable if `returnFormat` is `HTML`.
     * @default false
     */
    selfContained: boolean,
    /**
     * The timezone to use for formatting dates (e.g., 'UTC', 'America/New_York').
     * Must be a valid IANA time zone name.
     * @default 'UTC'
     */
    timeZone: TimeZone,
    /**
     * Whether to include the 'Generated with discord-message-transcript' watermark in the footer.
     * @default true
     */
    watermark: boolean
}

/**
 * Defines the structure for storing discovered mentions (users, roles, channels) during transcript creation.
 * Uses Maps for efficient lookups.
 */
export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}

/**
 * A string template type for representing a MIME type (e.g., 'image/png', 'application/json').
 */
export type MimeType = `${string}/${string}`;

/**
 * Base options applicable to all CDN providers.
 */
export type CDNBase = Partial<{
  /** 
   * Whether to upload audio files to the CDN. 
   * @default true 
   */
  includeAudio: boolean;
  /** 
   * Whether to upload image files (excluding GIFs) to the CDN.
   * @default true
   */
  includeImage: boolean;
  /**
   * Whether to upload video files (and GIFs) to the CDN.
   * @default true
   */
  includeVideo: boolean;
  /**
   * Whether to upload any other file types to the CDN.
   * @default true
   */
  includeOthers: boolean;
}>;

/**
 * A discriminated union of all possible CDN configurations.
 */
export type CDNOptions = 
    (CDNBase & CDNOptionsCustom<any>)
  | (CDNBase & CDNOptionsCloudinary)
  | (CDNBase & CDNOptionsUploadcare);

/**
 * Configuration for using a custom, user-provided CDN resolver function.
 */
export type CDNOptionsCustom<T = unknown> = {
    /** Specifies the use of a custom CDN resolver. */
    provider: "CUSTOM",
    /**
     * An async function that takes a URL and returns a new URL.
     * @param url The original Discord asset URL.
     * @param contentType The MIME type of the asset.
     * @param customData Any additional data you want to pass to your resolver.
     * @returns The new URL of the asset on your CDN.
     */
    resolver: (
        url: string,
        contentType: MimeType | null,
        customData: T
        ) => Promise<string> | string,
    /**
     * Any custom data you wish to make available within your resolver function.
     */
    customData: T,
}

/**
 * Configuration for using Cloudinary as the CDN.
 */
export type CDNOptionsCloudinary = {
    /**
     * Specifies the use of the built-in Cloudinary provider.
     */
    provider: "CLOUDINARY",
    /**
     * Your Cloudinary cloud name.
     */
    cloudName: string;
    /**
     * Your Cloudinary API key.
     * */
    apiKey: string;
    /** 
     * Your Cloudinary API secret.
    */
    apiSecret: string;
}

/**
 * Configuration for using Uploadcare as the CDN.
 */
export type CDNOptionsUploadcare = {
    /**
     * Specifies the use of the built-in Uploadcare provider.
     */
    provider: "UPLOADCARE",
    /**
     * Your Uploadcare public key.
     */
    publicKey: string,
    /**
     * Your Uploadcare CDN domain.
     * Example: "aaa111aaa1.ucarecd.net".
     * DO NOT INCLUDE https://
     */
    cdnDomain: string,
}
