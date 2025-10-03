import React, { useState, useCallback, useMemo } from 'react';
import {
  Zap,
  Settings,
  Calculator,
  Target,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Shield,
  Activity,
  BarChart3,
  Layers,
  Grid,
  Save,
  Download,
  Eye,
  Play,
  Pause
} from 'lucide-react';

interface ConnectionType {
  id: string;
  name: string;
  category: 'bolt' | 'weld' | 'moment' | 'seismic';
  description: string;
  sniStandard: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
}

interface BoltConnection {
  diameter: number;
  grade: string;
  quantity: number;
  arrangement: 'single' | 'double' | 'pattern';
  spacing: { horizontal: number; vertical: number };
  edgeDistance: { end: number; edge: number };
  shearStrength: number;
  tensileStrength: number;
  bearingStrength: number;
}

interface WeldConnection {
  type: 'fillet' | 'groove' | 'plug' | 'slot';
  size: number;
  length: number;
  position: 'flat' | 'horizontal' | 'vertical' | 'overhead';
  electrode: string;
  strength: number;
  efficiency: number;
}

interface AnalysisResult {
  capacity: number;
  demand: number;
  utilizationRatio: number;
  safetyFactor: number;
  compliant: boolean;
  recommendations: string[];
}

const AdvancedConnectionDesign: React.FC = () => {
  const [selectedConnection, setSelectedConnection] = useState<ConnectionType | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Connection database
  const connectionTypes: ConnectionType[] = useMemo(() => [
    {
      id: 'simple-shear',
      name: 'Simple Shear Connection',
      category: 'bolt',
      description: 'Basic bolted shear connection for beam-to-column',
      sniStandard: 'SNI 1729:2020',
      complexity: 'basic'
    },
    {
      id: 'tension-splice',
      name: 'Tension Splice Connection',
      category: 'bolt',
      description: 'Bolted tension splice for axial members',
      sniStandard: 'SNI 1729:2020',
      complexity: 'intermediate'
    },
    {
      id: 'fillet-weld',
      name: 'Fillet Weld Connection',
      category: 'weld',
      description: 'Standard fillet weld for general connections',
      sniStandard: 'SNI 1729:2020',
      complexity: 'basic'
    },
    {
      id: 'groove-weld',
      name: 'Complete Penetration Groove Weld',
      category: 'weld',
      description: 'Full strength groove weld for critical connections',
      sniStandard: 'SNI 1729:2020',
      complexity: 'advanced'
    },
    {
      id: 'moment-plate',
      name: 'Extended End Plate Moment Connection',
      category: 'moment',
      description: 'Moment connection with extended end plate',
      sniStandard: 'SNI 1729:2020',
      complexity: 'advanced'
    },
    {
      id: 'seismic-link',
      name: 'Seismic Link Connection',
      category: 'seismic',
      description: 'Special seismic connection for energy dissipation',
      sniStandard: 'SNI 1726:2019',
      complexity: 'advanced'
    }
  ], []);

  // Analysis engine
  const performConnectionAnalysis = useCallback(async (connection: ConnectionType) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      // Simulate analysis phases
      const phases = ['Loading', 'Material Properties', 'Geometry Check', 'Strength Analysis', 'SNI Compliance'];
      
      for (let i = 0; i < phases.length; i++) {
        setAnalysisProgress(((i + 1) / phases.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      // Generate analysis results
      const capacity = Math.random() * 500 + 200; // kN
      const demand = Math.random() * 400 + 100; // kN
      const utilizationRatio = demand / capacity;
      const safetyFactor = capacity / demand;
      
      const result: AnalysisResult = {
        capacity: capacity,
        demand: demand,
        utilizationRatio: utilizationRatio,
        safetyFactor: safetyFactor,
        compliant: utilizationRatio <= 0.9 && safetyFactor >= 1.5,
        recommendations: generateRecommendations(connection, utilizationRatio, safetyFactor)
      };
      
      setAnalysisResults(result);
      
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateRecommendations = (connection: ConnectionType, utilization: number, safety: number): string[] => {
    const recommendations: string[] = [];
    
    if (utilization > 0.9) {
      recommendations.push('Consider increasing connection capacity');
    }
    if (safety < 1.5) {
      recommendations.push('Review safety factors per SNI standards');
    }
    if (connection.category === 'seismic') {
      recommendations.push('Verify special seismic detailing requirements');
    }
    if (connection.complexity === 'advanced') {
      recommendations.push('Recommend professional review for complex connection');
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Advanced Connection Design</h2>
            <p className="text-orange-100">Professional connection analysis with SNI compliance and seismic detailing</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-orange-100 text-sm">Connection Types</div>
            <div className="text-xl font-bold">{connectionTypes.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-orange-100 text-sm">Selected</div>
            <div className="text-xl font-bold">{selectedConnection?.name.split(' ')[0] || 'None'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-orange-100 text-sm">Analysis Status</div>
            <div className="text-xl font-bold">{isAnalyzing ? 'Running' : 'Ready'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-orange-100 text-sm">Progress</div>
            <div className="text-xl font-bold">{analysisProgress.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Connection Selection */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-orange-600" />
          Connection Types
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectionTypes.map((connection) => (
            <button
              key={connection.id}
              onClick={() => setSelectedConnection(connection)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                selectedConnection?.id === connection.id
                  ? 'bg-orange-50 border-orange-200 shadow-lg'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {connection.category === 'bolt' && <Wrench className="w-5 h-5 text-blue-600" />}
                  {connection.category === 'weld' && <Zap className="w-5 h-5 text-orange-600" />}
                  {connection.category === 'moment' && <Activity className="w-5 h-5 text-purple-600" />}
                  {connection.category === 'seismic' && <Shield className="w-5 h-5 text-red-600" />}
                  <span className="font-medium text-slate-800">{connection.name}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded uppercase ${
                  connection.complexity === 'basic' ? 'bg-green-100 text-green-700' :
                  connection.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {connection.complexity}
                </span>
              </div>
              
              <p className="text-slate-600 text-sm mb-2">{connection.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {connection.sniStandard}
                </span>
                <span className={`text-xs px-2 py-1 rounded uppercase ${
                  connection.category === 'bolt' ? 'bg-blue-100 text-blue-700' :
                  connection.category === 'weld' ? 'bg-orange-100 text-orange-700' :
                  connection.category === 'moment' ? 'bg-purple-100 text-purple-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {connection.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Connection Details & Analysis */}
      {selectedConnection && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Parameters */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-orange-600" />
              Design Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-700 font-medium mb-2">Selected Connection</h4>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-800">{selectedConnection.name}</div>
                  <div className="text-slate-600 text-sm">{selectedConnection.description}</div>
                  <div className="text-slate-500 text-xs mt-1">{selectedConnection.sniStandard}</div>
                </div>
              </div>

              {selectedConnection.category === 'bolt' && (
                <div>
                  <h4 className="text-slate-700 font-medium mb-2">Bolt Parameters</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-sm mb-1">Diameter (mm)</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
                        <option>M16</option>
                        <option>M20</option>
                        <option>M24</option>
                        <option>M30</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-sm mb-1">Grade</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-md">
                        <option>A325</option>
                        <option>A490</option>
                        <option>8.8</option>
                        <option>10.9</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedConnection.category === 'weld' && (
                <div>
                  <h4 className="text-slate-700 font-medium mb-2">Weld Parameters</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-sm mb-1">Size (mm)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue="6" />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-sm mb-1">Length (mm)</label>
                      <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue="150" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-slate-700 font-medium mb-2">Load Conditions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-sm mb-1">Shear Force (kN)</label>
                    <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue="150" />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-sm mb-1">Axial Force (kN)</label>
                    <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" defaultValue="100" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => performConnectionAnalysis(selectedConnection)}
                disabled={isAnalyzing}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Connection'}</span>
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-600" />
              Analysis Results
            </h3>

            {isAnalyzing && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Analysis Progress</span>
                  <span>{analysisProgress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <div className="text-center text-slate-600">
                  <Activity className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  <p>Performing connection analysis...</p>
                </div>
              </div>
            )}

            {analysisResults && !isAnalyzing && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-700 text-sm font-medium">Capacity</div>
                    <div className="text-blue-900 font-bold text-lg">{analysisResults.capacity.toFixed(1)} kN</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-green-700 text-sm font-medium">Demand</div>
                    <div className="text-green-900 font-bold text-lg">{analysisResults.demand.toFixed(1)} kN</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-purple-700 text-sm font-medium">Utilization Ratio</div>
                    <div className="text-purple-900 font-bold text-lg">{(analysisResults.utilizationRatio * 100).toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-700 text-sm font-medium">Safety Factor</div>
                    <div className="text-orange-900 font-bold text-lg">{analysisResults.safetyFactor.toFixed(2)}</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  analysisResults.compliant 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {analysisResults.compliant ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      analysisResults.compliant ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {analysisResults.compliant ? 'SNI Compliant' : 'Requires Review'}
                    </span>
                  </div>
                  
                  {analysisResults.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-700 mb-2">Recommendations:</h5>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-slate-600">• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm flex items-center justify-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm flex items-center justify-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            )}

            {!analysisResults && !isAnalyzing && (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select parameters and run analysis</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedConnectionDesign;