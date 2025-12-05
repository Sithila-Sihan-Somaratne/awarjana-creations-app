// src/router/ProtectedRouter.tsx
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

// If you want a visible spinner while checking auth, uncomment the import below.
// import { Spinner } from "../components/ui/spinner";

type Props = {
  allowedRoles?: string[];
  fallbackPath?: string;
};

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, fallbackPath = "/" }) => {
  const { user, profile, loading } = useAuth();

  // while resolving auth/profile, return null or spinner (so UI doesn't flash)
  if (loading) {
    // return <Spinner />; // <-- uncomment if you want a spinner component shown
    return null;
  }

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
