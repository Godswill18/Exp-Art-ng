// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import PublicOnlyRoute from "../PublicOnlyRoute";
import { useAuthStore } from "@/stores/useAuthStore";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
let host: HTMLDivElement | null = null;

async function renderAt(path: string) {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  await act(async () => {
    root!.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<PublicOnlyRoute><div>LOGIN PAGE</div></PublicOnlyRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><div>SECRET DASHBOARD</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );
  });
  return host.textContent ?? "";
}

afterEach(() => {
  act(() => root?.unmount());
  host?.remove();
  root = null;
  host = null;
  useAuthStore.setState({ user: null, status: "unknown", loading: false, error: null });
});

describe("route guards", () => {
  it("shows a loading state (never admin content) while the session is being verified", async () => {
    useAuthStore.setState({ status: "checking", checkSession: async () => false });
    const text = await renderAt("/dashboard");
    expect(text).toContain("Checking authentication");
    expect(text).not.toContain("SECRET DASHBOARD");
  });

  it("redirects unauthenticated visitors to /login", async () => {
    useAuthStore.setState({ status: "unauthenticated" });
    const text = await renderAt("/dashboard");
    expect(text).toContain("LOGIN PAGE");
    expect(text).not.toContain("SECRET DASHBOARD");
  });

  it("renders protected content for an authenticated session", async () => {
    useAuthStore.setState({ status: "authenticated", user: { id: "1", email: "a@b.com" } });
    expect(await renderAt("/dashboard")).toContain("SECRET DASHBOARD");
  });

  it("keeps authenticated admins off the login page", async () => {
    useAuthStore.setState({ status: "authenticated", user: { id: "1", email: "a@b.com" } });
    const text = await renderAt("/login");
    expect(text).not.toContain("LOGIN PAGE");
  });
});
