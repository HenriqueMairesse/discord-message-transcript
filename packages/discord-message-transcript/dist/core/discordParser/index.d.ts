import { TranscriptOptionsBase } from "discord-message-transcript-base/internal";
import { TextBasedChannel } from "discord.js";
import { ReturnDiscordParser } from "../../types/private/discordParser.js";
import { CDNOptions } from "../../types/private/cdn.js";
export declare function discordParser(channel: TextBasedChannel, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<ReturnDiscordParser>;
