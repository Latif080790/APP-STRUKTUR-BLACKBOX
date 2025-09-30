/**
 * Sample Structures for Testing
 * Collection of structural models for testing various analysis capabilities
 */

import { Structure3D, Node, Element, Material, Section } from '@/types/structural';

// Simple beam structure for basic testing
export const simpleBeam: Structure3D = {
  nodes: [
    { id: '1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } },
    { id: '2', x: 5, y: 0, z: 0 }
  ],
  elements: [
    {
      id: '1',
      type: 'beam',
      nodes: ['1', '2'],
      material: {
        id: 'steel',
        name: 'Steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 2e11,
        yieldStrength: 250e6,
        poissonsRatio: 0.3
      },
      section: {
        id: 'rect1',
        name: 'Rectangular Section',
        type: 'rectangular',
        width: 0.2,
        height: 0.4
      }
    }
  ],
  loads: [
    {
      id: '1',
      type: 'point',
      nodeId: '2',
      direction: 'y',
      magnitude: -10000 // 10 kN downward
    }
  ]
};

// Simple portal frame for 2D analysis testing
export const simplePortal: Structure3D = {
  nodes: [
    { id: '1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } },
    { id: '2', x: 0, y: 3, z: 0 },
    { id: '3', x: 5, y: 3, z: 0 },
    { id: '4', x: 5, y: 0, z: 0, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } }
  ],
  elements: [
    // Left column
    {
      id: '1',
      type: 'column',
      nodes: ['1', '2'],
      material: {
        id: 'steel',
        name: 'Steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 2e11,
        yieldStrength: 250e6,
        poissonsRatio: 0.3
      },
      section: {
        id: 'rect1',
        name: 'Rectangular Section',
        type: 'rectangular',
        width: 0.3,
        height: 0.3
      }
    },
    // Beam
    {
      id: '2',
      type: 'beam',
      nodes: ['2', '3'],
      material: {
        id: 'steel',
        name: 'Steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 2e11,
        yieldStrength: 250e6,
        poissonsRatio: 0.3
      },
      section: {
        id: 'rect2',
        name: 'Rectangular Section',
        type: 'rectangular',
        width: 0.25,
        height: 0.5
      }
    },
    // Right column
    {
      id: '3',
      type: 'column',
      nodes: ['3', '4'],
      material: {
        id: 'steel',
        name: 'Steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 2e11,
        yieldStrength: 250e6,
        poissonsRatio: 0.3
      },
      section: {
        id: 'rect1',
        name: 'Rectangular Section',
        type: 'rectangular',
        width: 0.3,
        height: 0.3
      }
    }
  ],
  loads: [
    {
      id: '1',
      type: 'point',
      nodeId: '3',
      direction: 'y',
      magnitude: -15000 // 15 kN downward
    }
  ]
};

// 3D frame structure for advanced testing
export const simple3DFrame: Structure3D = {
  nodes: [
    // Base nodes
    { id: '1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } },
    { id: '2', x: 5, y: 0, z: 0, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } },
    { id: '3', x: 5, y: 0, z: 5, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } },
    { id: '4', x: 0, y: 0, z: 5, supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true } },
    
    // First floor nodes
    { id: '5', x: 0, y: 3, z: 0 },
    { id: '6', x: 5, y: 3, z: 0 },
    { id: '7', x: 5, y: 3, z: 5 },
    { id: '8', x: 0, y: 3, z: 5 },
    
    // Second floor nodes
    { id: '9', x: 0, y: 6, z: 0 },
    { id: '10', x: 5, y: 6, z: 0 },
    { id: '11', x: 5, y: 6, z: 5 },
    { id: '12', x: 0, y: 6, z: 5 }
  ],
  elements: [
    // First floor columns
    { id: '1', type: 'column', nodes: ['1', '5'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    { id: '2', type: 'column', nodes: ['2', '6'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    { id: '3', type: 'column', nodes: ['3', '7'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    { id: '4', type: 'column', nodes: ['4', '8'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    
    // Second floor columns
    { id: '5', type: 'column', nodes: ['5', '9'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    { id: '6', type: 'column', nodes: ['6', '10'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    { id: '7', type: 'column', nodes: ['7', '11'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    { id: '8', type: 'column', nodes: ['8', '12'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec1', name: 'Column Section', type: 'rectangular', width: 0.4, height: 0.4 } },
    
    // First floor beams (X direction)
    { id: '9', type: 'beam', nodes: ['5', '6'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    { id: '10', type: 'beam', nodes: ['7', '8'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    
    // First floor beams (Z direction)
    { id: '11', type: 'beam', nodes: ['5', '8'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    { id: '12', type: 'beam', nodes: ['6', '7'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    
    // Second floor beams (X direction)
    { id: '13', type: 'beam', nodes: ['9', '10'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    { id: '14', type: 'beam', nodes: ['11', '12'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    
    // Second floor beams (Z direction)
    { id: '15', type: 'beam', nodes: ['9', '12'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } },
    { id: '16', type: 'beam', nodes: ['10', '11'], material: { id: 'steel1', name: 'Steel', type: 'steel', density: 7850, elasticModulus: 2e11, yieldStrength: 250e6, poissonsRatio: 0.3 }, section: { id: 'sec2', name: 'Beam Section', type: 'rectangular', width: 0.3, height: 0.6 } }
  ],
  loads: [
    {
      id: '1',
      type: 'point',
      nodeId: '9',
      direction: 'y',
      magnitude: -20000 // 20 kN downward
    },
    {
      id: '2',
      type: 'point',
      nodeId: '10',
      direction: 'y',
      magnitude: -20000 // 20 kN downward
    },
    {
      id: '3',
      type: 'point',
      nodeId: '11',
      direction: 'y',
      magnitude: -20000 // 20 kN downward
    },
    {
      id: '4',
      type: 'point',
      nodeId: '12',
      direction: 'y',
      magnitude: -20000 // 20 kN downward
    }
  ]
};

// Export all sample structures
export const sampleStructures = {
  simpleBeam,
  simplePortal,
  simple3DFrame
};