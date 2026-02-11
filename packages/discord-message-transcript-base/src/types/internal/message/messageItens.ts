import { TranscriptOptionsBase } from "../transcript.js";
import { ArrayMentions, hexColor } from "../util.js";
import { JsonActionRow, JsonAttachment, JsonAuthor, JsonButtonComponent, JsonEmbed, JsonPoll, JsonSelectMenu } from "./components.js";
import { JsonFileComponent, JsonMediaGalleryComponent, JsonSectionComponent, JsonSeparatorComponent, JsonTextDisplayComponent, JsonV2Component } from "./componentsV2.js";


/**
 * A union of all component types that can be placed inside a `JsonContainerComponent`.
 */
export type JsonComponentInContainer = JsonActionRow | JsonFileComponent | JsonMediaGalleryComponent | JsonSectionComponent | JsonSeparatorComponent | JsonTextDisplayComponent;

/**
 * A union of all top-level component types that can exist directly in a message.
 */
export type JsonTopLevelComponent = JsonActionRow | JsonButtonComponent | JsonSelectMenu | JsonV2Component;

/**
 * The root object for a JSON transcript, containing all data.
 */
export interface JsonData {
    /**
     * A list of all unique authors in the transcript.
     */
    authors: JsonAuthor[],
    /**
     * Information about the channel where the transcript was created.
     */
    channel: JsonDataChannel,
    /**
     * Information about the guild.
     */
    guild: JsonDataGuild | null,
    /**
     * An array of all messages in the transcript.
     */
    messages: JsonMessage[],
    /**
     * The options used to create this transcript.
     */
    options: TranscriptOptionsBase,
    /**
     * A list of all mentions found in the messages.
     */
    mentions: ArrayMentions,
}

/**
 * A JSON-serializable representation of the transcript's channel.
 */
export interface JsonDataChannel {
    /**
     * The ID of the channel.
     */
    id: string,
    /**
     * The icon URL for the channel (e.g., for DMs).
     */
    img: string | null,
    /**
     * The name of the channel.
     */
    name: string,
    /**
     * The parent category of the channel, if any.
     */
    parent: {
        name: string,
        id: string,
    } | null,
    /**
     * The topic of the channel.
     */
    topic: string | null,
}

/**
 * A JSON-serializable representation of the transcript's guild.
 */
export interface JsonDataGuild {
    /**
     * The URL of the guild's icon.
     */
    icon: string | null,
    /**
     * The ID of the guild.
     */
    id: string,
    /**
     * The name of the guild.
     */
    name: string,
}

/**
 * A JSON-serializable representation of a Discord message.
 */
export interface JsonMessage {
    attachments: JsonAttachment[],
    authorId: string,
    components: JsonTopLevelComponent[],
    content: string,
    createdTimestamp: number,
    embeds: JsonEmbed[],
    id: string,
    mentions: boolean,
    poll: JsonPoll | null,
    reactions: JsonReaction[],
    references: {
        messageId: string | null
    } | null,
    system: boolean,
}

/**
 * Structure containing arrays of mentions found in a message.
 */
export interface JsonMessageMentions {
    channels: JsonMessageMentionsChannels[],
    roles: JsonMessageMentionsRoles[],
    users: JsonMessageMentionsUsers[],
}

/**
 * A JSON-serializable representation of a channel mention.
 */
export interface JsonMessageMentionsChannels {
    id: string,
    name: string | null,
}

/**
 * A JSON-serializable representation of a role mention.
 */
export interface JsonMessageMentionsRoles {
    id: string,
    name: string,
    color: hexColor,
}

/**
 * A JSON-serializable representation of a user mention.
 */
export interface JsonMessageMentionsUsers {
    id: string,
    name: string,
    color: hexColor | null,
}

/**
 * A JSON-serializable representation of a message reaction.
 */
export interface JsonReaction {
    /**
     * The number of times the emoji was reacted.
     */
    count: number,
    /**
     * The emoji that was reacted.
     */
    emoji: string,
}


