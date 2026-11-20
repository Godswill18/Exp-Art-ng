/**
 * Central API configuration and request helper.
 *
 * - One place for the API base URL (env: VITE_API_URL, with the legacy
 *   VITE_BACKEND_API_URL still honoured so existing deployments keep working).
 * - Requests keep `credentials: "include"` (the API's CORS policy is credentialed).
 * - Failures are normalised into ApiError with a user-safe message.
 */

const env = import.meta.env;

function trimSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

const DEFAULT_PROD_API = "https://api.experiencenigeriaart.com";
const DEFAULT_DEV_API = "http://localhost:5000";

export const API_URL: string = trimSlash(
  env.VITE_API_URL ||
    env.VITE_BACKEND_API_URL ||
    (env.DEV ? DEFAULT_DEV_API : DEFAULT_PROD_API)
);

/** Base URL that uploaded images are served from. Defaults to the API host. */
export const IMAGE_BASE_URL: string = trimSlash(
  env.VITE_IMAGE_URL || env.VITE_BACKEND_IMAGE_URL || API_URL
);

export type ApiErrorKind =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation"
  | "server"
  | "unknown";

export class ApiError extends Error {
  readonly status: number;
  readonly kind: ApiErrorKind;

  constructor(message: string, status: number, kind: ApiErrorKind) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
  }
}

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 400 || status === 409 || status === 422) return "validation";
  if (status >= 500) return "server";
  return "unknown";
}

const FALLBACK_MESSAGES: Record<ApiErrorKind, string> = {
  network: "Unable to reach the server. Check your connection and try again.",
  unauthorized: "Your session has expired. Please sign in again.",
  forbidden: "You do not have permission to do that.",
  not_found: "The requested item could not be found.",
  validation: "The request was rejected. Please check the details and try again.",
  server: "Something went wrong on our side. Please try again shortly.",
  unknown: "Something went wrong. Please try again.",
};

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** JSON body (sets Content-Type). */
  json?: unknown;
  /** Multipart body; the browser sets the Content-Type boundary itself. */
  formData?: FormData;
  signal?: AbortSignal;
}

/** Server-supplied messages are only trusted for client errors, never 5xx. */
function pickServerMessage(body: unknown, status: number): string | null {
  if (status >= 500 || !body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const candidate = record.message ?? record.error;
  return typeof candidate === "string" && candidate.length > 0 && candidate.length < 300
    ? candidate
    : null;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", json, formData, signal } = options;

  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (formData) {
    body = formData;
  } else if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body,
      credentials: "include",
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError(FALLBACK_MESSAGES.network, 0, "network");
  }

  let parsed: unknown = null;
  const text = await response.text().catch(() => "");
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
  }

  if (!response.ok) {
    const kind = kindFromStatus(response.status);
    const message = pickServerMessage(parsed, response.status) ?? FALLBACK_MESSAGES[kind];
    throw new ApiError(message, response.status, kind);
  }

  return parsed as T;
}

/** Convert any thrown value into a message that is safe to show a user. */
export function getErrorMessage(error: unknown, fallback = FALLBACK_MESSAGES.unknown): string {
  if (error instanceof ApiError) return error.message;
  return fallback;
}
