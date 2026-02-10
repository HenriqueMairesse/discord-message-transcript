import { BaseGuildTextChannel, DMChannel } from "discord.js";
import { imageUrlResolver, urlResolver } from "@/assetResolver";
export class Json {
    guild;
    channel;
    authors;
    messages;
    options;
    mentions;
    cdnOptions;
    urlCache;
    constructor(guild, channel, options, cdnOptions, urlCache) {
        this.guild = guild;
        this.channel = channel;
        this.messages = [];
        this.options = options;
        this.authors = [];
        this.mentions = { channels: [], roles: [], users: [] };
        this.cdnOptions = cdnOptions;
        this.urlCache = urlCache;
    }
    addMessages(messages) {
        this.messages.push(...messages);
    }
    sliceMessages(size) {
        if (size > this.messages.length || size == 0) {
            return;
        }
        this.messages = this.messages.slice(0, size);
    }
    setMessages(messages) {
        this.messages = messages;
    }
    getMessages() {
        return this.messages;
    }
    setAuthors(authors) {
        this.authors = authors;
    }
    setMentions(mentions) {
        this.mentions = mentions;
    }
    async toJson() {
        const channel = await this.channel.fetch();
        const channelImg = channel instanceof DMChannel ? channel.recipient?.displayAvatarURL() ?? "cdn.discordapp.com/embed/avatars/4.png" : channel.isDMBased() ? channel.iconURL() ?? (await channel.fetchOwner()).displayAvatarURL() : null;
        const safeChannelImg = await imageUrlResolver(channelImg, this.options, true);
        const guild = !channel.isDMBased() ? this.guild : null;
        const guildIcon = guild ? await imageUrlResolver(guild.iconURL(), this.options, true) : null;
        const guildJson = !guild ? null : {
            name: guild.name,
            id: guild.id,
            icon: guildIcon ? await urlResolver(guildIcon, this.options, this.cdnOptions, this.urlCache) : null,
        };
        return {
            options: this.options,
            guild: guildJson,
            channel: {
                name: channel instanceof DMChannel ? channel.recipient?.displayName ?? "DM" : channel.isDMBased() ? channel.name ?? channel.recipients.join(", ") : channel.name,
                parent: channel.isDMBased() ? null : (channel.parent ? { name: channel.parent.name, id: channel.parent.id } : null),
                topic: (channel instanceof BaseGuildTextChannel) ? channel.topic : null,
                id: channel.id,
                img: safeChannelImg ? await urlResolver(safeChannelImg, this.options, this.cdnOptions, this.urlCache) : null,
            },
            authors: this.authors,
            messages: this.messages.reverse(),
            mentions: this.mentions
        };
    }
}
