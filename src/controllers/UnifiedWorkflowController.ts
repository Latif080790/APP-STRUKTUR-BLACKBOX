/**
 * Unified Workflow Controller - Centralized State Management
 * Implements progressive data enhancement and validation gates
 */

interface WorkflowState {
  currentStage: 'geometry' | 'materials' | 'loads' | 'analysis' | 'results';
  validationStatus: {
    geometry: boolean;
    materials: boolean;
    loads: boolean;
    analysis: boolean;
  };
  dataIntegrity: {
    buildingGeometry: any;
    selectedMaterials: string[];
    loadCombinations: any[];
    analysisResults: any[];
  };
  progressTracking: {
    completedStages: string[];
    currentProgress: number;
    estimatedTimeRemaining: number;
  };
}

export class UnifiedWorkflowController {
  private state: WorkflowState;
  private subscribers: ((state: WorkflowState) => void)[] = [];

  constructor() {
    this.state = {
      currentStage: 'geometry',
      validationStatus: {
        geometry: false,
        materials: false,
        loads: false,
        analysis: false
      },
      dataIntegrity: {
        buildingGeometry: null,
        selectedMaterials: [],
        loadCombinations: [],
        analysisResults: []
      },
      progressTracking: {
        completedStages: [],
        currentProgress: 0,
        estimatedTimeRemaining: 0
      }
    };
  }

  // Validation Gates
  validateGeometry(geometry: any): boolean {
    const isValid = geometry && 
                   geometry.dimensions && 
                   geometry.grid && 
                   geometry.structural;
    
    this.updateValidationStatus('geometry', isValid);
    return isValid;
  }

  validateMaterials(materials: string[]): boolean {
    const isValid = materials.length > 0;
    this.updateValidationStatus('materials', isValid);
    return isValid;
  }

  // Progressive Data Enhancement
  enhanceDataProgression() {
    // Automatically enhance data quality as workflow progresses
    if (this.state.validationStatus.geometry && this.state.validationStatus.materials) {
      this.autoGenerateLoadCombinations();
    }
  }

  private autoGenerateLoadCombinations() {
    // Auto-generate SNI-compliant load combinations
    const sniLoadCombinations = [
      { name: "Ultimate - Dead", formula: "1.4D", factors: { dead: 1.4 } },
      { name: "Ultimate - Dead + Live", formula: "1.2D + 1.6L", factors: { dead: 1.2, live: 1.6 } },
      { name: "Seismic Combination", formula: "1.2D + 1.0L + 1.0E", factors: { dead: 1.2, live: 1.0, seismic: 1.0 } }
    ];
    
    this.state.dataIntegrity.loadCombinations = sniLoadCombinations;
    this.notifySubscribers();
  }

  // State Management
  subscribe(callback: (state: WorkflowState) => void) {
    this.subscribers.push(callback);
  }

  private updateValidationStatus(stage: keyof WorkflowState['validationStatus'], status: boolean) {
    this.state.validationStatus[stage] = status;
    this.updateProgress();
    this.notifySubscribers();
  }

  private updateProgress() {
    const completedCount = Object.values(this.state.validationStatus).filter(Boolean).length;
    this.state.progressTracking.currentProgress = (completedCount / 4) * 100;
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.state));
  }

  // Public API
  getState(): WorkflowState {
    return { ...this.state };
  }

  canProceedToStage(stage: WorkflowState['currentStage']): boolean {
    switch (stage) {
      case 'materials':
        return this.state.validationStatus.geometry;
      case 'loads':
        return this.state.validationStatus.geometry && this.state.validationStatus.materials;
      case 'analysis':
        return Object.values(this.state.validationStatus).slice(0, 3).every(Boolean);
      case 'results':
        return Object.values(this.state.validationStatus).every(Boolean);
      default:
        return true;
    }
  }
}

export const workflowController = new UnifiedWorkflowController();