import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { ConvertTranscriptOptions, CreateTranscriptOptions } from "./types/types.js";
import Stream from "stream";
import { Uploadable } from "discord-message-transcript-base/types/types";
export declare function createTranscript(channel: TextBasedChannel): Promise<AttachmentBuilder>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
    returnType: 'string';
}): Promise<string>;
export declare function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & {
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
export declare function createTranscript(channel: TextBasedChannel, options?: Omit<CreateTranscriptOptions, 'returnType'>): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "string";
}): Promise<string>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "attachment";
}): Promise<AttachmentBuilder>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "buffer";
}): Promise<Buffer>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "stream";
}): Promise<Stream>;
export declare function jsonToHTMLTranscript(jsonString: string, options: ConvertTranscriptOptions & {
    returnType: "uploadable";
}): Promise<Uploadable>;
export declare function jsonToHTMLTranscript(jsonString: string, options?: Omit<ConvertTranscriptOptions, 'returnType'>): Promise<AttachmentBuilder>;
