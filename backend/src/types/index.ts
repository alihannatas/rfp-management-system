import { User, Project, RFP, Proposal, Product, RFPItem, ProposalItem, Notification } from '@prisma/client';
import { Request } from 'express';

// Base types
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

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User types
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
  role: 'CUSTOMER' | 'SUPPLIER';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Project types
export interface CreateProjectRequest {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  status?: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
}

// Product types
export interface CreateProductRequest {
  name: string;
  description?: string;
  category: 'ELECTRONICS' | 'SOFTWARE' | 'HARDWARE' | 'SERVICES' | 'CONSULTING' | 'MAINTENANCE' | 'OTHER';
  unit?: string;
}

// RFP types
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

export interface UpdateRFPRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  isActive?: boolean;
}

// Proposal types
export interface CreateProposalRequest {
  rfpId: number;
  items: {
    rfpItemId: number;
    unitPrice: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface UpdateProposalRequest {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  items?: {
    rfpItemId: number;
    unitPrice: number;
    notes?: string;
  }[];
  notes?: string;
}

// Extended types with relations
export type ProjectWithRelations = Project & {
  customer: Omit<User, 'password'>;
  rfps: RFP[];
  products: Product[];
};

export type RFPWithRelations = RFP & {
  project: Project;
  items: (RFPItem & {
    product: Product;
  })[];
  proposals: Proposal[];
};

export type ProposalWithRelations = Proposal & {
  supplier: Omit<User, 'password'>;
  rfp: RFP;
  items: (ProposalItem & {
    rfpItem: RFPItem & {
      product: Product;
    };
  })[];
};

export type DashboardData = {
  totalProjects: number;
  activeProjects: number;
  totalRFPs: number;
  activeRFPs: number;
  totalProposals: number;
  pendingProposals: number;
  recentProjects: ProjectWithRelations[];
  recentRFPs: RFPWithRelations[];
  recentProposals: ProposalWithRelations[];
};

// JWT Payload
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Request with user
export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
