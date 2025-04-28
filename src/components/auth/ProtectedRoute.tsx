
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRoles 
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated, but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If specific roles are required, check if the user has any of them
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // User is authenticated but doesn't have the required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>;
};
