import { CustomError } from "./core/error";
import { output } from "./core/output";
import Stream from "stream";
import { Uploadable, JsonData, ReturnType } from "./types/types";

export async function jsonToHTMLTranscript(jsonString: string): Promise<string>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "string"): Promise<string>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "buffer"): Promise<Buffer>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "stream"): Promise<Stream>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "uploadable"): Promise<Uploadable>;

export async function jsonToHTMLTranscript(jsonString: string, returnType?: ReturnType): Promise<string | Buffer | Stream | Uploadable> {
    try {
        const json: JsonData = JSON.parse(jsonString);
        json.options.returnFormat = "HTML";
        json.options.returnType = returnType ?? "string";
        return await output(json, json.options);
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        } 
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}