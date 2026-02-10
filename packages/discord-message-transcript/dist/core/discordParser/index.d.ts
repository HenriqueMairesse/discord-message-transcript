import { CDNOptions, ReturnDiscordParser } from "@/types/types.js";
import { TranscriptOptionsBase } from "discord-message-transcript-base";
import { TextBasedChannel } from "discord.js";
export declare function discordParser(channel: TextBasedChannel, options: TranscriptOptionsBase, cdnOptions: CDNOptions | null): Promise<ReturnDiscordParser>;
