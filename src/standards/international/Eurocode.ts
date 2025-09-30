/**
 * Eurocode 2 (EN 1992) - Design of concrete structures
 * Eurocode 3 (EN 1993) - Design of steel structures
 * Implementation of European design standards
 */

// Eurocode 2 - Concrete Structures

export interface ECConcreteMaterial {
  id: string;
  name: string;
  strengthClass: string;
  cylinderStrength: number; // fck in MPa
  cubeStrength: number; // fck,cube in MPa
  modulusOfElasticity: number; // Ecm in MPa
  unitWeight: number; // kN/m³
  tensileStrength: number; // fctm in MPa
}

export interface ECReinforcementMaterial {
  id: string;
  name: string;
  grade: string;
  yieldStrength: number; // fyk in MPa
  ultimateStrength: number; // fuk in MPa
  modulusOfElasticity: number; // Es in MPa
  unitWeight: number; // kN/m³
}

// Concrete material properties according to Eurocode 2
export const EC_CONCRETE_MATERIALS: ECConcreteMaterial[] = [
  { 
    id: "c20/25", 
    name: "Concrete C20/25", 
    strengthClass: "C20/25", 
    cylinderStrength: 20, 
    cubeStrength: 25, 
    modulusOfElasticity: 30000, 
    unitWeight: 25, 
    tensileStrength: 2.2 
  },
  { 
    id: "c25/30", 
    name: "Concrete C25/30", 
    strengthClass: "C25/30", 
    cylinderStrength: 25, 
    cubeStrength: 30, 
    modulusOfElasticity: 31000, 
    unitWeight: 25, 
    tensileStrength: 2.6 
  },
  { 
    id: "c30/37", 
    name: "Concrete C30/37", 
    strengthClass: "C30/37", 
    cylinderStrength: 30, 
    cubeStrength: 37, 
    modulusOfElasticity: 33000, 
    unitWeight: 25, 
    tensileStrength: 2.9 
  },
  { 
    id: "c35/45", 
    name: "Concrete C35/45", 
    strengthClass: "C35/45", 
    cylinderStrength: 35, 
    cubeStrength: 45, 
    modulusOfElasticity: 34000, 
    unitWeight: 25, 
    tensileStrength: 3.2 
  },
  { 
    id: "c40/50", 
    name: "Concrete C40/50", 
    strengthClass: "C40/50", 
    cylinderStrength: 40, 
    cubeStrength: 50, 
    modulusOfElasticity: 35000, 
    unitWeight: 25, 
    tensileStrength: 3.5 
  }
];

// Reinforcement material properties according to Eurocode 2
export const EC_REINFORCEMENT_MATERIALS: ECReinforcementMaterial[] = [
  { 
    id: "b500a", 
    name: "B500A", 
    grade: "B500A", 
    yieldStrength: 500, 
    ultimateStrength: 580, 
    modulusOfElasticity: 200000, 
    unitWeight: 78.5 
  },
  { 
    id: "b500b", 
    name: "B500B", 
    grade: "B500B", 
    yieldStrength: 500, 
    ultimateStrength: 580, 
    modulusOfElasticity: 200000, 
    unitWeight: 78.5 
  },
  { 
    id: "b500c", 
    name: "B500C", 
    grade: "B500C", 
    yieldStrength: 500, 
    ultimateStrength: 580, 
    modulusOfElasticity: 200000, 
    unitWeight: 78.5 
  }
];

// Partial safety factors according to Eurocode 2
export const EC_CONCRETE_SAFETY_FACTORS = {
  concrete: 1.5,
  reinforcement: 1.15,
  prestressing: 1.15
};

// Eurocode 3 - Steel Structures

export interface ECSteelMaterial {
  id: string;
  name: string;
  grade: string;
  yieldStrength: number; // fy in MPa
  ultimateStrength: number; // fu in MPa
  modulusOfElasticity: number; // E in MPa
  poissonRatio: number;
  unitWeight: number; // kN/m³
  shearModulus: number; // G in MPa
}

// Steel material properties according to Eurocode 3
export const EC_STEEL_MATERIALS: ECSteelMaterial[] = [
  { 
    id: "s235", 
    name: "S235 Steel", 
    grade: "S235", 
    yieldStrength: 235, 
    ultimateStrength: 360, 
    modulusOfElasticity: 210000, 
    poissonRatio: 0.3, 
    unitWeight: 78.5, 
    shearModulus: 81000 
  },
  { 
    id: "s275", 
    name: "S275 Steel", 
    grade: "S275", 
    yieldStrength: 275, 
    ultimateStrength: 430, 
    modulusOfElasticity: 210000, 
    poissonRatio: 0.3, 
    unitWeight: 78.5, 
    shearModulus: 81000 
  },
  { 
    id: "s355", 
    name: "S355 Steel", 
    grade: "S355", 
    yieldStrength: 355, 
    ultimateStrength: 510, 
    modulusOfElasticity: 210000, 
    poissonRatio: 0.3, 
    unitWeight: 78.5, 
    shearModulus: 81000 
  }
];

// Partial safety factors according to Eurocode 3
export const EC_STEEL_SAFETY_FACTORS = {
  steel: 1.0,
  resistance: 1.1
};

/**
 * Calculate design concrete strength according to Eurocode 2
 * @param concrete Concrete material properties
 * @returns Design concrete strength in MPa
 */
export function calculateECDesignConcreteStrength(concrete: ECConcreteMaterial): number {
  return concrete.cylinderStrength / EC_CONCRETE_SAFETY_FACTORS.concrete;
}

/**
 * Calculate design reinforcement strength according to Eurocode 2
 * @param reinforcement Reinforcement material properties
 * @returns Design reinforcement strength in MPa
 */
export function calculateECDesignReinforcementStrength(reinforcement: ECReinforcementMaterial): number {
  return reinforcement.yieldStrength / EC_CONCRETE_SAFETY_FACTORS.reinforcement;
}

/**
 * Calculate nominal moment capacity of a reinforced concrete beam according to Eurocode 2
 * @param width Section width in mm
 * @param height Section height in mm
 * @param concrete Concrete material properties
 * @param reinforcement Reinforcement material properties
 * @param steelArea Area of steel reinforcement in mm²
 * @param effectiveDepth Effective depth in mm
 * @returns Nominal moment capacity in kN·m
 */
export function calculateECNominalMomentCapacity(
  width: number,
  height: number,
  concrete: ECConcreteMaterial,
  reinforcement: ECReinforcementMaterial,
  steelArea: number,
  effectiveDepth: number
): number {
  const fcd = calculateECDesignConcreteStrength(concrete);
  const fyd = calculateECDesignReinforcementStrength(reinforcement);
  
  // Calculate depth of neutral axis
  const alphaCC = 0.85; // Recommended value in Eurocode 2
  const lambda = 0.8; // Recommended value in Eurocode 2
  const c = (steelArea * fyd) / (alphaCC * fcd * width * lambda);
  
  // Calculate moment capacity
  const x = lambda * c;
  const moment = alphaCC * fcd * width * x * (effectiveDepth - 0.5 * x);
  
  return moment / 1000000; // Convert to kN·m
}

/**
 * Get Eurocode concrete material by ID
 * @param id Concrete material ID
 * @returns Eurocode concrete material object
 */
export function getECConcreteMaterial(id: string): ECConcreteMaterial | undefined {
  return EC_CONCRETE_MATERIALS.find(material => material.id === id);
}

/**
 * Get Eurocode reinforcement material by ID
 * @param id Reinforcement material ID
 * @returns Eurocode reinforcement material object
 */
export function getECReinforcementMaterial(id: string): ECReinforcementMaterial | undefined {
  return EC_REINFORCEMENT_MATERIALS.find(material => material.id === id);
}

/**
 * Get Eurocode steel material by ID
 * @param id Steel material ID
 * @returns Eurocode steel material object
 */
export function getECSteelMaterial(id: string): ECSteelMaterial | undefined {
  return EC_STEEL_MATERIALS.find(material => material.id === id);
}

export default {
  EC_CONCRETE_MATERIALS,
  EC_REINFORCEMENT_MATERIALS,
  EC_STEEL_MATERIALS,
  EC_CONCRETE_SAFETY_FACTORS,
  EC_STEEL_SAFETY_FACTORS,
  calculateECDesignConcreteStrength,
  calculateECDesignReinforcementStrength,
  calculateECNominalMomentCapacity,
  getECConcreteMaterial,
  getECReinforcementMaterial,
  getECSteelMaterial
};