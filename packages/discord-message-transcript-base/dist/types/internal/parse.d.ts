import Stream from "stream";
import { ReturnType } from "../public/return.js";
import { JsonAuthor } from "./message/components.js";
import { JsonDataChannel, JsonDataGuild, JsonMessage } from "./message/messageItens.js";
import { ReturnFormat } from "./return.js";
import { ArrayMentions, LocalDate, TimeZone, Uploadable } from "./util.js";
export declare const ReturnTypeParse: {
    readonly Attachment: "attachment";
    readonly Buffer: "buffer";
    readonly Stream: "stream";
    readonly String: "string";
    readonly Uploadable: "uploadable";
};
export type ReturnTypeParse = typeof ReturnTypeParse[keyof typeof ReturnTypeParse];
/**
 * The root object for a JSON transcript, used for parsing.
 */
export interface JsonDataParse {
    authors: JsonAuthor[];
    channel: JsonDataChannel;
    guild: JsonDataGuild | null;
    messages: JsonMessage[];
    options: TranscriptOptionsParse;
    mentions: ArrayMentions;
}
/**
 * Transcript options used for parsing, with a different `returnType`.
 */
export interface TranscriptOptionsParse {
    fileName: string;
    disableWarnings: boolean;
    includeAttachments: boolean;
    includeButtons: boolean;
    includeComponents: boolean;
    includeEmpty: boolean;
    includeEmbeds: boolean;
    includePolls: boolean;
    includeReactions: boolean;
    includeV2Components: boolean;
    localDate: LocalDate;
    quantity: number;
    returnFormat: ReturnFormat;
    returnType: ReturnTypeParse;
    safeMode: boolean;
    saveImages: boolean;
    selfContained: boolean;
    timeZone: TimeZone;
    watermark: boolean;
}
/**
 * A conditional type that maps a `ReturnType` literal to the actual TypeScript type.
 */
export type OutputType<T extends ReturnType> = T extends typeof ReturnType.Buffer ? Buffer : T extends typeof ReturnType.Stream ? Stream : T extends typeof ReturnType.Uploadable ? Uploadable : string;
