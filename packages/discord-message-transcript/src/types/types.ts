import { ReturnType as ReturnTypeBase, ConvertTranscriptOptions as ConvertTranscriptOptionsBase, CreateTranscriptOptions as CreateTranscriptOptionsBase, TranscriptOptions as TranscriptOptionsBase, JsonData as JsonDataBase, JsonMessageMentionsChannels, JsonMessageMentionsRoles, JsonMessageMentionsUsers } from "discord-message-transcript-base/types/types";

export type ReturnType = "attachment" | ReturnTypeBase;

export interface CreateTranscriptOptions extends Omit<CreateTranscriptOptionsBase, 'returnType'> {
    returnType?: ReturnType
}

export interface ConvertTranscriptOptions extends Omit<ConvertTranscriptOptionsBase, 'returnType'> {
    returnType?: ReturnType
}

export interface MapMentions {
    channels: Map<string, JsonMessageMentionsChannels>;
    roles: Map<string, JsonMessageMentionsRoles>;
    users: Map<string, JsonMessageMentionsUsers>;
}