/**
 * Foundation Design Results Integration
 * Integrates foundation design with geotechnical analysis
 */

export interface GeotechnicalProperties {
  soilType: 'clay' | 'sand' | 'silt' | 'rock' | 'mixed';
  layerData: Array<{
    depth: number;
    thickness: number;
    soilType: string;
    unitWeight: number; // kN/m³
    cohesion: number; // kPa
    frictionAngle: number; // degrees
    elasticModulus: number; // MPa
    poissonRatio: number;
    permeability: number; // m/s
    plasticityIndex?: number;
    liquidLimit?: number;
    spt_n?: number; // SPT N value
  }>;
  groundwaterLevel: number; // m below surface
  seismicZone: 'low' | 'moderate' | 'high' | 'very-high';
  environmentalConditions: {
    temperature: { min: number; max: number };
    humidity: number;
    chemicalExposure: 'none' | 'mild' | 'moderate' | 'severe';
    freezeThaw: boolean;
  };
}

export interface FoundationAnalysisResults {
  bearingCapacity: {
    ultimate: number; // kPa
    allowable: number; // kPa
    safetyFactor: number;
    failureMode: 'general' | 'local' | 'punching';
    calculation: {
      terzaghiMethod: number;
      mayerhofMethod: number;
      vesicMethod: number;
      recommendedValue: number;
    };
  };
  settlement: {
    immediate: number; // mm
    consolidation: number; // mm
    secondary: number; // mm
    total: number; // mm
    allowableTotal: number; // mm
    timeToComplete: number; // years
    differential: {
      maximum: number; // mm
      allowable: number; // mm
      ratio: number;
    };
  };
  stability: {
    overturning: {
      moment: number; // kNm
      resistingMoment: number; // kNm
      safetyFactor: number;
      status: 'pass' | 'fail';
    };
    sliding: {
      force: number; // kN
      resistance: number; // kN
      safetyFactor: number;
      status: 'pass' | 'fail';
    };
    uplift: {
      force: number; // kN
      weight: number; // kN
      safetyFactor: number;
      status: 'pass' | 'fail';
    };
  };
  liquefaction: {
    potential: 'none' | 'low' | 'moderate' | 'high';
    factorOfSafety: number;
    mitigation: string[];
  };
}

export interface PileDesignResults {
  type: 'driven' | 'drilled' | 'micropile' | 'helical';
  material: 'concrete' | 'steel' | 'timber' | 'composite';
  dimensions: {
    diameter: number; // mm
    length: number; // m
    wall_thickness?: number; // mm for steel piles
  };
  capacity: {
    axial: {
      compression: number; // kN
      tension: number; // kN
      skinFriction: number; // kN
      endBearing: number; // kN
    };
    lateral: number; // kN
    safetyFactors: {
      compression: number;
      tension: number;
      lateral: number;
    };
  };
  groupEffect: {
    efficiency: number; // 0-1
    spacing: number; // pile diameters
    configuration: string;
  };
  installation: {
    method: string;
    equipment: string;
    challenges: string[];
    recommendations: string[];
  };
}

export interface FoundationDesignResults {
  type: 'shallow' | 'deep' | 'combined' | 'raft' | 'pile';
  geometry: {
    width: number; // m
    length: number; // m
    depth: number; // m
    thickness?: number; // m for slabs
    reinforcement?: {
      main: { diameter: number; spacing: number; direction: 'x' | 'y' | 'both' };
      distribution: { diameter: number; spacing: number };
      development: { length: number; splice: number };
    };
  };
  loads: {
    vertical: number; // kN
    horizontal: number; // kN
    moment: number; // kNm
    combinations: Array<{
      name: string;
      vertical: number;
      horizontal: number;
      moment: number;
      factored: boolean;
    }>;
  };
  analysis: FoundationAnalysisResults;
  pileDesign?: PileDesignResults;
  cost: {
    excavation: number; // IDR
    concrete: number; // IDR
    reinforcement: number; // IDR
    piling?: number; // IDR
    backfill: number; // IDR
    labor: number; // IDR
    total: number; // IDR
    unitCost: number; // IDR/m²
  };
  construction: {
    sequence: string[];
    duration: number; // days
    equipment: string[];
    qualityControl: string[];
    testing: string[];
  };
  recommendations: string[];
  compliance: {
    sni8460: boolean; // SNI 8460:2017
    sni1726: boolean; // SNI 1726:2019 (Seismic)
    sni3017: boolean; // SNI 3017:2014 (Foundation)
  };
}

export class FoundationDesignIntegrator {
  private geotechnicalData: GeotechnicalProperties;
  private structuralLoads: any;
  
  constructor(geotechnicalData: GeotechnicalProperties, structuralLoads: any) {
    this.geotechnicalData = geotechnicalData;
    this.structuralLoads = structuralLoads;
  }

  /**
   * Perform comprehensive foundation analysis
   */
  public analyzeFoundation(foundationType: string, geometry: any): FoundationDesignResults {
    const analysis = this.performFoundationAnalysis(foundationType, geometry);
    const pileDesign = foundationType === 'pile' ? this.designPiles(geometry) : undefined;
    const cost = this.calculateFoundationCost(foundationType, geometry, pileDesign);
    const construction = this.generateConstructionPlan(foundationType, geometry);
    const recommendations = this.generateRecommendations(analysis);
    const compliance = this.checkCompliance(analysis);

    return {
      type: foundationType as any,
      geometry,
      loads: this.structuralLoads,
      analysis,
      pileDesign,
      cost,
      construction,
      recommendations,
      compliance
    };
  }

  /**
   * Perform foundation analysis calculations
   */
  private performFoundationAnalysis(type: string, geometry: any): FoundationAnalysisResults {
    return {
      bearingCapacity: this.calculateBearingCapacity(geometry),
      settlement: this.calculateSettlement(geometry),
      stability: this.checkStability(geometry),
      liquefaction: this.assessLiquefaction()
    };
  }

  /**
   * Calculate bearing capacity using multiple methods
   */
  private calculateBearingCapacity(geometry: any): any {
    const soil = this.geotechnicalData.layerData[0]; // Top layer
    const B = Math.min(geometry.width, geometry.length);
    const L = Math.max(geometry.width, geometry.length);
    const Df = geometry.depth;

    // Terzaghi Method
    const Nc = this.getTerzaghiBearingFactors(soil.frictionAngle).Nc;
    const Nq = this.getTerzaghiBearingFactors(soil.frictionAngle).Nq;
    const Ng = this.getTerzaghiBearingFactors(soil.frictionAngle).Ng;
    
    const terzaghiUltimate = soil.cohesion * Nc + 
                           soil.unitWeight * Df * Nq + 
                           0.5 * soil.unitWeight * B * Ng;

    // Meyerhof Method (includes shape factors)
    const sc = 1 + (Nq / Nc) * (B / L);
    const sq = 1 + (B / L) * Math.tan(soil.frictionAngle * Math.PI / 180);
    const sg = 1 - 0.4 * (B / L);
    
    const mayerhofUltimate = soil.cohesion * Nc * sc + 
                           soil.unitWeight * Df * Nq * sq + 
                           0.5 * soil.unitWeight * B * Ng * sg;

    // Vesic Method (includes depth factors)
    const dc = 1 + 0.4 * (Df / B);
    const dq = 1 + 2 * Math.tan(soil.frictionAngle * Math.PI / 180) * Math.pow(1 - Math.sin(soil.frictionAngle * Math.PI / 180), 2) * (Df / B);
    const dg = 1.0;
    
    const vesicUltimate = soil.cohesion * Nc * sc * dc + 
                         soil.unitWeight * Df * Nq * sq * dq + 
                         0.5 * soil.unitWeight * B * Ng * sg * dg;

    const recommendedValue = Math.min(terzaghiUltimate, mayerhofUltimate, vesicUltimate);
    const safetyFactor = 3.0;
    const allowable = recommendedValue / safetyFactor;

    return {
      ultimate: recommendedValue,
      allowable,
      safetyFactor,
      failureMode: soil.frictionAngle > 30 ? 'general' : 'local',
      calculation: {
        terzaghiMethod: terzaghiUltimate,
        mayerhofMethod: mayerhofUltimate,
        vesicMethod: vesicUltimate,
        recommendedValue
      }
    };
  }

