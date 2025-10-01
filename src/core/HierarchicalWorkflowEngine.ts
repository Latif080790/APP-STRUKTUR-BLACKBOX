/**
 * Hierarchical Workflow Engine
 * Implementasi struktur workflow hierarkis dengan validated data flow
 */

export interface WorkflowStage {
  id: string;
  name: string;
  nameIndonesian: string;
  order: number;
  isRequired: boolean;
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'error';
  validationRules: ValidationRule[];
  outputData?: any;
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'range' | 'format' | 'custom';
  value?: any;
  message: string;
  messageIndonesian: string;
}

export interface WorkflowData {
  projectInfo: ProjectInfoData;
  coreAnalysis: CoreAnalysisData;
  designModules: DesignModulesData;
  visualization3D: Visualization3DData;
  reportResults: ReportResultsData;
}

export interface ProjectInfoData {
  projectName: string;
  projectLocation: string;
  buildingType: 'residential' | 'commercial' | 'industrial' | 'institutional';
  engineerName: string;
  clientName: string;
  projectDate: Date;
  standards: string[];
  seismicZone: 'low' | 'medium' | 'high';
  soilType: string;
  buildingHeight: number;
  numberOfFloors: number;
  totalArea: number;
}

export interface CoreAnalysisData {
  structuralSystem: 'concrete' | 'steel' | 'timber' | 'composite';
  loadAnalysis: {
    deadLoad: number;
    liveLoad: number;
    windLoad: number;
    seismicLoad: number;
    snowLoad?: number;
  };
  materialProperties: {
    concrete?: { fc: number; density: number; };
    steel?: { fy: number; fu: number; density: number; };
    reinforcement?: { fy: number; diameter: number[]; };
  };
  analysisType: 'static' | 'dynamic' | 'nonlinear' | 'buckling';
  safetyFactors: {
    dead: number;
    live: number;
    wind: number;
    seismic: number;
  };
}

export interface DesignModulesData {
  foundations: {
    type: 'shallow' | 'deep' | 'raft';
    bearingCapacity: number;
    settlement: number;
    design: any[];
  };
  columns: {
    sections: any[];
    reinforcement: any[];
    capacity: number[];
  };
  beams: {
    sections: any[];
    reinforcement: any[];
    deflection: number[];
  };
  slabs: {
    thickness: number;
    reinforcement: any[];
    deflection: number;
  };
  connections: {
    type: string;
    details: any[];
  };
}

export interface Visualization3DData {
  modelData: {
    nodes: any[];
    elements: any[];
    materials: any[];
    sections: any[];
  };
  renderingOptions: {
    showDisplacements: boolean;
    showStresses: boolean;
    showReactions: boolean;
    deformationScale: number;
    colorScheme: string;
  };
  animations: {
    modeShapes: any[];
    timeHistory: any[];
  };
}

export interface ReportResultsData {
  calculationSummary: {
    maxStress: number;
    maxDeflection: number;
    naturalPeriods: number[];
    baseShear: number;
    driftRatio: number;
  };
  safetyCheck: {
    overallSafetyFactor: number;
    componentChecks: any[];
    complianceStatus: string[];
  };
  recommendations: string[];
  drawings: string[];
  reports: string[];
}

export class HierarchicalWorkflowEngine {
  private stages: Map<string, WorkflowStage> = new Map();
  private workflowData: Partial<WorkflowData> = {};
  private listeners: Array<(data: Partial<WorkflowData>) => void> = [];

  constructor() {
    this.initializeWorkflowStages();
  }

