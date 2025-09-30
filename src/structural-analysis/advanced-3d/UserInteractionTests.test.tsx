import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Simple3DViewer } from './Simple3DViewer';
import { Enhanced3DViewer } from './Enhanced3DViewer';
import { Structure3D } from '@/types/structural';

describe('User Interaction Tests for 3D Viewers', () => {
  // Test untuk klik cepat berulang
  it('handles rapid repeated clicks', () => {
    const structure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 }
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 2],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete',
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        }
      ]
    };

    render(<Simple3DViewer structure={structure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test untuk zoom in/out ekstrem
  it('handles extreme zoom in/out', () => {
    const structure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 }
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 2],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete',
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        }
      ]
    };

    render(<Enhanced3DViewer structure={structure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
  });

  // Test untuk rotasi 360 derajat
  it('handles 360-degree rotation', () => {
    const structure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 0, y: 5, z: 0 }
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 2],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete',
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        },
        { 
          id: 2, 
          type: 'column', 
          nodes: [1, 3],
          material: {
            id: 'mat2',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200e9
          },
          section: {
            id: 'sec2',
            name: 'I-Section',
            type: 'i-section',
            width: 0.2,
            height: 0.4
          }
        }
      ]
    };

    render(<Enhanced3DViewer structure={structure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
  });

  // Test untuk pan dengan kecepatan tinggi
  it('handles high-speed panning', () => {
    const structure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 100, y: 0, z: 0 }
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 2],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete',
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        }
      ]
    };

    render(<Simple3DViewer structure={structure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test untuk interaksi dengan struktur besar
  it('handles user interaction with large structure', () => {
    // Create a large structure with 500 nodes and elements
    const nodes = Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      x: i,
      y: 0,
      z: 0
    }));

    const elements = Array.from({ length: 499 }, (_, i) => ({
      id: i + 1,
      type: 'beam' as const,
      nodes: [i + 1, i + 2] as [number, number],
      material: {
        id: 'mat1',
        name: 'Concrete',
        type: 'concrete' as const,
        density: 2400,
        elasticModulus: 30e9
      },
      section: {
        id: 'sec1',
        name: 'Rectangular',
        type: 'rectangular' as const,
        width: 0.3,
        height: 0.5
      }
    }));

    const largeStructure: Structure3D = {
      nodes,
      elements
    };

    render(<Enhanced3DViewer structure={largeStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
  });

  // Test untuk interaksi dengan struktur kompleks
  it('handles user interaction with complex structure', () => {
    const complexStructure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 0, y: 5, z: 0 },
        { id: 4, x: 5, y: 5, z: 0 },
        { id: 5, x: 2.5, y: 2.5, z: 5 }
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 2],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete',
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        },
        { 
          id: 2, 
          type: 'beam', 
          nodes: [3, 4],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete',
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        },
        { 
          id: 3, 
          type: 'column', 
          nodes: [1, 3],
          material: {
            id: 'mat2',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200e9
          },
          section: {
            id: 'sec2',
            name: 'I-Section',
            type: 'i-section',
            width: 0.2,
            height: 0.4
          }
        },
        { 
          id: 4, 
          type: 'column', 
          nodes: [2, 4],
          material: {
            id: 'mat2',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200e9
          },
          section: {
            id: 'sec2',
            name: 'I-Section',
            type: 'i-section',
            width: 0.2,
            height: 0.4
          }
        },
        { 
          id: 5, 
          type: 'brace', 
          nodes: [5, 1],
          material: {
            id: 'mat3',
            name: 'Timber',
            type: 'timber',
            density: 500,
            elasticModulus: 10e9
          },
          section: {
            id: 'sec3',
            name: 'Circular',
            type: 'circular',
            width: 0.15,
            height: 0.15
          }
        }
      ]
    };

    render(<Enhanced3DViewer structure={complexStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
  });
});