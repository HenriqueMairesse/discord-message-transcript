import { JsonData, Uploadable } from "../types/types.js";
import Stream from 'stream';
export declare function output(json: JsonData): Promise<string | Stream | Buffer | Uploadable>;
