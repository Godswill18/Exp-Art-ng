import { describe, expect, it } from "vitest";
import { resolveImageUrl } from "../image";

const BASE = "https://api.example.com";

describe("resolveImageUrl", () => {
  it("returns absolute http(s) URLs untouched", () => {
    expect(resolveImageUrl("https://cdn.example.com/a.webp", "", BASE)).toBe("https://cdn.example.com/a.webp");
    expect(resolveImageUrl("http://cdn.example.com/a.webp", "", BASE)).toBe("http://cdn.example.com/a.webp");
    expect(resolveImageUrl("//cdn.example.com/a.webp", "", BASE)).toBe("//cdn.example.com/a.webp");
  });

  it("joins relative paths with exactly one slash", () => {
    expect(resolveImageUrl("uploads/a.webp", "", BASE)).toBe(`${BASE}/uploads/a.webp`);
    expect(resolveImageUrl("/uploads/a.webp", "", BASE)).toBe(`${BASE}/uploads/a.webp`);
    expect(resolveImageUrl("/uploads/a.webp", "", `${BASE}/`)).toBe(`${BASE}/uploads/a.webp`);
  });

  it("normalises Windows separators", () => {
    expect(resolveImageUrl("uploads\\a.webp", "", BASE)).toBe(`${BASE}/uploads/a.webp`);
  });

  it("returns the fallback for empty or missing values", () => {
    expect(resolveImageUrl("", "", BASE)).toBe("");
    expect(resolveImageUrl("   ", "x.png", BASE)).toBe("x.png");
    expect(resolveImageUrl(undefined, "x.png", BASE)).toBe("x.png");
    expect(resolveImageUrl(null, "", BASE)).toBe("");
  });

  it("keeps data and blob URLs", () => {
    expect(resolveImageUrl("data:image/png;base64,AAA", "", BASE)).toBe("data:image/png;base64,AAA");
    expect(resolveImageUrl("blob:https://x/1", "", BASE)).toBe("blob:https://x/1");
  });
});
