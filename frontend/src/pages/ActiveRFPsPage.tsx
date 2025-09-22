import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfpService, proposalService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { FileText, Search, Handshake, Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';


export default function ActiveRFPsPage() {
  const [search, setSearch] = useState('');
  const [selectedRFP, setSelectedRFP] = useState<any>(null);
  const [isProposalDialogOpen, setIsProposalDialogOpen] = useState(false);
  const [proposalItems, setProposalItems] = useState<Array<{rfpItemId: number, unitPrice: number, notes: string}>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();

  const { data: activeRFPs, isLoading } = useQuery({
    queryKey: ['active-rfps', { search }],
    queryFn: () => rfpService.getActiveRFPs(),
  });

  const createProposalMutation = useMutation({
    mutationFn: (proposalData: any) => proposalService.createProposal(proposalData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-rfps'] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      setIsProposalDialogOpen(false);
      setSelectedRFP(null);
      setProposalItems([]);
      toast.success('Teklif başarıyla gönderildi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Teklif gönderilirken bir hata oluştu');
    },
  });

  const handleCreateProposal = (rfp: any) => {
    setSelectedRFP(rfp);
    // Initialize proposal items with RFP items
    const items = rfp.items?.map((item: any) => ({
      rfpItemId: item.id,
      unitPrice: 0,
      notes: ''
    })) || [];
    setProposalItems(items);
    setErrors({});
    setIsProposalDialogOpen(true);
  };

  const handleSubmitProposal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    const validationErrors: Record<string, string> = {};
    
    // Validate each proposal item
    proposalItems.forEach((item, index) => {
      if (!item.unitPrice || item.unitPrice <= 0) {
        validationErrors[`unitPrice_${index}`] = 'Birim fiyat gerekli ve pozitif olmalı';
      }
    });
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const proposalData = {
      rfpId: selectedRFP.id,
      items: proposalItems,
      notes: formData.get('notes') as string,
    };
    createProposalMutation.mutate(proposalData);
  };

  const updateProposalItem = (index: number, field: string, value: any) => {
    const updated = [...proposalItems];
    updated[index] = { ...updated[index], [field]: value };
    setProposalItems(updated);
    
    // Clear error when user starts typing
    if (field === 'unitPrice' && errors[`unitPrice_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`unitPrice_${index}`];
      setErrors(newErrors);
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aktif RFPler</h1>
        <p className="text-muted-foreground">
          Teklif verebileceğiniz aktif RFPleri görüntüleyin
        </p>
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

      {activeRFPs?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeRFPs.map((rfp: any) => (
            <Card key={rfp.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{rfp.title}</span>
                  <Badge className="bg-green-100 text-green-800">
                    Aktif
                  </Badge>
                </CardTitle>
                <CardDescription>{rfp.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Proje:</span>
                    <span>{rfp.project?.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Başlangıç:</span>
                    <span>{formatDate(rfp.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bitiş:</span>
                    <span>{formatDate(rfp.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ürün Sayısı:</span>
                    <span>{rfp.items?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Teklif Sayısı:</span>
                    <span>{rfp.proposals?.length || 0}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/rfps/${rfp.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Detay
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCreateProposal(rfp)}
                  >
                    <Handshake className="mr-2 h-4 w-4" />
                    Teklif Ver
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
            <h3 className="text-lg font-semibold mb-2">Aktif RFP bulunamadı</h3>
            <p className="text-muted-foreground text-center">
              Şu anda teklif verebileceğiniz aktif RFP bulunmuyor.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Proposal Dialog */}
      <Dialog open={isProposalDialogOpen} onOpenChange={setIsProposalDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teklif Oluştur</DialogTitle>
            <DialogDescription>
              {selectedRFP?.title} için teklif oluşturun
            </DialogDescription>
          </DialogHeader>
          {selectedRFP && (
            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">RFP Ürünleri</h4>
                {selectedRFP.items?.map((item: any, index: number) => (
                  <div key={item.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{item.product?.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.product?.category} - Miktar: {item.quantity} {item.product?.unit}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Not: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`unitPrice-${index}`}>Birim Fiyat (₺)</Label>
                        <Input
                          id={`unitPrice-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={proposalItems[index]?.unitPrice || 0}
                          onChange={(e) => updateProposalItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className={errors[`unitPrice_${index}`] ? 'border-red-500' : ''}
                        />
                        {errors[`unitPrice_${index}`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`unitPrice_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`notes-${index}`}>Notlar</Label>
                        <Input
                          id={`notes-${index}`}
                          value={proposalItems[index]?.notes || ''}
                          onChange={(e) => updateProposalItem(index, 'notes', e.target.value)}
                          placeholder="Notlar"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Toplam: {formatCurrency((proposalItems[index]?.unitPrice || 0) * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Genel Notlar</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Teklifiniz hakkında genel notlar"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsProposalDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" disabled={createProposalMutation.isPending}>
                  {createProposalMutation.isPending ? 'Gönderiliyor...' : 'Teklif Gönder'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}