import { AttachmentBuilder } from "discord.js";
import Stream, { Readable } from 'stream'
import { outputBase, JsonData, Uploadable, CustomError } from "discord-message-transcript-base/internal";

export async function output(json: JsonData): Promise<string | Stream | AttachmentBuilder | Buffer | Uploadable> {

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
            }
        }
    } 

    if (json.options.returnFormat == "HTML") {
        return await outputBase(json);
    }

    throw new CustomError("Return format or return type invalid!");
}