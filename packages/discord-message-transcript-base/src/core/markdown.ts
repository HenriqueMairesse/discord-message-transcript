
import { ArrayMentions, StyleTimeStampKey } from "@/types/internal/util.js";
import { sanitize } from "./sanitizer.js";

// Tokens
const BLOCK_TOKEN = "\0CB\0";
const LINE_TOKEN  = "\0CL\0";
const BLOCK_REGEX = /\0CB\0(\d+)\0CB\0/g;
const LINE_REGEX  = /\0CL\0(\d+)\0CL\0/g;

// Regex
const CODE_BLOCK = /```(?:(\S+)\n)?((?:(?!```)[\s\S])+)```/g;
const CODE_LINE = /`([^`\n]+?)`/g;
const MULTI_CITATION_START = /^[ \t]*&gt;&gt;&gt;/m;
const CITATION_SINGLE_BLOCK = /(^[ \t]*&gt; ?.*(?:\n[ \t]*&gt; ?.*)*)/gm;
const CITATION_PREFIX = /^[ \t]*((?:&gt;)+)/;
const CITATION_STRIP_PREFIX = /^[ \t]*&gt; ?/;
const REMOVE_TRIPLE_CITATION = /^[ \t]*&gt;&gt;&gt; ?/;
const HEADERS = /^(#{1,3}) (.+?)(?=\n|$)/gm;
const SUBTEXT = /^-# (.*)(?=\n|$)/gm;
const LIST = /^(\s*)[-*] (.*)(?=\n|$)/gm;
const MASKED_LINK = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
const NORMAL_LINK = /(?<!href=")(https?:\/\/[^\s]+)/g;
const USER_MENTION = /&lt;@!?(\d+)&gt;/g;
const ROLE_MENTION = /&lt;@&amp;(\d+)&gt;/g;
const CHANNEL_MENTION = /&lt;#(\d+)&gt;/g;
const TIMESTAMP = /&lt;t:(\d+)(?::([tTdDfFR]))?&gt;/g;
const BREAK_LINE = /\n/g;
const UNECESSARY_BREAK_LINE = /(<\/(?:p|h[1-3]|blockquote)>)\s*<br>/g;
const SPOILER = /\|\|((?:(?!\|\|)[^])+)\|\|/g;
const BOLD_ITALIC = /\*\*\*((?:(?!\*\*\*)[\s\S])*)\*\*\*/g;
const BOLD = /\*\*((?:(?!\*\*)[\s\S])*)\*\*/g;
const UNDERLINE = /__((?:(?!__)[\s\S])*)__/g;
const ITALIC_ASTERISK = /\*((?:(?!\*)[\s\S])*)\*/g;
const ITALIC_UNDERLINE = /_((?:(?!_)[\s\S])*)_/g;

export function markdownToHTML(text: string, mentions: ArrayMentions, everyone: boolean, dateFormat: Intl.DateTimeFormat): string {

    const codeBlock: string[] = [];
    const codeLine: string[] = [];
    
    // Code Block (```)
    text = text.replace(CODE_BLOCK, (_m, lang, code) => {
        const rawLang = lang?.toLowerCase();
        const normalizedLang = rawLang ? (LANGUAGE_ALIAS[rawLang as keyof typeof LANGUAGE_ALIAS] ?? rawLang) : null;
        const language = normalizedLang && SUPPORTED_LANGUAGES.has(rawLang) ? normalizedLang : 'plaintext';
        codeBlock.push(`<pre><code ${normalizedLang ? `class="language-${language}"` : ""}>${sanitize(code).trimEnd()}</code></pre>`);
        return `${BLOCK_TOKEN}${codeBlock.length}${BLOCK_TOKEN}`;
    });

    // Code line (`)
    text = text.replace(CODE_LINE, (_m, code) => {
        codeLine.push(`<code>${sanitize(code)}</code>`);
        return `${LINE_TOKEN}${codeLine.length}${LINE_TOKEN}`;
    });

    text = sanitize(text);

    // Citation (> | >>>)
    const tripleCitationIndex = text.search(MULTI_CITATION_START);

    if (tripleCitationIndex !== -1) {       
        const lineStartIndex = text.lastIndexOf('\n', tripleCitationIndex) + 1;
        let beforePart = text.substring(0, lineStartIndex);
        let afterPart = text.substring(lineStartIndex);

        beforePart = beforePart.replace(CITATION_SINGLE_BLOCK, (match) => {
            return singleCitation(match);
        });

        afterPart = afterPart.replace(REMOVE_TRIPLE_CITATION, '');
        const afterHtml = `<blockquote class="quote-multi">${afterPart}</blockquote>`;

        text = beforePart + afterHtml;

    } else {
        text = text.replace(CITATION_SINGLE_BLOCK, (match) => {
            return singleCitation(match);
        });
    }

    // Headers (#)
    if (text.includes("#")) text = text.replace(HEADERS, (_m, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
    });

    // Subtext(-#)
    if (text.includes("-#")) text = text.replace(SUBTEXT, `<p class="subtext">$1</p>`);

    // List (- | *)
    text = text.replace(LIST, (_m, indentation, text) => {
        const isSubItem = indentation.length > 0;
        const bullet = isSubItem ? '◦' : '•';
        return `<p class="pList">${indentation}${bullet} ${text}</p>`;
    });
    
    // Spoiler (||)
    if (text.includes("||")) text = text.replace(SPOILER, `<span class="spoilerMsg">$1</span>`);

    // Bold & Italic (***)
    if (text.includes("***")) text = text.replace(BOLD_ITALIC, `<strong><em>$1</em></strong>`);

    // Bold (**)
    if (text.includes("**")) text = text.replace(BOLD, `<strong>$1</strong>`);

    // Underline(__)
    if (text.includes("__")) text = text.replace(UNDERLINE, `<u>$1</u>`);

    // Italic (*)
    text = text.replace(ITALIC_ASTERISK, `<em>$1</em>`);

    // Italic (_)
    text = text.replace(ITALIC_UNDERLINE, `<em>$1</em>`);
        
    // Strikethrough (~~)
    if (text.includes("~~")) text = text.replace(/~~((?:(?!~~)[\s\S])*)~~/g, `<s>$1</s>`);

    // Links ([]() && https)
    if (text.includes("http")) {
        if (text.includes("](")) text = text.replace(MASKED_LINK, (_m, text, link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">${text}</a>`);
        text = text.replace(NORMAL_LINK, (_m, link) => `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`);
    }
    // Mentions (@)
    if (mentions.users.length != 0 && text.includes("&lt;@")) {
        const users = new Map(mentions.users.map(user => [user.id, user]));
        text = text.replace(USER_MENTION, (_m, id) => {
            let user = users.get(id); 
            return user ? `<span class="mention" style="color: ${user.color ?? "#dbdee1"}">@${user.name}</span> ` : `<span class="mention"><@${id}></span> `;
        });
    }
    if (mentions.roles.length != 0 && text.includes("&lt;@&amp;")) {
        const roles = new Map(mentions.roles.map(role => [role.id, role]));
        text = text.replace(ROLE_MENTION, (_m, id) => { 
            const role = roles.get(id);
            return role ? `<span class="mention" style="color: ${role.color}">@${role.name}</span> ` : `<span class="mention"><@&${id}></span> `;
        });
    }
    if (mentions.channels.length != 0 && text.includes("&lt;#")) {
        const channels = new Map(mentions.channels.map(channel => [channel.id, channel]));
        text = text.replace(CHANNEL_MENTION, (_m, id) => {
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

    if (text.includes("&lt;t:")) {
        text = text.replace(TIMESTAMP, (_m, timestamp, format) => {
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
                if (Math.abs(days) > 30) relativeString = rtf.format(Math.floor(days / 30.44), 'month');
                else if (Math.abs(days) > 0) relativeString = rtf.format(days, 'day');
                else if (Math.abs(hours) > 0) relativeString = rtf.format(hours, 'hour');
                else if (Math.abs(minutes) > 0) relativeString = rtf.format(minutes, 'minute');
                else relativeString = rtf.format(seconds, 'second');

                return `<time datetime="${isoString}" title="${fullDateForTitle}">${relativeString}</time>`;
            } else if (isStyleKey(style)) {
                const formatter = new Intl.DateTimeFormat(locale, {
                    ...styleOptions[style],
                    timeZone: timeZone,
                });

                const formattedDate = formatter.format(date);

                return `<time datetime="${isoString}" title="${fullDateForTitle}">${formattedDate}</time>`;
            }
            return _m;

        });
    }

    // Break Line
    text = text.replace(BREAK_LINE, '<br>');

    // Clear Unecessary Break Line
    text = text.replace(UNECESSARY_BREAK_LINE, '$1');

    // Remove Placeholders
    text = text.replace(BLOCK_REGEX, (_m, number) => {
        return codeBlock[Number(number) - 1] ?? "";
    })

    text = text.replace(LINE_REGEX, (_m, number) => {
        return codeLine[Number(number) - 1] ?? "";
    })

    return text;
}

function singleCitation(match: string) {
    const lines = match.split('\n');
    const result: string[] = [];
    let currentBlock: string[] = [];
    
    for (const line of lines) {
        const prefixMatch = line.match(CITATION_PREFIX);
        const len = prefixMatch ? prefixMatch[1].length : 0
        if (len === 4) { // Is a single '>'
            currentBlock.push(line.replace(CITATION_STRIP_PREFIX, ''));
        } else { // Is '>>' or something else
            if (currentBlock.length > 0) {
                result.push(`<blockquote class="quote-multi">${currentBlock.join('\n')}</blockquote>`);
                currentBlock = [];
            }
            result.push(line);
        }
    }
    if (currentBlock.length > 0) {
        result.push(`<blockquote class="quote-multi">${currentBlock.join('\n')}</blockquote>`);
    }
    return result.join('\n');
}

// Check if styleKey is valid
const styleOptions: Record<StyleTimeStampKey, Intl.DateTimeFormatOptions> = {
    't': { timeStyle: 'short' },
    'T': { timeStyle: 'medium' },
    'd': { dateStyle: 'short' },
    'D': { dateStyle: 'long' },
    'f': { dateStyle: 'long', timeStyle: 'short' },
    'F': { dateStyle: 'full', timeStyle: 'short' },
};

function isStyleKey(key: string): key is StyleTimeStampKey {
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