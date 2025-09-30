/**
 * BIM Integration Interface
 * User interface for importing and exporting BIM/CAD files
 */

import React, { useState, useCallback, useRef } from 'react';
import { Structure3D } from '@/types/structural';
import { 
  BIMIntegrationEngine, 
  BIMConfig, 
  BIMFileFormat, 
  BIMImportResult, 
  BIMExportResult,
  defaultBIMConfig 
} from './BIMIntegrationEngine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BIMIntegrationInterfaceProps {
  structure?: Structure3D;
  onImportComplete: (result: BIMImportResult) => void;
  onExportComplete: (result: BIMExportResult) => void;
}

export const BIMIntegrationInterface: React.FC<BIMIntegrationInterfaceProps> = ({
  structure,
  onImportComplete,
  onExportComplete
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [config, setConfig] = useState<BIMConfig>(defaultBIMConfig);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supported formats dengan deskripsi
  const supportedFormats = [
    { format: 'ifc' as BIMFileFormat, name: 'IFC', description: 'Industry Foundation Classes - Standard BIM', icon: '🏗️' },
    { format: 'dwg' as BIMFileFormat, name: 'DWG', description: 'AutoCAD Drawing (Basic Support)', icon: '📐' },
    { format: 'dxf' as BIMFileFormat, name: 'DXF', description: 'Drawing Exchange Format', icon: '📊' },
    { format: 'json' as BIMFileFormat, name: 'JSON', description: 'Native Structure Format', icon: '📄' },
    { format: 'obj' as BIMFileFormat, name: 'OBJ', description: '3D Mesh Format', icon: '🔷' },
    { format: 'gltf' as BIMFileFormat, name: 'glTF', description: '3D Visualization Format', icon: '🎨' },
  ];

  const handleFileImport = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const engine = new BIMIntegrationEngine(config);
      
      // Simulasi progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const result = await engine.importFile(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      onImportComplete(result);
      
      // Reset progress setelah delay
      setTimeout(() => setProgress(0), 2000);
      
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [config, onImportComplete]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileImport(files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileImport(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleExport = useCallback(async (format: BIMFileFormat) => {
    if (!structure) {
      alert('Tidak ada struktur untuk diekspor');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const exportConfig = { ...config, format };
      const engine = new BIMIntegrationEngine(exportConfig);
      
      const fileName = `structure.${format}`;
      
      // Simulasi progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 200);

      const result = await engine.exportStructure(structure, fileName);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success && result.fileContent) {
        // Download file
        const blob = new Blob([result.fileContent], { 
          type: getContentType(format) 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      
      onExportComplete(result);
      
      // Reset progress setelah delay
      setTimeout(() => setProgress(0), 2000);
      
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [structure, config, onExportComplete]);

  const getContentType = (format: BIMFileFormat): string => {
    const contentTypes: Record<BIMFileFormat, string> = {
      'ifc': 'application/x-step',
      'dwg': 'application/acad',
      'dxf': 'application/dxf',
      'step': 'application/step',
      'iges': 'application/iges',
      'obj': 'application/object',
      'gltf': 'model/gltf+json',
      'json': 'application/json'
    };
    
    return contentTypes[format] || 'application/octet-stream';
  };

  const renderImportPanel = () => (
    <div className="space-y-6">
      {/* Drag & Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-4">📁</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {dragOver ? 'Lepas file di sini' : 'Import File BIM/CAD'}
        </h3>
        <p className="text-gray-500 mb-4">
          Drag & drop file atau klik untuk memilih
        </p>
        <p className="text-sm text-gray-400">
          Mendukung: IFC, DWG, DXF, JSON, OBJ, glTF
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".ifc,.dwg,.dxf,.json,.obj,.gltf,.glb"
          className="hidden"
        />
      </div>

      {/* Supported Formats */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Format yang Didukung</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {supportedFormats.map((fmt) => (
            <div key={fmt.format} className="flex items-center p-3 bg-white rounded-lg border">
              <span className="text-2xl mr-3">{fmt.icon}</span>
              <div>
                <div className="font-medium">{fmt.name}</div>
                <div className="text-sm text-gray-500">{fmt.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Konfigurasi Import</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <select
              value={config.units}
              onChange={(e) => setConfig(prev => ({ ...prev, units: e.target.value as any }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="mm">Milimeter (mm)</option>
              <option value="cm">Centimeter (cm)</option>
              <option value="m">Meter (m)</option>
              <option value="in">Inch (in)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Level of Detail</label>
            <select
              value={config.levelOfDetail}
              onChange={(e) => setConfig(prev => ({ ...prev, levelOfDetail: e.target.value as any }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="basic">Basic</option>
              <option value="detailed">Detailed</option>
              <option value="full">Full</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeMaterials"
              checked={config.includeMaterials}
              onChange={(e) => setConfig(prev => ({ ...prev, includeMaterials: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="includeMaterials" className="text-sm">Import Material Properties</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeSections"
              checked={config.includeSections}
              onChange={(e) => setConfig(prev => ({ ...prev, includeSections: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="includeSections" className="text-sm">Import Section Properties</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeLoads"
              checked={config.includeLoads}
              onChange={(e) => setConfig(prev => ({ ...prev, includeLoads: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="includeLoads" className="text-sm">Import Load Data</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExportPanel = () => (
    <div className="space-y-6">
      {/* Export Options */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Pilih Format Export</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {supportedFormats.map((fmt) => (
            <button
              key={fmt.format}
              onClick={() => handleExport(fmt.format)}
              disabled={isProcessing || !structure}
              className="flex items-center p-4 bg-white rounded-lg border hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-3xl mr-4">{fmt.icon}</span>
              <div className="text-left">
                <div className="font-medium">{fmt.name}</div>
                <div className="text-sm text-gray-500">{fmt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Structure Info */}
      {structure && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Informasi Struktur</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nodes:</span>
              <span className="ml-2 font-medium">{structure.nodes.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Elements:</span>
              <span className="ml-2 font-medium">{structure.elements.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Loads:</span>
              <span className="ml-2 font-medium">{structure.loads?.length || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Materials:</span>
              <span className="ml-2 font-medium">
                {new Set(structure.elements.map(e => e.material.type)).size}
              </span>
            </div>
          </div>
        </div>
      )}

      {!structure && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📋</div>
          <p>Tidak ada struktur yang tersedia untuk diekspor</p>
          <p className="text-sm">Silakan buat atau import struktur terlebih dahulu</p>
        </div>
      )}

      {/* Export Configuration */}
      <div>
        <h4 className="text-lg font-semibold mb-3">Konfigurasi Export</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unit Output</label>
            <select
              value={config.units}
              onChange={(e) => setConfig(prev => ({ ...prev, units: e.target.value as any }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="mm">Milimeter (mm)</option>
              <option value="cm">Centimeter (cm)</option>
              <option value="m">Meter (m)</option>
              <option value="in">Inch (in)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Coordinate System</label>
            <select
              value={config.coordinateSystem}
              onChange={(e) => setConfig(prev => ({ ...prev, coordinateSystem: e.target.value as any }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="global">Global</option>
              <option value="local">Local</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🏗️ BIM Integration</CardTitle>
        <p className="text-sm text-gray-600">
          Import dan export model dari software BIM/CAD profesional
        </p>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'import' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📥 Import
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'export' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📤 Export
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'import' && renderImportPanel()}
        {activeTab === 'export' && renderExportPanel()}

        {/* Progress Bar */}
        {isProcessing && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {activeTab === 'import' ? 'Mengimport file...' : 'Mengekspor file...'} {progress}%
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Tips BIM Integration</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• IFC: Format standar untuk pertukaran data BIM</li>
            <li>• DWG/DXF: Kompatibel dengan AutoCAD dan software CAD lainnya</li>
            <li>• JSON: Format native dengan dukungan penuh untuk semua fitur</li>
            <li>• OBJ/glTF: Untuk visualisasi 3D dan rendering</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BIMIntegrationInterface;