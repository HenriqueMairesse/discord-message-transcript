import { sanitize } from "./sanitizer.js";
const BLOCK_TOKEN = "\0CB\0";
const LINE_TOKEN = "\0CL\0";
const BLOCK_REGEX = /\0CB\0(\d+)\0CB\0/g;
const LINE_REGEX = /\0CL\0(\d+)\0CL\0/g;
export function markdownToHTML(text, mentions, everyone, dateFormat) {
    const codeBlock = [];
    const codeLine = [];
    // Code Block (```)
    text = text.replace(/```(?:(\S+)\n)?([\s\S]+?)```/g, (_m, lang, code) => {
        const rawLang = lang?.toLowerCase();
        const normalizedLang = rawLang ? (LANGUAGE_ALIAS[rawLang] ?? rawLang) : null;
        const language = normalizedLang && SUPPORTED_LANGUAGES.has(rawLang) ? normalizedLang : 'plaintext';
        codeBlock.push(`<pre><code ${normalizedLang ? `class="language-${language}"` : ""}>${sanitize(code).trimEnd()}</code></pre>`);
        return `${BLOCK_TOKEN}${codeBlock.length}${BLOCK_TOKEN}`;
    });
    // Code line (`)
    text = text.replace(/`([^`\n]+?)`/g, (_m, code) => {
        codeLine.push(`<code>${sanitize(code)}</code>`);
        return `${LINE_TOKEN}${codeLine.length}${LINE_TOKEN}`;
    });
    text = sanitize(text);
    // Citation (> | >>>)
    text = text.replace(/(^&gt; ?.*(?:(?:\n^&gt; ?.*)+)?)/gm, (match) => {
        const cleanContent = match.split('\n').map(line => {
            return line.replace(/^&gt;+ ?/, '');
        }).join('\n');
        return `<blockquote class="quote-multi">${cleanContent}</blockquote>`;
    });
    // Headers (#)
    text = text.replace(/^### (.*)(?=\n|$)/gm, `<h3>$1</h3>`);
    text = text.replace(/^## (.*)(?=\n|$)/gm, `<h2>$1</h2>`);
    text = text.replace(/^# (.*)(?=\n|$)/gm, `<h1>$1</h1>`);
    // Subtext(-#)
    text = text.replace(/^-# (.*)(?=\n|$)/gm, `<p class="subtext">$1</p>`);
    // List (- | *)
    text = text.replace(/^(\s*)[-*] (.*)(?=\n|$)/gm, (_m, indentation, text) => {
        const isSubItem = indentation.length > 0;
        const bullet = isSubItem ? '◦' : '•';
        return `<p class="pList">${indentation}${bullet} ${text}</p>`;
    });
    // Spoiler (||)
    text = text.replace(/\|\|(.*?)\|\|/gs, `<span class="spoilerMsg">$1</span>`);
    // Bold & Italic (***)
    text = text.replace(/\*\*\*(.*?)\*\*\*/gs, `<strong><em>$1</em></strong>`);
    // Bold (**)
    text = text.replace(/\*\*(.*?)\*\*/gs, `<strong>$1</strong>`);
    // Underline(__)
    text = text.replace(/__(.*?)__/gs, `<u>$1</u>`);
    // Italic (*)
    text = text.replace(/\*(.*?)\*/gs, `<em>$1</em>`);
    text = text.replace(/\_(.*?)\_/gs, `<em>$1</em>`);
    // Strikethrough (~~)
    text = text.replace(/~~(.*?)~~/gs, `<s>$1</s>`);
    // Links ([]() && https)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, (_m, text, link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">${text}</a>`);
    text = text.replace(/(?<!href=")(https?:\/\/[^\s]+)/g, (_m, link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`);
    // Mentions (@)
    if (mentions.users.length != 0) {
        const users = new Map(mentions.users.map(user => [user.id, user]));
        text = text.replace(/&lt;@!?(\d+)&gt;/g, (_m, id) => {
            let user = users.get(id);
            return user ? `<span class="mention" style="color: ${user.color ?? "#dbdee1"}">@${user.name}</span> ` : `<span class="mention"><@${id}></span> `;
        });
    }
    if (mentions.roles.length != 0) {
        const roles = new Map(mentions.roles.map(role => [role.id, role]));
        text = text.replace(/&lt;@&amp;(\d+)&gt;/g, (_m, id) => {
            const role = roles.get(id);
            return role ? `<span class="mention" style="color: ${role.color}">@${role.name}</span> ` : `<span class="mention"><@&${id}></span> `;
        });
    }
    if (mentions.channels.length != 0) {
        const channels = new Map(mentions.channels.map(channel => [channel.id, channel]));
        text = text.replace(/&lt;#(\d+)&gt;/g, (_m, id) => {
            const channel = channels.get(id);
            return channel && channel.name ? `<span class="mention">#${channel.name}</span> ` : `<span class="mention"><#${id}></span> `;
        });
    }
    if (everyone) {
        text = text.replace("@everyone", `<span class="mention">@everyone</span> `);
        text = text.replace("@here", `<span class="mention">@here</span> `);
    }
    // Timestamp  
    const { locale, timeZone } = dateFormat.resolvedOptions();
    text = text.replace(/&lt;t:(\d+)(?::([tTdDfFR]))?&gt;/g, (_m, timestamp, format) => {
        const date = new Date(parseInt(timestamp, 10) * 1000);
        const style = format || 'f';
        const isoString = date.toISOString();
        const titleFormatter = new Intl.DateTimeFormat(locale, {
            dateStyle: 'full',
            timeStyle: 'full',
            timeZone: timeZone,
        });
        const fullDateForTitle = titleFormatter.format(date);
        if (style === 'R') {
            const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
            const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            let relativeString;
            if (Math.abs(days) > 30)
                relativeString = rtf.format(Math.floor(days / 30.44), 'month');
            else if (Math.abs(days) > 0)
                relativeString = rtf.format(days, 'day');
            else if (Math.abs(hours) > 0)
                relativeString = rtf.format(hours, 'hour');
            else if (Math.abs(minutes) > 0)
                relativeString = rtf.format(minutes, 'minute');
            else
                relativeString = rtf.format(seconds, 'second');
            return `<time datetime="${isoString}" title="${fullDateForTitle}">${relativeString}</time>`;
        }
        else if (isStyleKey(style)) {
            const formatter = new Intl.DateTimeFormat(locale, {
                ...styleOptions[style],
                timeZone: timeZone,
            });
            const formattedDate = formatter.format(date);
            return `<time datetime="${isoString}" title="${fullDateForTitle}">${formattedDate}</time>`;
        }
        return _m;
    });
    // Break Line
    text = text.replace(/\n/g, '<br>');
    // Clear Unecessary Break Line
    text = text.replace(/(<\/(?:p|h[1-3]|blockquote)>)\s*<br>/g, '$1');
    // Remove Placeholders
    text = text.replace(BLOCK_REGEX, (_m, number) => {
        return codeBlock[Number(number) - 1] ?? "";
    });
    text = text.replace(LINE_REGEX, (_m, number) => {
        return codeLine[Number(number) - 1] ?? "";
    });
    return text;
}
// Check if styleKey is valid
const styleOptions = {
    't': { timeStyle: 'short' },
    'T': { timeStyle: 'medium' },
    'd': { dateStyle: 'short' },
    'D': { dateStyle: 'long' },
    'f': { dateStyle: 'long', timeStyle: 'short' },
    'F': { dateStyle: 'full', timeStyle: 'short' },
};
function isStyleKey(key) {
    return key in styleOptions;
}
// At least I hope
const SUPPORTED_LANGUAGES = new Set([
    'bash', 'sh', 'shell',
    'c',
    'cpp',
    'css',
    'javascript', 'js',
    'typescript', 'ts',
    'json',
    'xml',
    'yaml', 'yml',
    'java',
    'kotlin',
    'php',
    'python', 'py',
    'ruby', 'rb',
    'sql',
    'lua',
    'markdown', 'md',
    'plaintext', 'txt'
]);
const LANGUAGE_ALIAS = {
    sh: 'bash',
    shell: 'bash',
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rb: 'ruby',
    md: 'markdown',
    yml: 'yaml',
    txt: 'plaintext'
};
