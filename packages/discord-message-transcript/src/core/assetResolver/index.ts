import { Json } from "@/renderers/json/json.js";
import { CDNOptions, Maps } from "@/types/types.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base";
import { authorUrlResolver } from "./url/authorUrlResolver.js";
import { messagesUrlResolver } from "./url/messageUrlResolver.js";

export * from "./limiter.js";
export * from "./url/imageUrlResolver.js";
export * from "./url/urlResolver.js";

export async function jsonAssetResolver(jsonTranscript: Json, maps: Maps, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null) {

    await Promise.all([
        (async () => {
            jsonTranscript.setAuthors(await authorUrlResolver(maps.authors, options, cdnOptions, maps.urlCache));
            maps.authors.clear(); 
        })(),
        (() => {
            jsonTranscript.setMentions({ channels: Array.from(maps.mentions.channels.values()), roles: Array.from(maps.mentions.roles.values()), users: Array.from(maps.mentions.users.values()) });
            maps.mentions.channels.clear();
            maps.mentions.roles.clear(); 
            maps.mentions.users.clear(); 
        })(),
        (async () => {
            jsonTranscript.setMessages(await messagesUrlResolver(jsonTranscript.getMessages(), options, cdnOptions, maps.urlCache));
        })()
    ])
}