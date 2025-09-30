/**
 * SNI 1727:2020 - Beban minimum untuk perencanaan bangunan gedung dan struktur lain
 * Implementation of load combinations and load requirements
 */

export interface LoadCombination {
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

export interface LoadType {
  id: string;
  name: string;
  symbol: string;
  description: string;
  unit: string;
}

// Load types according to SNI 1727
export const LOAD_TYPES: LoadType[] = [
  { id: "dead", name: "Beban Mati", symbol: "D", description: "Beban berat semua komponen permanen struktur", unit: "kN/m²" },
  { id: "live", name: "Beban Hidup", symbol: "L", description: "Beban yang ditimbulkan oleh penggunaan gedung", unit: "kN/m²" },
  { id: "wind", name: "Beban Angin", symbol: "W", description: "Beban yang ditimbulkan oleh tekanan angin", unit: "kN/m²" },
  { id: "earthquake", name: "Beban Gempa", symbol: "E", description: "Beban yang ditimbulkan oleh gempa bumi", unit: "kN" },
  { id: "snow", name: "Beban Salju", symbol: "S", description: "Beban yang ditimbulkan oleh akumulasi salju", unit: "kN/m²" },
  { id: "rain", name: "Beban Hujan", symbol: "R", description: "Beban yang ditimbulkan oleh genangan air hujan", unit: "kN/m²" },
  { id: "fluid", name: "Beban Fluida", symbol: "F", description: "Beban yang ditimbulkan oleh tekanan fluida", unit: "kN/m²" },
  { id: "soil", name: "Beban Tanah", symbol: "H", description: "Beban yang ditimbulkan oleh tekanan tanah", unit: "kN/m²" },
  { id: "temperature", name: "Beban Temperatur", symbol: "T", description: "Beban yang ditimbulkan oleh perubahan temperatur", unit: "kN" }
];

// Basic load combinations according to SNI 1727:2020
export const BASIC_LOAD_COMBINATIONS: LoadCombination[] = [
  {
    id: "1",
    name: "Kombinasi Dasar 1",
    description: "Beban mati + beban hidup",
    combination: "1.4D + 1.7L",
    factors: {
      dead: 1.4,
      live: 1.7
    },
    applicableTo: ["All structures"]
  },
  {
    id: "2",
    name: "Kombinasi Dasar 2",
    description: "Beban mati + beban hidup + beban angin",
    combination: "1.2D + 1.6L + 0.5(Lr or S or R) + 1.6W",
    factors: {
      dead: 1.2,
      live: 1.6,
      wind: 1.6
    },
    applicableTo: ["Structures subjected to wind loads"]
  },
  {
    id: "3",
    name: "Kombinasi Dasar 3",
    description: "Beban mati + beban hidup + beban gempa",
    combination: "1.2D + 1.0L + 1.0(Lr or S or R) + 1.0E",
    factors: {
      dead: 1.2,
      live: 1.0,
      earthquake: 1.0
    },
    applicableTo: ["Structures in seismic zones"]
  },
  {
    id: "4",
    name: "Kombinasi Dasar 4",
    description: "Beban mati + beban angin",
    combination: "0.9D + 1.6W",
    factors: {
      dead: 0.9,
      wind: 1.6
    },
    applicableTo: ["Structures where wind loads are critical"]
  },
  {
    id: "5",
    name: "Kombinasi Dasar 5",
    description: "Beban mati + beban gempa",
    combination: "0.9D + 1.0E",
    factors: {
      dead: 0.9,
      earthquake: 1.0
    },
    applicableTo: ["Structures where seismic loads are critical"]
  }
];

// Special load combinations for specific conditions
export const SPECIAL_LOAD_COMBINATIONS: LoadCombination[] = [
  {
    id: "s1",
    name: "Kombinasi Khusus 1",
    description: "Beban mati + beban hidup + beban temperatur",
    combination: "1.2D + 1.6L + 1.0T",
    factors: {
      dead: 1.2,
      live: 1.6,
      temperature: 1.0
    },
    applicableTo: ["Structures subjected to temperature effects"]
  },
  {
    id: "s2",
    name: "Kombinasi Khusus 2",
    description: "Beban mati + beban hidup + beban fluida",
    combination: "1.2D + 1.6L + 1.7F",
    factors: {
      dead: 1.2,
      live: 1.6,
      fluid: 1.7
    },
    applicableTo: ["Structures containing fluids"]
  }
];

/**
 * Calculate factored load based on load combination
 * @param loadType Type of load
 * @param loadValue Load value
 * @param combination Load combination to apply
 * @returns Factored load value
 */
export function calculateFactoredLoad(
  loadType: string,
  loadValue: number,
  combination: LoadCombination
): number {
  const factor = combination.factors[loadType as keyof typeof combination.factors];
  return factor ? loadValue * factor : 0;
}

/**
 * Get load combination by ID
 * @param id Combination ID
 * @returns Load combination object
 */
export function getLoadCombination(id: string): LoadCombination | undefined {
  const basic = BASIC_LOAD_COMBINATIONS.find(c => c.id === id);
  if (basic) return basic;
  
  return SPECIAL_LOAD_COMBINATIONS.find(c => c.id === id);
}

/**
 * Get all applicable load combinations for a structure type
 * @param structureType Type of structure
 * @returns Array of applicable load combinations
 */
export function getApplicableLoadCombinations(structureType: string): LoadCombination[] {
  return BASIC_LOAD_COMBINATIONS.filter(c => 
    c.applicableTo.includes("All structures") || c.applicableTo.includes(structureType)
  );
}

export default {
  LOAD_TYPES,
  BASIC_LOAD_COMBINATIONS,
  SPECIAL_LOAD_COMBINATIONS,
  calculateFactoredLoad,
  getLoadCombination,
  getApplicableLoadCombinations
};