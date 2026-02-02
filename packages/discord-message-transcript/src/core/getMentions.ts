import { ChannelType, Message } from "discord.js"
import { MapMentions } from "../types/types.js"

export async function getMentions(message: Message, mentions: MapMentions) {
    message.mentions.channels.forEach(channel => {
        if (!mentions.channels.has(channel.id)) {
            mentions.channels.set(channel.id, {
                id: channel.id,
                name: channel.type !== ChannelType.DM ? channel.name : channel.recipient?.displayName ?? null
            })
        }
    })
    
    message.mentions.roles.forEach(role => {
        if (!mentions.roles.has(role.id)) {
            mentions.roles.set(role.id, {
                id: role.id,
                color: role.hexColor,
                name: role.name
            })
        }
    })
    
    if (message.mentions.members) {
        message.mentions.members.forEach(member => { 
            if (!mentions.users.has(member.id)) {
                mentions.users.set(member.id, {
                    id: member.id,
                    color: member.displayHexColor,
                    name: member.displayName
                })
            }
        })
    } else {
        message.mentions.users.forEach(user => {
            if (!mentions.users.has(user.id)) {
                mentions.users.set(user.id, {
                    id: user.id,
                    color: user.hexAccentColor ?? null,
                    name: user.displayName
                })
            }
        })
    }

    await Promise.all([fetchRoleMention(message, mentions), fetchChannelMention(message, mentions), fetchUserMention(message, mentions)]);
}

// Discord sometimes lacks role mentions in message.mentions
async function fetchRoleMention(message: Message, mentions: MapMentions) {
    const roleIds: Set<string> = new Set();

    for (const match of message.content.matchAll(/<@&(\d+)>/g)) {
        const roleId = match[1];
        if (roleId && !mentions.roles.has(roleId)) {
            roleIds.add(roleId);
        }
    }

    for (const id of roleIds) {
        try {
            const role = await message.guild?.roles.fetch(id);
            if (!role) continue;
            mentions.roles.set(role.id, { id: role.id, color: role.hexColor, name: role.name })
        } catch {}  // Role may not exist
    }

}

async function fetchUserMention(message: Message, mentions: MapMentions) {
    const usersId: Set<string> = new Set();

    for (const match of message.content.matchAll(/<@(\d+)>/g)) {
        const userId = match[1];
        if (userId && !mentions.users.has(userId)) {
            usersId.add(userId);
        }
    }

    for (const id of usersId) {
        if (message.guild) {
            try {
                const user = await message.guild.members.fetch(id);
                if (user) {
                    mentions.users.set(user.id, { id: user.id, color: user.displayHexColor, name: user.displayName });
                    continue; // Continue inside if to allow fallback to regular user fetch
                }
            } catch {} // Member may not exist
        }
        try {
            const user = await message.client.users.fetch(id);
            if (!user) continue;
            mentions.users.set(user.id, { id: user.id, color: message.guild ? null : user.hexAccentColor ?? null, name: user.displayName })
        } catch {} // User may not exist
    }
}

async function fetchChannelMention(message: Message, mentions: MapMentions) {
    const channelIds: Set<string> = new Set();

    for (const match of message.content.matchAll(/<#(\d+)>/g)) {
        const channelId = match[1];
        if (channelId && !mentions.channels.has(channelId)) {
            channelIds.add(channelId);
        }
    }

    for (const id of channelIds) {
        try {
            const channel = await message.guild?.channels.fetch(id);
            if (!channel) continue;
            mentions.channels.set(channel.id, { id: channel.id, name: channel.name })
        } catch {} // Channel may not exist
    }
}