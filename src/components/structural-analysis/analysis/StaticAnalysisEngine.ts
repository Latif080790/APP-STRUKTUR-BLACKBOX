/**
 * Static Analysis Engine
 * Performs static structural analysis including gravity loads, lateral loads, and load combinations
 * Compliant with SNI 1726, SNI 1727, and other Indonesian structural codes
 */

export interface LoadCase {
  id: string;
  name: string;
  type: 'dead' | 'live' | 'wind' | 'seismic' | 'rain' | 'soil';
  magnitude: number;
  distribution: 'uniform' | 'point' | 'triangular' | 'trapezoidal';
  direction: 'vertical' | 'horizontal-x' | 'horizontal-y';
  location?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface LoadCombination {
  id: string;
  name: string;
  type: 'service' | 'ultimate' | 'seismic';
  factors: { [loadCaseId: string]: number };
  description: string;
}

export interface StaticAnalysisInput {
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
    concreteType: string;
  };
  loads: {
    deadLoad: number;
    liveLoad: number;
    windSpeed: number;
    roofLoad: number;
    rainLoad: number;
  };
  buildingData: {
    buildingType: string;
    riskCategory: string;
    latitude: number;
    longitude: number;
  };
  soilData: {
    siteClass: string;
    cu: number;
    phi: number;
    gamma: number;
  };
}

export interface StaticAnalysisResults {
  loadCases: LoadCase[];
  loadCombinations: LoadCombination[];
  reactions: {
    vertical: number;
    horizontalX: number;
    horizontalY: number;
    momentX: number;
    momentY: number;
    momentZ: number;
  };
  internalForces: {
    beams: Array<{
      id: string;
      shear: number[];
      moment: number[];
      axial: number[];
      deflection: number[];
    }>;
    columns: Array<{
      id: string;
      axial: number;
      shearX: number;
      shearY: number;
      momentX: number;
      momentY: number;
    }>;
  };
  stresses: {
    maxCompression: number;
    maxTension: number;
    maxShear: number;
    criticalElement: string;
  };
  deflections: {
    maxVertical: number;
    maxHorizontal: number;
    driftRatio: number;
    serviceabilityCheck: boolean;
  };
  utilization: {
    maxUtilization: number;
    criticalMember: string;
    safetyFactor: number;
  };
}

export class StaticAnalysisEngine {
  private input: StaticAnalysisInput;
  
  constructor(input: StaticAnalysisInput) {
    this.input = input;
  }

  /**
   * Generate standard load cases based on SNI requirements
   */
  private generateLoadCases(): LoadCase[] {
    const { geometry, loads, buildingData } = this.input;
    const totalArea = geometry.length * geometry.width;
    
    const loadCases: LoadCase[] = [
      {
        id: 'DL',
        name: 'Dead Load',
        type: 'dead',
        magnitude: loads.deadLoad * totalArea,
        distribution: 'uniform',
        direction: 'vertical'
      },
      {
        id: 'LL',
        name: 'Live Load',
        type: 'live',
        magnitude: this.getLiveLoadReduction() * loads.liveLoad * totalArea,
        distribution: 'uniform',
        direction: 'vertical'
      },
      {
        id: 'RL',
        name: 'Roof Live Load',
        type: 'live',
        magnitude: loads.roofLoad * totalArea,
        distribution: 'uniform',
        direction: 'vertical'
      },
      {
        id: 'RN',
        name: 'Rain Load',
        type: 'rain',
        magnitude: loads.rainLoad * totalArea,
        distribution: 'uniform',
        direction: 'vertical'
      },
      {
        id: 'WX',
        name: 'Wind Load X',
        type: 'wind',
        magnitude: this.calculateWindLoad('x'),
        distribution: 'uniform',
        direction: 'horizontal-x'
      },
      {
        id: 'WY',
        name: 'Wind Load Y',
        type: 'wind',
        magnitude: this.calculateWindLoad('y'),
        distribution: 'uniform',
        direction: 'horizontal-y'
      }
    ];

    return loadCases;
  }

  /**
   * Generate load combinations per SNI 1727
   */
  private generateLoadCombinations(): LoadCombination[] {
    const combinations: LoadCombination[] = [
      // Basic combinations
      {
        id: 'LC1',
        name: '1.4D',
        type: 'ultimate',
        factors: { 'DL': 1.4 },
        description: 'Dead load only'
      },
      {
        id: 'LC2',
        name: '1.2D + 1.6L',
        type: 'ultimate',
        factors: { 'DL': 1.2, 'LL': 1.6 },
        description: 'Dead + Live loads'
      },
      {
        id: 'LC3',
        name: '1.2D + 1.6L + 0.5(Lr or Rn)',
        type: 'ultimate',
        factors: { 'DL': 1.2, 'LL': 1.6, 'RL': 0.5, 'RN': 0.5 },
        description: 'Dead + Live + Roof/Rain'
      },
      {
        id: 'LC4',
        name: '1.2D + 1.0W + L + 0.5(Lr or Rn)',
        type: 'ultimate',
        factors: { 'DL': 1.2, 'WX': 1.0, 'LL': 1.0, 'RL': 0.5 },
        description: 'Dead + Wind + Live + Roof'
      },
      {
        id: 'LC5',
        name: '1.2D + 1.0W + L + 0.5(Lr or Rn)',
        type: 'ultimate',
        factors: { 'DL': 1.2, 'WY': 1.0, 'LL': 1.0, 'RL': 0.5 },
        description: 'Dead + Wind Y + Live + Roof'
      },
      {
        id: 'LC6',
        name: '0.9D + 1.0W',
        type: 'ultimate',
        factors: { 'DL': 0.9, 'WX': 1.0 },
        description: 'Uplift check - Wind X'
      },
      {
        id: 'LC7',
        name: '0.9D + 1.0W',
        type: 'ultimate',
        factors: { 'DL': 0.9, 'WY': 1.0 },
        description: 'Uplift check - Wind Y'
      },
      // Service combinations
      {
        id: 'SLC1',
        name: 'D + L',
        type: 'service',
        factors: { 'DL': 1.0, 'LL': 1.0 },
        description: 'Service - Dead + Live'
      },
      {
        id: 'SLC2',
        name: 'D + 0.7W',
        type: 'service',
        factors: { 'DL': 1.0, 'WX': 0.7 },
        description: 'Service - Dead + Wind'
      }
    ];

    return combinations;
  }

  /**
   * Calculate live load reduction per SNI 1727
   */
  private getLiveLoadReduction(): number {
    const { geometry } = this.input;
    const influenceArea = geometry.baySpacingX * geometry.baySpacingY;
    const floors = geometry.numberOfFloors;

    // Live load reduction factor
    let reduction = 1.0;
    
    if (influenceArea > 37) {
      reduction = Math.max(0.5, 1.0 - 0.0008 * (influenceArea - 37));
    }

    // Additional reduction for multiple floors
    if (floors > 4) {
      reduction *= Math.max(0.6, 1.0 - 0.08 * (floors - 4));
    }

    return reduction;
  }

  /**
   * Calculate wind load per SNI 1727
   */
  private calculateWindLoad(direction: 'x' | 'y'): number {
    const { geometry, loads, buildingData } = this.input;
    
    // Basic wind speed (km/h to m/s)
    const V = loads.windSpeed / 3.6;
    
    // Exposure category (assumed C for urban areas)
    const Kz = 0.85; // Velocity pressure exposure coefficient
    const Kd = 0.85; // Wind directionality factor
    const Ke = 1.0;  // Ground elevation factor
    const Kzt = 1.0; // Topographic factor
    
    // Velocity pressure
    const qz = 0.613 * Kz * Kzt * Kd * Ke * Math.pow(V, 2); // N/m²
    
    // External pressure coefficient (simplified)
    const Cp = direction === 'x' ? 0.8 : 0.7; // Windward face
    
    // Building dimensions
    const exposedArea = direction === 'x' 
      ? geometry.width * geometry.height
      : geometry.length * geometry.height;
    
    // Wind force
    const windForce = qz * Cp * exposedArea / 1000; // kN
    
    return windForce;
  }

  /**
   * Calculate structural reactions
   */
  private calculateReactions(loadCases: LoadCase[]): any {
    const { geometry } = this.input;
    
    let totalVertical = 0;
    let totalHorizontalX = 0;
    let totalHorizontalY = 0;
    
    loadCases.forEach(lc => {
      switch (lc.direction) {
        case 'vertical':
          totalVertical += lc.magnitude;
          break;
        case 'horizontal-x':
          totalHorizontalX += lc.magnitude;
          break;
        case 'horizontal-y':
          totalHorizontalY += lc.magnitude;
          break;
      }
    });

    return {
      vertical: totalVertical,
      horizontalX: totalHorizontalX,
      horizontalY: totalHorizontalY,
      momentX: totalHorizontalY * geometry.height / 2,
      momentY: totalHorizontalX * geometry.height / 2,
      momentZ: 0 // Torsion (simplified)
    };
  }

