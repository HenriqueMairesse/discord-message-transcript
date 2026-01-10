import { CustomError } from "../../core/error";
import { markdownToHTML } from "../../core/markdown";
import { JsonAttachment, JsonButtonComponent, JsonButtonStyle, JsonComponentType, JsonData, JsonEmbed, JsonMessage, JsonSelectMenu, JsonTopLevelComponent } from "../../types/types";
import { ACTIONROW_CSS, ATTACHMENT_CSS, BUTTON_CSS, COMPONENTS_CSS, COMPONENTSV2_CSS, DEFAULT_CSS, EMBED_CSS, MESSAGE_CSS } from "./css";
import { script } from "./js";

const COUNT_UNIT = ["KB", "MB", "GB", "TB"];
const BUTTON_COLOR = ["black", "#5865f2", "gray", "lime", "red", "black", "#5865f2"];

export class Html {
    data: JsonData;
    dateFormat: Intl.DateTimeFormat;

    constructor(data: JsonData) {
        this.data = data;
        try {
            this.dateFormat = new Intl.DateTimeFormat(data.options.localDate, {
                timeZone: data.options.timeZone,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            throw new CustomError("[discord-message-transcript] Invalid LocalDate and/or TimeZone.");
        }
    }

    private headerBuilder() {
        const { channel, guild } = this.data;
        return `
        <div style="display: flex;  gap: 1.5rem; align-items: center;">
            ${channel.img ? `<img src="${channel.img}" style="width: 7rem; height: 7rem; border-radius: 50%;">` : ""}
            <div style="display: flex; flex-direction: column; justify-content: center; gap: 1.25rem;">
                ${guild ? `<div id="guild" class="line">
                    <h4>Guild: </h4>
                    <h4 style="font-weight: normal;">${guild.name}</h4>
                </div>` : ""}
                ${channel.parent ? `<div id="category" class="line">
                    <h4>Category: </h4>
                    <h4 style="font-weight: normal;">${channel.parent.name}</h4>
                </div>` : ""}
                <div id="channel" class="line">
                    <h4>Channel: </h4>
                    <h4 style="font-weight: normal;">${channel.name}</h4>
                </div>
                ${channel.topic ? `<div id="topic" class="line">
                    <h4>Topic: </h4>
                    <h4 style="font-weight: normal;">${channel.topic}</h4>
                </div>` : ""}
            </div>
        </div>
        `;
    }

    private messagesBuilder() {
        return this.data.messages.map(message => {
            const date = new Date(message.createdTimestamp);
            
            return `
<div class="messageDiv" id="${message.id}" data-author-id="${message.authorId}">
    ${ message.references && message.references.messageId ? 
    `<div class="messageReply" data-id="${message.references.messageId}">
        <svg class="messageReplySvg"><use href="#reply-icon"></use></svg>
        <img class="messageReplyImg" src="">
        <div class="replyBadges"></div>
        <div class="messageReplyText"></div>
    </div>` : ""}
    <div class="messageBotton">
        <img src="" class="messageImg">
        <div class="messageDivRight">
            <div class="messageUser">
                <h3 class="messageUsername"></h3>
                <div class="badges"></div>
                <p class="messageTimeStamp">${this.dateFormat.format(date)}</p>
            </div>
            <div class="messageContent">${markdownToHTML(message.content, message.mentions, this.dateFormat)}</div>
            ${message.embeds.length > 0 ? this.embedBuilder(message, message.embeds) : ""}
            ${message.attachments.length > 0 ? this.attachmentBuilder(message.attachments) : ""}
            ${message.components.length > 0 ? this.componentBuilder(message, message.components) : ""}
        </div>
    </div>
</div>
        `;
        }).join("");
    }

    toHTML() {
        const { options } = this.data;
        return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.fileName}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/atom-one-dark.min.css">
    <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js"></script>
    <style>
    ${DEFAULT_CSS}
    ${MESSAGE_CSS}
    ${options.includeEmbeds ? EMBED_CSS : ""}
    ${options.includeButtons || options.includeComponents ? ACTIONROW_CSS : ""}
    ${options.includeAttachments || options.includeV2Components ? ATTACHMENT_CSS : ""}
    ${options.includeButtons || options.includeV2Components ? BUTTON_CSS : ""}
    ${options.includeComponents ? COMPONENTS_CSS : ""}
    ${options.includeV2Components ? COMPONENTSV2_CSS : ""}
    </style>
</head>
<body>
    ${this.svgBuilder()}
    <header>
        ${this.headerBuilder()}
    </header>
    <main style="display: flex; flex-direction: column; padding: 2.25%;">
       ${this.messagesBuilder()}
    </main>
    <footer>
        <br>
        <h2>Transcript generated by <a href="https://github.com/HenriqueMairesse/discord-channel-transcript">discord-channel-transcript</a></h2>
    </footer>
    <script id="authorData" type="application/json">
        ${JSON.stringify({ authors: this.data.authors })}
    </script>
    <script>
        ${script}
    </script>
</body>
</html>     
        `;
    }

    private embedBuilder(message: JsonMessage, embeds: JsonEmbed[]): string {
        return embeds.map(embed => {
            const embedAuthor = embed.author ? (embed.author.url ? `<a class="embedHeaderRightAuthorName" href="${embed.author.url}" target="_blank">${embed.author.name}</a>` : `<p class="embedHeaderRightAuthorName">${embed.author.name}</p>`) : "";
            const embedTitle = embed.title ? (embed.url ? `<a class="embedHeaderRightTitle" href="${embed.url}" target="_blank">${embed.title}</a>` : `<p class="embedHeaderRightTitle">${embed.title}</p>`) : "";

            return embed.type != "poll_result" ? `
                <div class="embed" style="${embed.hexColor ? `border-left-color: ${embed.hexColor}` : ''}">
                    ${embed.author || embed.title || embed.thumbnail ? `
                    <div class="embedHeader">
                        <div class="embedHeaderRight">
                            ${embed.author ? `
                            <div class="embedHeaderRightAuthor">
                                ${embed.author.iconURL ? `<img class="embedHeaderRightAuthorImg" src="${embed.author.iconURL}">` : ""}
                                ${embedAuthor}
                            </div>` : ""}
                            ${embedTitle}
                        </div>
                        ${embed.thumbnail ? `<img class="embedHeaderThumbnail" src="${embed.thumbnail.url}">` : ""}
                    </div>` : ""}
                    ${embed.description ? `<div class="embedDescription">${markdownToHTML(embed.description, message.mentions, this.dateFormat)}</div>` : ""}
                    ${embed.fields && embed.fields.length > 0 ? `
                    <div class="embedFields">
                        ${embed.fields.map(field => `
                        <div class="embedFieldsField" style="${field.inline ? 'display: inline-block;' : ''}">
                            <p class="embedFieldsFieldTitle">${field.name}</p>
                            <p class="embedFieldsFieldValue">${markdownToHTML(field.value, message.mentions, this.dateFormat)}</p>
                        </div>`).join("")}
                    </div>` : ""}
                    ${embed.image ? `
                    <div class="embedImage">
                        <img src="${embed.image.url}">
                    </div>` : ""}
                    ${embed.footer || embed.timestamp ? `
                    <div class="embedFooter">
                        ${embed.footer?.iconURL ? `<img class="embedFooterImg" src="${embed.footer.iconURL}">` : ""}
                        ${embed.footer?.text || embed.timestamp ? `<p class="embedFooterText">${embed.footer?.text ?? ''}${embed.footer?.text && embed.timestamp ? ' | ' : ''}${embed.timestamp ? this.dateFormat.format(new Date(embed.timestamp)) : ''}</p>` : ""}
                    </div>` : ""}
                </div>
            ` : ``;
        }).join("");
    }

    private attachmentBuilder(attachments: JsonAttachment[]): string {
        return attachments.map(attachment => {
            let html = "";

            if (attachment.contentType?.startsWith('image/')) {
                html = `<img class="attachmentImage" src="${attachment.url}">`;
            } else if (attachment.contentType?.startsWith('video/')) {
                html = `<video class="attachmentVideo" controls src="${attachment.url}"></video>`;
            } else if (attachment.contentType?.startsWith('audio/')) {
                html = `<audio class="attachmentAudio" controls src="${attachment.url}"></audio>`;
            } else {
                let fileSize = attachment.size / 1024;
                let count = 0;
                while (fileSize > 512 && count < COUNT_UNIT.length - 1) {
                    fileSize = fileSize / 1024;
                    count++;
                }

                html = `
                    <div class="attachmentFile">
                        <div class="attachmentFileInfo">
                            <p class="attachmentFileName">${attachment.name ?? 'attachment'}</p>
                            <div class="attachmentFileSize">${fileSize.toFixed(2)} ${COUNT_UNIT[count]}</div>
                        </div>
                        <a class="attachmentDownload" href="${attachment.url}" target="_blank">
                            <svg class="attachmentDownloadIcon"><use href="#download-icon"></use></svg>
                        </a>
                    </div>
                `;
            }

            return this.spoilerAttachmentBuilder(attachment.spoiler, html);
        }).join("");
    }

    private componentBuilder(message: JsonMessage, components: JsonTopLevelComponent[]): string {
        return components.map(component => {
            switch (component.type) {
                case JsonComponentType.ActionRow: {
                    if (!component.components[0]) return "";

                    return `
                    <div class="actionRow">
                        ${component.components[0].type == JsonComponentType.Button ? component.components.map(button => {
                            return button.type == JsonComponentType.Button ? this.buttonBuilder(button) : "";
                        }).join("") : this.selectorBuilder(component.components[0])}
                    </div>
                    `;
                }

                case JsonComponentType.Container: {

                    const html = `
                    <div class="container" style="${component.hexAccentColor ? `border-left-color: ${component.hexAccentColor}` : ''}">
                        ${this.componentBuilder(message, component.components)}
                    </div>
                    `;
                    return this.spoilerAttachmentBuilder(component.spoiler, html);
                }

                case JsonComponentType.File: {
                    
                    let fileSize = (component.size ?? 0) / 1024;
                    let count = 0;
                    while (fileSize > 512 && count < COUNT_UNIT.length - 1) {
                        fileSize = fileSize / 1024;
                        count++;
                    }

                    const html = `
                        <div class="attachmentFile">
                            <div class="attachmentFileInfo">
                                <p class="attachmentFileName">${component.fileName ?? 'file'}</p>
                                <div class="attachmentFileSize">${fileSize.toFixed(2)} ${COUNT_UNIT[count]}</div>
                            </div>
                            <a class="attachmentDownload" href="${component.url ?? ''}" target="_blank">
                                <svg class="attachmentDownloadIcon"><use href="#download-icon"></use></svg>
                            </a>
                        </div>
                    `;

                    return this.spoilerAttachmentBuilder(component.spoiler, html);
                }

                case JsonComponentType.MediaGallery: {
                    return `
                    <div class="mediaGallery"> 
                        ${component.items.map(image => {
                            return `
                            <div class="mediaGalleryItem"> 
                                ${this.spoilerAttachmentBuilder(image.spoiler, `<img class="mediaGalleryImg" src="${image.media.url}">`)}
                            </div>
                            `    
                        }).join("")}
                    </div>
                    `
                }

                case JsonComponentType.Section: {
                    return `
                    <div class="section">
                        <div class="sectionLeft">
                            ${this.componentBuilder(message, component.components)}
                        </div>
                        <div class="sectionRight">
                            ${component.accessory.type == JsonComponentType.Button ? this.buttonBuilder(component.accessory)
                            : component.accessory.type == JsonComponentType.Thumbnail ? this.spoilerAttachmentBuilder(component.accessory.spoiler, `
                            <img class="sectionThumbnail" src="${component.accessory.media.url}">
                            `) : ""
                            }
                        </div>
                    </div> 
                    `
                }

                case JsonComponentType.Separator: {
                    return `<hr>`
                }

                case JsonComponentType.TextDisplay: {
                    return markdownToHTML(component.content, message.mentions, this.dateFormat);
                }
            
                default:
                    return ``;
            }
        }).join("");
    }

    private buttonBuilder(button: JsonButtonComponent): string {
        return `
        <div class="button" style="background-color: ${BUTTON_COLOR[button.style]}">
            ${button.style == JsonButtonStyle.Link ? `
            <a class="buttonLink" href="${button.url}" target="_blank">
                ${button.emoji ? `<p class="buttonEmoji">${button.emoji}</p>` : ""}
                ${button.label ? `<p class="buttonLabel">${button.label}</p>` : ""}
                <svg class="buttonLinkIcon"><use href="#link-icon"></use></svg>
            </a>` : `
                ${button.emoji ? `<p class="buttonEmoji">${button.emoji}</p>` : ""}
                ${button.label ? `<p class="buttonLabel">${button.label}</p>` : ""}
            `}
        </div>
        `;
    }

    private selectorBuilder(selector: JsonSelectMenu): string {
        return `
        <div class="selector">
            <div class="selectorInput">
                <p class="selectorInputText">${selector.placeholder}</p>
            </div>
            <div class="selectorOptionMenu">
                ${selector.type == JsonComponentType.StringSelect ? selector.options.map(option => {
                    return `
                    <div class="selectorOption">
                        ${option.emoji ? `<p class="selectorOptionEmoji">${option.emoji}</p>` : ""}
                        <div class="selectorOptionRight">
                            <p class="selectorOptionTitle">${option.label}</p>
                            ${option.description ? `<p class="selectorOptionDesc">${option.description}</p>` : ""}
                        </div>
                    </div>
                    `;
                }).join("") : ""}
            </div>
        </div>
        `;
    }

    private spoilerAttachmentBuilder(spoiler: boolean, html: string): string {
        return spoiler ? `<div class="spoilerAttachment"><div class="spoilerAttachmentOverlay">SPOILER</div><div class="spoilerAttachmentContent">${html}</div></div>` : html;
    }

    private svgBuilder() {
        const { options } = this.data;
        return `
    <svg style="display: none;">
        <defs>
            <symbol id="reply-icon" viewBox="0 0 16 16" fill="none">
                <g transform="rotate(90 8 8)">
                    <path d="M6 2V9C6 11.5 8.5 14 11 14H14" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
            </symbol>
            ${options.includeAttachments ? `<symbol id="download-icon" viewBox="0 -960 960 960">
                <path d="m720-120 160-160-56-56-64 64v-167h-80v167l-64-64-56 56 160 160ZM560 0v-80h320V0H560ZM240-160q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h280l240 240v121h-80v-81H480v-200H240v560h240v80H240Zm0-80v-560 560Z"/>
            </symbol> ` : ""}
            ${options.includeButtons ? `<symbol id="link-icon" viewBox="0 -960 960 960" fill="#e3e3e3">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/>
            </symbol>` : ""}
        </defs>
    </svg>
    `;
    }
}