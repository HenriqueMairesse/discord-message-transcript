export type { CreateTranscriptOptions, ConvertTranscriptOptions, TranscriptOptions } from "./types/types.js";
export { ReturnFormat, ReturnType, LocalDate, TimeZone } from "discord-message-transcript-base";
import { TextBasedChannel } from "discord.js";
import { ConvertTranscriptOptions, CreateTranscriptOptions, OutputType } from "./types/types.js";
import { ReturnType } from "discord-message-transcript-base";
/**
 * Creates a transcript of a Discord channel's messages.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string` (for HTML or JSON), a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param channel The Discord text-based channel (e.g., `TextChannel`, `DMChannel`) to create a transcript from.
 * @param options Configuration options for creating the transcript. See {@link CreateTranscriptOptions} for details.
 * @returns A promise that resolves to the transcript in the specified format.
 */
export declare function createTranscript<T extends ReturnType = ReturnType.Attachment>(channel: TextBasedChannel, options?: CreateTranscriptOptions<T>): Promise<OutputType<T>>;
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string`, a `Buffer`, a `Stream`, or an `Uploadable`  object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function jsonToHTMLTranscript<T extends ReturnType = ReturnType.Attachment>(jsonString: string, options?: ConvertTranscriptOptions<T>): Promise<OutputType<T>>;
