/**
 * Professional Structural Analysis Dashboard
 * Redesigned sesuai standar aplikasi structural analysis modern
 * Compliant dengan SNI 1726, 1727, 2847, 1729
 */

import React, { useState } from 'react';
import { 
  Home, Building2, Box, FileText, Settings, Calculator, Database, Eye,
  Layers, Target, Activity, Zap, Maximize2, RotateCcw, ZoomIn, ZoomOut, Move,
  CheckCircle, Square, Triangle, User, Ruler, Calendar, Search
} from 'lucide-react';

interface ProfessionalDashboardProps {
  onNavigate: (view: string) => void;
}

// Professional Sidebar
const ProfessionalSidebar: React.FC<{ currentView: string; onNavigate: (view: string) => void }> = ({ 
  currentView, onNavigate 
}) => {
  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Beranda' },
    { id: '3d-viewer', icon: Box, label: '3D Viewer' },
    { id: 'analysis', icon: Calculator, label: 'Analisis' },
    { id: 'materials', icon: Database, label: 'Material' },
    { id: 'reports', icon: FileText, label: 'Laporan' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-gray-900 flex flex-col items-center py-4 z-50 shadow-2xl">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
        <Building2 className="w-5 h-5 text-white" />
      </div>

      <div className="flex flex-col space-y-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all group ${
                currentView === item.id ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <IconComponent className="w-4 h-4" />
              <div className="absolute left-14 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <button className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
          <User className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// 3D Viewer with Structural Deformation
const Professional3DViewer: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Box className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">3D Structural Deformation</h3>
            <p className="text-sm text-gray-500">Interactive structural model</p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="relative h-96 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800">
        {/* Building Structure */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative transform rotate-12 scale-90">
            <div className="w-48 h-32 bg-gray-300 border-2 border-gray-400"></div>
            
            {Array.from({ length: 10 }, (_, floor) => {
              const colors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-orange-200', 'bg-red-200'];
              const colorIndex = Math.floor(floor / 2) % colors.length;
              return (
                <div key={floor} className="relative" style={{ transform: `translateY(-${floor * 12}px)` }}>
                  <div className={`w-48 h-32 ${colors[colorIndex]} border border-gray-400 opacity-80`}>
                    <div className="absolute top-0 left-4 w-2 h-12 bg-red-600"></div>
                    <div className="absolute top-0 right-4 w-2 h-12 bg-red-600"></div>
                    <div className="absolute top-0 left-1/2 w-2 h-12 bg-red-600 transform -translate-x-1/2"></div>
                    <div className="absolute top-6 left-0 w-full h-1 bg-blue-800"></div>
                  </div>
                </div>
              );
            })}
            
            <div className="absolute top-0 right-0 w-32 h-4">
              <div className="w-full h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded opacity-75"></div>
              <div className="text-xs text-white mt-1 text-center">Stress Range</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {[RotateCcw, ZoomIn, ZoomOut, Move].map((Icon, index) => (
            <button key={index} className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white">
              <Icon className="w-4 h-4 text-gray-600" />
            </button>
          ))}
        </div>
        
        <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Ruler className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">Scale 1:200</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculation Parameters Panel
const CalculationParametersPanel: React.FC = () => {
  const [calculationMode, setCalculationMode] = useState<'static' | 'dynamic' | 'seismic'>('static');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Calculation Parameters</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'static', label: 'Static Load', icon: Target },
            { id: 'dynamic', label: 'Dynamic', icon: Activity },
            { id: 'seismic', label: 'Seismic', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCalculationMode(id as any)}
              className={`p-3 rounded-lg border transition-colors text-sm ${
                calculationMode === id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Material Properties</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Young Modulus</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Boundary conditions</label>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium">854.933 kN</div>
            <div className="text-xs text-gray-500">Fixed responses</div>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setIsAnalyzing(!isAnalyzing)}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isAnalyzing
            ? 'bg-gray-100 text-gray-400'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
      </button>
    </div>
  );
};

// Main Dashboard Component
const ProfessionalStructuralDashboard: React.FC<ProfessionalDashboardProps> = ({ onNavigate }) => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      <ProfessionalSidebar currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Main Content */}
      <div className="ml-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Structural Hub</h1>
              <p className="text-sm text-gray-500">Professional structural analysis platform</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-2.5">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left: 3D Viewer */}
            <div className="lg:col-span-2">
              <Professional3DViewer />
            </div>
            
            {/* Right: Controls */}
            <div>
              <CalculationParametersPanel />
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Preview</h3>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Building Model</p>
                </div>
              </div>
            </div>
            
            {/* Analysis Modules */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Modules</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Static Load', color: 'bg-blue-500' },
                  { label: 'Dynamic', color: 'bg-green-500' },
                  { label: 'Material Stress', color: 'bg-orange-500' },
                  { label: 'Reports', color: 'bg-purple-500' }
                ].map((module, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50">
                    <div className={`w-8 h-8 ${module.color} rounded mx-auto mb-2`}></div>
                    <p className="text-sm font-medium text-gray-700">{module.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalStructuralDashboard;