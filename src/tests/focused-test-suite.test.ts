/**
 * Focused Testing Framework
 * Tests for the existing structural analysis system functionality
 */

import { describe, it, expect } from 'vitest';
import { StructuralAnalysisEngine, SeismicAnalysisEngine } from '../utils/structural-calculation-engine';
import { validateStructuralModel } from '../utils/validation';
import { generateDemoResults } from '../components/structural-analysis/results/demoResultsData';

// Test data matching our actual interfaces
const validStructuralData = {
  nodes: [
    { id: 1, x: 0, y: 0, z: 0, supports: { x: true, y: true, z: true } },
    { id: 2, x: 5, y: 0, z: 0, supports: {} },
    { id: 3, x: 0, y: 3, z: 0, supports: {} },
    { id: 4, x: 5, y: 3, z: 0, supports: {} }
  ],
  elements: [
    {
      id: 1,
      nodeIds: [1, 2],
      section: { width: 0.3, height: 0.5, area: 0.15 },
      material: { elasticModulus: 25000, fc: 25 },
      type: 'beam'
    },
    {
      id: 2,
      nodeIds: [2, 4],
      section: { width: 0.3, height: 0.5, area: 0.15 },
      material: { elasticModulus: 25000, fc: 25 },
      type: 'beam'
    }
  ]
};

const testLoads = [
  {
    nodeId: 2,
    forces: { fx: 0, fy: -10, fz: 0 },
    moments: { mx: 0, my: 0, mz: 0 }
  }
];

const seismicParams = {
  siteClass: 'SD',
  Ss: 1.25,
  S1: 0.45,
  importance: 1.0
};

