# Structural Analysis System (Blackbox)

A Vite + React + TypeScript app for conceptual building structural analysis with modular calculations (basic loads, seismic parameters, mock frame analysis), cost estimation, and report exporting.

## Quick Start

- Install dependencies
  ```bash
  npm install
  ```
- Development server
  ```bash
  npm run dev
  ```
- Build / Preview
  ```bash
  npm run build
  npm run preview
  ```
- Type-check
  ```bash
  npm run type-check
  ```

## Features

- Input modules: `Project`, `Geometry`, `Materials`, `Loads`, `Soil Data` in `src/components/structural-analysis/components/InputForm.tsx`.
- Seismic parameters and spectrum: `src/components/structural-analysis/calculations/seismic.ts`.
- Basic sizing helpers: `src/components/structural-analysis/calculations/basic.ts`.
- Frame model & mock analysis: `src/components/structural-analysis/calculations/frame-analysis.ts`.
- Cost estimation: `src/components/structural-analysis/calculations/cost.ts`.
- Results: `src/components/structural-analysis/components/ResultsDisplay.tsx` (member forces, drift, base shear, lateral forces, spectrum).
- 3D (isometric canvas): `src/components/structural-analysis/components/Visualization3D.tsx`.
- Report exporting: `src/components/structural-analysis/components/ReportGenerator.tsx` (printable HTML PDF, CSV export, JSON model export).
- UI components: `src/components/ui/*` with Tailwind + shadcn-style tokens.
- State persistence via `localStorage` and Reset Defaults button in `CompleteStructuralAnalysisSystem.tsx`.

## Notes & Limitations

- The frame analysis is a placeholder (randomized) and not a real FEM. Replace with a structural analysis engine for production.
- Seismic Fa/Fv are from an interpolated reference table for demo. For compliance, integrate official SNI tables and local hazard data.
- Units: Loads are input as kg/m² and converted to kN/m² internally.
- Tailwind CSS warnings in some editors can be silenced using the included `.vscode/settings.json` or by installing the Tailwind CSS IntelliSense extension.

## Directory Structure

- `src/components/structural-analysis/`
  - `CompleteStructuralAnalysisSystem.tsx`
  - `components/` (Input, Results, 3D, Report)
  - `calculations/` (basic, seismic, frame-analysis, cost, reinforcement)
  - `interfaces/` (types)
- `src/components/ui/` (button, card, input, label, select, tabs, progress)
- `src/lib/utils.ts` (utility `cn`)

## Roadmap

- Replace mock frame solver with FEM.
- Enrich seismic engine with full SNI workflows and geodata link.
- Add more serviceability checks and code-based member design.
- Improve 3D viewer with Three.js and modal overlays.
