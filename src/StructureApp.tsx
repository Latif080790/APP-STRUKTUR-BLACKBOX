/**
 * Main Structure Application
 * Template utama yang mengintegrasikan semua modul dengan hierarki navigasi lengkap
 */

import React, { useState } from 'react';
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

// Import existing components untuk modul lainnya
import ProfessionalStructuralDashboard from './components/ProfessionalStructuralDashboard';

const StructureApp: React.FC = () => {
  const [currentModule, setCurrentModule] = useState('overview');

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
            <p className="text-gray-600">Detailed statistics and performance metrics akan ditampilkan di sini.</p>
          </div>
        );
      
      case 'activities':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <p className="text-gray-600">Comprehensive activity log dan project timeline.</p>
          </div>
        );
      
      case 'storage':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Storage Capacity Monitor</h2>
            <p className="text-gray-600">Detailed storage usage dan management tools.</p>
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
            <p className="text-gray-600">Project creation wizard dengan template selection.</p>
          </div>
        );
      
      case 'shared':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shared Projects</h2>
            <p className="text-gray-600">Collaborative projects dan team management.</p>
          </div>
        );
      
      case 'archived':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Archived Projects</h2>
            <p className="text-gray-600">Archived project management dan restoration.</p>
          </div>
        );
      
      case 'templates':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Templates</h2>
            <p className="text-gray-600">Pre-configured project templates untuk berbagai jenis bangunan.</p>
          </div>
        );

      // Analyze Structure Core Module ⭐
      case 'analyze':
      case 'static-analysis':
      case 'dynamic-analysis':
      case 'linear-analysis':
      case 'nonlinear-analysis':
      case 'seismic-analysis':
      case 'wind-load':
      case 'load-combinations':
      case 'analysis-results':
        return <AnalyzeStructureCore />;

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
            <p className="text-gray-600">User account settings dan preferences.</p>
          </div>
        );
      
      case 'team-management':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Management</h2>
            <p className="text-gray-600">Team collaboration dan permission management.</p>
          </div>
        );
      
      case 'units-formats':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Units & Formats</h2>
            <p className="text-gray-600">Unit system dan display format settings.</p>
          </div>
        );
      
      case 'material-database':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Material Database</h2>
            <p className="text-gray-600">Material database management dan custom materials.</p>
          </div>
        );
      
      case 'load-patterns':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Load Patterns Library</h2>
            <p className="text-gray-600">Pre-defined load patterns dan custom definitions.</p>
          </div>
        );
      
      case 'integration-settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Settings</h2>
            <p className="text-gray-600">CAD/BIM integration dan API configurations.</p>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
            <p className="text-gray-600">Notification preferences dan alert settings.</p>
          </div>
        );
      
      case 'billing':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription & Billing</h2>
            <p className="text-gray-600">Subscription management dan billing information.</p>
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
          onModuleChange={setCurrentModule}
        >
          {renderModuleContent()}
        </MainLayout>
      </NotificationProvider>
    </ErrorBoundary>
  );
};

export default StructureApp;