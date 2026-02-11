import { hexColor } from "@/types/internal/util.js";

export const FALLBACK_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const HEX_REGEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const DEFAULT_COLOR = "#000000"
const SANITIZE_REGEX = /[&<>"']/g;
const SANITIZE_MAP: Record<string,string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function sanitize(text: string) {
  return text.replace(SANITIZE_REGEX, ch => SANITIZE_MAP[ch]);
}

export function isValidHexColor(colorInput: string, canReturnNull: false): hexColor;
export function isValidHexColor(colorInput: string | null, canReturnNull: true): hexColor | null;
export function isValidHexColor(colorInput: string | null, canReturnNull: boolean): hexColor | null {
  if (!colorInput) return canReturnNull ? null : DEFAULT_COLOR;

  let color = colorInput.trim();

  // Add '#' if don't come with
  if (!color.startsWith('#')) color = `#${color}`;

  const isValid = HEX_REGEX.test(color);

  if (isValid) return color.toLowerCase() as hexColor;

  return canReturnNull ? null : DEFAULT_COLOR; // Falback to a default hexColor if can't be null
}