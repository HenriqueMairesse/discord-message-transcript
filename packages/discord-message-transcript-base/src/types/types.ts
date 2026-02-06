import Stream from "stream";

/**
 * A union of all component types that can be placed inside a `JsonContainerComponent`.
 */
export type JsonComponentInContainer = JsonActionRow | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent;

/**
 * A union of all possible select menu types.
 */
export type JsonSelectMenu = JsonSelectMenuOthers | JsonSelectMenuString;

/**
 * A union of all top-level component types that can exist directly in a message.
 */
export type JsonTopLevelComponent = JsonActionRow | JsonButtonComponent | JsonSelectMenu | JsonV2Component;

/**
 * A union of all V2 component types.
 */
export type JsonV2Component = JsonContainerComponent | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent | JsonThumbnailComponent;

/**
 * A union of all possible timestamp styles for formatting dates and times in Discord.
 */
export type StyleTimeStampKey = "t" | "T" | "d" | "D" | "f" | "F";

/**
 * Represents a BCP 47 language tag for date/time formatting.
 */
export type LocalDate = 'ar-EG' | 'ar-SA' | 'bn-BD' | 'bn-IN' | 'cs-CZ' | 'da-DK' | 'de-AT' | 'de-CH' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-CA' | 'en-GB' | 'en-IN' | 'en-US' | 'es-AR' | 'es-CO' | 'es-ES' | 'es-MX' | 'fa-IR' | 'fi-FI' | 'fr-BE' | 'fr-CA' | 'fr-FR' | 'he-IL' | 'hi-IN' | 'hu-HU' | 'id-ID' | 'it-IT' | 'ja-JP' | 'ko-KR' | 'ms-MY' | 'nl-BE' | 'nl-NL' | 'no-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ro-RO' | 'ru-RU' | 'sv-SE' | 'th-TH' | 'tr-TR' | 'uk-UA' | 'ur-PK' | 'vi-VN' | 'zh-CN' | 'zh-HK' | 'zh-TW'
    | (string & {});

/**
 * Represents an IANA time zone name for date/time formatting.
 */
export type TimeZone = 'Africa/Cairo' | 'Africa/Johannesburg' | 'Africa/Lagos' | 'America/Argentina/Buenos_Aires' | 'America/Bogota' | 'America/Los_Angeles' | 'America/Mexico_City' | 'America/New_York' | 'America/Sao_Paulo' | 'America/Toronto' | 'America/Vancouver' | 'Asia/Bangkok' | 'Asia/Dhaka' | 'Asia/Dubai' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Istanbul' | 'Asia/Jakarta' | 'Asia/Jerusalem' | 'Asia/Karachi' | 'Asia/Kolkata' | 'Asia/Kuala_Lumpur' | 'Asia/Manila' | 'Asia/Riyadh' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Taipei' | 'Asia/Tehran' | 'Asia/Tokyo' | 'Australia/Melbourne' | 'Australia/Perth' | 'Australia/Sydney' | 'Europe/Amsterdam' | 'Europe/Athens' | 'Europe/Berlin' | 'Europe/Brussels' | 'Europe/Budapest' | 'Europe/Copenhagen' | 'Europe/Helsinki' | 'Europe/Kyiv' | 'Europe/Lisbon' | 'Europe/London' | 'Europe/Madrid' | 'Europe/Moscow' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Prague' | 'Europe/Rome' | 'Europe/Stockholm' | 'Europe/Warsaw' | 'Pacific/Auckland' | 'UTC' 
    | (string & {});

/**
 * A conditional type that maps a `ReturnTypeBase` literal to the actual TypeScript type.
 */
export type OutputTypeBase<T extends ReturnTypeBase> = 
    T extends typeof ReturnTypeBase.Buffer ? Buffer 
    : T extends typeof ReturnTypeBase.Stream ? Stream 
    : T extends typeof ReturnTypeBase.Uploadable ? Uploadable
    : string;

/**
 * An enum-like object for the possible return types, excluding 'attachment'.
 */
