/**
 * Enhanced Structural Analysis Types - SNI Compliant
 * Defines comprehensive data structures for structural analysis
 */

// Basic interfaces
export interface Node {
  id: string | number;
  x: number;
  y: number;
  z: number;
  type?: 'fixed' | 'pinned' | 'free' | 'roller' | 'spring';
  label?: string;
  supports?: {
    ux?: boolean;
    uy?: boolean;
    uz?: boolean;
    rx?: boolean;
    ry?: boolean;
    rz?: boolean;
  };
}

export interface Material {
  id: string;
  name: string;
  type: 'concrete' | 'steel' | 'timber' | 'masonry' | 'composite';
  density: number;
  elasticModulus: number;
  poissonsRatio: number;
  thermalExpansion: number;
  compressiveStrength?: number;
  tensileStrength?: number;
  yieldStrength?: number;
  ultimateStrength?: number;
  shearModulus?: number;
  sniCompliance: {
    standard: 'SNI-2847' | 'SNI-1729' | 'SNI-7973' | 'SNI-1728';
    grade: string;
    certified: boolean;
    certificationDate?: Date;
  };
  color?: string;
}

export interface Section {
  id: string;
  name: string;
  type: 'rectangular' | 'circular' | 'i-section' | 'h-section' | 'l-section' | 't-section' | 'channel' | 'hollow' | 'custom' | 'other';
  area: number;
  width?: number;
  height?: number;
  thickness?: number;
  momentOfInertiaY: number;
  momentOfInertiaZ: number;
  torsionalConstant: number;
  sectionModulusY: number;
  sectionModulusZ: number;
  radiusOfGyrationY: number;
  radiusOfGyrationZ: number;
  centroidY: number;
  centroidZ: number;
  shearCenterY: number;
  shearCenterZ: number;
  color?: string;
}

export interface Element {
  id: string | number;
  type: 'beam' | 'column' | 'brace' | 'slab' | 'wall' | 'truss' | 'shell' | 'solid';
  nodes: [string | number, string | number];
  material: Material;
  section: Section;
  length?: number;
  rotation?: number;
  forces?: {
    axial: number;
    shearY: number;
    shearZ: number;
    torsion: number;
    momentY: number;
    momentZ: number;
  };
  stresses?: {
    axial: number;
    shearY: number;
    shearZ: number;
    bendingY: number;
    bendingZ: number;
    vonMises: number;
  };
  label?: string;
  color?: string;
}

export interface Load {
  id: string;
  name: string;
  type: 'point' | 'distributed' | 'moment' | 'temperature' | 'settlement' | 'pressure';
  category: 'dead' | 'live' | 'wind' | 'seismic' | 'snow' | 'fluid' | 'construction' | 'impact';
  nodeId?: string | number;
  elementId?: string | number;
  magnitude: number;
  direction: {
    x?: number;
    y?: number;
    z?: number;
  };
  distribution?: {
    start: number;
    end: number;
    startMagnitude: number;
    endMagnitude: number;
  };
  loadFactors?: {
    strength: number;
    serviceability: number;
  };
  duration?: 'permanent' | 'long_term' | 'medium_term' | 'short_term' | 'instantaneous';
}

export interface Structure3D {
  nodes: Node[];
  elements: Element[];
  loads: Load[];
  materials: Material[];
  sections: Section[];
  loadCombinations: {
    id: string;
    name: string;
    type: 'strength' | 'serviceability';
    factors: { [loadCategory: string]: number };
    active: boolean;
  }[];
  analysisSettings: {
    type: 'static' | 'dynamic' | 'nonlinear' | 'buckling' | 'time_history';
    solver: 'direct' | 'iterative';
    convergence: {
      tolerance: number;
      maxIterations: number;
    };
  };
  modelInfo: {
    name: string;
    description?: string;
    engineer: string;
    company?: string;
    dateCreated: Date;
    dateModified: Date;
    version: string;
    units: {
      length: 'm' | 'mm' | 'cm' | 'ft' | 'in';
      force: 'N' | 'kN' | 'MN' | 'lbf' | 'kips';
      stress: 'Pa' | 'MPa' | 'GPa' | 'psi' | 'ksi';
      moment: 'N⋅m' | 'kN⋅m' | 'MN⋅m' | 'lbf⋅ft' | 'kips⋅ft';
    };
  };
}

export interface AnalysisResult {
  analysisInfo: {
    type: string;
    timestamp: Date;
    solutionTime: number;
    iterations?: number;
    converged: boolean;
    warnings: string[];
    errors: string[];
  };
  displacements: {
    nodeId: string | number;
    loadCombination: string;
    ux: number;
    uy: number;
    uz: number;
    rx: number;
    ry: number;
    rz: number;
  }[];
  reactions: {
    nodeId: string | number;
    loadCombination: string;
    fx: number;
    fy: number;
    fz: number;
    mx: number;
    my: number;
    mz: number;
  }[];
  elementForces: {
    elementId: string | number;
    loadCombination: string;
    position: number;
    nx: number;
    vy: number;
    vz: number;
    tx: number;
    my: number;
    mz: number;
  }[];
  elementStresses: {
    elementId: string | number;
    loadCombination: string;
    position: number;
    axialStress: number;
    shearStressY: number;
    shearStressZ: number;
    bendingStressY: number;
    bendingStressZ: number;
    vonMisesStress: number;
  }[];
  summary: {
    maxDisplacement: {
      value: number;
      nodeId: string | number;
      direction: 'ux' | 'uy' | 'uz' | 'rx' | 'ry' | 'rz';
      loadCombination: string;
    };
    maxStress: {
      value: number;
      elementId: string | number;
      type: 'axial' | 'shear' | 'bending' | 'vonMises';
      loadCombination: string;
    };
  };
  isValid: boolean;
}

