/**
 * Seismic Analysis View Component  
 * Dedicated interface for earthquake analysis per SNI 1726:2019
 */
import React from 'react';
import { 
  Zap, Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Clock, 
  Settings, Database, Shield, TrendingUp
} from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';
import BuildingGeometryPanel from '../components/BuildingGeometryPanel';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';

const SeismicAnalysisView: React.FC = () => {
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
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Seismic Analysis</h2>
              <p className="text-sm text-gray-600">Earthquake analysis per SNI 1726:2019 standards</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>SNI 1726:2019</span>
            </div>
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
              <span className="text-sm font-medium text-gray-700">Seismic Loads</span>
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
              <span className="text-sm font-medium text-gray-700">Seismic Analysis Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Running response spectrum analysis and modal superposition...
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => executeAnalysis('seismic')}
            disabled={isAnalyzing || analysisStatus.materials !== 'ready'}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing || analysisStatus.materials !== 'ready'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Running Seismic Analysis...' : 'Run Seismic Analysis'}</span>
          </button>

          <button
            onClick={() => setShowMaterialManager(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <Database className="w-4 h-4" />
            <span>Materials ({selectedMaterials.length})</span>
          </button>
        </div>
      </div>

      {/* Building Geometry Panel */}
      <BuildingGeometryPanel />

      {/* Seismic Parameters Panel */}
      <div className="bg-white rounded-xl p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
          Seismic Design Parameters (SNI 1726:2019)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Site Classification</div>
            <div className="text-lg font-bold text-red-900">Site Class SC</div>
            <div className="text-xs text-red-700 mt-1">
              • Very dense soil/soft rock<br/>
              • Vs30 = 360-760 m/s<br/>
              • Typical urban condition
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Design Response Spectrum</div>
            <div className="text-lg font-bold text-red-900">Ss = 0.6g, S1 = 0.3g</div>
            <div className="text-xs text-red-700 mt-1">
              • Jakarta region typical values<br/>
              • Site-modified spectrum<br/>
              • 5% damping ratio
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Structural System</div>
            <div className="text-lg font-bold text-red-900">R = 8, Cd = 5.5</div>
            <div className="text-xs text-red-700 mt-1">
              • Special moment frame<br/>
              • High ductility system<br/>
              • Deflection amplification
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Importance Factor</div>
            <div className="text-lg font-bold text-red-900">Ie = 1.0</div>
            <div className="text-xs text-red-700 mt-1">
              • Standard occupancy<br/>
              • Risk Category II<br/>
              • Normal structures
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Seismic Design Category</div>
            <div className="text-lg font-bold text-red-900">SDC D</div>
            <div className="text-xs text-red-700 mt-1">
              • High seismic hazard<br/>
              • Special detailing required<br/>
              • Dynamic analysis mandatory
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm font-medium text-red-800 mb-2">Base Shear Coefficient</div>
            <div className="text-lg font-bold text-red-900">Cs = SDS/(R/Ie)</div>
            <div className="text-xs text-red-700 mt-1">
              • Minimum base shear<br/>
              • Response spectrum procedure<br/>
              • Modal combination rules
            </div>
          </div>
        </div>
        
        {selectedMaterials.length === 0 && (
          <div className="mt-4 flex items-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Select materials to enable seismic analysis. Ductility requirements depend on material specifications and detailing.</span>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">Analysis Procedure</div>
          <div className="text-xs text-blue-700">
            1. Modal analysis (minimum 12 modes)<br/>
            2. Response spectrum analysis with 5% damping<br/>
            3. Modal combination using CQC method<br/>
            4. Drift check per story (Δ ≤ 0.020hsx/Cd)<br/>
            5. P-Delta effects consideration<br/>
            6. Torsional irregularity check
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && analysisStatus.analysis === 'completed' && (
        <AnalysisResultsPanel results={analysisResults} analysisType="seismic" />
      )}
    </div>
  );
};

export default SeismicAnalysisView;