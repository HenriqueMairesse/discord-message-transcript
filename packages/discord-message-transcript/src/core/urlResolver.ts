import { JsonAuthor, JsonComponentType, JsonMessage, JsonTopLevelComponent, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions, safeUrlReturn } from "@/types";
import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";
import { isJsonComponentInContainer } from "./componentToJson.js";
import { FALLBACK_PIXEL } from "discord-message-transcript-base";
import { resolveImageURL } from "./resolveImageUrl.js";
import { isSafeForHTML } from "@/networkSecurity";

export async function urlResolver(safeUrlObject: safeUrlReturn, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<string> {
    if (safeUrlObject.safe == false) return "";
    if (safeUrlObject.url == FALLBACK_PIXEL) return safeUrlObject.url;    
    if (urlCache.has(safeUrlObject.url)) {
        const cache = urlCache.get(safeUrlObject.url);
        if (cache) return await cache;
    }

    let returnUrl;
    if (cdnOptions) returnUrl = cdnResolver(safeUrlObject, options, cdnOptions);
    else if (options.saveImages) returnUrl = imageToBase64(safeUrlObject, options.disableWarnings);

    if (returnUrl) {
        urlCache.set(safeUrlObject.url, returnUrl);
        return await returnUrl;
    }
    return safeUrlObject.url;
}

export async function messagesUrlResolver(messages: JsonMessage[], options: TranscriptOptionsBase, cdnOptions: CDNOptions | null, urlCache: Map<string, Promise<string>>): Promise<JsonMessage[]> {
    return await Promise.all(messages.map(async message => {
        // Needs to wait for resolve correct when used attachment://
        const attachments = await Promise.all(message.attachments.map(async attachment => {

            let safeUrlObject: safeUrlReturn;
            if (attachment.contentType?.startsWith("image/")) {
                safeUrlObject = await resolveImageURL(attachment.url, options, false, message.attachments);
            } else {
                safeUrlObject = await isSafeForHTML(attachment.url, options);
            }

            return {
                ...attachment,
                url: await urlResolver(safeUrlObject, options, cdnOptions, urlCache)
            }
        }))

        const embedsPromise = Promise.all(message.embeds.map(async embed => {

            const authorIconUrl = embed.author?.iconURL ? await resolveImageURL(embed.author.iconURL, options, true, attachments): null;
            const footerIconUrl = embed.footer?.iconURL ? await resolveImageURL(embed.footer.iconURL, options, true, attachments): null;
            const imageUrl = embed.image?.url ? await resolveImageURL(embed.image.url, options, true, attachments) : null;
            const thumbnailUrl = embed.thumbnail?.url ? await resolveImageURL(embed.thumbnail.url, options, true, attachments) : null;

            return {
                ...embed,
                author: embed.author ? {...embed.author, iconURL: authorIconUrl ? await urlResolver(authorIconUrl, options, cdnOptions, urlCache) : null} : null,
                footer: embed.footer ? {...embed.footer, iconURL: footerIconUrl ? await urlResolver(footerIconUrl, options, cdnOptions, urlCache) : null} : null,
                image: embed.image?.url && imageUrl ? { url: await urlResolver(imageUrl, options, cdnOptions, urlCache) } : null,
                thumbnail: embed.thumbnail?.url && thumbnailUrl ? { url: await urlResolver(thumbnailUrl, options, cdnOptions, urlCache) } : null,
            }
        }))
        
        async function componentsFunction(components: JsonTopLevelComponent[]): Promise<JsonTopLevelComponent[]> {
            return Promise.all(components.map(async component => {
                
                if (component.type == JsonComponentType.Section && component.accessory) {
                    if (component.accessory.type == JsonComponentType.Thumbnail) {
                        return {
                            ...component,
                            accessory: {
                                ...component.accessory,
                                media: {
                                    url: await urlResolver((await resolveImageURL(component.accessory.media.url, options, false, attachments)), options, cdnOptions, urlCache),
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
                                media: { url: await urlResolver((await resolveImageURL(item.media.url, options, false, attachments)), options, cdnOptions, urlCache) },
                            };
                        }))
                    }
                }

                if (component.type == JsonComponentType.File) {

                    const safeUrlObject = await isSafeForHTML(component.url, options);

                    return {
                        ...component,
                        url: await urlResolver(safeUrlObject, options, cdnOptions, urlCache),
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

        const [embeds, components] = await Promise.all([
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
            avatarURL: await urlResolver((await resolveImageURL(author.avatarURL, options, false)), options, cdnOptions, urlCache),
        }
    }))
}