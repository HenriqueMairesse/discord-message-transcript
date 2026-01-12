import { ReturnType as ReturnTypeBase, CreateTranscriptOptions as CreateTranscriptOptionsBase, JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers } from "discord-message-transcript-base/types/types";
export type ReturnType = "attachment" | ReturnTypeBase;
export interface CreateTranscriptOptions extends Omit<CreateTranscriptOptionsBase, 'returnType'> {
    returnType?: ReturnType;
}
export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}
