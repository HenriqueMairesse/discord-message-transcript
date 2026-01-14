import { CustomError } from "./core/error.js";
import { output } from "./core/output.js";
import { ReturnTypeBase, ReturnFormat } from "./types/types.js";
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
export async function jsonToHTMLTranscript(jsonString, options = {}) {
    try {
        const jsonParse = JSON.parse(jsonString);
        const json = {
            ...jsonParse,
            options: {
                ...jsonParse.options,
                returnFormat: ReturnFormat.HTML,
                returnType: options?.returnType ?? ReturnTypeBase.String,
                selfContained: options?.selfContained ?? false
            }
        };
        return await output(json);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        }
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}
