/**
 * Comprehensive Testing Framework
 * Unit tests, integration tests, and validation tests for the structural analysis system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components and utilities to test
import { StructuralAnalysisEngine, SeismicAnalysisEngine } from '../utils/structural-calculation-engine';
import { validateStructuralModel } from '../utils/validation';
import { generateDemoResults } from '../components/structural-analysis/results/demoResultsData';

// Mock data for testing
const mockProjectData = {
  projectInfo: {
    name: 'Test Building',
    location: 'Jakarta',
    buildingType: 'office',
    stories: 5,
    area: 1000
  },
  geometry: {
    length: 20,
    width: 15,
    height: 15,
    stories: 5
  },
  materials: {
    concrete: {
      fc: 25,
      density: 2400,
      elasticModulus: 25000
    },
    steel: {
      fy: 400,
      fu: 550,
      elasticModulus: 200000
    }
  },
  loads: {
    deadLoad: 5.0,
    liveLoad: 3.0,
    windLoad: 1.5
  },
  seismicParams: {
    siteClass: 'SD',
    Ss: 1.25,
    S1: 0.45,
    importance: 1.0
  }
};

const mockStructuralData = {
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

const mockLoads = [
  {
    nodeId: 2,
    forces: { fx: 0, fy: -10, fz: 0 },
    moments: { mx: 0, my: 0, mz: 0 }
  }
];

// Structural Analysis Engine Tests
describe('StructuralAnalysisEngine', () => {
  let engine: StructuralAnalysisEngine;

  beforeEach(() => {
    engine = new StructuralAnalysisEngine({
      tolerance: 1e-6,
      maxIterations: 1000,
      enableLogging: false
    });
  });

  describe('Basic Functionality', () => {
    it('should initialize correctly', () => {
      expect(engine).toBeDefined();
      expect(engine.getSettings().tolerance).toBe(1e-6);
      expect(engine.getSettings().maxIterations).toBe(1000);
    });

    it('should update settings correctly', () => {
      engine.updateSettings({ tolerance: 1e-8, maxIterations: 2000 });
      expect(engine.getSettings().tolerance).toBe(1e-8);
      expect(engine.getSettings().maxIterations).toBe(2000);
    });

    it('should validate node coordinates', () => {
      const validNode = { id: 1, x: 5.0, y: 3.0, z: 0.0 };
      const invalidNode = { id: 2, x: NaN, y: 3.0, z: 0.0 };
      
      expect(engine.validateNode(validNode)).toBe(true);
      expect(engine.validateNode(invalidNode)).toBe(false);
    });

    it('should validate element connectivity', () => {
      const validElement = {
        id: 1,
        nodeIds: [1, 2],
        section: { width: 0.3, height: 0.5, area: 0.15 },
        material: { elasticModulus: 25000, fc: 25 }
      };
      
      const invalidElement = {
        id: 2,
        nodeIds: [1, 1], // Same node twice
        section: { width: 0.3, height: 0.5, area: 0.15 },
        material: { elasticModulus: 25000, fc: 25 }
      };
      
      expect(engine.validateElement(validElement)).toBe(true);
      expect(engine.validateElement(invalidElement)).toBe(false);
    });
  });

  describe('Analysis Methods', () => {
    it('should perform static analysis', async () => {
      const result = await engine.performAnalysis(mockStructuralData, mockLoads);
      
      expect(result.success).toBe(true);
      expect(result.displacements).toBeDefined();
      expect(result.reactions).toBeDefined();
      expect(result.elementForces).toBeDefined();
      expect(result.displacements.length).toBe(mockStructuralData.nodes.length);
    });

    it('should calculate element stresses', () => {
      const elementData = {
        forces: { axial: 100, shear: 50, moment: 200 },
        section: { width: 0.3, height: 0.5, area: 0.15, momentOfInertia: 0.003125 }
      };
      
      const stresses = engine.calculateElementStresses(elementData);
      expect(stresses.axial).toBeCloseTo(100 / 0.15, 2); // N/A
      expect(stresses.bending).toBeGreaterThan(0);
      expect(stresses.shear).toBeGreaterThan(0);
    });

    it('should detect analysis convergence', () => {
      const previous = [1.0, 2.0, 3.0];
      const current = [1.001, 2.002, 3.003];
      const tolerance = 0.01;

      const converged = engine.hasConverged(previous, current, tolerance);
      expect(converged).toBe(true);

      const notConverged = engine.hasConverged(previous, [1.1, 2.1, 3.1], tolerance);
      expect(notConverged).toBe(false);
    });
  });

  describe('Design Code Compliance', () => {
    it('should check SNI concrete requirements', () => {
      const concreteData = {
        fc: 25, // MPa
        width: 300, // mm
        height: 500, // mm
        moment: 150, // kNm
        axialForce: 200, // kN
        reinforcement: { area: 12 } // cm²
      };

      const compliance = engine.checkConcreteDesign(concreteData);
      expect(compliance.flexuralCheck).toBeDefined();
      expect(compliance.compressionCheck).toBeDefined();
      expect(compliance.minReinforcementCheck).toBeDefined();
    });

    it('should calculate required reinforcement', () => {
      const beamData = {
        moment: 150, // kNm
        width: 300, // mm
        height: 500, // mm
        effectiveDepth: 450, // mm
        fc: 25, // MPa
        fy: 400 // MPa
      };

      const reinforcement = engine.calculateRequiredReinforcement(beamData);
      expect(reinforcement.area).toBeGreaterThan(0);
      expect(reinforcement.bars).toBeGreaterThan(0);
      expect(reinforcement.ratio).toBeGreaterThan(0);
    });
  });
});

// Seismic Analysis Engine Tests
describe('SeismicAnalysisEngine', () => {
  let seismicEngine: SeismicAnalysisEngine;

  beforeEach(() => {
    seismicEngine = new SeismicAnalysisEngine();
  });

  describe('Response Spectrum Analysis', () => {
    it('should calculate design response spectrum', () => {
      const params = seismicEngine.calculateDesignSpectrum(mockProjectData.seismicParams);
      
      expect(params.SDS).toBeDefined();
      expect(params.SD1).toBeDefined();
      expect(params.Fa).toBeDefined();
      expect(params.Fv).toBeDefined();
      expect(params.SDS).toBeGreaterThan(0);
      expect(params.SD1).toBeGreaterThan(0);
    });

    it('should generate response spectrum curve', () => {
      const spectrum = seismicEngine.generateResponseCurve(mockProjectData.seismicParams);
      
      expect(spectrum.periods).toBeDefined();
      expect(spectrum.accelerations).toBeDefined();
      expect(spectrum.periods.length).toBe(spectrum.accelerations.length);
      expect(spectrum.periods.length).toBeGreaterThan(50);
    });

    it('should calculate base shear coefficient', () => {
      const buildingData = {
        fundamentalPeriod: 0.8,
        importance: 1.0,
        responseModification: 5.0,
        weight: 5000
      };

      const baseShear = seismicEngine.calculateBaseShear(buildingData, mockProjectData.seismicParams);
      expect(baseShear.coefficient).toBeGreaterThan(0);
      expect(baseShear.force).toBeGreaterThan(0);
      expect(baseShear.force).toBeLessThan(buildingData.weight);
    });
  });

  describe('Story Drift Analysis', () => {
    it('should calculate inter-story drifts', () => {
      const displacements = [
        { story: 1, displacement: 5.0 },
        { story: 2, displacement: 12.0 },
        { story: 3, displacement: 18.0 },
        { story: 4, displacement: 23.0 },
        { story: 5, displacement: 27.0 }
      ];

      const drifts = seismicEngine.calculateInterStoryDrifts(displacements, 3.0);
      expect(drifts).toHaveLength(5);
      expect(drifts[0].drift).toBeCloseTo(5.0 / 3000, 4);
      expect(drifts[1].drift).toBeCloseTo(7.0 / 3000, 4);
    });

    it('should validate drift limits per SNI 1726', () => {
      const drifts = [
        { story: 1, drift: 0.015 },
        { story: 2, drift: 0.018 },
        { story: 3, drift: 0.020 },
        { story: 4, drift: 0.025 },
        { story: 5, drift: 0.030 }
      ];

      const validation = seismicEngine.validateDriftLimits(drifts, 'office');
      expect(validation.passed).toBe(false);
      expect(validation.violations).toHaveLength(1);
      expect(validation.violations[0].story).toBe(5);
    });
  });

  describe('Site Classification', () => {
    it('should determine site class from soil properties', () => {
      const soilData = {
        averageShearVelocity: 300, // m/s
        soilType: 'medium_dense_sand',
        depth: 30 // m
      };

      const siteClass = seismicEngine.determineSiteClass(soilData);
      expect(['SA', 'SB', 'SC', 'SD', 'SE', 'SF']).toContain(siteClass);
    });

    it('should calculate site coefficients', () => {
      const coefficients = seismicEngine.calculateSiteCoefficients('SD', 1.25, 0.45);
      expect(coefficients.Fa).toBeGreaterThan(0);
      expect(coefficients.Fv).toBeGreaterThan(0);
      expect(coefficients.Fa).toBeLessThan(3.0);
      expect(coefficients.Fv).toBeLessThan(3.0);
    });
  });
});

// Validation System Tests
describe('Validation System', () => {
  describe('Structural Data Validation', () => {
    it('should validate complete structural model', () => {
      const result = validateStructuralModel(mockStructuralData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const incompleteData = { ...mockStructuralData };
      incompleteData.nodes = [];
      
      const result = validateStructuralModel(incompleteData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate node coordinates', () => {
      const invalidData = {
        ...mockStructuralData,
        nodes: [
          { id: 1, x: NaN, y: 0, z: 0, supports: {} }
        ]
      };

      const result = validateStructuralModel(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('coordinate'))).toBe(true);
    });

    it('should validate element connectivity', () => {
      const invalidData = {
        ...mockStructuralData,
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
      expect(result.errors.some(e => e.includes('connectivity'))).toBe(true);
    });
  });

  describe('Material Property Validation', () => {
    it('should validate concrete properties', () => {
      const validConcrete = { fc: 25, density: 2400, elasticModulus: 25000 };
      const invalidConcrete = { fc: -10, density: 2400, elasticModulus: 25000 };

      expect(engine.validateMaterial(validConcrete)).toBe(true);
      expect(engine.validateMaterial(invalidConcrete)).toBe(false);
    });

    it('should validate steel properties', () => {
      const validSteel = { fy: 400, fu: 550, elasticModulus: 200000 };
      const invalidSteel = { fy: 600, fu: 550, elasticModulus: 200000 }; // fy > fu

      expect(engine.validateMaterial(validSteel)).toBe(true);
      expect(engine.validateMaterial(invalidSteel)).toBe(false);
    });
  });

  describe('Load Validation', () => {
    it('should validate load magnitudes', () => {
      const validLoads = [
        { nodeId: 1, forces: { fx: 10, fy: -20, fz: 0 } }
      ];
      const invalidLoads = [
        { nodeId: 1, forces: { fx: NaN, fy: -20, fz: 0 } }
      ];

      expect(engine.validateLoads(validLoads)).toBe(true);
      expect(engine.validateLoads(invalidLoads)).toBe(false);
    });

    it('should check load combination factors', () => {
      const loadCombination = {
        deadLoad: 1.4,
        liveLoad: 1.6,
        windLoad: 1.0
      };

      const validation = engine.validateLoadCombination(loadCombination);
      expect(validation.isValid).toBe(true);
      expect(validation.meetsCodeRequirements).toBe(true);
    });
  });
});

// Demo Data Generation Tests
describe('Demo Data Generation', () => {
  it('should generate realistic structural results', () => {
    const demoResults = generateDemoResults('Test Project');
    
    expect(demoResults.general.projectName).toBe('Test Project');
    expect(demoResults.general.status).toBe('completed');
    expect(demoResults.structural.maxDisplacement.value).toBeGreaterThan(0);
    expect(demoResults.seismic.baseShear.total).toBeGreaterThan(0);
    expect(demoResults.design.utilization.max).toBeLessThanOrEqual(1.0);
    expect(demoResults.economics.totalCost).toBeGreaterThan(0);
  });

  it('should generate consistent member designs', () => {
    const demoResults = generateDemoResults();
    
    expect(demoResults.design.reinforcement.beams.length).toBeGreaterThan(0);
    expect(demoResults.design.reinforcement.columns.length).toBeGreaterThan(0);
    
    demoResults.design.reinforcement.beams.forEach(beam => {
      expect(beam.utilization).toBeGreaterThan(0);
      expect(beam.utilization).toBeLessThanOrEqual(1.0);
      expect(beam.reinforcement.top).toBeGreaterThan(0);
      expect(beam.reinforcement.bottom).toBeGreaterThan(0);
    });
  });

  it('should generate reasonable cost estimates', () => {
    const demoResults = generateDemoResults();
    
    const materials = demoResults.economics.materialQuantities;
    expect(materials.concrete.volume).toBeGreaterThan(0);
    expect(materials.steel.weight).toBeGreaterThan(0);
    expect(materials.formwork.area).toBeGreaterThan(0);
    
    const totalMaterialCost = materials.concrete.cost + materials.steel.cost + materials.formwork.cost;
    expect(totalMaterialCost).toBe(demoResults.economics.totalCost);
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('should complete analysis within reasonable time', async () => {
    const largeStructure = {
      nodes: Array(20).fill(null).map((_, i) => ({
        id: i + 1,
        x: (i % 5) * 4,
        y: Math.floor(i / 5) * 3,
        z: 0,
        supports: i < 5 ? { x: true, y: true, z: true } : {}
      })),
      elements: Array(15).fill(null).map((_, i) => ({
        id: i + 1,
        nodeIds: [i + 1, i + 2],
        section: { width: 0.3, height: 0.5, area: 0.15 },
        material: { elasticModulus: 25000, fc: 25 },
        type: 'beam'
      }))
    };

    const loads = [
      { nodeId: 10, forces: { fx: 0, fy: -50, fz: 0 }, moments: { mx: 0, my: 0, mz: 0 } }
    ];

    const startTime = performance.now();
    const result = await engine.performAnalysis(largeStructure, loads);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    expect(result.success).toBe(true);
  });

  it('should handle memory efficiently', () => {
    // Test memory usage during analysis
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    // Perform multiple analyses
    for (let i = 0; i < 10; i++) {
      engine.performAnalysis(mockStructuralData, mockLoads);
    }
    
    const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
  });
});

// Error Handling Tests
describe('Error Handling', () => {
  it('should handle invalid structural data gracefully', async () => {
    const invalidStructure = { nodes: [], elements: [] };
    const result = await engine.performAnalysis(invalidStructure, []);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error).toContain('No structural elements');
  });

  it('should handle unstable structures', async () => {
    const unstableStructure = {
      nodes: [
        { id: 1, x: 0, y: 0, z: 0, supports: {} }, // No supports
        { id: 2, x: 5, y: 0, z: 0, supports: {} }
      ],
      elements: [
        {
          id: 1,
          nodeIds: [1, 2],
          section: { width: 0.3, height: 0.5, area: 0.15 },
          material: { elasticModulus: 25000, fc: 25 },
          type: 'beam'
        }
      ]
    };

    const result = await engine.performAnalysis(unstableStructure, mockLoads);
    expect(result.success).toBe(false);
    expect(result.error).toContain('unstable');
  });

  it('should handle numerical overflow', () => {
    const extremeLoads = [
      { nodeId: 1, forces: { fx: 1e15, fy: 1e15, fz: 1e15 } }
    ];

    expect(async () => {
      await engine.performAnalysis(mockStructuralData, extremeLoads);
    }).not.toThrow();
  });
});

// Integration Tests
describe('Integration Tests', () => {
  it('should perform complete workflow analysis', async () => {
    // Step 1: Validate input
    const validation = validateStructuralModel(mockStructuralData);
    expect(validation.isValid).toBe(true);

    // Step 2: Perform structural analysis
    const structuralResult = await engine.performAnalysis(mockStructuralData, mockLoads);
    expect(structuralResult.success).toBe(true);

    // Step 3: Perform seismic analysis
    const seismicResult = seismicEngine.calculateDesignSpectrum(mockProjectData.seismicParams);
    expect(seismicResult).toBeDefined();

    // Step 4: Generate comprehensive results
    const demoResults = generateDemoResults(mockProjectData.projectInfo.name);
    expect(demoResults.general.projectName).toBe(mockProjectData.projectInfo.name);

    // Step 5: Validate all results are consistent
    expect(structuralResult.displacements.length).toBe(mockStructuralData.nodes.length);
    expect(seismicResult.SDS).toBeGreaterThan(0);
    expect(demoResults.general.status).toBe('completed');
  });
});

export { mockProjectData, mockStructuralData };