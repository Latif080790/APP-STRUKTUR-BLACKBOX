/**
 * SNI Compliance Engine - Indonesian Building Code Compliance Checker
 * SNI 2847:2019 (Concrete Structures) & SNI 1729:2020 (Steel Structures)
 * Professional-grade code compliance validation
 */

// SNI Compliance Interfaces
export interface SNI2847Compliance {
  minimumReinforcement: {
    status: 'pass' | 'fail' | 'warning';
    required: number;
    provided: number;
    ratio: number;
    article: string;
  };
  maximumReinforcement: {
    status: 'pass' | 'fail' | 'warning';
    maximum: number;
    provided: number;
    ratio: number;
    article: string;
  };
  developmentLength: {
    status: 'pass' | 'fail' | 'warning';
    required: number;
    provided: number;
    article: string;
  };
  crackControl: {
    status: 'pass' | 'fail' | 'warning';
    spacing: number;
    maxSpacing: number;
    article: string;
  };
  shearStrength: {
    status: 'pass' | 'fail' | 'warning';
    required: number;
    provided: number;
    ratio: number;
    article: string;
  };
  deflectionControl: {
    status: 'pass' | 'fail' | 'warning';
    calculated: number;
    allowable: number;
    ratio: number;
    article: string;
  };
}

export interface SNI1729Compliance {
  slendernessRatio: {
    status: 'pass' | 'fail' | 'warning';
    actual: number;
    maximum: number;
    article: string;
  };
  lateralTorsionalBuckling: {
    status: 'pass' | 'fail' | 'warning';
    moment: number;
    capacity: number;
    ratio: number;
    article: string;
  };
  connectionDesign: {
    status: 'pass' | 'fail' | 'warning';
    force: number;
    capacity: number;
    ratio: number;
    article: string;
  };
  plateStability: {
    status: 'pass' | 'fail' | 'warning';
    width: number;
    thickness: number;
    ratio: number;
    article: string;
  };
  fatigue: {
    status: 'pass' | 'fail' | 'warning';
    cycles: number;
    allowable: number;
    article: string;
  };
}

export interface ComplianceReport {
  projectInfo: {
    name: string;
    location: string;
    engineer: string;
    date: string;
    codeVersion: string;
  };
  elementCompliance: {
    elementId: string;
    elementType: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';
    material: 'concrete' | 'steel' | 'composite';
    sni2847?: SNI2847Compliance;
    sni1729?: SNI1729Compliance;
    overallStatus: 'compliant' | 'non-compliant' | 'requires-review';
    criticalViolations: string[];
    recommendations: string[];
  }[];
  summaryCompliance: {
    totalElements: number;
    compliantElements: number;
    nonCompliantElements: number;
    reviewRequired: number;
    complianceRating: number; // 0-100
  };
  codeReferences: {
    sni2847Articles: string[];
    sni1729Articles: string[];
    additionalCodes: string[];
  };
}

// SNI Code Constants
export const SNI2847_CONSTANTS = {
  CONCRETE: {
    MIN_FC: 17, // MPa - Pasal 5.1.1
    MAX_FC: 83, // MPa - Pasal 5.1.1
    MIN_REINFORCEMENT_RATIO: {
      BEAM: 0.0018, // Pasal 9.6.1.2
      SLAB: 0.0018, // Pasal 7.12.2.1
      COLUMN: 0.01,  // Pasal 10.9.1
      WALL: 0.0012   // Pasal 11.9.9.1
    },
    MAX_REINFORCEMENT_RATIO: {
      BEAM: 0.025,   // Pasal 9.6.1.1
      COLUMN: 0.08,  // Pasal 10.9.1
      WALL: 0.08     // Pasal 11.9.9.2
    },
    DEVELOPMENT_LENGTH_FACTOR: {
      TENSION: 1.0,    // Pasal 12.2
      COMPRESSION: 0.8, // Pasal 12.3
      HOOK: 1.2        // Pasal 12.5
    },
    CRACK_SPACING: {
      INTERIOR: 300,   // mm - Pasal 24.3.2
      EXTERIOR: 250    // mm - Pasal 24.3.2
    }
  },
  STEEL: {
    FY_MIN: 240,    // MPa - Grade BJ34
    FY_MAX: 550,    // MPa - Grade BJ55
    FU_MIN: 370,    // MPa
    FU_MAX: 550     // MPa
  }
};

