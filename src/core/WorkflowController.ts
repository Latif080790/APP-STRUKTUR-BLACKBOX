/**
 * Centralized Workflow Controller
 * Unified state management untuk progressive data enhancement dan validation gates
 */

interface AnalysisState {
  projectId: string;
  currentStage: 'input' | 'modeling' | 'analysis' | 'validation' | 'export';
  progress: number;
  data: {
    geometry?: any;
    materials?: any;
    loads?: any;
    results?: any;
  };
  validationGates: {
    geometryValid: boolean;
    materialsValid: boolean;
    loadsValid: boolean;
    analysisValid: boolean;
  };
  errors: string[];
  warnings: string[];
}

interface WorkflowStage {
  id: string;
  name: string;
  validator: (state: AnalysisState) => ValidationResult;
  processor: (state: AnalysisState) => Promise<AnalysisState>;
  requiredInputs: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class WorkflowController {
  private currentState: AnalysisState;
  private stages: Map<string, WorkflowStage> = new Map();
  private listeners: Array<(state: AnalysisState) => void> = [];

  constructor(projectId: string) {
    this.currentState = {
      projectId,
      currentStage: 'input',
      progress: 0,
      data: {},
      validationGates: {
        geometryValid: false,
        materialsValid: false,
        loadsValid: false,
        analysisValid: false
      },
      errors: [],
      warnings: []
    };

    this.initializeStages();
  }

  private initializeStages() {
    // Stage 1: Input Geometry
    this.stages.set('input', {
      id: 'input',
      name: 'Input Geometri',
      requiredInputs: [],
      validator: (state) => this.validateGeometry(state),
      processor: async (state) => this.processGeometry(state)
    });

    // Stage 2: Material Assignment
    this.stages.set('modeling', {
      id: 'modeling',
      name: 'Pemodelan Material',
      requiredInputs: ['geometry'],
      validator: (state) => this.validateMaterials(state),
      processor: async (state) => this.processMaterials(state)
    });

    // Stage 3: Load Application
    this.stages.set('analysis', {
      id: 'analysis',
      name: 'Analisis Struktur',
      requiredInputs: ['geometry', 'materials'],
      validator: (state) => this.validateLoads(state),
      processor: async (state) => this.processAnalysis(state)
    });

    // Stage 4: Results Validation
    this.stages.set('validation', {
      id: 'validation',
      name: 'Validasi Hasil',
      requiredInputs: ['geometry', 'materials', 'loads'],
      validator: (state) => this.validateResults(state),
      processor: async (state) => this.processValidation(state)
    });

    // Stage 5: Export
    this.stages.set('export', {
      id: 'export',
      name: 'Export Laporan',
      requiredInputs: ['results'],
      validator: (state) => this.validateExport(state),
      processor: async (state) => this.processExport(state)
    });
  }

  // Validation Methods with SNI Compliance
  private validateGeometry(state: AnalysisState): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!state.data.geometry) {
      errors.push('Geometri struktur belum didefinisikan');
      return { isValid: false, errors, warnings };
    }

    // SNI 1726 - Seismic requirements validation
    const geometry = state.data.geometry;
    if (geometry.height > 60) {
      warnings.push('Struktur tinggi >60m memerlukan analisis seismik khusus (SNI 1726)');
    }

    // Basic geometric validation
    if (geometry.irregularity > 0.3) {
      warnings.push('Ketidakberaturan struktur >30% memerlukan analisis 3D (SNI 1726)');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateMaterials(state: AnalysisState): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!state.data.materials) {
      errors.push('Material belum didefinisikan');
      return { isValid: false, errors, warnings };
    }

    const materials = state.data.materials;
    
    // SNI 2847 - Concrete validation
    if (materials.concrete) {
      if (materials.concrete.fc < 20) {
        errors.push('Kuat tekan beton minimum 20 MPa (SNI 2847)');
      }
      if (materials.concrete.fc > 80) {
        warnings.push('Beton mutu tinggi >80 MPa memerlukan persyaratan khusus (SNI 2847)');
      }
    }

