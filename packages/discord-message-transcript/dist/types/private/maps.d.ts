import { JsonAuthor, JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers } from "discord-message-transcript-base/internal";
export type MapAuthors = Map<string, JsonAuthor>;
export type MapCache = Map<string, Promise<string>>;
/**
 * Defines the structure for storing discovered mentions (users, roles, channels) during transcript creation.
 * Uses Maps for efficient lookups.
 */
export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}
export type Maps = {
    authors: MapAuthors;
    mentions: MapMentions;
    urlCache: MapCache;
};
