import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { CreateTranscriptOptions } from "./types/types.js";
import Stream from "stream";
import { Uploadable } from "discord-message-transcript-base/types/types";
export declare function createTranscript(channel: TextBasedChannel): Promise<AttachmentBuilder>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'string';
}): Promise<string>;
export declare function createTranscript(channel: TextBasedChannel, options?: CreateTranscriptOptions & {
    returnType: "attachment";
}): Promise<AttachmentBuilder>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'buffer';
}): Promise<Buffer>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'stream';
}): Promise<Stream>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'uploadable';
}): Promise<Uploadable>;
export declare function createTranscript(channel: TextBasedChannel, options?: Omit<CreateTranscriptOptions, 'returnType'> | (CreateTranscriptOptions & {
    returnType?: 'attachment' | null;
})): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "string"): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "attachment"): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "buffer"): Promise<Buffer>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "stream"): Promise<Stream>;
export declare function jsonToHTMLTranscript(jsonString: string, returnType: "uploadable"): Promise<Uploadable>;
