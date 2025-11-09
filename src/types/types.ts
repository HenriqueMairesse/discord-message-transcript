import { Attachment, Embed, MessageMentions, MessageReference, TopLevelComponent } from "discord.js";

export type ReturnFormat = "HTML" | "JSON";
export type ReturnType = "string" | "attachment" | 'uploadable' | 'stream' | 'buffer';
export type StyleTimeStampKey = 't' | 'T' | 'd' | 'D' | 'f' | 'F';

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
    timeZone?: TimeZone,
    localDate?: Locale,
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
    timeZone?: TimeZone,
    localDate: Locale
}

export interface Uploadable {
    content: string,
    contentType: "application/json" | "text/html",
    fileName: string,
}

export interface JsonMessage {
    attachments: Attachment[],
    author: {
        avatarURL: string,
        bot: boolean,
        id: string,
        displayName: string,
        system: boolean,
        guildTag: string | null
    },
    components: TopLevelComponent[],
    content: string,
    createdTimesptamp: number,
    embeds: Embed[],
    id: string,
    member: {
        displayHexColor: string,
        displayName: string,
    } | null,
    mentions: MessageMentions
    pinned: boolean,
    system: boolean,
    references: MessageReference | null
}

export interface JsonData {
    guild: JsonDataGuild | null,
    channel: JsonDataChannel,
    messages: JsonMessage[],
}

export interface JsonDataGuild {
    name: string;
    id: string;
    icon: string | null;
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
    'Europe/Bucharest' |
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
