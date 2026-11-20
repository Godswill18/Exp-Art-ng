import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CreditCardIcon,
  CalendarIcon,
  PhotoIcon,
  ArrowRightEndOnRectangleIcon,
  XMarkIcon,
  ListBulletIcon,
  UserCircleIcon,
  
  
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { PATHS } from "@/routes/paths";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const logoutAdmin = useAuthStore((state) => state.logoutAdmin);

  const handleLogout = async () => {
    const response = await logoutAdmin();
    if (!response.success) {
      toast.error(response.message, { position: "top-center" });
    }
    // The local session is always cleared, so leave the admin area either way.
    navigate(PATHS.login, { replace: true });
  };

  const navItems = [
    { name: "Dashboard", path: PATHS.dashboard, icon: HomeIcon },
    { name: "Transactions", path: PATHS.transactions, icon: CreditCardIcon },
    { name: "Contacts", path: PATHS.messages, icon: UserCircleIcon },
    { name: "Events", path: PATHS.events, icon: CalendarIcon },
    { name: "Gallery", path: PATHS.gallery, icon: PhotoIcon },
    { name: "Flow Of Events", path: PATHS.flowOfEvents, icon: ListBulletIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white shadow-lg min-h-screen flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">EXP ART</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-red-600 hover:bg-red-100"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      <div
        className={`fixed inset-0 z-50 flex lg:hidden transition-all duration-300 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? "bg-opacity-50" : "bg-opacity-0"
          }`}
          onClick={onClose}
        ></div>

        {/* Drawer */}
        <div
          className={`relative w-64 bg-white shadow-lg flex flex-col min-h-screen z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {/* <h1 className="text-xl font-bold text-blue-600">My App</h1> */}
            <button onClick={onClose}>
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ name, path, icon: Icon }) => (
              <NavLink
                key={name}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-red-600 hover:bg-red-100"
            >
              <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
