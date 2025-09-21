import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderOpen, Package, FileText } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProject(parseInt(projectId!)),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Proje bulunamadı</h2>
        <Button asChild>
          <Link to="/projects">Projelere Dön</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5" />
              <span>Proje Bilgileri</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Durum:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                project.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
            {project.budget && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bütçe:</span>
                <span className="text-sm">{formatCurrency(project.budget)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Oluşturulma:</span>
              <span className="text-sm">{formatDate(project.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Ürünler</span>
            </CardTitle>
            <CardDescription>
              {project.products?.length || 0} ürün
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to={`/projects/${project.id}/products`}>
                <Package className="mr-2 h-4 w-4" />
                Ürünleri Görüntüle
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>RFPler</span>
            </CardTitle>
            <CardDescription>
              {project.rfps?.length || 0} RFP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to={`/projects/${project.id}/rfps`}>
                <FileText className="mr-2 h-4 w-4" />
                RFPleri Görüntüle
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>
            Bu projede yapılan son işlemler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Henüz aktivite bulunmuyor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
