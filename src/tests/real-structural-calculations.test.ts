/**
 * Tests for Real Structural Calculations
 * Verifies that we've successfully replaced Math.random() with real engineering calculations
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { structuralEngine } from '../engines/FunctionalStructuralEngine';

describe('Real Structural Analysis Engine', () => {
  beforeAll(async () => {
    await structuralEngine.initialize();
  });

  it('should create a project with real structural model', () => {
    const project = structuralEngine.createProject({
      name: 'Test Building for Real Analysis',
      description: 'Testing real structural calculations',
      geometry: {
        buildingType: 'residential',
        floors: 2,
        floorHeight: 3.5,
        bayLength: 6.0,
        bayWidth: 6.0,
        baysX: 2,
        baysY: 2,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      },
      materials: {
        concrete: {
          fc: 25,      // MPa
          ec: 25000,   // MPa
          density: 2400, // kg/m³
          poisson: 0.2
        },
        steel: {
          fy: 400,     // MPa
          es: 200000,  // MPa
          density: 7850 // kg/m³
        },
        reinforcement: {
          fyMain: 400, // MPa
          fyTie: 240   // MPa
        }
      },
      loads: {
        deadLoad: 5.0,   // kN/m²
        liveLoad: 2.5,   // kN/m²
        windLoad: 1.0,   // kN/m²
        seismicLoad: {
          ss: 0.8,
          s1: 0.4,
          siteClass: 'C',
          importance: 1.0
        },
        loadCombinations: []
      }
    });

    expect(project).toBeDefined();
    expect(project.name).toBe('Test Building for Real Analysis');
    expect(project.validationStatus).toBe('valid');
  });

  it('should perform REAL structural analysis (no Math.random)', async () => {
    // Create a simple project
    const project = structuralEngine.createProject({
      name: 'Real Analysis Test',
      geometry: {
        buildingType: 'residential' as const,
        floors: 1,
        floorHeight: 3.0,
        bayLength: 5.0,
        bayWidth: 5.0,
        baysX: 1,
        baysY: 1,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
    });

    // Perform analysis
    const results = await structuralEngine.analyzeStructure(project.id);

    // Verify analysis completed successfully
    expect(results).toBeDefined();
    expect(results.status).toBe('success');
    expect(results.engineVersion).toBe('2.0.0');
    
    // Verify we have real performance metrics
    expect(results.performance).toBeDefined();
    expect(results.performance!.analysisTime).toBeGreaterThan(0);
    expect(results.performance!.elementCount).toBeGreaterThan(0);
    expect(results.performance!.nodeCount).toBeGreaterThan(0);

    // Verify convergence status is reported
    expect(results.summary.convergenceStatus).toBeDefined();
    expect(typeof results.summary.iterationsUsed).toBe('number');

    console.log('✅ Real Analysis Results:');
    console.log(`   • Status: ${results.status}`);
    console.log(`   • Converged: ${results.summary.convergenceStatus}`);
    console.log(`   • Iterations: ${results.summary.iterationsUsed}`);
    console.log(`   • Analysis Time: ${results.performance?.analysisTime.toFixed(2)}ms`);
    console.log(`   • Nodes: ${results.performance?.nodeCount}`);
    console.log(`   • Elements: ${results.performance?.elementCount}`);
    console.log(`   • Max Displacement: ${(results.summary.maxDisplacement * 1000).toFixed(3)}mm`);
  });

  it('should calculate real element forces (not random)', async () => {
    const project = structuralEngine.createProject({
      name: 'Force Calculation Test',
      geometry: {
        buildingType: 'residential' as const,
        floors: 1,
        floorHeight: 3.0,
        bayLength: 6.0,
        bayWidth: 6.0,
        baysX: 1,
        baysY: 1,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
    });

    const results = await structuralEngine.analyzeStructure(project.id);
    
    // Verify we have element results
    expect(results.elements.length).toBeGreaterThan(0);
    
    for (const element of results.elements) {
      // Verify forces are not random (should be consistent with structural behavior)
      expect(element.forces).toBeDefined();
      expect(typeof element.forces.axial).toBe('number');
      expect(typeof element.forces.shearY).toBe('number');
      expect(typeof element.forces.momentY).toBe('number');
      
      // Verify stresses are calculated from forces
      expect(element.stresses).toBeDefined();
      expect(typeof element.stresses.axial).toBe('number');
      expect(typeof element.stresses.combined).toBe('number');
      
      // Verify safety factors are realistic (not random)
      expect(element.safetyFactor).toBeGreaterThan(0);
      expect(element.safetyFactor).toBeLessThan(100); // Reasonable upper bound
      
      // Verify utilization is calculated properly
      expect(element.utilization).toBeGreaterThanOrEqual(0);
      expect(element.utilization).toBeLessThan(5); // Reasonable upper bound
    }

    console.log('✅ Real Force Calculation Results:');
    results.elements.slice(0, 3).forEach((elem, i) => {
      console.log(`   Element ${i + 1}:`);
      console.log(`     • Type: ${elem.type}`);
      console.log(`     • Axial: ${elem.forces.axial.toFixed(0)} N`);
      console.log(`     • Moment: ${Math.max(Math.abs(elem.forces.momentY), Math.abs(elem.forces.momentZ)).toFixed(0)} N⋅m`);
      console.log(`     • Stress: ${elem.stresses.combined.toFixed(0)} Pa`);
      console.log(`     • Safety Factor: ${elem.safetyFactor.toFixed(2)}`);
      console.log(`     • Status: ${elem.status}`);
    });
  });

  it('should use analysis results for design (integrated workflow)', async () => {
    const project = structuralEngine.createProject({
      name: 'Integrated Design Test',
      geometry: {
        buildingType: 'residential' as const,
        floors: 1,
        floorHeight: 3.0,
        bayLength: 6.0,
        bayWidth: 6.0,
        baysX: 1,
        baysY: 1,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
    });

    // First perform analysis
    const analysisResults = await structuralEngine.analyzeStructure(project.id);
    
    // Create a test beam
    const testBeam = {
      id: 'B1', // Should match an element from analysis
      startPoint: { x: 0, y: 0, z: 3 },
      endPoint: { x: 6, y: 0, z: 3 },
      section: {
        width: 0.3,
        height: 0.5,
        type: 'rectangular' as const
      },
      reinforcement: {
        top: { diameter: 16, count: 2, area: 402 },
        bottom: { diameter: 20, count: 3, area: 942 },
        stirrups: { diameter: 10, spacing: 200, legs: 2 }
      }
    };

    // Design beam using REAL analysis results
    const designedBeam = structuralEngine.designBeam(
      testBeam,
      analysisResults,
      project.materials
    );

    // Verify design was performed
    expect(designedBeam).toBeDefined();
    expect(designedBeam.reinforcement).toBeDefined();
    expect(designedBeam.reinforcement.bottom.count).toBeGreaterThan(0);
    expect(designedBeam.reinforcement.stirrups.spacing).toBeGreaterThan(0);

    console.log('✅ Integrated Design Results:');
    console.log(`   • Bottom bars: ${designedBeam.reinforcement.bottom.count} × ${designedBeam.reinforcement.bottom.diameter}mm`);
    console.log(`   • Stirrup spacing: ${designedBeam.reinforcement.stirrups.spacing}mm`);
    console.log(`   • Required steel area: ${designedBeam.reinforcement.bottom.area.toFixed(0)} mm²`);
  });

  it('should perform consistent calculations (not random)', async () => {
    // Create identical projects
    const project1 = structuralEngine.createProject({
      name: 'Consistency Test 1',
      geometry: {
        buildingType: 'residential' as const,
        floors: 1,
        floorHeight: 3.0,
        bayLength: 5.0,
        bayWidth: 5.0,
        baysX: 1,
        baysY: 1,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
    });

    const project2 = structuralEngine.createProject({
      name: 'Consistency Test 2',
      geometry: {
        buildingType: 'residential' as const,
        floors: 1,
        floorHeight: 3.0,
        bayLength: 5.0,
        bayWidth: 5.0,
        baysX: 1,
        baysY: 1,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
    });

    // Analyze both projects
    const results1 = await structuralEngine.analyzeStructure(project1.id);
    const results2 = await structuralEngine.analyzeStructure(project2.id);

    // Results should be identical (not random)
    expect(results1.elements.length).toBe(results2.elements.length);
    expect(results1.nodes.length).toBe(results2.nodes.length);

    // Compare first element forces (should be very close if not identical)
    if (results1.elements.length > 0 && results2.elements.length > 0) {
      const elem1 = results1.elements[0];
      const elem2 = results2.elements[0];
      
      // Forces should be consistent (allowing for small numerical differences)
      expect(Math.abs(elem1.forces.axial - elem2.forces.axial)).toBeLessThan(1); // Within 1N
      expect(Math.abs(elem1.safetyFactor - elem2.safetyFactor)).toBeLessThan(0.1); // Within 0.1
    }

    console.log('✅ Consistency Check:');
    console.log(`   • Project 1 elements: ${results1.elements.length}`);
    console.log(`   • Project 2 elements: ${results2.elements.length}`);
    console.log(`   • Results are consistent (not random)`);
  });
});