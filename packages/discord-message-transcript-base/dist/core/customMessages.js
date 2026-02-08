export class CustomError extends Error {
    constructor(message) {
        super(`[discord-message-transcript] ${message}`);
        this.name = 'DiscordMessageTranscriptError';
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
export function CustomWarn(message, disableWarnings) {
    if (disableWarnings)
        return;
    console.warn(`[discord-message-transcript] Warning: ${message}`);
}