export const SNI1729_CONSTANTS = {
  SLENDERNESS: {
    COLUMN_KL_R_MAX: 200,      // Pasal 10.3.1
    BEAM_LATERAL_UNBRACED: 300, // Pasal 10.2.1
    PLATE_WIDTH_THICKNESS: {
      COMPACT: 0.38,           // Pasal 10.2.1.1
      NON_COMPACT: 1.0,        // Pasal 10.2.1.2
      SLENDER: 1.4             // Pasal 10.2.1.3
    }
  },
  SAFETY_FACTORS: {
    TENSION: 0.9,              // Pasal 10.1.1
    COMPRESSION: 0.9,          // Pasal 10.1.1
    FLEXURE: 0.9,             // Pasal 10.1.1
    SHEAR: 0.9,               // Pasal 10.1.1
    BEARING: 0.75             // Pasal 10.1.1
  },
  CONNECTION: {
    BOLT_EDGE_DISTANCE_MIN: 1.25, // x bolt diameter
    BOLT_SPACING_MIN: 2.67,        // x bolt diameter
    BOLT_SPACING_MAX: 24.0,        // x plate thickness
    WELD_SIZE_MIN: 3,              // mm
    WELD_SIZE_MAX_RATIO: 0.7       // x plate thickness
  }
};

export class SNIComplianceEngine {
  private projectInfo: any;
  private complianceResults: Map<string, any> = new Map();

  constructor(projectInfo: any) {
    this.projectInfo = {
      name: projectInfo.name || 'Structural Project',
      location: projectInfo.location || 'Indonesia',
      engineer: projectInfo.engineer || 'Licensed Engineer',
      date: new Date().toLocaleDateString('id-ID'),
      codeVersion: 'SNI 2847:2019 & SNI 1729:2020'
    };
  }

  /**
   * Check SNI 2847 compliance for concrete elements
   */
  public checkSNI2847Compliance(
    elementId: string,
    elementType: 'beam' | 'column' | 'slab' | 'wall',
    designData: any
  ): SNI2847Compliance {
    const compliance: SNI2847Compliance = {
      minimumReinforcement: this.checkMinimumReinforcement(elementType, designData),
      maximumReinforcement: this.checkMaximumReinforcement(elementType, designData),
      developmentLength: this.checkDevelopmentLength(elementType, designData),
      crackControl: this.checkCrackControl(elementType, designData),
      shearStrength: this.checkShearStrength(elementType, designData),
      deflectionControl: this.checkDeflectionControl(elementType, designData)
    };

    this.complianceResults.set(`${elementId}_sni2847`, compliance);
    return compliance;
  }

  /**
   * Check SNI 1729 compliance for steel elements
   */
  public checkSNI1729Compliance(
    elementId: string,
    elementType: 'beam' | 'column',
    designData: any
  ): SNI1729Compliance {
    const compliance: SNI1729Compliance = {
      slendernessRatio: this.checkSlendernessRatio(elementType, designData),
      lateralTorsionalBuckling: this.checkLateralTorsionalBuckling(elementType, designData),
      connectionDesign: this.checkConnectionDesign(elementType, designData),
      plateStability: this.checkPlateStability(elementType, designData),
      fatigue: this.checkFatigue(elementType, designData)
    };

    this.complianceResults.set(`${elementId}_sni1729`, compliance);
    return compliance;
  }

