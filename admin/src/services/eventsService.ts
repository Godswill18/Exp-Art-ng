import { apiRequest } from "@/lib/api";
import type { EventItem } from "@/types/api";

const enc = encodeURIComponent;

export const eventsService = {
  list: () => apiRequest<{ events?: EventItem[] }>("/api/events/get-events"),
  get: (id: string) => apiRequest<{ event: EventItem }>(`/api/events/get-event/${enc(id)}`),
  create: (formData: FormData) =>
    apiRequest<{ event: EventItem }>("/api/events/create-event", { method: "POST", formData }),
  update: (id: string, formData: FormData) =>
    apiRequest<{ event: EventItem }>(`/api/events/update-event/${enc(id)}`, { method: "PUT", formData }),
  remove: (id: string) => apiRequest(`/api/events/delete-event/${enc(id)}`, { method: "DELETE" }),
};
