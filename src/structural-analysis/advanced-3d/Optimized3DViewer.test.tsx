import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Optimized3DViewer } from './Optimized3DViewer';

describe('Optimized3DViewer', () => {
  it('renders without crashing when no structure is provided', () => {
    render(<Optimized3DViewer structure={null} />);
    
    // Check that the no data message is rendered
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });

  it('renders without crashing when empty structure is provided', () => {
    const emptyStructure = {
      nodes: [],
      elements: [],
      loads: [],
      boundingBox: {
        min: [0, 0, 0],
        max: [0, 0, 0]
      },
      scale: 1
    };
    render(<Optimized3DViewer structure={emptyStructure} />);
    
    // Check that the no data message is rendered
    expect(screen.getByText('No Structure Data')).toBeInTheDocument();
  });

  it('handles small structure efficiently', () => {
    const smallStructure = {
      nodes: [
        { 
          id: '1', 
          position: [0, 0, 0],
          support: { x: true, y: true, z: true, rx: false, ry: false, rz: false }
        },
        { 
          id: '2', 
          position: [5, 0, 0],
          support: { x: false, y: false, z: false, rx: false, ry: false, rz: false }
        }
      ],
      elements: [
        { 
          id: '1', 
          type: 'beam' as const,
          startNode: '1',
          endNode: '2',
          section: {
            width: 0.3,
            height: 0.5
          },
          material: 'concrete' as const
        }
      ],
      loads: [],
      boundingBox: {
        min: [0, 0, 0],
        max: [5, 0, 0]
      },
      scale: 1
    };

    render(<Optimized3DViewer structure={smallStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('Structure Info')).toBeInTheDocument();
  });

  it('handles medium structure efficiently', () => {
    // Create a medium-sized structure with 100 nodes and elements
    const nodes = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      position: [i, 0, 0] as [number, number, number],
      support: { 
        x: i === 0, 
        y: i === 0, 
        z: i === 0, 
        rx: false, 
        ry: false, 
        rz: false 
      }
    }));

    const elements = Array.from({ length: 99 }, (_, i) => ({
      id: `${i + 1}`,
      type: 'beam' as const,
      startNode: `${i + 1}`,
      endNode: `${i + 2}`,
      section: {
        width: 0.3,
        height: 0.5
      },
      material: 'steel' as const
    }));

    const mediumStructure = {
      nodes,
      elements,
      loads: [],
      boundingBox: {
        min: [0, 0, 0],
        max: [99, 0, 0]
      },
      scale: 1
    };

    render(<Optimized3DViewer structure={mediumStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('Structure Info')).toBeInTheDocument();
  });

  it('handles large structure efficiently', () => {
    // Create a large structure with 1000 nodes and elements
    const nodes = Array.from({ length: 1000 }, (_, i) => ({
      id: `${i + 1}`,
      position: [i, 0, 0] as [number, number, number],
      support: { 
        x: i === 0, 
        y: i === 0, 
        z: i === 0, 
        rx: false, 
        ry: false, 
        rz: false 
      }
    }));

    const elements = Array.from({ length: 999 }, (_, i) => ({
      id: `${i + 1}`,
      type: 'beam' as const,
      startNode: `${i + 1}`,
      endNode: `${i + 2}`,
      section: {
        width: 0.3,
        height: 0.5
      },
      material: 'steel' as const
    }));

    const largeStructure = {
      nodes,
      elements,
      loads: [],
      boundingBox: {
        min: [0, 0, 0],
        max: [999, 0, 0]
      },
      scale: 1
    };

    render(<Optimized3DViewer structure={largeStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('Structure Info')).toBeInTheDocument();
  });

  it('handles invalid data gracefully', () => {
    const invalidStructure: any = {
      nodes: [
        { id: '1', position: [NaN, 0, 0], support: { x: true, y: true, z: true, rx: false, ry: false, rz: false } },
        { id: '2', position: [5, Infinity, 0], support: { x: false, y: false, z: false, rx: false, ry: false, rz: false } }
      ],
      elements: [
        { 
          id: '1', 
          type: 'beam',
          startNode: '1',
          endNode: '2',
          section: {
            width: 0.3,
            height: 0.5
          },
          material: 'concrete'
        }
      ],
      loads: [],
      boundingBox: {
        min: [NaN, 0, 0],
        max: [5, Infinity, 0]
      },
      scale: 1
    };

    render(<Optimized3DViewer structure={invalidStructure} />);
    
    // Should still render without crashing
    expect(screen.getByText('Structure Info')).toBeInTheDocument();
  });
});