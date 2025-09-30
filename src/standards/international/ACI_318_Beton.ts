/**
 * ACI 318-19 - Building Code Requirements for Structural Concrete
 * Implementation of reinforced concrete design requirements
 */

export interface ACIConcreteMaterial {
  id: string;
  name: string;
  strength: number; // f'c in MPa
  modulusOfElasticity: number; // Ec in MPa
  poissonRatio: number;
  unitWeight: number; // kN/m³
  tensileStrength: number; // f_r in MPa
}

export interface ACIReinforcementMaterial {
  id: string;
  name: string;
  grade: string;
  yieldStrength: number; // fy in MPa
  ultimateStrength: number; // fu in MPa
  modulusOfElasticity: number; // Es in MPa
  unitWeight: number; // kN/m³
}

// Concrete material properties according to ACI 318
export const ACI_CONCRETE_MATERIALS: ACIConcreteMaterial[] = [
  { 
    id: "4000psi", 
    name: "4000 psi Concrete", 
    strength: 27.6, 
    modulusOfElasticity: 23000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 3.2 
  },
  { 
    id: "5000psi", 
    name: "5000 psi Concrete", 
    strength: 34.5, 
    modulusOfElasticity: 26000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 3.6 
  },
  { 
    id: "6000psi", 
    name: "6000 psi Concrete", 
    strength: 41.4, 
    modulusOfElasticity: 29000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 4.0 
  },
  { 
    id: "8000psi", 
    name: "8000 psi Concrete", 
    strength: 55.2, 
    modulusOfElasticity: 34000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 4.6 
  }
];

// Reinforcement material properties according to ACI 318
export const ACI_REINFORCEMENT_MATERIALS: ACIReinforcementMaterial[] = [
  { 
    id: "grade40", 
    name: "Grade 40", 
    grade: "40", 
    yieldStrength: 276, 
    ultimateStrength: 414, 
    modulusOfElasticity: 200000, 
    unitWeight: 77 
  },
  { 
    id: "grade60", 
    name: "Grade 60", 
    grade: "60", 
    yieldStrength: 414, 
    ultimateStrength: 586, 
    modulusOfElasticity: 200000, 
    unitWeight: 77 
  },
  { 
    id: "grade75", 
    name: "Grade 75", 
    grade: "75", 
    yieldStrength: 517, 
    ultimateStrength: 690, 
    modulusOfElasticity: 200000, 
    unitWeight: 77 
  }
];

// Beta factor for stress block according to ACI 318
export function getACIBetaFactor(concreteStrength: number): number {
  if (concreteStrength <= 28) {
    return 0.85;
  } else if (concreteStrength <= 55) {
    return 0.85 - (0.05 * (concreteStrength - 28)) / 7;
  } else {
    return 0.65;
  }
}

// Minimum reinforcement ratio according to ACI 318
export function getACIMinReinforcementRatio(concreteStrength: number, steelStrength: number): number {
  return Math.max(0.25 * Math.sqrt(concreteStrength) / steelStrength, 1.4 / steelStrength);
}

// Maximum reinforcement ratio according to ACI 318
export function getACIMaxReinforcementRatio(concreteStrength: number, steelStrength: number): number {
  const beta = getACIBetaFactor(concreteStrength);
  return 0.75 * beta * (concreteStrength / steelStrength) * (600 / (600 + steelStrength));
}

/**
 * Calculate nominal moment capacity of a reinforced concrete beam according to ACI 318
 * @param width Section width in mm
 * @param height Section height in mm
 * @param concrete Concrete material properties
 * @param reinforcement Reinforcement material properties
 * @param steelArea Area of steel reinforcement in mm²
 * @param effectiveDepth Effective depth in mm
 * @returns Nominal moment capacity in kN·m
 */
export function calculateACINominalMomentCapacity(
  width: number,
  height: number,
  concrete: ACIConcreteMaterial,
  reinforcement: ACIReinforcementMaterial,
  steelArea: number,
  effectiveDepth: number
): number {
  // Calculate depth of neutral axis
  const beta = getACIBetaFactor(concrete.strength);
  const c = (steelArea * reinforcement.yieldStrength) / 
           (0.85 * concrete.strength * width * beta);
  
  // Calculate moment capacity
  const a = beta * c;
  const moment = 0.85 * concrete.strength * width * a * (effectiveDepth - a / 2);
  
  return moment / 1000000; // Convert to kN·m
}

/**
 * Check if section satisfies minimum reinforcement requirements according to ACI 318
 * @param width Section width in mm
 * @param height Section height in mm
 * @param concrete Concrete material properties
 * @param reinforcement Reinforcement material properties
 * @param steelArea Area of steel reinforcement in mm²
 * @returns Boolean indicating if minimum reinforcement is satisfied
 */
export function checkACIMinReinforcement(
  width: number,
  height: number,
  concrete: ACIConcreteMaterial,
  reinforcement: ACIReinforcementMaterial,
  steelArea: number
): boolean {
  // Calculate minimum required steel area
  const minRatio = getACIMinReinforcementRatio(concrete.strength, reinforcement.yieldStrength);
  const minSteelArea = minRatio * width * height;
  
  return steelArea >= minSteelArea;
}

/**
 * Check if section satisfies maximum reinforcement requirements according to ACI 318
 * @param width Section width in mm
 * @param height Section height in mm
 * @param concrete Concrete material properties
 * @param reinforcement Reinforcement material properties
 * @param steelArea Area of steel reinforcement in mm²
 * @returns Boolean indicating if maximum reinforcement is satisfied
 */
export function checkACIMaxReinforcement(
  width: number,
  height: number,
  concrete: ACIConcreteMaterial,
  reinforcement: ACIReinforcementMaterial,
  steelArea: number
): boolean {
  // Calculate maximum allowed steel area
  const maxRatio = getACIMaxReinforcementRatio(concrete.strength, reinforcement.yieldStrength);
  const maxSteelArea = maxRatio * width * height;
  
  return steelArea <= maxSteelArea;
}

/**
 * Get ACI concrete material by ID
 * @param id Concrete material ID
 * @returns ACI concrete material object
 */
export function getACIConcreteMaterial(id: string): ACIConcreteMaterial | undefined {
  return ACI_CONCRETE_MATERIALS.find(material => material.id === id);
}

/**
 * Get ACI reinforcement material by ID
 * @param id Reinforcement material ID
 * @returns ACI reinforcement material object
 */
export function getACIReinforcementMaterial(id: string): ACIReinforcementMaterial | undefined {
  return ACI_REINFORCEMENT_MATERIALS.find(material => material.id === id);
}

export default {
  ACI_CONCRETE_MATERIALS,
  ACI_REINFORCEMENT_MATERIALS,
  getACIBetaFactor,
  getACIMinReinforcementRatio,
  getACIMaxReinforcementRatio,
  calculateACINominalMomentCapacity,
  checkACIMinReinforcement,
  checkACIMaxReinforcement,
  getACIConcreteMaterial,
  getACIReinforcementMaterial
};