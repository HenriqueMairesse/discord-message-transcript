import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { CreateTranscriptOptions, Uploadable } from "./types/types";
import Stream from "stream";
export declare function createTranscript(channel: TextBasedChannel): Promise<AttachmentBuilder>;
export declare function createTranscript(channel: TextBasedChannel, options?: CreateTranscriptOptions & {
    returnType: "string";
}): Promise<string>;
export declare function createTranscript(channel: TextBasedChannel, options?: CreateTranscriptOptions & {
    returnType: "buffer";
}): Promise<Buffer>;
export declare function createTranscript(channel: TextBasedChannel, options?: CreateTranscriptOptions & {
    returnType: "attachment";
}): Promise<AttachmentBuilder>;
export declare function createTranscript(channel: TextBasedChannel, options?: CreateTranscriptOptions & {
    returnType: "stream";
}): Promise<Stream>;
export declare function createTranscript(channel: TextBasedChannel, options?: CreateTranscriptOptions & {
    returnType: "uploadable";
}): Promise<Uploadable>;
