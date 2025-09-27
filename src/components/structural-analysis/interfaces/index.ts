// =====================================
// 🚨 SNI-COMPLIANT INTERFACES 
// Professional Structural Analysis Interfaces
// Zero Error Tolerance Implementation
// =====================================

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface CodeViolation {
  code: 'SNI_1726_2019' | 'SNI_2847_2019' | 'SNI_1727_2020' | 'SNI_1729_2020';
  section: string;
  violation: string;
  severity: 'critical' | 'major' | 'minor';
  recommendation: string;
  mustFix: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  codeViolations: CodeViolation[];
  professionalReviewRequired: boolean;
}

// PROJECT INFO - SNI Compliant
export interface ProjectInfo {
  name: string;
  location: string;
  buildingFunction: string; // From LIVE_LOADS_BY_OCCUPANCY
  riskCategory: 'I' | 'II' | 'III' | 'IV';
  latitude?: number;
  longitude?: number;
  version?: string;
  description?: string;
  owner?: string;
  engineer?: string;
  projectCode?: string;
  migratedFrom?: string;
  migratedDate?: string;
}

// GEOMETRY - Standard Structural
export interface Geometry {
  length: number; // m
  width: number; // m
  numberOfFloors: number;
  heightPerFloor: number; // m
  baySpacingX: number; // m
  baySpacingY: number; // m
  columnGridX?: number;
  columnGridY?: number;
}

// MATERIAL PROPERTIES - SNI 2847:2019 Compliant
export interface MaterialProperties {
  // Concrete - Discrete values per SNI 2847:2019
  fc: number; // Relaxed from strict union for compatibility
  Ec?: number; // MPa - Auto calculated as 4700√fc'
  ec?: number; // Alternative naming
  poissonRatio?: number; // 0.2 standard
  poissonConcrete?: number; // Legacy alias for poissonRatio
  unitWeightConcrete?: number; // 24 kN/m³
  densityConcrete?: number; // kg/m³ - Legacy compatibility
  
  // Steel - Indonesian grades per SNI 2847:2019
  fy: number; // Relaxed from strict union for compatibility
  Es?: number; // 200,000 MPa
  es?: number; // Alternative naming
  unitWeightSteel?: number; // 78.5 kN/m³
  
  // Legacy steel properties for compatibility
  concreteGrade?: string;
  steelGrade?: string;
  rebarGrade?: string;
  fyRebar?: number;
  fySteel?: number;
  gammaConcrete?: number;
  gammaSteel?: number;
  poissonSteel?: number;
  fu?: number; // Ultimate strength
  
  // Design factors - SNI values
  phiConcrete?: number; // 0.65
  phiTension?: number; // 0.9
  phiShear?: number; // 0.75
  phiTorsion?: number; // 0.75
}

// LOADS - SNI 1727:2020 Compliant
export interface Loads {
  deadLoad: number; // kN/m²
  liveLoad: number; // kN/m² - per occupancy type
  windSpeed?: number; // m/s
  roofLiveLoad?: number; // kN/m²
  
  // Legacy properties for compatibility
  partitionLoad?: number; // kN/m² - Legacy compatibility
  claddingLoad?: number; // kN/m² - Legacy compatibility
  seismicZone?: number; // Legacy compatibility
  
  reductionFactor?: {
    live: number;
    wind: number;
  };
}

// SEISMIC PARAMETERS - SNI 1726:2019 Compliant (Ss/S1 system)
export interface SeismicParameters {
  ss: number; // g - Short period design spectral acceleration
  s1: number; // g - 1-second design spectral acceleration
  siteClass: string; // Relaxed to string for compatibility
  fa?: number; // Site coefficient for short periods (auto-calculated)
  fv?: number; // Site coefficient for 1-second periods (auto-calculated)
  sds?: number; // Design spectral acceleration (auto-calculated)
  sd1?: number; // Design spectral acceleration at 1-second (auto-calculated)
  
  // Legacy properties for backward compatibility and transition
  importance?: number; // Legacy importance factor
  r?: number; // Legacy response modification factor
  cd?: number; // Legacy deflection amplification factor
  omega?: number; // Legacy overstrength factor
  tl?: number; // Long-period transition period
  ts?: number; // Short-period transition period
  t0?: number; // Transition period
  zoneFactor?: number; // Legacy zone factor
  category?: string; // Legacy seismic design category
  isSeismic?: boolean; // Legacy flag for seismic consideration
  soilType?: string; // Legacy soil type
}

// SOIL DATA - Professional SPT-based
export interface SoilData {
  nspt?: number[]; // SPT N-values at different depths
  depth?: number[]; // Corresponding depths (m)
  siteClass?: string; // Relaxed to string for compatibility
  groundwaterDepth?: number; // m
  soilDescription?: string;
  bearingCapacity?: number; // kN/m²
  needsSPTData?: boolean; // Flag for professional review
  
  // Optional detailed properties for advanced analysis
  qc?: number; // Cone resistance
  fs?: number; // Friction ratio
  cu?: number; // Undrained shear strength
  phi?: number; // Friction angle
  gamma?: number; // Unit weight
}

// REINFORCEMENT DETAIL
export interface ReinforcementDetail {
  columnLongitudinal: {
    diameter: number;
    count: number;
    ratio: number;
    arrangement: string;
  };
  columnTransverse: {
    diameter: number;
    spacing: number[];
    confinementZone: number;
  };
  beamTension: {
    diameter: number;
    count: number;
    layers: number;
    area: number;
  };
  beamCompression: {
    diameter: number;
    count: number;
    area: number;
  };
  beamShear: {
    diameter: number;
    spacing: number[];
    legs: number;
  };
  slabMain: {
    diameter: number;
    spacing: number;
    area: number;
  };
  slabDistribution: {
    diameter: number;
    spacing: number;
    area: number;
  };
}

// 3D STRUCTURE
export interface Structure3D {
  nodes: Array<{
    id: number;
    x: number;
    y: number;
    z: number;
    type: 'fixed' | 'pinned' | 'free';
  }>;
  elements: Array<{
    id: number;
    type: 'column' | 'beam' | 'slab';
    startNode: number;
    endNode: number;
    section: string;
    material: string;
  }>;
  loads: Array<{
    type: 'point' | 'distributed';
    element: number;
    magnitude: number;
    direction: 'x' | 'y' | 'z';
  }>;
}

// FRAME ANALYSIS
export interface LateralForce {
  floor: number;
  height: number;
  force: number;
  displacement: number;
}

// SERVICEABILITY CHECK
export interface ServiceabilityCheck {
  deflection: {
    calculated: number;
    allowable: number;
    ratio: number;
    status: 'OK' | 'NOT_OK';
  };
  cracking: {
    width: number;
    allowable: number;
    status: 'OK' | 'NOT_OK';
  };
  vibration: {
    frequency: number;
    allowable: number;
    status: 'OK' | 'NOT_OK';
  };
}

// FRAME ANALYSIS RESULT
export interface FrameAnalysisResult {
  displacements: Array<{
    node: number;
    dx: number;
    dy: number;
    dz: number;
    rotation: number;
  }>;
  memberForces: Array<{
    element: number;
    axial: number;
    shearY: number;
    shearZ: number;
    momentY: number;
    momentZ: number;
    torsion: number;
  }>;
  reactions: Array<{
    node: number;
    fx: number;
    fy: number;
    fz: number;
    mx: number;
    my: number;
    mz: number;
  }>;
  maxDrift: number;
  maxStress: number;
}

// COST ESTIMATE
export interface CostEstimate {
  material: {
    concrete: number;
    steel: number;
    rebar: number;
    formwork: number;
  };
  labor: {
    foundation: number;
    structure: number;
    finishing: number;
  };
  equipment: number;
  overhead: number;
  contingency: number;
  total: number;
  perSquareMeter: number;
}

// RESPONSE SPECTRUM
export interface ResponseSpectrumPoint {
  period: number;
  acceleration: number;
}

// COMPREHENSIVE ANALYSIS RESULTS 
export interface AnalysisResults {
  // Foundation analysis
  foundation: {
    capacity: number;
    settlement: number;
    bearingPressure: number;
    reinforcement: ReinforcementDetail;
    safetyFactor: number;
    status: 'OK' | 'NOT OK';
  };
  
  // Seismic analysis
  seismic: {
    baseShear: number;
    fundamentalPeriod: number;
    responseSpectrum: ResponseSpectrumPoint[];
    lateralForces: Array<{
      floor: number;
      height: number;
      weight: number;
      force: number;
    }>;
    driftRatio: number;
    status: 'OK' | 'NOT OK';
  };
  
  // Material analysis
  materials: {
    concreteUtilization: number;
    steelUtilization: number;
    reinforcementRatio: number;
    cracksStatus: 'OK' | 'NOT OK';
    durabilityIndex: number;
  };
  
  // Structural analysis
  structural: {
    frameAnalysis: FrameAnalysisResult;
    loadCombinations: LoadCombination[];
    maxDeflection: number;
    maxStress: number;
    serviceability: {
      deflection: {
        immediate: number;
        longTerm: number;
        allowable: number;
        ratio: number;
        status: 'OK' | 'NOT OK';
      };
      crack: {
        width: number;
        allowable: number;
        status: 'OK' | 'NOT OK';
      };
      vibration: {
        frequency: number;
        acceleration: number;
        status: 'OK' | 'NOT OK';
      };
    };
  };
  
  // Code compliance
  compliance: {
    sni1726: { passed: boolean; violations: CodeViolation[] };
    sni2847: { passed: boolean; violations: CodeViolation[] };
    sni1727: { passed: boolean; violations: CodeViolation[] };
    overallCompliance: boolean;
  };
  
  // Legacy compatibility
  status?: 'success' | 'error' | 'warning';
  timestamp?: string;
  summary?: {
    totalWeight: number;
    baseShear: number;
    fundamentalPeriod: number;
    maxDrift: number;
    maxStress: number;
  };
  costEstimate?: CostEstimate;
  structure3D?: Structure3D;
  calculations?: {
    [key: string]: any;
  };
  warnings?: string[];
  notes?: string[];
}

// ANALYSIS RESULT - Legacy compatibility
export interface AnalysisResult {
  status: 'success' | 'error' | 'warning';
  timestamp: string;
  summary: {
    totalWeight: number;
    baseShear: number;
    fundamentalPeriod: number;
    maxDrift: number;
    maxStress: number;
  };
  frameAnalysis: FrameAnalysisResult;
  baseShear: {
    V: number;
    Cs: number;
    seismicWeight: number;
  };
  lateralForces: Array<{
    floor: number;
    height: number;
    weight: number;
    force: number;
  }>;
  responseSpectrum: ResponseSpectrumPoint[];
  reinforcement: ReinforcementDetail;
  serviceability: {
    deflection: {
      immediate: number;
      longTerm: number;
      allowable: number;
      ratio: number;
      status: 'OK' | 'NOT OK';
    };
    crack: {
      width: number;
      allowable: number;
      status: 'OK' | 'NOT OK';
    };
    vibration: {
      frequency: number;
      acceleration: number;
      status: 'OK' | 'NOT OK';
    };
  };
  costEstimate: CostEstimate;
  structure3D: Structure3D;
  calculations: {
    [key: string]: any;
  };
  warnings: string[];
  notes: string[];
}

// LOAD COMBINATIONS
export interface LoadCombination {
  id: string;
  name: string;
  formula: string;
  dead: number;
  live: number;
  wind: number;
  earthquake: number;
  roof: number;
  rain: number;
}
