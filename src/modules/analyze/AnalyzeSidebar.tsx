/**
 * Analyze Structure Sidebar - Navigation for all analysis types
 * Implements separate submenus per project specification
 */

import React from 'react';
import {
  Target, Activity, BarChart3, TrendingUp, Zap, Wind, 
  Layers, FileText, Play, Settings
} from 'lucide-react';

interface AnalyzeSidebarProps {
  currentAnalysisType: string;
  onAnalysisTypeChange: (type: string) => void;
}

const AnalyzeSidebar: React.FC<AnalyzeSidebarProps> = ({
  currentAnalysisType,
  onAnalysisTypeChange
}) => {
  // Analysis Types Section
  const analysisTypes = [
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
    }
  ];

  // Separate Submenus as per project specification
  const separateSubmenus = [
    {
      id: 'load-combinations',
      name: 'Load Combinations',
      icon: Layers,
      description: 'Manage load combinations per standards',
      category: 'Load Management'
    },
    {
      id: 'analysis-execution',
      name: 'Analysis Execution',
      icon: Play,
      description: 'Run and monitor analysis processes',
      category: 'Execution Control'
    },
    {
      id: 'analysis-reports',
      name: 'Analysis Reports',
      icon: FileText,
      description: 'Generate and view analysis reports',
      category: 'Results & Reports'
    }
  ];

  const renderMenuItem = (item: any, isSubmenu = false) => {
    const IconComponent = item.icon;
    const isActive = currentAnalysisType === item.id || (currentAnalysisType === '' && item.id === 'static');
    
    return (
      <button
        key={item.id}
        onClick={() => onAnalysisTypeChange(item.id)}
        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        } ${isSubmenu ? 'ml-2 border-l-2 border-slate-600' : ''}`}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-medium">{item.name}</p>
            <p className="text-xs opacity-75 mt-1">{item.description}</p>
            {item.category && (
              <p className="text-xs opacity-60 mt-1 italic">{item.category}</p>
            )}
          </div>
        </div>
      </button>
    );
  };

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

      {/* Analysis Types Section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
          Analysis Types
        </h3>
        <div className="space-y-2">
          {analysisTypes.map((item) => renderMenuItem(item))}
        </div>
      </div>

      {/* Separate Submenus Section */}
      <div className="p-4 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
          Analysis Workflow
        </h3>
        <div className="space-y-2">
          {separateSubmenus.map((item) => renderMenuItem(item, true))}
        </div>
      </div>

      {/* System Integration Status */}
      <div className="p-4 mt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          <p className="font-medium mb-2 flex items-center">
            <Settings className="w-3 h-3 mr-2" />
            System Status
          </p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Analysis Engine</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span>SNI Compliance</span>
              <span className="text-green-400">Current</span>
            </div>
            <div className="flex justify-between">
              <span>Professional Mode</span>
              <span className="text-blue-400">Enabled</span>
            </div>
            <div className="flex justify-between">
              <span>Workflow Integration</span>
              <span className="text-purple-400">Enhanced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSidebar;