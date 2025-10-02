/**
 * Enhanced Material Properties Manager - Comprehensive SNI Standards
 * Features: Scrollable interface, SNI compliance, enhanced material database
 */
import React, { useState, useEffect } from 'react';
import {
  Database, Search, Filter, CheckCircle, AlertTriangle, 
  Info, Download, Upload, Settings, BookOpen, Layers,
  ArrowUp, ArrowDown, MoreHorizontal, Eye, Edit3
} from 'lucide-react';

// Enhanced Material Properties with SNI Standards
interface EnhancedMaterial {
  id: string;
  category: 'concrete' | 'steel' | 'reinforcement' | 'composite';
  name: string;
  grade: string;
  properties: {
    fc?: number; // Concrete compressive strength
    fy?: number; // Steel yield strength
    fu?: number; // Steel ultimate strength
    density: number;
    elasticModulus: number;
    poissonRatio: number;
    thermalExpansion: number;
    thermalConductivity: number;
    specificHeat: number;
  };
  sniStandard: string;
  applications: string[];
  description: string;
  compliance: {
    verified: boolean;
    certificationDate?: string;
    certifyingBody?: string;
  };
  cost?: {
    pricePerUnit: number;
    unit: string;
    supplier?: string;
  };
}

const enhancedMaterialDatabase: EnhancedMaterial[] = [
  // Concrete Materials - SNI 2847:2019
  {
    id: 'concrete-k20',
    category: 'concrete',
    name: 'Concrete K-20',
    grade: 'K-20',
    properties: {
      fc: 20,
      density: 2400,
      elasticModulus: 21019,
      poissonRatio: 0.2,
      thermalExpansion: 10e-6,
      thermalConductivity: 1.4,
      specificHeat: 880
    },
    sniStandard: 'SNI 2847:2019',
    applications: ['Non-structural elements', 'Foundation footings', 'Mass concrete'],
    description: 'Low strength concrete for non-critical applications',
    compliance: { verified: true, certificationDate: '2023-01-15', certifyingBody: 'BSN' }
  },
  {
    id: 'concrete-k25',
    category: 'concrete',
    name: 'Concrete K-25',
    grade: 'K-25',
    properties: {
      fc: 25,
      density: 2400,
      elasticModulus: 23452,
      poissonRatio: 0.2,
      thermalExpansion: 10e-6,
      thermalConductivity: 1.4,
      specificHeat: 880
    },
    sniStandard: 'SNI 2847:2019',
    applications: ['Residential buildings', 'Light commercial', 'General construction'],
    description: 'Standard concrete grade for general construction',
    compliance: { verified: true, certificationDate: '2023-01-15', certifyingBody: 'BSN' }
  },
  {
    id: 'concrete-k30',
    category: 'concrete',
    name: 'Concrete K-30',
    grade: 'K-30',
    properties: {
      fc: 30,
      density: 2400,
      elasticModulus: 25742,
      poissonRatio: 0.2,
      thermalExpansion: 10e-6,
      thermalConductivity: 1.4,
      specificHeat: 880
    },
    sniStandard: 'SNI 2847:2019',
    applications: ['Commercial buildings', 'Institutional', 'Multi-story'],
    description: 'Medium strength concrete for typical building construction',
    compliance: { verified: true, certificationDate: '2023-01-15', certifyingBody: 'BSN' }
  },
  {
    id: 'concrete-k35',
    category: 'concrete',
    name: 'Concrete K-35',
    grade: 'K-35',
    properties: {
      fc: 35,
      density: 2400,
      elasticModulus: 27805,
      poissonRatio: 0.2,
      thermalExpansion: 10e-6,
      thermalConductivity: 1.4,
      specificHeat: 880
    },
    sniStandard: 'SNI 2847:2019',
    applications: ['High-rise buildings', 'Industrial structures', 'Heavy loads'],
    description: 'High strength concrete for demanding applications',
    compliance: { verified: true, certificationDate: '2023-01-15', certifyingBody: 'BSN' }
  },
  // Steel Materials - SNI 1729:2020
  {
    id: 'steel-bj37',
    category: 'steel',
    name: 'Steel BJ-37',
    grade: 'BJ-37',
    properties: {
      fy: 240,
      fu: 370,
      density: 7850,
      elasticModulus: 200000,
      poissonRatio: 0.3,
      thermalExpansion: 12e-6,
      thermalConductivity: 50,
      specificHeat: 460
    },
    sniStandard: 'SNI 1729:2020',
    applications: ['General construction', 'Building frames', 'Secondary members'],
    description: 'Standard structural steel for general applications',
    compliance: { verified: true, certificationDate: '2023-02-10', certifyingBody: 'BSN' }
  },
  {
    id: 'steel-bj50',
    category: 'steel',
    name: 'Steel BJ-50',
    grade: 'BJ-50',
    properties: {
      fy: 410,
      fu: 550,
      density: 7850,
      elasticModulus: 200000,
      poissonRatio: 0.3,
      thermalExpansion: 12e-6,
      thermalConductivity: 50,
      specificHeat: 460
    },
    sniStandard: 'SNI 1729:2020',
    applications: ['High-rise buildings', 'Heavy construction', 'Long spans'],
    description: 'High strength steel for demanding structural applications',
    compliance: { verified: true, certificationDate: '2023-02-10', certifyingBody: 'BSN' }
  },
  // Reinforcement Steel
  {
    id: 'rebar-bjts40',
    category: 'reinforcement',
    name: 'Rebar BJTS-40',
    grade: 'BJTS-40',
    properties: {
      fy: 400,
      fu: 600,
      density: 7850,
      elasticModulus: 200000,
      poissonRatio: 0.3,
      thermalExpansion: 12e-6,
      thermalConductivity: 50,
      specificHeat: 460
    },
    sniStandard: 'SNI 2847:2019',
    applications: ['Concrete reinforcement', 'Structural elements', 'Main reinforcement'],
    description: 'Deformed reinforcing bars for concrete structures',
    compliance: { verified: true, certificationDate: '2023-01-20', certifyingBody: 'BSN' }
  }
];

interface EnhancedMaterialPropertiesManagerProps {
  selectedMaterials: string[];
  onMaterialSelect: (materialIds: string[]) => void;
  onClose: () => void;
}

const EnhancedMaterialPropertiesManager: React.FC<EnhancedMaterialPropertiesManagerProps> = ({
  selectedMaterials,
  onMaterialSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'strength'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedMaterial, setSelectedMaterial] = useState<EnhancedMaterial | null>(null);

  // Filter and sort materials
  const filteredMaterials = enhancedMaterialDatabase
    .filter(material => {
      const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.applications.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || material.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'grade') {
        comparison = a.grade.localeCompare(b.grade);
      } else if (sortBy === 'strength') {
        const aStrength = a.properties.fc || a.properties.fy || 0;
        const bStrength = b.properties.fc || b.properties.fy || 0;
        comparison = aStrength - bStrength;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleMaterialToggle = (materialId: string) => {
    const newSelection = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter(id => id !== materialId)
      : [...selectedMaterials, materialId];
    onMaterialSelect(newSelection);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-6xl h-[90%] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enhanced Material Properties</h2>
              <p className="text-sm text-gray-600">SNI-compliant materials database</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search materials, grades, applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="concrete">Concrete</option>
              <option value="steel">Steel</option>
              <option value="reinforcement">Reinforcement</option>
              <option value="composite">Composite</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="grade">Sort by Grade</option>
              <option value="strength">Sort by Strength</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Materials List - Scrollable */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="grid gap-4">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className={`border rounded-xl p-4 transition-all hover:shadow-md cursor-pointer ${
                      selectedMaterials.includes(material.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          material.category === 'concrete' ? 'bg-gray-100' :
                          material.category === 'steel' ? 'bg-blue-100' :
                          material.category === 'reinforcement' ? 'bg-orange-100' :
                          'bg-green-100'
                        }`}>
                          <Layers className={`w-5 h-5 ${
                            material.category === 'concrete' ? 'text-gray-600' :
                            material.category === 'steel' ? 'text-blue-600' :
                            material.category === 'reinforcement' ? 'text-orange-600' :
                            'text-green-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{material.name}</h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {material.grade}
                            </span>
                            {material.compliance.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{material.sniStandard}</span>
                            </span>
                            {material.properties.fc && (
                              <span>fc' = {material.properties.fc} MPa</span>
                            )}
                            {material.properties.fy && (
                              <span>fy = {material.properties.fy} MPa</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-2">
                            {material.applications.slice(0, 3).map((app, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {app}
                              </span>
                            ))}
                            {material.applications.length > 3 && (
                              <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
                                +{material.applications.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMaterialToggle(material.id);
                          }}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            selectedMaterials.includes(material.id)
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {selectedMaterials.includes(material.id) ? 'Selected' : 'Select'}
                        </button>
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material Details Panel */}
          {selectedMaterial && (
            <div className="w-96 border-l border-gray-200 bg-gray-50 overflow-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Properties</h3>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedMaterial.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Grade:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedMaterial.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">{selectedMaterial.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Standard:</span>
                        <span className="text-sm font-medium text-blue-600">{selectedMaterial.sniStandard}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mechanical Properties */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Mechanical Properties</h4>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      {selectedMaterial.properties.fc && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Compressive Strength (fc'):</span>
                          <span className="text-sm font-medium text-gray-900">{selectedMaterial.properties.fc} MPa</span>
                        </div>
                      )}
                      {selectedMaterial.properties.fy && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Yield Strength (fy):</span>
                          <span className="text-sm font-medium text-gray-900">{selectedMaterial.properties.fy} MPa</span>
                        </div>
                      )}
                      {selectedMaterial.properties.fu && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Ultimate Strength (fu):</span>
                          <span className="text-sm font-medium text-gray-900">{selectedMaterial.properties.fu} MPa</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Elastic Modulus (E):</span>
                        <span className="text-sm font-medium text-gray-900">{selectedMaterial.properties.elasticModulus.toLocaleString()} MPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Density:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedMaterial.properties.density} kg/m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Poisson's Ratio:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedMaterial.properties.poissonRatio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">SNI Compliance</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Verified</span>
                      </div>
                      {selectedMaterial.compliance.certificationDate && (
                        <p className="text-xs text-gray-600">
                          Certified: {selectedMaterial.compliance.certificationDate} by {selectedMaterial.compliance.certifyingBody}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Typical Applications</h4>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex flex-wrap gap-2">
                        {selectedMaterial.applications.map((app, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedMaterials.length} material(s) selected from {filteredMaterials.length} available
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Selection ({selectedMaterials.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMaterialPropertiesManager;