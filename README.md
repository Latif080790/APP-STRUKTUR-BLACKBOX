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
   - Structural analysis engine
   - Displacement calculations
   - Stress analysis
   - Safety checks

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
- SVG for visualizations

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

- Displacement analysis
- Internal force calculations
- Stress analysis
- Safety factor evaluation
- Code compliance checking (SNI standards)

## Visualization

- 3D structural model viewer
- 2D plan drawings
- Element labeling
- Grid system for reference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.