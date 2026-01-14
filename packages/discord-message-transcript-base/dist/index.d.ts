import { ConvertTranscriptOptions, ReturnTypeBase, OutputTypeBase } from "./types/types.js";
export * from './types/types.js';
export { CustomError } from "./core/error.js";
export { output as outputBase } from "./core/output.js";
export * from './core/mappers.js';
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function jsonToHTMLTranscript<T extends ReturnTypeBase = ReturnTypeBase.String>(jsonString: string, options?: ConvertTranscriptOptions<T>): Promise<OutputTypeBase<T>>;
