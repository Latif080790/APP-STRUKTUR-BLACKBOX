/**
 * Column Properties Module
 * Defines standard properties and calculations for column elements
 */

import { Element, Section, Material } from '@/types/structural';

// Standard column materials
export const columnMaterials: Material[] = [
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
    id: 'steel-s275',
    name: 'Steel S275',
    type: 'steel',
    density: 7850,
    elasticModulus: 200000000000, // 200 GPa in Pa
    poissonsRatio: 0.3,
    yieldStrength: 275000000, // 275 MPa in Pa
    ultimateStrength: 430000000, // 430 MPa in Pa
    color: '#64748b'
  },
  {
    id: 'steel-s355',
    name: 'Steel S355',
    type: 'steel',
    density: 7850,
    elasticModulus: 200000000000, // 200 GPa in Pa
    poissonsRatio: 0.3,
    yieldStrength: 355000000, // 355 MPa in Pa
    ultimateStrength: 470000000, // 470 MPa in Pa
    color: '#64748b'
  }
];

// Standard column sections
export const columnSections: Section[] = [
  // Rectangular sections
  {
    id: 'rect-300x300',
    name: '300x300 mm',
    type: 'rectangular',
    width: 0.3,
    height: 0.3,
    area: 0.09,
    momentOfInertiaY: 0.000675, // mm⁴
    momentOfInertiaZ: 0.000675, // mm⁴
    torsionalConstant: 0.00015,
    color: '#94a3b8'
  },
  {
    id: 'rect-400x400',
    name: '400x400 mm',
    type: 'rectangular',
    width: 0.4,
    height: 0.4,
    area: 0.16,
    momentOfInertiaY: 0.002133, // mm⁴
    momentOfInertiaZ: 0.002133, // mm⁴
    torsionalConstant: 0.0003,
    color: '#94a3b8'
  },
  {
    id: 'rect-500x500',
    name: '500x500 mm',
    type: 'rectangular',
    width: 0.5,
    height: 0.5,
    area: 0.25,
    momentOfInertiaY: 0.005208, // mm⁴
    momentOfInertiaZ: 0.005208, // mm⁴
    torsionalConstant: 0.0005,
    color: '#94a3b8'
  },
  // Circular sections
  {
    id: 'circ-300',
    name: 'Diameter 300 mm',
    type: 'circular',
    width: 0.3,
    height: 0.3,
    area: 0.0707,
    momentOfInertiaY: 0.000398, // mm⁴
    momentOfInertiaZ: 0.000398, // mm⁴
    torsionalConstant: 0.000199,
    color: '#94a3b8'
  },
  {
    id: 'circ-400',
    name: 'Diameter 400 mm',
    type: 'circular',
    width: 0.4,
    height: 0.4,
    area: 0.1257,
    momentOfInertiaY: 0.001257, // mm⁴
    momentOfInertiaZ: 0.001257, // mm⁴
    torsionalConstant: 0.000628,
    color: '#94a3b8'
  },
  // I-sections
  {
    id: 'i-200x200x6x9',
    name: 'HEA 200',
    type: 'i-section',
    width: 0.200,
    height: 0.190,
    area: 0.00538,
    momentOfInertiaY: 0.000005043, // mm⁴
    momentOfInertiaZ: 0.000001697, // mm⁴
    torsionalConstant: 0.000000085,
    color: '#94a3b8'
  },
  {
    id: 'i-250x250x7x11',
    name: 'HEA 250',
    type: 'i-section',
    width: 0.250,
    height: 0.240,
    area: 0.00785,
    momentOfInertiaY: 0.000011193, // mm⁴
    momentOfInertiaZ: 0.000002768, // mm⁴
    torsionalConstant: 0.000000185,
    color: '#94a3b8'
  },
  {
    id: 'i-300x300x8x13',
    name: 'HEA 300',
    type: 'i-section',
    width: 0.300,
    height: 0.290,
    area: 0.01125,
    momentOfInertiaY: 0.000022935, // mm⁴
    momentOfInertiaZ: 0.000004953, // mm⁴
    torsionalConstant: 0.000000395,
    color: '#94a3b8'
  }
];

// Column end conditions
export const columnEndConditions = {
  pinnedPinned: {
    effectiveLengthFactor: 1.0,
    start: {
      ux: false,
      uy: false,
      uz: false,
      rx: true,
      ry: true,
      rz: true
    },
    end: {
      ux: false,
      uy: false,
      uz: false,
      rx: true,
      ry: true,
      rz: true
    }
  },
  fixedFixed: {
    effectiveLengthFactor: 0.5,
    start: {
      ux: false,
      uy: false,
      uz: false,
      rx: false,
      ry: false,
      rz: false
    },
    end: {
      ux: false,
      uy: false,
      uz: false,
      rx: false,
      ry: false,
      rz: false
    }
  },
  fixedPinned: {
    effectiveLengthFactor: 0.7,
    start: {
      ux: false,
      uy: false,
      uz: false,
      rx: false,
      ry: false,
      rz: false
    },
    end: {
      ux: false,
      uy: false,
      uz: false,
      rx: true,
      ry: true,
      rz: true
    }
  },
  cantilever: {
    effectiveLengthFactor: 2.0,
    start: {
      ux: false,
      uy: false,
      uz: false,
      rx: false,
      ry: false,
      rz: false
    },
    end: {
      ux: true,
      uy: true,
      uz: true,
      rx: true,
      ry: true,
      rz: true
    }
  }
};

// Calculate column weight per meter
export const calculateColumnWeight = (section: Section, material: Material): number => {
  const area = section.area || (section.width * section.height);
  return area * material.density;
};

// Calculate radius of gyration for columns
export const calculateColumnRadiusOfGyration = (section: Section): { ry: number; rz: number } => {
  const area = section.area || (section.width * section.height);
  if (!area) return { ry: 0, rz: 0 };
  
  return {
    ry: Math.sqrt((section.momentOfInertiaY || 0) / area),
    rz: Math.sqrt((section.momentOfInertiaZ || 0) / area)
  };
};

// Calculate slenderness ratio
export const calculateSlendernessRatio = (height: number, section: Section, endCondition: keyof typeof columnEndConditions): number => {
  const radiusOfGyration = calculateColumnRadiusOfGyration(section);
  const effectiveLength = height * columnEndConditions[endCondition].effectiveLengthFactor;
  
  // Use the minimum radius of gyration for critical buckling
  const minRadiusOfGyration = Math.min(radiusOfGyration.ry, radiusOfGyration.rz);
  
  if (minRadiusOfGyration === 0) return 0;
  
  return effectiveLength / minRadiusOfGyration;
};

// Get default column element
export const getDefaultColumnElement = (): Element => {
  return {
    id: 'column-1',
    type: 'column',
    nodes: ['node-1', 'node-2'],
    material: columnMaterials[0],
    section: columnSections[0],
    rotation: 0,
    release: columnEndConditions.pinnedPinned,
    stress: 0
  };
};