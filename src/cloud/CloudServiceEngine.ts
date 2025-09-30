/**
 * Cloud Service Engine
 * Provides multi-user collaboration and cloud storage capabilities
 */

import { Structure3D } from '../types/structural';

// Cloud Configuration
export interface CloudConfig {
  apiEndpoint: string;
  websocketEndpoint: string;
  storageEndpoint: string;
  authEnabled: boolean;
  encryptionEnabled: boolean;
  maxFileSize: number; // MB
  collaborationEnabled: boolean;
  realtimeSync: boolean;
  offlineSupport: boolean;
}

// User Management
export interface CloudUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: CloudPermissions;
  lastSeen: Date;
  isOnline: boolean;
}

export interface CloudPermissions {
  canEdit: boolean;
  canComment: boolean;
  canShare: boolean;
  canExport: boolean;
  canManageUsers: boolean;
  canDelete: boolean;
}

// Project Management
export interface CloudProject {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: CloudUser[];
  structure: Structure3D;
  metadata: CloudProjectMetadata;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  isPublic: boolean;
  tags: string[];
}

export interface CloudProjectMetadata {
  buildingType: string;
  location: string;
  engineerName: string;
  projectCode: string;
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'archived';
  fileSize: number;
  thumbnail?: string;
  lastAnalysisResult?: any;
}

// Collaboration Features
export interface CollaborationEvent {
  id: string;
  type: 'structure_update' | 'comment' | 'user_join' | 'user_leave' | 'analysis_run' | 'export';
  userId: string;
  projectId: string;
  timestamp: Date;
  data: any;
  description: string;
}

export interface ProjectComment {
  id: string;
  userId: string;
  projectId: string;
  elementId?: string; // For element-specific comments
  content: string;
  position?: { x: number; y: number; z: number }; // 3D position for spatial comments
  timestamp: Date;
  replies?: ProjectComment[];
  resolved: boolean;
}

// Real-time Synchronization
export interface SyncUpdate {
  type: 'structure' | 'comment' | 'user_status' | 'analysis';
  projectId: string;
  userId: string;
  timestamp: Date;
  changes: any;
  conflictResolution?: 'merge' | 'overwrite' | 'manual';
}

// Cloud Storage
export interface CloudFile {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  projectId?: string;
  isPublic: boolean;
  downloadCount: number;
  tags: string[];
}

// API Response Types
export interface CloudResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface CloudListResponse<T = any> extends CloudResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Main Cloud Service Engine Class
 */
export class CloudServiceEngine {
  private config: CloudConfig;
  private currentUser: CloudUser | null = null;
  private wsConnection: WebSocket | null = null;
  private syncQueue: SyncUpdate[] = [];
  private isOnline: boolean = true;
  private offlineChanges: Map<string, any> = new Map();

  constructor(config: Partial<CloudConfig> = {}) {
    this.config = {
      apiEndpoint: 'https://api.structuralapp.com',
      websocketEndpoint: 'wss://ws.structuralapp.com',
      storageEndpoint: 'https://storage.structuralapp.com',
      authEnabled: true,
      encryptionEnabled: true,
      maxFileSize: 100, // 100MB
      collaborationEnabled: true,
      realtimeSync: true,
      offlineSupport: true,
      ...config
    };

    this.initializeNetworkMonitoring();
  }

