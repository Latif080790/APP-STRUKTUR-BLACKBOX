/**
 * Unified Types untuk Comprehensive Structural Analysis System
 * Definisi types yang comprehensive dan type-safe
 */

// Project Information
export interface UnifiedProjectInfo {
  nama: string;
  lokasi: string;
  engineer: string;
  fungsiBangunan: 'residential' | 'perkantoran' | 'komersial' | 'industri' | 'pendidikan' | 'kesehatan';
  kategoriRisiko: 'I' | 'II' | 'III' | 'IV';
  deskripsi: string;
  tanggalAnalisis: string;
  kodeProyek?: string;
  klien?: string;
  konsultan?: string;
}

// Geometry Configuration
export interface UnifiedGeometry {
  panjang: number;        // m
  lebar: number;          // m
  tinggiPerLantai: number; // m
  jumlahLantai: number;
  bentangX: number;       // m - Bay spacing in X direction
  bentangY: number;       // m - Bay spacing in Y direction
  gridKolomX: number;     // Number of bays in X
  gridKolomY: number;     // Number of bays in Y
  
  // Advanced geometry options
  irregularitas?: {
    vertikal: boolean;
    horizontal: boolean;
    torsional: boolean;
  };
  
  // Foundation parameters
  kedalamanFondasi?: number; // m
  tipeFondasi?: 'shallow' | 'pile' | 'caisson';
}

// Material Properties dengan standar Indonesia
export interface UnifiedMaterials {
  // Concrete properties (SNI 2847:2019)
  fcBeton: number;        // MPa - Kuat tekan karakteristik
  ecBeton: number;        // MPa - Modulus elastisitas
  poissonBeton: number;   // Poisson's ratio
  densitasBeton: number;  // kg/m³
  
  // Steel properties (SNI 2847:2019)
  fyBaja: number;         // MPa - Kuat leleh
  fuBaja: number;         // MPa - Kuat tarik putus
  esBaja: number;         // MPa - Modulus elastisitas baja
  
  // Safety factors sesuai SNI
  phiBeton: number;       // Faktor reduksi kekuatan beton
  phiTarik: number;       // Faktor reduksi tarik
  phiGeser: number;       // Faktor reduksi geser
  phiTorsi: number;       // Faktor reduksi torsi
  
  // Additional material properties
  mutuBeton?: string;     // K-225, K-300, etc.
  tipeBaja?: 'BJTP24' | 'BJTS37' | 'BJTS40' | 'BJTS50';
  coverBeton?: number;    // mm - Selimut beton
}

// Load Configuration sesuai PPIUG
export interface UnifiedLoads {
  // Dead loads
  bebanMati: number;      // kN/m² - Beban mati total
  bebanHidup: number;     // kN/m² - Beban hidup
  bebanHidupAtap: number; // kN/m² - Beban hidup atap
  bebanPartisi: number;   // kN/m² - Beban partisi
  
  // Environmental loads
  bebanAngin: number;     // kN/m² - Tekanan angin
  kecepatanAngin: number; // m/s - Kecepatan angin rencana
  
  // Special loads
  bebanKonstruksi?: number; // kN/m² - Construction loads
  bebanPeralatan?: number;  // kN/m² - Equipment loads
  
  // Load combinations sesuai SNI 1727:2020
  faktorBebanMati?: number;    // Default: 1.2
  faktorBebanHidup?: number;   // Default: 1.6
  faktorBebanAngin?: number;   // Default: 1.0
  faktorBebanGempa?: number;   // Default: 1.0
}

// Seismic Parameters sesuai SNI 1726:2019
export interface UnifiedSeismic {
  // Spectral acceleration parameters
  ss: number;             // Short period spectral acceleration
  s1: number;             // 1-second period spectral acceleration
  fa: number;             // Site coefficient
  fv: number;             // Site coefficient
  sds: number;            // Design spectral acceleration (short period)
  sd1: number;            // Design spectral acceleration (1-second)
  
  // Site classification
  kelasTransisi: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  
  // Structural system parameters
  faktorKepentingan: number;   // Importance factor (Ie)
  faktorModifikasi: number;    // Response modification factor (R)
  faktorAmplifikasi: number;   // Deflection amplification factor (Cd)
  omega: number;               // Overstrength factor
  
  // Additional seismic parameters
  isSeismik: boolean;
  kategoriDesainSeismik?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  sistemStruktur?: 'SRPMK' | 'SRPMM' | 'SRPB' | 'Dual' | 'Shear_Wall';
}

