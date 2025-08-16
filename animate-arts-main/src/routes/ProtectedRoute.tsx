// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Destructure separately so Zustand subscriptions are stable
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
   const token = sessionStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-xl">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/nowhere-home/take-me-in" replace />;
  }

  return <>{children}</>;
}