// Compliance interfaces
export interface ComplianceResult {
  isCompliant: boolean;
  requirements: string[];
  violations: string[];
  warnings: string[];
}

export interface ElementSafetyCheck {
  elementId: string;
  safetyFactor: number;
  utilizationRatio: number;
  criticalCondition: string;
  recommendations: string[];
}

export interface OptimizationSuggestion {
  type: 'material' | 'geometry' | 'reinforcement';
  description: string;
  expectedImprovement: number;
  priority: 'low' | 'medium' | 'high';
}

export interface UnifiedAnalysisResult {
  id: string;
  timestamp: Date;
  structureId: string;
  analysisType: 'static' | 'dynamic' | 'nonlinear' | 'modal' | 'buckling';
  solutionTime: number;
  converged: boolean;
  warnings: string[];
  errors: string[];
  maxDisplacement: {
    value: number;
    nodeId: string | number;
    direction: 'ux' | 'uy' | 'uz' | 'rx' | 'ry' | 'rz';
    loadCombination: string;
  };
  maxStress: {
    value: number;
    elementId: string | number;
    type: 'axial' | 'shear' | 'bending' | 'vonMises';
    loadCombination: string;
  };
  displacements: {
    nodeId: string | number;
    loadCombination: string;
    ux: number;
    uy: number;
    uz: number;
    rx: number;
    ry: number;
    rz: number;
  }[];
  elementForces: {
    elementId: string | number;
    loadCombination: string;
    position: number;
    nx: number;
    vy: number;
    vz: number;
    tx: number;
    my: number;
    mz: number;
  }[];
  elementStresses: {
    elementId: string | number;
    loadCombination: string;
    position: number;
    axialStress: number;
    shearStressY: number;
    shearStressZ: number;
    bendingStressY: number;
    bendingStressZ: number;
    vonMisesStress: number;
  }[];
  reactions: {
    nodeId: string | number;
    loadCombination: string;
    fx: number;
    fy: number;
    fz: number;
    mx: number;
    my: number;
    mz: number;
  }[];
  stresses?: {
    elementId: string | number;
    loadCombination: string;
    stress: number;
    type: string;
  }[];
  summary: {
    totalElements: number;
    totalNodes: number;
    totalLoads: number;
    convergenceIterations?: number;
    solutionMethod: string;
  };
  // Enhanced properties with compliance checking
  compliance?: {
    sni: {
      sni1726: ComplianceResult;
      sni1727: ComplianceResult;
      sni2847: ComplianceResult;
      sni1729: ComplianceResult;
    };
    international: {
      aci318?: ComplianceResult;
      aisc?: ComplianceResult;
      eurocode?: ComplianceResult;
      asce7?: ComplianceResult;
    };
  };
  safetyCheck?: {
    overallSafetyFactor: number;
    elementSafetyFactors: ElementSafetyCheck[];
    criticalElements: string[];
    recommendations: string[];
  };
  performance?: {
    solutionTime: number;
    memoryUsage: number;
    matrixSize: number;
    convergenceInfo: any;
  };
  designOptimization?: {
    materialEfficiency: number;
    structuralEfficiency: number;
    costOptimization: number;
    suggestions: OptimizationSuggestion[];
  };
  isValid: boolean;
}

export interface StructuralElement {
  id: string;
  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation' | 'truss' | 'brace';
  material: Material;
  section: Section;
  length?: number;
  width?: number;
  height?: number;
  thickness?: number;
  loads: Load[];
  forces?: {
    axial: number;
    shear: number;
    moment: number;
  };
  stresses?: {
    axial: number;
    shear: number;
    bending: number;
    combined: number;
  };
  designCheck?: {
    utilisationRatio: number;
    safetyFactor: number;
    passed: boolean;
    standard: string;
    recommendations?: string[];
  };
}

// SNI Load Combinations interface
export interface SNILoadCombinations {
  combination1: {
    name: '1.4D';
    factors: { dead: 1.4; live: 0; wind: 0; seismic: 0 };
  };
  combination2: {
    name: '1.2D + 1.6L';
    factors: { dead: 1.2; live: 1.6; wind: 0; seismic: 0 };
  };
  combination3: {
    name: '1.2D + 1.0L + 1.0W';
    factors: { dead: 1.2; live: 1.0; wind: 1.0; seismic: 0 };
  };
  combination4: {
    name: '1.2D + 1.0L + 1.0E';
    factors: { dead: 1.2; live: 1.0; wind: 0; seismic: 1.0 };
  };
  combination5: {
    name: '0.9D + 1.0W';
    factors: { dead: 0.9; live: 0; wind: 1.0; seismic: 0 };
  };
  combination6: {
    name: '0.9D + 1.0E';
    factors: { dead: 0.9; live: 0; wind: 0; seismic: 1.0 };
  };
  lrfd?: {
    name: string;
    factors: { [key: string]: number };
  };
}