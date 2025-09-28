/**
 * Enhanced Analysis Visualization and Results Display
 * Professional charts and diagrams for comprehensive structural analysis results
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  Eye,
  Download,
  Info,
  Calculator,
  Gauge,
  LineChart,
  PieChart
} from 'lucide-react';

// Import enhanced analysis types
import { DetailedStaticResults } from './EnhancedStaticAnalysisEngine';
import { EnhancedDynamicAnalysisResults } from './EnhancedDynamicAnalysisEngine';

interface EnhancedAnalysisVisualizationProps {
  staticResults?: DetailedStaticResults;
  dynamicResults?: EnhancedDynamicAnalysisResults;
  showDetailedCharts?: boolean;
}

// Status indicator component
const StatusIndicator: React.FC<{ status: 'safe' | 'warning' | 'critical' | boolean; size?: 'sm' | 'md' }> = ({ 
  status, 
  size = 'sm' 
}) => {
  const getIcon = () => {
    if (typeof status === 'boolean') {
      return status ? <CheckCircle className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} text-green-500`} /> 
                   : <XCircle className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} text-red-500`} />;
    }
    
    switch (status) {
      case 'safe': return <CheckCircle className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} text-green-500`} />;
      case 'warning': return <AlertTriangle className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} text-yellow-500`} />;
      case 'critical': return <XCircle className={`h-${size === 'sm' ? '4' : '5'} w-${size === 'sm' ? '4' : '5'} text-red-500`} />;
      default: return null;
    }
  };
  
  return getIcon();
};

// Utilization bar component
const UtilizationBar: React.FC<{ 
  value: number; 
  label: string; 
  max?: number; 
  showValue?: boolean;
  format?: 'percentage' | 'ratio' | 'number';
}> = ({ 
  value, 
  label, 
  max = 1.0, 
  showValue = true,
  format = 'ratio'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const getColor = () => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage': return `${(val * 100).toFixed(1)}%`;
      case 'ratio': return val.toFixed(3);
      case 'number': return val.toFixed(2);
      default: return val.toFixed(3);
    }
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        {showValue && <span className="font-semibold">{formatValue(value)}</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Enhanced Force Diagram
const EnhancedForceDiagram: React.FC<{
  title: string;
  data: Array<{
    position: number;
    shear: number;
    moment: number;
    axial?: number;
  }>;
}> = ({ title, data }) => {
  const [showMoment, setShowMoment] = useState(true);
  const [showShear, setShowShear] = useState(true);
  const [showAxial, setShowAxial] = useState(false);
  
  const maxShear = Math.max(...data.map(d => Math.abs(d.shear)));
  const maxMoment = Math.max(...data.map(d => Math.abs(d.moment)));
  const maxAxial = data[0]?.axial ? Math.max(...data.map(d => Math.abs(d.axial || 0))) : 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={showShear ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowShear(!showShear)}
            >
              Shear
            </Button>
            <Button 
              variant={showMoment ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowMoment(!showMoment)}
            >
              Moment
            </Button>
            {maxAxial > 0 && (
              <Button 
                variant={showAxial ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowAxial(!showAxial)}
              >
                Axial
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Force Diagrams */}
          <div className="h-64 bg-gray-50 border rounded p-4">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Zero line */}
              <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#666" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* Shear Force Diagram */}
              {showShear && data.length > 1 && (
                <g>
                  <text x="10" y="30" className="text-xs fill-blue-600 font-semibold">Shear Force</text>
                  {data.map((point, index) => {
                    if (index === data.length - 1) return null;
                    const x1 = 5 + (point.position / Math.max(...data.map(d => d.position))) * 85;
                    const x2 = 5 + (data[index + 1].position / Math.max(...data.map(d => d.position))) * 85;
                    const y1 = 50 - (point.shear / maxShear) * 30;
                    const y2 = 50 - (data[index + 1].shear / maxShear) * 30;
                    
                    return (
                      <line
                        key={`shear-${index}`}
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                    );
                  })}
                </g>
              )}
              
              {/* Moment Diagram */}
              {showMoment && data.length > 1 && (
                <g>
                  <text x="10" y="15" className="text-xs fill-red-600 font-semibold">Moment</text>
                  {data.map((point, index) => {
                    if (index === data.length - 1) return null;
                    const x1 = 5 + (point.position / Math.max(...data.map(d => d.position))) * 85;
                    const x2 = 5 + (data[index + 1].position / Math.max(...data.map(d => d.position))) * 85;
                    const y1 = 50 - (point.moment / maxMoment) * 20;
                    const y2 = 50 - (data[index + 1].moment / maxMoment) * 20;
                    
                    return (
                      <path
                        key={`moment-${index}`}
                        d={`M ${x1}% ${y1}% Q ${(x1+x2)/2}% ${Math.min(y1,y2)-5}% ${x2}% ${y2}%`}
                        fill="none"
                        stroke="#dc2626"
                        strokeWidth="2"
                      />
                    );
                  })}
                </g>
              )}
              
              {/* Values at key points */}
              {data.map((point, index) => {
                const x = 5 + (point.position / Math.max(...data.map(d => d.position))) * 85;
                return (
                  <g key={`label-${index}`}>
                    <circle cx={`${x}%`} cy="50%" r="3" fill="#374151" />
                    <text x={`${x}%`} y="90%" textAnchor="middle" className="text-xs fill-gray-600">
                      {point.position.toFixed(1)}m
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Legend and Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {showShear && (
              <div className="space-y-1">
                <div className="font-semibold text-blue-600">Max Shear Force</div>
                <div>{maxShear.toFixed(2)} kN</div>
              </div>
            )}
            {showMoment && (
              <div className="space-y-1">
                <div className="font-semibold text-red-600">Max Moment</div>
                <div>{maxMoment.toFixed(2)} kNm</div>
              </div>
            )}
            {showAxial && maxAxial > 0 && (
              <div className="space-y-1">
                <div className="font-semibold text-green-600">Max Axial Force</div>
                <div>{maxAxial.toFixed(2)} kN</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Modal Analysis Visualization
const ModalAnalysisDisplay: React.FC<{ results: EnhancedDynamicAnalysisResults['modalAnalysis'] }> = ({ results }) => {
  const [selectedMode, setSelectedMode] = useState(1);
  
  return (
    <div className="space-y-6">
      {/* Modal Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Total Modes</div>
                <div className="text-lg font-semibold">{results.totalModes}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Mass Participation X</div>
                <div className="text-lg font-semibold">{(results.participatingMass.x * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Mass Participation Y</div>
                <div className="text-lg font-semibold">{(results.participatingMass.y * 100).toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <StatusIndicator status={results.convergenceCheck.adequate} size="md" />
              <div>
                <div className="text-sm text-gray-500">Convergence</div>
                <div className="text-lg font-semibold">
                  {results.convergenceCheck.adequate ? 'OK' : 'Check'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mode selector */}
            <div className="flex flex-wrap gap-2">
              {results.modes.slice(0, 10).map((mode) => (
                <Button
                  key={mode.mode}
                  variant={selectedMode === mode.mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMode(mode.mode)}
                >
                  Mode {mode.mode}
                </Button>
              ))}
            </div>
            
            {/* Selected mode details */}
            {results.modes[selectedMode - 1] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Mode {selectedMode} Properties</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Period:</span>
                      <span className="font-mono">{results.modes[selectedMode - 1].period.toFixed(3)} sec</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="font-mono">{results.modes[selectedMode - 1].frequency.toFixed(2)} Hz</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Damping:</span>
                      <span className="font-mono">{(results.modes[selectedMode - 1].dampingRatio * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Mass Participation</h4>
                  <div className="space-y-2">
                    <UtilizationBar 
                      value={results.modes[selectedMode - 1].participationFactorPercent.x / 100}
                      label="X Direction"
                      format="percentage"
                    />
                    <UtilizationBar 
                      value={results.modes[selectedMode - 1].participationFactorPercent.y / 100}
                      label="Y Direction"
                      format="percentage"
                    />
                    <UtilizationBar 
                      value={results.modes[selectedMode - 1].participationFactorPercent.rz / 100}
                      label="Rotation Z"
                      format="percentage"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Modal Shape</h4>
                  <div className="h-48 bg-gray-50 border rounded p-2">
                    <svg width="100%" height="100%" className="overflow-visible">
                      {/* Building outline */}
                      <rect x="40%" y="5%" width="20%" height="90%" fill="none" stroke="#374151" strokeWidth="2"/>
                      
                      {/* Mode shape */}
                      {results.modes[selectedMode - 1].modalShape.map((shape, index) => {
                        const y = 85 - (index * 75 / Math.max(1, results.modes[selectedMode - 1].modalShape.length - 1));
                        const displacement = shape.displacement.x * 20; // Scale for display
                        
                        return (
                          <g key={index}>
                            {/* Displaced shape */}
                            <line 
                              x1="40%" 
                              y1={`${y}%`} 
                              x2={`${40 + displacement}%`} 
                              y2={`${y}%`}
                              stroke="#2563eb" 
                              strokeWidth="3"
                            />
                            <circle cx={`${40 + displacement}%`} cy={`${y}%`} r="2" fill="#2563eb"/>
                            
                            {/* Floor label */}
                            <text x="35%" y={`${y + 2}%`} textAnchor="end" className="text-xs fill-gray-600">
                              F{shape.floor}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Response Spectrum Visualization
const ResponseSpectrumDisplay: React.FC<{ results: EnhancedDynamicAnalysisResults['responseSpectrum'] }> = ({ results }) => {
  return (
    <div className="space-y-6">
      {/* Design Spectrum Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="h-5 w-5" />
            <span>Design Response Spectrum</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 border rounded p-4">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid */}
              <defs>
                <pattern id="spectrum-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#spectrum-grid)" />
              
              {/* Axes */}
              <line x1="10%" y1="85%" x2="95%" y2="85%" stroke="#374151" strokeWidth="2"/>
              <line x1="10%" y1="85%" x2="10%" y2="10%" stroke="#374151" strokeWidth="2"/>
              
              {/* Spectrum curve */}
              {results.designSpectrum.period.length > 1 && (
                <path
                  d={`M ${results.designSpectrum.period.map((period, index) => {
                    const x = 10 + (Math.log10(Math.max(period, 0.01)) + 2) * 25; // Log scale
                    const y = 85 - (results.designSpectrum.acceleration[index] / Math.max(...results.designSpectrum.acceleration)) * 70;
                    return `${Math.max(10, Math.min(95, x))} ${Math.max(15, Math.min(85, y))}`;
                  }).join(' L ')}`}
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3"
                />
              )}
              
              {/* Key points */}
              <circle cx="20%" cy="30%" r="3" fill="#dc2626"/>
              <text x="20%" y="25%" textAnchor="middle" className="text-xs fill-gray-700 font-semibold">
                SDS = {results.spectrumData.sds.toFixed(3)}
              </text>
              
              <circle cx="40%" cy="45%" r="3" fill="#dc2626"/>
              <text x="40%" y="40%" textAnchor="middle" className="text-xs fill-gray-700 font-semibold">
                SD1 = {results.spectrumData.sd1.toFixed(3)}
              </text>
              
              {/* Labels */}
              <text x="52%" y="95%" textAnchor="middle" className="text-sm fill-gray-700 font-semibold">
                Period (seconds)
              </text>
              <text x="5%" y="50%" textAnchor="middle" className="text-sm fill-gray-700 font-semibold" transform="rotate(-90, 5, 50)">
                Spectral Acceleration (g)
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>
      
      {/* Base Shear and Story Forces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Base Shear</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="font-semibold">X-Direction:</span>
                <span className="text-lg font-bold text-blue-600">
                  {results.baseShear.x.toFixed(1)} kN
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="font-semibold">Y-Direction:</span>
                <span className="text-lg font-bold text-green-600">
                  {results.baseShear.y.toFixed(1)} kN
                </span>
              </div>
              
              {/* Comparison chart */}
              <div className="space-y-2">
                <UtilizationBar 
                  value={results.baseShear.x}
                  max={Math.max(results.baseShear.x, results.baseShear.y)}
                  label="X-Direction"
                  showValue={false}
                />
                <UtilizationBar 
                  value={results.baseShear.y}
                  max={Math.max(results.baseShear.x, results.baseShear.y)}
                  label="Y-Direction"
                  showValue={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Story Forces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.storyForces.map((story) => (
                <div key={story.floor} className="flex justify-between items-center p-2 border rounded">
                  <span className="font-semibold">Floor {story.floor}:</span>
                  <div className="text-right text-sm">
                    <div>{story.forceX.toFixed(1)} / {story.forceY.toFixed(1)} kN</div>
                    <div className="text-gray-500">Drift: {(story.drift * 100).toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Static Analysis Summary
const StaticAnalysisSummary: React.FC<{ results: DetailedStaticResults }> = ({ results }) => {
  const safety = results.designChecks ? results.getSafetySummary() : {
    totalElements: 0,
    safe: 0,
    warning: 0,
    critical: 0,
    overallRating: 'Unknown'
  };
  
  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Total Weight</div>
                <div className="text-lg font-semibold">{(results.summary.totalWeight / 1000).toFixed(1)} tons</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Base Shear X</div>
                <div className="text-lg font-semibold">{results.summary.baseShear.x.toFixed(1)} kN</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-sm text-gray-500">Fundamental Period</div>
                <div className="text-lg font-semibold">{results.summary.fundamentalPeriod.toFixed(3)} sec</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <StatusIndicator status={results.quality.convergence} size="md" />
              <div>
                <div className="text-sm text-gray-500">Analysis Quality</div>
                <div className="text-lg font-semibold">
                  {results.quality.convergence ? 'Converged' : 'Check'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Safety Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{safety.overallRating}</div>
              <div className="text-sm text-gray-600">Overall Structural Rating</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-lg font-bold">{safety.totalElements}</div>
                <div className="text-sm text-gray-600">Total Elements</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{safety.safe}</div>
                <div className="text-sm text-gray-600">Safe</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-lg font-bold text-yellow-600">{safety.warning}</div>
                <div className="text-sm text-gray-600">Warning</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">{safety.critical}</div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
            </div>
            
            {/* Safety chart */}
            <div className="space-y-2">
              <UtilizationBar 
                value={safety.safe}
                max={safety.totalElements}
                label="Safe Elements"
                format="number"
              />
              <UtilizationBar 
                value={safety.warning}
                max={safety.totalElements}
                label="Warning Elements"
                format="number"
              />
              <UtilizationBar 
                value={safety.critical}
                max={safety.totalElements}
                label="Critical Elements"
                format="number"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations */}
      {results.quality.recommendations && results.quality.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.quality.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Main Enhanced Analysis Visualization Component
const EnhancedAnalysisVisualization: React.FC<EnhancedAnalysisVisualizationProps> = ({ 
  staticResults, 
  dynamicResults,
  showDetailedCharts = true 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample force data for demonstration
  const sampleForceData = [
    { position: 0, shear: 0, moment: 0 },
    { position: 3, shear: 50, moment: 75 },
    { position: 6, shear: 25, moment: 150 },
    { position: 9, shear: -25, moment: 100 },
    { position: 12, shear: -50, moment: 0 }
  ];
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="static" disabled={!staticResults}>Static Analysis</TabsTrigger>
          <TabsTrigger value="dynamic" disabled={!dynamicResults}>Dynamic Analysis</TabsTrigger>
          <TabsTrigger value="modal" disabled={!dynamicResults}>Modal Analysis</TabsTrigger>
          <TabsTrigger value="spectrum" disabled={!dynamicResults}>Response Spectrum</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analysis Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Analysis Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Static Analysis:</span>
                    <StatusIndicator status={!!staticResults} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dynamic Analysis:</span>
                    <StatusIndicator status={!!dynamicResults} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Modal Analysis:</span>
                    <StatusIndicator status={!!(dynamicResults?.modalAnalysis)} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Code Compliance:</span>
                    <StatusIndicator status={!!(dynamicResults?.codeCompliance)} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Detailed Results
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    3D Visualization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sample Force Diagram */}
          {showDetailedCharts && (
            <EnhancedForceDiagram 
              title="Sample Beam Force Diagram"
              data={sampleForceData}
            />
          )}
        </TabsContent>
        
        <TabsContent value="static">
          {staticResults ? (
            <StaticAnalysisSummary results={staticResults} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">Static analysis results not available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="dynamic">
          {dynamicResults ? (
            <div className="space-y-6">
              {/* Dynamic Analysis Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="text-sm text-gray-500">Seismic Category</div>
                        <div className="text-lg font-semibold">{dynamicResults.seismicCategory.sdc}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-500">Max Drift</div>
                        <div className="text-lg font-semibold">{(dynamicResults.driftCheck.maxDrift * 100).toFixed(2)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <StatusIndicator status={dynamicResults.driftCheck.compliant} size="md" />
                      <div>
                        <div className="text-sm text-gray-500">Drift Compliance</div>
                        <div className="text-lg font-semibold">
                          {dynamicResults.driftCheck.compliant ? 'OK' : 'Check'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">Dynamic analysis results not available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="modal">
          {dynamicResults?.modalAnalysis ? (
            <ModalAnalysisDisplay results={dynamicResults.modalAnalysis} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">Modal analysis results not available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="spectrum">
          {dynamicResults?.responseSpectrum ? (
            <ResponseSpectrumDisplay results={dynamicResults.responseSpectrum} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">Response spectrum results not available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalysisVisualization;