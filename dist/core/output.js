import { AttachmentBuilder } from "discord.js";
import { Readable } from 'stream';
import { Html } from "../renderers/html/html";
export async function output(jsonTranscript, options) {
    const data = await jsonTranscript.toJson();
    const stringJSON = JSON.stringify(data);
    if (options.returnFormat == "JSON") {
        if (options.returnType == "string") {
            return stringJSON;
        }
        const buffer = Buffer.from(stringJSON, 'utf-8');
        if (options.returnType == "attachment") {
            return new AttachmentBuilder(buffer, { name: options.fileName });
        }
        if (options.returnType == "buffer") {
            return buffer;
        }
        if (options.returnType == "stream") {
            return Readable.from([stringJSON]);
        }
        if (options.returnType == "uploadable") {
            return {
                content: stringJSON,
                contentType: 'application/json',
                fileName: options.fileName
            };
        }
    }
    if (options.returnFormat == "HTML") {
        const objectHTML = new Html(data, options);
        const stringHTML = objectHTML.toHTML();
        if (options.returnType == "string") {
            return stringHTML;
        }
        const buffer = Buffer.from(stringHTML, 'utf-8');
        if (options.returnType == "attachment") {
            return new AttachmentBuilder(buffer, { name: options.fileName });
        }
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
            };
        }
    }
    throw new Error("Return format or return type invalid!");
}