  /**
   * Initialize cloud service
   */
  async initialize(): Promise<boolean> {
    try {
      // Check network connectivity
      await this.checkConnectivity();
      
      // Initialize WebSocket connection for real-time collaboration
      if (this.config.collaborationEnabled) {
        await this.initializeWebSocket();
      }

      // Sync offline changes if any
      if (this.config.offlineSupport) {
        await this.syncOfflineChanges();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize cloud service:', error);
      return false;
    }
  }

  /**
   * User Authentication
   */
  async authenticate(credentials: { email: string; password: string }): Promise<CloudUser | null> {
    try {
      const response = await this.apiRequest('POST', '/auth/login', credentials);
      
      if (response.success && response.data) {
        this.currentUser = response.data.user;
        localStorage.setItem('cloudAuth', JSON.stringify(response.data.token));
        
        // Update user online status
        await this.updateUserStatus('online');
        
        return this.currentUser;
      }

      return null;
    } catch (error) {
      console.error('Authentication failed:', error);
      return null;
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await this.updateUserStatus('offline');
      await this.apiRequest('POST', '/auth/logout');
      
      this.currentUser = null;
      localStorage.removeItem('cloudAuth');
      
      if (this.wsConnection) {
        this.wsConnection.close();
        this.wsConnection = null;
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  /**
   * Project Management
   */
  async createProject(
    name: string, 
    structure: Structure3D, 
    metadata: Partial<CloudProjectMetadata> = {}
  ): Promise<CloudProject | null> {
    try {
      const projectData = {
        name,
        structure: this.config.encryptionEnabled ? this.encryptData(structure) : structure,
        metadata: {
          buildingType: 'building',
          location: '',
          engineerName: this.currentUser?.displayName || '',
          projectCode: '',
          status: 'draft' as const,
          fileSize: JSON.stringify(structure).length,
          ...metadata
        }
      };

      const response = await this.apiRequest('POST', '/projects', projectData);
      
      if (response.success && response.data) {
        // Start real-time collaboration for this project
        if (this.config.collaborationEnabled) {
          await this.joinProjectRoom(response.data.id);
        }
        
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Failed to create project:', error);
      return null;
    }
  }

  /**
   * Load project from cloud
   */
  async loadProject(projectId: string): Promise<CloudProject | null> {
    try {
      const response = await this.apiRequest('GET', `/projects/${projectId}`);
      
      if (response.success && response.data) {
        const project = response.data;
        
        // Decrypt structure if encryption is enabled
        if (this.config.encryptionEnabled && project.structure) {
          project.structure = this.decryptData(project.structure);
        }
        
        // Join collaboration room
        if (this.config.collaborationEnabled) {
          await this.joinProjectRoom(projectId);
        }
        
        return project;
      }

      return null;
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }

  /**
   * Save project to cloud
   */
  async saveProject(project: CloudProject): Promise<boolean> {
    try {
      const saveData = {
        ...project,
        structure: this.config.encryptionEnabled ? this.encryptData(project.structure) : project.structure,
        updatedAt: new Date(),
        version: project.version + 1
      };

      const response = await this.apiRequest('PUT', `/projects/${project.id}`, saveData);
      
      if (response.success) {
        // Broadcast changes to collaborators
        if (this.config.collaborationEnabled) {
          await this.broadcastUpdate({
            type: 'structure',
            projectId: project.id,
            userId: this.currentUser?.id || '',
            timestamp: new Date(),
            changes: { structure: project.structure }
          });
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to save project:', error);
      
      // Store in offline cache if network is down
      if (!this.isOnline && this.config.offlineSupport) {
        this.offlineChanges.set(project.id, project);
        return true; // Return true for offline save
      }
      
      return false;
    }
  }

  /**
   * List user projects
   */
  async listProjects(page: number = 1, limit: number = 20): Promise<CloudListResponse<CloudProject>> {
    try {
      const response = await this.apiRequest('GET', `/projects?page=${page}&limit=${limit}`);
      return response as CloudListResponse<CloudProject>;
    } catch (error) {
      console.error('Failed to list projects:', error);
      return {
        success: false,
        error: String(error),
        total: 0,
        page: 1,
        limit: 20,
        hasMore: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Share project with other users
   */
  async shareProject(
    projectId: string, 
    userEmail: string, 
    role: CloudUser['role'] = 'viewer'
  ): Promise<boolean> {
    try {
      const response = await this.apiRequest('POST', `/projects/${projectId}/share`, {
        userEmail,
        role
      });

      if (response.success) {
        // Notify other collaborators
        await this.broadcastUpdate({
          type: 'user_status',
          projectId,
          userId: this.currentUser?.id || '',
          timestamp: new Date(),
          changes: { action: 'user_added', email: userEmail, role }
        });
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to share project:', error);
      return false;
    }
  }

  /**
   * Collaboration Features
   */
  async addComment(
    projectId: string,
    content: string,
    elementId?: string,
    position?: { x: number; y: number; z: number }
  ): Promise<ProjectComment | null> {
    try {
      const commentData = {
        projectId,
        content,
        elementId,
        position,
        timestamp: new Date()
      };

      const response = await this.apiRequest('POST', `/projects/${projectId}/comments`, commentData);
      
      if (response.success && response.data) {
        // Broadcast comment to collaborators
        await this.broadcastUpdate({
          type: 'comment',
          projectId,
          userId: this.currentUser?.id || '',
          timestamp: new Date(),
          changes: response.data
        });
        
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Failed to add comment:', error);
      return null;
    }
  }

  /**
   * Get project comments
   */
  async getComments(projectId: string): Promise<ProjectComment[]> {
    try {
      const response = await this.apiRequest('GET', `/projects/${projectId}/comments`);
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to get comments:', error);
      return [];
    }
  }

  /**
   * File Storage
   */
  async uploadFile(
    file: File, 
    projectId?: string,
    tags: string[] = []
  ): Promise<CloudFile | null> {
    try {
      // Check file size limit
      if (file.size > this.config.maxFileSize * 1024 * 1024) {
        throw new Error(`File size exceeds limit of ${this.config.maxFileSize}MB`);
      }

      const formData = new FormData();
      formData.append('file', file);
      if (projectId) formData.append('projectId', projectId);
      formData.append('tags', JSON.stringify(tags));

      const response = await fetch(`${this.config.storageEndpoint}/upload`, {
        method: 'POST',
        headers: this.getAuthHeaders(false), // Don't set Content-Type for FormData
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }

      throw new Error(result.error || 'Upload failed');
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  }

  /**
   * Download file
   */
  async downloadFile(fileId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${this.config.storageEndpoint}/download/${fileId}`, {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        return await response.blob();
      }

      throw new Error('Download failed');
    } catch (error) {
      console.error('File download failed:', error);
      return null;
    }
  }

  /**
   * Real-time Collaboration
   */
  private async initializeWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(this.config.websocketEndpoint);
        
        this.wsConnection.onopen = () => {
          console.log('WebSocket connected');
          this.sendWebSocketMessage({ type: 'auth', token: this.getAuthToken() });
          resolve();
        };

        this.wsConnection.onmessage = (event) => {
          this.handleWebSocketMessage(JSON.parse(event.data));
        };

        this.wsConnection.onclose = () => {
          console.log('WebSocket disconnected');
          // Attempt to reconnect
          setTimeout(() => this.initializeWebSocket(), 5000);
        };

        this.wsConnection.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private async joinProjectRoom(projectId: string): Promise<void> {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.sendWebSocketMessage({
        type: 'join_room',
        projectId,
        userId: this.currentUser?.id
      });
    }
  }

  private async broadcastUpdate(update: SyncUpdate): Promise<void> {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.sendWebSocketMessage({
        action: 'broadcast_update',
        ...update
      });
    }
  }

  private sendWebSocketMessage(message: any): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(message));
    }
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'sync_update':
        this.handleSyncUpdate(message);
        break;
      case 'user_joined':
        this.handleUserJoined(message);
        break;
      case 'user_left':
        this.handleUserLeft(message);
        break;
      case 'comment_added':
        this.handleCommentAdded(message);
        break;
      default:
        console.log('Unknown WebSocket message:', message);
    }
  }

  private handleSyncUpdate(message: SyncUpdate): void {
    // Emit event for UI to handle
    window.dispatchEvent(new CustomEvent('cloudSyncUpdate', { detail: message }));
  }

  private handleUserJoined(message: any): void {
    window.dispatchEvent(new CustomEvent('cloudUserJoined', { detail: message }));
  }

  private handleUserLeft(message: any): void {
    window.dispatchEvent(new CustomEvent('cloudUserLeft', { detail: message }));
  }

  private handleCommentAdded(message: any): void {
    window.dispatchEvent(new CustomEvent('cloudCommentAdded', { detail: message }));
  }

  /**
   * Network and Offline Support
   */
  private initializeNetworkMonitoring(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async checkConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/health`, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      this.isOnline = response.ok;
      return this.isOnline;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  private async syncOfflineChanges(): Promise<void> {
    if (!this.isOnline || this.offlineChanges.size === 0) return;

    try {
      for (const [projectId, project] of this.offlineChanges) {
        await this.saveProject(project);
        this.offlineChanges.delete(projectId);
      }
    } catch (error) {
      console.error('Failed to sync offline changes:', error);
    }
  }

  private async updateUserStatus(status: 'online' | 'offline'): Promise<void> {
    try {
      await this.apiRequest('PUT', '/user/status', { status });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  }

  /**
   * Utility Methods
   */
  private async apiRequest(method: string, endpoint: string, data?: any): Promise<CloudResponse> {
    try {
      const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
        method,
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  private getAuthHeaders(includeContentType: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private getAuthToken(): string | null {
    const auth = localStorage.getItem('cloudAuth');
    return auth ? JSON.parse(auth) : null;
  }

  private encryptData(data: any): string {
    // Simplified encryption - in production use proper encryption
    return btoa(JSON.stringify(data));
  }

  private decryptData(encryptedData: string): any {
    // Simplified decryption - in production use proper decryption
    return JSON.parse(atob(encryptedData));
  }

  /**
   * Public Getters
   */
  getCurrentUser(): CloudUser | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isConnected(): boolean {
    return this.isOnline;
  }

  getConfig(): CloudConfig {
    return { ...this.config };
  }
}

/**
 * Factory function to create Cloud Service Engine
 */
export function createCloudServiceEngine(config?: Partial<CloudConfig>): CloudServiceEngine {
  return new CloudServiceEngine(config);
}

/**
 * Cloud utility functions
 */
export const CloudUtils = {
  /**
   * Generate project thumbnail
   */
  generateThumbnail(structure: Structure3D): string {
    // Simplified thumbnail generation
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 200, 150);
      ctx.fillStyle = '#333';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${structure.nodes.length} nodes`, 100, 60);
      ctx.fillText(`${structure.elements.length} elements`, 100, 80);
    }
    
    return canvas.toDataURL();
  },

  /**
   * Calculate project file size
   */
  calculateFileSize(project: CloudProject): number {
    return JSON.stringify(project).length;
  },

  /**
   * Validate project data
   */
  validateProject(project: Partial<CloudProject>): string[] {
    const errors: string[] = [];
    
    if (!project.name || project.name.trim().length === 0) {
      errors.push('Project name is required');
    }
    
    if (!project.structure || !project.structure.nodes || !project.structure.elements) {
      errors.push('Valid structure data is required');
    }
    
    return errors;
  },

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
};