  /**
   * Calculate settlement components
   */
  private calculateSettlement(geometry: any): any {
    const soil = this.geotechnicalData.layerData[0];
    const B = Math.min(geometry.width, geometry.length);
    const q = this.structuralLoads.vertical / (geometry.width * geometry.length);

    // Immediate settlement
    const Is = 1.0; // Influence factor
    const immediate = q * B * (1 - Math.pow(soil.poissonRatio, 2)) * Is / soil.elasticModulus * 1000; // mm

    // Consolidation settlement (for clay)
    let consolidation = 0;
    if (soil.soilType === 'clay') {
      const Cc = 0.009 * (soil.liquidLimit || 50 - 10); // Compression index
      const eo = 1.0; // Initial void ratio
      const H = soil.thickness;
      const sigmaV = soil.unitWeight * geometry.depth; // Initial stress
      const deltaSigma = q; // Added stress
      
      consolidation = (Cc * H / (1 + eo)) * Math.log10((sigmaV + deltaSigma) / sigmaV) * 1000; // mm
    }

    // Secondary settlement
    const secondary = consolidation * 0.05; // 5% of consolidation settlement

    const total = immediate + consolidation + secondary;
    const allowableTotal = geometry.width < 3 ? 25 : 50; // mm
    
    // Differential settlement
    const differential = total * 0.5; // Estimated as 50% of total
    const allowableDifferential = Math.min(20, geometry.width * 1000 / 500); // L/500 or 20mm

    return {
      immediate,
      consolidation,
      secondary,
      total,
      allowableTotal,
      timeToComplete: soil.soilType === 'clay' ? 5 : 1, // years
      differential: {
        maximum: differential,
        allowable: allowableDifferential,
        ratio: differential / allowableDifferential
      }
    };
  }

  /**
   * Check foundation stability
   */
  private checkStability(geometry: any): any {
    const loads = this.structuralLoads;
    const foundationWeight = geometry.width * geometry.length * geometry.depth * 24; // kN

    // Overturning
    const overturningSF = 2.0;
    const overturningMoment = loads.moment + loads.horizontal * geometry.depth;
    const resistingMoment = foundationWeight * geometry.width / 2;
    const overturningFactor = resistingMoment / (overturningMoment || 1);
    
    // Sliding
    const slidingSF = 1.5;
    const slidingForce = loads.horizontal;
    const friction = (loads.vertical + foundationWeight) * Math.tan(this.geotechnicalData.layerData[0].frictionAngle * Math.PI / 180);
    const passive = 0.5 * this.geotechnicalData.layerData[0].unitWeight * Math.pow(geometry.depth, 2) * Math.tan(45 + this.geotechnicalData.layerData[0].frictionAngle * Math.PI / 360);
    const slidingResistance = friction + passive;
    const slidingFactor = slidingResistance / (slidingForce || 1);
    
    // Uplift
    const upliftSF = 2.0;
    const upliftForce = Math.abs(loads.vertical - foundationWeight);
    const upliftWeight = foundationWeight + geometry.width * geometry.length * geometry.depth * this.geotechnicalData.layerData[0].unitWeight;
    const upliftFactor = upliftWeight / (upliftForce || 1);

    return {
      overturning: {
        moment: overturningMoment,
        resistingMoment,
        safetyFactor: overturningFactor,
        status: overturningFactor >= overturningSF ? 'pass' : 'fail'
      },
      sliding: {
        force: slidingForce,
        resistance: slidingResistance,
        safetyFactor: slidingFactor,
        status: slidingFactor >= slidingSF ? 'pass' : 'fail'
      },
      uplift: {
        force: upliftForce,
        weight: upliftWeight,
        safetyFactor: upliftFactor,
        status: upliftFactor >= upliftSF ? 'pass' : 'fail'
      }
    };
  }

