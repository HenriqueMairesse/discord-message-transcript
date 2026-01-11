import { CustomError } from "./core/error.js";
import { output } from "./core/output.js";
export async function jsonToHTMLTranscript(jsonString, returnType) {
    try {
        const json = JSON.parse(jsonString);
        json.options.returnFormat = "HTML";
        json.options.returnType = returnType ?? "string";
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
