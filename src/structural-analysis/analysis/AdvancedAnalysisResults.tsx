/**
 * Advanced Analysis Results Visualization
 * Displays sophisticated analysis results with interactive charts and data
 */

import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AdvancedAnalysisResult } from './AdvancedAnalysisEngine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AdvancedAnalysisResultsProps {
  result: AdvancedAnalysisResult;
  onExportData?: (data: any) => void;
}

export const AdvancedAnalysisResults: React.FC<AdvancedAnalysisResultsProps> = ({
  result,
  onExportData
}) => {
  const [activeView, setActiveView] = useState<'summary' | 'detailed' | 'charts'>('summary');

  // Time-History Results Processing
  const timeHistoryChartData = useMemo(() => {
    if (result.analysisType !== 'time-history' || !result.timeHistoryResults) {
      return null;
    }

    const { displacementHistory } = result.timeHistoryResults;
    
    return {
      labels: displacementHistory.map(point => point.time.toFixed(2)),
      datasets: [
        {
          label: 'Max Displacement (m)',
          data: displacementHistory.map(point => {
            const maxDisp = Math.max(
              ...point.displacements.map(d => Math.sqrt(d.ux*d.ux + d.uy*d.uy + d.uz*d.uz))
            );
            return maxDisp;
          }),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [result]);

  // Pushover Results Processing
  const pushoverChartData = useMemo(() => {
    if (result.analysisType !== 'pushover' || !result.pushoverResults) {
      return null;
    }

    const { pushoverCurve } = result.pushoverResults;
    
    return {
      labels: pushoverCurve.map(point => point.displacement.toFixed(4)),
      datasets: [
        {
          label: 'Base Shear (N)',
          data: pushoverCurve.map(point => point.baseShear),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [result]);

  // Buckling Results Processing
  const bucklingChartData = useMemo(() => {
    if (result.analysisType !== 'buckling' || !result.bucklingResults) {
      return null;
    }

    const { bucklingModes } = result.bucklingResults;
    
    return {
      labels: bucklingModes.map(mode => `Mode ${mode.modeNumber}`),
      datasets: [
        {
          label: 'Buckling Load (N)',
          data: bucklingModes.map(mode => mode.bucklingLoad),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1
        }
      ]
    };
  }, [result]);

  const renderSummaryView = () => (
    <div className="space-y-6">
      {/* Analysis Type Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {result.analysisType === 'time-history' && '🕐 Time-History Analysis Results'}
          {result.analysisType === 'pushover' && '📈 Pushover Analysis Results'}
          {result.analysisType === 'buckling' && '🔀 Buckling Analysis Results'}
        </h3>
        <p className="text-blue-600 text-sm">
          Analysis completed successfully. Review the key results below.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-gray-800">
            {result.isValid ? '✅' : '❌'}
          </div>
          <div className="text-sm text-gray-600">Structure Status</div>
          <div className="text-xs text-gray-500">
            {result.isValid ? 'Safe' : 'Check Required'}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {(result.maxDisplacement * 1000).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Max Displacement</div>
          <div className="text-xs text-gray-500">mm</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {(result.maxStress / 1000000).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Max Stress</div>
          <div className="text-xs text-gray-500">MPa</div>
        </div>

        {/* Analysis-specific metric */}
        {result.analysisType === 'time-history' && result.timeHistoryResults && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {result.timeHistoryResults.maxResponse.time.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Peak Response Time</div>
            <div className="text-xs text-gray-500">seconds</div>
          </div>
        )}
        
        {result.analysisType === 'pushover' && result.pushoverResults && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {result.pushoverResults.plasticHinges.length}
            </div>
            <div className="text-sm text-gray-600">Plastic Hinges</div>
            <div className="text-xs text-gray-500">formed</div>
          </div>
        )}
        
        {result.analysisType === 'buckling' && result.bucklingResults && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {result.bucklingResults.safetyFactor.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Safety Factor</div>
            <div className="text-xs text-gray-500">against buckling</div>
          </div>
        )}
      </div>

      {/* Analysis-Specific Summary */}
      {result.analysisType === 'time-history' && result.timeHistoryResults && (
        <Card>
          <CardHeader>
            <CardTitle>Time-History Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Maximum Response</h4>
                <ul className="text-sm space-y-1">
                  <li>Displacement: {(result.timeHistoryResults.maxResponse.displacement * 1000).toFixed(2)} mm</li>
                  <li>Velocity: {result.timeHistoryResults.maxResponse.velocity.toFixed(3)} m/s</li>
                  <li>Acceleration: {result.timeHistoryResults.maxResponse.acceleration.toFixed(2)} m/s²</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analysis Parameters</h4>
                <ul className="text-sm space-y-1">
                  <li>Time Steps: {result.timeHistoryResults.timeSteps.length}</li>
                  <li>Data Points: {result.timeHistoryResults.displacementHistory.length}</li>
                  <li>Peak at: {result.timeHistoryResults.maxResponse.time.toFixed(2)} s</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result.analysisType === 'pushover' && result.pushoverResults && (
        <Card>
          <CardHeader>
            <CardTitle>Pushover Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Capacity Curve</h4>
                <ul className="text-sm space-y-1">
                  <li>Analysis Steps: {result.pushoverResults.pushoverCurve.length}</li>
                  <li>Plastic Hinges: {result.pushoverResults.plasticHinges.length}</li>
                  <li>Performance Points: {result.pushoverResults.performancePoints.length}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance Evaluation</h4>
                {result.pushoverResults.performancePoints.map((point, index) => (
                  <div key={index} className="text-sm">
                    <p>Ductility Ratio: {point.ductilityRatio.toFixed(2)}</p>
                    <p>Yield Displacement: {(point.yieldPoint.displacement * 1000).toFixed(1)} mm</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result.analysisType === 'buckling' && result.bucklingResults && (
        <Card>
          <CardHeader>
            <CardTitle>Buckling Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Critical Buckling</h4>
                <ul className="text-sm space-y-1">
                  <li>Critical Load: {(result.bucklingResults.criticalBucklingLoad / 1000).toFixed(1)} kN</li>
                  <li>Safety Factor: {result.bucklingResults.safetyFactor.toFixed(2)}</li>
                  <li>Number of Modes: {result.bucklingResults.bucklingModes.length}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Buckling Modes</h4>
                <div className="max-h-32 overflow-y-auto">
                  {result.bucklingResults.bucklingModes.map((mode) => (
                    <div key={mode.modeNumber} className="text-sm py-1">
                      Mode {mode.modeNumber}: {(mode.bucklingLoad / 1000).toFixed(1)} kN
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderChartsView = () => (
    <div className="space-y-6">
      {result.analysisType === 'time-history' && timeHistoryChartData && (
        <Card>
          <CardHeader>
            <CardTitle>Displacement History</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '400px' }}>
              <Line 
                data={timeHistoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Maximum Displacement vs Time'
                    },
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Time (s)'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Displacement (m)'
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {result.analysisType === 'pushover' && pushoverChartData && (
        <Card>
          <CardHeader>
            <CardTitle>Pushover Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '400px' }}>
              <Line 
                data={pushoverChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Base Shear vs Displacement'
                    },
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Displacement (m)'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Base Shear (N)'
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {result.analysisType === 'buckling' && bucklingChartData && (
        <Card>
          <CardHeader>
            <CardTitle>Buckling Modes</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '400px' }}>
              <Bar 
                data={bucklingChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    title: {
                      display: true,
                      text: 'Buckling Loads by Mode'
                    },
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Buckling Mode'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Buckling Load (N)'
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDetailedView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="w-full">
      {/* Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('summary')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'summary' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📊 Summary
        </button>
        <button
          onClick={() => setActiveView('charts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'charts' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📈 Charts
        </button>
        <button
          onClick={() => setActiveView('detailed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'detailed' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          🔍 Detailed
        </button>
      </div>

      {/* Content */}
      {activeView === 'summary' && renderSummaryView()}
      {activeView === 'charts' && renderChartsView()}
      {activeView === 'detailed' && renderDetailedView()}

      {/* Export Button */}
      {onExportData && (
        <div className="mt-6 text-center">
          <button
            onClick={() => onExportData(result)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            📄 Export Results
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalysisResults;