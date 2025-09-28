/**
 * SNI Material Properties Enhancement
 * Comprehensive Steel & Composite Material Properties per SNI Standards
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';

// ====== SNI STEEL GRADES - EXACT SPECIFICATIONS ======
export interface SNIStructuralSteel {
  grade: 'BJ-34' | 'BJ-37' | 'BJ-41' | 'BJ-50' | 'BJ-55';
  fy: number;              // Yield strength (MPa)
  fu: number;              // Ultimate strength (MPa)
  Es: number;              // Elastic modulus (MPa)
  density: number;         // kg/m³
  poissonRatio: number;    // Poisson's ratio
  thermalExpansion: number; // /°C
  weldability: 'excellent' | 'good' | 'fair' | 'limited';
  applications: string[];
  sniStandard: string;
  chemicalComposition: {
    carbon: number;        // % C
    manganese: number;     // % Mn
    phosphorus: number;    // % P max
    sulfur: number;        // % S max
    silicon: number;       // % Si
  };
  mechanicalProperties: {
    elongation: number;    // % minimum
    bendingAngle: number;  // degrees
    impactEnergy: number;  // Joules at temperature
    testTemperature: number; // °C
  };
}

export interface SNICompositeMaterial {
  structuralSteel: SNIStructuralSteel;
  concrete: {
    fc: number;            // MPa
    ec: number;            // MPa
    density: number;       // kg/m³
    shrinkage: number;     // strain
    creep: number;         // coefficient
  };
  connection: {
    type: 'headed_stud' | 'channel_connector' | 'welded_plate';
    shearStrength: number; // kN per connector
    spacing: number;       // mm typical
    diameter: number;      // mm for studs
    height: number;        // mm for studs
  };
  slabProperties: {
    thickness: number;     // mm
    deckProfile?: string;  // For metal deck
    effectiveWidth: number; // mm
    reinforcement: {
      topMesh: string;     // e.g., "M8-150"
      bottomMesh: string;
      shrinkageReinf: string;
    };
  };
  designParameters: {
    transformationRatio: number; // n = Es/Ec
    effectiveSlabWidth: number;  // mm
    neutralAxisLocation: number; // mm from top
    momentCapacity: number;      // kN.m
    deflectionLimit: number;     // L/360 or L/240
  };
}

// ====== SNI STEEL PROPERTIES DATABASE ======
export const SNI_STRUCTURAL_STEEL: Record<string, SNIStructuralSteel> = {
  'BJ-34': {
    grade: 'BJ-34',
    fy: 210,
    fu: 340,
    Es: 200000,
    density: 7850,
    poissonRatio: 0.30,
    thermalExpansion: 12e-6,
    weldability: 'excellent',
    applications: [
      'Light structural members',
      'Secondary beams',
      'Bracing members',
      'Connections'
    ],
    sniStandard: 'SNI 1729:2020',
    chemicalComposition: {
      carbon: 0.30,
      manganese: 1.20,
      phosphorus: 0.040,
      sulfur: 0.050,
      silicon: 0.40
    },
    mechanicalProperties: {
      elongation: 22,
      bendingAngle: 180,
      impactEnergy: 27,
      testTemperature: 20
    }
  },
  'BJ-37': {
    grade: 'BJ-37',
    fy: 240,
    fu: 370,
    Es: 200000,
    density: 7850,
    poissonRatio: 0.30,
    thermalExpansion: 12e-6,
    weldability: 'excellent',
    applications: [
      'Primary structural members',
      'Main beams',
      'Columns',
      'General construction'
    ],
    sniStandard: 'SNI 1729:2020',
    chemicalComposition: {
      carbon: 0.26,
      manganese: 1.35,
      phosphorus: 0.040,
      sulfur: 0.050,
      silicon: 0.40
    },
    mechanicalProperties: {
      elongation: 20,
      bendingAngle: 180,
      impactEnergy: 27,
      testTemperature: 20
    }
  },
  'BJ-41': {
    grade: 'BJ-41',
    fy: 250,
    fu: 410,
    Es: 200000,
    density: 7850,
    poissonRatio: 0.30,
    thermalExpansion: 12e-6,
    weldability: 'good',
    applications: [
      'High-strength structural members',
      'Heavy-duty beams',
      'High-rise columns',
      'Seismic-resistant structures'
    ],
    sniStandard: 'SNI 1729:2020',
    chemicalComposition: {
      carbon: 0.23,
      manganese: 1.50,
      phosphorus: 0.040,
      sulfur: 0.050,
      silicon: 0.55
    },
    mechanicalProperties: {
      elongation: 18,
      bendingAngle: 180,
      impactEnergy: 27,
      testTemperature: 20
    }
  },
  'BJ-50': {
    grade: 'BJ-50',
    fy: 290,
    fu: 500,
    Es: 200000,
    density: 7850,
    poissonRatio: 0.30,
    thermalExpansion: 12e-6,
    weldability: 'good',
    applications: [
      'High-performance structures',
      'Long-span beams',
      'High-rise buildings',
      'Bridge construction'
    ],
    sniStandard: 'SNI 1729:2020',
    chemicalComposition: {
      carbon: 0.26,
      manganese: 1.35,
      phosphorus: 0.035,
      sulfur: 0.035,
      silicon: 0.40
    },
    mechanicalProperties: {
      elongation: 16,
      bendingAngle: 180,
      impactEnergy: 40,
      testTemperature: 0
    }
  },
  'BJ-55': {
    grade: 'BJ-55',
    fy: 345,
    fu: 550,
    Es: 200000,
    density: 7850,
    poissonRatio: 0.30,
    thermalExpansion: 12e-6,
    weldability: 'fair',
    applications: [
      'Premium structural applications',
      'Ultra high-rise buildings',
      'Major bridge structures',
      'Specialized construction'
    ],
    sniStandard: 'SNI 1729:2020',
    chemicalComposition: {
      carbon: 0.23,
      manganese: 1.65,
      phosphorus: 0.030,
      sulfur: 0.030,
      silicon: 0.55
    },
    mechanicalProperties: {
      elongation: 15,
      bendingAngle: 180,
      impactEnergy: 54,
      testTemperature: -20
    }
  }
};

// ====== COMPOSITE MATERIAL FACTORY ======
export const createSNICompositeMaterial = (
  steelGrade: keyof typeof SNI_STRUCTURAL_STEEL,
  concreteGrade: number = 30,
  slabThickness: number = 120
): SNICompositeMaterial => {
  const steel = SNI_STRUCTURAL_STEEL[steelGrade];
  const fc = concreteGrade;
  const ec = 4700 * Math.sqrt(fc);

  return {
    structuralSteel: steel,
    concrete: {
      fc: fc,
      ec: ec,
      density: 2400,
      shrinkage: 0.0003,
      creep: 2.0
    },
    connection: {
      type: 'headed_stud',
      shearStrength: 100, // kN typical for 19mm x 100mm stud
      spacing: 200, // mm typical spacing
      diameter: 19, // mm
      height: 100 // mm
    },
    slabProperties: {
      thickness: slabThickness,
      effectiveWidth: 2500, // mm typical
      reinforcement: {
        topMesh: 'M10-200',
        bottomMesh: 'M10-200', 
        shrinkageReinf: 'M8-200'
      }
    },
    designParameters: {
      transformationRatio: steel.Es / ec,
      effectiveSlabWidth: 2500,
      neutralAxisLocation: slabThickness / 3,
      momentCapacity: 250, // kN.m - to be calculated
      deflectionLimit: 250 // L/250 typical
    }
  };
};

// ====== MATERIAL SELECTOR COMPONENT ======
interface MaterialSelectorProps {
  onSteelGradeSelect: (grade: keyof typeof SNI_STRUCTURAL_STEEL) => void;
  onCompositeCreate: (composite: SNICompositeMaterial) => void;
  selectedGrade?: keyof typeof SNI_STRUCTURAL_STEEL;
}

export const SNIMaterialSelector: React.FC<MaterialSelectorProps> = ({
  onSteelGradeSelect,
  onCompositeCreate,
  selectedGrade
}) => {
  const [selectedSteel, setSelectedSteel] = React.useState<keyof typeof SNI_STRUCTURAL_STEEL>('BJ-37');
  const [concreteGrade, setConcreteGrade] = React.useState<number>(30);
  const [slabThickness, setSlabThickness] = React.useState<number>(120);

  const handleSteelSelect = (grade: keyof typeof SNI_STRUCTURAL_STEEL) => {
    setSelectedSteel(grade);
    onSteelGradeSelect(grade);
  };

  const handleCreateComposite = () => {
    const composite = createSNICompositeMaterial(selectedSteel, concreteGrade, slabThickness);
    onCompositeCreate(composite);
  };

  return (
    <div className="space-y-6">
      {/* Steel Grades Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🏗️ SNI Structural Steel Grades</span>
            <Badge variant="outline">SNI 1729:2020</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SNI_STRUCTURAL_STEEL).map(([grade, props]) => (
              <div
                key={grade}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedSteel === grade ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleSteelSelect(grade as keyof typeof SNI_STRUCTURAL_STEEL)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{grade}</h3>
                  <Badge variant={props.weldability === 'excellent' ? 'default' : 'secondary'}>
                    {props.weldability}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">fy:</span>
                    <span className="font-medium">{props.fy} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">fu:</span>
                    <span className="font-medium">{props.fu} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">fy/fu:</span>
                    <span className="font-medium">{(props.fy / props.fu).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Elongation:</span>
                    <span className="font-medium">{props.mechanicalProperties.elongation}%</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    Primary: {props.applications[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Composite Material Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🏢 Composite Steel-Concrete System</span>
            <Badge variant="outline">SNI Compliant</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Steel Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Structural Steel Grade</label>
              <select
                value={selectedSteel}
                onChange={(e) => setSelectedSteel(e.target.value as keyof typeof SNI_STRUCTURAL_STEEL)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.keys(SNI_STRUCTURAL_STEEL).map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                fy = {SNI_STRUCTURAL_STEEL[selectedSteel].fy} MPa
              </p>
            </div>

            {/* Concrete Grade */}
            <div>
              <label className="block text-sm font-medium mb-2">Concrete Grade (f'c)</label>
              <select
                value={concreteGrade}
                onChange={(e) => setConcreteGrade(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={25}>K-300 (25 MPa)</option>
                <option value={30}>K-350 (30 MPa)</option>
                <option value={35}>K-400 (35 MPa)</option>
                <option value={40}>K-450 (40 MPa)</option>
                <option value={45}>K-500 (45 MPa)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Ec = {Math.round(4700 * Math.sqrt(concreteGrade))} MPa
              </p>
            </div>

            {/* Slab Thickness */}
            <div>
              <label className="block text-sm font-medium mb-2">Slab Thickness (mm)</label>
              <select
                value={slabThickness}
                onChange={(e) => setSlabThickness(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={100}>100 mm</option>
                <option value={120}>120 mm</option>
                <option value={150}>150 mm</option>
                <option value={180}>180 mm</option>
                <option value={200}>200 mm</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Min. 100mm per SNI
              </p>
            </div>
          </div>

          {/* Composite System Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Composite System Properties</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Steel Grade:</span>
                <p className="font-medium">{selectedSteel}</p>
              </div>
              <div>
                <span className="text-gray-600">Transformation Ratio:</span>
                <p className="font-medium">
                  n = {(SNI_STRUCTURAL_STEEL[selectedSteel].Es / (4700 * Math.sqrt(concreteGrade))).toFixed(1)}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Slab Thickness:</span>
                <p className="font-medium">{slabThickness} mm</p>
              </div>
              <div>
                <span className="text-gray-600">Connection:</span>
                <p className="font-medium">Headed Stud</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleCreateComposite}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Composite Material Configuration
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Steel Properties Detail */}
      {selectedGrade && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Steel Properties: {selectedGrade}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Detailed properties display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Mechanical Properties</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Yield Strength (fy):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].fy} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ultimate Strength (fu):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].fu} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elastic Modulus (Es):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].Es.toLocaleString()} MPa</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Density:</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].density} kg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elongation:</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].mechanicalProperties.elongation}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Chemical Composition</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Carbon (C):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].chemicalComposition.carbon}% max</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manganese (Mn):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].chemicalComposition.manganese}% max</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phosphorus (P):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].chemicalComposition.phosphorus}% max</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sulfur (S):</span>
                    <span className="font-medium">{SNI_STRUCTURAL_STEEL[selectedGrade].chemicalComposition.sulfur}% max</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Applications</h4>
              <div className="flex flex-wrap gap-2">
                {SNI_STRUCTURAL_STEEL[selectedGrade].applications.map((app, index) => (
                  <Badge key={index} variant="outline">{app}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ====== UTILITY FUNCTIONS ======
export const getSteelGradeByStrength = (fy: number): keyof typeof SNI_STRUCTURAL_STEEL | null => {
  for (const [grade, props] of Object.entries(SNI_STRUCTURAL_STEEL)) {
    if (props.fy === fy) {
      return grade as keyof typeof SNI_STRUCTURAL_STEEL;
    }
  }
  return null;
};

export const validateSteelComposition = (steel: SNIStructuralSteel): { valid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Carbon content check
  if (steel.chemicalComposition.carbon > 0.30) {
    warnings.push('High carbon content may affect weldability');
  }
  
  // Yield ratio check
  const yieldRatio = steel.fy / steel.fu;
  if (yieldRatio > 0.85) {
    warnings.push('High yield ratio may indicate brittle behavior');
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
};

export default SNIMaterialSelector;