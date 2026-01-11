import Stream from "stream";
import { Uploadable } from "./types/types.js";
export declare function jsonToHTMLTranscript(jsonString: string): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "string"): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "buffer"): Promise<Buffer>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "stream"): Promise<Stream>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "uploadable"): Promise<Uploadable>;
