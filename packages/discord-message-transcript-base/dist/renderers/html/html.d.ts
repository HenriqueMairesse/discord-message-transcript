import { JsonData } from "@/types/internal/message/messageItens.js";
export declare class Html {
    data: JsonData;
    dateFormat: Intl.DateTimeFormat;
    constructor(data: JsonData);
    private getIcon;
    private headerBuilder;
    private messagesBuilder;
    toHTML(): Promise<string>;
    private pollBuilder;
    private pollResultEmbedBuilder;
    private embedBuilder;
    private attachmentBuilder;
    private componentBuilder;
    private buttonBuilder;
    private selectorBuilder;
    private reactionsBuilder;
    private spoilerAttachmentBuilder;
    private svgBuilder;
}
