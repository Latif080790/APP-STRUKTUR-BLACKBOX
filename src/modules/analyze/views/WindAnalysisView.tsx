/**
 * Wind Analysis View Component
 * Dedicated interface for wind load analysis per SNI 1727:2020
 */
import React from 'react';
import { 
  Wind, Play, Pause, RefreshCw, AlertTriangle, CheckCircle, Clock, 
  Settings, Database, Gauge, Navigation
} from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';
import BuildingGeometryPanel from '../components/BuildingGeometryPanel';
import AnalysisResultsPanel from '../components/AnalysisResultsPanel';

const WindAnalysisView: React.FC = () => {
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
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Wind className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Wind Load Analysis</h2>
              <p className="text-sm text-gray-600">Wind load analysis per SNI 1727:2020 standards</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-cyan-700 bg-cyan-50 px-3 py-2 rounded-lg">
              <Gauge className="w-4 h-4" />
              <span>SNI 1727:2020</span>
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
              <span className="text-sm font-medium text-gray-700">Wind Loads</span>
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
              <span className="text-sm font-medium text-gray-700">Wind Analysis Progress</span>
              <span className="text-sm text-gray-500">{analysisProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Calculating wind pressure distribution and structural response...
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => executeAnalysis('wind')}
            disabled={isAnalyzing || analysisStatus.materials !== 'ready'}
            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all ${
              isAnalyzing || analysisStatus.materials !== 'ready'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Running Wind Analysis...' : 'Run Wind Analysis'}</span>
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

      {/* Wind Load Parameters Panel */}
      <div className="bg-white rounded-xl p-5 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-cyan-600" />
          Wind Load Parameters (SNI 1727:2020)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-sm font-medium text-cyan-800 mb-2">Basic Wind Speed</div>
            <div className="text-lg font-bold text-cyan-900">V = 25 m/s</div>
            <div className="text-xs text-cyan-700 mt-1">
              • Jakarta region standard<br/>
              • 3-second gust speed<br/>
              • 50-year return period
            </div>
          </div>
          
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-sm font-medium text-cyan-800 mb-2">Exposure Category</div>
            <div className="text-lg font-bold text-cyan-900">Category B</div>
            <div className="text-xs text-cyan-700 mt-1">
              • Urban/suburban areas<br/>
              • Buildings/trees 6-9m high<br/>
              • Typical city environment
            </div>
          </div>
          
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-sm font-medium text-cyan-800 mb-2">Topographic Factor</div>
            <div className="text-lg font-bold text-cyan-900">Kzt = 1.0</div>
            <div className="text-xs text-cyan-700 mt-1">
              • Flat terrain<br/>
              • No significant hills/ridges<br/>
              • Ground level variations &lt; 10%
            </div>
          </div>
          
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-sm font-medium text-cyan-800 mb-2">Gust Factor</div>
            <div className="text-lg font-bold text-cyan-900">G = 0.85</div>
            <div className="text-xs text-cyan-700 mt-1">
              • Rigid structures<br/>
              • Background turbulence<br/>
              • Dynamic amplification
            </div>
          </div>
          
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-sm font-medium text-cyan-800 mb-2">Pressure Coefficients</div>
            <div className="text-lg font-bold text-cyan-900">Cp varies</div>
            <div className="text-xs text-cyan-700 mt-1">
              • Windward wall: +0.8<br/>
              • Leeward wall: -0.5<br/>
              • Side walls: -0.7
            </div>
          </div>
          
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="text-sm font-medium text-cyan-800 mb-2">Load Combinations</div>
            <div className="text-lg font-bold text-cyan-900">LRFD Method</div>
            <div className="text-xs text-cyan-700 mt-1">
              • 1.2D + 1.6W<br/>
              • 0.9D + 1.6W<br/>
              • Load reversibility check
            </div>
          </div>
        </div>
        
        {selectedMaterials.length === 0 && (
          <div className="mt-4 flex items-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
            <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>Select materials to enable wind analysis. Structural stiffness affects wind response and deflection limits.</span>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">Analysis Procedure</div>
          <div className="text-xs text-blue-700">
            1. Calculate design wind pressure (qz = 0.613KzKztKdV²I)<br/>
            2. Determine external pressure coefficients (Cp)<br/>
            3. Calculate wind loads on each surface<br/>
            4. Apply directional load combinations (0°, 45°, 90°)<br/>
            5. Check serviceability deflection limits (H/400)<br/>
            6. Verify cladding and connection adequacy
          </div>
        </div>
        
        {/* Wind Direction Diagram */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-800 mb-3">Wind Direction Analysis</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-white rounded border">
              <div className="text-xs font-medium text-gray-700">0° (East)</div>
              <div className="text-xs text-gray-600">Main Wind Direction</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-xs font-medium text-gray-700">45° (NE)</div>
              <div className="text-xs text-gray-600">Corner Load Case</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-xs font-medium text-gray-700">90° (North)</div>
              <div className="text-xs text-gray-600">Perpendicular Direction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && analysisStatus.analysis === 'completed' && (
        <AnalysisResultsPanel results={analysisResults} analysisType="wind" />
      )}
    </div>
  );
};

export default WindAnalysisView;