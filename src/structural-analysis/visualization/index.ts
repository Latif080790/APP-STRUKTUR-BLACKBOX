/**
 * Advanced Visualization Module
 * Entry point for VR and stress contour visualization capabilities
 */

export { 
  AdvancedVisualizationEngine, 
  createAdvancedVisualizationEngine,
  VisualizationUtils,
  ColorMapUtils
} from './AdvancedVisualizationEngine';

export type {
  VisualizationConfig,
  VRConfig,
  StressContour,
  DeformationFrame,
  ForceFlow,
  VisualizationResult,
  VRInteractionEvent
} from './AdvancedVisualizationEngine';

export { default as AdvancedVisualizationInterface } from './AdvancedVisualizationInterface';