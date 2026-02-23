import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type AccountRole = 'buyer' | 'supplier' | 'manufacturer' | 'admin';

interface UseUserRoleReturn {
  role: AccountRole | null;
  loading: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
  refreshRole: () => Promise<void>;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { user } = useAuth();
  const [role, setRole] = useState<AccountRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async () => {
    if (!user?.id) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } else {
        setRole((data?.role as AccountRole) ?? 'buyer');
      }
    } catch (err) {
      console.error('Unexpected role fetch error:', err);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen to auth state changes to refetch role when user changes
  useEffect(() => {
    let isMounted = true;

    const handleAuthChange = async () => {
      if (!isMounted) return;
      
      if (user?.id) {
        await fetchRole();
      } else {
        setRole(null);
        setLoading(false);
      }
    };

    handleAuthChange();

    // Set up subscription for real-time role changes
    const subscription = supabase
      .channel('user_roles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          if (isMounted && user?.id) {
            fetchRole();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user?.id]);

  return {
    role,
    loading,
    isSeller: role === 'supplier' || role === 'manufacturer',
    isAdmin: role === 'admin',
    isBuyer: role === 'buyer',
    refreshRole: fetchRole,
  };
};