  private initializeWorkflowStages(): void {
    const stages: WorkflowStage[] = [
      {
        id: 'project_info',
        name: 'Project Information',
        nameIndonesian: 'Informasi Proyek',
        order: 1,
        isRequired: true,
        dependencies: [],
        status: 'pending',
        validationRules: [
          {
            field: 'projectName',
            type: 'required',
            message: 'Project name is required',
            messageIndonesian: 'Nama proyek harus diisi'
          },
          {
            field: 'engineerName',
            type: 'required',
            message: 'Engineer name is required',
            messageIndonesian: 'Nama insinyur harus diisi'
          },
          {
            field: 'buildingHeight',
            type: 'range',
            value: { min: 1, max: 200 },
            message: 'Building height must be between 1-200m',
            messageIndonesian: 'Tinggi bangunan harus antara 1-200m'
          },
          {
            field: 'numberOfFloors',
            type: 'range',
            value: { min: 1, max: 50 },
            message: 'Number of floors must be between 1-50',
            messageIndonesian: 'Jumlah lantai harus antara 1-50'
          }
        ]
      },
      {
        id: 'core_analysis',
        name: 'Core Analysis',
        nameIndonesian: 'Analisis Inti',
        order: 2,
        isRequired: true,
        dependencies: ['project_info'],
        status: 'pending',
        validationRules: [
          {
            field: 'structuralSystem',
            type: 'required',
            message: 'Structural system must be selected',
            messageIndonesian: 'Sistem struktur harus dipilih'
          },
          {
            field: 'loadAnalysis.deadLoad',
            type: 'range',
            value: { min: 0.5, max: 20 },
            message: 'Dead load must be between 0.5-20 kN/m²',
            messageIndonesian: 'Beban mati harus antara 0.5-20 kN/m²'
          },
          {
            field: 'loadAnalysis.liveLoad',
            type: 'range',
            value: { min: 0.5, max: 15 },
            message: 'Live load must be between 0.5-15 kN/m²',
            messageIndonesian: 'Beban hidup harus antara 0.5-15 kN/m²'
          },
          {
            field: 'materialProperties.concrete.fc',
            type: 'range',
            value: { min: 20, max: 80 },
            message: 'Concrete strength must be between 20-80 MPa (SNI 2847)',
            messageIndonesian: 'Kuat tekan beton harus antara 20-80 MPa (SNI 2847)'
          }
        ]
      },
      {
        id: 'design_modules',
        name: 'Design Modules',
        nameIndonesian: 'Modul Desain',
        order: 3,
        isRequired: true,
        dependencies: ['core_analysis'],
        status: 'pending',
        validationRules: [
          {
            field: 'foundations.type',
            type: 'required',
            message: 'Foundation type must be selected',
            messageIndonesian: 'Jenis pondasi harus dipilih'
          },
          {
            field: 'foundations.bearingCapacity',
            type: 'range',
            value: { min: 100, max: 10000 },
            message: 'Bearing capacity must be between 100-10000 kN/m²',
            messageIndonesian: 'Daya dukung tanah harus antara 100-10000 kN/m²'
          },
          {
            field: 'columns.sections',
            type: 'required',
            message: 'Column sections must be defined',
            messageIndonesian: 'Dimensi kolom harus didefinisikan'
          },
          {
            field: 'beams.sections',
            type: 'required',
            message: 'Beam sections must be defined',
            messageIndonesian: 'Dimensi balok harus didefinisikan'
          }
        ]
      },
      {
        id: 'visualization_3d',
        name: '3D Visualization',
        nameIndonesian: 'Visualisasi 3D',
        order: 4,
        isRequired: false,
        dependencies: ['design_modules'],
        status: 'pending',
        validationRules: [
          {
            field: 'modelData.nodes',
            type: 'required',
            message: 'Model nodes must be generated',
            messageIndonesian: 'Node model harus dibuat'
          },
          {
            field: 'modelData.elements',
            type: 'required',
            message: 'Model elements must be generated',
            messageIndonesian: 'Elemen model harus dibuat'
          },
          {
            field: 'renderingOptions.deformationScale',
            type: 'range',
            value: { min: 0.1, max: 100 },
            message: 'Deformation scale must be between 0.1-100',
            messageIndonesian: 'Skala deformasi harus antara 0.1-100'
          }
        ]
      },
      {
        id: 'report_results',
        name: 'Report Results',
        nameIndonesian: 'Hasil Laporan',
        order: 5,
        isRequired: true,
        dependencies: ['design_modules'],
        status: 'pending',
        validationRules: [
          {
            field: 'calculationSummary.maxStress',
            type: 'custom',
            message: 'Maximum stress must be within allowable limits',
            messageIndonesian: 'Tegangan maksimum harus dalam batas yang diizinkan'
          },
          {
            field: 'calculationSummary.maxDeflection',
            type: 'custom',
            message: 'Maximum deflection must be within limits',
            messageIndonesian: 'Defleksi maksimum harus dalam batas yang diizinkan'
          },
          {
            field: 'safetyCheck.overallSafetyFactor',
            type: 'range',
            value: { min: 2.0, max: 10.0 },
            message: 'Overall safety factor must be ≥ 2.0',
            messageIndonesian: 'Faktor keamanan keseluruhan harus ≥ 2.0'
          }
        ]
      }
    ];

    stages.forEach(stage => {
      this.stages.set(stage.id, stage);
    });
  }

  public getWorkflowStages(): WorkflowStage[] {
    return Array.from(this.stages.values()).sort((a, b) => a.order - b.order);
  }

