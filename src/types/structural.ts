/**
 * Structural Analysis Types
 * Defines the core data structures for structural analysis
 */

// Node interface
export interface Node {
  id: string | number;
  x: number;
  y: number;
  z: number;
  type?: 'fixed' | 'pinned' | 'free' | 'roller';
  label?: string;
  supports?: {
    ux?: boolean; // X translation fixed
    uy?: boolean; // Y translation fixed
    uz?: boolean; // Z translation fixed
    rx?: boolean; // X rotation fixed
    ry?: boolean; // Y rotation fixed
    rz?: boolean; // Z rotation fixed
  };
}

// Material properties
export interface Material {
  id: string;
  name: string;
  type: 'concrete' | 'steel' | 'timber' | 'other';
  density: number; // kg/m³
  elasticModulus: number; // Pa
  poissonsRatio?: number;
  yieldStrength?: number; // Pa
  ultimateStrength?: number; // Pa
  color?: string; // For visualization
}

// Cross-section properties
export interface Section {
  id: string;
  name: string;
  type: 'rectangular' | 'circular' | 'i-section' | 'h-section' | 'other';
  width: number; // m
  height: number; // m
  area?: number; // m²
  momentOfInertiaY?: number; // m⁴
  momentOfInertiaZ?: number; // m⁴
  torsionalConstant?: number; // m⁴
  color?: string; // For visualization
}

// Element interface
export interface Element {
  id: string | number;
  type: 'beam' | 'column' | 'brace' | 'slab' | 'wall' | 'truss';
  nodes: [string | number, string | number]; // [startNodeId, endNodeId]
  material: Material;
  section: Section;
  rotation?: number; // degrees
  release?: {
    start: {
      ux?: boolean;
      uy?: boolean;
      uz?: boolean;
      rx?: boolean;
      ry?: boolean;
      rz?: boolean;
    };
    end: {
      ux?: boolean;
      uy?: boolean;
      uz?: boolean;
      rx?: boolean;
      ry?: boolean;
      rz?: boolean;
    };
  };
  stress?: number; // For visualization
  label?: string;
}

// Load interface
export interface Load {
  id: string;
  type: 'point' | 'distributed' | 'moment';
  nodeId?: string | number;
  elementId?: string | number;
  direction: 'x' | 'y' | 'z' | 'global';
  magnitude: number;
  position?: number; // For distributed loads, 0-1 along element
}

// Structure interface
export interface Structure3D {
  nodes: Node[];
  elements: Element[];
  loads?: Load[];
  materials?: Material[];
  sections?: Section[];
}

// Analysis results
export interface AnalysisResult {
  displacements: {
    nodeId: string | number;
    ux: number; // m
    uy: number; // m
    uz: number; // m
    rx: number; // rad
    ry: number; // rad
    rz: number; // rad
  }[];
  forces: {
    elementId: string | number;
    nx: number; // N (axial)
    vy: number; // N (shear Y)
    vz: number; // N (shear Z)
    tx: number; // N·m (torsion)
    my: number; // N·m (moment Y)
    mz: number; // N·m (moment Z)
  }[];
  stresses: {
    elementId: string | number;
    axialStress: number; // Pa
    shearStress: number; // Pa
    bendingStress: number; // Pa
  }[];
  isValid: boolean;
  maxDisplacement: number; // m
  maxStress: number; // Pa
}