/**
 * Static Analysis View Component
 * Dedicated interface for static structural analysis
 */
import React from 'react';
import { 
  Calculator, Play, Pause, RefreshCw, Download, AlertTriangle,
  CheckCircle, Clock, Settings, Database, FileText, Eye, HelpCircle
} from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';
import BuildingGeometryPanel from '../components/BuildingGeometryPanel';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';

const StaticAnalysisView: React.FC = () => {
  const {
    buildingGeometry,
    analysisResults,
    analysisStatus,
    isAnalyzing,
    analysisProgress,
    selectedMaterials,
    materials,
    executeAnalysis,
    setShowMaterialManager,
    setShowSettingsManager,
    setShowGuide,
    handleClearResults
  } = useAnalysisStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready';
      case 'completed': return 'Completed';
      case 'running': return 'Running';
      case 'pending': return 'Pending';
      case 'error': return 'Error';
      case 'not-run': return 'Not Run';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Static Analysis</h2>
              <p className="text-sm text-gray-600">Linear static analysis with gravity and lateral loads</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowGuide(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Analysis Guide & Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowSettingsManager(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Analysis Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleClearResults()}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear Results"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analysis Status Panel with Error Display */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Model Setup</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.modelSetup)}`}>
                {getStatusText(analysisStatus.modelSetup)}
              </span>
            </div>
            {analysisStatus.modelSetup === 'error' && (
              <div className="text-xs text-red-600 mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Check geometry inputs
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Materials</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.materials)}`}>
                {getStatusText(analysisStatus.materials)}
              </span>
            </div>
            {analysisStatus.materials === 'error' && (
              <div className="text-xs text-red-600 mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Select valid materials
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Loads</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.loads)}`}>
                {getStatusText(analysisStatus.loads)}
              </span>
            </div>
            {analysisStatus.loads === 'error' && (
              <div className="text-xs text-red-600 mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Check load values
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Analysis</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.analysis)}`}>
                {getStatusText(analysisStatus.analysis)}
              </span>
            </div>
            {analysisStatus.analysis === 'error' && (
              <div className="text-xs text-red-600 mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Analysis failed
              </div>
            )}
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => executeAnalysis('static')}
            disabled={isAnalyzing || analysisStatus.materials !== 'ready'}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing || analysisStatus.materials !== 'ready'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Running...' : 'Run Analysis'}</span>
          </button>

          <button
            onClick={() => setShowMaterialManager(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Database className="w-4 h-4" />
            <span>Materials ({selectedMaterials.length})</span>
          </button>

          {analysisResults && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          )}
        </div>
      </div>

      {/* Building Geometry Panel */}
      <BuildingGeometryPanel />

      {/* Material Summary */}
      {selectedMaterials.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2 text-purple-600" />
            Selected Materials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedMaterials.map(materialId => {
              const material = materials.find(m => m.id === materialId);
              if (!material) return null;
              
              return (
                <div key={materialId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{material.name}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {material.sniStandard}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                  <div className="text-xs text-gray-500">
                    {material.type === 'concrete' 
                      ? `fc' = ${material.compressiveStrength} MPa` 
                      : `fy = ${material.yieldStrength} MPa`
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <AnalysisResultsPanel results={analysisResults} analysisType="static" />
      )}
    </div>
  );
};

export default StaticAnalysisView;