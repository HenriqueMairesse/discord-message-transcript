import { Json } from "./renderers/json/json";
import { fetchMessages } from "./core/fetchMessages";
import { output } from "./core/output";
import { CustomError } from "./core/error";
try {
}
catch (error) {
}
export async function createTranscript(channel, options = {}) {
    try {
        const { fileName = null, returnFormat = "HTML", returnType = "attachment", quantity = 0, includeEmbeds = true, includeAttachments = true, includeComponents = true, includeV2Components = true, includeButtons = true, includeEmpty = false, timeZone = 'UTC', localDate = 'en-GB' } = options;
        const checkedFileName = (fileName ?? `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`) + (returnFormat == "JSON" ? ".json" : ".html");
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
            localDate
        };
        const jsonTranscript = channel.isDMBased() ? new Json(null, channel) : new Json(channel.guild, channel);
        let lastMessageID;
        while (true) {
            const { messages, end } = await fetchMessages(channel, internalOptions, lastMessageID);
            jsonTranscript.addMessages(messages);
            lastMessageID = messages[messages.length - 1]?.id;
            if (end || (jsonTranscript.messages.length >= quantity && quantity != 0)) {
                break;
            }
        }
        jsonTranscript.sliceMessages(quantity);
        return await output(jsonTranscript, internalOptions);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error creating transcript: ${error.stack}`);
        }
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}
