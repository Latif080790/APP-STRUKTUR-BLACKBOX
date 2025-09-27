// =====================================
// 🚨 CORRECTED SEISMIC CALCULATIONS
// Per SNI 1726:2019 - Zero Error Tolerance
// =====================================

import { SeismicParameters, SoilData, Geometry, Loads, MaterialProperties } from '../interfaces';

// Site Coefficients - Exact Tables from SNI 1726:2019
const SITE_COEFFICIENT_FA = {
  // Table 4 - Site coefficient Fa for short periods
  SA: { 0.25: 0.8, 0.5: 0.8, 0.75: 0.8, 1.0: 0.8, 1.25: 0.8, 1.5: 0.8 },
  SB: { 0.25: 0.9, 0.5: 0.9, 0.75: 0.9, 1.0: 0.9, 1.25: 0.9, 1.5: 0.9 },
  SC: { 0.25: 1.3, 0.5: 1.3, 0.75: 1.2, 1.0: 1.2, 1.25: 1.2, 1.5: 1.2 },
  SD: { 0.25: 1.6, 0.5: 1.4, 0.75: 1.2, 1.0: 1.1, 1.25: 1.0, 1.5: 1.0 },
  SE: { 0.25: 2.4, 0.5: 1.6, 0.75: 1.2, 1.0: 0.9, 1.25: 0.8, 1.5: 0.8 }
} as const;

const SITE_COEFFICIENT_FV = {
  // Table 5 - Site coefficient Fv for 1-second periods
  SA: { 0.1: 0.8, 0.2: 0.8, 0.3: 0.8, 0.4: 0.8, 0.5: 0.8 },
  SB: { 0.1: 0.9, 0.2: 0.9, 0.3: 0.9, 0.4: 0.9, 0.5: 0.9 },
  SC: { 0.1: 1.8, 0.2: 1.8, 0.3: 1.8, 0.4: 1.8, 0.5: 1.8 },
  SD: { 0.1: 2.4, 0.2: 2.0, 0.3: 1.8, 0.4: 1.6, 0.5: 1.5 },
  SE: { 0.1: 3.5, 0.2: 3.2, 0.3: 2.8, 0.4: 2.4, 0.5: 2.4 }
} as const;

// Seismic Design Category - Table 6 & 7
const getSeismicDesignCategory = (SDS: number, SD1: number, riskCategory: 'I' | 'II' | 'III' | 'IV'): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
  // Risk category factors
  const categoryI_II = { SDS_B: 0.167, SDS_C: 0.33, SDS_D: 0.5, SD1_B: 0.067, SD1_C: 0.133, SD1_D: 0.2 };
  const categoryIII = { SDS_B: 0.167, SDS_C: 0.33, SDS_D: 0.5, SD1_B: 0.067, SD1_C: 0.133, SD1_D: 0.2 };
  const categoryIV = { SDS_B: 0.167, SDS_C: 0.33, SDS_D: 0.5, SD1_B: 0.067, SD1_C: 0.133, SD1_D: 0.2 };
  
  const limits = riskCategory === 'IV' ? categoryIV : 
                riskCategory === 'III' ? categoryIII : categoryI_II;
  
  // Determine SDC based on SDS
  let sdcFromSDS: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  if (SDS < limits.SDS_B) sdcFromSDS = 'A';
  else if (SDS < limits.SDS_C) sdcFromSDS = 'B';
  else if (SDS < limits.SDS_D) sdcFromSDS = 'C';
  else sdcFromSDS = 'D';
  
  // Determine SDC based on SD1
  let sdcFromSD1: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  if (SD1 < limits.SD1_B) sdcFromSD1 = 'A';
  else if (SD1 < limits.SD1_C) sdcFromSD1 = 'B';
  else if (SD1 < limits.SD1_D) sdcFromSD1 = 'C';
  else sdcFromSD1 = 'D';
  
  // Take the more stringent category
  const categories = ['A', 'B', 'C', 'D', 'E', 'F'];
  const indexSDS = categories.indexOf(sdcFromSDS);
  const indexSD1 = categories.indexOf(sdcFromSD1);
  
  return categories[Math.max(indexSDS, indexSD1)] as 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
};

// Interpolation function for site coefficients
const interpolateSiteCoefficient = (
  value: number,
  table: Record<number, number>,
  parameterName: string
): number => {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  
  // Handle edge cases
  if (value <= keys[0]) return table[keys[0]];
  if (value >= keys[keys.length - 1]) return table[keys[keys.length - 1]];
  
  // Find interpolation points
  for (let i = 0; i < keys.length - 1; i++) {
    if (value >= keys[i] && value <= keys[i + 1]) {
      const x0 = keys[i];
      const x1 = keys[i + 1];
      const y0 = table[x0];
      const y1 = table[x1];
      
      // Linear interpolation
      const result = y0 + (y1 - y0) * (value - x0) / (x1 - x0);
      return Math.round(result * 1000) / 1000; // Round to 3 decimal places
    }
  }
  
  throw new Error(`Cannot interpolate ${parameterName} for value ${value}`);
};

// CORRECTED SEISMIC PARAMETER CALCULATION
export const calculateSeismicParameters = (
  latitude: number,
  longitude: number,
  Ss: number,    // From hazard maps
  S1: number,    // From hazard maps
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF',
  riskCategory: 'I' | 'II' | 'III' | 'IV' = 'II'
): SeismicParameters => {
  
  // Validation - Critical for Safety
  if (Ss < 0.4 || Ss > 1.5) {
    throw new Error(`Ss value ${Ss} outside valid range (0.4-1.5g) per SNI 1726:2019`);
  }
  
  if (S1 < 0.1 || S1 > 0.6) {
    throw new Error(`S1 value ${S1} outside valid range (0.1-0.6g) per SNI 1726:2019`);
  }
  
  // Handle Site Class F (requires site-specific analysis)
  if (siteClass === 'SF') {
    throw new Error('Site Class F requires site-specific ground motion analysis per SNI 1726:2019 Section 6.10');
  }
  
  // Calculate site coefficients using exact SNI tables
  const fa = interpolateSiteCoefficient(Ss, SITE_COEFFICIENT_FA[siteClass], 'Fa');
  const fv = interpolateSiteCoefficient(S1, SITE_COEFFICIENT_FV[siteClass], 'Fv');
  
  // Calculate design parameters - Exact formulas
  const SMS = fa * Ss;
  const SM1 = fv * S1;
  
  const sds = (2/3) * SMS;
  const sd1 = (2/3) * SM1;
  
  // Validate calculated parameters
  if (sds <= 0 || sd1 <= 0) {
    throw new Error('Calculated SDS or SD1 is invalid (≤0)');
  }
  
  // Calculate transition periods
  const t0 = 0.2 * sd1 / sds;
  const ts = sd1 / sds;
  const tl = 8.0; // Long period transition for Indonesia per SNI 1726:2019
  
  // Determine Seismic Design Category
  const category = getSeismicDesignCategory(sds, sd1, riskCategory);
  
  // Importance factor per Table 1
  const importance = riskCategory === 'I' ? 1.0 :
                    riskCategory === 'II' ? 1.0 :
                    riskCategory === 'III' ? 1.25 :
                    1.5; // Risk Category IV
  
  return {
    // Basic parameters (matching existing interface)
    ss: Ss,
    s1: S1,
    fa: Math.round(fa * 1000) / 1000,
    fv: Math.round(fv * 1000) / 1000,
    sds: Math.round(sds * 1000) / 1000,
    sd1: Math.round(sd1 * 1000) / 1000,
    siteClass,
    importance,
    r: 5.0, // Default - to be determined based on structural system
    cd: 4.5, // Default - to be determined based on structural system
    omega: 3.0, // Default - to be determined based on structural system
    tl: tl,
    ts: ts,
    t0: t0,
    category: category as 'A' | 'B' | 'C' | 'D' | 'E',
    
    // Additional properties to match interface
    isSeismic: sds >= 0.167 || sd1 >= 0.067, // Per Table 6
    zoneFactor: sds, // Use SDS as zone factor equivalent
    soilType: siteClass,
    responseModifier: 5.0 // Default R value
  };
};

// RESPONSE SPECTRUM GENERATION - SNI 1726:2019 Section 6.4
export const generateResponseSpectrum = (seismicParams: SeismicParameters): Array<{ period: number; acceleration: number }> => {
  const { sds, sd1, t0, ts, tl } = seismicParams;
  
  if (!sds || !sd1 || !t0 || !ts || !tl) {
    throw new Error('Missing required seismic parameters for response spectrum');
  }
  
  const spectrum: Array<{ period: number; acceleration: number }> = [];
  
  // Generate spectrum points with fine resolution
  for (let T = 0; T <= 5.0; T += 0.02) {
    let Sa: number;
    
    if (T <= t0) {
      // Region 1: T ≤ T0
      Sa = sds * (0.4 + 0.6 * T / t0);
    } else if (T <= ts) {
      // Region 2: T0 < T ≤ TS
      Sa = sds;
    } else if (T <= tl) {
      // Region 3: TS < T ≤ TL
      Sa = sd1 / T;
    } else {
      // Region 4: T > TL
      Sa = sd1 * tl / (T * T);
    }
    
    // Ensure non-negative values
    Sa = Math.max(Sa, 0);
    
    spectrum.push({
      period: Math.round(T * 100) / 100,
      acceleration: Math.round(Sa * 1000) / 1000
    });
  }
  
  return spectrum;
};

// BUILDING PERIOD CALCULATION - SNI 1726:2019 Section 7.8.2
export const calculateBuildingPeriod = (
  buildingHeight: number,  // Total height in meters
  structuralSystem: 'concrete_moment_frame' | 'concrete_shear_wall' | 'steel_moment_frame' | 'braced_frame',
  seismicParams: SeismicParameters
): { Ta: number; Tmax: number; Tmin: number } => {
  
  if (buildingHeight <= 0) {
    throw new Error('Building height must be positive');
  }
  
  // Approximate period calculation parameters - Table 15
  let Ct: number, x: number;
  
  switch (structuralSystem) {
    case 'concrete_moment_frame':
      Ct = 0.0466; // For RC moment resisting frames
      x = 0.9;
      break;
    case 'concrete_shear_wall':
      Ct = 0.0488; // For RC shear wall systems
      x = 0.75;
      break;
    case 'steel_moment_frame':
      Ct = 0.0724; // For steel moment frames
      x = 0.8;
      break;
    case 'braced_frame':
      Ct = 0.0731; // For concentrically braced frames
      x = 0.75;
      break;
    default:
      throw new Error(`Unknown structural system: ${structuralSystem}`);
  }
  
  // Calculate approximate period
  const Ta = Ct * Math.pow(buildingHeight, x);
  
  if (Ta <= 0) {
    throw new Error('Calculated approximate period is invalid');
  }
  
  // Upper limit coefficient - Table 14
  let Cu: number;
  const sd1 = seismicParams.sd1;
  
  if (sd1 >= 0.4) {
    Cu = 1.4;
  } else if (sd1 >= 0.3) {
    Cu = 1.5;
  } else if (sd1 >= 0.2) {
    Cu = 1.6;
  } else if (sd1 >= 0.15) {
    Cu = 1.7;
  } else {
    Cu = 1.7; // For SD1 < 0.15
  }
  
  const Tmax = Cu * Ta;
  const Tmin = 0.75 * Ta; // Lower limit
  
  return {
    Ta: Math.round(Ta * 1000) / 1000,
    Tmax: Math.round(Tmax * 1000) / 1000,
    Tmin: Math.round(Tmin * 1000) / 1000
  };
};

// BASE SHEAR CALCULATION - SNI 1726:2019 Section 7.8.1
export const calculateBaseShear = (
  seismicWeight: number,    // Total seismic weight in kN
  period: number,           // Fundamental period T
  seismicParams: SeismicParameters,
  responseModificationFactor: number, // R factor
  overstrengthFactor: number = 1.0,   // Ω0 factor
  deflectionAmplification: number = 1.0 // Cd factor
): { V: number; Cs: number; CsMax: number; CsMin: number } => {
  
  const { sds, sd1, importance } = seismicParams;
  const R = responseModificationFactor;
  const tl = seismicParams.tl || 8.0;
  
  // Validation
  if (seismicWeight <= 0) throw new Error('Seismic weight must be positive');
  if (period <= 0) throw new Error('Period must be positive');  
  if (R <= 0) throw new Error('Response modification factor must be positive');
  if (!sds || sds <= 0) throw new Error('SDS must be positive');
  if (sd1 < 0) throw new Error('SD1 must be non-negative');
  if (!importance || importance <= 0) throw new Error('Importance factor must be positive');
  
  // Calculate seismic response coefficient
  let Cs = sds / (R / importance);
  
  // Upper limit - Equation 22 and 23
  let CsMax: number;
  if (period <= tl) {
    CsMax = sd1 / (period * R / importance);
  } else {
    CsMax = sd1 * tl / (period * period * R / importance);
  }
  
  // Apply upper limit
  Cs = Math.min(Cs, CsMax);
  
  // Lower limits - Equation 24 and 25
  const CsMin1 = 0.044 * sds * importance;
  const CsMin2 = 0.5 * seismicParams.s1 / (R / importance); // For S1 ≥ 0.6g (rarely applicable in Indonesia)
  const CsMin = Math.max(CsMin1, CsMin2, 0.01); // Absolute minimum per Section 7.8.1.3
  
  // Apply lower limit
  Cs = Math.max(Cs, CsMin);
  
  // Calculate base shear
  const V = Cs * seismicWeight;
  
  return {
    V: Math.round(V),
    Cs: Math.round(Cs * 10000) / 10000,
    CsMax: Math.round(CsMax * 10000) / 10000,
    CsMin: Math.round(CsMin * 10000) / 10000
  };
};

// LATERAL FORCE DISTRIBUTION - SNI 1726:2019 Section 7.8.3
export const distributeLateralForces = (
  baseShear: number,
  period: number,
  floorWeights: number[],    // Weight at each floor (kN)
  floorHeights: number[]     // Height of each floor above base (m)
): Array<{ floor: number; height: number; weight: number; force: number; shear: number }> => {
  
  if (floorWeights.length !== floorHeights.length) {
    throw new Error('Number of floor weights must match number of floor heights');
  }
  
  if (baseShear <= 0) throw new Error('Base shear must be positive');
  if (period <= 0) throw new Error('Period must be positive');
  
  const numFloors = floorWeights.length;
  
  // Validate inputs
  for (let i = 0; i < numFloors; i++) {
    if (floorWeights[i] <= 0) throw new Error(`Floor weight ${i+1} must be positive`);
    if (floorHeights[i] <= 0) throw new Error(`Floor height ${i+1} must be positive`);
    if (i > 0 && floorHeights[i] <= floorHeights[i-1]) {
      throw new Error(`Floor heights must be increasing`);
    }
  }
  
  // Calculate distribution exponent k
  let k: number;
  if (period <= 0.5) {
    k = 1.0;
  } else if (period >= 2.5) {
    k = 2.0;
  } else {
    k = 1.0 + (period - 0.5) / 2.0;
  }
  
  // Calculate Cvx coefficients
  let sumWiHik = 0;
  const wiHik: number[] = [];
  
  for (let i = 0; i < numFloors; i++) {
    const wiHi_k = floorWeights[i] * Math.pow(floorHeights[i], k);
    wiHik.push(wiHi_k);
    sumWiHik += wiHi_k;
  }
  
  if (sumWiHik <= 0) throw new Error('Invalid sum of weight-height products');
  
  // Distribute lateral forces
  const forces: Array<{ floor: number; height: number; weight: number; force: number; shear: number }> = [];
  let cumulativeShear = 0;
  
  // Calculate from top floor down for shear calculation
  for (let i = numFloors - 1; i >= 0; i--) {
    const Cvx = wiHik[i] / sumWiHik;
    const Fx = Cvx * baseShear;
    
    cumulativeShear += Fx;
    
    forces.unshift({
      floor: i + 1,
      height: floorHeights[i],
      weight: floorWeights[i],
      force: Math.round(Fx),
      shear: Math.round(cumulativeShear)
    });
  }
  
  return forces;
};

// RESPONSE MODIFICATION FACTORS - Table 9
export const getResponseModificationFactors = (
  structuralSystem: string
): { R: number; Omega0: number; Cd: number } => {
  
  const systemFactors: Record<string, { R: number; Omega0: number; Cd: number }> = {
    // Concrete Systems
    'concrete_special_moment_frame': { R: 8.0, Omega0: 3.0, Cd: 5.5 },
    'concrete_intermediate_moment_frame': { R: 5.0, Omega0: 3.0, Cd: 4.5 },
    'concrete_ordinary_moment_frame': { R: 3.0, Omega0: 3.0, Cd: 2.5 },
    'concrete_special_shear_wall': { R: 6.0, Omega0: 2.5, Cd: 5.0 },
    'concrete_ordinary_shear_wall': { R: 4.0, Omega0: 2.5, Cd: 4.0 },
    
    // Steel Systems  
    'steel_special_moment_frame': { R: 8.0, Omega0: 3.0, Cd: 5.5 },
    'steel_intermediate_moment_frame': { R: 4.5, Omega0: 3.0, Cd: 4.0 },
    'steel_ordinary_moment_frame': { R: 3.5, Omega0: 3.0, Cd: 3.0 },
    'steel_special_concentrically_braced': { R: 6.0, Omega0: 2.0, Cd: 5.0 },
    'steel_ordinary_concentrically_braced': { R: 3.25, Omega0: 2.0, Cd: 3.25 },
    
    // Masonry Systems
    'masonry_special_shear_wall': { R: 5.0, Omega0: 2.5, Cd: 3.5 },
    'masonry_intermediate_shear_wall': { R: 3.5, Omega0: 2.5, Cd: 2.5 },
    'masonry_ordinary_shear_wall': { R: 2.0, Omega0: 2.5, Cd: 1.75 }
  };
  
  const factors = systemFactors[structuralSystem];
  if (!factors) {
    throw new Error(`Unknown structural system: ${structuralSystem}`);
  }
  
  return factors;
};

// DRIFT CALCULATION - SNI 1726:2019 Section 7.9.2
export const calculateStoryDrift = (
  lateralDisplacements: number[], // Displacement at each floor (mm)
  floorHeights: number[],         // Height of each floor (mm)
  deflectionAmplification: number, // Cd factor
  importanceFactor: number        // Ie factor
): Array<{ floor: number; displacement: number; drift: number; driftRatio: number; allowable: number }> => {
  
  if (lateralDisplacements.length !== floorHeights.length) {
    throw new Error('Number of displacements must match number of floor heights');
  }
  
  const driftResults = [];
  let previousDisplacement = 0;
  
  for (let i = 0; i < lateralDisplacements.length; i++) {
    const amplifiedDisplacement = lateralDisplacements[i] * deflectionAmplification / importanceFactor;
    const storyDrift = amplifiedDisplacement - previousDisplacement;
    const storyHeight = i === 0 ? floorHeights[i] : floorHeights[i] - floorHeights[i-1];
    const driftRatio = storyDrift / storyHeight;
    
    // Allowable drift per Table 16 - depends on risk category and occupancy
    const allowableDriftRatio = 0.020; // 2% for most structures (Risk Category I, II, III)
    const allowableDrift = allowableDriftRatio * storyHeight;
    
    driftResults.push({
      floor: i + 1,
      displacement: Math.round(amplifiedDisplacement * 10) / 10,
      drift: Math.round(storyDrift * 10) / 10,
      driftRatio: Math.round(driftRatio * 100000) / 100000,
      allowable: Math.round(allowableDrift * 10) / 10
    });
    
    previousDisplacement = amplifiedDisplacement;
  }
  
  return driftResults;
};

// SIMPLE SEISMIC FORCE CALCULATION FOR SNI SYSTEM
export const calculateSeismicForce = (seismicParams: SeismicParameters, geometry: Geometry, materials: MaterialProperties, loads: Loads) => {
  const { ss = 0, s1 = 0, siteClass = 'SD' } = seismicParams;
  
  if (ss === 0 || s1 === 0) {
    return { V: 0, Cs: 0.01, CsMax: 0.5, CsMin: 0.01 };
  }
  
  // Simple calculation using existing functions
  const sds = ss * 0.67; // Simplified site coefficient
  const sd1 = s1 * 0.67; // Simplified site coefficient
  
  const cs = Math.max(0.044 * sds, 0.01);
  const weight = (geometry.length || 10) * (geometry.width || 10) * (geometry.numberOfFloors || 1) * 12; // kN
  const baseShear = cs * weight;
  
  return {
    V: baseShear,
    Cs: cs,
    CsMax: cs * 1.5,
    CsMin: Math.max(0.044 * sds, 0.01)
  };
};