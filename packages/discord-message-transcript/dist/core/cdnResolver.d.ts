import { CDNOptions } from "../types/types.js";
export declare function cdnResolver(url: string, cdnOptions: CDNOptions): Promise<string>;
export declare function uploadCareResolver(url: string, publicKey: string, cdnDomain: string): Promise<string>;
export declare function cloudinaryResolver(url: string, cloudName: string, apiKey: string, apiSecret: string): Promise<string>;
