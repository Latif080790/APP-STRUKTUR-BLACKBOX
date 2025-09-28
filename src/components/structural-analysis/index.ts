/**
 * Enhanced Structural Analysis System - Complete Integration
 * Exports all enhanced components for the structural analysis system
 */

// Enhanced Material Properties
export { default as SNIMaterialSelector, SNI_STRUCTURAL_STEEL, createSNICompositeMaterial } from './materials/SNIMaterialProperties';

// Enhanced 3D Visualization
export { default as Enhanced3DStructureViewer } from './3d/Enhanced3DStructureViewer';

// Enhanced Design Module Components
export { default as EnhancedTechnicalDrawing } from './design/EnhancedTechnicalDrawing';
export { default as SmartDesignValidator } from './design/SmartDesignValidator';

// Material Types
export type { 
  SNIStructuralSteel, 
  SNICompositeMaterial 
} from './materials/SNIMaterialProperties';

// Enhanced 3D Types
export type { 
  ElementVisibilityConfig,
  MaterialVisualizationConfig,
  GridConfig,
  DeformationConfig 
} from './3d/Enhanced3DStructureViewer';

// Technical Drawing Types
export type {
  EnhancedDrawingElement,
  TechnicalDrawingStandards
} from './design/EnhancedTechnicalDrawing';

// Smart Validator Types
export type {
  ValidationResult,
  IntelligentRecommendation,
  SmartTipContent
} from './design/SmartDesignValidator';

// Enhanced Structural Analysis Main System
export { default as EnhancedStructuralAnalysisSystem } from './EnhancedAdvancedStructuralAnalysisSystem';

// Re-export existing components for compatibility
export { default as CompleteStructuralAnalysisSystem } from './CompleteStructuralAnalysisSystem';
export { default as StructureViewer } from './3d/StructureViewer';
export { default as ReportGenerator } from './ReportGenerator';
export { default as ResultsDisplay } from './ResultsDisplay';