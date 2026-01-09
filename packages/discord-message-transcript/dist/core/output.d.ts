import { AttachmentBuilder } from "discord.js";
import { JsonData, TranscriptOptions, Uploadable } from "../types/types";
import Stream from 'stream';
export declare function output(json: JsonData, options: TranscriptOptions): Promise<string | Stream | AttachmentBuilder | Buffer | Uploadable>;
