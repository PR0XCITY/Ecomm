import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { hasPermission } from "../../services/userService";
import type { Permission } from "../../services/userService";
import { UnauthorizedPage } from "../../pages/admin/UnauthorizedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const { adminUser } = useApp();

  if (!adminUser) {
    // If not logged in as admin, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  if (permission && !hasPermission(adminUser.role, permission)) {
    // If logged in but lacks the required permission, render the Unauthorized View
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
