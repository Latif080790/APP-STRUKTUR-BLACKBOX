/**
 * API Service Layer untuk Structural Analysis System
 * Menyediakan interface untuk komunikasi dengan backend
 */

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  auth = {
    login: async (credentials: { email: string; password: string }) => {
      return this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    register: async (userData: {
      email: string;
      password: string;
      fullName: string;
      organization?: string;
    }) => {
      return this.request<{ success: boolean; token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    me: async () => {
      return this.request<{ success: boolean; user: any }>('/auth/me');
    },

    setToken: (token: string) => {
      this.token = token;
      localStorage.setItem('auth_token', token);
    },

    clearToken: () => {
      this.token = null;
      localStorage.removeItem('auth_token');
    }
  };

  // Projects methods
  projects = {
    getAll: async () => {
      return this.request<{ success: boolean; data: any[] }>('/projects');
    },

    getById: async (id: string) => {
      return this.request<{ success: boolean; data: any }>(`/projects/${id}`);
    },

    create: async (projectData: any) => {
      return this.request<{ success: boolean; data: any }>('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },

    update: async (id: string, projectData: any) => {
      return this.request<{ success: boolean; data: any }>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
      });
    },

    delete: async (id: string) => {
      return this.request<{ success: boolean; message: string }>(`/projects/${id}`, {
        method: 'DELETE',
      });
    }
  };

  // Analysis methods
  analysis = {
    structural: async (analysisData: {
      modelData: any;
      analysisType: string;
      loadCases: any[];
    }) => {
      return this.request<{ 
        success: boolean; 
        analysisId: string; 
        results: any;
        metadata: any;
      }>('/analysis/structural', {
        method: 'POST',
        body: JSON.stringify(analysisData),
      });
    },

    modal: async (analysisData: {
      modelData: any;
      modes?: number;
    }) => {
      return this.request<{ 
        success: boolean; 
        analysisId: string; 
        results: any;
      }>('/analysis/modal', {
        method: 'POST',
        body: JSON.stringify(analysisData),
      });
    },

    nonlinear: async (analysisData: {
      modelData: any;
      loadSteps?: number;
      convergenceCriteria?: any;
    }) => {
      return this.request<{ 
        success: boolean; 
        analysisId: string; 
        results: any;
      }>('/analysis/nonlinear', {
        method: 'POST',
        body: JSON.stringify(analysisData),
      });
    },

    getResults: async (analysisId: string) => {
      return this.request<{ 
        success: boolean; 
        analysisId: string;
        status: string;
        progress: number;
        results: any;
      }>(`/analysis/results/${analysisId}`);
    }
  };

  // Materials methods
  materials = {
    getAll: async (filters?: { category?: string; standard?: string }) => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.standard) params.append('standard', filters.standard);
      
      const queryString = params.toString();
      const endpoint = queryString ? `/materials?${queryString}` : '/materials';
      
      return this.request<{ success: boolean; data: any[]; total: number }>(endpoint);
    },

    getById: async (id: string) => {
      return this.request<{ success: boolean; data: any }>(`/materials/${id}`);
    },

    create: async (materialData: any) => {
      return this.request<{ success: boolean; data: any }>('/materials', {
        method: 'POST',
        body: JSON.stringify(materialData),
      });
    },

    update: async (id: string, materialData: any) => {
      return this.request<{ success: boolean; data: any }>(`/materials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(materialData),
      });
    }
  };

  // AI methods
  ai = {
    getRecommendations: async (inputData: any) => {
      return this.request<{ 
        success: boolean; 
        recommendations: any[];
      }>('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify(inputData),
      });
    }
  };

  // BIM methods
  bim = {
    uploadFile: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const url = `${this.baseURL}/bim/upload`;
      const headers: Record<string, string> = {};

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('BIM file upload failed:', error);
        throw error;
      }
    }
  };

  // Performance monitoring methods
  performance = {
    getMetrics: async () => {
      return this.request<{ 
        success: boolean; 
        metrics: {
          structuralHealth: number;
          loadCapacity: number;
          safetyFactor: number;
          materialUtilization: number;
        };
      }>('/performance/metrics');
    }
  };

  // Health check
  health = {
    check: async () => {
      return this.request<{ 
        status: string; 
        timestamp: string; 
        uptime: number; 
        version: string;
      }>('/health');
    }
  };
}

// Create singleton instance
export const apiService = new ApiService();

// Export types for TypeScript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  organization?: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  status: string;
  projectType: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  grade: string;
  standard: string;
  properties: Record<string, any>;
  testResults?: any[];
  sustainabilityMetrics?: any;
  costPerUnit?: number;
  supplier?: string;
}

export interface AnalysisResult {
  analysisId: string;
  results: {
    displacements?: any;
    stresses?: any;
    reactions?: any;
    summary: any;
  };
  metadata: {
    analysisType: string;
    timestamp: string;
    solver: string;
    standards: string[];
  };
}