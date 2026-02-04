import { CustomError } from "./core/customMessages.js";
import { output } from "./core/output.js";
import { JsonData, JsonDataParse, ConvertTranscriptOptions, ReturnTypeBase, OutputTypeBase, ReturnFormat } from "./types/types.js";
export * from './types/types.js';
export { CustomError } from "./core/customMessages.js";
export { output as outputBase } from "./core/output.js";

/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export async function renderHTMLFromJSON<T extends ReturnTypeBase = typeof ReturnTypeBase.String>(jsonString: string, options: ConvertTranscriptOptions<T> = {}): Promise<OutputTypeBase<T>> {
    try {
        const jsonParse: JsonDataParse = JSON.parse(jsonString);
        const json: JsonData = {
            ...jsonParse,
            options: {
                ...jsonParse.options,
                returnFormat: ReturnFormat.HTML,
                returnType: options?.returnType ?? ReturnTypeBase.String,
                selfContained: options?.selfContained ?? false,
                watermark: options.watermark ?? jsonParse.options.watermark
            }
        }
        return await output(json) as OutputTypeBase<T>;
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        } 
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknown error: ${unknowErrorMessage}`);
    }
}