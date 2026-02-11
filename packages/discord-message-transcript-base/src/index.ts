import { CustomError } from "@/core/customMessages.js";
import { output } from "@/core/output.js";
import { JsonData } from "@/types/internal/message/messageItens.js";
import { ReturnFormat } from "@/types/internal/return.js";
import { OutputType } from "@/types/internal/parse.js";
import { ReturnType } from "@/types/public/return.js";
import { ConvertTranscriptOptions } from "@/types/public/transcript.js";
import { JsonDataParse } from "./types/internal/parse.js";
export * from '@/types/public/index.js';

/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return a `string`, a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export async function renderHTMLFromJSON<T extends ReturnType = typeof ReturnType.String>(jsonString: string, options: ConvertTranscriptOptions<T> = {}): Promise<OutputType<T>> {
    try {
        const jsonParse: JsonDataParse = JSON.parse(jsonString);
        const json: JsonData = {
            ...jsonParse,
            options: {
                ...jsonParse.options,
                returnFormat: ReturnFormat.HTML,
                returnType: options?.returnType ?? ReturnType.String,
                selfContained: options?.selfContained ?? false,
                watermark: options.watermark ?? jsonParse.options.watermark
            }
        }
        return await output(json) as OutputType<T>;
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        } 
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknown error: ${unknowErrorMessage}`);
    }
}