// Analysis Results
export interface UnifiedAnalysisResults {
  // Structural model
  model: any; // StructuralModel
  
  // Primary results
  displacements: number[];     // Global displacement vector
  forces: number[];           // Element forces
  moments: number[];          // Element moments
  stresses: number[];         // Stress results
  deflections: any[];         // Deflection results
  
  // Dynamic analysis results
  periods: number[];          // Natural periods
  modalShapes?: number[][];   // Mode shapes
  participation?: number[];   // Modal participation factors
  
  // Code compliance results
  driftRatios: number[];      // Inter-story drift ratios
  utilizationRatios: number[]; // Element utilization ratios
  safetyFactors: number[];     // Safety factors
  
  // Metadata
  timestamp: string;
  analysisVersion: string;
  standardsUsed: string[];
  
  // Analysis summary
  summary?: {
    maxDisplacement: number;
    maxStress: number;
    maxDriftRatio: number;
    criticalElement: number;
    overallSafety: number;
  };
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  standard: string;
  category: string;
  parameter: string;
  actualValue: number;
  limitValue: number;
  ratio: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// Analysis Status
export type AnalysisStatus = 
  | 'idle'
  | 'validating'
  | 'generating-model'
  | 'assembling-matrix'
  | 'assembling-loads'
  | 'solving-system'
  | 'calculating-forces'
  | 'checking-compliance'
  | 'completed'
  | 'error';

// Form Data Interfaces
export interface ProjectInfoFormData extends UnifiedProjectInfo {}
export interface GeometryFormData extends UnifiedGeometry {}
export interface MaterialFormData extends UnifiedMaterials {}
export interface LoadsFormData extends UnifiedLoads {}
export interface SeismicFormData extends UnifiedSeismic {}

// Report Generation Types
export interface ReportSection {
  id: string;
  title: string;
  content: string | JSX.Element;
  includeInReport: boolean;
  pageBreakAfter?: boolean;
}

export interface ReportConfiguration {
  sections: ReportSection[];
  format: 'pdf' | 'html' | 'docx';
  template: 'standard' | 'professional' | 'detailed';
  includeCalculations: boolean;
  includeGraphics: boolean;
  watermark?: string;
  logo?: string;
}

// Standards Configuration
export interface StandardConfiguration {
  code: string;
  name: string;
  version: string;
  country: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

// Error Handling Types
export interface AnalysisError {
  code: string;
  message: string;
  details?: string;
  timestamp: string;
  recoverable: boolean;
  suggestions?: string[];
}

// Performance Monitoring
export interface PerformanceMetrics {
  analysisTime: number;        // seconds
  memoryUsage: number;         // MB
  matrixSize: number;
  convergenceIterations: number;
  errorTolerance: number;
}

// 3D Visualization Types
export interface Visualization3DConfig {
  showNodes: boolean;
  showElements: boolean;
  showLoads: boolean;
  showSupports: boolean;
  showDeformation: boolean;
  deformationScale: number;
  colorScheme: 'stress' | 'displacement' | 'force' | 'default';
  transparency: number;
  animation: boolean;
}

// Export Types
export interface ExportOptions {
  format: 'json' | 'csv' | 'excel' | 'cad' | 'ifc';
  includeModel: boolean;
  includeResults: boolean;
  includeGraphics: boolean;
  compression: boolean;
}

// Plugin Interface (for extensibility)
export interface AnalysisPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  
  // Plugin hooks
  onPreAnalysis?: (data: any) => Promise<any>;
  onPostAnalysis?: (results: UnifiedAnalysisResults) => Promise<UnifiedAnalysisResults>;
  onValidation?: (data: any) => Promise<ValidationResult[]>;
  
  // UI extensions
  customForms?: React.ComponentType[];
  customReports?: React.ComponentType[];
}

// Advanced Analysis Options
export interface AdvancedAnalysisOptions {
  // Nonlinear analysis
  nonlinear: {
    enabled: boolean;
    materialNonlinearity: boolean;
    geometricNonlinearity: boolean;
    maxIterations: number;
    convergenceTolerance: number;
  };
  
  // Dynamic analysis
  dynamic: {
    enabled: boolean;
    timeSteps: number;
    duration: number;
    dampingRatio: number;
    responseSpectrum?: number[][];
  };
  
  // Pushover analysis
  pushover: {
    enabled: boolean;
    controlNode: number;
    direction: 'x' | 'y';
    targetDisplacement: number;
  };
  
  // P-Delta effects
  pDelta: {
    enabled: boolean;
    iterativeMethod: boolean;
  };
}

