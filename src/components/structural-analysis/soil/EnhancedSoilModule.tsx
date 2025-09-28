/**
 * Enhanced Soil Data Module
 * Comprehensive soil analysis with professional SPT data interpretation
 * SNI 8460:2017 & SNI 1726:2019 compliant
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleSelect } from '@/components/ui/simple-select';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Mountain,
  Droplets,
  Zap,
  Calculator,
  BookOpen,
  Settings,
  Eye
} from 'lucide-react';

interface SPTData {
  depth: number;
  nValue: number;
  blowCounts: [number, number, number]; // 3 consecutive 15cm penetrations
  energy: number; // % - hammer efficiency
  rodLength: number; // m
  diameter: number; // mm - borehole diameter
  samplerType: 'standard' | 'modified';
  corrected_N60: number;
}

interface SoilLayer {
  topDepth: number;
  bottomDepth: number;
  soilType: 'clay' | 'silt' | 'sand' | 'gravel' | 'rock';
  description: string;
  color: string;
  consistency?: 'very_soft' | 'soft' | 'medium' | 'stiff' | 'very_stiff' | 'hard';
  density?: 'very_loose' | 'loose' | 'medium' | 'dense' | 'very_dense';
  plasticity?: 'low' | 'medium' | 'high';
  moisture?: 'dry' | 'moist' | 'wet' | 'saturated';
}

interface GroundwaterData {
  depth: number; // m below ground
  fluctuation: number; // seasonal variation in m
  artesian: boolean;
  chemistry: 'normal' | 'aggressive' | 'very_aggressive';
  ph: number;
  sulfateContent: number; // mg/L
  chlorideContent: number; // mg/L
}

interface SoilProperties {
  // Index properties
  naturalWaterContent?: number; // %
  liquidLimit?: number; // %
  plasticLimit?: number; // %
  plasticityIndex?: number; // %
  
  // Classification
  uscsClassification?: string; // e.g., "CH", "SM", "SP-SC"
  aashtoClassification?: string; // e.g., "A-7-6"
  
  // Engineering properties
  unitWeight: number; // kN/m³
  saturatedUnitWeight: number; // kN/m³
  specificGravity: number;
  voidRatio?: number;
  porosity?: number;
  permeability?: number; // m/s
  
  // Strength parameters
  cohesion: number; // kPa
  frictionAngle: number; // degrees
  undrainedShearStrength?: number; // kPa
  
  // Compressibility
  compressionIndex?: number; // Cc
  recompressionIndex?: number; // Cr
  preconsolidationPressure?: number; // kPa
  
  // Dynamic properties
  shearWaveVelocity?: number; // m/s
  shearModulus?: number; // MPa
  dampingRatio?: number; // %
}

interface EnhancedSoilData {
  // Site information
  siteInfo: {
    location: string;
    coordinates?: { lat: number; lng: number };
    elevation: number; // m above MSL
    accessDate: string;
    investigationStandard: 'SNI_4153' | 'ASTM_D1586' | 'ISO_22476';
  };

  // SPT investigation data
  sptData: SPTData[];
  
  // Soil layering
  soilLayers: SoilLayer[];
  
  // Groundwater
  groundwater: GroundwaterData;
  
  // Representative properties
  properties: SoilProperties;
  
  // Site classification per SNI 1726:2019
  siteClassification: {
    siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
    averageN30: number; // for top 30m
    averageVs30: number; // shear wave velocity for top 30m
    determination: 'calculated' | 'assumed' | 'measured';
    reasoning: string;
  };

  // Recommendations
  geotechnicalRecommendations: {
    foundationType: string[];
    bearingCapacity: {
      allowable: number; // kPa
      ultimate: number; // kPa
      method: string;
      safetyFactor: number;
    };
    settlement: {
      immediate: number; // mm
      consolidation: number; // mm
      total: number; // mm
    };
    constraints: string[];
    additionalInvestigation?: string[];
  };
}

interface EnhancedSoilModuleProps {
  soilData?: EnhancedSoilData;
  onUpdate?: (data: EnhancedSoilData) => void;
  readonly?: boolean;
}

const EnhancedSoilModule: React.FC<EnhancedSoilModuleProps> = ({
  soilData: initialData,
  onUpdate,
  readonly = false
}) => {
  const [soilData, setSoilData] = useState<EnhancedSoilData>(
    initialData || {
      siteInfo: {
        location: '',
        elevation: 0,
        accessDate: new Date().toISOString().split('T')[0],
        investigationStandard: 'SNI_4153'
      },
      sptData: [
        { depth: 1.5, nValue: 10, blowCounts: [6, 8, 12], energy: 75, rodLength: 1.5, diameter: 65, samplerType: 'standard', corrected_N60: 8 },
        { depth: 3.0, nValue: 15, blowCounts: [8, 12, 18], energy: 75, rodLength: 3.0, diameter: 65, samplerType: 'standard', corrected_N60: 12 },
        { depth: 4.5, nValue: 25, blowCounts: [12, 15, 20], energy: 75, rodLength: 4.5, diameter: 65, samplerType: 'standard', corrected_N60: 19 },
        { depth: 6.0, nValue: 30, blowCounts: [15, 18, 25], energy: 75, rodLength: 6.0, diameter: 65, samplerType: 'standard', corrected_N60: 23 },
        { depth: 9.0, nValue: 45, blowCounts: [20, 25, 30], energy: 75, rodLength: 9.0, diameter: 65, samplerType: 'standard', corrected_N60: 34 },
        { depth: 15.0, nValue: 60, blowCounts: [30, 35, 40], energy: 75, rodLength: 15.0, diameter: 65, samplerType: 'standard', corrected_N60: 45 }
      ],
      soilLayers: [
        { topDepth: 0, bottomDepth: 2.5, soilType: 'clay', description: 'Soft to medium clay, high plasticity', color: '#8B4513', consistency: 'soft', plasticity: 'high', moisture: 'moist' },
        { topDepth: 2.5, bottomDepth: 8.0, soilType: 'silt', description: 'Sandy silt, medium dense', color: '#D2B48C', density: 'medium', moisture: 'moist' },
        { topDepth: 8.0, bottomDepth: 20.0, soilType: 'sand', description: 'Dense sand with gravel', color: '#F4A460', density: 'dense', moisture: 'saturated' }
      ],
      groundwater: {
        depth: 2.8,
        fluctuation: 0.5,
        artesian: false,
        chemistry: 'normal',
        ph: 7.2,
        sulfateContent: 150,
        chlorideContent: 200
      },
      properties: {
        unitWeight: 18.5,
        saturatedUnitWeight: 19.8,
        specificGravity: 2.68,
        cohesion: 15,
        frictionAngle: 28,
        permeability: 1e-7
      },
      siteClassification: {
        siteClass: 'SD',
        averageN30: 25,
        averageVs30: 280,
        determination: 'calculated',
        reasoning: 'Based on SPT-N values for top 30m as per SNI 1726:2019'
      },
      geotechnicalRecommendations: {
        foundationType: ['Shallow foundation suitable', 'Consider mat foundation for large loads'],
        bearingCapacity: {
          allowable: 150,
          ultimate: 450,
          method: 'Terzaghi bearing capacity formula',
          safetyFactor: 3.0
        },
        settlement: {
          immediate: 15,
          consolidation: 25,
          total: 40
        },
        constraints: ['Monitor groundwater during construction', 'Dewatering may be required'],
        additionalInvestigation: ['Consolidation test recommended for settlement analysis']
      }
    }
  );

  const [activeTab, setActiveTab] = useState('overview');
  const [showCalculations, setShowCalculations] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);

  // Calculations
  const calculateN60Corrected = (spt: SPTData): number => {
    const energyCorrection = spt.energy / 60; // Standard energy ratio
    const rodCorrection = spt.rodLength < 3 ? 0.75 : spt.rodLength < 6 ? 0.85 : spt.rodLength < 10 ? 0.95 : 1.0;
    const diameterCorrection = spt.diameter > 100 ? 1.15 : 1.0;
    
    return Math.round(spt.nValue * energyCorrection * rodCorrection * diameterCorrection);
  };

  const calculateSiteClass = (): string => {
    const avgN30 = calculateAverageN30();
    
    if (avgN30 > 50) return 'SC'; // Very dense soil
    if (avgN30 > 15) return 'SD'; // Stiff soil
    if (avgN30 > 4) return 'SE'; // Soft soil
    return 'SF'; // Special study required
  };

  const calculateAverageN30 = (): number => {
    const validSPT = soilData.sptData.filter(spt => spt.depth <= 30);
    if (validSPT.length === 0) return 0;
    
    const totalN60 = validSPT.reduce((sum, spt) => sum + spt.corrected_N60, 0);
    return Math.round(totalN60 / validSPT.length);
  };

  const interpretConsistency = (nValue: number, soilType: string): string => {
    if (soilType === 'clay' || soilType === 'silt') {
      if (nValue < 2) return 'Very Soft';
      if (nValue < 4) return 'Soft';
      if (nValue < 8) return 'Medium';
      if (nValue < 15) return 'Stiff';
      if (nValue < 30) return 'Very Stiff';
      return 'Hard';
    } else {
      if (nValue < 4) return 'Very Loose';
      if (nValue < 10) return 'Loose';
      if (nValue < 30) return 'Medium Dense';
      if (nValue < 50) return 'Dense';
      return 'Very Dense';
    }
  };

  const validateSPTData = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (soilData.sptData.length < 3) {
      errors.push('Minimum 3 SPT data points required for reliable analysis');
    }

    soilData.sptData.forEach((spt, index) => {
      if (spt.nValue < 0 || spt.nValue > 100) {
        errors.push(`SPT ${index + 1}: N-value ${spt.nValue} is unrealistic`);
      }
      
      if (spt.energy < 50 || spt.energy > 100) {
        warnings.push(`SPT ${index + 1}: Energy ratio ${spt.energy}% may affect results`);
      }

      if (spt.depth > 30 && soilData.sptData.filter(s => s.depth <= 30).length < 4) {
        warnings.push('Limited shallow SPT data for site classification');
      }
    });

    setValidationResults({ errors, warnings });
  };

  useEffect(() => {
    validateSPTData();
    onUpdate?.(soilData);
  }, [soilData]);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Site Classification Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Site Classification (SNI 1726:2019)</span>
            </div>
            <Badge className={
              soilData.siteClassification.siteClass === 'SA' || soilData.siteClassification.siteClass === 'SB' ? 'bg-green-100 text-green-800' :
              soilData.siteClassification.siteClass === 'SC' || soilData.siteClassification.siteClass === 'SD' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              Class {soilData.siteClassification.siteClass}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{soilData.siteClassification.averageN30}</div>
              <div className="text-sm text-gray-600">Average N₆₀ (30m)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{soilData.siteClassification.averageVs30}</div>
              <div className="text-sm text-gray-600">Vs₃₀ (m/s)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{soilData.groundwater.depth}m</div>
              <div className="text-sm text-gray-600">Groundwater Depth</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{soilData.siteClassification.reasoning}</p>
          </div>
        </CardContent>
      </Card>

      {/* Soil Profile Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Layers className="w-5 h-5" />
            <span>Soil Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            {/* Depth scale */}
            <div className="w-12 mr-4">
              <div className="text-xs font-medium mb-2">Depth (m)</div>
              {Array.from({ length: 21 }, (_, i) => (
                <div key={i} className="h-8 flex items-center text-xs text-gray-600 border-t border-gray-200">
                  {i}
                </div>
              ))}
            </div>

            {/* Soil layers */}
            <div className="flex-1">
              <div className="text-xs font-medium mb-2">Soil Description</div>
              <div className="relative">
                {soilData.soilLayers.map((layer, index) => {
                  const height = (layer.bottomDepth - layer.topDepth) * 32; // 32px per meter
                  return (
                    <div
                      key={index}
                      className="border border-gray-400 relative overflow-hidden"
                      style={{
                        height: `${height}px`,
                        backgroundColor: layer.color,
                        opacity: 0.8
                      }}
                    >
                      <div className="p-2 h-full flex flex-col justify-center">
                        <div className="text-xs font-semibold text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                          {layer.description}
                        </div>
                        <div className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded mt-1">
                          {layer.consistency || layer.density}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SPT values */}
            <div className="w-20 ml-4">
              <div className="text-xs font-medium mb-2">N-SPT</div>
              <div className="relative" style={{ height: '672px' }}>
                {soilData.sptData.map((spt, index) => (
                  <div
                    key={index}
                    className="absolute w-full flex items-center justify-center"
                    style={{ top: `${spt.depth * 32 - 16}px` }}
                  >
                    <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                      {spt.corrected_N60}
                    </div>
                  </div>
                ))}
                
                {/* Groundwater line */}
                <div
                  className="absolute w-full border-t-2 border-blue-500 border-dashed"
                  style={{ top: `${soilData.groundwater.depth * 32}px` }}
                >
                  <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded absolute right-0 -mt-6">
                    GWT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults && (
        <Card className={validationResults.errors.length > 0 ? 'border-red-200' : 'border-yellow-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {validationResults.errors.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span>Data Validation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {validationResults.errors.map((error: string, index: number) => (
              <Alert key={index} className="border-red-200 bg-red-50">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            ))}
            
            {validationResults.warnings.map((warning: string, index: number) => (
              <Alert key={index} className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <AlertDescription className="text-yellow-800">{warning}</AlertDescription>
              </Alert>
            ))}
            
            {validationResults.errors.length === 0 && validationResults.warnings.length === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <AlertDescription className="text-green-800">
                  SPT data validation passed successfully
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSPTData = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SPT Investigation Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Depth (m)</th>
                  <th className="text-left p-2">N-SPT</th>
                  <th className="text-left p-2">Blow Counts</th>
                  <th className="text-left p-2">Energy (%)</th>
                  <th className="text-left p-2">N₆₀ Corrected</th>
                  <th className="text-left p-2">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {soilData.sptData.map((spt, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{spt.depth}</td>
                    <td className="p-2 font-mono">{spt.nValue}</td>
                    <td className="p-2 font-mono text-xs">{spt.blowCounts.join('-')}</td>
                    <td className="p-2">{spt.energy}%</td>
                    <td className="p-2 font-bold text-red-600">{spt.corrected_N60}</td>
                    <td className="p-2 text-xs">
                      {interpretConsistency(spt.corrected_N60, soilData.soilLayers.find(layer => 
                        spt.depth >= layer.topDepth && spt.depth <= layer.bottomDepth
                      )?.soilType || 'sand')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit SPT Data */}
      {!readonly && (
        <Card>
          <CardHeader>
            <CardTitle>Add SPT Data Point</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Depth (m)</Label>
                <Input type="number" step="0.5" placeholder="3.0" />
              </div>
              <div>
                <Label>N-SPT Value</Label>
                <Input type="number" placeholder="25" />
              </div>
              <div>
                <Label>Energy Ratio (%)</Label>
                <Input type="number" placeholder="75" />
              </div>
              <div>
                <Label>Rod Length (m)</Label>
                <Input type="number" step="0.5" placeholder="3.0" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button>Add SPT Data</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderGeotechnicalAnalysis = () => (
    <div className="space-y-6">
      {/* Bearing Capacity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Bearing Capacity Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {soilData.geotechnicalRecommendations.bearingCapacity.ultimate} kPa
              </div>
              <div className="text-sm text-gray-600">Ultimate Bearing Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {soilData.geotechnicalRecommendations.bearingCapacity.allowable} kPa
              </div>
              <div className="text-sm text-gray-600">Allowable Bearing Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {soilData.geotechnicalRecommendations.bearingCapacity.safetyFactor}
              </div>
              <div className="text-sm text-gray-600">Safety Factor</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>Method:</strong> {soilData.geotechnicalRecommendations.bearingCapacity.method}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settlement Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5" />
            <span>Settlement Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {soilData.geotechnicalRecommendations.settlement.immediate} mm
              </div>
              <div className="text-sm text-gray-600">Immediate Settlement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {soilData.geotechnicalRecommendations.settlement.consolidation} mm
              </div>
              <div className="text-sm text-gray-600">Consolidation Settlement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {soilData.geotechnicalRecommendations.settlement.total} mm
              </div>
              <div className="text-sm text-gray-600">Total Settlement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Geotechnical Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Foundation Type</h4>
            <ul className="space-y-1">
              {soilData.geotechnicalRecommendations.foundationType.map((rec, index) => (
                <li key={index} className="text-sm text-green-700 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Construction Constraints</h4>
            <ul className="space-y-1">
              {soilData.geotechnicalRecommendations.constraints.map((constraint, index) => (
                <li key={index} className="text-sm text-yellow-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </div>

          {soilData.geotechnicalRecommendations.additionalInvestigation && (
            <div>
              <h4 className="font-medium mb-2">Additional Investigation</h4>
              <ul className="space-y-1">
                {soilData.geotechnicalRecommendations.additionalInvestigation.map((inv, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Enhanced Soil Data Module</h1>
            <p className="mt-2 opacity-90">
              Comprehensive Geotechnical Analysis per SNI 8460:2017 & SNI 1726:2019
            </p>
          </div>
          <div className="text-6xl opacity-20">
            <Mountain />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="spt" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>SPT Data</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="spt">
          {renderSPTData()}
        </TabsContent>

        <TabsContent value="analysis">
          {renderGeotechnicalAnalysis()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSoilModule;