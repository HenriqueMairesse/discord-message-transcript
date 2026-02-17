export const ROOT_VARIABLES_CSS = `
:root {
    --discord-font-family: "Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif;
    --discord-background-primary: #3a3c43;
    --discord-background-secondary: #2b2d31;
    --discord-background-tertiary: #4f545c;
    --discord-background-modifier-hover: #40434b;
    --discord-background-mention: #5664fa41;
    --discord-background-mention-hover: #5664fa7e;
    --discord-background-spoiler: #202225;
    --discord-text-normal: #dbdee1;
    --discord-text-secondary: #b5bac1;
    --discord-text-placeholder: #808080;
    --discord-text-link: #1E90FF;
    --discord-text-link-embed: #00aff4;
    --discord-text-white: #ffffff;
    --discord-text-reaction: #dcddde;
    --discord-text-timestamp: #999999;
    --discord-text-blockquote: #9f9fa6;
    --discord-border-primary: #202225;
    --discord-border-secondary: #4f545c;
    --discord-border-tertiary: #3a3c42;
    --discord-border-black: black;
    --discord-interactive-normal: #b9bbbe;
    --discord-interactive-hover: #ffffff;
    --discord-interactive-secondary: #72767d;
    --discord-brand-500: #5865f2;
    --discord-green-200: #57f287;
    --discord-poll-bar: #5664fa7a;
}
`;

export const DEFAULT_CSS = `
html, body {
    margin: 0;
    width: 100%;
    height: 100%;
}
body {
    background-color: var(--discord-background-primary);
    color: var(--discord-text-normal);
    font-family: var(--discord-font-family);
    display: flex;
    flex-direction: column;
    padding: 0;
}
header {
    height: fit-content;
    border-bottom: 2px solid var(--discord-border-black);
    margin-top: 2rem;
    padding-left: 2rem;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: row;
}
a {
    text-decoration: none;
    color: var(--discord-text-link);
}
p {
    margin: 0;
}
h1 {
    margin: 0.5rem 0;
}
h2 {
    margin: 0.3rem 0;
}
h3 {
    margin: 0.15rem
}
h4 {
    margin: 0;
}
code {
    border: 1px solid var(--discord-border-primary);
    border-radius: 0.25rem;
}
blockquote {
    margin: 0.5rem 0;
    border-left: 0.25rem solid var(--discord-border-secondary);
    padding: 0.4rem 0.6rem;
    border-radius: 0.25rem;
    color: var(--discord-text-blockquote);
}
main {
    display: flex;
    flex-direction: column;
    padding: 2.25%;
    flex: 1;
}
.svgDefs  {
    display: none;
}
.line {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}
.badge {
    background-color: var(--discord-brand-500);
    color: var(--discord-text-white);
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
    color: var(--discord-text-white);
    font-weight: 600;
    font-size: 70%;
    padding: 0.1rem 0.35rem;
    border-radius: 0.25rem;
    letter-spacing: 0.03rem;
    height: fit-content;
    width: fit-content;
    align-self: center;
}
.mention {
    background-color: var(--discord-background-mention);
    padding: 0.2rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
}
.mention:hover {
    background-color: var(--discord-background-mention-hover);
}
.guildInitialsIcon {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
    background-color: var(--discord-background-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: 600;
}
.headIcon {
    width: 7rem;
    height: 7rem;
    border-radius: 50%;
}
.headerRoot {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    width: 100vw;
}
.headerValue {
    font-weight: normal;
}
.headerInfo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.25rem;
}
`;

export const FOOTER_CSS = `
.footerWatermark {
    padding: 1rem 0;
    font-weight: 700;
    text-align: center;
    font-size: 1.5rem;
    background-color: var(--discord-background-secondary);
}
`

export const MESSAGE_CSS = `
.messageDiv {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.5rem;
    border-radius: 1rem;
}
.messageDiv.highlight, .messageDiv:hover {
    background-color: var(--discord-background-modifier-hover);
    transition: background-color 0.3s ease-in-out;
}
.messageBotton {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
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
    color: var(--discord-text-timestamp);
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
    color: var(--discord-text-placeholder);
}
.spoilerMsg {
    display: inline-block;
    background-color: var(--discord-background-spoiler);
    color: var(--discord-background-spoiler);
    padding: 0 0.2rem;
    border-radius: 0.2rem;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
}
.spoilerMsg.revealed {
    background-color: transparent;
    color: inherit;
}
.messageReply {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: var(--discord-text-secondary);
    cursor: pointer;
    margin-left: 2rem;
}
.messageReplySvg {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    color: var(--discord-text-secondary);
}
.messageReplyImg {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    flex-shrink: 0;
}
.messageReplyAuthor {
    font-weight: 600;
    color: var(--discord-text-normal);
    margin-right: 0.3rem;
}
.badgeReply {
    background-color: var(--discord-brand-500);
    color: var(--discord-text-white);
    font-weight: 600;
    font-size: 70%;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
    letter-spacing: 0.03rem;
    height: fit-content;
    align-self: center;
    flex-shrink: 0;
}
.messageReplyText {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--discord-text-secondary);
    font-size: 0.75rem;
}
`;