  /**
   * Assess liquefaction potential
   */
  private assessLiquefaction(): any {
    const groundwaterDepth = this.geotechnicalData.groundwaterLevel;
    const seismicZone = this.geotechnicalData.seismicZone;
    
    if (groundwaterDepth > 20 || seismicZone === 'low') {
      return {
        potential: 'none',
        factorOfSafety: 10,
        mitigation: []
      };
    }

    // Simplified liquefaction assessment
    const sandLayers = this.geotechnicalData.layerData.filter(layer => 
      layer.soilType === 'sand' && layer.depth < groundwaterDepth + 15
    );

    if (sandLayers.length === 0) {
      return {
        potential: 'none',
        factorOfSafety: 5,
        mitigation: []
      };
    }

    const avgN = sandLayers.reduce((sum, layer) => sum + (layer.spt_n || 10), 0) / sandLayers.length;
    const seismicFactor = seismicZone === 'high' ? 0.4 : seismicZone === 'moderate' ? 0.25 : 0.15;
    
    const CRR = avgN > 30 ? 0.8 : (avgN / 34 + 0.05); // Cyclic resistance ratio
    const CSR = seismicFactor; // Cyclic stress ratio (simplified)
    const FS = CRR / CSR;

    let potential: 'none' | 'low' | 'moderate' | 'high';
    if (FS >= 1.3) potential = 'none';
    else if (FS >= 1.1) potential = 'low';
    else if (FS >= 0.9) potential = 'moderate';
    else potential = 'high';

    const mitigation = [];
    if (potential !== 'none') {
      mitigation.push('Desain pondasi tiang hingga lapisan non-liquefiable');
      mitigation.push('Perbaikan tanah dengan vibrocompaction atau stone column');
      if (potential === 'high') {
        mitigation.push('Pertimbangkan ground improvement atau relokasi');
      }
    }

    return {
      potential,
      factorOfSafety: FS,
      mitigation
    };
  }

  /**
   * Design pile foundation
   */
  private designPiles(geometry: any): PileDesignResults {
    const totalLoad = this.structuralLoads.vertical;
    const pileCapacity = this.calculateSinglePileCapacity();
    const numberOfPiles = Math.ceil(totalLoad / pileCapacity * 1.2); // 20% factor

    return {
      type: 'drilled',
      material: 'concrete',
      dimensions: {
        diameter: 600, // mm
        length: 15, // m
      },
      capacity: {
        axial: {
          compression: pileCapacity,
          tension: pileCapacity * 0.7,
          skinFriction: pileCapacity * 0.8,
          endBearing: pileCapacity * 0.2
        },
        lateral: 150, // kN
        safetyFactors: {
          compression: 2.5,
          tension: 3.0,
          lateral: 2.0
        }
      },
      groupEffect: {
        efficiency: numberOfPiles > 9 ? 0.8 : 0.9,
        spacing: 3, // pile diameters
        configuration: `${Math.ceil(Math.sqrt(numberOfPiles))}x${Math.ceil(Math.sqrt(numberOfPiles))}`
      },
      installation: {
        method: 'Drilled shaft with temporary casing',
        equipment: 'Rotary drilling rig',
        challenges: ['Groundwater control', 'Soil stability'],
        recommendations: ['Use polymer slurry', 'Install temporary casing']
      }
    };
  }

  /**
   * Calculate single pile capacity
   */
  private calculateSinglePileCapacity(): number {
    const diameter = 0.6; // m
    const length = 15; // m
    const area = Math.PI * Math.pow(diameter / 2, 2);
    
    let skinFriction = 0;
    let endBearing = 0;
    
    // Calculate skin friction for each layer
    for (const layer of this.geotechnicalData.layerData) {
      if (layer.depth < length) {
        const perimeter = Math.PI * diameter;
        const layerLength = Math.min(layer.thickness, length - layer.depth);
        const adhesion = layer.cohesion * 0.7; // Alpha method
        skinFriction += adhesion * perimeter * layerLength;
      }
    }
    
    // End bearing
    const bottomLayer = this.geotechnicalData.layerData[this.geotechnicalData.layerData.length - 1];
    const Nq = this.getTerzaghiBearingFactors(bottomLayer.frictionAngle).Nq;
    endBearing = bottomLayer.unitWeight * length * Nq * area;
    
    return skinFriction + endBearing;
  }

  /**
   * Calculate foundation cost
   */
  private calculateFoundationCost(type: string, geometry: any, pileDesign?: PileDesignResults): any {
    const volume = geometry.width * geometry.length * geometry.depth;
    const area = geometry.width * geometry.length;
    
    // Unit costs in IDR
    const unitCosts = {
      excavation: 50000, // per m³
      concrete: 1200000, // per m³
      reinforcement: 15000000, // per ton
      backfill: 30000, // per m³
      labor: 200000 // per m²
    };

    const excavation = volume * 1.2 * unitCosts.excavation; // Include overdig
    const concrete = volume * unitCosts.concrete;
    const reinforcement = volume * 100 * unitCosts.reinforcement / 1000; // 100 kg/m³
    const backfill = volume * 0.2 * unitCosts.backfill;
    const labor = area * unitCosts.labor;
    
    let piling = 0;
    if (pileDesign) {
      const pileVolume = Math.PI * Math.pow(pileDesign.dimensions.diameter / 2000, 2) * pileDesign.dimensions.length;
      const numberOfPiles = Math.ceil(this.structuralLoads.vertical / pileDesign.capacity.axial.compression * 1.2);
      piling = numberOfPiles * pileVolume * 1500000; // IDR per m³ pile
    }

    const total = excavation + concrete + reinforcement + backfill + labor + piling;
    const unitCost = total / area;

    return {
      excavation,
      concrete,
      reinforcement,
      piling,
      backfill,
      labor,
      total,
      unitCost
    };
  }

  /**
   * Generate construction plan
   */
  private generateConstructionPlan(type: string, geometry: any): any {
    const sequence = [
      'Site survey dan soil investigation',
      'Excavation dan dewatering',
      type === 'pile' ? 'Pile installation dan testing' : 'Foundation bed preparation',
      'Reinforcement placement',
      'Concrete pouring',
      'Curing dan protection',
      'Backfilling dan compaction',
      'Quality testing'
    ];

    const baseDuration = geometry.width * geometry.length / 50; // days per 50 m²
    const duration = Math.max(7, baseDuration);

    return {
      sequence,
      duration,
      equipment: ['Excavator', 'Concrete mixer', 'Vibrator', 'Crane'],
      qualityControl: ['Concrete slump test', 'Reinforcement inspection', 'Compaction test'],
      testing: ['Bearing capacity test', 'Settlement monitoring', 'Concrete strength test']
    };
  }

  /**
   * Generate design recommendations
   */
  private generateRecommendations(analysis: FoundationAnalysisResults): string[] {
    const recommendations = [];
    
    if (analysis.bearingCapacity.safetyFactor < 3) {
      recommendations.push('Pertimbangkan peningkatan dimensi pondasi atau penggunaan pondasi dalam');
    }
    
    if (analysis.settlement.total > analysis.settlement.allowableTotal) {
      recommendations.push('Lakukan perbaikan tanah atau gunakan pondasi tiang untuk mengurangi settlement');
    }
    
    if (analysis.stability.overturning.status === 'fail') {
      recommendations.push('Tambahkan massa pondasi atau perpanjang dimensi untuk mengurangi overturning');
    }
    
    if (analysis.stability.sliding.status === 'fail') {
      recommendations.push('Tambahkan shear key atau perkuat dengan passive pressure');
    }
    
    if (analysis.liquefaction.potential !== 'none') {
      recommendations.push(`Potensi likuifaksi ${analysis.liquefaction.potential} - ${analysis.liquefaction.mitigation.join(', ')}`);
    }
    
    recommendations.push('Lakukan monitoring settlement selama konstruksi dan operasi');
    recommendations.push('Pastikan drainage yang baik untuk mencegah akumulasi air');
    
    return recommendations;
  }

  /**
   * Check code compliance
   */
  private checkCompliance(analysis: FoundationAnalysisResults): any {
    return {
      sni8460: analysis.bearingCapacity.safetyFactor >= 3 && 
               analysis.settlement.total <= analysis.settlement.allowableTotal,
      sni1726: analysis.liquefaction.factorOfSafety >= 1.1,
      sni3017: analysis.stability.overturning.safetyFactor >= 2 && 
               analysis.stability.sliding.safetyFactor >= 1.5
    };
  }

  /**
   * Get Terzaghi bearing capacity factors
   */
  private getTerzaghiBearingFactors(phi: number): { Nc: number; Nq: number; Ng: number } {
    const phiRad = phi * Math.PI / 180;
    const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
    const Nc = (Nq - 1) / Math.tan(phiRad);
    const Ng = 2 * (Nq - 1) * Math.tan(phiRad);
    
    return { Nc, Nq, Ng };
  }
}

export default FoundationDesignIntegrator;