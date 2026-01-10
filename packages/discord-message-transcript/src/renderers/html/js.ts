export const script = `
document.addEventListener('DOMContentLoaded', () => {
    const transcriptDataElement = document.getElementById('authorData');
    if (!transcriptDataElement) {
        console.error('Missing author data element.');
        return;
    }

    const data = JSON.parse(transcriptDataElement.textContent);
    const authorMap = new Map((data.authors || []).map(author => [author.id, author]));

    document.querySelectorAll('.messageDiv[data-author-id]').forEach(messageDiv => {
        const authorId = messageDiv.dataset.authorId;
        const author = authorMap.get(authorId);

        if (!author) return;

        const avatarImg = messageDiv.querySelector('.messageImg');
        if (avatarImg) avatarImg.src = author.avatarURL;

        const usernameH3 = messageDiv.querySelector('.messageUsername');
        if (usernameH3) {
            usernameH3.textContent = author.member?.displayName ?? author.displayName;
            usernameH3.style.color = author.member?.displayHexColor ?? '#dbdee1';
        }

        const badgesDiv = messageDiv.querySelector('.badges');
        if (badgesDiv) {
            badgesDiv.innerHTML = '';
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
    });

    document.querySelectorAll('.messageReply[data-id]').forEach(replyDiv => {
        const repliedToId = replyDiv.dataset.id;
        if (!repliedToId) return;

        const repliedToMessageDiv = document.getElementById(repliedToId);
        if (!repliedToMessageDiv) return; 

        const repliedToAuthorId = repliedToMessageDiv.dataset.authorId;
        const repliedToAuthor = authorMap.get(repliedToAuthorId);

        if (repliedToAuthor) {
            const replyImg = replyDiv.querySelector('.messageReplyImg');
            if (replyImg) replyImg.src = repliedToAuthor.avatarURL;
            
            const replyBadgesDiv = replyDiv.querySelector('.replyBadges');
            if (replyBadgesDiv) {
                replyBadgesDiv.innerHTML = '';
                if (repliedToAuthor.bot) {
                    const badge = document.createElement('p');
                    badge.className = 'badge';
                    badge.textContent = 'APP';
                    replyBadgesDiv.appendChild(badge);
                }
                if (repliedToAuthor.system) {
                    const badge = document.createElement('p');
                    badge.className = 'badge';
                    badge.textContent = 'SYSTEM';
                    replyBadgesDiv.appendChild(badge);
                }
                if (repliedToAuthor.guildTag) {
                    const badge = document.createElement('p');
                    badge.className = 'badgeTag';
                    badge.textContent = repliedToAuthor.guildTag;
                    replyBadgesDiv.appendChild(badge);
                }
            }
        }

        const replyTextDiv = replyDiv.querySelector('.messageReplyText');
        if (replyTextDiv) {
            const originalContentEl = repliedToMessageDiv.querySelector('.messageContent');
            if (originalContentEl) {
                let content = originalContentEl.textContent || '';
                if (content.length > 100) {
                    content = content.substring(0, 100).trim() + '...';
                }
                
                const authorName = repliedToAuthor?.member?.displayName ?? repliedToAuthor?.displayName ?? 'Unknown';
                const authorColor = repliedToAuthor?.member?.displayHexColor ?? 'inherit';
                
                const authorNameSpan = \`<span style="color: \${authorColor};">\${authorName}</span>\`;
                replyTextDiv.innerHTML = authorNameSpan + " " + content;
            }
        }
    });

    document.addEventListener('click', function (event) {
        const spoiler = event.target.closest('.spoilerMsg, .spoilerAttachment');
        if (spoiler && !spoiler.classList.contains('revealed')) {
            event.preventDefault();
            event.stopPropagation();
            spoiler.classList.add('revealed');
        }

        const selectorInput = event.target.closest('.selectorInput');
        document.querySelectorAll('.selector').forEach(selector => {
            if (!selector.contains(event.target)) {
                selector.classList.remove('active');
            }
        });
        if (selectorInput) {
            const selector = selectorInput.closest('.selector');
            if (selector) {
                selector.classList.toggle('active');
            }
        }

        const replyDiv = event.target.closest('.messageReply');
        if (replyDiv) {
            event.preventDefault();
            const messageId = replyDiv.dataset.id;
            if (!messageId) return;

            const targetMessage = document.getElementById(messageId);
            if (targetMessage) {
                targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetMessage.classList.add('highlight');
                setTimeout(() => {
                    targetMessage.classList.remove('highlight');
                }, 1500);
            }
        }
    });
    
    if (window.hljs) {
        hljs.highlightAll();
    }
});
`