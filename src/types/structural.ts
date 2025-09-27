export interface Node {
  id: number;
  x: number;
  y: number;
  z: number;
  label?: string;
  constraints?: {
    x?: boolean;
    y?: boolean;
    z?: boolean;
    rx?: boolean;
    ry?: boolean;
    rz?: boolean;
  };
  loads?: {
    fx?: number;
    fy?: number;
    fz?: number;
    mx?: number;
    my?: number;
    mz?: number;
  };
}

export interface Element {
  id: number;
  nodes: number[];
  section: {
    width: number;
    height: number;
    area?: number;
    inertiaX?: number;
    inertiaY?: number;
    inertiaZ?: number;
  };
  material?: {
    elasticModulus?: number;
    shearModulus?: number;
    poissonsRatio?: number;
    density?: number;
    color?: string;
    opacity?: number;
  };
  type?: 'column' | 'beam' | 'slab' | 'wall' | 'foundation' | 'pile-cap' | 'pile' | 'pedestal';
  materialType?: 'concrete' | 'steel' | 'concrete-steel' | 'steel-composite';
  group?: string;
  color?: string;
  opacity?: number;
  visible?: boolean;
  stress?: number;
  analysisResults?: {
    axialForce?: number;
    shearY?: number;
    shearZ?: number;
    torsion?: number;
    momentY?: number;
    momentZ?: number;
    stressMax?: number;
    stressMin?: number;
    displacementX?: number;
    displacementY?: number;
    displacementZ?: number;
  };
}

export interface Structure3D {
  nodes: Node[];
  elements: Element[];
}

// =====================================
// 🚨 CORRECTED STRUCTURAL PARAMETERS
// Per SNI Standards - Zero Error Tolerance
// =====================================

// SEISMIC PARAMETERS - SNI 1726:2019 Compliant
export interface SeismicParameters {
  // Site location for hazard mapping
  location: {
    latitude: number;
    longitude: number;
    city: string;
    province: string;
  };
  
  // MCE (Maximum Considered Earthquake) parameters
  Ss: number;    // Spectral acceleration parameter at short periods (0.4-1.5g)
  S1: number;    // Spectral acceleration parameter at 1-second period (0.1-0.6g)
  
  // Site classification per SNI 1726:2019 Table 3
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  
  // Site coefficients (auto-calculated based on Ss/S1 and site class)
  Fa: number;    // Site coefficient for short periods
  Fv: number;    // Site coefficient for 1-second period
  
  // Design spectral acceleration parameters
  SDS: number;   // = (2/3) × Fa × Ss
  SD1: number;   // = (2/3) × Fv × S1
  
  // Seismic Design Category per SNI 1726:2019 Table 6 & 7
  SDC: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  
  // Risk category per SNI 1726:2019 Table 1
  riskCategory: 'I' | 'II' | 'III' | 'IV';
  
  // Importance factor
  Ie: 1.0 | 1.25 | 1.5;
}

// CONCRETE MATERIAL - SNI 2847:2019 Compliant
export interface ConcreteMaterial {
  // Discrete concrete strengths only - no ranges allowed
  fc: 17 | 20 | 25 | 30 | 35 | 40 | 45 | 50; // MPa
  
  // Auto-calculated modulus of elasticity
  Ec: number;    // = 4700√(fc') MPa per SNI 2847:2019
  
  // Physical properties
  density: 2400; // kg/m³ (normal weight concrete)
  
  // Durability requirements
  coverRequirements: {
    interior: 20;       // mm minimum for interior exposure
    exterior: 30;       // mm minimum for exterior exposure  
    ground_contact: 50; // mm minimum for ground contact
    marine: 65;         // mm minimum for marine environment
  };
  
  // Thermal properties
  thermalExpansion: 10e-6; // /°C
  
  // Fire resistance grade
  fireRating: 1 | 2 | 3 | 4; // hours
}

// STEEL REINFORCEMENT - Exact Indonesian Grades
export interface SteelReinforcement {
  // Exact Indonesian steel grades - no approximations
  grade: 'BjTP-24' | 'BjTS-40' | 'BjTS-50';
  
  // Grade-specific properties (exact values per SNI 2847:2019)
  fy: number;    // Yield strength (MPa)
  fu: number;    // Ultimate strength (MPa)
  Es: 200000;    // Modulus of elasticity (MPa) - constant
  
  // Minimum bend diameter requirements
  bendDiameters: {
    d10: { minimum: 4, preferred: 6 };    // bar diameter multiples
    d13: { minimum: 4, preferred: 6 };
    d16: { minimum: 6, preferred: 8 };
    d19: { minimum: 6, preferred: 8 };
    d22: { minimum: 8, preferred: 10 };
    d25: { minimum: 8, preferred: 10 };
    d29: { minimum: 10, preferred: 12 };
    d32: { minimum: 10, preferred: 12 };
  };
}

// Steel grade properties lookup - immutable
export const STEEL_PROPERTIES = {
  'BjTP-24': { fy: 240, fu: 370, type: 'plain' },
  'BjTS-40': { fy: 400, fu: 560, type: 'deformed' },  
  'BjTS-50': { fy: 500, fu: 650, type: 'deformed' },
} as const;

// SOIL DATA - SPT Based Classification
export interface SoilData {
  // Replace simple categories with actual test data
  sptValues: number[];      // N-SPT at different depths
  depths: number[];         // Corresponding depths (m)
  
  // Soil classification per ASTM D2487
  soilType: {
    primary: 'clay' | 'silt' | 'sand' | 'gravel';
    secondary?: 'clay' | 'silt' | 'sand' | 'gravel';
    organicContent: number;  // % organic matter
  };
  
  // Engineering properties
  properties: {
    // For clayey soils
    liquidLimit?: number;        // % (LL)
    plasticLimit?: number;       // % (PL)
    plasticityIndex?: number;    // % (PI = LL - PL)
    
    // For granular soils  
    gradation?: {
      d10?: number;    // mm - effective size
      d30?: number;    // mm
      d60?: number;    // mm
      cu?: number;     // Coefficient of uniformity
      cc?: number;     // Coefficient of curvature
    };
    
    // Shear strength parameters
    cohesion?: number;           // kPa (c)
    frictionAngle?: number;      // degrees (φ)
    undrainedShearStrength?: number; // kPa (Su) for clay
  };
  
  // Groundwater conditions
  groundwater: {
    depth: number;               // m below ground surface
    seasonal: boolean;           // Seasonal fluctuation
    aggressiveChemicals: boolean; // Chemical attack potential
  };
  
  // Site-specific factors
  seismicSiteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  
  // Recommendations
  recommendedFoundation: {
    type: 'shallow' | 'deep' | 'special';
    reasoning: string;
    additionalInvestigation?: string;
  };
}

// FOUNDATION SYSTEM - Professional Selection
export interface FoundationSystem {
  // Foundation type based on soil conditions and loads
  type: 'isolated_footing' | 'combined_footing' | 'mat_foundation' | 
        'bored_pile' | 'driven_pile' | 'micro_pile' | 'caisson';
  
  // Pile specifications (if applicable)
  pileDetails?: {
    diameter: 30 | 40 | 50 | 60 | 80 | 100 | 120; // cm standard sizes
    length: number;                                 // m
    spacing: number;                               // m center-to-center
    capacity: {
      ultimate: number;      // Qu (kN) - calculated capacity
      allowable: number;     // Qa (kN) - factored capacity
      skinFriction: number;  // Qs (kN) - from friction
      endBearing: number;    // Qp (kN) - from bearing
      safetyFactor: 2.0 | 2.5 | 3.0; // Based on soil conditions
    };
  };
  
  // Shallow foundation specifications (if applicable)
  shallowDetails?: {
    depth: number;           // m below ground level
    width: number;          // m
    length: number;         // m  
    bearingCapacity: {
      ultimate: number;      // qu (kPa)
      allowable: number;     // qa (kPa) 
      safetyFactor: 2.5 | 3.0 | 3.5;
    };
    settlement: {
      immediate: number;     // mm
      consolidation: number; // mm
      total: number;         // mm
      allowable: 25 | 50;    // mm based on structure type
    };
  };
}

// LOAD DEFINITIONS - SNI 1727:2020 Compliant
export interface LoadParameters {
  // Dead loads with exact component breakdown
  deadLoads: {
    structural: {
      concrete: 24.0;           // kN/m³
      steel: 78.5;              // kN/m³
      masonry_hollow: 14.0;     // kN/m³
      masonry_solid: 22.0;      // kN/m³
    };
    
    architectural: {
      finishes: number;         // kN/m² - calculated
      partitions: number;       // kN/m² - based on type
      ceilings: number;         // kN/m² - based on type
    };
    
    mechanical: {
      hvac: number;             // kN/m² - actual system weight
      electrical: number;       // kN/m² - based on load requirements
      plumbing: number;         // kN/m² - estimated
      fireProtection: number;   // kN/m² - sprinkler system
    };
  };
  
  // Live loads per occupancy - SNI 1727:2020 Table 4-1 exact values
  liveLoads: {
    uniformLoad: number;        // kN/m² - per occupancy type
    concentratedLoad?: number;  // kN - if applicable
    reductionFactor?: number;   // For large tributary areas
    occupancyCategory: 'residential' | 'office' | 'educational' | 
                      'commercial' | 'industrial' | 'institutional';
  };
  
  // Environmental loads
  environmentalLoads: {
    wind: {
      basicWindSpeed: number;   // m/s (3-second gust)
      exposureCategory: 'A' | 'B' | 'C' | 'D';
      topographicFactor: number; // Kzt
      windPressure: number;     // kPa - calculated
    };
    
    seismic: SeismicParameters; // Linked to seismic system
    
    temperature: {
      maxTemperature: number;   // °C
      minTemperature: number;   // °C
      thermalGradient?: number; // °C/m for tall buildings
    };
  };
}

// SAFETY FACTORS - SNI 2847:2019 Exact Values
export const STRENGTH_REDUCTION_FACTORS = {
  // Flexure and axial loads
  flexure: {
    tensionControlled: 0.90,      // εt ≥ 0.005
    compressionControlled: 0.65,  // εt ≤ 0.002
    transitionZone: (εt: number) => 0.65 + (εt - 0.002) / 0.003 * 0.25
  },
  
  // Axial compression
  compression: {
    spiralReinforced: 0.75,
    tiedReinforced: 0.65,
  },
  
  // Shear and torsion
  shear: {
    normalWeight: 0.75,
    lightweightAllSand: 0.70,
    lightweightAll: 0.65,
  },
  
  torsion: 0.75,
  bearing: 0.65,
  
  // Prestressed concrete
  prestressed: {
    bonded: 0.90,
    unbonded: 0.85,
  },
} as const;

// LOAD COMBINATIONS - SNI 1727:2020
export const LOAD_COMBINATIONS = [
  // Strength design combinations
  'D',                          // Dead load only (rare case)
  '1.4D',                      // Dead load basic
  '1.2D + 1.6L + 0.5(Lr or S)', // Primary live load combination  
  '1.2D + 1.6(Lr or S) + (0.5L or 0.5W)', // Roof/snow primary
  '1.2D + 1.0W + L + 0.5(Lr or S)', // Wind primary
  '1.2D + 1.0E + L + 0.2S',    // Seismic primary
  '0.9D + 1.0W',               // Wind with minimum dead load
  '0.9D + 1.0E',               // Seismic with minimum dead load
] as const;

// Enhanced material selection system with corrected parameters
export type StructuralMaterialType = 'reinforced_concrete' | 'structural_steel' | 'composite_steel_concrete' | 'prestressed_concrete';

export interface StructuralConfiguration {
  // Material system
  materials: {
    primary: StructuralMaterialType;
    concrete?: ConcreteMaterial;
    steel?: SteelReinforcement;
  };
  
  // Foundation system  
  foundation: FoundationSystem;
  
  // Soil conditions
  soilData: SoilData;
  
  // Seismic parameters
  seismicParameters: SeismicParameters;
  
  // Load parameters
  loadParameters: LoadParameters;
  
  // Design requirements
  designRequirements: {
    serviceability: boolean;
    ductility: 'limited' | 'moderate' | 'special';
    durability: 'normal' | 'aggressive' | 'severe';
    fireResistance: 1 | 2 | 3 | 4; // hours
    accessibility: boolean;
  };
  
  // Code compliance tracking
  codeCompliance: {
    primaryCode: 'SNI_2847_2019' | 'SNI_1726_2019' | 'SNI_1727_2020';
    supplementaryCodes: string[];
    professionalSeal: boolean;
    reviewStatus: 'draft' | 'review' | 'approved' | 'sealed';
    lastModified: Date;
    engineerOfRecord?: string;
  };
}
