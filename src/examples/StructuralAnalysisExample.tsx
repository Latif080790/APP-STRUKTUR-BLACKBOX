import React from 'react';
import { StructuralAnalysisSystem } from '../structural-analysis';

/**
 * Example usage of the Structural Analysis System
 * This component demonstrates how to integrate the structural analysis system into an application
 */
export const StructuralAnalysisExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StructuralAnalysisSystem />
    </div>
  );
};

// Example of how to use individual components
/*
import { BeamDesignModule } from '../structural-analysis/design/BeamDesignModule';
import { ColumnDesignModule } from '../structural-analysis/design/ColumnDesignModule';
import { SlabDesignModule } from '../structural-analysis/design/SlabDesignModule';
import { Structure3DViewer } from '../structural-analysis/Structure3DViewer';
import { StructuralDrawing } from '../structural-analysis/drawing/StructuralDrawing';
import { analyzeStructure } from '../structural-analysis/analysis/StructuralAnalyzer';

// Example structure data
const exampleStructure = {
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
  ]
};

// Example analysis
const analysisResult = analyzeStructure(exampleStructure);
console.log('Analysis Result:', analysisResult);
*/