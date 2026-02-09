import { ConvertTranscriptOptions, ReturnTypeBase, OutputTypeBase } from "@/types";
export * from '@/types';
export { CustomError, CustomWarn } from "@/core/customMessages.js";
export { output as outputBase } from "@/core/output.js";
export { FALLBACK_PIXEL, isValidHexColor, sanitize } from "@/core/sanitizer.js";
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function renderHTMLFromJSON<T extends ReturnTypeBase = typeof ReturnTypeBase.String>(jsonString: string, options?: ConvertTranscriptOptions<T>): Promise<OutputTypeBase<T>>;
