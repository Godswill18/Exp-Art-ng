import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest, getErrorMessage } from "../api";

function mockFetch(impl: () => Promise<Response> | Response) {
  vi.stubGlobal("fetch", vi.fn(async () => impl()));
}

afterEach(() => vi.unstubAllGlobals());

describe("apiRequest", () => {
  it("returns parsed JSON on success and sends credentials", async () => {
    mockFetch(() => new Response(JSON.stringify({ ok: 1 }), { status: 200 }));
    await expect(apiRequest("/x")).resolves.toEqual({ ok: 1 });
    const init = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    expect(init.credentials).toBe("include");
  });

  it("maps network failures to a friendly error", async () => {
    mockFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    await expect(apiRequest("/x")).rejects.toMatchObject({ kind: "network", status: 0 });
  });

  it("uses the server message for client errors", async () => {
    mockFetch(() => new Response(JSON.stringify({ message: "Email is invalid" }), { status: 400 }));
    await expect(apiRequest("/x")).rejects.toMatchObject({ kind: "validation", message: "Email is invalid" });
  });

  it("never exposes server error details for 5xx", async () => {
    mockFetch(() => new Response(JSON.stringify({ message: "stack: secret/path.js:12" }), { status: 500 }));
    const err = (await apiRequest("/x").catch((e) => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.kind).toBe("server");
    expect(err.message).not.toContain("secret");
  });

  it("classifies 403 and 404", async () => {
    mockFetch(() => new Response("{}", { status: 403 }));
    await expect(apiRequest("/x")).rejects.toMatchObject({ kind: "forbidden" });
    mockFetch(() => new Response("{}", { status: 404 }));
    await expect(apiRequest("/x")).rejects.toMatchObject({ kind: "not_found" });
  });
});

describe("getErrorMessage", () => {
  it("returns ApiError messages and a fallback for unknown errors", () => {
    expect(getErrorMessage(new ApiError("boom", 400, "validation"))).toBe("boom");
    expect(getErrorMessage(new Error("internal detail"), "Fallback")).toBe("Fallback");
  });
});
