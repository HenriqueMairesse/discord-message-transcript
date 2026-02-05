import { CDNOptions } from "../types/types.js";
export declare function cdnResolver(url: string, cdnOptions: CDNOptions): Promise<string>;
export declare function uploadCareResolver(url: string, publicKey: string): Promise<string>;
