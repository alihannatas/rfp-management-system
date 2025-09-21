import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rfpService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowLeft, FileText, Calendar, Package, ToggleLeft, ToggleRight, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, formatCurrency } from '../lib/utils';
import toast from 'react-hot-toast';
import ProposalComparisonChart from '../components/charts/ProposalComparisonChart';

const RFP_STATUSES = [
  { value: 'DRAFT', label: 'Taslak', color: 'bg-gray-100 text-gray-800' },
  { value: 'ACTIVE', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'CLOSED', label: 'Kapalı', color: 'bg-red-100 text-red-800' },
  { value: 'CANCELLED', label: 'İptal', color: 'bg-yellow-100 text-yellow-800' },
];

const PROPOSAL_STATUSES = [
  { value: 'PENDING', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ACCEPTED', label: 'Kabul Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  { value: 'WITHDRAWN', label: 'Geri Çekildi', color: 'bg-gray-100 text-gray-800' },
];

export default function RFPDetailPage() {
  const { projectId, rfpId } = useParams<{ projectId: string; rfpId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rfp, isLoading } = useQuery({
    queryKey: ['rfp', projectId, rfpId],
    queryFn: () => {
      if (user?.role === 'SUPPLIER') {
        return rfpService.getRFPForSupplier(parseInt(rfpId!));
      } else {
        return rfpService.getRFP(parseInt(projectId!), parseInt(rfpId!));
      }
    },
    enabled: !!rfpId && (user?.role === 'SUPPLIER' || !!projectId),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ isActive }: { isActive: boolean }) => {
      if (user?.role === 'SUPPLIER') {
        // SUPPLIER'lar RFP durumunu değiştiremez
        throw new Error('SUPPLIERs cannot change RFP status');
      }
      return rfpService.toggleRFPStatus(parseInt(projectId!), parseInt(rfpId!), isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfp', projectId, rfpId] });
      queryClient.invalidateQueries({ queryKey: ['rfps', projectId] });
      toast.success('RFP durumu güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'RFP durumu güncellenirken bir hata oluştu');
    },
  });

  const handleToggle = () => {
    toggleMutation.mutate({ isActive: !rfp?.isActive });
  };

  const getStatusInfo = (status: string) => {
    return RFP_STATUSES.find(s => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getProposalStatusInfo = (status: string) => {
    return PROPOSAL_STATUSES.find(s => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">RFP bulunamadı</h2>
        <Button asChild>
          <Link to={user?.role === 'SUPPLIER' ? '/active-rfps' : `/projects/${projectId}/rfps`}>
            RFP'lere Dön
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link to={user?.role === 'SUPPLIER' ? '/active-rfps' : `/projects/${projectId}/rfps`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate">{rfp.title}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{rfp.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Badge className={getStatusInfo(rfp.status).color}>
            {getStatusInfo(rfp.status).label}
          </Badge>
          {user?.role === 'CUSTOMER' && (
            <Button
              onClick={handleToggle}
              disabled={toggleMutation.isPending}
              variant={rfp.isActive ? "destructive" : "default"}
              size="sm"
              className="text-xs"
            >
              {rfp.isActive ? (
                <>
                  <ToggleRight className="mr-2 h-3 w-3" />
                  Deaktif Et
                </>
              ) : (
                <>
                  <ToggleLeft className="mr-2 h-3 w-3" />
                  Aktif Et
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Tarih Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">Başlangıç:</span>
              <span className="text-xs sm:text-sm">{formatDate(rfp.startDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">Bitiş:</span>
              <span className="text-xs sm:text-sm">{formatDate(rfp.endDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">Durum:</span>
              <span className={`text-xs sm:text-sm ${rfp.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                {rfp.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Package className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Ürün Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{rfp.items?.length || 0}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Toplam ürün sayısı</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Teklifler</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{rfp.proposals?.length || 0}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Gelen teklif sayısı</p>
          </CardContent>
        </Card>
      </div>

      {/* RFP Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>RFP Ürünleri</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Bu RFP'de talep edilen ürünler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rfp.items?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Ürün Adı</TableHead>
                    <TableHead className="text-xs sm:text-sm">Kategori</TableHead>
                    <TableHead className="text-xs sm:text-sm">Miktar</TableHead>
                    <TableHead className="text-xs sm:text-sm">Birim</TableHead>
                    <TableHead className="text-xs sm:text-sm">Notlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfp.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">{item.product?.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {item.product?.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.product?.unit || '-'}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{item.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Bu RFP'de henüz ürün bulunmuyor.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Proposals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Gelen Teklifler</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Tedarikçilerden gelen teklifler
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rfp.proposals?.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Tedarikçi</TableHead>
                    <TableHead className="text-xs sm:text-sm">Toplam Tutar</TableHead>
                    <TableHead className="text-xs sm:text-sm">Durum</TableHead>
                    <TableHead className="text-xs sm:text-sm">Gönderilme Tarihi</TableHead>
                    <TableHead className="text-xs sm:text-sm">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfp.proposals.map((proposal: any) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium text-xs sm:text-sm">
                        {proposal.supplier?.firstName} {proposal.supplier?.lastName}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {proposal.totalAmount ? formatCurrency(proposal.totalAmount) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getProposalStatusInfo(proposal.status).color} text-xs`}>
                          {getProposalStatusInfo(proposal.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{formatDate(proposal.submittedAt)}</TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline" className="text-xs">
                          <Link to={`/proposals/${proposal.id}`}>
                            <FileText className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Detay</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Bu RFP'ye henüz teklif gelmedi.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Proposal Comparison Charts */}
      {rfp.proposals && rfp.proposals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Teklif Karşılaştırması</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Gelen tekliflerin görsel karşılaştırması
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProposalComparisonChart proposals={rfp.proposals} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}