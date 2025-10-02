/**
 * Test untuk memverifikasi fix compliance property di UnifiedAnalysisResult
 */

import { UnifiedAnalysisEngine, defaultUnifiedAnalysisEngine } from '../core/UnifiedAnalysisEngine';
import { Structure3D, Node, Element, Load, UnifiedAnalysisResult } from '../types/structural';

describe('UnifiedAnalysisResult Compliance Fix', () => {
  test('should have compliance property available on UnifiedAnalysisResult', async () => {
    // Create simple test structure
    const testStructure: Structure3D = {
      nodes: [
        { id: '1', x: 0, y: 0, z: 0 },
        { id: '2', x: 6, y: 0, z: 0 },
        { id: '3', x: 0, y: 0, z: 3 },
        { id: '4', x: 6, y: 0, z: 3 }
      ],
      elements: [
        {
          id: '1',
          type: 'beam',
          nodes: ['1', '3'],
          section: {
            id: 'section-1',
            name: 'Rectangle 300x400',
            type: 'rectangular',
            width: 0.3,
            height: 0.4,
            area: 0.12,
            momentOfInertiaY: 0.0016,
            momentOfInertiaZ: 0.00090,
            torsionalConstant: 0.0008,
            sectionModulusY: 0.008,
            sectionModulusZ: 0.0045,
            radiusOfGyrationY: 0.116,
            radiusOfGyrationZ: 0.087,
            centroidY: 0.0,
            centroidZ: 0.0,
            shearCenterY: 0.0,
            shearCenterZ: 0.0
          },
          material: {
            id: 'concrete-1',
            name: 'Concrete K-25',
            type: 'concrete',
            elasticModulus: 25000000000,
            yieldStrength: 25000000,
            density: 2400,
            poissonsRatio: 0.2,
            thermalExpansion: 0.00001,
            sniCompliance: {
              standard: 'SNI-2847',
              grade: 'K-25',
              certified: true
            }
          }
        }
      ],
      loads: [
        {
          id: 'load1',
          name: 'Point Load 1',
          type: 'point',
          category: 'live',
          nodeId: '3',
          direction: { z: -1 },
          magnitude: -50000
        }
      ],
      materials: [],
      sections: [],
      loadCombinations: [
        {
          id: 'combo1',
          name: '1.2D + 1.6L',
          type: 'strength',
          factors: { dead: 1.2, live: 1.6 },
          active: true
        }
      ],
      analysisSettings: {
        type: 'static',
        solver: 'direct',
        convergence: {
          tolerance: 1e-6,
          maxIterations: 100
        }
      },
      modelInfo: {
        name: 'Test Structure',
        engineer: 'System Test',
        dateCreated: new Date(),
        dateModified: new Date(),
        version: '1.0',
        units: {
          length: 'm',
          force: 'N',
          stress: 'Pa',
          moment: 'N⋅m'
        }
      }
    };

    // Run analysis
    const analysisResult: UnifiedAnalysisResult = await defaultUnifiedAnalysisEngine.analyze(testStructure);

    // Test that compliance property exists and has expected structure
    expect(analysisResult).toBeDefined();
    expect(analysisResult.compliance).toBeDefined();
    expect(analysisResult.compliance?.sni).toBeDefined();
    expect(analysisResult.compliance?.sni.sni1726).toBeDefined();
    expect(analysisResult.compliance?.sni.sni1727).toBeDefined();
    expect(analysisResult.compliance?.sni.sni2847).toBeDefined();
    expect(analysisResult.compliance?.sni.sni1729).toBeDefined();

    // Test that each compliance result has correct structure
    expect(analysisResult.compliance?.sni.sni1726.isCompliant).toBeDefined();
    expect(Array.isArray(analysisResult.compliance?.sni.sni1726.requirements)).toBeTruthy();
    expect(Array.isArray(analysisResult.compliance?.sni.sni1726.violations)).toBeTruthy();
    expect(Array.isArray(analysisResult.compliance?.sni.sni1726.warnings)).toBeTruthy();

    // Test other enhanced properties
    expect(analysisResult.safetyCheck).toBeDefined();
    expect(analysisResult.performance).toBeDefined();
    expect(analysisResult.designOptimization).toBeDefined();

    console.log('✅ Compliance property fix verified successfully!');
    console.log('SNI Compliance Check:', analysisResult.compliance?.sni.sni2847);
  });

  test('should handle compliance property access without errors', () => {
    // This should compile without TypeScript errors now
    const mockResult: UnifiedAnalysisResult = {
      id: 'test',
      timestamp: new Date(),
      structureId: 'test-structure',
      analysisType: 'static',
      solutionTime: 100,
      converged: true,
      warnings: [],
      errors: [],
      maxDisplacement: {
        value: 0.01,
        nodeId: '1',
        direction: 'uz',
        loadCombination: 'combo1'
      },
      maxStress: {
        value: 1000000,
        elementId: '1',
        type: 'vonMises',
        loadCombination: 'combo1'
      },
      displacements: [],
      elementForces: [],
      elementStresses: [],
      reactions: [],
      summary: {
        totalElements: 1,
        totalNodes: 4,
        totalLoads: 1,
        solutionMethod: 'direct'
      },
      compliance: {
        sni: {
          sni1726: {
            isCompliant: true,
            requirements: [],
            violations: [],
            warnings: []
          },
          sni1727: {
            isCompliant: true,
            requirements: [],
            violations: [],
            warnings: []
          },
          sni2847: {
            isCompliant: true,
            requirements: [],
            violations: [],
            warnings: []
          },
          sni1729: {
            isCompliant: true,
            requirements: [],
            violations: [],
            warnings: []
          }
        },
        international: {}
      },
      isValid: true
    };

    // These property accesses should now work without TypeScript errors
    expect(mockResult.compliance).toBeDefined();
    expect(mockResult.compliance?.sni).toBeDefined();
    expect(mockResult.compliance?.sni.sni2847.isCompliant).toBe(true);

    console.log('✅ Property access test passed - no TypeScript errors!');
  });
});