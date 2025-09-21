import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { projectService, rfpService, proposalService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  FileText,
  Handshake,
  TrendingUp,
  Clock,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import DashboardCharts from '../components/charts/DashboardCharts';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: projectService.getDashboard,
    enabled: user?.role === 'CUSTOMER',
  });

  const { data: activeRFPs } = useQuery({
    queryKey: ['active-rfps'],
    queryFn: rfpService.getActiveRFPs,
    enabled: user?.role === 'SUPPLIER',
  });

  const { data: proposalsData } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => proposalService.getProposals(),
    enabled: user?.role === 'SUPPLIER',
  });

  if (user?.role === 'SUPPLIER') {
    const proposals = proposalsData?.proposals || [];
    const pendingProposals = proposals.filter((p: any) => p.status === 'PENDING');
    const acceptedProposals = proposals.filter((p: any) => p.status === 'ACCEPTED');

    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Tedarikçi paneline hoş geldiniz
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Aktif RFPler
              </CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{activeRFPs?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Teklif verebileceğiniz RFPler
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Toplam Teklifler
              </CardTitle>
              <Handshake className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{proposals.length}</div>
              <p className="text-xs text-muted-foreground">
                Gönderdiğiniz teklifler
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Beklemede
              </CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{pendingProposals.length}</div>
              <p className="text-xs text-muted-foreground">
                Değerlendirme bekleyen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Kabul Edilen
              </CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{acceptedProposals.length}</div>
              <p className="text-xs text-muted-foreground">
                Kabul edilen teklifler
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Hızlı İşlemler</CardTitle>
              <CardDescription className="text-sm">
                Sık kullanılan işlemlere hızlı erişim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start text-sm">
                <Link to="/active-rfps">
                  <FileText className="mr-2 h-4 w-4" />
                  Aktif RFPleri Görüntüle
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-sm">
                <Link to="/proposals">
                  <Handshake className="mr-2 h-4 w-4" />
                  Tekliflerimi Görüntüle
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Son Tekliflerim</CardTitle>
              <CardDescription className="text-sm">
                En son gönderdiğiniz teklifler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proposals.slice(0, 5).length ? (
                <div className="space-y-2">
                  {proposals.slice(0, 5).map((proposal: any) => (
                    <div key={proposal.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border rounded space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{proposal.rfp?.title || 'Bilinmeyen RFP'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(proposal.submittedAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          proposal.status === 'ACCEPTED' 
                            ? 'bg-green-100 text-green-800' 
                            : proposal.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {proposal.status === 'ACCEPTED' ? 'Kabul' : 
                           proposal.status === 'REJECTED' ? 'Red' : 'Beklemede'}
                        </span>
                        <Button asChild size="sm" variant="outline" className="text-xs">
                          <Link to={`/proposals/${proposal.id}`}>Görüntüle</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Henüz teklif bulunmuyor.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Projelerinizin genel durumunu görüntüleyin
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Toplam Projeler
            </CardTitle>
            <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardData?.totalProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tüm projeleriniz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Aktif Projeler
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardData?.activeProjects || 0}</div>
            <p className="text-xs text-muted-foreground">
              Devam eden projeler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Toplam RFPler
            </CardTitle>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardData?.totalRFPs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Oluşturulan RFPler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Bekleyen Teklifler
            </CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{dashboardData?.pendingProposals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Değerlendirme bekleyen
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Son Projeler</CardTitle>
            <CardDescription className="text-sm">
              En son oluşturulan projeleriniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recentProjects?.length ? (
              <div className="space-y-2">
                {dashboardData.recentProjects.slice(0, 5).map((project: any) => (
                  <div key={project.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border rounded space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="text-xs">
                      <Link to={`/projects/${project.id}`}>Görüntüle</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Henüz proje bulunmuyor.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Son RFPler</CardTitle>
            <CardDescription className="text-sm">
              En son oluşturulan RFPleriniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.recentRFPs?.length ? (
              <div className="space-y-2">
                {dashboardData.recentRFPs.slice(0, 5).map((rfp: any) => (
                  <div key={rfp.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border rounded space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{rfp.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(rfp.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        rfp.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rfp.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <Link to={`/projects/${rfp.projectId}/rfps/${rfp.id}`}>Görüntüle</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Henüz RFP bulunmuyor.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>İstatistikler ve Analizler</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Projelerinizin ve RFP'lerinizin detaylı analizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardCharts 
            data={{
              projects: dashboardData?.recentProjects || [],
              rfps: dashboardData?.recentRFPs || [],
              proposals: []
            }} 
          />
        </CardContent>
      </Card>
    </div>
  );
}