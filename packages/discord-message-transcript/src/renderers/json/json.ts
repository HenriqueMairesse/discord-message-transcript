import { BaseGuildTextChannel, DMChannel, Guild, TextBasedChannel } from "discord.js";
import { ArrayMentions, JsonAuthor, JsonMessage } from "discord-message-transcript-base/types/types";
import { TranscriptOptions, JsonData } from "discord-message-transcript-base/types/types";

export class Json {
    guild: Guild | null;
    channel: TextBasedChannel;
    authors: JsonAuthor[];
    messages: JsonMessage[];
    options: TranscriptOptions;
    mentions: ArrayMentions;

    constructor(guild: Guild | null, channel: TextBasedChannel, options: TranscriptOptions) {
        this.guild = guild;
        this.channel = channel;
        this.messages = [];
        this.options = options;
        this.authors = [];
        this.mentions = { channels: [], roles: [], users: []};
    }

    addMessages(messages: JsonMessage[]): void {
        this.messages.push(...messages);
    }

    sliceMessages(size: number): void {
        if (size > this.messages.length || size == 0) {
            return;
        }
        this.messages = this.messages.slice(0, size - 1);
    }

    setAuthors(authors: JsonAuthor[]) {
        this.authors = authors;
    }

    setMentions(mentions: ArrayMentions) {
        this.mentions = mentions;
    }

    async toJson(): Promise<JsonData> {

        const channel = await this.channel.fetch();
        const guild = !channel.isDMBased() ? this.guild : null;

        const guildJson = !guild ? null : {
            name: guild.name,
            id: guild.id,
            icon: guild.iconURL(),
        }

        return {
            options: this.options,
            guild: guildJson,
            channel: {
                name: channel instanceof DMChannel ? channel.recipient?.displayName ?? "DM" : channel.isDMBased() ? channel.name ?? channel.recipients.join(", ")  : channel.name,
                parent: channel.isDMBased() ? null : (channel.parent ? { name: channel.parent.name, id: channel.parent.id } : null),
                topic: (channel instanceof BaseGuildTextChannel) ? channel.topic : null,
                id: channel.id,
                img: channel instanceof DMChannel ? channel.recipient?.displayAvatarURL() ?? "cdn.discordapp.com/embed/avatars/4.png" : channel.isDMBased() ? channel.iconURL() ?? (await channel.fetchOwner()).displayAvatarURL() : null,
            },
            authors: this.authors,
            messages: this.messages.reverse(),
            mentions: this.mentions
        };
    }

}