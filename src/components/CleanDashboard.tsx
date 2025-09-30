/**
 * Clean Modern Dashboard Component
 * Terinspirasi dari platform analisis struktur profesional
 * Fitur: UI Bersih, Navigasi Intuitif, Visualisasi Modern
 */

import React, { useState, useEffect } from 'react';
import { 
  Home,
  Building2,
  Box,
  FileText,
  Settings,
  Search,
  Bell,
  User,
  BarChart3,
  Activity,
  Layers,
  Target,
  Calculator,
  Database,
  Eye,
  Zap,
  ArrowRight,
  Plus,
  Filter,
  Download,
  Upload,
  Play,
  Maximize2,
  Grid3X3,
  Calendar,
  Clock,
  ChevronRight,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Brain,
  TrendingUp,
  BookOpen
} from 'lucide-react';

import { theme } from '../styles/theme';

interface CleanDashboardProps {
  onNavigate: (view: string) => void;
}

// Komponen Sidebar Modern yang Minimalis
const ModernSidebar: React.FC<{ currentView: string; onNavigate: (view: string) => void }> = ({ 
  currentView, 
  onNavigate 
}) => {
  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Beranda', active: currentView === 'dashboard' },
    { id: 'structural-analysis', icon: Building2, label: 'Analisis', active: currentView === 'structural-analysis' },
    { id: '3d-viewer', icon: Box, label: 'Viewer 3D', active: false },
    { id: 'calculator', icon: Calculator, label: 'Kalkulator', active: false },
    { id: 'reports', icon: FileText, label: 'Laporan', active: false },
    { id: 'settings', icon: Settings, label: 'Pengaturan', active: false }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-gray-900 flex flex-col items-center py-6 z-50 shadow-2xl">
      {/* Logo dengan Gradient */}
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-8 shadow-lg">
        <Building2 className="w-6 h-6 text-white" />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-3">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative group
                ${item.active 
                  ? 'bg-white text-gray-900 shadow-lg scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800 hover:scale-105'
                }
              `}
              title={item.label}
            >
              <IconComponent className="w-5 h-5" />
              {/* Tooltip */}
              <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="mt-auto">
        <button className="w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-200 hover:scale-105 group">
          <User className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

// Komponen Card untuk Analysis Modules
const AnalysisModuleCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  onClick: () => void;
}> = ({ title, icon, color, description, onClick }) => (
  <button
    onClick={onClick}
    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 text-left w-full hover:scale-105"
  >
    <div className="flex items-center justify-between mb-4">
      <div 
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md ${color}`}
      >
        {icon}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 group-hover:text-gray-600">{description}</p>
    )}
  </button>
);

// Komponen Project Preview
const ProjectPreview: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Preview Proyek</h2>
      <div className="flex space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
    
    {/* 3D Preview Area */}
    <div className="bg-gray-100 rounded-xl h-80 flex items-center justify-center mb-4 relative overflow-hidden">
      <div className="text-center">
        <Box className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Model Struktur 3D</p>
        <p className="text-sm text-gray-400 mt-1">Klik untuk memuat preview</p>
      </div>
      
      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Play className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Grid3X3 className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
    
    {/* Control Panel */}
    <div className="flex justify-center space-x-4">
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Layers className="w-4 h-4 text-gray-600" />
      </button>
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Target className="w-4 h-4 text-gray-600" />
      </button>
      <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
        <Eye className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  </div>
);

