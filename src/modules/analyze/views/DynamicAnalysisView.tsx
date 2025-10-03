/**
 * Dynamic Analysis View Component
 * Dedicated interface for dynamic modal and response spectrum analysis
 */
import React from 'react';
import { 
  Activity, Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Clock, 
  Settings, Database, Waves, BarChart3
} from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';
import BuildingGeometryPanel from '../components/BuildingGeometryPanel';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';

const DynamicAnalysisView: React.FC = () => {
  const {
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
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Dynamic Analysis</h2>
              <p className="text-sm text-gray-600">Modal analysis and response spectrum analysis</p>
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
              <span className="text-sm font-medium text-gray-700">Dynamic Analysis Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => executeAnalysis('dynamic')}
            disabled={isAnalyzing || analysisStatus.materials !== 'ready'}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing || analysisStatus.materials !== 'ready'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Running Dynamic Analysis...' : 'Run Dynamic Analysis'}</span>
          </button>

          <button
            onClick={() => setShowMaterialManager(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Database className="w-4 h-4" />
            <span>Materials ({selectedMaterials.length})</span>
          </button>

          {/* Dynamic Analysis Specific Info */}
          <div className="flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
            <Waves className="w-4 h-4" />
            <span>Modal + Response Spectrum</span>
          </div>
        </div>
      </div>

      {/* Building Geometry Panel */}
      <BuildingGeometryPanel />

      {/* Dynamic Analysis Specific Parameters */}
      <div className="bg-white rounded-xl p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
          Dynamic Analysis Parameters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-sm font-medium text-emerald-800 mb-2">Modal Analysis</div>
            <div className="text-xs text-emerald-700">
              • First 12 natural frequencies<br/>
              • Mode shapes and participation factors<br/>
              • Mass participation ratio &gt; 90%
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-sm font-medium text-emerald-800 mb-2">Damping Ratio</div>
            <div className="text-xs text-emerald-700">
              • Structural damping: 5% (typical)<br/>
              • Rayleigh damping model<br/>
              • SNI 1726:2019 compliant
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4">
            <div className="text-sm font-medium text-emerald-800 mb-2">Response Spectrum</div>
            <div className="text-xs text-emerald-700">
              • Design response spectrum<br/>
              • Site-specific seismic parameters<br/>
              • Dynamic amplification factors
            </div>
          </div>
        </div>
        
        {selectedMaterials.length === 0 && (
          <div className="mt-4 flex items-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Select materials to enable dynamic analysis. Dynamic properties depend on material specifications.</span>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResults && analysisStatus.analysis === 'completed' && (
        <AnalysisResultsPanel results={analysisResults} analysisType="dynamic" />
      )}
    </div>
  );
};

export default DynamicAnalysisView;