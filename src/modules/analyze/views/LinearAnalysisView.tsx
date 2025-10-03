/**
 * Linear Analysis View Component
 * Dedicated interface for linear structural analysis with advanced options
 */
import React from 'react';
import { 
  Calculator, Play, Pause, RefreshCw, Download, Settings, 
  TrendingUp, Activity, BarChart3, Database, HelpCircle
} from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';
import BuildingGeometryPanel from '../components/BuildingGeometryPanel';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';

const LinearAnalysisView: React.FC = () => {
  const {
    buildingGeometry,
    analysisResults,
    analysisStatus,
    isAnalyzing,
    analysisProgress,
    selectedMaterials,
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
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Linear Analysis</h2>
              <p className="text-sm text-gray-600">Linear elastic analysis with first-order theory</p>
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

        {/* Linear Analysis Specific Information */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-900 mb-2">Linear Analysis Characteristics</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Small deformation theory (geometric linearity)</li>
            <li>• Linear elastic material behavior</li>
            <li>• Superposition principle applies</li>
            <li>• First-order analysis (P-Δ effects ignored)</li>
            <li>• Suitable for typical building structures under service loads</li>
          </ul>
        </div>

        {/* Analysis Status Panel */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Model Setup</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.modelSetup)}`}>
                {getStatusText(analysisStatus.modelSetup)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Materials</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.materials)}`}>
                {getStatusText(analysisStatus.materials)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Loads</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.loads)}`}>
                {getStatusText(analysisStatus.loads)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Analysis</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(analysisStatus.analysis)}`}>
                {getStatusText(analysisStatus.analysis)}
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Linear Analysis Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => executeAnalysis('linear')}
            disabled={isAnalyzing || analysisStatus.materials !== 'ready'}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing || analysisStatus.materials !== 'ready'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Running Linear Analysis...' : 'Run Linear Analysis'}</span>
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Export Linear Results</span>
            </button>
          )}
        </div>
      </div>

      {/* Building Geometry Panel */}
      <BuildingGeometryPanel />

      {/* Linear Analysis Assumptions */}
      <div className="bg-white rounded-xl p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-green-600" />
          Linear Analysis Assumptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Geometric Assumptions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Small displacement theory</li>
              <li>• Original geometry used throughout</li>
              <li>• No P-Δ effects considered</li>
              <li>• Member forces calculated at undeformed positions</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Material Assumptions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Linear elastic behavior</li>
              <li>• Stress proportional to strain</li>
              <li>• No yielding or cracking</li>
              <li>• Constant material properties</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <AnalysisResultsPanel results={analysisResults} analysisType="linear" />
      )}
    </div>
  );
};

export default LinearAnalysisView;