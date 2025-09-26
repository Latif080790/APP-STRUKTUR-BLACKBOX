/**
 * Basic Structural Analysis System - MVP Version
 * Version yang minimal dan functional
 */

import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, AlertCircle } from 'lucide-react';

// Import Error Boundaries
import { 
  StructuralAnalysisErrorBoundary, 
  FormErrorBoundary,
  VisualizationErrorBoundary 
} from '../common/ErrorBoundary';

// Import 3D Viewer
import Simple3DViewer from './3d/Simple3DViewer';

// Types sederhana
interface BasicProjectInfo {
  name: string;
  location: string;
  engineer: string;
}

interface BasicGeometry {
  length: number;
  width: number;
  height: number;
  floors: number;
  baysX: number;
  baysY: number;
}

interface BasicMaterials {
  fc: number; // concrete strength
  fy: number; // steel strength
}

interface BasicLoads {
  deadLoad: number;
  liveLoad: number;
}

interface BasicResults {
  maxMoment: number;
  maxShear: number;
  maxDeflection: number;
  isValid: boolean;
}

// Default values
const defaultProject: BasicProjectInfo = {
  name: 'Proyek Baru',
  location: 'Jakarta',
  engineer: 'Structural Engineer'
};

const defaultGeometry: BasicGeometry = {
  length: 20,
  width: 15,
  height: 3.5,
  floors: 3,
  baysX: 4,
  baysY: 3
};

const defaultMaterials: BasicMaterials = {
  fc: 25,
  fy: 400
};

const defaultLoads: BasicLoads = {
  deadLoad: 5.5,
  liveLoad: 4.0
};

export const BasicStructuralAnalysisSystem = () => {
  // State
  const [project, setProject] = useState<BasicProjectInfo>(defaultProject);
  const [geometry, setGeometry] = useState<BasicGeometry>(defaultGeometry);
  const [materials, setMaterials] = useState<BasicMaterials>(defaultMaterials);
  const [loads, setLoads] = useState<BasicLoads>(defaultLoads);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BasicResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  // Generate 3D Structure
  const generateStructure3D = useCallback(() => {
    const nodes: any[] = [];
    const elements: any[] = [];
    
    let nodeId = 1;
    let elementId = 1;
    
    // Generate grid nodes
    for (let floor = 0; floor <= geometry.floors; floor++) {
      for (let y = 0; y <= geometry.baysY; y++) {
        for (let x = 0; x <= geometry.baysX; x++) {
          nodes.push({
            id: nodeId++,
            x: (x * geometry.length) / geometry.baysX,
            y: floor * geometry.height,
            z: (y * geometry.width) / geometry.baysY
          });
        }
      }
    }
    
    // Generate columns
    const nodesPerFloor = (geometry.baysX + 1) * (geometry.baysY + 1);
    for (let floor = 0; floor < geometry.floors; floor++) {
      for (let y = 0; y <= geometry.baysY; y++) {
        for (let x = 0; x <= geometry.baysX; x++) {
          const bottomNode = floor * nodesPerFloor + y * (geometry.baysX + 1) + x + 1;
          const topNode = (floor + 1) * nodesPerFloor + y * (geometry.baysX + 1) + x + 1;
          
          elements.push({
            id: elementId++,
            type: 'column',
            nodes: [bottomNode, topNode],
            section: { width: 0.4, height: 0.4 },
            materialType: 'concrete'
          });
        }
      }
    }
    
    // Generate beams X-direction
    for (let floor = 1; floor <= geometry.floors; floor++) {
      for (let y = 0; y <= geometry.baysY; y++) {
        for (let x = 0; x < geometry.baysX; x++) {
          const node1 = (floor - 1) * nodesPerFloor + y * (geometry.baysX + 1) + x + 1;
          const node2 = (floor - 1) * nodesPerFloor + y * (geometry.baysX + 1) + x + 2;
          
          elements.push({
            id: elementId++,
            type: 'beam',
            nodes: [node1, node2],
            section: { width: 0.3, height: 0.5 },
            materialType: 'concrete'
          });
        }
      }
    }
    
    // Generate beams Y-direction
    for (let floor = 1; floor <= geometry.floors; floor++) {
      for (let y = 0; y < geometry.baysY; y++) {
        for (let x = 0; x <= geometry.baysX; x++) {
          const node1 = (floor - 1) * nodesPerFloor + y * (geometry.baysX + 1) + x + 1;
          const node2 = (floor - 1) * nodesPerFloor + (y + 1) * (geometry.baysX + 1) + x + 1;
          
          elements.push({
            id: elementId++,
            type: 'beam',
            nodes: [node1, node2],
            section: { width: 0.3, height: 0.5 },
            materialType: 'concrete'
          });
        }
      }
    }
    
    return { nodes, elements };
  }, [geometry]);

  // Simple analysis function
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simple calculations
      const area = geometry.length * geometry.width;
      const totalLoad = (loads.deadLoad + loads.liveLoad) * area;
      
      const results: BasicResults = {
        maxMoment: totalLoad * geometry.length / 8,
        maxShear: totalLoad / 2,
        maxDeflection: geometry.length / 250,
        isValid: true
      };
      
      setResults(results);
      setActiveTab('results');
      
    } catch (err) {
      setError(`Analysis failed: ${err}`);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  }, [geometry, loads]);

  return (
    <StructuralAnalysisErrorBoundary>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistem Analisis Struktur Sederhana
          </h1>
          <p className="text-gray-600">
            Analisis struktur beton bertulang untuk bangunan gedung
          </p>
        </div>

        {/* Progress */}
        {isAnalyzing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analisis sedang berjalan...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Input Data</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>Hasil Analisis</TabsTrigger>
            <TabsTrigger value="3d">Visualisasi 3D</TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <FormErrorBoundary>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Project Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Proyek</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nama Proyek</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={project.name}
                        onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lokasi</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={project.location}
                        onChange={(e) => setProject(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Engineer</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={project.engineer}
                        onChange={(e) => setProject(prev => ({ ...prev, engineer: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Geometry */}
                <Card>
                  <CardHeader>
                    <CardTitle>Geometri Struktur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Panjang (m)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          value={geometry.length}
                          onChange={(e) => setGeometry(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Lebar (m)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          value={geometry.width}
                          onChange={(e) => setGeometry(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tinggi Lantai (m)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-md"
                          value={geometry.height}
                          onChange={(e) => setGeometry(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Jumlah Lantai</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          value={geometry.floors}
                          onChange={(e) => setGeometry(prev => ({ ...prev, floors: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Materials */}
                <Card>
                  <CardHeader>
                    <CardTitle>Material</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">f'c (MPa)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          value={materials.fc}
                          onChange={(e) => setMaterials(prev => ({ ...prev, fc: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">fy (MPa)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded-md"
                          value={materials.fy}
                          onChange={(e) => setMaterials(prev => ({ ...prev, fy: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loads */}
                <Card>
                  <CardHeader>
                    <CardTitle>Beban</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Dead Load (kN/m²)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-md"
                          value={loads.deadLoad}
                          onChange={(e) => setLoads(prev => ({ ...prev, deadLoad: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Live Load (kN/m²)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded-md"
                          value={loads.liveLoad}
                          onChange={(e) => setLoads(prev => ({ ...prev, liveLoad: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
              
              {/* Run Analysis Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  onClick={runAnalysis} 
                  disabled={isAnalyzing}
                  size="lg"
                  className="px-8"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {isAnalyzing ? 'Menganalisis...' : 'Jalankan Analisis'}
                </Button>
              </div>
            </FormErrorBoundary>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Momen Maksimum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      {results.maxMoment.toFixed(2)} kN·m
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Gaya Geser Maksimum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {results.maxShear.toFixed(2)} kN
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Defleksi Maksimum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-orange-600">
                      {(results.maxDeflection * 1000).toFixed(1)} mm
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* 3D Visualization Tab */}
          <TabsContent value="3d">
            <VisualizationErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle>Visualisasi 3D Struktur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <Simple3DViewer 
                      structure={generateStructure3D()}
                      onElementClick={(element) => {
                        console.log('Element clicked:', element);
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </VisualizationErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </StructuralAnalysisErrorBoundary>
  );
};

export default BasicStructuralAnalysisSystem;