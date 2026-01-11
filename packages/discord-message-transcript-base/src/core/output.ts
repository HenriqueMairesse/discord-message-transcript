import { JsonData, TranscriptOptions, Uploadable } from "../types/types";
import Stream, { Readable } from 'stream'
import { Html } from "../renderers/html/html";

export async function output(json: JsonData, options: TranscriptOptions): Promise<string | Stream | Buffer | Uploadable> {

    if (options.returnFormat == "HTML") {
        const objectHTML = new Html(json);
        const stringHTML = objectHTML.toHTML();
        if (options.returnType == "string") {
            return stringHTML;
        }
        const buffer = Buffer.from(stringHTML, 'utf-8');
        if (options.returnType == "buffer") {
            return buffer;
        }
        if (options.returnType == "stream") {
            return Readable.from([stringHTML]);
        }
        if (options.returnType == "uploadable") {
            return {
                content: stringHTML,
                contentType: 'text/html',
                fileName: options.fileName
            }
        }
    }

    throw new Error("Return format or return type invalid!");
}