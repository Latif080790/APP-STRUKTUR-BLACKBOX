/**
 * Comprehensive Data Persistence & Session Management System
 * Sistem penyimpanan data dan manajemen sesi yang teliti
 */

import { ProjectData, AnalysisResults } from '../engines/FunctionalStructuralEngine';

interface StorageConfig {
  version: string;
  timestamp: number;
  compression: boolean;
  encryption: boolean;
}

interface SessionData {
  userId: string;
  sessionId: string;
  lastActivity: Date;
  preferences: UserPreferences;
  recentProjects: string[];
  autoSaveEnabled: boolean;
}

interface UserPreferences {
  language: 'id' | 'en';
  theme: 'light' | 'dark' | 'auto';
  units: 'metric' | 'imperial';
  autoSave: boolean;
  notifications: boolean;
  analysisDefaults: {
    method: 'LRFD' | 'ASD';
    standards: string[];
    tolerance: number;
  };
}

interface PersistentData {
  config: StorageConfig;
  session: SessionData;
  projects: { [id: string]: ProjectData };
  analysisResults: { [projectId: string]: AnalysisResults };
  drafts: { [id: string]: Partial<ProjectData> };
  cache: { [key: string]: any };
}

export class DataPersistenceManager {
  private static instance: DataPersistenceManager;
  private storagePrefix = 'struktur_app_';
  private currentVersion = '1.0.0';
  private maxStorageSize = 50 * 1024 * 1024; // 50MB limit
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private compressionEnabled = true;

  static getInstance(): DataPersistenceManager {
    if (!DataPersistenceManager.instance) {
      DataPersistenceManager.instance = new DataPersistenceManager();
    }
    return DataPersistenceManager.instance;
  }

  private constructor() {
    this.initializeStorage();
    this.startAutoSave();
    this.setupStorageEventListeners();
  }

  /**
   * Initialize storage system
   */
  private initializeStorage(): void {
    try {
      const existingData = this.getRawData();
      if (!existingData || this.needsUpgrade(existingData)) {
        this.migrateData(existingData);
      }
      
      // Cleanup old data if needed
      this.cleanupOldData();
      
      console.log('✅ Data persistence system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize storage:', error);
      this.handleStorageError(error);
    }
  }

  /**
   * Get all data from storage
   */
  private getRawData(): PersistentData | null {
    try {
      const data = localStorage.getItem(this.storagePrefix + 'data');
      if (!data) return null;

      const parsed = JSON.parse(data);
      
      // Decompress if needed
      if (parsed.config?.compression && this.compressionEnabled) {
        return this.decompressData(parsed);
      }
      
      return parsed;
    } catch (error) {
      console.error('Error reading storage data:', error);
      return null;
    }
  }

  /**
   * Save all data to storage
   */
  private saveRawData(data: PersistentData): boolean {
    try {
      let dataToSave = data;
      
      // Compress if enabled
      if (this.compressionEnabled) {
        dataToSave = this.compressData(data);
      }
      
      const serialized = JSON.stringify(dataToSave);
      
      // Check storage size
      if (serialized.length > this.maxStorageSize) {
        console.warn('⚠️ Data size exceeds limit, cleaning up...');
        this.cleanupExcessData(data);
        return this.saveRawData(data); // Retry after cleanup
      }
      
      localStorage.setItem(this.storagePrefix + 'data', serialized);
      
      // Update timestamp
      this.updateTimestamp();
      
      return true;
    } catch (error) {
      console.error('Error saving storage data:', error);
      this.handleStorageError(error);
      return false;
    }
  }

  /**
   * Check if data needs upgrade
   */
  private needsUpgrade(data: PersistentData | null): boolean {
    if (!data || !data.config) return true;
    return data.config.version !== this.currentVersion;
  }

  /**
   * Migrate data from older versions
   */
  private migrateData(oldData: PersistentData | null): void {
    console.log('🔄 Migrating data to version', this.currentVersion);
    
    const defaultData: PersistentData = {
      config: {
        version: this.currentVersion,
        timestamp: Date.now(),
        compression: this.compressionEnabled,
        encryption: false
      },
      session: {
        userId: this.generateUserId(),
        sessionId: this.generateSessionId(),
        lastActivity: new Date(),
        preferences: this.getDefaultPreferences(),
        recentProjects: [],
        autoSaveEnabled: true
      },
      projects: {},
      analysisResults: {},
      drafts: {},
      cache: {}
    };

    // Migrate existing projects if available
    if (oldData?.projects) {
      defaultData.projects = oldData.projects;
    }

    // Migrate analysis results if available
    if (oldData?.analysisResults) {
      defaultData.analysisResults = oldData.analysisResults;
    }

    this.saveRawData(defaultData);
  }

