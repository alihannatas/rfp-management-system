import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('CUSTOMER' | 'SUPPLIER' | 'ADMIN')[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard' 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
