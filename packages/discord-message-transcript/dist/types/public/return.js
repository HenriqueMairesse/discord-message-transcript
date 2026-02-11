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
};