// Komponen Layer Control Panel
const LayerControlPanel: React.FC = () => {
  const [layers, setLayers] = useState([
    { name: 'Structural Steel', enabled: true, color: 'bg-green-500' },
    { name: 'Concrete Floors', enabled: false, color: 'bg-gray-400' },
    { name: 'HVAC System', enabled: false, color: 'bg-gray-400' },
    { name: 'Electrical', enabled: true, color: 'bg-green-500' }
  ]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Panel Kontrol Layer</h3>
      
      <div className="space-y-3">
        {layers.map((layer, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${layer.color}`}></div>
              <span className="text-sm font-medium text-gray-700">{layer.name}</span>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => {
                  const newLayers = [...layers];
                  newLayers[index].enabled = !newLayers[index].enabled;
                  newLayers[index].color = newLayers[index].enabled ? 'bg-green-500' : 'bg-gray-400';
                  setLayers(newLayers);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  layer.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  layer.enabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Komponen Material Properties
const MaterialProperties: React.FC = () => {
  const materials = [
    { name: 'Concrete', strength: '40 MPa', type: 'C40', color: 'bg-gray-100' },
    { name: 'Steel (A992)', strength: '345 MPa', type: 'ASTM A992', color: 'bg-blue-100' },
    { name: 'Glass U-Value', strength: '1.2 W/m²K', type: 'Thermal', color: 'bg-green-100' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Properti Material</h3>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-4">
        {materials.map((material, index) => (
          <div key={index} className={`p-4 rounded-xl ${material.color} border border-gray-200`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{material.name}</h4>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                {material.type}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Kekuatan = {material.strength}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
        + Tambah Material
      </button>
    </div>
  );
};

// Komponen Storage Capacity
const StorageCapacity: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Kapasitas Penyimpanan</h3>
      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors">
        Kirim File
      </button>
    </div>
    
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">87 / 512 GB</span>
        <span className="text-sm text-gray-500">2% tersisa</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-purple-500 h-3 rounded-full" style={{width: '85%'}}></div>
      </div>
    </div>
    
    {/* File Types */}
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">128 GB</div>
          <div className="text-xs text-gray-500">Dokumen • 1220 file</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">50 GB</div>
          <div className="text-xs text-gray-500">Video • Laporan</div>
        </div>
      </div>
    </div>
  </div>
);

// Komponen Project Timeline
const ProjectTimeline: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Proyek</h3>
    
    <div className="space-y-4">
      {/* Timeline Item 1 */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Project Initiated</span>
            <span className="text-xs text-gray-500">Selesai</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div className="bg-blue-500 h-1 rounded-full w-full"></div>
          </div>
        </div>
      </div>
      
      {/* Timeline Item 2 */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Design Phase</span>
            <span className="text-xs text-gray-500">Berlangsung</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div className="bg-yellow-500 h-1 rounded-full w-3/4"></div>
          </div>
        </div>
      </div>
      
      {/* Timeline Item 3 */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <Target className="w-4 h-4 text-gray-600" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Analysis Complete</span>
            <span className="text-xs text-gray-500">Menunggu</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div className="bg-gray-300 h-1 rounded-full w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
export const CleanDashboard: React.FC<CleanDashboardProps> = ({ onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const analysisModules = [
    {
      title: 'Smart Integration',
      icon: <Brain className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'AI + BIM + Advanced Analysis',
      route: 'smart-integration'
    },
    {
      title: 'Static Load',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Analisis beban statis',
      route: 'workspace'
    },
    {
      title: 'Dynamic',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'Analisis dinamik',
      route: 'workspace'
    },
    {
      title: 'Performance Analytics',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Real-time monitoring & insights',
      route: 'performance-analytics'
    },
    {
      title: 'Material Library',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-indigo-500',
      description: 'Advanced material database',
      route: 'material-library'
    },
    {
      title: 'Material Stress',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-red-500',
      description: 'Analisis tegangan material',
      route: 'workspace'
    },
    {
      title: 'Reports',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Laporan dan dokumentasi',
      route: 'structural-analysis'
    },
    {
      title: 'Documents',
      icon: <Database className="w-6 h-6" />,
      color: 'bg-teal-500',
      description: 'Manajemen dokumen',
      route: 'structural-analysis'
    },
    {
      title: 'Foundation Design',
      icon: <Building2 className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Desain fondasi',
      route: 'workspace'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ModernSidebar currentView="dashboard" onNavigate={onNavigate} />
      
      {/* Main Content */}
      <div className="ml-20 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Structural Hub</h1>
            <p className="text-gray-600 mt-1">Platform analisis struktur terpadu</p>
          </div>
          
          {/* Search dan Notifikasi */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Preview */}
          <div className="lg:col-span-1">
            <ProjectPreview />
          </div>
          
          {/* Middle Column - Analysis Modules */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Modul Analisis</h2>
              <div className="grid grid-cols-2 gap-4">
                {analysisModules.map((module, index) => (
                  <AnalysisModuleCard
                    key={index}
                    title={module.title}
                    icon={module.icon}
                    color={module.color}
                    description={module.description}
                    onClick={() => onNavigate(module.route || 'structural-analysis')}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Controls dan Info */}
          <div className="lg:col-span-1 space-y-6">
            <LayerControlPanel />
            <MaterialProperties />
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <StorageCapacity />
          <ProjectTimeline />
        </div>
      </div>
    </div>
  );
};