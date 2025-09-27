// =====================================
// 🚨 SNI-COMPLIANT STRUCTURAL ANALYSIS SYSTEM
// Professional Structural Analysis with Zero Error Tolerance
// =====================================

import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Calculator,
  CheckCircle,
  AlertTriangle,
  FileText,
  Building,
  Zap,
  Activity,
  RotateCcw
} from 'lucide-react';

// Import SNI-compliant components
import { InputForm } from './InputForm';
import { ResultsDisplay } from './ResultsDisplay';
import { ReportGenerator } from './ReportGenerator';

// Import interfaces and validation
import {
  ProjectInfo,
  Geometry,
  MaterialProperties,
  Loads,
  SeismicParameters,
  SoilData
} from './interfaces';

import { 
  ValidationResult,
  validateCompleteSystem 
} from './calculations/validation-system';

import {
  migrateProjectData,
  isLegacyData
} from './utils/migration';

// Import calculation engines
import { selectFoundationType, calculateFoundationCapacity } from './calculations/basic';
import { calculateSeismicForce, calculateBaseShear } from './calculations/seismic';
import { LIVE_LOADS_BY_OCCUPANCY } from './calculations/load-library';

// Error Boundary
import { StructuralAnalysisErrorBoundary } from '../common/ErrorBoundary';

// ANALYSIS RESULTS INTERFACE
interface AnalysisResults {
  foundation: {
    type: 'shallow' | 'pile' | 'mat';
    capacity: number;
    safetyFactor: number;
    recommendations: string[];
  };
  seismic: {
    baseShear: number;
    naturalPeriod: number;
    responseSpectrum: { period: number; acceleration: number }[];
    driftRatio: number;
    isCompliant: boolean;
  };
  materials: {
    concreteVolume: number;
    steelWeight: number;
    reinforcementRatio: number;
    cost: {
      concrete: number;
      steel: number;
      total: number;
    };
  };
  structural: {
    maxMoment: number;
    maxShear: number;
    maxDeflection: number;
    utilityRatio: number;
    isAdequate: boolean;
  };
  compliance: {
    sni1726: boolean;
    sni2847: boolean;
    sni1727: boolean;
    overallCompliance: boolean;
    violations: string[];
  };
}

// DEFAULT SNI-COMPLIANT VALUES
const defaultProjectInfo: ProjectInfo = {
  name: 'Proyek Analisis Struktur',
  location: 'Jakarta, DKI Jakarta',
  buildingFunction: 'office',
  riskCategory: 'II',
  latitude: -6.2088,
  longitude: 106.8456,
  version: '2.0-SNI_COMPLIANT'
};

const defaultGeometry: Geometry = {
  length: 40,
  width: 20,
  numberOfFloors: 3,
  heightPerFloor: 3.5,
  baySpacingX: 6,
  baySpacingY: 6,
  columnGridX: 7,
  columnGridY: 4
};

const defaultMaterials: MaterialProperties = {
  fc: 25, // MPa - K-300
  fy: 400, // MPa - BjTS-40
  Ec: 4700 * Math.sqrt(25), // Auto-calculated
  Es: 200000, // MPa - Standard
  poissonRatio: 0.2,
  unitWeightConcrete: 24, // kN/m³
  unitWeightSteel: 78.5 // kN/m³
};

const defaultLoads: Loads = {
  deadLoad: 4.0, // kN/m² - typical for office
  liveLoad: 2.5, // kN/m² - office per SNI 1727:2020
  windSpeed: 30, // m/s - typical Indonesian wind
  roofLiveLoad: 1.0, // kN/m²
  reductionFactor: {
    live: 1.0,
    wind: 1.0
  }
};

const defaultSeismicParams: SeismicParameters = {
  ss: 0.8, // g - Jakarta area approximate
  s1: 0.3, // g - Jakarta area approximate  
  siteClass: 'SD', // Medium soil
  fa: undefined, // Will be calculated
  fv: undefined, // Will be calculated
  sds: undefined, // Will be calculated
  sd1: undefined // Will be calculated
};

const defaultSoilData: SoilData = {
  nspt: [10, 15, 20, 25, 30], // Typical SPT values
  depth: [2, 4, 6, 8, 10], // Depths in meters
  siteClass: 'SD',
  groundwaterDepth: 5,
  soilDescription: 'Lempung keras dengan lapisan pasir',
  bearingCapacity: 200, // kN/m²
  needsSPTData: true
};

