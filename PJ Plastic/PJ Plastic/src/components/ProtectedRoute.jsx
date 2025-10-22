import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage:
// <ProtectedRoute roles={["ADMIN"]}><AdminDashboard/></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0) {
    const userRole = (currentUser?.role || '').toUpperCase();
    const isAdmin = !!currentUser?.isAdmin;
    const rolesUpper = roles.map(r => r.toUpperCase());
    const permitted = rolesUpper.includes(userRole) || (isAdmin && rolesUpper.includes('ADMIN'));
    if (!permitted) return <Navigate to="/" replace />;
  }

  return children;
}
