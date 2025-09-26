import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { RotateCcw } from 'lucide-react';

// Import 3D components
import { Enhanced3DScene } from './3d/Enhanced3DScene';

// Import performance components
import PerformanceMonitor from './performance/PerformanceMonitor';
import { 
  SuspenseWrapper, 
  LazyExportManager,
  LazyCalculationEngineTest
} from './performance/OptimizedComponents';

// Import form component
import EnhancedInputForm from './components/EnhancedInputForm';

// Import validation and analysis modules
import { validateStructuralModel, ValidationResult } from '../../utils/validation';
import { performStructuralAnalysis } from '../../utils/structuralAnalysis';

// Import interfaces and types
import * as Interfaces from './interfaces';

export default function CompleteStructuralAnalysisSystem() {
  // State management
  const [activeTab, setActiveTab] = useState('input');
  const [geometry, setGeometry] = useState<Interfaces.Geometry>({
    nodes: [],
    elements: []
  });
  const [materials, setMaterials] = useState<Interfaces.Materials>({
    concrete: { fc: 25, fy: 400, Es: 200000 },
    steel: { fy: 400, fu: 550, Es: 200000 }
  });
  const [loads, setLoads] = useState<Interfaces.Loads>({
    deadLoads: [],
    liveLoads: [],
    seismicLoads: []
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analysis function
  const handleAnalyze = useCallback(async () => {
    if (!geometry.nodes.length || !geometry.elements.length) {
      setError('Please define geometry before analysis');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Validate model
      const validation = validateStructuralModel({ geometry, materials, loads });
      setValidationResult(validation);

      if (!validation.isValid) {
        throw new Error(validation.errors?.[0] || 'Model validation failed');
      }

      // Perform analysis
      const results = await performStructuralAnalysis({
        geometry,
        materials,
        loads
      });

      setAnalysisResults(results);
      setActiveTab('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [geometry, materials, loads]);

  // Reset function
  const handleReset = useCallback(() => {
    setGeometry({ nodes: [], elements: [] });
    setMaterials({
      concrete: { fc: 25, fy: 400, Es: 200000 },
      steel: { fy: 400, fu: 550, Es: 200000 }
    });
    setLoads({ deadLoads: [], liveLoads: [], seismicLoads: [] });
    setAnalysisResults(null);
    setValidationResult({ isValid: true });
    setError(null);
    setActiveTab('input');
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Structural Analysis System</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !geometry.nodes.length}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Structure'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Error:</div>
          <div className="text-red-700">{error}</div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResults}>Results</TabsTrigger>
          <TabsTrigger value="visualization" disabled={!analysisResults}>3D View</TabsTrigger>
          <TabsTrigger value="export" disabled={!analysisResults}>Export</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Structure Definition</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedInputForm
                geometry={geometry}
                materials={materials}
                loads={loads}
                onGeometryChange={setGeometry}
                onMaterialsChange={setMaterials}
                onLoadsChange={setLoads}
                validationResult={validationResult}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Max Displacement</div>
                    <div className="text-2xl font-bold text-blue-700">
                      {analysisResults.maxDisplacement?.toFixed(2) || 'N/A'} mm
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-900">Max Stress</div>
                    <div className="text-2xl font-bold text-green-700">
                      {analysisResults.maxStress?.toFixed(2) || 'N/A'} MPa
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-orange-900">Safety Factor</div>
                    <div className="text-2xl font-bold text-orange-700">
                      {analysisResults.safetyFactor?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                </div>
                
                {analysisResults.details && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Detailed Results</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(analysisResults.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 3D Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>3D Structure Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full border rounded-lg bg-gray-50">
                {analysisResults ? (
                  <Enhanced3DScene
                    geometry={geometry}
                    analysisResults={analysisResults}
                    materials={materials}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Run analysis to view 3D visualization
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Project & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <SuspenseWrapper message="Loading Export Manager...">
                <LazyExportManager 
                  analysisResults={analysisResults}
                />
              </SuspenseWrapper>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceMonitor showDetails={true} />
            
            <Card>
              <CardHeader>
                <CardTitle>Analysis Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Web Worker Support</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Heavy calculations are performed in background threads to keep UI responsive.
                    </p>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {typeof Worker !== 'undefined' ? 'Supported' : 'Not Supported'}
                    </Badge>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Optimizations Active</h4>
                    <div className="space-y-1 text-sm text-green-800">
                      <div>• React.memo for component optimization</div>
                      <div>• Lazy loading for code splitting</div>
                      <div>• Web Workers for calculations</div>
                      <div>• Performance monitoring</div>
                    </div>
                  </div>

                  {isAnalyzing && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Analysis Status</h4>
                      <div className="text-sm text-yellow-800">
                        Analysis in progress... Performance metrics will be available after completion.
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}