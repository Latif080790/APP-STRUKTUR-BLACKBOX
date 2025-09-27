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

// Enhanced material selection system
export type StructuralMaterialType = 'concrete' | 'steel' | 'concrete-steel' | 'steel-composite';
export type FoundationType = 'pile-cap-bored' | 'pile-cap-driven' | 'mat-foundation' | 'isolated-footing';
export type SoilCondition = 'good' | 'medium' | 'poor' | 'very-poor';

export interface MaterialSelection {
  primaryStructure: StructuralMaterialType;
  foundation: FoundationType;
  soilCondition: SoilCondition;
  allowableStress: number;
  seismicZone: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface FoundationParameters {
  pileType: 'bored-pile' | 'driven-pile' | 'micro-pile';
  pileDiameter: number;
  pileLength: number;
  pilesPerCap: number;
  capDimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  allowableBearing: number;
  groundwaterLevel: number;
}

export interface StructuralConfiguration {
  materialSelection: MaterialSelection;
  foundationParameters: FoundationParameters;
  designParameters: {
    liveLoad: number;
    deadLoad: number;
    windLoad: number;
    earthquakeLoad: number;
    serviceabilityChecks: boolean;
    ductilityRequirements: boolean;
  };
}
