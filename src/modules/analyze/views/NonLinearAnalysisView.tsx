/**
 * Non-Linear Analysis View Component
 * Dedicated interface for nonlinear structural analysis with advanced options
 */
import React from 'react';
import { 
  Calculator, Play, Pause, RefreshCw, Download, Settings, 
  Activity, Zap, BarChart3, Database, AlertTriangle
} from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';
import BuildingGeometryPanel from '../components/BuildingGeometryPanel';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';

const NonLinearAnalysisView: React.FC = () => {
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
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Non-Linear Analysis</h2>
              <p className="text-sm text-gray-600">Advanced analysis with geometric and material nonlinearity</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
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

        {/* Nonlinear Analysis Warning */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-orange-900 mb-1">Advanced Analysis Notice</h4>
              <p className="text-sm text-orange-800">
                Nonlinear analysis requires careful interpretation and may take significantly longer to complete. 
                Ensure all material properties and boundary conditions are properly defined.
              </p>
            </div>
          </div>
        </div>

        {/* Nonlinear Analysis Features */}
        <div className="bg-red-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-red-900 mb-2">Nonlinear Analysis Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Large displacement effects (P-Δ and P-δ)</li>
              <li>• Material nonlinearity (yielding, cracking)</li>
              <li>• Progressive failure analysis</li>
              <li>• Geometric stiffness effects</li>
            </ul>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Iterative solution procedures</li>
              <li>• Load stepping and convergence control</li>
              <li>• Post-buckling behavior</li>
              <li>• Advanced failure criteria</li>
            </ul>
          </div>
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
              <span className="text-sm font-medium text-gray-700">Nonlinear Analysis Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Note: Nonlinear analysis may require multiple iterations for convergence
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => executeAnalysis('nonlinear')}
            disabled={isAnalyzing || analysisStatus.materials !== 'ready'}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing || analysisStatus.materials !== 'ready'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Running Nonlinear Analysis...' : 'Run Nonlinear Analysis'}</span>
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
              <span>Export Nonlinear Results</span>
            </button>
          )}
        </div>
      </div>

      {/* Building Geometry Panel */}
      <BuildingGeometryPanel />

      {/* Nonlinear Analysis Parameters */}
      <div className="bg-white rounded-xl p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-red-600" />
          Nonlinear Analysis Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Geometric Nonlinearity</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• P-Delta effects included</li>
              <li>• Large displacement analysis</li>
              <li>• Updated geometry throughout analysis</li>
              <li>• Geometric stiffness matrix</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Material Nonlinearity</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Concrete cracking and crushing</li>
              <li>• Steel yielding and strain hardening</li>
              <li>• Nonlinear stress-strain relationships</li>
              <li>• Progressive material degradation</li>
            </ul>
          </div>
        </div>
        
        {/* Convergence Information */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h5 className="font-medium text-yellow-900 mb-1">Convergence Criteria</h5>
          <div className="text-sm text-yellow-800">
            Analysis uses Newton-Raphson iteration with displacement and force convergence tolerances. 
            Maximum 50 iterations per load step with automatic load stepping if convergence difficulties occur.
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <AnalysisResultsPanel results={analysisResults} analysisType="nonlinear" />
      )}
    </div>
  );
};

export default NonLinearAnalysisView;