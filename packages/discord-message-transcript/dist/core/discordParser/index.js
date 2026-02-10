import { fetchMessages } from "./fetchMessages.js";
import { Json } from "@/renderers/json/json.js";
export async function discordParser(channel, options, cdnOptions) {
    const urlCache = new Map();
    const authors = new Map();
    const mentions = {
        channels: new Map(),
        roles: new Map(),
        users: new Map(),
    };
    const fetchMessageParameter = {
        channel: channel,
        options: options,
        transcriptState: {
            authors: authors,
            mentions: mentions,
        },
        lastMessageId: undefined
    };
    const jsonTranscript = channel.isDMBased() ? new Json(null, channel, options, cdnOptions, urlCache) : new Json(channel.guild, channel, options, cdnOptions, urlCache);
    while (true) {
        const { messages, end, newLastMessageId } = await fetchMessages(fetchMessageParameter);
        jsonTranscript.addMessages(messages);
        fetchMessageParameter.lastMessageId = newLastMessageId;
        if (end || (jsonTranscript.getMessages().length >= options.quantity && options.quantity != 0)) {
            break;
        }
    }
    if (options.quantity > 0 && jsonTranscript.getMessages().length > options.quantity) {
        jsonTranscript.sliceMessages(options.quantity);
    }
    return [jsonTranscript, { ...fetchMessageParameter.transcriptState, urlCache }];
}
