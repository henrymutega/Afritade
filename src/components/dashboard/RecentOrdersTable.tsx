import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

interface RecentOrdersTableProps {
  orders: Order[];
  showBuyer?: boolean;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const RecentOrdersTable = ({ orders, showBuyer = true }: RecentOrdersTableProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          {showBuyer && <TableHead>Buyer</TableHead>}
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_number}</TableCell>
            {showBuyer && (
              <TableCell>
                {order.profiles?.company_name || 
                 `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim() || 
                 'Unknown'}
              </TableCell>
            )}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