  /**
   * Check minimum reinforcement requirement
   */
  private checkMinimumReinforcement(elementType: string, designData: any): any {
    const minRatio = SNI2847_CONSTANTS.CONCRETE.MIN_REINFORCEMENT_RATIO[elementType.toUpperCase() as keyof typeof SNI2847_CONSTANTS.CONCRETE.MIN_REINFORCEMENT_RATIO] || 0.0018;
    const providedRatio = designData.reinforcement?.ratio || 0;
    const required = minRatio * designData.geometry.area;
    const provided = designData.reinforcement?.area || 0;

    const ratio = provided / required;
    const status = ratio >= 1.0 ? 'pass' : 'fail';

    return {
      status,
      required,
      provided,
      ratio,
      article: elementType === 'beam' ? 'Pasal 9.6.1.2' : 
              elementType === 'column' ? 'Pasal 10.9.1' :
              elementType === 'slab' ? 'Pasal 7.12.2.1' : 'Pasal 11.9.9.1'
    };
  }

  /**
   * Check maximum reinforcement requirement
   */
  private checkMaximumReinforcement(elementType: string, designData: any): any {
    const maxRatio = SNI2847_CONSTANTS.CONCRETE.MAX_REINFORCEMENT_RATIO[elementType.toUpperCase() as keyof typeof SNI2847_CONSTANTS.CONCRETE.MAX_REINFORCEMENT_RATIO] || 0.08;
    const providedRatio = designData.reinforcement?.ratio || 0;
    const maximum = maxRatio * designData.geometry.area;
    const provided = designData.reinforcement?.area || 0;

    const ratio = provided / maximum;
    const status = ratio <= 1.0 ? 'pass' : 'fail';

    return {
      status,
      maximum,
      provided,
      ratio,
      article: elementType === 'beam' ? 'Pasal 9.6.1.1' : 
              elementType === 'column' ? 'Pasal 10.9.1' : 'Pasal 11.9.9.2'
    };
  }

  /**
   * Check development length requirement
   */
  private checkDevelopmentLength(elementType: string, designData: any): any {
    const barDiameter = designData.reinforcement?.diameter || 16;
    const fc = designData.material?.fc || 25;
    const fy = designData.material?.fy || 400;

    // Simplified development length calculation
    const basicDevelopmentLength = (fy / (4 * Math.sqrt(fc))) * barDiameter;
    const factor = SNI2847_CONSTANTS.CONCRETE.DEVELOPMENT_LENGTH_FACTOR.TENSION;
    const required = basicDevelopmentLength * factor;
    const provided = designData.geometry?.length || 0;

    const status = provided >= required ? 'pass' : 'fail';

    return {
      status,
      required: Math.round(required),
      provided,
      article: 'Pasal 12.2'
    };
  }

  /**
   * Check crack control requirement
   */
  private checkCrackControl(elementType: string, designData: any): any {
    const spacing = designData.reinforcement?.spacing || 200;
    const maxSpacing = elementType === 'slab' ? 
      SNI2847_CONSTANTS.CONCRETE.CRACK_SPACING.INTERIOR : 
      SNI2847_CONSTANTS.CONCRETE.CRACK_SPACING.EXTERIOR;

    const status = spacing <= maxSpacing ? 'pass' : 'fail';

    return {
      status,
      spacing,
      maxSpacing,
      article: 'Pasal 24.3.2'
    };
  }

  /**
   * Check shear strength requirement
   */
  private checkShearStrength(elementType: string, designData: any): any {
    const required = designData.forces?.shear || 0;
    const provided = designData.capacity?.shear || 0;
    const ratio = required / (provided || 1);

    const status = ratio <= 1.0 ? 'pass' : 'fail';

    return {
      status,
      required,
      provided,
      ratio,
      article: elementType === 'beam' ? 'Pasal 9.5' : 'Pasal 11.5'
    };
  }

  /**
   * Check deflection control requirement
   */
  private checkDeflectionControl(elementType: string, designData: any): any {
    const calculated = designData.deflection?.calculated || 0;
    const span = designData.geometry?.span || 1;
    const allowable = span / (elementType === 'beam' ? 250 : 300); // L/250 or L/300

    const ratio = calculated / allowable;
    const status = ratio <= 1.0 ? 'pass' : 'fail';

    return {
      status,
      calculated,
      allowable,
      ratio,
      article: 'Pasal 24.2'
    };
  }

