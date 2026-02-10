import { randomUUID } from "crypto";
const INVALID_REGEX = /[<>:"/\\|?*\x00-\x1F]|[^\p{L}\p{N}._ -]/gu;
const MAX_LENGTH = 100;
export function sanitizeFileName(fileName) {
    fileName = fileName
        .trim()
        .replace(INVALID_REGEX, "")
        .replace(/\s+/g, " ");
    fileName = fileName.replace(/[. ]+$/, "");
    if (fileName.length > MAX_LENGTH) {
        fileName = fileName.slice(0, MAX_LENGTH);
    }
    if (!fileName.length) {
        fileName = `fallbackFile-${randomUUID()}`;
    }
    return fileName;
}
