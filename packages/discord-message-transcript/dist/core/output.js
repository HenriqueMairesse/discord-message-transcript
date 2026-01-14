import { Readable } from 'stream';
import { outputBase } from "discord-message-transcript-base";
export async function output(json) {
    const stringJSON = JSON.stringify(json);
    if (json.options.returnFormat == "JSON") {
        if (json.options.returnType == "string") {
            return stringJSON;
        }
        const buffer = Buffer.from(stringJSON, 'utf-8');
        if (json.options.returnType == "buffer") {
            return buffer;
        }
        if (json.options.returnType == "stream") {
            return Readable.from([stringJSON]);
        }
        if (json.options.returnType == "uploadable") {
            return {
                content: stringJSON,
                contentType: 'application/json',
                fileName: json.options.fileName
            };
        }
    }
    if (json.options.returnFormat == "HTML") {
        return await outputBase(json);
    }
    throw new Error("Return format or return type invalid!");
}
