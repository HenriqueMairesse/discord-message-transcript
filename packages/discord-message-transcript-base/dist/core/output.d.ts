import { JsonData, Uploadable } from "@/types";
import Stream from 'stream';
export declare function output(json: JsonData): Promise<string | Stream | Buffer | Uploadable>;
