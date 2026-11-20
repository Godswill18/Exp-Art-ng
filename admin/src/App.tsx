import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";
import { PATHS } from "@/routes/paths";
import Login from "@/pages/Login";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const Events = lazy(() => import("@/pages/Events"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const FlowOfEvents = lazy(() => import("@/pages/FlowOfEvents"));
const Messages = lazy(() => import("@/pages/Messages"));

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <a href={PATHS.dashboard} className="text-blue-400 hover:underline">
        Back to dashboard
      </a>
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Suspense fallback={<div className="animate-pulse p-6">Loading...</div>}>{children}</Suspense>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Navigate to={PATHS.dashboard} replace />} />
        <Route
          path={PATHS.login}
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route path={PATHS.dashboard} element={<Protected><Dashboard /></Protected>} />
        <Route path={PATHS.transactions} element={<Protected><Transactions /></Protected>} />
        <Route path={PATHS.events} element={<Protected><Events /></Protected>} />
        <Route path={PATHS.gallery} element={<Protected><Gallery /></Protected>} />
        <Route path={PATHS.flowOfEvents} element={<Protected><FlowOfEvents /></Protected>} />
        <Route path={PATHS.messages} element={<Protected><Messages /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
