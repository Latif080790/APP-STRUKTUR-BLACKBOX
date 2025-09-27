/**
 * Enhanced Material Properties Converter
 * Converts enhanced material properties to existing system format
 */

import { 
  MaterialFormEnhancedProperties,
  MaterialFormStructuralSteelProperties, 
  MaterialFormCompositeSteelProperties 
} from '../forms/EnhancedMaterialForm';

// Type aliases for easier usage
type EnhancedMaterialProperties = MaterialFormEnhancedProperties;
type StructuralSteelProperties = MaterialFormStructuralSteelProperties;
type CompositeSteelProperties = MaterialFormCompositeSteelProperties;

// Convert to existing material properties format
export interface LegacyMaterialProperties {
  fc: number;
  fy: number;
  Es: number;
  Ec: number;
  poissonRatio: number;
  unitWeightConcrete: number;
  unitWeightSteel: number;
  concreteGrade: string;
  steelGrade: string;
  gammaConcrete?: number;
  gammaSteel?: number;
}

export const convertToLegacyFormat = (enhanced: EnhancedMaterialProperties): LegacyMaterialProperties => {
  return {
    fc: enhanced.concrete.fc,
    fy: enhanced.structuralSystem === 'concrete' 
        ? enhanced.reinforcementSteel.fy 
        : enhanced.structuralSteel.fy,
    Es: enhanced.structuralSystem === 'concrete'
        ? enhanced.reinforcementSteel.es
        : enhanced.structuralSteel.es,
    Ec: enhanced.concrete.ec,
    poissonRatio: enhanced.concrete.poissonRatio,
    unitWeightConcrete: enhanced.concrete.density / 100, // Convert kg/m³ to kN/m³
    unitWeightSteel: enhanced.structuralSteel.density / 100,
    concreteGrade: enhanced.concrete.grade,
    steelGrade: enhanced.structuralSystem === 'concrete'
               ? enhanced.reinforcementSteel.grade
               : enhanced.structuralSteel.grade,
    gammaConcrete: enhanced.concrete.density / 1000 * 9.81, // Unit weight in kN/m³
    gammaSteel: enhanced.structuralSteel.density / 1000 * 9.81
  };
};

export const getDefaultEnhancedMaterials = (): EnhancedMaterialProperties => ({
  structuralSystem: 'concrete',
  concrete: {
    fc: 25.0,
    ec: 23500,
    density: 2400,
    poissonRatio: 0.2,
    grade: 'K-300',
    thermalExpansion: 10e-6,
    creepCoefficient: 2.0,
    shrinkageStrain: 0.0003,
    durabilityClass: 'moderate'
  },
  structuralSteel: {
    grade: 'BJ-37',
    fy: 240,
    fu: 370,
    es: 200000,
    density: 7850,
    poissonRatio: 0.30,
    thermalExpansion: 12e-6,
    yieldRatio: 0.65,
    weldability: 'excellent',
    applications: ['General construction', 'Beams', 'Columns'],
    certification: 'SNI 1729:2020'
  },
  reinforcementSteel: {
    grade: 'BjTS-40',
    fy: 400,
    fu: 560,
    es: 200000,
    density: 7850,
    barSizes: [10, 12, 16, 19, 22, 25, 28, 32, 36, 40],
    bendingDiameter: 6,
    anchorageLength: 40,
    spliceLength: 52
  },
  compositeSteelConcrete: {
    steelSection: {
      grade: 'A992',
      fy: 345,
      fu: 450,
      es: 200000,
      density: 7850,
      poissonRatio: 0.30,
      thermalExpansion: 12e-6,
      yieldRatio: 0.77,
      weldability: 'good',
      applications: ['Wide flange beams', 'Columns'],
      certification: 'AISC 360-16'
    },
    concreteProperties: {
      fc: 28.0,
      ec: 24855,
      density: 2400,
      poissonRatio: 0.2,
      grade: 'K-350',
      thermalExpansion: 10e-6,
      creepCoefficient: 2.0,
      shrinkageStrain: 0.0003,
      durabilityClass: 'moderate'
    },
    connectionType: 'headed_stud',
    slabThickness: 100,
    deckType: 'composite',
    shortTermModulus: 24855,
    longTermModulus: 12427,
    effectiveWidth: 2000,
    transformationFactor: 8.0
  }
});

