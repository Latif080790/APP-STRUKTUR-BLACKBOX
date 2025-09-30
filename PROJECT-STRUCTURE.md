# Project Structure

This document explains the organization of the Structural Analysis System project.

## Directory Structure

```
src/
├── structural-analysis/        # Main structural analysis module
│   ├── advanced-3d/           # Advanced 3D visualization components
│   │   ├── Advanced3DViewer.tsx   # Advanced 3D viewer
│   │   ├── Enhanced3DControls.tsx # Enhanced 3D controls
│   │   ├── Enhanced3DScene.tsx    # Enhanced 3D scene
│   │   ├── Enhanced3DViewer.tsx   # Enhanced 3D viewer
│   │   ├── Simple3DViewer.tsx     # Simple 3D viewer
│   │   ├── StructureViewer.tsx    # Structure-specific viewer
│   │   └── advanced-validation.ts # 3D validation utilities
│   ├── analysis/              # Structural analysis algorithms
│   │   ├── StructuralAnalyzer.ts  # Core analysis functions
│   │   └── index.ts           # Analysis module exports
│   ├── design/                # Design modules
│   │   ├── BeamDesignModule.tsx   # Beam design component
│   │   ├── BeamProperties.ts      # Beam material and section properties
│   │   ├── ColumnDesignModule.tsx # Column design component
│   │   ├── ColumnProperties.ts    # Column material and section properties
│   │   ├── SlabDesignModule.tsx   # Slab design component
│   │   ├── SlabProperties.ts      # Slab material and section properties
│   │   └── index.ts           # Design module exports
│   ├── drawing/               # Drawing generation
│   │   ├── StructuralDrawing.tsx  # 2D drawing component
│   │   └── index.ts           # Drawing module exports
│   ├── types/                 # Type definitions (re-exports from src/types)
│   ├── Structure3DViewer.tsx  # 3D visualization component
│   ├── StructuralAnalysisSystem.tsx  # Main application component
│   └── index.ts               # Structural analysis module exports
├── types/                     # Global type definitions
│   └── structural.ts          # Structural analysis type definitions
├── examples/                  # Example implementations
│   ├── StructuralAnalysisExample.tsx  # Example usage
│   └── index.ts               # Examples exports
├── App.tsx                    # Main application wrapper
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

## Module Descriptions

### Structural Analysis Module (`src/structural-analysis/`)

The core module containing all structural analysis functionality.

#### Analysis (`src/structural-analysis/analysis/`)

Contains algorithms for structural analysis:
- `StructuralAnalyzer.ts`: Functions for performing structural analysis including displacement, force, and stress calculations
- `index.ts`: Exports analysis functions

#### Design (`src/structural-analysis/design/`)

Contains design modules for structural elements:
- `BeamDesignModule.tsx`: Interactive beam design calculator with UI
- `BeamProperties.ts`: Standard beam materials and sections
- `ColumnDesignModule.tsx`: Interactive column design calculator with UI
- `ColumnProperties.ts`: Standard column materials and sections
- `SlabDesignModule.tsx`: Interactive slab design calculator with UI
- `SlabProperties.ts`: Standard slab materials and sections
- `index.ts`: Exports all design components and properties

#### Drawing (`src/structural-analysis/drawing/`)

Contains components for generating structural drawings:
- `StructuralDrawing.tsx`: 2D SVG-based structural drawing component
- `index.ts`: Exports drawing components

#### Visualization

- `Structure3DViewer.tsx`: 3D visualization component for viewing structures
- `StructuralAnalysisSystem.tsx`: Main application component that integrates all modules

#### Advanced 3D Visualization (`src/structural-analysis/advanced-3d/`)

Contains advanced 3D visualization components:
- `Advanced3DViewer.tsx`: Professional-grade 3D viewer with enhanced features
- `Enhanced3DControls.tsx`: Advanced controls for 3D navigation
- `Enhanced3DScene.tsx`: Enhanced 3D scene renderer with optimizations
- `Enhanced3DViewer.tsx`: Enhanced viewer with additional capabilities
- `Simple3DViewer.tsx`: Basic 3D viewer component for simple visualizations
- `StructureViewer.tsx`: Structure-specific 3D viewer with analysis integration

#### Types

- Re-exports structural types from `src/types/structural.ts`

### Types (`src/types/`)

Contains TypeScript type definitions:
- `structural.ts`: Core structural analysis types including Node, Element, Material, Section, Structure3D, and AnalysisResult

### Examples (`src/examples/`)

Contains example implementations:
- `StructuralAnalysisExample.tsx`: Example of how to use the structural analysis system
- `index.ts`: Exports examples

### Entry Points

- `App.tsx`: Main application wrapper component
- `main.tsx`: Application entry point that bootstraps the React application
- `index.css`: Global CSS styles

## Key Design Principles

### Modularity

Each module is designed to be independent and reusable:
- Design modules can be used standalone
- Analysis functions can be used programmatically
- Visualization components can be integrated separately

### Type Safety

All components use TypeScript for type safety:
- Strong typing for structural elements
- Interface definitions for all data structures
- Compile-time error checking

### Component-Based Architecture

React components follow a consistent pattern:
- Self-contained UI components
- Clear input/output interfaces
- Reusable and testable

### Separation of Concerns

Different aspects of the system are separated:
- UI components handle presentation
- Analysis modules handle calculations
- Type definitions handle data structures
- Visualization components handle rendering

## Integration Points

### Main Application (`StructuralAnalysisSystem.tsx`)

The main application integrates all modules:
- Tab-based navigation between design modules
- Centralized state management
- Unified structure data model

### Data Flow

1. Design modules create elements
2. Elements are added to central structure
3. Structure is used for visualization
4. Structure is analyzed for safety verification

### Extension Points

The system is designed for easy extension:
- New design modules can be added
- Additional analysis functions can be implemented
- New visualization components can be integrated
- Custom materials and sections can be defined

## Testing

- Unit tests for analysis functions
- Component tests for UI elements
- Integration tests for data flow
- Visual regression tests for components

## Build and Deployment

- Vite for fast development and building
- TypeScript for type checking
- ESLint for code quality
- Vitest for testing