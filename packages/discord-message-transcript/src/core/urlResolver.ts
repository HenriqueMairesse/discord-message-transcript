import { JsonAuthor, JsonComponentType, JsonMessage, JsonTopLevelComponent, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions } from "../types/types.js";
import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";
import { isJsonComponentInContainer } from "./componentToJson.js";

export async function urlResolver(url: string, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string> {
    if (urlCache.has(url)) {
        const cache = urlCache.get(url);
        if (cache) return await cache;
    }
    let returnUrl;
    if (cdnOptions) returnUrl = cdnResolver(url, options, cdnOptions);
    else if (options.saveImages) returnUrl = imageToBase64(url);
    if (returnUrl) {
        urlCache.set(url, returnUrl);
        return await returnUrl;
    }
    return url;
}

export async function messagesUrlResolver(messages: JsonMessage[], options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonMessage[]> {
    return await Promise.all(messages.map(async message => {
        const attachmentsPromise = Promise.all(message.attachments.map(async attachment => {
            return {
                ...attachment,
                url: await urlResolver(attachment.url, options, cdnOptions, urlCache)
            }
        }))

        const embedsPromise = Promise.all(message.embeds.map(async embed => {
            return {
                ...embed,
                author: embed.author ? {...embed.author, iconURL: embed.author.iconURL ? await urlResolver(embed.author.iconURL, options, cdnOptions, urlCache) : null} : null,
                footer: embed.footer ? {...embed.footer, iconURL: embed.footer.iconURL ? await urlResolver(embed.footer.iconURL, options, cdnOptions, urlCache) : null} : null,
                image: embed.image?.url ? { url: await urlResolver(embed.image.url, options, cdnOptions, urlCache) } : null,
                thumbnail: embed.thumbnail?.url ? { url: await urlResolver(embed.thumbnail.url, options, cdnOptions, urlCache) } : null,
            }
        }))
        
        async function componentsFunction(components: JsonTopLevelComponent[]): Promise<JsonTopLevelComponent[]> {
            return Promise.all(components.map(async component => {
                
                if (component.type == JsonComponentType.Section) {
                    if (component.accessory.type == JsonComponentType.Thumbnail) {
                        return {
                            ...component,
                            accessory: {
                                ...component.accessory,
                                media: {
                                    url: await urlResolver(component.accessory.media.url, options, cdnOptions, urlCache),
                                }
                            }
                        }
                    }
                }

                if (component.type == JsonComponentType.MediaGallery) {
                    return {
                        ...component,
                        items: await Promise.all(component.items.map(async item => {
                            return {
                                ...item,
                                media: { url: await urlResolver(item.media.url, options, cdnOptions, urlCache) },
                            };
                        }))
                    }
                }

                if (component.type == JsonComponentType.File) {
                    return {
                        ...component,
                        url: await urlResolver(component.url, options, cdnOptions, urlCache),
                    };
                }

                if (component.type == JsonComponentType.Container) {
                    return {
                        ...component,
                        components: (await componentsFunction(component.components)).filter(isJsonComponentInContainer), // Input components that are container-safe must always produce container-safe output.
                    }
                }

                return component;
            }))
        } 

        const componentsPromise = componentsFunction(message.components);

        const [attachments, embeds, components] = await Promise.all([
            attachmentsPromise,
            embedsPromise,
            componentsPromise
        ]);

        return {
            ...message,
            attachments: attachments,
            embeds: embeds,
            components: components,
        }
    }))
}

export async function authorUrlResolver(authors: Map<string, JsonAuthor>, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonAuthor[]> {
    return await Promise.all(Array.from(authors.values()).map(async author => {
        return {
            ...author,
            avatarURL: await urlResolver(author.avatarURL, options, cdnOptions, urlCache),
        }
    }))
}