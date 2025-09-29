/**
 * Design Example
 * Demonstrates how to use the design properties programmatically
 */

import { 
  beamMaterials, 
  beamSections, 
  calculateBeamWeight,
  calculateSectionModulus,
  getDefaultBeamElement
} from '../structural-analysis/design/BeamProperties';

import { 
  columnMaterials, 
  columnSections, 
  calculateColumnWeight,
  calculateColumnRadiusOfGyration,
  getDefaultColumnElement
} from '../structural-analysis/design/ColumnProperties';

import { 
  slabMaterials, 
  slabSections, 
  calculateSlabWeight,
  calculateRequiredReinforcement,
  getDefaultSlabElement
} from '../structural-analysis/design/SlabProperties';

// Example beam properties usage
console.log('=== Beam Properties Example ===');
console.log('Available beam materials:', beamMaterials.map(m => m.name));
console.log('Available beam sections:', beamSections.map(s => s.name));

const beamElement = getDefaultBeamElement();
console.log('Default beam element:', beamElement);

const beamWeight = calculateBeamWeight(beamElement.section, beamElement.material);
console.log('Beam weight per meter:', beamWeight.toFixed(2), 'kg/m');

const sectionModulus = calculateSectionModulus(beamElement.section);
console.log('Section modulus:', sectionModulus);

// Example column properties usage
console.log('\n=== Column Properties Example ===');
console.log('Available column materials:', columnMaterials.map(m => m.name));
console.log('Available column sections:', columnSections.map(s => s.name));

const columnElement = getDefaultColumnElement();
console.log('Default column element:', columnElement);

const columnWeight = calculateColumnWeight(columnElement.section, columnElement.material);
console.log('Column weight per meter:', columnWeight.toFixed(2), 'kg/m');

const radiusOfGyration = calculateColumnRadiusOfGyration(columnElement.section);
console.log('Radius of gyration:', radiusOfGyration);

// Example slab properties usage
console.log('\n=== Slab Properties Example ===');
console.log('Available slab materials:', slabMaterials.map(m => m.name));
console.log('Available slab sections:', slabSections.map(s => s.name));

const slabElement = getDefaultSlabElement();
console.log('Default slab element:', slabElement);

const slabWeight = calculateSlabWeight(slabElement.section.width, slabElement.material);
console.log('Slab weight per square meter:', slabWeight.toFixed(2), 'kg/m²');

const requiredReinforcement = calculateRequiredReinforcement(50, slabElement.section.width, slabElement.material);
console.log('Required reinforcement area:', requiredReinforcement.toFixed(2), 'cm²/m');

// Export for use in other modules
export { 
  beamElement, 
  columnElement, 
  slabElement, 
  beamWeight, 
  columnWeight, 
  slabWeight,
  sectionModulus,
  radiusOfGyration,
  requiredReinforcement
};