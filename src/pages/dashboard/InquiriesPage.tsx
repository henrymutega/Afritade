import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Inquiry {
  id: string;
  subject: string;
  message: string;
  quantity_needed: number | null;
  is_read: boolean | null;
  created_at: string;
  buyer_id: string;
  product_id: string | null;
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

const InquiriesPage = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInquiries();
    }
  }, [user]);

  const fetchInquiries = async () => {
    if (!user) return;
    
    try {
      const { data: inquiriesData, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('supplier_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch related profiles and products
      const buyerIds = [...new Set((inquiriesData || []).map(i => i.buyer_id))];
      const productIds = [...new Set((inquiriesData || []).filter(i => i.product_id).map(i => i.product_id!))];

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

      const enrichedInquiries = (inquiriesData || []).map(inquiry => ({
        ...inquiry,
        profiles: profilesMap.get(inquiry.buyer_id) || null,
        products: inquiry.product_id ? productsMap.get(inquiry.product_id) || null : null
      }));

      setInquiries(enrichedInquiries as Inquiry[]);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ is_read: true })
        .eq('id', inquiryId);

      if (error) throw error;
      
      setInquiries(inquiries.map(i => 
        i.id === inquiryId ? { ...i, is_read: true } : i
      ));
    } catch (error: any) {
      toast.error('Failed to mark as read');
    }
  };

  const unreadCount = inquiries.filter(i => !i.is_read).length;

  return (
    <DashboardLayout title="Inquiries">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Buyer inquiries and quote requests
        </p>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount} unread</Badge>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No inquiries yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-6 ${!inquiry.is_read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {inquiry.subject}
                      </h3>
                      {!inquiry.is_read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      From: {inquiry.profiles?.company_name || 
                        `${inquiry.profiles?.first_name || ''} ${inquiry.profiles?.last_name || ''}`.trim() || 
                        inquiry.profiles?.email}
                    </p>
                    {inquiry.products?.name && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Product: {inquiry.products.name}
                      </p>
                    )}
                    {inquiry.quantity_needed && (
                      <p className="text-sm text-muted-foreground mb-2">
                        Quantity needed: {inquiry.quantity_needed}
                      </p>
                    )}
                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                      {inquiry.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(inquiry.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                    {!inquiry.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(inquiry.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InquiriesPage;