  /**
   * Check slenderness ratio for steel elements
   */
  private checkSlendernessRatio(elementType: string, designData: any): any {
    const length = designData.geometry?.length || 0;
    const radius = designData.geometry?.radiusOfGyration || 1;
    const kFactor = designData.buckling?.kFactor || 1.0;
    
    const actual = (kFactor * length) / radius;
    const maximum = SNI1729_CONSTANTS.SLENDERNESS.COLUMN_KL_R_MAX;

    const status = actual <= maximum ? 'pass' : 'fail';

    return {
      status,
      actual: Math.round(actual),
      maximum,
      article: 'Pasal 10.3.1'
    };
  }

  /**
   * Check lateral torsional buckling
   */
  private checkLateralTorsionalBuckling(elementType: string, designData: any): any {
    const moment = designData.forces?.moment || 0;
    const capacity = designData.capacity?.moment || 0;
    const ratio = moment / (capacity || 1);

    const status = ratio <= 1.0 ? 'pass' : 'fail';

    return {
      status,
      moment,
      capacity,
      ratio,
      article: 'Pasal 10.2.1'
    };
  }

  /**
   * Check connection design
   */
  private checkConnectionDesign(elementType: string, designData: any): any {
    const force = designData.connection?.force || 0;
    const capacity = designData.connection?.capacity || 0;
    const ratio = force / (capacity || 1);

    const status = ratio <= 1.0 ? 'pass' : 'fail';

    return {
      status,
      force,
      capacity,
      ratio,
      article: 'Pasal 13'
    };
  }

  /**
   * Check plate stability
   */
  private checkPlateStability(elementType: string, designData: any): any {
    const width = designData.geometry?.width || 0;
    const thickness = designData.geometry?.thickness || 1;
    const ratio = width / thickness;
    const maxRatio = SNI1729_CONSTANTS.SLENDERNESS.PLATE_WIDTH_THICKNESS.COMPACT * 100;

    const status = ratio <= maxRatio ? 'pass' : 'warning';

    return {
      status,
      width,
      thickness,
      ratio,
      article: 'Pasal 10.2.1.1'
    };
  }

  /**
   * Check fatigue requirement
   */
  private checkFatigue(elementType: string, designData: any): any {
    const cycles = designData.fatigue?.cycles || 0;
    const allowable = designData.fatigue?.allowableCycles || 2000000; // 2 million cycles

    const status = cycles <= allowable ? 'pass' : 'warning';

    return {
      status,
      cycles,
      allowable,
      article: 'Pasal 11'
    };
  }

  /**
   * Generate comprehensive compliance report
   */
  public generateComplianceReport(elements: any[]): ComplianceReport {
    const elementCompliance = elements.map(element => {
      const sni2847 = this.complianceResults.get(`${element.id}_sni2847`);
      const sni1729 = this.complianceResults.get(`${element.id}_sni1729`);
      
      const criticalViolations = this.getCriticalViolations(element.id, sni2847, sni1729);
      const recommendations = this.getRecommendations(element.id, sni2847, sni1729);
      const overallStatus = this.determineOverallStatus(criticalViolations);

      return {
        elementId: element.id,
        elementType: element.type,
        material: element.material,
        sni2847,
        sni1729,
        overallStatus,
        criticalViolations,
        recommendations
      };
    });

    const summaryCompliance = this.calculateSummaryCompliance(elementCompliance);
    const codeReferences = this.getCodeReferences();

    return {
      projectInfo: this.projectInfo,
      elementCompliance,
      summaryCompliance,
      codeReferences
    };
  }

  /**
   * Get critical violations for an element
   */
  private getCriticalViolations(elementId: string, sni2847?: any, sni1729?: any): string[] {
    const violations: string[] = [];

    if (sni2847) {
      Object.entries(sni2847).forEach(([key, value]: [string, any]) => {
        if (value.status === 'fail') {
          violations.push(`SNI 2847 - ${key}: ${value.article}`);
        }
      });
    }

    if (sni1729) {
      Object.entries(sni1729).forEach(([key, value]: [string, any]) => {
        if (value.status === 'fail') {
          violations.push(`SNI 1729 - ${key}: ${value.article}`);
        }
      });
    }

    return violations;
  }

