export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface SoilData {
  nspt: number[];
  depth: number[];
  qc: number;
  fs: number;
  cu: number;
  phi: number;
  gamma: number;
  groundwaterDepth: number;
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
}

export interface MaterialProperties {
  fc: number;
  ec: number;
  poissonConcrete: number;
  densityConcrete: number;
  fy: number;
  fu: number;
  es: number;
  fySteel: number;
  fuSteel: number;
  crackingMoment: number;
  effectiveMomentInertia: number;
}

export interface SeismicParameters {
  ss: number;
  s1: number;
  fa: number;
  fv: number;
  sds: number;
  sd1: number;
  siteClass: string;
  importance: number;
  r: number;
  cd: number;
  omega: number;
  tl: number;
  ts: number;
  t0: number;
  category?: 'A' | 'B' | 'C' | 'D' | 'E';
  // Tambahan properti yang diperlukan
  isSeismic: boolean;
  zoneFactor: number;
  soilType: string;
  responseModifier: number;
}

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

export interface ServiceabilityCheck {
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
}

export interface MaterialDatabase {
  id: string;
  category: 'concrete' | 'steel' | 'rebar';
  name: string;
  grade: string;
  strength: number;
  elasticModulus: number;
  density: number;
  cost: number;
  availability: 'stock' | 'order' | 'limited';
  supplier: string;
}

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

export interface ProjectInfo {
  name: string;
  location: string;
  buildingFunction: string;
  riskCategory: string;
  designLife?: number;
  latitude?: number;
  longitude?: number;
}

export interface Geometry {
  length: number;
  width: number;
  heightPerFloor: number;
  numberOfFloors: number;
  baySpacingX: number;
  baySpacingY: number;
  columnGridX?: number;
  columnGridY?: number;
}

export interface Loads {
  deadLoad: number;
  liveLoad: number;
  roofLiveLoad: number;
  partitionLoad: number;
  claddingLoad: number;
  windSpeed: number;
  seismicZone?: number;
}

// Additional helper types for results/plots
export interface BaseShearSummary {
  V: number;
  Cs: number;
  seismicWeight: number;
}

export interface LateralForce {
  floor: number;
  height: number;
  weight: number;
  force: number;
}

export interface ResponseSpectrumPoint {
  period: number;
  acceleration: number;
}
