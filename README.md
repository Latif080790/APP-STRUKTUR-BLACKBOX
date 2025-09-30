# Structural Analysis System

A comprehensive structural analysis application for designing and analyzing building structures.

## Project Structure

```
src/
├── structural-analysis/
│   ├── advanced-3d/        # Advanced 3D visualization components
│   ├── analysis/           # Structural analysis algorithms and calculations
│   ├── design/             # Design modules for beams, columns, and slabs
│   ├── drawing/            # Structural drawing generation
│   ├── educational/        # Educational components for students and professors
│   ├── types/              # TypeScript type definitions
│   ├── StructuralAnalysisSystem.tsx  # Main application component
│   └── index.ts            # Module exports
├── types/                  # Global type definitions
└── main.tsx               # Application entry point
```

## Features

1. **Design Modules**
   - Beam Design Calculator
   - Column Design Calculator
   - Slab Design Calculator

2. **Visualization**
   - Advanced 3D Structure Viewer
   - 2D Structural Drawings

3. **Analysis**
   - Structural analysis engine using stiffness matrix method
   - Displacement calculations
   - Internal force analysis (axial, shear, moment, torsion)
   - Stress analysis
   - Safety checks with material-specific criteria
   - Static and dynamic analysis (modal analysis, response spectrum)
   - Code compliance checking (SNI standards)

4. **Export Capabilities**
   - Structure data export (JSON, CSV)
   - Analysis results export (CSV)
   - 3D visualization export (PNG images)

5. **Educational Features**
   - Interactive tutorial guide for students
   - Structural theory reference materials
   - Example problems library
   - Progress tracking for learners
   - Course management tools for professors

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Technology Stack

- React with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Three.js for 3D visualization
- React Three Fiber for React-Three.js integration

## Design Modules

### Beam Design Module
- Calculates bending moments, shear forces, and deflections
- Supports different support conditions (simply supported, fixed, cantilever)
- Material selection (concrete, steel)
- Section selection (rectangular, I-section)

### Column Design Module
- Calculates axial loads, bending moments, and slenderness ratios
- Supports different end conditions (pinned-pinned, fixed-fixed, fixed-pinned)
- Material selection (concrete, steel)
- Section selection (rectangular, circular, I-section)

### Slab Design Module
- Calculates moments, shear forces, and deflections for slab systems
- Supports different support conditions (four sides, two sides, cantilever)
- Reinforcement calculations
- Thickness optimization

## Analysis Capabilities

- 3D structural analysis using stiffness matrix method
- Displacement analysis in all directions
- Internal force calculations (axial, shear, moment, torsion)
- Stress analysis with combined stress checking
- Safety factor evaluation with material-specific criteria
- Static analysis (displacements, forces, stresses)
- Dynamic analysis (modal analysis, response spectrum)
- Code compliance checking (SNI standards)

## Visualization

- Interactive 3D structural model viewer with Three.js
- 2D plan drawings
- Element labeling and property display
- Grid system for reference
- Camera controls (pan, zoom, rotate)
- Stress and force visualization
- Mode shape animation for dynamic analysis

## Export Features

- Structure data export in JSON and CSV formats
- Analysis results export in CSV format
- 3D visualization export as PNG images
- High-resolution rendering for presentations

## Educational Features

### For Students
- Interactive tutorial guide
- Structural theory reference
- Example problems library
- Progress tracking
- Self-paced learning

### For Professors
- Course management tools
- Assignment creation and distribution
- Grading tools
- Curriculum resources
- Assessment tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.