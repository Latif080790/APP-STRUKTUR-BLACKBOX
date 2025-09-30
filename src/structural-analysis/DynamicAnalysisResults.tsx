/**
 * Dynamic Analysis Results Component
 * Displays results from dynamic analysis including modal analysis and response spectrum analysis
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface ModalResult {
  mode: number;
  frequency: number;
  period: number;
}

interface ModeShape {
  mode: number;
  shape: {
    ux: number;
    uy: number;
    uz: number;
    rx: number;
    ry: number;
    rz: number;
  }[];
}

interface DynamicAnalysisResultsProps {
  modalResults?: {
    frequencies: ModalResult[];
    modeShapes: ModeShape[];
  };
  responseSpectrumResults?: any;
  className?: string;
}

export const DynamicAnalysisResults: React.FC<DynamicAnalysisResultsProps> = ({
  modalResults,
  responseSpectrumResults,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'modal' | 'response'>('modal');
  
  if (!modalResults && !responseSpectrumResults) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Dynamic Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No dynamic analysis results available.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Prepare data for modal frequency chart
  const modalChartData = modalResults?.frequencies.map(freq => ({
    mode: `Mode ${freq.mode}`,
    frequency: freq.frequency,
    period: freq.period
  })) || [];
  
  // Prepare data for response spectrum results
  const responseChartData = responseSpectrumResults?.spectralAccelerations.map((sa: any) => ({
    mode: `Mode ${sa.mode}`,
    acceleration: sa.spectralAcceleration
  })) || [];
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Dynamic Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        {modalResults && responseSpectrumResults && (
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'modal' ? 'default' : 'outline'}
              onClick={() => setActiveTab('modal')}
            >
              Modal Analysis
            </Button>
            <Button
              variant={activeTab === 'response' ? 'default' : 'outline'}
              onClick={() => setActiveTab('response')}
            >
              Response Spectrum
            </Button>
          </div>
        )}
        
        {activeTab === 'modal' && modalResults && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Natural Frequencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modalResults.frequencies.map(freq => (
                  <Card key={freq.mode}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Mode {freq.mode}</span>
                        <Badge variant="secondary">Mode</Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Frequency:</span>
                          <span className="text-sm font-medium">{freq.frequency.toFixed(2)} Hz</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Period:</span>
                          <span className="text-sm font-medium">{freq.period.toFixed(3)} s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Frequency Chart</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modalChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mode" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="frequency" fill="#8884d8" name="Frequency (Hz)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Mode Shapes</h3>
              <p className="text-sm text-gray-500 mb-4">
                Mode shapes show the relative displacement pattern of the structure at each natural frequency.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modalResults.modeShapes.slice(0, 4).map(shape => (
                  <Card key={shape.mode}>
                    <CardHeader>
                      <CardTitle className="text-md">Mode {shape.mode} Shape</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={shape.shape.map((s, i) => ({ 
                            node: i + 1, 
                            ux: s.ux * 1000, 
                            uy: s.uy * 1000, 
                            uz: s.uz * 1000 
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="node" name="Node" />
                            <YAxis name="Displacement" unit="mm" />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="ux" 
                              stroke="#8884d8" 
                              name="UX (mm)" 
                              dot={{ r: 2 }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="uy" 
                              stroke="#82ca9d" 
                              name="UY (mm)" 
                              dot={{ r: 2 }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="uz" 
                              stroke="#ffc658" 
                              name="UZ (mm)" 
                              dot={{ r: 2 }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'response' && responseSpectrumResults && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Response Spectrum Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Base Shear</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {responseSpectrumResults.baseShear ? 
                        `${(responseSpectrumResults.baseShear / 1000).toFixed(1)} kN` : 
                        'N/A'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Effective Modal Mass</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {responseSpectrumResults.effectiveModalMass ? 
                        `${responseSpectrumResults.effectiveModalMass.toFixed(1)} tons` : 
                        'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Spectral Accelerations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mode" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="acceleration" 
                      fill="#82ca9d" 
                      name="Spectral Acceleration (g)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Story Forces</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Node ID</th>
                      <th className="text-right py-2">Force (kN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseSpectrumResults.storyForces?.map((force: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{force.nodeId}</td>
                        <td className="text-right py-2">
                          {(force.force / 1000).toFixed(1)} kN
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicAnalysisResults;