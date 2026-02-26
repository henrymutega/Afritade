import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'buyer' | 'supplier' | 'manufacturer' | 'admin'>;
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (authLoading || roleLoading) {
        if (import.meta.env.MODE === 'development'){
          console.log('Loading timeout reached');
        }
        setTimeoutReached(true);
      }
    }, 5000); 

    return () => clearTimeout(timer);
  }, [authLoading, roleLoading, user, role]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {timeoutReached ? 'Taking longer than expected...' : 'Loading...'}
        </p>
        {timeoutReached && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Reload Page
          </button>
        )}
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = role && allowedRoles.includes(role);
    
    if (!hasAllowedRole) {
      if (role === 'supplier' || role === 'manufacturer') {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }
  
  return <>{children}</>;
};