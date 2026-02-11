import { MimeType } from "./others.js";

/**
 * Base options applicable to all CDN providers.
 */
export type CDNBase = Partial<{
  /** 
   * Whether to upload audio files to the CDN. 
   * @default true 
   */
  includeAudio: boolean;
  /** 
   * Whether to upload image files (excluding GIFs) to the CDN.
   * @default true
   */
  includeImage: boolean;
  /**
   * Whether to upload video files (and GIFs) to the CDN.
   * @default true
   */
  includeVideo: boolean;
  /**
   * Whether to upload any other file types to the CDN.
   * @default true
   */
  includeOthers: boolean;
}>;

/**
 * A discriminated union of all possible CDN configurations.
 */
export type CDNOptions = 
    (CDNBase & CDNOptionsCustom<any>)
  | (CDNBase & CDNOptionsCloudinary)
  | (CDNBase & CDNOptionsUploadcare);

/**
 * Configuration for using a custom, user-provided CDN resolver function.
 */
export type CDNOptionsCustom<T = unknown> = {
    /** Specifies the use of a custom CDN resolver. */
    provider: "CUSTOM",
    /**
     * An async function that takes a URL and returns a new URL.
     * @param url The original Discord asset URL.
     * @param contentType The MIME type of the asset.
     * @param customData Any additional data you want to pass to your resolver.
     * @returns The new URL of the asset on your CDN.
     */
    resolver: (
        url: string,
        contentType: MimeType | null,
        customData: T
        ) => Promise<string> | string,
    /**
     * Any custom data you wish to make available within your resolver function.
     */
    customData: T,
}

/**
 * Configuration for using Cloudinary as the CDN.
 */
export type CDNOptionsCloudinary = {
    /**
     * Specifies the use of the built-in Cloudinary provider.
     */
    provider: "CLOUDINARY",
    /**
     * Your Cloudinary cloud name.
     */
    cloudName: string;
    /**
     * Your Cloudinary API key.
     * */
    apiKey: string;
    /** 
     * Your Cloudinary API secret.
    */
    apiSecret: string;
}

/**
 * Configuration for using Uploadcare as the CDN.
 */
export type CDNOptionsUploadcare = {
    /**
     * Specifies the use of the built-in Uploadcare provider.
     */
    provider: "UPLOADCARE",
    /**
     * Your Uploadcare public key.
     */
    publicKey: string,
    /**
     * Your Uploadcare CDN domain.
     * Example: "aaa111aaa1.ucarecd.net".
     * DO NOT INCLUDE https://
     */
    cdnDomain: string,
}