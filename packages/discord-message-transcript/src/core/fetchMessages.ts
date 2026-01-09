import { ChannelType, ComponentType, DMChannel, TextBasedChannel, TopLevelComponent } from "discord.js";
import { JsonMessage, TranscriptOptions } from "../types/types";

export async function fetchMessages(channel: TextBasedChannel, options: TranscriptOptions, after?: string): Promise<{ messages: JsonMessage[], end: boolean }> {

    const originalMessages = await channel.messages.fetch({ limit: 100, cache: false, after: after });
    let messages: JsonMessage[] = originalMessages.map(message => {
        if (message.id == "1437161702205423731") console.log(message.mentions.members)

        return {
        attachments: message.attachments.map(attachment => attachment),
        author: {
            avatarURL: message.author.displayAvatarURL(),
            bot: message.author.bot,
            displayName: message.author.displayName,
            guildTag: message.author.primaryGuild?.tag ?? null,
            id: message.author.id,
            system: message.author.system
        },
        components: message.components,
        content: message.content,
        createdTimesptamp: message.createdTimestamp,
        embeds: message.embeds,
        id: message.id,
        member: message.member ? {
            displayHexColor: message.member?.displayHexColor,
            displayName: message.member?.displayName
        } : null,
        mentions: {
            users: message.mentions.members ? message.mentions.members.map(member => {
                return {
                    id: member.id,
                    name: member.displayName,
                    color: member.displayHexColor
                };
            }) : message.mentions.users.map(user => {
                return {
                    id: user.id,
                    name: user.displayName,
                    color: user.hexAccentColor ?? null
                };
            }),
            channels: message.mentions.channels.map(channel => {
                return {
                    id: channel.id,
                    name: channel.type != ChannelType.DM ? channel.name : channel.recipient?.displayName ?? null,
                };
            }), 
            roles: message.mentions.roles.map(role => {
                return {
                    id: role.id,
                    name: role.name,
                    color: role.hexColor,
                };
            }),
            everyone: message.mentions.everyone
        },
        poll: message.poll,
        references: message.reference,
        system: message.system
    }})
    let end = messages.length != 100;  

    messages.forEach(async (message) => {
        if (!options.includeAttachments) {
            message.attachments = [];
        }

        if (!options.includeEmbeds) {
            message.embeds = [];
        }

        if (!options.includeComponents || !options.includeButtons || !options.includeV2Components) {
            const components: TopLevelComponent[] = [];

            message.components.forEach(component => {
                if (!options.includeV2Components && (
                    component.type == ComponentType.Container || component.type == ComponentType.File ||
                    component.type == ComponentType.MediaGallery || component.type == ComponentType.Section ||
                    component.type == ComponentType.Separator || component.type == ComponentType.TextDisplay
                )) {
                    return;
                }

                if (component.type == ComponentType.ActionRow) {
                    if (!options.includeButtons && component.components[0]?.type == ComponentType.Button) {
                        return;
                    }
                    if (!options.includeComponents && component.components[0]?.type != ComponentType.Button) {
                        return;
                    }
                }

                components.push(component);

            })

            message.components = components;
            
        }
    })

    return { messages, end };

} 