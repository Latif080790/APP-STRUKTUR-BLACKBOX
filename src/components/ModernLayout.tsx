/**
 * Modern Layout Component
 * Main layout wrapper with sidebar and content area
 */

import React, { ReactNode } from 'react';
import { ModernSidebar } from './ModernSidebar';

interface ModernLayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  showSidebar?: boolean;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  showSidebar = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {showSidebar && (
        <ModernSidebar currentView={currentView} onNavigate={onNavigate} />
      )}
      
      <div className={`transition-all duration-300 ${showSidebar ? 'ml-64' : 'ml-0'}`}>
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};