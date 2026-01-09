export class CustomError extends Error {
    constructor(message) {
        super(`[discord-message-transcript] ${message}`);
        this.name = 'DiscordMessageTranscriptError';
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
