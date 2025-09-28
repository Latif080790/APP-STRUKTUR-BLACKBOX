/**
 * Design Module Index - Exports all design module components
 */

export { default as StructuralDesignEngine } from './StructuralDesignEngine';
export { default as DesignResultsManager } from './DesignResultsManager';
export { default as DesignVisualization, DesignDashboard } from './DesignVisualization';
export { default as DesignModule } from './DesignModule';

export type { 
  DesignInput, 
  DesignResults
} from './StructuralDesignEngine';

export type { 
  DesignSummary, 
  DesignOptimization 
} from './DesignResultsManager';