export const ReturnTypeBase = {
    /**
     * Returns a `Buffer`.
     */
    Buffer: "buffer",
    /**
     * Returns a `Stream.Readable`.
     */
    Stream: "stream",
    /**
     * Returns a `string`.
     */
    String: "string",
    /**
     * Returns an `Uploadable` object.
     */
    Uploadable: "uploadable"
} as const;

/**
 * A type representing the possible values of `ReturnTypeBase`.
 */
export type ReturnTypeBase = typeof ReturnTypeBase[keyof typeof ReturnTypeBase];

/**
 * An enum for all possible return types, used for parsing.
 */
export enum ReturnTypeParse {
    Attachment = "attachment",
    Buffer = "buffer",
    Stream = "stream",
    String = "string",
    Uploadable = "uploadable"
};

/**
 * An enum-like object for the possible transcript formats.
 */
export const ReturnFormat = {
  /**
   * JSON format.
   */
  JSON: "JSON",
  /**
   * HTML format.
   */
  HTML: "HTML"
} as const;

/**
 * A type representing the possible values of `ReturnFormat`.
 */
export type ReturnFormat = typeof ReturnFormat[keyof typeof ReturnFormat];

/**
 * Base options for creating a transcript.
 */
export interface TranscriptOptionsBase {
    /**
     * The name of the generated file.
     */
    fileName: string,
    /**
     * Whether to include attachments.
     */
    includeAttachments: boolean,
    /**
     * Whether to include buttons.
     */
    includeButtons: boolean,
    /**
     * Whether to include other components (like select menus).
     */
    includeComponents: boolean,
    /**
     * Whether to include empty messages.
     */
    includeEmpty: boolean,
    /**
     * Whether to include embeds.
     */
    includeEmbeds: boolean,
    /**
     * Whether to include polls.
     */
    includePolls: boolean,
    /**
     * Whether to include reactions.
     */
    includeReactions: boolean,
    /**
     * Whether to include V2 components.
     */
    includeV2Components: boolean,
    /**
     * The locale for date formatting.
     */
    localDate: LocalDate,
    /**
     * The number of messages to include.
     */
    quantity: number,
    /**
     * The format of the transcript (HTML or JSON).
     */
    returnFormat: ReturnFormat,
    /**
     * The type of the returned value (buffer, string, etc.).
     */
    returnType: ReturnTypeBase,
    /**
     * Whether to save images as base64.
     */
    saveImages: boolean,
    /**
     * Whether to generate a self-contained HTML file.
     */
    selfContained: boolean,
    /**
     * The timezone for date formatting.
     */
    timeZone: TimeZone,
    /**
     * Whether to include the watermark.
     */
    watermark: boolean
}

/**
 * Transcript options used for parsing, with a different `returnType`.
 */
export interface TranscriptOptionsParse {
    fileName: string,
    includeAttachments: boolean,
    includeButtons: boolean,
    includeComponents: boolean,
    includeEmpty: boolean,
    includeEmbeds: boolean,
    includePolls: boolean,
    includeReactions: boolean,
    includeV2Components: boolean,
    localDate: LocalDate,
    quantity: number,
    returnFormat: ReturnFormat,
    returnType: ReturnTypeParse,
    saveImages: boolean,
    selfContained: boolean,
    timeZone: TimeZone,
    watermark: boolean
}

/**
 * Options for converting a JSON transcript to HTML.
 */
export type ConvertTranscriptOptions<T extends ReturnTypeBase> = Partial<{
    /**
     * The desired output type for the transcript.
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.String
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

/**
 * Structure containing arrays of all mentions found in the transcript.
 */
export interface ArrayMentions {
    /**
     * An array of mentioned channels.
     */
    channels: JsonMessageMentionsChannels[];
    /**
     * An array of mentioned roles.
     */
    roles: JsonMessageMentionsRoles[];
    /**
     * An array of mentioned users.
     */
    users: JsonMessageMentionsUsers[];
}

/**
 * A JSON-serializable representation of a Discord Action Row component.
 */
export interface JsonActionRow {
    /**
     * The components within the action row (e.g., buttons, select menus).
     */
    components: (JsonButtonComponent | JsonSelectMenu)[],
    /**
     * The type of the component.
     */
    type: JsonComponentType.ActionRow,
}

/**
 * A JSON-serializable representation of a message attachment.
 */
export interface JsonAttachment {
    /**
     * The MIME type of the attachment.
     */
    contentType: string | null,
    /**
     * The name of the attachment file.
     */
    name: string,
    /**
     * The size of the attachment in bytes.
     */
    size: number,
    /**
     * Whether the attachment is a spoiler.
     */
    spoiler: boolean,
    /**
     * The URL of the attachment.
     */
    url: string,
}

/**
 * A JSON-serializable representation of a message author.
 */
export interface JsonAuthor {
    /**
     * The URL of the author's avatar.
     */
    avatarURL: string,
    /**
     * Whether the author is a bot.
     */
    bot: boolean,
    /**
     * The display name of the author.
     */
    displayName: string,
    /**
     * The guild-specific tag of the author, if any.
     */
    guildTag: string | null,
    /**
     * The ID of the author.
     */
    id: string,
    /**
     * Information about the author as a guild member.
     */
    member: {
        /**
         * The member's display color in hex format.
         */
        displayHexColor: string,
        /**
         * The member's display name in the guild.
         */
        displayName: string,
    } | null,
    /**
     * Whether the author is a system user.
     */
    system: boolean,
}

/**
 * A JSON-serializable representation of a button component.
 */
export interface JsonButtonComponent {
    /**
     * Whether the button is disabled.
     */
    disabled: boolean,
    /**
     * The emoji on the button, if any.
     */
    emoji: string | null,
    /**
     * The label text on the button.
     */
    label: string | null,
    /**
     * The style of the button.
     */
    style: JsonButtonStyle,
    /**
     * The type of the component.
     */
    type: JsonComponentType.Button,
    /**
     * The URL for link-style buttons.
     */
    url: string | null,
}

/**
 * A JSON-serializable representation of a V2 container component.
 */
export interface JsonContainerComponent {
    /**
     * The components inside the container.
     */
    components: JsonComponentInContainer[],
    /**
     * The accent color of the container's border.
     */
    hexAccentColor: string | null,
    /**
     * Whether the container's content is a spoiler.
     */
    spoiler: boolean,
    /**
     * The type of the component.
     */
    type: JsonComponentType.Container,
}

/**
 * The root object for a JSON transcript, containing all data.
 */
export interface JsonData {
    /**
     * A list of all unique authors in the transcript.
     */
    authors: JsonAuthor[],
    /**
     * Information about the channel where the transcript was created.
     */
    channel: JsonDataChannel,
    /**
     * Information about the guild.
     */
    guild: JsonDataGuild | null,
    /**
     * An array of all messages in the transcript.
     */
    messages: JsonMessage[],
    /**
     * The options used to create this transcript.
     */
    options: TranscriptOptionsBase,
    /**
     * A list of all mentions found in the messages.
     */
    mentions: ArrayMentions,
}

/**
 * The root object for a JSON transcript, used for parsing.
 */
export interface JsonDataParse {
    authors: JsonAuthor[],
    channel: JsonDataChannel,
    guild: JsonDataGuild | null,
    messages: JsonMessage[],
    options: TranscriptOptionsParse,
    mentions: ArrayMentions
}

/**
 * A JSON-serializable representation of the transcript's channel.
 */
export interface JsonDataChannel {
    /**
     * The ID of the channel.
     */
    id: string,
    /**
     * The icon URL for the channel (e.g., for DMs).
     */
    img: string | null,
    /**
     * The name of the channel.
     */
    name: string,
    /**
     * The parent category of the channel, if any.
     */
    parent: {
        name: string,
        id: string,
    } | null,
    /**
     * The topic of the channel.
     */
    topic: string | null,
}

/**
 * A JSON-serializable representation of the transcript's guild.
 */
export interface JsonDataGuild {
    /**
     * The URL of the guild's icon.
     */
    icon: string | null,
    /**
     * The ID of the guild.
     */
    id: string,
    /**
     * The name of the guild.
     */
    name: string,
}

/**
 * A JSON-serializable representation of a message embed.
 */
export interface JsonEmbed {
    author: {
        name: string,
        url: string | null,
        iconURL: string | null,
    } | null,
    description: string | null,
    fields: {
        inline: boolean | null,
        name: string,
        value: string,
    }[],
    footer: {
        iconURL: string | null,
        text: string,
    } | null,
    hexColor: string | null,
    image: {
        url: string,
    } | null,
    thumbnail: {
        url: string,
    } | null,
    timestamp: string | null,
    title: string | null,
    type: string,
    url: string | null,
}

/**
 * A JSON-serializable representation of a V2 file component.
 */
export interface JsonFileComponent {
    /**
     * The name of the file.
     */
    fileName: string | null,
    /**
     * The size of the file in bytes.
     */
    size: number,
    /**
     * Whether the file is a spoiler.
     */
    spoiler: boolean,
    /**
     * The type of the component.
     */
    type: JsonComponentType.File,
    /**
     * The URL of the file.
     */
    url: string,
}

/**
 * A JSON-serializable representation of a V2 media gallery component.
 */
export interface JsonMediaGalleryComponent {
    /**
     * The items within the media gallery.
     */
    items: {
        media: { url: string },
        spoiler: boolean,
    }[],
    /**
     * The type of the component.
     */
    type: JsonComponentType.MediaGallery,
}

/**
 * A JSON-serializable representation of a Discord message.
 */
export interface JsonMessage {
    attachments: JsonAttachment[],
    authorId: string,
    components: JsonTopLevelComponent[],
    content: string,
    createdTimestamp: number,
    embeds: JsonEmbed[],
    id: string,
    mentions: boolean,
    poll: JsonPoll | null,
    reactions: JsonReaction[],
    references: {
        messageId: string | null
    } | null,
    system: boolean,
}

/**
 * Structure containing arrays of mentions found in a message.
 */
export interface JsonMessageMentions {
    channels: JsonMessageMentionsChannels[],
    roles: JsonMessageMentionsRoles[],
    users: JsonMessageMentionsUsers[],
}

/**
 * A JSON-serializable representation of a channel mention.
 */
export interface JsonMessageMentionsChannels {
    id: string,
    name: string | null,
}

/**
 * A JSON-serializable representation of a role mention.
 */
export interface JsonMessageMentionsRoles {
    id: string,
    name: string,
    color: string,
}

/**
 * A JSON-serializable representation of a user mention.
 */
export interface JsonMessageMentionsUsers {
    id: string,
    name: string,
    color: string | null,
}

/**
 * A JSON-serializable representation of a poll.
 */
export interface JsonPoll {
    /**
     * The answers available in the poll.
     */
    answers: JsonPollAnswer[];
    /**
     * A formatted string indicating when the poll expires.
     */
    expiry: string | null;
    /**
     * Whether the poll has been finalized.
     */
    isFinalized: boolean;
    /**
     * The question of the poll.
     */
    question: string;
}

/**
 * A JSON-serializable representation of a single answer in a poll.
 */
export interface JsonPollAnswer {
    /**
     * The number of votes for this answer.
     */
    count: number,
    /**
     * The emoji associated with this answer, if any.
     */
    emoji: {
        id: string | null,
        name: string | null,
        animated: boolean,
    } | null,
    /**
     * The ID of the answer.
     */
    id: number,
    /**
     * The text of the answer.
     */
    text: string,
}

/**
 * A JSON-serializable representation of a message reaction.
 */
export interface JsonReaction {
    /**
     * The number of times the emoji was reacted.
     */
    count: number,
    /**
     * The emoji that was reacted.
     */
    emoji: string,
}

/**
 * A JSON-serializable representation of a V2 section component.
 */
export interface JsonSectionComponent {
    /**
     * The accessory component on the right side of the section.
     */
    accessory: JsonButtonComponent | JsonThumbnailComponent,
    /**
     * The components inside the section.
     */
    components: JsonTextDisplayComponent[],
    /**
     * The type of the component.
     */
    type: JsonComponentType.Section,
}

/**
 * A JSON-serializable representation of an option in a select menu.
 */
export interface JsonSelectOption {
    /**
     * The description of the option.
     */
    description: string | null,
    /**
     * The emoji for the option, if any.
     */
    emoji: {
        id: string | null,
        name: string | null,
        animated: boolean,
    } | null,
    /**
     * The user-facing label for the option.
     */
    label: string,
}

/**
 * A JSON-serializable representation of a V2 separator component.
 */
export interface JsonSeparatorComponent {
    /**
     * Whether the separator is a visible line.
     */
    divider: boolean,
    /**
     * The spacing size of the separator.
     */
    spacing: JsonSeparatorSpacingSize,
    /**
     * The type of the component.
     */
    type: JsonComponentType.Separator,
}

/**
 * A JSON-serializable representation of a V2 text display component.
 */
export interface JsonTextDisplayComponent {
    /**
     * The content of the text display.
     */
    content: string,
    /**
     * The type of the component.
     */
    type: JsonComponentType.TextDisplay,
}

/**
 * A JSON-serializable representation of a V2 thumbnail component.
 */
export interface JsonThumbnailComponent {
    /**
     * The media information for the thumbnail.
     */
    media: {
        url: string,
    },
    /**
     * Whether the thumbnail is a spoiler.
     */
    spoiler: boolean,
    /**
     * The type of the component.
     */
    type: JsonComponentType.Thumbnail,
}

/**
 * Represents an object that can be uploaded.
 */
export interface Uploadable {
    /**
     * The content to be uploaded.
     */
    content: string,
    /**
     * The MIME type of the content.
     */
    contentType: "application/json" | "text/html",
    /**
     * The name of the file.
     */
    fileName: string,
}

/**
 * An enum representing the styles of a Discord button.
 */
export enum JsonButtonStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5,
    Premium = 6,
}

/**
 * An enum representing all known component types.
 */
export enum JsonComponentType {
    ActionRow = 1,
    Button = 2,
    StringSelect = 3,
    TextInput = 4,
    UserSelect = 5,
    RoleSelect = 6,
    MentionableSelect = 7,
    ChannelSelect = 8,
    Section = 9,
    TextDisplay = 10,
    Thumbnail = 11,
    MediaGallery = 12,
    File = 13,
    Separator = 14,
    ContentInventoryEntry = 16,
    Container = 17,
    Label = 18,
    FileUpload = 19,
}

/**
 * An enum representing the spacing size of a separator component.
 */
export enum JsonSeparatorSpacingSize {
    Small = 1,
    Large = 2,
}

/**
 * A JSON-serializable representation of a non-string select menu.
 */
interface JsonSelectMenuOthers {
    /**
     * Whether the select menu is disabled.
     */
    disabled: boolean,
    /**
     * The placeholder text for the select menu.
     */
    placeholder: string | null,
    /**
     * The type of the select menu.
     */
    type: JsonComponentType.UserSelect | JsonComponentType.RoleSelect | JsonComponentType.MentionableSelect | JsonComponentType.ChannelSelect,
}

/**
 * A JSON-serializable representation of a string select menu.
 */
interface JsonSelectMenuString {
    /**
     * Whether the select menu is disabled.
     */
    disabled: boolean,
    /**
     * The options available in the select menu.
     */
    options: JsonSelectOption[],
    /**
     * The placeholder text for the select menu.
     */
    placeholder: string | null,
    /**
     * The type of the select menu.
     */
    type: JsonComponentType.StringSelect,
}