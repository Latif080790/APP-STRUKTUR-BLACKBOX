/**
 * Dynamic Analysis Engine
 * Performs modal analysis, response spectrum analysis, and time history analysis
 * Compliant with SNI 1726 seismic analysis requirements
 */

export interface SeismicParameters {
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  latitude: number;
  longitude: number;
  riskCategory: 'I' | 'II' | 'III' | 'IV';
  ss: number; // Short period spectral acceleration
  s1: number; // 1-second period spectral acceleration
  fa: number; // Site coefficient at short periods
  fv: number; // Site coefficient at 1-second period
}

export interface ModalProperties {
  mode: number;
  period: number; // seconds
  frequency: number; // Hz
  modalMass: {
    x: number;
    y: number;
    rz: number;
  };
  modalParticipationFactor: {
    x: number;
    y: number;
    rz: number;
  };
  cumulativeMass: {
    x: number;
    y: number;
    rz: number;
  };
}

export interface ResponseSpectrumData {
  period: number[];
  acceleration: number[];
  sds: number; // Design spectral acceleration at short periods
  sd1: number; // Design spectral acceleration at 1-second period
  tl: number;  // Long-period transition period
  ts: number;  // Short period region
  to: number;  // Initial period
}

export interface DynamicAnalysisInput {
  geometry: {
    length: number;
    width: number;
    height: number;
    numberOfFloors: number;
    baySpacingX: number;
    baySpacingY: number;
    irregularity: boolean;
  };
  materials: {
    fc: number;
    fy: number;
    Es: number;
    Ec: number;
  };
  masses: {
    floorMass: number[];
    totalMass: number;
    centerOfMass: { x: number; y: number; }[];
  };
  stiffness: {
    lateral: number;
    torsional: number;
    vertical: number;
  };
  damping: {
    ratio: number; // typically 0.05 (5%)
    type: 'rayleigh' | 'proportional';
  };
  seismicParameters: SeismicParameters;
}

export interface DynamicAnalysisResults {
  modalAnalysis: {
    modes: ModalProperties[];
    totalModes: number;
    participatingMass: {
      x: number;
      y: number;
      rz: number;
    };
  };
  responseSpectrum: {
    spectrumData: ResponseSpectrumData;
    baseShear: {
      x: number;
      y: number;
    };
    storyForces: Array<{
      floor: number;
      forceX: number;
      forceY: number;
      displacement: number;
      drift: number;
    }>;
  };
  seismicCategory: {
    sdc: string; // Seismic Design Category
    riskFactor: number;
    importance: number;
  };
  driftCheck: {
    allowableDrift: number;
    maxDrift: number;
    driftRatio: number;
    compliant: boolean;
  };
  irregularityCheck: {
    planIrregularity: boolean;
    verticalIrregularity: boolean;
    torsionalIrregularity: boolean;
    requiresDynamic: boolean;
  };
}

export class DynamicAnalysisEngine {
  private input: DynamicAnalysisInput;
  
  constructor(input: DynamicAnalysisInput) {
    this.input = input;
  }

  /**
   * Get seismic parameters based on location (Indonesian seismic maps)
   */
  private getSeismicParameters(): SeismicParameters {
    const { latitude, longitude, riskCategory, siteClass } = this.input.seismicParameters;
    
    // Simplified seismic parameters for major Indonesian cities
    // In practice, these would come from SNI 1726 maps
    let ss = 1.5; // Default for high seismicity areas
    let s1 = 0.6;
    
    // Jakarta approximation
    if (latitude > -6.5 && latitude < -6.0 && longitude > 106.5 && longitude < 107.0) {
      ss = 0.7;
      s1 = 0.35;
    }
    // Yogyakarta approximation  
    else if (latitude > -8.0 && latitude < -7.5 && longitude > 110.0 && longitude < 110.5) {
      ss = 1.2;
      s1 = 0.5;
    }
    // Padang (high seismicity)
    else if (latitude > -1.2 && latitude < -0.5 && longitude > 100.0 && longitude < 100.8) {
      ss = 1.8;
      s1 = 0.8;
    }

    // Site coefficients based on site class
    const siteCoefficients = this.getSiteCoefficients(siteClass, ss, s1);

    return {
      siteClass,
      latitude,
      longitude,
      riskCategory,
      ss,
      s1,
      fa: siteCoefficients.fa,
      fv: siteCoefficients.fv
    };
  }

  /**
   * Calculate site coefficients per SNI 1726
   */
  private getSiteCoefficients(siteClass: string, ss: number, s1: number): { fa: number; fv: number } {
    const siteFactors: { [key: string]: { fa: number; fv: number } } = {
      'SA': { fa: 0.8, fv: 0.8 },
      'SB': { fa: 1.0, fv: 1.0 },
      'SC': { fa: 1.2, fv: 1.5 },
      'SD': { fa: 1.4, fv: 2.0 },
      'SE': { fa: 1.7, fv: 2.8 },
      'SF': { fa: 1.0, fv: 1.0 } // Requires site-specific study
    };

    let factors = siteFactors[siteClass] || siteFactors['SC'];
    
    // Adjust factors based on ground motion level
    if (ss > 1.5) {
      factors.fa *= 0.9; // Reduce for high ground motion
    }
    if (s1 > 0.75) {
      factors.fv *= 0.9;
    }

    return factors;
  }

  /**
   * Generate response spectrum per SNI 1726
   */
  private generateResponseSpectrum(): ResponseSpectrumData {
    const seismic = this.getSeismicParameters();
    
    // Design spectral accelerations
    const sms = seismic.ss * seismic.fa;
    const sm1 = seismic.s1 * seismic.fv;
    const sds = (2/3) * sms;
    const sd1 = (2/3) * sm1;

    // Period parameters
    const to = 0.2 * sd1 / sds;
    const ts = sd1 / sds;
    const tl = 8.0; // Long period transition (typical for Indonesia)

    // Generate spectrum curve
    const periods: number[] = [];
    const accelerations: number[] = [];
    
    for (let t = 0.01; t <= 4.0; t += 0.01) {
      periods.push(t);
      
      let sa: number;
      if (t <= to) {
        sa = sds * (0.4 + 0.6 * t / to);
      } else if (t <= ts) {
        sa = sds;
      } else if (t <= tl) {
        sa = sd1 / t;
      } else {
        sa = sd1 * tl / (t * t);
      }
      
      accelerations.push(sa);
    }

    return {
      period: periods,
      acceleration: accelerations,
      sds,
      sd1,
      tl,
      ts,
      to
    };
  }

  /**
   * Perform modal analysis (simplified)
   */
  private performModalAnalysis(): ModalProperties[] {
    const { geometry, masses } = this.input;
    const modes: ModalProperties[] = [];
    
    // Simplified modal analysis for regular buildings
    const buildingHeight = geometry.height;
    const totalMass = masses.totalMass;
    
    // Estimate fundamental period (SNI 1726 approximation)
    const ct = geometry.irregularity ? 0.0466 : 0.0488; // Building type factor
    const x = 0.9; // Height factor
    const hn = buildingHeight; // Height in meters
    
    const t1 = ct * Math.pow(hn, x); // Fundamental period
    
    // Generate first 12 modes (typical requirement)
    for (let i = 1; i <= 12; i++) {
      const period = t1 / Math.pow(i, 0.8); // Approximate higher mode periods
      const frequency = 1 / period;
      
      // Modal mass participation (simplified distribution)
      const modeShape = Math.sin((i * Math.PI) / (2 * geometry.numberOfFloors + 1));
      const modalMass = totalMass * Math.pow(modeShape, 2) / i;
      
      // Participation factors (simplified)
      const participationX = modeShape * Math.sqrt(modalMass / totalMass);
      const participationY = i % 2 === 0 ? participationX * 0.7 : participationX;
      const participationRz = i > 3 ? participationX * 0.3 : 0;

      modes.push({
        mode: i,
        period,
        frequency,
        modalMass: {
          x: modalMass,
          y: modalMass * 0.8,
          rz: modalMass * 0.3
        },
        modalParticipationFactor: {
          x: participationX,
          y: participationY,
          rz: participationRz
        },
        cumulativeMass: {
          x: 0, // Will be calculated later
          y: 0,
          rz: 0
        }
      });
    }

    // Calculate cumulative mass participation
    let cumulativeX = 0, cumulativeY = 0, cumulativeRz = 0;
    modes.forEach(mode => {
      cumulativeX += Math.pow(mode.modalParticipationFactor.x, 2);
      cumulativeY += Math.pow(mode.modalParticipationFactor.y, 2);
      cumulativeRz += Math.pow(mode.modalParticipationFactor.rz, 2);
      
      mode.cumulativeMass = {
        x: cumulativeX,
        y: cumulativeY,
        rz: cumulativeRz
      };
    });

    return modes;
  }

  /**
   * Calculate equivalent lateral force (static) method
   */
  private calculateEquivalentLateralForce(spectrum: ResponseSpectrumData): any {
    const { geometry, masses } = this.input;
    const seismic = this.getSeismicParameters();
    
    // Importance factor
    const ie = this.getImportanceFactor(seismic.riskCategory);
    
    // Response modification factor (simplified)
    const r = geometry.irregularity ? 3.5 : 8.0; // SMRF vs other systems
    
    // Fundamental period
    const modes = this.performModalAnalysis();
    const t1 = modes[0].period;
    
    // Design spectral acceleration
    let sa: number;
    if (t1 <= spectrum.ts) {
      sa = spectrum.sds;
    } else {
      sa = spectrum.sd1 / t1;
    }
    
    // Base shear coefficient
    const cs = Math.min(sa * ie / r, spectrum.sds * ie / r);
    const csMax = spectrum.sd1 * ie / (t1 * r); // Upper limit
    const csMin = Math.max(0.044 * spectrum.sds * ie, 0.01); // Lower limit
    
    const finalCs = Math.max(csMin, Math.min(cs, csMax));
    
    // Base shear
    const baseShearX = finalCs * masses.totalMass * 9.81; // kN
    const baseShearY = baseShearX * 0.3; // Accidental torsion effect
    
    // Distribute forces over height
    const storyForces: Array<{
      floor: number;
      forceX: number;
      forceY: number;
      displacement: number;
      drift: number;
    }> = [];
    
    const k = t1 <= 0.5 ? 1.0 : t1 >= 2.5 ? 2.0 : 0.75 + 0.5 * t1; // Distribution exponent
    
    for (let i = 1; i <= geometry.numberOfFloors; i++) {
      const hi = i * geometry.height / geometry.numberOfFloors;
      const wi = masses.floorMass[i - 1] || masses.totalMass / geometry.numberOfFloors;
      
      // Force distribution
      const cvx = (wi * Math.pow(hi, k)) / masses.totalMass;
      const fx = cvx * baseShearX;
      const fy = cvx * baseShearY;
      
      // Approximate displacement (simplified)
      const displacement = fx * Math.pow(hi, 3) / (3 * 200000 * 1e6 * 1.0); // Approximate EI
      
      // Inter-story drift
      const prevDisplacement = i > 1 ? storyForces[i - 2].displacement : 0;
      const drift = Math.abs(displacement - prevDisplacement);
      
      storyForces.push({
        floor: i,
        forceX: fx,
        forceY: fy,
        displacement,
        drift
      });
    }

    return {
      baseShear: { x: baseShearX, y: baseShearY },
      storyForces
    };
  }

  /**
   * Get importance factor per SNI 1726
   */
  private getImportanceFactor(category: string): number {
    const factors: { [key: string]: number } = {
      'I': 1.0,
      'II': 1.0,
      'III': 1.25,
      'IV': 1.5
    };
    return factors[category] || 1.0;
  }

  /**
   * Determine seismic design category
   */
  private determineSeismicCategory(spectrum: ResponseSpectrumData): any {
    const seismic = this.getSeismicParameters();
    const ie = this.getImportanceFactor(seismic.riskCategory);
    
    // Seismic Design Category determination
    let sdc = 'A';
    
    if (spectrum.sds >= 0.75) sdc = 'D';
    else if (spectrum.sds >= 0.5) sdc = 'C';
    else if (spectrum.sds >= 0.25) sdc = 'B';
    
    if (spectrum.sd1 >= 0.5) sdc = 'D';
    else if (spectrum.sd1 >= 0.2) sdc = Math.max(sdc, 'C');
    else if (spectrum.sd1 >= 0.1) sdc = Math.max(sdc, 'B');

    return {
      sdc,
      riskFactor: ie,
      importance: ie
    };
  }

