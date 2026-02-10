import { JsonMessage } from "discord-message-transcript-base";
import { FetchMessagesContext } from "@/types";
export declare function fetchMessages(ctx: FetchMessagesContext): Promise<{
    messages: JsonMessage[];
    end: boolean;
    newLastMessageId: string | undefined;
}>;
