// Structural Analysis System - Main Entry Point

// Design Modules
export * from './design/BeamDesignModule';
export * from './design/ColumnDesignModule';
export * from './design/SlabDesignModule';

// Design Properties
export * from './design/BeamProperties';
export * from './design/ColumnProperties';
export * from './design/SlabProperties';

// Main System
export * from './StructuralAnalysisSystem';

// Types
export type { Node, Element, Material, Section, Structure3D, AnalysisResult } from '@/types/structural';