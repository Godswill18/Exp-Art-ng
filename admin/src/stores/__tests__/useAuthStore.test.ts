import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../useAuthStore";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  useAuthStore.setState({ user: null, status: "unknown", loading: false, error: null });
});
afterEach(() => vi.unstubAllGlobals());

describe("session restoration (checkSession)", () => {
  it("authenticates from /api/auth/me without touching storage tokens", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ _id: "1", email: "a@b.com", token: "SECRET" })));
    await expect(useAuthStore.getState().checkSession()).resolves.toBe(true);
    const state = useAuthStore.getState();
    expect(state.status).toBe("authenticated");
    expect(state.user).toEqual({ id: "1", email: "a@b.com", name: undefined, role: undefined });
    // the token returned by the API is never kept in state
    expect(JSON.stringify(state.user)).not.toContain("SECRET");
  });

  it("becomes unauthenticated on 401 without surfacing an error", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({}, 401)));
    await expect(useAuthStore.getState().checkSession()).resolves.toBe(false);
    expect(useAuthStore.getState()).toMatchObject({ status: "unauthenticated", error: null });
  });

  it("de-duplicates concurrent session checks", async () => {
    const fetchMock = vi.fn(async () => json({ email: "a@b.com" }));
    vi.stubGlobal("fetch", fetchMock);
    await Promise.all([useAuthStore.getState().checkSession(), useAuthStore.getState().checkSession()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("login / logout / expiry", () => {
  it("logs in and reports backend failure messages", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => json({ email: "a@b.com" })));
    expect(await useAuthStore.getState().loginAdmin({ email: "a@b.com", password: "x" })).toMatchObject({ success: true });
    expect(useAuthStore.getState().status).toBe("authenticated");

    useAuthStore.setState({ user: null, status: "unauthenticated" });
    vi.stubGlobal("fetch", vi.fn(async () => json({ message: "Invalid credentials" }, 400)));
    const result = await useAuthStore.getState().loginAdmin({ email: "a@b.com", password: "bad" });
    expect(result).toEqual({ success: false, message: "Invalid credentials" });
    expect(useAuthStore.getState().status).not.toBe("authenticated");
  });

  it("logout always clears the local session, even if the server call fails", async () => {
    useAuthStore.setState({ user: { id: "1", email: "a@b.com" }, status: "authenticated" });
    vi.stubGlobal("fetch", vi.fn(async () => json({}, 500)));
    const result = await useAuthStore.getState().logoutAdmin();
    expect(result.success).toBe(false);
    expect(useAuthStore.getState()).toMatchObject({ user: null, status: "unauthenticated" });
  });

  it("a 401 from any API call expires the session", async () => {
    useAuthStore.setState({ user: { id: "1", email: "a@b.com" }, status: "authenticated" });
    vi.stubGlobal("fetch", vi.fn(async () => json({}, 401)));
    const { apiRequest } = await import("@/lib/api");
    await expect(apiRequest("/api/events/get-events")).rejects.toBeTruthy();
    expect(useAuthStore.getState().status).toBe("unauthenticated");
  });
});