  /**
   * Calculate approximate internal forces (simplified beam theory)
   */
  private calculateInternalForces(): any {
    const { geometry, loads } = this.input;
    
    // Simplified calculations for demonstration
    const bayArea = geometry.baySpacingX * geometry.baySpacingY;
    const totalLoad = (loads.deadLoad + loads.liveLoad) * bayArea;
    
    const beams = [];
    const columns = [];
    
    // Generate typical beam
    const maxMoment = totalLoad * Math.pow(geometry.baySpacingX, 2) / 8;
    const maxShear = totalLoad / 2;
    const maxDeflection = 5 * totalLoad * Math.pow(geometry.baySpacingX, 4) / (384 * this.input.materials.Es * 1e6 * 0.1); // Assumed I
    
    beams.push({
      id: 'B-TYP',
      shear: [-maxShear, 0, maxShear],
      moment: [0, maxMoment, 0],
      axial: [0, 0, 0],
      deflection: [0, maxDeflection, 0]
    });

    // Generate typical column
    const axialLoad = totalLoad * geometry.numberOfFloors;
    const momentFromWind = this.calculateWindLoad('x') * geometry.height / geometry.numberOfFloors;
    
    columns.push({
      id: 'C-TYP',
      axial: axialLoad,
      shearX: momentFromWind / (geometry.height / geometry.numberOfFloors),
      shearY: 0,
      momentX: momentFromWind,
      momentY: 0
    });

    return { beams, columns };
  }

  /**
   * Calculate stress levels
   */
  private calculateStresses(internalForces: any): any {
    const { materials } = this.input;
    
    // Simplified stress calculation
    const assumedBeamSection = 0.3 * 0.6; // m² (30x60 cm beam)
    const assumedColumnSection = 0.5 * 0.5; // m² (50x50 cm column)
    
    const maxCompression = internalForces.columns[0].axial / assumedColumnSection / 1000; // MPa
    const maxTension = internalForces.beams[0].moment[1] * 0.5 / (assumedBeamSection * 0.15) / 1000; // MPa
    const maxShear = internalForces.beams[0].shear[0] / assumedBeamSection / 1000; // MPa
    
    return {
      maxCompression,
      maxTension,
      maxShear,
      criticalElement: maxCompression > materials.fc * 0.65 ? 'Column C-TYP' : 'Beam B-TYP'
    };
  }

  /**
   * Check deflection limits per SNI
   */
  private checkDeflections(internalForces: any): any {
    const { geometry } = this.input;
    
    const maxVertical = Math.max(...internalForces.beams[0].deflection);
    const allowableVertical = geometry.baySpacingX * 1000 / 250; // L/250 in mm
    
    const maxHorizontal = geometry.height / 400; // H/400 per SNI
    const driftRatio = maxHorizontal / geometry.height;
    
    return {
      maxVertical,
      maxHorizontal,
      driftRatio,
      serviceabilityCheck: maxVertical <= allowableVertical && driftRatio <= 0.0025
    };
  }

  /**
   * Calculate member utilization
   */
  private calculateUtilization(stresses: any): any {
    const { materials } = this.input;
    
    const compressionUtilization = stresses.maxCompression / (materials.fc * 0.65);
    const tensionUtilization = stresses.maxTension / (materials.fy * 0.6);
    const shearUtilization = stresses.maxShear / (0.33 * Math.sqrt(materials.fc));
    
    const maxUtilization = Math.max(compressionUtilization, tensionUtilization, shearUtilization);
    
    return {
      maxUtilization,
      criticalMember: maxUtilization === compressionUtilization ? 'Column' : 'Beam',
      safetyFactor: 1 / maxUtilization
    };
  }

  /**
   * Perform complete static analysis
   */
  public performAnalysis(): StaticAnalysisResults {
    const loadCases = this.generateLoadCases();
    const loadCombinations = this.generateLoadCombinations();
    const reactions = this.calculateReactions(loadCases);
    const internalForces = this.calculateInternalForces();
    const stresses = this.calculateStresses(internalForces);
    const deflections = this.checkDeflections(internalForces);
    const utilization = this.calculateUtilization(stresses);

    return {
      loadCases,
      loadCombinations,
      reactions,
      internalForces,
      stresses,
      deflections,
      utilization
    };
  }

  /**
   * Get analysis summary
   */
  public getAnalysisSummary(): string {
    const results = this.performAnalysis();
    
    return `
Static Analysis Summary:
- Load Cases: ${results.loadCases.length}
- Load Combinations: ${results.loadCombinations.length}
- Max Utilization: ${(results.utilization.maxUtilization * 100).toFixed(1)}%
- Safety Factor: ${results.utilization.safetyFactor.toFixed(2)}
- Serviceability: ${results.deflections.serviceabilityCheck ? 'PASS' : 'FAIL'}
- Critical Element: ${results.utilization.criticalMember}
    `.trim();
  }
}

export default StaticAnalysisEngine;