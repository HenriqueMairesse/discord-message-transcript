import { LocalDate, ReturnFormat, TimeZone } from "discord-message-transcript-base/internal";
import { CDNOptions } from "./cdn.js";
import { ReturnType } from "../public/return.js";
/**
 * Defines the complete set of options for creating a transcript.
 */
export interface TranscriptOptions<T extends ReturnType> {
    /**
     * Configuration for uploading attachments and other assets to a CDN.
     */
    cdnOptions: CDNOptions;
    /**
     * Disable all warnings to keep console output clean.
     * ⚠️ Can hide issues like unsafe URLs or fallback usage.
     * @default false
     */
    disableWarnings: boolean;
    /**
     * The name of the generated file (without extension).
     * @default `Transcript-channel-name-channel-id`
     */
    fileName: string;
    /**
     * Whether to include attachments in the transcript.
     * @default true
     */
    includeAttachments: boolean;
    /**
     * Whether to include message component buttons in the transcript.
     * @default true
     */
    includeButtons: boolean;
    /**
     * Whether to include non-button message components (like select menus) in the transcript.
     * @default true
     */
    includeComponents: boolean;
    /**
     * Whether to include messages that have no content.
     * @default false
     */
    includeEmpty: boolean;
    /**
     * Whether to include embeds in the transcript.
     * @default true
     */
    includeEmbeds: boolean;
    /**
     * Whether to include polls in the transcript.
     * @default true
     */
    includePolls: boolean;
    /**
     * Whether to include message reactions in the transcript.
     * @default true
     */
    includeReactions: boolean;
    /**
     * Whether to include newer (V2) components like `Container`, `MediaGallery`, etc.
     * @default true
     */
    includeV2Components: boolean;
    /**
     * The locale to use for formatting dates (e.g., 'en-US', 'pt-BR').
     * Must be a valid BCP 47 language tag.
     * @default 'en-GB'
     */
    localDate: LocalDate;
    /**
     * The maximum number of messages to fetch. Set to `0` to fetch all messages in the channel.
     * @default 0
     */
    quantity: number;
    /**
     * The format of the returned transcript.
     * - ReturnFormat.HTML - Returns the transcript as HTML
     * - ReturnFormat.JSON - Returns the transcript as JSON
     * @default ReturnFormat.HTML
     */
    returnFormat: ReturnFormat;
    /**
     * The desired output type for the transcript.
     * - ReturnType.Attachment - The transcript content as a `Attachment`
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.Attachment
     */
    returnType: T;
    /**
     * Enables safe mode, blocking potentially unsafe URLs and content.
     * Prevents suspicious links, images, or HTML from being included in the final transcript.
     *
     * ⚠️ Disabling may allow unsafe content to appear in the transcript.
     * @default true
     */
    safeMode: boolean;
    /**
     * Whether to save images as base64 data directly in the transcript.
     * This is an alternative to using a CDN and results in larger file sizes.
     * Will not work if using CDN.
     * @default false
     */
    saveImages: boolean;
    /**
     * Whether the generated HTML should have its CSS and JS embedded directly in the file.
     * Only applicable if `returnFormat` is `HTML`.
     * @default false
     */
    selfContained: boolean;
    /**
     * The timezone to use for formatting dates (e.g., 'UTC', 'America/New_York').
     * Must be a valid IANA time zone name.
     * @default 'UTC'
     */
    timeZone: TimeZone;
    /**
     * Whether to include the 'Generated with discord-message-transcript' watermark in the footer.
     * @default true
     */
    watermark: boolean;
}
