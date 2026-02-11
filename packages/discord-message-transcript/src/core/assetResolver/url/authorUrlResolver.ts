import { JsonAuthor, TranscriptOptionsBase } from "discord-message-transcript-base/internal"
import { imageUrlResolver } from "./imageUrlResolver.js"
import { urlResolver } from "./urlResolver.js"
import { CDNOptions } from "@/types/private/cdn.js"

export async function authorUrlResolver(authors: Map<string, JsonAuthor>, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonAuthor[]> {
    return await Promise.all(Array.from(authors.values()).map(async author => {
        return {
            ...author,
            avatarURL: await urlResolver((await imageUrlResolver(author.avatarURL, options, false)), options, cdnOptions, urlCache),
        }
    }))
}