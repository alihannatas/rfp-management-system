import axios from 'axios';
import type { ApiResponse, AuthResponse, User, Project, Product, RFP, Proposal, DashboardData, CreateProjectRequest, CreateProductRequest, CreateRFPRequest, CreateProposalRequest } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
    role: 'CUSTOMER' | 'SUPPLIER';
  }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data!;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', userData);
    return response.data.data!;
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.put('/auth/change-password', passwords);
  },
};

export const projectService = {
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ projects: Project[]; pagination: any }> => {
    const response = await api.get<ApiResponse<Project[]>>('/projects', { params });
    return {
      projects: response.data.data!,
      pagination: response.data.pagination,
    };
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data!;
  },

  createProject: async (projectData: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<ApiResponse<Project>>('/projects', projectData);
    return response.data.data!;
  },

  updateProject: async (id: number, projectData: Partial<CreateProjectRequest>): Promise<Project> => {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, projectData);
    return response.data.data!;
  },

  deleteProject: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<ApiResponse<DashboardData>>('/projects/dashboard');
    return response.data.data!;
  },
};

export const productService = {
  getProducts: async (projectId: number, params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ products: Product[]; pagination: any }> => {
    const response = await api.get<ApiResponse<Product[]>>(`/projects/${projectId}/products`, { params });
    return {
      products: response.data.data!,
      pagination: response.data.pagination,
    };
  },

  getProduct: async (projectId: number, productId: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/projects/${projectId}/products/${productId}`);
    return response.data.data!;
  },

  createProduct: async (projectId: number, productData: CreateProductRequest): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>(`/projects/${projectId}/products`, productData);
    return response.data.data!;
  },

  updateProduct: async (projectId: number, productId: number, productData: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/projects/${projectId}/products/${productId}`, productData);
    return response.data.data!;
  },

  deleteProduct: async (projectId: number, productId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}/products/${productId}`);
  },

  getProductsByCategory: async (projectId: number, category: string): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`/projects/${projectId}/products/category?category=${category}`);
    return response.data.data!;
  },
};

export const rfpService = {
  getRFPs: async (projectId: number, params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ rfps: RFP[]; pagination: any }> => {
    const response = await api.get<ApiResponse<RFP[]>>(`/projects/${projectId}/rfps`, { params });
    return {
      rfps: response.data.data!,
      pagination: response.data.pagination,
    };
  },

  getRFP: async (projectId: number, rfpId: number): Promise<RFP> => {
    const response = await api.get<ApiResponse<RFP>>(`/projects/${projectId}/rfps/${rfpId}`);
    return response.data.data!;
  },

  createRFP: async (projectId: number, rfpData: CreateRFPRequest): Promise<RFP> => {
    const response = await api.post<ApiResponse<RFP>>(`/projects/${projectId}/rfps`, rfpData);
    return response.data.data!;
  },

  updateRFP: async (projectId: number, rfpId: number, rfpData: Partial<CreateRFPRequest>): Promise<RFP> => {
    const response = await api.put<ApiResponse<RFP>>(`/projects/${projectId}/rfps/${rfpId}`, rfpData);
    return response.data.data!;
  },

  deleteRFP: async (projectId: number, rfpId: number): Promise<void> => {
    await api.delete(`/projects/${projectId}/rfps/${rfpId}`);
  },

  toggleRFPStatus: async (projectId: number, rfpId: number, isActive: boolean): Promise<RFP> => {
    const response = await api.put<ApiResponse<RFP>>(`/projects/${projectId}/rfps/${rfpId}/toggle`, { isActive });
    return response.data.data!;
  },

  getActiveRFPs: async (): Promise<RFP[]> => {
    const response = await api.get<ApiResponse<RFP[]>>('/rfps/active');
    return response.data.data!;
  },

  getRFPForSupplier: async (rfpId: number): Promise<RFP> => {
    const response = await api.get<ApiResponse<RFP>>(`/rfps/${rfpId}`);
    return response.data.data!;
  },

  getRFPComparison: async (projectId: number): Promise<RFP[]> => {
    const response = await api.get<ApiResponse<RFP[]>>(`/projects/${projectId}/rfps/comparison`);
    return response.data.data!;
  },
};

export const proposalService = {
  getProposals: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ proposals: Proposal[]; pagination: any }> => {
    const response = await api.get<ApiResponse<Proposal[]>>('/proposals', { params });
    return {
      proposals: response.data.data!,
      pagination: response.data.pagination,
    };
  },

  getProposal: async (proposalId: number): Promise<Proposal> => {
    const response = await api.get<ApiResponse<Proposal>>(`/proposals/${proposalId}`);
    return response.data.data!;
  },

  getProposalForCustomer: async (proposalId: number): Promise<Proposal> => {
    const response = await api.get<ApiResponse<Proposal>>(`/proposals/customer/${proposalId}`);
    return response.data.data!;
  },

  createProposal: async (proposalData: CreateProposalRequest): Promise<Proposal> => {
    const response = await api.post<ApiResponse<Proposal>>('/proposals', proposalData);
    return response.data.data!;
  },

  updateProposal: async (proposalId: number, proposalData: Partial<CreateProposalRequest>): Promise<Proposal> => {
    const response = await api.put<ApiResponse<Proposal>>(`/proposals/${proposalId}`, proposalData);
    return response.data.data!;
  },

  withdrawProposal: async (proposalId: number): Promise<void> => {
    await api.put(`/proposals/${proposalId}/withdraw`);
  },

  getProposalsByRFP: async (rfpId: number): Promise<Proposal[]> => {
    const response = await api.get<ApiResponse<Proposal[]>>(`/proposals/rfp/${rfpId}`);
    return response.data.data!;
  },

  updateProposalStatus: async (proposalId: number, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'): Promise<Proposal> => {
    const response = await api.put<ApiResponse<Proposal>>(`/proposals/${proposalId}/status`, { status });
    return response.data.data!;
  },

  updateProposalStatusByCustomer: async (proposalId: number, status: 'ACCEPTED' | 'REJECTED'): Promise<Proposal> => {
    const response = await api.put<ApiResponse<Proposal>>(`/proposals/customer/${proposalId}/status`, { status });
    return response.data.data!;
  },
};

export default api;
