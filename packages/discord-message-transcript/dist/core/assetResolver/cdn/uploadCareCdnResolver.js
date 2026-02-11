import { sleep } from "../../../utils/sleep.js";
import { CDNProviderError, warnCdnError } from "./cdnCustomError.js";
import { USER_AGENT } from "../contants.js";
// https://uploadcare.com/api-refs/upload-api/#tag/Upload/operation/fromURLUpload
export async function uploadCareCdnResolver(url, publicKey, cdnDomain, disableWarnings) {
    try {
        if (!publicKey || !cdnDomain) {
            throw new CDNProviderError({
                provider: "UPLOADCARE",
                code: "CONFIG_MISSING",
                message: "Uploadcare configuration is missing required fields.",
                hint: "Verify cdnDomain and publickey."
            });
        }
        const form = new FormData();
        form.append("pub_key", publicKey);
        form.append("source_url", url);
        form.append("store", "1");
        form.append("check_URL_duplicates", "1");
        form.append("save_URL_duplicates", "1");
        let res;
        try {
            res = await fetch("https://upload.uploadcare.com/from_url/", {
                method: "POST",
                body: form,
                headers: { "User-Agent": USER_AGENT }
            });
        }
        catch {
            throw new CDNProviderError({
                provider: "UPLOADCARE",
                code: "NETWORK_ERROR",
                message: "Network error while contacting Uploadcare.",
                hint: "Check DNS, firewall or internet connection."
            });
        }
        if (!res.ok) {
            let body = {};
            try {
                body = await res.text(); // Uploadcare use text/plain for error messages
            }
            catch { } // It isn't a problem body be empty
            switch (res.status) {
                case 400:
                    throw new CDNProviderError({
                        provider: "UPLOADCARE",
                        code: "BAD_REQUEST",
                        status: 400,
                        message: "Uploadcare rejected parameters.",
                        hint: "Check publickKey, file URL accessibility, and signature.",
                        errorMessage: body ?? undefined
                    });
                case 403:
                    throw new CDNProviderError({
                        provider: "UPLOADCARE",
                        code: "INVALID_KEY",
                        status: 403,
                        message: "Uploadcare rejected public key.",
                        hint: "Verify public key and project settings.",
                        errorMessage: body ?? undefined
                    });
                case 429:
                    throw new CDNProviderError({
                        provider: "UPLOADCARE",
                        code: "RATE_LIMIT",
                        status: 429,
                        message: "Uploadcare rate limit exceeded.",
                        hint: "Reduce concurrency.",
                        errorMessage: body ?? undefined
                    });
                case 500:
                    throw new CDNProviderError({
                        provider: "UPLOADCARE",
                        code: "UPLOADCARE_INTERNAL",
                        status: res.status,
                        message: "Uploadcare internal error.",
                        hint: "Check https://status.uploadcare.com",
                        errorMessage: body ?? undefined
                    });
                default:
                    throw new CDNProviderError({
                        provider: "UPLOADCARE",
                        code: "HTTP_ERROR",
                        status: res.status,
                        message: "Unexpected Uploadcare response.",
                        errorMessage: body ?? undefined
                    });
            }
        }
        const json = await res.json();
        if (json.uuid) {
            return `https://${cdnDomain}/${json.uuid}/`;
        }
        if (!json.token) {
            throw new CDNProviderError({
                provider: "UPLOADCARE",
                code: "INVALID_RESPONSE",
                message: "Uploadcare response missing uuid/token."
            });
        }
        let delay = 200;
        let maxDelay = 2000;
        for (let i = 0; i < 10; i++) {
            await sleep(delay);
            delay = Math.min(delay * 2, maxDelay);
            const resToken = await fetch(`https://upload.uploadcare.com/from_url/status/?token=${json.token}&pub_key=${publicKey}`, { headers: { "User-Agent": USER_AGENT } });
            if (!resToken.ok) {
                throw new CDNProviderError({
                    provider: "UPLOADCARE",
                    code: "STATUS_ERROR",
                    status: resToken.status,
                    message: "Uploadcare status endpoint failed."
                });
            }
            const jsonToken = await resToken.json();
            if (jsonToken.status === "success" && jsonToken.file_id) {
                return `https://${cdnDomain}/${jsonToken.file_id}/`;
            }
            if (jsonToken.status === "error") {
                throw new CDNProviderError({
                    provider: "UPLOADCARE",
                    code: "UPLOAD_FAILED",
                    message: jsonToken.error || "Uploadcare processing failed."
                });
            }
        }
        throw new CDNProviderError({
            provider: "UPLOADCARE",
            code: "TIMEOUT",
            message: "Uploadcare polling timeout."
        });
    }
    catch (error) {
        warnCdnError("UPLOADCARE", url, error, disableWarnings);
        return url;
    }
}
