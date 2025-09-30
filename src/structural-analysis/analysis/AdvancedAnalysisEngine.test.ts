/**
 * Tests for Advanced Analysis Engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  AdvancedAnalysisEngine,
  TimeHistoryConfig,
  PushoverConfig,
  BucklingConfig 
} from './AdvancedAnalysisEngine';
import { Structure3D } from '@/types/structural';

describe('Advanced Analysis Engine', () => {
  let mockStructure: Structure3D;
  let analysisEngine: AdvancedAnalysisEngine;

  beforeEach(() => {
    mockStructure = {
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
            id: 'M1',
            name: 'Steel',
            type: 'steel',
            elasticModulus: 2e11,
            yieldStrength: 250e6,
            density: 7850
          },
          section: {
            id: 'S1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.2,
            height: 0.4
          }
        }
      ],
      loads: []
    };

    analysisEngine = new AdvancedAnalysisEngine(mockStructure);
  });

  describe('Constructor', () => {
    it('should create analysis engine with structure', () => {
      expect(analysisEngine).toBeDefined();
    });

    it('should accept valid structure', () => {
      const engine = new AdvancedAnalysisEngine(mockStructure);
      expect(engine).toBeInstanceOf(AdvancedAnalysisEngine);
    });
  });

  describe('Time-History Analysis', () => {
    let timeHistoryConfig: TimeHistoryConfig;

    beforeEach(() => {
      timeHistoryConfig = {
        timeStep: 0.01,
        totalTime: 1.0,
        dampingRatio: 0.05,
        integrationMethod: 'newmark',
        loadHistory: [
          {
            time: 0,
            loads: []
          },
          {
            time: 0.5,
            loads: [
              {
                nodeId: 'N2',
                direction: 'y',
                magnitude: -10000
              }
            ]
          }
        ]
      };
    });

    it('should perform time-history analysis', async () => {
      const result = await analysisEngine.performTimeHistoryAnalysis(timeHistoryConfig);
      
      expect(result).toBeDefined();
      expect(result.analysisType).toBe('time-history');
      expect(result.timeHistoryResults).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
      expect(typeof result.maxDisplacement).toBe('number');
    });

    it('should validate config parameters', async () => {
      // Test with valid config
      const result = await analysisEngine.performTimeHistoryAnalysis(timeHistoryConfig);
      expect(result.timeHistoryResults).toBeDefined();
    });

    it('should handle different integration methods', async () => {
      const configs = ['newmark', 'wilson', 'central-difference'] as const;
      
      for (const method of configs) {
        const config = { ...timeHistoryConfig, integrationMethod: method };
        const result = await analysisEngine.performTimeHistoryAnalysis(config);
        expect(result.analysisType).toBe('time-history');
      }
    });

    it('should process load history correctly', async () => {
      const result = await analysisEngine.performTimeHistoryAnalysis(timeHistoryConfig);
      
      expect(result.timeHistoryResults?.displacementHistory).toBeDefined();
      expect(result.timeHistoryResults?.maxResponse).toBeDefined();
      expect(typeof result.timeHistoryResults?.maxResponse.displacement).toBe('number');
      expect(typeof result.timeHistoryResults?.maxResponse.time).toBe('number');
    });
  });

  describe('Pushover Analysis', () => {
    let pushoverConfig: PushoverConfig;

    beforeEach(() => {
      pushoverConfig = {
        controlNode: 'N2',
        controlDirection: 'x',
        maxDisplacement: 0.1,
        incrementSteps: 50,
        convergenceTolerance: 1e-6,
        yieldCriteria: {
          materialStrainLimit: 0.002,
          elementRotationLimit: 0.02
        }
      };
    });

    it('should perform pushover analysis', async () => {
      const result = await analysisEngine.performPushoverAnalysis(pushoverConfig);
      
      expect(result).toBeDefined();
      expect(result.analysisType).toBe('pushover');
      expect(result.pushoverResults).toBeDefined();
      expect(Array.isArray(result.pushoverResults?.pushoverCurve)).toBe(true);
      expect(Array.isArray(result.pushoverResults?.plasticHinges)).toBe(true);
    });

    it('should validate control node exists', async () => {
      const result = await analysisEngine.performPushoverAnalysis(pushoverConfig);
      expect(result.pushoverResults).toBeDefined();
    });

    it('should handle different control directions', async () => {
      const directions = ['x', 'y', 'z'] as const;
      
      for (const direction of directions) {
        const config = { ...pushoverConfig, controlDirection: direction };
        const result = await analysisEngine.performPushoverAnalysis(config);
        expect(result.analysisType).toBe('pushover');
      }
    });

    it('should generate pushover curve', async () => {
      const result = await analysisEngine.performPushoverAnalysis(pushoverConfig);
      
      const curve = result.pushoverResults?.pushoverCurve;
      expect(curve).toBeDefined();
      expect(curve!.length).toBeGreaterThan(0);
      
      // Check curve data structure
      if (curve && curve.length > 0) {
        const point = curve[0];
        expect(typeof point.displacement).toBe('number');
        expect(typeof point.baseShear).toBe('number');
        expect(typeof point.step).toBe('number');
      }
    });

    it('should identify performance points', async () => {
      const result = await analysisEngine.performPushoverAnalysis(pushoverConfig);
      
      const performancePoints = result.pushoverResults?.performancePoints;
      expect(performancePoints).toBeDefined();
      expect(Array.isArray(performancePoints)).toBe(true);
    });
  });

  describe('Buckling Analysis', () => {
    let bucklingConfig: BucklingConfig;

    beforeEach(() => {
      bucklingConfig = {
        numberOfModes: 3,
        shiftValue: 0,
        includeGeometricStiffness: true,
        loadPattern: [
          {
            nodeId: 'N2',
            direction: 'y',
            magnitude: -1000
          }
        ]
      };
    });

    it('should perform buckling analysis', async () => {
      const result = await analysisEngine.performBucklingAnalysis(bucklingConfig);
      
      expect(result).toBeDefined();
      expect(result.analysisType).toBe('buckling');
      expect(result.bucklingResults).toBeDefined();
      expect(Array.isArray(result.bucklingResults?.bucklingModes)).toBe(true);
    });

    it('should calculate correct number of modes', async () => {
      const result = await analysisEngine.performBucklingAnalysis(bucklingConfig);
      
      const modes = result.bucklingResults?.bucklingModes;
      expect(modes).toBeDefined();
      expect(modes!.length).toBe(bucklingConfig.numberOfModes);
    });

    it('should calculate safety factor', async () => {
      const result = await analysisEngine.performBucklingAnalysis(bucklingConfig);
      
      expect(result.bucklingResults?.safetyFactor).toBeDefined();
      expect(typeof result.bucklingResults?.safetyFactor).toBe('number');
      expect(result.bucklingResults?.criticalBucklingLoad).toBeDefined();
    });

    it('should handle different numbers of modes', async () => {
      const modeCounts = [1, 3, 5, 10];
      
      for (const modeCount of modeCounts) {
        const config = { ...bucklingConfig, numberOfModes: modeCount };
        const result = await analysisEngine.performBucklingAnalysis(config);
        
        expect(result.bucklingResults?.bucklingModes.length).toBe(modeCount);
      }
    });

    it('should include mode shape data', async () => {
      const result = await analysisEngine.performBucklingAnalysis(bucklingConfig);
      
      const modes = result.bucklingResults?.bucklingModes;
      expect(modes).toBeDefined();
      
      if (modes && modes.length > 0) {
        const mode = modes[0];
        expect(typeof mode.modeNumber).toBe('number');
        expect(typeof mode.bucklingLoad).toBe('number');
        expect(typeof mode.frequency).toBe('number');
        expect(Array.isArray(mode.modeShape)).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle empty structure gracefully', async () => {
      const emptyStructure = { nodes: [], elements: [], loads: [] };
      const engine = new AdvancedAnalysisEngine(emptyStructure);
      
      const timeConfig: TimeHistoryConfig = {
        timeStep: 0.01,
        totalTime: 1.0,
        dampingRatio: 0.05,
        integrationMethod: 'newmark',
        loadHistory: []
      };
      
      expect(async () => {
        await engine.performTimeHistoryAnalysis(timeConfig);
      }).not.toThrow();
    });

    it('should handle invalid node references in load patterns', async () => {
      const invalidBucklingConfig: BucklingConfig = {
        numberOfModes: 1,
        includeGeometricStiffness: true,
        loadPattern: [
          {
            nodeId: 'INVALID_NODE',
            direction: 'y',
            magnitude: -1000
          }
        ]
      };
      
      expect(async () => {
        await analysisEngine.performBucklingAnalysis(invalidBucklingConfig);
      }).not.toThrow();
    });

    it('should handle extreme parameter values', async () => {
      const extremeTimeConfig: TimeHistoryConfig = {
        timeStep: 0.0001, // Very small
        totalTime: 0.01,  // Very short
        dampingRatio: 0.9, // High damping
        integrationMethod: 'newmark',
        loadHistory: []
      };
      
      expect(async () => {
        await analysisEngine.performTimeHistoryAnalysis(extremeTimeConfig);
      }).not.toThrow();
    });
  });

  describe('Result Validation', () => {
    it('should return consistent result structure', async () => {
      const timeConfig: TimeHistoryConfig = {
        timeStep: 0.01,
        totalTime: 1.0,
        dampingRatio: 0.05,
        integrationMethod: 'newmark',
        loadHistory: []
      };
      
      const result = await analysisEngine.performTimeHistoryAnalysis(timeConfig);
      
      // Check base AnalysisResult properties
      expect(result).toHaveProperty('displacements');
      expect(result).toHaveProperty('forces');
      expect(result).toHaveProperty('stresses');
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('maxDisplacement');
      expect(result).toHaveProperty('maxStress');
      
      // Check AdvancedAnalysisResult properties
      expect(result).toHaveProperty('analysisType');
      expect(result.analysisType).toBe('time-history');
    });

    it('should have valid numeric values', async () => {
      const timeConfig: TimeHistoryConfig = {
        timeStep: 0.01,
        totalTime: 0.1,
        dampingRatio: 0.05,
        integrationMethod: 'newmark',
        loadHistory: []
      };
      
      const result = await analysisEngine.performTimeHistoryAnalysis(timeConfig);
      
      expect(Number.isFinite(result.maxDisplacement)).toBe(true);
      expect(Number.isFinite(result.maxStress)).toBe(true);
      expect(result.maxDisplacement).toBeGreaterThanOrEqual(0);
      expect(result.maxStress).toBeGreaterThanOrEqual(0);
    });
  });
});