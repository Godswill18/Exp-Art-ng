import { Suspense, lazy, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import AdminSidebar from "./components/AdminSidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transaction";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import AdminNavbar from "./components/AdminNavbar";
import AdminLayout from "./pages/AdminLayout";
import { ProtectedRoute } from "@/routes"; // Now from separate file
import PublicRoute from "./routes/PublicRoute";
import EventFlow from "./pages/FlowOfEvents";
import AdminContacts from "./pages/AdminContact";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const ArtTours = lazy(() => import("./pages/ArtTours"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Navbar = lazy(() => import("./components/Navbar"));
const CustomCursor = lazy(() => import("./components/CustomCursor"));
const Preloader = lazy(() => import("./components/Preloader"));
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));

const queryClient = new QueryClient();

// function ProtectedRoute({ children, isAuthenticated }) {
//   return isAuthenticated ? children : <Navigate to="/nowhere-home/take-me-in" replace />;
// }

function LayoutWrapper({ children }) {
  const location = useLocation();
   const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/nowhere-home");

  return (
      <div
      className={`relative min-h-screen ${
        isAdminRoute ? "bg-white cursor-default" : ""
      }`}
    >
      {/* Only show custom cursor on non-admin routes */}
      {!isAdminRoute && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}

      <Suspense fallback={<div className="h-20 bg-background" />}>
        {isAdminRoute ? (
          ""
        ) : (
          <Navbar />
        )}
      </Suspense>

      {children}

      {/* Only show WhatsApp button on non-admin routes */}
      {!isAdminRoute && (
        <Suspense fallback={null}>
          <WhatsAppButton />
        </Suspense>
      )}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/nowhere-home");
  const [isLoading, setIsLoading] = useState(true);
  // const isAuthenticated = true; // Replace with real auth
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  

  // Skip preloader on admin routes
  if (!isAdminRoute && isLoading) {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <Preloader onComplete={handlePreloaderComplete} />
      </Suspense>
    );
  }

  return (
    <LayoutWrapper>
      <main>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="animate-pulse text-primary text-xl">Loading...</div>
            </div>
          }
        >
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/art-tours" element={<ArtTours />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Auth */}
            <Route path="/nowhere-home/take-me-in" element={
              <PublicRoute>
                
                <Login />
              </PublicRoute>
              } />
            <Route path="/nowhere-home/try-to-know-me" element={
              <PublicRoute>

                <Signup />
              </PublicRoute>
              } />

            {/* Admin Dashboard */}
          <Route
            path="/nowhere-home/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <main className="flex-1 p-4">
                    <div className="p-4">
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="events" element={<Events />} />
                        <Route path="gallery" element={<Gallery />} />
                        <Route path="flow_of_events" element={<EventFlow />} />
                        <Route path="admin_contact" element={<AdminContacts />} />
                        <Route path="" element={<Navigate to="dashboard" />} />
                      </Routes>
                    </div>
                  </main>
                </AdminLayout>
              </ProtectedRoute>
            }
          />



            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </LayoutWrapper>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
