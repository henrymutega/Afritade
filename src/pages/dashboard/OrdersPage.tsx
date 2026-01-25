import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  currency: string | null;
  status: OrderStatus | null;
  created_at: string;
  profiles: {
    company_name: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
  products: {
    name: string;
  } | null;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch related profiles and products
      const buyerIds = [...new Set((ordersData || []).map(o => o.buyer_id))];
      const productIds = [...new Set((ordersData || []).map(o => o.product_id))];

      const [profilesRes, productsRes] = await Promise.all([
        buyerIds.length > 0 
          ? supabase.from('profiles').select('user_id, company_name, first_name, last_name, email').in('user_id', buyerIds)
          : { data: [] },
        productIds.length > 0 
          ? supabase.from('products').select('id, name').in('id', productIds)
          : { data: [] }
      ]);

      const profilesMap = new Map((profilesRes.data || []).map(p => [p.user_id, p]));
      const productsMap = new Map((productsRes.data || []).map(p => [p.id, p]));

      const enrichedOrders = (ordersData || []).map(order => ({
        ...order,
        profiles: profilesMap.get(order.buyer_id) || null,
        products: productsMap.get(order.product_id) || null
      }));

      setOrders(enrichedOrders as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      toast.success('Order status updated');
    } catch (error: any) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <DashboardLayout title="Orders">
      <p className="text-muted-foreground mb-6">
        Manage and track your orders
      </p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.products?.name || '-'}</TableCell>
                  <TableCell>
                    {order.profiles?.company_name || 
                     `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim() || 
                     order.profiles?.email || 'Unknown'}
                  </TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {order.currency} {order.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || 'bg-muted'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
