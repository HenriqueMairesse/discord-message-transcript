export type JsonComponentInContainer = JsonActionRow | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent;
export type JsonSelectMenu = JsonSelectMenuOthers | JsonSelectMenuString;
export type JsonTopLevelComponent = JsonActionRow | JsonButtonComponent | JsonSelectMenu | JsonV2Component;
export type JsonV2Component = JsonContainerComponent | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent | JsonThumbnailComponent;
export type Locale = CommonLocales | (string & {});
export type ReturnFormat = "HTML" | "JSON";
export type ReturnType = "string" | "uploadable" | "stream" | "buffer";
export type ReturnTypeParse = "attachment" | ReturnType;
export type StyleTimeStampKey = "t" | "T" | "d" | "D" | "f" | "F";
export type TimeZone = CommonTimeZones | (string & {});
/**
 * Options for creating a transcript.
 */
export interface CreateTranscriptOptions {
    /**
     * The name of the file to be created.
     * @default `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`
     */
    fileName?: string;
    /**
     * Whether to include attachments in the transcript.
     * @default true
     */
    includeAttachments?: boolean;
    /**
     * Whether to include buttons in the transcript.
     * @default true
     */
    includeButtons?: boolean;
    /**
     * Whether to include components in the transcript.
     * @default true
     */
    includeComponents?: boolean;
    /**
     * Whether to include empty messages in the transcript.
     * @default false
     */
    includeEmpty?: boolean;
    /**
     * Whether to include embeds in the transcript.
     * @default true
     */
    includeEmbeds?: boolean;
    /**
     * Whether to include polls in the transcript.
     * @default true
     */
    includePolls?: boolean;
    /**
     * Whether to include reactions in the transcript.
     * @default true
     */
    includeReactions?: boolean;
    /**
     * Whether to include V2 components in the transcript.
     * @default true
     */
    includeV2Components?: boolean;
    /**
     * The locale to use for formatting dates.
     * @default 'en-GB'
     */
    localDate?: Locale;
    /**
     * The maximum number of messages to fetch. Set to 0 to fetch all messages.
     * @default 0
     */
    quantity?: number;
    /**
     * The format to return the transcript in.
     * @default 'HTML'
     */
    returnFormat?: ReturnFormat;
    /**
     * The type of the returned value.
     */
    returnType?: ReturnType;
    /**
     * Whether to save images locally or use remote URLs.
     * @default false
     */
    saveImages?: boolean;
    /**
     * Whether the generated HTML should be self-contained (CSS and JS in HTML).
     * Only matthers if returnFormat is 'HTML'
     * @default false
     */
    selfContained?: boolean;
    /**
     * The timezone to use for formatting dates.
     * @default 'UTC'
     */
    timeZone?: TimeZone;
}
export interface TranscriptOptions {
    fileName: string;
    includeAttachments: boolean;
    includeButtons: boolean;
    includeComponents: boolean;
    includeEmpty: boolean;
    includeEmbeds: boolean;
    includePolls: boolean;
    includeReactions: boolean;
    includeV2Components: boolean;
    localDate: Locale;
    quantity: number;
    returnFormat: ReturnFormat;
    returnType: ReturnType;
    saveImages: boolean;
    selfContained: boolean;
    timeZone: TimeZone;
}
export interface TranscriptOptionsParse {
    fileName: string;
    includeAttachments: boolean;
    includeButtons: boolean;
    includeComponents: boolean;
    includeEmpty: boolean;
    includeEmbeds: boolean;
    includePolls: boolean;
    includeReactions: boolean;
    includeV2Components: boolean;
    localDate: Locale;
    quantity: number;
    returnFormat: ReturnFormat;
    returnType: ReturnTypeParse;
    saveImages: boolean;
    selfContained: boolean;
    timeZone: TimeZone;
}
/**
 * Options for converting a JSON transcript to HTML.
 */
