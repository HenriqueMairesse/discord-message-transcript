import { CDNOptions, MimeType } from "../types/types.js";
import https from 'https';
import http from 'http';
import { CustomWarn } from "discord-message-transcript-base";

export async function cdnResolver(url: string, cdnOptions: CDNOptions): Promise<string> {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, { headers: { "User-Agent": "discord-message-transcript" } }, async (response) => {
            if (response.statusCode !== 200) {
                response.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nFailed to fetch attachment with status code: ${response.statusCode} from ${url}.`);
                return resolve(url);
            }
            const contentType = response.headers["content-type"];
            const splitContentType = contentType ? contentType?.split('/') : [];
            if (!contentType || splitContentType.length != 2 || splitContentType[0].length == 0 || splitContentType[1].length == 0) {
                response.destroy();
                CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nFailed to receive a valid content-type from ${url}.`);
                return resolve(url);
            }
            response.destroy();
            const isImage = contentType.startsWith('image/') && contentType !== 'image/gif';
            const isAudio = contentType.startsWith('audio/');
            const isVideo = contentType.startsWith('video/') || contentType === 'image/gif';
            if ((cdnOptions.includeImage && isImage) || 
                (cdnOptions.includeAudio && isAudio) || 
                (cdnOptions.includeVideo && isVideo) || 
                (cdnOptions.includeOthers && !isAudio && !isImage && !isVideo) ) {
                return resolve(await cdnRedirectType(url, contentType as MimeType, cdnOptions));
            }

            return resolve(url);
        })
        
        request.on('error', (err) => {
            CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nError message: ${err.message}`);
            return resolve(url);
        });

        request.setTimeout(15000, () => {
            request.destroy();
            CustomWarn(`This is not an issue with the package. Using the original URL as fallback instead of uploading to CDN.\nRequest timeout for ${url}.`);
            resolve(url);
        });

        request.end();
    })
}

async function cdnRedirectType(url: string, contentType: MimeType, cdnOptions: CDNOptions): Promise<string> {
    switch (cdnOptions.type) {
        case "CUSTOM": {
            try {
                return await cdnOptions.resolver(url, contentType, cdnOptions.customData);
            } catch (error) {
                CustomWarn(`Custom CDN resolver threw an error. Falling back to original URL.\nThis is most likely an issue in the custom CDN implementation provided by the user.\nURL: ${url}\nError message: ${error.message}`);
            }
        }
        case "CLOUDINARY": {

        }
        case "UPLOADCARE": {
            return await uploadCareResolver(url, cdnOptions.publicKey);
        }
    }
}

function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

export async function uploadCareResolver(
    url: string,
    publicKey: string
): Promise<string> {
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
        const json: any = await res.json();

        if (json.uuid) {
            return `https://ucarecdn.com/${json.uuid}/`;
        }

        if (json.token) {
            for (let i = 0; i < 10; i++) {
                await sleep(500);

                const resToken = await fetch(`https://upload.uploadcare.com/from_url/status/?token=${json.token}&pub_key=${publicKey}`,
                    { headers: { "User-Agent": "discord-message-transcript" } }
                );

                if (!resToken.ok) throw new Error(`Uploadcare status failed with status code ${resToken.status}`);

                const jsonToken: any = await resToken.json();

                if (jsonToken.status === "success" && jsonToken.file_id) {
                    return `https://ucarecdn.com/${jsonToken.file_id}/`;
                }

                if (jsonToken.status === "error") {
                    throw new Error(jsonToken.error || "Uploadcare failed");
                }
            }

            throw new Error("Uploadcare polling timeout");
        }

        return url;
    } catch (error: any) {
        CustomWarn(`This CAN be an issue with the package, but first verify Uploadcare credentials.\nUsing original URL as fallback instead of uploading to CDN.\nError uploading ${url}\nError message: ${error?.message ?? error}`);
        return url;
    }
}