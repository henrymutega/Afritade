import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  min_order_quantity: z.coerce.number().int().positive('MOQ must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  sample_available: z.boolean(),
  customization_available: z.boolean(),
  stock_quantity: z.coerce.number().int().min(0),
  category_id: z.string().optional(),
  lead_time: z.string().optional(),
  shipping_info: z.string().optional(),
  sample_price: z.coerce.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Partial<ProductFormData> & { id?: string };
}

export const ProductForm = ({ onSuccess, initialData }: ProductFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      min_order_quantity: initialData?.min_order_quantity || 1,
      unit: initialData?.unit || 'piece',
      category_id: initialData?.category_id || '',
      lead_time: initialData?.lead_time || '',
      shipping_info: initialData?.shipping_info || '',
      sample_available: initialData?.sample_available || false,
      sample_price: initialData?.sample_price || 0,
      customization_available: initialData?.customization_available || false,
      stock_quantity: initialData?.stock_quantity || 0,
    },
  });

  // Fetch categories on mount
  useState(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('product_categories')
        .select('id, name')
        .order('name');
      if (data) setCategories(data);
    };
    fetchCategories();
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    
    setImageFiles([...imageFiles, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    try {
      let productId = initialData?.id;

      if (productId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: data.name,
            description: data.description,
            price: data.price,
            min_order_quantity: data.min_order_quantity,
            unit: data.unit,
            category_id: data.category_id || null,
            lead_time: data.lead_time || null,
            shipping_info: data.shipping_info || null,
            sample_available: data.sample_available,
            sample_price: data.sample_price || null,
            customization_available: data.customization_available,
            stock_quantity: data.stock_quantity,
          })
          .eq('id', productId);
        
        if (error) throw error;
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert({
            name: data.name,
            description: data.description,
            price: data.price,
            min_order_quantity: data.min_order_quantity,
            unit: data.unit,
            category_id: data.category_id || null,
            lead_time: data.lead_time || null,
            shipping_info: data.shipping_info || null,
            sample_available: data.sample_available,
            sample_price: data.sample_price || null,
            customization_available: data.customization_available,
            stock_quantity: data.stock_quantity,
            supplier_id: user.id,
          })
          .select('id')
          .single();
        
        if (error) throw error;
        productId = newProduct.id;
      }

      // Upload images
      if (imageFiles.length > 0 && productId) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const fileExt = file.name.split('.').pop();
          const filePath = `${user.id}/${productId}/${Date.now()}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          await supabase.from('product_images').insert({
            product_id: productId,
            image_url: publicUrl,
            is_primary: i === 0,
            sort_order: i,
          });
        }
      }

      toast.success(initialData?.id ? 'Product updated!' : 'Product created!');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Premium Organic Coffee Beans" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your product in detail..."
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (KES) *</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_order_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Order Qty *</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="kg">Kilogram</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="carton">Carton</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="stock_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lead_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 7-14 days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shipping_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Information</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Shipping methods, delivery areas, etc."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-6">
          <FormField
            control={form.control}
            name="sample_available"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Samples Available</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customization_available"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Customization Available</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {form.watch('sample_available') && (
          <FormField
            control={form.control}
            name="sample_price"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Sample Price (KES)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Image Upload */}
        <div>
          <Label>Product Images (Max 5)</Label>
          <div className="mt-2 flex flex-wrap gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {imagePreviews.length < 5 && (
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData?.id ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
