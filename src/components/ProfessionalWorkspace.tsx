/**
 * Professional Workspace Component
 * Layout workspace yang mirip dengan contoh dashboard profesional
 * Mengintegrasikan semua komponen untuk pengalaman yang seamless
 */

import React, { useState } from 'react';
import { 
  Home,
  Building2,
  Box,
  Settings,
  FileText,
  Calculator,
  User,
  Search,
  Bell,
  Maximize2,
  RotateCcw,
  Play,
  Pause,
  Grid3X3,
  Layers,
  Eye,
  EyeOff,
  Download,
  Upload,
  Share2,
  Bookmark
} from 'lucide-react';

import { CalculationParametersPanel } from './CalculationParametersPanel';
import { theme } from '../styles/theme';

interface ProfessionalWorkspaceProps {
  onNavigate: (view: string) => void;
}

// Komponen Sidebar Minimal dan Elegant
const MinimalSidebar: React.FC<{ 
  currentView: string; 
  onNavigate: (view: string) => void; 
}> = ({ currentView, onNavigate }) => {
  const sidebarItems = [
    { id: 'home', icon: Home, active: currentView === 'home' },
    { id: 'analysis', icon: Building2, active: currentView === 'analysis' },
    { id: '3d', icon: Box, active: false },
    { id: 'calculator', icon: Calculator, active: false },
    { id: 'reports', icon: FileText, active: false },
    { id: 'settings', icon: Settings, active: false }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-gray-900 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-8">
        <Building2 className="w-6 h-6 text-white" />
      </div>

      {/* Navigation */}
      <div className="flex flex-col space-y-4">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                ${item.active 
                  ? 'bg-white text-gray-900 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="mt-auto">
        <button className="w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
          <User className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

// Komponen Header dengan Search dan Controls
const WorkspaceHeader: React.FC<{
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}> = ({ title, searchQuery, onSearchChange }) => (
  <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    
    <div className="flex items-center space-x-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Download className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Share2 className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);

// Komponen 3D Viewer Area
const StructuralViewer3D: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('3d');

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Viewer Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Deformasi Struktur 3D</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 3D Viewer */}
      <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Placeholder untuk 3D Model */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Box className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Model Struktur 3D</p>
            <p className="text-sm text-gray-400 mt-1">Visualisasi deformasi dan stress</p>
          </div>
        </div>
        
        {/* Color Scale */}
        <div className="absolute right-4 top-4 bg-white rounded-lg p-3 shadow-md">
          <div className="text-xs font-medium text-gray-700 mb-2">Stress (Pa)</div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-600">Max</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 bg-yellow-500 rounded"></div>
              <span className="text-xs text-gray-600">Med</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-2 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Min</span>
            </div>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            onClick={() => setViewMode('3d')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === '3d' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Box className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen Layer Control mirip dengan contoh
const LayerControlPanel: React.FC = () => {
  const [layers, setLayers] = useState([
    { name: 'Structural Steel', enabled: true, icon: Building2, color: 'text-green-500' },
    { name: 'Concrete Floors', enabled: false, icon: Layers, color: 'text-gray-400' },
    { name: 'HVAC System', enabled: false, icon: Box, color: 'text-gray-400' },
    { name: 'Electrical', enabled: true, icon: Building2, color: 'text-green-500' }
  ]);

  const toggleLayer = (index: number) => {
    const newLayers = [...layers];
    newLayers[index].enabled = !newLayers[index].enabled;
    newLayers[index].color = newLayers[index].enabled ? 'text-green-500' : 'text-gray-400';
    setLayers(newLayers);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Panel Kontrol Layer</h3>
      
      <div className="space-y-3">
        {layers.map((layer, index) => {
          const IconComponent = layer.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <IconComponent className={`w-5 h-5 ${layer.color}`} />
                <span className="text-sm font-medium text-gray-700">{layer.name}</span>
              </div>
              <button 
                onClick={() => toggleLayer(index)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  layer.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  layer.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Professional Workspace Component
export const ProfessionalWorkspace: React.FC<ProfessionalWorkspaceProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState('analysis');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <MinimalSidebar currentView={currentView} onNavigate={(view) => {
        setCurrentView(view);
        if (view === 'home') {
          onNavigate('dashboard');
        } else {
          onNavigate(view);
        }
      }} />
      
      {/* Main Content */}
      <div className="ml-20">
        {/* Header */}
        <WorkspaceHeader 
          title="mota.io"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Content Grid */}
        <div className="p-6 grid grid-cols-12 gap-6">
          {/* Left Panel - Calculation Parameters */}
          <div className="col-span-3">
            <CalculationParametersPanel />
          </div>
          
          {/* Center Panel - 3D Viewer */}
          <div className="col-span-6">
            <StructuralViewer3D />
            
            {/* Additional Info Cards */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Status Analisis</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Perhitungan selesai</span>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Akurasi Model</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '94%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">94%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Layer Control */}
          <div className="col-span-3">
            <LayerControlPanel />
            
            {/* Material Properties Card */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Properti Material</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Concrete</span>
                  <span className="text-sm text-gray-600">C40 • 40 MPa</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Steel (A992)</span>
                  <span className="text-sm text-gray-600">345 MPa</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Glass U-Value</span>
                  <span className="text-sm text-gray-600">1.2 W/m²K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};