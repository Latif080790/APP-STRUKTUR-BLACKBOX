/**
 * Comprehensive TypeScript Interfaces for Structural Analysis System
 * Following Indonesian SNI Standards and International Best Practices
 */

// ============ BASE TYPES ============
export type LoadCombination = 'ultimate' | 'serviceability' | 'seismic';
export type StructuralMaterial = 'concrete' | 'steel' | 'composite';
export type AnalysisType = 'static' | 'dynamic' | 'seismic' | 'wind';
export type ElementType = 'beam' | 'column' | 'slab' | 'wall' | 'foundation';

// ============ PROJECT INFORMATION ============
export interface ProjectInfo {
  id: string;
  name: string;
  location: string;
  engineer: string;
  company?: string;
  description?: string;
  buildingType: 'residential' | 'office' | 'commercial' | 'industrial' | 'public';
  importanceClass: 'I' | 'II' | 'III' | 'IV'; // SNI 1726:2019
  designLife: number; // years
  createdAt: Date;
  updatedAt: Date;
}

// ============ GEOMETRY DEFINITIONS ============
export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface StructuralGeometry {
  buildingDimensions: Dimensions;
  floorHeight: number;
  numberOfFloors: number;
  baysX: number;
  baysY: number;
  baySpacingX: number[];
  baySpacingY: number[];
  setbacks?: {
    floor: number;
    dimensions: Dimensions;
  }[];
}

// ============ MATERIAL PROPERTIES ============
export interface ConcreteProperties {
  fc: number; // MPa - compressive strength
  ec: number; // MPa - elastic modulus
  density: number; // kg/m³
  poissonRatio: number;
  creepCoefficient?: number;
  shrinkageStrain?: number;
  grade: string; // e.g., "K-300", "K-350"
}

export interface SteelProperties {
  fy: number; // MPa - yield strength
  fu: number; // MPa - ultimate strength
  es: number; // MPa - elastic modulus
  density: number; // kg/m³
  poissonRatio: number;
  grade: string; // e.g., "BjTP280", "BjTS400"
}

export interface MaterialProperties {
  concrete: ConcreteProperties;
  reinforcement: SteelProperties;
  structural: SteelProperties;
}

// ============ LOADS DEFINITION ============
export interface LoadCase {
  id: string;
  name: string;
  type: 'dead' | 'live' | 'seismic' | 'wind' | 'temperature' | 'other';
  magnitude: number;
  unit: 'kN/m²' | 'kN/m' | 'kN' | 'MPa';
  distribution: 'uniform' | 'point' | 'linear' | 'triangular';
  applicationArea?: string; // description
}

export interface SeismicParameters {
  // SNI 1726:2019 parameters
  ss: number; // Short period spectral acceleration
  s1: number; // 1-second period spectral acceleration
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  responseModificationFactor: number; // R
  overstrengthFactor: number; // Ωo
  deflectionAmplificationFactor: number; // Cd
  seismicDesignCategory: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  structuralSystem: string;
}

export interface WindParameters {
  // SNI 1727:2020 parameters
  basicWindSpeed: number; // m/s
  exposureCategory: 'A' | 'B' | 'C' | 'D';
  topographicFactor: number;
  directionality: number;
  importanceFactor: number;
}

export interface LoadCombinations {
  combinations: {
    id: string;
    name: string;
    factors: { [loadCaseId: string]: number };
    type: LoadCombination;
  }[];
}

// ============ STRUCTURAL ELEMENTS ============
export interface Section {
  id: string;
  name: string;
  type: ElementType;
  dimensions: {
    width: number;
    height: number;
    thickness?: number; // for slabs/walls
  };
  reinforcement?: {
    longitudinal: {
      topBars: { diameter: number; count: number; spacing?: number }[];
      bottomBars: { diameter: number; count: number; spacing?: number }[];
    };
    transverse: {
      diameter: number;
      spacing: number;
      configuration: 'ties' | 'spirals' | 'hoops';
    };
  };
}

export interface Node {
  id: string;
  coordinates: Point3D;
  restraints: {
    dx: boolean;
    dy: boolean;
    dz: boolean;
    rx: boolean;
    ry: boolean;
    rz: boolean;
  };
  loads?: {
    forces: Point3D;
    moments: Point3D;
  };
}

export interface Element {
  id: string;
  type: ElementType;
  nodes: [string, string]; // node IDs
  section: Section;
  material: StructuralMaterial;
  releases?: {
    startNode: { [dof: string]: boolean };
    endNode: { [dof: string]: boolean };
  };
  loads?: LoadCase[];
}

export interface StructuralModel {
  nodes: Node[];
  elements: Element[];
  sections: Section[];
  materials: MaterialProperties;
  loadCases: LoadCase[];
  loadCombinations: LoadCombinations;
}

// ============ ANALYSIS RESULTS ============
export interface NodeResults {
  nodeId: string;
  displacements: Point3D;
  rotations: Point3D;
  reactions?: {
    forces: Point3D;
    moments: Point3D;
  };
}

export interface ElementResults {
  elementId: string;
  forces: {
    axial: number[];
    shearY: number[];
    shearZ: number[];
    torsion: number[];
    momentY: number[];
    momentZ: number[];
  };
  stresses: {
    axial: number[];
    shear: number[];
    principal: { sigma1: number[]; sigma2: number[] };
  };
  utilization: number[];
  positions: number[]; // positions along element length
}

export interface AnalysisResults {
  analysisInfo: {
    type: AnalysisType;
    loadCombination: string;
    timestamp: Date;
    convergence: boolean;
    iterations: number;
  };
  globalResults: {
    totalWeight: number;
    centerOfMass: Point3D;
    baseShear: Point3D;
    baseMoment: Point3D;
    fundamentalPeriods: number[];
    modalMass: number[];
    driftRatio: number[];
  };
  nodeResults: NodeResults[];
  elementResults: ElementResults[];
  designChecks: DesignCheck[];
}

// ============ DESIGN CHECKS ============
export interface DesignCheck {
  elementId: string;
  checkType: 'flexure' | 'shear' | 'axial' | 'deflection' | 'crack' | 'combined';
  applicable: boolean;
  passed: boolean;
  ratio: number; // demand/capacity
  demand: number;
  capacity: number;
  code: string; // SNI reference
  notes?: string;
}

// ============ VALIDATION & ERRORS ============
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code?: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
}

// ============ APPLICATION STATE ============
export interface ApplicationState {
  project: ProjectInfo;
  model: StructuralModel;
  analysis: {
    isRunning: boolean;
    progress: number;
    currentStep: string;
    results?: AnalysisResults;
    errors?: string[];
  };
  ui: {
    activeTab: string;
    selectedElements: string[];
    selectedNodes: string[];
    viewMode: '2D' | '3D';
    showLabels: boolean;
    showLoads: boolean;
    showDeformation: boolean;
    deformationScale: number;
  };
  validation: ValidationResult;
  isDirty: boolean;
  lastSaved?: Date;
}

// ============ API INTERFACES ============
export interface AnalysisRequest {
  model: StructuralModel;
  analysisType: AnalysisType;
  loadCombinations: string[];
  options: {
    includeDesignChecks: boolean;
    detailedResults: boolean;
    exportFormat?: 'json' | 'pdf' | 'excel';
  };
}

export interface AnalysisResponse {
  success: boolean;
  results?: AnalysisResults;
  errors?: string[];
  warnings?: string[];
  executionTime: number;
  memoryUsage?: number;
}

// ============ EXPORT INTERFACES ============
export interface ReportConfiguration {
  title: string;
  includeInputSummary: boolean;
  includeCalculations: boolean;
  includeResults: boolean;
  includeDrawings: boolean;
  includeCodes: string[]; // SNI references
  format: 'pdf' | 'word' | 'html';
  template?: string;
}

export interface ExportData {
  format: 'json' | 'excel' | 'dxf' | 'pdf';
  content: 'model' | 'results' | 'report' | 'drawings';
  options: any;
}

// ============ UTILITY TYPES ============
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ElementWithResults = Element & {
  results?: ElementResults;
  designChecks?: DesignCheck[];
};

export type NodeWithResults = Node & {
  results?: NodeResults;
};

// ============ DEFAULT VALUES ============
export const DEFAULT_MATERIAL_PROPERTIES: MaterialProperties = {
  concrete: {
    fc: 25,
    ec: 25000,
    density: 2400,
    poissonRatio: 0.2,
    grade: 'K-300'
  },
  reinforcement: {
    fy: 400,
    fu: 550,
    es: 200000,
    density: 7850,
    poissonRatio: 0.3,
    grade: 'BjTS400'
  },
  structural: {
    fy: 250,
    fu: 400,
    es: 200000,
    density: 7850,
    poissonRatio: 0.3,
    grade: 'BjTP280'
  }
};

export const DEFAULT_LOAD_FACTORS = {
  dead: 1.2,
  live: 1.6,
  seismic: 1.0,
  wind: 1.0
};

export const SNI_CODES = {
  '1726:2019': 'Tata cara perencanaan ketahanan gempa untuk struktur bangunan gedung dan non gedung',
  '1727:2020': 'Beban desain minimum dan kriteria terkait untuk bangunan gedung dan struktur lain',
  '2847:2019': 'Persyaratan beton struktural untuk bangunan gedung',
  '1729:2020': 'Spesifikasi untuk bangunan gedung baja struktural'
};