export interface ConvertTranscriptOptions {
    /**
     * The type of the returned value.
     */
    returnType?: ReturnType;
    /**
     * Whether the generated HTML should be self-contained (CSS and JS in HTML).
     * @default false
     */
    selfContained?: boolean;
}
export interface ArrayMentions {
    channels: JsonMessageMentionsChannels[];
    roles: JsonMessageMentionsRoles[];
    users: JsonMessageMentionsUsers[];
}
export interface JsonActionRow {
    components: (JsonButtonComponent | JsonSelectMenu)[];
    type: JsonComponentType.ActionRow;
}
export interface JsonAttachment {
    contentType: string | null;
    name: string;
    size: number;
    spoiler: boolean;
    url: string;
}
export interface JsonAuthor {
    avatarURL: string;
    bot: boolean;
    displayName: string;
    guildTag: string | null;
    id: string;
    member: {
        displayHexColor: string;
        displayName: string;
    } | null;
    system: boolean;
}
export interface JsonButtonComponent {
    disabled: boolean;
    emoji: string | null;
    label: string | null;
    style: JsonButtonStyle;
    type: JsonComponentType.Button;
    url: string | null;
}
export interface JsonContainerComponent {
    components: JsonComponentInContainer[];
    hexAccentColor: string | null;
    spoiler: boolean;
    type: JsonComponentType.Container;
}
export interface JsonData {
    authors: JsonAuthor[];
    channel: JsonDataChannel;
    guild: JsonDataGuild | null;
    messages: JsonMessage[];
    options: TranscriptOptions;
    mentions: ArrayMentions;
}
export interface JsonDataParse {
    authors: JsonAuthor[];
    channel: JsonDataChannel;
    guild: JsonDataGuild | null;
    messages: JsonMessage[];
    options: TranscriptOptionsParse;
    mentions: ArrayMentions;
}
export interface JsonDataChannel {
    id: string;
    img: string | null;
    name: string;
    parent: {
        name: string;
        id: string;
    } | null;
    topic: string | null;
}
export interface JsonDataGuild {
    icon: string | null;
    id: string;
    name: string;
}
export interface JsonEmbed {
    author: {
        name: string;
        url: string | null;
        iconURL: string | null;
    } | null;
    description: string | null;
    fields: {
        inline: boolean | null;
        name: string;
        value: string;
    }[];
    footer: {
        iconURL: string | null;
        text: string;
    } | null;
    hexColor: string | null;
    image: {
        url: string;
    } | null;
    thumbnail: {
        url: string;
    } | null;
    timestamp: string | null;
    title: string | null;
    type: string;
    url: string | null;
}
export interface JsonFileComponent {
    fileName: string | null;
    size: number;
    spoiler: boolean;
    type: JsonComponentType.File;
    url: string;
}
export interface JsonMediaGalleryComponent {
    items: {
        media: {
            url: string;
        };
        spoiler: boolean;
    }[];
    type: JsonComponentType.MediaGallery;
}
export interface JsonMessage {
    attachments: JsonAttachment[];
    authorId: string;
    components: JsonTopLevelComponent[];
    content: string;
    createdTimestamp: number;
    embeds: JsonEmbed[];
    id: string;
    mentions: boolean;
    poll: JsonPoll | null;
    reactions: JsonReaction[];
    references: {
        messageId: string | null;
    } | null;
    system: boolean;
}
export interface JsonMessageMentions {
    channels: JsonMessageMentionsChannels[];
    roles: JsonMessageMentionsRoles[];
    users: JsonMessageMentionsUsers[];
}
export interface JsonMessageMentionsChannels {
    id: string;
    name: string | null;
}
export interface JsonMessageMentionsRoles {
    id: string;
    name: string;
    color: string;
}
export interface JsonMessageMentionsUsers {
    id: string;
    name: string;
    color: string | null;
}
export interface JsonPoll {
    answers: JsonPollAnswer[];
    expiry: string | null;
    isFinalized: boolean;
    question: string;
}
export interface JsonPollAnswer {
    count: number;
    emoji: {
        id: string | null;
        name: string | null;
        animated: boolean;
    } | null;
    id: number;
    text: string;
}
export interface JsonReaction {
    count: number;
    emoji: string;
}
export interface JsonSectionComponent {
    accessory: JsonButtonComponent | JsonThumbnailComponent;
    components: JsonTextDisplayComponent[];
    type: JsonComponentType.Section;
}
export interface JsonSelectOption {
    description: string | null;
    emoji: {
        id: string | null;
        name: string | null;
        animated: boolean;
    } | null;
    label: string;
}
export interface JsonSeparatorComponent {
    divider: boolean;
    spacing: JsonSeparatorSpacingSize;
    type: JsonComponentType.Separator;
}
export interface JsonTextDisplayComponent {
    content: string;
    type: JsonComponentType.TextDisplay;
}
export interface JsonThumbnailComponent {
    media: {
        url: string;
    };
    spoiler: boolean;
    type: JsonComponentType.Thumbnail;
}
export interface Uploadable {
    content: string;
    contentType: "application/json" | "text/html";
    fileName: string;
}
export declare enum JsonButtonStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5,
    Premium = 6
}
export declare enum JsonComponentType {
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
    FileUpload = 19
}
export declare enum JsonSeparatorSpacingSize {
    Small = 1,
    Large = 2
}
interface JsonSelectMenuOthers {
    disabled: boolean;
    placeholder: string | null;
    type: JsonComponentType.UserSelect | JsonComponentType.RoleSelect | JsonComponentType.MentionableSelect | JsonComponentType.ChannelSelect;
}
interface JsonSelectMenuString {
    disabled: boolean;
    options: JsonSelectOption[];
    placeholder: string | null;
    type: JsonComponentType.StringSelect;
}
type CommonLocales = 'ar-EG' | 'ar-SA' | 'bn-BD' | 'bn-IN' | 'cs-CZ' | 'da-DK' | 'de-AT' | 'de-CH' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-CA' | 'en-GB' | 'en-IN' | 'en-US' | 'es-AR' | 'es-CO' | 'es-ES' | 'es-MX' | 'fa-IR' | 'fi-FI' | 'fr-BE' | 'fr-CA' | 'fr-FR' | 'he-IL' | 'hi-IN' | 'hu-HU' | 'id-ID' | 'it-IT' | 'ja-JP' | 'ko-KR' | 'ms-MY' | 'nl-BE' | 'nl-NL' | 'no-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ro-RO' | 'ru-RU' | 'sv-SE' | 'th-TH' | 'tr-TR' | 'uk-UA' | 'ur-PK' | 'vi-VN' | 'zh-CN' | 'zh-HK' | 'zh-TW';
type CommonTimeZones = 'Africa/Cairo' | 'Africa/Johannesburg' | 'Africa/Lagos' | 'America/Argentina/Buenos_Aires' | 'America/Bogota' | 'America/Los_Angeles' | 'America/Mexico_City' | 'America/New_York' | 'America/Sao_Paulo' | 'America/Toronto' | 'America/Vancouver' | 'Asia/Bangkok' | 'Asia/Dhaka' | 'Asia/Dubai' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Istanbul' | 'Asia/Jakarta' | 'Asia/Jerusalem' | 'Asia/Karachi' | 'Asia/Kolkata' | 'Asia/Kuala_Lumpur' | 'Asia/Manila' | 'Asia/Riyadh' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Taipei' | 'Asia/Tehran' | 'Asia/Tokyo' | 'Australia/Melbourne' | 'Australia/Perth' | 'Australia/Sydney' | 'Europe/Amsterdam' | 'Europe/Athens' | 'Europe/Berlin' | 'Europe/Brussels' | 'Europe/Budapest' | 'Europe/Copenhagen' | 'Europe/Helsinki' | 'Europe/Kyiv' | 'Europe/Lisbon' | 'Europe/London' | 'Europe/Madrid' | 'Europe/Moscow' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Prague' | 'Europe/Rome' | 'Europe/Stockholm' | 'Europe/Warsaw' | 'Pacific/Auckland' | 'UTC';
export {};
