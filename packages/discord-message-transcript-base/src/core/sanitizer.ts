import { hexColor } from "@/types";

export const FALLBACK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function sanitize(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function isValidHexColor(colorInput: string, canReturnNull: false): hexColor;
export function isValidHexColor(colorInput: string | null, canReturnNull: true): hexColor | null;
export function isValidHexColor(colorInput: string | null, canReturnNull: boolean): hexColor | null {
  if (!colorInput) return null;

  const hexColorRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}([A-Fa-f0-9]{2})?)$/;

  let color = colorInput.trim();

  if (/^[A-Fa-f0-9]+$/.test(color)) {
    color = "#" + color;
  }

  if (hexColorRegex.test(color)) {
    return color as hexColor;
  }

  if (canReturnNull) {
    return null;
  }

  return "#000000"; // Falback to a default hexColor if can't be null
}