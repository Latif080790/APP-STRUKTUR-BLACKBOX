import React, { useState } from 'react';

// Import komponen yang sudah ada
import { ModuleRouter, ModuleKey } from './components/routing/ModuleRouter';
import { MarketplaceEngine } from './marketplace/MarketplaceEngine';
import { ModernDashboard } from './components/ModernDashboard';
import { CleanDashboard } from './components/CleanDashboard';
import { ProfessionalWorkspace } from './components/ProfessionalWorkspace';
import { SmartIntegrationDashboard } from './components/SmartIntegrationDashboard';
import { PerformanceAnalyticsDashboard } from './components/PerformanceAnalyticsDashboard';
import { AdvancedMaterialLibrary } from './components/AdvancedMaterialLibrary';
import { ModernLayout } from './components/ModernLayout';

// Initialize engines
const marketplaceEngine = new MarketplaceEngine();

function App() {
  const [currentView, setCurrentView] = useState<ModuleKey>('dashboard');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view as ModuleKey);
  };

  // Fallback UI jika ada error
  const renderFallbackUI = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Sistem Analisis Struktural</h1>
        <p className="text-blue-200 mb-8">Aplikasi sedang memuat...</p>
        <div className="inline-flex space-x-4">
          <button 
            onClick={() => handleNavigate('dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </button>
          <button 
            onClick={() => handleNavigate('workspace')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Workspace
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    try {
      if (currentView === 'dashboard') {
        return <CleanDashboard onNavigate={handleNavigate} />;
      }
      
      if (currentView === 'workspace') {
        return <ProfessionalWorkspace onNavigate={handleNavigate} />;
      }
      
      if (currentView === 'smart-integration') {
        return <SmartIntegrationDashboard onNavigate={handleNavigate} />;
      }
      
      if (currentView === 'performance-analytics') {
        return <PerformanceAnalyticsDashboard onNavigate={handleNavigate} />;
      }
      
      if (currentView === 'material-library') {
        return <AdvancedMaterialLibrary onNavigate={handleNavigate} />;
      }
      
      return (
        <ModuleRouter 
          currentModule={currentView}
          onNavigate={handleNavigate}
          marketplaceEngine={marketplaceEngine}
        />
      );
    } catch (error) {
      console.error('Error rendering view:', error);
      return renderFallbackUI();
    }
  };

  try {
    return (
      <div>
        {currentView === 'dashboard' || currentView === 'workspace' || currentView === 'smart-integration' || 
         currentView === 'performance-analytics' || currentView === 'material-library' ? (
          currentView === 'dashboard' ? (
            <CleanDashboard onNavigate={handleNavigate} />
          ) : currentView === 'workspace' ? (
            <ProfessionalWorkspace onNavigate={handleNavigate} />
          ) : currentView === 'smart-integration' ? (
            <SmartIntegrationDashboard onNavigate={handleNavigate} />
          ) : currentView === 'performance-analytics' ? (
            <PerformanceAnalyticsDashboard onNavigate={handleNavigate} />
          ) : (
            <AdvancedMaterialLibrary onNavigate={handleNavigate} />
          )
        ) : (
          <ModernLayout 
            currentView={currentView} 
            onNavigate={handleNavigate}
            showSidebar={true}
          >
            {renderCurrentView()}
          </ModernLayout>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return renderFallbackUI();
  }
}

export default App;