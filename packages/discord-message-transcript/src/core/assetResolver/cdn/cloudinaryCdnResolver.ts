import crypto from 'crypto';
import { CDNProviderError, warnCdnError } from './cdnCustomError.js';
import { sanitizeFileName } from './sanitizeFileName.js';
import { USER_AGENT } from '../contants.js';


// https://cloudinary.com/documentation/upload_images
export async function cloudinaryCdnResolver(url: string, fileName: string, cloudName: string, apiKey: string, apiSecret: string, disableWarnings: boolean): Promise<string> {
    try {
        if (!cloudName || !apiKey || !apiSecret) {
            throw new CDNProviderError({
                provider: "CLOUDINARY",
                code: "CONFIG_MISSING",
                message: "Cloudinary configuration is missing required fields.",
                hint: "Verify cloudName, apiKey and apiSecret."
            });
        }

        const paramsToSign: Record<string, string> = {
            folder: `discord-message-transcript/${sanitizeFileName(fileName)}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            unique_filename: "true",
            use_filename: "true",
        };

        const stringToSign = Object.keys(paramsToSign).sort().map(k => `${k}=${paramsToSign[k]}`).join("&");

        // signature SHA256
        const signature = crypto
            .createHash("sha256")
            .update(stringToSign + apiSecret)
            .digest("hex")

        const form = new FormData();
        form.append("folder", paramsToSign.folder)
        form.append("file", url);
        form.append("api_key", apiKey);
        form.append("timestamp", paramsToSign.timestamp);
        form.append("signature", signature);
        form.append("use_filename", paramsToSign.use_filename);
        form.append("unique_filename", paramsToSign.unique_filename);

        let res: Response;
        try {
            res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: "POST",
                    body: form,
                    headers: { "User-Agent": USER_AGENT }
                }
            );
        } catch (networkErr: any) {
            throw new CDNProviderError({
                provider: "CLOUDINARY",
                code: "NETWORK_ERROR",
                message: "Network error while contacting Cloudinary.",
                hint: "Check internet connection, DNS, firewall or proxy.",
            });
        }

        if (!res.ok) {
            let body: any = {};
            try { 
                body = await res.json(); 
            } catch {} // It isn't a problem body be empty

            switch (res.status) {
                case 400:
                    throw new CDNProviderError({
                        provider: "CLOUDINARY",
                        code: "BAD_REQUEST",
                        status: res.status,
                        message: body?.error?.message ?? "Invalid upload parameters.",
                        hint: "Check folder name, file URL accessibility, and signature.",
                        errorMessage: body.error.message ? body.error.message : undefined
                    });

                case 401:
                case 403:
                    throw new CDNProviderError({
                        provider: "CLOUDINARY",
                        code: "INVALID_CREDENTIALS",
                        status: res.status,
                        message: "Cloudinary rejected credentials.",
                        hint: "Check apiKey/apiSecret and cloudName.",
                        errorMessage: body.error.message ? body.error.message : undefined
                    });

                case 420:
                    throw new CDNProviderError({
                        provider: "CLOUDINARY",
                        code: "RATE_LIMIT",
                        status: res.status,
                        message: "Cloudinary rate limit exceeded.",
                        hint: "Reduce concurrency.",
                        errorMessage: body.error.message ? body.error.message : undefined
                    });

                case 500:
                    throw new CDNProviderError({
                        provider: "CLOUDINARY",
                        code: "CLOUDINARY_INTERNAL_ERROR",
                        status: res.status,
                        message: "Cloudinary has a internal error.",
                        hint: "Contact support or check https://status.cloudinary.com.",
                        errorMessage: body.error.message ? body.error.message : undefined
                    });

                default:
                    throw new CDNProviderError({
                        provider: "CLOUDINARY",
                        code: "HTTP_ERROR",
                        status: res.status,
                        message: `Unexpected Cloudinary response.`,
                        errorMessage: body.error.message ? body.error.message : undefined
                    });
            }
        }

        const json: any = await res.json();

        if (!json.secure_url) {
            throw new CDNProviderError({
                provider: "CLOUDINARY",
                code: "INVALID_RESPONSE",
                message: "Cloudinary response missing secure_url."
            });
        }

        return json.secure_url;

    } catch (error: any) {
        warnCdnError("CLOUDINARY", url, error, disableWarnings);
        return url;
    }
}