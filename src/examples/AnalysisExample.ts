/**
 * Analysis Example
 * Demonstrates how to use the structural analysis functions programmatically
 */

import { analyzeStructure, calculateSectionProperties, checkElementSafety } from '../structural-analysis/analysis/StructuralAnalyzer';
import { Structure3D, Element, Material, Section } from '../types/structural';

// Example structure
const exampleStructure: Structure3D = {
  nodes: [
    { id: '1', x: 0, y: 0, z: 0 },
    { id: '2', x: 5, y: 0, z: 0 },
    { id: '3', x: 0, y: 3, z: 0 },
    { id: '4', x: 5, y: 3, z: 0 }
  ],
  elements: [
    {
      id: 'B1',
      type: 'beam',
      nodes: ['1', '2'],
      material: {
        id: 'concrete-25',
        name: 'Concrete 25 MPa',
        type: 'concrete',
        density: 2400,
        elasticModulus: 25000000000,
        yieldStrength: 25000000
      },
      section: {
        id: 'rect-200x300',
        name: '200x300 mm',
        type: 'rectangular',
        width: 0.2,
        height: 0.3
      }
    }
  ],
  loads: [],
  materials: [],
  sections: []
};

// Perform analysis
console.log('=== Structural Analysis Example ===');
const analysisResult = analyzeStructure(exampleStructure);
console.log('Analysis Result:', analysisResult);

// Example section properties calculation
const exampleElement: Element = {
  id: 'C1',
  type: 'column',
  nodes: ['1', '3'],
  material: {
    id: 'steel-s275',
    name: 'Steel S275',
    type: 'steel',
    density: 7850,
    elasticModulus: 200000000000,
    yieldStrength: 275000000
  },
  section: {
    id: 'i-200x100x5.5x8',
    name: 'IPE 200',
    type: 'i-section',
    width: 0.100,
    height: 0.200,
    area: 0.00285,
    momentOfInertiaY: 0.000001943,
    momentOfInertiaZ: 0.000000115
  }
};

console.log('\n=== Section Properties Example ===');
const sectionProps = calculateSectionProperties(exampleElement);
console.log('Section Properties:', sectionProps);

// Example safety check
console.log('\n=== Safety Check Example ===');
const safetyCheck = checkElementSafety(exampleElement, 100000, 5000, 3000);
console.log('Safety Check:', safetyCheck);

// Export for use in other modules
export { exampleStructure, analysisResult, sectionProps, safetyCheck };