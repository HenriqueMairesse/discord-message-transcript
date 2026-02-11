import { JsonMessage } from "discord-message-transcript-base/internal";
import { FetchMessagesContext } from "../../types/private/discordParser.js";
export declare function fetchMessages(ctx: FetchMessagesContext): Promise<{
    messages: JsonMessage[];
    end: boolean;
    newLastMessageId: string | undefined;
}>;
