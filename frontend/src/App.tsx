import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProductsPage from './pages/ProductsPage';
import RFPsPage from './pages/RFPsPage';
import RFPDetailPage from './pages/RFPDetailPage';
import ProposalsPage from './pages/ProposalsPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import ActiveRFPsPage from './pages/ActiveRFPsPage';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/layout/Layout';
import RoleGuard from './components/guards/RoleGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Customer Routes */}
        <Route 
          path="projects" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <ProjectsPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="projects/:projectId" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <ProjectDetailPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="projects/:projectId/products" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <ProductsPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="projects/:projectId/rfps" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <RFPsPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="projects/:projectId/rfps/:rfpId" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER']}>
              <RFPDetailPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="proposals/:proposalId" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER', 'SUPPLIER']}>
              <ProposalDetailPage />
            </RoleGuard>
          } 
        />

        {/* Supplier Routes */}
        <Route 
          path="active-rfps" 
          element={
            <RoleGuard allowedRoles={['SUPPLIER']}>
              <ActiveRFPsPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="rfps/:rfpId" 
          element={
            <RoleGuard allowedRoles={['SUPPLIER']}>
              <RFPDetailPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="proposals" 
          element={
            <RoleGuard allowedRoles={['SUPPLIER']}>
              <ProposalsPage />
            </RoleGuard>
          } 
        />
        <Route 
          path="proposals/:proposalId" 
          element={
            <RoleGuard allowedRoles={['CUSTOMER', 'SUPPLIER']}>
              <ProposalDetailPage />
            </RoleGuard>
          } 
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;