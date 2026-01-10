import { ACTIONROW_CSS, ATTACHMENT_CSS, BUTTON_CSS, COMPONENTS_CSS, COMPONENTSV2_CSS, DEFAULT_CSS, EMBED_CSS, MESSAGE_CSS } from "./css";
const clientRendererJs = `
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages-container');
    const messageTemplate = document.getElementById('message-template');
    const transcriptDataElement = document.getElementById('transcript-data');

    if (!messagesContainer || !messageTemplate || !transcriptDataElement) {
        console.error('Missing required elements for rendering transcript.');
        return;
    }

    const data = JSON.parse(transcriptDataElement.textContent);
    const authorMap = new Map(data.authors.map(author => [author.id, author]));

    const fragment = new DocumentFragment();

    data.messages.forEach(message => {
        const author = authorMap.get(message.authorId);
        if (!author) {
            console.warn(`, Author, not, found;
for (message; $; { message, : .id } `);
            return;
        }

        const clone = messageTemplate.content.cloneNode(true);

        // Populate common message elements
        const messageDiv = clone.querySelector('.messageDiv');
        if (messageDiv) messageDiv.id = message.id;

        const avatarImg = clone.querySelector('.messageImg');
        if (avatarImg) avatarImg.src = author.avatarURL;

        const usernameH3 = clone.querySelector('.messageUsername');
        if (usernameH3) {
            usernameH3.textContent = author.member?.displayName ?? author.displayName;
            usernameH3.style.color = author.member?.displayHexColor ?? '#dbdee1';
        }

        const badgesDiv = clone.querySelector('.badges'); // Assuming a container for badges
        if (badgesDiv) {
            if (author.bot) {
                const badge = document.createElement('p');
                badge.className = 'badge';
                badge.textContent = 'APP';
                badgesDiv.appendChild(badge);
            }
            if (author.system) {
                const badge = document.createElement('p');
                badge.className = 'badge';
                badge.textContent = 'SYSTEM';
                badgesDiv.appendChild(badge);
            }
            if (author.guildTag) {
                const badge = document.createElement('p');
                badge.className = 'badgeTag';
                badge.textContent = author.guildTag;
                badgesDiv.appendChild(badge);
            }
        }

        const messageTimestamp = clone.querySelector('.messageTimeStamp');
        if (messageTimestamp) {
            // Use the client's locale for date formatting
            messageTimestamp.textContent = new Date(message.createdTimestamp).toLocaleString(data.options.localDate, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: data.options.timeZone // Use the provided timezone
            });
        }
        
        const messageContentDiv = clone.querySelector('.messageContent');
        if (messageContentDiv) messageContentDiv.innerHTML = message.content;

        // Handle references/replies
        const messageReplyDiv = clone.querySelector('.messageReply');
        if (messageReplyDiv && message.references && message.references.messageId) {
            messageReplyDiv.dataset.id = message.references.messageId;
            // Additional logic for reply avatar/name can be added here if needed,
            // requires looking up the replied message's author. For simplicity,
            // we'll leave it as just the ID for now.
        } else if (messageReplyDiv) {
            messageReplyDiv.remove(); // Remove if no reply
        }

        // TODO: Implement logic for embeds, attachments, and components based on data.options and message properties
        // This will be more complex and might require sub-templates or helper functions
        // For now, these sections might remain empty or be removed if not present in message.

        fragment.appendChild(clone);
    });

    messagesContainer.appendChild(fragment);

    // Initial highlighting
    if (window.hljs) {
        hljs.highlightAll();
    }
});

// Helper functions for embeds, attachments, components would go here if needed.
// For instance:
/*
function renderEmbeds(embeds, messageMentions, dateFormat) {
    // ... logic to build embed HTML
}
*/
`)
    ;
export class Html {
    data;
    constructor(data) {
        this.data = data;
    }
    headerBuilder() {
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
    <main id="messages-container" style="display: flex; flex-direction: column; gap: 1.75rem; padding: 2.25rem;"></main>
    <footer>
        <br>
        <h2>Transcript generated by <a href="https://github.com/HenriqueMairesse/discord-channel-transcript">discord-channel-transcript</a></h2>
    </footer>

    <!-- MESSAGE TEMPLATE -->
    <template id="message-template">
        <div class="messageDiv">
            <div class="messageBotton">
                <img src="" class="messageImg">
                <div class="messageDivRight">
                    <div class="messageUser">
                        <h3 class="messageUsername"></h3>
                        <div class="badges"></div>
                        <p class="messageTimeStamp"></p>
                    </div>
                    <div class="messageContent"></div>
                    <!-- Placeholders for embeds, attachments, components will be handled by client-side logic -->
                    <!-- Example: <div class="embeds-container"></div> -->
                    <!-- Example: <div class="attachments-container"></div> -->
                    <!-- Example: <div class="components-container"></div> -->
                </div>
            </div>
        </div>
    </template>

    <!-- TRANSCRIPT DATA -->
    <script id="transcript-data" type="application/json">
        ${JSON.stringify(this.data)}
    </script>

    <!-- CLIENT-SIDE RENDERING SCRIPT -->
    <script>
        ${clientRendererJs}
    </script>
</body>
</html>     
`;
    }
    svgBuilder() {
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
