import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { Json } from "./renderers/json/json";
import { fetchMessages } from "./core/fetchMessages";
import { CreateTranscriptOptions, JsonData, TranscriptOptions, Uploadable, ReturnType } from "./types/types";
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
            returnFormat = "HTML",
            returnType = "attachment",
            quantity = 0,
            includeEmbeds = true, 
            includeAttachments = true, 
            includeComponents = true, 
            includeV2Components = true, 
            includeButtons = true,
            includeEmpty = false,
            timeZone = 'UTC',
            localDate = 'en-GB'
        } = options;
        const checkedFileName = (fileName ?? `Transcript-${channel.isDMBased() ? "DirectMessage" : channel.name}-${channel.id}`);
        const internalOptions: TranscriptOptions = {
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
        }

        const jsonTranscript = channel.isDMBased() ? new Json(null, channel, internalOptions) : new Json(channel.guild, channel, internalOptions); 
        let lastMessageID: string | undefined;

        while (true) {
            const { messages, end } = await fetchMessages(channel, internalOptions, lastMessageID);
            jsonTranscript.addMessages(messages);
            lastMessageID = messages[messages.length - 1]?.id;
            if (end || (jsonTranscript.messages.length >= quantity && quantity != 0)) {
                break;
            }
        }
        jsonTranscript.sliceMessages(quantity);
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
    const json: JsonData = JSON.parse(jsonString);
    json.options.returnFormat = "HTML";
    json.options.returnType = returnType ?? "attachment";
    return await output(json, json.options);
}