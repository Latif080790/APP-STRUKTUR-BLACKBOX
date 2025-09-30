import React, { useState } from 'react';
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

  const handleNavigate = (view: string) => {
    setCurrentView(view as ModuleKey);
  };

  const renderCurrentView = () => {
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
  };

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
}

export default App;