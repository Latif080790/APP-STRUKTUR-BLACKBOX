import { SeismicParameters, SoilData, Geometry, Loads, MaterialProperties } from '../interfaces';

// Error handling interfaces
interface SafeSeismicResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}

// Validation utilities
const isValidNumber = (value: any): value is number => 
  typeof value === 'number' && !isNaN(value) && isFinite(value);

const isPositiveNumber = (value: any): value is number =>
  isValidNumber(value) && value > 0;

const validateSeismicParameters = (params: SeismicParameters): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isValidNumber(params.ss) || params.ss < 0) errors.push('Ss must be a valid non-negative number');
  if (!isValidNumber(params.s1) || params.s1 < 0) errors.push('S1 must be a valid non-negative number');
  
  if (params.ss > 2.0) errors.push('Ss value seems unusually high (>2.0)');
  if (params.s1 > 1.0) errors.push('S1 value seems unusually high (>1.0)');
  
  if (params.r !== undefined) {
    if (!isPositiveNumber(params.r)) errors.push('Response modification factor (R) must be positive');
    if (params.r > 12) errors.push('R value seems unusually high (>12)');
  }
  
  if (params.importance !== undefined) {
    if (!isPositiveNumber(params.importance)) errors.push('Importance factor must be positive');
    if (params.importance > 1.5) errors.push('Importance factor seems unusually high (>1.5)');
  }
  
  return { valid: errors.length === 0, errors };
};

const validateSoilData = (soilData: SoilData): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const validSiteClasses = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF'];
  
  if (!validSiteClasses.includes(soilData.siteClass)) {
    errors.push(`Invalid site class: ${soilData.siteClass}. Must be one of: ${validSiteClasses.join(', ')}`);
  }
  
  return { valid: errors.length === 0, errors };
};

