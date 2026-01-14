import { ChannelType } from "discord.js";
export function getMentions(message, mentions) {
    message.mentions.channels.forEach(channel => {
        if (!mentions.channels.has(channel.id)) {
            mentions.channels.set(channel.id, {
                id: channel.id,
                name: channel.type !== ChannelType.DM ? channel.name : channel.recipient?.displayName ?? null
            });
        }
    });
    message.mentions.roles.forEach(role => {
        if (!mentions.roles.has(role.id)) {
            mentions.roles.set(role.id, {
                id: role.id,
                color: role.hexColor,
                name: role.name
            });
        }
    });
    if (message.guild) {
    }
    if (message.mentions.members) {
        message.mentions.members.forEach(member => {
            if (!mentions.users.has(member.id)) {
                mentions.users.set(member.id, {
                    id: member.id,
                    color: member.displayHexColor,
                    name: member.displayName
                });
            }
        });
    }
    else {
        message.mentions.users.forEach(user => {
            if (!mentions.users.has(user.id)) {
                mentions.users.set(user.id, {
                    id: user.id,
                    color: user.hexAccentColor ?? null,
                    name: user.displayName
                });
            }
        });
    }
    fetchRoleMention(message, mentions);
    fetchChannelMention(message, mentions);
    fetchUserMention(message, mentions);
}
// Needs to fix that sometimes discord laks to provide all roles mentions in a message
function fetchRoleMention(message, mentions) {
    const roleIds = [];
    for (const match of message.content.matchAll(/<@&(\d+)>/g)) {
        const roleId = match[1];
        if (roleId && !roleIds.includes(roleId) && !mentions.roles.has(roleId)) {
            roleIds.push(roleId);
        }
    }
    roleIds.forEach(async (id) => {
        const role = await message.guild?.roles.fetch(id);
        if (!role)
            return;
        mentions.roles.set(role.id, { id: role.id, color: role.hexColor, name: role.name });
    });
}
function fetchUserMention(message, mentions) {
    const usersId = [];
    for (const match of message.content.matchAll(/<@(\d+)>/g)) {
        const userId = match[1];
        if (userId && !usersId.includes(userId) && !mentions.roles.has(userId)) {
            usersId.push(userId);
        }
    }
    usersId.forEach(async (id) => {
        if (message.guild) {
            const user = await message.guild.members.fetch(id);
            if (!user)
                return;
            mentions.users.set(user.id, { id: user.id, color: user.displayHexColor, name: user.displayName });
        }
        const user = await message.client.users.fetch(id);
        if (!user)
            return;
        mentions.users.set(user.id, { id: user.id, color: user.hexAccentColor ?? null, name: user.displayName });
    });
}
function fetchChannelMention(message, mentions) {
    const channelIds = [];
    for (const match of message.content.matchAll(/<#(\d+)>/g)) {
        const channelId = match[1];
        if (channelId && !channelIds.includes(channelId) && !mentions.channels.has(channelId)) {
            channelIds.push(channelId);
        }
    }
    channelIds.forEach(async (id) => {
        const channel = await message.guild?.channels.fetch(id);
        if (!channel)
            return;
        mentions.channels.set(channel.id, { id: channel.id, name: channel.name });
    });
}
