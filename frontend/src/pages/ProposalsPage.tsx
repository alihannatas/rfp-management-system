import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { proposalService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Handshake, Search, Eye, Trash2, FileText, DollarSign } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PROPOSAL_STATUSES = [
  { value: 'PENDING', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ACCEPTED', label: 'Kabul Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Reddedildi', color: 'bg-red-100 text-red-800' },
  { value: 'WITHDRAWN', label: 'Geri Çekildi', color: 'bg-gray-100 text-gray-800' },
];

export default function ProposalsPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['proposals', { search }],
    queryFn: () => proposalService.getProposals({ search }),
  });

  const withdrawMutation = useMutation({
    mutationFn: (proposalId: number) => proposalService.withdrawProposal(proposalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success('Teklif başarıyla geri çekildi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Teklif geri çekilirken bir hata oluştu');
    },
  });

  const handleWithdraw = (proposalId: number) => {
    if (confirm('Bu teklifi geri çekmek istediğinizden emin misiniz?')) {
      withdrawMutation.mutate(proposalId);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tekliflerim</h1>
        <p className="text-muted-foreground">
          Gönderdiğiniz teklifleri yönetin
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Teklif ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Teklif</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.proposals?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Gönderilen teklifler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beklemede</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.proposals?.filter((p: any) => p.status === 'PENDING').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Değerlendirme bekleyen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kabul Edilen</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.proposals?.filter((p: any) => p.status === 'ACCEPTED').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Kabul edilen teklifler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reddedilen</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.proposals?.filter((p: any) => p.status === 'REJECTED').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Reddedilen teklifler
            </p>
          </CardContent>
        </Card>
      </div>

      {data?.proposals?.length ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFP Başlığı</TableHead>
                <TableHead>Proje</TableHead>
                <TableHead>Toplam Tutar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Gönderilme Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.proposals.map((proposal: any) => (
                <TableRow key={proposal.id}>
                  <TableCell className="font-medium">
                    {proposal.rfp?.title || 'Bilinmeyen RFP'}
                  </TableCell>
                  <TableCell>
                    {proposal.rfp?.project?.title || 'Bilinmeyen Proje'}
                  </TableCell>
                  <TableCell>
                    {proposal.totalAmount ? formatCurrency(proposal.totalAmount) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusInfo(proposal.status).color}>
                      {getStatusInfo(proposal.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(proposal.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/proposals/${proposal.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {canWithdraw(proposal.status) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWithdraw(proposal.id)}
                          disabled={withdrawMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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
            <Handshake className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz teklif yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              Henüz hiç teklif göndermediniz. Aktif RFPler sayfasından teklif verebilirsiniz.
            </p>
            <Button asChild>
              <Link to="/active-rfps">
                <FileText className="mr-2 h-4 w-4" />
                Aktif RFPleri Görüntüle
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}