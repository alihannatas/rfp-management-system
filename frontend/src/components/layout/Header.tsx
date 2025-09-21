import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 sm:h-14 items-center justify-between px-3 sm:px-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-base sm:text-xl font-bold truncate">RFP Management</h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              ({user?.role})
            </span>
          </div>
          
          <div className="flex sm:hidden items-center space-x-1">
            <User className="h-4 w-4" />
            <span className="text-xs font-medium truncate max-w-20">
              {user?.firstName}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-1 sm:space-x-2"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline text-xs sm:text-sm">Çıkış</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