  /**
   * Get default user preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      language: 'id',
      theme: 'light',
      units: 'metric',
      autoSave: true,
      notifications: true,
      analysisDefaults: {
        method: 'LRFD',
        standards: ['SNI 2847:2019', 'SNI 1726:2019'],
        tolerance: 1e-6
      }
    };
  }

  /**
   * Generate unique user ID
   */
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
  }

  /**
   * PROJECT MANAGEMENT
   */

  /**
   * Save project to storage
   */
  async saveProject(project: ProjectData): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      data.projects[project.id] = {
        ...project,
        updatedAt: new Date()
      };

      // Add to recent projects
      if (!data.session.recentProjects.includes(project.id)) {
        data.session.recentProjects.unshift(project.id);
        // Keep only last 10 recent projects
        data.session.recentProjects = data.session.recentProjects.slice(0, 10);
      }

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  }

  /**
   * Load project from storage
   */
  async loadProject(projectId: string): Promise<ProjectData | null> {
    try {
      const data = this.getRawData();
      if (!data || !data.projects[projectId]) return null;

      return data.projects[projectId];
    } catch (error) {
      console.error('Error loading project:', error);
      return null;
    }
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<ProjectData[]> {
    try {
      const data = this.getRawData();
      if (!data) return [];

      return Object.values(data.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  /**
   * Delete project from storage
   */
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      delete data.projects[projectId];
      delete data.analysisResults[projectId];
      
      // Remove from recent projects
      data.session.recentProjects = data.session.recentProjects.filter(id => id !== projectId);

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  /**
   * ANALYSIS RESULTS MANAGEMENT
   */

  /**
   * Save analysis results
   */
  async saveAnalysisResults(projectId: string, results: AnalysisResults): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      data.analysisResults[projectId] = results;
      
      return this.saveRawData(data);
    } catch (error) {
      console.error('Error saving analysis results:', error);
      return false;
    }
  }

  /**
   * Load analysis results
   */
  async loadAnalysisResults(projectId: string): Promise<AnalysisResults | null> {
    try {
      const data = this.getRawData();
      if (!data || !data.analysisResults[projectId]) return null;

      return data.analysisResults[projectId];
    } catch (error) {
      console.error('Error loading analysis results:', error);
      return null;
    }
  }

  /**
   * DRAFT MANAGEMENT
   */

  /**
   * Save draft project
   */
  async saveDraft(draftId: string, draftData: Partial<ProjectData>): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      data.drafts[draftId] = {
        ...draftData,
        updatedAt: new Date()
      };

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error saving draft:', error);
      return false;
    }
  }

  /**
   * Load draft project
   */
  async loadDraft(draftId: string): Promise<Partial<ProjectData> | null> {
    try {
      const data = this.getRawData();
      if (!data || !data.drafts[draftId]) return null;

      return data.drafts[draftId];
    } catch (error) {
      console.error('Error loading draft:', error);
      return null;
    }
  }

  /**
   * SESSION MANAGEMENT
   */

  /**
   * Update session data
   */
  async updateSession(updates: Partial<SessionData>): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      data.session = {
        ...data.session,
        ...updates,
        lastActivity: new Date()
      };

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<SessionData | null> {
    try {
      const data = this.getRawData();
      if (!data) return null;

      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * USER PREFERENCES
   */

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      data.session.preferences = {
        ...data.session.preferences,
        ...preferences
      };

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = this.getRawData();
      if (!data) return this.getDefaultPreferences();

      return data.session.preferences;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * CACHE MANAGEMENT
   */

  /**
   * Set cache data
   */
  async setCache(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const data = this.getRawData();
      if (!data) return false;

      data.cache[key] = {
        value,
        timestamp: Date.now(),
        ttl: ttl || 3600000 // Default 1 hour
      };

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error setting cache:', error);
      return false;
    }
  }

  /**
   * Get cache data
   */
  async getCache(key: string): Promise<any | null> {
    try {
      const data = this.getRawData();
      if (!data || !data.cache[key]) return null;

      const cacheItem = data.cache[key];
      
      // Check if cache is expired
      if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
        delete data.cache[key];
        this.saveRawData(data);
        return null;
      }

      return cacheItem.value;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Start auto-save mechanism
   */
  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      this.updateTimestamp();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Update timestamp
   */
  private updateTimestamp(): void {
    try {
      const data = this.getRawData();
      if (data) {
        data.config.timestamp = Date.now();
        data.session.lastActivity = new Date();
        localStorage.setItem(this.storagePrefix + 'data', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error updating timestamp:', error);
    }
  }

  /**
   * Setup storage event listeners
   */
  private setupStorageEventListeners(): void {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith(this.storagePrefix)) {
        console.log('🔄 Storage updated from another tab');
        // Handle cross-tab synchronization if needed
      }
    });

    // Listen for page unload to save data
    window.addEventListener('beforeunload', () => {
      this.updateTimestamp();
    });
  }

  /**
   * Clean up old data
   */
  private cleanupOldData(): void {
    try {
      const data = this.getRawData();
      if (!data) return;

      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      // Clean up old cache items
      Object.keys(data.cache).forEach(key => {
        const cacheItem = data.cache[key];
        if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
          delete data.cache[key];
        }
      });

      // Clean up old drafts (older than 1 week)
      Object.keys(data.drafts).forEach(draftId => {
        const draft = data.drafts[draftId];
        if (draft.updatedAt && new Date(draft.updatedAt).getTime() < oneWeekAgo) {
          delete data.drafts[draftId];
        }
      });

      this.saveRawData(data);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  /**
   * Clean up excess data when storage is full
   */
  private cleanupExcessData(data: PersistentData): void {
    // Remove oldest analysis results first
    const analysisIds = Object.keys(data.analysisResults);
    if (analysisIds.length > 10) {
      analysisIds.slice(10).forEach(id => {
        delete data.analysisResults[id];
      });
    }

    // Clear cache
    data.cache = {};

    // Remove old drafts
    const draftIds = Object.keys(data.drafts);
    if (draftIds.length > 5) {
      draftIds.slice(5).forEach(id => {
        delete data.drafts[id];
      });
    }
  }

  /**
   * Compress data (simple implementation)
   */
  private compressData(data: PersistentData): PersistentData {
    // Simple compression by removing unnecessary fields
    const compressed = { ...data };
    compressed.config.compression = true;
    
    // In a real implementation, you might use a compression library
    return compressed;
  }

  /**
   * Decompress data
   */
  private decompressData(data: PersistentData): PersistentData {
    // Simple decompression
    return data;
  }

  /**
   * Handle storage errors
   */
  private handleStorageError(error: any): void {
    console.error('Storage error:', error);
    
    if (error.name === 'QuotaExceededError') {
      console.warn('⚠️ Storage quota exceeded, clearing old data...');
      this.clearOldData();
    }
  }

  /**
   * Clear old data when quota exceeded
   */
  private clearOldData(): void {
    try {
      const data = this.getRawData();
      if (data) {
        // Keep only recent projects
        const recentProjects = data.session.recentProjects.slice(0, 5);
        const newProjects: { [id: string]: ProjectData } = {};
        
        recentProjects.forEach(id => {
          if (data.projects[id]) {
            newProjects[id] = data.projects[id];
          }
        });

        data.projects = newProjects;
        data.analysisResults = {};
        data.drafts = {};
        data.cache = {};

        this.saveRawData(data);
      }
    } catch (error) {
      console.error('Error clearing old data:', error);
    }
  }

  /**
   * Export all data for backup
   */
  async exportData(): Promise<string> {
    try {
      const data = this.getRawData();
      if (!data) return '';

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  /**
   * Import data from backup
   */
  async importData(backupData: string): Promise<boolean> {
    try {
      const data = JSON.parse(backupData);
      
      // Validate data structure
      if (!this.validateDataStructure(data)) {
        throw new Error('Invalid data structure');
      }

      return this.saveRawData(data);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Validate data structure
   */
  private validateDataStructure(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.config &&
      data.session &&
      data.projects &&
      data.analysisResults &&
      data.drafts &&
      data.cache
    );
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<boolean> {
    try {
      localStorage.removeItem(this.storagePrefix + 'data');
      console.log('✅ All data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalSize: number;
    projectCount: number;
    analysisCount: number;
    draftCount: number;
    cacheCount: number;
    lastUpdate: Date;
  }> {
    try {
      const data = this.getRawData();
      if (!data) {
        return {
          totalSize: 0,
          projectCount: 0,
          analysisCount: 0,
          draftCount: 0,
          cacheCount: 0,
          lastUpdate: new Date()
        };
      }

      const serialized = JSON.stringify(data);
      
      return {
        totalSize: serialized.length,
        projectCount: Object.keys(data.projects).length,
        analysisCount: Object.keys(data.analysisResults).length,
        draftCount: Object.keys(data.drafts).length,
        cacheCount: Object.keys(data.cache).length,
        lastUpdate: new Date(data.config.timestamp)
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalSize: 0,
        projectCount: 0,
        analysisCount: 0,
        draftCount: 0,
        cacheCount: 0,
        lastUpdate: new Date()
      };
    }
  }

  /**
   * Cleanup on destroy
   */
  destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }
}

// Export singleton instance
export const dataPersistence = DataPersistenceManager.getInstance();