export class CustomError extends Error {
    constructor(message: string) {
        super(`[discord-message-transcript] ${message}`);

        this.name = 'DiscordMessageTranscriptError';

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export function CustomWarn(message: string, disableWarnings: boolean) {
    if (disableWarnings) return;
    console.warn(`[discord-message-transcript] Warning: ${message}`)
}