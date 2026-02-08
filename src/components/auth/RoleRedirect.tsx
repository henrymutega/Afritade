import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Loader2 } from 'lucide-react';

export const RoleRedirect = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/signin');
        return;
      }

      // Redirect based on role
      switch (role) {
        case 'supplier':
        case 'manufacturer':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'buyer':
        default:
          navigate('/');
          break;
      }
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return null;
};