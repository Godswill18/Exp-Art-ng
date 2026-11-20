import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  /** Absolute path of this page, e.g. "/about". Used for the canonical link. */
  path?: string;
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Per-page <title>/description/canonical for this client-rendered SPA.
 * Restores the previous values when the page unmounts.
 */
export function usePageMeta({ title, description, path }: PageMeta): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = descEl?.getAttribute("content") ?? null;
    if (description) {
      setMeta('meta[name="description"]', "name", "description", description);
      setMeta('meta[property="og:description"]', "property", "og:description", description);
    }
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (path) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${window.location.origin}${path}`;
    }

    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) {
        setMeta('meta[name="description"]', "name", "description", previousDescription);
      }
    };
  }, [title, description, path]);
}
