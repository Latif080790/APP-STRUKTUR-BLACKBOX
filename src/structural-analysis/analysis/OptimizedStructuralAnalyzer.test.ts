/**
 * Tests for Optimized Structural Analyzer
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  analyzeStructureOptimized, 
  defaultOptimizationSettings,
  calculateSectionProperties 
} from './OptimizedStructuralAnalyzer';
import { Structure3D, Element, Node } from '@/types/structural';

describe('OptimizedStructuralAnalyzer', () => {
  let simpleStructure: Structure3D;
  
  beforeEach(() => {
    // Create a simple test structure
    simpleStructure = {
      nodes: [
        {
          id: 'N1',
          x: 0,
          y: 0,
          z: 0,
          supports: { ux: true, uy: true, uz: true, rx: true, ry: true, rz: true }
        },
        {
          id: 'N2',
          x: 3,
          y: 0,
          z: 0,
          supports: {}
        }
      ],
      elements: [
        {
          id: 'E1',
          type: 'beam',
          nodes: ['N1', 'N2'],
          material: {
            type: 'steel',
            elasticModulus: 2e11,
            yieldStrength: 250e6,
            poissonsRatio: 0.3
          },
          section: {
            type: 'rectangular',
            width: 0.2,
            height: 0.4,
            area: 0.08,
            momentOfInertiaY: 0.001067,
            momentOfInertiaZ: 0.000267
          }
        }
      ],
      loads: [
        {
          type: 'point',
          nodeId: 'N2',
          direction: 'y',
          magnitude: -10000
        }
      ]
    };
  });

  describe('analyzeStructureOptimized', () => {
    it('should analyze a simple structure successfully', () => {
      const result = analyzeStructureOptimized(simpleStructure);
      
      expect(result).toBeDefined();
      expect(result.displacements).toHaveLength(2);
      expect(result.forces).toHaveLength(1);
      expect(result.stresses).toHaveLength(1);
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.maxDisplacement).toBe('number');
      expect(typeof result.maxStress).toBe('number');
    });

    it('should use default optimization settings', () => {
      const result = analyzeStructureOptimized(simpleStructure);
      expect(result).toBeDefined();
    });

    it('should handle custom optimization settings', () => {
      const customSettings = {
        ...defaultOptimizationSettings,
        useConjugateGradient: false,
        enableProfiling: true
      };
      
      const result = analyzeStructureOptimized(simpleStructure, customSettings);
      expect(result).toBeDefined();
      expect(result.performance).toBeDefined();
    });

    it('should handle structures with no loads', () => {
      const structureNoLoads = { ...simpleStructure, loads: [] };
      const result = analyzeStructureOptimized(structureNoLoads);
      
      expect(result).toBeDefined();
      expect(result.displacements.every(d => 
        d.ux === 0 && d.uy === 0 && d.uz === 0
      )).toBe(true);
    });

    it('should handle empty structure gracefully', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure);
      expect(result).toBeDefined();
      expect(result.displacements).toHaveLength(0);
      expect(result.forces).toHaveLength(0);
      expect(result.stresses).toHaveLength(0);
    });
  });

  describe('calculateSectionProperties', () => {
    it('should calculate rectangular section properties correctly', () => {
      const element: Element = {
        id: 'E1',
        type: 'beam',
        nodes: ['N1', 'N2'],
        material: {
          type: 'steel',
          elasticModulus: 2e11
        },
        section: {
          type: 'rectangular',
          width: 0.2,
          height: 0.4
        }
      };

      const props = calculateSectionProperties(element);
      
      expect(props.area).toBeCloseTo(0.08, 5);
      expect(props.momentOfInertiaY).toBeCloseTo(0.001067, 5);
      expect(props.momentOfInertiaZ).toBeCloseTo(0.000267, 5);
    });

    it('should calculate circular section properties correctly', () => {
      const element: Element = {
        id: 'E1',
        type: 'beam',
        nodes: ['N1', 'N2'],
        material: {
          type: 'steel',
          elasticModulus: 2e11
        },
        section: {
          type: 'circular',
          width: 0.4, // diameter
          height: 0.4
        }
      };

      const props = calculateSectionProperties(element);
      const expectedArea = Math.PI * Math.pow(0.2, 2);
      
      expect(props.area).toBeCloseTo(expectedArea, 5);
      expect(props.momentOfInertiaY).toBeCloseTo(props.momentOfInertiaZ, 5);
    });

    it('should handle i-section properties', () => {
      const element: Element = {
        id: 'E1',
        type: 'beam',
        nodes: ['N1', 'N2'],
        material: {
          type: 'steel',
          elasticModulus: 2e11
        },
        section: {
          type: 'i-section',
          width: 0.2,
          height: 0.4,
          area: 0.05,
          momentOfInertiaY: 0.002,
          momentOfInertiaZ: 0.0005
        }
      };

      const props = calculateSectionProperties(element);
      
      expect(props.area).toBe(0.05);
      expect(props.momentOfInertiaY).toBe(0.002);
      expect(props.momentOfInertiaZ).toBe(0.0005);
    });
  });

  describe('Performance and Memory Optimization', () => {
    it('should handle large structures efficiently', () => {
      // Create a larger structure for performance testing
      const nodes = [];
      const elements = [];
      
      // Create a grid of nodes
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          nodes.push({
            id: `N${i}_${j}`,
            x: i * 3,
            y: j * 3,
            z: 0,
            supports: i === 0 && j === 0 ? { ux: true, uy: true, uz: true } : {}
          });
        }
      }

      // Create elements connecting adjacent nodes
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 10; j++) {
          elements.push({
            id: `E_H_${i}_${j}`,
            type: 'beam',
            nodes: [`N${i}_${j}`, `N${i + 1}_${j}`],
            material: {
              type: 'steel',
              elasticModulus: 2e11
            },
            section: {
              type: 'rectangular',
              width: 0.1,
              height: 0.2
            }
          });
        }
      }

      const largeStructure = { nodes, elements, loads: [] };
      
      const startTime = performance.now();
      const result = analyzeStructureOptimized(largeStructure, {
        ...defaultOptimizationSettings,
        enableProfiling: true
      });
      const endTime = performance.now();
      
      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(result.performance).toBeDefined();
    });

    it('should use sparse matrices for optimization', () => {
      const settings = {
        ...defaultOptimizationSettings,
        useSparseMatrices: true,
        useConjugateGradient: true
      };
      
      const result = analyzeStructureOptimized(simpleStructure, settings);
      expect(result).toBeDefined();
    });

    it('should use memory optimization', () => {
      const settings = {
        ...defaultOptimizationSettings,
        memoryOptimization: true
      };
      
      const result = analyzeStructureOptimized(simpleStructure, settings);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid node references gracefully', () => {
      const invalidStructure = {
        nodes: [
          { id: 'N1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true } }
        ],
        elements: [
          {
            id: 'E1',
            type: 'beam',
            nodes: ['N1', 'N_INVALID'], // Invalid node reference
            material: { type: 'steel', elasticModulus: 2e11 },
            section: { type: 'rectangular', width: 0.2, height: 0.4 }
          }
        ],
        loads: []
      };
      
      const result = analyzeStructureOptimized(invalidStructure);
      expect(result).toBeDefined();
      expect(result.isValid).toBe(false);
    });

    it('should handle missing material properties', () => {
      const invalidStructure = {
        ...simpleStructure,
        elements: [{
          id: 'E1',
          type: 'beam',
          nodes: ['N1', 'N2'],
          material: {}, // Missing properties
          section: { type: 'rectangular', width: 0.2, height: 0.4 }
        }]
      };
      
      const result = analyzeStructureOptimized(invalidStructure);
      expect(result).toBeDefined();
    });
  });
});