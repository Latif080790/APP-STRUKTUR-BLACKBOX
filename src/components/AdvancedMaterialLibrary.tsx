/**
 * Advanced Material Library
 * Comprehensive material database with properties, testing data, and optimization
 * Supports multiple standards (AISC, ACI, Eurocode, etc.)
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, BookOpen, Beaker, Target, Settings, Database, Layers } from 'lucide-react';
import { apiService } from '../services/apiService';

interface MaterialProperty {
  name: string;
  value: number;
  unit: string;
  tolerance: number;
  testMethod: string;
  standard: string;
}

interface Material {
  id: string;
  name: string;
  category: 'concrete' | 'steel' | 'timber' | 'masonry' | 'composite' | 'aluminum';
  grade: string;
  standard: string;
  properties: MaterialProperty[];
  testData: TestResult[];
  applications: string[];
  availabilityRegions: string[];
  costPerUnit: number;
  sustainabilityScore: number;
  carbonFootprint: number;
  recyclability: number;
  description: string;
  supplier?: string;
  certifications: string[];
}

interface TestResult {
  testType: string;
  date: Date;
  result: number;
  unit: string;
  standard: string;
  status: 'pass' | 'fail' | 'pending';
}

export const AdvancedMaterialLibrary: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Initialize material database from API
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await apiService.materials.getAll();
        if (response.success) {
          setMaterials(response.data);
          setFilteredMaterials(response.data);
          console.log('🧱 Materials loaded from API:', response.data);
        }
      } catch (error) {
        console.error('❌ Failed to load materials:', error);
        
        // Fallback to sample data if API fails
        const sampleMaterials: Material[] = [
          {
            id: 'concrete-c40',
            name: 'High Strength Concrete',
            category: 'concrete',
            grade: 'C40/50',
            standard: 'EN 206',
            properties: [
              { name: 'Compressive Strength', value: 40, unit: 'MPa', tolerance: 2, testMethod: 'Cylinder Test', standard: 'EN 12390-3' },
              { name: 'Tensile Strength', value: 3.5, unit: 'MPa', tolerance: 0.3, testMethod: 'Split Test', standard: 'EN 12390-6' },
              { name: 'Elastic Modulus', value: 34000, unit: 'MPa', tolerance: 1000, testMethod: 'Static Load', standard: 'EN 12390-13' },
              { name: 'Density', value: 2400, unit: 'kg/m³', tolerance: 50, testMethod: 'Density Test', standard: 'EN 12390-7' }
            ],
            testData: [
              { testType: 'Compressive Strength', date: new Date('2024-01-15'), result: 42.3, unit: 'MPa', standard: 'EN 12390-3', status: 'pass' },
              { testType: 'Tensile Strength', date: new Date('2024-01-15'), result: 3.7, unit: 'MPa', standard: 'EN 12390-6', status: 'pass' }
            ],
            applications: ['High-rise buildings', 'Bridges', 'Industrial structures', 'Precast elements'],
            availabilityRegions: ['Indonesia', 'Southeast Asia', 'Global'],
            costPerUnit: 120,
            sustainabilityScore: 7.5,
            carbonFootprint: 380,
            recyclability: 6.5,
            description: 'High-performance concrete suitable for heavy-duty structural applications with excellent durability.',
            supplier: 'Holcim Indonesia',
            certifications: ['SNI 2847', 'EN 206', 'ASTM C150']
          }
        ];
        
        setMaterials(sampleMaterials);
        setFilteredMaterials(sampleMaterials);
      }
    };

    loadMaterials();
  }, []);

  // Filter materials based on category and search
  useEffect(() => {
    let filtered = materials;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.standard.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  }, [materials, selectedCategory, searchQuery]);

  const MaterialCard: React.FC<{ material: Material }> = ({ material }) => (
    <div 
      onClick={() => setSelectedMaterial(material)}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all cursor-pointer hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{material.name}</h3>
          <p className="text-blue-200 text-sm">{material.grade} - {material.standard}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          material.category === 'concrete' ? 'bg-gray-500/20 text-gray-300' :
          material.category === 'steel' ? 'bg-blue-500/20 text-blue-300' :
          material.category === 'timber' ? 'bg-green-500/20 text-green-300' :
          material.category === 'aluminum' ? 'bg-silver-500/20 text-silver-300' :
          material.category === 'composite' ? 'bg-purple-500/20 text-purple-300' :
          'bg-orange-500/20 text-orange-300'
        }`}>
          {material.category.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-blue-200 text-xs">Primary Strength</p>
          <p className="text-white font-medium">{material.properties[0]?.value} {material.properties[0]?.unit}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs">Cost per Unit</p>
          <p className="text-white font-medium">${material.costPerUnit}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xs text-blue-200">Sustainability</p>
            <p className="text-sm font-medium text-green-300">{material.sustainabilityScore}/10</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-blue-200">Recyclability</p>
            <p className="text-sm font-medium text-blue-300">{material.recyclability}/10</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {material.certifications.slice(0, 2).map((cert, index) => (
            <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
              {cert}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const MaterialDetailModal: React.FC<{ material: Material; onClose: () => void }> = ({ material, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{material.name}</h2>
              <p className="text-blue-200">{material.grade} - {material.standard}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Plus className="w-5 h-5 text-white rotate-45" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-blue-200">{material.description}</p>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Material Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {material.properties.map((prop, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{prop.name}</h4>
                    <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                      {prop.standard}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-300 mb-1">
                    {prop.value} {prop.unit}
                  </p>
                  <p className="text-xs text-blue-200">
                    Tolerance: ±{prop.tolerance} {prop.unit} | Test: {prop.testMethod}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Test Results */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Recent Test Results</h3>
            <div className="space-y-3">
              {material.testData.map((test, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-white">{test.testType}</h4>
                    <p className="text-blue-200 text-sm">{test.date.toLocaleDateString()} - {test.standard}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{test.result} {test.unit}</p>
                    <span className={`px-2 py-1 text-xs rounded ${
                      test.status === 'pass' ? 'bg-green-500/20 text-green-300' :
                      test.status === 'fail' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {test.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainability Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Sustainability Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 text-center">
                <h4 className="font-medium text-green-300 mb-2">Sustainability Score</h4>
                <p className="text-3xl font-bold text-green-400">{material.sustainabilityScore}/10</p>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                <h4 className="font-medium text-blue-300 mb-2">Carbon Footprint</h4>
                <p className="text-3xl font-bold text-blue-400">{material.carbonFootprint}</p>
                <p className="text-xs text-blue-200">kg CO₂/m³</p>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                <h4 className="font-medium text-purple-300 mb-2">Recyclability</h4>
                <p className="text-3xl font-bold text-purple-400">{material.recyclability}/10</p>
              </div>
            </div>
          </div>

          {/* Applications & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Applications</h3>
              <div className="space-y-2">
                {material.applications.map((app, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <p className="text-blue-200">{app}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Availability</h3>
              <div className="space-y-2">
                {material.availabilityRegions.map((region, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <p className="text-blue-200">{region}</p>
                  </div>
                ))}
              </div>
              {material.supplier && (
                <div className="mt-4 bg-blue-500/10 rounded-lg p-3">
                  <p className="text-blue-300 font-medium">Supplier: {material.supplier}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Advanced Material Library</h1>
              <p className="text-blue-200">Comprehensive database of structural materials with testing data & certifications</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Dashboard
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                <Plus className="w-4 h-4 mr-2 inline" />
                Add Material
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Categories</option>
                <option value="concrete">Concrete</option>
                <option value="steel">Steel</option>
                <option value="timber">Timber</option>
                <option value="aluminum">Aluminum</option>
                <option value="composite">Composite</option>
                <option value="masonry">Masonry</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Advanced Filter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Material Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Library Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">{materials.length}</p>
              <p className="text-blue-200 text-sm">Total Materials</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{materials.filter(m => m.sustainabilityScore >= 8).length}</p>
              <p className="text-blue-200 text-sm">Sustainable Options</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">{materials.filter(m => m.testData.length > 0).length}</p>
              <p className="text-blue-200 text-sm">Tested Materials</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">{new Set(materials.map(m => m.standard)).size}</p>
              <p className="text-blue-200 text-sm">Standards Covered</p>
            </div>
          </div>
        </div>

        {/* Material Detail Modal */}
        {selectedMaterial && (
          <MaterialDetailModal 
            material={selectedMaterial} 
            onClose={() => setSelectedMaterial(null)} 
          />
        )}

      </div>
    </div>
  );
};

export default AdvancedMaterialLibrary;