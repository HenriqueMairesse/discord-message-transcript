import { JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers } from "./message/messageItens.js";
/**
 * A hexColor type
 */
export type hexColor = `#${string}`;
/**
 * A union of all possible timestamp styles for formatting dates and times in Discord.
 */
export type StyleTimeStampKey = "t" | "T" | "d" | "D" | "f" | "F";
/**
 * Represents a BCP 47 language tag for date/time formatting.
 */
export type LocalDate = 'ar-EG' | 'ar-SA' | 'bn-BD' | 'bn-IN' | 'cs-CZ' | 'da-DK' | 'de-AT' | 'de-CH' | 'de-DE' | 'el-GR' | 'en-AU' | 'en-CA' | 'en-GB' | 'en-IN' | 'en-US' | 'es-AR' | 'es-CO' | 'es-ES' | 'es-MX' | 'fa-IR' | 'fi-FI' | 'fr-BE' | 'fr-CA' | 'fr-FR' | 'he-IL' | 'hi-IN' | 'hu-HU' | 'id-ID' | 'it-IT' | 'ja-JP' | 'ko-KR' | 'ms-MY' | 'nl-BE' | 'nl-NL' | 'no-NO' | 'pl-PL' | 'pt-BR' | 'pt-PT' | 'ro-RO' | 'ru-RU' | 'sv-SE' | 'th-TH' | 'tr-TR' | 'uk-UA' | 'ur-PK' | 'vi-VN' | 'zh-CN' | 'zh-HK' | 'zh-TW' | (string & {});
/**
 * Represents an IANA time zone name for date/time formatting.
 */
export type TimeZone = 'Africa/Cairo' | 'Africa/Johannesburg' | 'Africa/Lagos' | 'America/Argentina/Buenos_Aires' | 'America/Bogota' | 'America/Los_Angeles' | 'America/Mexico_City' | 'America/New_York' | 'America/Sao_Paulo' | 'America/Toronto' | 'America/Vancouver' | 'Asia/Bangkok' | 'Asia/Dhaka' | 'Asia/Dubai' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Istanbul' | 'Asia/Jakarta' | 'Asia/Jerusalem' | 'Asia/Karachi' | 'Asia/Kolkata' | 'Asia/Kuala_Lumpur' | 'Asia/Manila' | 'Asia/Riyadh' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Taipei' | 'Asia/Tehran' | 'Asia/Tokyo' | 'Australia/Melbourne' | 'Australia/Perth' | 'Australia/Sydney' | 'Europe/Amsterdam' | 'Europe/Athens' | 'Europe/Berlin' | 'Europe/Brussels' | 'Europe/Budapest' | 'Europe/Copenhagen' | 'Europe/Helsinki' | 'Europe/Kyiv' | 'Europe/Lisbon' | 'Europe/London' | 'Europe/Madrid' | 'Europe/Moscow' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Prague' | 'Europe/Rome' | 'Europe/Stockholm' | 'Europe/Warsaw' | 'Pacific/Auckland' | 'UTC' | (string & {});
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
 * Represents an object that can be uploaded.
 */
export interface Uploadable {
    /**
     * The content to be uploaded.
     */
    content: string;
    /**
     * The MIME type of the content.
     */
    contentType: "application/json" | "text/html";
    /**
     * The name of the file.
     */
    fileName: string;
}
