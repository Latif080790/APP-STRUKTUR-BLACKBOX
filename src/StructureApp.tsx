/**
 * Main Structure Application
 * Main template that integrates all modules with complete navigation hierarchy
 */

import React, { useState, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import DashboardOverview from './modules/dashboard/DashboardOverview';
import ProjectManagement from './modules/projects/ProjectManagement';
import AnalyzeStructureCore from './modules/analyze/AnalyzeStructureCore';
import DesignModule from './modules/design/DesignModule';
import Viewer3D from './modules/viewer3d/Viewer3D';
import EducationModule from './modules/education/EducationModule';
import Marketplace from './modules/marketplace/Marketplace';
import ReportsModule from './modules/reports/ReportsModule';
import StandardsValidation from './modules/validation/StandardsValidation';
import { NotificationProvider, ErrorBoundary } from './components/ErrorHandling';

// Import existing components for other modules
import ProfessionalStructuralDashboard from './components/ProfessionalStructuralDashboard';

const StructureApp: React.FC = () => {
  const [currentModule, setCurrentModule] = useState('overview');

  // Read URL parameters to determine current module
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const moduleParam = urlParams.get('module');
    const subParam = urlParams.get('sub');
    
    console.log('URL Parameters:', { module: moduleParam, sub: subParam });
    
    if (subParam) {
      // If we have a sub parameter, use it as the current module
      setCurrentModule(subParam);
    } else if (moduleParam) {
      // If we only have module, use the default sub-module for that module
      switch(moduleParam) {
        case 'design':
          setCurrentModule('component-design');
          break;
        case 'analyze':
          setCurrentModule('static-analysis');
          break;
        case 'education':
          setCurrentModule('tutorials');
          break;
        case 'marketplace':
          setCurrentModule('bim-plugins');
          break;
        case 'reports':
          setCurrentModule('analysis-reports');
          break;
        case 'validation':
          setCurrentModule('sni-standards');
          break;
        default:
          setCurrentModule(moduleParam);
      }
    }
  }, []);

  // Listen for URL changes (for back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const moduleParam = urlParams.get('module');
      const subParam = urlParams.get('sub');
      
      if (subParam) {
        setCurrentModule(subParam);
      } else if (moduleParam) {
        setCurrentModule(moduleParam);
      } else {
        setCurrentModule('overview');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle module changes and update URL
  const handleModuleChange = (module: string) => {
    console.log('Module change requested:', module);
    setCurrentModule(module);
    
    // Update URL based on module
    const urlParams = new URLSearchParams();
    
    // Determine parent module for sub-modules
    const designModules = ['component-design', 'steel-design', 'concrete-design', 'timber-design', 'foundation-design', 'connection-design', 'code-checking', 'reinforcement'];
    const analyzeModules = ['static-analysis', 'dynamic-analysis', 'linear-analysis', 'nonlinear-analysis', 'seismic-analysis', 'wind-load', 'load-combinations', 'analysis-results'];
    const educationModules = ['tutorials', 'courses', 'case-studies', 'documentation', 'best-practices', 'certification', 'community', 'knowledge-base'];
    const marketplaceModules = ['bim-plugins', 'analysis-tools', 'design-templates', 'material-libraries', 'my-purchases', 'plugin-management', 'developer-resources'];
    const reportsModules = ['analysis-reports', 'design-reports', 'materia0l-schedules', 'cost-estimation', 'technical-docs', 'export-options', 'report-templates', 'automated-reports'];
    const validationModules = ['sni-standards', 'asce-standards', 'eurocode', 'aci-standards', 'aisc-standards', 'custom-standards', 'compliance-checker', 'standard-updates'];
    
    if (designModules.includes(module)) {
      urlParams.set('module', 'design');
      urlParams.set('sub', module);
    } else if (analyzeModules.includes(module)) {
      urlParams.set('module', 'analyze');
      urlParams.set('sub', module);
    } else if (educationModules.includes(module)) {
      urlParams.set('module', 'education');
      urlParams.set('sub', module);
    } else if (marketplaceModules.includes(module)) {
      urlParams.set('module', 'marketplace');
      urlParams.set('sub', module);
    } else if (reportsModules.includes(module)) {
      urlParams.set('module', 'reports');
      urlParams.set('sub', module);
    } else if (validationModules.includes(module)) {
      urlParams.set('module', 'validation');
      urlParams.set('sub', module);
    } else {
      // Top-level modules
      urlParams.set('module', module);
    }
    
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      // Dashboard Module
      case 'overview':
      case 'dashboard':
        return <DashboardOverview />;
      
      case 'statistics':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Statistics & Metrics</h2>
            <p className="text-gray-600">Detailed statistics and performance metrics will be displayed here.</p>
          </div>
        );
      
      case 'activities':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <p className="text-gray-600">Comprehensive activity log and project timeline.</p>
          </div>
        );
      
      case 'storage':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage Capacity Monitor</h2>
            <p className="text-gray-600">Detailed storage usage and management tools.</p>
          </div>
        );

      // Project Management Module
      case 'projects':
      case 'my-projects':
        return <ProjectManagement />;
      
      case 'create-new':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Project</h2>
            <p className="text-gray-600">Project creation wizard with template selection.</p>
          </div>
        );
      
      case 'shared':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shared Projects</h2>
            <p className="text-gray-600">Collaborative projects and team management.</p>
          </div>
        );
      
      case 'archived':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Archived Projects</h2>
            <p className="text-gray-600">Archived project management and restoration.</p>
          </div>
        );
      
      case 'templates':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Templates</h2>
            <p className="text-gray-600">Pre-configured project templates for various building types.</p>
          </div>
        );

      // Analyze Structure Core Module ⭐
      case 'analyze':
        // Automatically redirect to Static Analysis when accessing main analyze module
        setCurrentModule('static-analysis');
        return <AnalyzeStructureCore initialAnalysisType="static" />;
      case 'static-analysis':
        return <AnalyzeStructureCore initialAnalysisType="static" />;
      case 'dynamic-analysis':
        return <AnalyzeStructureCore initialAnalysisType="dynamic" />;
      case 'linear-analysis':
        return <AnalyzeStructureCore initialAnalysisType="linear" />;
      case 'nonlinear-analysis':
        return <AnalyzeStructureCore initialAnalysisType="nonlinear" />;
      case 'seismic-analysis':
        return <AnalyzeStructureCore initialAnalysisType="seismic" />;
      case 'wind-load':
        return <AnalyzeStructureCore initialAnalysisType="wind" />;
      case 'load-combinations':
        return <AnalyzeStructureCore initialAnalysisType="combinations" />;
      case 'analysis-results':
        return <AnalyzeStructureCore initialAnalysisType="results" />;

      // Design Module
      case 'design':
      case 'component-design':
      case 'steel-design':
      case 'concrete-design':
      case 'timber-design':
      case 'foundation-design':
      case 'connection-design':
      case 'code-checking':
      case 'reinforcement':
        return <DesignModule subModule={currentModule} />;

      // 3D View Structure Module  
      case '3d-viewer':
      case '3d-model':
      case 'deformation':
      case 'stress-view':
      case 'layer-management':
      case 'section-views':
      case 'animation':
      case 'rendering':
      case 'model-comparison':
        return <Viewer3D subModule={currentModule} />;

      // Learning Education Module
      case 'education':
      case 'tutorials':
      case 'courses':
      case 'case-studies':
      case 'documentation':
      case 'best-practices':
      case 'certification':
      case 'community':
      case 'knowledge-base':
        return <EducationModule subModule={currentModule} />;

      // Marketplace Module
      case 'marketplace':
      case 'bim-plugins':
      case 'analysis-tools':
      case 'design-templates':
      case 'material-libraries':
      case 'my-purchases':
      case 'plugin-management':
      case 'developer-resources':
        return <Marketplace subModule={currentModule} />;

      // System Report Module
      case 'reports':
      case 'analysis-reports':
      case 'design-reports':
      case 'material-schedules':
      case 'cost-estimation':
      case 'technical-docs':
      case 'export-options':
      case 'report-templates':
      case 'automated-reports':
        return <ReportsModule subModule={currentModule} />;

      // Validasi Standar Module
      case 'validation':
      case 'sni-standards':
      case 'asce-standards':
      case 'eurocode':
      case 'aci-standards':
      case 'aisc-standards':
      case 'custom-standards':
      case 'compliance-checker':
      case 'standard-updates':
        return <StandardsValidation subModule={currentModule} />;

      // Settings & Preferences Module
      case 'settings':
      case 'user-profile':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>
            <p className="text-gray-600">User account settings and preferences.</p>
          </div>
        );
      
      case 'team-management':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Management</h2>
            <p className="text-gray-600">Team collaboration and permission management.</p>
          </div>
        );
      
      case 'units-formats':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Units & Formats</h2>
            <p className="text-gray-600">Unit system and display format settings.</p>
          </div>
        );
      
      case 'material-database':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Material Database</h2>
            <p className="text-gray-600">Material database management and custom materials.</p>
          </div>
        );
      
      case 'load-patterns':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Load Patterns Library</h2>
            <p className="text-gray-600">Pre-defined load patterns and custom definitions.</p>
          </div>
        );
      
      case 'integration-settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Settings</h2>
            <p className="text-gray-600">CAD/BIM integration and API configurations.</p>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
            <p className="text-gray-600">Notification preferences and alert settings.</p>
          </div>
        );
      
      case 'billing':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription & Billing</h2>
            <p className="text-gray-600">Subscription management and billing information.</p>
          </div>
        );

      // Default fallback
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <MainLayout 
          currentModule={currentModule} 
          onModuleChange={handleModuleChange}
        >
          {renderModuleContent()}
        </MainLayout>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default StructureApp;