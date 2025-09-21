import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfpService, productService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { FileText, Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const RFP_STATUSES = [
  { value: 'DRAFT', label: 'Taslak', color: 'bg-gray-100 text-gray-800' },
  { value: 'ACTIVE', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'CLOSED', label: 'Kapalı', color: 'bg-red-100 text-red-800' },
  { value: 'CANCELLED', label: 'İptal', color: 'bg-yellow-100 text-yellow-800' },
];

export default function RFPsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRFP, setEditingRFP] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{productId: number, quantity: number, notes: string}>>([]);
  
  const queryClient = useQueryClient();

  const { data: rfpsData, isLoading: rfpsLoading } = useQuery({
    queryKey: ['rfps', projectId, { search }],
    queryFn: () => rfpService.getRFPs(parseInt(projectId!), { search }),
    enabled: !!projectId,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', projectId],
    queryFn: () => productService.getProducts(parseInt(projectId!)),
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: (rfpData: any) => rfpService.createRFP(parseInt(projectId!), rfpData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps', projectId] });
      setIsCreateDialogOpen(false);
      setSelectedProducts([]);
      toast.success('RFP başarıyla oluşturuldu!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'RFP oluşturulurken bir hata oluştu');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ rfpId, data }: { rfpId: number; data: any }) => 
      rfpService.updateRFP(parseInt(projectId!), rfpId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps', projectId] });
      setIsEditDialogOpen(false);
      setEditingRFP(null);
      toast.success('RFP başarıyla güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'RFP güncellenirken bir hata oluştu');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ rfpId, isActive }: { rfpId: number; isActive: boolean }) => 
      rfpService.toggleRFPStatus(parseInt(projectId!), rfpId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfps', projectId] });
      toast.success('RFP durumu güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'RFP durumu güncellenirken bir hata oluştu');
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rfpData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      items: selectedProducts,
    };
    createMutation.mutate(rfpData);
  };

  const handleEdit = (rfp: any) => {
    setEditingRFP(rfp);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rfpData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };
    updateMutation.mutate({ rfpId: editingRFP.id, data: rfpData });
  };

  const handleToggle = (rfp: any) => {
    toggleMutation.mutate({ rfpId: rfp.id, isActive: !rfp.isActive });
  };

  const addProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: 0, quantity: 1, notes: '' }]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...selectedProducts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedProducts(updated);
  };

  const getStatusInfo = (status: string) => {
    return RFP_STATUSES.find(s => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (rfpsLoading || productsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">RFPler</h1>
          <p className="text-muted-foreground">
            Proje RFPlerini yönetin
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni RFP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Yeni RFP Oluştur</DialogTitle>
              <DialogDescription>
                Projeye yeni bir RFP ekleyin
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">RFP Başlığı</Label>
                  <Input id="title" name="title" required placeholder="RFP başlığını girin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input id="startDate" name="startDate" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea id="description" name="description" placeholder="RFP açıklaması" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ürünler</Label>
                  <Button type="button" onClick={addProduct} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ürün Ekle
                  </Button>
                </div>
                
                {selectedProducts.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label>Ürün</Label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateProduct(index, 'productId', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="">Ürün seçin</option>
                        {productsData?.products?.map((product: any) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Label>Miktar</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <Label>Notlar</Label>
                      <Input
                        value={item.notes}
                        onChange={(e) => updateProduct(index, 'notes', e.target.value)}
                        placeholder="Notlar"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProduct(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
            placeholder="RFP ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {rfpsData?.rfps?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rfpsData.rfps.map((rfp: any) => (
            <Card key={rfp.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{rfp.title}</span>
                  <Badge className={getStatusInfo(rfp.status).color}>
                    {getStatusInfo(rfp.status).label}
                  </Badge>
                </CardTitle>
                <CardDescription>{rfp.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Başlangıç:</span>
                    <span>{formatDate(rfp.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bitiş:</span>
                    <span>{formatDate(rfp.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Durum:</span>
                    <span className={rfp.isActive ? 'text-green-600' : 'text-gray-600'}>
                      {rfp.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ürün Sayısı:</span>
                    <span>{rfp.items?.length || 0}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/projects/${projectId}/rfps/${rfp.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Görüntüle
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggle(rfp)}
                    disabled={toggleMutation.isPending}
                  >
                    {rfp.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(rfp)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz RFP yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              İlk RFP'nizi oluşturmak için aşağıdaki butona tıklayın
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni RFP Oluştur
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>RFP'yi Düzenle</DialogTitle>
            <DialogDescription>
              RFP bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          {editingRFP && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">RFP Başlığı</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  required 
                  defaultValue={editingRFP.title}
                  placeholder="RFP başlığını girin" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Açıklama</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  defaultValue={editingRFP.description}
                  placeholder="RFP açıklaması" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Başlangıç Tarihi</Label>
                  <Input 
                    id="edit-startDate" 
                    name="startDate" 
                    type="date" 
                    required 
                    defaultValue={editingRFP.startDate?.split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Bitiş Tarihi</Label>
                  <Input 
                    id="edit-endDate" 
                    name="endDate" 
                    type="date" 
                    required 
                    defaultValue={editingRFP.endDate?.split('T')[0]}
                  />
                </div>
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