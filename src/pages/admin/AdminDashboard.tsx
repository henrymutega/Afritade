import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Package, Store, ShoppingCart, DollarSign, Activity } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string;
  profiles?: {
    company_name: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    } else if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [user, authLoading, isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchDashboardData();
    }
  }, [user, isAdmin]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user counts by role
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role');

      const buyers = rolesData?.filter(r => r.role === 'buyer').length || 0;
      const sellers = rolesData?.filter(r => r.role === 'supplier' || r.role === 'manufacturer').length || 0;

      // Fetch total products
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders with buyer profiles
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, buyer_id, total_amount, currency, status, created_at')
        .order('created_at', { ascending: false });

      // Fetch profiles for orders
      const buyerIds = [...new Set(ordersData?.map(o => o.buyer_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, company_name, first_name, last_name')
        .in('user_id', buyerIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      const ordersWithProfiles = (ordersData || []).map(order => ({
        ...order,
        currency: order.currency || 'KES',
        status: order.status || 'pending',
        profiles: profilesMap.get(order.buyer_id) || undefined,
      }));

      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      setStats({
        totalUsers: rolesData?.length || 0,
        totalBuyers: buyers,
        totalSellers: sellers,
        totalProducts: productsCount || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
      });

      setRecentOrders(ordersWithProfiles.slice(0, 10));
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <DashboardLayout title="Admin Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={loading ? '...' : stats.totalUsers.toString()}
            icon={Users}
            trend={{ value: stats.totalBuyers, label: 'buyers' }}
          />
          <StatsCard
            title="Sellers"
            value={loading ? '...' : stats.totalSellers.toString()}
            icon={Store}
            description="Suppliers & Manufacturers"
          />
          <StatsCard
            title="Total Products"
            value={loading ? '...' : stats.totalProducts.toString()}
            icon={Package}
          />
          <StatsCard
            title="Total Orders"
            value={loading ? '...' : stats.totalOrders.toString()}
            icon={ShoppingCart}
          />
          <StatsCard
            title="Total Revenue"
            value={loading ? '...' : `KES ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
          <StatsCard
            title="Platform Activity"
            value="Active"
            icon={Activity}
            description="System healthy"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-sm text-primary hover:underline"
            >
              View All
            </button>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <RecentOrdersTable orders={recentOrders} showBuyer />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
