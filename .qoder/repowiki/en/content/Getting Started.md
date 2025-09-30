# Getting Started

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [vite.config.ts](file://vite.config.ts)
- [main.tsx](file://src/main.tsx)
- [App.tsx](file://src/App.tsx)
- [DEPLOY-WORKFLOW.md](file://DEPLOY-WORKFLOW.md)
- [DEV-WORKFLOW.md](file://DEV-WORKFLOW.md)
- [USER-GUIDE.md](file://USER-GUIDE.md)
- [EDUCATIONAL_FEATURES.md](file://EDUCATIONAL_FEATURES.md)
- [EducationalPortal.tsx](file://src/educational/EducationalPortal.tsx)
- [DemoPage.tsx](file://src/demo/DemoPage.tsx)
- [WorkingBasicStructuralAnalysisSystem.tsx](file://src/structural-analysis/WorkingBasicStructuralAnalysisSystem.tsx)
- [Simple3DViewer.tsx](file://src/structural-analysis/advanced-3d/Simple3DViewer.tsx)
- [structural.ts](file://src/types/structural.ts)
- [TutorialGuide.tsx](file://src/educational/TutorialGuide.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Development Environment Setup](#development-environment-setup)
4. [Running the Application](#running-the-application)
5. [Vite Build Process](#vite-build-process)
6. [Running the Demo Version](#running-the-demo-version)
7. [Accessing the Educational Portal](#accessing-the-educational-portal)
8. [Deployment Options](#deployment-options)
9. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Introduction

The APP-STRUKTUR-BLACKBOX application is a comprehensive structural analysis system designed for engineering professionals and educational use. This guide provides step-by-step instructions for setting up the development environment, running the application, and deploying it to production. The application is built with React and TypeScript, using Vite as the build tool, and includes advanced 3D visualization capabilities for structural analysis.

**Section sources**
- [README.md](file://README.md#L1-L177)

## Project Structure

The application follows a modular structure with clearly defined directories for different components:

```
src/
├── components/ui          # Reusable UI components
├── demo                   # Demo application components
├── educational            # Educational portal components
├── examples               # Code examples
├── lib                    # Utility libraries
├── standards              # Structural design standards
├── structural-analysis    # Core analysis system
├── types                  # TypeScript type definitions
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

The `src/structural-analysis` directory contains the core functionality including advanced 3D visualization, structural analysis algorithms, design modules, and drawing generation. The educational features are located in the `src/educational` directory, providing a comprehensive learning environment for students and professors.

**Section sources**
- [README.md](file://README.md#L4-L38)
- [DEV-WORKFLOW.md](file://DEV-WORKFLOW.md#L45-L85)

## Development Environment Setup

### Prerequisites

Before setting up the development environment, ensure you have the following tools installed:

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: Latest version

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/Latif080790/APP-STRUKTUR-BLACKBOX.git
cd APP-STRUKTUR-BLACKBOX
```

2. Install dependencies using npm:
```bash
npm install
```

The installation process will install all required dependencies listed in the `package.json` file, including React, TypeScript, Vite, Three.js for 3D visualization, and various UI components.

**Expected output:**
```
added 1,234 packages in 45.6s
Installation complete
```

The `postinstall` script in `package.json` confirms successful installation with the message "Installation complete".

**Section sources**
- [DEV-WORKFLOW.md](file://DEV-WORKFLOW.md#L87-L102)
- [package.json](file://package.json#L0-L74)

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
npm run dev
```

This command starts the Vite development server on port 8080 with the following configuration:
- Server port: 8080
- Auto-open browser: Enabled
- Host access: Available to all network interfaces

The application will be accessible at `http://localhost:8080` or `http://[your-ip]:8080`.

**Expected output:**
```
vite v4.4.5 dev server running at:
> Local: http://localhost:8080/
> Network: http://[your-ip]:8080/
```

### Building for Production

To create a production build of the application:

```bash
npm run build
```

This command executes the following steps:
1. Compiles TypeScript code (`tsc`)
2. Runs Vite build process
3. Generates optimized assets in the `dist/` directory

For production deployment, use the dedicated build script:

```bash
npm run build:prod
```

This sets the `NODE_ENV` to production and creates an optimized build with minification.

To analyze the bundle size:

```bash
npm run build:analyze
```

This generates a bundle report at `dist/stats.html` for optimization analysis.

**Section sources**
- [README.md](file://README.md#L58-L70)
- [package.json](file://package.json#L5-L15)
- [vite.config.ts](file://vite.config.ts#L10-L72)

## Vite Build Process

The build process is configured in `vite.config.ts` with the following key features:

### Configuration Options

- **React Plugin**: Configured with emotion for CSS-in-JS support
- **Alias**: `@` alias points to the `src` directory
- **Server**: Development server on port 8080 with auto-open enabled
- **Build Optimization**: Manual code splitting for vendor libraries

### Code Splitting

The build configuration implements code splitting to optimize loading performance:

```typescript
manualChunks: {
  vendor: ['react', 'react-dom'],
  three: ['three', '@react-three/fiber', '@react-three/drei'],
  charts: ['chart.js', 'react-chartjs-2', 'recharts'],
  pdf: ['jspdf', 'jspdf-autotable'],
  ui: ['@radix-ui/react-dialog', '@radix-ui/react-slider', '@radix-ui/react-switch']
}
```

This splits the bundle into separate chunks for different functionality areas, allowing for better caching and reduced initial load time.

### Environment Variables

The configuration defines several environment variables:
- `__APP_VERSION__`: Application version from package.json
- `__BUILD_TIME__`: Timestamp of the build
- `__IS_PRODUCTION__`: Boolean indicating production environment

**Section sources**
- [vite.config.ts](file://vite.config.ts#L1-L72)

## Running the Demo Version

The application includes a demo version that showcases the core functionality. To access the demo:

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the demo interface in your browser at `http://localhost:8080`

3. Click the "Coba Sistem" (Try System) button on the demo page to launch the working structural analysis system.

The demo includes three pre-configured projects:
- **Office Building**: 5-story office building in Jakarta CBD
- **Residential Building**: 3-story apartment building
- **Warehouse**: Single-story industrial warehouse

Each demo project includes realistic parameters for geometry, materials, and loads, allowing users to immediately experience the application's capabilities without manual configuration.

**Section sources**
- [DemoPage.tsx](file://src/demo/DemoPage.tsx#L0-L487)
- [USER-GUIDE.md](file://USER-GUIDE.md#L1-L331)

## Accessing the Educational Portal

The application includes an educational portal designed for students and professors. To access the educational features:

1. Navigate to the application in your browser
2. The educational portal is integrated as a component within the application structure

The portal includes the following features:

### For Students
- **Interactive Tutorial Guide**: Step-by-step guide to using the software
- **Structural Theory Reference**: Comprehensive theoretical background
- **Example Problems Library**: Pre-built examples for common structural analysis problems
- **Progress Tracking**: Track completed topics and assignments

### For Professors
- **Course Management**: Tools for creating and distributing assignments
- **Teaching Resources**: Theory materials, video tutorials, and practice problems
- **Assessment Tools**: Built-in quizzes and analysis result verification

The educational portal is implemented as a React component with sidebar navigation and responsive design that works on desktop, tablet, and mobile devices.

**Section sources**
- [EDUCATIONAL_FEATURES.md](file://EDUCATIONAL_FEATURES.md#L1-L207)
- [EducationalPortal.tsx](file://src/educational/EducationalPortal.tsx#L0-L281)
- [TutorialGuide.tsx](file://src/educational/TutorialGuide.tsx#L0-L296)

## Deployment Options

The application can be deployed in several ways for production use:

### Local Network Deployment
```bash
# Build production version
npm run build

# Deploy to company server
# Internal access for engineering team
# Secure environment
```

### Cloud Deployment
```bash
# Deploy to Vercel/Netlify
# Global access for remote teams
# Automatic scaling
# SSL certificates
```

### Desktop Application
```bash
# Electron packaging
# Standalone engineering workstation
# Offline capability
# Local file storage
```

The `DEPLOY-WORKFLOW.md` file provides detailed instructions for production deployment, including server configuration examples for Nginx and Apache, system monitoring, and maintenance tasks.

**Section sources**
- [DEPLOY-WORKFLOW.md](file://DEPLOY-WORKFLOW.md#L1-L148)
- [USER-GUIDE.md](file://USER-GUIDE.md#L288-L317)

## Troubleshooting Common Issues

### Dependency Conflicts

If you encounter dependency conflicts during installation:

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

For TypeScript or build errors:

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Clean build cache
npm run clean
```

### 3D Rendering Issues

If the 3D visualization fails to render:

1. Verify WebGL support in your browser
2. Check browser console for errors
3. Ensure your graphics drivers are up to date

### Performance Issues

For slow application performance:

1. Check the bundle size with `npm run build:analyze`
2. Verify that code splitting is working correctly
3. Monitor memory usage in the browser developer tools

### Common Solutions

```bash
# Quick fixes for common issues
# Clear browser cache
# Restart development server
# Check network connectivity
# Verify WebGL: chrome://gpu/
```

The application includes comprehensive error handling with graceful fallback UIs and detailed error reporting to assist with troubleshooting.

**Section sources**
- [DEV-WORKFLOW.md](file://DEV-WORKFLOW.md#L278-L320)
- [DEPLOY-WORKFLOW.md](file://DEPLOY-WORKFLOW.md#L121-L147)
- [Simple3DViewer.tsx](file://src/structural-analysis/advanced-3d/Simple3DViewer.tsx#L0-L378)