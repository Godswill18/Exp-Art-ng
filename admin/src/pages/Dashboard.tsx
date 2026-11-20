import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, Image as ImageIcon, Mail, CreditCard } from "lucide-react";
import { useEventStore } from "@/stores/useEventStore";
import { useGalleryStore } from "@/stores/useGalleryStore";
import { useContactStore } from "@/stores/useContactStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { PATHS } from "@/routes/paths";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

/**
 * Only figures that come from real API responses are shown here.
 * Revenue / transaction / user-growth figures are intentionally NOT displayed:
 * the backend does not expose endpoints for them yet (see ../docs/BACKEND_REQUIREMENTS.md).
 */
export default function Dashboard() {
  useDocumentTitle("Dashboard");
  const user = useAuthStore((s) => s.user);
  const { events, loading: eventsLoading, error: eventsError, fetchEvents } = useEventStore();
  const { gallery, loading: galleryLoading, error: galleryError, fetchGallery } = useGalleryStore();
  const { message: contacts, loading: contactsLoading, error: contactsError, fetchMessages } =
    useContactStore();

  useEffect(() => {
    void fetchEvents();
    void fetchGallery();
    void fetchMessages();
  }, [fetchEvents, fetchGallery, fetchMessages]);

  const activeEvents = events.filter((e) => e.isActive !== false).length;
  const unread = contacts.filter((c) => c.isRead === false).length;

  return (
    <div className="sm:p-6 lg:p-8 max-w-8xl mx-auto">
      {user?.email && <p className="text-sm text-gray-300 mb-4">Signed in as {user.email}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />}
          bgColor="bg-amber-100"
          title="Events"
          loading={eventsLoading}
          error={eventsError}
          value={events.length}
          detail={`${activeEvents} active`}
          to={PATHS.events}
        />
        <MetricCard
          icon={<ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />}
          bgColor="bg-indigo-100"
          title="Gallery items"
          loading={galleryLoading}
          error={galleryError}
          value={gallery.length}
          to={PATHS.gallery}
        />
        <MetricCard
          icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />}
          bgColor="bg-blue-100"
          title="Contact messages"
          loading={contactsLoading}
          error={contactsError}
          value={contacts.length}
          detail={contacts.some((c) => c.isRead !== undefined) ? `${unread} unread` : undefined}
          to={PATHS.messages}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-start gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          <CreditCard className="w-6 h-6 text-gray-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue and transactions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Not configured yet. Payment and ticket-sales reporting will appear here once the backend
            provides this data. No figures are shown until then.
          </p>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  bgColor: string;
  loading: boolean;
  error: string | null;
  detail?: string;
  to: string;
}

function MetricCard({ icon, title, value, bgColor, loading, error, detail, to }: MetricCardProps) {
  return (
    <Link
      to={to}
      className="bg-white rounded-lg shadow-sm p-4 sm:p-5 border border-gray-200 flex items-center hover:shadow-md transition-shadow"
    >
      <div className={`p-2 sm:p-3 ${bgColor} rounded-lg`}>{icon}</div>
      <div className="ml-3 sm:ml-4">
        <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <p className="text-sm text-gray-400 animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Unavailable</p>
        ) : (
          <>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">{value}</p>
            {detail && <p className="text-xs text-gray-500">{detail}</p>}
          </>
        )}
      </div>
    </Link>
  );
}
