import { BaseGuildTextChannel, DMChannel } from "discord.js";
export class Json {
    guild;
    channel;
    messages;
    constructor(guild, channel) {
        this.guild = guild;
        this.channel = channel;
        this.messages = [];
    }
    addMessages(messages) {
        this.messages.push(...messages);
    }
    sliceMessages(size) {
        if (size > this.messages.length || size == 0) {
            return;
        }
        this.messages = this.messages.slice(0, size - 1);
    }
    async toJson() {
        const channel = await this.channel.fetch();
        const guild = !channel.isDMBased() ? this.guild : null;
        const guildJson = !guild ? null : {
            name: guild.name,
            id: guild.id,
            icon: guild.iconURL(),
        };
        return {
            guild: guildJson,
            channel: {
                name: channel instanceof DMChannel ? channel.recipient?.displayName ?? "DM" : channel.isDMBased() ? channel.name ?? channel.recipients.join(", ") : channel.name,
                parent: channel.isDMBased() ? null : (channel.parent ? { name: channel.parent.name, id: channel.parent.id } : null),
                topic: (channel instanceof BaseGuildTextChannel) ? channel.topic : null,
                id: channel.id,
                img: channel instanceof DMChannel ? channel.recipient?.displayAvatarURL() ?? "cdn.discordapp.com/embed/avatars/4.png" : channel.isDMBased() ? channel.iconURL() ?? (await channel.fetchOwner()).displayAvatarURL() : null,
            },
            messages: this.messages.reverse()
        };
    }
}
