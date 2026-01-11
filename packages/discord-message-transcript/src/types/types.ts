import { ReturnType as ReturnTypeBase, CreateTranscriptOptions as CreateTranscriptOptionsBase, TranscriptOptions as TranscriptOptionsBase, JsonData as JsonDataBase } from "discord-message-transcript-base/types/types";

export type ReturnType = "attachment" | ReturnTypeBase;

export interface CreateTranscriptOptions extends Omit<CreateTranscriptOptionsBase, 'returnType'> {
    returnType?: ReturnType
}