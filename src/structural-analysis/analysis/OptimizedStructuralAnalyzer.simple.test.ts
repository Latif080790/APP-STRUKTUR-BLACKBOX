/**
 * Simple Tests for Optimized Structural Analyzer
 */

import { describe, it, expect } from 'vitest';
import { 
  analyzeStructureOptimized, 
  defaultOptimizationSettings,
  calculateSectionProperties 
} from './OptimizedStructuralAnalyzer';

describe('OptimizedStructuralAnalyzer', () => {
  describe('defaultOptimizationSettings', () => {
    it('should have correct default settings', () => {
      expect(defaultOptimizationSettings).toBeDefined();
      expect(defaultOptimizationSettings.useSparseMatrices).toBe(true);
      expect(defaultOptimizationSettings.useConjugateGradient).toBe(true);
      expect(defaultOptimizationSettings.cgTolerance).toBe(1e-10);
      expect(defaultOptimizationSettings.cgMaxIterations).toBe(1000);
      expect(defaultOptimizationSettings.memoryOptimization).toBe(true);
      expect(defaultOptimizationSettings.enableProfiling).toBe(false);
    });
  });

  describe('calculateSectionProperties', () => {
    it('should calculate rectangular section properties', () => {
      const element = {
        id: 'E1',
        type: 'beam' as const,
        nodes: ['N1', 'N2'],
        material: {
          id: 'M1',
          name: 'Steel',
          type: 'steel' as const,
          elasticModulus: 2e11,
          density: 7850
        },
        section: {
          id: 'S1',
          name: 'Rect200x400',
          type: 'rectangular' as const,
          width: 0.2,
          height: 0.4
        }
      };

      const props = calculateSectionProperties(element);
      
      expect(props.area).toBeCloseTo(0.08, 5);
      expect(props.momentOfInertiaY).toBeCloseTo(0.001067, 5);
      expect(props.momentOfInertiaZ).toBeCloseTo(0.000267, 5);
    });

    it('should calculate circular section properties', () => {
      const element = {
        id: 'E1',
        type: 'beam' as const,
        nodes: ['N1', 'N2'],
        material: {
          id: 'M1',
          name: 'Steel',
          type: 'steel' as const,
          elasticModulus: 2e11,
          density: 7850
        },
        section: {
          id: 'S1',
          name: 'Circle400',
          type: 'circular' as const,
          width: 0.4, // diameter
          height: 0.4
        }
      };

      const props = calculateSectionProperties(element);
      const expectedArea = Math.PI * Math.pow(0.2, 2);
      
      expect(props.area).toBeCloseTo(expectedArea, 5);
      expect(props.momentOfInertiaY).toBeCloseTo(props.momentOfInertiaZ, 5);
    });

    it('should handle default section properties', () => {
      const element = {
        id: 'E1',
        type: 'beam' as const,
        nodes: ['N1', 'N2'],
        material: {
          id: 'M1',
          name: 'Steel',
          type: 'steel' as const,
          elasticModulus: 2e11,
          density: 7850
        },
        section: {
          id: 'S1',
          name: 'Custom',
          type: 'custom' as any,
          width: 0.2,
          height: 0.4
        }
      };

      const props = calculateSectionProperties(element);
      
      expect(props.area).toBe(0.08);
      expect(props.momentOfInertiaY).toBeCloseTo(0.001067, 5);
      expect(props.momentOfInertiaZ).toBeCloseTo(0.000267, 5);
    });
  });

  describe('analyzeStructureOptimized', () => {
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
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.maxDisplacement).toBe('number');
      expect(typeof result.maxStress).toBe('number');
    });

    it('should use default settings when none provided', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure);
      expect(result).toBeDefined();
    });

    it('should accept custom optimization settings', () => {
      const customSettings = {
        ...defaultOptimizationSettings,
        useConjugateGradient: false,
        enableProfiling: true
      };
      
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure, customSettings);
      expect(result).toBeDefined();
      expect(result.performance).toBeDefined();
    });

    it('should handle structures with disabled optimization', () => {
      const settings = {
        useSparseMatrices: false,
        useConjugateGradient: false,
        cgTolerance: 1e-10,
        cgMaxIterations: 1000,
        memoryOptimization: false,
        enableProfiling: false
      };
      
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure, settings);
      expect(result).toBeDefined();
    });
  });
});