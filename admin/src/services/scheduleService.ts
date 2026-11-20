import { apiRequest } from "@/lib/api";
import type { EventDay } from "@/types/api";

const enc = encodeURIComponent;

export const scheduleService = {
  list: () => apiRequest<{ schedules?: EventDay[] }>("/api/schedule/get-all-schedule"),
  get: (id: string) => apiRequest<{ schedule: EventDay }>(`/api/schedule/get-schedule/${enc(id)}`),
  create: (data: Omit<EventDay, "_id">) =>
    apiRequest<EventDay>("/api/schedule/create-schedule", { method: "POST", json: data }),
  update: (id: string, data: Partial<EventDay>) =>
    apiRequest<EventDay>(`/api/schedule/update-schedule/${enc(id)}`, { method: "PUT", json: data }),
  remove: (id: string) => apiRequest(`/api/schedule/delete-schedule/${enc(id)}`, { method: "DELETE" }),
};
