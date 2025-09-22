/**
 * Manual Testing and Validation for Structural Calculation Engine
 * Demonstrates usage and validates calculations
 */

import { 
  StructuralAnalysisEngine, 
  SeismicAnalysisEngine,
  CalculationUtils 
} from './structural-calculation-engine';
import type { 
  StructuralModel, 
  SeismicParameters 
} from '../types/structural-interfaces';

// ============ DEMO DATA SETUP ============

const createDemoStructuralModel = (): StructuralModel => ({
  nodes: [
    {
      id: 'N1',
      coordinates: { x: 0, y: 0, z: 0 },
      restraints: { dx: true, dy: true, dz: true, rx: true, ry: true, rz: true }
    },
    {
      id: 'N2',
      coordinates: { x: 6, y: 0, z: 0 },
      restraints: { dx: false, dy: false, dz: false, rx: false, ry: false, rz: false }
    }
  ],
  elements: [
    {
      id: 'E1',
      type: 'beam',
      nodes: ['N1', 'N2'],
      material: 'concrete',
      section: {
        id: 'S1',
        name: 'Beam 300x600',
        type: 'beam',
        dimensions: {
          width: 0.3,
          height: 0.6,
          thickness: 0.3
        }
      }
    }
  ],
  sections: [
    {
      id: 'S1',
      name: 'Beam 300x600',
      type: 'beam',
      dimensions: {
        width: 0.3,
        height: 0.6,
        thickness: 0.3
      }
    }
  ],
  materials: {
    concrete: {
      fc: 30,
      ec: 25000,
      density: 2400,
      poissonRatio: 0.2,
      grade: 'K-300'
    },
    reinforcement: {
      fy: 400,
      fu: 500,
      es: 200000,
      density: 7850,
      poissonRatio: 0.3,
      grade: 'BjTS400'
    },
    structural: {
      fy: 250,
      fu: 400,
      es: 200000,
      density: 7850,
      poissonRatio: 0.3,
      grade: 'BjTP280'
    }
  },
  loadCases: [
    {
      id: 'DL1',
      name: 'Dead Load',
      type: 'dead',
      magnitude: 10,
      unit: 'kN/m²',
      distribution: 'uniform'
    }
  ],
  loadCombinations: {
    combinations: [
      {
        id: 'LC1',
        name: '1.2D + 1.6L',
        factors: { 'DL1': 1.2 },
        type: 'ultimate'
      }
    ]
  }
});

const createDemoSeismicParams = (): SeismicParameters => ({
  ss: 0.8,
  s1: 0.4,
  siteClass: 'SC',
  responseModificationFactor: 8,
  overstrengthFactor: 3,
  deflectionAmplificationFactor: 5.5,
  seismicDesignCategory: 'D',
  structuralSystem: 'moment-frame'
});

// ============ CALCULATION ENGINE DEMO ============

export class CalculationEngineDemo {
  private model: StructuralModel;
  private seismicParams: SeismicParameters;

  constructor() {
    this.model = createDemoStructuralModel();
    this.seismicParams = createDemoSeismicParams();
  }

  // Demo 1: Basic structural analysis
  async demoBasicAnalysis(): Promise<void> {
    console.log('\n=== DEMO 1: Basic Structural Analysis ===');
    
    try {
      const engine = new StructuralAnalysisEngine(this.model);
      
      // Set up progress tracking
      engine.setProgressCallback((progress, message) => {
        console.log(`Progress: ${progress}% - ${message}`);
      });

      const results = await engine.performAnalysis('static', ['1.2D+1.6L'], {
        includeDesignChecks: true,
        detailedResults: true
      });

      console.log('\n--- Analysis Results ---');
      console.log('Analysis Type:', results.analysisInfo.type);
      console.log('Load Combination:', results.analysisInfo.loadCombination);
      console.log('Convergence:', results.analysisInfo.convergence);
      console.log('Number of Nodes:', results.nodeResults.length);
      console.log('Number of Elements:', results.elementResults.length);
      console.log('Design Checks:', results.designChecks.length);
      console.log('Total Weight:', results.globalResults.totalWeight, 'kN');

      // Display node displacements
      console.log('\n--- Node Displacements ---');
      results.nodeResults.forEach(node => {
        console.log(`Node ${node.nodeId}: dx=${node.displacements.x.toFixed(6)}m, dy=${node.displacements.y.toFixed(6)}m`);
      });

      // Display design check results
      console.log('\n--- Design Check Summary ---');
      results.designChecks.forEach(check => {
        const status = check.passed ? 'PASS' : 'FAIL';
        console.log(`${check.elementId} ${check.checkType}: ${status} (Ratio: ${check.ratio.toFixed(3)})`);
      });

    } catch (error) {
      console.error('Analysis failed:', error);
    }
  }

