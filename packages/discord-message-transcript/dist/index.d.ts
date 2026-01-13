import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { ConvertTranscriptOptions, CreateTranscriptOptions } from "./types/types.js";
import Stream from "stream";
import { Uploadable } from "discord-message-transcript-base/types/types";
/**
 * Creates a transcript of a Discord channel's messages.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string` (for HTML or JSON), a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param channel The Discord text-based channel (e.g., `TextChannel`, `DMChannel`) to create a transcript from.
 * @param options Configuration options for creating the transcript. See {@link CreateTranscriptOptions} for details.
 * @returns A promise that resolves to the transcript in the specified format.
 */
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'string';
}): Promise<string>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType?: 'attachment';
}): Promise<AttachmentBuilder>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'buffer';
}): Promise<Buffer>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'stream';
}): Promise<Stream>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'uploadable';
}): Promise<Uploadable>;
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string`, a `Buffer`, a `Stream`, or an `Uploadable`  object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function jsonToHTMLTranscript(jsonString: string): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "string";
}): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "attachment";
}): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "buffer";
}): Promise<Buffer>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "stream";
}): Promise<Stream>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "uploadable";
}): Promise<Uploadable>;
export declare function jsonToHTMLTranscript(jsonString: string, options?: Omit<ConvertTranscriptOptions, 'returnType'>): Promise<AttachmentBuilder>;