  /**
   * Get recommendations for compliance improvement
   */
  private getRecommendations(elementId: string, sni2847?: any, sni1729?: any): string[] {
    const recommendations: string[] = [];

    if (sni2847) {
      if (sni2847.minimumReinforcement?.status === 'fail') {
        recommendations.push(`Tambahkan tulangan minimum sesuai ${sni2847.minimumReinforcement.article}`);
      }
      if (sni2847.maximumReinforcement?.status === 'fail') {
        recommendations.push(`Kurangi tulangan maksimum sesuai ${sni2847.maximumReinforcement.article}`);
      }
      if (sni2847.shearStrength?.status === 'fail') {
        recommendations.push(`Tambahkan tulangan sengkang atau perbesar dimensi penampang`);
      }
    }

    if (sni1729) {
      if (sni1729.slendernessRatio?.status === 'fail') {
        recommendations.push(`Kurangi rasio kelangsingan atau tambahkan lateral bracing`);
      }
      if (sni1729.lateralTorsionalBuckling?.status === 'fail') {
        recommendations.push(`Tambahkan lateral bracing atau perbesar profil`);
      }
    }

    return recommendations;
  }

  /**
   * Determine overall compliance status
   */
  private determineOverallStatus(violations: string[]): 'compliant' | 'non-compliant' | 'requires-review' {
    if (violations.length === 0) return 'compliant';
    if (violations.some(v => v.includes('fail'))) return 'non-compliant';
    return 'requires-review';
  }

  /**
   * Calculate summary compliance metrics
   */
  private calculateSummaryCompliance(elementCompliance: any[]): any {
    const totalElements = elementCompliance.length;
    const compliantElements = elementCompliance.filter(e => e.overallStatus === 'compliant').length;
    const nonCompliantElements = elementCompliance.filter(e => e.overallStatus === 'non-compliant').length;
    const reviewRequired = elementCompliance.filter(e => e.overallStatus === 'requires-review').length;
    
    const complianceRating = totalElements > 0 ? 
      Math.round((compliantElements / totalElements) * 100) : 0;

    return {
      totalElements,
      compliantElements,
      nonCompliantElements,
      reviewRequired,
      complianceRating
    };
  }

  /**
   * Get code references used
   */
  private getCodeReferences(): any {
    return {
      sni2847Articles: [
        'Pasal 5.1.1 - Kuat Tekan Beton',
        'Pasal 7.12.2.1 - Tulangan Minimum Pelat',
        'Pasal 9.5 - Kuat Geser Balok',
        'Pasal 9.6.1 - Tulangan Balok',
        'Pasal 10.9.1 - Tulangan Kolom',
        'Pasal 11.9.9 - Tulangan Dinding',
        'Pasal 12.2 - Panjang Penyaluran Tarik',
        'Pasal 24.2 - Kontrol Lendutan',
        'Pasal 24.3.2 - Kontrol Retak'
      ],
      sni1729Articles: [
        'Pasal 10.1.1 - Faktor Keamanan',
        'Pasal 10.2.1 - Tekuk Lateral Torsional',
        'Pasal 10.3.1 - Kolom Tertekan',
        'Pasal 11 - Kelelahan',
        'Pasal 13 - Sambungan'
      ],
      additionalCodes: [
        'SNI 1726:2019 - Tahan Gempa',
        'SNI 8460:2017 - Persyaratan Beton Struktural',
        'PBBI 1971 - Peraturan Beton Indonesia'
      ]
    };
  }

  /**
   * Export compliance report to JSON
   */
  public exportComplianceReport(report: ComplianceReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Clear all compliance results
   */
  public clearResults(): void {
    this.complianceResults.clear();
  }
}

export default SNIComplianceEngine;