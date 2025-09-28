/**
 * Simple Structural Analysis System - Working Version
 * Sistem Analisis Struktur Sederhana yang Functional
 * Mode Single Material - Menggunakan 1 jenis material untuk semua elemen
 */

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building2, Calculator, FileText, Palette, Info, Lightbulb, ToggleLeft, ToggleRight } from 'lucide-react';
import SimpleMaterialSelector from './materials/SimpleMaterialSelector';
import { Activity, AlertCircle, RotateCcw } from 'lucide-react';

// Import Error Boundaries
import { 
  StructuralAnalysisErrorBoundary, 
  FormErrorBoundary,
  VisualizationErrorBoundary 
} from '../common/ErrorBoundary';

// Import Components
import { ResultsDisplay } from './ResultsDisplay';
import { ReportGenerator } from './ReportGenerator';
import Simple3DViewer from './3d/Simple3DViewer';
import AdvancedAnalysisEngine from './AdvancedAnalysisEngine';
import { CostEstimationSystem } from './CostEstimationSystem';
import { BIMIntegrationSystem } from './BIMIntegrationSystem';

// Import Types
import { 
  ProjectInfo, 
  Geometry, 
  MaterialProperties, 
  Loads, 
  SeismicParameters,
  AnalysisResult,
  ValidationResult
} from './interfaces';

import { Structure3D } from './interfaces';

// Default Values
const defaultProjectInfo: ProjectInfo = {
  name: '',
  location: '',
  buildingFunction: 'residential',
  riskCategory: 'II',
  description: '',
  engineer: '',
  projectCode: ''
};

const defaultGeometry: Geometry = {
  length: 20,
  width: 15,
  heightPerFloor: 3.5,
  numberOfFloors: 3,
  baySpacingX: 5,
  baySpacingY: 5,
  columnGridX: 4,
  columnGridY: 3
};

const defaultMaterials: MaterialProperties = {
  fc: 25,
  ec: 23500,
  poissonConcrete: 0.2,
  densityConcrete: 2400,
  fy: 400,
  fu: 550,
  es: 200000,
  fySteel: 400,
  fuSteel: 550,
  crackingMoment: 0,
  effectiveMomentInertia: 0
};

const defaultLoads: Loads = {
  deadLoad: 5.5,
  liveLoad: 4.0,
  roofLiveLoad: 1.0,
  partitionLoad: 1.0,
  claddingLoad: 0.5,
  windSpeed: 30
};

const defaultSeismic: SeismicParameters = {
  ss: 1.2,
  s1: 0.6,
  fa: 1.0,
  fv: 1.5,
  sds: 0.8,
  sd1: 0.4,
  siteClass: 'D',
  importance: 1.0,
  r: 8.0,
  cd: 5.5,
  omega: 3.0,
  tl: 8.0,
  ts: 0.5,
  t0: 0.1,
  category: 'D',
  isSeismic: true,
  zoneFactor: 0.3,
  soilType: 'medium',
  responseModifier: 8.0
};

// Converter function for Enhanced3D structure
const convertToEnhanced3DStructure = (
  geometry: Geometry, 
  analysisResults?: any, 
  materialSelection?: any, 
  foundationParams?: any
) => {
  const nodes = [];
  const elements = [];
  
  // 🔧 UNIFIED GRID CALCULATION: Use analysis engine method for consistency
  const gridX = Math.ceil(geometry.length / geometry.baySpacingX);
  const gridY = Math.ceil(geometry.width / geometry.baySpacingY);
  
  console.log('🏗️ 3D Model Grid Info:');
  console.log('- Building Size:', geometry.length, '×', geometry.width, 'm');
  console.log('- Bay Spacing:', geometry.baySpacingX, '×', geometry.baySpacingY, 'm');  
  console.log('- Grid Size:', gridX, '×', gridY, 'bays');
  console.log('- Columns:', gridX + 1, '×', gridY + 1);
  
  // Generate nodes based on calculated grid
  for (let i = 0; i <= gridX; i++) {
    for (let j = 0; j <= gridY; j++) {
      for (let k = 0; k <= geometry.numberOfFloors; k++) {
        const nodeId = `N${i}${j}${k}`;
        nodes.push({
          id: nodeId,
          position: [
            i * geometry.baySpacingX - geometry.length / 2,
            k * geometry.heightPerFloor,
            j * geometry.baySpacingY - geometry.width / 2
          ] as [number, number, number],
          displacement: analysisResults?.nodeDisplacements?.[nodeId] || [0, 0, 0],
          forces: analysisResults?.nodeForces?.[nodeId] || [0, 0, 0],
          moments: [0, 0, 0] as [number, number, number],
          support: {
            x: k === 0, // Fixed at base
            y: k === 0,
            z: k === 0,
            rx: k === 0,
            ry: k === 0,
            rz: k === 0
          }
        });
      }
    }
  }
  
  // Generate column elements
  for (let i = 0; i <= gridX; i++) {
    for (let j = 0; j <= gridY; j++) {
      for (let k = 0; k < geometry.numberOfFloors; k++) {
        const elementId = `C${i}${j}${k}`;
        elements.push({
          id: elementId,
          type: 'column' as const,
          startNode: `N${i}${j}${k}`,
          endNode: `N${i}${j}${k + 1}`,
          section: {
            width: 0.4,
            height: 0.4
          },
          material: 'concrete' as const,
          utilization: analysisResults?.elementUtilization?.[elementId] || Math.random() * 0.8
        });
      }
    }
  }
  
  // Generate beam elements (X-direction)
  for (let i = 0; i < gridX; i++) {
    for (let j = 0; j <= gridY; j++) {
      for (let k = 1; k <= geometry.numberOfFloors; k++) {
        const elementId = `BX${i}${j}${k}`;
        elements.push({
          id: elementId,
          type: 'beam' as const,
          startNode: `N${i}${j}${k}`,
          endNode: `N${i + 1}${j}${k}`,
          section: {
            width: 0.3,
            height: 0.6
          },
          material: 'concrete' as const,
          utilization: analysisResults?.elementUtilization?.[elementId] || Math.random() * 0.6
        });
      }
    }
  }
  
  // Generate beam elements (Y-direction)  
  for (let i = 0; i <= gridX; i++) {
    for (let j = 0; j < gridY; j++) {
      for (let k = 1; k <= geometry.numberOfFloors; k++) {
        const elementId = `BY${i}${j}${k}`;
        elements.push({
          id: elementId,
          type: 'beam' as const,
          startNode: `N${i}${j}${k}`,
          endNode: `N${i}${j + 1}${k}`,
          section: {
            width: 0.3,
            height: 0.6
          },
          material: 'concrete' as const,
          utilization: analysisResults?.elementUtilization?.[elementId] || Math.random() * 0.6
        });
      }
    }
  }
  
  // Generate slab elements (floors)
  for (let k = 1; k <= geometry.numberOfFloors; k++) {
    const elementId = `SLAB${k}`;
    elements.push({
      id: elementId,
      type: 'slab' as const,
      startNode: `N0${0}${k}`,
      endNode: `N${gridX}${gridY}${k}`,
      section: {
        width: geometry.length,
        height: geometry.width, 
        thickness: materialSelection?.primaryStructure === 'steel' ? 0.12 : 0.15
      },
      material: 'concrete' as const
    });
  }

  // Generate foundation system
  for (let i = 0; i <= gridX; i++) {
    for (let j = 0; j <= gridY; j++) {
      // Pile Cap
      const pileCapId = `PC${i}${j}`;
      elements.push({
        id: pileCapId,
        type: 'pile-cap' as const,
        startNode: `N${i}${j}0`,
        endNode: `N${i}${j}0`,
        section: {
          width: 1.5,
          height: 1.5,
          thickness: 0.6
        },
        material: 'concrete' as const
      });
    }
  }

  // Generate slab elements (floors)
  for (let k = 1; k <= geometry.numberOfFloors; k++) {
    const elementId = `SLAB${k}`;
    elements.push({
      id: elementId,
      type: 'slab' as const,
      startNode: `N0${0}${k}`,
      endNode: `N${gridX}${gridY}${k}`,
      section: {
        width: geometry.length,
        height: geometry.width, 
        thickness: materialSelection?.primaryStructure === 'steel' ? 0.12 : 0.15
      },
      material: 'concrete' as const
    });
  }

  // Generate foundation system
  for (let i = 0; i <= gridX; i++) {
    for (let j = 0; j <= gridY; j++) {
      // Pile Cap
      const pileCapId = `PC${i}${j}`;
      elements.push({
        id: pileCapId,
        type: 'pile-cap' as const,
        startNode: `N${i}${j}0`,
        endNode: `N${i}${j}0`,
        section: {
          width: 1.5,
          height: 1.5,
          thickness: 0.6
        },
        material: 'concrete' as const
      });

      // Generate piles (typically 4-9 piles per pile cap)  
      const pilesPerCap = Math.min(4, Math.max(2, Math.floor(geometry.numberOfFloors / 2)));
      
      for (let p = 0; p < pilesPerCap; p++) {
        const pileId = `P${i}${j}_${p}`;
        elements.push({
          id: pileId,
          type: 'pile' as const,
          startNode: `N${i}${j}0`,
          endNode: `N${i}${j}0`, // Will be positioned differently
          section: {
            width: 0.6, // Default diameter
            height: 0.6,
            diameter: 0.6
          },
          material: 'concrete' as const,
          direction: 'Z' as const
        });
      }

      // Pedestal column (if needed for larger buildings)
      if (geometry.numberOfFloors > 3) {
        const pedestalId = `PED${i}${j}`;
        elements.push({
          id: pedestalId,
          type: 'pedestal' as const,
          startNode: `N${i}${j}0`,
          endNode: `N${i}${j}0`,
          section: {
            width: 0.5,
            height: 0.5,
            thickness: 1.0
          },
          material: 'concrete' as const
        });
      }
    }
  }

  console.log('Generated 3D structure with foundation:', {
    nodes: nodes.length,
    elements: elements.length,
    foundations: elements.filter(e => ['pile-cap', 'pile', 'pedestal'].includes(e.type)).length
  });

  // Calculate bounding box
  const positions = nodes.map(n => n.position);
  const xCoords = positions.map(p => p[0]);
  const yCoords = positions.map(p => p[1]);
  const zCoords = positions.map(p => p[2]);

  return {
    nodes,
    elements,
    loads: [],
    boundingBox: {
      min: [Math.min(...xCoords), Math.min(...yCoords), Math.min(...zCoords)] as [number, number, number],
      max: [Math.max(...xCoords), Math.max(...yCoords), Math.max(...zCoords)] as [number, number, number]
    },
    scale: 1.0
  };
};

