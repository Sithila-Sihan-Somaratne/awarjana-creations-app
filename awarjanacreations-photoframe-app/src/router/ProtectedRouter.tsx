// src/router/ProtectedRouter.tsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

type Props = {
  // If omitted, any authenticated user is allowed.
  allowedRoles?: string[]; // e.g. ["admin"], ["worker"], ["customer"]
  // Optionally, you can pass a fallback path
  fallbackPath?: string;
};

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, fallbackPath = "/" }) => {
  const { user, profile, loading } = useAuth();

  // while resolving auth/profile, return null or a spinner (so UI doesn't flash)
  if (loading) return null; // or return <Spinner /> if you have one

  if (!user) {
    // not authenticated
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = profile?.role ?? null;
    if (!userRole || !allowedRoles.includes(userRole)) {
      // authenticated but unauthorized
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // authorized
  return <Outlet />;
};

export default ProtectedRoute;
