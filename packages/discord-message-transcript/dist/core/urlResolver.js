import { JsonComponentType } from "discord-message-transcript-base";
import { cdnResolver } from "./cdnResolver.js";
import { imageToBase64 } from "./imageToBase64.js";
import { isJsonComponentInContainer } from "./componentToJson.js";
import { FALLBACK_PIXEL, isSafeForHTML, resolveImageURL } from "../../../discord-message-transcript-base/src/core/sanitizer.js";
export async function urlResolver(url, options, cdnOptions, urlCache) {
    if (url == FALLBACK_PIXEL || url == "")
        return url;
    if (urlCache.has(url)) {
        const cache = urlCache.get(url);
        if (cache)
            return await cache;
    }
    let returnUrl;
    if (cdnOptions)
        returnUrl = cdnResolver(url, options, cdnOptions);
    else if (options.saveImages)
        returnUrl = imageToBase64(url, options.disableWarnings);
    if (returnUrl) {
        urlCache.set(url, returnUrl);
        return await returnUrl;
    }
    return url;
}
export async function messagesUrlResolver(messages, options, cdnOptions, urlCache) {
    return await Promise.all(messages.map(async (message) => {
        // Needs to wait for resolve correct when used attachment://
        const attachments = await Promise.all(message.attachments.map(async (attachment) => {
            let url;
            if (attachment.contentType?.startsWith("image/")) {
                url = await resolveImageURL(attachment.url, options, false, message.attachments);
            }
            else {
                url = await isSafeForHTML(attachment.url, options) ? attachment.url : "";
            }
            return {
                ...attachment,
                url: await urlResolver(url, options, cdnOptions, urlCache)
            };
        }));
        const embedsPromise = Promise.all(message.embeds.map(async (embed) => {
            const authorIconUrl = embed.author?.iconURL ? await resolveImageURL(embed.author.iconURL, options, true, attachments) : null;
            const footerIconUrl = embed.footer?.iconURL ? await resolveImageURL(embed.footer.iconURL, options, true, attachments) : null;
            const imageUrl = embed.image?.url ? await resolveImageURL(embed.image.url, options, true, attachments) : null;
            const thumbnailUrl = embed.thumbnail?.url ? await resolveImageURL(embed.thumbnail.url, options, true, attachments) : null;
            return {
                ...embed,
                author: embed.author ? { ...embed.author, iconURL: authorIconUrl ? await urlResolver(authorIconUrl, options, cdnOptions, urlCache) : null } : null,
                footer: embed.footer ? { ...embed.footer, iconURL: footerIconUrl ? await urlResolver(footerIconUrl, options, cdnOptions, urlCache) : null } : null,
                image: embed.image?.url && imageUrl ? { url: await urlResolver(imageUrl, options, cdnOptions, urlCache) } : null,
                thumbnail: embed.thumbnail?.url && thumbnailUrl ? { url: await urlResolver(thumbnailUrl, options, cdnOptions, urlCache) } : null,
            };
        }));
        async function componentsFunction(components) {
            return Promise.all(components.map(async (component) => {
                if (component.type == JsonComponentType.Section) {
                    if (component.accessory.type == JsonComponentType.Thumbnail) {
                        return {
                            ...component,
                            accessory: {
                                ...component.accessory,
                                media: {
                                    url: await urlResolver((await resolveImageURL(component.accessory.media.url, options, false, attachments)), options, cdnOptions, urlCache),
                                }
                            }
                        };
                    }
                }
                if (component.type == JsonComponentType.MediaGallery) {
                    return {
                        ...component,
                        items: await Promise.all(component.items.map(async (item) => {
                            return {
                                ...item,
                                media: { url: await urlResolver((await resolveImageURL(item.media.url, options, false, attachments)), options, cdnOptions, urlCache) },
                            };
                        }))
                    };
                }
                if (component.type == JsonComponentType.File) {
                    return {
                        ...component,
                        url: await urlResolver((await isSafeForHTML(component.url, options) ? component.url : ""), options, cdnOptions, urlCache),
                    };
                }
                if (component.type == JsonComponentType.Container) {
                    return {
                        ...component,
                        components: (await componentsFunction(component.components)).filter(isJsonComponentInContainer), // Input components that are container-safe must always produce container-safe output.
                    };
                }
                return component;
            }));
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
        };
    }));
}
export async function authorUrlResolver(authors, options, cdnOptions, urlCache) {
    return await Promise.all(Array.from(authors.values()).map(async (author) => {
        return {
            ...author,
            avatarURL: await urlResolver((await resolveImageURL(author.avatarURL, options, false)), options, cdnOptions, urlCache),
        };
    }));
}
