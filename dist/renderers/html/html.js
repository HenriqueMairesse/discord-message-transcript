import { CustomError } from "../../core/error";
import { markdownToHTML } from "../../core/markdown";
export class Html {
    guild;
    channel;
    messages;
    options;
    dateFormat;
    constructor(data, options) {
        this.guild = data.guild;
        this.channel = data.channel;
        this.messages = data.messages;
        this.options = options;
        try {
            this.dateFormat = new Intl.DateTimeFormat(options.localDate, {
                timeZone: options.timeZone,
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
        catch (error) {
            throw new CustomError("[discord-message-transcript] Invalid LocalDate and/or TimeZone.");
        }
    }
    headerBuilder() {
        return `
        <div style="display: flex;  gap: 1.5rem; align-items: center;">
            ${this.channel.img ? `<img src="${this.channel.img}" style="width: 7rem; height: 7rem; border-radius: 50%;">` : ""}
            <div style="display: flex; flex-direction: column; justify-content: center; gap: 1.25rem;">
                ${this.guild ? `<div id="guild" class="line">
                    <h4>Guild: </h4>
                    <h4 style="font-weight: normal;">MI_Test</h4>
                </div>` : ""}
                ${this.channel.parent ? `<div id="category" class="line">
                    <h4>Category: </h4>
                    <h4 style="font-weight: normal;">${this.channel.parent.name}</h4>
                </div>` : ""}
                <div id="channel" class="line">
                    <h4>Channel: </h4>
                    <h4 style="font-weight: normal;">${this.channel.name}</h4>
                </div>
                ${this.channel.topic ? `<div id="topic" class="line">
                    <h4>Topic: </h4>
                    <h4 style="font-weight: normal;">${this.channel.topic}</h4>
                </div>` : ""}
            </div>
        </div>
        `;
    }
    messagesBuilder() {
        return this.messages.map(message => {
            const date = new Date(message.createdTimesptamp);
            message.content = markdownToHTML(message.content, message.mentions, this.dateFormat);
            return `
<div class="messageDiv">
    <img src="${message.author.avatarURL}" class="messageImg">
    <div class="messageDivRight">
        <div class="messageUser">
            <h3 class="messageUsername">${message.member?.displayName ?? message.author.displayName}</h3>
            ${message.author.bot ? `<p class="badge">APP</p>` : ""}
            ${message.author.system ? `<p class="badge">SYSTEM</p>` : ""}
            ${message.author.guildTag ? `<p class="badgeTag">${message.author.guildTag}</p>` : ""}
            <p class="messageTimeStamp">${this.dateFormat.format(date)}</p>
        </div>
        <div class="messageContent">${message.content}</div>
    </div>
</div>
            `;
        }).join("");
    }
    toHTML() {
        return `
<!DOCTYPE html>
<html lang="pt-BR"></html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.options.fileName}</title>
    <style>
        body {
            background-color: #313338;
            color: #dbdee1;
            font-family: "Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        header {
            height: fit-content;
            border-bottom: 2px solid black;
            margin-top: 2rem;
            padding-left: 2rem;
            padding-bottom: 1rem;
            display: flex;
            flex-direction: column;
            display: flex;
            flex-direction: row;
        }
        p {
            margin: 0;
        }
        h4 {
            margin: 0;
        }
        blockquote {
            margin: 0.5rem 0;
            border-left: 0.25rem solid #4f545c;
            padding: 0.4rem 0.6rem;
            border-radius: 0.2rem;
            color: #9f9fa6;
        }
        .line {
            display: flex;
            align-items: baseline;
            gap: 0.5rem
        }
        .badge {
            background-color: #5865f2;
            color: white;
            font-weight: 600;
            font-size: 80%;
            padding: 0.1rem 0.35rem;
            border-radius: 0.25rem;
            letter-spacing: 0.03rem;
            height: fit-content;
            width: fit-content;
            align-self: flex-start;
        }
        .badgeTag {
            background-color: #747F8D50;
            color: white;
            font-weight: 600;
            font-size: 70%;
            padding: 0.1rem 0.35rem;
            border-radius: 0.25rem;
            letter-spacing: 0.03rem;
            height: fit-content;
            width: fit-content;
            align-self: center;
        }
        .messageDiv {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
        .messageImg {
            width: 3.5rem; 
            height: 3.5rem; 
            border-radius: 50%;
        }
        .messageDivRight {
            display: flex;
            flex-direction: column;
            gap: 0.25rem
        }
        .messageUser {
            display: flex;
            flex-direction: row;
            gap: 0.75rem;
        }
        .messageUsername {
            margin: 0;
        }
        .messageTimeStamp {
            color: #999999;
            font-size: 77.5%;
            align-self: center;
        }
        .messageContent {
            line-height: 1.5;
        }
        .pList {
            white-space: pre-wrap;
        }
        .subtext {
            font-size: 85%;
            color: #808080;
        }
        .spoiler {
            display: inline-block;
            background-color: #202225;
            color: #202225;
            padding: 0 0.2rem;
            border-radius: 0.2rem;
            cursor: pointer;
            transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
            
        }
        .spoiler.revealed {
            background-color: transparent;
            color: inherit;
        }
    </style>
</head>
<body>
    <header>
        ${this.headerBuilder()}
    </header>
    <main style="display: flex; flex-direction: column; gap: 1.75rem; padding: 2.25rem;">
       ${this.messagesBuilder()}
    </main>
    <footer>
        <br >
        <h2>Transcript generated by <a href="https://github.com/HenriqueMairesse/discord-channel-transcript">discord-channel-transcript</a></h2>
    </foorter>
    <script> 
        document.addEventListener('click', function (event) {
            const spoiler = event.target.closest('.spoiler');
            if (spoiler) spoiler.classList.add('revealed');
        })
    </script>
</body>
</html>     
`;
    }
}
