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
  Plus, Edit3, Trash2, Save, X, Check, AlertCircle,
  Filter, Download, Upload, Play, Maximize2, Grid3X3,
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
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: currentView === 'dashboard' },
    { id: 'structural-analysis', icon: Building2, label: 'Analysis', active: currentView === 'structural-analysis' },
    { id: '3d-viewer', icon: Box, label: '3D Viewer', active: false },
    { id: 'calculator', icon: Calculator, label: 'Calculator', active: false },
    { id: 'reports', icon: FileText, label: 'Reports', active: false },
    { id: 'settings', icon: Settings, label: 'Settings', active: false }
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
      <h2 className="text-xl font-semibold text-gray-900">Project Preview</h2>
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
        <p className="text-gray-500 font-medium">3D Structural Model</p>
        <p className="text-sm text-gray-400 mt-1">Click to load preview</p>
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Control Panel</h3>
      
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

// Enhanced Material Properties with real functionality
const MaterialProperties: React.FC = () => {
  const [materials, setMaterials] = useState([
    { id: 1, name: 'Concrete C30/37', strength: '30 MPa', type: 'SNI-2847', color: 'bg-gray-100', density: 2400, elasticModulus: 30000 },
    { id: 2, name: 'Steel BJ-50', strength: '290 MPa', type: 'SNI-1729', color: 'bg-blue-100', density: 7850, elasticModulus: 200000 },
    { id: 3, name: 'Timber Class II', strength: '40 MPa', type: 'SNI-7973', color: 'bg-green-100', density: 600, elasticModulus: 12000 }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleMaterialEdit = (material: any) => {
    setSelectedMaterial(material);
    setIsEditing(true);
  };

  const handleMaterialSave = (updatedMaterial: any) => {
    setMaterials(prev => 
      prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m)
    );
    setIsEditing(false);
    setSelectedMaterial(null);
  };

  const handleAddMaterial = () => {
    const newMaterial = {
      id: materials.length + 1,
      name: 'New Material',
      strength: '25 MPa',
      type: 'Custom',
      color: 'bg-purple-100',
      density: 2000,
      elasticModulus: 20000
    };
    setMaterials(prev => [...prev, newMaterial]);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Material Properties</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-green-600"
            title="Add Material"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.id} className={`p-4 rounded-xl ${material.color} border border-gray-200 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{material.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md">
                  {material.type}
                </span>
                <button
                  onClick={() => handleMaterialEdit(material)}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Strength: {material.strength}</div>
              <div>Density: {material.density} kg/m³</div>
              <div>E: {material.elasticModulus} MPa</div>
              <div className="text-green-600 font-medium">✓ Active</div>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleAddMaterial}
        className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
      >
        + Add New Material
      </button>

      {/* Material Edit Modal */}
      {isEditing && selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Material</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedMaterial.name}
                  onChange={(e) => setSelectedMaterial({...selectedMaterial, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                <input
                  type="text"
                  value={selectedMaterial.strength}
                  onChange={(e) => setSelectedMaterial({...selectedMaterial, strength: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleMaterialSave(selectedMaterial)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Komponen Storage Capacity
const StorageCapacity: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Storage Capacity</h3>
      <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors">
        Upload File
      </button>
    </div>
    
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">87 / 512 GB</span>
        <span className="text-sm text-gray-500">2% remaining</span>
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
          <div className="text-xs text-gray-500">Documents • 1220 files</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900">50 GB</div>
          <div className="text-xs text-gray-500">Video • Reports</div>
        </div>
      </div>
    </div>
  </div>
);

// Komponen Project Timeline
const ProjectTimeline: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h3>
    
    <div className="space-y-4">
      {/* Timeline Item 1 */}
      <div className="flex items-center">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Project Initiated</span>
            <span className="text-xs text-gray-500">Complete</span>
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
            <span className="text-xs text-gray-500">In Progress</span>
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
            <span className="text-xs text-gray-500">Pending</span>
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
            <p className="text-gray-600 mt-1">Integrated structural analysis platform</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Modules</h2>
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

export default CleanDashboard;