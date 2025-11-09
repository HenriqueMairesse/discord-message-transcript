import { AttachmentBuilder } from "discord.js";
import { Json } from "../renderers/json/json";
import { TranscriptOptions, Uploadable } from "../types/types";
import Stream from 'stream';
export declare function output(jsonTranscript: Json, options: TranscriptOptions): Promise<string | Stream | AttachmentBuilder | Buffer | Uploadable>;
