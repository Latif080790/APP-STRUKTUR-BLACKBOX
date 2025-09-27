/**
 * Enhanced Material Properties with Structural Steel & Composite Steel
 * SNI 2847:2019 & AISC 360-16 Compliant Implementation
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { SimpleSelect } from '../../ui/simple-select';
import { 
  Hammer, 
  Shield, 
  Factory, 
  FlameKindling, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

// Enhanced Material Property Interfaces
interface ConcreteProperties {
  fc: number;              // MPa - Compressive strength
  ec: number;              // MPa - Elastic modulus
  density: number;         // kg/m³
  poissonRatio: number;    // Unitless
  grade: string;           // e.g., "K-300", "K-350"
  thermalExpansion: number; // /°C
  creepCoefficient: number; // Long-term deformation
  shrinkageStrain: number;  // Free shrinkage strain
  durabilityClass: 'mild' | 'moderate' | 'severe' | 'extreme';
}

interface StructuralSteelProperties {
  grade: string;           // e.g., "BJ-37", "BJ-41", "BJ-50"
  fy: number;              // MPa - Yield strength
  fu: number;              // MPa - Ultimate strength
  es: number;              // MPa - Elastic modulus
  density: number;         // kg/m³
  poissonRatio: number;    // Unitless
  thermalExpansion: number; // /°C
  yieldRatio: number;      // fy/fu ratio
  weldability: 'excellent' | 'good' | 'fair' | 'poor';
  applications: string[];  // Typical applications
  certification: string;   // Standards certification
}

interface CompositeSteelProperties {
  steelSection: StructuralSteelProperties;
  concreteProperties: ConcreteProperties;
  connectionType: 'welded_stud' | 'bolted_connector' | 'headed_stud' | 'channel';
  slabThickness: number;   // mm
  deckType: 'composite' | 'form' | 'none';
  shortTermModulus: number; // MPa
  longTermModulus: number;  // MPa
  effectiveWidth: number;   // mm
  transformationFactor: number; // n = Es/Ec
}

interface ReinforcementSteelProperties {
  grade: string;           // e.g., "BjTS-40", "BjTS-50"
  fy: number;              // MPa - Yield strength
  fu: number;              // MPa - Ultimate strength
  es: number;              // MPa - Elastic modulus
  density: number;         // kg/m³
  barSizes: number[];      // Available bar diameters in mm
  bendingDiameter: number; // Min bending diameter factor
  anchorageLength: number; // Development length factor
  spliceLength: number;    // Splice length factor
}

export interface EnhancedMaterialProperties {
  structuralSystem: 'concrete' | 'steel' | 'composite' | 'mixed';
  concrete: ConcreteProperties;
  structuralSteel: StructuralSteelProperties;
  reinforcementSteel: ReinforcementSteelProperties;
  compositeSteelConcrete: CompositeSteelProperties;
}

interface EnhancedMaterialFormProps {
  data: EnhancedMaterialProperties;
  onChange: (data: EnhancedMaterialProperties) => void;
  onValidate?: (isValid: boolean, errors: string[]) => void;
}

// Indonesian Steel Grades Database
const INDONESIAN_STRUCTURAL_STEEL_GRADES = {
  'BJ-34': { fy: 210, fu: 340, es: 200000, weldability: 'excellent' as const, density: 7850 },
  'BJ-37': { fy: 240, fu: 370, es: 200000, weldability: 'excellent' as const, density: 7850 },
  'BJ-41': { fy: 250, fu: 410, es: 200000, weldability: 'good' as const, density: 7850 },
  'BJ-50': { fy: 290, fu: 500, es: 200000, weldability: 'good' as const, density: 7850 },
  'BJ-55': { fy: 410, fu: 550, es: 200000, weldability: 'fair' as const, density: 7850 },
  'A36': { fy: 250, fu: 400, es: 200000, weldability: 'excellent' as const, density: 7850 },
  'A572-Gr50': { fy: 345, fu: 450, es: 200000, weldability: 'good' as const, density: 7850 },
  'A992': { fy: 345, fu: 450, es: 200000, weldability: 'good' as const, density: 7850 },
} as const;

const INDONESIAN_REBAR_GRADES = {
  'BjTP-24': { fy: 240, fu: 370, es: 200000, type: 'plain' as const },
  'BjTS-40': { fy: 400, fu: 560, es: 200000, type: 'deformed' as const },
  'BjTS-50': { fy: 500, fu: 650, es: 200000, type: 'deformed' as const },
} as const;

const CONCRETE_GRADES = {
  'K-175': { fc: 14.5, ec: 17900 },
  'K-200': { fc: 16.6, ec: 19200 },
  'K-225': { fc: 18.7, ec: 20300 },
  'K-250': { fc: 20.8, ec: 21400 },
  'K-275': { fc: 22.9, ec: 22500 },
  'K-300': { fc: 25.0, ec: 23500 },
  'K-350': { fc: 29.0, ec: 25300 },
  'K-400': { fc: 33.2, ec: 27100 },
  'K-500': { fc: 41.5, ec: 30200 },
} as const;

const EnhancedMaterialForm: React.FC<EnhancedMaterialFormProps> = ({ 
  data, 
  onChange, 
  onValidate 
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('concrete');

  // Validation function
  const validateMaterials = (materials: EnhancedMaterialProperties): string[] => {
    const errors: string[] = [];

    // Concrete validation
    if (materials.concrete.fc < 14 || materials.concrete.fc > 80) {
      errors.push('Concrete strength must be between 14-80 MPa');
    }

    // Steel validation
    if (materials.structuralSteel.fy < 200 || materials.structuralSteel.fy > 700) {
      errors.push('Steel yield strength must be between 200-700 MPa');
    }

    // Yield ratio check
    const yieldRatio = materials.structuralSteel.fy / materials.structuralSteel.fu;
    if (yieldRatio > 0.85) {
      errors.push('Steel yield ratio (fy/fu) should not exceed 0.85');
    }

    // Composite validation
    if (materials.structuralSystem === 'composite') {
      if (materials.compositeSteelConcrete.slabThickness < 75) {
        errors.push('Composite slab thickness must be at least 75mm');
      }
    }

    return errors;
  };

  // Update validation when data changes
  useEffect(() => {
    const errors = validateMaterials(data);
    setValidationErrors(errors);
    if (onValidate) {
      onValidate(errors.length === 0, errors);
    }
  }, [data, onValidate]);

  const updateStructuralSystem = (system: 'concrete' | 'steel' | 'composite' | 'mixed') => {
    onChange({ ...data, structuralSystem: system });
  };

  const updateConcrete = (field: keyof ConcreteProperties, value: any) => {
    const updated = { ...data.concrete, [field]: value };
    
    // Auto-calculate elastic modulus when fc changes
    if (field === 'fc') {
      updated.ec = 4700 * Math.sqrt(value);
    }
    
    onChange({ ...data, concrete: updated });
  };

  const updateStructuralSteel = (grade: string) => {
    const gradeProps = INDONESIAN_STRUCTURAL_STEEL_GRADES[grade as keyof typeof INDONESIAN_STRUCTURAL_STEEL_GRADES];
    if (gradeProps) {
      const updated: StructuralSteelProperties = {
        ...data.structuralSteel,
        grade,
        fy: gradeProps.fy,
        fu: gradeProps.fu,
        es: gradeProps.es,
        density: gradeProps.density,
        weldability: gradeProps.weldability,
        yieldRatio: gradeProps.fy / gradeProps.fu,
        poissonRatio: 0.30,
        thermalExpansion: 12e-6,
        applications: getApplications(grade),
        certification: 'SNI 1729:2020'
      };
      onChange({ ...data, structuralSteel: updated });
    }
  };

  const updateReinforcementSteel = (grade: string) => {
    const gradeProps = INDONESIAN_REBAR_GRADES[grade as keyof typeof INDONESIAN_REBAR_GRADES];
    if (gradeProps) {
      const updated: ReinforcementSteelProperties = {
        ...data.reinforcementSteel,
        grade,
        fy: gradeProps.fy,
        fu: gradeProps.fu,
        es: gradeProps.es,
        density: 7850,
        barSizes: getBarSizes(grade),
        bendingDiameter: getBendingDiameter(grade),
        anchorageLength: 40, // fy/4√fc for normal conditions
        spliceLength: 1.3 * 40 // 30% increase for lap splice
      };
      onChange({ ...data, reinforcementSteel: updated });
    }
  };

  const updateComposite = (field: keyof CompositeSteelProperties, value: any) => {
    const updated = { ...data.compositeSteelConcrete, [field]: value };
    
    // Auto-calculate transformation factor when properties change
    if (field === 'steelSection' || field === 'concreteProperties') {
      updated.transformationFactor = data.structuralSteel.es / data.concrete.ec;
    }
    
    onChange({ ...data, compositeSteelConcrete: updated });
  };

  const getApplications = (grade: string): string[] => {
    const applications: Record<string, string[]> = {
      'BJ-34': ['Light structures', 'Secondary members'],
      'BJ-37': ['General construction', 'Beams', 'Columns'],
      'BJ-41': ['Medium-rise buildings', 'Industrial structures'],
      'BJ-50': ['High-rise buildings', 'Heavy industrial'],
      'BJ-55': ['Special structures', 'High-stress members'],
      'A36': ['General construction', 'AISC standard'],
      'A572-Gr50': ['High-strength applications'],
      'A992': ['Wide flange beams', 'Columns']
    };
    return applications[grade] || [];
  };

  const getBarSizes = (grade: string): number[] => {
    // Standard rebar sizes in Indonesia (mm)
    return [10, 12, 16, 19, 22, 25, 28, 32, 36, 40];
  };

  const getBendingDiameter = (grade: string): number => {
    // Minimum bending diameter factors
    const factors: Record<string, number> = {
      'BjTP-24': 4, // 4d for plain bars
      'BjTS-40': 6, // 6d for deformed bars
      'BjTS-50': 8  // 8d for high-strength deformed bars
    };
    return factors[grade] || 6;
  };

  return (
    <div className="space-y-6">
      {/* Validation Summary */}
      {validationErrors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-700 text-sm flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Material Validation Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm text-red-600 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Structural System Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Factory className="h-5 w-5" />
            <span>Structural System Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['concrete', 'steel', 'composite', 'mixed'] as const).map(system => (
              <button
                key={system}
                onClick={() => updateStructuralSystem(system)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  data.structuralSystem === system 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold capitalize">{system}</div>
                <div className="text-xs text-gray-500">
                  {system === 'concrete' && 'RC Frame'}
                  {system === 'steel' && 'Steel Frame'}
                  {system === 'composite' && 'Steel + Concrete'}
                  {system === 'mixed' && 'Hybrid System'}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Material Properties Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="concrete">Concrete</TabsTrigger>
          <TabsTrigger value="structural-steel">Structural Steel</TabsTrigger>
          <TabsTrigger value="rebar">Reinforcement</TabsTrigger>
          <TabsTrigger value="composite">Composite</TabsTrigger>
        </TabsList>

        {/* Concrete Properties */}
        <TabsContent value="concrete">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hammer className="h-5 w-5" />
                <span>Concrete Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Concrete Grade</Label>
                  <SimpleSelect
                    value={data.concrete.grade}
                    onChange={(value) => {
                      const grade = CONCRETE_GRADES[value as keyof typeof CONCRETE_GRADES];
                      if (grade) {
                        updateConcrete('grade', value);
                        updateConcrete('fc', grade.fc);
                        updateConcrete('ec', grade.ec);
                      }
                    }}
                    options={Object.keys(CONCRETE_GRADES).map(grade => ({
                      value: grade,
                      label: `${grade} (f'c = ${CONCRETE_GRADES[grade as keyof typeof CONCRETE_GRADES].fc} MPa)`
                    }))}
                  />
                </div>

                <div>
                  <Label>Durability Class</Label>
                  <SimpleSelect
                    value={data.concrete.durabilityClass}
                    onChange={(value) => updateConcrete('durabilityClass', value)}
                    options={[
                      { value: 'mild', label: 'Mild - Interior, dry conditions' },
                      { value: 'moderate', label: 'Moderate - Exterior, normal exposure' },
                      { value: 'severe', label: 'Severe - Marine, chemical exposure' },
                      { value: 'extreme', label: 'Extreme - Aggressive environments' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>f'c (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.concrete.fc.toFixed(1)}
                  </div>
                </div>

                <div>
                  <Label>Ec (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.concrete.ec.toFixed(0)}
                  </div>
                </div>

                <div>
                  <Label>Density (kg/m³)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.concrete.density}
                  </div>
                </div>

                <div>
                  <Label>Poisson Ratio</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.concrete.poissonRatio}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2 flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>Concrete Properties Summary</span>
                </h4>
                <div className="text-sm text-blue-600 space-y-1">
                  <p>• Grade: {data.concrete.grade}</p>
                  <p>• Compressive Strength: {data.concrete.fc} MPa</p>
                  <p>• Elastic Modulus: {data.concrete.ec.toFixed(0)} MPa (Auto-calculated: 4700√f'c)</p>
                  <p>• Exposure Class: {data.concrete.durabilityClass.charAt(0).toUpperCase() + data.concrete.durabilityClass.slice(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Structural Steel Properties */}
        <TabsContent value="structural-steel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Structural Steel Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Steel Grade</Label>
                <SimpleSelect
                  value={data.structuralSteel.grade}
                  onChange={updateStructuralSteel}
                  options={Object.keys(INDONESIAN_STRUCTURAL_STEEL_GRADES).map(grade => ({
                    value: grade,
                    label: `${grade} (fy = ${INDONESIAN_STRUCTURAL_STEEL_GRADES[grade as keyof typeof INDONESIAN_STRUCTURAL_STEEL_GRADES].fy} MPa)`
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>fy (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.structuralSteel.fy}
                  </div>
                </div>

                <div>
                  <Label>fu (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.structuralSteel.fu}
                  </div>
                </div>

                <div>
                  <Label>Es (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.structuralSteel.es.toLocaleString()}
                  </div>
                </div>

                <div>
                  <Label>Yield Ratio</Label>
                  <div className={`p-2 rounded border text-center font-semibold ${
                    data.structuralSteel.yieldRatio > 0.85 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {data.structuralSteel.yieldRatio.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Weldability</Label>
                  <Badge variant={
                    data.structuralSteel.weldability === 'excellent' ? 'default' :
                    data.structuralSteel.weldability === 'good' ? 'secondary' :
                    data.structuralSteel.weldability === 'fair' ? 'outline' : 'destructive'
                  }>
                    {data.structuralSteel.weldability.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <Label>Applications</Label>
                  <div className="flex flex-wrap gap-1">
                    {data.structuralSteel.applications.map((app, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {app}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Steel Grade: {data.structuralSteel.grade}</span>
                </h4>
                <div className="text-sm text-green-600 space-y-1">
                  <p>• Yield Strength: {data.structuralSteel.fy} MPa</p>
                  <p>• Ultimate Strength: {data.structuralSteel.fu} MPa</p>
                  <p>• Weldability: {data.structuralSteel.weldability}</p>
                  <p>• Certification: {data.structuralSteel.certification}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reinforcement Steel */}
        <TabsContent value="rebar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FlameKindling className="h-5 w-5" />
                <span>Reinforcement Steel Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rebar Grade</Label>
                <SimpleSelect
                  value={data.reinforcementSteel.grade}
                  onChange={updateReinforcementSteel}
                  options={Object.keys(INDONESIAN_REBAR_GRADES).map(grade => ({
                    value: grade,
                    label: `${grade} (fy = ${INDONESIAN_REBAR_GRADES[grade as keyof typeof INDONESIAN_REBAR_GRADES].fy} MPa)`
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>fy (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.reinforcementSteel.fy}
                  </div>
                </div>

                <div>
                  <Label>fu (MPa)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.reinforcementSteel.fu}
                  </div>
                </div>

                <div>
                  <Label>Min Bend Ø</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.reinforcementSteel.bendingDiameter}d
                  </div>
                </div>

                <div>
                  <Label>Ld Factor</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.reinforcementSteel.anchorageLength}
                  </div>
                </div>
              </div>

              <div>
                <Label>Available Bar Sizes (mm)</Label>
                <div className="flex flex-wrap gap-2">
                  {data.reinforcementSteel.barSizes.map(size => (
                    <Badge key={size} variant="outline">
                      Ø{size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 mb-2">Design Parameters</h4>
                <div className="text-sm text-orange-600 space-y-1">
                  <p>• Development Length Factor: {data.reinforcementSteel.anchorageLength}</p>
                  <p>• Splice Length Factor: {data.reinforcementSteel.spliceLength}</p>
                  <p>• Minimum Bending Diameter: {data.reinforcementSteel.bendingDiameter}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Composite Properties */}
        <TabsContent value="composite">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Composite Steel-Concrete Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Connection Type</Label>
                  <SimpleSelect
                    value={data.compositeSteelConcrete.connectionType}
                    onChange={(value) => updateComposite('connectionType', value)}
                    options={[
                      { value: 'welded_stud', label: 'Welded Stud Connectors' },
                      { value: 'bolted_connector', label: 'Bolted Connectors' },
                      { value: 'headed_stud', label: 'Headed Stud Anchors' },
                      { value: 'channel', label: 'Channel Shear Connectors' }
                    ]}
                  />
                </div>

                <div>
                  <Label>Deck Type</Label>
                  <SimpleSelect
                    value={data.compositeSteelConcrete.deckType}
                    onChange={(value) => updateComposite('deckType', value)}
                    options={[
                      { value: 'composite', label: 'Composite Metal Deck' },
                      { value: 'form', label: 'Form Deck (Non-composite)' },
                      { value: 'none', label: 'No Metal Deck' }
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Slab Thickness (mm)</Label>
                  <input
                    type="number"
                    value={data.compositeSteelConcrete.slabThickness}
                    onChange={(e) => updateComposite('slabThickness', parseInt(e.target.value) || 100)}
                    className="w-full p-2 border rounded"
                    min="75"
                    max="200"
                  />
                </div>

                <div>
                  <Label>Effective Width (mm)</Label>
                  <input
                    type="number"
                    value={data.compositeSteelConcrete.effectiveWidth}
                    onChange={(e) => updateComposite('effectiveWidth', parseInt(e.target.value) || 2000)}
                    className="w-full p-2 border rounded"
                    min="500"
                    max="5000"
                  />
                </div>

                <div>
                  <Label>Transformation Factor (n)</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {data.compositeSteelConcrete.transformationFactor.toFixed(1)}
                  </div>
                </div>

                <div>
                  <Label>Long-term Modulus</Label>
                  <div className="p-2 bg-gray-100 rounded border text-center font-semibold">
                    {(data.compositeSteelConcrete.longTermModulus / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-700 mb-2">Composite Design Summary</h4>
                <div className="text-sm text-purple-600 space-y-1">
                  <p>• Steel Grade: {data.structuralSteel.grade} (fy = {data.structuralSteel.fy} MPa)</p>
                  <p>• Concrete Grade: {data.concrete.grade} (f'c = {data.concrete.fc} MPa)</p>
                  <p>• Connection: {data.compositeSteelConcrete.connectionType.replace('_', ' ')}</p>
                  <p>• Modular Ratio: n = {data.compositeSteelConcrete.transformationFactor.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Material Summary Card */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Enhanced Material Properties Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-700">Concrete</h4>
              <p>Grade: {data.concrete.grade}</p>
              <p>f'c = {data.concrete.fc} MPa</p>
              <p>Ec = {data.concrete.ec.toFixed(0)} MPa</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-700">Structural Steel</h4>
              <p>Grade: {data.structuralSteel.grade}</p>
              <p>fy = {data.structuralSteel.fy} MPa</p>
              <p>Weldability: {data.structuralSteel.weldability}</p>
            </div>
            <div>
              <h4 className="font-semibold text-green-700">Reinforcement</h4>
              <p>Grade: {data.reinforcementSteel.grade}</p>
              <p>fy = {data.reinforcementSteel.fy} MPa</p>
              <p>Sizes: Ø{data.reinforcementSteel.barSizes.slice(0,3).join(', ')}...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMaterialForm;

// Export types for external use
export type MaterialFormConcreteProperties = ConcreteProperties;
export type MaterialFormStructuralSteelProperties = StructuralSteelProperties;
export type MaterialFormReinforcementSteelProperties = ReinforcementSteelProperties;
export type MaterialFormCompositeSteelProperties = CompositeSteelProperties;
export type MaterialFormEnhancedProperties = EnhancedMaterialProperties;