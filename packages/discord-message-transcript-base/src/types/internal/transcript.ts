import { ReturnFormat } from "./return.js"
import { LocalDate, TimeZone } from "./util.js"
import { ReturnType } from "../public/return.js"

/**
 * Base options for creating a transcript.
 */
export interface TranscriptOptionsBase {
    /**
     * The name of the generated file.
     */
    fileName: string,
    /**
     * Disable all warnings to keep console output clean.
     * ⚠️ Can hide issues like unsafe URLs or fallback usage.
     * @default false
     */
    disableWarnings: boolean,
    /**
     * Whether to include attachments.
     */
    includeAttachments: boolean,
    /**
     * Whether to include buttons.
     */
    includeButtons: boolean,
    /**
     * Whether to include other components (like select menus).
     */
    includeComponents: boolean,
    /**
     * Whether to include empty messages.
     */
    includeEmpty: boolean,
    /**
     * Whether to include embeds.
     */
    includeEmbeds: boolean,
    /**
     * Whether to include polls.
     */
    includePolls: boolean,
    /**
     * Whether to include reactions.
     */
    includeReactions: boolean,
    /**
     * Whether to include V2 components.
     */
    includeV2Components: boolean,
    /**
     * The locale for date formatting.
     */
    localDate: LocalDate,
    /**
     * The number of messages to include.
     */
    quantity: number,
    /**
     * The format of the transcript (HTML or JSON).
     */
    returnFormat: ReturnFormat,
    /**
     * The type of the returned value (buffer, string, etc.).
     */
    returnType: ReturnType,
    /**
     * Enables safe mode, blocking potentially unsafe URLs and content.
     * Prevents suspicious links, images, or HTML from being included in the final transcript.
     * 
     * ⚠️ Disabling may allow unsafe content to appear in the transcript.
     * @default true
     */
    safeMode: boolean
    /**
     * Whether to save images as base64.
     * Only saves images with less than 25mb for safety - 25mb is a good security size to an image
     */
    saveImages: boolean,
    /**
     * Whether to generate a self-contained HTML file.
     */
    selfContained: boolean,
    /**
     * The timezone for date formatting.
     */
    timeZone: TimeZone,
    /**
     * Whether to include the watermark.
     */
    watermark: boolean
}