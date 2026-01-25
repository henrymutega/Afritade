import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type AccountRole = 'buyer' | 'supplier' | 'manufacturer' | 'admin';

interface UseUserRoleReturn {
  role: AccountRole | null;
  loading: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AccountRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          setRole(data?.role as AccountRole);
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRole();
    }
  }, [user, authLoading]);

  return {
    role,
    loading: loading || authLoading,
    isSeller: role === 'supplier' || role === 'manufacturer',
    isAdmin: role === 'admin',
    isBuyer: role === 'buyer',
  };
};