export const EMBED_CSS = `
.embed {
    background-color: var(--discord-background-secondary);
    border: 0.15rem solid var(--discord-background-secondary);
    border-left: 0.25rem solid;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 40rem;
    width: fit-content;
}
.embed a {
    color: var(--discord-text-link-embed);
    text-decoration: none;
}
.embed a:hover {
    text-decoration: underline;
}
.embedHeader {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
}
.embedHeaderLeft {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.embedHeaderLeftAuthor {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--discord-text-white);
    margin-bottom: 0.5rem;
}
.embedHeaderLeftAuthorImg {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
}
.embedHeaderLeftAuthorName {
    color: var(--discord-text-white);
    font-weight: 500;
}
.embedHeaderLeftTitle {
    font-size: 1rem;
    font-weight: bold;
    color: var(--discord-text-white);
    margin-bottom: 0.75rem;
}
.embedHeaderThumbnail {
    max-width: 80px;
    max-height: 80px;
    object-fit: contain;
    border-radius: 0.25rem;
    flex-shrink: 0;
}
.embedDescription {
    font-size: 0.875rem;
    color: var(--discord-text-reaction);
}
.embedFields {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    row-gap: 1rem;
    width: 100%;
}
.embedFieldsField {
    grid-column: 1 / -1;
    min-width: 0;
}
.embedFieldsFieldInline {
    min-width: 0;
}
.embedFieldsFieldTitle {
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--discord-text-white);
    margin-bottom: 0.25rem;
}
.embedFieldsFieldValue {
    font-size: 0.875rem;
    color: var(--discord-text-reaction);
}
.embedImage {
    margin-top: 0.5rem;
    max-width: 100%;
    height: auto;
}
.embedImage img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 0.25rem;
}
.embedFooter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--discord-text-timestamp);
    margin-top: 0.5rem;
}
.embedFooterImg {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
}
.embedFooterText {
    color: var(--discord-text-timestamp);
}
`;

export const ATTACHMENT_CSS = `
.attachmentImage, .attachmentVideo {
    max-width: 400px;
    height: auto;
    border-radius: 0.25rem;
    margin-top: 0.5rem;
}
.attachmentAudio {
    width: 300px;
    margin-top: 0.5rem;
}
.attachmentFile {
    background-color: var(--discord-background-secondary);
    border: 1px solid var(--discord-border-primary);
    border-radius: 0.75rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 400px;
    margin-top: 0.5rem;
    width: fit-content;
}
.attachmentFileIcon {
    width: 2.5rem;
    height: 2.5rem;
    fill: var(--discord-interactive-normal);
    flex-shrink: 0;
}
.attachmentFileInfo {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    overflow: hidden;
    flex-grow: 1;
}
.attachmentFileName {
    color: var(--discord-text-white);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.attachmentFileSize {
    font-size: 0.75rem;
    color: var(--discord-interactive-secondary);
}
.attachmentDownload {
    display: block;
    flex-shrink: 0;
}
.attachmentDownloadIcon {
    width: 1.5rem;
    height: 1.5rem;
    fill: var(--discord-interactive-normal);
    transition: fill 0.2s ease;
}
.attachmentDownload:hover .attachmentDownloadIcon {
    fill: var(--discord-interactive-hover);
}
.spoilerAttachment {
    position: relative;
    display: inline-block;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
}
.spoilerAttachment .spoilerAttachmentContent {
    filter: blur(64px);
    pointer-events: none;
    transition: filter 0.2s ease;
    width: 100%;
    height: 100%;
}
.spoilerAttachment .spoilerAttachmentOverlay {
    position: absolute;
    inset: 0;
    background: rgba(32, 34, 37, 0.85);
    color: #fff;
    font-weight: 600;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    user-select: none;
}
.spoilerAttachment.revealed .spoilerAttachmentContent {
    filter: none;
    pointer-events: auto;
}
.spoilerAttachment.revealed .spoilerAttachmentOverlay {
    display: none;
}
`;

export const ACTIONROW_CSS = `
.actionRow {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}
`;

export const BUTTON_CSS = `
.button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0rem 0.8rem;
    height: 2.5rem;
    border-radius: 0.6rem;
    color: var(--discord-text-white);
    font-weight: 600;
    cursor: pointer;
    transition: filter 0.2s ease;
}
.button:hover {
    filter: brightness(1.1);
}
.buttonEmoji {
    font-size: 1.25rem;
}
.buttonLabel {
    font-size: 0.875rem;
}
.buttonLink {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--discord-text-white);
    font-weight: 600;
}
.buttonLinkIcon {
    width: 1.25rem;
    height: 1.25rem;
}
`;

