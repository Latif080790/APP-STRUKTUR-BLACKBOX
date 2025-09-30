import { describe, it, expect } from 'vitest';
import { analyzeStructure } from './analysis/StructuralAnalyzer';
import { Structure3D } from '@/types/structural';

describe('StructuralAnalysisSystem', () => {
  it('should analyze a simple structure', () => {
    // Create a simple structure with two nodes and one element
    const structure: Structure3D = {
      nodes: [
        { id: '1', x: 0, y: 0, z: 0 },
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
            yieldStrength: 250e6
          },
          section: {
            id: 'rect1',
            name: 'Rectangular Section',
            type: 'rectangular',
            width: 0.2,
            height: 0.4
          }
        }
      ]
    };

    // Run the analysis
    const result = analyzeStructure(structure);

    // Check that we get the expected results
    expect(result.displacements).toHaveLength(2);
    expect(result.forces).toHaveLength(1);
    expect(result.stresses).toHaveLength(1);
    expect(typeof result.maxDisplacement).toBe('number');
    expect(typeof result.maxStress).toBe('number');
    expect(typeof result.isValid).toBe('boolean');
  });

  it('should handle empty structure', () => {
    const structure: Structure3D = {
      nodes: [],
      elements: []
    };

    const result = analyzeStructure(structure);

    expect(result.displacements).toEqual([]);
    expect(result.forces).toEqual([]);
    expect(result.stresses).toEqual([]);
    expect(result.isValid).toBe(true);
    expect(result.maxDisplacement).toBe(0);
    expect(result.maxStress).toBe(0);
  });
});