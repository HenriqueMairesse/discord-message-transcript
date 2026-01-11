import { AttachmentBuilder } from "discord.js";
import { JsonData, Uploadable } from "discord-message-transcript-base/types/types";
import Stream from 'stream';
export declare function output(json: JsonData): Promise<string | Stream | AttachmentBuilder | Buffer | Uploadable>;
