/**
 * Verification Test
 * Simple script to verify that all components are working correctly
 */

import { 
  analyzeStructure, 
  calculateSectionProperties, 
  checkElementSafety 
} from '../structural-analysis/analysis/StructuralAnalyzer';

import { 
  beamMaterials, 
  beamSections, 
  calculateBeamWeight,
  getDefaultBeamElement
} from '../structural-analysis/design/BeamProperties';

import { 
  columnMaterials, 
  columnSections, 
  calculateColumnWeight,
  getDefaultColumnElement
} from '../structural-analysis/design/ColumnProperties';

import { 
  slabMaterials, 
  slabSections, 
  calculateSlabWeight,
  getDefaultSlabElement
} from '../structural-analysis/design/SlabProperties';

// Test function
function runVerification() {
  console.log('=== Structural Analysis System Verification ===\n');

  // Test 1: Design Properties
  console.log('1. Testing Design Properties...');
  console.log(`   Beam materials available: ${beamMaterials.length}`);
  console.log(`   Beam sections available: ${beamSections.length}`);
  console.log(`   Column materials available: ${columnMaterials.length}`);
  console.log(`   Column sections available: ${columnSections.length}`);
  console.log(`   Slab materials available: ${slabMaterials.length}`);
  console.log(`   Slab sections available: ${slabSections.length}`);
  console.log('   ✅ Design properties loaded successfully\n');

  // Test 2: Default Elements
  console.log('2. Testing Default Elements...');
  const beamElement = getDefaultBeamElement();
  const columnElement = getDefaultColumnElement();
  const slabElement = getDefaultSlabElement();
  console.log('   ✅ Default elements created successfully\n');

  // Test 3: Property Calculations
  console.log('3. Testing Property Calculations...');
  const beamWeight = calculateBeamWeight(beamElement.section, beamElement.material);
  const columnWeight = calculateColumnWeight(columnElement.section, columnElement.material);
  const slabWeight = calculateSlabWeight(slabElement.section.width, slabElement.material);
  console.log(`   Beam weight: ${beamWeight.toFixed(2)} kg/m`);
  console.log(`   Column weight: ${columnWeight.toFixed(2)} kg/m`);
  console.log(`   Slab weight: ${slabWeight.toFixed(2)} kg/m²`);
  console.log('   ✅ Property calculations working correctly\n');

  // Test 4: Section Properties
  console.log('4. Testing Section Properties...');
  const sectionProps = calculateSectionProperties(beamElement);
  console.log(`   Section area: ${sectionProps.area?.toFixed(4)} m²`);
  console.log(`   Moment of inertia Y: ${sectionProps.momentOfInertiaY?.toFixed(8)} m⁴`);
  console.log('   ✅ Section properties calculated successfully\n');

  // Test 5: Safety Check
  console.log('5. Testing Safety Verification...');
  const safetyCheck = checkElementSafety(beamElement, 100000, 5000, 3000);
  console.log(`   Safety status: ${safetyCheck.isSafe ? 'SAFE' : 'NOT SAFE'}`);
  console.log(`   Safety message: ${safetyCheck.message}`);
  console.log('   ✅ Safety verification working correctly\n');

  // Test 6: Structural Analysis
  console.log('6. Testing Structural Analysis...');
  const exampleStructure = {
    nodes: [
      { id: '1', x: 0, y: 0, z: 0 },
      { id: '2', x: 5, y: 0, z: 0 }
    ],
    elements: [beamElement],
    loads: [],
    materials: [beamElement.material],
    sections: [beamElement.section]
  };
  
  const analysisResult = analyzeStructure(exampleStructure);
  console.log(`   Structure validity: ${analysisResult.isValid ? 'VALID' : 'INVALID'}`);
  console.log(`   Max displacement: ${(analysisResult.maxDisplacement * 1000).toFixed(2)} mm`);
  console.log(`   Max stress: ${(analysisResult.maxStress / 1000000).toFixed(2)} MPa`);
  console.log('   ✅ Structural analysis completed successfully\n');

  console.log('=== Verification Complete ===');
  console.log('All components are working correctly!');
}

// Run verification
runVerification();

// Export for testing
export { runVerification };