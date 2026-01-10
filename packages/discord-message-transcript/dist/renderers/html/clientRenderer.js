"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const transcriptDataElement = document.getElementById('transcript-data');
    if (!transcriptDataElement) {
        console.error('Missing transcript data element.');
        return;
    }
    const data = JSON.parse(transcriptDataElement.textContent);
    const authorMap = new Map(data.authors.map(author => [author.id, author]));
    document.querySelectorAll('.messageDiv[data-author-id]').forEach(messageDiv => {
        const authorId = messageDiv.dataset.authorId;
        const author = authorMap.get(authorId);
        if (!author) {
            console.warn(`Author not found for message with ID: ${messageDiv.id} and author ID: ${authorId}`);
            return;
        }
        const avatarImg = messageDiv.querySelector('.messageImg');
        if (avatarImg)
            avatarImg.src = author.avatarURL;
        const usernameH3 = messageDiv.querySelector('.messageUsername');
        if (usernameH3) {
            usernameH3.textContent = author.member?.displayName ?? author.displayName;
            usernameH3.style.color = author.member?.displayHexColor ?? '#dbdee1';
        }
        const badgesDiv = messageDiv.querySelector('.badges');
        if (badgesDiv) {
            badgesDiv.innerHTML = ''; // Clear existing placeholders
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
    // Handle existing client-side event listeners
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
    });
    // Initial highlighting
    if (window.hljs) {
        hljs.highlightAll();
    }
});
