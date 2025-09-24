import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Structure3D } from '../../types/structural';
import StructureViewer from './3d/StructureViewer';
import { Enhanced3DViewer } from './3d/Advanced3DViewer';
import { ResponseSpectrumChart } from './charts/ResponseSpectrumChart';
import ForceDiagram from './charts/ForceDiagram';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity } from 'lucide-react';
import { AlertCircle, RotateCcw, FileText } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { ReportGenerator } from './ReportGenerator';
import ComprehensiveResultsDashboard from './results/ComprehensiveResultsDashboard';
import generateDemoResults from './results/demoResultsData';
import ProjectManager from './project/ProjectManager';
import { 
  StructuralAnalysisErrorBoundary, 
  FormErrorBoundary,
  VisualizationErrorBoundary 
} from '../common/ErrorBoundary';
import CalculationEngineTest from '../test/CalculationEngineTest';

// Import forms
import { 
  ProjectInfoForm, 
  GeometryForm, 
  MaterialForm, 
  LoadsForm, 
  SeismicForm 
} from './forms';

// Import enhanced validation components
import EnhancedInputForm from './components/EnhancedInputForm';

// Import modul validasi dan analisis
import { validateStructuralModel, ValidationResult } from '../../utils/validation';
import { performStructuralAnalysis, AnalysisResult } from '../../utils/structuralAnalysis';

// Import all interfaces and types
import { 
  ProjectInfo, 
  Geometry, 
  MaterialProperties, 
  Loads, 
  SeismicParameters
} from './interfaces';

import { Element } from '../../types/structural';


