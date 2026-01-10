import { ChannelType, TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptions } from "../types/types";
import { componentsToJson } from "./componentToJson";
import { urlToBase64 } from "./imageToBase64";
import { CustomError } from "./error";

export async function fetchMessages(channel: TextBasedChannel, options: TranscriptOptions, authors: Map<string,JsonAuthor>, after?: string): Promise<{ messages: JsonMessage[], end: boolean }> {
    const originalMessages = await channel.messages.fetch({ limit: 100, cache: false, after: after });

    const messages: JsonMessage[] = await Promise.all(originalMessages.map(async (message) => {
        let authorAvatar = message.author.displayAvatarURL();
        if (options.saveImages) {
            try {
                authorAvatar = await urlToBase64(authorAvatar);
            } catch (err) {
                if (err instanceof CustomError) console.error(err);
            }
        }

        const attachments = await Promise.all(message.attachments.map(async (attachment) => {
            let attachmentUrl = attachment.url;
            if (options.saveImages && attachment.contentType?.startsWith('image/')) {
                try {
                    attachmentUrl = await urlToBase64(attachment.url);
                } catch (err) {
                    if (err instanceof CustomError) console.error(err);
                }
            }
            return {
                contentType: attachment.contentType,
                name: attachment.name,
                size: attachment.size,
                spoiler: attachment.spoiler,
                url: attachmentUrl,
            };
        }));

        const embeds = await Promise.all(message.embeds.map(async (embed) => {
            let authorIcon = embed.author?.iconURL ?? null;
            let thumbnailUrl = embed.thumbnail?.url ?? null;
            let imageUrl = embed.image?.url ?? null;
            let footerIcon = embed.footer?.iconURL ?? null;
            if (options.saveImages) {
                if (authorIcon) {
                    try {
                        authorIcon = await urlToBase64(authorIcon);
                    } catch (err) {
                        if (err instanceof CustomError) console.error(err);
                    }
                }
                if (thumbnailUrl) {
                    try {
                        thumbnailUrl = await urlToBase64(thumbnailUrl);
                    } catch (err) {
                        if (err instanceof CustomError) console.error(err);
                    }
                }
                if (imageUrl) {
                    try {
                        imageUrl = await urlToBase64(imageUrl);
                    } catch (err) {
                        if (err instanceof CustomError) console.error(err);
                    }
                }
                if (footerIcon) {
                    try {
                        footerIcon = await urlToBase64(footerIcon);
                    } catch (err) {
                        if (err instanceof CustomError) console.error(err);
                    }
                }
            }
            return {
                author: embed.author ? { name: embed.author.name, url: embed.author.url ?? null, iconURL: authorIcon } : null,
                title: embed.title,
                thumbnail: thumbnailUrl ? { url: thumbnailUrl } : null,
                hexColor: embed.hexColor ?? null,
                description: embed.description ?? null,
                fields: embed.fields.map(field => ({ inline: field.inline ?? false, name: field.name, value: field.value })),
                image: imageUrl ? { url: imageUrl } : null,
                footer: embed.footer ? { iconURL: footerIcon, text: embed.footer.text } : null,
                timestamp: embed.timestamp,
                type: embed.data.type ?? "rich",
                url: embed.url,
            };
        }));

        if (!authors.has(message.author.id))  {
                authors.set(message.author.id, {
                avatarURL: authorAvatar,
                bot: message.author.bot,
                displayName: message.author.displayName,
                guildTag: message.author.primaryGuild?.tag ?? null,
                id: message.author.id,
                system: message.author.system,
                member: message.member ? {
                    displayHexColor: message.member.displayHexColor,
                    displayName: message.member.displayName,
                } : null
            });
        }

        return {
            attachments: options.includeAttachments ? attachments : [],
            authorId: message.author.id,
            components: await componentsToJson(message.components, options),
            content: message.content,
            createdTimestamp: message.createdTimestamp,
            embeds: options.includeEmbeds ? embeds : [],
            id: message.id,
            mentions: {
                users: message.mentions.members ? message.mentions.members.map(member => ({ id: member.id, name: member.displayName, color: member.displayHexColor }))
                    : message.mentions.users.map(user => ({ id: user.id, name: user.displayName, color: user.hexAccentColor ?? null })),
                channels: message.mentions.channels.map(channel => ({ id: channel.id, name: channel.type !== ChannelType.DM ? channel.name : channel.recipient?.displayName ?? null })),
                roles: message.mentions.roles.map(role => ({ id: role.id, name: role.name, color: role.hexColor })),
                everyone: message.mentions.everyone,
            },
            poll: message.poll,
            references: message.reference ? { messageId: message.reference.messageId ?? null } : null,
            system: message.system,
        };
    }));

    const end = originalMessages.size !== 100;
    return { messages, end };
}