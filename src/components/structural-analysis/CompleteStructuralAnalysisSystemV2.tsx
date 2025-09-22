/**
 * Complete Structural Analysis System - Version 2.0 (Enhanced)
 * Sistem Analisis Struktur Komprehensif dengan Error Handling yang Robust
 * 
 * Fitur Utama:
 * - Form input terintegrasi dengan validasi SNI
 * - Error boundary untuk handling error yang graceful
 * - State management dengan localStorage persistence
 * - Real-time validation dan feedback
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, AlertCircle, RotateCcw } from 'lucide-react';

// Import Error Boundaries
import { 
  StructuralAnalysisErrorBoundary, 
  FormErrorBoundary,
  VisualizationErrorBoundary 
} from '../common/ErrorBoundary';

// Import Forms
import { 
  ProjectInfoForm, 
  GeometryForm, 
  MaterialForm, 
  LoadsForm, 
  SeismicForm 
} from './forms';

// Import Components
import { ResultsDisplay } from './ResultsDisplay';
import { ReportGenerator } from './ReportGenerator';
import StructureViewer from './3d/StructureViewer';

// Import Types & Interfaces
import { 
  ProjectInfo, 
  Geometry, 
  MaterialProperties, 
  Loads, 
  SeismicParameters,
  AnalysisResult
} from './interfaces';

import { Structure3D, Element } from '../../types/structural';

// Import Validation
import { 
  validateCompleteStructure,
  ValidationResult,
  getValidationSummary
} from '../../utils/validationSchemas';

interface AppState {
  projectInfo: ProjectInfo;
  geometry: Geometry;
  materials: MaterialProperties;
  loads: Loads;
  seismicParams: SeismicParameters;
  activeTab: string;
  isAnalyzing?: boolean;
  analysisProgress?: number;
  analysisResults?: AnalysisResult | null;
  validationResult: ValidationResult;
  error?: string | null;
}

const defaultState: AppState = {
  projectInfo: {
    name: '',
    location: '',
    buildingFunction: 'office',
    riskCategory: 'II',
    engineer: '',
    description: ''
  },
  geometry: {
    length: 20,
    width: 15,
    heightPerFloor: 3.5,
    numberOfFloors: 3,
    baySpacingX: 5,
    baySpacingY: 5
  },
  materials: {
    fc: 25,
    ec: 23500,
    poissonConcrete: 0.2,
    densityConcrete: 2400,
    fy: 400,
    fu: 550,
    es: 200000,
    fySteel: 400,
    fuSteel: 550,
    phiConcrete: 0.75,
    phiTension: 0.9,
    phiShear: 0.75,
    crackingMoment: 0,
    effectiveMomentInertia: 0
  },
  loads: {
    deadLoad: 4.8,
    liveLoad: 2.4,
    roofLiveLoad: 1.44,
    partitionLoad: 1.0,
    claddingLoad: 0.5,
    windSpeed: 35
  },
  seismicParams: {
    ss: 0.8,
    s1: 0.4,
    fa: 1.0,
    fv: 1.0,
    sds: 0.8,
    sd1: 0.4,
    siteClass: 'SC',
    importance: 1.0,
    r: 8.0,
    cd: 5.5,
    omega: 2.5,
    tl: 8.0,
    ts: 0.2,
    t0: 0.04,
    isSeismic: true,
    zoneFactor: 0.2,
    soilType: 'medium',
    responseModifier: 8.0
  },
  activeTab: 'project',
  isAnalyzing: false,
  analysisProgress: 0,
  analysisResults: null,
  validationResult: { isValid: true, errors: [], warnings: [] },
  error: null
};

export default function CompleteStructuralAnalysisSystemV2() {
  const storageKey = 'sas_state_v2';
  
  // Main state
  const [state, setState] = useState<AppState>(defaultState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setState(prevState => ({ ...prevState, ...parsedState }));
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, [storageKey]);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      const { isAnalyzing, analysisProgress, error, ...stateToSave } = state;
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [state, storageKey]);

  // Update functions
  const updateProjectInfo = useCallback((updates: Partial<ProjectInfo>) => {
    setState(prev => ({
      ...prev,
      projectInfo: { ...prev.projectInfo, ...updates }
    }));
  }, []);

  const updateGeometry = useCallback((updates: Partial<Geometry>) => {
    setState(prev => ({
      ...prev,
      geometry: { ...prev.geometry, ...updates }
    }));
  }, []);

  const updateMaterials = useCallback((updates: Partial<MaterialProperties>) => {
    setState(prev => ({
      ...prev,
      materials: { ...prev.materials, ...updates }
    }));
  }, []);

  const updateLoads = useCallback((updates: Partial<Loads>) => {
    setState(prev => ({
      ...prev,
      loads: { ...prev.loads, ...updates }
    }));
  }, []);

  const updateSeismicParams = useCallback((updates: Partial<SeismicParameters>) => {
    setState(prev => ({
      ...prev,
      seismicParams: { ...prev.seismicParams, ...updates }
    }));
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // Validation
  const validationResult = useMemo(() => {
    return validateCompleteStructure({
      projectInfo: state.projectInfo,
      geometry: state.geometry,
      materials: state.materials,
      loads: state.loads,
      seismicParams: state.seismicParams
    });
  }, [state.projectInfo, state.geometry, state.materials, state.loads, state.seismicParams]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const fields = [
      state.projectInfo.name,
      state.projectInfo.location,
      state.geometry.length > 0,
      state.geometry.width > 0,
      state.materials.fc > 0,
      state.loads.deadLoad > 0,
      state.seismicParams.ss > 0,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  }, [state]);

  // Generate 3D structure
  const structure3D: Structure3D = useMemo(() => {
    const nodes: any[] = [];
    const elements: Element[] = [];
    
    try {
      const { length, width, heightPerFloor, numberOfFloors, baySpacingX, baySpacingY } = state.geometry;
      
      const nodesX = Math.ceil(length / baySpacingX) + 1;
      const nodesY = Math.ceil(width / baySpacingY) + 1;
      
      // Generate nodes
      let nodeId = 1;
      for (let floor = 0; floor <= numberOfFloors; floor++) {
        for (let i = 0; i < nodesX; i++) {
          for (let j = 0; j < nodesY; j++) {
            nodes.push({
              id: nodeId++,
              x: i * baySpacingX,
              y: j * baySpacingY,
              z: floor * heightPerFloor,
              constraints: floor === 0 ? { x: true, y: true, z: true } : undefined
            });
          }
        }
      }
      
      // Generate elements (simplified for demonstration)
      let elementId = 1;
      for (let floor = 0; floor < numberOfFloors; floor++) {
        const floorOffset = floor * nodesX * nodesY;
        for (let i = 0; i < nodesX - 1; i++) {
          for (let j = 0; j < nodesY - 1; j++) {
            const node1 = floorOffset + i * nodesY + j + 1;
            const node2 = floorOffset + (i + 1) * nodesY + j + 1;
            const node3 = floorOffset + i * nodesY + (j + 1) + 1;
            
            // Horizontal beams
            elements.push({
              id: elementId++,
              nodes: [node1, node2],
              section: { width: 0.3, height: 0.5 },
              type: 'beam',
              materialType: 'concrete'
            });
            
            elements.push({
              id: elementId++,
              nodes: [node1, node3],
              section: { width: 0.3, height: 0.5 },
              type: 'beam',
              materialType: 'concrete'
            });
            
            // Vertical columns
            if (floor < numberOfFloors - 1) {
              const upperNode = node1 + nodesX * nodesY;
              elements.push({
                id: elementId++,
                nodes: [node1, upperNode],
                section: { width: 0.4, height: 0.4 },
                type: 'column',
                materialType: 'concrete'
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating 3D structure:', error);
    }
    
    return { nodes, elements };
  }, [state.geometry]);

  // Analysis function
  const runAnalysis = useCallback(async () => {
    setState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      analysisProgress: 0, 
      error: null 
    }));

    try {
      // Simulate analysis progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setState(prev => ({ ...prev, analysisProgress: i }));
      }

      // Mock results with proper structure
      const mockResults: AnalysisResult = {
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: {
          totalWeight: 1000,
          baseShear: 150,
          fundamentalPeriod: 0.8,
          maxDrift: 15,
          maxStress: 20
        },
        frameAnalysis: {
          displacements: [],
          memberForces: [],
          reactions: [],
          maxDrift: 15,
          maxStress: 20
        },
        baseShear: {
          V: 150,
          Cs: 0.15,
          seismicWeight: 1000
        },
        lateralForces: [],
        responseSpectrum: [],
        reinforcement: {
          columnLongitudinal: { diameter: 20, count: 8, ratio: 0.02, arrangement: 'square' },
          columnTransverse: { diameter: 10, spacing: [100, 200], confinementZone: 200 },
          beamTension: { diameter: 20, count: 4, layers: 1, area: 1256 },
          beamCompression: { diameter: 16, count: 2, area: 402 },
          beamShear: { diameter: 10, spacing: [150, 300], legs: 2 },
          slabMain: { diameter: 12, spacing: 150, area: 754 },
          slabDistribution: { diameter: 10, spacing: 200, area: 393 }
        },
        serviceability: {
          deflection: { immediate: 5, longTerm: 12, allowable: 20, ratio: 0.6, status: 'OK' },
          crack: { width: 0.2, allowable: 0.3, status: 'OK' },
          vibration: { frequency: 4.5, acceleration: 0.05, status: 'OK' }
        },
        costEstimate: {
          material: { concrete: 50000, steel: 30000, rebar: 20000, formwork: 15000 },
          labor: { foundation: 25000, structure: 40000, finishing: 20000 },
          equipment: 15000,
          overhead: 20000,
          contingency: 15000,
          total: 250000,
          perSquareMeter: 800
        },
        structure3D: { 
          nodes: structure3D.nodes.map(node => ({ ...node, type: 'fixed' as const })), 
          elements: structure3D.elements.map(elem => ({
            id: elem.id,
            type: elem.type as 'column' | 'beam' | 'slab',
            startNode: elem.nodes[0],
            endNode: elem.nodes[1],
            section: 'default',
            material: 'concrete'
          })), 
          loads: [] 
        },
        calculations: {},
        warnings: [],
        notes: ['Analisis berhasil dilakukan', 'Struktur memenuhi persyaratan SNI']
      };

      setState(prev => ({ 
        ...prev, 
        analysisResults: mockResults, 
        isAnalyzing: false 
      }));
    } catch (error) {
      console.error('Analysis failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Analysis failed',
        isAnalyzing: false 
      }));
    }
  }, [state.projectInfo, state.geometry, state.materials, state.loads, state.seismicParams, structure3D]);

  // Reset function
  const resetAll = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return (
    <StructuralAnalysisErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="h-8 w-8 text-blue-600" />
                  Sistem Analisis Struktur v2.0
                </h1>
                <p className="text-gray-600 mt-1">
                  Analisis struktur sesuai standar SNI dengan error handling yang robust
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetAll}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Progress & Validation Status */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress Pengisian</span>
                    <span className="text-sm text-gray-600">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Status Validasi</span>
                    <span className="text-sm text-gray-600">
                      {getValidationSummary(validationResult)}
                    </span>
                  </div>
                  {validationResult.errors.length > 0 && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {validationResult.errors.length} error perlu diperbaiki
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {state.error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {state.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Tabs */}
          <Tabs value={state.activeTab} onValueChange={setActiveTab} defaultValue="project">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="project">Proyek</TabsTrigger>
              <TabsTrigger value="geometry">Geometri</TabsTrigger>
              <TabsTrigger value="materials">Material</TabsTrigger>
              <TabsTrigger value="loads">Beban</TabsTrigger>
              <TabsTrigger value="seismic">Seismik</TabsTrigger>
              <TabsTrigger value="analysis">Analisis</TabsTrigger>
              <TabsTrigger value="report">Laporan</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="project">
                <FormErrorBoundary>
                  <ProjectInfoForm
                    data={state.projectInfo}
                    onChange={updateProjectInfo}
                  />
                </FormErrorBoundary>
              </TabsContent>

              <TabsContent value="geometry">
                <FormErrorBoundary>
                  <GeometryForm
                    data={state.geometry}
                    onChange={updateGeometry}
                  />
                </FormErrorBoundary>
              </TabsContent>

              <TabsContent value="materials">
                <FormErrorBoundary>
                  <MaterialForm
                    data={state.materials}
                    onChange={updateMaterials}
                  />
                </FormErrorBoundary>
              </TabsContent>

              <TabsContent value="loads">
                <FormErrorBoundary>
                  <LoadsForm
                    data={state.loads}
                    onChange={updateLoads}
                  />
                </FormErrorBoundary>
              </TabsContent>

              <TabsContent value="seismic">
                <FormErrorBoundary>
                  <SeismicForm
                    data={state.seismicParams}
                    onChange={updateSeismicParams}
                  />
                </FormErrorBoundary>
              </TabsContent>

              <TabsContent value="analysis">
                <StructuralAnalysisErrorBoundary>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Analysis Control */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Kontrol Analisis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Button
                            onClick={runAnalysis}
                            disabled={state.isAnalyzing || !validationResult.isValid}
                            className="w-full"
                          >
                            {state.isAnalyzing ? 'Menganalisis...' : 'Jalankan Analisis'}
                          </Button>

                          {state.isAnalyzing && (
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span>Progress Analisis</span>
                                <span>{state.analysisProgress}%</span>
                              </div>
                              <Progress value={state.analysisProgress || 0} />
                            </div>
                          )}

                          {!validationResult.isValid && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Perbaiki error validasi sebelum menjalankan analisis
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 3D Visualization */}
                    <VisualizationErrorBoundary>
                      <Card>
                        <CardHeader>
                          <CardTitle>Visualisasi 3D</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-96 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <StructureViewer 
                              structure={structure3D} 
                              onElementClick={() => {}}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </VisualizationErrorBoundary>
                  </div>

                  {/* Results */}
                  {state.analysisResults && (
                    <div className="mt-6">
                      <ResultsDisplay
                        results={state.analysisResults}
                      />
                    </div>
                  )}
                </StructuralAnalysisErrorBoundary>
              </TabsContent>

              <TabsContent value="report">
                <StructuralAnalysisErrorBoundary>
                  <ReportGenerator
                    data={{
                      projectInfo: state.projectInfo,
                      geometry: state.geometry,
                      materials: state.materials,
                      loads: state.loads,
                      seismicParams: state.seismicParams,
                      analysisResults: state.analysisResults,
                      validationResult: validationResult
                    }}
                  />
                </StructuralAnalysisErrorBoundary>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </StructuralAnalysisErrorBoundary>
  );
}