import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Simple3DViewer } from './Simple3DViewer';
import { Enhanced3DViewer } from './Enhanced3DViewer';
import { Structure3D } from '@/types/structural';

describe('Edge Case Tests for 3D Viewers', () => {
  // Test dengan struktur dengan elemen tunggal
  it('handles structure with single element', () => {
    const singleElementStructure: Structure3D = {
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

    render(<Simple3DViewer structure={singleElementStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan struktur dengan node terputus
  it('handles structure with disconnected nodes', () => {
    const disconnectedStructure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 10, y: 0, z: 0 }, // Node without element
        { id: 4, x: 15, y: 0, z: 0 }  // Node without element
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

    render(<Simple3DViewer structure={disconnectedStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan struktur dengan koordinat ekstrem
  it('handles structure with extreme coordinates', () => {
    const extremeStructure: Structure3D = {
      nodes: [
        { id: 1, x: -1000, y: -1000, z: -1000 },
        { id: 2, x: 1000, y: 1000, z: 1000 }
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

    render(<Simple3DViewer structure={extremeStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan struktur dengan material campuran
  it('handles structure with mixed materials', () => {
    const mixedMaterialStructure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 10, y: 0, z: 0 }
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
          nodes: [2, 3],
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

    render(<Enhanced3DViewer structure={mixedMaterialStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
  });

  // Test dengan struktur besar (1000+ elemen)
  it('handles large structure efficiently', () => {
    // Create a large structure with 1000 nodes and 999 elements
    const nodes = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      x: i,
      y: 0,
      z: 0
    }));

    const elements = Array.from({ length: 999 }, (_, i) => ({
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

    render(<Simple3DViewer structure={largeStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan struktur dengan elemen yang hilang
  it('handles structure with missing elements gracefully', () => {
    const missingElementsStructure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 10, y: 0, z: 0 }
      ],
      elements: [
        // Element referencing non-existent nodes
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 5], // Node 5 doesn't exist
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

    render(<Simple3DViewer structure={missingElementsStructure} />);
    
    // Should still render without crashing
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan struktur dengan properti yang hilang
  it('handles structure with missing properties gracefully', () => {
    const missingPropertiesStructure: any = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 }
      ],
      elements: [
        { 
          id: 1, 
          // Missing type property
          nodes: [1, 2],
          // Missing material property
          // Missing section property
        }
      ]
    };

    render(<Simple3DViewer structure={missingPropertiesStructure} />);
    
    // Should still render without crashing
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });
});