import { hexColor } from "../util.js";
import { JsonButtonStyle, JsonComponentType } from "./enum.js";
/**
 * A union of all possible select menu types.
 */
export type JsonSelectMenu = JsonSelectMenuOthers | JsonSelectMenuString;
/**
 * A JSON-serializable representation of a Discord Action Row component.
 */
export interface JsonActionRow {
    /**
     * The components within the action row (e.g., buttons, select menus).
     */
    components: (JsonButtonComponent | JsonSelectMenu)[];
    /**
     * The type of the component.
     */
    type: JsonComponentType.ActionRow;
}
/**
 * A JSON-serializable representation of a message attachment.
 */
export interface JsonAttachment {
    /**
     * The MIME type of the attachment.
     */
    contentType: string | null;
    /**
     * The name of the attachment file.
     */
    name: string;
    /**
     * The size of the attachment in bytes.
     */
    size: number;
    /**
     * Whether the attachment is a spoiler.
     */
    spoiler: boolean;
    /**
     * The URL of the attachment.
     */
    url: string;
}
/**
 * A JSON-serializable representation of a message author.
 */
export interface JsonAuthor {
    /**
     * The URL of the author's avatar.
     */
    avatarURL: string;
    /**
     * Whether the author is a bot.
     */
    bot: boolean;
    /**
     * The display name of the author.
     */
    displayName: string;
    /**
     * The guild-specific tag of the author, if any.
     */
    guildTag: string | null;
    /**
     * The ID of the author.
     */
    id: string;
    /**
     * Information about the author as a guild member.
     */
    member: {
        /**
         * The member's display color in hex format.
         */
        displayHexColor: hexColor;
        /**
         * The member's display name in the guild.
         */
        displayName: string;
    } | null;
    /**
     * Whether the author is a system user.
     */
    system: boolean;
}
/**
 * A JSON-serializable representation of a button component.
 */
export interface JsonButtonComponent {
    /**
     * Whether the button is disabled.
     */
    disabled: boolean;
    /**
     * The emoji on the button, if any.
     */
    emoji: string | null;
    /**
     * The label text on the button.
     */
    label: string | null;
    /**
     * The style of the button.
     */
    style: JsonButtonStyle;
    /**
     * The type of the component.
     */
    type: JsonComponentType.Button;
    /**
     * The URL for link-style buttons.
     */
    url: string | null;
}
/**
 * A JSON-serializable representation of a message embed.
 */
export interface JsonEmbed {
    author: {
        name: string;
        url: string | null;
        iconURL: string | null;
    } | null;
    description: string | null;
    fields: {
        inline: boolean | null;
        name: string;
        value: string;
    }[];
    footer: {
        iconURL: string | null;
        text: string;
    } | null;
    hexColor: hexColor | null;
    image: {
        url: string;
    } | null;
    thumbnail: {
        url: string;
    } | null;
    timestamp: string | null;
    title: string | null;
    type: string;
    url: string | null;
}
/**
 * A JSON-serializable representation of a poll.
 */
export interface JsonPoll {
    /**
     * The answers available in the poll.
     */
    answers: JsonPollAnswer[];
    /**
     * A formatted string indicating when the poll expires.
     */
    expiry: string | null;
    /**
     * Whether the poll has been finalized.
     */
    isFinalized: boolean;
    /**
     * The question of the poll.
     */
    question: string;
}
/**
 * A JSON-serializable representation of a single answer in a poll.
 */
export interface JsonPollAnswer {
    /**
     * The number of votes for this answer.
     */
    count: number;
    /**
     * The emoji associated with this answer, if any.
     */
    emoji: {
        id: string | null;
        name: string | null;
        animated: boolean;
    } | null;
    /**
     * The ID of the answer.
     */
    id: number;
    /**
     * The text of the answer.
     */
    text: string;
}
/**
 * A JSON-serializable representation of an option in a select menu.
 */
export interface JsonSelectOption {
    /**
     * The description of the option.
     */
    description: string | null;
    /**
     * The emoji for the option, if any.
     */
    emoji: {
        id: string | null;
        name: string | null;
        animated: boolean;
    } | null;
    /**
     * The user-facing label for the option.
     */
    label: string;
}
/**
 * A JSON-serializable representation of a non-string select menu.
 */
interface JsonSelectMenuOthers {
    /**
     * Whether the select menu is disabled.
     */
    disabled: boolean;
    /**
     * The placeholder text for the select menu.
     */
    placeholder: string | null;
    /**
     * The type of the select menu.
     */
    type: JsonComponentType.UserSelect | JsonComponentType.RoleSelect | JsonComponentType.MentionableSelect | JsonComponentType.ChannelSelect;
}
/**
 * A JSON-serializable representation of a string select menu.
 */
interface JsonSelectMenuString {
    /**
     * Whether the select menu is disabled.
     */
    disabled: boolean;
    /**
     * The options available in the select menu.
     */
    options: JsonSelectOption[];
    /**
     * The placeholder text for the select menu.
     */
    placeholder: string | null;
    /**
     * The type of the select menu.
     */
    type: JsonComponentType.StringSelect;
}
export {};
