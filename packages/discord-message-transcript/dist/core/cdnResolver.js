import https from 'https';
import http from 'http';
import { CustomWarn } from "discord-message-transcript-base";
import crypto from 'crypto';
import { getCDNLimiter } from "./limiter.js";
export async function cdnResolver(url, options, cdnOptions) {
    const limit = getCDNLimiter();
    return limit(async () => {
        return new Promise((resolve, reject) => {
            const client = url.startsWith('https') ? https : http;
            const request = client.request(url, {
                method: 'HEAD',
                headers: { "User-Agent": "discord-message-transcript" }
            }, async (response) => {
                if (response.statusCode !== 200) {
                    response.destroy();
                    CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Failed to fetch attachment with status code: ${response.statusCode} from ${url}.`);
                    return resolve(url);
                }
                const contentType = response.headers["content-type"];
                const splitContentType = contentType ? contentType?.split('/') : [];
                if (!contentType || splitContentType.length != 2 || splitContentType[0].length == 0 || splitContentType[1].length == 0) {
                    response.destroy();
                    CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Failed to receive a valid content-type from ${url}.`);
                    return resolve(url);
                }
                response.destroy();
                const isImage = contentType.startsWith('image/') && contentType !== 'image/gif';
                const isAudio = contentType.startsWith('audio/');
                const isVideo = contentType.startsWith('video/') || contentType === 'image/gif';
                if ((cdnOptions.includeImage && isImage) ||
                    (cdnOptions.includeAudio && isAudio) ||
                    (cdnOptions.includeVideo && isVideo) ||
                    (cdnOptions.includeOthers && !isAudio && !isImage && !isVideo)) {
                    return resolve(await cdnRedirectType(url, options, contentType, cdnOptions));
                }
                return resolve(url);
            });
            request.on('error', (err) => {
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Error: ${err.message}`);
                return resolve(url);
            });
            request.setTimeout(15000, () => {
                request.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.
Request timeout for ${url}.`);
                resolve(url);
            });
            request.end();
        });
    });
}
async function cdnRedirectType(url, options, contentType, cdnOptions) {
    switch (cdnOptions.provider) {
        case "CUSTOM": {
            try {
                return await cdnOptions.resolver(url, contentType, cdnOptions.customData);
            }
            catch (error) {
                CustomWarn(`Custom CDN resolver threw an error. Falling back to original URL.
This is most likely an issue in the custom CDN implementation provided by the user.
URL: ${url}
Error: ${error?.message ?? error}`);
                return url;
            }
        }
        case "CLOUDINARY": {
            return await cloudinaryResolver(url, options.fileName, cdnOptions.cloudName, cdnOptions.apiKey, cdnOptions.apiSecret);
            ;
        }
        case "UPLOADCARE": {
            return await uploadCareResolver(url, cdnOptions.publicKey, cdnOptions.cdnDomain);
        }
    }
}
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
export async function uploadCareResolver(url, publicKey, cdnDomain) {
    try {
        const form = new FormData();
        form.append("pub_key", publicKey);
        form.append("source_url", url);
        form.append("store", "1");
        form.append("check_URL_duplicates", "1");
        form.append("save_URL_duplicates", "1");
        const res = await fetch("https://upload.uploadcare.com/from_url/", {
            method: "POST",
            body: form,
            headers: {
                "User-Agent": "discord-message-transcript"
            }
        });
        if (!res.ok) {
            switch (res.status) {
                case 400:
                    throw new Error(`Uploadcare initial request failed with status code ${res.status} - Request failed input parameters validation.`);
                case 403:
                    throw new Error(`Uploadcare initial request failed with status code ${res.status} - Request was not allowed.`);
                case 429:
                    throw new Error(`Uploadcare initial request failed with status code ${res.status} - Request was throttled.`);
                default:
                    throw new Error(`Uploadcare initial request failed with status code ${res.status}`);
            }
        }
        const json = await res.json();
        if (json.uuid) {
            return `https://${cdnDomain}/${json.uuid}/`;
        }
        let delay = 200;
        let maxDelay = 2000;
        if (json.token) {
            for (let i = 0; i < 10; i++) {
                await sleep(delay);
                delay = Math.min(delay * 2, maxDelay);
                const resToken = await fetch(`https://upload.uploadcare.com/from_url/status/?token=${json.token}&pub_key=${publicKey}`, { headers: { "User-Agent": "discord-message-transcript" } });
                if (!resToken.ok)
                    throw new Error(`Uploadcare status failed with status code ${resToken.status}`);
                const jsonToken = await resToken.json();
                if (jsonToken.status === "success" && jsonToken.file_id) {
                    return `https://${cdnDomain}/${jsonToken.file_id}/`;
                }
                if (jsonToken.status === "error") {
                    throw new Error(jsonToken.error || "Uploadcare failed");
                }
            }
            throw new Error("Uploadcare polling timeout");
        }
        return url;
    }
    catch (error) {
        CustomWarn(`Uploadcare CDN upload failed. Using original URL as fallback.
Check Uploadcare public key, CDN domain, project settings, rate limits, and network access.
URL: ${url}
Error: ${error?.message ?? error}`);
        return url;
    }
}
export async function cloudinaryResolver(url, fileName, cloudName, apiKey, apiSecret) {
    try {
        const paramsToSign = {
            folder: `transcripts/${fileName}`,
            timestamp: Math.floor(Date.now() / 1000).toString(),
            unique_filename: "true",
            use_filename: "true",
        };
        const stringToSign = Object.keys(paramsToSign).sort().map(k => `${k}=${paramsToSign[k]}`).join("&");
        // signature SHA1
        const signature = crypto
            .createHash("sha1")
            .update(stringToSign + apiSecret)
            .digest("hex");
        const form = new FormData();
        form.append("folder", paramsToSign.folder);
        form.append("file", url);
        form.append("api_key", apiKey);
        form.append("timestamp", paramsToSign.timestamp);
        form.append("signature", signature);
        form.append("use_filename", paramsToSign.use_filename);
        form.append("unique_filename", paramsToSign.unique_filename);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: "POST",
            body: form,
            headers: {
                "User-Agent": "discord-message-transcript"
            }
        });
        if (!res.ok) {
            switch (res.status) {
                case 400:
                    throw new Error(`Cloudinary upload failed with status code ${res.status} - Bad request / invalid params.`);
                case 403:
                    throw new Error(`Cloudinary upload failed with status code ${res.status} - Invalid credentials or unauthorized.`);
                case 429:
                    throw new Error(`Cloudinary upload failed with status code ${res.status} - Rate limited.`);
                default:
                    throw new Error(`Cloudinary upload failed with status code ${res.status}.`);
            }
        }
        const json = await res.json();
        if (!json.secure_url) {
            throw new Error("Cloudinary response missing secure_url");
        }
        return json.secure_url;
    }
    catch (error) {
        CustomWarn(`Failed to upload asset to Cloudinary CDN. Using original URL as fallback.
Check Cloudinary configuration (cloud name, API key, API secret) and network access.
URL: ${url}
Error: ${error?.message ?? error}`);
        return url;
    }
}
// Note: for debug use ${JSON.stringify(await res.json())} to understand the error
