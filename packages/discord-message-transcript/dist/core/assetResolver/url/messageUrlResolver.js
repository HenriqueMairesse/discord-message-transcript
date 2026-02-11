import { JsonComponentType } from "discord-message-transcript-base/internal";
import { imageUrlResolver } from "./imageUrlResolver.js";
import { isSafeForHTML } from "../../networkSecurity/index.js";
import { urlResolver } from "./urlResolver.js";
import { isJsonComponentInContainer } from "../../discordParser/componentToJson.js";
export async function messagesUrlResolver(messages, options, cdnOptions, urlCache) {
    return await Promise.all(messages.map(async (message) => {
        // Needs to wait for resolve correct when used attachment://
        const attachments = await Promise.all(message.attachments.map(async (attachment) => {
            let safeUrlObject;
            if (attachment.contentType?.startsWith("image/")) {
                safeUrlObject = await imageUrlResolver(attachment.url, options, false, message.attachments);
            }
            else {
                safeUrlObject = await isSafeForHTML(attachment.url, options);
            }
            return {
                ...attachment,
                url: await urlResolver(safeUrlObject, options, cdnOptions, urlCache)
            };
        }));
        const embedsPromise = Promise.all(message.embeds.map(async (embed) => {
            const authorIconUrl = embed.author?.iconURL ? await imageUrlResolver(embed.author.iconURL, options, true, attachments) : null;
            const footerIconUrl = embed.footer?.iconURL ? await imageUrlResolver(embed.footer.iconURL, options, true, attachments) : null;
            const imageUrl = embed.image?.url ? await imageUrlResolver(embed.image.url, options, true, attachments) : null;
            const thumbnailUrl = embed.thumbnail?.url ? await imageUrlResolver(embed.thumbnail.url, options, true, attachments) : null;
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
                if (component.type == JsonComponentType.Section && component.accessory) {
                    if (component.accessory.type == JsonComponentType.Thumbnail) {
                        return {
                            ...component,
                            accessory: {
                                ...component.accessory,
                                media: {
                                    url: await urlResolver((await imageUrlResolver(component.accessory.media.url, options, false, attachments)), options, cdnOptions, urlCache),
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
                                media: { url: await urlResolver((await imageUrlResolver(item.media.url, options, false, attachments)), options, cdnOptions, urlCache) },
                            };
                        }))
                    };
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
