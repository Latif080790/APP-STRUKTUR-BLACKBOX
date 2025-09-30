/**
 * Basic Tests for Structural Analysis Components
 */

import { describe, it, expect } from 'vitest';
import { 
  analyzeStructureOptimized, 
  defaultOptimizationSettings 
} from './OptimizedStructuralAnalyzer';

describe('Basic Structural Analysis Tests', () => {
  describe('Optimization Settings', () => {
    it('should have valid default optimization settings', () => {
      expect(defaultOptimizationSettings).toBeDefined();
      expect(typeof defaultOptimizationSettings.useSparseMatrices).toBe('boolean');
      expect(typeof defaultOptimizationSettings.useConjugateGradient).toBe('boolean');
      expect(typeof defaultOptimizationSettings.cgTolerance).toBe('number');
      expect(typeof defaultOptimizationSettings.cgMaxIterations).toBe('number');
      expect(typeof defaultOptimizationSettings.memoryOptimization).toBe('boolean');
      expect(typeof defaultOptimizationSettings.enableProfiling).toBe('boolean');
    });

    it('should have reasonable default values', () => {
      expect(defaultOptimizationSettings.cgTolerance).toBeGreaterThan(0);
      expect(defaultOptimizationSettings.cgMaxIterations).toBeGreaterThan(0);
    });
  });

  describe('Analyzer Function', () => {
    it('should be a function', () => {
      expect(typeof analyzeStructureOptimized).toBe('function');
    });

    it('should handle empty input gracefully', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure);
      
      expect(result).toBeDefined();
      expect(Array.isArray(result.displacements)).toBe(true);
      expect(Array.isArray(result.forces)).toBe(true);
      expect(Array.isArray(result.stresses)).toBe(true);
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.maxDisplacement).toBe('number');
      expect(typeof result.maxStress).toBe('number');
    });

    it('should accept optimization settings', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };

      const customSettings = {
        ...defaultOptimizationSettings,
        enableProfiling: true
      };
      
      const result = analyzeStructureOptimized(emptyStructure, customSettings);
      
      expect(result).toBeDefined();
      expect(result.performance).toBeDefined();
    });
  });

  describe('Return Value Structure', () => {
    it('should return proper result structure', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure);
      
      // Check required properties
      expect(result).toHaveProperty('displacements');
      expect(result).toHaveProperty('forces');
      expect(result).toHaveProperty('stresses');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('maxDisplacement');
      expect(result).toHaveProperty('maxStress');
      
      // Check types
      expect(Array.isArray(result.displacements)).toBe(true);
      expect(Array.isArray(result.forces)).toBe(true);
      expect(Array.isArray(result.stresses)).toBe(true);
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.maxDisplacement).toBe('number');
      expect(typeof result.maxStress).toBe('number');
    });

    it('should have valid numeric values', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };
      
      const result = analyzeStructureOptimized(emptyStructure);
      
      expect(Number.isFinite(result.maxDisplacement)).toBe(true);
      expect(Number.isFinite(result.maxStress)).toBe(true);
      expect(result.maxDisplacement).toBeGreaterThanOrEqual(0);
      expect(result.maxStress).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle null input gracefully', () => {
      const nullStructure = null as any;
      
      expect(() => {
        analyzeStructureOptimized(nullStructure);
      }).not.toThrow();
    });

    it('should handle undefined input gracefully', () => {
      const undefinedStructure = undefined as any;
      
      expect(() => {
        analyzeStructureOptimized(undefinedStructure);
      }).not.toThrow();
    });

    it('should handle invalid settings gracefully', () => {
      const emptyStructure = {
        nodes: [],
        elements: [],
        loads: []
      };

      const invalidSettings = {
        useSparseMatrices: 'invalid' as any,
        useConjugateGradient: null as any,
        cgTolerance: -1,
        cgMaxIterations: 0,
        memoryOptimization: undefined as any,
        enableProfiling: 'yes' as any
      };
      
      expect(() => {
        analyzeStructureOptimized(emptyStructure, invalidSettings);
      }).not.toThrow();
    });
  });
});