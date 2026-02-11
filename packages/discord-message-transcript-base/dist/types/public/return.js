/**
 * An enum-like object for the possible return types, excluding 'attachment'.
 */
export const ReturnType = {
    /**
     * Returns a `Buffer`.
     */
    Buffer: "buffer",
    /**
     * Returns a `Stream.Readable`.
     */
    Stream: "stream",
    /**
     * Returns a `string`.
     */
    String: "string",
    /**
     * Returns an `Uploadable` object.
     */
    Uploadable: "uploadable"
};
