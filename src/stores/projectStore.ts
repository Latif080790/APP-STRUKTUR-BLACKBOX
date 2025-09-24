/**
 * Centralized Project Store with Auto-Save and Crash Recovery
 * Using Zustand for state management with localStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { Geometry, MaterialProperties, SeismicParameters, AnalysisResult, Structure3D, Loads } from '@/components/structural-analysis/interfaces';

// Project data structure
export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  lastModified: string;
  version: string;
  
  // Core data
  geometry: Geometry;
  materials: MaterialProperties;
  loads: Loads;
  seismicParams: SeismicParameters;
  
  // Analysis results
  analysisResults?: AnalysisResult;
  structure3D?: Structure3D;
  
  // UI state
  activeTab?: string;
  isAnalyzing?: boolean;
  validationErrors?: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
}

// Auto-save configuration
interface AutoSaveConfig {
  enabled: boolean;
  intervalMs: number;
  maxBackups: number;
}

// Store state interface
interface ProjectStoreState {
  // Current project
  currentProject: ProjectData | null;
  projects: Record<string, ProjectData>;
  
  // Auto-save configuration
  autoSave: AutoSaveConfig;
  lastSaved: string | null;
  isDirty: boolean;
  
  // Recovery state
  hasCorruptData: boolean;
  recoveryData: ProjectData | null;
  
  // Actions
  createProject: (name: string, description?: string) => string;
  loadProject: (id: string) => boolean;
  updateProject: (updates: Partial<Omit<ProjectData, 'id' | 'createdAt'>>) => void;
  saveProject: () => void;
  deleteProject: (id: string) => void;
  
  // Geometry updates
  updateGeometry: (geometry: Partial<Geometry>) => void;
  updateMaterials: (materials: Partial<MaterialProperties>) => void;
  updateLoads: (loads: Partial<Loads>) => void;
  updateSeismic: (seismic: Partial<SeismicParameters>) => void;
  
  // Analysis updates
  updateAnalysisResults: (results: AnalysisResult) => void;
  updateStructure3D: (structure: Structure3D) => void;
  
  // UI state
  setActiveTab: (tab: string) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setValidationErrors: (errors: Array<{ field: string; message: string; severity: 'error' | 'warning' | 'info' }>) => void;
  
  // Auto-save management
  enableAutoSave: (enabled: boolean) => void;
  triggerSave: () => void;
  
  // Recovery
  checkForCorruption: () => boolean;
  recoverFromBackup: () => boolean;
  clearRecovery: () => void;
}

// Default project template
const createDefaultProject = (name: string, description?: string): ProjectData => ({
  id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  description,
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  version: '1.0.0',
  
  geometry: {
    length: 20,
    width: 15,
    heightPerFloor: 3.5,
    numberOfFloors: 3,
    baySpacingX: 5,
    baySpacingY: 5,
    columnGridX: 4,
    columnGridY: 3
  },
  
  materials: {
    fc: 25,
    ec: 4700 * Math.sqrt(25),
    poissonConcrete: 0.2,
    densityConcrete: 2400,
    fy: 400,
    fu: 550,
    es: 200000,
    fySteel: 250,
    fuSteel: 410,
    crackingMoment: 0,
    effectiveMomentInertia: 0
  },
  
  loads: {
    deadLoad: 5,
    liveLoad: 4,
    roofLiveLoad: 1,
    partitionLoad: 1,
    claddingLoad: 0.5,
    windSpeed: 30
  },
  
  seismicParams: {
    ss: 0.8,
    s1: 0.3,
    fa: 1.2,
    fv: 1.8,
    sds: 0,
    sd1: 0,
    siteClass: 'SD',
    importance: 1.0,
    r: 8,
    cd: 5.5,
    omega: 3,
    tl: 12,
    ts: 0,
    t0: 0,
    isSeismic: true,
    zoneFactor: 0.3,
    soilType: 'Sedang',
    responseModifier: 6.5,
    category: 'C'
  },
  
  activeTab: 'input',
  isAnalyzing: false,
  validationErrors: []
});

// Validation function for corrupt data
const validateProjectData = (data: any): data is ProjectData => {
  if (!data || typeof data !== 'object') return false;
  
  const required = ['id', 'name', 'createdAt', 'lastModified', 'geometry', 'materials', 'loads', 'seismicParams'];
  for (const field of required) {
    if (!(field in data)) return false;
  }
  
  // Validate geometry
  if (!data.geometry || typeof data.geometry.length !== 'number' || data.geometry.length <= 0) return false;
  if (typeof data.geometry.width !== 'number' || data.geometry.width <= 0) return false;
  if (typeof data.geometry.heightPerFloor !== 'number' || data.geometry.heightPerFloor <= 0) return false;
  
  // Validate materials
  if (!data.materials || typeof data.materials.fc !== 'number' || data.materials.fc <= 0) return false;
  if (typeof data.materials.fy !== 'number' || data.materials.fy <= 0) return false;
  
  return true;
};

// Create store with persistence and auto-save
export const useProjectStore = create<ProjectStoreState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        currentProject: null,
        projects: {},
        autoSave: {
          enabled: true,
          intervalMs: 30000, // 30 seconds
          maxBackups: 5
        },
        lastSaved: null,
        isDirty: false,
        hasCorruptData: false,
        recoveryData: null,

        // Create new project
        createProject: (name: string, description?: string) => {
          const project = createDefaultProject(name, description);
          set(state => ({
            currentProject: project,
            projects: {
              ...state.projects,
              [project.id]: project
            },
            isDirty: false,
            lastSaved: new Date().toISOString()
          }));
          return project.id;
        },

        // Load existing project
        loadProject: (id: string) => {
          const state = get();
          const project = state.projects[id];
          if (project && validateProjectData(project)) {
            set({ currentProject: project, isDirty: false });
            return true;
          }
          return false;
        },

        // Update current project
        updateProject: (updates) => {
          set(state => {
            if (!state.currentProject) return state;
            
            const updatedProject = {
              ...state.currentProject,
              ...updates,
              lastModified: new Date().toISOString()
            };

            return {
              currentProject: updatedProject,
              projects: {
                ...state.projects,
                [updatedProject.id]: updatedProject
              },
              isDirty: true
            };
          });
        },

        // Save current project
        saveProject: () => {
          set(state => {
            if (!state.currentProject) return state;
            
            return {
              projects: {
                ...state.projects,
                [state.currentProject.id]: state.currentProject
              },
              isDirty: false,
              lastSaved: new Date().toISOString()
            };
          });
        },

        // Delete project
        deleteProject: (id: string) => {
          set(state => {
            const newProjects = { ...state.projects };
            delete newProjects[id];
            
            return {
              projects: newProjects,
              currentProject: state.currentProject?.id === id ? null : state.currentProject
            };
          });
        },

        // Geometry updates
        updateGeometry: (geometry) => {
          const state = get();
          if (!state.currentProject) return;
          
          state.updateProject({
            geometry: { ...state.currentProject.geometry, ...geometry }
          });
        },

        // Materials updates
        updateMaterials: (materials) => {
          const state = get();
          if (!state.currentProject) return;
          
          state.updateProject({
            materials: { ...state.currentProject.materials, ...materials }
          });
        },

        // Loads updates
        updateLoads: (loads) => {
          const state = get();
          if (!state.currentProject) return;
          
          state.updateProject({
            loads: { ...state.currentProject.loads, ...loads }
          });
        },

        // Seismic updates
        updateSeismic: (seismic) => {
          const state = get();
          if (!state.currentProject) return;
          
          state.updateProject({
            seismicParams: { ...state.currentProject.seismicParams, ...seismic }
          });
        },

        // Analysis results
        updateAnalysisResults: (results) => {
          const state = get();
          state.updateProject({ analysisResults: results });
        },

        // 3D Structure
        updateStructure3D: (structure) => {
          const state = get();
          state.updateProject({ structure3D: structure });
        },

        // UI state updates
        setActiveTab: (tab) => {
          const state = get();
          state.updateProject({ activeTab: tab });
        },

        setAnalyzing: (analyzing) => {
          const state = get();
          state.updateProject({ isAnalyzing: analyzing });
        },

        setValidationErrors: (errors) => {
          const state = get();
          state.updateProject({ validationErrors: errors });
        },

        // Auto-save management
        enableAutoSave: (enabled) => {
          set(state => ({
            autoSave: { ...state.autoSave, enabled }
          }));
        },

        triggerSave: () => {
          const state = get();
          if (state.isDirty && state.currentProject) {
            state.saveProject();
          }
        },

        // Recovery functions
        checkForCorruption: () => {
          try {
            const stored = localStorage.getItem('project-store');
            if (!stored) return false;
            
            const parsed = JSON.parse(stored);
            if (!parsed.state || !parsed.state.projects) return false;
            
            // Check if any project data is corrupted
            for (const projectId in parsed.state.projects) {
              const project = parsed.state.projects[projectId];
              if (!validateProjectData(project)) {
                set({ hasCorruptData: true, recoveryData: project });
                return true;
              }
            }
            
            return false;
          } catch (error) {
            console.error('Corruption check failed:', error);
            set({ hasCorruptData: true });
            return true;
          }
        },

        recoverFromBackup: () => {
          try {
            // Try to recover from backup in localStorage
            const backups = Object.keys(localStorage)
              .filter(key => key.startsWith('project-backup-'))
              .sort()
              .reverse();
            
            for (const backupKey of backups) {
              try {
                const backup = localStorage.getItem(backupKey);
                if (backup) {
                  const parsed = JSON.parse(backup);
                  if (validateProjectData(parsed)) {
                    set({
                      currentProject: parsed,
                      projects: { [parsed.id]: parsed },
                      hasCorruptData: false,
                      recoveryData: null,
                      isDirty: false
                    });
                    return true;
                  }
                }
              } catch (e) {
                continue;
              }
            }
            
            // If no backup works, create default project
            const defaultProject = createDefaultProject('Recovered Project', 'Project recovered from corruption');
            set({
              currentProject: defaultProject,
              projects: { [defaultProject.id]: defaultProject },
              hasCorruptData: false,
              recoveryData: null,
              isDirty: false
            });
            
            return true;
          } catch (error) {
            console.error('Recovery failed:', error);
            return false;
          }
        },

        clearRecovery: () => {
          set({ hasCorruptData: false, recoveryData: null });
        }
      }),
      {
        name: 'project-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          projects: state.projects,
          currentProject: state.currentProject,
          autoSave: state.autoSave
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Check for corruption after rehydration
            setTimeout(() => {
              state.checkForCorruption();
            }, 100);
          }
        }
      }
    )
  )
);

// Auto-save setup with debouncing
let autoSaveTimer: NodeJS.Timeout | null = null;

// Subscribe to state changes for auto-save
useProjectStore.subscribe(
  (state) => state.isDirty,
  (isDirty) => {
    if (isDirty && useProjectStore.getState().autoSave.enabled) {
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new timer
      autoSaveTimer = setTimeout(() => {
        const state = useProjectStore.getState();
        if (state.isDirty && state.currentProject) {
          // Create backup before saving
          try {
            const backupKey = `project-backup-${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(state.currentProject));
            
            // Clean old backups
            const backups = Object.keys(localStorage)
              .filter(key => key.startsWith('project-backup-'))
              .sort();
            
            while (backups.length > state.autoSave.maxBackups) {
              const oldestBackup = backups.shift();
              if (oldestBackup) {
                localStorage.removeItem(oldestBackup);
              }
            }
          } catch (error) {
            console.warn('Failed to create backup:', error);
          }
          
          // Trigger save
          state.triggerSave();
          console.log('Auto-saved project at', new Date().toISOString());
        }
      }, useProjectStore.getState().autoSave.intervalMs);
    }
  }
);

// Export utility hooks
export const useCurrentProject = () => useProjectStore(state => state.currentProject);
export const useProjectList = () => useProjectStore(state => Object.values(state.projects));
export const useAutoSave = () => useProjectStore(state => ({ 
  enabled: state.autoSave.enabled,
  lastSaved: state.lastSaved,
  isDirty: state.isDirty
}));
export const useRecovery = () => useProjectStore(state => ({
  hasCorruptData: state.hasCorruptData,
  recoveryData: state.recoveryData,
  recoverFromBackup: state.recoverFromBackup,
  clearRecovery: state.clearRecovery
}));