export default function CompleteStructuralAnalysisSystem() {
  const storageKey = 'sas_state_v1';
  
  // State Management
  const [projectInfo, setProjectInfo] = useState<Interfaces.ProjectInfo>({ 
    name: 'Proyek Gudang', 
    location: 'Jakarta', 
    buildingFunction: 'warehouse', 
    riskCategory: 'II' 
  });
  
  const [geometry, setGeometry] = useState<Interfaces.Geometry>({ 
    length: 50, 
    width: 30, 
    heightPerFloor: 4, 
    numberOfFloors: 3, 
    baySpacingX: 6, 
    baySpacingY: 7.5,
    columnGridX: 8, 
    columnGridY: 4 
  });
  
  const [materials, setMaterials] = useState<Interfaces.MaterialProperties>({ 
    fc: 25, 
    ec: 4700 * Math.sqrt(25), 
    poissonConcrete: 0.2, 
    densityConcrete: 2400, 
    fy: 400, 
    fu: 550, 
    es: 200000, 
    fySteel: 250, 
    fuSteel: 410, 
    crackingMoment: 0, 
    effectiveMomentInertia: 0 
  });
  
  const [loads, setLoads] = useState<Interfaces.Loads>({ 
    deadLoad: 5, // kN/m²
    liveLoad: 4, // kN/m²
    roofLiveLoad: 1, // kN/m²
    partitionLoad: 1, // kN/m²
    claddingLoad: 0.5, // kN/m²
    windSpeed: 30 // m/s
  });
  
  const [seismicParams, setSeismicParams] = useState<Interfaces.SeismicParameters>({ 
    ss: 0.8, 
    s1: 0.3, 
    fa: 1.2, 
    fv: 1.8, 
    sds: 0, 
    sd1: 0, 
    siteClass: 'SD', 
    importance: 1.0, 
    r: 8, 
    cd: 5.5, 
    omega: 3, 
    tl: 12, 
    ts: 0, 
    t0: 0,
    isSeismic: true,
    zoneFactor: 0.3,
    soilType: 'Sedang',
    responseModifier: 6.5,
    category: 'D'
  });

  // State untuk validasi dan analisis
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  
    // State untuk validasi dan analisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  
  // State untuk visualisasi 3D
  const [structure3D, setStructure3D] = useState<Structure3D>({ 
    nodes: [], 
    elements: [] 
  });
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'both'>('solid');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  
  // State tambahan
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string; severity: 'error' | 'warning' | 'info' }[]>([]);
  const [reinforcementDetails, setReinforcementDetails] = useState<Interfaces.ReinforcementDetail | null>(null);
  const [serviceabilityResults, setServiceabilityResults] = useState<Interfaces.ServiceabilityCheck | null>(null);
  const [responseSpectrumData, setResponseSpectrumData] = useState<Interfaces.ResponseSpectrumPoint[]>([]);
  const [costEstimate, setCostEstimate] = useState<Interfaces.CostEstimate | null>(null);
  const [frameAnalysis, setFrameAnalysis] = useState<Interfaces.FrameAnalysisResult | null>(null);
  const [lateralForces, setLateralForces] = useState<Interfaces.LateralForce[] | null>(null);
  const [baseShear, setBaseShear] = useState<Interfaces.BaseShearSummary | null>(null);
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('input');
  const [error, setError] = useState<string | null>(null);

  // State untuk visualisasi
  const [responseSpectrum, setResponseSpectrum] = useState<Array<{period: number, acceleration: number}>>([
    { period: 0, acceleration: 0 },
    { period: 0.5, acceleration: 0.8 },
    { period: 1.0, acceleration: 1.2 },
    { period: 1.5, acceleration: 1.0 },
    { period: 2.0, acceleration: 0.7 },
  ]);
  
  const [momentDiagram, setMomentDiagram] = useState<Array<{position: number, value: number}>>([
    { position: 0, value: 0 },
    { position: 2, value: 50 },
    { position: 4, value: 0 },
    { position: 6, value: -30 },
    { position: 8, value: 0 },
  ]);
  
  const [shearDiagram, setShearDiagram] = useState<Array<{position: number, value: number}>>([
    { position: 0, value: 25 },
    { position: 2, value: 15 },
    { position: 4, value: -10 },
    { position: 6, value: -20 },
    { position: 8, value: -30 },
  ]);

  // Load saved state on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.projectInfo) setProjectInfo(saved.projectInfo);
      if (saved.geometry) setGeometry(saved.geometry);
      if (saved.materials) setMaterials(saved.materials);
      if (saved.loads) setLoads(saved.loads);
      if (saved.seismicParams) setSeismicParams(saved.seismicParams);
    } catch {}
  }, []);

  // Fungsi untuk menghasilkan struktur 3D
  const generate3DStructure = useCallback((geometryOverride?: Interfaces.Geometry): Structure3D => {
    const currentGeometry = geometryOverride || geometry;
    console.log('Generating 3D structure with geometry:', currentGeometry);
    
    // Validasi geometry
    if (!currentGeometry) {
      console.error('Geometry is not defined');
      return { nodes: [], elements: [] };
    }

    const { length, width, heightPerFloor, numberOfFloors, baySpacingX, baySpacingY } = currentGeometry;
    
    // Validasi input
    if (!length || !width || !heightPerFloor || !numberOfFloors || !baySpacingX || !baySpacingY) {
      console.error('Invalid geometry properties:', { length, width, heightPerFloor, numberOfFloors, baySpacingX, baySpacingY });
      return { nodes: [], elements: [] };
    }

    // Pastikan nilai positif
    const safeBaySpacingX = Math.max(0.1, baySpacingX);
    const safeBaySpacingY = Math.max(0.1, baySpacingY);
    const safeHeightPerFloor = Math.max(0.1, heightPerFloor);
    
    const columnGridX = Math.max(1, Math.floor(length / safeBaySpacingX));
    const columnGridY = Math.max(1, Math.floor(width / safeBaySpacingY));
    
    console.log(`Generating structure with grid: ${columnGridX}x${columnGridY} columns, ${numberOfFloors} floors`);
    
    // Fungsi pembantu untuk membandingkan koordinat dengan toleransi
    const compareCoords = (a: number, b: number) => Math.abs(a - b) < 0.001;
    
    // Generate nodes (titik-titik)
    const nodes: Array<{id: number, x: number, y: number, z: number, label?: string}> = [];
    let nodeId = 1;
    
    // Generate nodes untuk setiap lantai
    for (let floor = 0; floor <= numberOfFloors; floor++) {
      const z = floor * safeHeightPerFloor;
      
      // Generate nodes untuk kolom
      for (let i = 0; i <= columnGridX; i++) {
        for (let j = 0; j <= columnGridY; j++) {
          const x = i * safeBaySpacingX;
          const y = j * safeBaySpacingY;
          
          nodes.push({
            id: nodeId,
            x,
            y,
            z,
            label: `N${nodeId}`
          });
          
          nodeId++;
        }
      }
    }
    
    console.log(`Generated ${nodes.length} nodes`);
    
    // Generate elements (balok dan kolom)
    const elements: Array<{
      id: number;
      nodes: number[];
      section: { width: number; height: number };
      type?: 'column' | 'beam';
      material?: {
        color?: string;
        opacity?: number;
      };
    }> = [];
    
    let elementId = 1;
    const sectionSize = 0.3; // Ukuran penampang default
    const nodesPerFloor = (columnGridX + 1) * (columnGridY + 1);
    
    console.log(`Generating elements for ${numberOfFloors} floors...`);
    
    // Generate elements kolom
    for (let floor = 0; floor < numberOfFloors; floor++) {
      const baseNodeIndex = floor * nodesPerFloor;
      
      for (let i = 0; i <= columnGridX; i++) {
        for (let j = 0; j <= columnGridY; j++) {
          const nodeIndex = i * (columnGridY + 1) + j;
          const node1 = nodes[baseNodeIndex + nodeIndex];
          const node2 = nodes[baseNodeIndex + nodeIndex + nodesPerFloor];
          
          if (node1 && node2) {
            elements.push({
              id: elementId++,
              nodes: [node1.id, node2.id],
              section: { 
                width: sectionSize, 
                height: sectionSize 
              },
              type: 'column',
              material: {
                color: '#64748b', // Warna abu-abu untuk kolom
                opacity: 1.0
              }
            });
          } else {
            console.warn(`Failed to create column element between nodes:`, { node1, node2 });
          }
        }
      }
    }
    
    // Generate elements balok arah X
    for (let floor = 1; floor <= numberOfFloors; floor++) {
      const floorNodeIndex = floor * nodesPerFloor;
      
      for (let i = 0; i < columnGridX; i++) {
        for (let j = 0; j <= columnGridY; j++) {
          const node1Index = floorNodeIndex + i * (columnGridY + 1) + j;
          const node2Index = node1Index + (columnGridY + 1);
          
          const node1 = nodes[node1Index];
          const node2 = nodes[node2Index];
          
          if (node1 && node2) {
            elements.push({
              id: elementId++,
              nodes: [node1.id, node2.id],
              section: { 
                width: sectionSize * 0.7, 
                height: sectionSize 
              },
              type: 'beam',
              material: {
                color: '#94a3b8', // Warna abu-abu muda untuk balok
                opacity: 1.0
              }
            });
          } else {
            console.warn(`Failed to create X-beam element between nodes:`, { node1, node2 });
          }
        }
      }
    }
    
    // Generate elements balok arah Y
    for (let floor = 1; floor <= numberOfFloors; floor++) {
      const floorNodeIndex = floor * nodesPerFloor;
      
      for (let i = 0; i <= columnGridX; i++) {
        for (let j = 0; j < columnGridY; j++) {
          const node1Index = floorNodeIndex + i * (columnGridY + 1) + j;
          const node2Index = node1Index + 1;
          
          const node1 = nodes[node1Index];
          const node2 = nodes[node2Index];
          
          if (node1 && node2) {
            elements.push({
              id: elementId++,
              nodes: [node1.id, node2.id],
              section: { 
                width: sectionSize, 
                height: sectionSize * 0.7 
              },
              type: 'beam',
              material: {
                color: '#94a3b8', // Warna abu-abu muda untuk balok
                opacity: 1.0
              }
            });
          } else {
            console.warn(`Failed to create Y-beam element between nodes:`, { node1, node2 });
          }
        }
      }
    }
    
    console.log(`Generated ${elements.length} elements (${elements.filter(e => e.type === 'column').length} columns, ${elements.filter(e => e.type === 'beam').length} beams)`);
    
    return { nodes, elements };
  }, [geometry]);

  // Generate struktur 3D saat geometry berubah
  useEffect(() => {
    try {
      const structure = generate3DStructure();
      console.log('Generated 3D structure:', {
        nodes: structure.nodes.length,
        elements: structure.elements.length,
        sampleNode: structure.nodes[0],
        sampleElement: structure.elements[0]
      });
      setStructure3D(structure);
    } catch (error) {
      console.error('Error generating 3D structure:', error);
      // Set ke struktur kosong daripada null
      setStructure3D({ nodes: [], elements: [] });
    }
  }, [geometry, generate3DStructure]);

  // Fungsi untuk melakukan analisis struktur
  // Enhanced form submission handler with comprehensive validation
  const handleEnhancedFormSubmit = useCallback(async (data: {
    geometry: any;
    material: any;
    seismic?: any;
    options?: any;
  }) => {
    try {
      setIsAnalyzing(true);
      setAnalysisProgress(10);
      setError(null);
      setValidationErrors([]);

      console.log('Enhanced form data received:', data);

      // Update state with validated data
      const updatedGeometry = {
        length: data.geometry.length,
        width: data.geometry.width,
        heightPerFloor: data.geometry.heightPerFloor,
        numberOfFloors: data.geometry.numberOfFloors,
        baySpacingX: data.geometry.columnGridX || 6,
        baySpacingY: data.geometry.columnGridY || 7.5,
        columnGridX: Math.ceil(data.geometry.length / (data.geometry.columnGridX || 6)),
        columnGridY: Math.ceil(data.geometry.width / (data.geometry.columnGridY || 7.5))
      };

      const updatedMaterials = {
        fc: data.material.fc,
        ec: data.material.elasticModulus || 4700 * Math.sqrt(data.material.fc),
        poissonConcrete: data.material.poissonRatio || 0.2,
        densityConcrete: data.material.density || 2400,
        fy: data.material.fy,
        fu: data.material.fy * 1.25, // Estimate
        es: 200000,
        fySteel: 250,
        fuSteel: 410,
        crackingMoment: 0,
        effectiveMomentInertia: 0
      };

      const updatedSeismic = data.seismic ? {
        ss: data.seismic.ss,
        s1: data.seismic.s1,
        fa: 1.2, // Default
        fv: 1.8, // Default
        sds: data.seismic.ss * 1.2 * (2/3), // Simplified calculation
        sd1: data.seismic.s1 * 1.8 * (2/3), // Simplified calculation
        siteClass: data.seismic.siteClass,
        importance: data.seismic.importance,
        r: data.seismic.responseModification || 8,
        cd: data.seismic.deflectionAmplificationFactor || 5.5,
        omega: data.seismic.overstrengthFactor || 3,
        tl: 12,
        ts: 0,
        t0: 0,
        isSeismic: true,
        zoneFactor: data.seismic.ss, // Use ss as zone factor
        soilType: 'Sedang', // Default
        responseModifier: data.seismic.responseModification || 6.5,
        category: data.seismic.designCategory
      } : seismicParams;

      // Update states
      setGeometry(updatedGeometry);
      setMaterials(updatedMaterials);
      setSeismicParams(updatedSeismic);

      setAnalysisProgress(30);

      // Generate 3D structure with validated data
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UI
      generate3DStructure(updatedGeometry);
      
      setAnalysisProgress(50);

      // Perform structural analysis using existing logic
      const validation = validateStructuralModel({
        materials: {
          fc: updatedMaterials.fc,
          ec: updatedMaterials.ec,
          fy: updatedMaterials.fy
        },
        geometry: updatedGeometry,
        loads: loads,
        seismic: updatedSeismic.isSeismic ? {
          zoneFactor: updatedSeismic.zoneFactor,
          soilType: updatedSeismic.soilType,
          importanceFactor: updatedSeismic.importance,
          responseModifier: updatedSeismic.responseModifier
        } : undefined
      });

      setValidationResult(validation);
      
      if (!validation.isValid) {
        throw new Error(validation.message || 'Validation failed');
      }

      setAnalysisProgress(70);

      // Perform structural analysis
      const analysisResult = await performStructuralAnalysis({
        materials: updatedMaterials,
        geometry: updatedGeometry,
        loads: loads,
        seismic: updatedSeismic
      });

      setAnalysisProgress(90);

      // Generate all results
      const demoResults = generateDemoResults(updatedGeometry, updatedMaterials, loads, updatedSeismic);
      
      setAnalysisResults(analysisResult);
      setReinforcementDetails(demoResults.reinforcement);
      setServiceabilityResults(demoResults.serviceability);
      setResponseSpectrumData(demoResults.responseSpectrum);
      setCostEstimate(demoResults.cost);
      setFrameAnalysis(demoResults.frameAnalysis);
      setLateralForces(demoResults.lateralForces);
      setBaseShear(demoResults.baseShear);

      setAnalysisProgress(100);
      
      // Switch to results tab
      setActiveTab('results');
      
      console.log('Enhanced analysis completed successfully');

    } catch (error) {
      console.error('Enhanced analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat analisis');
      setValidationErrors([{
        field: 'general',
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat analisis',
        severity: 'error'
      }]);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [loads, seismicParams]);

  // Enhanced form error handler
  const handleEnhancedFormError = useCallback((errors: string[]) => {
    setValidationErrors(errors.map(error => ({
      field: 'form',
      message: error,
      severity: 'error' as const
    })));
    setError(`Terdapat ${errors.length} error pada form yang perlu diperbaiki`);
  }, []);

  const performAnalysis = useCallback(() => {
    // Generate model 3D terlebih dahulu
    generate3DStructure();
    
    // Validasi input
    const validation = validateStructuralModel({
      materials: {
        fc: materials.fc,
        ec: materials.ec,
        fy: materials.fy
      },
      geometry: {
        length: geometry.length,
        width: geometry.width,
        heightPerFloor: geometry.heightPerFloor,
        numberOfFloors: geometry.numberOfFloors
      },
      loads: {
        liveLoad: loads.liveLoad,
        deadLoad: loads.deadLoad
      },
      seismic: seismicParams.isSeismic ? {
        zoneFactor: seismicParams.zoneFactor,
        soilType: seismicParams.soilType,
        importanceFactor: seismicParams.importance,
        responseModifier: seismicParams.responseModifier || seismicParams.r
      } : undefined
    });

    setValidationResult(validation);
    
    if (!validation.isValid) {
      setAnalysisResults(null);
      // Tampilkan pesan error validasi
      if (validation.message) {
        console.error('Validation error:', validation.message);
        // Tambahkan pesan error ke state validationErrors
        setValidationErrors(prev => [...prev, {
          field: 'general',
          message: validation.message || 'Terjadi kesalahan validasi',
          severity: 'error'
        }]);
      }
      return;
    }
    
    // Lakukan analisis struktur
    setIsAnalyzing(true);
    setAnalysisProgress(30);
    
    try {
      // Simulasi proses analisis
      setTimeout(() => {
        const results = performStructuralAnalysis({
          materials: {
            fc: materials.fc,
            fy: materials.fy
          },
          geometry: {
            length: geometry.length,
            width: geometry.width,
            heightPerFloor: geometry.heightPerFloor,
            numberOfFloors: geometry.numberOfFloors
          },
          loads: {
            deadLoad: loads.deadLoad,
            liveLoad: loads.liveLoad
          },
          seismic: seismicParams.isSeismic ? {
            zoneFactor: seismicParams.zoneFactor,
            soilType: seismicParams.soilType,
            importanceFactor: seismicParams.importance,
            responseModifier: seismicParams.responseModifier || seismicParams.r
          } : undefined
        });
        
        setAnalysisResults(results);
        setAnalysisProgress(100);
        setIsAnalyzing(false);
        setActiveTab('visualization');
      }, 1500);
      
    } catch (error) {
      console.error('Analisis gagal:', error);
      setError('Terjadi kesalahan saat menganalisis struktur');
      setIsAnalyzing(false);
    }
  }, [geometry, materials, loads, seismicParams, generate3DStructure]);

  // Handler untuk error pada model 3D
  const handleModelError = useCallback((error: Error) => {
    console.error('Error loading 3D model:', error);
    setModelError('Gagal memuat model 3D. Silakan coba lagi.');
    setIsModelLoading(false);
  }, []);

  // Handler saat model selesai dimuat
  const handleModelLoad = useCallback(() => {
    console.log('3D model loaded successfully');
    setIsModelLoading(false);
    setModelError(null);
  }, []);

  // Props untuk StructureViewer
  const viewerProps = useMemo(() => ({
    showLabels,
    viewMode,
    onElementClick: (element: Element) => setSelectedElement(element),
    onLoad: handleModelLoad,
    onError: handleModelError,
    className: "border rounded-lg overflow-hidden",
    style: { height: '600px' }
  }), [showLabels, viewMode, handleModelLoad, handleModelError]);

  const renderVisualizationTab = () => {
    return (
      <TabsContent value="visualization" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Visualisasi Struktur</h3>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'solid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('solid')}
              disabled={isModelLoading || !!modelError}
            >
              3D View
            </Button>
            <Button
              variant={viewMode === 'wireframe' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('wireframe')}
              disabled={isModelLoading || !!modelError}
            >
              Wireframe
            </Button>
            <Button
              variant={showLabels ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
              disabled={isModelLoading || !!modelError}
            >
              {showLabels ? 'Sembunyikan Label' : 'Tampilkan Label'}
            </Button>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'solid' | 'wireframe' | 'both')}
              className="border rounded px-2 py-1 text-sm"
              disabled={isModelLoading || !!modelError}
            >
              <option value="solid">Solid</option>
              <option value="wireframe">Wireframe</option>
              <option value="both">Keduanya</option>
            </select>
          </div>
        </div>

        <Card className="relative">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Model 3D Struktur</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsModelLoading(true);
                    setModelError(null);
                  }}
                  disabled={isModelLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Muat Ulang
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {isModelLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-50 z-10">
                <div className="text-center p-4 bg-white rounded-lg shadow-md">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Memuat model 3D...</p>
                </div>
              </div>
            )}

            {modelError && (
              <div className="text-center p-4 text-red-600 bg-red-50 rounded">
                <p className="font-medium">Terjadi Kesalahan</p>
                <p className="text-sm">{modelError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setIsModelLoading(true);
                    setModelError(null);
                  }}
                >
                  Coba Lagi
                </Button>
              </div>
            )}

            <ErrorBoundary 
              fallback={
                <div className="text-center p-4 text-red-600">
                  <p>Gagal memuat visualisasi 3D. Silakan muat ulang halaman.</p>
                </div>
              }
              onError={handleModelError}
            >
              {structure3D ? (
                <div className="h-[500px] rounded-md overflow-hidden relative">
                  {/* Enhanced 3D Viewer with advanced features */}
                  <Enhanced3DViewer 
                    structure={{
                      nodes: structure3D.nodes.map(node => ({
                        id: String(node.id),
                        position: [node.x, node.y, node.z],
                        displacement: analysisResults?.nodeResults?.find(nr => nr.nodeId === node.id)?.displacement ? 
                          [
                            analysisResults.nodeResults.find(nr => nr.nodeId === node.id)?.displacement?.x || 0,
                            analysisResults.nodeResults.find(nr => nr.nodeId === node.id)?.displacement?.y || 0,
                            analysisResults.nodeResults.find(nr => nr.nodeId === node.id)?.displacement?.z || 0
                          ] : undefined,
                        forces: node.loads ? [node.loads.fx || 0, node.loads.fy || 0, node.loads.fz || 0] : undefined,
                        moments: node.loads ? [node.loads.mx || 0, node.loads.my || 0, node.loads.mz || 0] : undefined,
                        support: {
                          x: node.constraints?.x || false,
                          y: node.constraints?.y || false,
                          z: node.constraints?.z || false,
                          rx: node.constraints?.rx || false,
                          ry: node.constraints?.ry || false,
                          rz: node.constraints?.rz || false,
                        }
                      })),
                      elements: structure3D.elements.map(element => ({
                        id: String(element.id),
                        type: element.type || 'beam',
                        startNode: String(element.nodes[0]),
                        endNode: String(element.nodes[1]),
                        section: {
                          width: element.section?.width || 0.3,
                          height: element.section?.height || 0.5,
                          thickness: element.section?.area ? Math.sqrt(element.section.area) : undefined
                        },
                        material: (element.materialType === 'timber' || element.materialType === 'masonry') ? 'composite' : element.materialType || 'concrete',
                        utilization: element.analysisResults?.stressMax ? 
                          Math.min(element.analysisResults.stressMax / 25, 1.0) : undefined, // Normalize to 25 MPa
                        stresses: element.analysisResults ? {
                          max: element.analysisResults.stressMax || 0,
                          min: element.analysisResults.stressMin || 0,
                          vonMises: [element.analysisResults.stressMax || 0]
                        } : undefined
                      })),
                      loads: structure3D.nodes.filter(node => node.loads).map(node => ({
                        nodeId: String(node.id),
                        forces: [node.loads?.fx || 0, node.loads?.fy || 0, node.loads?.fz || 0],
                        moments: [node.loads?.mx || 0, node.loads?.my || 0, node.loads?.mz || 0]
                      })),
                      boundingBox: {
                        min: [
                          Math.min(...structure3D.nodes.map(n => n.x)) - 2,
                          Math.min(...structure3D.nodes.map(n => n.y)) - 2,
                          Math.min(...structure3D.nodes.map(n => n.z)) - 2
                        ],
                        max: [
                          Math.max(...structure3D.nodes.map(n => n.x)) + 2,
                          Math.max(...structure3D.nodes.map(n => n.y)) + 2,
                          Math.max(...structure3D.nodes.map(n => n.z)) + 2
                        ]
                      },
                      scale: 1.0
                    }}
                    analysisResults={analysisResults}
                    showDeformation={analysisResults ? true : false}
                    deformationScale={5.0}
                    showStress={analysisResults ? true : false}
                    showForces={true}
                    showLabels={showLabels}
                    viewMode={viewMode}
                    colorMode={analysisResults ? 'stress' : 'material'}
                    onElementSelect={(elementId) => {
                      const element = structure3D.elements.find(e => String(e.id) === elementId);
                      if (element) setSelectedElement(element);
                    }}
                    onNodeSelect={(nodeId) => {
                      console.log('Node selected:', nodeId);
                    }}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">
                  <p>Data struktur tidak tersedia. Silakan lakukan analisis terlebih dahulu.</p>
                </div>
              )}
            </ErrorBoundary>
            
            {/* Panel kontrol tambahan */}
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="font-medium mb-2">Kontrol Tampilan</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Tampilkan Label</span>
                </label>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Mode Tampilan:</span>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as 'solid' | 'wireframe' | 'both')}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="solid">Solid</option>
                    <option value="wireframe">Wireframe</option>
                    <option value="both">Keduanya</option>
                  </select>
                </div>
                
                {selectedElement && (
                  <div className="ml-auto bg-blue-50 p-2 rounded">
                    <h4 className="font-medium">Elemen Terpilih</h4>
                    <p className="text-sm">ID: {selectedElement.id}</p>
                    <p className="text-sm">Tipe: {selectedElement.type || 'Tidak Diketahui'}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {analysisResults && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Respons Spektrum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponseSpectrumChart 
                    data={responseSpectrum} 
                    width="100%" 
                    height="100%"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Diagram Momen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ForceDiagram 
                      data={momentDiagram}
                      title="Diagram Momen"
                      xAxisLabel="Posisi (m)"
                      yAxisLabel="Momen (kNm)"
                      lineColor="#3b82f6"
                      fillColor="#93c5fd"
                      fill={true}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Diagram Gaya Geser</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ForceDiagram 
                      data={shearDiagram}
                      title="Diagram Gaya Geser"
                      xAxisLabel="Posisi (m)"
                      yAxisLabel="Gaya Geser (kN)"
                      lineColor="#ef4444"
                      fillColor="#fca5a5"
                      fill={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </TabsContent>
    );
  };

  // Render tab list
  const renderTabList = () => {
    return (
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="input">Input</TabsTrigger>
        <TabsTrigger value="results" disabled={!analysisResults}>Hasil</TabsTrigger>
        <TabsTrigger value="visualization">Visualisasi</TabsTrigger>
        <TabsTrigger value="report" disabled={!analysisResults}>Laporan</TabsTrigger>
        <TabsTrigger value="test">Test Engine</TabsTrigger>
      </TabsList>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sistem Analisis Struktur</h1>
      
      {/* Project Manager */}
      <ProjectManager 
        onProjectChange={(project) => {
          if (project) {
            // Update form data from loaded project
            if (project.projectInfo) setProjectInfo(project.projectInfo);
            if (project.geometry) setGeometry(project.geometry);
            if (project.materials) setMaterials(project.materials);
            if (project.loads) setLoads(project.loads);
            if (project.seismicParams) setSeismicParams(project.seismicParams);
            if (project.analysisResults) setAnalysisResults(project.analysisResults);
          }
        }}
        onStateUpdate={(updates) => {
          // Handle state updates from the project manager
          console.log('State updated:', updates);
        }}
        className="mb-6"
      />
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {renderTabList()}
        
        {/* Tab Input */}
        <TabsContent value="input" className="space-y-6">
          <FormErrorBoundary>
            {/* Enhanced Input Form with Zod Validation */}
            <EnhancedInputForm
              onAnalyze={handleEnhancedFormSubmit}
              onError={handleEnhancedFormError}
              initialValues={{
                geometry: {
                  length: geometry.length,
                  width: geometry.width,
                  heightPerFloor: geometry.heightPerFloor,
                  numberOfFloors: geometry.numberOfFloors,
                  columnGridX: geometry.baySpacingX,
                  columnGridY: geometry.baySpacingY,
                  foundationDepth: 2
                },
                material: {
                  fc: materials.fc,
                  fy: materials.fy,
                  elasticModulus: materials.ec,
                  poissonRatio: materials.poissonConcrete,
                  density: materials.densityConcrete
                },
                seismic: seismicParams.isSeismic ? {
                  designCategory: seismicParams.category || 'C',
                  siteClass: seismicParams.siteClass || 'C',
                  ss: seismicParams.ss,
                  s1: seismicParams.s1,
                  importance: seismicParams.importance,
                  dampingRatio: 5,
                  responseModification: seismicParams.r,
                  overstrengthFactor: seismicParams.omega,
                  deflectionAmplificationFactor: seismicParams.cd
                } : undefined,
                options: {
                  analysisType: 'static',
                  includeNonlinear: false,
                  includeSecondOrder: false,
                  convergenceTolerance: 1e-6,
                  maxIterations: 100,
                  numberOfModes: 10
                }
              }}
              loading={isAnalyzing}
              disabled={false}
            />

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Progress Analisis
                      </span>
                      <span className="text-sm text-gray-500">
                        {analysisProgress}%
                      </span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      <span>
                        {analysisProgress < 30 && 'Memvalidasi input...'}
                        {analysisProgress >= 30 && analysisProgress < 50 && 'Membuat model 3D...'}
                        {analysisProgress >= 50 && analysisProgress < 70 && 'Memvalidasi struktur...'}
                        {analysisProgress >= 70 && analysisProgress < 90 && 'Menjalankan analisis...'}
                        {analysisProgress >= 90 && 'Menyelesaikan hasil...'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Validation Errors Display */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Ditemukan error validasi:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {validationErrors.slice(0, 5).map((error, index) => (
                        <li key={index}>
                          <span className="font-medium">{error.field}:</span> {error.message}
                        </li>
                      ))}
                      {validationErrors.length > 5 && (
                        <li className="text-gray-600">
                          ... dan {validationErrors.length - 5} error lainnya
                        </li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Legacy Forms (Hidden but kept for compatibility) */}
            <div className="hidden">
              <ProjectInfoForm 
                data={projectInfo}
                onChange={setProjectInfo}
                errors={[]}
              />
              <GeometryForm 
                data={geometry}
                onChange={setGeometry}
                errors={[]}
              />
              <MaterialForm 
                data={materials}
                onChange={setMaterials}
                errors={[]}
              />
              <LoadsForm 
                data={loads}
                onChange={setLoads}
                errors={[]}
              />
              <SeismicForm 
                data={seismicParams}
                onChange={setSeismicParams}
                errors={[]}
              />
            </div>
          </FormErrorBoundary>
        </TabsContent>
        
        {/* Tab Hasil */}
        <TabsContent value="results" className="space-y-6">
          {analysisResults ? (
            <div className="space-y-6">
              {/* Traditional Results Display */}
              <Card>
                <CardHeader>
                  <CardTitle>Traditional Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResultsDisplay results={analysisResults} />
                </CardContent>
              </Card>
              
              {/* Comprehensive Results Dashboard */}
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Results Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComprehensiveResultsDashboard 
                    results={generateDemoResults(projectInfo.name || "Current Project")}
                    onExport={(format) => {
                      console.log(`Exporting results as ${format.toUpperCase()}`);
                      // Implement actual export functionality here
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                Tidak ada hasil analisis yang tersedia. Silakan lakukan analisis terlebih dahulu.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Tab Visualisasi */}
        {renderVisualizationTab()}
        
        {/* Tab Laporan */}
        <TabsContent value="report" className="space-y-6">
          {analysisResults ? (
            <ReportGenerator 
              data={{
                projectInfo,
                geometry,
                materials,
                loads,
                seismicParams,
                analysisResults
              }}
            />
          ) : (
            <Alert>
              <AlertDescription>
                Tidak ada hasil analisis yang tersedia untuk dibuatkan laporan. Silakan lakukan analisis terlebih dahulu.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        {/* Tab Test Engine */}
        <TabsContent value="test" className="space-y-6">
          <CalculationEngineTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
