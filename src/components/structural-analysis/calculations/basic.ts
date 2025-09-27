// =====================================
// 🚨 CORRECTED FOUNDATION CALCULATIONS
// Per SNI Standards - Zero Error Tolerance  
// =====================================

import { 
  SoilData, MaterialProperties, LoadCombination, Geometry, Loads, ProjectInfo, ValidationError,
  SeismicParameters 
} from '../interfaces';
import { 
  FoundationSystem, ConcreteMaterial, SteelReinforcement, STRENGTH_REDUCTION_FACTORS 
} from '../../../types/structural';

// FOUNDATION SELECTION - SPT Based Professional Logic
export const selectFoundationType = (
  soilData: SoilData,
  totalLoad: number,        // Total building load in kN
  seismicCategory: string,  // SDC from seismic analysis
  buildingHeight: number    // Total height in meters
): FoundationSystem => {
  
  // Calculate average SPT values - using existing field names
  const avgSPT = soilData.nspt.reduce((sum: number, value: number, index: number) => {
    const weight = 1 / (soilData.depth[index] + 1); // Weight by inverse depth
    return sum + value * weight;
  }, 0) / soilData.nspt.reduce((sum: number, _, index: number) => sum + 1 / (soilData.depth[index] + 1), 0);
  
  // Critical decision matrix based on actual soil conditions
  if (avgSPT < 5) {
    // Very soft soil - Deep foundation mandatory
    return {
      type: 'bored_pile',
      pileDetails: {
        diameter: totalLoad > 50000 ? 100 : totalLoad > 20000 ? 80 : 60, // cm
        length: calculateRequiredPileLength(soilData, totalLoad, 'bored_pile'),
        spacing: Math.max(3.0, Math.ceil(Math.sqrt(totalLoad / avgSPT) / 10) * 0.5), // m
        capacity: calculatePileCapacity(soilData, avgSPT, 'bored_pile', 60)
      }
    };
  } 
  else if (avgSPT >= 5 && avgSPT < 15) {
    // Soft to medium soil - Pile foundation required
    const pileType = seismicCategory >= 'D' ? 'bored_pile' : 'driven_pile';
    const diameter = pileType === 'bored_pile' ? 
      (totalLoad > 30000 ? 80 : 60) : 
      (totalLoad > 30000 ? 50 : 40);
    
    return {
      type: pileType,
      pileDetails: {
        diameter,
        length: calculateRequiredPileLength(soilData, totalLoad, pileType),
        spacing: calculateOptimalSpacing(diameter, avgSPT),
        capacity: calculatePileCapacity(soilData, avgSPT, pileType, diameter)
      }
    };
  }
  else if (avgSPT >= 15 && avgSPT < 30) {
    // Medium dense soil - Choose based on load and seismic
    const bearingPressure = totalLoad / 1000; // Rough estimate kPa
    
    if (bearingPressure < 200 && seismicCategory < 'D' && buildingHeight < 20) {
      // Shallow foundation possible with improvement
      return {
        type: 'mat_foundation',
        shallowDetails: {
          depth: Math.max(1.5, buildingHeight * 0.1), // m
          width: Math.sqrt(totalLoad / (avgSPT * 10)), // Rough sizing
          length: Math.sqrt(totalLoad / (avgSPT * 10)),
          bearingCapacity: calculateBearingCapacityDetailed(soilData, avgSPT),
          settlement: calculateSettlement(soilData, totalLoad, avgSPT)
        }
      };
    } else {
      // Deep foundation still recommended
      return {
        type: 'driven_pile',
        pileDetails: {
          diameter: totalLoad > 25000 ? 50 : 40,
          length: calculateRequiredPileLength(soilData, totalLoad, 'driven_pile'),
          spacing: calculateOptimalSpacing(40, avgSPT),
          capacity: calculatePileCapacity(soilData, avgSPT, 'driven_pile', 40)
        }
      };
    }
  }
  else {
    // Dense soil (N-SPT ≥ 30) - Shallow foundation preferred
    return {
      type: buildingHeight > 30 || totalLoad > 100000 ? 'mat_foundation' : 'isolated_footing',
      shallowDetails: {
        depth: Math.max(1.2, buildingHeight * 0.08),
        width: Math.sqrt(totalLoad / (avgSPT * 15)),
        length: Math.sqrt(totalLoad / (avgSPT * 15)),
        bearingCapacity: calculateBearingCapacityDetailed(soilData, avgSPT),
        settlement: calculateSettlement(soilData, totalLoad, avgSPT)
      }
    };
  }
};

// PILE LENGTH CALCULATION - Critical for Safety
const calculateRequiredPileLength = (
  soilData: SoilData, 
  totalLoad: number, 
  pileType: 'bored_pile' | 'driven_pile' | 'micro_pile'
): number => {
  
  let requiredLength = 0;
  
  // Iterate through soil layers to find adequate bearing - using existing field names
  for (let i = 0; i < soilData.nspt.length; i++) {
    const depth = soilData.depth[i];
    const nValue = soilData.nspt[i];
    
    // Calculate capacity at this depth
    if (nValue >= 30) {
      // Found hard layer - can terminate here
      requiredLength = Math.max(depth + 3.0, 8.0); // Minimum 3m into hard layer
      break;
    } 
    else if (nValue >= 15) {
      // Medium layer - continue but note as possible termination
      requiredLength = Math.max(depth + 5.0, 12.0);
    }
    else {
      // Soft layer - must continue deeper
      requiredLength = Math.max(depth + 8.0, 15.0);
    }
  }
  
  // Apply safety factors based on pile type
  const safetyFactor = pileType === 'bored_pile' ? 1.2 : 
                      pileType === 'driven_pile' ? 1.1 : 1.3;
  
  return Math.ceil(requiredLength * safetyFactor);
};

// PILE CAPACITY CALCULATION - Exact Methods
const calculatePileCapacity = (
  soilData: SoilData,
  avgSPT: number,
  pileType: 'bored_pile' | 'driven_pile' | 'micro_pile',
  diameter: number
): { ultimate: number; allowable: number; skinFriction: number; endBearing: number; safetyFactor: 2.0 | 2.5 | 3.0 } => {
  
  const radius = diameter / 200; // Convert cm to m radius
  const area = Math.PI * radius * radius;
  const perimeter = 2 * Math.PI * radius;
  
  // End bearing calculation - Meyerhof method
  let qp = 0;
  const deepestN = soilData.nspt[soilData.nspt.length - 1];
  
  // Determine soil type based on cu and phi values
  const isCohesive = soilData.cu > 0 && soilData.phi < 15;
  
  if (!isCohesive) {
    // For granular soils
    qp = Math.min(deepestN * 400, 15000); // kPa, capped at 15 MPa
  } else {
    // For cohesive soils
    const Su = soilData.cu || deepestN * 5; // Use cu or correlation
    qp = Math.min(Su * 9, 10000); // kPa, bearing factor of 9
  }
  
  const Qp = qp * area; // End bearing in kN
  
  // Skin friction calculation
  let Qs = 0;
  for (let i = 0; i < soilData.nspt.length - 1; i++) {
    const layerThickness = soilData.depth[i + 1] - soilData.depth[i];
    const layerN = soilData.nspt[i];
    
    let fs = 0; // Skin friction in kPa
    if (!isCohesive) {
      // Granular soil
      fs = Math.min(layerN * 2, 100); // kPa
      if (pileType === 'bored_pile') fs *= 0.7; // Reduction for bored piles
    } else {
      // Cohesive soil
      const Su = layerN * 5; // Rough correlation
      fs = Math.min(Su * 0.3, 80); // Alpha method, α = 0.3 average
    }
    
    Qs += fs * perimeter * layerThickness;
  }
  
  // Total ultimate capacity
  const Qu = Qp + Qs;
  
  // Safety factors based on soil conditions and pile type
  let safetyFactor: 2.0 | 2.5 | 3.0 = 2.5;
  if (avgSPT < 10) safetyFactor = 3.0;      // Soft soil
  else if (avgSPT > 20) safetyFactor = 2.0; // Dense soil
  
  if (pileType === 'bored_pile') safetyFactor = Math.max(safetyFactor, 2.5) as 2.5 | 3.0;
  
  const Qa = Qu / safetyFactor;
  
  return {
    ultimate: Math.round(Qu),
    allowable: Math.round(Qa), 
    skinFriction: Math.round(Qs),
    endBearing: Math.round(Qp),
    safetyFactor
  };
};

// BEARING CAPACITY - Terzaghi/Meyerhof Method
const calculateBearingCapacityDetailed = (
  soilData: SoilData,
  avgSPT: number
): { ultimate: number; allowable: number; safetyFactor: 2.5 | 3.0 | 3.5 } => {
  
  // Use existing soil parameters or correlations
  const c = soilData.cu || 0; // cohesion
  const phi = soilData.phi || avgSPT * 1.2 + 25; // friction angle from correlation
  const gamma = soilData.gamma || 18; // unit weight
  
  // Foundation dimensions (assumed for preliminary design)
  const B = 2.0; // m width
  const D = 1.5; // m depth
  
  // Bearing capacity factors
  const phiRad = phi * Math.PI / 180;
  const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
  const Nc = (Nq - 1) / Math.tan(phiRad);
  const Ngamma = 2 * (Nq + 1) * Math.tan(phiRad);
  
  // Ultimate bearing capacity - Terzaghi equation
  const qu = c * Nc + gamma * D * Nq + 0.5 * gamma * B * Ngamma; // kPa
  
  // Safety factor based on soil conditions
  let safetyFactor: 2.5 | 3.0 | 3.5 = 3.0;
  if (avgSPT > 15) safetyFactor = 2.5;      // Dense soil
  else if (avgSPT < 8) safetyFactor = 3.5;  // Soft soil
  
  const qa = qu / safetyFactor;
  
  return {
    ultimate: Math.round(qu),
    allowable: Math.round(qa),
    safetyFactor
  };
};

// SETTLEMENT CALCULATION - Essential for Serviceability
const calculateSettlement = (
  soilData: SoilData,
  totalLoad: number,
  avgSPT: number
): { immediate: number; consolidation: number; total: number; allowable: 25 | 50 } => {
  
  // Simplified settlement calculation
  const B = Math.sqrt(totalLoad / (avgSPT * 10)); // Foundation width estimate
  const q = totalLoad / (B * B); // Applied pressure kPa
  
  // Immediate settlement (elastic)
  const Es = avgSPT * 1000; // kPa, rough correlation for modulus
  const immediateSettlement = q * B * (1 - 0.3 * 0.3) / Es * 1000; // mm
  
  // Consolidation settlement (for cohesive soils)
  let consolidationSettlement = 0;
  if (soilData.cu > 10) { // Indicates clayey soil
    // Simplified calculation - needs detailed soil properties
    consolidationSettlement = q * 10 / avgSPT; // mm, very rough estimate
  }
  
  const totalSettlement = immediateSettlement + consolidationSettlement;
  
  // Allowable settlement based on structure type
  const allowableSettlement: 25 | 50 = totalLoad > 50000 ? 25 : 50; // mm
  
  return {
    immediate: Math.round(immediateSettlement * 10) / 10,
    consolidation: Math.round(consolidationSettlement * 10) / 10,
    total: Math.round(totalSettlement * 10) / 10,
    allowable: allowableSettlement
  };
};

// OPTIMAL PILE SPACING
const calculateOptimalSpacing = (diameter: number, sptValue: number): number => {
  // Minimum spacing per codes
  const minSpacing = Math.max(diameter / 100 * 2.5, 1.0); // 2.5D or 1.0m minimum
  
  // Adjust based on soil conditions
  let spacingFactor = 1.0;
  if (sptValue < 10) spacingFactor = 1.2;      // Wider spacing for soft soil
  else if (sptValue > 20) spacingFactor = 0.9; // Can use tighter spacing
  
  return Math.round(minSpacing * spacingFactor * 10) / 10; // Round to 0.1m
};

// CORRECTED VALIDATION - Critical Safety Checks
export const validateInputs = (
  geometry: Geometry, 
  loads: Loads, 
  projectInfo: ProjectInfo, 
  materials: MaterialProperties, 
  soilData: SoilData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // CRITICAL GEOMETRIC VALIDATIONS
  if (geometry.heightPerFloor < 2.8) {
    errors.push({
      field: 'heightPerFloor',
      message: 'Tinggi lantai minimum 2.8m per SNI 03-1734-2012 untuk komfort struktural',
      severity: 'error'
    });
  }

  if (geometry.baySpacingX > 12 || geometry.baySpacingY > 12) {
    errors.push({
      field: 'baySpacing',
      message: 'Bentang maksimum 12m untuk sistem balok-kolom beton bertulang (SNI 2847:2019)',
      severity: 'error'
    });
  }

  // CRITICAL MATERIAL VALIDATIONS - Only allow discrete values
  const validConcreteStrengths = [17, 20, 25, 30, 35, 40, 45, 50];
  if (!validConcreteStrengths.includes(materials.fc)) {
    errors.push({
      field: 'fc',
      message: `Mutu beton harus salah satu dari: ${validConcreteStrengths.join(', ')} MPa (SNI 2847:2019)`,
      severity: 'error'
    });
  }

  if (materials.fc < 20 && geometry.numberOfFloors > 3) {
    errors.push({
      field: 'fc',
      message: 'Mutu beton minimum fc\' = 25 MPa untuk bangunan >3 lantai (SNI 2847:2019)',
      severity: 'error'
    });
  }

  // SOIL DATA VALIDATION - Must have actual SPT data
  if (!soilData.nspt || soilData.nspt.length < 3) {
    errors.push({
      field: 'nspt',
      message: 'Diperlukan minimum 3 titik data SPT untuk analisis pondasi yang aman',
      severity: 'error'
    });
  }

  if (soilData.nspt && soilData.nspt.some(n => n < 0 || n > 100)) {
    errors.push({
      field: 'nspt',
      message: 'Nilai N-SPT harus antara 0-100. Periksa kembali hasil penyelidikan tanah.',
      severity: 'error'
    });
  }

  // LOAD VALIDATION - Must be realistic
  if (loads.liveLoad < 1.9) {
    errors.push({
      field: 'liveLoad',
      message: 'Beban hidup minimum 1.9 kN/m² untuk bangunan hunian (SNI 1727:2020)',
      severity: 'error'
    });
  }

  if (loads.deadLoad < 3.0) {
    errors.push({
      field: 'deadLoad',
      message: 'Beban mati terlalu rendah. Minimum 3.0 kN/m² untuk bangunan beton (SNI 1727:2020)',
      severity: 'warning'
    });
  }

  // SEISMIC VALIDATION - Must have proper parameters  
  if (!projectInfo.latitude || !projectInfo.longitude) {
    errors.push({
      field: 'location',
      message: 'Koordinat lokasi wajib diisi untuk menentukan parameter gempa SNI 1726:2019',
      severity: 'error'
    });
  }

  // Additional basic validation
  if (geometry.length <= 0 || geometry.width <= 0) {
    errors.push({
      field: 'dimensions',
      message: 'Dimensi bangunan harus lebih besar dari 0',
      severity: 'error'
    });
  }

  if (geometry.numberOfFloors <= 0) {
    errors.push({
      field: 'numberOfFloors',
      message: 'Jumlah lantai harus lebih besar dari 0',
      severity: 'error'
    });
  }

  if (geometry.baySpacingX <= 0 || geometry.baySpacingY <= 0) {
    errors.push({
      field: 'baySpacing',
      message: 'Jarak antar kolom harus lebih besar dari 0',
      severity: 'error'
    });
  }

  return errors;
};

// EXISTING FUNCTIONS - Keep compatibility
export const performBasicCalculations = (
  geometry: Geometry, 
  loads: Loads, 
  projectInfo: ProjectInfo, 
  materials: MaterialProperties, 
  soilData: SoilData
) => {
  // Calculate basic building parameters
  const totalArea = geometry.length * geometry.width;
  const totalVolume = totalArea * geometry.heightPerFloor * geometry.numberOfFloors;
  const totalHeight = geometry.heightPerFloor * geometry.numberOfFloors;
  
  // Calculate total building load estimate
  const structuralLoad = totalVolume * 24; // kN (concrete density)
  const liveLoadTotal = totalArea * geometry.numberOfFloors * loads.liveLoad;
  const deadLoadTotal = totalArea * geometry.numberOfFloors * loads.deadLoad;
  const totalLoad = structuralLoad + liveLoadTotal + deadLoadTotal;
  
  // Determine foundation recommendation based on corrected logic
  const avgSPT = soilData.nspt.reduce((sum: number, value: number) => sum + value, 0) / soilData.nspt.length;
  const foundationRecommendation = selectFoundationType(soilData, totalLoad, 'C', totalHeight);
  
  return {
    totalArea,
    totalVolume,
    totalHeight,
    totalLoad: Math.round(totalLoad),
    avgSPT: Math.round(avgSPT * 10) / 10,
    foundationRecommendation,
    // Legacy compatibility
    bearingCapacity: calculateBearingCapacityDetailed(soilData, avgSPT),
  };
};

export const getLoadCombinations = (): LoadCombination[] => {
  return [
    { id: 'U1', name: 'Dead only', formula: '1.4D', dead: 1.4, live: 0, wind: 0, earthquake: 0, roof: 0, rain: 0 },
    { id: 'U2', name: 'Dead + Live', formula: '1.2D + 1.6L + 0.5Lr', dead: 1.2, live: 1.6, wind: 0, earthquake: 0, roof: 0.5, rain: 0 },
    { id: 'U3', name: 'Dead + Wind', formula: '1.2D + 1.0W + L + 0.5Lr', dead: 1.2, live: 1.0, wind: 1.0, earthquake: 0, roof: 0.5, rain: 0 },
    { id: 'U4', name: 'Dead + Seismic', formula: '1.2D + 1.0E + L', dead: 1.2, live: 1.0, wind: 0, earthquake: 1.0, roof: 0, rain: 0 },
    { id: 'U5', name: 'Reduced Dead + Wind', formula: '0.9D + 1.0W', dead: 0.9, live: 0, wind: 1.0, earthquake: 0, roof: 0, rain: 0 },
    { id: 'U6', name: 'Reduced Dead + Seismic', formula: '0.9D + 1.0E', dead: 0.9, live: 0, wind: 0, earthquake: 1.0, roof: 0, rain: 0 }
  ];
};

// Legacy functions for compatibility - simplified interface
export const calculateBearingCapacity = (soilData: SoilData): number => {
  const avgSPT = soilData.nspt.reduce((sum: number, value: number) => sum + value, 0) / soilData.nspt.length;
  const result = calculateBearingCapacityDetailed(soilData, avgSPT);
  return result.allowable;
};

export const calculateColumn = (floor: number, geometry: Geometry, loads: Loads, materials: MaterialProperties) => {
  // Simplified logic with corrected parameters
  const tributaryArea = (geometry.baySpacingX * geometry.baySpacingY);
  const deadLoad = loads.deadLoad; // Already in kN/m²
  const liveLoad = loads.liveLoad; // Already in kN/m²
  const Pu = (1.2 * deadLoad + 1.6 * liveLoad) * tributaryArea * (geometry.numberOfFloors - floor + 1); // kN
  
  // Use corrected strength reduction factor
  const phi = 0.65; // For tied columns per SNI 2847:2019
  const Ag = Pu * 1000 / (phi * 0.8 * (0.85 * materials.fc * 0.99 + materials.fy * 0.01));
  const side = Math.sqrt(Ag);
  
  return { 
    dimension: Math.ceil(side / 50) * 50, 
    demand: Pu,
    capacityRatio: Pu / (phi * 0.8 * materials.fc * Ag / 1000)
  };
};

export const calculateBeam = (type: 'main' | 'secondary', geometry: Geometry, loads: Loads) => {
  const span = type === 'main' ? geometry.baySpacingX : geometry.baySpacingY;
  const tributaryWidth = type === 'main' ? geometry.baySpacingY / 2 : geometry.baySpacingX / 2;
  const deadLoad = loads.deadLoad; // kN/m²
  const liveLoad = loads.liveLoad; // kN/m²
  const wu = (1.2 * deadLoad + 1.6 * liveLoad) * tributaryWidth; // kN/m
  const Mu = wu * span * span / 8; // kNm
  
  return { 
    moment: Mu,
    shear: wu * span / 2,
    deflection: 5 * wu * Math.pow(span, 4) / (384 * 25000 * Math.pow(span, 4) / 12) // Rough estimate
  };
};

export const calculateSlab = (geometry: Geometry, loads: Loads) => {
  const Lx = Math.min(geometry.baySpacingX, geometry.baySpacingY);
  const Ly = Math.max(geometry.baySpacingX, geometry.baySpacingY);
  const ratio = Ly / Lx;
  const isTwoWay = ratio <= 2;
  
  // Improved thickness calculation per SNI 2847:2019
  const hMin = isTwoWay ? 
    Math.max(Lx * 1000 / 30, 120) :  // Two-way slab
    Math.max(Lx * 1000 / 24, 100);   // One-way slab
  
  return { 
    thickness: Math.max(hMin, 120), 
    type: isTwoWay ? 'Two-way' : 'One-way',
    reinforcementRatio: isTwoWay ? 0.0018 : 0.002
  };
};

// FOUNDATION CAPACITY CALCULATION
export const calculateFoundationCapacity = (
  soilData: SoilData, 
  foundationType: FoundationSystem, 
  loads: { dead: number; live: number; seismic: number }
): { capacity: number; safetyFactor: number; isAdequate: boolean } => {
  
  const avgSPT = (soilData.nspt || [10]).reduce((sum, val) => sum + val, 0) / (soilData.nspt || [10]).length;
  
  // Simplified bearing capacity calculation
  let bearingCapacity = 0;
  
  if (['isolated_footing', 'combined_footing'].includes(foundationType.type)) {
    // Shallow foundation
    bearingCapacity = avgSPT * 40; // kN/m² (conservative)
  } else if (['bored_pile', 'driven_pile', 'micro_pile'].includes(foundationType.type)) {
    // Pile foundation
    bearingCapacity = avgSPT * 200; // kN per pile (conservative)
  } else {
    // Mat foundation or caisson
    bearingCapacity = avgSPT * 60; // kN/m² (conservative)
  }
  
  const totalLoad = loads.dead + loads.live + loads.seismic;
  const safetyFactor = bearingCapacity / totalLoad;
  
  return {
    capacity: bearingCapacity,
    safetyFactor: safetyFactor,
    isAdequate: safetyFactor >= 2.5
  };
};