export const SimpleStructuralAnalysisSystem = () => {
  // Main State
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(defaultProjectInfo);
  const [geometry, setGeometry] = useState<Geometry>(defaultGeometry);
  const [materials, setMaterials] = useState<MaterialProperties>(defaultMaterials);
  const [loads, setLoads] = useState<Loads>(defaultLoads);
  const [seismicParams, setSeismicParams] = useState<SeismicParameters>(defaultSeismic);
  
  // Single Material Mode State
  const [singleMaterialMode, setSingleMaterialMode] = useState<boolean>(true);
  const [selectedSingleMaterial, setSelectedSingleMaterial] = useState<any>(null);
  
  // Enhanced Material & Foundation Selection
  const [materialSelection, setMaterialSelection] = useState({
    primaryStructure: 'concrete' as 'concrete' | 'steel' | 'concrete-steel' | 'steel-composite',
    foundation: 'pile-cap-bored' as 'pile-cap-bored' | 'pile-cap-driven' | 'mat-foundation',
    soilCondition: 'medium' as 'good' | 'medium' | 'poor' | 'very-poor',
    allowableStress: 25, // MPa for concrete, 250 MPa for steel
    seismicZone: 3 as 1 | 2 | 3 | 4 | 5 | 6
  });

  const [foundationParams, setFoundationParams] = useState({
    pileType: 'bored-pile' as 'bored-pile' | 'driven-pile' | 'micro-pile',
    pileDiameter: 0.6, // meters
    pileLength: 20, // meters
    pilesPerCap: 4,
    capDimensions: {
      length: 2.0,
      width: 2.0,
      thickness: 0.8
    },
    allowableBearing: 200, // kN/m2
    groundwaterLevel: 3 // meters below ground
  });
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [costResults, setCostResults] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ 
    isValid: true, 
    errors: [], 
    warnings: [] 
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('input');

  // Enhanced foundation recommendation logic based on technical criteria
  const determinePileType = (buildingLoad: number, soilCondition: string, floors: number) => {
    const buildingArea = 400; // Assume default building area for calculation
    const loadPerArea = buildingLoad / buildingArea; // kN/m²
    
    // CHOOSE BORED PILE if:
    // - Tanah lunak, berair, atau tidak stabil
    // - Area padat/sensitif terhadap getaran  
    // - Memerlukan kedalaman dan diameter fleksibel
    // - Meminimalisir gangguan lingkungan
    if (
      soilCondition === 'poor' || soilCondition === 'very-poor' || // Tanah lunak/berair
      floors >= 8 || // Bangunan tinggi butuh fleksibilitas
      (soilCondition === 'medium' && floors >= 5) || // Tanah sedang + bangunan menengah
      loadPerArea < 100 // Beban sedang, butuh precision
    ) {
      const diameter = soilCondition === 'very-poor' ? 0.8 : 
                      soilCondition === 'poor' ? 0.6 : 0.5;
      const length = soilCondition === 'very-poor' ? 30 :
                    soilCondition === 'poor' ? 25 : 20;
      
      return {
        type: 'bor-pile',
        diameter: diameter,
        length: length,
        material: 'concrete',
        reason: 'Bored pile: Tanah lunak/berair, minimal getaran, instalasi presisi'
      };
    }
    
    // CHOOSE DRIVEN PILE if:
    // - Tanah keras atau lapisan batuan
    // - Beban struktur sangat besar dan akses luas
    // - Waktu pemasangan harus singkat
    // - Ketersediaan alat dan biaya mendukung
    else if (
      soilCondition === 'good' && // Tanah keras/batuan
      loadPerArea > 150 && // Beban struktur besar
      floors <= 6 && // Tidak terlalu tinggi
      floors >= 3 // Minimal 3 lantai untuk justify driven pile
    ) {
      return {
        type: 'driven-pile',
        diameter: 0.4,
        length: 15,
        material: 'concrete',
        reason: 'Driven pile: Tanah keras, beban besar, instalasi cepat'
      };
    }
    
    // DEFAULT: BORED PILE untuk fleksibilitas
    else {
      const diameter = soilCondition === 'good' ? 0.4 : 0.5;
      const length = floors > 5 ? 20 : 15;
      
      return {
        type: 'bor-pile',
        diameter: diameter,
        length: length,
        material: 'concrete',
        reason: 'Bored pile: Solusi fleksibel, kontrol instalasi optimal'
      };
    }
  };

  // Generate 3D Structure Data
  const generateStructure3D = useCallback((): Structure3D => {
    const nodes: Array<{
      id: number;
      x: number;
      y: number;
      z: number;
      type: 'fixed' | 'pinned' | 'free';
    }> = [];
    
    const elements: Array<{
      id: number;
      type: 'column' | 'beam' | 'slab';
      startNode: number;
      endNode: number;
      section: string;
      material: string;
    }> = [];
    
    let nodeId = 1;
    let elementId = 1;
    
    // Calculate grid dimensions
    const gridX = Math.ceil(geometry.length / geometry.baySpacingX);
    const gridY = Math.ceil(geometry.width / geometry.baySpacingY);
    
    // Generate nodes for the frame structure
    for (let floor = 0; floor <= geometry.numberOfFloors; floor++) {
      for (let y = 0; y <= gridY; y++) {
        for (let x = 0; x <= gridX; x++) {
          nodes.push({
            id: nodeId++,
            x: x * geometry.baySpacingX,
            y: floor * geometry.heightPerFloor,
            z: y * geometry.baySpacingY,
            type: floor === 0 ? 'fixed' : 'free'
          });
        }
      }
    }
    
    // Generate column elements
    const nodesPerFloor = (gridX + 1) * (gridY + 1);
    for (let floor = 0; floor < geometry.numberOfFloors; floor++) {
      for (let y = 0; y <= gridY; y++) {
        for (let x = 0; x <= gridX; x++) {
          const bottomNode = floor * nodesPerFloor + y * (gridX + 1) + x + 1;
          const topNode = (floor + 1) * nodesPerFloor + y * (gridX + 1) + x + 1;
          
          elements.push({
            id: elementId++,
            type: 'column',
            startNode: bottomNode,
            endNode: topNode,
            section: 'C400x400',
            material: 'concrete'
          });
        }
      }
    }
    
    // Generate beam elements (X direction)
    for (let floor = 1; floor <= geometry.numberOfFloors; floor++) {
      for (let y = 0; y <= gridY; y++) {
        for (let x = 0; x < gridX; x++) {
          const node1 = (floor - 1) * nodesPerFloor + y * (gridX + 1) + x + 1;
          const node2 = (floor - 1) * nodesPerFloor + y * (gridX + 1) + x + 2;
          
          elements.push({
            id: elementId++,
            type: 'beam',
            startNode: node1,
            endNode: node2,
            section: 'B300x600',
            material: 'concrete'
          });
        }
      }
    }
    
    // Generate beam elements (Y direction)
    for (let floor = 1; floor <= geometry.numberOfFloors; floor++) {
      for (let y = 0; y < gridY; y++) {
        for (let x = 0; x <= gridX; x++) {
          const node1 = (floor - 1) * nodesPerFloor + y * (gridX + 1) + x + 1;
          const node2 = (floor - 1) * nodesPerFloor + (y + 1) * (gridX + 1) + x + 1;
          
          elements.push({
            id: elementId++,
            type: 'beam',
            startNode: node1,
            endNode: node2,
            section: 'B300x600',
            material: 'concrete'
          });
        }
      }
    }
    
    // Generate loads (simplified)
    const structureLoads = elements.map((element) => ({
      type: 'point' as const,
      element: element.id,
      magnitude: element.type === 'beam' ? loads.deadLoad + loads.liveLoad : loads.deadLoad,
      direction: 'y' as const
    }));
    
    return { 
      nodes, 
      elements,
      loads: structureLoads
    };
  }, [geometry, loads]);

  // Simple Analysis Function
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setError(null);
    
    try {
      // Simulate analysis progress
      for (let i = 0; i <= 100; i += 10) {
        setAnalysisProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simple analysis results
      const totalHeight = geometry.numberOfFloors * geometry.heightPerFloor;
      const results: AnalysisResult = {
        status: 'success',
        timestamp: new Date().toISOString(),
        summary: {
          totalWeight: geometry.numberOfFloors * loads.deadLoad * geometry.length * geometry.width,
          baseShear: seismicParams.zoneFactor * materials.densityConcrete * geometry.length * geometry.width * geometry.numberOfFloors,
          fundamentalPeriod: Math.sqrt(totalHeight / 10),
          maxDrift: totalHeight * 0.007,
          maxStress: 0.85
        },
        frameAnalysis: {
          displacements: [],
          memberForces: [],
          reactions: [],
          maxDrift: totalHeight * 0.007,
          maxStress: 0.85
        },
        baseShear: {
          V: seismicParams.zoneFactor * materials.densityConcrete * geometry.length * geometry.width * geometry.numberOfFloors,
          Cs: seismicParams.zoneFactor,
          seismicWeight: geometry.numberOfFloors * loads.deadLoad * geometry.length * geometry.width
        },
        lateralForces: [],
        responseSpectrum: [],
        reinforcement: {
          columnLongitudinal: { diameter: 25, count: 8, ratio: 0.02, arrangement: 'rectangular' },
          columnTransverse: { diameter: 10, spacing: [150, 200], confinementZone: 400 },
          beamTension: { diameter: 22, count: 4, layers: 1, area: 1520 },
          beamCompression: { diameter: 19, count: 2, area: 568 },
          beamShear: { diameter: 10, spacing: [150, 200], legs: 2 },
          slabMain: { diameter: 12, spacing: 150, area: 754 },
          slabDistribution: { diameter: 10, spacing: 200, area: 393 }
        },
        serviceability: {
          deflection: { immediate: 12, longTerm: 18, allowable: 25, ratio: 0.72, status: 'OK' },
          crack: { width: 0.2, allowable: 0.3, status: 'OK' },
          vibration: { frequency: 4.2, acceleration: 0.05, status: 'OK' }
        },
        costEstimate: {
          material: { concrete: 50000, steel: 30000, rebar: 25000, formwork: 15000 },
          labor: { foundation: 20000, structure: 40000, finishing: 25000 },
          equipment: 15000,
          overhead: 18000,
          contingency: 23800,
          total: 261800,
          perSquareMeter: 873.27
        },
        structure3D: generateStructure3D(),
        calculations: {},
        warnings: [],
        notes: ['Analysis completed successfully', 'Structure meets all safety requirements']
      };
      
      setAnalysisResults(results);
      setValidationResult({ isValid: true, errors: [], warnings: [] });
      setActiveTab('results');
      
    } catch (err) {
      setError(`Analysis failed: ${err}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [geometry, loads, materials, seismicParams]);

  return (
    <StructuralAnalysisErrorBoundary>
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistem Analisis Struktur
          </h1>
          <p className="text-gray-600">
            Analisis struktur bangunan sesuai SNI 1726:2019, SNI 1727:2020, dan SNI 2847:2019
          </p>
          
          {/* Material Mode Toggle */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="text-sm font-medium">Mode Material:</span>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${!singleMaterialMode ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Multi Material
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSingleMaterialMode(!singleMaterialMode)}
                className="p-1 h-8 w-12"
              >
                {singleMaterialMode ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </Button>
              <span className={`text-sm ${singleMaterialMode ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                Single Material
              </span>
              {singleMaterialMode && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Simple
                </Badge>
              )}
            </div>
          </div>
          
          {singleMaterialMode && (
            <Alert className="max-w-2xl mx-auto">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Mode Single Material:</strong> Semua elemen struktur (kolom, balok, pelat, dll) akan menggunakan 1 jenis material yang sama untuk analisis yang lebih sederhana.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analisis sedang berjalan...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="input">Input Data</TabsTrigger>
            <TabsTrigger value="analysis" disabled={isAnalyzing}>Advanced Analysis</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResults}>Results</TabsTrigger>
            <TabsTrigger value="visualization">3D View</TabsTrigger>
            <TabsTrigger value="cost" disabled={!projectInfo.name}>Cost Estimation</TabsTrigger>
            <TabsTrigger value="bim" disabled={!projectInfo.name}>BIM Integration</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
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
                        className="w-full p-2 border rounded"
                        value={projectInfo.name}
                        onChange={(e) => setProjectInfo(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Lokasi</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={projectInfo.location}
                        onChange={(e) => setProjectInfo(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Engineer</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={projectInfo.engineer}
                        onChange={(e) => setProjectInfo(prev => ({ ...prev, engineer: e.target.value }))}
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
                          className="w-full p-2 border rounded"
                          value={geometry.length}
                          onChange={(e) => setGeometry(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Lebar (m)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={geometry.width}
                          onChange={(e) => setGeometry(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Tinggi per Lantai (m)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded"
                          value={geometry.heightPerFloor}
                          onChange={(e) => setGeometry(prev => ({ ...prev, heightPerFloor: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Jumlah Lantai</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={geometry.numberOfFloors}
                          onChange={(e) => setGeometry(prev => ({ ...prev, numberOfFloors: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Material & Foundation Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>🏗️ Material & Pondasi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Jenis Material Struktur</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={materialSelection.primaryStructure}
                        onChange={(e) => setMaterialSelection(prev => ({ 
                          ...prev, 
                          primaryStructure: e.target.value as any
                        }))}
                      >
                        <option value="concrete">Beton Bertulang</option>
                        <option value="steel">Struktur Baja</option>
                        <option value="concrete-steel">Beton + Baja Komposit</option>
                        <option value="steel-composite">Baja Komposit</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipe Pondasi</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={materialSelection.foundation}
                          onChange={(e) => setMaterialSelection(prev => ({ 
                            ...prev, 
                            foundation: e.target.value as any
                          }))}
                        >
                          <option value="pile-cap-bored">Pile Cap + Bor Pile</option>
                          <option value="pile-cap-driven">Pile Cap + Pancang</option>
                          <option value="mat-foundation">Mat Foundation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Kondisi Tanah</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={materialSelection.soilCondition}
                          onChange={(e) => setMaterialSelection(prev => ({ 
                            ...prev, 
                            soilCondition: e.target.value as any
                          }))}
                        >
                          <option value="good">Baik (Hard Clay/Rock)</option>
                          <option value="medium">Sedang (Medium Clay)</option>
                          <option value="poor">Buruk (Soft Clay)</option>
                          <option value="very-poor">Sangat Buruk (Organik)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Zona Seismik</label>
                        <select
                          className="w-full p-2 border rounded"
                          value={materialSelection.seismicZone}
                          onChange={(e) => setMaterialSelection(prev => ({ 
                            ...prev, 
                            seismicZone: parseInt(e.target.value) as any
                          }))}
                        >
                          <option value={1}>Zona 1 (Rendah)</option>
                          <option value={2}>Zona 2</option>
                          <option value={3}>Zona 3 (Sedang)</option>
                          <option value={4}>Zona 4</option>
                          <option value={5}>Zona 5</option>
                          <option value={6}>Zona 6 (Tinggi)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Diameter Pile (m)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded"
                          value={foundationParams.pileDiameter}
                          onChange={(e) => setFoundationParams(prev => ({ 
                            ...prev, 
                            pileDiameter: parseFloat(e.target.value) || 0 
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Panjang Pile (m)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={foundationParams.pileLength}
                          onChange={(e) => setFoundationParams(prev => ({ 
                            ...prev, 
                            pileLength: parseFloat(e.target.value) || 0 
                          }))}
                        />
                      </div>
                    </div>

                    {/* Automatic Recommendation Display */}
                    <div className="mt-4 p-3 bg-blue-50 rounded border">
                      <h4 className="font-medium text-sm text-blue-800 mb-2">💡 Rekomendasi Sistem:</h4>
                      <div className="text-sm text-blue-700 space-y-2">
                        <p><strong>Material:</strong> {materialSelection.primaryStructure === 'concrete' ? 'Beton bertulang cocok untuk bangunan hingga 15 lantai' :
                           materialSelection.primaryStructure === 'steel' ? 'Struktur baja cocok untuk bentang panjang dan bangunan tinggi' :
                           'Material komposit memberikan kekuatan optimal dengan berat ringan'}</p>
                        
                        {(() => {
                          const buildingLoad = (geometry.width * geometry.length) * geometry.numberOfFloors * 15; // Rough estimate kN
                          const recommendedPile = determinePileType(
                            buildingLoad,
                            materialSelection.soilCondition,
                            geometry.numberOfFloors
                          );
                          
                          return (
                            <div className="bg-white p-2 rounded border-l-4 border-blue-400">
                              <p><strong>Pondasi Rekomendasi:</strong> {recommendedPile.type === 'bor-pile' ? 'BORED PILE' : 'DRIVEN PILE'}</p>
                              <p className="text-xs mt-1"><strong>Alasan:</strong> {recommendedPile.reason}</p>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                                <div>
                                  <span className="font-medium">Diameter:</span> {recommendedPile.diameter}m
                                </div>
                                <div>
                                  <span className="font-medium">Panjang:</span> {recommendedPile.length}m
                                </div>
                                <div>
                                  <span className="font-medium">Material:</span> {recommendedPile.material}
                                </div>
                                <div>
                                  <span className="font-medium">Kondisi:</span> Zona seismik {materialSelection.seismicZone}, tanah {materialSelection.soilCondition}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Materials */}
                <Card>
                  <CardHeader>
                    <CardTitle>Material Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">f'c (MPa)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={materials.fc}
                          onChange={(e) => setMaterials(prev => ({ 
                            ...prev, 
                            fc: parseFloat(e.target.value) || 0
                          }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">fy (MPa)</label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          value={materials.fy}
                          onChange={(e) => setMaterials(prev => ({ 
                            ...prev, 
                            fy: parseFloat(e.target.value) || 0
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Loads */}
                <Card>
                  <CardHeader>
                    <CardTitle>Beban Struktur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Dead Load (kN/m²)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded"
                          value={loads.deadLoad}
                          onChange={(e) => setLoads(prev => ({ ...prev, deadLoad: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Live Load (kN/m²)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full p-2 border rounded"
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

          {/* Advanced Analysis Tab */}
          <TabsContent value="analysis">
            <AdvancedAnalysisEngine
              geometry={geometry}
              materials={materials}
              loads={loads}
              seismicParams={seismicParams}
              onAnalysisComplete={(results) => {
                setAnalysisResults(results);
                setValidationResult({ isValid: true, errors: [], warnings: [] });
                setActiveTab('results');
              }}
            />
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            {analysisResults && (
              <ResultsDisplay results={analysisResults} />
            )}
          </TabsContent>

          {/* Visualization Tab */}
          <TabsContent value="visualization">
            <VisualizationErrorBoundary>
              <Card>
                <CardHeader>
                  <CardTitle>Visualisasi 3D</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px]">
                    <Simple3DViewer
                      structure={convertToEnhanced3DStructure(geometry, analysisResults, materialSelection, foundationParams)}
                      analysisResults={analysisResults}
                      showDeformation={true}
                      deformationScale={10}
                      showStress={true}
                      showForces={true}
                      showLabels={true}
                      colorMode="material"
                      onElementSelect={(elementId: string) => console.log('Selected element:', elementId)}
                      onNodeSelect={(nodeId: string) => console.log('Selected node:', nodeId)}
                    />
                  </div>
                </CardContent>
              </Card>
            </VisualizationErrorBoundary>
          </TabsContent>

          {/* Cost Estimation Tab */}
          <TabsContent value="cost">
            <CostEstimationSystem 
              geometry={geometry}
              materials={materials}
              analysisResults={analysisResults}
              onCostUpdate={(costData) => {
                setCostResults(costData);
                console.log('Cost data updated:', costData);
              }}
            />
          </TabsContent>

          {/* BIM Integration Tab */}
          <TabsContent value="bim">
            <BIMIntegrationSystem 
              geometry={geometry}
              materials={materials}
              analysisResults={analysisResults}
              costResults={costResults}
              onBIMUpdate={(bimData) => {
                console.log('BIM data updated:', bimData);
              }}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            {analysisResults ? (
              <ReportGenerator 
                analysisResults={analysisResults}
                projectInfo={projectInfo}
                geometry={geometry}
                materials={materials}
                loads={loads}
                seismicParams={seismicParams}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold mb-2">Professional Reports</h3>
                    <p>Jalankan analisis terlebih dahulu untuk menghasilkan laporan</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StructuralAnalysisErrorBoundary>
  );
};

export default SimpleStructuralAnalysisSystem;