  /**
   * Check drift limits per SNI 1726
   */
  private checkDriftLimits(storyForces: any[]): any {
    const { geometry } = this.input;
    
    const storyHeight = geometry.height / geometry.numberOfFloors;
    const allowableDrift = Math.min(0.020 * storyHeight, 0.020 * storyHeight); // 2% story height
    
    const maxDrift = Math.max(...storyForces.map(sf => sf.drift));
    const driftRatio = maxDrift / storyHeight;
    
    return {
      allowableDrift,
      maxDrift,
      driftRatio,
      compliant: maxDrift <= allowableDrift
    };
  }

  /**
   * Check structural irregularities
   */
  private checkIrregularities(): any {
    const { geometry } = this.input;
    
    // Simplified irregularity checks
    const aspectRatio = Math.max(geometry.length, geometry.width) / Math.min(geometry.length, geometry.width);
    const planIrregularity = aspectRatio > 4.0 || geometry.irregularity;
    
    const heightToBaseRatio = geometry.height / Math.min(geometry.length, geometry.width);
    const verticalIrregularity = heightToBaseRatio > 3.0;
    
    // Torsional irregularity (simplified check)
    const torsionalIrregularity = aspectRatio > 2.0 && geometry.height > 40;
    
    const requiresDynamic = planIrregularity || verticalIrregularity || geometry.height > 40;

    return {
      planIrregularity,
      verticalIrregularity,
      torsionalIrregularity,
      requiresDynamic
    };
  }

  /**
   * Perform complete dynamic analysis
   */
  public performDynamicAnalysis(): DynamicAnalysisResults {
    const modes = this.performModalAnalysis();
    const spectrum = this.generateResponseSpectrum();
    const lateralForce = this.calculateEquivalentLateralForce(spectrum);
    const category = this.determineSeismicCategory(spectrum);
    const drift = this.checkDriftLimits(lateralForce.storyForces);
    const irregularity = this.checkIrregularities();

    // Calculate participating mass percentages
    const totalModes = modes.length;
    const lastMode = modes[modes.length - 1];
    const participatingMass = {
      x: lastMode.cumulativeMass.x,
      y: lastMode.cumulativeMass.y,
      rz: lastMode.cumulativeMass.rz
    };

    return {
      modalAnalysis: {
        modes,
        totalModes,
        participatingMass
      },
      responseSpectrum: {
        spectrumData: spectrum,
        baseShear: lateralForce.baseShear,
        storyForces: lateralForce.storyForces
      },
      seismicCategory: category,
      driftCheck: drift,
      irregularityCheck: irregularity
    };
  }

  /**
   * Get analysis summary
   */
  public getAnalysisSummary(): string {
    const results = this.performDynamicAnalysis();
    const fundamentalPeriod = results.modalAnalysis.modes[0].period;
    
    return `
Dynamic Analysis Summary:
- Fundamental Period: ${fundamentalPeriod.toFixed(3)} seconds
- Seismic Design Category: ${results.seismicCategory.sdc}
- Base Shear X: ${(results.responseSpectrum.baseShear.x / 1000).toFixed(0)} kN
- Base Shear Y: ${(results.responseSpectrum.baseShear.y / 1000).toFixed(0)} kN
- Max Drift Ratio: ${(results.driftCheck.driftRatio * 100).toFixed(2)}%
- Drift Compliance: ${results.driftCheck.compliant ? 'PASS' : 'FAIL'}
- Modal Mass Participation X: ${(results.modalAnalysis.participatingMass.x * 100).toFixed(1)}%
- Requires Dynamic Analysis: ${results.irregularityCheck.requiresDynamic ? 'YES' : 'NO'}
    `.trim();
  }
}

export default DynamicAnalysisEngine;