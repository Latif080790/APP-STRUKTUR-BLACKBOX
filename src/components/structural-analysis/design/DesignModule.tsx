/**
 * Design Module Integration Component
 * Main interface for structural element design
 */

import React, { useState, useEffect } from 'react';
import StructuralDesignEngine, { DesignInput, DesignResults } from './StructuralDesignEngine';
import DesignResultsManager, { DesignSummary } from './DesignResultsManager';
import { DesignVisualization, DesignDashboard } from './DesignVisualization';

interface DesignModuleProps {
  analysisResults?: any; // Results from Analysis Module
  projectInfo?: {
    name: string;
    date: string;
    engineer: string;
    checker: string;
  };
}

interface ElementDesignForm {
  elementId: string;
  elementType: 'beam' | 'column' | 'slab';
  geometry: {
    width: number;
    height: number;
    length?: number;
    clearCover: number;
  };
  materials: {
    fc: number; // MPa
    fy: number; // MPa
    Es: number; // MPa
    Ec: number; // MPa
    beta1: number;
  };
  forces: {
    axial: number;
    shearX: number;
    shearY: number;
    momentX: number;
    momentY: number;
    momentZ: number;
  };
  constraints: {
    maxDeflection: number;
    maxCrackWidth: number;
    minReinforcement: number;
    maxReinforcement: number;
    fireRating: number;
  };
}

export const DesignModule: React.FC<DesignModuleProps> = ({ 
  analysisResults,
  projectInfo 
}) => {
  const [activeView, setActiveView] = useState<'form' | 'dashboard' | 'details'>('form');
  const [selectedElement, setSelectedElement] = useState<string>('');
  const [designManager] = useState(() => new DesignResultsManager(projectInfo));
  const [designSummary, setDesignSummary] = useState<DesignSummary | null>(null);
  const [currentResults, setCurrentResults] = useState<DesignResults | null>(null);
  const [isDesigning, setIsDesigning] = useState(false);

  // Default form values
  const [formData, setFormData] = useState<ElementDesignForm>({
    elementId: 'B-1',
    elementType: 'beam',
    geometry: {
      width: 300,
      height: 500,
      length: 6000,
      clearCover: 40
    },
    materials: {
      fc: 25, // K-300
      fy: 400, // BjTS 40
      Es: 200000,
      Ec: 23500,
      beta1: 0.85
    },
    forces: {
      axial: 0,
      shearX: 150, // kN
      shearY: 0,
      momentX: 180, // kNm
      momentY: 0,
      momentZ: 0
    },
    constraints: {
      maxDeflection: 250, // L/250
      maxCrackWidth: 0.4, // mm
      minReinforcement: 0.25, // %
      maxReinforcement: 4.0, // %
      fireRating: 2 // hours
    }
  });

  useEffect(() => {
    // Update summary when design results change
    if (designManager.getAllResults().size > 0) {
      setDesignSummary(designManager.generateSummary());
    }
  }, [designManager]);

  const handleInputChange = (section: keyof ElementDesignForm, field: string, value: number | string) => {
    setFormData(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      } else {
        return {
          ...prev,
          [section]: value
        };
      }
    });
  };

  const performDesign = async () => {
    setIsDesigning(true);
    
    try {
      // Simulate design calculation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const designInput: DesignInput = {
        elementType: formData.elementType,
        forces: formData.forces,
        materials: {
          fc: formData.materials.fc,
          fy: formData.materials.fy
        },
        loads: {
          deadLoad: 50, // Default values - should come from analysis
          liveLoad: 30
        },
        geometry: formData.geometry,
        constraints: formData.constraints
      };

      const designEngine = new StructuralDesignEngine(designInput);
      const results = designEngine.performDesign(formData.elementType);

      // Add to results manager
      designManager.addDesignResult(formData.elementId, results);
      setCurrentResults(results);
      setSelectedElement(formData.elementId);
      
      // Switch to details view
      setActiveView('details');
      
    } catch (error) {
      console.error('Design calculation error:', error);
      alert('Terjadi kesalahan dalam perhitungan desain. Silakan periksa input dan coba lagi.');
    } finally {
      setIsDesigning(false);
    }
  };

  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId);
    const results = designManager.getDesignResult(elementId);
    setCurrentResults(results || null);
    setActiveView('details');
  };

  const renderDesignForm = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Input Desain Elemen Struktur</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Element Identification */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Identifikasi Elemen</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Elemen
              </label>
              <input
                type="text"
                value={formData.elementId}
                onChange={(e) => handleInputChange('elementId' as any, '', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Elemen
              </label>
              <select
                value={formData.elementType}
                onChange={(e) => handleInputChange('elementType' as any, '', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="beam">Balok</option>
                <option value="column">Kolom</option>
                <option value="slab">Pelat</option>
              </select>
            </div>
          </div>

          {/* Geometry */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Geometri (mm)</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lebar</label>
              <input
                type="number"
                value={formData.geometry.width}
                onChange={(e) => handleInputChange('geometry', 'width', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi</label>
              <input
                type="number"
                value={formData.geometry.height}
                onChange={(e) => handleInputChange('geometry', 'height', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {formData.elementType === 'beam' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panjang</label>
                <input
                  type="number"
                  value={formData.geometry.length || 6000}
                  onChange={(e) => handleInputChange('geometry', 'length', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selimut Beton</label>
              <input
                type="number"
                value={formData.geometry.clearCover}
                onChange={(e) => handleInputChange('geometry', 'clearCover', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          {/* Materials */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Material</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">fc' (MPa)</label>
              <input
                type="number"
                value={formData.materials.fc}
                onChange={(e) => handleInputChange('materials', 'fc', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">fy (MPa)</label>
              <input
                type="number"
                value={formData.materials.fy}
                onChange={(e) => handleInputChange('materials', 'fy', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Es (MPa)</label>
              <input
                type="number"
                value={formData.materials.Es}
                onChange={(e) => handleInputChange('materials', 'Es', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                disabled
              />
            </div>
          </div>

          {/* Forces */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Gaya Internal</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Aksial (kN)</label>
              <input
                type="number"
                value={formData.forces.axial}
                onChange={(e) => handleInputChange('forces', 'axial', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gaya Geser X (kN)</label>
              <input
                type="number"
                value={formData.forces.shearX}
                onChange={(e) => handleInputChange('forces', 'shearX', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Momen X (kNm)</label>
              <input
                type="number"
                value={formData.forces.momentX}
                onChange={(e) => handleInputChange('forces', 'momentX', Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={designManager.getAllResults().size === 0}
          >
            Lihat Dashboard
          </button>
          
          <button
            onClick={performDesign}
            disabled={isDesigning}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDesigning ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menghitung...
              </span>
            ) : (
              'Hitung Desain'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Design Module</h1>
        <p className="mt-2 text-indigo-100">
          Desain detail elemen struktur berdasarkan SNI 2847 & SNI 1729
        </p>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg border">
        <button
          onClick={() => setActiveView('form')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeView === 'form'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Input Desain
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          disabled={!designSummary}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
            activeView === 'dashboard'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('details')}
          disabled={!currentResults}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
            activeView === 'details'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Detail Hasil
        </button>
      </div>

      {/* Content */}
      <div>
        {activeView === 'form' && renderDesignForm()}
        
        {activeView === 'dashboard' && designSummary && (
          <DesignDashboard 
            summary={designSummary}
            onElementSelect={handleElementSelect}
          />
        )}
        
        {activeView === 'details' && currentResults && (
          <DesignVisualization 
            results={currentResults}
            elementId={selectedElement}
          />
        )}

        {activeView === 'dashboard' && !designSummary && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Belum ada hasil desain. Silakan buat desain terlebih dahulu.
            </div>
          </div>
        )}

        {activeView === 'details' && !currentResults && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Pilih elemen dari dashboard untuk melihat detail hasil.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignModule;