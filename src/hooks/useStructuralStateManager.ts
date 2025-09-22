/**
 * Comprehensive State Management System
 * Provides auto-save, data persistence, project management, undo/redo functionality
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// State management interfaces
export interface ProjectState {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  lastModified: string;
  version: number;
  projectInfo: any;
  geometry: any;
  materials: any;
  loads: any;
  seismicParams: any;
  analysisResults?: any;
  settings: {
    autoSave: boolean;
    saveInterval: number; // in milliseconds
    maxHistorySize: number;
  };
}

export interface StateHistory {
  timestamp: string;
  state: Partial<ProjectState>;
  action: string;
  description?: string;
}

export interface StateManagerConfig {
  autoSaveInterval?: number;
  maxHistorySize?: number;
  storageKey?: string;
  enableIndexedDB?: boolean;
}

// Local Storage utilities
class ProjectStorage {
  private static readonly STORAGE_KEY = 'structural-analysis-projects';
  private static readonly HISTORY_KEY = 'structural-analysis-history';
  private static readonly SETTINGS_KEY = 'structural-analysis-settings';

  static saveProject(project: ProjectState): void {
    try {
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = { ...project, lastModified: new Date().toISOString() };
      } else {
        projects.push(project);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }

  static getProject(id: string): ProjectState | null {
    try {
      const projects = this.getAllProjects();
      return projects.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Failed to get project:', error);
      return null;
    }
  }

  static getAllProjects(): ProjectState[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get all projects:', error);
      return [];
    }
  }

  static deleteProject(id: string): void {
    try {
      const projects = this.getAllProjects();
      const filtered = projects.filter(p => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }

  static saveHistory(projectId: string, history: StateHistory[]): void {
    try {
      const key = `${this.HISTORY_KEY}_${projectId}`;
      localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  }

  static getHistory(projectId: string): StateHistory[] {
    try {
      const key = `${this.HISTORY_KEY}_${projectId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  }

  static saveSettings(settings: any): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static getSettings(): any {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : {
        autoSave: true,
        saveInterval: 30000, // 30 seconds
        maxHistorySize: 50
      };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {
        autoSave: true,
        saveInterval: 30000,
        maxHistorySize: 50
      };
    }
  }
}

// Main State Manager Hook
export const useStructuralStateManager = (config: StateManagerConfig = {}) => {
  const {
    autoSaveInterval = 30000,
    maxHistorySize = 50,
    storageKey = 'structural-analysis-current',
    enableIndexedDB = false
  } = config;

  // Current project state
  const [currentProject, setCurrentProject] = useState<ProjectState | null>(null);
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // History management
  const [history, setHistory] = useState<StateHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Settings
  const [settings, setSettings] = useState(ProjectStorage.getSettings());

  // Auto-save timer
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const lastStateRef = useRef<string>('');

  // Initialize project
  const initializeProject = useCallback((projectData?: Partial<ProjectState>) => {
    const newProject: ProjectState = {
      id: projectData?.id || `project_${Date.now()}`,
      name: projectData?.name || 'New Project',
      description: projectData?.description || '',
      createdAt: projectData?.createdAt || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: projectData?.version || 1,
      projectInfo: projectData?.projectInfo || {},
      geometry: projectData?.geometry || {},
      materials: projectData?.materials || {},
      loads: projectData?.loads || {},
      seismicParams: projectData?.seismicParams || {},
      analysisResults: projectData?.analysisResults || null,
      settings: {
        autoSave: true,
        saveInterval: autoSaveInterval,
        maxHistorySize: maxHistorySize,
        ...projectData?.settings
      }
    };

    setCurrentProject(newProject);
    setIsModified(false);
    setHistory([]);
    setHistoryIndex(-1);
    
    // Save initial state
    saveProject(newProject);
    
    return newProject;
  }, [autoSaveInterval, maxHistorySize]);

  // Load project
  const loadProject = useCallback((projectId: string) => {
    const project = ProjectStorage.getProject(projectId);
    if (project) {
      setCurrentProject(project);
      setIsModified(false);
      
      // Load history
      const projectHistory = ProjectStorage.getHistory(projectId);
      setHistory(projectHistory);
      setHistoryIndex(projectHistory.length - 1);
      
      return project;
    }
    return null;
  }, []);

  // Save project
  const saveProject = useCallback(async (project?: ProjectState) => {
    const projectToSave = project || currentProject;
    if (!projectToSave) return;

    setIsSaving(true);
    try {
      ProjectStorage.saveProject(projectToSave);
      setLastSaveTime(new Date());
      setIsModified(false);
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentProject]);

  // Update project state
  const updateProjectState = useCallback((updates: Partial<ProjectState>, actionDescription?: string) => {
    if (!currentProject) return;

    const newState = {
      ...currentProject,
      ...updates,
      lastModified: new Date().toISOString(),
      version: currentProject.version + 1
    };

    // Add to history
    const historyEntry: StateHistory = {
      timestamp: new Date().toISOString(),
      state: updates,
      action: actionDescription || 'Update',
      description: actionDescription
    };

    const newHistory = [...history.slice(0, historyIndex + 1), historyEntry];
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }

    setHistory(newHistory);
    setCurrentProject(newState);
    setIsModified(true);

    // Update undo/redo availability
    setCanUndo(newHistory.length > 0);
    setCanRedo(false);

    // Save history
    ProjectStorage.saveHistory(newState.id, newHistory);

    return newState;
  }, [currentProject, history, historyIndex, maxHistorySize]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex <= 0 || !currentProject) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCanUndo(newIndex >= 0);
    setCanRedo(true);

    // Reconstruct state from history
    let reconstructedState = { ...currentProject };
    for (let i = 0; i <= newIndex; i++) {
      reconstructedState = { ...reconstructedState, ...history[i].state };
    }

    setCurrentProject(reconstructedState);
    setIsModified(true);
  }, [currentProject, history, historyIndex]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !currentProject) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCanUndo(true);
    setCanRedo(newIndex < history.length - 1);

    // Apply next history entry
    const nextEntry = history[newIndex];
    const newState = { ...currentProject, ...nextEntry.state };
    
    setCurrentProject(newState);
    setIsModified(true);
  }, [currentProject, history, historyIndex]);

  // Auto-save functionality
  useEffect(() => {
    if (!currentProject || !settings.autoSave || !isModified) return;

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      saveProject();
    }, settings.saveInterval);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [currentProject, isModified, settings.autoSave, settings.saveInterval, saveProject]);

  // Project management functions
  const createNewProject = useCallback((projectData?: Partial<ProjectState>) => {
    return initializeProject(projectData);
  }, [initializeProject]);

  const duplicateProject = useCallback((sourceProject?: ProjectState) => {
    const source = sourceProject || currentProject;
    if (!source) return null;

    const duplicated = {
      ...source,
      id: `project_${Date.now()}`,
      name: `${source.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1
    };

    return initializeProject(duplicated);
  }, [currentProject, initializeProject]);

  const deleteProject = useCallback((projectId: string) => {
    ProjectStorage.deleteProject(projectId);
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setHistory([]);
      setHistoryIndex(-1);
    }
  }, [currentProject]);

  const getAllProjects = useCallback(() => {
    return ProjectStorage.getAllProjects();
  }, []);

  // Export project data
  const exportProject = useCallback((format: 'json' | 'csv' = 'json') => {
    if (!currentProject) return null;

    const exportData = {
      ...currentProject,
      exportedAt: new Date().toISOString(),
      format
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }
    
    // CSV export would require flattening the data structure
    return JSON.stringify(exportData);
  }, [currentProject]);

  // Import project data
  const importProject = useCallback((data: string, format: 'json' = 'json') => {
    try {
      const projectData = JSON.parse(data);
      return initializeProject(projectData);
    } catch (error) {
      console.error('Failed to import project:', error);
      return null;
    }
  }, [initializeProject]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    ProjectStorage.saveSettings(updated);
  }, [settings]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  return {
    // Current state
    currentProject,
    isModified,
    isSaving,
    lastSaveTime,
    
    // History
    history,
    canUndo,
    canRedo,
    
    // Settings
    settings,
    
    // Project management
    initializeProject,
    loadProject,
    saveProject,
    createNewProject,
    duplicateProject,
    deleteProject,
    getAllProjects,
    
    // State updates
    updateProjectState,
    
    // History management
    undo,
    redo,
    
    // Import/Export
    exportProject,
    importProject,
    
    // Settings
    updateSettings
  };
};

export default useStructuralStateManager;