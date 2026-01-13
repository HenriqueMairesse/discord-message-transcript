import { ReturnType as ReturnTypeBase, ReturnFormat, JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers } from "discord-message-transcript-base/types/types";

export type ReturnType = "attachment" | ReturnTypeBase;

export interface CreateTranscriptOptions {
    /**
     * The name of the file to be created.
     * @default `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`
     */
    fileName?: string,
    /**
     * Whether to include attachments in the transcript.
     * @default true
     */
    includeAttachments?: boolean,
    /**
     * Whether to include buttons in the transcript.
     * @default true
     */
    includeButtons?: boolean,
    /**
     * Whether to include components in the transcript.
     * @default true
     */
    includeComponents?: boolean,
    /**
     * Whether to include empty messages in the transcript.
     * @default false
     */
    includeEmpty?: boolean,
    /**
     * Whether to include embeds in the transcript.
     * @default true
     */
    includeEmbeds?: boolean,
    /**
     * Whether to include polls in the transcript.
     * @default true
     */
    includePolls?: boolean,
    /**
     * Whether to include reactions in the transcript.
     * @default true
     */
    includeReactions?: boolean,
    /**
     * Whether to include V2 components in the transcript.
     * @default true
     */
    includeV2Components?: boolean,
    /**
     * The locale to use for formatting dates.
     * @default 'en-GB'
     */
    localDate?: Intl.LocalesArgument,
    /**
     * The maximum number of messages to fetch. Set to 0 to fetch all messages.
     * @default 0
     */
    quantity?: number,
    /**
     * The format of the returned transcript.
     * @default 'HTML'
     */
    returnFormat?: ReturnFormat,
    /**
     * The type of the returned value.
     * - `attachment` - A `Discord.AttachmentBuilder` object.
     * - `string` - The transcript content as a string.
     * - `buffer` - The transcript content as a `Buffer`.
     * - `stream` - The transcript content as a `Stream`.
     * - `uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default 'attachment'
     */
    returnType?: ReturnType,
    /**
     * Whether to save images locally or use remote URLs.
     * @default false
     */
    saveImages?: boolean,
    /**
     * Whether the generated HTML should be self-contained.
     * Only matters if `returnFormat` is `HTML`.
     * @default false
     */
    selfContained?: boolean,
    /**
     * The timezone to use for formatting dates.
     * @default 'UTC'
     */
    timeZone?: Intl.DateTimeFormatOptions["timeZone"],
}

/**
 * Options for converting a JSON transcript to HTML.
 */
export interface ConvertTranscriptOptions {
    /**
     * The type of the returned value.
     * - `attachment` - A `Discord.AttachmentBuilder` object.
     * - `string` - The transcript content as a string.
     * - `buffer` - The transcript content as a `Buffer`.
     * - `stream` - The transcript content as a `Stream`.
     * - `uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default 'attachment'
     */
    returnType?: ReturnType,
    /**
     * Whether the generated HTML should be self-contained.
     * @default false
     */
    selfContained?: boolean,
}

export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}
