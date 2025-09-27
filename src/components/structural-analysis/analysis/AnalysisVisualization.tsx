/**
 * Analysis Visualization Components
 * Charts and diagrams for displaying structural analysis results
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Import analysis types
import { StaticAnalysisResults } from './StaticAnalysisEngine';
import { DynamicAnalysisResults } from './DynamicAnalysisEngine';
import { CombinedAnalysisResults } from './AnalysisResultsManager';

interface AnalysisVisualizationProps {
  results: CombinedAnalysisResults;
  showDetailedCharts?: boolean;
}

// Force Diagram Component
interface ForceDiagramProps {
  forces: number[];
  moments: number[];
  positions: number[];
  title: string;
}

const ForceDiagram: React.FC<ForceDiagramProps> = ({ forces, moments, positions, title }) => {
  const maxForce = Math.max(...forces.map(Math.abs));
  const maxMoment = Math.max(...moments.map(Math.abs));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Force Diagram */}
          <div>
            <h4 className="font-semibold mb-2">Shear Force Diagram</h4>
            <div className="relative h-32 bg-gray-50 border rounded">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Zero line */}
                <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#666" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Force diagram */}
                {forces.map((force, index) => {
                  const x = 10 + (index * 80) / (forces.length - 1);
                  const y = 50 - (force / maxForce) * 40;
                  
                  return (
                    <g key={index}>
                      <circle cx={`${x}%`} cy={`${y}%`} r="3" fill="#3b82f6" />
                      <text x={`${x}%`} y={`${y - 5}%`} textAnchor="middle" fontSize="10" fill="#374151">
                        {force.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
                
                {/* Connect points */}
                {forces.slice(1).map((_, index) => {
                  const x1 = 10 + (index * 80) / (forces.length - 1);
                  const x2 = 10 + ((index + 1) * 80) / (forces.length - 1);
                  const y1 = 50 - (forces[index] / maxForce) * 40;
                  const y2 = 50 - (forces[index + 1] / maxForce) * 40;
                  
                  return (
                    <line
                      key={index}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Moment Diagram */}
          <div>
            <h4 className="font-semibold mb-2">Bending Moment Diagram</h4>
            <div className="relative h-32 bg-gray-50 border rounded">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* Zero line */}
                <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#666" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Moment diagram */}
                {moments.map((moment, index) => {
                  const x = 10 + (index * 80) / (moments.length - 1);
                  const y = 50 - (moment / maxMoment) * 40;
                  
                  return (
                    <g key={index}>
                      <circle cx={`${x}%`} cy={`${y}%`} r="3" fill="#ef4444" />
                      <text x={`${x}%`} y={`${y - 5}%`} textAnchor="middle" fontSize="10" fill="#374151">
                        {moment.toFixed(1)}
                      </text>
                    </g>
                  );
                })}
                
                {/* Connect points */}
                {moments.slice(1).map((_, index) => {
                  const x1 = 10 + (index * 80) / (moments.length - 1);
                  const x2 = 10 + ((index + 1) * 80) / (moments.length - 1);
                  const y1 = 50 - (moments[index] / maxMoment) * 40;
                  const y2 = 50 - (moments[index + 1] / maxMoment) * 40;
                  
                  return (
                    <line
                      key={index}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#ef4444"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Response Spectrum Chart Component
interface ResponseSpectrumChartProps {
  periods: number[];
  accelerations: number[];
  designPeriods?: { t1?: number; ts?: number; tl?: number };
}

const ResponseSpectrumChart: React.FC<ResponseSpectrumChartProps> = ({ 
  periods, 
  accelerations, 
  designPeriods 
}) => {
  const maxAcceleration = Math.max(...accelerations);
  const maxPeriod = Math.max(...periods);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Design Response Spectrum</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-gray-50 border rounded">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map(ratio => (
              <g key={ratio}>
                <line 
                  x1="10%" 
                  y1={`${90 - ratio * 80}%`} 
                  x2="90%" 
                  y2={`${90 - ratio * 80}%`} 
                  stroke="#e5e7eb" 
                  strokeWidth="1" 
                />
                <text 
                  x="8%" 
                  y={`${92 - ratio * 80}%`} 
                  textAnchor="end" 
                  fontSize="10" 
                  fill="#6b7280"
                >
                  {(ratio * maxAcceleration).toFixed(1)}
                </text>
              </g>
            ))}
            
            {/* Spectrum curve */}
            {accelerations.slice(1).map((_, index) => {
              const x1 = 10 + (periods[index] / maxPeriod) * 80;
              const x2 = 10 + (periods[index + 1] / maxPeriod) * 80;
              const y1 = 90 - (accelerations[index] / maxAcceleration) * 80;
              const y2 = 90 - (accelerations[index + 1] / maxAcceleration) * 80;
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
              );
            })}
            
            {/* Design periods markers */}
            {designPeriods?.t1 && (
              <line
                x1={`${10 + (designPeriods.t1 / maxPeriod) * 80}%`}
                y1="10%"
                x2={`${10 + (designPeriods.t1 / maxPeriod) * 80}%`}
                y2="90%"
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
            
            {/* Axes labels */}
            <text x="50%" y="96%" textAnchor="middle" fontSize="12" fill="#374151">
              Period (seconds)
            </text>
            <text 
              x="4%" 
              y="50%" 
              textAnchor="middle" 
              fontSize="12" 
              fill="#374151" 
              transform="rotate(-90 4 50)"
            >
              Spectral Acceleration (g)
            </text>
          </svg>
        </div>
        
        {designPeriods?.t1 && (
          <div className="mt-2 text-sm text-gray-600">
            Fundamental Period: {designPeriods.t1.toFixed(3)} seconds
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Modal Properties Chart
interface ModalPropertiesChartProps {
  modes: Array<{
    mode: number;
    period: number;
    modalMass: { x: number; y: number };
    cumulativeMass: { x: number; y: number };
  }>;
}

const ModalPropertiesChart: React.FC<ModalPropertiesChartProps> = ({ modes }) => {
  const maxPeriod = Math.max(...modes.map(m => m.period));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5" />
          <span>Modal Properties</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Period vs Mode */}
          <div>
            <h4 className="font-semibold mb-2">Mode Periods</h4>
            <div className="relative h-40 bg-gray-50 border rounded">
              <svg width="100%" height="100%" className="absolute inset-0">
                {modes.slice(0, 8).map((mode, index) => {
                  const x = 10 + (index * 80) / 7;
                  const y = 90 - (mode.period / maxPeriod) * 80;
                  
                  return (
                    <g key={mode.mode}>
                      <rect 
                        x={`${x - 2}%`} 
                        y={`${y}%`} 
                        width="4%" 
                        height={`${90 - y}%`} 
                        fill="#3b82f6" 
                      />
                      <text x={`${x}%`} y="95%" textAnchor="middle" fontSize="10" fill="#374151">
                        {mode.mode}
                      </text>
                      <text x={`${x}%`} y={`${y - 2}%`} textAnchor="middle" fontSize="9" fill="#374151">
                        {mode.period.toFixed(3)}
                      </text>
                    </g>
                  );
                })}
                
                <text x="50%" y="98%" textAnchor="middle" fontSize="12" fill="#374151">
                  Mode Number
                </text>
                <text 
                  x="2%" 
                  y="50%" 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#374151" 
                  transform="rotate(-90 2 50)"
                >
                  Period (s)
                </text>
              </svg>
            </div>
          </div>

          {/* Mass Participation */}
          <div>
            <h4 className="font-semibold mb-2">Cumulative Mass Participation</h4>
            <div className="relative h-40 bg-gray-50 border rounded">
              <svg width="100%" height="100%" className="absolute inset-0">
                {/* 90% line */}
                <line x1="10%" y1="18%" x2="90%" y2="18%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                <text x="92%" y="20%" fontSize="10" fill="#ef4444">90%</text>
                
                {modes.slice(0, 8).map((mode, index) => {
                  const x = 10 + (index * 80) / 7;
                  const yX = 90 - (mode.cumulativeMass.x * 80);
                  const yY = 90 - (mode.cumulativeMass.y * 80);
                  
                  return (
                    <g key={mode.mode}>
                      <circle cx={`${x}%`} cy={`${yX}%`} r="3" fill="#3b82f6" />
                      <circle cx={`${x}%`} cy={`${yY}%`} r="3" fill="#10b981" />
                      
                      {index > 0 && (
                        <>
                          <line
                            x1={`${10 + ((index - 1) * 80) / 7}%`}
                            y1={`${90 - (modes[index - 1].cumulativeMass.x * 80)}%`}
                            x2={`${x}%`}
                            y2={`${yX}%`}
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                          <line
                            x1={`${10 + ((index - 1) * 80) / 7}%`}
                            y1={`${90 - (modes[index - 1].cumulativeMass.y * 80)}%`}
                            x2={`${x}%`}
                            y2={`${yY}%`}
                            stroke="#10b981"
                            strokeWidth="2"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-center space-x-6 mt-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>X Direction</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Y Direction</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-red-500"></div>
                <span>90% Requirement</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Performance Summary Component
interface PerformanceSummaryProps {
  summary: {
    overallRating: string;
    structuralPerformance: {
      strength: number;
      stability: number;
      serviceability: number;
      durability: number;
    };
    seismicPerformance?: {
      lateralResistance: number;
      driftControl: number;
      redundancy: number;
      regularity: number;
    };
  };
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ summary }) => {
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'adequate': return 'bg-yellow-500';
      case 'inadequate': return 'bg-orange-500';
      case 'unsafe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-blue-600';
    if (value >= 50) return 'text-yellow-600';
    if (value >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Performance Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold ${getRatingColor(summary.overallRating)}`}>
              <span className="capitalize">{summary.overallRating}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall Structural Performance</p>
          </div>

          {/* Structural Performance */}
          <div>
            <h4 className="font-semibold mb-3">Structural Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(summary.structuralPerformance).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="capitalize text-sm font-medium">{key}</span>
                  <span className={`text-lg font-bold ${getPerformanceColor(value)}`}>
                    {value.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seismic Performance */}
          {summary.seismicPerformance && (
            <div>
              <h4 className="font-semibold mb-3">Seismic Performance</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(summary.seismicPerformance).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="capitalize text-sm font-medium">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-lg font-bold ${getPerformanceColor(value)}`}>
                      {value.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Compliance Status Component
interface ComplianceStatusProps {
  compliance: Array<{
    code: string;
    requirement: string;
    status: 'pass' | 'fail' | 'warning';
    actualValue: number;
    limitValue: number;
    unit: string;
    criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ compliance }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, criticalityLevel: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full";
    
    if (status === 'pass') return `${baseClasses} bg-green-100 text-green-800`;
    if (status === 'warning') return `${baseClasses} bg-yellow-100 text-yellow-800`;
    if (criticalityLevel === 'critical') return `${baseClasses} bg-red-100 text-red-800`;
    if (criticalityLevel === 'high') return `${baseClasses} bg-orange-100 text-orange-800`;
    return `${baseClasses} bg-red-100 text-red-800`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <span>Code Compliance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {compliance.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div className="flex items-center space-x-3">
                {getStatusIcon(item.status)}
                <div>
                  <div className="font-medium text-sm">{item.requirement}</div>
                  <div className="text-xs text-gray-600">{item.code}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right text-sm">
                  <div className="font-medium">
                    {item.actualValue.toFixed(2)} {item.unit}
                  </div>
                  <div className="text-xs text-gray-600">
                    Limit: {item.limitValue.toFixed(2)} {item.unit}
                  </div>
                </div>
                
                <Badge className={getStatusBadge(item.status, item.criticalityLevel)}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Analysis Visualization Component
const AnalysisVisualization: React.FC<AnalysisVisualizationProps> = ({ 
  results, 
  showDetailedCharts = false 
}) => {
  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <PerformanceSummary summary={results.performanceSummary} />
      
      {/* Compliance Status */}
      <ComplianceStatus compliance={results.validation.compliance} />
      
      {/* Force Diagrams - Static Analysis */}
      {results.staticAnalysis && showDetailedCharts && (
        <ForceDiagram
          forces={results.staticAnalysis.internalForces.beams[0]?.shear || []}
          moments={results.staticAnalysis.internalForces.beams[0]?.moment || []}
          positions={[0, 0.5, 1.0]}
          title="Typical Beam Force Diagram"
        />
      )}
      
      {/* Response Spectrum - Dynamic Analysis */}
      {results.dynamicAnalysis && showDetailedCharts && (
        <ResponseSpectrumChart
          periods={results.dynamicAnalysis.responseSpectrum.spectrumData.period}
          accelerations={results.dynamicAnalysis.responseSpectrum.spectrumData.acceleration}
          designPeriods={{
            t1: results.dynamicAnalysis.modalAnalysis.modes[0]?.period,
            ts: results.dynamicAnalysis.responseSpectrum.spectrumData.ts,
            tl: results.dynamicAnalysis.responseSpectrum.spectrumData.tl
          }}
        />
      )}
      
      {/* Modal Properties - Dynamic Analysis */}
      {results.dynamicAnalysis && showDetailedCharts && (
        <ModalPropertiesChart modes={results.dynamicAnalysis.modalAnalysis.modes} />
      )}
    </div>
  );
};

export default AnalysisVisualization;
export {
  ForceDiagram,
  ResponseSpectrumChart,
  ModalPropertiesChart,
  PerformanceSummary,
  ComplianceStatus
};