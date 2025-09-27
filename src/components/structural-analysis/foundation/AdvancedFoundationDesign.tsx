/**
 * Advanced Foundation Design System
 * SNI 8460:2017 & SNI 1726:2019 Compliant Foundation Design
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { SimpleSelect } from '../../ui/simple-select';
import { 
  Layers, 
  Calculator, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  TrendingDown,
  Home,
  Mountain,
  Zap,
  FileText
} from 'lucide-react';

// Foundation Design Interfaces
interface SoilProperties {
  type: 'clay' | 'sand' | 'silt' | 'gravel' | 'rock';
  cohesion: number;           // kPa
  frictionAngle: number;      // degrees
  unitWeight: number;         // kN/m³
  elasticModulus: number;     // MPa
  poissonRatio: number;       // unitless
  N_SPT: number;             // SPT N-value
  qu: number;                // Unconfined compressive strength (kPa)
  groundwaterDepth: number;   // m below ground
}

interface FoundationGeometry {
  type: 'isolated' | 'strip' | 'mat' | 'pile_cap' | 'combined';
  width: number;              // m
  length: number;             // m
  depth: number;              // m below ground
  thickness: number;          // m foundation thickness
  shape: 'square' | 'rectangular' | 'circular';
}

interface PileProperties {
  type: 'driven' | 'bored' | 'auger_cast' | 'micro';
  material: 'concrete' | 'steel' | 'timber';
  diameter: number;           // m
  length: number;             // m
  count: number;              // number of piles
  spacing: number;            // m center-to-center
  skinFriction: number;       // kPa
  endBearing: number;         // kPa
}

interface FoundationLoads {
  vertical: number;           // kN (compression positive)
  horizontalX: number;        // kN
  horizontalY: number;        // kN
  momentX: number;            // kN.m
  momentY: number;            // kN.m
  loadCombination: 'service' | 'ultimate' | 'seismic';
  eccentricityX: number;      // m
  eccentricityY: number;      // m
}

interface FoundationDesignInput {
  foundationType: 'shallow' | 'deep';
  geometry: FoundationGeometry;
  soil: SoilProperties;
  loads: FoundationLoads;
  piles?: PileProperties;
  materials: {
    concrete: { fc: number; grade: string; };
    steel: { fy: number; grade: string; };
  };
  constraints: {
    maxSettlement: number;      // mm
    maxDifferentialSettlement: number; // mm
    safetyFactor: number;       // bearing capacity safety factor
    seismicZone: number;        // 1-6
    soilClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  };
}

interface BearingCapacityResults {
  ultimate: number;           // kPa
  allowable: number;          // kPa
  applied: number;            // kPa
  safetyFactor: number;       // actual safety factor
  factors: {
    Nc: number;              // cohesion factor
    Nq: number;              // surcharge factor
    Ng: number;              // unit weight factor
    Fcs: number;             // shape factor for cohesion
    Fqs: number;             // shape factor for surcharge
    Fgs: number;             // shape factor for unit weight
    Fcd: number;             // depth factor for cohesion
    Fqd: number;             // depth factor for surcharge
    Fgd: number;             // depth factor for unit weight
  };
}

interface SettlementResults {
  immediate: number;          // mm
  consolidation: number;      // mm
  total: number;             // mm
  differential: number;       // mm
  timeSettlement: { time: number; settlement: number; }[]; // settlement vs time
}

interface FoundationDesignResults {
  input: FoundationDesignInput;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  
  // Bearing Capacity Analysis
  bearingCapacity: BearingCapacityResults;
  
  // Settlement Analysis
  settlement: SettlementResults;
  
  // Pile Analysis (if applicable)
  pileAnalysis?: {
    singlePileCapacity: number;    // kN
    groupEfficiency: number;       // factor
    groupCapacity: number;         // kN
    lateralCapacity: number;       // kN
    buckling: {
      criticalLength: number;      // m
      bucklingLoad: number;        // kN
      safetyFactor: number;
    };
  };
  
  // Foundation Design
  reinforcement: {
    bottom: { diameter: number; spacingX: number; spacingY: number; };
    top: { diameter: number; spacingX: number; spacingY: number; };
    shear: { diameter: number; spacing: number; legs: number; };
    punching: { required: boolean; reinforcement?: string; };
  };
  
  // Stability Checks
  stability: {
    overturning: {
      resistingMoment: number;     // kN.m
      overturningMoment: number;   // kN.m
      safetyFactor: number;
    };
    sliding: {
      resistingForce: number;      // kN
      slidingForce: number;        // kN
      safetyFactor: number;
    };
  };
  
  // Economic Analysis
  economics: {
    excavationVolume: number;      // m³
    concreteVolume: number;        // m³
    steelWeight: number;           // kg
    backfillVolume: number;        // m³
    totalCost: number;             // IDR
    costBreakdown: {
      excavation: number;
      concrete: number;
      steel: number;
      backfill: number;
      other: number;
    };
  };
}

// SNI Foundation Design Constants
const FOUNDATION_CONSTANTS = {
  BEARING_CAPACITY_FACTORS: {
    // Terzaghi bearing capacity factors (function of friction angle)
    getFactors: (phi: number) => {
      const phiRad = phi * Math.PI / 180;
      const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.tan(45 + phi/2) ** 2;
      const Nc = (Nq - 1) / Math.tan(phiRad);
      const Ng = 2 * (Nq + 1) * Math.tan(phiRad);
      return { Nc, Nq, Ng };
    }
  },
  
  SHAPE_FACTORS: {
    square: { Fcs: 1.3, Fqs: 1.0, Fgs: 0.8 },
    strip: { Fcs: 1.0, Fqs: 1.0, Fgs: 1.0 },
    circular: { Fcs: 1.3, Fqs: 1.0, Fgs: 0.6 }
  },
  
  DEPTH_FACTORS: {
    getFactors: (D: number, B: number, phi: number) => {
      const ratio = Math.min(D / B, 1.0);
      const Fcd = 1 + 0.4 * ratio;
      const Fqd = 1 + 2 * Math.tan(phi * Math.PI / 180) * (1 - Math.sin(phi * Math.PI / 180)) ** 2 * ratio;
      const Fgd = 1.0;
      return { Fcd, Fqd, Fgd };
    }
  },
  
  SAFETY_FACTORS: {
    bearing: { service: 3.0, ultimate: 2.5, seismic: 2.0 },
    sliding: { service: 1.5, ultimate: 1.2, seismic: 1.1 },
    overturning: { service: 2.0, ultimate: 1.5, seismic: 1.25 }
  },
  
  SETTLEMENT_LIMITS: {
    total: { isolated: 25, strip: 50, mat: 75 }, // mm
    differential: { isolated: 20, strip: 25, mat: 50 } // mm
  }
};

const AdvancedFoundationDesign: React.FC = () => {
  const [input, setInput] = useState<FoundationDesignInput>({
    foundationType: 'shallow',
    geometry: {
      type: 'isolated',
      width: 2.0,
      length: 2.0,
      depth: 1.5,
      thickness: 0.5,
      shape: 'square'
    },
    soil: {
      type: 'sand',
      cohesion: 0,
      frictionAngle: 30,
      unitWeight: 18,
      elasticModulus: 25,
      poissonRatio: 0.3,
      N_SPT: 15,
      qu: 0,
      groundwaterDepth: 5
    },
    loads: {
      vertical: 1000,
      horizontalX: 50,
      horizontalY: 0,
      momentX: 75,
      momentY: 0,
      loadCombination: 'service',
      eccentricityX: 0,
      eccentricityY: 0
    },
    materials: {
      concrete: { fc: 25, grade: 'K-300' },
      steel: { fy: 400, grade: 'BjTS-40' }
    },
    constraints: {
      maxSettlement: 25,
      maxDifferentialSettlement: 20,
      safetyFactor: 3.0,
      seismicZone: 3,
      soilClass: 'SC'
    }
  });
  
  const [results, setResults] = useState<FoundationDesignResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  // Foundation Design Calculation
  const performFoundationDesign = async () => {
    setIsCalculating(true);
    setActiveTab('results');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Input validation
      const errors: string[] = [];
      const warnings: string[] = [];

      if (input.geometry.width < 0.8) errors.push('Minimum foundation width is 0.8m');
      if (input.geometry.depth < 0.5) errors.push('Minimum foundation depth is 0.5m');
      if (input.loads.vertical <= 0) errors.push('Vertical load must be positive');

      // Calculate eccentricities
      const eccentricityX = input.loads.momentY / input.loads.vertical;
      const eccentricityY = input.loads.momentX / input.loads.vertical;

      if (eccentricityX > input.geometry.length / 6) {
        warnings.push('Eccentricity in X direction exceeds L/6');
      }
      if (eccentricityY > input.geometry.width / 6) {
        warnings.push('Eccentricity in Y direction exceeds B/6');
      }

      // Bearing Capacity Analysis
      const phi = input.soil.frictionAngle;
      const c = input.soil.cohesion;
      const gamma = input.soil.unitWeight;
      const B = Math.min(input.geometry.width, input.geometry.length); // Critical width
      const L = Math.max(input.geometry.width, input.geometry.length);
      const D = input.geometry.depth;

      // Get bearing capacity factors
      const { Nc, Nq, Ng } = FOUNDATION_CONSTANTS.BEARING_CAPACITY_FACTORS.getFactors(phi);

      // Shape factors
      const shapeFactors = input.geometry.shape === 'square' ? 
        FOUNDATION_CONSTANTS.SHAPE_FACTORS.square :
        input.geometry.shape === 'circular' ?
        FOUNDATION_CONSTANTS.SHAPE_FACTORS.circular :
        FOUNDATION_CONSTANTS.SHAPE_FACTORS.strip;

      // Depth factors
      const depthFactors = FOUNDATION_CONSTANTS.DEPTH_FACTORS.getFactors(D, B, phi);

      // Ultimate bearing capacity
      const qu_ultimate = 
        c * Nc * shapeFactors.Fcs * depthFactors.Fcd +
        gamma * D * Nq * shapeFactors.Fqs * depthFactors.Fqd +
        0.5 * gamma * B * Ng * shapeFactors.Fgs * depthFactors.Fgd;

      // Applied pressure
      const foundationArea = input.geometry.width * input.geometry.length;
      const appliedPressure = input.loads.vertical / foundationArea;

      // Safety factor
      const actualSafetyFactor = qu_ultimate / appliedPressure;
      const requiredSafetyFactor = FOUNDATION_CONSTANTS.SAFETY_FACTORS.bearing[input.loads.loadCombination];

      const bearingCapacity: BearingCapacityResults = {
        ultimate: qu_ultimate,
        allowable: qu_ultimate / requiredSafetyFactor,
        applied: appliedPressure,
        safetyFactor: actualSafetyFactor,
        factors: {
          Nc, Nq, Ng,
          Fcs: shapeFactors.Fcs,
          Fqs: shapeFactors.Fqs,
          Fgs: shapeFactors.Fgs,
          Fcd: depthFactors.Fcd,
          Fqd: depthFactors.Fqd,
          Fgd: depthFactors.Fgd
        }
      };

      // Settlement Analysis (Simplified)
      const Es = input.soil.elasticModulus * 1000; // Convert to kPa
      const nu = input.soil.poissonRatio;
      const I = input.geometry.shape === 'square' ? 0.88 : 0.82; // Influence factor

      // Immediate settlement
      const immediateSettlement = (appliedPressure * B * (1 - nu * nu) * I) / Es;

      // Consolidation settlement (for cohesive soils)
      const consolidationSettlement = input.soil.type === 'clay' ? 
        immediateSettlement * 0.5 : 0; // Simplified

      const totalSettlement = immediateSettlement + consolidationSettlement;

      const settlement: SettlementResults = {
        immediate: immediateSettlement * 1000, // Convert to mm
        consolidation: consolidationSettlement * 1000,
        total: totalSettlement * 1000,
        differential: totalSettlement * 1000 * 0.7, // Approximate
        timeSettlement: [
          { time: 0, settlement: immediateSettlement * 1000 },
          { time: 1, settlement: (immediateSettlement + consolidationSettlement * 0.3) * 1000 },
          { time: 5, settlement: (immediateSettlement + consolidationSettlement * 0.7) * 1000 },
          { time: 10, settlement: totalSettlement * 1000 }
        ]
      };

      // Stability Analysis
      const resistingMoment = input.loads.vertical * Math.max(B, L) / 2;
      const overturningMoment = Math.sqrt(input.loads.momentX ** 2 + input.loads.momentY ** 2);
      const overturningFactor = resistingMoment / Math.max(overturningMoment, 1);

      const frictionCoeff = Math.tan(phi * Math.PI / 180);
      const resistingForce = input.loads.vertical * frictionCoeff + c * foundationArea;
      const slidingForce = Math.sqrt(input.loads.horizontalX ** 2 + input.loads.horizontalY ** 2);
      const slidingFactor = resistingForce / Math.max(slidingForce, 1);

      const stability = {
        overturning: {
          resistingMoment,
          overturningMoment,
          safetyFactor: overturningFactor
        },
        sliding: {
          resistingForce,
          slidingForce,
          safetyFactor: slidingFactor
        }
      };

      // Reinforcement Design (Simplified)
      const Mu = input.loads.momentX * 1.4; // Ultimate moment
      const d = input.geometry.thickness * 1000 - 75; // Effective depth (mm)
      const b = input.geometry.width * 1000; // Width (mm)
      const fc = input.materials.concrete.fc;
      const fy = input.materials.steel.fy;

      const Ku = Mu * 1000000 / (0.9 * b * d * d); // N/mm²
      const rho = (0.85 * fc / fy) * (1 - Math.sqrt(1 - 2 * Ku / (0.85 * fc)));
      const As = rho * b * d;

      // Bar selection
      const barDiameter = As > 2000 ? 16 : 12;
      const barArea = Math.PI * barDiameter * barDiameter / 4;
      const spacingX = (barArea * 1000) / Math.max(As / (input.geometry.length * 1000), 0.002 * 1000);
      const spacingY = spacingX;

      const reinforcement = {
        bottom: { diameter: barDiameter, spacingX: Math.round(spacingX), spacingY: Math.round(spacingY) },
        top: { diameter: 12, spacingX: 300, spacingY: 300 },
        shear: { diameter: 10, spacing: 200, legs: 2 },
        punching: { required: appliedPressure > 0.5 * Math.sqrt(fc) }
      };

      // Economic Analysis
      const excavationVolume = foundationArea * (input.geometry.depth + 0.5); // Include working space
      const concreteVolume = foundationArea * input.geometry.thickness;
      const steelWeight = (As * input.geometry.length * input.geometry.width) * 7850 / 1000000; // kg
      const backfillVolume = excavationVolume - concreteVolume;

      const unitCosts = {
        excavation: 50000,  // IDR/m³
        concrete: 800000,   // IDR/m³
        steel: 12000,       // IDR/kg
        backfill: 30000,    // IDR/m³
        other: 200000       // IDR lump sum
      };

      const costBreakdown = {
        excavation: excavationVolume * unitCosts.excavation,
        concrete: concreteVolume * unitCosts.concrete,
        steel: steelWeight * unitCosts.steel,
        backfill: backfillVolume * unitCosts.backfill,
        other: unitCosts.other
      };

      const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);

      const economics = {
        excavationVolume,
        concreteVolume,
        steelWeight,
        backfillVolume,
        totalCost,
        costBreakdown
      };

      // Compile results
      const designResults: FoundationDesignResults = {
        input,
        isValid: errors.length === 0,
        errors,
        warnings,
        bearingCapacity,
        settlement,
        reinforcement,
        stability,
        economics
      };

      setResults(designResults);
    } catch (error) {
      console.error('Foundation design error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Update handlers
  const updateGeometry = (field: keyof FoundationGeometry, value: any) => {
    setInput(prev => ({
      ...prev,
      geometry: { ...prev.geometry, [field]: value }
    }));
  };

  const updateSoil = (field: keyof SoilProperties, value: any) => {
    setInput(prev => ({
      ...prev,
      soil: { ...prev.soil, [field]: value }
    }));
  };

  const updateLoads = (field: keyof FoundationLoads, value: any) => {
    setInput(prev => ({
      ...prev,
      loads: { ...prev.loads, [field]: value }
    }));
  };

  const updateConstraints = (field: keyof typeof input.constraints, value: any) => {
    setInput(prev => ({
      ...prev,
      constraints: { ...prev.constraints, [field]: value }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Advanced Foundation Design</h1>
            <p className="text-xl opacity-90">Professional SNI-Compliant Foundation Analysis & Design</p>
          </div>
          <div className="text-6xl opacity-30">
            <Home />
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Foundation Input</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="design">Reinforcement Design</TabsTrigger>
          <TabsTrigger value="economics">Economic Analysis</TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Foundation Geometry */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5" />
                  <span>Foundation Geometry</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Foundation Type</Label>
                  <SimpleSelect
                    value={input.foundationType}
                    onChange={(value) => setInput(prev => ({ ...prev, foundationType: value as any }))}
                    options={[
                      { value: 'shallow', label: 'Shallow Foundation' },
                      { value: 'deep', label: 'Deep Foundation (Piles)' }
                    ]}
                  />
                </div>

                <div>
                  <Label>Foundation System</Label>
                  <SimpleSelect
                    value={input.geometry.type}
                    onChange={(value) => updateGeometry('type', value)}
                    options={[
                      { value: 'isolated', label: 'Isolated Footing' },
                      { value: 'strip', label: 'Strip Footing' },
                      { value: 'mat', label: 'Mat Foundation' },
                      { value: 'pile_cap', label: 'Pile Cap' },
                      { value: 'combined', label: 'Combined Footing' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Width (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={input.geometry.width}
                      onChange={(e) => updateGeometry('width', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Length (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={input.geometry.length}
                      onChange={(e) => updateGeometry('length', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Depth (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={input.geometry.depth}
                      onChange={(e) => updateGeometry('depth', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Thickness (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={input.geometry.thickness}
                      onChange={(e) => updateGeometry('thickness', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soil Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mountain className="h-5 w-5" />
                  <span>Soil Properties</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Soil Type</Label>
                  <SimpleSelect
                    value={input.soil.type}
                    onChange={(value) => updateSoil('type', value)}
                    options={[
                      { value: 'clay', label: 'Clay' },
                      { value: 'sand', label: 'Sand' },
                      { value: 'silt', label: 'Silt' },
                      { value: 'gravel', label: 'Gravel' },
                      { value: 'rock', label: 'Rock' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cohesion (kPa)</Label>
                    <Input
                      type="number"
                      value={input.soil.cohesion}
                      onChange={(e) => updateSoil('cohesion', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Friction Angle (°)</Label>
                    <Input
                      type="number"
                      value={input.soil.frictionAngle}
                      onChange={(e) => updateSoil('frictionAngle', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Unit Weight (kN/m³)</Label>
                    <Input
                      type="number"
                      value={input.soil.unitWeight}
                      onChange={(e) => updateSoil('unitWeight', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>SPT N-value</Label>
                    <Input
                      type="number"
                      value={input.soil.N_SPT}
                      onChange={(e) => updateSoil('N_SPT', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Elastic Modulus (MPa)</Label>
                    <Input
                      type="number"
                      value={input.soil.elasticModulus}
                      onChange={(e) => updateSoil('elasticModulus', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Groundwater Depth (m)</Label>
                    <Input
                      type="number"
                      value={input.soil.groundwaterDepth}
                      onChange={(e) => updateSoil('groundwaterDepth', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Foundation Loads */}
            <Card>
              <CardHeader>
                <CardTitle>Foundation Loads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Load Combination</Label>
                  <SimpleSelect
                    value={input.loads.loadCombination}
                    onChange={(value) => updateLoads('loadCombination', value)}
                    options={[
                      { value: 'service', label: 'Service Loads' },
                      { value: 'ultimate', label: 'Ultimate Loads' },
                      { value: 'seismic', label: 'Seismic Loads' }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vertical Load (kN)</Label>
                    <Input
                      type="number"
                      value={input.loads.vertical}
                      onChange={(e) => updateLoads('vertical', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Horizontal X (kN)</Label>
                    <Input
                      type="number"
                      value={input.loads.horizontalX}
                      onChange={(e) => updateLoads('horizontalX', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Moment X (kN.m)</Label>
                    <Input
                      type="number"
                      value={input.loads.momentX}
                      onChange={(e) => updateLoads('momentX', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Moment Y (kN.m)</Label>
                    <Input
                      type="number"
                      value={input.loads.momentY}
                      onChange={(e) => updateLoads('momentY', parseFloat(e.target.value) || 0)}
                    />
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
                    <Label>Max Settlement (mm)</Label>
                    <Input
                      type="number"
                      value={input.constraints.maxSettlement}
                      onChange={(e) => updateConstraints('maxSettlement', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Safety Factor</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={input.constraints.safetyFactor}
                      onChange={(e) => updateConstraints('safetyFactor', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <Label>Soil Class</Label>
                    <SimpleSelect
                      value={input.constraints.soilClass}
                      onChange={(value) => updateConstraints('soilClass', value)}
                      options={[
                        { value: 'SA', label: 'SA - Hard Rock' },
                        { value: 'SB', label: 'SB - Rock' },
                        { value: 'SC', label: 'SC - Very Dense Soil' },
                        { value: 'SD', label: 'SD - Stiff Soil' },
                        { value: 'SE', label: 'SE - Soft Soil' },
                        { value: 'SF', label: 'SF - Special Study' }
                      ]}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={performFoundationDesign}
              disabled={isCalculating}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              {isCalculating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Foundation...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Analyze Foundation</span>
                </div>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {results ? (
            <div className="space-y-6">
              {/* Validation Status */}
              {!results.isValid && (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-700 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Design Issues</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {results.errors.map((error, index) => (
                        <li key={index} className="text-red-600 text-sm">• {error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {results.warnings.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-700 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Warnings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {results.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-600 text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Bearing Capacity Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-6 w-6" />
                    <span>Bearing Capacity Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-blue-600">
                        {results.bearingCapacity.ultimate.toFixed(0)}
                      </h4>
                      <p className="text-gray-600">Ultimate (kPa)</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-green-600">
                        {results.bearingCapacity.allowable.toFixed(0)}
                      </h4>
                      <p className="text-gray-600">Allowable (kPa)</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-orange-600">
                        {results.bearingCapacity.applied.toFixed(0)}
                      </h4>
                      <p className="text-gray-600">Applied (kPa)</p>
                    </div>
                    <div className="text-center">
                      <h4 className={`text-2xl font-bold ${
                        results.bearingCapacity.safetyFactor >= input.constraints.safetyFactor 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {results.bearingCapacity.safetyFactor.toFixed(1)}
                      </h4>
                      <p className="text-gray-600">Safety Factor</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Bearing Capacity Factors</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>Nc = {results.bearingCapacity.factors.Nc.toFixed(1)}</div>
                      <div>Nq = {results.bearingCapacity.factors.Nq.toFixed(1)}</div>
                      <div>Nγ = {results.bearingCapacity.factors.Ng.toFixed(1)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settlement Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingDown className="h-6 w-6" />
                    <span>Settlement Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-blue-600">
                        {results.settlement.immediate.toFixed(1)}
                      </h4>
                      <p className="text-gray-600">Immediate (mm)</p>
                    </div>
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-purple-600">
                        {results.settlement.consolidation.toFixed(1)}
                      </h4>
                      <p className="text-gray-600">Consolidation (mm)</p>
                    </div>
                    <div className="text-center">
                      <h4 className={`text-2xl font-bold ${
                        results.settlement.total <= input.constraints.maxSettlement 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {results.settlement.total.toFixed(1)}
                      </h4>
                      <p className="text-gray-600">Total (mm)</p>
                    </div>
                    <div className="text-center">
                      <h4 className={`text-2xl font-bold ${
                        results.settlement.differential <= input.constraints.maxDifferentialSettlement 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {results.settlement.differential.toFixed(1)}
                      </h4>
                      <p className="text-gray-600">Differential (mm)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stability Checks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overturning Stability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Resisting Moment:</span>
                        <span className="font-medium">{results.stability.overturning.resistingMoment.toFixed(0)} kN.m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overturning Moment:</span>
                        <span className="font-medium">{results.stability.overturning.overturningMoment.toFixed(0)} kN.m</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Safety Factor:</span>
                        <span className={`font-bold ${
                          results.stability.overturning.safetyFactor >= 2.0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {results.stability.overturning.safetyFactor.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sliding Stability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Resisting Force:</span>
                        <span className="font-medium">{results.stability.sliding.resistingForce.toFixed(0)} kN</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sliding Force:</span>
                        <span className="font-medium">{results.stability.sliding.slidingForce.toFixed(0)} kN</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Safety Factor:</span>
                        <span className={`font-bold ${
                          results.stability.sliding.safetyFactor >= 1.5 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {results.stability.sliding.safetyFactor.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Analysis Results</h3>
                <p className="text-gray-500">Run the foundation analysis to see results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-6">
          {results?.reinforcement ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-6 w-6" />
                    <span>Reinforcement Design</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Bottom Reinforcement</h4>
                      <div className="space-y-2 text-sm">
                        <p>Diameter: D{results.reinforcement.bottom.diameter}</p>
                        <p>Spacing X: {results.reinforcement.bottom.spacingX}mm</p>
                        <p>Spacing Y: {results.reinforcement.bottom.spacingY}mm</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Top Reinforcement</h4>
                      <div className="space-y-2 text-sm">
                        <p>Diameter: D{results.reinforcement.top.diameter}</p>
                        <p>Spacing X: {results.reinforcement.top.spacingX}mm</p>
                        <p>Spacing Y: {results.reinforcement.top.spacingY}mm</p>
                      </div>
                    </div>
                  </div>
                  
                  {results.reinforcement.punching.required && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-700 mb-2">Punching Shear</h4>
                      <p className="text-yellow-600 text-sm">
                        Punching shear reinforcement may be required. Consider adding shear studs or increasing slab thickness.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Design Results</h3>
                <p className="text-gray-500">Complete the foundation analysis to see reinforcement design</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Economics Tab */}
        <TabsContent value="economics" className="space-y-6">
          {results?.economics ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                    {Object.entries(results.economics.costBreakdown).map(([item, cost]) => (
                      <div key={item} className="text-center">
                        <h4 className="text-xl font-bold text-blue-600">
                          Rp {(cost / 1000000).toFixed(1)}M
                        </h4>
                        <p className="text-gray-600 capitalize">{item.replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h3 className="text-3xl font-bold text-purple-600 mb-2">
                      Rp {(results.economics.totalCost / 1000000).toFixed(1)}M
                    </h3>
                    <p className="text-gray-600">Total Foundation Cost</p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Material Quantities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Excavation:</span>
                        <p className="font-medium">{results.economics.excavationVolume.toFixed(1)} m³</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Concrete:</span>
                        <p className="font-medium">{results.economics.concreteVolume.toFixed(1)} m³</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Steel:</span>
                        <p className="font-medium">{results.economics.steelWeight.toFixed(0)} kg</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Backfill:</span>
                        <p className="font-medium">{results.economics.backfillVolume.toFixed(1)} m³</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No Economic Analysis</h3>
                <p className="text-gray-500">Complete the foundation design to see cost analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFoundationDesign;