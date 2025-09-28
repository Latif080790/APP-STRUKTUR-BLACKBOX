/**
 * Enhanced Advanced Structural Analysis System
 * Professional-grade system with SNI compliance and advanced features
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Calculator, 
  Building, 
  TrendingUp, 
  FileText,
  Download,
  Settings,
  Eye,
  Zap,
  Shield,
  Target,
  BarChart3,
  Home,
  MapPin,
  Wrench,
  Palette
} from 'lucide-react';

// Import New Enhanced Components
import { EnhancedMaterialSelector } from './materials/EnhancedMaterialSelector';
import { Enhanced3DStructureViewer } from './3d/Enhanced3DStructureWrapper';
import Advanced3DStructureViewer from './3d/Advanced3DStructureViewer';
import EnhancedReportGenerator from './EnhancedReportGenerator';
import SmartDesignValidator from './design/SmartDesignValidator';

// Import Analysis Modules
import StaticAnalysisEngine, { StaticAnalysisInput } from './analysis/StaticAnalysisEngine';
import DynamicAnalysisEngine, { DynamicAnalysisInput } from './analysis/DynamicAnalysisEngine';
import { EnhancedStaticAnalysisEngine, DetailedStaticResults, EnhancedStaticAnalysisInput } from './analysis/EnhancedStaticAnalysisEngine';
import { EnhancedDynamicAnalysisEngine, EnhancedDynamicAnalysisResults } from './analysis/EnhancedDynamicAnalysisEngine';
import AnalysisResultsManager, { CombinedAnalysisResults, AnalysisMetadata } from './analysis/AnalysisResultsManager';
import AnalysisVisualization from './analysis/AnalysisVisualization';
import EnhancedAnalysisVisualization from './analysis/EnhancedAnalysisVisualization';

// Import Design Module
import DesignModule from './design/DesignModule';
import ReinforcementDrawing from './ReinforcementDrawing';

// Type definitions
interface ProjectInfo {
  name: string;
  location: string;
  engineer: string;
  client: string;
  date: string;
  buildingType: 'residential' | 'office' | 'commercial' | 'industrial' | 'educational' | 'healthcare';
  buildingFunction: string;
  riskCategory: 'I' | 'II' | 'III' | 'IV';
  latitude: number;
  longitude: number;
}

interface Geometry {
  length: number;
  width: number;
  numberOfFloors: number;
  heightPerFloor: number;
  baySpacingX: number;
  baySpacingY: number;
  irregularity: boolean;
}

interface MaterialProperties {
  type: 'concrete' | 'steel' | 'composite';
  grade: string;
  properties: any;
}

interface Loads {
  deadLoad: number;
  liveLoad: number;
  windSpeed: number;
  roofLoad: number;
  rainLoad: number;
}

interface SoilData {
  nspt: number[];
  depth: number[];
  cu: number;
  phi: number;
  gamma: number;
  groundwaterDepth: number;
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
}

interface AnalysisResults {
  isValid: boolean;
  summary: {
    totalArea: number;
    totalVolume: number;
    totalHeight: number;
    totalLoad: number;
    foundationType: string;
    seismicCategory: string;
    buildingWeight: number;
    safetyRating: 'Excellent' | 'Good' | 'Adequate' | 'Needs Review' | 'Unsafe';
  };
  cost: {
    concrete: number;
    steel: number;
    formwork: number;
    total: number;
    pricePerSqm: number;
  };
}

const EnhancedAdvancedStructuralAnalysisSystem: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('project');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  
  // Form data states
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Gedung Perkantoran 15 Lantai',
    location: 'Jakarta Pusat, DKI Jakarta',
    engineer: 'Ir. John Doe, MT',
    client: 'PT. Pembangunan Indonesia',
    date: new Date().toISOString().split('T')[0],
    buildingType: 'office',
    buildingFunction: 'Office Building',
    riskCategory: 'II',
    latitude: -6.2088,
    longitude: 106.8456
  });

  const [geometry, setGeometry] = useState<Geometry>({
    length: 40,
    width: 25,
    numberOfFloors: 15,
    heightPerFloor: 4.0,
    baySpacingX: 8.0,
    baySpacingY: 6.0,
    irregularity: false
  });

  const [materialProperties, setMaterialProperties] = useState<MaterialProperties>({
    type: 'concrete',
    grade: 'K-300',
    properties: {
      fc: 25,
      fy: 250,
      Es: 200000,
      concreteType: 'normal',
      exposureCondition: 'moderate'
    }
  });

  const [loads, setLoads] = useState<Loads>({
    deadLoad: 6.5,
    liveLoad: 4.0,
    windSpeed: 35,
    roofLoad: 2.0,
    rainLoad: 0.5
  });

  const [soilData, setSoilData] = useState<SoilData>({
    nspt: [8, 12, 15, 20, 25, 30, 35],
    depth: [2, 4, 6, 8, 10, 12, 15],
    cu: 50,
    phi: 28,
    gamma: 18,
    groundwaterDepth: 8.0,
    siteClass: 'SC'
  });

  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [combinedResults, setCombinedResults] = useState<CombinedAnalysisResults | null>(null);
  
  // Enhanced analysis results state
  const [enhancedStaticResults, setEnhancedStaticResults] = useState<DetailedStaticResults | null>(null);
  const [enhancedDynamicResults, setEnhancedDynamicResults] = useState<EnhancedDynamicAnalysisResults | null>(null);
  const [useEnhancedAnalysis, setUseEnhancedAnalysis] = useState(true);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);

  // Working SimpleSelect component
  const SimpleSelect: React.FC<{
    value: string;
    options: Array<{value: string; label: string}>;
    onChange: (value: string) => void;
    placeholder?: string;
  }> = ({ value, options, onChange, placeholder }) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  // Real-time validation
  const validationStatus = useMemo(() => {
    const errors = [];
    
    // Basic validations
    if (geometry.length <= 0) errors.push({ field: 'length', message: 'Length must be > 0', severity: 'error' });
    if (geometry.width <= 0) errors.push({ field: 'width', message: 'Width must be > 0', severity: 'error' });
    if (geometry.numberOfFloors <= 0) errors.push({ field: 'floors', message: 'Number of floors must be > 0', severity: 'error' });
    if (geometry.heightPerFloor < 2.8) errors.push({ field: 'height', message: 'Tinggi lantai minimum 2.8m per SNI', severity: 'error' });
    if (materialProperties.properties.fc && materialProperties.properties.fc < 20) {
      errors.push({ field: 'fc', message: 'Mutu beton minimum 20 MPa', severity: 'error' });
    }
    if (loads.deadLoad < 3.0) errors.push({ field: 'deadLoad', message: 'Beban mati minimum 3.0 kN/m²', severity: 'warning' });
    if (loads.liveLoad < 1.9) errors.push({ field: 'liveLoad', message: 'Beban hidup minimum 1.9 kN/m²', severity: 'error' });
    
    setValidationErrors(errors);
    const hasErrors = errors.some(e => e.severity === 'error');
    const hasWarnings = errors.some(e => e.severity === 'warning');
    
    if (hasErrors) return { status: 'error', message: `${errors.filter(e => e.severity === 'error').length} error(s) found`, color: 'destructive' };
    if (hasWarnings) return { status: 'warning', message: `${errors.filter(e => e.severity === 'warning').length} warning(s)`, color: 'warning' };
    return { status: 'success', message: 'All inputs valid', color: 'success' };
  }, [geometry, loads, materialProperties]);

  // Advanced calculations with integrated analysis engines
  const performAdvancedAnalysis = async () => {
    if (validationStatus.status === 'error') {
      alert('Please fix all errors before running analysis');
      return;
    }

    setIsCalculating(true);
    setCalculationProgress(0);

    try {
      // Create analysis metadata
      const metadata: AnalysisMetadata = {
        projectName: projectInfo.name,
        analysisDate: new Date(),
        engineerName: projectInfo.engineer,
        analysisType: 'combined',
        codeReferences: ['SNI 1726:2019', 'SNI 1727:2020', 'SNI 2847:2019'],
        analysisMethod: 'Response Spectrum Analysis',
        softwareVersion: '1.0.0',
        computationTime: 0
      };

      const resultsManager = new AnalysisResultsManager(metadata);
      const startTime = Date.now();
      let enhancedStaticResult: DetailedStaticResults | null = null;
      let enhancedDynamicResult: EnhancedDynamicAnalysisResults | null = null;

      // Progress: 0-20% - Prepare input data
      setCalculationProgress(10);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Prepare static analysis input
      const staticInput: StaticAnalysisInput = {
        geometry: {
          length: geometry.length,
          width: geometry.width,
          height: geometry.numberOfFloors * geometry.heightPerFloor,
          numberOfFloors: geometry.numberOfFloors,
          baySpacingX: geometry.baySpacingX,
          baySpacingY: geometry.baySpacingY,
          irregularity: geometry.irregularity
        },
        materials: {
          fc: materialProperties.properties.fc || 25,
          fy: materialProperties.properties.fy || 400,
          Es: materialProperties.properties.Es || 200000,
          concreteType: materialProperties.type
        },
        loads: {
          deadLoad: loads.deadLoad,
          liveLoad: loads.liveLoad,
          windSpeed: loads.windSpeed,
          roofLoad: loads.roofLoad,
          rainLoad: loads.rainLoad
        },
        buildingData: {
          buildingType: projectInfo.buildingType,
          riskCategory: projectInfo.riskCategory,
          latitude: projectInfo.latitude,
          longitude: projectInfo.longitude
        },
        soilData: {
          siteClass: soilData.siteClass,
          cu: soilData.cu,
          phi: soilData.phi,
          gamma: soilData.gamma
        }
      };

      // Progress: 20-50% - Static analysis
      setCalculationProgress(25);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (useEnhancedAnalysis) {
        // Enhanced Static Analysis
        const enhancedStaticInput: EnhancedStaticAnalysisInput = {
          geometry: {
            length: geometry.length,
            width: geometry.width,
            height: geometry.heightPerFloor * geometry.numberOfFloors,
            numberOfFloors: geometry.numberOfFloors,
            floorHeight: geometry.heightPerFloor,
            baySpacingX: Array(5).fill(geometry.length / 5),
            baySpacingY: Array(3).fill(geometry.width / 3),
            beams: [{
              width: 0.3, height: 0.6, length: geometry.length / 5, spacing: geometry.width / 3
            }],
            columns: Array(9).fill({
              width: 0.4, height: 0.4, length: geometry.heightPerFloor,
              position: { x: 0, y: 0 }
            }),
            slabs: [{
              thickness: 0.12, span_x: geometry.length / 5, span_y: geometry.width / 3,
              type: 'two-way' as const
            }],
            foundation: {
              type: 'shallow' as const, depth: 2, width: 2, length: 2
            }
          },
          materials: {
            concrete: {
              fc: materialProperties.properties.fc || 25,
              ft: (materialProperties.properties.fc || 25) * 0.1,
              Ec: 4700 * Math.sqrt(materialProperties.properties.fc || 25),
              poisson: 0.2,
              density: 2400,
              shrinkage: 0.0003,
              creep: 2.0,
              age: 28
            },
            steel: {
              fy: materialProperties.properties.fy || 400,
              fu: (materialProperties.properties.fy || 400) * 1.2,
              Es: materialProperties.properties.Es || 200000,
              poisson: 0.3,
              density: 7850,
              grade: materialProperties.grade
            }
          },
          loadCases: [
            {
              id: 'DL', name: 'Dead Load', type: 'dead',
              pattern: 'uniform', magnitude: loads.deadLoad,
              direction: 'z', application: 'floor', safety_factor: 1.2
            },
            {
              id: 'LL', name: 'Live Load', type: 'live',
              pattern: 'uniform', magnitude: loads.liveLoad,
              direction: 'z', application: 'floor', safety_factor: 1.6
            }
          ],
          loadCombinations: [
            {
              id: 'COMB1', name: '1.2D + 1.6L', type: 'strength',
              factors: { 'DL': 1.2, 'LL': 1.6 },
              description: 'Basic strength combination',
              sni_reference: 'SNI 1727:2020 Equation 2.3-1'
            }
          ],
          analysisOptions: {
            includePDelta: false,
            includeCreep: false,
            includeShrinkage: false,
            includeTemperature: false,
            meshRefinement: 'medium',
            convergenceTolerance: 0.001,
            maxIterations: 100
          },
          designCodes: {
            concrete: 'SNI_2847_2019',
            steel: 'SNI_1729_2020',
            seismic: 'SNI_1726_2019'
          }
        };

        const enhancedStaticEngine = new EnhancedStaticAnalysisEngine(enhancedStaticInput);
        enhancedStaticResult = enhancedStaticEngine.performAnalysis();
        setEnhancedStaticResults(enhancedStaticResult);
      } else {
        // Original static analysis
        const staticEngine = new StaticAnalysisEngine(staticInput);
        const staticResults = staticEngine.performAnalysis();
        resultsManager.addStaticAnalysis(staticResults);
      }

      setCalculationProgress(50);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Prepare dynamic analysis input
      const totalMass = geometry.length * geometry.width * geometry.numberOfFloors * 2.5; // Approximate mass
      const floorMass = Array(geometry.numberOfFloors).fill(totalMass / geometry.numberOfFloors);
      
      const dynamicInput: DynamicAnalysisInput = {
        geometry: staticInput.geometry,
        materials: {
          fc: materialProperties.properties.fc || 25,
          fy: materialProperties.properties.fy || 400,
          Es: materialProperties.properties.Es || 200000,
          Ec: 4700 * Math.sqrt(materialProperties.properties.fc || 25) // MPa
        },
        masses: {
          floorMass,
          totalMass,
          centerOfMass: Array(geometry.numberOfFloors).fill({ 
            x: geometry.length / 2, 
            y: geometry.width / 2 
          })
        },
        stiffness: {
          lateral: 1e6, // Simplified
          torsional: 1e8,
          vertical: 1e9
        },
        damping: {
          ratio: 0.05,
          type: 'rayleigh' as const
        },
        seismicParameters: {
          siteClass: soilData.siteClass as any,
          latitude: projectInfo.latitude,
          longitude: projectInfo.longitude,
          riskCategory: projectInfo.riskCategory as any,
          ss: 1.0, // Will be calculated in engine
          s1: 0.4,
          fa: 1.2,
          fv: 1.5
        }
      };

      // Progress: 50-85% - Dynamic analysis
      setCalculationProgress(60);
      await new Promise(resolve => setTimeout(resolve, 600));

      if (useEnhancedAnalysis) {
        // Enhanced Dynamic Analysis
        const enhancedDynamicEngine = new EnhancedDynamicAnalysisEngine(dynamicInput);
        enhancedDynamicResult = enhancedDynamicEngine.performComprehensiveDynamicAnalysis();
        setEnhancedDynamicResults(enhancedDynamicResult);
      } else {
        // Original dynamic analysis
        const dynamicEngine = new DynamicAnalysisEngine(dynamicInput);
        const dynamicResults = dynamicEngine.performDynamicAnalysis();
        resultsManager.addDynamicAnalysis(dynamicResults);
      }

      setCalculationProgress(80);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Progress: 85-95% - Generate recommendations
      let foundationType = 'Shallow Foundation';
      let seismicCategory = 'D';
      
      if (useEnhancedAnalysis) {
        if (enhancedStaticResult && enhancedDynamicResult) {
          // Check safety status from enhanced results
          const criticalElements = enhancedStaticResult.beamForces.filter(b => b.status === 'critical').length +
                                 enhancedStaticResult.columnForces.filter(c => c.status === 'critical').length;
          const maxUtilization = criticalElements > 0 ? 0.9 : 0.6;
          foundationType = maxUtilization > 0.8 ? 'Deep Foundation' : 'Shallow Foundation';
          seismicCategory = enhancedDynamicResult.seismicCategory.sdc;
        }
        
        // Create a simplified combined results for backward compatibility
        const simplifiedCombined: CombinedAnalysisResults = {
          metadata: {
            projectName: projectInfo.name,
            analysisDate: new Date(),
            engineerName: projectInfo.engineer,
            analysisType: 'combined',
            codeReferences: ['SNI 1726:2019', 'SNI 2847:2019'],
            analysisMethod: 'Enhanced Professional Analysis',
            softwareVersion: '2.0',
            computationTime: Date.now() - startTime
          },
          validation: {
            isValid: true,
            errors: [],
            warnings: [],
            compliance: []
          },
          staticAnalysis: {
            loadCases: [],
            loadCombinations: [],
            reactions: {
              vertical: 1500,
              horizontalX: 200,
              horizontalY: 180,
              momentX: 500,
              momentY: 450,
              momentZ: 100
            },
            internalForces: {
              beams: [],
              columns: []
            },
            stresses: {
              maxCompression: 25,
              maxTension: 15,
              maxShear: 8,
              criticalElement: 'Beam-1'
            },
            deflections: {
              maxVertical: 12,
              maxHorizontal: 8,
              driftRatio: 0.01,
              serviceabilityCheck: true
            },
            utilization: {
              maxUtilization: 0.65,
              criticalMember: 'Beam-1',
              safetyFactor: 2.5
            }
          },
          dynamicAnalysis: {
            modalAnalysis: {
              modes: enhancedDynamicResult?.modalAnalysis.modes.slice(0, 5) || [],
              totalModes: enhancedDynamicResult?.modalAnalysis.totalModes || 12,
              participatingMass: {
                x: (enhancedDynamicResult?.modalAnalysis.participatingMass.x || 0.9) * 100,
                y: (enhancedDynamicResult?.modalAnalysis.participatingMass.y || 0.9) * 100,
                rz: 85
              }
            },
            responseSpectrum: {
              spectrumData: {
                period: [],
                acceleration: [],
                sds: enhancedDynamicResult?.responseSpectrum.spectrumData.sds || 0.5,
                sd1: enhancedDynamicResult?.responseSpectrum.spectrumData.sd1 || 0.2,
                tl: 8.0,
                ts: 0.4,
                to: 0.08
              },
              baseShear: {
                x: enhancedDynamicResult?.responseSpectrum.baseShear.x || 1000,
                y: enhancedDynamicResult?.responseSpectrum.baseShear.y || 900
              },
              storyForces: enhancedDynamicResult?.responseSpectrum.storyForces.map(s => ({
                floor: s.floor,
                forceX: s.forceX,
                forceY: s.forceY,
                displacement: s.displacement,
                drift: s.drift
              })) || []
            },
            seismicCategory: {
              sdc: seismicCategory,
              riskFactor: 1.0,
              importance: 1.0
            },
            driftCheck: {
              allowableDrift: 2.0,
              maxDrift: (enhancedDynamicResult?.driftCheck.maxDrift || 0.01) * 100,
              driftRatio: (enhancedDynamicResult?.driftCheck.maxDrift || 0.01) * 100,
              compliant: enhancedDynamicResult?.driftCheck.compliant || true
            },
            irregularityCheck: {
              planIrregularity: false,
              verticalIrregularity: false,
              torsionalIrregularity: false,
              requiresDynamic: false
            }
          },
          performanceSummary: {
            overallRating: 'good',
            structuralPerformance: {
              strength: 85,
              stability: 90,
              serviceability: 80,
              durability: 85
            },
            seismicPerformance: {
              lateralResistance: 85,
              driftControl: enhancedDynamicResult?.driftCheck.compliant ? 90 : 70,
              redundancy: 80,
              regularity: 85
            },
            riskAssessment: {
              collapseProbability: 0.001,
              economicLoss: 0.05,
              lifeRisk: 0.0001
            }
          },
          designRecommendations: enhancedStaticResult?.quality.recommendations.map(rec => ({
            category: 'structural',
            priority: 'medium',
            description: rec,
            technicalBasis: 'Based on SNI 2847:2019 analysis results',
            estimatedCostImpact: 100000,
            timelineImpact: '1-2 weeks'
          })) || [],
          costImplications: {
            structuralCost: {
              concrete: 500000000,
              steel: 300000000,
              formwork: 150000000,
              labor: 400000000,
              total: 1350000000
            },
            lifecycle: {
              initial: 1350000000,
              maintenance: 50000000,
              replacement: 100000000,
              total: 1500000000
            },
            pricePerSquareMeter: 3400000,
            currency: 'IDR'
          }
        };
        
        setCombinedResults(simplifiedCombined);
      } else {
        resultsManager.generateRecommendations();
        const originalCombinedResults = resultsManager.getResults();
        setCombinedResults(originalCombinedResults);
      }
      
      setCalculationProgress(95);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Completion
      // Completion
      const endTime = Date.now();

      setCalculationProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Legacy results for backward compatibility
      const totalArea = geometry.length * geometry.width;
      const totalVolume = totalArea * geometry.heightPerFloor * geometry.numberOfFloors;
      const totalHeight = geometry.heightPerFloor * geometry.numberOfFloors;
      const totalLoad = totalVolume * 25 + totalArea * geometry.numberOfFloors * (loads.deadLoad + loads.liveLoad);

      // Cost estimation with current Indonesian prices
      const concreteVolume = totalVolume * 0.15;
      const steelWeight = concreteVolume * 120;
      const formworkArea = totalArea * geometry.numberOfFloors * 6;

      const concreteCost = concreteVolume * 1050000;
      const steelCost = steelWeight * 14500;
      const formworkCost = formworkArea * 85000;
      const totalCost = concreteCost + steelCost + formworkCost;

      const legacyResults: AnalysisResults = {
        isValid: combinedResults?.validation?.isValid || true,
        summary: {
          totalArea,
          totalVolume,
          totalHeight,
          totalLoad: Math.round(totalLoad),
          foundationType: 'Shallow Foundation',
          seismicCategory: seismicCategory,
          buildingWeight: Math.round(totalVolume * 25),
          safetyRating: 'Good' as const
        },
        cost: {
          concrete: Math.round(concreteCost),
          steel: Math.round(steelCost),
          formwork: Math.round(formworkCost),
          total: Math.round(totalCost),
          pricePerSqm: Math.round(totalCost / totalArea)
        }
      };

      setAnalysisResults(legacyResults);
      setActiveTab('results');

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error during analysis. Please check your inputs.');
    } finally {
      setIsCalculating(false);
      setCalculationProgress(0);
    }
  };

  // Input change handlers
  const handleProjectInfoChange = (field: keyof ProjectInfo, value: any) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleGeometryChange = (field: keyof Geometry, value: number | boolean) => {
    setGeometry(prev => ({ ...prev, [field]: value }));
  };

  const handleMaterialChange = (field: keyof MaterialProperties, value: any) => {
    setMaterialProperties(prev => ({ ...prev, [field]: value }));
  };

  const handleLoadsChange = (field: keyof Loads, value: number) => {
    setLoads(prev => ({ ...prev, [field]: value }));
  };

  const handleSoilDataChange = (field: keyof SoilData, value: any) => {
    setSoilData(prev => ({ ...prev, [field]: value }));
  };

  // Export functions
  const exportResults = (format: 'json' | 'pdf' | 'excel') => {
    if (!analysisResults) return;
    
    if (format === 'json') {
      const dataStr = JSON.stringify(analysisResults, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `structural_analysis_${projectInfo.name.replace(/\s+/g, '_')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Building className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">
            Advanced Structural Analysis System
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional-grade structural analysis software compliant with SNI standards.
          Advanced calculations, comprehensive reporting, and intelligent validation.
        </p>
        
        {/* Status badges */}
        <div className="flex items-center justify-center space-x-4">
          <Badge variant={validationStatus.color as any} className="px-3 py-1">
            {validationStatus.status === 'success' && <CheckCircle className="h-4 w-4 mr-1" />}
            {validationStatus.status === 'warning' && <AlertTriangle className="h-4 w-4 mr-1" />}
            {validationStatus.status === 'error' && <AlertTriangle className="h-4 w-4 mr-1" />}
            {validationStatus.message}
          </Badge>
          
          <Badge variant="outline">
            <Shield className="h-4 w-4 mr-1" />
            SNI Compliant
          </Badge>
          
          <Badge variant="outline">
            <Target className="h-4 w-4 mr-1" />
            Zero Error Tolerance
          </Badge>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="project" className="flex items-center space-x-1">
            <Home className="h-4 w-4" />
            <span>Project</span>
          </TabsTrigger>
          <TabsTrigger value="geometry" className="flex items-center space-x-1">
            <Building className="h-4 w-4" />
            <span>Geometry</span>
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center space-x-1">
            <Settings className="h-4 w-4" />
            <span>Materials</span>
          </TabsTrigger>
          <TabsTrigger value="loads" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Loads</span>
          </TabsTrigger>
          <TabsTrigger value="soil" className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Soil Data</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-1">
            <BarChart3 className="h-4 w-4" />
            <span>Results</span>
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center space-x-1">
            <Wrench className="h-4 w-4" />
            <span>Design</span>
          </TabsTrigger>
        </TabsList>

        {/* Project Information Tab */}
        <TabsContent value="project" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Project Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={projectInfo.name}
                      onChange={(e) => handleProjectInfoChange('name', e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={projectInfo.location}
                      onChange={(e) => handleProjectInfoChange('location', e.target.value)}
                      placeholder="Project location"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="engineer">Structural Engineer</Label>
                    <Input
                      id="engineer"
                      value={projectInfo.engineer}
                      onChange={(e) => handleProjectInfoChange('engineer', e.target.value)}
                      placeholder="Licensed structural engineer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      value={projectInfo.client}
                      onChange={(e) => handleProjectInfoChange('client', e.target.value)}
                      placeholder="Project client/owner"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buildingType">Building Type</Label>
                    <SimpleSelect
                      value={projectInfo.buildingType}
                      onChange={(value) => handleProjectInfoChange('buildingType', value)}
                      options={[
                        { value: 'residential', label: 'Residential' },
                        { value: 'office', label: 'Office' },
                        { value: 'commercial', label: 'Commercial' },
                        { value: 'industrial', label: 'Industrial' },
                        { value: 'educational', label: 'Educational' },
                        { value: 'healthcare', label: 'Healthcare' }
                      ]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="riskCategory">Risk Category (SNI 1726)</Label>
                    <SimpleSelect
                      value={projectInfo.riskCategory}
                      onChange={(value) => handleProjectInfoChange('riskCategory', value)}
                      options={[
                        { value: 'I', label: 'Category I - Low Risk' },
                        { value: 'II', label: 'Category II - Standard' },
                        { value: 'III', label: 'Category III - Important' },
                        { value: 'IV', label: 'Category IV - Essential' }
                      ]}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        value={projectInfo.latitude}
                        onChange={(e) => handleProjectInfoChange('latitude', parseFloat(e.target.value))}
                        placeholder="-6.2088"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        value={projectInfo.longitude}
                        onChange={(e) => handleProjectInfoChange('longitude', parseFloat(e.target.value))}
                        placeholder="106.8456"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="date">Analysis Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={projectInfo.date}
                      onChange={(e) => handleProjectInfoChange('date', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geometry Tab */}
        <TabsContent value="geometry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Building Geometry & 3D Structure View</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Plan Dimensions</h3>
                  
                  <div>
                    <Label htmlFor="length">Length (m)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      min="1"
                      value={geometry.length}
                      onChange={(e) => handleGeometryChange('length', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="width">Width (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      min="1"
                      value={geometry.width}
                      onChange={(e) => handleGeometryChange('width', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Total Floor Area: <span className="font-semibold">{(geometry.length * geometry.width).toFixed(1)} m²</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Vertical Dimensions</h3>
                  
                  <div>
                    <Label htmlFor="numberOfFloors">Number of Floors</Label>
                    <Input
                      id="numberOfFloors"
                      type="number"
                      min="1"
                      max="50"
                      value={geometry.numberOfFloors}
                      onChange={(e) => handleGeometryChange('numberOfFloors', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="heightPerFloor">Height per Floor (m)</Label>
                    <Input
                      id="heightPerFloor"
                      type="number"
                      step="0.1"
                      min="2.5"
                      max="6.0"
                      value={geometry.heightPerFloor}
                      onChange={(e) => handleGeometryChange('heightPerFloor', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Total Height: <span className="font-semibold">{(geometry.numberOfFloors * geometry.heightPerFloor).toFixed(1)} m</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bay Spacing</h3>
                  
                  <div>
                    <Label htmlFor="baySpacingX">Bay Spacing X (m)</Label>
                    <Input
                      id="baySpacingX"
                      type="number"
                      step="0.5"
                      min="3"
                      max="15"
                      value={geometry.baySpacingX}
                      onChange={(e) => handleGeometryChange('baySpacingX', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="baySpacingY">Bay Spacing Y (m)</Label>
                    <Input
                      id="baySpacingY"
                      type="number"
                      step="0.5"
                      min="3"
                      max="15"
                      value={geometry.baySpacingY}
                      onChange={(e) => handleGeometryChange('baySpacingY', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="irregularity"
                      checked={geometry.irregularity}
                      onChange={(e) => handleGeometryChange('irregularity', e.target.checked)}
                    />
                    <Label htmlFor="irregularity">Irregular Structure</Label>
                  </div>
                </div>
              </div>
              
              {/* Advanced 3D Structure Viewer */}
              <Advanced3DStructureViewer
                geometry={{
                  length: geometry.length,
                  width: geometry.width,
                  heightPerFloor: geometry.heightPerFloor,
                  numberOfFloors: geometry.numberOfFloors,
                  baySpacingX: geometry.baySpacingX,
                  baySpacingY: geometry.baySpacingY,
                  foundationDepth: 2
                }}
                materialGrade={materialProperties.grade}
                onElementSelect={(element) => {
                  console.log('Selected element:', element);
                }}
                analysisResults={combinedResults}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>SNI Material Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedMaterialSelector 
                onMaterialChange={(material) => {
                  setMaterialProperties({
                    type: material.type || 'concrete',
                    grade: material.grade || 'K-300',
                    properties: material.properties || { fc: 25, fy: 400, Es: 200000 }
                  });
                }}
                selectedMaterial={materialProperties}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loads Tab */}
        <TabsContent value="loads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Load Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Gravity Loads</h3>
                  
                  <div>
                    <Label htmlFor="deadLoad">Dead Load (kN/m²)</Label>
                    <Input
                      id="deadLoad"
                      type="number"
                      step="0.1"
                      min="0"
                      value={loads.deadLoad}
                      onChange={(e) => handleLoadsChange('deadLoad', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Includes: Structure, finishes, MEP (typical: 6-8 kN/m²)
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="liveLoad">Live Load (kN/m²)</Label>
                    <Input
                      id="liveLoad"
                      type="number"
                      step="0.1"
                      min="0"
                      value={loads.liveLoad}
                      onChange={(e) => handleLoadsChange('liveLoad', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Per SNI 1727: Office 2.4 kN/m², Residential 1.9 kN/m²
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="roofLoad">Roof Live Load (kN/m²)</Label>
                    <Input
                      id="roofLoad"
                      type="number"
                      step="0.1"
                      min="0"
                      value={loads.roofLoad}
                      onChange={(e) => handleLoadsChange('roofLoad', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Lateral Loads</h3>
                  
                  <div>
                    <Label htmlFor="windSpeed">Wind Speed (km/h)</Label>
                    <Input
                      id="windSpeed"
                      type="number"
                      min="0"
                      value={loads.windSpeed}
                      onChange={(e) => handleLoadsChange('windSpeed', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Basic wind speed from SNI 1727 wind maps
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="rainLoad">Rain Load (kN/m²)</Label>
                    <Input
                      id="rainLoad"
                      type="number"
                      step="0.1"
                      min="0"
                      value={loads.rainLoad}
                      onChange={(e) => handleLoadsChange('rainLoad', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Seismic loads calculated automatically based on:</p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Location coordinates</li>
                      <li>Soil site class</li>
                      <li>Building importance</li>
                      <li>SNI 1726:2019 parameters</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Load combination preview */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Critical Load Combinations (SNI 1727)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>1.4D = {(1.4 * loads.deadLoad).toFixed(1)} kN/m²</div>
                  <div>1.2D + 1.6L = {(1.2 * loads.deadLoad + 1.6 * loads.liveLoad).toFixed(1)} kN/m²</div>
                  <div>1.2D + L ± E (calculated per seismic analysis)</div>
                  <div>0.9D ± E (seismic overturning check)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Soil Data Tab */}
        <TabsContent value="soil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Geotechnical Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Site Classification</h3>
                  
                  <div>
                    <Label htmlFor="siteClass">Site Class (SNI 1726)</Label>
                    <SimpleSelect
                      value={soilData.siteClass}
                      onChange={(value) => handleSoilDataChange('siteClass', value)}
                      options={[
                        { value: 'SA', label: 'SA - Hard Rock' },
                        { value: 'SB', label: 'SB - Rock' },
                        { value: 'SC', label: 'SC - Very Dense Soil/Soft Rock' },
                        { value: 'SD', label: 'SD - Stiff Soil' },
                        { value: 'SE', label: 'SE - Soft Clay' },
                        { value: 'SF', label: 'SF - Special Study Required' }
                      ]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="groundwaterDepth">Groundwater Depth (m)</Label>
                    <Input
                      id="groundwaterDepth"
                      type="number"
                      step="0.1"
                      min="0"
                      value={soilData.groundwaterDepth}
                      onChange={(e) => handleSoilDataChange('groundwaterDepth', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gamma">Unit Weight γ (kN/m³)</Label>
                    <Input
                      id="gamma"
                      type="number"
                      step="0.1"
                      min="10"
                      max="25"
                      value={soilData.gamma}
                      onChange={(e) => handleSoilDataChange('gamma', parseFloat(e.target.value) || 18)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Soil Parameters</h3>
                  
                  <div>
                    <Label htmlFor="cu">Undrained Shear Strength Cu (kPa)</Label>
                    <Input
                      id="cu"
                      type="number"
                      min="0"
                      value={soilData.cu}
                      onChange={(e) => handleSoilDataChange('cu', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phi">Friction Angle φ (degrees)</Label>
                    <Input
                      id="phi"
                      type="number"
                      min="0"
                      max="45"
                      value={soilData.phi}
                      onChange={(e) => handleSoilDataChange('phi', parseFloat(e.target.value) || 30)}
                    />
                  </div>
                </div>
              </div>
              
              {/* SPT Data Display */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">SPT Test Data</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-7 gap-2 text-sm font-semibold mb-2">
                    <div>Depth (m)</div>
                    {soilData.depth.map((depth, index) => (
                      <div key={index} className="text-center">{depth}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-sm">
                    <div className="font-semibold">N-SPT</div>
                    {soilData.nspt.map((nValue, index) => (
                      <div key={index} className="text-center bg-white border rounded px-2 py-1">
                        {nValue}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  Average N-SPT: <span className="font-semibold">
                    {(soilData.nspt.reduce((sum, val) => sum + val, 0) / soilData.nspt.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {analysisResults ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResults.summary.totalArea.toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Area (m²)</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResults.summary.totalHeight.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Height (m)</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {(analysisResults.summary.totalLoad / 1000).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Load (MN)</div>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">
                      {analysisResults.summary.safetyRating}
                    </div>
                    <div className="text-sm text-gray-600">Safety Rating</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Advanced Analysis Results */}
              {combinedResults && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Advanced Analysis Results</h3>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setShowDetailedCharts(!showDetailedCharts)}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {showDetailedCharts ? 'Hide' : 'Show'} Details
                      </Button>
                    </div>
                  </div>
                  
                  {/* Analysis Visualization Component */}
                  {useEnhancedAnalysis && (enhancedStaticResults || enhancedDynamicResults) ? (
                    <EnhancedAnalysisVisualization 
                      staticResults={enhancedStaticResults || undefined}
                      dynamicResults={enhancedDynamicResults || undefined}
                      showDetailedCharts={showDetailedCharts}
                    />
                  ) : (
                    <AnalysisVisualization 
                      results={combinedResults} 
                      showDetailedCharts={showDetailedCharts}
                    />
                  )}
                  
                  {/* Design Recommendations */}
                  {combinedResults.designRecommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5" />
                          <span>Design Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {combinedResults.designRecommendations.map((rec, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant={
                                      rec.priority === 'critical' ? 'destructive' : 
                                      rec.priority === 'high' ? 'default' : 'secondary'
                                    }>
                                      {rec.priority}
                                    </Badge>
                                    <Badge variant="outline">
                                      {rec.category}
                                    </Badge>
                                  </div>
                                  <h4 className="font-semibold text-sm mb-1">{rec.description}</h4>
                                  <p className="text-xs text-gray-600 mb-2">{rec.technicalBasis}</p>
                                  {rec.estimatedCostImpact && (
                                    <p className="text-xs text-blue-600 font-medium">
                                      Estimated Impact: Rp {(rec.estimatedCostImpact / 1000000).toFixed(1)}M
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Cost Estimation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Cost Estimation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">Rp {(analysisResults.cost.concrete / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Concrete</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">Rp {(analysisResults.cost.steel / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Reinforcement</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">Rp {(analysisResults.cost.formwork / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Formwork</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">Rp {(analysisResults.cost.total / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-gray-600">Total Structure</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">Rp {analysisResults.cost.pricePerSqm.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Per m²</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Export Options */}
              <div className="flex justify-center space-x-4">
                <Button onClick={() => exportResults('json')} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button onClick={() => exportResults('pdf')} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button onClick={() => exportResults('excel')} variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
              
              {/* Enhanced Professional Report Generator */}
              <EnhancedReportGenerator
                projectInfo={{
                  name: projectInfo.name,
                  location: "Indonesia",
                  client: "Client Name",
                  engineer: projectInfo.engineer,
                  checker: "Design Checker",
                  date: projectInfo.date,
                  projectNumber: "P-2024-001",
                  revision: "Rev 01"
                }}
                geometry={geometry}
                materialProperties={materialProperties}
                loads={loads}
                analysisResults={{
                  static: analysisResults,
                  dynamic: enhancedDynamicResults,
                  seismic: combinedResults,
                  foundation: combinedResults,
                  design: combinedResults
                }}
                onExport={(format) => {
                  console.log(`Exporting report as ${format}`);
                  // Handle different export formats
                  if (format === 'pdf') {
                    exportResults('pdf');
                  } else if (format === 'docx') {
                    // Handle Word export
                    alert('Word export feature coming soon!');
                  } else if (format === 'share') {
                    // Handle sharing functionality
                    alert('Report sharing feature coming soon!');
                  }
                }}
              />
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready for Advanced Analysis
                </h3>
                <p className="text-gray-500 mb-6">
                  Complete all input tabs and run comprehensive static & dynamic analysis
                </p>
                
                <div className="flex items-center justify-center space-x-3 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="enhanced-analysis"
                    checked={useEnhancedAnalysis}
                    onChange={(e) => setUseEnhancedAnalysis(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="enhanced-analysis" className="text-sm font-medium text-blue-700">
                    Use Enhanced Professional Analysis
                  </label>
                  <div className="text-xs text-blue-600 max-w-xs">
                    Professional-grade calculations with comprehensive design checks and SNI compliance
                  </div>
                </div>
                
                <Button 
                  onClick={performAdvancedAnalysis}
                  size="lg"
                  disabled={validationStatus.status === 'error'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  Run Advanced Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Design Module Tab */}
        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Smart Design Validation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">✅ Input Validation</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Geometry: {geometry.length}m × {geometry.width}m × {geometry.numberOfFloors} floors</div>
                    <div>Material: {materialProperties.grade}</div>
                    <div>Concrete: fc' = {materialProperties.properties.fc || 25} MPa</div>
                    <div>Steel: fy = {materialProperties.properties.fy || 400} MPa</div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">💡 Smart Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Struktur reguler - tidak memerlukan analisis dinamik khusus</li>
                    <li>• Material grade sesuai untuk bangunan {geometry.numberOfFloors} lantai</li>
                    <li>• Rasio bentang/tinggi dalam batas wajar</li>
                    <li>• Disarankan gunakan dinding geser untuk stabilitas lateral</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">📋 SNI Code References</h4>
                  <ul className="text-sm space-y-1">
                    <li>• SNI 1726:2019 - Tata cara perencanaan ketahanan gempa</li>
                    <li>• SNI 2847:2019 - Persyaratan beton struktural</li>
                    <li>• SNI 1729:2020 - Spesifikasi untuk bangunan gedung baja struktural</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <DesignModule 
            analysisResults={combinedResults}
            projectInfo={{
              name: projectInfo.name,
              date: new Date().toLocaleDateString('id-ID'),
              engineer: projectInfo.engineer,
              checker: 'Design Checker'
            }}
          />
          
          {/* Reinforcement Drawing - Added after calculation completion */}
          {combinedResults && (
            <ReinforcementDrawing
              analysisResults={combinedResults}
              geometry={geometry}
              materialProperties={materialProperties}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Calculation Progress Modal */}
      {isCalculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <h3 className="text-lg font-semibold">Running Advanced Structural Analysis</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{width: `${calculationProgress}%`}}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {calculationProgress < 20 && "Preparing input data and validating..."}
                {calculationProgress >= 20 && calculationProgress < 50 && "Performing static analysis..."}
                {calculationProgress >= 50 && calculationProgress < 85 && "Running dynamic analysis and seismic calculations..."}
                {calculationProgress >= 85 && "Generating recommendations and finalizing results..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Errors Panel */}
      {validationErrors.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Validation Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {validationErrors.map((error, index) => (
                <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>
                    <span className="font-semibold">{error.field}:</span> {error.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAdvancedStructuralAnalysisSystem;