export { ReturnType } from "@/types";
export { ReturnFormat } from "discord-message-transcript-base";
export { setBase64Concurrency, setCDNConcurrency } from '@/core/assetResolver/limiter.js';
import { AttachmentBuilder } from "discord.js";
import { Json } from "@/renderers/json/json.js";
import { fetchMessages } from "@/core/fetchMessages.js";
import { ReturnType } from "@/types";
import { output } from "@/core/output.js";
import { ReturnTypeBase, ReturnFormat, outputBase, CustomError, CustomWarn } from "discord-message-transcript-base";
import { returnTypeMapper } from "@/core/mappers.js";
import { authorUrlResolver, messagesUrlResolver } from "@/assetResolver";
/**
 * Creates a transcript of a Discord channel's messages.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string` (for HTML or JSON), a `Buffer`, a `Stream`, or an `Uploadable` object.
 *
 * @param channel The Discord text-based channel (e.g., `TextChannel`, `DMChannel`) to create a transcript from.
 * @param options Configuration options for creating the transcript. See {@link CreateTranscriptOptions} for details.
 * @returns A promise that resolves to the transcript in the specified format.
 */
export async function createTranscript(channel, options = {}) {
    try {
        if (!channel.isDMBased()) {
            const permissions = channel.permissionsFor(channel.client.user);
            if (!permissions || (!permissions.has("ViewChannel") || !permissions.has('ReadMessageHistory'))) {
                throw new CustomError(`Channel selected, ${channel.name} with id: ${channel.id}, can't be used to create a transcript because the bot doesn't have permission for View the Channel or Read the Message History. Add the permissions or choose another channel!`);
            }
        }
        const artificialReturnType = options.returnType == ReturnType.Attachment ? ReturnTypeBase.Buffer : options.returnType ? returnTypeMapper(options.returnType) : ReturnTypeBase.Buffer;
        const { fileName = null, disableWarnings = false, includeAttachments = true, includeButtons = true, includeComponents = true, includeEmpty = false, includeEmbeds = true, includePolls = true, includeReactions = true, includeV2Components = true, localDate = 'en-GB', quantity = 0, returnFormat = ReturnFormat.HTML, safeMode = true, saveImages = false, selfContained = false, timeZone = 'UTC', watermark = true, } = options;
        const checkedFileName = (fileName ?? `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`);
        let validQuantity = true;
        if (quantity < 0) {
            CustomWarn("Quantity can't be a negative number, please use 0 for unlimited messages.\nUsing 0 as fallback!", options.disableWarnings ?? false);
            validQuantity = false;
        }
        const internalOptions = {
            fileName: checkedFileName,
            disableWarnings,
            includeAttachments,
            includeButtons,
            includeComponents,
            includeEmpty,
            includeEmbeds,
            includePolls,
            includeReactions,
            includeV2Components,
            localDate,
            quantity: validQuantity ? quantity : 0,
            returnFormat,
            returnType: artificialReturnType,
            safeMode,
            saveImages,
            selfContained,
            timeZone,
            watermark
        };
        const urlCache = new Map();
        const authors = new Map();
        const mentions = {
            channels: new Map(),
            roles: new Map(),
            users: new Map(),
        };
        const fetchMessageParameter = {
            channel: channel,
            options: internalOptions,
            transcriptState: {
                authors: authors,
                mentions: mentions,
            },
            lastMessageId: undefined
        };
        const jsonTranscript = channel.isDMBased() ? new Json(null, channel, internalOptions, options.cdnOptions ?? null, urlCache) : new Json(channel.guild, channel, internalOptions, options.cdnOptions ?? null, urlCache);
        while (true) {
            const { messages, end, newLastMessageId } = await fetchMessages(fetchMessageParameter);
            jsonTranscript.addMessages(messages);
            fetchMessageParameter.lastMessageId = newLastMessageId;
            if (end || (jsonTranscript.getMessages().length >= quantity && quantity != 0)) {
                break;
            }
        }
        if (quantity > 0 && jsonTranscript.getMessages().length > quantity) {
            jsonTranscript.sliceMessages(quantity);
        }
        if (options.cdnOptions) {
            options.cdnOptions = {
                includeAudio: true,
                includeImage: true,
                includeVideo: true,
                includeOthers: true,
                ...options.cdnOptions
            };
        }
        await Promise.all([
            (async () => {
                jsonTranscript.setAuthors(await authorUrlResolver(authors, internalOptions, options.cdnOptions ?? null, urlCache));
                authors.clear();
            })(),
            (() => {
                jsonTranscript.setMentions({ channels: Array.from(mentions.channels.values()), roles: Array.from(mentions.roles.values()), users: Array.from(mentions.users.values()) });
                mentions.channels.clear();
                mentions.roles.clear();
                mentions.users.clear();
            })(),
            (async () => {
                jsonTranscript.setMessages(await messagesUrlResolver(jsonTranscript.getMessages(), internalOptions, options.cdnOptions ?? null, urlCache));
            })()
        ]);
        const outputJson = await jsonTranscript.toJson();
        urlCache.clear();
        const result = await output(outputJson);
        if (!options.returnType || options.returnType == "attachment") {
            if (!(result instanceof Buffer)) {
                throw new CustomError("Expected buffer from output when *attachment* returnType is used.");
            }
            const fileExtension = returnFormat == "HTML" ? ".html" : ".json";
            return new AttachmentBuilder(result, { name: internalOptions.fileName + fileExtension });
        }
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error creating transcript: ${error.stack}`);
        }
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknown error: ${unknowErrorMessage}`);
    }
}
/**
 * Converts a JSON transcript string into an HTML transcript.
 * Depending on the `returnType` option, this function can return an `AttachmentBuilder`,
 * a `string`, a `Buffer`, a `Stream`, or an `Uploadable`  object.
 *
 * @param jsonString The JSON string representing the transcript data.
 * @param options Configuration options for converting the transcript. See {@link ConvertTranscriptOptions} for details.
 * @returns A promise that resolves to the HTML transcript in the specified format.
 */
export async function renderHTMLFromJSON(jsonString, options = {}) {
    try {
        const json = JSON.parse(jsonString);
        json.options.returnFormat = ReturnFormat.HTML;
        json.options.selfContained = options?.selfContained ?? false;
        json.options.watermark = options.watermark ?? json.options.watermark;
        const officialReturnType = options?.returnType ?? ReturnType.Attachment;
        if (officialReturnType == ReturnType.Attachment)
            json.options.returnType = ReturnTypeBase.Buffer;
        const result = await outputBase(json);
        if (officialReturnType == ReturnType.Attachment) {
            if (!(result instanceof Buffer)) {
                throw new CustomError("Expected buffer from outputBase when *attachment* returnType is used.");
            }
            return new AttachmentBuilder(result, { name: json.options.fileName + ".html" });
        }
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        }
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknown error: ${unknowErrorMessage}`);
    }
}
