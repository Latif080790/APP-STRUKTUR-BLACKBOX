import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Simple3DViewer } from './Simple3DViewer';
import { Structure3D } from '@/types/structural';

describe('Simple3DViewer', () => {
  it('renders without crashing when no structure is provided', () => {
    render(<Simple3DViewer structure={null} />);
    
    // Check that the no data message is rendered
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });

  it('renders without crashing when empty structure is provided', () => {
    const emptyStructure: Structure3D = { nodes: [], elements: [] };
    render(<Simple3DViewer structure={emptyStructure} />);
    
    // Check that the no data message is rendered
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });

  it.skip('displays structure information when valid structure is provided', () => {
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
    
    // Since Three.js components are difficult to test in JSDOM,
    // we just verify that the component renders without throwing errors
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });
});