import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { PATHS } from "./paths";

/**
 * UI-level guard only. Every admin API call is independently authorised by the
 * backend; this just avoids rendering admin screens for signed-out users and
 * prevents content flashing before the session is verified.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const checkSession = useAuthStore((s) => s.checkSession);
  const location = useLocation();

  useEffect(() => {
    if (status === "unknown") void checkSession();
  }, [status, checkSession]);

  if (status === "unknown" || status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status">
        <div className="animate-pulse text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to={PATHS.login} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
