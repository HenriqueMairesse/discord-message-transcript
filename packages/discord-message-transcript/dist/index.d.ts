export * from "./types/index.js";
export { setBase64Concurrency, setCDNConcurrency } from './core/assetResolver/index.js';
import { TextBasedChannel } from "discord.js";
import { OutputType, ReturnType } from "./types/public/return.js";
import { ConvertTranscriptOptions, CreateTranscriptOptions } from "./types/public/createAndConvertTranscript.js";
/**
 * Creates a transcript of a Discord channel's messages.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string` (for HTML or JSON), a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param channel The Discord text-based channel (e.g., `TextChannel`, `DMChannel`) to create a transcript from.
 * @param options Configuration options for creating the transcript. See {@link CreateTranscriptOptions} for details.
 * @returns A promise that resolves to the transcript in the specified format.
 */
export declare function createTranscript<T extends ReturnType = typeof ReturnType.Attachment>(channel: TextBasedChannel, options?: CreateTranscriptOptions<T>): Promise<OutputType<T>>;
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string`, a `Buffer`, a `Stream`, or an `Uploadable`  object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function renderHTMLFromJSON<T extends ReturnType = typeof ReturnType.Attachment>(jsonString: string, options?: ConvertTranscriptOptions<T>): Promise<OutputType<T>>;
