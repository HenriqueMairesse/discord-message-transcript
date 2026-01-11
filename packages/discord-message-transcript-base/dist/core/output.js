import { Readable } from 'stream';
import { Html } from "../renderers/html/html.js";
export async function output(json) {
    const objectHTML = new Html(json);
    const stringHTML = objectHTML.toHTML();
    if (json.options.returnType == "string") {
        return stringHTML;
    }
    const buffer = Buffer.from(stringHTML, 'utf-8');
    if (json.options.returnType == "buffer") {
        return buffer;
    }
    if (json.options.returnType == "stream") {
        return Readable.from([stringHTML]);
    }
    if (json.options.returnType == "uploadable") {
        return {
            content: stringHTML,
            contentType: 'text/html',
            fileName: json.options.fileName
        };
    }
    throw new Error("Return format or return type invalid!");
}