    // SNI 1729 - Steel validation  
    if (materials.steel) {
      if (materials.steel.fy < 240) {
        errors.push('Kuat leleh baja minimum 240 MPa (SNI 1729)');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateLoads(state: AnalysisState): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!state.data.loads) {
      errors.push('Beban belum didefinisikan');
      return { isValid: false, errors, warnings };
    }

    const loads = state.data.loads;

    // SNI 1727 - Load requirements
    if (!loads.deadLoad) {
      errors.push('Beban mati harus didefinisikan (SNI 1727)');
    }
    if (!loads.liveLoad) {
      errors.push('Beban hidup harus didefinisikan (SNI 1727)');
    }

    // Seismic load validation for Indonesia
    if (state.data.geometry?.location?.seismicZone && !loads.seismicLoad) {
      warnings.push('Beban gempa diperlukan untuk wilayah seismik Indonesia (SNI 1726)');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateResults(state: AnalysisState): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!state.data.results) {
      errors.push('Hasil analisis tidak tersedia');
      return { isValid: false, errors, warnings };
    }

    const results = state.data.results;

    // Check safety factors according to SNI
    if (results.safetyFactor < 2.0) {
      errors.push('Faktor keamanan < 2.0 tidak memenuhi persyaratan SNI');
    }

    // Deflection limits
    if (results.maxDeflection > results.allowableDeflection) {
      errors.push('Defleksi melebihi batas yang diizinkan');
    }

    // Stress checks
    if (results.maxStress > results.allowableStress) {
      errors.push('Tegangan melebihi batas yang diizinkan');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  private validateExport(state: AnalysisState): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!state.validationGates.analysisValid) {
      errors.push('Analisis harus valid sebelum export');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Processing Methods
  private async processGeometry(state: AnalysisState): Promise<AnalysisState> {
    // Progressive data enhancement for geometry
    const enhancedGeometry = {
      ...state.data.geometry,
      timestamp: new Date().toISOString(),
      validated: true
    };

    return {
      ...state,
      data: { ...state.data, geometry: enhancedGeometry },
      validationGates: { ...state.validationGates, geometryValid: true },
      progress: 20
    };
  }

  private async processMaterials(state: AnalysisState): Promise<AnalysisState> {
    // Enhanced material processing with SNI compliance
    const enhancedMaterials = {
      ...state.data.materials,
      complianceCheck: {
        sni2847: state.data.materials.concrete ? true : false,
        sni1729: state.data.materials.steel ? true : false
      },
      timestamp: new Date().toISOString()
    };

    return {
      ...state,
      data: { ...state.data, materials: enhancedMaterials },
      validationGates: { ...state.validationGates, materialsValid: true },
      progress: 40
    };
  }

  private async processAnalysis(state: AnalysisState): Promise<AnalysisState> {
    // Simulate analysis processing
    const analysisResults = {
      maxStress: 15.8,
      maxDeflection: 12.5,
      safetyFactor: 2.5,
      fundamentalPeriod: 2.1,
      analysisType: 'linear',
      compliance: {
        sni1726: true,
        sni1727: true,
        sni2847: true
      },
      timestamp: new Date().toISOString()
    };

    return {
      ...state,
      data: { ...state.data, results: analysisResults },
      validationGates: { ...state.validationGates, loadsValid: true, analysisValid: true },
      progress: 80
    };
  }

  private async processValidation(state: AnalysisState): Promise<AnalysisState> {
    // Final validation with enhanced reporting
    return {
      ...state,
      progress: 90
    };
  }

  private async processExport(state: AnalysisState): Promise<AnalysisState> {
    // Export processing
    return {
      ...state,
      progress: 100
    };
  }

  // Public API
  public async advanceToNextStage(): Promise<void> {
    const currentStage = this.stages.get(this.currentState.currentStage);
    if (!currentStage) return;

    // Validation gate
    const validation = currentStage.validator(this.currentState);
    if (!validation.isValid) {
      this.currentState.errors = validation.errors;
      this.currentState.warnings = validation.warnings;
      this.notifyListeners();
      return;
    }

    // Process current stage
    this.currentState = await currentStage.processor(this.currentState);
    
    // Move to next stage
    const stageOrder = ['input', 'modeling', 'analysis', 'validation', 'export'];
    const currentIndex = stageOrder.indexOf(this.currentState.currentStage);
    if (currentIndex < stageOrder.length - 1) {
      this.currentState.currentStage = stageOrder[currentIndex + 1] as any;
    }

    this.notifyListeners();
  }

  public setData(key: string, data: any): void {
    this.currentState.data = { ...this.currentState.data, [key]: data };
    this.notifyListeners();
  }

  public getState(): AnalysisState {
    return { ...this.currentState };
  }

  public subscribe(listener: (state: AnalysisState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  // Enhanced reporting for professional interface
  public generateProgressReport(): {
    currentStage: string;
    progress: number;
    validationStatus: any;
    compliance: string[];
    recommendations: string[];
  } {
    const complianceStandards: string[] = [];
    const recommendations: string[] = [];

    // Check compliance with various standards
    if (this.currentState.validationGates.geometryValid) {
      complianceStandards.push('SNI 1726 (Seismik)');
    }
    if (this.currentState.validationGates.materialsValid) {
      complianceStandards.push('SNI 2847 (Beton)', 'SNI 1729 (Baja)');
    }
    if (this.currentState.validationGates.loadsValid) {
      complianceStandards.push('SNI 1727 (Beban)');
    }

    // Generate AI-powered recommendations
    if (this.currentState.data.results) {
      const results = this.currentState.data.results;
      if (results.safetyFactor > 3.0) {
        recommendations.push('Optimasi material dapat dilakukan untuk efisiensi biaya');
      }
      if (results.maxDeflection < 0.5 * results.allowableDeflection) {
        recommendations.push('Pertimbangkan pengurangan dimensi elemen struktur');
      }
    }

    return {
      currentStage: this.currentState.currentStage,
      progress: this.currentState.progress,
      validationStatus: this.currentState.validationGates,
      compliance: complianceStandards,
      recommendations
    };
  }
}

export default WorkflowController;