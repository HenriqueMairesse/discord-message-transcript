/**
 * An enum-like object for the possible transcript formats.
 */
export declare const ReturnFormat: {
    /**
     * JSON format.
     */
    readonly JSON: "JSON";
    /**
     * HTML format.
     */
    readonly HTML: "HTML";
};
/**
 * A type representing the possible values of `ReturnFormat`.
 */
export type ReturnFormat = typeof ReturnFormat[keyof typeof ReturnFormat];
