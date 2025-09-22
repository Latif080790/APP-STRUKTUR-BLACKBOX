/**
 * Simple Test Suite for Demo Data Generation
 * Tests the existing demo data functionality without complex integrations
 */

import { describe, it, expect } from 'vitest';
import { generateDemoResults } from '../components/structural-analysis/results/demoResultsData';

// Demo Data Tests
describe('Demo Data Generation', () => {
  it('should generate complete demo results with default name', () => {
    const demoResults = generateDemoResults();
    
    expect(demoResults).toBeDefined();
    expect(demoResults.general).toBeDefined();
    expect(demoResults.structural).toBeDefined();
    expect(demoResults.seismic).toBeDefined();
    expect(demoResults.design).toBeDefined();
    expect(demoResults.economics).toBeDefined();
  });

  it('should generate demo results with custom project name', () => {
    const projectName = 'Test Building Project';
    const demoResults = generateDemoResults(projectName);
    
    expect(demoResults.general.projectName).toBe(projectName);
    expect(demoResults.general.status).toBe('completed');
    expect(demoResults.general.analysisDate).toBeTruthy();
  });

  it('should generate realistic structural values', () => {
    const demoResults = generateDemoResults();
    
    // Structural results should be positive and realistic
    expect(demoResults.structural.maxDisplacement.value).toBeGreaterThan(0);
    expect(demoResults.structural.maxDisplacement.value).toBeLessThan(100); // Reasonable displacement in mm
    expect(demoResults.structural.maxDisplacement.location).toBeTruthy();
    
    expect(demoResults.structural.maxStress.value).toBeGreaterThan(0);
    expect(demoResults.structural.maxStress.value).toBeLessThan(500); // Reasonable stress in MPa
    
    expect(demoResults.structural.maxDeflection.value).toBeGreaterThan(0);
    expect(demoResults.structural.maxDeflection.location).toBeTruthy();
    
    expect(demoResults.structural.stability.bucklingFactors.length).toBeGreaterThan(0);
    expect(demoResults.structural.stability.modalFrequencies.length).toBeGreaterThan(0);
  });

  it('should generate realistic seismic values', () => {
    const demoResults = generateDemoResults();
    
    // Seismic results should be positive and within expected ranges
    expect(demoResults.seismic.baseShear.total).toBeGreaterThan(0);
    expect(demoResults.seismic.baseShear.x).toBeGreaterThan(0);
    expect(demoResults.seismic.baseShear.y).toBeGreaterThan(0);
    
    expect(demoResults.seismic.storyDrift.max).toBeGreaterThan(0);
    expect(demoResults.seismic.storyDrift.max).toBeLessThan(0.05); // Within drift limits
    expect(demoResults.seismic.storyDrift.location).toBeTruthy();
    
    expect(demoResults.seismic.responseSpectrumFactors.SDS).toBeGreaterThan(0);
    expect(demoResults.seismic.responseSpectrumFactors.SD1).toBeGreaterThan(0);
    expect(demoResults.seismic.responseSpectrumFactors.Fa).toBeGreaterThan(0);
    expect(demoResults.seismic.responseSpectrumFactors.Fv).toBeGreaterThan(0);
  });

  it('should generate realistic design values', () => {
    const demoResults = generateDemoResults();
    
    // Design utilization should be between 0 and 1
    expect(demoResults.design.utilization.max).toBeGreaterThan(0);
    expect(demoResults.design.utilization.max).toBeLessThanOrEqual(1.0);
    expect(demoResults.design.utilization.average).toBeGreaterThan(0);
    expect(demoResults.design.utilization.average).toBeLessThanOrEqual(1.0);
    expect(demoResults.design.utilization.average).toBeLessThanOrEqual(demoResults.design.utilization.max);
  });

  it('should generate consistent reinforcement data', () => {
    const demoResults = generateDemoResults();
    
    // Beams reinforcement
    expect(demoResults.design.reinforcement.beams.length).toBeGreaterThan(0);
    demoResults.design.reinforcement.beams.forEach(beam => {
      expect(beam.id).toBeTruthy();
      expect(beam.utilization).toBeGreaterThan(0);
      expect(beam.utilization).toBeLessThanOrEqual(1.0);
      expect(beam.longitudinal.top).toBeGreaterThan(0);
      expect(beam.longitudinal.bottom).toBeGreaterThan(0);
      expect(beam.transverse).toBeGreaterThan(0);
    });
    
    // Columns reinforcement
    expect(demoResults.design.reinforcement.columns.length).toBeGreaterThan(0);
    demoResults.design.reinforcement.columns.forEach(column => {
      expect(column.id).toBeTruthy();
      expect(column.utilization).toBeGreaterThan(0);
      expect(column.utilization).toBeLessThanOrEqual(1.0);
      expect(column.longitudinal).toBeGreaterThan(0);
      expect(column.transverse).toBeGreaterThan(0);
    });
  });

  it('should generate realistic economic values', () => {
    const demoResults = generateDemoResults();
    const materials = demoResults.economics.materialQuantities;
    
    // Concrete quantities
    expect(materials.concrete.volume).toBeGreaterThan(0);
    expect(materials.concrete.cost).toBeGreaterThan(0);
    
    // Steel quantities
    expect(materials.steel.weight).toBeGreaterThan(0);
    expect(materials.steel.cost).toBeGreaterThan(0);
    
    // Formwork quantities
    expect(materials.formwork.area).toBeGreaterThan(0);
    expect(materials.formwork.cost).toBeGreaterThan(0);
    
    // Total cost calculation
    const expectedTotal = materials.concrete.cost + materials.steel.cost + materials.formwork.cost;
    expect(demoResults.economics.totalCost).toBe(expectedTotal);
    
    // Cost per unit area should be reasonable
    expect(demoResults.economics.costPerSquareMeter).toBeGreaterThan(0);
    expect(demoResults.economics.costPerSquareMeter).toBeLessThan(50000); // Reasonable cost per m2 in IDR
  });

  it('should handle null or empty project names gracefully', () => {
    const testNames = [null, undefined, '', ' '];
    
    testNames.forEach(name => {
      const demoResults = generateDemoResults(name as any);
      expect(demoResults).toBeDefined();
      expect(demoResults.general.projectName).toBeTruthy();
      expect(demoResults.general.projectName.length).toBeGreaterThan(0);
    });
  });

  it('should generate consistent data across multiple calls', () => {
    const projectName = 'Consistency Test';
    const results1 = generateDemoResults(projectName);
    const results2 = generateDemoResults(projectName);
    
    // Project info should be same
    expect(results1.general.projectName).toBe(results2.general.projectName);
    expect(results1.general.status).toBe(results2.general.status);
    
    // Structure should be same
    expect(results1.structural.maxDisplacement.value).toBe(results2.structural.maxDisplacement.value);
    expect(results1.seismic.baseShear.total).toBe(results2.seismic.baseShear.total);
    expect(results1.economics.totalCost).toBe(results2.economics.totalCost);
  });

  it('should maintain reasonable relationships between values', () => {
    const demoResults = generateDemoResults();
    
    // Average utilization should be less than max utilization
    expect(demoResults.design.utilization.average).toBeLessThanOrEqual(demoResults.design.utilization.max);
    
    // Max drift should be within reasonable limits relative to building height
    expect(demoResults.seismic.storyDrift.max).toBeLessThan(0.05); // 5% drift limit
    
    // Total base shear should be greater than individual components
    const totalShear = demoResults.seismic.baseShear.total;
    const xShear = demoResults.seismic.baseShear.x;
    const yShear = demoResults.seismic.baseShear.y;
    expect(totalShear).toBeGreaterThan(xShear);
    expect(totalShear).toBeGreaterThan(yShear);
  });
});

// Performance Tests for Demo Data
describe('Demo Data Performance', () => {
  it('should generate demo data quickly', () => {
    const startTime = performance.now();
    const demoResults = generateDemoResults('Performance Test');
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
    expect(demoResults).toBeDefined();
  });

  it('should handle multiple rapid generations', () => {
    const startTime = performance.now();
    
    for (let i = 0; i < 10; i++) {
      generateDemoResults(`Test Project ${i}`);
    }
    
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(500); // 10 generations within 500ms
  });

  it('should not cause memory leaks', () => {
    // Skip memory test in environments where performance.memory is not available
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const initialMemory = (performance as any).memory.usedJSHeapSize;
      
      // Generate many demo results
      for (let i = 0; i < 50; i++) {
        generateDemoResults(`Memory Test ${i}`);
      }
      
      const finalMemory = (performance as any).memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    } else {
      // Just ensure the function completes without throwing
      for (let i = 0; i < 50; i++) {
        const result = generateDemoResults(`Memory Test ${i}`);
        expect(result).toBeDefined();
      }
    }
  });
});

export { generateDemoResults };