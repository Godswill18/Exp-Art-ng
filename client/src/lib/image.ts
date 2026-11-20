import { IMAGE_BASE_URL } from "./api";

/**
 * Resolve an image value returned by the API into a usable URL.
 *
 * - absolute http(s)/data/blob URLs are returned untouched
 * - relative paths (with or without a leading "/") are joined to the image
 *   base URL with exactly one slash
 * - empty / missing values return `fallback` (default: empty string)
 */
export function resolveImageUrl(
  src: string | null | undefined,
  fallback = "",
  base: string = IMAGE_BASE_URL
): string {
  const value = (src ?? "").trim();
  if (!value) return fallback;
  if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) return value;
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = value.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${cleanBase}/${cleanPath}`;
}
