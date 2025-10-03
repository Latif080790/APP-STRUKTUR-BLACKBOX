import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Activity,
  Target,
  AlertTriangle,
  TrendingDown,
  Eye,
  Play,
  Pause,
  Settings,
  BarChart3,
  Zap,
  Shield,
  CheckCircle,
  Clock
} from 'lucide-react';

interface LoadPath {
  id: string;
  name: string;
  elements: string[];
  utilization: number;
  critical: boolean;
  redundancy: number;
}

interface StructuralElement {
  id: string;
  type: 'beam' | 'column' | 'brace';
  name: string;
  position: { x: number; y: number };
  utilization: number;
  status: 'safe' | 'warning' | 'critical' | 'failed';
}

interface AnalysisScenario {
  id: string;
  name: string;
  description: string;
  type: 'normal' | 'progressive' | 'seismic' | 'extreme';
}

interface CollapseResult {
  scenario: string;
  initialFailure: string;
  cascadeSequence: string[];
  collapseRatio: number;
  timeToCollapse: number;
  recommendations: string[];
}

const LoadPathAnalysisSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<AnalysisScenario | null>(null);
  const [collapseResults, setCollapseResults] = useState<CollapseResult | null>(null);
  const [visualizationMode, setVisualizationMode] = useState<'load-path' | 'stress'>('load-path');

  // Analysis scenarios
  const analysisScenarios: AnalysisScenario[] = useMemo(() => [
    {
      id: 'normal-operation',
      name: 'Normal Operation',
      description: 'Standard load path analysis under normal conditions',
      type: 'normal'
    },
    {
      id: 'column-failure',
      name: 'Column Failure',
      description: 'Progressive collapse analysis with initial column failure',
      type: 'progressive'
    },
    {
      id: 'seismic-event',
      name: 'Seismic Event',
      description: 'Load path analysis during seismic loading',
      type: 'seismic'
    },
    {
      id: 'extreme-loading',
      name: 'Extreme Loading',
      description: 'Analysis under extreme load conditions',
      type: 'extreme'
    }
  ], []);

  // Sample structural elements
  const structuralElements: StructuralElement[] = useMemo(() => [
    { id: 'C-1', type: 'column', name: 'Column C1', position: { x: 1, y: 1 }, utilization: 0.71, status: 'safe' },
    { id: 'C-2', type: 'column', name: 'Column C2', position: { x: 4, y: 1 }, utilization: 0.77, status: 'safe' },
    { id: 'C-3', type: 'column', name: 'Column C3', position: { x: 7, y: 1 }, utilization: 0.65, status: 'safe' },
    { id: 'C-4', type: 'column', name: 'Column C4', position: { x: 1, y: 4 }, utilization: 0.74, status: 'safe' },
    { id: 'B-1', type: 'beam', name: 'Beam B1', position: { x: 2.5, y: 1 }, utilization: 0.71, status: 'safe' },
    { id: 'B-2', type: 'beam', name: 'Beam B2', position: { x: 5.5, y: 1 }, utilization: 0.62, status: 'safe' },
    { id: 'B-3', type: 'beam', name: 'Beam B3', position: { x: 4, y: 2.5 }, utilization: 0.78, status: 'warning' },
    { id: 'B-4', type: 'beam', name: 'Beam B4', position: { x: 2.5, y: 4 }, utilization: 0.91, status: 'critical' },
  ], []);

  const loadPaths: LoadPath[] = useMemo(() => [
    {
      id: 'path-1',
      name: 'Primary Load Path',
      elements: ['C-1', 'B-1', 'C-2', 'B-3', 'C-4'],
      utilization: 0.74,
      critical: true,
      redundancy: 2
    },
    {
      id: 'path-2',
      name: 'Secondary Load Path',
      elements: ['C-2', 'B-2', 'C-3'],
      utilization: 0.66,
      critical: false,
      redundancy: 3
    }
  ], []);

  // Progressive collapse analysis
  const performProgressiveCollapseAnalysis = useCallback(async (scenario: AnalysisScenario) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const stages = ['Initializing', 'Load Redistribution', 'Cascade Analysis', 'Results'];
      
      for (let i = 0; i < stages.length; i++) {
        setAnalysisProgress(((i + 1) / stages.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const cascadeSequence = ['C-2', 'B-1', 'B-3'];
      const collapseRatio = cascadeSequence.length / structuralElements.length;
      
      const result: CollapseResult = {
        scenario: scenario.name,
        initialFailure: 'C-2',
        cascadeSequence: cascadeSequence,
        collapseRatio: collapseRatio,
        timeToCollapse: Math.random() * 15 + 5,
        recommendations: [
          'Add redundant load paths to prevent progressive collapse',
          'Implement structural ties per building codes',
          'Consider real-time structural health monitoring'
        ]
      };
      
      setCollapseResults(result);
      
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [structuralElements]);

  // Canvas visualization
  const drawStructure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = 50;
    const offsetX = 50;
    const offsetY = 50;
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + i * scale, offsetY);
      ctx.lineTo(offsetX + i * scale, offsetY + 5 * scale);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * scale);
      ctx.lineTo(offsetX + 8 * scale, offsetY + i * scale);
      ctx.stroke();
    }
    
    // Draw elements
    structuralElements.forEach(element => {
      const x = offsetX + element.position.x * scale;
      const y = offsetY + element.position.y * scale;
      
      ctx.fillStyle = getElementColor(element.status);
      
      if (element.type === 'column') {
        ctx.fillRect(x - 8, y - 8, 16, 16);
      } else if (element.type === 'beam') {
        ctx.fillRect(x - 6, y - 3, 12, 6);
      }
      
      ctx.fillStyle = '#1e293b';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(element.id, x, y + 25);
      
      if (visualizationMode === 'stress') {
        ctx.fillStyle = '#64748b';
        ctx.font = '8px Arial';
        ctx.fillText(`${(element.utilization * 100).toFixed(0)}%`, x, y + 35);
      }
    });
    
    // Draw load paths
    if (visualizationMode === 'load-path') {
      loadPaths.forEach(path => {
        if (path.critical) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          
          for (let i = 0; i < path.elements.length - 1; i++) {
            const element1 = structuralElements.find(e => e.id === path.elements[i]);
            const element2 = structuralElements.find(e => e.id === path.elements[i + 1]);
            
            if (element1 && element2) {
              ctx.beginPath();
              ctx.moveTo(
                offsetX + element1.position.x * scale,
                offsetY + element1.position.y * scale
              );
              ctx.lineTo(
                offsetX + element2.position.x * scale,
                offsetY + element2.position.y * scale
              );
              ctx.stroke();
            }
          }
          ctx.setLineDash([]);
        }
      });
    }
  }, [structuralElements, loadPaths, visualizationMode]);

  const getElementColor = (status: string): string => {
    switch (status) {
      case 'safe': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'failed': return '#7f1d1d';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    drawStructure();
  }, [drawStructure]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <Activity className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Load Path Analysis System</h2>
            <p className="text-red-100">Real-time load tracing with progressive collapse analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-red-100 text-sm">Analysis Scenarios</div>
            <div className="text-xl font-bold">{analysisScenarios.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-red-100 text-sm">Load Paths</div>
            <div className="text-xl font-bold">{loadPaths.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-red-100 text-sm">Critical Elements</div>
            <div className="text-xl font-bold">{structuralElements.filter(e => e.status === 'critical').length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-red-100 text-sm">Progress</div>
            <div className="text-xl font-bold">{analysisProgress.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Analysis Scenarios */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-red-600" />
          Analysis Scenarios
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysisScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                selectedScenario?.id === scenario.id
                  ? 'bg-red-50 border-red-200 shadow-lg'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {scenario.type === 'normal' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {scenario.type === 'progressive' && <TrendingDown className="w-5 h-5 text-red-600" />}
                {scenario.type === 'seismic' && <Zap className="w-5 h-5 text-orange-600" />}
                {scenario.type === 'extreme' && <AlertTriangle className="w-5 h-5 text-purple-600" />}
                <span className="font-medium text-slate-800">{scenario.name}</span>
              </div>
              <p className="text-slate-600 text-sm">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-red-600" />
              Structural Visualization
            </h3>
            
            <select
              value={visualizationMode}
              onChange={(e) => setVisualizationMode(e.target.value as any)}
              className="px-3 py-1 border border-slate-300 rounded-md text-sm"
            >
              <option value="load-path">Load Paths</option>
              <option value="stress">Stress Distribution</option>
            </select>
          </div>
          
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
            className="border border-slate-200 rounded-lg w-full"
          />
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-600">Safe</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-slate-600">Warning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-slate-600">Critical</span>
            </div>
          </div>
        </div>

        {/* Analysis Control */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-red-600" />
            Analysis Control
          </h3>

          {selectedScenario && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-800">{selectedScenario.name}</h4>
                <p className="text-slate-600 text-sm">{selectedScenario.description}</p>
              </div>

              <button
                onClick={() => performProgressiveCollapseAnalysis(selectedScenario)}
                disabled={isAnalyzing}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
              </button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span>{analysisProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {collapseResults && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-red-600" />
            Progressive Collapse Analysis Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-slate-700">Collapse Summary</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-red-700 text-sm font-medium">Collapse Ratio</div>
                  <div className="text-red-900 font-bold text-lg">{(collapseResults.collapseRatio * 100).toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-700 text-sm font-medium">Time to Collapse</div>
                  <div className="text-orange-900 font-bold text-lg">{collapseResults.timeToCollapse.toFixed(1)}s</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-slate-700">Failure Sequence</h4>
              <div className="space-y-2">
                <div className="p-2 bg-red-100 rounded text-sm">
                  <span className="font-medium text-red-800">Initial:</span> {collapseResults.initialFailure}
                </div>
                {collapseResults.cascadeSequence.map((element, index) => (
                  <div key={index} className="p-2 bg-orange-100 rounded text-sm">
                    <span className="font-medium text-orange-800">Step {index + 1}:</span> {element}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-slate-700">Recommendations</h4>
              <div className="space-y-2">
                {collapseResults.recommendations.map((rec, index) => (
                  <div key={index} className="p-2 bg-blue-50 rounded text-sm text-blue-800">
                    • {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadPathAnalysisSystem;