// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'buyer' | 'supplier' | 'manufacturer' | 'admin'>;
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();

  // Show loading while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    // Check if user has any of the allowed roles
    const hasAllowedRole = role && allowedRoles.includes(role);
    
    if (!hasAllowedRole) {
      // If seller/manufacturer trying to access buyer route or vice versa
      if (role === 'supplier' || role === 'manufacturer') {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};