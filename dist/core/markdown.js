export function markdownToHTML(text, mentions, dateFormat) {
    const codeBlock = [];
    const codeLine = [];
    // Code Block (```)
    text = text.replace(/```([\s\S]*?)```/g, (_m, code) => {
        codeBlock.push(`<pre><code>${code.trim()}</code></pre>`);
        return `%$%CODE!BLOCK!${codeBlock.length - 1}%$%`;
    });
    // Code line (`)
    text = text.replace(/`([^`]+)`/g, (_m, code) => {
        codeLine.push(`<code>${code}</code>`);
        return `%$%CODE!LINE!${codeLine.length - 1}%$%`;
    });
    // Citation (> | >>>)
    text = text.replace(/(^> ?.*(?:(?:\n^> ?.*)+)?)/gm, (match) => {
        const cleanContent = match.split('\n').map(line => {
            return line.replace(/^>+ ?/, '');
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
    text = text.replace(/\|\|(.*?)\|\|/gs, `<span class="spoiler">$1</span>`);
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
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, (_m, text, link) => `<a href="${link}" target="_blank">${text}</a>`);
    text = text.replace(/(?<!href=")(https?:\/\/[^\s]+)/g, (_m, link) => `<a href="${link}" target="_blank">${link}</a>`);
    // Mentions (@)
    text = text.replace(/<@!?(\d+)>/g, (_m, id) => mentions.users.get(id)?.displayName ? `@${mentions.users.get(id)?.displayName}` : `@${id}`);
    text = text.replace(/<@&(\d+)>/g, (_m, id) => mentions.roles.get(id)?.name ? `@${mentions.roles.get(id)?.name}` : `@&${id}`);
    text = text.replace(/<#(\d+)>/g, (_m, id) => {
        const channel = mentions.channels.get(id);
        if (channel && !channel.isDMBased()) {
            return `#${channel.name}`;
        }
        return `#${id}`;
    });
    // Timestamp  
    const { locale, timeZone } = dateFormat.resolvedOptions();
    text = text.replace(/<t:(\d+)(?::([tTdDfFR]))?>/g, (_m, timestamp, format) => {
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
    text = text.replace(/%\$%CODE!BLOCK!(\d+)%\$%/g, (_m, number) => {
        return codeBlock[number];
    });
    text = text.replace(/%\$%CODE!LINE!(\d+)%\$%/g, (_m, number) => {
        return codeLine[number];
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
