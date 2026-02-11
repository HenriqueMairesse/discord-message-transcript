import Stream from 'stream';
import { JsonData } from '@/types/internal/message/messageItens.js';
import { Uploadable } from '@/types/internal/util.js';
export declare function output(json: JsonData): Promise<string | Stream | Buffer | Uploadable>;
