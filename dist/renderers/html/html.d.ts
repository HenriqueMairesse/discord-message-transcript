import { JsonData, JsonDataChannel, JsonDataGuild, JsonMessage, TranscriptOptions } from "../../types/types";
export declare class Html {
    guild: JsonDataGuild | null;
    channel: JsonDataChannel;
    messages: JsonMessage[];
    options: TranscriptOptions;
    dateFormat: Intl.DateTimeFormat;
    constructor(data: JsonData, options: TranscriptOptions);
    private headerBuilder;
    private messagesBuilder;
    toHTML(): string;
    private embedBuilder;
    private attachmentBuilder;
    private componentBuilder;
    private buttonBuilder;
    private spoilerAttachmentBuilder;
}
