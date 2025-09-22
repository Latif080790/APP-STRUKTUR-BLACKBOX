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
  type?: 'column' | 'beam' | 'slab' | 'wall' | 'foundation';
  materialType?: 'concrete' | 'steel' | 'timber' | 'masonry';
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
