import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { 
  Package, ShoppingCart, MessageSquare, DollarSign,
  Plus, TrendingUp, Eye
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalInquiries: number;
  totalRevenue: number;
  productViews: number;
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isSeller, loading: roleLoading } = useUserRole();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    productViews: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate('/signin');
        return;
      }
      if (!isSeller) {
        navigate('/');
        return;
      }
      fetchDashboardData();
    }
  }, [user, authLoading, roleLoading, isSeller, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user.id);

      // Fetch total views
      const { data: viewsData } = await supabase
        .from('products')
        .select('views_count')
        .eq('supplier_id', user.id);
      
      const totalViews = viewsData?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;

      // Fetch orders
      const { data: ordersData, count: ordersCount } = await supabase
        .from('orders')
        .select('*, profiles!orders_buyer_id_fkey(company_name, first_name, last_name)', { count: 'exact' })
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate revenue
      const totalRevenue = ordersData?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

      // Fetch inquiries count
      const { count: inquiriesCount } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('supplier_id', user.id);

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalInquiries: inquiriesCount || 0,
        totalRevenue,
        productViews: totalViews,
      });

      setRecentOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Button onClick={() => navigate('/dashboard/products/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          iconColor="text-primary"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Product Views"
          value={stats.productViews.toLocaleString()}
          icon={Eye}
          iconColor="text-green-500"
        />
      </div>

      {/* Revenue Card */}
      <div className="bg-card rounded-xl border border-border p-6 card-shadow mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Total Revenue</h2>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-4xl font-bold text-foreground">
          KES {stats.totalRevenue.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          From {stats.totalOrders} orders
        </p>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/orders')}>
            View All
          </Button>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <RecentOrdersTable orders={recentOrders} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