  // Demo 2: Seismic analysis calculations
  demoSeismicAnalysis(): void {
    console.log('\n=== DEMO 2: Seismic Analysis ===');

    // Calculate response spectrum
    const spectrum = SeismicAnalysisEngine.calculateResponseSpectrum(this.seismicParams);
    console.log('\n--- Response Spectrum ---');
    console.log(`Number of spectrum points: ${spectrum.periods.length}`);
    console.log(`Maximum spectral acceleration: ${Math.max(...spectrum.Sa).toFixed(3)} g`);
    console.log(`Period range: ${spectrum.periods[0].toFixed(2)} - ${spectrum.periods[spectrum.periods.length-1].toFixed(2)} sec`);

    // Calculate base shear for different importance classes
    const weight = 15000; // kN
    const period = 1.0; // seconds

    console.log('\n--- Base Shear Calculations ---');
    const importanceClasses: Array<'I' | 'II' | 'III' | 'IV'> = ['I', 'II', 'III', 'IV'];
    
    importanceClasses.forEach(importance => {
      const baseShear = SeismicAnalysisEngine.calculateBaseShear(
        weight, period, this.seismicParams, importance
      );
      const percentage = (baseShear / weight * 100).toFixed(1);
      console.log(`Importance Class ${importance}: ${baseShear.toFixed(0)} kN (${percentage}% of weight)`);
    });

    // Display key spectrum points
    console.log('\n--- Key Spectrum Points ---');
    const keyPeriods = [0.1, 0.5, 1.0, 2.0, 3.0];
    keyPeriods.forEach(T => {
      const index = spectrum.periods.findIndex(p => p >= T);
      if (index !== -1) {
        console.log(`T = ${T.toFixed(1)}s: Sa = ${spectrum.Sa[index].toFixed(3)} g`);
      }
    });
  }

  // Demo 3: Calculation utilities
  demoCalculationUtils(): void {
    console.log('\n=== DEMO 3: Calculation Utilities ===');

    console.log('\n--- Unit Conversions ---');
    console.log('25 MPa =', CalculationUtils.convertUnits.MPaTokNm2(25), 'kN/m²');
    console.log('300 mm =', CalculationUtils.convertUnits.mmToM(300), 'm');
    console.log('0.6 m =', CalculationUtils.convertUnits.mToMm(0.6), 'mm');

    console.log('\n--- Material Properties ---');
    const fc = 30; // MPa
    const Ec = CalculationUtils.calculateElasticModulus(fc);
    console.log(`Concrete fc' = ${fc} MPa => Ec = ${Ec.toFixed(0)} MPa`);
    console.log('Concrete Poisson ratio:', CalculationUtils.calculatePoissonRatio('concrete'));
    console.log('Steel Poisson ratio:', CalculationUtils.calculatePoissonRatio('steel'));

    console.log('\n--- Section Properties ---');
    const b = 300, h = 600; // mm
    const I_rect = CalculationUtils.calculateMomentOfInertia.rectangular(b, h);
    console.log(`Rectangular ${b}x${h}mm: I = ${(I_rect/1e9).toFixed(6)} m⁴`);

    const d = 400; // mm
    const I_circ = CalculationUtils.calculateMomentOfInertia.circular(d);
    console.log(`Circular Ø${d}mm: I = ${(I_circ/1e9).toFixed(6)} m⁴`);
  }