// Material property validation
export const validateEnhancedMaterials = (materials: EnhancedMaterialProperties): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Concrete validation
  if (materials.concrete.fc < 14 || materials.concrete.fc > 80) {
    errors.push('Concrete compressive strength must be between 14-80 MPa');
  }

  // Check Ec vs fc relationship
  const expectedEc = 4700 * Math.sqrt(materials.concrete.fc);
  const ecRatio = materials.concrete.ec / expectedEc;
  if (ecRatio < 0.8 || ecRatio > 1.2) {
    warnings.push(`Concrete elastic modulus may be inconsistent with f'c. Expected: ${expectedEc.toFixed(0)} MPa`);
  }

  // Steel validation
  const yieldRatio = materials.structuralSteel.fy / materials.structuralSteel.fu;
  if (yieldRatio > 0.85) {
    warnings.push('Steel yield ratio (fy/fu) exceeds 0.85, may indicate brittle behavior');
  }

  // Reinforcement validation
  if (materials.reinforcementSteel.fy > materials.reinforcementSteel.fu * 0.85) {
    errors.push('Reinforcement yield strength too close to ultimate strength');
  }

  // Composite validation
  if (materials.structuralSystem === 'composite') {
    if (materials.compositeSteelConcrete.slabThickness < 75) {
      errors.push('Composite slab thickness must be at least 75mm');
    }
    
    const transformationFactor = materials.structuralSteel.es / materials.concrete.ec;
    if (Math.abs(materials.compositeSteelConcrete.transformationFactor - transformationFactor) > 1.0) {
      warnings.push('Transformation factor may be inconsistent with material properties');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Convert enhanced properties to 3D structure materials
export const convertTo3DStructureMaterials = (enhanced: EnhancedMaterialProperties) => {
  const materials: Record<string, any> = {};

  // Concrete material
  materials.concrete = {
    density: enhanced.concrete.density,
    elasticModulus: enhanced.concrete.ec,
    poissonRatio: enhanced.concrete.poissonRatio,
    compressiveStrength: enhanced.concrete.fc,
    color: '#95a5a6',
    opacity: 0.8
  };

  // Steel material
  materials.steel = {
    density: enhanced.structuralSteel.density,
    elasticModulus: enhanced.structuralSteel.es,
    poissonRatio: enhanced.structuralSteel.poissonRatio,
    yieldStrength: enhanced.structuralSteel.fy,
    ultimateStrength: enhanced.structuralSteel.fu,
    color: '#34495e',
    opacity: 1.0,
    metalness: 0.8,
    roughness: 0.2
  };

  // Composite material
  if (enhanced.structuralSystem === 'composite') {
    materials.composite = {
      steelDensity: enhanced.compositeSteelConcrete.steelSection.density,
      concreteDensity: enhanced.compositeSteelConcrete.concreteProperties.density,
      steelModulus: enhanced.compositeSteelConcrete.steelSection.es,
      concreteModulus: enhanced.compositeSteelConcrete.concreteProperties.ec,
      transformationFactor: enhanced.compositeSteelConcrete.transformationFactor,
      color: '#7f8c8d',
      opacity: 0.9
    };
  }

  return materials;
};

// Export material calculation utilities
export class EnhancedMaterialCalculator {
  static calculateConcreteElasticModulus(fc: number): number {
    // SNI 2847:2019 formula
    return 4700 * Math.sqrt(fc);
  }

  static calculateSteelYieldRatio(fy: number, fu: number): number {
    return fy / fu;
  }

  static calculateTransformationFactor(Es: number, Ec: number): number {
    return Es / Ec;
  }

  static calculateCompositeProperties(
    steelArea: number,
    concreteArea: number,
    steelModulus: number,
    concreteModulus: number
  ): {
    equivalentSteelArea: number;
    neutralAxisLocation: number;
    momentOfInertia: number;
  } {
    const n = steelModulus / concreteModulus;
    const equivalentSteelArea = steelArea + concreteArea / n;
    
    // Simplified calculations for demonstration
    const neutralAxisLocation = 0.4; // Simplified
    const momentOfInertia = steelArea * Math.pow(0.6, 2) + concreteArea / n * Math.pow(0.4, 2);

    return {
      equivalentSteelArea,
      neutralAxisLocation,
      momentOfInertia
    };
  }

  static getRecommendedCoverRequirements(
    durabilityClass: string,
    elementType: 'beam' | 'column' | 'slab' | 'foundation'
  ): number {
    const coverMatrix: Record<string, Record<string, number>> = {
      mild: { beam: 25, column: 25, slab: 20, foundation: 40 },
      moderate: { beam: 30, column: 30, slab: 25, foundation: 50 },
      severe: { beam: 40, column: 40, slab: 30, foundation: 65 },
      extreme: { beam: 50, column: 50, slab: 40, foundation: 75 }
    };

    return coverMatrix[durabilityClass]?.[elementType] || 40;
  }

  static calculateDevelopmentLength(
    barDiameter: number,
    fy: number,
    fc: number,
    coverDepth: number
  ): number {
    // Simplified development length calculation per ACI 318
    const alpha = 1.0; // Reinforcement location factor
    const beta = 1.0;  // Coating factor
    const gamma = 0.8; // Reinforcement size factor (for #6 and smaller)
    const lambda = 1.0; // Lightweight aggregate factor
    
    const basicDevelopmentLength = (fy * alpha * beta * gamma) / (25 * lambda * Math.sqrt(fc));
    return Math.max(basicDevelopmentLength * barDiameter, 300); // Minimum 300mm
  }
}

export default EnhancedMaterialCalculator;