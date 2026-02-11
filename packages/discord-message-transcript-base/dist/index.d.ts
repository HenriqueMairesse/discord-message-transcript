import { OutputType } from "./types/internal/parse.js";
import { ReturnType } from "./types/public/return.js";
import { ConvertTranscriptOptions } from "./types/public/transcript.js";
export * from './types/public/index.js';
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function renderHTMLFromJSON<T extends ReturnType = typeof ReturnType.String>(jsonString: string, options?: ConvertTranscriptOptions<T>): Promise<OutputType<T>>;
