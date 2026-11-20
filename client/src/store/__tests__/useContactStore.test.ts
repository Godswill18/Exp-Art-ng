import { afterEach, describe, expect, it, vi } from "vitest";
import { useContactStore } from "../useContactStore";

afterEach(() => vi.unstubAllGlobals());

const payload = { name: "Ada", email: "ada@example.com", message: "Hello" };

describe("useContactStore.createMessage", () => {
  it("resolves only after the API confirms the save", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ contacts: {} }), { status: 201 })));
    await expect(useContactStore.getState().createMessage(payload)).resolves.toBeUndefined();
    expect(useContactStore.getState().submitting).toBe(false);
  });

  it("rejects (no false success) when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
    await expect(useContactStore.getState().createMessage(payload)).rejects.toMatchObject({ kind: "server" });
    expect(useContactStore.getState().submitting).toBe(false);
    expect(useContactStore.getState().error).toBeTruthy();
  });

  it("blocks duplicate submissions while one is in flight", async () => {
    let release!: () => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>((resolve) => { release = () => resolve(new Response("{}", { status: 201 })); }))
    );
    const first = useContactStore.getState().createMessage(payload);
    await expect(useContactStore.getState().createMessage(payload)).rejects.toThrow(/already being sent/);
    release();
    await first;
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("includes extra fields (e.g. captcha token) only when provided", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await useContactStore.getState().createMessage(payload, { captchaToken: "t" });
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toMatchObject({ ...payload, captchaToken: "t" });
  });
});