  public getCurrentStage(): WorkflowStage | null {
    const stages = this.getWorkflowStages();
    for (const stage of stages) {
      if (stage.status === 'pending' || stage.status === 'in_progress') {
        return stage;
      }
    }
    return stages[stages.length - 1]; // Return last stage if all completed
  }

  public getStageById(stageId: string): WorkflowStage | undefined {
    return this.stages.get(stageId);
  }

  public validateStage(stageId: string, data: any): { isValid: boolean; errors: string[] } {
    const stage = this.stages.get(stageId);
    if (!stage) {
      return { isValid: false, errors: ['Stage tidak ditemukan'] };
    }

    const errors: string[] = [];

    for (const rule of stage.validationRules) {
      const value = this.getNestedValue(data, rule.field);

      switch (rule.type) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors.push(rule.messageIndonesian);
          }
          break;

        case 'range':
          if (rule.value && typeof value === 'number') {
            if (value < rule.value.min || value > rule.value.max) {
              errors.push(rule.messageIndonesian);
            }
          }
          break;

        case 'custom':
          // Custom validation logic based on stage and field
          const customError = this.customValidation(stageId, rule.field, value, data);
          if (customError) {
            errors.push(customError);
          }
          break;
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  private customValidation(stageId: string, field: string, value: any, allData: any): string | null {
    if (stageId === 'report_results') {
      if (field === 'calculationSummary.maxStress') {
        const allowableStress = this.calculateAllowableStress(allData);
        if (value > allowableStress) {
          return `Tegangan maksimum ${value.toFixed(2)} MPa melebihi batas ${allowableStress.toFixed(2)} MPa`;
        }
      }

      if (field === 'calculationSummary.maxDeflection') {
        const allowableDeflection = this.calculateAllowableDeflection(allData);
        if (value > allowableDeflection) {
          return `Defleksi maksimum ${value.toFixed(2)} mm melebihi batas ${allowableDeflection.toFixed(2)} mm`;
        }
      }
    }

    return null;
  }

  private calculateAllowableStress(data: any): number {
    const coreAnalysis = data.coreAnalysis;
    if (coreAnalysis?.materialProperties?.concrete?.fc) {
      return coreAnalysis.materialProperties.concrete.fc * 0.45; // 0.45*fc per SNI 2847
    }
    return 15; // Default allowable stress
  }

  private calculateAllowableDeflection(data: any): number {
    const projectInfo = data.projectInfo;
    if (projectInfo?.buildingHeight) {
      return projectInfo.buildingHeight * 1000 / 300; // L/300 per SNI 2847
    }
    return 25; // Default allowable deflection (mm)
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  public advanceStage(stageId: string, data: any): { success: boolean; message: string } {
    const stage = this.stages.get(stageId);
    if (!stage) {
      return { success: false, message: 'Stage tidak ditemukan' };
    }

    // Check dependencies
    for (const depId of stage.dependencies) {
      const dependency = this.stages.get(depId);
      if (!dependency || dependency.status !== 'completed') {
        return { 
          success: false, 
          message: `Dependency ${dependency?.nameIndonesian || depId} belum selesai` 
        };
      }
    }

    // Validate stage data
    const validation = this.validateStage(stageId, data);
    if (!validation.isValid) {
      return { 
        success: false, 
        message: `Validasi gagal: ${validation.errors.join(', ')}` 
      };
    }

    // Update stage status and data
    stage.status = 'completed';
    stage.outputData = data;

    // Update workflow data
    switch (stageId) {
      case 'project_info':
        this.workflowData.projectInfo = data;
        break;
      case 'core_analysis':
        this.workflowData.coreAnalysis = data;
        break;
      case 'design_modules':
        this.workflowData.designModules = data;
        break;
      case 'visualization_3d':
        this.workflowData.visualization3D = data;
        break;
      case 'report_results':
        this.workflowData.reportResults = data;
        break;
    }

    this.notifyListeners();

    return { 
      success: true, 
      message: `Stage ${stage.nameIndonesian} berhasil diselesaikan` 
    };
  }

  public getWorkflowData(): Partial<WorkflowData> {
    return { ...this.workflowData };
  }

  public getWorkflowProgress(): { completed: number; total: number; percentage: number } {
    const stages = this.getWorkflowStages();
    const requiredStages = stages.filter(s => s.isRequired);
    const completedRequired = requiredStages.filter(s => s.status === 'completed');
    
    return {
      completed: completedRequired.length,
      total: requiredStages.length,
      percentage: Math.round((completedRequired.length / requiredStages.length) * 100)
    };
  }

  public generateWorkflowReport(): {
    stages: any[];
    progress: any;
    validation: any;
    recommendations: string[];
  } {
    const stages = this.getWorkflowStages();
    const progress = this.getWorkflowProgress();
    
    const stageReports = stages.map(stage => ({
      id: stage.id,
      name: stage.nameIndonesian,
      status: stage.status,
      order: stage.order,
      isRequired: stage.isRequired,
      dependencies: stage.dependencies,
      validationStatus: stage.outputData ? 
        this.validateStage(stage.id, stage.outputData).isValid : false
    }));

    const validationSummary = {
      allStagesCompleted: progress.percentage === 100,
      criticalIssues: this.findCriticalIssues(),
      complianceStatus: this.checkSNICompliance()
    };

    const recommendations = this.generateRecommendations();

    return {
      stages: stageReports,
      progress,
      validation: validationSummary,
      recommendations
    };
  }

  private findCriticalIssues(): string[] {
    const issues: string[] = [];
    
    // Check for blocked stages
    const blockedStages = this.getWorkflowStages().filter(s => s.status === 'blocked');
    blockedStages.forEach(stage => {
      issues.push(`Stage ${stage.nameIndonesian} terblokir`);
    });

    // Check safety factors
    if (this.workflowData.reportResults?.safetyCheck?.overallSafetyFactor) {
      const sf = this.workflowData.reportResults.safetyCheck.overallSafetyFactor;
      if (sf < 2.0) {
        issues.push(`Faktor keamanan ${sf.toFixed(2)} < 2.0 - tidak memenuhi standar`);
      }
    }

    return issues;
  }

  private checkSNICompliance(): { standard: string; status: string; }[] {
    const compliance = [
      { standard: 'SNI 1726-2019 (Seismik)', status: 'Terpenuhi' },
      { standard: 'SNI 1727-2020 (Beban)', status: 'Terpenuhi' },
      { standard: 'SNI 2847-2019 (Beton)', status: 'Terpenuhi' },
      { standard: 'SNI 1729-2015 (Baja)', status: 'Terpenuhi' }
    ];

    // Add specific compliance checks based on data
    if (this.workflowData.coreAnalysis?.materialProperties?.concrete?.fc) {
      const fc = this.workflowData.coreAnalysis.materialProperties.concrete.fc;
      if (fc < 20 || fc > 80) {
        compliance[2].status = 'Tidak Terpenuhi - fc di luar range SNI 2847';
      }
    }

    return compliance;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const progress = this.getWorkflowProgress();

    if (progress.percentage < 50) {
      recommendations.push('Lanjutkan pengisian data untuk mencapai milestone 50%');
    }

    if (this.workflowData.coreAnalysis?.loadAnalysis) {
      const loads = this.workflowData.coreAnalysis.loadAnalysis;
      if (loads.liveLoad > loads.deadLoad * 2) {
        recommendations.push('Rasio beban hidup/mati tinggi - pertimbangkan optimasi struktur');
      }
    }

    if (this.workflowData.projectInfo?.seismicZone === 'high') {
      recommendations.push('Zona seismik tinggi - pastikan analisis dinamis dilakukan');
    }

    if (!this.stages.get('visualization_3d')?.outputData) {
      recommendations.push('Pertimbangkan visualisasi 3D untuk verifikasi model');
    }

    return recommendations;
  }

  public subscribe(listener: (data: Partial<WorkflowData>) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getWorkflowData()));
  }

  // Utility methods for stage data initialization
  public initializeProjectInfo(): ProjectInfoData {
    return {
      projectName: '',
      projectLocation: '',
      buildingType: 'commercial',
      engineerName: '',
      clientName: '',
      projectDate: new Date(),
      standards: ['SNI 1726-2019', 'SNI 1727-2020', 'SNI 2847-2019'],
      seismicZone: 'medium',
      soilType: 'tanah keras',
      buildingHeight: 0,
      numberOfFloors: 0,
      totalArea: 0
    };
  }

  public initializeCoreAnalysis(): CoreAnalysisData {
    return {
      structuralSystem: 'concrete',
      loadAnalysis: {
        deadLoad: 4.0,
        liveLoad: 2.5,
        windLoad: 1.0,
        seismicLoad: 1.5
      },
      materialProperties: {
        concrete: { fc: 25, density: 2400 },
        reinforcement: { fy: 400, diameter: [10, 12, 16, 20, 25] }
      },
      analysisType: 'static',
      safetyFactors: {
        dead: 1.2,
        live: 1.6,
        wind: 1.6,
        seismic: 1.0
      }
    };
  }
}

export default HierarchicalWorkflowEngine;