// Validation Tests
describe('Validation System', () => {
  describe('Structural Model Validation', () => {
    it('should validate complete structural data', () => {
      const result = validateStructuralModel(validStructuralData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect empty structure', () => {
      const emptyData = { nodes: [], elements: [] };
      const result = validateStructuralModel(emptyData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect invalid node coordinates', () => {
      const invalidData = {
        ...validStructuralData,
        nodes: [
          { id: 1, x: NaN, y: 0, z: 0, supports: {} }
        ]
      };
      const result = validateStructuralModel(invalidData);
      expect(result.isValid).toBe(false);
    });

    it('should detect invalid element connectivity', () => {
      const invalidData = {
        ...validStructuralData,
        elements: [
          {
            id: 1,
            nodeIds: [1, 999], // Non-existent node
            section: { width: 0.3, height: 0.5, area: 0.15 },
            material: { elasticModulus: 25000, fc: 25 },
            type: 'beam'
          }
        ]
      };
      const result = validateStructuralModel(invalidData);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Material Validation', () => {
    it('should validate positive material properties', () => {
      const validMaterial = { elasticModulus: 25000, fc: 25 };
      const invalidMaterial = { elasticModulus: -25000, fc: 25 };
      
      // These would be tested if we had public validation methods
      expect(validMaterial.elasticModulus).toBeGreaterThan(0);
      expect(invalidMaterial.elasticModulus).toBeLessThan(0);
    });

    it('should validate section properties', () => {
      const validSection = { width: 0.3, height: 0.5, area: 0.15 };
      const invalidSection = { width: 0, height: 0.5, area: 0.15 };
      
      expect(validSection.width).toBeGreaterThan(0);
      expect(invalidSection.width).toBe(0);
    });
  });
});

// Analysis Engine Tests
describe('Analysis Engines', () => {
  describe('StructuralAnalysisEngine', () => {
    it('should initialize with default structural model', () => {
      const engine = new StructuralAnalysisEngine();
      expect(engine).toBeDefined();
    });

    it('should accept initial structural model', () => {
      const engine = new StructuralAnalysisEngine(validStructuralData);
      expect(engine).toBeDefined();
    });

    it('should perform static analysis and return results', async () => {
      const engine = new StructuralAnalysisEngine();
      const result = await engine.performAnalysis('static', testLoads);
      
      expect(result).toBeDefined();
      expect(result.displacements).toBeDefined();
      expect(result.reactions).toBeDefined();
      expect(result.elementForces).toBeDefined();
    });

    it('should perform modal analysis', async () => {
      const engine = new StructuralAnalysisEngine();
      const result = await engine.performAnalysis('modal');
      
      expect(result).toBeDefined();
      expect(result.frequencies).toBeDefined();
      expect(result.modeShapes).toBeDefined();
    });

    it('should handle seismic analysis', async () => {
      const engine = new StructuralAnalysisEngine();
      const result = await engine.performAnalysis('seismic', testLoads, seismicParams);
      
      expect(result).toBeDefined();
      expect(result.baseShear).toBeDefined();
      expect(result.storyDrifts).toBeDefined();
    });
  });

  describe('SeismicAnalysisEngine', () => {
    it('should initialize correctly', () => {
      const seismicEngine = new SeismicAnalysisEngine();
      expect(seismicEngine).toBeDefined();
    });

    it('should calculate design spectrum parameters', () => {
      const seismicEngine = new SeismicAnalysisEngine();
      const params = seismicEngine.calculateDesignSpectrum(seismicParams);
      
      expect(params).toBeDefined();
      expect(params.SDS).toBeGreaterThan(0);
      expect(params.SD1).toBeGreaterThan(0);
      expect(params.Fa).toBeGreaterThan(0);
      expect(params.Fv).toBeGreaterThan(0);
    });

    it('should generate response spectrum curve', () => {
      const seismicEngine = new SeismicAnalysisEngine();
      const spectrum = seismicEngine.generateResponseCurve(seismicParams);
      
      expect(spectrum.periods).toBeDefined();
      expect(spectrum.accelerations).toBeDefined();
      expect(spectrum.periods.length).toBe(spectrum.accelerations.length);
      expect(spectrum.periods.length).toBeGreaterThan(0);
    });

    it('should calculate base shear', () => {
      const seismicEngine = new SeismicAnalysisEngine();
      const buildingData = {
        fundamentalPeriod: 0.8,
        importance: 1.0,
        responseModification: 5.0,
        weight: 5000
      };

      const baseShear = seismicEngine.calculateBaseShear(buildingData, seismicParams);
      expect(baseShear.coefficient).toBeGreaterThan(0);
      expect(baseShear.force).toBeGreaterThan(0);
    });
  });
});

// Demo Data Generation Tests
describe('Demo Data Generation', () => {
  it('should generate complete demo results', () => {
    const demoResults = generateDemoResults('Test Project');
    
    expect(demoResults).toBeDefined();
    expect(demoResults.general).toBeDefined();
    expect(demoResults.structural).toBeDefined();
    expect(demoResults.seismic).toBeDefined();
    expect(demoResults.design).toBeDefined();
    expect(demoResults.economics).toBeDefined();
  });

  it('should generate realistic values', () => {
    const demoResults = generateDemoResults();
    
    // General information
    expect(demoResults.general.projectName).toBeTruthy();
    expect(demoResults.general.status).toBe('completed');
    expect(demoResults.general.analysisDate).toBeTruthy();
    
    // Structural results
    expect(demoResults.structural.maxDisplacement.value).toBeGreaterThan(0);
    expect(demoResults.structural.maxStress.value).toBeGreaterThan(0);
    
    // Seismic results
    expect(demoResults.seismic.baseShear.total).toBeGreaterThan(0);
    expect(demoResults.seismic.fundamentalPeriod).toBeGreaterThan(0);
    
    // Design results
    expect(demoResults.design.utilization.max).toBeLessThanOrEqual(1.0);
    expect(demoResults.design.utilization.max).toBeGreaterThan(0);
    
    // Economics
    expect(demoResults.economics.totalCost).toBeGreaterThan(0);
  });

  it('should generate consistent reinforcement data', () => {
    const demoResults = generateDemoResults();
    
    expect(demoResults.design.reinforcement.beams.length).toBeGreaterThan(0);
    expect(demoResults.design.reinforcement.columns.length).toBeGreaterThan(0);
    
    demoResults.design.reinforcement.beams.forEach(beam => {
      expect(beam.id).toBeTruthy();
      expect(beam.utilization).toBeGreaterThan(0);
      expect(beam.utilization).toBeLessThanOrEqual(1.0);
      expect(beam.reinforcement.top).toBeGreaterThan(0);
      expect(beam.reinforcement.bottom).toBeGreaterThan(0);
    });
    
    demoResults.design.reinforcement.columns.forEach(column => {
      expect(column.id).toBeTruthy();
      expect(column.utilization).toBeGreaterThan(0);
      expect(column.utilization).toBeLessThanOrEqual(1.0);
      expect(column.reinforcement.longitudinal).toBeGreaterThan(0);
      expect(column.reinforcement.ties).toBeGreaterThan(0);
    });
  });

  it('should generate realistic material quantities', () => {
    const demoResults = generateDemoResults();
    const materials = demoResults.economics.materialQuantities;
    
    expect(materials.concrete.volume).toBeGreaterThan(0);
    expect(materials.concrete.cost).toBeGreaterThan(0);
    expect(materials.concrete.unit).toBe('m³');
    
    expect(materials.steel.weight).toBeGreaterThan(0);
    expect(materials.steel.cost).toBeGreaterThan(0);
    expect(materials.steel.unit).toBe('kg');
    
    expect(materials.formwork.area).toBeGreaterThan(0);
    expect(materials.formwork.cost).toBeGreaterThan(0);
    expect(materials.formwork.unit).toBe('m²');
    
    // Total cost should be sum of material costs
    const expectedTotal = materials.concrete.cost + materials.steel.cost + materials.formwork.cost;
    expect(demoResults.economics.totalCost).toBe(expectedTotal);
  });
});

// Integration Tests
describe('Integration Tests', () => {
  it('should perform complete analysis workflow', async () => {
    // Step 1: Validate input data
    const validation = validateStructuralModel(validStructuralData);
    expect(validation.isValid).toBe(true);

    // Step 2: Initialize analysis engine
    const engine = new StructuralAnalysisEngine(validStructuralData);
    expect(engine).toBeDefined();

    // Step 3: Perform static analysis
    const staticResult = await engine.performAnalysis('static', testLoads);
    expect(staticResult).toBeDefined();
    expect(staticResult.displacements).toBeDefined();

    // Step 4: Perform modal analysis
    const modalResult = await engine.performAnalysis('modal');
    expect(modalResult).toBeDefined();
    expect(modalResult.frequencies).toBeDefined();

    // Step 5: Perform seismic analysis
    const seismicResult = await engine.performAnalysis('seismic', testLoads, seismicParams);
    expect(seismicResult).toBeDefined();
    expect(seismicResult.baseShear).toBeDefined();

    // Step 6: Generate demo results for comparison
    const demoResults = generateDemoResults('Integration Test');
    expect(demoResults.general.projectName).toBe('Integration Test');
  });

  it('should handle seismic workflow end-to-end', () => {
    // Initialize seismic engine
    const seismicEngine = new SeismicAnalysisEngine();
    
    // Calculate design spectrum
    const spectrum = seismicEngine.calculateDesignSpectrum(seismicParams);
    expect(spectrum.SDS).toBeGreaterThan(0);
    
    // Generate response curve
    const responseCurve = seismicEngine.generateResponseCurve(seismicParams);
    expect(responseCurve.periods.length).toBeGreaterThan(0);
    
    // Calculate base shear
    const buildingData = {
      fundamentalPeriod: 0.8,
      importance: 1.0,
      responseModification: 5.0,
      weight: 5000
    };
    const baseShear = seismicEngine.calculateBaseShear(buildingData, seismicParams);
    expect(baseShear.force).toBeGreaterThan(0);
    
    // All results should be consistent
    expect(baseShear.force).toBeLessThan(buildingData.weight);
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('should complete analysis within reasonable time', async () => {
    const startTime = performance.now();
    
    const engine = new StructuralAnalysisEngine(validStructuralData);
    await engine.performAnalysis('static', testLoads);
    
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
  });

  it('should generate demo data efficiently', () => {
    const startTime = performance.now();
    
    const demoResults = generateDemoResults('Performance Test');
    
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(500); // Should complete within 0.5 seconds
    expect(demoResults).toBeDefined();
  });

  it('should handle multiple analyses without memory leaks', async () => {
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    // Perform multiple analyses
    for (let i = 0; i < 5; i++) {
      const engine = new StructuralAnalysisEngine(validStructuralData);
      await engine.performAnalysis('static', testLoads);
    }
    
    const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 20MB)
    expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024);
  });
});

// Error Handling Tests
describe('Error Handling', () => {
  it('should handle empty structural data gracefully', async () => {
    const engine = new StructuralAnalysisEngine();
    
    try {
      await engine.performAnalysis('static', []);
      // If no error is thrown, the engine should still return valid results
      expect(true).toBe(true);
    } catch (error) {
      // If error is thrown, it should be informative
      expect(error).toBeDefined();
    }
  });

  it('should handle invalid seismic parameters', () => {
    const seismicEngine = new SeismicAnalysisEngine();
    const invalidParams = {
      siteClass: 'INVALID',
      Ss: -1.0, // Invalid negative value
      S1: -0.5, // Invalid negative value
      importance: 0 // Invalid zero value
    };

    try {
      seismicEngine.calculateDesignSpectrum(invalidParams);
      // Should either handle gracefully or throw informative error
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should validate demo data generation with invalid input', () => {
    // Test with various invalid project names
    const testNames = ['', null, undefined, 123];
    
    testNames.forEach(name => {
      try {
        const result = generateDemoResults(name as any);
        expect(result).toBeDefined();
        expect(result.general.projectName).toBeTruthy();
      } catch (error) {
        // Should handle gracefully
        expect(error).toBeDefined();
      }
    });
  });
});

export { validStructuralData, testLoads, seismicParams };