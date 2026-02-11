import { Uploadable } from "discord-message-transcript-base/internal";
import { AttachmentBuilder } from "discord.js";
import Stream from 'stream';
/**
 * An enum-like object providing the possible return types for the transcript functions.
 */
export declare const ReturnType: {
    /**
     * Returns a `discord.js` AttachmentBuilder.
     */
    readonly Attachment: "attachment";
    /**
     * Returns a `Buffer`.
     */
    readonly Buffer: "buffer";
    /**
     * Returns a `Stream.Readable`.
     * */
    readonly Stream: "stream";
    /**
     * Returns a `string`.
     * */
    readonly String: "string";
    /**
     * Returns an `Uploadable` object with content, contentType, and fileName.
     */
    readonly Uploadable: "uploadable";
};
/**
 * The type representing the possible values of the `ReturnType` enum.
 */
export type ReturnType = typeof ReturnType[keyof typeof ReturnType];
/**
 * A conditional type that maps the `ReturnType` string literal to the actual TypeScript type returned by the function.
 * @template T The `ReturnType` literal.
 */
export type OutputType<T extends ReturnType> = T extends typeof ReturnType.Buffer ? Buffer : T extends typeof ReturnType.Stream ? Stream : T extends typeof ReturnType.String ? string : T extends typeof ReturnType.Uploadable ? Uploadable : AttachmentBuilder;
