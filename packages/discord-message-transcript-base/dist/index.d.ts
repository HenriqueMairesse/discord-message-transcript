import Stream from "stream";
import { Uploadable, ConvertTranscriptOptions } from "./types/types.js";
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export declare function jsonToHTMLTranscript(jsonString: string): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "string";
}): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "buffer";
}): Promise<Buffer>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "stream";
}): Promise<Stream>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "uploadable";
}): Promise<Uploadable>;
export declare function jsonToHTMLTranscript(jsonString: string, options?: Omit<ConvertTranscriptOptions, 'returnType'>): Promise<string>;
