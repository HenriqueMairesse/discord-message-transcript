import { JsonAuthor, JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers, TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { TextBasedChannel } from "discord.js";
import { fetchMessages } from "./fetchMessages.js";
import { Json } from "@/renderers/json/json.js";
import { MapMentions } from "@/types/private/maps.js";
import { FetchMessagesContext, ReturnDiscordParser } from "@/types/private/discordParser.js";
import { CDNOptions } from "@/types/private/cdn.js";

export async function discordParser(channel: TextBasedChannel, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<ReturnDiscordParser> {

    const urlCache = new Map<string, Promise<string>>();
    const authors = new Map<string, JsonAuthor>();
    const mentions: MapMentions = {
        channels: new Map<string, JsonMessageMentionsChannels>(),
        roles: new Map<string, JsonMessageMentionsRoles>(),
        users: new Map<string, JsonMessageMentionsUsers>(),
    }
    
    const fetchMessageParameter: FetchMessagesContext = {
        channel: channel,
        options: options,
        transcriptState: {
            authors: authors,
            mentions: mentions,
        },
        lastMessageId: undefined
    }

    const jsonTranscript = channel.isDMBased() ? new Json(null, channel, options, cdnOptions, urlCache) : new Json(channel.guild, channel, options, cdnOptions, urlCache); 
    
    while (true) {
        const { messages, end, newLastMessageId } = await fetchMessages(fetchMessageParameter);
        jsonTranscript.addMessages(messages);
        fetchMessageParameter.lastMessageId = newLastMessageId;
        if (end || (jsonTranscript.getMessages().length >= options.quantity && options.quantity != 0)) {
            break;
        }
    }
    
    if (options.quantity > 0 && jsonTranscript.getMessages().length > options.quantity ) {
        jsonTranscript.sliceMessages(options.quantity); 
    }

    return [jsonTranscript, { ...fetchMessageParameter.transcriptState, urlCache}];

}