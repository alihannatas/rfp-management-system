import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Package, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PRODUCT_CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Elektronik' },
  { value: 'SOFTWARE', label: 'Yazılım' },
  { value: 'HARDWARE', label: 'Donanım' },
  { value: 'SERVICES', label: 'Hizmetler' },
  { value: 'CONSULTING', label: 'Danışmanlık' },
  { value: 'MAINTENANCE', label: 'Bakım' },
  { value: 'OTHER', label: 'Diğer' },
];

export default function ProductsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', projectId, { search }],
    queryFn: () => productService.getProducts(parseInt(projectId!), { search }),
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: (productData: any) => productService.createProduct(parseInt(projectId!), productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', projectId] });
      setIsCreateDialogOpen(false);
      toast.success('Ürün başarıyla oluşturuldu!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ürün oluşturulurken bir hata oluştu');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: any }) => 
      productService.updateProduct(parseInt(projectId!), productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', projectId] });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      toast.success('Ürün başarıyla güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ürün güncellenirken bir hata oluştu');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: number) => productService.deleteProduct(parseInt(projectId!), productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', projectId] });
      toast.success('Ürün başarıyla silindi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ürün silinirken bir hata oluştu');
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
    };
    createMutation.mutate(productData);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
    };
    updateMutation.mutate({ productId: editingProduct.id, data: productData });
  };

  const handleDelete = (productId: number) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(productId);
    }
  };

  const getCategoryLabel = (category: string) => {
    return PRODUCT_CATEGORIES.find(cat => cat.value === category)?.label || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ürünler</h1>
          <p className="text-muted-foreground">
            Proje ürünlerini yönetin
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ürün
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Ürün Oluştur</DialogTitle>
              <DialogDescription>
                Projeye yeni bir ürün ekleyin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ürün Adı</Label>
                <Input id="name" name="name" required placeholder="Ürün adını girin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea id="description" name="description" placeholder="Ürün açıklaması" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Birim</Label>
                <Input id="unit" name="unit" placeholder="adet, kg, m², vb." />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Oluşturuluyor...' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ürün ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {data?.products?.length ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ürün Adı</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Birim</TableHead>
                <TableHead>Oluşturulma</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getCategoryLabel(product.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.unit || '-'}</TableCell>
                  <TableCell>{formatDate(product.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz ürün yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              İlk ürününüzü oluşturmak için aşağıdaki butona tıklayın
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ürün Oluştur
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünü Düzenle</DialogTitle>
            <DialogDescription>
              Ürün bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Ürün Adı</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  required 
                  defaultValue={editingProduct.name}
                  placeholder="Ürün adını girin" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Açıklama</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  defaultValue={editingProduct.description}
                  placeholder="Ürün açıklaması" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori</Label>
                <Select name="category" required defaultValue={editingProduct.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Birim</Label>
                <Input 
                  id="edit-unit" 
                  name="unit" 
                  defaultValue={editingProduct.unit}
                  placeholder="adet, kg, m², vb." 
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Güncelleniyor...' : 'Güncelle'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}