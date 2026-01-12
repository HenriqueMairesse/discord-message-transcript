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
