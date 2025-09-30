import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Simple3DViewer } from './Simple3DViewer';
import { Structure3D } from '@/types/structural';

describe('Performance Tests for 3D Viewers', () => {
  // Test dengan struktur kosong
  it('handles empty structure efficiently', () => {
    const emptyStructure: Structure3D = { nodes: [], elements: [] };
    render(<Simple3DViewer structure={emptyStructure} />);
    
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });

  // Test dengan struktur kecil
  it.skip('handles small structure efficiently', () => {
    const smallStructure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 0, y: 3, z: 0 }
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

    render(<Simple3DViewer structure={smallStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan data tidak valid
  it.skip('handles invalid data gracefully', () => {
    const invalidStructure: Structure3D = {
      nodes: [
        { id: 1, x: NaN, y: 0, z: 0 }, // Invalid coordinate
        { id: 2, x: 5, y: Infinity, z: 0 } // Invalid coordinate
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam' as any, 
          nodes: [1, 2],
          material: {
            id: 'mat1',
            name: 'Concrete',
            type: 'concrete' as any,
            density: 2400,
            elasticModulus: 30e9
          },
          section: {
            id: 'sec1',
            name: 'Rectangular',
            type: 'rectangular' as any,
            width: 0.3,
            height: 0.5
          }
        }
      ]
    };

    render(<Simple3DViewer structure={invalidStructure} />);
    
    // Should still render without crashing
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test dengan struktur null
  it('handles null structure gracefully', () => {
    render(<Simple3DViewer structure={null} />);
    
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });

  // Test dengan struktur undefined
  it('handles undefined structure gracefully', () => {
    render(<Simple3DViewer structure={undefined as any} />);
    
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });
});