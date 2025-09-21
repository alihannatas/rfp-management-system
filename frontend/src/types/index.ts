export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  budget?: number;
  customerId: number;
  createdAt: string;
  updatedAt: string;
  customer?: User;
  rfps?: RFP[];
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: 'ELECTRONICS' | 'SOFTWARE' | 'HARDWARE' | 'SERVICES' | 'CONSULTING' | 'MAINTENANCE' | 'OTHER';
  unit?: string;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface RFP {
  id: number;
  title: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  projectId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  project?: Project;
  items?: RFPItem[];
  proposals?: Proposal[];
}

export interface RFPItem {
  id: number;
  quantity: number;
  notes?: string;
  rfpId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface Proposal {
  id: number;
  supplierId: number;
  rfpId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  totalAmount?: number;
  notes?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  supplier?: User;
  rfp?: RFP;
  items?: ProposalItem[];
}

export interface ProposalItem {
  id: number;
  proposalId: number;
  rfpItemId: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  rfpItem?: RFPItem;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  totalRFPs: number;
  activeRFPs: number;
  totalProposals: number;
  pendingProposals: number;
  recentProjects: Project[];
  recentRFPs: RFP[];
  recentProposals: Proposal[];
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  category: 'ELECTRONICS' | 'SOFTWARE' | 'HARDWARE' | 'SERVICES' | 'CONSULTING' | 'MAINTENANCE' | 'OTHER';
  unit?: string;
}

export interface CreateRFPRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  items: {
    productId: number;
    quantity: number;
    notes?: string;
  }[];
}

export interface CreateProposalRequest {
  rfpId: number;
  items: {
    rfpItemId: number;
    unitPrice: number;
    notes?: string;
  }[];
  notes?: string;
}
