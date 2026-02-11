/**
 * An enum-like object for the possible transcript formats.
 */
export const ReturnFormat = {
  /**
   * JSON format.
   */
  JSON: "JSON",
  /**
   * HTML format.
   */
  HTML: "HTML"
} as const;

/**
 * A type representing the possible values of `ReturnFormat`.
 */
export type ReturnFormat = typeof ReturnFormat[keyof typeof ReturnFormat];