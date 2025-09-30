import React, { useState } from 'react';
import { ModuleRouter, ModuleKey } from './components/routing/ModuleRouter';
import { MarketplaceEngine } from './marketplace/MarketplaceEngine';
import { ModernDashboard } from './components/ModernDashboard';
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
      return <ModernDashboard onNavigate={handleNavigate} />;
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
    <ModernLayout 
      currentView={currentView} 
      onNavigate={handleNavigate}
      showSidebar={currentView !== 'dashboard'}
    >
      {renderCurrentView()}
    </ModernLayout>
  );
}

export default App;