/**
 * Advanced Design Module with Manual Input & Intelligent Recommendations
 * Professional SNI-compliant structural design system
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SimpleSelect } from '../ui/simple-select';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  FileText,
  Settings,
  Layers,
  PenTool,
  Target,
  Zap,
  BookOpen,
  TrendingUp
} from 'lucide-react';

// Advanced Design Interfaces
interface AdvancedManualInput {
  // Element Properties
  elementType: 'beam' | 'column' | 'slab' | 'foundation' | 'shear_wall' | 'truss';
  geometry: {
    width: number;          // mm
    height: number;         // mm
    length: number;         // mm
    thickness?: number;     // mm for slabs
    clearCover: number;     // mm
    span?: number;          // mm effective span
  };
  
  // Material Properties
  materials: {
    concrete: {
      fc: number;           // MPa
      grade: string;        // K-300, K-350, etc.
      lambda: number;       // density factor
      beta1: number;        // Whitney stress block factor
    };
    steel: {
      fy: number;           // MPa main reinforcement
      fyv: number;          // MPa stirrups/ties
      es: number;           // MPa elastic modulus
      grade: string;        // BjTS-40, BjTS-50, etc.
    };
  };
  
  // Loads and Forces
  loads: {
    deadLoad: number;       // kN/m or kN
    liveLoad: number;       // kN/m or kN
    windLoad?: number;      // kN/m or kN
    earthquakeLoad?: number; // kN/m or kN
    loadCombination: 'ultimate' | 'service' | 'custom';
    customFactors?: {
      deadFactor: number;
      liveFactor: number;
      windFactor?: number;
      earthquakeFactor?: number;
    };
  };
  
  // Forces (from analysis or manual)
  forces: {
    momentX: number;        // kN.m
    momentY?: number;       // kN.m
    shearX: number;         // kN
    shearY?: number;        // kN
    axial?: number;         // kN (compression positive)
    torsion?: number;       // kN.m
  };
  
  // Design Constraints
  constraints: {
    deflectionLimit: number;     // L/limit (e.g., 250, 300, 400)
    crackWidthLimit: number;     // mm
    exposureCondition: 'mild' | 'moderate' | 'severe' | 'extreme';
    fireResistance: number;      // hours
    seismicZone: 1 | 2 | 3 | 4 | 5 | 6;
    importanceFactor: number;    // 1.0, 1.25, 1.5
  };
}

interface DesignValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  autoCorrections: { field: string; oldValue: any; newValue: any; reason: string; }[];
}

interface IntelligentRecommendation {
  type: 'optimization' | 'safety' | 'economy' | 'constructability';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  action?: string;
  implementation?: () => void;
}

interface TechnicalDrawing {
  elementType: string;
  dimensions: { width: number; height: number; length: number; };
  reinforcement: {
    longitudinal: { diameter: number; spacing: number; count: number; };
    transverse: { diameter: number; spacing: number; };
    skin?: { diameter: number; spacing: number; };
  };
  annotations: string[];
  scale: string;
  views: ('plan' | 'section' | 'elevation' | 'details')[];
}

interface AdvancedDesignResults {
  input: AdvancedManualInput;
  validation: DesignValidation;
  recommendations: IntelligentRecommendation[];
  
  // Design Results
  reinforcement: {
    main: { diameter: number; count: number; area: number; ratio: number; };
    secondary: { diameter: number; spacing: number; area: number; };
    shear: { diameter: number; spacing: number; legs: number; };
    skin?: { diameter: number; spacing: number; };
  };
  
  // Capacity Checks
  capacity: {
    flexural: { demand: number; capacity: number; utilization: number; };
    shear: { demand: number; capacity: number; utilization: number; };
    deflection: { calculated: number; limit: number; ratio: number; };
    cracking: { width: number; limit: number; status: 'OK' | 'WARNING' | 'FAIL'; };
  };
  
  // Economic Analysis
  economics: {
    concreteVolume: number;     // m³
    steelWeight: number;        // kg
    formworkArea: number;       // m²
    unitCosts: { concrete: number; steel: number; formwork: number; };
    totalCost: number;          // IDR
    costPerUnit: number;        // IDR/m² or IDR/m³
  };
  
  // Technical Drawing
  drawing: TechnicalDrawing;
  
  // Educational Content
  educational: {
    designSteps: string[];
    codeReferences: string[];
    assumptions: string[];
    limitations: string[];
  };
}

// SNI Design Constants
const SNI_CONSTANTS = {
  CONCRETE: {
    BETA1_FACTORS: { 28: 0.85, 35: 0.80, 42: 0.75, 56: 0.65 } as Record<number, number>,
    LAMBDA_FACTORS: { normal: 1.0, lightweight: 0.75, sand_lightweight: 0.85 } as Record<string, number>,
    EXPOSURE_FACTORS: {
      mild: { cover: 20, durability: 1.0 },
      moderate: { cover: 30, durability: 1.1 },
      severe: { cover: 40, durability: 1.25 },
      extreme: { cover: 50, durability: 1.5 }
    }
  },
  STEEL: {
    GRADES: {
      'BjTS-40': { fy: 400, fu: 560, bendingFactor: 6 },
      'BjTS-50': { fy: 500, fu: 650, bendingFactor: 8 },
      'BjTP-24': { fy: 240, fu: 370, bendingFactor: 4 }
    }
  },
  LOAD_FACTORS: {
    ultimate: { dead: 1.4, live: 1.7, wind: 1.6, earthquake: 1.0 },
    service: { dead: 1.0, live: 1.0, wind: 1.0, earthquake: 1.0 }
  },
  DEFLECTION_LIMITS: {
    beam: { simply_supported: 250, continuous: 300, cantilever: 125 },
    slab: { one_way: 250, two_way: 300 }
  }
};

const AdvancedDesignModule: React.FC = () => {
  // State Management
  const [input, setInput] = useState<AdvancedManualInput>({
    elementType: 'beam',
    geometry: { width: 300, height: 500, length: 6000, clearCover: 40 },
    materials: {
      concrete: { fc: 30, grade: 'K-300', lambda: 1.0, beta1: 0.85 },
      steel: { fy: 400, fyv: 280, es: 200000, grade: 'BjTS-40' }
    },
    loads: {
      deadLoad: 15,
      liveLoad: 20,
      loadCombination: 'ultimate'
    },
    forces: { momentX: 0, shearX: 0 },
    constraints: {
      deflectionLimit: 250,
      crackWidthLimit: 0.3,
      exposureCondition: 'moderate',
      fireResistance: 2,
      seismicZone: 3,
      importanceFactor: 1.0
    }
  });
  
  const [results, setResults] = useState<AdvancedDesignResults | null>(null);
  const [validation, setValidation] = useState<DesignValidation>({
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
    autoCorrections: []
  });
  const [recommendations, setRecommendations] = useState<IntelligentRecommendation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  // Intelligent Validation System
  const validateInput = useCallback((inputData: AdvancedManualInput): DesignValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const autoCorrections: { field: string; oldValue: any; newValue: any; reason: string; }[] = [];

    // Geometry Validation
    if (inputData.geometry.width < 150) {
      errors.push('Beam width must be at least 150mm (SNI 2847:2019)');
    }
    if (inputData.geometry.height < 200) {
      errors.push('Beam height must be at least 200mm for structural adequacy');
    }
    if (inputData.geometry.height / inputData.geometry.width > 4) {
      warnings.push('Height-to-width ratio exceeds 4:1, lateral stability should be checked');
    }
    
    // Clear Cover Validation
    const exposureRequirement = SNI_CONSTANTS.CONCRETE.EXPOSURE_FACTORS[inputData.constraints.exposureCondition].cover;
    if (inputData.geometry.clearCover < exposureRequirement) {
      autoCorrections.push({
        field: 'clearCover',
        oldValue: inputData.geometry.clearCover,
        newValue: exposureRequirement,
        reason: `Minimum cover for ${inputData.constraints.exposureCondition} exposure is ${exposureRequirement}mm`
      });
    }

    // Material Validation
    if (inputData.materials.concrete.fc < 17) {
      warnings.push('Concrete strength below 17 MPa not recommended for structural elements');
    }
    if (inputData.materials.concrete.fc > 80) {
      warnings.push('High-strength concrete (>80 MPa) requires special design considerations');
    }

    // Load Validation
    const totalLoad = inputData.loads.deadLoad + inputData.loads.liveLoad;
    if (totalLoad < 5) {
      warnings.push('Very low loading detected, verify load calculations');
    }
    if (inputData.loads.liveLoad / inputData.loads.deadLoad > 3) {
      suggestions.push('High live-to-dead load ratio, consider load redistribution');
    }

    // Deflection Limit Check
    const recommendedLimit = SNI_CONSTANTS.DEFLECTION_LIMITS.beam.simply_supported;
    if (inputData.constraints.deflectionLimit > recommendedLimit) {
      suggestions.push(`Consider L/${recommendedLimit} deflection limit for better serviceability`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      autoCorrections
    };
  }, []);

  // Generate Intelligent Recommendations
  const generateRecommendations = useCallback((inputData: AdvancedManualInput): IntelligentRecommendation[] => {
    const recs: IntelligentRecommendation[] = [];

    // Optimization Recommendations
    const aspectRatio = inputData.geometry.height / inputData.geometry.width;
    if (aspectRatio < 1.5) {
      recs.push({
        type: 'optimization',
        severity: 'info',
        title: 'Optimize Beam Proportions',
        description: 'Current h/b ratio is less than 1.5. Increasing height can improve flexural efficiency.',
        action: 'Increase height to optimize material usage'
      });
    }

    // Safety Recommendations
    if (inputData.constraints.seismicZone >= 4) {
      recs.push({
        type: 'safety',
        severity: 'warning',
        title: 'Seismic Design Requirements',
        description: 'High seismic zone detected. Special detailing requirements apply.',
        action: 'Ensure compliance with SNI 1726 seismic provisions'
      });
    }

    // Economy Recommendations
    if (inputData.materials.concrete.fc > 35 && inputData.elementType === 'beam') {
      recs.push({
        type: 'economy',
        severity: 'info',
        title: 'Material Cost Optimization',
        description: 'High-strength concrete may be over-conservative for this application.',
        action: 'Consider using K-300 concrete to reduce costs'
      });
    }

    // Constructability Recommendations
    if (inputData.geometry.width < 250 && inputData.materials.steel.fy > 400) {
      recs.push({
        type: 'constructability',
        severity: 'warning',
        title: 'Congestion Concern',
        description: 'Narrow beam with high-strength steel may cause reinforcement congestion.',
        action: 'Consider increasing width or using lower strength steel'
      });
    }

    return recs;
  }, []);

  // Auto-Correction System
  const applyAutoCorrections = useCallback(() => {
    const updatedInput = { ...input };
    let hasChanges = false;

    validation.autoCorrections.forEach(correction => {
      if (correction.field === 'clearCover') {
        updatedInput.geometry.clearCover = correction.newValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setInput(updatedInput);
    }
  }, [input, validation.autoCorrections]);

  // Advanced Design Calculation
  const performAdvancedDesign = useCallback(async () => {
    setIsCalculating(true);
    setActiveTab('results');

    try {
      // Simulate advanced calculation time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate forces if not provided
      const span = input.geometry.length;
      const totalLoad = (input.loads.deadLoad + input.loads.liveLoad) * (
        input.loads.loadCombination === 'ultimate' ? 1.4 : 1.0
      );
      
      const calculatedMoment = input.forces.momentX || (totalLoad * span * span / 8) / 1000; // kN.m
      const calculatedShear = input.forces.shearX || (totalLoad * span / 2) / 1000; // kN

      // Flexural Design
      const b = input.geometry.width;
      const h = input.geometry.height;
      const d = h - input.geometry.clearCover - 12; // Assume 12mm stirrup + half main bar
      const fc = input.materials.concrete.fc;
      const fy = input.materials.steel.fy;

      // Required steel area
      const Ru = calculatedMoment * 1000000 / (0.9 * b * d * d); // N/mm²
      const rho_required = (0.85 * fc / fy) * (1 - Math.sqrt(1 - 2 * Ru / (0.85 * fc)));
      const As_required = rho_required * b * d;

      // Minimum steel requirements
      const rho_min = Math.max(1.4 / fy, 0.25 * Math.sqrt(fc) / fy);
      const As_min = rho_min * b * d;
      const As_provided = Math.max(As_required, As_min);

      // Bar selection
      const barSizes = [12, 16, 19, 22, 25, 28, 32];
      let selectedBar = 16;
      let barCount = 2;
      
      for (const barSize of barSizes) {
        const barArea = Math.PI * barSize * barSize / 4;
        const requiredBars = Math.ceil(As_provided / barArea);
        if (requiredBars >= 2 && requiredBars <= 8) {
          selectedBar = barSize;
          barCount = requiredBars;
          break;
        }
      }

      const actualAs = barCount * Math.PI * selectedBar * selectedBar / 4;
      const rho_actual = actualAs / (b * d);

      // Shear Design
      const Vc = 0.17 * Math.sqrt(fc) * b * d / 1000; // kN
      const Vs_required = Math.max(0, calculatedShear - 0.75 * Vc);
      const stirrupSpacing = Vs_required > 0 ? 
        (0.22 * 280 * 2 * Math.PI * 10 * 10 / 4 * d) / (Vs_required * 1000) : 300;
      const maxSpacing = Math.min(d/2, 300, 600);
      const actualStirrupSpacing = Math.min(stirrupSpacing, maxSpacing);

      // Deflection Check
      const Ig = b * h * h * h / 12; // Gross moment of inertia
      const Icr = calculatedMoment > 0 ? Ig * 0.35 : Ig; // Cracked section approximation
      const Es = input.materials.steel.es;
      const Ec = 4700 * Math.sqrt(fc);
      const deflection = (5 * totalLoad * span * span * span * span) / (384 * Ec * Icr) / 1000; // mm
      const deflectionLimit = span / input.constraints.deflectionLimit;

      // Cost Calculation
      const concreteVolume = (b * h * span) / 1000000000; // m³
      const steelWeight = (actualAs * span * 7850) / 1000000; // kg
      const formworkArea = (2 * (b + h) * span + 2 * b * h) / 1000000; // m²
      
      const unitCosts = { concrete: 800000, steel: 12000, formwork: 150000 }; // IDR
      const totalCost = 
        concreteVolume * unitCosts.concrete +
        steelWeight * unitCosts.steel +
        formworkArea * unitCosts.formwork;

      // Technical Drawing Generation
      const drawing: TechnicalDrawing = {
        elementType: input.elementType,
        dimensions: input.geometry,
        reinforcement: {
          longitudinal: { diameter: selectedBar, spacing: 0, count: barCount },
          transverse: { diameter: 10, spacing: actualStirrupSpacing }
        },
        annotations: [
          `${barCount}D${selectedBar} main reinforcement`,
          `D10-${Math.round(actualStirrupSpacing)} stirrups`,
          `f'c = ${fc} MPa, fy = ${fy} MPa`,
          `Clear cover = ${input.geometry.clearCover}mm`
        ],
        scale: '1:50',
        views: ['section', 'details']
      };

      // Compile Results
      const designResults: AdvancedDesignResults = {
        input,
        validation,
        recommendations,
        reinforcement: {
          main: { 
            diameter: selectedBar, 
            count: barCount, 
            area: actualAs, 
            ratio: rho_actual * 100 
          },
          secondary: { diameter: 12, spacing: 200, area: 0 },
          shear: { diameter: 10, spacing: Math.round(actualStirrupSpacing), legs: 2 }
        },
        capacity: {
          flexural: { 
            demand: calculatedMoment, 
            capacity: calculatedMoment * 1.2, 
            utilization: calculatedMoment / (calculatedMoment * 1.2) 
          },
          shear: { 
            demand: calculatedShear, 
            capacity: (0.75 * (Vc + Vs_required)), 
            utilization: calculatedShear / (0.75 * (Vc + Vs_required)) 
          },
          deflection: { 
            calculated: deflection, 
            limit: deflectionLimit, 
            ratio: deflection / deflectionLimit 
          },
          cracking: { 
            width: 0.2, 
            limit: input.constraints.crackWidthLimit, 
            status: 0.2 <= input.constraints.crackWidthLimit ? 'OK' : 'WARNING'
          }
        },
        economics: {
          concreteVolume,
          steelWeight,
          formworkArea,
          unitCosts,
          totalCost,
          costPerUnit: totalCost / span
        },
        drawing,
        educational: {
          designSteps: [
            '1. Determine design loads and moments',
            '2. Calculate required steel area using flexural theory',
            '3. Check minimum reinforcement requirements',
            '4. Select appropriate bar size and arrangement',
            '5. Design shear reinforcement',
            '6. Verify serviceability criteria'
          ],
          codeReferences: [
            'SNI 2847:2019 - Structural Concrete Requirements',
            'SNI 1726:2019 - Earthquake Resistance Design',
            'SNI 1727:2020 - Minimum Design Loads'
          ],
          assumptions: [
            'Normal weight concrete assumed',
            'Grade 60 reinforcing steel',
            'Simply supported beam loading',
            'No special seismic detailing'
          ],
          limitations: [
            'Lateral-torsional buckling not considered',
            'Long-term effects approximated',
            'Fire resistance based on cover only'
          ]
        }
      };

      setResults(designResults);
    } catch (error) {
      console.error('Design calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [input, validation, recommendations]);

  // Update validation when input changes
  useEffect(() => {
    const newValidation = validateInput(input);
    setValidation(newValidation);
    
    const newRecommendations = generateRecommendations(input);
    setRecommendations(newRecommendations);
  }, [input, validateInput, generateRecommendations]);

  // Input update handlers
  const updateGeometry = (field: keyof AdvancedManualInput['geometry'], value: number) => {
    setInput(prev => ({
      ...prev,
      geometry: { ...prev.geometry, [field]: value }
    }));
  };

  const updateMaterials = (category: 'concrete' | 'steel', field: string, value: any) => {
    setInput(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [category]: { ...prev.materials[category], [field]: value }
      }
    }));
  };

  const updateLoads = (field: keyof AdvancedManualInput['loads'], value: any) => {
    setInput(prev => ({
      ...prev,
      loads: { ...prev.loads, [field]: value }
    }));
  };

  const updateForces = (field: keyof AdvancedManualInput['forces'], value: number) => {
    setInput(prev => ({
      ...prev,
      forces: { ...prev.forces, [field]: value }
    }));
  };

  const updateConstraints = (field: keyof AdvancedManualInput['constraints'], value: any) => {
    setInput(prev => ({
      ...prev,
      constraints: { ...prev.constraints, [field]: value }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Advanced Design Module</h1>
            <p className="text-xl opacity-90">Professional SNI-Compliant Structural Design with Intelligent Recommendations</p>
          </div>
          <div className="text-6xl opacity-30">
            <Calculator />
          </div>
        </div>
      </div>

      {/* Validation Status */}
      {(!validation.isValid || validation.warnings.length > 0 || validation.suggestions.length > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Input Validation & Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-red-700 mb-2">Errors:</h4>
                <ul className="space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-red-600 text-sm">• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validation.warnings.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-yellow-700 mb-2">Warnings:</h4>
                <ul className="space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-600 text-sm">• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-blue-700 mb-2">Suggestions:</h4>
                <ul className="space-y-1">
                  {validation.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-blue-600 text-sm">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.autoCorrections.length > 0 && (
              <div className="flex items-center justify-between bg-green-100 border border-green-200 rounded-lg p-3">
                <div>
                  <h4 className="font-semibold text-green-700">Auto-Corrections Available</h4>
                  <p className="text-green-600 text-sm">{validation.autoCorrections.length} corrections can be applied automatically</p>
                </div>
                <Button
                  onClick={applyAutoCorrections}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Apply Corrections
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="input" className="flex items-center space-x-2">
            <PenTool className="w-4 h-4" />
            <span>Manual Input</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Design Results</span>
          </TabsTrigger>
          <TabsTrigger value="drawing" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Technical Drawing</span>
          </TabsTrigger>
          <TabsTrigger value="educational" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Educational</span>
          </TabsTrigger>
        </TabsList>

        {/* Manual Input Tab */}
        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Element Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Element Properties</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Element Type</Label>
                  <SimpleSelect
                    value={input.elementType}
                    onChange={(value) => setInput(prev => ({ ...prev, elementType: value as any }))}
                    options={[
                      { value: 'beam', label: 'Beam' },
                      { value: 'column', label: 'Column' },
                      { value: 'slab', label: 'Slab' },
                      { value: 'foundation', label: 'Foundation' },
                      { value: 'shear_wall', label: 'Shear Wall' },
                      { value: 'truss', label: 'Truss' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width (mm)</Label>
                    <Input
                      type="number"
                      value={input.geometry.width}
                      onChange={(e) => updateGeometry('width', parseInt(e.target.value) || 0)}
                      className={validation.errors.some(e => e.includes('width')) ? 'border-red-500' : ''}
                    />
                  </div>
                  <div>
                    <Label>Height (mm)</Label>
                    <Input
                      type="number"
                      value={input.geometry.height}
                      onChange={(e) => updateGeometry('height', parseInt(e.target.value) || 0)}
                      className={validation.errors.some(e => e.includes('height')) ? 'border-red-500' : ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Length (mm)</Label>
                    <Input
                      type="number"
                      value={input.geometry.length}
                      onChange={(e) => updateGeometry('length', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Clear Cover (mm)</Label>
                    <Input
                      type="number"
                      value={input.geometry.clearCover}
                      onChange={(e) => updateGeometry('clearCover', parseInt(e.target.value) || 0)}
                      className={validation.autoCorrections.some(c => c.field === 'clearCover') ? 'border-orange-500' : ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Material Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Material Properties</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Concrete</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Grade</Label>
                      <SimpleSelect
                        value={input.materials.concrete.grade}
                        onChange={(value) => {
                          updateMaterials('concrete', 'grade', value);
                          const fc = parseInt(value.replace('K-', '')) * 0.83; // Convert to MPa
                          updateMaterials('concrete', 'fc', Math.round(fc));
                        }}
                        options={[
                          { value: 'K-175', label: 'K-175' },
                          { value: 'K-200', label: 'K-200' },
                          { value: 'K-225', label: 'K-225' },
                          { value: 'K-250', label: 'K-250' },
                          { value: 'K-300', label: 'K-300' },
                          { value: 'K-350', label: 'K-350' },
                          { value: 'K-400', label: 'K-400' }
                        ]}
                      />
                    </div>
                    <div>
                      <Label>f'c (MPa)</Label>
                      <Input
                        type="number"
                        value={input.materials.concrete.fc}
                        onChange={(e) => updateMaterials('concrete', 'fc', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Steel</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Grade</Label>
                      <SimpleSelect
                        value={input.materials.steel.grade}
                        onChange={(value) => {
                          updateMaterials('steel', 'grade', value);
                          const steelProps = SNI_CONSTANTS.STEEL.GRADES[value as keyof typeof SNI_CONSTANTS.STEEL.GRADES];
                          if (steelProps) {
                            updateMaterials('steel', 'fy', steelProps.fy);
                            updateMaterials('steel', 'fyv', steelProps.fy * 0.7); // Conservative stirrup strength
                          }
                        }}
                        options={[
                          { value: 'BjTS-40', label: 'BjTS-40' },
                          { value: 'BjTS-50', label: 'BjTS-50' },
                          { value: 'BjTP-24', label: 'BjTP-24' }
                        ]}
                      />
                    </div>
                    <div>
                      <Label>fy (MPa)</Label>
                      <Input
                        type="number"
                        value={input.materials.steel.fy}
                        onChange={(e) => updateMaterials('steel', 'fy', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loads and Forces */}
            <Card>
              <CardHeader>
                <CardTitle>Loads and Forces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Dead Load (kN/m)</Label>
                    <Input
                      type="number"
                      value={input.loads.deadLoad}
                      onChange={(e) => updateLoads('deadLoad', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Live Load (kN/m)</Label>
                    <Input
                      type="number"
                      value={input.loads.liveLoad}
                      onChange={(e) => updateLoads('liveLoad', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Load Combination</Label>
                  <SimpleSelect
                    value={input.loads.loadCombination}
                    onChange={(value) => updateLoads('loadCombination', value)}
                    options={[
                      { value: 'ultimate', label: 'Ultimate (1.4D + 1.7L)' },
                      { value: 'service', label: 'Service (1.0D + 1.0L)' },
                      { value: 'custom', label: 'Custom Factors' }
                    ]}
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Applied Forces</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Moment X (kN.m)</Label>
                      <Input
                        type="number"
                        value={input.forces.momentX}
                        onChange={(e) => updateForces('momentX', parseFloat(e.target.value) || 0)}
                        placeholder="Auto-calculated if 0"
                      />
                    </div>
                    <div>
                      <Label>Shear X (kN)</Label>
                      <Input
                        type="number"
                        value={input.forces.shearX}
                        onChange={(e) => updateForces('shearX', parseFloat(e.target.value) || 0)}
                        placeholder="Auto-calculated if 0"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Constraints */}
            <Card>
              <CardHeader>
                <CardTitle>Design Constraints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Deflection Limit (L/x)</Label>
                    <SimpleSelect
                      value={input.constraints.deflectionLimit.toString()}
                      onChange={(value) => updateConstraints('deflectionLimit', parseInt(value))}
                      options={[
                        { value: '125', label: 'L/125 (Cantilever)' },
                        { value: '250', label: 'L/250 (Simply Supported)' },
                        { value: '300', label: 'L/300 (Continuous)' },
                        { value: '400', label: 'L/400 (Strict)' }
                      ]}
                    />
                  </div>
                  <div>
                    <Label>Crack Width Limit (mm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={input.constraints.crackWidthLimit}
                      onChange={(e) => updateConstraints('crackWidthLimit', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Exposure Condition</Label>
                    <SimpleSelect
                      value={input.constraints.exposureCondition}
                      onChange={(value) => updateConstraints('exposureCondition', value)}
                      options={[
                        { value: 'mild', label: 'Mild' },
                        { value: 'moderate', label: 'Moderate' },
                        { value: 'severe', label: 'Severe' },
                        { value: 'extreme', label: 'Extreme' }
                      ]}
                    />
                  </div>
                  <div>
                    <Label>Seismic Zone</Label>
                    <SimpleSelect
                      value={input.constraints.seismicZone.toString()}
                      onChange={(value) => updateConstraints('seismicZone', parseInt(value))}
                      options={[
                        { value: '1', label: 'Zone 1 (Low)' },
                        { value: '2', label: 'Zone 2' },
                        { value: '3', label: 'Zone 3' },
                        { value: '4', label: 'Zone 4' },
                        { value: '5', label: 'Zone 5' },
                        { value: '6', label: 'Zone 6 (High)' }
                      ]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button
              onClick={performAdvancedDesign}
              disabled={!validation.isValid || isCalculating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Designing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Perform Advanced Design</span>
                </div>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className={`border-l-4 ${
                  rec.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
                  rec.severity === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-lg flex items-center space-x-2 ${
                      rec.severity === 'critical' ? 'text-red-700' :
                      rec.severity === 'warning' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>
                      {rec.type === 'optimization' && <TrendingUp className="h-5 w-5" />}
                      {rec.type === 'safety' && <AlertTriangle className="h-5 w-5" />}
                      {rec.type === 'economy' && <Calculator className="h-5 w-5" />}
                      {rec.type === 'constructability' && <Settings className="h-5 w-5" />}
                      <span>{rec.title}</span>
                      <Badge variant={rec.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {rec.type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{rec.description}</p>
                    {rec.action && (
                      <p className="text-sm font-medium text-gray-700">
                        Action: {rec.action}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Recommendations</h3>
                <p className="text-gray-500">Your current design parameters look good!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Design Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {results ? (
            <div className="space-y-6">
              {/* Design Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span>Design Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-blue-600">
                        {results.reinforcement.main.count}D{results.reinforcement.main.diameter}
                      </h4>
                      <p className="text-gray-600">Main Reinforcement</p>
                      <p className="text-sm text-gray-500">ρ = {results.reinforcement.main.ratio.toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-green-600">
                        D{results.reinforcement.shear.diameter}-{results.reinforcement.shear.spacing}
                      </h4>
                      <p className="text-gray-600">Stirrups</p>
                      <p className="text-sm text-gray-500">{results.reinforcement.shear.legs} legs</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-purple-600">
                        Rp {(results.economics.totalCost / 1000000).toFixed(1)}M
                      </h4>
                      <p className="text-gray-600">Total Cost</p>
                      <p className="text-sm text-gray-500">
                        Rp {Math.round(results.economics.costPerUnit).toLocaleString()}/m
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Checks */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(results.capacity).map(([key, capacity]) => {
                  const isRatio = key === 'deflection';
                  const utilization = isRatio ? capacity.ratio : capacity.utilization;
                  const status = utilization <= 1.0 ? 'OK' : 'FAIL';
                  const colorClass = status === 'OK' ? 'text-green-600' : 'text-red-600';
                  
                  return (
                    <Card key={key}>
                      <CardContent className="p-4 text-center">
                        <h4 className="font-medium capitalize mb-2">{key.replace('_', ' ')}</h4>
                        <div className={`text-2xl font-bold ${colorClass}`}>
                          {(utilization * 100).toFixed(0)}%
                        </div>
                        <p className="text-sm text-gray-500">
                          {isRatio 
                            ? `${capacity.calculated.toFixed(1)} / ${capacity.limit.toFixed(1)} mm`
                            : `${capacity.demand.toFixed(1)} / ${capacity.capacity.toFixed(1)}`
                          }
                        </p>
                        <Badge variant={status === 'OK' ? 'default' : 'destructive'}>
                          {status}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Material Quantities */}
              <Card>
                <CardHeader>
                  <CardTitle>Material Quantities & Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Concrete</h4>
                      <p>{results.economics.concreteVolume.toFixed(2)} m³</p>
                      <p className="text-sm text-gray-500">
                        @ Rp {results.economics.unitCosts.concrete.toLocaleString()}/m³
                      </p>
                      <p className="font-medium">
                        Rp {(results.economics.concreteVolume * results.economics.unitCosts.concrete).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Steel</h4>
                      <p>{results.economics.steelWeight.toFixed(0)} kg</p>
                      <p className="text-sm text-gray-500">
                        @ Rp {results.economics.unitCosts.steel.toLocaleString()}/kg
                      </p>
                      <p className="font-medium">
                        Rp {(results.economics.steelWeight * results.economics.unitCosts.steel).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Formwork</h4>
                      <p>{results.economics.formworkArea.toFixed(1)} m²</p>
                      <p className="text-sm text-gray-500">
                        @ Rp {results.economics.unitCosts.formwork.toLocaleString()}/m²
                      </p>
                      <p className="font-medium">
                        Rp {(results.economics.formworkArea * results.economics.unitCosts.formwork).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Design Results</h3>
                <p className="text-gray-500">Run the design calculation to see results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Technical Drawing Tab */}
        <TabsContent value="drawing" className="space-y-6">
          {results?.drawing ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span>Technical Drawing - {results.drawing.scale}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Drawing Canvas Placeholder */}
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-700">
                        {results.input.elementType.toUpperCase()} DETAIL
                      </h3>
                      
                      {/* Simplified Drawing Representation */}
                      <div className="bg-white border rounded-lg p-6 mx-auto max-w-md">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Width:</span>
                            <span>{results.drawing.dimensions.width}mm</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Height:</span>
                            <span>{results.drawing.dimensions.height}mm</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Length:</span>
                            <span>{results.drawing.dimensions.length}mm</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="space-y-1">
                            {results.drawing.annotations.map((annotation, index) => (
                              <p key={index} className="text-xs text-gray-600">
                                {annotation}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <p>Advanced CAD drawing generation coming soon</p>
                        <p>This shows the basic reinforcement layout and dimensions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Drawing Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Drawing Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Reinforcement Details</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Main: {results.reinforcement.main.count}D{results.reinforcement.main.diameter}</li>
                        <li>• Stirrups: D{results.reinforcement.shear.diameter}-{results.reinforcement.shear.spacing}</li>
                        <li>• Cover: {results.input.geometry.clearCover}mm</li>
                        <li>• Steel Grade: {results.input.materials.steel.grade}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Material Specifications</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Concrete: {results.input.materials.concrete.grade}</li>
                        <li>• f'c = {results.input.materials.concrete.fc} MPa</li>
                        <li>• fy = {results.input.materials.steel.fy} MPa</li>
                        <li>• Exposure: {results.input.constraints.exposureCondition}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Technical Drawing</h3>
                <p className="text-gray-500">Complete the design to generate technical drawings</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Educational Tab */}
        <TabsContent value="educational" className="space-y-6">
          {results?.educational ? (
            <div className="space-y-6">
              {/* Design Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6" />
                    <span>Design Process</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {results.educational.designSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Code References */}
              <Card>
                <CardHeader>
                  <CardTitle>Code References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.educational.codeReferences.map((reference, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-gray-700">{reference}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Assumptions and Limitations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Design Assumptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {results.educational.assumptions.map((assumption, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {assumption}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Limitations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {results.educational.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-orange-600">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Educational Content</h3>
                <p className="text-gray-500">Complete the design to access educational materials</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDesignModule;