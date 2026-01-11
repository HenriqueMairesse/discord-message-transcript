import { ReactionManager } from "discord.js";

export type ReturnFormat = "HTML" | "JSON";
export type ReturnType = "string" | "attachment" | "uploadable" | "stream" | "buffer";
export type StyleTimeStampKey = "t" | "T" | "d" | "D" | "f" | "F";

export interface CreateTranscriptOptions {
    fileName?: string,
    returnFormat?: ReturnFormat,
    returnType?: ReturnType,
    quantity?: number,
    includeEmbeds?: boolean,
    includeAttachments?: boolean,
    includeComponents?: boolean,
    includeV2Components?: boolean,
    includeButtons?: boolean,
    includeEmpty?: boolean,
    includePolls?: boolean,
    includeReactions?: boolean,
    timeZone?: TimeZone,
    localDate?: Locale,
    saveImages?: boolean,
}

export interface TranscriptOptions {
    fileName: string,
    returnFormat: ReturnFormat,
    returnType: ReturnType,
    quantity: number,
    includeEmbeds: boolean,
    includeAttachments: boolean,
    includeComponents: boolean,
    includeV2Components: boolean,
    includeButtons: boolean,
    includeEmpty: boolean,
    includePolls: boolean,
    includeReactions: boolean,
    timeZone: TimeZone,
    localDate: Locale,
    saveImages: boolean,
}

export interface Uploadable {
    content: string,
    contentType: "application/json" | "text/html",
    fileName: string,
}

export interface JsonMessage {
    attachments: JsonAttachment[],
    authorId: string,
    components: JsonTopLevelComponent[],
    content: string,
    createdTimestamp: number,
    embeds: JsonEmbed[],
    id: string,
    mentions: JsonMessageMentions,
    poll: JsonPoll | null,
    system: boolean,
    references: {
        messageId: string | null
    } | null,
    reactions: JsonReaction[]
}

export interface JsonReaction {
    emoji: string,
    count: number,
}

export interface JsonPoll {
    question: string;
    answers: JsonPollAnswer[];
    isFinalized: boolean;
    expiry: number | null;
}

export interface JsonPollAnswer {
    id: number;
    text: string;
    emoji: {
        id: string | null,
        name: string | null,
        animated: boolean,
    } | null,
    count: number
}

export interface JsonAttachment {
    contentType: string | null,
    name: string,
    size: number,
    spoiler: boolean,
    url: string,
}

export interface JsonEmbed {
    author: {
        name: string,
        url: string | null,
        iconURL: string | null,
    } | null,
    title: string | null,
    thumbnail: {
        url: string,
    } | null,
    hexColor: string | null,
    description: string | null,
    fields: {
        inline: boolean | null,
        name: string,
        value: string,
    }[],
    image: {
        url: string,
    } | null,
    footer: {
        iconURL: string | null,
        text: string,
    } | null,
    timestamp: string | null,
    type: string,
    url: string | null,
}

export interface JsonMessageMentions {
    users: {
        id: string,
        name: string,
        color: string | null,
    }[],
    channels: {
        id: string,
        name: string | null,
    }[],
    roles: {
        id: string,
        name: string,
        color: string,
    }[],
    everyone: boolean,
}

export type JsonTopLevelComponent = JsonActionRow | JsonButtonComponent | JsonSelectMenu | JsonV2Component;

export interface JsonActionRow {
    type: JsonComponentType.ActionRow,
    components: (JsonButtonComponent | JsonSelectMenu)[],
}

export enum JsonButtonStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5,
    Premium = 6,
}

export interface JsonButtonComponent {
    type: JsonComponentType.Button,
    style: JsonButtonStyle,
    label: string | null,
    emoji: {
        id: string | null,
        name: string | null,
        animated: boolean,
    } | null,
    url: string | null,
    disabled: boolean,
}

export type JsonSelectMenu = JsonSelectMenuOthers | JsonSelectMenuString

interface JsonSelectMenuOthers {
    type: JsonComponentType.UserSelect | JsonComponentType.RoleSelect | JsonComponentType.MentionableSelect | JsonComponentType.ChannelSelect,
    placeholder: string | null,
    disabled: boolean,
}

interface JsonSelectMenuString {
    type: JsonComponentType.StringSelect,
    placeholder: string | null,
    disabled: boolean,
    options: JsonSelectOption[],
}

export interface JsonSelectOption {
    label: string,
    description: string | null,
    emoji: {
        id: string | null,
        name: string | null,
        animated: boolean,
    } | null,
}

export type JsonV2Component = JsonContainerComponent | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent | JsonThumbnailComponent;

export type JsonComponentInContainer = JsonActionRow | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent;

export interface JsonContainerComponent {
    type: JsonComponentType.Container,
    components: JsonComponentInContainer[],
    hexAccentColor: string | null,
    spoiler: boolean,
}

export interface JsonFileComponent {
    type: JsonComponentType.File,
    fileName: string | null,
    size: number,
    url: string,
    spoiler: boolean,
}

export interface JsonMediaGalleryComponent {
    type: JsonComponentType.MediaGallery,
    items: {
        media: { url: string },
        spoiler: boolean,
    }[],
}

export interface JsonSectionComponent {
    type: JsonComponentType.Section,
    accessory: JsonButtonComponent | JsonThumbnailComponent,
    components: JsonTextDisplayComponent[],
}

export interface JsonSeparatorComponent {
    type: JsonComponentType.Separator,
    spacing: JsonSeparatorSpacingSize | null,
    divider: boolean,
}

export interface JsonTextDisplayComponent {
    type: JsonComponentType.TextDisplay,
    content: string,
}

export interface JsonThumbnailComponent {
    type: JsonComponentType.Thumbnail,
    media: {
        url: string,
    },
    spoiler: boolean,
}

export interface JsonData {
    guild: JsonDataGuild | null,
    channel: JsonDataChannel,
    authors: JsonAuthor[],
    messages: JsonMessage[],
    options: TranscriptOptions,
}

export interface JsonAuthor {
    avatarURL: string,
    bot: boolean,
    id: string,
    displayName: string,
    system: boolean,
    guildTag: string | null,
    member: {
        displayHexColor: string,
        displayName: string,
    } | null,
}

export interface JsonDataGuild {
    name: string,
    id: string,
    icon: string | null,
}

export interface JsonDataChannel {
    name: string,
    parent: {
        name: string,
        id: string,
    } | null,
    topic: string | null,
    id: string,
    img: string | null,
}

export type Locale = CommonLocales | (string & {});

export type TimeZone = CommonTimeZones | (string & {});

type CommonLocales =
    'en-US' |
    'en-GB' |
    'en-CA' |
    'en-AU' |
    'en-IN' |
    'pt-BR' |
    'pt-PT' |
    'es-ES' |
    'es-MX' |
    'es-AR' |
    'es-CO' |
    'fr-FR' |
    'fr-CA' |
    'fr-BE' |
    'de-DE' |
    'de-AT' |
    'de-CH' |
    'zh-CN' |
    'zh-TW' |
    'zh-HK' |
    'ar-SA' |
    'ar-EG' |
    'it-IT' |
    'ja-JP' |
    'ko-KR' |
    'ru-RU' |
    'hi-IN' |
    'bn-BD' |
    'bn-IN' |
    'nl-NL' |
    'nl-BE' |
    'sv-SE' |
    'da-DK' |
    'no-NO' |
    'fi-FI' |
    'pl-PL' |
    'tr-TR' |
    'th-TH' |
    'vi-VN' |
    'id-ID' |
    'ms-MY' |
    'he-IL' |
    'el-GR' |
    'cs-CZ' |
    'hu-HU' |
    'ro-RO' |
    'uk-UA' |
    'fa-IR' |
    'ur-PK';

type CommonTimeZones =
    'UTC' |
    'America/New_York' |
    'America/Los_Angeles' |
    'America/Sao_Paulo' |
    'America/Mexico_City' |
    'America/Argentina/Buenos_Aires' |
    'America/Bogota' |
    'America/Toronto' |
    'America/Vancouver' |
    'Europe/London' |
    'Europe/Paris' |
    'Europe/Berlin' |
    'Europe/Madrid' |
    'Europe/Rome' |
    'Europe/Lisbon' |
    'Europe/Brussels' |
    'Europe/Amsterdam' |
    'Europe/Stockholm' |
    'Europe/Copenhagen' |
    'Europe/Oslo' |
    'Europe/Helsinki' |
    'Europe/Warsaw' |
    'Europe/Istanbul' |
    'Europe/Moscow' |
    'Europe/Athens' |
    'Europe/Prague' |
    'Europe/Budapest' |
    'Europe/Kyiv' |
    'Asia/Tokyo' |
    'Asia/Shanghai' |
    'Asia/Taipei' |
    'Asia/Hong_Kong' |
    'Asia/Seoul' |
    'Asia/Kolkata' |
    'Asia/Riyadh' |
    'Asia/Dubai' |
    'Asia/Bangkok' |
    'Asia/Ho_Chi_Minh' |
    'Asia/Jakarta' |
    'Asia/Kuala_Lumpur' |
    'Asia/Manila' |
    'Asia/Dhaka' |
    'Asia/Tehran' |
    'Asia/Karachi' |
    'Asia/Jerusalem' |
    'Africa/Cairo' |
    'Africa/Johannesburg' |
    'Africa/Lagos' |
    'Australia/Sydney' |
    'Australia/Melbourne' |
    'Australia/Perth' |
    'Pacific/Auckland';

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

export enum JsonSeparatorSpacingSize {
    Small = 1,
    Large = 2,
}
