import { SeismicParameters, SoilData, Geometry, Loads, MaterialProperties } from '../interfaces';

export const calculateSeismicParameters = (seismicParams: SeismicParameters, soilData: SoilData): Partial<SeismicParameters> => {
    // Interpolate Fa (based on Ss) and Fv (based on S1) as per ASCE/SNI style tables
    const { ss, s1 } = seismicParams;

    if (soilData.siteClass === 'SF') {
      return { fa: 0, fv: 0, sds: 0, sd1: 0, t0: 0, ts: 0, tl: 12 };
    }

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
      if (x <= xArr[0]) return yArr[0];
      if (x >= xArr[xArr.length - 1]) return yArr[yArr.length - 1];
      for (let i = 0; i < xArr.length - 1; i++) {
        const x0 = xArr[i];
        const x1 = xArr[i + 1];
        if (x >= x0 && x <= x1) {
          const y0 = yArr[i];
          const y1 = yArr[i + 1];
          const t = (x - x0) / (x1 - x0);
          return y0 + t * (y1 - y0);
        }
      }
      return yArr[yArr.length - 1];
    };

    const fa = lerp(ss, ssGrid, FaTable[soilData.siteClass]);
    const fv = lerp(s1, s1Grid, FvTable[soilData.siteClass]);

    const sms = fa * ss;
    const sm1 = fv * s1;
    const sds = (2/3) * sms;
    const sd1 = (2/3) * sm1;
    
    const t0 = 0.2 * sd1 / sds;
    const ts = sd1 / sds;
    const tl = 12; // Long period transition for Indonesia

    return { fa, fv, sds, sd1, t0, ts, tl };
};

export const generateResponseSpectrum = (seismicParams: SeismicParameters) => {
    const { sds, sd1, t0, ts, tl } = seismicParams;
    const data = [];
    
    for (let T = 0; T <= 4; T += 0.05) {
      let Sa;
      if (T <= t0) {
        Sa = sds * (0.4 + 0.6 * T / t0);
      } else if (T <= ts) {
        Sa = sds;
      } else if (T <= tl) {
        Sa = sd1 / T;
      } else {
        Sa = sd1 * tl / (T * T);
      }
      data.push({ period: T, acceleration: Sa });
    }
    return data;
};

export const calculateBuildingPeriod = (geometry: Geometry, materials: MaterialProperties, seismicParams: SeismicParameters) => {
    const hn = geometry.heightPerFloor * geometry.numberOfFloors;
    const Ct = materials.fc >= 25 ? 0.0466 : 0.0488; // For RC moment frame
    const x = 0.9;
    const Ta = Ct * Math.pow(hn, x);
    const Cu = seismicParams.sd1 >= 0.4 ? 1.4 : seismicParams.sd1 >= 0.3 ? 1.5 : seismicParams.sd1 >= 0.2 ? 1.6 : 1.7;
    const Tmax = Cu * Ta;
    return { Ta, Tmax };
};

export const calculateBaseShear = (seismicParams: SeismicParameters, geometry: Geometry, loads: Loads, Ta: number) => {
    const { sds, sd1, r, importance, tl } = seismicParams;
    const floorArea = geometry.length * geometry.width;
    const gf = 9.81 / 1000; // kN per kg
    const deadLoad = (loads.deadLoad + loads.partitionLoad) * gf; // kN/m²
    const liveLoad = loads.liveLoad * gf; // kN/m²
    const seismicWeight = floorArea * geometry.numberOfFloors * (deadLoad + 0.25 * liveLoad); // kN
    
    let Cs = sds / (r / importance);
    const CsMax = Ta <= tl ? sd1 / (Ta * r / importance) : sd1 * tl / (Ta * Ta * r / importance);
    Cs = Math.min(Cs, CsMax);
    const CsMin = Math.max(0.044 * sds * importance, 0.01);
    Cs = Math.max(Cs, CsMin);
    
    const V = Cs * seismicWeight;
    return { V, Cs, seismicWeight };
};

export const distributeLateralForces = (V: number, Ta: number, geometry: Geometry, loads: Loads) => {
    const k = Ta <= 0.5 ? 1 : Ta >= 2.5 ? 2 : 1 + (Ta - 0.5) / 2;
    const forces = [];
    let sumWiHik = 0;
    
    for (let i = 1; i <= geometry.numberOfFloors; i++) {
      const hi = i * geometry.heightPerFloor;
      const gf = 9.81 / 1000; // kN per kg
      const wi = geometry.length * geometry.width * (loads.deadLoad + loads.partitionLoad) * gf; // kN
      sumWiHik += wi * Math.pow(hi, k);
    }
    
    for (let i = 1; i <= geometry.numberOfFloors; i++) {
      const hi = i * geometry.heightPerFloor;
      const gf = 9.81 / 1000; // kN per kg
      const wi = geometry.length * geometry.width * (loads.deadLoad + loads.partitionLoad) * gf; // kN
      const Cvx = (wi * Math.pow(hi, k)) / sumWiHik;
      const Fx = Cvx * V;
      forces.push({ floor: i, height: hi, weight: wi, force: Fx });
    }
    
    return forces;
};