export const calculateSeismicParameters = (
  seismicParams: SeismicParameters, 
  soilData: SoilData
): SafeSeismicResult<Partial<SeismicParameters>> => {
  try {
    // Input validation
    const paramValidation = validateSeismicParameters(seismicParams);
    if (!paramValidation.valid) {
      return {
        success: false,
        error: `Invalid seismic parameters: ${paramValidation.errors.join(', ')}`
      };
    }

    const soilValidation = validateSoilData(soilData);
    if (!soilValidation.valid) {
      return {
        success: false,
        error: `Invalid soil data: ${soilValidation.errors.join(', ')}`
      };
    }

    const { ss, s1 } = seismicParams;
    const warnings: string[] = [];

    // Handle SF site class (requires site-specific analysis)
    if (soilData.siteClass === 'SF') {
      warnings.push('Site class SF requires site-specific seismic analysis');
      return {
        success: true,
        data: { fa: 0, fv: 0, sds: 0, sd1: 0, t0: 0, ts: 0, tl: 12 },
        warnings
      };
    }

    // Interpolation grids with bounds checking
    const ssGrid = [0.25, 0.5, 0.75, 1.0, 1.25];
    const s1Grid = [0.1, 0.2, 0.3, 0.4, 0.5];

    const FaTable: Record<SoilData['siteClass'], number[]> = {
      SA: [0.8, 0.8, 0.8, 0.8, 0.8],
      SB: [0.9, 0.9, 0.9, 0.9, 0.9],
      SC: [1.2, 1.2, 1.1, 1.0, 1.0],
      SD: [1.6, 1.4, 1.2, 1.1, 1.0],
      SE: [2.5, 1.7, 1.2, 0.9, 0.8],
      SF: [0, 0, 0, 0, 0],
    };

    const FvTable: Record<SoilData['siteClass'], number[]> = {
      SA: [0.8, 0.8, 0.8, 0.8, 0.8],
      SB: [0.9, 0.9, 0.9, 0.9, 0.9],
      SC: [1.7, 1.6, 1.5, 1.4, 1.3],
      SD: [2.4, 2.2, 2.0, 1.9, 1.8],
      SE: [3.5, 3.2, 2.8, 2.4, 2.4],
      SF: [0, 0, 0, 0, 0],
    };

    const lerp = (x: number, xArr: number[], yArr: number[]) => {
      try {
        if (!isValidNumber(x)) return yArr[0];
        if (x <= xArr[0]) return yArr[0];
        if (x >= xArr[xArr.length - 1]) {
          if (x > xArr[xArr.length - 1] * 1.5) {
            warnings.push(`Input value ${x} is significantly outside interpolation range`);
          }
          return yArr[yArr.length - 1];
        }
        
        for (let i = 0; i < xArr.length - 1; i++) {
          const x0 = xArr[i];
          const x1 = xArr[i + 1];
          if (x >= x0 && x <= x1) {
            const y0 = yArr[i];
            const y1 = yArr[i + 1];
            const t = (x - x0) / (x1 - x0);
            const result = y0 + t * (y1 - y0);
            
            if (!isValidNumber(result)) {
              warnings.push('Interpolation resulted in invalid value, using fallback');
              return yArr[i];
            }
            
            return result;
          }
        }
        return yArr[yArr.length - 1];
      } catch (error) {
        warnings.push(`Interpolation error: ${error}`);
        return yArr[0];
      }
    };

    const fa = lerp(ss, ssGrid, FaTable[soilData.siteClass]);
    const fv = lerp(s1, s1Grid, FvTable[soilData.siteClass]);

    if (!isValidNumber(fa) || !isValidNumber(fv)) {
      return {
        success: false,
        error: 'Failed to calculate site coefficients'
      };
    }

    // Calculate design parameters with validation
    const sms = fa * ss;
    const sm1 = fv * s1;
    
    if (!isValidNumber(sms) || !isValidNumber(sm1)) {
      return {
        success: false,
        error: 'Failed to calculate modified seismic parameters'
      };
    }

    const sds = (2/3) * sms;
    const sd1 = (2/3) * sm1;
    
    if (!isValidNumber(sds) || !isValidNumber(sd1)) {
      return {
        success: false,
        error: 'Failed to calculate design seismic parameters'
      };
    }

    // Prevent division by zero
    if (sds <= 0) {
      return {
        success: false,
        error: 'SDS must be greater than zero'
      };
    }

    const t0 = 0.2 * sd1 / sds;
    const ts = sd1 / sds;
    const tl = 12; // Long period transition for Indonesia

    // Validate calculated periods
    if (!isValidNumber(t0) || !isValidNumber(ts) || t0 < 0 || ts < 0) {
      return {
        success: false,
        error: 'Failed to calculate valid transition periods'
      };
    }

    if (ts < t0) {
      warnings.push('Calculated Ts is less than T0, check input parameters');
    }

    const result = { fa, fv, sds, sd1, t0, ts, tl };
    
    return {
      success: true,
      data: result,
      ...(warnings.length > 0 && { warnings })
    };

  } catch (error) {
    return {
      success: false,
      error: `Seismic parameter calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const generateResponseSpectrum = (
  seismicParams: SeismicParameters
): SafeSeismicResult<Array<{ period: number; acceleration: number }>> => {
  try {
    const { sds, sd1, t0, ts, tl } = seismicParams;
    
    // Input validation
    if (!isValidNumber(sds) || !isValidNumber(sd1) || !isValidNumber(t0) || !isValidNumber(ts) || !isValidNumber(tl)) {
      return {
        success: false,
        error: 'Invalid seismic parameters for response spectrum generation'
      };
    }

    if (sds <= 0 || sd1 <= 0) {
      return {
        success: false,
        error: 'SDS and SD1 must be positive values'
      };
    }

    const data = [];
    const warnings: string[] = [];
    
    for (let T = 0; T <= 4; T += 0.05) {
      try {
        let Sa;
        
        if (T <= t0) {
          Sa = sds * (0.4 + 0.6 * T / t0);
        } else if (T <= ts) {
          Sa = sds;
        } else if (T <= tl) {
          if (T <= 0) {
            warnings.push('Zero period detected in response spectrum calculation');
            Sa = sds;
          } else {
            Sa = sd1 / T;
          }
        } else {
          if (T <= 0) {
            warnings.push('Zero period detected in long-period range');
            Sa = 0;
          } else {
            Sa = sd1 * tl / (T * T);
          }
        }

        // Validate calculated acceleration
        if (!isValidNumber(Sa) || Sa < 0) {
          warnings.push(`Invalid acceleration calculated at period ${T}`);
          Sa = 0;
        }

        // Cap unreasonably high accelerations
        if (Sa > 10 * sds) {
          warnings.push(`Unusually high acceleration capped at period ${T}`);
          Sa = 10 * sds;
        }

        data.push({ period: T, acceleration: Sa });
      } catch (pointError) {
        warnings.push(`Error calculating response at period ${T}: ${pointError}`);
        data.push({ period: T, acceleration: 0 });
      }
    }

    if (data.length === 0) {
      return {
        success: false,
        error: 'Failed to generate any response spectrum points'
      };
    }

    return {
      success: true,
      data,
      ...(warnings.length > 0 && { warnings })
    };

  } catch (error) {
    return {
      success: false,
      error: `Response spectrum generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const calculateBuildingPeriod = (
  geometry: Geometry, 
  materials: MaterialProperties, 
  seismicParams: SeismicParameters
): SafeSeismicResult<{ Ta: number; Tmax: number }> => {
  try {
    // Input validation
    if (!isValidNumber(geometry.heightPerFloor) || !isPositiveNumber(geometry.heightPerFloor)) {
      return {
        success: false,
        error: 'Invalid floor height'
      };
    }

    if (!isValidNumber(geometry.numberOfFloors) || !isPositiveNumber(geometry.numberOfFloors)) {
      return {
        success: false,
        error: 'Invalid number of floors'
      };
    }

    if (!isValidNumber(materials.fc) || !isPositiveNumber(materials.fc)) {
      return {
        success: false,
        error: 'Invalid concrete strength'
      };
    }

    if (!isValidNumber(seismicParams.sd1) || seismicParams.sd1 < 0) {
      return {
        success: false,
        error: 'Invalid SD1 parameter'
      };
    }

    const warnings: string[] = [];
    const hn = geometry.heightPerFloor * geometry.numberOfFloors;

    if (hn <= 0) {
      return {
        success: false,
        error: 'Total building height must be positive'
      };
    }

    if (hn > 200) {
      warnings.push('Building height exceeds typical high-rise limits (>200m)');
    }

    // Calculate approximate period with bounds checking
    const Ct = materials.fc >= 25 ? 0.0466 : 0.0488; // For RC moment frame
    const x = 0.9;
    const Ta = Ct * Math.pow(hn, x);

    if (!isValidNumber(Ta) || Ta <= 0) {
      return {
        success: false,
        error: 'Failed to calculate approximate period'
      };
    }

    // Calculate upper limit factor
    let Cu: number;
    if (seismicParams.sd1 >= 0.4) {
      Cu = 1.4;
    } else if (seismicParams.sd1 >= 0.3) {
      Cu = 1.5;
    } else if (seismicParams.sd1 >= 0.2) {
      Cu = 1.6;
    } else {
      Cu = 1.7;
    }

    const Tmax = Cu * Ta;

    if (!isValidNumber(Tmax) || Tmax <= Ta) {
      return {
        success: false,
        error: 'Failed to calculate maximum period'
      };
    }

    return {
      success: true,
      data: { Ta, Tmax },
      ...(warnings.length > 0 && { warnings })
    };

  } catch (error) {
    return {
      success: false,
      error: `Building period calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const calculateBaseShear = (
  seismicParams: SeismicParameters, 
  geometry: Geometry, 
  loads: Loads, 
  Ta: number
): SafeSeismicResult<{ V: number; Cs: number; seismicWeight: number }> => {
  try {
    // Input validation
    if (!isValidNumber(Ta) || Ta <= 0) {
      return {
        success: false,
        error: 'Invalid fundamental period'
      };
    }

    const requiredParams = { 
      sds: seismicParams.sds, 
      sd1: seismicParams.sd1, 
      r: seismicParams.r, 
      importance: seismicParams.importance, 
      tl: seismicParams.tl 
    };
    
    for (const [paramName, paramValue] of Object.entries(requiredParams)) {
      if (!isValidNumber(paramValue) || paramValue <= 0) {
        return {
          success: false,
          error: `Invalid seismic parameter: ${paramName} = ${paramValue}`
        };
      }
    }

    if (!isValidNumber(geometry.length) || !isPositiveNumber(geometry.length)) {
      return {
        success: false,
        error: 'Invalid building length'
      };
    }

    if (!isValidNumber(geometry.width) || !isPositiveNumber(geometry.width)) {
      return {
        success: false,
        error: 'Invalid building width'
      };
    }

    if (!isValidNumber(geometry.numberOfFloors) || !isPositiveNumber(geometry.numberOfFloors)) {
      return {
        success: false,
        error: 'Invalid number of floors'
      };
    }

    const warnings: string[] = [];
    const { sds, sd1, r, importance, tl } = seismicParams;

    // Validate load parameters
    if (!isValidNumber(loads.deadLoad) || loads.deadLoad < 0) {
      return {
        success: false,
        error: 'Invalid dead load'
      };
    }

    if (!isValidNumber(loads.liveLoad) || loads.liveLoad < 0) {
      return {
        success: false,
        error: 'Invalid live load'
      };
    }

    const partitionLoad = loads.partitionLoad || 0;
    if (!isValidNumber(partitionLoad) || partitionLoad < 0) {
      warnings.push('Invalid partition load, using 0');
    }

    // Calculate seismic weight with bounds checking
    const floorArea = geometry.length * geometry.width;
    if (floorArea <= 0 || floorArea > 100000) { // Cap at 100,000 m²
      return {
        success: false,
        error: floorArea <= 0 ? 'Invalid floor area' : 'Floor area exceeds reasonable limits'
      };
    }

    const gf = 9.81 / 1000; // kN per kg
    const deadLoadKN = (loads.deadLoad + partitionLoad) * gf; // kN/m²
    const liveLoadKN = loads.liveLoad * gf; // kN/m²
    
    const seismicWeight = floorArea * geometry.numberOfFloors * (deadLoadKN + 0.25 * liveLoadKN); // kN

    if (!isValidNumber(seismicWeight) || seismicWeight <= 0) {
      return {
        success: false,
        error: 'Failed to calculate seismic weight'
      };
    }

    if (seismicWeight > 1000000) { // 1 million kN
      warnings.push('Seismic weight is very large, verify input parameters');
    }

    // Calculate seismic response coefficient with bounds checking
    let Cs = sds / (r / importance);
    
    if (!isValidNumber(Cs) || Cs <= 0) {
      return {
        success: false,
        error: 'Failed to calculate initial seismic coefficient'
      };
    }

    // Apply upper limit
    let CsMax: number;
    if (Ta <= tl) {
      CsMax = sd1 / (Ta * r / importance);
    } else {
      if (Ta <= 0) {
        return {
          success: false,
          error: 'Zero period cannot be used in long-period calculation'
        };
      }
      CsMax = sd1 * tl / (Ta * Ta * r / importance);
    }

    if (!isValidNumber(CsMax) || CsMax <= 0) {
      warnings.push('Invalid upper limit coefficient, using uncapped value');
    } else {
      Cs = Math.min(Cs, CsMax);
    }

    // Apply lower limit
    const CsMin = Math.max(0.044 * sds * importance, 0.01);
    if (!isValidNumber(CsMin)) {
      return {
        success: false,
        error: 'Failed to calculate minimum seismic coefficient'
      };
    }

    Cs = Math.max(Cs, CsMin);

    if (!isValidNumber(Cs) || Cs <= 0) {
      return {
        success: false,
        error: 'Final seismic coefficient is invalid'
      };
    }

    if (Cs > 1.0) {
      warnings.push('Seismic coefficient exceeds 1.0, verify calculation');
    }

    // Calculate base shear
    const V = Cs * seismicWeight;

    if (!isValidNumber(V) || V <= 0) {
      return {
        success: false,
        error: 'Failed to calculate base shear'
      };
    }

    return {
      success: true,
      data: { V, Cs, seismicWeight },
      ...(warnings.length > 0 && { warnings })
    };

  } catch (error) {
    return {
      success: false,
      error: `Base shear calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const distributeLateralForces = (
  V: number, 
  Ta: number, 
  geometry: Geometry, 
  loads: Loads
): SafeSeismicResult<Array<{ floor: number; height: number; weight: number; force: number }>> => {
  try {
    // Input validation
    if (!isValidNumber(V) || V <= 0) {
      return {
        success: false,
        error: 'Invalid base shear value'
      };
    }

    if (!isValidNumber(Ta) || Ta <= 0) {
      return {
        success: false,
        error: 'Invalid fundamental period'
      };
    }

    if (!isValidNumber(geometry.numberOfFloors) || !isPositiveNumber(geometry.numberOfFloors)) {
      return {
        success: false,
        error: 'Invalid number of floors'
      };
    }

    if (!isValidNumber(geometry.heightPerFloor) || !isPositiveNumber(geometry.heightPerFloor)) {
      return {
        success: false,
        error: 'Invalid floor height'
      };
    }

    if (!isValidNumber(geometry.length) || !isPositiveNumber(geometry.length)) {
      return {
        success: false,
        error: 'Invalid building length'
      };
    }

    if (!isValidNumber(geometry.width) || !isPositiveNumber(geometry.width)) {
      return {
        success: false,
        error: 'Invalid building width'
      };
    }

    const warnings: string[] = [];

    // Calculate distribution exponent with bounds
    let k: number;
    if (Ta <= 0.5) {
      k = 1;
    } else if (Ta >= 2.5) {
      k = 2;
    } else {
      k = 1 + (Ta - 0.5) / 2;
    }

    if (!isValidNumber(k) || k < 1 || k > 2) {
      return {
        success: false,
        error: 'Failed to calculate distribution exponent'
      };
    }

    // Validate loads
    if (!isValidNumber(loads.deadLoad) || loads.deadLoad < 0) {
      return {
        success: false,
        error: 'Invalid dead load'
      };
    }

    const partitionLoad = loads.partitionLoad || 0;
    if (!isValidNumber(partitionLoad) || partitionLoad < 0) {
      warnings.push('Invalid partition load, using 0');
    }

    const forces = [];
    let sumWiHik = 0;
    
    // First pass: calculate denominator
    for (let i = 1; i <= geometry.numberOfFloors; i++) {
      try {
        const hi = i * geometry.heightPerFloor;
        
        if (!isValidNumber(hi) || hi <= 0) {
          return {
            success: false,
            error: `Invalid height calculation for floor ${i}`
          };
        }

        const gf = 9.81 / 1000; // kN per kg
        const wi = geometry.length * geometry.width * (loads.deadLoad + partitionLoad) * gf; // kN
        
        if (!isValidNumber(wi) || wi <= 0) {
          return {
            success: false,
            error: `Invalid weight calculation for floor ${i}`
          };
        }

        const hik = Math.pow(hi, k);
        if (!isValidNumber(hik) || hik <= 0) {
          return {
            success: false,
            error: `Invalid height power calculation for floor ${i}`
          };
        }

        sumWiHik += wi * hik;
      } catch (floorError) {
        return {
          success: false,
          error: `Error in first pass calculation for floor ${i}: ${floorError}`
        };
      }
    }

    if (!isValidNumber(sumWiHik) || sumWiHik <= 0) {
      return {
        success: false,
        error: 'Invalid sum of weight-height products'
      };
    }

    // Second pass: calculate forces
    let totalForce = 0;
    for (let i = 1; i <= geometry.numberOfFloors; i++) {
      try {
        const hi = i * geometry.heightPerFloor;
        const gf = 9.81 / 1000; // kN per kg
        const wi = geometry.length * geometry.width * (loads.deadLoad + partitionLoad) * gf; // kN
        
        const Cvx = (wi * Math.pow(hi, k)) / sumWiHik;
        
        if (!isValidNumber(Cvx) || Cvx < 0 || Cvx > 1) {
          warnings.push(`Invalid force distribution coefficient for floor ${i}: ${Cvx}`);
          continue;
        }

        const Fx = Cvx * V;
        
        if (!isValidNumber(Fx) || Fx < 0) {
          warnings.push(`Invalid force calculation for floor ${i}`);
          continue;
        }

        forces.push({ floor: i, height: hi, weight: wi, force: Fx });
        totalForce += Fx;
      } catch (forceError) {
        warnings.push(`Error calculating force for floor ${i}: ${forceError}`);
      }
    }

    if (forces.length === 0) {
      return {
        success: false,
        error: 'No valid forces calculated'
      };
    }

    // Check force balance
    const forceDifference = Math.abs(totalForce - V);
    const tolerance = V * 0.01; // 1% tolerance
    
    if (forceDifference > tolerance) {
      warnings.push(`Force balance error: ${forceDifference.toFixed(2)} kN difference`);
    }

    return {
      success: true,
      data: forces,
      ...(warnings.length > 0 && { warnings })
    };

  } catch (error) {
    return {
      success: false,
      error: `Force distribution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
