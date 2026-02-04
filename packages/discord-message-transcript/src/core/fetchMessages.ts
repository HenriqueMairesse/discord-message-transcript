import { EmbedType, TextBasedChannel } from "discord.js";
import { componentsToJson } from "./componentToJson.js";
import { urlResolver } from "./urlResolver.js";
import { CustomError, JsonAuthor, JsonMessage, TranscriptOptionsBase } from "discord-message-transcript-base";
import { CDNOptions, MapMentions } from "../types/types.js";
import { getMentions } from "./getMentions.js";

export async function fetchMessages(channel: TextBasedChannel, options: TranscriptOptionsBase, cdnOptions: CDNOptions<unknown> | null, authors: Map<string,JsonAuthor>, mentions: MapMentions, after?: string): Promise<{ messages: JsonMessage[], end: boolean }> {
    const originalMessages = await channel.messages.fetch({ limit: 100, cache: false, after: after });

    const rawMessages: JsonMessage[] = await Promise.all(originalMessages.map(async (message) => {
        const attachments = await Promise.all(message.attachments.map(async (attachment) => {
            return {
                contentType: attachment.contentType,
                name: attachment.name,
                size: attachment.size,
                spoiler: attachment.spoiler,
                url: await urlResolver(attachment.url, options, cdnOptions),
            };
        }));

        // This only works because embeds with the type poll_result that are send when a poll end are marked as a message send by the system  
        const embeds = message.system && message.embeds.length == 1 && message.embeds[0].data.type == EmbedType.PollResult && !options.includePolls ? []
        : await Promise.all(message.embeds.map(async (embed) => {
            const [authorIcon, thumbnailUrl, imageUrl, footerIcon] = await Promise.all([
                embed.author?.iconURL ? urlResolver(embed.author.iconURL, options, cdnOptions) : Promise.resolve(null),
                embed.thumbnail?.url ? urlResolver(embed.thumbnail.url, options, cdnOptions) : Promise.resolve(null),
                embed.image?.url ? urlResolver(embed.image.url, options, cdnOptions) : Promise.resolve(null),
                embed.footer?.iconURL ? urlResolver(embed.footer.iconURL, options, cdnOptions) : Promise.resolve(null),
            ]);
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
                avatarURL: await urlResolver(message.author.displayAvatarURL(), options, cdnOptions),
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

        const components = await componentsToJson(message.components, options, cdnOptions);

        await getMentions(message, mentions);

        return {
            attachments: options.includeAttachments ? attachments : [],
            authorId: message.author.id,
            components: components,
            content: message.content,
            createdTimestamp: message.createdTimestamp,
            embeds: options.includeEmbeds || options.includePolls ? embeds : [],
            id: message.id,
            mentions: message.mentions.everyone,
            poll: options.includePolls && message.poll ? {
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
                expiry: message.poll.expiresTimestamp ? formatTimeLeftPoll(message.poll.expiresTimestamp) : null,
                isFinalized: message.poll.resultsFinalized,
                question: message.poll.question.text ?? "",
            } : null,
            reactions: options.includeReactions ? message.reactions.cache.map(reaction => {
                if (reaction.emoji.name == null) return null;
                return {
                    count: reaction.count,
                    emoji: reaction.emoji.name,
                };
            }).filter(r => r != null) : [],
            references: message.reference ? { messageId: message.reference.messageId ?? null } : null,
            system: message.system,
        };
    }));

    const messages = rawMessages.filter(m => !(!options.includeEmpty && m.attachments.length == 0 && m.components.length == 0 && m.content == "" && m.embeds.length == 0 && !m.poll));
    const end = originalMessages.size !== 100;
    return { messages, end };
}


function formatTimeLeftPoll(timestamp: number): string {
    const now = new Date();
    const leftDate = new Date(timestamp);

    const diffSeconds = Math.floor((leftDate.getTime() - now.getTime()) / 1000);

    const day = Math.floor(diffSeconds / 86400);
    if (day > 0) return `${day}d left`;

    const hour = Math.floor(diffSeconds / 3600);
    if (hour > 0) return `${hour}h left`;

    const min = Math.floor(diffSeconds / 60);
    if (min > 0) return `${min}m left`;

    if (diffSeconds > 0) return `${diffSeconds}s left`;

    return "now"; // fallback
} 