import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { PATHS } from "./paths";

/** Keeps signed-in admins away from the login page. */
export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    if (status === "unknown") void checkSession();
  }, [status, checkSession]);

  if (status === "unknown" || status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (status === "authenticated") return <Navigate to={PATHS.dashboard} replace />;
  return <>{children}</>;
}
