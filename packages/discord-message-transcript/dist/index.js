import { Json } from "./renderers/json/json";
import { fetchMessages } from "./core/fetchMessages";
import { output } from "./core/output";
import { CustomError } from "./core/error";
export async function createTranscript(channel, options = {}) {
    try {
        const { fileName = null, returnFormat = "HTML", returnType = "attachment", quantity = 0, includeEmbeds = true, includeAttachments = true, includeComponents = true, includeV2Components = true, includeButtons = true, includeEmpty = false, timeZone = 'UTC', localDate = 'en-GB', saveImages = false } = options;
        const checkedFileName = (fileName ?? `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`);
        const internalOptions = {
            fileName: checkedFileName,
            returnFormat,
            returnType,
            quantity,
            includeEmbeds,
            includeAttachments,
            includeComponents,
            includeV2Components,
            includeButtons,
            includeEmpty,
            timeZone,
            localDate,
            saveImages
        };
        const jsonTranscript = channel.isDMBased() ? new Json(null, channel, internalOptions) : new Json(channel.guild, channel, internalOptions);
        let lastMessageID;
        const authors = new Map();
        while (true) {
            const { messages, end } = await fetchMessages(channel, internalOptions, authors, lastMessageID);
            jsonTranscript.addMessages(messages);
            lastMessageID = messages[messages.length - 1]?.id;
            if (end || (jsonTranscript.messages.length >= quantity && quantity != 0)) {
                break;
            }
        }
        jsonTranscript.sliceMessages(quantity);
        jsonTranscript.setAuthors(Array.from(authors.values()));
        return await output(await jsonTranscript.toJson(), internalOptions);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error creating transcript: ${error.stack}`);
        }
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}
export async function jsonToHTMLTranscript(jsonString, returnType) {
    const json = JSON.parse(jsonString);
    json.options.returnFormat = "HTML";
    json.options.returnType = returnType ?? "attachment";
    return await output(json, json.options);
}
