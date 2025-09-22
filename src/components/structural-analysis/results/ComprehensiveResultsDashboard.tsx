/**
 * Comprehensive Results Dashboard
 * Professional display of structural analysis results with charts, tables, and export capabilities
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Info,
  BarChart3,
  Activity,
  Target,
  Zap,
  Shield,
  Building,
  Calculator,
  Gauge
} from 'lucide-react';

// Enhanced interfaces for comprehensive results
export interface ComprehensiveAnalysisResult {
  general: {
    projectName: string;
    analysisDate: string;
    analysisType: string;
    buildingCode: string;
    analyst: string;
    status: 'completed' | 'warning' | 'failed';
    totalElements: number;
    totalNodes: number;
    convergence: boolean;
    iterations: number;
  };
  structural: {
    maxDisplacement: {
      value: number;
      location: string;
      direction: string;
      allowable: number;
      ratio: number;
    };
    maxStress: {
      value: number;
      location: string;
      type: string;
      allowable: number;
      ratio: number;
    };
    maxDeflection: {
      value: number;
      location: string;
      allowable: number;
      ratio: number;
    };
    stability: {
      bucklingFactors: number[];
      modalFrequencies: number[];
      dampingRatios: number[];
    };
  };
  seismic: {
    baseShear: {
      x: number;
      y: number;
      total: number;
    };
    storyDrift: {
      max: number;
      allowable: number;
      location: string;
    };
    torsion: {
      irregularity: boolean;
      ratio: number;
    };
    responseSpectrumFactors: {
      Ss: number;
      S1: number;
      SDS: number;
      SD1: number;
      Fa: number;
      Fv: number;
    };
  };
  design: {
    reinforcement: {
      beams: Array<{
        id: string;
        longitudinal: { top: number; bottom: number };
        transverse: number;
        utilization: number;
      }>;
      columns: Array<{
        id: string;
        longitudinal: number;
        transverse: number;
        utilization: number;
      }>;
    };
    utilization: {
      max: number;
      average: number;
      distribution: Array<{ range: string; count: number; percentage: number }>;
    };
  };
  economics: {
    materialQuantities: {
      concrete: { volume: number; cost: number };
      steel: { weight: number; cost: number };
      formwork: { area: number; cost: number };
    };
    totalCost: number;
    costPerSquareMeter: number;
  };
  quality: {
    checks: Array<{
      category: string;
      description: string;
      status: 'pass' | 'warning' | 'fail';
      value?: number;
      limit?: number;
      recommendation?: string;
    }>;
    overallRating: 'excellent' | 'good' | 'acceptable' | 'poor';
  };
}

interface ComprehensiveResultsDashboardProps {
  results: ComprehensiveAnalysisResult;
  onExport?: (format: 'pdf' | 'excel' | 'word') => void;
  className?: string;
}

// Utility functions
const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pass': case 'completed': case 'excellent': return 'text-green-600';
    case 'warning': case 'good': return 'text-yellow-600';
    case 'fail': case 'failed': case 'poor': return 'text-red-600';
    default: return 'text-blue-600';
  }
};

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'pass': case 'completed': case 'excellent': return 'default';
    case 'warning': case 'good': return 'secondary';
    case 'fail': case 'failed': case 'poor': return 'destructive';
    default: return 'outline';
  }
};

// Main component
export const ComprehensiveResultsDashboard: React.FC<ComprehensiveResultsDashboardProps> = ({
  results,
  onExport,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChart, setSelectedChart] = useState('displacement');

  // Prepare chart data
  const utilizationData = useMemo(() => 
    results.design.utilization.distribution.map(item => ({
      range: item.range,
      count: item.count,
      percentage: item.percentage
    }))
  , [results.design.utilization.distribution]);

  const modalData = useMemo(() => 
    results.structural.stability.modalFrequencies.slice(0, 10).map((freq, index) => ({
      mode: `Mode ${index + 1}`,
      frequency: freq,
      damping: results.structural.stability.dampingRatios[index] || 0.05
    }))
  , [results.structural.stability]);

  const costBreakdown = useMemo(() => [
    { name: 'Concrete', value: results.economics.materialQuantities.concrete.cost, color: '#8884d8' },
    { name: 'Steel', value: results.economics.materialQuantities.steel.cost, color: '#82ca9d' },
    { name: 'Formwork', value: results.economics.materialQuantities.formwork.cost, color: '#ffc658' }
  ], [results.economics]);

  const seismicData = useMemo(() => [
    { parameter: 'Ss', value: results.seismic.responseSpectrumFactors.Ss },
    { parameter: 'S1', value: results.seismic.responseSpectrumFactors.S1 },
    { parameter: 'SDS', value: results.seismic.responseSpectrumFactors.SDS },
    { parameter: 'SD1', value: results.seismic.responseSpectrumFactors.SD1 },
    { parameter: 'Fa', value: results.seismic.responseSpectrumFactors.Fa },
    { parameter: 'Fv', value: results.seismic.responseSpectrumFactors.Fv }
  ], [results.seismic.responseSpectrumFactors]);

  // Export handlers
  const handleExport = useCallback((format: 'pdf' | 'excel' | 'word') => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export functionality
      console.log(`Exporting results as ${format.toUpperCase()}`);
    }
  }, [onExport]);

  // Overview Tab
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Displacement</p>
                <p className="text-2xl font-bold">{formatNumber(results.structural.maxDisplacement.value)} mm</p>
                <p className="text-xs text-gray-500">{results.structural.maxDisplacement.location}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={results.structural.maxDisplacement.ratio * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ratio: {formatNumber(results.structural.maxDisplacement.ratio * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Stress</p>
                <p className="text-2xl font-bold">{formatNumber(results.structural.maxStress.value)} MPa</p>
                <p className="text-xs text-gray-500">{results.structural.maxStress.location}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={results.structural.maxStress.ratio * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ratio: {formatNumber(results.structural.maxStress.ratio * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Base Shear</p>
                <p className="text-2xl font-bold">{formatNumber(results.seismic.baseShear.total)} kN</p>
                <p className="text-xs text-gray-500">Total seismic force</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span>X: {formatNumber(results.seismic.baseShear.x)} kN</span>
                <span>Y: {formatNumber(results.seismic.baseShear.y)} kN</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Utilization</p>
                <p className="text-2xl font-bold">{formatNumber(results.design.utilization.max * 100)}%</p>
                <p className="text-xs text-gray-500">Design efficiency</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gauge className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <Progress 
                value={results.design.utilization.max * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Average: {formatNumber(results.design.utilization.average * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">General Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Project:</span>
                  <span className="font-medium">{results.general.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Analysis Date:</span>
                  <span>{results.general.analysisDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Building Code:</span>
                  <span>{results.general.buildingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={getStatusBadgeVariant(results.general.status)}>
                    {results.general.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Model Information</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Elements:</span>
                  <span className="font-medium">{results.general.totalElements}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nodes:</span>
                  <span className="font-medium">{results.general.totalNodes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convergence:</span>
                  <Badge variant={results.general.convergence ? "default" : "destructive"}>
                    {results.general.convergence ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Iterations:</span>
                  <span>{results.general.iterations}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Quality Assessment</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Overall Rating:</span>
                  <Badge variant={getStatusBadgeVariant(results.quality.overallRating)}>
                    {results.quality.overallRating}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Checks Passed:</span>
                  <span className="font-medium">
                    {results.quality.checks.filter(c => c.status === 'pass').length}/{results.quality.checks.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-medium">Rp {results.economics.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost/m²:</span>
                  <span>Rp {results.economics.costPerSquareMeter.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilization Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Structural Analysis Tab
  const renderStructuralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Modal Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="frequency" fill="#8884d8" name="Frequency (Hz)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Displacement Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Maximum Displacement</h4>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Value:</span>
                    <span className="ml-2 font-medium">{formatNumber(results.structural.maxDisplacement.value)} mm</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Direction:</span>
                    <span className="ml-2 font-medium">{results.structural.maxDisplacement.direction}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Location:</span>
                    <span className="ml-2 font-medium">{results.structural.maxDisplacement.location}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Allowable:</span>
                    <span className="ml-2 font-medium">{formatNumber(results.structural.maxDisplacement.allowable)} mm</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={results.structural.maxDisplacement.ratio * 100} className="h-2" />
                  <span className="text-xs text-blue-600 mt-1 block">
                    Utilization: {formatNumber(results.structural.maxDisplacement.ratio * 100)}%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900">Maximum Stress</h4>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-red-700">Value:</span>
                    <span className="ml-2 font-medium">{formatNumber(results.structural.maxStress.value)} MPa</span>
                  </div>
                  <div>
                    <span className="text-red-700">Type:</span>
                    <span className="ml-2 font-medium">{results.structural.maxStress.type}</span>
                  </div>
                  <div>
                    <span className="text-red-700">Location:</span>
                    <span className="ml-2 font-medium">{results.structural.maxStress.location}</span>
                  </div>
                  <div>
                    <span className="text-red-700">Allowable:</span>
                    <span className="ml-2 font-medium">{formatNumber(results.structural.maxStress.allowable)} MPa</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={results.structural.maxStress.ratio * 100} className="h-2" />
                  <span className="text-xs text-red-600 mt-1 block">
                    Utilization: {formatNumber(results.structural.maxStress.ratio * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Seismic Analysis Tab  
  const renderSeismicTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Spectrum Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={seismicData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="parameter" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Value"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seismic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Base Shear</h4>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">X-Direction:</span>
                    <span className="ml-2 font-medium">{formatNumber(results.seismic.baseShear.x)} kN</span>
                  </div>
                  <div>
                    <span className="text-green-700">Y-Direction:</span>
                    <span className="ml-2 font-medium">{formatNumber(results.seismic.baseShear.y)} kN</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-green-700">Total:</span>
                    <span className="ml-2 font-medium text-lg">{formatNumber(results.seismic.baseShear.total)} kN</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900">Story Drift</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Maximum:</span>
                    <span className="font-medium">{formatNumber(results.seismic.storyDrift.max * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Allowable:</span>
                    <span className="font-medium">{formatNumber(results.seismic.storyDrift.allowable * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Location:</span>
                    <span className="font-medium">{results.seismic.storyDrift.location}</span>
                  </div>
                  <Progress 
                    value={(results.seismic.storyDrift.max / results.seismic.storyDrift.allowable) * 100} 
                    className="h-2 mt-2" 
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900">Torsional Irregularity</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Status:</span>
                    <Badge variant={results.seismic.torsion.irregularity ? "destructive" : "default"}>
                      {results.seismic.torsion.irregularity ? "Irregular" : "Regular"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Ratio:</span>
                    <span className="font-medium">{formatNumber(results.seismic.torsion.ratio)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Design Tab
  const renderDesignTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reinforcement Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="beams" className="w-full">
              <TabsList>
                <TabsTrigger value="beams">Beams</TabsTrigger>
                <TabsTrigger value="columns">Columns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="beams">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Element ID</th>
                        <th className="text-left p-2">Top Reinf. (cm²)</th>
                        <th className="text-left p-2">Bottom Reinf. (cm²)</th>
                        <th className="text-left p-2">Stirrups (cm²/m)</th>
                        <th className="text-left p-2">Utilization (%)</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.design.reinforcement.beams.slice(0, 10).map((beam) => (
                        <tr key={beam.id} className="border-b">
                          <td className="p-2 font-medium">{beam.id}</td>
                          <td className="p-2">{formatNumber(beam.longitudinal.top)}</td>
                          <td className="p-2">{formatNumber(beam.longitudinal.bottom)}</td>
                          <td className="p-2">{formatNumber(beam.transverse)}</td>
                          <td className="p-2">{formatNumber(beam.utilization * 100)}</td>
                          <td className="p-2">
                            <Badge variant={beam.utilization > 0.8 ? "destructive" : beam.utilization > 0.6 ? "secondary" : "default"}>
                              {beam.utilization > 0.8 ? "High" : beam.utilization > 0.6 ? "Medium" : "Low"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="columns">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Element ID</th>
                        <th className="text-left p-2">Longitudinal (cm²)</th>
                        <th className="text-left p-2">Transverse (cm²/m)</th>
                        <th className="text-left p-2">Utilization (%)</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.design.reinforcement.columns.slice(0, 10).map((column) => (
                        <tr key={column.id} className="border-b">
                          <td className="p-2 font-medium">{column.id}</td>
                          <td className="p-2">{formatNumber(column.longitudinal)}</td>
                          <td className="p-2">{formatNumber(column.transverse)}</td>
                          <td className="p-2">{formatNumber(column.utilization * 100)}</td>
                          <td className="p-2">
                            <Badge variant={column.utilization > 0.8 ? "destructive" : column.utilization > 0.6 ? "secondary" : "default"}>
                              {column.utilization > 0.8 ? "High" : column.utilization > 0.6 ? "Medium" : "Low"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Quality & Economics Tab
  const renderQualityEconomicsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quality Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {results.quality.checks.map((check, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{check.category}</h4>
                      <p className="text-xs text-gray-600 mt-1">{check.description}</p>
                      {check.value !== undefined && check.limit !== undefined && (
                        <div className="mt-2 text-xs">
                          <span>Value: {formatNumber(check.value)}</span>
                          <span className="mx-2">|</span>
                          <span>Limit: {formatNumber(check.limit)}</span>
                        </div>
                      )}
                      {check.recommendation && (
                        <p className="text-xs text-blue-600 mt-1">{check.recommendation}</p>
                      )}
                    </div>
                    <Badge variant={getStatusBadgeVariant(check.status)} className="ml-2">
                      {check.status === 'pass' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {check.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {check.status === 'fail' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {check.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Material Quantities</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Concrete:</span>
                    <div className="text-right">
                      <div>{formatNumber(results.economics.materialQuantities.concrete.volume)} m³</div>
                      <div className="text-xs">Rp {results.economics.materialQuantities.concrete.cost.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Steel:</span>
                    <div className="text-right">
                      <div>{formatNumber(results.economics.materialQuantities.steel.weight)} kg</div>
                      <div className="text-xs">Rp {results.economics.materialQuantities.steel.cost.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Formwork:</span>
                    <div className="text-right">
                      <div>{formatNumber(results.economics.materialQuantities.formwork.area)} m²</div>
                      <div className="text-xs">Rp {results.economics.materialQuantities.formwork.cost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Cost Summary</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Project Cost:</span>
                    <span className="font-bold text-lg">Rp {results.economics.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Cost per m²:</span>
                    <span className="font-medium">Rp {results.economics.costPerSquareMeter.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Export Options */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analysis Results Dashboard</h2>
          <p className="text-gray-600">{results.general.projectName} - {results.general.analysisDate}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('word')}>
            <FileText className="h-4 w-4 mr-2" />
            Word
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {results.general.status === 'warning' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Analysis completed with warnings. Please review the results carefully.
          </AlertDescription>
        </Alert>
      )}

      {results.general.status === 'failed' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Analysis failed or contains errors. Please check the input data and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structural">Structural</TabsTrigger>
          <TabsTrigger value="seismic">Seismic</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="quality">Quality & Cost</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
        <TabsContent value="structural">{renderStructuralTab()}</TabsContent>
        <TabsContent value="seismic">{renderSeismicTab()}</TabsContent>
        <TabsContent value="design">{renderDesignTab()}</TabsContent>
        <TabsContent value="quality">{renderQualityEconomicsTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveResultsDashboard;