/**
 * SNI 2847:2019 - Persyaratan beton struktural untuk bangunan gedung
 * Implementation of reinforced concrete design requirements
 */

export interface ConcreteMaterial {
  id: string;
  name: string;
  strength: number; // f'c in MPa
  modulusOfElasticity: number; // Ec in MPa
  poissonRatio: number;
  unitWeight: number; // kN/m³
  tensileStrength: number; // f_r in MPa
}

export interface ReinforcementMaterial {
  id: string;
  name: string;
  grade: string;
  yieldStrength: number; // fy in MPa
  ultimateStrength: number; // fu in MPa
  modulusOfElasticity: number; // Es in MPa
  unitWeight: number; // kN/m³
}

export interface ConcreteSection {
  width: number; // mm
  height: number; // mm
  cover: number; // mm
  concrete: ConcreteMaterial;
  reinforcement: ReinforcementMaterial;
  bars: {
    diameter: number; // mm
    count: number;
    position: { x: number; y: number }; // mm from bottom left
  }[];
}

// Concrete material properties according to SNI 2847
export const CONCRETE_MATERIALS: ConcreteMaterial[] = [
  { 
    id: "k20", 
    name: "Betong Mutu K-20", 
    strength: 20, 
    modulusOfElasticity: 23000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 2.5 
  },
  { 
    id: "k25", 
    name: "Betong Mutu K-25", 
    strength: 25, 
    modulusOfElasticity: 25000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 2.8 
  },
  { 
    id: "k30", 
    name: "Betong Mutu K-30", 
    strength: 30, 
    modulusOfElasticity: 27000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 3.0 
  },
  { 
    id: "k35", 
    name: "Betong Mutu K-35", 
    strength: 35, 
    modulusOfElasticity: 29000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 3.2 
  },
  { 
    id: "k40", 
    name: "Betong Mutu K-40", 
    strength: 40, 
    modulusOfElasticity: 31000, 
    poissonRatio: 0.2, 
    unitWeight: 24, 
    tensileStrength: 3.4 
  }
];

// Reinforcement material properties according to SNI 2847
export const REINFORCEMENT_MATERIALS: ReinforcementMaterial[] = [
  { 
    id: "bjtp240", 
    name: "BJTP 240", 
    grade: "240", 
    yieldStrength: 240, 
    ultimateStrength: 370, 
    modulusOfElasticity: 200000, 
    unitWeight: 77 
  },
  { 
    id: "bjtd400", 
    name: "BJTD 400", 
    grade: "400", 
    yieldStrength: 400, 
    ultimateStrength: 550, 
    modulusOfElasticity: 200000, 
    unitWeight: 77 
  },
  { 
    id: "bjtd500", 
    name: "BJTD 500", 
    grade: "500", 
    yieldStrength: 500, 
    ultimateStrength: 600, 
    modulusOfElasticity: 200000, 
    unitWeight: 77 
  }
];

// Beta factor for stress block according to SNI 2847
export function getBetaFactor(concreteStrength: number): number {
  if (concreteStrength <= 30) {
    return 0.85;
  } else if (concreteStrength <= 50) {
    return 0.85 - (0.05 * (concreteStrength - 30)) / 10;
  } else {
    return 0.65;
  }
}

// Minimum reinforcement ratio according to SNI 2847
export function getMinReinforcementRatio(concreteStrength: number, steelStrength: number): number {
  return Math.max(0.25 * Math.sqrt(concreteStrength) / steelStrength, 1.4 / steelStrength);
}

// Maximum reinforcement ratio according to SNI 2847
export function getMaxReinforcementRatio(concreteStrength: number, steelStrength: number): number {
  const beta = getBetaFactor(concreteStrength);
  return 0.75 * beta * (concreteStrength / steelStrength) * (600 / (600 + steelStrength));
}

/**
 * Calculate nominal moment capacity of a reinforced concrete beam
 * @param section Concrete section properties
 * @returns Nominal moment capacity (kN·m)
 */
export function calculateNominalMomentCapacity(section: ConcreteSection): number {
  const { width, height, concrete, reinforcement, bars } = section;
  
  // Calculate total area of steel
  const steelArea = bars.reduce((total, bar) => {
    const barArea = Math.PI * Math.pow(bar.diameter / 2, 2);
    return total + (barArea * bar.count);
  }, 0);
  
  // Calculate depth of neutral axis
  const beta = getBetaFactor(concrete.strength);
  const c = (steelArea * reinforcement.yieldStrength) / 
           (0.85 * concrete.strength * width * beta);
  
  // Calculate moment capacity
  const a = beta * c;
  const d = height - bars[0]?.position.y || height - 50; // Effective depth
  const moment = 0.85 * concrete.strength * width * a * (d - a / 2);
  
  return moment / 1000000; // Convert to kN·m
}

/**
 * Check if section satisfies minimum reinforcement requirements
 * @param section Concrete section properties
 * @returns Boolean indicating if minimum reinforcement is satisfied
 */
export function checkMinReinforcement(section: ConcreteSection): boolean {
  const { width, height, concrete, reinforcement, bars } = section;
  
  // Calculate total area of steel
  const steelArea = bars.reduce((total, bar) => {
    const barArea = Math.PI * Math.pow(bar.diameter / 2, 2);
    return total + (barArea * bar.count);
  }, 0);
  
  // Calculate minimum required steel area
  const minRatio = getMinReinforcementRatio(concrete.strength, reinforcement.yieldStrength);
  const minSteelArea = minRatio * width * height;
  
  return steelArea >= minSteelArea;
}

/**
 * Check if section satisfies maximum reinforcement requirements
 * @param section Concrete section properties
 * @returns Boolean indicating if maximum reinforcement is satisfied
 */
export function checkMaxReinforcement(section: ConcreteSection): boolean {
  const { width, height, concrete, reinforcement, bars } = section;
  
  // Calculate total area of steel
  const steelArea = bars.reduce((total, bar) => {
    const barArea = Math.PI * Math.pow(bar.diameter / 2, 2);
    return total + (barArea * bar.count);
  }, 0);
  
  // Calculate maximum allowed steel area
  const maxRatio = getMaxReinforcementRatio(concrete.strength, reinforcement.yieldStrength);
  const maxSteelArea = maxRatio * width * height;
  
  return steelArea <= maxSteelArea;
}

/**
 * Get concrete material by ID
 * @param id Concrete material ID
 * @returns Concrete material object
 */
export function getConcreteMaterial(id: string): ConcreteMaterial | undefined {
  return CONCRETE_MATERIALS.find(material => material.id === id);
}

/**
 * Get reinforcement material by ID
 * @param id Reinforcement material ID
 * @returns Reinforcement material object
 */
export function getReinforcementMaterial(id: string): ReinforcementMaterial | undefined {
  return REINFORCEMENT_MATERIALS.find(material => material.id === id);
}

export default {
  CONCRETE_MATERIALS,
  REINFORCEMENT_MATERIALS,
  getBetaFactor,
  getMinReinforcementRatio,
  getMaxReinforcementRatio,
  calculateNominalMomentCapacity,
  checkMinReinforcement,
  checkMaxReinforcement,
  getConcreteMaterial,
  getReinforcementMaterial
};