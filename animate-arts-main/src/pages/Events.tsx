import React, { useEffect, useState } from "react";
import { useEventStore } from "../context/EventStore";
import { Edit2, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function Events() {
  const {
    events,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventById,
    selectedEvent,
  } = useEventStore();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const initialFormState = {
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    ticketType: "",
    price: "",
    image: null as File | null,
  };
  const [formData, setFormData] = useState<any>(initialFormState);
  const [deleteId, setDeleteId] = useState<string>("");

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, price: numericValue });
  };

  const formatPrice = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      fd.append(key, value as any)
    );
    const event = await createEvent(fd);

    if(event){
      toast.success("Event created successfully",{
       position: "top-center"
     });
     setFormData(initialFormState);
     setImagePreview(null);
     setShowCreateModal(false);

    }else{
        toast.error("Something went wrong, Check your input",{
        position: "top-center"
      });
    }
  };

  const handleEdit = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      fd.append(key, value as any)
    );
    if (formData._id) {
      const editEvent = await updateEvent(formData._id, fd);

      if(editEvent){

        toast.error("Event edited successfully",{
        position: "top-center"
      });
    }else{
      
      toast.error("Something went wrong",{
      position: "top-center"
    });
      }
    }
    setShowEditModal(false);
    setImagePreview(null);
  };

  return (
      <div className="bg-gradient-to-br from-black via-gray-900 to-emerald-900 p-6 space-y-6 min-h-screen"> 
    <h1 className="text-center text-lg">Events</h1>
    {/* Create Event Button */}
    <button
      onClick={() => setShowCreateModal(true)}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
    >
      <Plus className="w-5 h-5" /> Create Event
    </button>

    {/* Events List or No Events Message */}
    {events.length === 0 ? (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-700">No Events Found</h3>
          <p className="text-gray-500">Create your first event by clicking the button above</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" /> Create Event
          </button>
        </div>
      </div>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {events.map((event) => (
          <div 
            key={event._id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={`${import.meta.env.VITE_BACKEND_IMAGE_URL}/${event.image}`}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-xl">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
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
                <span>
                  {event.date} at {event.time}
                </span> 
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {event.ticketType}: ₦ {formatPrice(event.price || "0")}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mt-2">
                {event.description}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={async () => {
                    try {
                      await fetchEventById(event._id);
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
                    setImagePreview(
                      `${import.meta.env.VITE_BACKEND_IMAGE_URL}${event.image}`
                    );
                    setShowEditModal(true);
                  }}
                  className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setDeleteId(event._id);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <Modal  onClose={() => setShowCreateModal(false)} >
          <form onSubmit={handleCreate} className="text-black">
            <h2 className="text-lg font-bold mb-4">Create Event</h2>
            <div className="grid gap-3 md:grid-cols-2 text-black">
              <input
                type="text"
                placeholder="Title"
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Location"
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <input
                type="time"
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />

              <select
                name="ticketType"
                aria-placeholder="Ticket Type"
                onChange={(e) =>
                  setFormData({ ...formData, ticketType: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              >
                <option value="">Select Ticket Type</option>
                <option value="Free">Free</option>
                <option value="General">General</option>
                <option value="VIP">VIP</option>
              </select>

              <input
                type="text"
                placeholder="₦ Price"
                className="border rounded-lg p-2"
                onChange={handlePriceChange}
                value={`₦${formatPrice(formData.price || "")}`}
                required
              />
            </div>
            <textarea
              placeholder="Description"
              className="border rounded-lg p-2 w-full mt-3"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData(initialFormState);
                  setImagePreview(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Create Event
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
     {showViewModal && selectedEvent && (
        <Modal 
          onClose={() => setShowViewModal(false)} 
          title={selectedEvent.title}
        >
          <img
            src={`${import.meta.env.VITE_BACKEND_IMAGE_URL}/${selectedEvent.image}`}
            alt={selectedEvent.title}
            className="w-full h-48 object-cover rounded-lg mb-3"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'fallback-image-url.jpg';
            }}
          />
          <div className="space-y-3 text-black">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium">Location:</span>
              <span>{selectedEvent.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
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
              <span className="font-medium">Date & Time:</span>
              <span>
                {selectedEvent.date} at {selectedEvent.time}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Ticket:</span>
              <span>
                {selectedEvent.ticketType} - ₦{formatPrice(String(selectedEvent.price || "0"))}
              </span>
            </div>
            
            <div className="mt-3">
              <p className="font-medium">Description:</p>
              <p className="text-gray-700">{selectedEvent.description}</p>
            </div>
          </div>
        </Modal>
      )}
      {/* Edit Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} >
            <h2 className="text-lg font-bold mb-4 text-black">Edit Event</h2>
          <form className="text-black">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="text"
                defaultValue={formData.title}
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                defaultValue={formData.location}
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <input
                type="date"
                defaultValue={formData.date}
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <input
                type="time"
                defaultValue={formData.time}
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
              <select
                name="ticketType"
                defaultValue={formData.ticketType}
                className="border rounded-lg p-2"
                onChange={(e) =>
                  setFormData({ ...formData, ticketType: e.target.value })
                }
                required
              >
                <option value="Free">Free</option>
                <option value="General">General</option>
                <option value="VIP">VIP</option>
              </select>
              <input
                type="text"
                placeholder="₦ Price"
                className="border rounded-lg p-2"
                onChange={handlePriceChange}
                value={`₦${formatPrice(formData.price || "")}`}
                required
              />
            </div>
            <textarea
              defaultValue={formData.description}
              className="border rounded-lg p-2 w-full mt-3"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover mt-2 rounded-lg"
                />
              )}
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
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} >
          <p className="text-black">Are you sure you want to delete this event?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-black"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await deleteEvent(deleteId);
                setShowDeleteModal(false);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* Reusable Modal Component */
function Modal({
  children,
  onClose,
  title = "", // Make title optional with default value
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string; // Make prop optional
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
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