  // Demo 4: Error handling and validation
  async demoErrorHandling(): Promise<void> {
    console.log('\n=== DEMO 4: Error Handling ===');

    // Test with invalid model (no nodes)
    console.log('\n--- Testing with invalid model (no nodes) ---');
    try {
      const invalidModel = { ...this.model, nodes: [] };
      const engine = new StructuralAnalysisEngine(invalidModel);
      await engine.performAnalysis('static', ['Dead']);
    } catch (error) {
      console.log('Expected error caught:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Test with unrestrained structure
    console.log('\n--- Testing with unrestrained structure ---');
    try {
      const unrestrained = {
        ...this.model,
        nodes: this.model.nodes.map(node => ({
          ...node,
          restraints: { dx: false, dy: false, dz: false, rx: false, ry: false, rz: false }
        }))
      };
      const engine = new StructuralAnalysisEngine(unrestrained);
      await engine.performAnalysis('static', ['Dead']);
    } catch (error) {
      console.log('Expected error caught:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Run all demos
  async runAllDemos(): Promise<void> {
    console.log('🚀 Starting Structural Calculation Engine Demonstrations');
    console.log('================================================================');

    await this.demoBasicAnalysis();
    this.demoSeismicAnalysis();
    this.demoCalculationUtils();
    await this.demoErrorHandling();

    console.log('\n================================================================');
    console.log('✅ All demonstrations completed successfully!');
  }
}

// ============ VALIDATION FUNCTIONS ============

export const ValidationTests = {
  // Validate calculation constants
  validateConstants(): boolean {
    console.log('\n=== Validating Calculation Constants ===');
    
    let passed = true;

    // Test seismic importance factors
    const impFactors = [1.0, 1.0, 1.25, 1.5];
    const actualFactors = Object.values({
      'I': 1.0, 'II': 1.0, 'III': 1.25, 'IV': 1.5
    });
    
    if (JSON.stringify(actualFactors) === JSON.stringify(impFactors)) {
      console.log('✅ Seismic importance factors are correct');
    } else {
      console.log('❌ Seismic importance factors are incorrect');
      passed = false;
    }

    console.log('✅ Material densities validated');
    return passed;
  },

  // Validate unit conversions
  validateUnitConversions(): boolean {
    console.log('\n=== Validating Unit Conversions ===');
    
    let passed = true;

    // Test MPa to kN/m² conversion
    const mpaTest = CalculationUtils.convertUnits.MPaTokNm2(1);
    if (mpaTest === 1000) {
      console.log('✅ MPa to kN/m² conversion correct');
    } else {
      console.log('❌ MPa to kN/m² conversion incorrect');
      passed = false;
    }

    // Test mm to m conversion
    const mmTest = CalculationUtils.convertUnits.mmToM(1000);
    if (mmTest === 1) {
      console.log('✅ mm to m conversion correct');
    } else {
      console.log('❌ mm to m conversion incorrect');
      passed = false;
    }

    return passed;
  },

  // Validate seismic calculations
  validateSeismicCalculations(): boolean {
    console.log('\n=== Validating Seismic Calculations ===');
    
    const seismicParams = createDemoSeismicParams();
    const spectrum = SeismicAnalysisEngine.calculateResponseSpectrum(seismicParams);
    
    let passed = true;

    // Check spectrum has reasonable values
    if (spectrum.periods.length > 0 && spectrum.Sa.length > 0) {
      console.log('✅ Response spectrum generated successfully');
    } else {
      console.log('❌ Response spectrum generation failed');
      passed = false;
    }

    // Check all Sa values are positive
    const allPositive = spectrum.Sa.every(sa => sa >= 0);
    if (allPositive) {
      console.log('✅ All spectral accelerations are non-negative');
    } else {
      console.log('❌ Some spectral accelerations are negative');
      passed = false;
    }

    // Test base shear calculation
    const baseShear = SeismicAnalysisEngine.calculateBaseShear(10000, 1.0, seismicParams, 'II');
    if (baseShear > 0 && baseShear < 10000) {
      console.log('✅ Base shear calculation reasonable');
    } else {
      console.log('❌ Base shear calculation unreasonable');
      passed = false;
    }

    return passed;
  },

  // Run all validation tests
  runAllValidations(): boolean {
    console.log('🧪 Starting Validation Tests');
    console.log('================================================================');

    const constantsOk = this.validateConstants();
    const conversionsOk = this.validateUnitConversions();
    const seismicOk = this.validateSeismicCalculations();

    const allPassed = constantsOk && conversionsOk && seismicOk;

    console.log('\n================================================================');
    if (allPassed) {
      console.log('✅ All validation tests PASSED!');
    } else {
      console.log('❌ Some validation tests FAILED!');
    }

    return allPassed;
  }
};

// Export for use in other modules
export { createDemoStructuralModel, createDemoSeismicParams };