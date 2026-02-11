/**
 * An enum-like object for the possible return types, excluding 'attachment'.
 */
export declare const ReturnType: {
    /**
     * Returns a `Buffer`.
     */
    readonly Buffer: "buffer";
    /**
     * Returns a `Stream.Readable`.
     */
    readonly Stream: "stream";
    /**
     * Returns a `string`.
     */
    readonly String: "string";
    /**
     * Returns an `Uploadable` object.
     */
    readonly Uploadable: "uploadable";
};
/**
 * A type representing the possible values of `ReturnTypeBase`.
 */
export type ReturnType = typeof ReturnType[keyof typeof ReturnType];
