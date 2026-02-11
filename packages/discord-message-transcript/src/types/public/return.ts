import { Uploadable } from "discord-message-transcript-base/internal";
import { AttachmentBuilder } from "discord.js";
import Stream from 'stream';

/**
 * An enum-like object providing the possible return types for the transcript functions.
 */
export const ReturnType = {
    /**
     * Returns a `discord.js` AttachmentBuilder.
     */
    Attachment: "attachment",
    /**
     * Returns a `Buffer`.
     */
    Buffer: "buffer",
    /**
     * Returns a `Stream.Readable`.
     * */
    Stream: "stream",
    /**
     * Returns a `string`.
     * */
    String: "string",
    /**
     * Returns an `Uploadable` object with content, contentType, and fileName.
     */
    Uploadable: "uploadable"
} as const;

/**
 * The type representing the possible values of the `ReturnType` enum.
 */
export type ReturnType = typeof ReturnType[keyof typeof ReturnType];

/**
 * A conditional type that maps the `ReturnType` string literal to the actual TypeScript type returned by the function.
 * @template T The `ReturnType` literal.
 */
export type OutputType<T extends ReturnType> = 
    T extends typeof ReturnType.Buffer ? Buffer 
    : T extends typeof ReturnType.Stream ? Stream
    : T extends typeof ReturnType.String ? string
    : T extends typeof ReturnType.Uploadable ? Uploadable
    : AttachmentBuilder;