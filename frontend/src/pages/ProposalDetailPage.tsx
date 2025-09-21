import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proposalService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowLeft, FileText, Calendar, Package, User, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';

const PROPOSAL_STATUSES = [
  { value: 'PENDING', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ACCEPTED', label: 'Kabul Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  { value: 'WITHDRAWN', label: 'Geri Çekildi', color: 'bg-gray-100 text-gray-800' },
];

export default function ProposalDetailPage() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: proposal, isLoading } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => {
      if (user?.role === 'CUSTOMER') {
        return proposalService.getProposalForCustomer(parseInt(proposalId!));
      } else {
        return proposalService.getProposal(parseInt(proposalId!));
      }
    },
    enabled: !!proposalId,
  });

  const withdrawMutation = useMutation({
    mutationFn: () => proposalService.withdrawProposal(parseInt(proposalId!)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Teklif başarıyla geri çekildi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Teklif geri çekilirken bir hata oluştu');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => proposalService.updateProposalStatusByCustomer(parseInt(proposalId!), 'ACCEPTED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Teklif başarıyla kabul edildi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Teklif kabul edilirken bir hata oluştu');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => proposalService.updateProposalStatusByCustomer(parseInt(proposalId!), 'REJECTED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal', proposalId] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Teklif reddedildi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Teklif reddedilirken bir hata oluştu');
    },
  });

  const handleWithdraw = () => {
    if (withdrawMutation.isPending) return;
    if (confirm('Bu teklifi geri çekmek istediğinizden emin misiniz?')) {
      withdrawMutation.mutate();
    }
  };

  const handleAccept = () => {
    if (acceptMutation.isPending) return;
    if (confirm('Bu teklifi kabul etmek istediğinizden emin misiniz?')) {
      acceptMutation.mutate();
    }
  };

  const handleReject = () => {
    if (rejectMutation.isPending) return;
    if (confirm('Bu teklifi reddetmek istediğinizden emin misiniz?')) {
      rejectMutation.mutate();
    }
  };

  const getStatusInfo = (status: string) => {
    return PROPOSAL_STATUSES.find(s => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const canWithdraw = (status: string) => {
    return status === 'PENDING';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Teklif bulunamadı</h2>
        <Button asChild>
          <Link to="/proposals">Tekliflere Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/proposals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Teklif Detayı</h1>
          <p className="text-muted-foreground">
            {proposal.rfp?.title || 'Bilinmeyen RFP'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusInfo(proposal.status).color}>
            {getStatusInfo(proposal.status).label}
          </Badge>
          {user?.role === 'SUPPLIER' && canWithdraw(proposal.status) && (
            <Button
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending}
              variant="destructive"
            >
              {withdrawMutation.isPending ? 'Geri Çekiliyor...' : 'Teklifi Geri Çek'}
            </Button>
          )}
          {user?.role === 'CUSTOMER' && proposal.status === 'PENDING' && (
            <>
              <Button
                onClick={handleAccept}
                disabled={acceptMutation.isPending}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                {acceptMutation.isPending ? 'Kabul Ediliyor...' : 'Kabul Et'}
              </Button>
              <Button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                variant="destructive"
              >
                {rejectMutation.isPending ? 'Reddediliyor...' : 'Reddet'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>RFP Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">{proposal.rfp?.title}</h4>
              <p className="text-sm text-muted-foreground">{proposal.rfp?.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Proje:</span>
              <span className="text-sm">{proposal.rfp?.project?.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Başlangıç:</span>
              <span className="text-sm">{proposal.rfp?.startDate ? formatDate(proposal.rfp.startDate) : '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bitiş:</span>
              <span className="text-sm">{proposal.rfp?.endDate ? formatDate(proposal.rfp.endDate) : '-'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Teklif Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Toplam Tutar:</span>
              <span className="text-lg font-bold">
                {proposal.totalAmount ? formatCurrency(proposal.totalAmount) : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gönderilme:</span>
              <span className="text-sm">{formatDate(proposal.submittedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Oluşturulma:</span>
              <span className="text-sm">{formatDate(proposal.createdAt)}</span>
            </div>
            {proposal.notes && (
              <div>
                <span className="text-sm font-medium">Notlar:</span>
                <p className="text-sm text-muted-foreground mt-1">{proposal.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Tedarikçi Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">
                {proposal.supplier?.firstName} {proposal.supplier?.lastName}
              </h4>
              <p className="text-sm text-muted-foreground">{proposal.supplier?.email}</p>
            </div>
            {proposal.supplier?.company && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Şirket:</span>
                <span className="text-sm">{proposal.supplier.company}</span>
              </div>
            )}
            {proposal.supplier?.phone && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Telefon:</span>
                <span className="text-sm">{proposal.supplier.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Proposal Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Teklif Ürünleri</span>
          </CardTitle>
          <CardDescription>
            Bu teklifte yer alan ürünler ve fiyatlar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {proposal.items?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ürün Adı</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Miktar</TableHead>
                  <TableHead>Birim Fiyat</TableHead>
                  <TableHead>Toplam Fiyat</TableHead>
                  <TableHead>Notlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposal.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.rfpItem?.product?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {item.rfpItem?.product?.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.rfpItem?.quantity} {item.rfpItem?.product?.unit}
                    </TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(item.totalPrice)}
                    </TableCell>
                    <TableCell>{item.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Bu teklifte henüz ürün bulunmuyor.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Status History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Durum Geçmişi</span>
          </CardTitle>
          <CardDescription>
            Teklifin durum değişiklikleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Teklif oluşturuldu</p>
                <p className="text-xs text-muted-foreground">{formatDate(proposal.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Teklif gönderildi</p>
                <p className="text-xs text-muted-foreground">{formatDate(proposal.submittedAt)}</p>
              </div>
            </div>
            {proposal.status !== 'PENDING' && (
              <div className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${
                    proposal.status === 'ACCEPTED' ? 'bg-green-500' : 
                    proposal.status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Teklif {getStatusInfo(proposal.status).label.toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(proposal.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}