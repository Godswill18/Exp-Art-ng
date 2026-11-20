import { useEffect } from "react";

/** Sets the browser tab title for an admin page. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Admin | Experience Nigeria Art Tour`;
  }, [title]);
}
