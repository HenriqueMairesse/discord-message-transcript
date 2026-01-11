import { ChannelType, TextBasedChannel } from "discord.js";
import { JsonAuthor, JsonMessage, TranscriptOptions } from "../types/types";
import { componentsToJson } from "./componentToJson";
import { urlToBase64 } from "./imageToBase64";
import { CustomError } from "./error";

export async function fetchMessages(channel: TextBasedChannel, options: TranscriptOptions, authors: Map<string,JsonAuthor>, after?: string): Promise<{ messages: JsonMessage[], end: boolean }> {
    const originalMessages = await channel.messages.fetch({ limit: 100, cache: false, after: after });

    const rawMessages: (JsonMessage | null)[] = await Promise.all(originalMessages.map(async (message) => {
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
                description: embed.description ?? null,
                fields: embed.fields.map(field => ({ inline: field.inline ?? false, name: field.name, value: field.value })),
                footer: embed.footer ? { iconURL: footerIcon, text: embed.footer.text } : null,
                hexColor: embed.hexColor ?? null,
                image: imageUrl ? { url: imageUrl } : null,
                thumbnail: thumbnailUrl ? { url: thumbnailUrl } : null,
                timestamp: embed.timestamp,
                title: embed.title,
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
                member: message.member ? {
                    displayHexColor: message.member.displayHexColor,
                    displayName: message.member.displayName,
                } : null,
                system: message.author.system,
            });
        }

        const components = await componentsToJson(message.components, options);

        if (!options.includeEmpty && attachments.length == 0 && components.length == 0 && message.content == "" && message.embeds.length == 0 && !message.poll) return null;

        return {
            attachments: options.includeAttachments ? attachments : [],
            authorId: message.author.id,
            components: components,
            content: message.content,
            createdTimestamp: message.createdTimestamp,
            embeds: options.includeEmbeds ? embeds : [],
            id: message.id,
            mentions: {
                channels: message.mentions.channels.map(channel => ({ id: channel.id, name: channel.type !== ChannelType.DM ? channel.name : channel.recipient?.displayName ?? null })),
                everyone: message.mentions.everyone,
                roles: message.mentions.roles.map(role => ({ id: role.id, name: role.name, color: role.hexColor })),
                users: message.mentions.members ? message.mentions.members.map(member => ({ color: member.displayHexColor, id: member.id, name: member.displayName }))
                    : message.mentions.users.map(user => ({ color: user.hexAccentColor ?? null, id: user.id, name: user.displayName })),
            },
            poll: message.poll ? {
                answers: Array.from(message.poll.answers.values()).map(answer => ({
                    count: answer.voteCount,
                    emoji: answer.emoji ? {
                        animated: answer.emoji.animated ?? false,
                        id: answer.emoji.id,
                        name: answer.emoji.name,
                    } : null,
                    id: answer.id,
                    text: answer.text ?? "",
                })),
                expiry: message.poll.expiresTimestamp,
                isFinalized: message.poll.resultsFinalized,
                question: message.poll.question.text ?? "",
            } : null,
            reactions: message.reactions.cache.map(reaction => {
                if (reaction.emoji.name == null) return null;
                return {
                    count: reaction.count,
                    emoji: reaction.emoji.name,
                };
            }).filter(r => r != null),
            references: message.reference ? { messageId: message.reference.messageId ?? null } : null,
            system: message.system,
        };
    }));

    const messages = rawMessages.filter(m => m != null);
    const end = originalMessages.size !== 100;
    return { messages, end };
}
