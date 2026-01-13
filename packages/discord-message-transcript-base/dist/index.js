import { CustomError } from "./core/error.js";
import { output } from "./core/output.js";
export async function jsonToHTMLTranscript(jsonString, options) {
    try {
        const jsonParse = JSON.parse(jsonString);
        const json = {
            ...jsonParse,
            options: {
                ...jsonParse.options,
                returnFormat: "HTML",
                returnType: options?.returnType ?? "string",
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
