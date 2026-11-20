import { apiRequest } from "@/lib/api";
import type { ContactMessage } from "@/types/api";

export const contactsService = {
  list: () => apiRequest<{ contacts?: ContactMessage[] }>("/api/contacts/get-all-contacts"),
  remove: (id: string) =>
    apiRequest(`/api/contacts/delete-contact/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
