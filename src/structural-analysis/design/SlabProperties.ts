/**
 * Slab Properties Module
 * Defines standard properties and calculations for slab elements
 */

import { Element, Section, Material } from '@/types/structural';

// Standard slab materials
export const slabMaterials: Material[] = [
  {
    id: 'concrete-25',
    name: 'Concrete 25 MPa',
    type: 'concrete',
    density: 2400, // kg/m³
    elasticModulus: 25000000000, // 25 GPa in Pa
    poissonsRatio: 0.2,
    yieldStrength: 25000000, // 25 MPa in Pa
    ultimateStrength: 30000000, // 30 MPa in Pa
    color: '#94a3b8'
  },
  {
    id: 'concrete-30',
    name: 'Concrete 30 MPa',
    type: 'concrete',
    density: 2400,
    elasticModulus: 28000000000, // 28 GPa in Pa
    poissonsRatio: 0.2,
    yieldStrength: 30000000, // 30 MPa in Pa
    ultimateStrength: 35000000, // 35 MPa in Pa
    color: '#94a3b8'
  },
  {
    id: 'concrete-35',
    name: 'Concrete 35 MPa',
    type: 'concrete',
    density: 2400,
    elasticModulus: 30000000000, // 30 GPa in Pa
    poissonsRatio: 0.2,
    yieldStrength: 35000000, // 35 MPa in Pa
    ultimateStrength: 40000000, // 40 MPa in Pa
    color: '#94a3b8'
  }
];

// Standard slab sections (thickness variations)
export const slabSections: Section[] = [
  {
    id: 'slab-100',
    name: '100 mm Thick',
    type: 'rectangular',
    width: 0.1, // thickness
    height: 1.0, // unit width for analysis
    area: 0.1,
    momentOfInertiaY: 0.0000833, // mm⁴ for 1m width
    momentOfInertiaZ: 0.0000833, // mm⁴ for 1m width
    torsionalConstant: 0.0000167,
    color: '#94a3b8'
  },
  {
    id: 'slab-125',
    name: '125 mm Thick',
    type: 'rectangular',
    width: 0.125, // thickness
    height: 1.0, // unit width for analysis
    area: 0.125,
    momentOfInertiaY: 0.0001628, // mm⁴ for 1m width
    momentOfInertiaZ: 0.0001628, // mm⁴ for 1m width
    torsionalConstant: 0.0000254,
    color: '#94a3b8'
  },
  {
    id: 'slab-150',
    name: '150 mm Thick',
    type: 'rectangular',
    width: 0.15, // thickness
    height: 1.0, // unit width for analysis
    area: 0.15,
    momentOfInertiaY: 0.0002813, // mm⁴ for 1m width
    momentOfInertiaZ: 0.0002813, // mm⁴ for 1m width
    torsionalConstant: 0.0000422,
    color: '#94a3b8'
  },
  {
    id: 'slab-175',
    name: '175 mm Thick',
    type: 'rectangular',
    width: 0.175, // thickness
    height: 1.0, // unit width for analysis
    area: 0.175,
    momentOfInertiaY: 0.0004465, // mm⁴ for 1m width
    momentOfInertiaZ: 0.0004465, // mm⁴ for 1m width
    torsionalConstant: 0.0000657,
    color: '#94a3b8'
  },
  {
    id: 'slab-200',
    name: '200 mm Thick',
    type: 'rectangular',
    width: 0.2, // thickness
    height: 1.0, // unit width for analysis
    area: 0.2,
    momentOfInertiaY: 0.0006667, // mm⁴ for 1m width
    momentOfInertiaZ: 0.0006667, // mm⁴ for 1m width
    torsionalConstant: 0.0000952,
    color: '#94a3b8'
  }
];

// Slab support conditions
export const slabSupportConditions = {
  fourSides: {
    name: 'Four Sides Supported',
    coefficient: 0.042,
    description: 'Slab supported on all four edges'
  },
  twoSides: {
    name: 'Two Sides Supported',
    coefficient: 0.125,
    description: 'Slab supported on two opposite edges (beam action)'
  },
  cantilever: {
    name: 'Cantilever',
    coefficient: 0.5,
    description: 'Slab projecting beyond support'
  }
};

// Reinforcement types
export const reinforcementTypes = {
  main: {
    name: 'Main Reinforcement',
    minDiameter: 12, // mm
    maxDiameter: 25, // mm
    minSpacing: 100, // mm
    maxSpacing: 200, // mm
    minRatio: 0.0012 // 0.12%
  },
  secondary: {
    name: 'Secondary Reinforcement',
    minDiameter: 10, // mm
    maxDiameter: 16, // mm
    minSpacing: 150, // mm
    maxSpacing: 300, // mm
    minRatio: 0.0010 // 0.10%
  }
};

// Calculate slab weight per square meter
export const calculateSlabWeight = (thickness: number, material: Material): number => {
  return thickness * material.density;
};

// Calculate required reinforcement area
export const calculateRequiredReinforcement = (moment: number, thickness: number, material: Material): number => {
  // Simplified calculation for required steel area
  const effectiveDepth = thickness * 1000 - 25; // Assume 25mm cover
  const steelArea = (moment * 1000000) / (0.87 * material.yieldStrength! * effectiveDepth);
  return steelArea / 1000; // Convert to cm²
};

// Calculate minimum reinforcement area
export const calculateMinimumReinforcement = (thickness: number, width: number): number => {
  // Minimum reinforcement ratio is 0.12% for slabs
  const area = thickness * width;
  return area * 0.0012 * 10000; // Convert to cm²
};

// Calculate deflection
export const calculateDeflection = (load: number, span: number, thickness: number, material: Material): number => {
  // Simplified deflection calculation
  const momentOfInertia = (width * Math.pow(thickness * 1000, 3)) / 12;
  const deflection = (5 * load * Math.pow(span * 1000, 4)) / 
    (384 * material.elasticModulus * momentOfInertia);
  return deflection * 1000; // Convert to mm
};

// Get default slab element
export const getDefaultSlabElement = (): Element => {
  return {
    id: 'slab-1',
    type: 'slab',
    nodes: ['node-1', 'node-2'],
    material: slabMaterials[0],
    section: slabSections[0],
    stress: 0
  };
};

// Constants for calculations
const width = 1.0; // Unit width for calculations (1m)