import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = sessionStorage.getItem("token");

  // If already logged in, send them to dashboard
  if (isAuthenticated && token) {
    return <Navigate to="/nowhere-home/dashboard" replace />;
  }

  return <>{children}</>;
}
