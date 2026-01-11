import { JsonData } from "../../types/types";
export declare class Html {
    data: JsonData;
    dateFormat: Intl.DateTimeFormat;
    constructor(data: JsonData);
    private headerBuilder;
    private messagesBuilder;
    toHTML(): string;
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
