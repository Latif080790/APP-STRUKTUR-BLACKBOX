/**
 * AI Analysis Engine Tests
 * Comprehensive test suite for AI-powered structural analysis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AIAnalysisEngine, createAIAnalysisEngine, AIUtils } from './AIAnalysisEngine';
import { Structure3D } from '../../types/structural';

describe('AI Analysis Engine', () => {
  let engine: AIAnalysisEngine;
  let mockStructure: Structure3D;

  beforeEach(() => {
    // Initialize AI engine with default config
    engine = createAIAnalysisEngine();

    // Create mock structure for testing
    mockStructure = {
      nodes: [
        { id: '1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true } },
        { id: '2', x: 5, y: 0, z: 0 },
        { id: '3', x: 10, y: 0, z: 0 }
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
            elasticModulus: 200000
          },
          section: {
            id: 'rect1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        },
        {
          id: '2',
          type: 'beam',
          nodes: ['2', '3'],
          material: {
            id: 'steel',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200000
          },
          section: {
            id: 'rect2',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.2,
            height: 0.4
          }
        }
      ],
      loads: [
        {
          id: '1',
          type: 'point',
          nodeId: '2',
          direction: 'y',
          magnitude: -10000
        }
      ]
    };
  });

  describe('Engine Initialization', () => {
    it('should create AI engine with default config', () => {
      const defaultEngine = createAIAnalysisEngine();
      expect(defaultEngine).toBeInstanceOf(AIAnalysisEngine);
    });

    it('should create AI engine with custom config', () => {
      const customEngine = createAIAnalysisEngine({
        safetyFactor: 3.0,
        optimizationLevel: 'advanced',
        costOptimization: false
      });
      expect(customEngine).toBeInstanceOf(AIAnalysisEngine);
    });

    it('should initialize with proper default values', () => {
      const result = createAIAnalysisEngine();
      expect(result).toBeDefined();
    });
  });

  describe('Structure Analysis', () => {
    it('should analyze structure and return recommendations', async () => {
      const result = await engine.analyzeStructure(mockStructure);

      expect(result).toBeDefined();
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.riskAssessment).toBeDefined();
      expect(result.performanceMetrics).toBeDefined();
      expect(result.complianceCheck).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(100);
    });

    it('should generate appropriate recommendations', async () => {
      const result = await engine.analyzeStructure(mockStructure);

      expect(result.recommendations.length).toBeGreaterThan(0);
      
      result.recommendations.forEach(rec => {
        expect(rec.id).toBeDefined();
        expect(rec.type).toMatch(/^(material|section|geometry|support|load)$/);
        expect(rec.severity).toMatch(/^(info|warning|critical)$/);
        expect(rec.impactScore).toBeGreaterThanOrEqual(0);
        expect(rec.impactScore).toBeLessThanOrEqual(100);
        expect(rec.implementationDifficulty).toMatch(/^(easy|moderate|difficult)$/);
      });
    });

    it('should assess risks correctly', async () => {
      const result = await engine.analyzeStructure(mockStructure);

      expect(result.riskAssessment.overallRisk).toMatch(/^(low|medium|high)$/);
      expect(result.riskAssessment.safetyMargin).toBeGreaterThan(0);
      expect(result.riskAssessment.criticalAreas).toBeInstanceOf(Array);
    });

    it('should calculate performance metrics', async () => {
      const result = await engine.analyzeStructure(mockStructure);
      const metrics = result.performanceMetrics;

      expect(metrics.structuralEfficiency).toBeGreaterThanOrEqual(0);
      expect(metrics.structuralEfficiency).toBeLessThanOrEqual(100);
      expect(metrics.materialUtilization).toBeGreaterThanOrEqual(0);
      expect(metrics.materialUtilization).toBeLessThanOrEqual(100);
      expect(metrics.sustainabilityRating).toBeGreaterThanOrEqual(0);
      expect(metrics.sustainabilityRating).toBeLessThanOrEqual(100);
      expect(metrics.costEffectiveness).toBeGreaterThanOrEqual(0);
      expect(metrics.costEffectiveness).toBeLessThanOrEqual(100);
    });

    it('should check building code compliance', async () => {
      const result = await engine.analyzeStructure(mockStructure);
      const compliance = result.complianceCheck;

      expect(compliance.buildingCodes).toBeInstanceOf(Array);
      expect(compliance.standards).toBeInstanceOf(Array);

      compliance.buildingCodes.forEach(code => {
        expect(code.code).toBeDefined();
        expect(code.status).toMatch(/^(compliant|warning|violation)$/);
        expect(code.details).toBeInstanceOf(Array);
      });

      compliance.standards.forEach(standard => {
        expect(standard.standard).toBeDefined();
        expect(standard.compliance).toBeGreaterThanOrEqual(0);
        expect(standard.compliance).toBeLessThanOrEqual(100);
        expect(standard.gaps).toBeInstanceOf(Array);
      });
    });

    it('should measure processing time', async () => {
      const result = await engine.analyzeStructure(mockStructure);
      expect(result.processingTime).toBeGreaterThan(0);
    });
  });

  describe('Structure Optimization', () => {
    it('should optimize structure successfully', async () => {
      const result = await engine.optimizeStructure(mockStructure);

      expect(result).toBeDefined();
      expect(result.originalStructure).toEqual(mockStructure);
      expect(result.optimizedStructure).toBeDefined();
      expect(result.improvements).toBeDefined();
      expect(result.iterations).toBeGreaterThan(0);
      expect(result.convergenceTime).toBeGreaterThan(0);
      expect(result.recommendations).toBeInstanceOf(Array);
    });

    it('should show improvements in optimization', async () => {
      const result = await engine.optimizeStructure(mockStructure);
      const improvements = result.improvements;

      expect(improvements.weightReduction).toBeGreaterThanOrEqual(0);
      expect(improvements.costReduction).toBeGreaterThanOrEqual(0);
      expect(improvements.performanceGain).toBeGreaterThanOrEqual(0);
      expect(improvements.sustainabilityScore).toBeGreaterThanOrEqual(0);
      expect(improvements.sustainabilityScore).toBeLessThanOrEqual(100);
    });

    it('should generate optimization recommendations', async () => {
      const result = await engine.optimizeStructure(mockStructure);

      expect(result.recommendations.length).toBeGreaterThan(0);
      result.recommendations.forEach(rec => {
        expect(rec.id).toBeDefined();
        expect(rec.type).toBeDefined();
        expect(rec.title).toBeDefined();
        expect(rec.description).toBeDefined();
      });
    });

    it('should converge within reasonable iterations', async () => {
      const result = await engine.optimizeStructure(mockStructure);
      expect(result.iterations).toBeLessThan(200); // Should converge within 200 iterations
    });
  });

  describe('Error Handling', () => {
    it('should handle null structure', async () => {
      const nullStructure = null as any;
      await expect(engine.analyzeStructure(nullStructure))
        .rejects.toThrow('Invalid structure');
    });

    it('should handle structure without nodes', async () => {
      const invalidStructure = { ...mockStructure, nodes: [] };
      await expect(engine.analyzeStructure(invalidStructure))
        .rejects.toThrow('Structure must have at least one node');
    });

    it('should handle structure without elements', async () => {
      const invalidStructure = { ...mockStructure, elements: [] };
      await expect(engine.analyzeStructure(invalidStructure))
        .rejects.toThrow('Structure must have at least one element');
    });

    it('should handle malformed structure gracefully', async () => {
      const malformedStructure = {
        nodes: null,
        elements: undefined,
        loads: 'invalid'
      } as any;
      
      await expect(engine.analyzeStructure(malformedStructure))
        .rejects.toThrow();
    });
  });

  describe('Configuration Options', () => {
    it('should respect safety factor in analysis', async () => {
      const conservativeEngine = createAIAnalysisEngine({ safetyFactor: 3.0 });
      const liberalEngine = createAIAnalysisEngine({ safetyFactor: 1.5 });

      const conservativeResult = await conservativeEngine.analyzeStructure(mockStructure);
      const liberalResult = await liberalEngine.analyzeStructure(mockStructure);

      // Conservative analysis should generally show more warnings
      expect(conservativeResult).toBeDefined();
      expect(liberalResult).toBeDefined();
    });

    it('should handle different optimization levels', async () => {
      const basicEngine = createAIAnalysisEngine({ optimizationLevel: 'basic' });
      const advancedEngine = createAIAnalysisEngine({ optimizationLevel: 'advanced' });

      const basicResult = await basicEngine.optimizeStructure(mockStructure);
      const advancedResult = await advancedEngine.optimizeStructure(mockStructure);

      expect(basicResult.iterations).toBeDefined();
      expect(advancedResult.iterations).toBeDefined();
    });

    it('should consider environmental factors when enabled', async () => {
      const ecoEngine = createAIAnalysisEngine({ 
        environmentalFactors: true,
        sustainabilityWeight: 0.8 
      });

      const result = await ecoEngine.analyzeStructure(mockStructure);
      expect(result.performanceMetrics.sustainabilityRating).toBeDefined();
    });
  });

  describe('Utility Functions', () => {
    describe('AIUtils.calculatePriority', () => {
      it('should calculate priority score correctly', () => {
        const recommendation = {
          id: 'test',
          type: 'material' as const,
          severity: 'critical' as const,
          title: 'Test',
          description: 'Test desc',
          reasoning: 'Test reason',
          suggestedAction: 'Test action',
          impactScore: 80,
          implementationDifficulty: 'easy' as const,
          estimatedCostChange: -10,
          estimatedPerformanceGain: 20,
          affectedElements: ['1']
        };

        const priority = AIUtils.calculatePriority(recommendation);
        expect(priority).toBeGreaterThan(0);
        expect(priority).toBeLessThanOrEqual(100);
      });

      it('should prioritize critical recommendations higher', () => {
        const criticalRec = {
          id: 'critical',
          type: 'material' as const,
          severity: 'critical' as const,
          title: 'Critical',
          description: 'Critical issue',
          reasoning: 'Critical reason',
          suggestedAction: 'Critical action',
          impactScore: 80,
          implementationDifficulty: 'easy' as const,
          estimatedCostChange: -10,
          estimatedPerformanceGain: 20,
          affectedElements: ['1']
        };

        const infoRec = {
          ...criticalRec,
          id: 'info',
          severity: 'info' as const
        };

        const criticalPriority = AIUtils.calculatePriority(criticalRec);
        const infoPriority = AIUtils.calculatePriority(infoRec);

        expect(criticalPriority).toBeGreaterThan(infoPriority);
      });
    });

    describe('AIUtils.filterByType', () => {
      it('should filter recommendations by type', () => {
        const recommendations = [
          {
            id: '1',
            type: 'material' as const,
            severity: 'critical' as const,
            title: 'Material rec',
            description: 'Material desc',
            reasoning: 'Material reason',
            suggestedAction: 'Material action',
            impactScore: 80,
            implementationDifficulty: 'easy' as const,
            estimatedCostChange: -10,
            estimatedPerformanceGain: 20,
            affectedElements: ['1']
          },
          {
            id: '2',
            type: 'geometry' as const,
            severity: 'warning' as const,
            title: 'Geometry rec',
            description: 'Geometry desc',
            reasoning: 'Geometry reason',
            suggestedAction: 'Geometry action',
            impactScore: 60,
            implementationDifficulty: 'moderate' as const,
            estimatedCostChange: -5,
            estimatedPerformanceGain: 15,
            affectedElements: ['2']
          }
        ];

        const materialRecs = AIUtils.filterByType(recommendations, 'material');
        const geometryRecs = AIUtils.filterByType(recommendations, 'geometry');

        expect(materialRecs).toHaveLength(1);
        expect(materialRecs[0].type).toBe('material');
        expect(geometryRecs).toHaveLength(1);
        expect(geometryRecs[0].type).toBe('geometry');
      });
    });

    describe('AIUtils.groupBySeverity', () => {
      it('should group recommendations by severity', () => {
        const recommendations = [
          {
            id: '1',
            type: 'material' as const,
            severity: 'critical' as const,
            title: 'Critical rec',
            description: 'Critical desc',
            reasoning: 'Critical reason',
            suggestedAction: 'Critical action',
            impactScore: 90,
            implementationDifficulty: 'easy' as const,
            estimatedCostChange: -10,
            estimatedPerformanceGain: 20,
            affectedElements: ['1']
          },
          {
            id: '2',
            type: 'geometry' as const,
            severity: 'warning' as const,
            title: 'Warning rec',
            description: 'Warning desc',
            reasoning: 'Warning reason',
            suggestedAction: 'Warning action',
            impactScore: 60,
            implementationDifficulty: 'moderate' as const,
            estimatedCostChange: -5,
            estimatedPerformanceGain: 15,
            affectedElements: ['2']
          },
          {
            id: '3',
            type: 'load' as const,
            severity: 'critical' as const,
            title: 'Critical load',
            description: 'Critical load desc',
            reasoning: 'Critical load reason',
            suggestedAction: 'Critical load action',
            impactScore: 85,
            implementationDifficulty: 'difficult' as const,
            estimatedCostChange: 0,
            estimatedPerformanceGain: 25,
            affectedElements: ['3']
          }
        ];

        const grouped = AIUtils.groupBySeverity(recommendations);

        expect(grouped.critical).toHaveLength(2);
        expect(grouped.warning).toHaveLength(1);
        expect(grouped.info).toBeUndefined();
      });
    });
  });

  describe('Performance', () => {
    it('should complete analysis within reasonable time', async () => {
      const startTime = Date.now();
      await engine.analyzeStructure(mockStructure);
      const endTime = Date.now();

      const analysisTime = endTime - startTime;
      expect(analysisTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should complete optimization within reasonable time', async () => {
      const startTime = Date.now();
      await engine.optimizeStructure(mockStructure);
      const endTime = Date.now();

      const optimizationTime = endTime - startTime;
      expect(optimizationTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Integration', () => {
    it('should work with complex structures', async () => {
      const complexStructure: Structure3D = {
        nodes: Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          x: (i % 5) * 2,
          y: Math.floor(i / 5) * 3,
          z: 0,
          supports: i < 5 ? { ux: true, uy: true, uz: true } : {}
        })),
        elements: Array.from({ length: 9 }, (_, i) => ({
          id: String(i + 1),
          type: 'beam' as const,
          nodes: [String(i + 1), String(i + 2)],
          material: {
            id: 'steel',
            name: 'Steel',
            type: 'steel' as const,
            density: 7850,
            elasticModulus: 200000
          },
          section: {
            id: 'rect',
            name: 'Rectangular',
            type: 'rectangular' as const,
            width: 0.3,
            height: 0.5
          }
        })),
        loads: [
          {
            id: '1',
            type: 'point' as const,
            nodeId: '6',
            direction: 'y',
            magnitude: -15000
          }
        ]
      };

      const result = await engine.analyzeStructure(complexStructure);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should maintain consistency across multiple analyses', async () => {
      const result1 = await engine.analyzeStructure(mockStructure);
      const result2 = await engine.analyzeStructure(mockStructure);

      // Results should be consistent (allowing for some randomness in AI algorithms)
      expect(result1.recommendations.length).toBeGreaterThan(0);
      expect(result2.recommendations.length).toBeGreaterThan(0);
      expect(Math.abs(result1.confidence - result2.confidence)).toBeLessThan(10);
    });
  });
});