/**
 * Module Router - Comprehensive routing system for all structural analysis modules
 */

import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../ui/ProfessionalUI';
import { theme } from '../../styles/theme';

// Lazy load all structural analysis modules
const StructuralAnalysisSystem = lazy(() => import('../../structural-analysis/StructuralAnalysisSystem').then(mod => ({ default: mod.StructuralAnalysisSystem })));
const BasicStructuralAnalysisSystem = lazy(() => import('../../structural-analysis/BasicStructuralAnalysisSystem'));
const CompleteStructuralAnalysisSystem = lazy(() => import('../../structural-analysis/CompleteStructuralAnalysisSystemV2'));
const SimpleStructuralAnalysisSystem = lazy(() => import('../../structural-analysis/SimpleStructuralAnalysisSystem'));
const WorkingBasicStructuralAnalysisSystem = lazy(() => import('../../structural-analysis/WorkingBasicStructuralAnalysisSystem'));

// Advanced 3D Modules
const Advanced3DViewer = lazy(() => import('../../structural-analysis/advanced-3d/Advanced3DViewer'));
const Enhanced3DViewer = lazy(() => import('../../structural-analysis/advanced-3d/Enhanced3DViewer'));
const Optimized3DViewer = lazy(() => import('../../structural-analysis/advanced-3d/Optimized3DViewer'));
const Simple3DViewer = lazy(() => import('../../structural-analysis/advanced-3d/Simple3DViewer'));

// Visualization Modules
const AdvancedVisualizationInterface = lazy(() => import('../../structural-analysis/visualization/AdvancedVisualizationInterface'));

// Design Modules
const BeamDesignModule = lazy(() => import('../../structural-analysis/design/BeamDesignModule').then(mod => ({ default: mod.BeamDesignModule })));
const ColumnDesignModule = lazy(() => import('../../structural-analysis/design/ColumnDesignModule').then(mod => ({ default: mod.ColumnDesignModule })));
const SlabDesignModule = lazy(() => import('../../structural-analysis/design/SlabDesignModule').then(mod => ({ default: mod.SlabDesignModule })));

// BIM Modules
const BIMIntegrationInterface = lazy(() => import('../../structural-analysis/bim/BIMIntegrationInterface'));

// Reports - Create a React wrapper for PDFReportGenerator
const ReportGeneratorWrapper = lazy(() => import('../../structural-analysis/reports/PDFReportGenerator').then(mod => ({
  default: () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Report Generator</h2>
        <p className="text-blue-200">PDF Report generation functionality will be integrated here.</p>
      </div>
    );
  }
})));

// AI Modules - Create a React wrapper for AIAnalysisEngine
const AIAnalysisWrapper = lazy(() => import('../../structural-analysis/ai/AIAnalysisEngine').then(mod => ({
  default: () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">AI Structural Analysis</h2>
        <p className="text-blue-200">AI-powered analysis functionality will be integrated here.</p>
      </div>
    );
  }
})));

// Other utilities
const DemoRunner = lazy(() => import('../../demo').then(mod => ({ default: mod.DemoRunner })));
const EducationalPortal = lazy(() => import('../../educational/EducationalPortal'));
const MarketplaceInterface = lazy(() => import('../../marketplace').then(mod => ({ default: mod.MarketplaceInterface })));

export type ModuleKey = 
  | 'dashboard'
  | 'structural-analysis'
  | 'basic-analysis'
  | 'complete-analysis'
  | 'simple-analysis'
  | 'working-analysis'
  | 'advanced-3d'
  | 'enhanced-3d'
  | 'optimized-3d'
  | 'simple-3d'
  | 'visualization'
  | 'beam-design'
  | 'column-design'
  | 'slab-design'
  | 'bim'
  | 'reports'
  | 'ai-analysis'
  | 'demo'
  | 'educational'
  | 'marketplace'
  | 'cloud'
  | 'analytics'
  | 'database'
  | 'settings'
  | 'help'
  | 'profile';

export interface ModuleDefinition {
  key: ModuleKey;
  title: string;
  description: string;
  icon: string;
  category: 'analysis' | 'design' | '3d' | 'visualization' | 'tools' | 'utilities' | 'system';
  component: React.ComponentType<any>;
  props?: any;
}

