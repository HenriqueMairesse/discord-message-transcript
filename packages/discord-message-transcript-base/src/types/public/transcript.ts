import { ReturnType } from "./return.js";

/**
 * Options for converting a JSON transcript to HTML.
 */
export type ConvertTranscriptOptions<T extends ReturnType> = Partial<{
    /**
     * The desired output type for the transcript.
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.String
     */
    returnType: T,
    /**
     * Whether the generated HTML should be self-contained (CSS and JS in HTML).
     * @default false
     */
    selfContained: boolean,
    /**
     * If you want to include the watermark.
     * @default true
     */
    watermark: boolean
}>;