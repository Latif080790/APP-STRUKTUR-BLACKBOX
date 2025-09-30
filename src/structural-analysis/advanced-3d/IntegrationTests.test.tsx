import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Simple3DViewer } from './Simple3DViewer';
import { Enhanced3DViewer } from './Enhanced3DViewer';
import { Structure3D } from '@/types/structural';

describe('Integration Tests for 3D Visualization Workflow', () => {
  // Test alur kerja lengkap dari input data hingga visualisasi 3D
  it('completes full workflow from data input to 3D visualization', () => {
    // Simulate a complete structural analysis workflow
    const structure: Structure3D = {
      nodes: [
        { 
          id: 1, 
          x: 0, 
          y: 0, 
          z: 0,
          supports: {
            ux: true,
            uy: true,
            uz: true,
            rx: true,
            ry: true,
            rz: true
          }
        },
        { 
          id: 2, 
          x: 5, 
          y: 0, 
          z: 0,
          supports: {
            ux: false,
            uy: false,
            uz: false,
            rx: false,
            ry: false,
            rz: false
          }
        },
        { 
          id: 3, 
          x: 0, 
          y: 3, 
          z: 0,
          supports: {
            ux: true,
            uy: true,
            uz: true,
            rx: false,
            ry: false,
            rz: false
          }
        }
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
      ],
      loads: [
        {
          id: 'load1',
          type: 'point',
          nodeId: 2,
          direction: 'y',
          magnitude: -10000 // 10 kN downward load
        }
      ]
    };

    render(<Enhanced3DViewer structure={structure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
    
    // Verify structure information is displayed
    expect(screen.getByText('Nodes:')).toBeInTheDocument();
    expect(screen.getByText('Elements:')).toBeInTheDocument();
  });

  // Test integrasi dengan sistem analisis
  it('integrates with analysis system', () => {
    // Simulate structure with analysis results
    const structureWithResults: any = {
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
          },
          stress: 0.75 // 75% utilization
        }
      ],
      analysisResults: {
        displacements: [
          {
            nodeId: 1,
            ux: 0,
            uy: 0,
            uz: 0,
            rx: 0,
            ry: 0,
            rz: 0
          },
          {
            nodeId: 2,
            ux: 0.001,
            uy: -0.005,
            uz: 0,
            rx: 0,
            ry: 0,
            rz: 0
          }
        ],
        forces: [
          {
            elementId: 1,
            nx: 0,
            vy: 0,
            vz: 0,
            tx: 0,
            my: 0,
            mz: -12500 // 12.5 kN·m moment
          }
        ],
        isValid: true,
        maxDisplacement: 0.005,
        maxStress: 0.75
      }
    };

    render(<Enhanced3DViewer 
      structure={structureWithResults} 
      analysisResults={structureWithResults.analysisResults}
      showStress={true}
    />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
    
    // Verify analysis results are displayed
    expect(screen.getByText('Analyzed')).toBeInTheDocument();
  });

  // Test alur error handling
  it('handles errors in workflow gracefully', () => {
    // Simulate structure with missing data
    const incompleteStructure: any = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 }
        // Missing second node
      ],
      elements: [
        { 
          id: 1, 
          type: 'beam', 
          nodes: [1, 2], // References non-existent node
          // Missing material and section
        }
      ]
    };

    render(<Simple3DViewer structure={incompleteStructure} />);
    
    // Should still render without crashing
    expect(screen.getByText('3D Controls')).toBeInTheDocument();
  });

  // Test workflow dengan struktur besar
  it('handles workflow with large structure', () => {
    // Create a large structure with 1000 nodes and elements
    const nodes = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      x: i % 50,
      y: Math.floor(i / 50),
      z: 0,
      supports: i < 50 ? {
        ux: true,
        uy: true,
        uz: true,
        rx: true,
        ry: true,
        rz: true
      } : undefined
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

    render(<Enhanced3DViewer structure={largeStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
    
    // Verify structure information is displayed
    expect(screen.getByText('Nodes:')).toBeInTheDocument();
    expect(screen.getByText('Elements:')).toBeInTheDocument();
  });

  // Test workflow dengan berbagai jenis material
  it('handles workflow with various materials', () => {
    const mixedMaterialStructure: Structure3D = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0 },
        { id: 2, x: 5, y: 0, z: 0 },
        { id: 3, x: 10, y: 0, z: 0 },
        { id: 4, x: 15, y: 0, z: 0 }
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
        },
        { 
          id: 3, 
          type: 'beam', 
          nodes: [3, 4],
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

    render(<Enhanced3DViewer structure={mixedMaterialStructure} />);
    
    // Verify component renders without errors
    expect(screen.getByText('3D Viewer Controls')).toBeInTheDocument();
  });
});