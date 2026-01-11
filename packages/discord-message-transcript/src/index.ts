import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { Json } from "./renderers/json/json";
import { fetchMessages } from "./core/fetchMessages";
import { CreateTranscriptOptions, JsonData, TranscriptOptions, Uploadable, ReturnType, JsonAuthor } from "./types/types";
import { output } from "./core/output";
import Stream from "stream";
import { CustomError } from "./core/error";

export async function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & { returnType: 'string' }): Promise<string>;
export async function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & { returnType: 'buffer' }): Promise<Buffer>;
export async function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & { returnType: 'stream' }): Promise<Stream>;
export async function createTranscript(channel: TextBasedChannel, options: CreateTranscriptOptions & { returnType: 'uploadable' }): Promise<Uploadable>;
export async function createTranscript(channel: TextBasedChannel, options?: Omit<CreateTranscriptOptions, 'returnType'> | (CreateTranscriptOptions & { returnType?: 'attachment' | null })): Promise<AttachmentBuilder>;

export async function createTranscript(
    channel: TextBasedChannel, 
    options: CreateTranscriptOptions = {}
): Promise<string | AttachmentBuilder | Buffer | Stream | Uploadable> {

    try {

        const {
            fileName = null,
            includeAttachments = true,
            includeButtons = true,
            includeComponents = true,
            includeEmpty = false,
            includeEmbeds = true,
            includePolls = true,
            includeReactions = true,
            includeV2Components = true,
            localDate = 'en-GB',
            quantity = 0,
            returnFormat = "HTML",
            returnType = "attachment",
            saveImages = false,
            timeZone = 'UTC'
        } = options;
        const checkedFileName = (fileName ?? `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`);
        const internalOptions: TranscriptOptions = {
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
            returnType,
            saveImages,
            timeZone
        }

        const jsonTranscript = channel.isDMBased() ? new Json(null, channel, internalOptions) : new Json(channel.guild, channel, internalOptions); 
        let lastMessageID: string | undefined;
        const authors = new Map<string, JsonAuthor>();

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
        
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error creating transcript: ${error.stack}`);
        } 
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}

export async function jsonToHTMLTranscript(jsonString: string): Promise<AttachmentBuilder>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "string"): Promise<string>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "attachment"): Promise<AttachmentBuilder>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "buffer"): Promise<Buffer>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "stream"): Promise<Stream>;
export async function jsonToHTMLTranscript(jsonString: string, returnType: "uploadable"): Promise<Uploadable>;

export async function jsonToHTMLTranscript(jsonString: string, returnType?: ReturnType): Promise<string | AttachmentBuilder | Buffer | Stream | Uploadable> {
    try {
        const json: JsonData = JSON.parse(jsonString);
        json.options.returnFormat = "HTML";
        json.options.returnType = returnType ?? "attachment";
        return await output(json, json.options);
    } catch (error) {
        if (error instanceof Error) {
            throw new CustomError(`Error converting JSON to HTML: ${error.stack}`);
        } 
        const unknowErrorMessage = String(error);
        throw new CustomError(`Unknow error: ${unknowErrorMessage}`);
    }
}