import { ReturnType } from "../public/return.js";
import { TranscriptOptions } from "../private/transcript.js";
/**
 * Options for creating a transcript, with all properties being optional.
 * @see TranscriptOptions
 */
export type CreateTranscriptOptions<T extends ReturnType> = Partial<TranscriptOptions<T>>;
/**
 * Options for converting a JSON transcript to an HTML transcript.
 */
export type ConvertTranscriptOptions<T extends ReturnType> = Partial<{
    /**
     * The desired output type for the transcript.
     * - ReturnType.Attachment - The transcript content as a `Attachment`
     * - ReturnType.String - The transcript content as a string.
     * - ReturnType.Buffer - The transcript content as a `Buffer`.
     * - ReturnType.Stream - The transcript content as a `Stream`.
     * - ReturnType.Uploadable` - An object with `content`, `contentType` and `fileName`.
     * @default ReturnType.Attachment
     */
    returnType: T;
    /**
     * Whether the generated HTML should have its CSS and JS embedded directly in the file.
     * @default false
     */
    selfContained: boolean;
    /**
     * Whether to include the 'Generated with discord-message-transcript' watermark in the footer.
     * @default true
     */
    watermark: boolean;
}>;
