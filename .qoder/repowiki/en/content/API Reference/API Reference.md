
# API Reference

<cite>
**Referenced Files in This Document**   
- [StructuralAnalyzer.ts](file://src/structural-analysis/analysis/StructuralAnalyzer.ts)
- [DynamicAnalyzer.ts](file://src/structural-analysis/analysis/DynamicAnalyzer.ts)
- [BIMIntegrationEngine.ts](file://src/structural-analysis/bim/BIMIntegrationEngine.ts)
- [CloudServiceEngine.ts](file://src/cloud/CloudServiceEngine.ts)
- [MarketplaceEngine.ts](file://src/marketplace/MarketplaceEngine.ts)
- [structural.ts](file://src/types/structural.ts)
- [AdvancedAnalysisEngine.ts](file://src/structural-analysis/analysis/AdvancedAnalysisEngine.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Structural Analysis Engine](#structural-analysis-engine)
3. [Dynamic Analysis Engine](#dynamic-analysis-engine)
4. [BIM Integration Engine](#bim-integration-engine)
5. [Cloud Service Engine](#cloud-service-engine)
6. [Marketplace Engine](#marketplace-engine)
7. [Advanced Analysis Engine](#advanced-analysis-engine)
8. [Type Definitions](#type-definitions)
9. [Versioning and Migration](#versioning-and-migration)
10. [Error Handling and Logging](#error-handling-and-logging)

## Introduction
The APP-STRUKTUR-BLACKBOX API provides comprehensive interfaces for structural engineering analysis, BIM integration, cloud collaboration, and marketplace functionality. This documentation details the public interfaces and engine components that enable structural analysis, dynamic analysis, unified analysis workflows, CAD/BIM system interoperability, cloud-based collaboration, and extension/plugin functionality. The API is designed to support professional structural engineering workflows with robust type safety, comprehensive error handling, and extensible architecture.

## Structural Analysis Engine

The Structural Analysis Engine provides core functionality for structural analysis calculations. It includes methods for analyzing structures, calculating element properties, and validating structural safety.

### Constructor
The Structural Analysis Engine is implemented as a collection of utility functions rather than a class with a constructor. The main analysis function is `analyzeStructure`.

### Methods
#### analyzeStructure
Performs basic structural analysis on a 3D structure.

**Parameters:**
- `structure`: Structure3D - The structure to analyze, containing nodes, elements, and loads

**Returns:** AnalysisResult - Object containing displacements, forces, stresses, validity status, maximum displacement, and maximum stress

**Exceptions:** None - errors are handled internally and result in a failed analysis with isValid: false

#### calculateElementLength
Calculates the length of an element based on its nodes.

**Parameters:**
- `element`: Element - The element to calculate length for
- `nodes`: Node[] - Array of all nodes in the structure

**Returns:** number - Length of the element in meters

#### calculateSectionProperties
Calculates section properties for different section types (rectangular, circular, I-section).

**Parameters:**
- `element`: Element - The element with section properties

**Returns:** Object containing area, moment of inertia, section modulus, and torsional constant

#### checkElementSafety
Checks if an element is safe under given loading conditions.

**Parameters:**
- `element`: Element - The element to check
- `axialForce`: number - Axial force in the element (N)
- `momentY`: number - Moment about Y axis (N·m)
- `momentZ`: number - Moment about Z axis (N·m)

**Returns:** Object with isSafe (boolean) and message (string) indicating safety status

#### generateAnalysisReport
Generates a formatted text report of analysis results.

**Parameters:**
- `analysisResult`: AnalysisResult - The analysis results to format

**Returns:** string - Formatted analysis report

**Section sources**
- [StructuralAnalyzer.ts](file://src/structural-analysis/analysis/StructuralAnalyzer.ts#L761)

### Code Example: Structural Analysis Workflow
```typescript
import { analyzeStructure, generateAnalysisReport } from './analysis/StructuralAnalyzer';
import { Structure3D } from '@/types/structural';

// Create a simple structure
const structure: Structure3D = {
  nodes: [
    { id: 'N1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true } },
    { id: 'N2', x: 5, y: 0, z: 0, supports: { ux: false, uy: true, uz: true } }
  ],
  elements: [
    {
      id: 'E1',
      type: 'beam',
      nodes: ['N1', 'N2'],
      material: {
        id: 'steel1',
        name: 'steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 200000000000,
        poissonsRatio: 0.3,
        yieldStrength: 250000000
      },
      section: {
        id: 'rect1',
        name: 'rectangular',
        type: 'rectangular',
        width: 0.3,
        height: 0.5
      }
    }
  ],
  loads: [
    {
      id: 'L1',
      type: 'point',
      nodeId: 'N2',
      direction: 'y',
      magnitude: 100000 // 100 kN
    }
  ]
};

// Perform analysis
const result = analyzeStructure(structure);

// Generate report
const report = generateAnalysisReport(result);
console.log(report);
```

## Dynamic Analysis Engine

The Dynamic Analysis Engine provides functionality for dynamic structural analysis including modal analysis and response spectrum analysis.

### Constructor
The Dynamic Analysis Engine is implemented as a collection of utility functions rather than a class with a constructor.

### Methods
#### modalAnalysis
Performs modal analysis to determine natural frequencies and mode shapes.

**Parameters:**
- `structure`: Structure3D - The structure to analyze
- `numModes`: number - Number of modes to extract (default: 5)

**Returns:** Object containing frequencies (array of mode frequency objects), modeShapes (array of mode shape objects), success status, and message

#### responseSpectrumAnalysis
Performs response spectrum analysis using modal results.

**Parameters:**
- `structure`: Structure3D - The structure to analyze
- `spectrum`: any - Response spectrum data

**Returns:** Object containing modalResults, spectralAccelerations, baseShear, storyForces, success status, and message

#### dynamicAnalysis
Main entry point for dynamic analysis with different analysis types.

**Parameters:**
- `structure`: Structure3D - The structure to analyze
- `analysisType`: 'modal' | 'response-spectrum' | 'time-history' - Type of dynamic analysis
- `options`: any - Analysis options specific to the analysis type

**Returns:** Object with analysis-specific results and success status

**Section sources**
- [DynamicAnalyzer.ts](file://src/structural-analysis/analysis/DynamicAnalyzer.ts#L205)

### Code Example: Dynamic Analysis Workflow
```typescript
import { dynamicAnalysis } from './analysis/DynamicAnalyzer';
import { Structure3D } from '@/types/structural';

// Create a structure for dynamic analysis
const structure: Structure3D = {
  nodes: [
    { id: 'N1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true } },
    { id: 'N2', x: 10, y: 0, z: 0, supports: { ux: false, uy: true, uz: true } },
    { id: 'N3', x: 10, y: 0, z: 5, supports: {} },
    { id: 'N4', x: 0, y: 0, z: 5, supports: {} }
  ],
  elements: [
    {
      id: 'E1',
      type: 'column',
      nodes: ['N1', 'N2'],
      material: {
        id: 'concrete1',
        name: 'concrete',
        type: 'concrete',
        density: 2400,
        elasticModulus: 30000000000,
        poissonsRatio: 0.2,
        yieldStrength: 30000000
      },
      section: {
        id: 'col1',
        name: 'column',
        type: 'rectangular',
        width: 0.5,
        height: 0.5
      }
    },
    {
      id: 'E2',
      type: 'beam',
      nodes: ['N2', 'N3'],
      material: {
        id: 'steel1',
        name: 'steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 200000000000,
        poissonsRatio: 0.3,
        yieldStrength: 250000000
      },
      section: {
        id: 'beam1',
        name: 'beam',
        type: 'i-section',
        width: 0.3,
        height: 0.6
      }
    },
    {
      id: 'E3',
      type: 'beam',
      nodes: ['N3', 'N4'],
      material: {
        id: 'steel1',
        name: 'steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 200000000000,
        poissonsRatio: 0.3,
        yieldStrength: 250000000
      },
      section: {
        id: 'beam1',
        name: 'beam',
        type: 'i-section',
        width: 0.3,
        height: 0.6
      }
    },
    {
      id: 'E4',
      type: 'column',
      nodes: ['N4', 'N1'],
      material: {
        id: 'concrete1',
        name: 'concrete',
        type: 'concrete',
        density: 2400,
        elasticModulus: 30000000000,
        poissonsRatio: 0.2,
        yieldStrength: 30000000
      },
      section: {
        id: 'col1',
        name: 'column',
        type: 'rectangular',
        width: 0.5,
        height: 0.5
      }
    }
  ],
  loads: []
};

// Perform modal analysis
const modalResult = dynamicAnalysis(structure, 'modal', { numModes: 5 });
console.log('Modal Analysis Results:', modalResult);

// Perform response spectrum analysis
const spectrum = {
  dampingRatio: 0.05,
  spectralData: [
    { period: 0.1, sa: 0.8 },
    { period: 0.5, sa: 1.2 },
    { period: 1.0, sa: 0.9 },
    { period: 2.0, sa: 0.4 }
  ]
};

const responseResult = dynamicAnalysis(structure, 'response-spectrum', { spectrum });
console.log('Response Spectrum Analysis Results:', responseResult);
```

## BIM Integration Engine

The BIM Integration Engine provides import/export capabilities for CAD and BIM formats, supporting IFC, DWG, DXF, and other professional formats.

### Constructor
```typescript
constructor(config: BIMConfig)
```

**Parameters:**
- `config`: BIMConfig - Configuration object specifying format, units, coordinate system, and level of detail

### Properties
- `config`: BIMConfig - The configuration object passed to the constructor
- `conversionLog`: string[] - Array of log messages from import/export operations

### Methods
#### importFile
Imports a BIM/CAD file and converts it to a Structure3D object.

**Parameters:**
- `file`: File - The file to import

**Returns:** Promise<BIMImportResult> - Object containing success status, structure (if successful), modelInfo, warnings, errors, and conversionLog

#### exportStructure
Exports a Structure3D object to a BIM/CAD format.

**Parameters:**
- `structure`: Structure3D - The structure to export
- `fileName`: string - The desired file name (extension determines format)

**Returns:** Promise<BIMExportResult> - Object containing success status, fileContent (if successful), fileName, fileSize, warnings, and errors

#### importIFC
Private method to import IFC (Industry Foundation Classes) format.

**Parameters:**
- `content`: string - The IFC file content
- `fileName`: string - The original file name

**Returns:** Promise<BIMImportResult> - Import result object

#### exportIFC
Private method to export to IFC format.

**Parameters:**
- `structure`: Structure3D - The structure to export
- `fileName`: string - The desired file name

**Returns:** Promise<BIMExportResult> - Export result object

#### importDWG
Private method to import DWG/DXF format.

**Parameters:**
- `content`: ArrayBuffer | string - The DWG/DXF file content
- `fileName`: string - The original file name

**Returns:** Promise<BIMImportResult> - Import result object

#### exportDXF
Private method to export to DXF format.

**Parameters:**
- `structure`: Structure3D - The structure to export
- `fileName`: string - The desired file name

**Returns:** Promise<BIMExportResult> - Export result object

#### importJSON
Private method to import JSON format (native structure format).

**Parameters:**
- `content`: string - The JSON file content
- `fileName`: string - The original file name

**Returns:** Promise<BIMImportResult> - Import result object

#### exportJSON
Private method to export to JSON format.

**Parameters:**
- `structure`: Structure3D - The structure to export
- `fileName`: string - The desired file name

**Returns:** Promise<BIMExportResult> - Export result object

#### importOBJ
Private method to import OBJ format (3D mesh).

**Parameters:**
- `content`: string - The OBJ file content
- `fileName`: string - The original file name

**Returns:** Promise<BIMImportResult> - Import result object

#### exportOBJ
Private method to export to OBJ format.

**Parameters:**
- `structure`: Structure3D -