export const moduleDefinitions: ModuleDefinition[] = [
  // Analysis Modules
  {
    key: 'structural-analysis',
    title: 'Structural Analysis',
    description: 'Complete structural analysis system with advanced features',
    icon: '🏗️',
    category: 'analysis',
    component: StructuralAnalysisSystem,
  },
  {
    key: 'basic-analysis',
    title: 'Basic Analysis',
    description: 'Basic structural analysis for simple structures',
    icon: '📐',
    category: 'analysis',
    component: BasicStructuralAnalysisSystem,
  },
  {
    key: 'complete-analysis',
    title: 'Complete Analysis',
    description: 'Comprehensive structural analysis with all features',
    icon: '🔧',
    category: 'analysis',
    component: CompleteStructuralAnalysisSystem,
  },
  {
    key: 'simple-analysis',
    title: 'Simple Analysis',
    description: 'Simplified structural analysis interface',
    icon: '⚙️',
    category: 'analysis',
    component: SimpleStructuralAnalysisSystem,
  },
  {
    key: 'working-analysis',
    title: 'Working Analysis',
    description: 'Working structural analysis system',
    icon: '🔨',
    category: 'analysis',
    component: WorkingBasicStructuralAnalysisSystem,
  },

  // 3D Visualization Modules
  {
    key: 'advanced-3d',
    title: 'Advanced 3D Viewer',
    description: 'Advanced 3D visualization with full controls',
    icon: '🎯',
    category: '3d',
    component: Advanced3DViewer,
  },
  {
    key: 'enhanced-3d',
    title: 'Enhanced 3D Viewer',
    description: 'Enhanced 3D viewer with modern features',
    icon: '🌟',
    category: '3d',
    component: Enhanced3DViewer,
  },
  {
    key: 'optimized-3d',
    title: 'Optimized 3D Viewer',
    description: 'Performance-optimized 3D visualization',
    icon: '⚡',
    category: '3d',
    component: Optimized3DViewer,
  },
  {
    key: 'simple-3d',
    title: 'Simple 3D Viewer',
    description: 'Simple and lightweight 3D viewer',
    icon: '📦',
    category: '3d',
    component: Simple3DViewer,
  },

  // Design Modules
  {
    key: 'beam-design',
    title: 'Beam Design',
    description: 'Structural beam design and optimization',
    icon: '📏',
    category: 'design',
    component: BeamDesignModule,
  },
  {
    key: 'column-design',
    title: 'Column Design',
    description: 'Structural column design and analysis',
    icon: '🏛️',
    category: 'design',
    component: ColumnDesignModule,
  },
  {
    key: 'slab-design',
    title: 'Slab Design',
    description: 'Concrete slab design and reinforcement',
    icon: '⬜',
    category: 'design',
    component: SlabDesignModule,
  },

  // Visualization & Tools
  {
    key: 'visualization',
    title: 'Advanced Visualization',
    description: 'Advanced visualization engine with analytics',
    icon: '📊',
    category: 'visualization',
    component: AdvancedVisualizationInterface,
  },
  {
    key: 'bim',
    title: 'BIM Integration',
    description: 'Building Information Modeling interface',
    icon: '🏢',
    category: 'tools',
    component: BIMIntegrationInterface,
  },
  {
    key: 'reports',
    title: 'Report Generator',
    description: 'Generate detailed structural analysis reports',
    icon: '📋',
    category: 'tools',
    component: ReportGeneratorWrapper,
  },
  {
    key: 'ai-analysis',
    title: 'AI Analysis',
    description: 'AI-powered structural analysis and optimization',
    icon: '🤖',
    category: 'tools',
    component: AIAnalysisWrapper,
  },

  // Utilities
  {
    key: 'demo',
    title: 'Demo Runner',
    description: 'Interactive demos and examples',
    icon: '🎮',
    category: 'utilities',
    component: DemoRunner,
  },
  {
    key: 'educational',
    title: 'Educational Portal',
    description: 'Learning resources and tutorials',
    icon: '🎓',
    category: 'utilities',
    component: EducationalPortal,
  },
  {
    key: 'marketplace',
    title: 'Marketplace',
    description: 'Templates, plugins, and resources',
    icon: '🛒',
    category: 'utilities',
    component: MarketplaceInterface,
  },
];

// Loading component
const ModuleLoadingSpinner: React.FC<{ moduleName: string }> = ({ moduleName }) => (
  <div 
    className="flex flex-col items-center justify-center min-h-screen"
    style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
    }}
  >
    <div 
      className="glass-card p-8 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <LoadingSpinner size="lg" color={theme.colors.primary[500]} />
      <h3 className="text-xl font-semibold mt-4 mb-2">Loading {moduleName}</h3>
      <p className="text-blue-200">Please wait while the module initializes...</p>
    </div>
  </div>
);

// Coming Soon component for unimplemented modules
const ComingSoonModule: React.FC<{ title: string; description: string; onNavigate: (view: string) => void }> = ({ 
  title, 
  description, 
  onNavigate 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">🚧 Coming Soon</h1>
        <h2 className="text-2xl font-semibold text-blue-200 mb-4">{title}</h2>
        <p className="text-blue-200 text-lg mb-6">{description}</p>
        <p className="text-blue-200 text-lg mb-6">
          Module ini sedang dalam tahap pengembangan dan akan segera tersedia.
        </p>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  </div>
);

interface ModuleRouterProps {
  currentModule: ModuleKey;
  onNavigate: (view: string) => void;
  marketplaceEngine?: any;
}

export const ModuleRouter: React.FC<ModuleRouterProps> = ({ 
  currentModule, 
  onNavigate,
  marketplaceEngine 
}) => {
  const moduleDefinition = moduleDefinitions.find(mod => mod.key === currentModule);

  if (!moduleDefinition) {
    return (
      <ComingSoonModule 
        title={currentModule.charAt(0).toUpperCase() + currentModule.slice(1)}
        description="This module is under development"
        onNavigate={onNavigate}
      />
    );
  }

  const ModuleComponent = moduleDefinition.component;
  
  return (
    <Suspense fallback={<ModuleLoadingSpinner moduleName={moduleDefinition.title} />}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <ModuleComponent 
            {...(moduleDefinition.props || {})}
            {...(currentModule === 'marketplace' ? { marketplaceEngine } : {})}
            {...(currentModule === 'marketplace' ? { 
              onTemplateSelected: (template: any) => console.log('Template selected:', template.name),
              onPluginInstalled: (plugin: any) => console.log('Plugin installed:', plugin.name)
            } : {})}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default ModuleRouter;