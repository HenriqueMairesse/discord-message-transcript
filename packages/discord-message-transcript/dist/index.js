import { AttachmentBuilder } from "discord.js";
import { Json } from "./renderers/json/json.js";
import { fetchMessages } from "./core/fetchMessages.js";
import { output } from "./core/output.js";
import { output as outputBase } from "discord-message-transcript-base/core/output";
import { CustomError } from "discord-message-transcript-base/core/error";
export async function createTranscript(channel, options = {}) {
    try {
        if (!channel.isDMBased()) {
            const permissions = channel.permissionsFor(channel.client.user);
            if (!permissions || (!permissions.has("ViewChannel") || !permissions.has('ReadMessageHistory'))) {
                throw new CustomError(`Channel selected, ${channel.name} with id: ${channel.id}, can't be use to create a transcript because the bot dosen't have permission for View the Channel or Read the Message History. Add the permissions or choose another channel!`);
            }
        }
        const artificialReturnType = options.returnType == "attachment" ? "buffer" : options.returnType ?? "buffer";
        const { fileName = null, includeAttachments = true, includeButtons = true, includeComponents = true, includeEmpty = false, includeEmbeds = true, includePolls = true, includeReactions = true, includeV2Components = true, localDate = 'en-GB', quantity = 0, returnFormat = "HTML", saveImages = false, selfContained = false, timeZone = 'UTC' } = options;
        const checkedFileName = (fileName ?? `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`);
        const internalOptions = {
            fileName: checkedFileName,
            includeAttachments,
            includeButtons,
            includeComponents,
            includeEmpty,
            includeEmbeds,
            includePolls,
            includeReactions,
            includeV2Components,
            localDate,
            quantity,
            returnFormat,
            returnType: artificialReturnType,
            saveImages,
            selfContained,
            timeZone
        };
        const jsonTranscript = channel.isDMBased() ? new Json(null, channel, internalOptions) : new Json(channel.guild, channel, internalOptions);
        let lastMessageID;
        const authors = new Map();
        const mentions = {
            channels: new Map(),
            roles: new Map(),
            users: new Map(),
        };
        while (true) {
            const { messages, end } = await fetchMessages(channel, internalOptions, authors, mentions, lastMessageID);
            jsonTranscript.addMessages(messages);
            lastMessageID = messages[messages.length - 1]?.id;
            if (end || (jsonTranscript.messages.length >= quantity && quantity != 0)) {
                break;
            }
        }
        jsonTranscript.sliceMessages(quantity);
        jsonTranscript.setAuthors(Array.from(authors.values()));
        jsonTranscript.setMentions({ channels: Array.from(mentions.channels.values()), roles: Array.from(mentions.roles.values()), users: Array.from(mentions.users.values()) });
        const result = await output(await jsonTranscript.toJson());
        if (options.returnType == "attachment") {
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
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}
export async function jsonToHTMLTranscript(jsonString, options) {
    try {
        const json = JSON.parse(jsonString);
        json.options.returnFormat = "HTML";
        json.options.selfContained = options?.selfContained ?? false;
        const officialReturnType = options?.returnType ?? "attachment";
        if (officialReturnType == "attachment")
            json.options.returnType = "buffer";
        const result = await outputBase(json);
        if (officialReturnType == "attachment") {
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
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}
