/**
 * ASCE 7-16 - Minimum Design Loads and Associated Criteria for Buildings and Other Structures
 * Implementation of load combinations and seismic design requirements
 */

export interface ASCESeismicParameters {
  ss: number; // Short-period spectral acceleration (g)
  s1: number; // 1-second spectral acceleration (g)
  siteClass: string; // Site class (A-F)
  riskCategory: string; // Risk category (I-IV)
  importanceFactor: number; // Importance factor
}

export interface ASCELoadCombination {
  id: string;
  name: string;
  description: string;
  combination: string;
  factors: {
    dead?: number;
    live?: number;
    wind?: number;
    earthquake?: number;
    snow?: number;
    rain?: number;
    fluid?: number;
    soil?: number;
    temperature?: number;
  };
  applicableTo: string[];
}

export interface ASCELoadType {
  id: string;
  name: string;
  symbol: string;
  description: string;
  unit: string;
}

// Load types according to ASCE 7
export const ASCE_LOAD_TYPES: ASCELoadType[] = [
  { id: "dead", name: "Dead Load", symbol: "D", description: "Weight of all permanent construction", unit: "psf" },
  { id: "live", name: "Live Load", symbol: "L", description: "Load produced by use and occupancy", unit: "psf" },
  { id: "wind", name: "Wind Load", symbol: "W", description: "Load produced by wind pressure", unit: "psf" },
  { id: "earthquake", name: "Earthquake Load", symbol: "E", description: "Load produced by earthquake ground motion", unit: "kips" },
  { id: "snow", name: "Snow Load", symbol: "S", description: "Load produced by snow accumulation", unit: "psf" },
  { id: "rain", name: "Rain Load", symbol: "R", description: "Load produced by rain accumulation", unit: "psf" },
  { id: "fluid", name: "Fluid Load", symbol: "F", description: "Load produced by fluid pressure", unit: "psf" },
  { id: "soil", name: "Soil Load", symbol: "H", description: "Load produced by soil pressure", unit: "psf" },
  { id: "temperature", name: "Temperature Load", symbol: "T", description: "Load produced by temperature change", unit: "kips" }
];

// Basic load combinations according to ASCE 7-16
export const ASCE_LOAD_COMBINATIONS: ASCELoadCombination[] = [
  {
    id: "1",
    name: "Basic Combination 1",
    description: "Dead load + Live load",
    combination: "1.4D",
    factors: {
      dead: 1.4
    },
    applicableTo: ["All structures"]
  },
  {
    id: "2",
    name: "Basic Combination 2",
    description: "Dead load + Live load + Wind load",
    combination: "1.2D + 1.6L + 0.5(Lr or S or R) + 0.5W",
    factors: {
      dead: 1.2,
      live: 1.6,
      wind: 0.5
    },
    applicableTo: ["Structures subjected to wind loads"]
  },
  {
    id: "3",
    name: "Basic Combination 3",
    description: "Dead load + Live load + Earthquake load",
    combination: "1.2D + 1.0L + 0.5(Lr or S or R) + 1.0E",
    factors: {
      dead: 1.2,
      live: 1.0,
      earthquake: 1.0
    },
    applicableTo: ["Structures in seismic zones"]
  },
  {
    id: "4",
    name: "Basic Combination 4",
    description: "Dead load + Wind load",
    combination: "0.9D + 1.0W",
    factors: {
      dead: 0.9,
      wind: 1.0
    },
    applicableTo: ["Structures where wind loads are critical"]
  },
  {
    id: "5",
    name: "Basic Combination 5",
    description: "Dead load + Earthquake load",
    combination: "0.9D + 1.0E",
    factors: {
      dead: 0.9,
      earthquake: 1.0
    },
    applicableTo: ["Structures where seismic loads are critical"]
  }
];

// Site classes according to ASCE 7
export const ASCE_SITE_CLASSES = [
  { class: "A", description: "Hard rock", vs30: ">1500 m/s" },
  { class: "B", description: "Rock", vs30: "760-1500 m/s" },
  { class: "C", description: "Very dense soil and soft rock", vs30: "360-760 m/s" },
  { class: "D", description: "Stiff soil", vs30: "180-360 m/s" },
  { class: "E", description: "Soft soil", vs30: "<180 m/s" },
  { class: "F", description: "Site-specific soil profile required", vs30: "Variable" }
];

// Risk categories according to ASCE 7
export const ASCE_RISK_CATEGORIES = [
  { category: "I", description: "Low hazard to human life", importanceFactor: 1.0 },
  { category: "II", description: "Normal hazard to human life", importanceFactor: 1.0 },
  { category: "III", description: "Substantial hazard to human life", importanceFactor: 1.25 },
  { category: "IV", description: "Exceptional hazard to human life", importanceFactor: 1.5 }
];

/**
 * Calculate seismic response coefficient according to ASCE 7
 * @param parameters Seismic parameters
 * @param period Structure period in seconds
 * @returns Seismic response coefficient (Cs)
 */
export function calculateASCESeismicCoefficient(
  parameters: ASCESeismicParameters,
  period: number
): number {
  // Site coefficient Fa and Fv based on site class and SS/S1
  let fa = 1.0;
  let fv = 1.0;
  
  switch (parameters.siteClass) {
    case "A":
      fa = 0.8;
      fv = 0.8;
      break;
    case "B":
      fa = 1.0;
      fv = 1.0;
      break;
    case "C":
      fa = 1.2;
      fv = 1.4;
      break;
    case "D":
      fa = 1.6;
      fv = 2.0;
      break;
    case "E":
      fa = 2.0;
      fv = 2.4;
      break;
  }
  
  // SMS and SM1
  const sms = fa * parameters.ss;
  const sm1 = fv * parameters.s1;
  
  // SDS and SD1
  const sds = (2/3) * sms;
  const sd1 = (2/3) * sm1;
  
  // Seismic response coefficient
  let coefficient;
  if (period <= 0.5) {
    coefficient = sds / 2.5;
  } else if (period <= 1.0) {
    coefficient = sds / (2.5 * period);
  } else {
    coefficient = sd1 / period;
  }
  
  // Apply importance factor
  coefficient *= parameters.importanceFactor;
  
  return coefficient;
}

/**
 * Get ASCE site class by class code
 * @param classCode Site class code (A-F)
 * @returns Site class object
 */
export function getASCESiteClass(classCode: string): { class: string; description: string; vs30: string } | undefined {
  return ASCE_SITE_CLASSES.find(site => site.class === classCode);
}

/**
 * Get ASCE risk category by category code
 * @param categoryCode Risk category code (I-IV)
 * @returns Risk category object
 */
export function getASCERiskCategory(categoryCode: string): { category: string; description: string; importanceFactor: number } | undefined {
  return ASCE_RISK_CATEGORIES.find(risk => risk.category === categoryCode);
}

/**
 * Get load combination by ID
 * @param id Combination ID
 * @returns Load combination object
 */
export function getASCELoadCombination(id: string): ASCELoadCombination | undefined {
  return ASCE_LOAD_COMBINATIONS.find(c => c.id === id);
}

/**
 * Get all applicable load combinations for a structure type
 * @param structureType Type of structure
 * @returns Array of applicable load combinations
 */
export function getASCEApplicableLoadCombinations(structureType: string): ASCELoadCombination[] {
  return ASCE_LOAD_COMBINATIONS.filter(c => 
    c.applicableTo.includes("All structures") || c.applicableTo.includes(structureType)
  );
}

export default {
  ASCE_LOAD_TYPES,
  ASCE_LOAD_COMBINATIONS,
  ASCE_SITE_CLASSES,
  ASCE_RISK_CATEGORIES,
  calculateASCESeismicCoefficient,
  getASCESiteClass,
  getASCERiskCategory,
  getASCELoadCombination,
  getASCEApplicableLoadCombinations
};