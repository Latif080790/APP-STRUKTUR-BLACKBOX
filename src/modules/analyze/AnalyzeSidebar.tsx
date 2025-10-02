/**
 * Analyze Structure Sidebar - Navigasi untuk semua jenis analisis
 */

import React from 'react';
import {
  Target, Activity, BarChart3, TrendingUp, Zap, Wind, 
  Layers, FileText
} from 'lucide-react';

interface AnalyzeSidebarProps {
  currentAnalysisType: string;
  onAnalysisTypeChange: (type: string) => void;
}

const AnalyzeSidebar: React.FC<AnalyzeSidebarProps> = ({
  currentAnalysisType,
  onAnalysisTypeChange
}) => {
  const sidebarItems = [
    {
      id: 'static',
      name: 'Static Analysis',
      icon: Target,
      description: 'Linear static analysis'
    },
    {
      id: 'dynamic',
      name: 'Dynamic Analysis',
      icon: Activity,
      description: 'Modal and response spectrum analysis'
    },
    {
      id: 'linear',
      name: 'Linear Analysis',
      icon: BarChart3,
      description: 'First-order linear analysis'
    },
    {
      id: 'nonlinear',
      name: 'Non-Linear Analysis',
      icon: TrendingUp,
      description: 'Analysis with P-Delta effects'
    },
    {
      id: 'seismic',
      name: 'Seismic Analysis',
      icon: Zap,
      description: 'Earthquake analysis per SNI 1726'
    },
    {
      id: 'wind',
      name: 'Wind Load Analysis',
      icon: Wind,
      description: 'Wind load analysis per SNI 1727'
    },
    {
      id: 'combinations',
      name: 'Load Combinations',
      icon: Layers,
      description: 'Load combinations per standards'
    },
    {
      id: 'results',
      name: 'Analysis Results',
      icon: FileText,
      description: 'Results display and reports'
    }
  ];

  return (
    <div className="w-80 bg-slate-800 text-white h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Analyze Structure</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">CORE</span>
              <span className="text-yellow-400">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          // IMPROVED ACTIVE STATE LOGIC - DEFAULT TO STATIC IF EMPTY
          const isActive = currentAnalysisType === item.id || (currentAnalysisType === '' && item.id === 'static');
          
          return (
            <button
              key={item.id}
              onClick={() => onAnalysisTypeChange(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs opacity-75 mt-1">{item.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 mt-8 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          <p className="font-medium mb-2">System Status</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Engine</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>SNI Compliance</span>
              <span className="text-green-400">Current</span>
            </div>
            <div className="flex justify-between">
              <span>License</span>
              <span className="text-blue-400">Professional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSidebar;