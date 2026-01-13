import Stream from "stream";
import { Uploadable, ConvertTranscriptOptions } from "./types/types.js";
export declare function jsonToHTMLTranscript(jsonString: string): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "string";
}): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "buffer";
}): Promise<Buffer>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "stream";
}): Promise<Stream>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "uploadable";
}): Promise<Uploadable>;
