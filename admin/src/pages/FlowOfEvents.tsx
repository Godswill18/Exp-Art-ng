import React, { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useEventFlowStore, type EventDay } from "@/stores/useEventFlowStore";
import { getErrorMessage } from "@/lib/api";

export default function EventFlow() {
  const {
    eventDays,
    loading,
    fetchEventDays,
    createEventDay,
    updateEventDay,
    deleteEventDay,
    getEventDayById,
  } = useEventFlowStore();

  // Fetch event days on component mount
  useEffect(() => {
    fetchEventDays();
  }, [fetchEventDays]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ schedule: EventDay } | null>(null);

  const initialFormState = {
    day: "",
    date: "",
    activities: "",
    description: "",
  };
  const [formData, setFormData] = useState<EventDay>(initialFormState);
  const [deleteId, setDeleteId] = useState<string>("");

  const fetchEventById = async (id: string) => {
    const event = await getEventDayById(id);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEventDay(formData);
      toast.success("Day schedule created successfully", {
        position: "top-center"
      });
      setFormData(initialFormState);
      setShowCreateModal(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Something went wrong, Check your input"), {
        position: "top-center"
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData._id) {
      try {
        await updateEventDay(formData._id, formData);
        toast.success("Day schedule updated successfully", {
          position: "top-center"
        });
        setShowEditModal(false);
      } catch (error) {
        toast.error(getErrorMessage(error, "Something went wrong"), {
          position: "top-center"
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEventDay(deleteId);
      toast.success("Day schedule deleted successfully", {
        position: "top-center"
      });
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete event day"), {
        position: "top-center"
      });
    }
  };

  // Ensure eventDays is always an array
//   const safeEventDays = Array.isArray(eventDays) ? eventDays : [];

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 min-h-screen p-6 space-y-6"> 
      <h1 className="text-center text-2xl font-bold">Event Schedule</h1>
      
      {/* Create Event Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
      >
        <Plus className="w-5 h-5" /> Add Day Schedule
      </button>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && eventDays.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700">No Schedules Found</h3>
            <p className="text-gray-500">Create your first day schedule by clicking the button above</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
            {/* {console.log(eventDays)} */}
          {eventDays?.map((event) => (
            <div 
              key={event._id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow text-black"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-blue-600">{event.day} – {event.date}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await fetchEventById(event._id!);
                        setShowViewModal(true);
                      } catch (error) {
                        console.error("Error fetching event:", error);
                      }
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setFormData(event);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(event._id!);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <ul className="list-disc pl-5 space-y-2">
                 {event.activities
                    ? event.activities.split('\n').map((item, index) => (
                        <li key={index} className="text-gray-700">{item}</li>
                        ))
                    : <li className="text-gray-500 italic">No activities listed</li>
                    }

                </ul>
              </div>

              {event.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700 italic">{event.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)} title="Add Day Schedule">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day (e.g., Day 1)</label>
              <input
                type="text"
                placeholder="Day 1"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date (e.g., Wednesday, Nov 5)</label>
              <input
                type="text"
                placeholder="Wednesday, Nov 5"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activities (one per line)</label>
              <textarea
                placeholder={`- Airport concierge / fast-track immigration\n- Local SIM + Data\n- Transfer to hotel / accommodation\n- Welcome Dinner`}
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                className="border rounded-lg p-2 w-full font-mono"
                rows={6}
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
              <textarea
                placeholder="Any special instructions or details"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border rounded-lg p-2 w-full"
                rows={3}
              />
            </div> */}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData(initialFormState);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Schedule"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && selectedEvent && (
        <Modal onClose={() => setShowViewModal(false)} title={`${selectedEvent?.schedule.day} – ${selectedEvent?.schedule.date}`}>
          <div className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              {selectedEvent?.schedule.activities
                ? selectedEvent?.schedule.activities.split('\n').map((item: string, index: number) => (
                    <li key={index} className="text-gray-700">{item}</li>
                    ))
                : <li className="text-gray-500 italic">No activities listed</li>
                }

            </ul>
            
            {selectedEvent?.schedule.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 italic">{selectedEvent?.schedule.description}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Day Schedule">
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input
                type="text"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border rounded-lg p-2 w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
              <textarea
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                className="border rounded-lg p-2 w-full font-mono"
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border rounded-lg p-2 w-full"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Delete Day Schedule">
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this day schedule?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal Component
function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto text-black">
        {title && <h2 className="text-lg font-bold mb-4 text-black">{title}</h2>}
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}