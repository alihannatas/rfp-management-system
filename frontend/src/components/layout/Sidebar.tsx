import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FolderOpen,
  Handshake,
  User,
  Building2,
  ClipboardList,
} from 'lucide-react';

const customerNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projeler',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    title: 'Profil',
    href: '/profile',
    icon: User,
  },
];

const supplierNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Aktif RFPler',
    href: '/active-rfps',
    icon: ClipboardList,
  },
  {
    title: 'Tekliflerim',
    href: '/proposals',
    icon: Handshake,
  },
  {
    title: 'Profil',
    href: '/profile',
    icon: User,
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  
  const navItems = user?.role === 'CUSTOMER' ? customerNavItems : supplierNavItems;

  return (
    <aside className="w-full lg:w-64 border-r bg-background">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-base sm:text-lg font-semibold">RFP System</span>
        </div>
      </div>
      
      <nav className="px-2 sm:px-4 pb-4">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-2 sm:space-x-3 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )
                }
              >
                <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