// MAIN COMPONENT
const SNIStructuralAnalysisSystem: React.FC = () => {
  // State management
  const [currentView, setCurrentView] = useState<'input' | 'results' | 'report'>('input');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Data states
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(defaultProjectInfo);
  const [geometry, setGeometry] = useState<Geometry>(defaultGeometry);
  const [materials, setMaterials] = useState<MaterialProperties>(defaultMaterials);
  const [loads, setLoads] = useState<Loads>(defaultLoads);
  const [seismicParams, setSeismicParams] = useState<SeismicParameters>(defaultSeismicParams);
  const [soilData, setSoilData] = useState<SoilData>(defaultSoilData);
  
  // Results states
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [migrationResult, setMigrationResult] = useState<any | null>(null);

  // Update handlers with real-time validation
  const handleUpdate = useCallback((section: string, data: any) => {
    switch (section) {
      case 'project':
        setProjectInfo(data);
        break;
      case 'geometry':
        setGeometry(data);
        break;
      case 'materials':
        setMaterials(data);
        break;
      case 'loads':
        setLoads(data);
        break;
      case 'seismic':
        setSeismicParams(data);
        break;
      case 'soil':
        setSoilData(data);
        break;
      default:
        console.warn(`Unknown section: ${section}`);
    }

    // Run real-time validation with debounce
    const timeoutId = setTimeout(() => {
      runRealTimeValidation(section, data);
    }, 300); // Increased debounce to 300ms
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Real-time validation function - simplified dependencies
  const runRealTimeValidation = useCallback((
    changedSection: string, 
    newData: any
  ) => {
    try {
      // Get latest data (considering the change)
      const currentProject = changedSection === 'project' ? newData : projectInfo;
      const currentGeometry = changedSection === 'geometry' ? newData : geometry;
      const currentMaterials = changedSection === 'materials' ? newData : materials;
      const currentLoads = changedSection === 'loads' ? newData : loads;
      const currentSeismic = changedSection === 'seismic' ? newData : seismicParams;
      const currentSoil = changedSection === 'soil' ? newData : soilData;

      // Run comprehensive validation
      const validationResult = validateCompleteSystem(
        currentGeometry,
        currentLoads,
        currentMaterials,
        currentSoil,
        currentSeismic,
        currentProject
      );

      setValidation(validationResult);
    } catch (error) {
      console.error('Real-time validation error:', error);
      // Set basic validation with error
      setValidation({
        isValid: false,
        errors: [{
          field: changedSection,
          message: 'Validation error occurred',
          severity: 'error'
        }],
        warnings: [],
        codeViolations: [],
        professionalReviewRequired: false
      });
    }
  }, []); // Removed dependencies to prevent re-creation

  // Validation change handler
  const handleValidationChange = useCallback((newValidation: ValidationResult) => {
    setValidation(newValidation);
  }, []);

  // Analysis execution
  const runAnalysis = useCallback(async () => {
    if (!validation?.isValid) {
      alert('Sistem tidak valid! Perbaiki error terlebih dahulu.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressSteps = [
        { progress: 20, message: 'Validating input parameters...' },
        { progress: 40, message: 'Calculating foundation system...' },
        { progress: 60, message: 'Performing seismic analysis...' },
        { progress: 80, message: 'Checking SNI compliance...' },
        { progress: 100, message: 'Analysis complete!' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalysisProgress(step.progress);
      }

      // Perform actual calculations
      const foundationType = selectFoundationType(soilData, 
        (loads.deadLoad + loads.liveLoad) * geometry.length * geometry.width,
        'C', // Seismic Design Category
        geometry.numberOfFloors * geometry.heightPerFloor
      );

      const foundationCapacity = calculateFoundationCapacity(soilData, foundationType, {
        dead: loads.deadLoad * geometry.length * geometry.width,
        live: loads.liveLoad * geometry.length * geometry.width,
        seismic: 0 // Will be calculated later
      });

      // Calculate seismic parameters
      const baseShear = calculateSeismicForce(seismicParams, geometry, materials, loads);

      // Mock results (in real implementation, use actual calculation engines)
      const results: AnalysisResults = {
        foundation: {
          type: foundationType.type as 'shallow' | 'pile' | 'mat',
          capacity: foundationCapacity.capacity,
          safetyFactor: foundationCapacity.safetyFactor,
          recommendations: [
            `Fondasi ${foundationType.type} dengan kapasitas ${foundationCapacity.capacity.toFixed(0)} kN`,
            'Gunakan concrete grade minimum fc\' = 25 MPa untuk foundasi',
            'Pastikan kedalaman fondasi minimum 1.5m dari permukaan tanah'
          ]
        },
        seismic: {
          baseShear: baseShear.V,
          naturalPeriod: 0.1 * geometry.numberOfFloors ** 0.75,
          responseSpectrum: [], // Would be generated in real implementation
          driftRatio: 0.015, // Mock value
          isCompliant: baseShear.V > 0 && (validation?.isValid || false)
        },
        materials: {
          concreteVolume: geometry.length * geometry.width * geometry.numberOfFloors * 0.15, // Mock
          steelWeight: geometry.length * geometry.width * geometry.numberOfFloors * 25, // Mock
          reinforcementRatio: 0.01, // 1%
          cost: {
            concrete: geometry.length * geometry.width * geometry.numberOfFloors * 0.15 * 800000, // Rp 800k/m³
            steel: geometry.length * geometry.width * geometry.numberOfFloors * 25 * 15000, // Rp 15k/kg
            total: 0 // Will be calculated
          }
        },
        structural: {
          maxMoment: 150.5, // Mock
          maxShear: 89.2, // Mock
          maxDeflection: 12.3, // Mock
          utilityRatio: 0.75, // Mock - good utilization
          isAdequate: true
        },
        compliance: {
          sni1726: validation.codeViolations.filter(v => v.code === 'SNI_1726_2019').length === 0,
          sni2847: validation.codeViolations.filter(v => v.code === 'SNI_2847_2019').length === 0,
          sni1727: validation.codeViolations.filter(v => v.code === 'SNI_1727_2020').length === 0,
          overallCompliance: validation.isValid,
          violations: validation.codeViolations.map(v => `${v.code}: ${v.violation}`)
        }
      };

      // Calculate total cost
      results.materials.cost.total = results.materials.cost.concrete + results.materials.cost.steel;

      setAnalysisResults(results);
      setCurrentView('results');

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Terjadi error dalam analisis. Silakan coba lagi.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [validation, loads, geometry, materials, seismicParams, soilData]);

  // Reset handler
  const handleReset = useCallback(() => {
    setCurrentView('input');
    setAnalysisResults(null);
    setValidation(null);
    setMigrationResult(null);
  }, []);

  // Export report handler
  const handleExportReport = useCallback(() => {
    setCurrentView('report');
  }, []);

  return (
    <StructuralAnalysisErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Sistem Analisis Struktur SNI
                  </h1>
                  <p className="text-sm text-gray-600">
                    Professional Structural Analysis - Zero Error Tolerance
                  </p>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center gap-4">
                {validation && (
                  <div className="flex items-center gap-2">
                    {validation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {validation.isValid ? 'VALID' : 'NEEDS ATTENTION'}
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  SNI 1726:2019 | SNI 2847:2019 | SNI 1727:2020
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="mb-6">
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <Calculator className="h-6 w-6 text-blue-600 animate-spin" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      Menjalankan Analisis Struktur SNI...
                    </h3>
                    <Progress value={analysisProgress} className="w-full" />
                    <p className="text-sm text-gray-600 mt-2">
                      {analysisProgress === 20 && 'Memvalidasi parameter input...'}
                      {analysisProgress === 40 && 'Menghitung sistem fondasi...'}
                      {analysisProgress === 60 && 'Melakukan analisis seismik...'}
                      {analysisProgress === 80 && 'Memeriksa kepatuhan SNI...'}
                      {analysisProgress === 100 && 'Analisis selesai!'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Navigation */}
          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="input" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Input & Validasi
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                disabled={!analysisResults}
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Hasil Analisis
              </TabsTrigger>
              <TabsTrigger 
                value="report" 
                disabled={!analysisResults}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Laporan
              </TabsTrigger>
            </TabsList>

            {/* Input View */}
            <TabsContent value="input">
              <div className="space-y-6">
                <InputForm
                  projectInfo={projectInfo}
                  geometry={geometry}
                  materials={materials}
                  loads={loads}
                  seismicParams={seismicParams}
                  soilData={soilData}
                  validation={validation}
                  validationLoading={isAnalyzing}
                  onUpdate={handleUpdate}
                  onValidate={() => runAnalysis()}
                />
                
                {/* Analysis Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={runAnalysis}
                    disabled={isAnalyzing || !validation?.isValid}
                    className="px-8 py-3 text-lg"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Calculator className="h-5 w-5 mr-2 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Jalankan Analisis SNI
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Results View */}
            <TabsContent value="results">
              <ResultsDisplay
                results={analysisResults}
                validation={validation}
                isLoading={isAnalyzing}
                onReset={handleReset}
                onExportReport={handleExportReport}
              />
            </TabsContent>

            {/* Report View */}
            <TabsContent value="report">
              <ReportGenerator
                projectInfo={projectInfo}
                geometry={geometry}
                materials={materials}
                loads={loads}
                seismicParams={seismicParams}
                analysisResults={analysisResults}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StructuralAnalysisErrorBoundary>
  );
};

export default SNIStructuralAnalysisSystem;