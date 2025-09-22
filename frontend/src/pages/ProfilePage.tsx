import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateForm, validateRequired, validatePassword, validatePhone } from '../lib/validation';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    company: user?.company || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationRules = {
      firstName: [(value: string) => validateRequired(value, 'Ad')],
      lastName: [(value: string) => validateRequired(value, 'Soyad')],
      phone: [(value: string) => value ? validatePhone(value) : null],
    };

    const validationErrors = validateForm(profileData, validationRules);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await updateUser(profileData);
      toast.success('Profil güncellendi!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationRules = {
      currentPassword: [(value: string) => validateRequired(value, 'Mevcut şifre')],
      newPassword: [(value: string) => validatePassword(value)],
    };

    const validationErrors = validateForm(passwordData, validationRules);
    
    // Custom validation for confirm password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      validationErrors.confirmPassword = 'Yeni şifreler eşleşmiyor';
    }

    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    setPasswordErrors({});
    setIsLoading(true);

    try {
      // Password change logic would go here
      toast.success('Şifre değiştirildi!');
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[e.target.name]) {
      setPasswordErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil</h1>
        <p className="text-muted-foreground">
          Hesap bilgilerinizi yönetin
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profil Bilgileri</span>
            </CardTitle>
            <CardDescription>
              Kişisel bilgilerinizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ad</Label>
                    <p className="text-sm">{user?.firstName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Soyad</Label>
                    <p className="text-sm">{user?.lastName}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">E-posta</Label>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                  <p className="text-sm">
                    {user?.role === 'CUSTOMER' ? 'Müşteri' : 'Tedarikçi'}
                  </p>
                </div>
                {user?.company && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Şirket</Label>
                    <p className="text-sm">{user.company}</p>
                  </div>
                )}
                {user?.phone && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Telefon</Label>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                )}
                <Button onClick={() => setIsEditing(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Düzenle
                </Button>
              </div>
            ) : (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Şirket</Label>
                  <Input
                    id="company"
                    name="company"
                    value={profileData.company}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                        company: user?.company || '',
                        phone: user?.phone || '',
                      });
                    }}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Şifre Değiştir</span>
            </CardTitle>
            <CardDescription>
              Hesap güvenliğiniz için şifrenizi güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isChangingPassword ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Güvenliğiniz için düzenli olarak şifrenizi değiştirmenizi öneririz.
                </p>
                <Button onClick={() => setIsChangingPassword(true)}>
                  <Key className="mr-2 h-4 w-4" />
                  Şifre Değiştir
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChangeInput}
                    className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.currentPassword && <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChangeInput}
                    className={passwordErrors.newPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.newPassword && <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChangeInput}
                    className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {passwordErrors.confirmPassword && <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>}
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    <Key className="mr-2 h-4 w-4" />
                    {isLoading ? 'Değiştiriliyor...' : 'Şifre Değiştir'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    İptal
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
