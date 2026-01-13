import { CustomError } from "./core/error.js";
import { output } from "./core/output.js";
import Stream from "stream";
import { Uploadable, JsonData, JsonDataParse, ConvertTranscriptOptions } from "./types/types.js";

/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export async function jsonToHTMLTranscript(jsonString: string): Promise<string>;
export async function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & { returnType: "string" }): Promise<string>;
export async function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & { returnType: "buffer" }): Promise<Buffer>;
export async function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & { returnType: "stream" }): Promise<Stream>;
export async function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & { returnType: "uploadable" }): Promise<Uploadable>;
export async function jsonToHTMLTranscript(jsonString: string, options?: Omit<ConvertTranscriptOptions, 'returnType'>): Promise<string>;


export async function jsonToHTMLTranscript(jsonString: string, options?: ConvertTranscriptOptions): Promise<string | Buffer | Stream | Uploadable> {
    try {
        const jsonParse: JsonDataParse = JSON.parse(jsonString);
        const json: JsonData = {
            ...jsonParse,
            options: {
                ...jsonParse.options,
                returnFormat: "HTML",
                returnType: options?.returnType ?? "string",
                selfContained: options?.selfContained ?? false
            }
        }
        return await output(json);
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        } 
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}