import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Search, FolderOpen, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '../lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { validateForm, validateRequired, validateDateRange, validatePositiveNumber } from '../lib/validation';

const PROJECT_STATUSES = [
  { value: 'ACTIVE', label: 'Aktif', color: 'bg-green-100 text-green-800' },
  { value: 'INACTIVE', label: 'Pasif', color: 'bg-gray-100 text-gray-800' },
  { value: 'COMPLETED', label: 'Tamamlandı', color: 'bg-blue-100 text-blue-800' },
  { value: 'CANCELLED', label: 'İptal', color: 'bg-red-100 text-red-800' },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['projects', { search }],
    queryFn: () => projectService.getProjects({ search }),
  });

  const createMutation = useMutation({
    mutationFn: (projectData: any) => projectService.createProject(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateDialogOpen(false);
      toast.success('Proje başarıyla oluşturuldu!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Proje oluşturulurken bir hata oluştu');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ projectId, data }: { projectId: number; data: any }) => 
      projectService.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsEditDialogOpen(false);
      setEditingProject(null);
      toast.success('Proje başarıyla güncellendi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Proje güncellenirken bir hata oluştu');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (projectId: number) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Proje başarıyla silindi!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Proje silinirken bir hata oluştu');
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : undefined,
    };

    // Validation
    const validationRules = {
      title: [(value: string) => validateRequired(value, 'Proje başlığı')],
      description: [(value: string) => validateRequired(value, 'Açıklama')],
      budget: [(value: any) => validateRequired(value, 'Bütçe'), (value: any) => validatePositiveNumber(value, 'Bütçe')],
      startDate: [(value: string) => validateRequired(value, 'Başlangıç tarihi')],
      endDate: [(value: string) => validateRequired(value, 'Bitiş tarihi')],
    };

    const validationErrors = validateForm(projectData, validationRules);
    
    // Date range validation
    if (projectData.startDate && projectData.endDate) {
      const dateRangeError = validateDateRange(projectData.startDate, projectData.endDate);
      if (dateRangeError) {
        validationErrors.endDate = dateRangeError;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    createMutation.mutate(projectData);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setErrors({});
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : undefined,
    };

    // Validation
    const validationRules = {
      title: [(value: string) => validateRequired(value, 'Proje başlığı')],
      description: [(value: string) => validateRequired(value, 'Açıklama')],
      budget: [(value: any) => validateRequired(value, 'Bütçe'), (value: any) => validatePositiveNumber(value, 'Bütçe')],
      startDate: [(value: string) => validateRequired(value, 'Başlangıç tarihi')],
      endDate: [(value: string) => validateRequired(value, 'Bitiş tarihi')],
    };

    const validationErrors = validateForm(projectData, validationRules);
    
    // Date range validation
    if (projectData.startDate && projectData.endDate) {
      const dateRangeError = validateDateRange(projectData.startDate, projectData.endDate);
      if (dateRangeError) {
        validationErrors.endDate = dateRangeError;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    updateMutation.mutate({ projectId: editingProject.id, data: projectData });
  };

  const handleDelete = (projectId: number) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(projectId);
    }
  };

  const handleInputChange = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStatusInfo = (status: string) => {
    return PROJECT_STATUSES.find(s => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800' };
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
          <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>
          <p className="text-muted-foreground">
            Projelerinizi yönetin ve yeni projeler oluşturun
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Proje
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Proje Oluştur</DialogTitle>
              <DialogDescription>
                Yeni bir proje oluşturun
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proje Başlığı</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="Proje başlığını girin" 
                  onChange={() => handleInputChange('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Proje açıklaması" 
                  onChange={() => handleInputChange('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    onChange={() => handleInputChange('startDate')}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Bitiş Tarihi</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date" 
                    onChange={() => handleInputChange('endDate')}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Bütçe (₺)</Label>
                <Input 
                  id="budget" 
                  name="budget" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  placeholder="Proje bütçesi" 
                  onChange={() => handleInputChange('budget')}
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
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
            placeholder="Proje ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {data?.projects?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project: any) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{project.title}</span>
                  <Badge className={getStatusInfo(project.status).color}>
                    {getStatusInfo(project.status).label}
                  </Badge>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.budget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bütçe:</span>
                      <span>{formatCurrency(project.budget)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Oluşturulma:</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">RFP Sayısı:</span>
                    <span>{project.rfps?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Ürün Sayısı:</span>
                    <span>{project.products?.length || 0}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link to={`/projects/${project.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Görüntüle
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(project.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Henüz proje yok</h3>
            <p className="text-muted-foreground text-center mb-4">
              İlk projenizi oluşturmak için aşağıdaki butona tıklayın
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Proje Oluştur
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Projeyi Düzenle</DialogTitle>
            <DialogDescription>
              Proje bilgilerini güncelleyin
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Proje Başlığı</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  defaultValue={editingProject.title}
                  placeholder="Proje başlığını girin" 
                  onChange={() => handleInputChange('title')}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Açıklama</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  defaultValue={editingProject.description}
                  placeholder="Proje açıklaması" 
                  onChange={() => handleInputChange('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Başlangıç Tarihi</Label>
                  <Input 
                    id="edit-startDate" 
                    name="startDate" 
                    type="date" 
                    defaultValue={editingProject.startDate?.split('T')[0]}
                    onChange={() => handleInputChange('startDate')}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Bitiş Tarihi</Label>
                  <Input 
                    id="edit-endDate" 
                    name="endDate" 
                    type="date" 
                    defaultValue={editingProject.endDate?.split('T')[0]}
                    onChange={() => handleInputChange('endDate')}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Bütçe (₺)</Label>
                <Input 
                  id="edit-budget" 
                  name="budget" 
                  type="number" 
                  step="0.01" 
                  min="0" 
                  defaultValue={editingProject.budget}
                  placeholder="Proje bütçesi" 
                  onChange={() => handleInputChange('budget')}
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
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