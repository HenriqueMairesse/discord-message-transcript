export const DEFAULT_CSS = `
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
code {
    border: 1px solid #202225;
    border-radius: 0.25rem;
}
blockquote {
    margin: 0.5rem 0;
    border-left: 0.25rem solid #4f545c;
    padding: 0.4rem 0.6rem;
    border-radius: 0.25rem;
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
`;

export const MESSAGE_CSS = `
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
.spoilerMsg {
    display: inline-block;
    background-color: #202225;
    color: #202225;
    padding: 0 0.2rem;
    border-radius: 0.2rem;
    cursor: pointer;
    transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
}
.spoilerMsg.revealed {
    background-color: transparent;
    color: inherit;
}
`;

export const EMBED_CSS = `
.embed {
    background-color: #2b2d31;
    border: 0.15rem solid #2b2d31;
    border-left: 0.25rem solid;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 520px;
}
.embed a {
    color: #00aff4;
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
.embedHeaderRight {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.embedHeaderRightAuthor {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #ffffff;
}
.embedHeaderRightAuthorImg {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
}
.embedHeaderRightAuthorName {
    color: #ffffff;
    font-weight: 500;
}
.embedHeaderRightTitle {
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
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
    color: #dcddde;
}
.embedFields {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
.embedFieldsField {
    flex: 1;
    min-width: 150px;
}
.embedFieldsFieldTitle {
    font-size: 0.75rem;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 0.25rem;
}
.embedFieldsFieldValue {
    font-size: 0.875rem;
    color: #dcddde;
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
    color: #999999;
    margin-top: 0.5rem;
}
.embedFooterImg {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
}
.embedFooterText {
    color: #999999;
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
    background-color: #2b2d31;
    border: 1px solid #202225;
    border-radius: 0.25rem;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 400px;
    margin-top: 0.5rem;
    width: fit-content;
}
.attachmentFileIcon {
    width: 2.5rem;
    height: 2.5rem;
    fill: #b9bbbe;
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
    color: #00aff4;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.attachmentFileName:hover {
    text-decoration: underline;
}
.attachmentFileSize {
    font-size: 0.75rem;
    color: #72767d;
}
.attachmentDownload {
    display: block;
    flex-shrink: 0;
}
.attachmentDownloadIcon {
    width: 2rem;
    height: 2rem;
    fill: #b9bbbe;
    transition: fill 0.2s ease;
}
.attachmentDownload:hover .attachmentDownloadIcon {
    fill: #ffffff;
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

export const MEDIAGALLETY_CSS = `
.mediaGallery {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    width: 20rem;
    height: 20rem;
    border: 1px solid #202225
    padding: 0.35rem;
    overflow: hidden;
}
.mediaGalleryItem {
    flex-grow: 1;
    flex-basis: 6rem;
    min-width: 0;
    display: flex;
}
.mediaGalleryImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
`