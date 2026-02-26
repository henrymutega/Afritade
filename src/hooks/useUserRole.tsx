import { useAuth } from './useAuth';

type AccountRole = 'buyer' | 'supplier' | 'manufacturer' | 'admin';

interface UseUserRoleReturn {
  role: AccountRole | null;
  loading: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
}

export const useUserRole = (): UseUserRoleReturn => {
  const { profile, profileLoading } = useAuth();

  const role = profile?.role ?? null;

  return {
    role,
    loading: profileLoading,
    isSeller: role === 'supplier' || role === 'manufacturer',
    isAdmin: role === 'admin',
    isBuyer: role === 'buyer',
  };
};