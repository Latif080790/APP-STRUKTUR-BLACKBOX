/**
 * SNI 1726:2019 - Tata cara perencanaan ketahanan gempa untuk struktur bangunan gedung dan kegunaan lain
 * Implementation of seismic design requirements
 */

export interface SeismicZone {
  zone: number;
  acceleration: number; // Peak Ground Acceleration (PGA) in g
  velocity: number; // Peak Ground Velocity in cm/s
  description: string;
}

export interface SoilType {
  type: string;
  description: string;
  amplificationFactor: number;
}

export interface BuildingCategory {
  category: string;
  importanceFactor: number;
  description: string;
}

// Seismic zones based on Indonesian seismic hazard map
export const SEISMIC_ZONES: SeismicZone[] = [
  { zone: 1, acceleration: 0.1, velocity: 20, description: "Low seismicity zone" },
  { zone: 2, acceleration: 0.2, velocity: 40, description: "Moderate seismicity zone" },
  { zone: 3, acceleration: 0.3, velocity: 60, description: "High seismicity zone" },
  { zone: 4, acceleration: 0.4, velocity: 80, description: "Very high seismicity zone" }
];

// Soil types according to SNI 1726
export const SOIL_TYPES: SoilType[] = [
  { type: "ZA", description: "Rock", amplificationFactor: 1.0 },
  { type: "ZB", description: "Very dense soil and soft rock", amplificationFactor: 1.2 },
  { type: "ZC", description: "Stiff soil", amplificationFactor: 1.4 },
  { type: "ZD", description: "Medium soil", amplificationFactor: 1.6 },
  { type: "ZE", description: "Soft soil", amplificationFactor: 1.8 }
];

// Building categories according to SNI 1726
export const BUILDING_CATEGORIES: BuildingCategory[] = [
  { category: "I", importanceFactor: 1.0, description: "Standard building" },
  { category: "II", importanceFactor: 1.25, description: "Building with moderate importance" },
  { category: "III", importanceFactor: 1.5, description: "Essential facility" },
  { category: "IV", importanceFactor: 2.0, description: "Critical facility" }
];

/**
 * Calculate seismic response coefficient (Cs) according to SNI 1726
 * @param zone Seismic zone
 * @param soilType Soil type
 * @param buildingCategory Building category
 * @param period Structure period
 * @returns Seismic response coefficient
 */
export function calculateSeismicCoefficient(
  zone: SeismicZone,
  soilType: SoilType,
  buildingCategory: BuildingCategory,
  period: number
): number {
  // Base shear coefficient from SNI 1726
  let coefficient = zone.acceleration * soilType.amplificationFactor * buildingCategory.importanceFactor;
  
  // Apply period-dependent modification
  if (period <= 0.5) {
    coefficient *= 1.0;
  } else if (period <= 1.0) {
    coefficient *= (1.5 - 0.5 * period);
  } else {
    coefficient *= (0.75 / period);
  }
  
  // Minimum coefficient according to SNI 1726
  const minCoefficient = 0.05 * zone.acceleration * buildingCategory.importanceFactor;
  return Math.max(coefficient, minCoefficient);
}

/**
 * Get seismic zone by zone number
 * @param zoneNumber Zone number (1-4)
 * @returns Seismic zone object
 */
export function getSeismicZone(zoneNumber: number): SeismicZone | undefined {
  return SEISMIC_ZONES.find(zone => zone.zone === zoneNumber);
}

/**
 * Get soil type by type code
 * @param typeCode Soil type code (ZA-ZE)
 * @returns Soil type object
 */
export function getSoilType(typeCode: string): SoilType | undefined {
  return SOIL_TYPES.find(soil => soil.type === typeCode);
}

/**
 * Get building category by category code
 * @param categoryCode Building category code (I-IV)
 * @returns Building category object
 */
export function getBuildingCategory(categoryCode: string): BuildingCategory | undefined {
  return BUILDING_CATEGORIES.find(category => category.category === categoryCode);
}

/**
 * Calculate design spectral acceleration according to SNI 1726
 * @param zone Seismic zone
 * @param soilType Soil type
 * @param buildingCategory Building category
 * @param period Structure period
 * @returns Design spectral acceleration (SDS)
 */
export function calculateDesignSpectralAcceleration(
  zone: SeismicZone,
  soilType: SoilType,
  buildingCategory: BuildingCategory,
  period: number
): number {
  const coefficient = calculateSeismicCoefficient(zone, soilType, buildingCategory, period);
  return coefficient * 9.81; // Convert to m/s²
}

export default {
  SEISMIC_ZONES,
  SOIL_TYPES,
  BUILDING_CATEGORIES,
  calculateSeismicCoefficient,
  getSeismicZone,
  getSoilType,
  getBuildingCategory,
  calculateDesignSpectralAcceleration
};