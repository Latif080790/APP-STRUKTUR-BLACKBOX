/**
 * Beam Properties Module
 * Defines standard properties and calculations for beam elements
 */

import { Element, Section, Material } from '@/types/structural';

// Standard beam materials
export const beamMaterials: Material[] = [
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

// Standard beam sections
export const beamSections: Section[] = [
  // Rectangular sections
  {
    id: 'rect-200x300',
    name: '200x300 mm',
    type: 'rectangular',
    width: 0.2,
    height: 0.3,
    area: 0.06,
    momentOfInertiaY: 0.00045, // mm⁴
    momentOfInertiaZ: 0.0002, // mm⁴
    torsionalConstant: 0.0001,
    color: '#94a3b8'
  },
  {
    id: 'rect-250x400',
    name: '250x400 mm',
    type: 'rectangular',
    width: 0.25,
    height: 0.4,
    area: 0.1,
    momentOfInertiaY: 0.00133, // mm⁴
    momentOfInertiaZ: 0.00026, // mm⁴
    torsionalConstant: 0.00015,
    color: '#94a3b8'
  },
  {
    id: 'rect-300x500',
    name: '300x500 mm',
    type: 'rectangular',
    width: 0.3,
    height: 0.5,
    area: 0.15,
    momentOfInertiaY: 0.003125, // mm⁴
    momentOfInertiaZ: 0.000375, // mm⁴
    torsionalConstant: 0.0002,
    color: '#94a3b8'
  },
  // I-sections
  {
    id: 'i-150x75x5x7',
    name: 'IPE 150',
    type: 'i-section',
    width: 0.075,
    height: 0.150,
    area: 0.00158,
    momentOfInertiaY: 0.000000654, // mm⁴
    momentOfInertiaZ: 0.000000054, // mm⁴
    torsionalConstant: 0.000000012,
    color: '#94a3b8'
  },
  {
    id: 'i-200x100x5.5x8',
    name: 'IPE 200',
    type: 'i-section',
    width: 0.100,
    height: 0.200,
    area: 0.00285,
    momentOfInertiaY: 0.000001943, // mm⁴
    momentOfInertiaZ: 0.000000115, // mm⁴
    torsionalConstant: 0.000000035,
    color: '#94a3b8'
  },
  {
    id: 'i-250x125x6x9',
    name: 'IPE 250',
    type: 'i-section',
    width: 0.125,
    height: 0.250,
    area: 0.00448,
    momentOfInertiaY: 0.000004295, // mm⁴
    momentOfInertiaZ: 0.000000219, // mm⁴
    torsionalConstant: 0.000000072,
    color: '#94a3b8'
  }
];

// Beam end releases
export const beamReleases = {
  fixed: {
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
  pinned: {
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
  cantilever: {
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

// Calculate beam weight per meter
export const calculateBeamWeight = (section: Section, material: Material): number => {
  const area = section.area || (section.width * section.height);
  return area * material.density;
};

// Calculate section modulus
export const calculateSectionModulus = (section: Section): { wy: number; wz: number } => {
  return {
    wy: section.momentOfInertiaY ? section.momentOfInertiaY / (section.height / 2) : 0,
    wz: section.momentOfInertiaZ ? section.momentOfInertiaZ / (section.width / 2) : 0
  };
};

// Calculate radius of gyration
export const calculateRadiusOfGyration = (section: Section): { ry: number; rz: number } => {
  const area = section.area || (section.width * section.height);
  if (!area) return { ry: 0, rz: 0 };
  
  return {
    ry: Math.sqrt((section.momentOfInertiaY || 0) / area),
    rz: Math.sqrt((section.momentOfInertiaZ || 0) / area)
  };
};

// Get default beam element
export const getDefaultBeamElement = (): Element => {
  return {
    id: 'beam-1',
    type: 'beam',
    nodes: ['node-1', 'node-2'],
    material: beamMaterials[0],
    section: beamSections[0],
    rotation: 0,
    release: beamReleases.fixed,
    stress: 0
  };
};