export const COMPONENTS_CSS = `
.selector {
    width: 100%;
    position: relative;
}
.selectorInput {
    background-color: var(--discord-background-secondary);
    border: 1px solid var(--discord-border-primary);
    border-radius: 0.75rem;
    padding: 0.75rem;
    min-width: 17.5rem;
    cursor: pointer;
    user-select: none;
}
.selectorInputText {
    color: var(--discord-text-placeholder);
}
.selectorOptionMenu {
    display: none; 
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--discord-background-secondary);
    border: 1px solid var(--discord-border-primary);
    border-radius: 1rem;
    margin-top: 0.25rem;
    padding: 0.5rem;
    z-index: 10;
    box-sizing: border-box;
}
.selector.active .selectorOptionMenu {
    display: block;
}
.selectorOption {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}
.selectorOption:hover {
    background-color: var(--discord-background-tertiary);
}
.selectorOptionEmoji {
    font-size: 1.25rem;
}
.selectorOptionRight {
    display: flex;
    flex-direction: column;
}
.selectorOptionTitle {
    font-weight: 500;
}
.selectorOptionDesc {
    font-size: 0.75rem;
    color: var(--discord-text-placeholder);
}
`;

export const COMPONENTSV2_CSS = `
.mediaGallery {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    width: 100%;
    max-width: 40rem;
    aspect-ratio: 1 / 1;
    padding: 0.35rem;
    overflow: hidden;
}
.mediaGalleryItem {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 30%;
    display: flex;
}
.mediaGalleryImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 1rem;
}
.container {
    background-color: var(--discord-background-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    max-width: 40rem;
    min-width: 30rem;
    border-left: 0.25rem solid;
}
.section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 0;
}
.sectionRight {
    margin-right: 0.5rem;
    margin-left: 1rem;
}
.sectionThumbnail {
    width: 5rem;
    height: 5rem;
    border-radius: 0.5rem;
}
.textDisplay {
    padding: 0.5rem 0;
}
.separator {
    border: 1px solid var(--discord-text-placeholder);
}
`;

export const POLL_CSS = `
.pollDiv {
    background-color: var(--discord-background-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 0.5rem;
    max-width: 40rem;
    min-width: 25rem;
}
.pollQuestion {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.pollAnswers {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.pollAnswer {
    background-color: var(--discord-border-tertiary);
    border-radius: 0.3rem;
    padding: 0.75rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: border-color 0.2s ease;
    position: relative;
    overflow: hidden;
}
.pollAnswer:hover {
    border-color: #4d515a;
}
.pollAnswerBar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: var(--discord-poll-bar);
    border-radius: 0.2rem;
    z-index: 1;
}
.pollAnswerContent {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.pollAnswerDetails {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.pollAnswerEmoji {
    font-size: 1.25rem;
}
.pollAnswerText {
    font-weight: 500;
}
.pollAnswerVotes {
    font-size: 0.8rem;
    color: var(--discord-text-secondary);
    font-weight: bold;
}
.pollFooter {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #949ba4;
}
`;

export const POLL_RESULT_EMBED_CSS = `
.pollResultEmbed {
    background-color: var(--discord-background-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-top: 0.5rem;
    border: 1px solid var(--discord-border-tertiary);
    min-width: 20rem;
    max-width: 40rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.pollResultEmbedWinner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
}
.pollResultEmbedCheckmark {
    color: var(--discord-green-200);
    font-size: 1.1em;
}
.pollResultEmbedSubtitle {
    font-size: 0.9rem;
    color: var(--discord-text-secondary);
}
.pollResultEmbedButtonDiv {
    margin-right: 0.5rem;
    margin-left: 1rem;
    align-self: center;
}
.pollResultEmbedButton {
    background-color: var(--discord-border-black);
    color: var(--discord-text-white);
    padding: 0.5rem 1rem;
    border-radius: 0.3rem;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s ease;
    cursor: pointer;
}
.pollResultEmbedButton:hover {
    filter: brightness(1.1);
}
`;

export const REACTIONS_CSS = `
.reactionsDiv {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}
.reaction {
    align-items: center;
    background-color: var(--discord-background-secondary);
    border: 1px solid var(--discord-border-tertiary);
    border-radius: 1rem;
    padding: 0.25rem 0.6rem;
    font-size: 1rem;
    color: var(--discord-text-reaction);
    font-weight: bold;
    cursor: pointer;
}
.reaction:hover {
    filter: brightness(1.1);
}
`;