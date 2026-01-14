import { AttachmentBuilder } from "discord.js";
import Stream from 'stream';
import { JsonData, Uploadable } from "discord-message-transcript-base";
export declare function output(json: JsonData): Promise<string | Stream | AttachmentBuilder | Buffer | Uploadable>;
