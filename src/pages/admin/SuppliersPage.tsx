import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserCheck, UserX, ExternalLink, Package } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  verification_status: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
  role: 'supplier' | 'manufacturer';
  products_count: number;
}

const SuppliersPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    } else if (!roleLoading && !isAdmin) {
      navigate('/');
    }
  }, [user, authLoading, isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSuppliers();
    }
  }, [user, isAdmin]);

  const fetchSuppliers = async () => {
    try {
      // Fetch seller roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['supplier', 'manufacturer']);

      const sellerUserIds = rolesData?.map(r => r.user_id) || [];
      const rolesMap = new Map(rolesData?.map(r => [r.user_id, r.role as 'supplier' | 'manufacturer']) || []);

      // Fetch profiles for sellers
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', sellerUserIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch product counts for each supplier
      const { data: productsData } = await supabase
        .from('products')
        .select('supplier_id')
        .in('supplier_id', sellerUserIds);

      const productCounts = new Map<string, number>();
      productsData?.forEach(p => {
        productCounts.set(p.supplier_id, (productCounts.get(p.supplier_id) || 0) + 1);
      });

      const suppliersWithData: Supplier[] = (profilesData || []).map(profile => ({
        ...profile,
        role: rolesMap.get(profile.user_id) || 'supplier',
        products_count: productCounts.get(profile.user_id) || 0,
      }));

      setSuppliers(suppliersWithData);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load suppliers',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (userId: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: status })
        .eq('user_id', userId);

      if (error) throw error;

      setSuppliers(prev =>
        prev.map(s =>
          s.user_id === userId ? { ...s, verification_status: status } : s
        )
      );

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: status === 'verified' ? 'verify_supplier' : 'reject_supplier',
        entity_type: 'user',
        entity_id: userId,
        details: { new_status: status },
      });

      toast({
        title: 'Success',
        description: `Supplier ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
      });
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerificationBadge = (status: string | null) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (authLoading || roleLoading) {
    return (
      <DashboardLayout title="Supplier Management">
        <Skeleton className="h-96" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Supplier Management">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Total Sellers</p>
            <p className="text-2xl font-bold text-foreground">{suppliers.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Suppliers</p>
            <p className="text-2xl font-bold text-foreground">
              {suppliers.filter(s => s.role === 'supplier').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Manufacturers</p>
            <p className="text-2xl font-bold text-foreground">
              {suppliers.filter(s => s.role === 'manufacturer').length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {suppliers.filter(s => s.verification_status === 'verified').length}
            </p>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No suppliers found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map(supplier => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {supplier.company_name || 'No Company Name'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {supplier.first_name || supplier.last_name
                            ? `${supplier.first_name || ''} ${supplier.last_name || ''}`.trim()
                            : 'Unnamed'}
                        </p>
                        <p className="text-xs text-muted-foreground">{supplier.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {supplier.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {supplier.city && supplier.country
                        ? `${supplier.city}, ${supplier.country}`
                        : supplier.country || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        {supplier.products_count}
                      </div>
                    </TableCell>
                    <TableCell>{getVerificationBadge(supplier.verification_status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(supplier.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {supplier.verification_status !== 'verified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVerificationStatus(supplier.user_id, 'verified')}
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        {supplier.verification_status === 'verified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVerificationStatus(supplier.user_id, 'rejected')}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/supplier/${supplier.user_id}`)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuppliersPage;
