/**
 * Analysis Results Interface
 * Unified interface for managing and displaying structural analysis results
 */

import { StaticAnalysisResults } from './StaticAnalysisEngine';
import { DynamicAnalysisResults } from './DynamicAnalysisEngine';

export interface AnalysisMetadata {
  projectName: string;
  analysisDate: Date;
  engineerName: string;
  analysisType: 'static' | 'dynamic' | 'combined';
  codeReferences: string[];
  analysisMethod: string;
  softwareVersion: string;
  computationTime: number; // milliseconds
}

export interface AnalysisValidation {
  isValid: boolean;
  errors: AnalysisError[];
  warnings: AnalysisWarning[];
  compliance: ComplianceCheck[];
}

export interface AnalysisError {
  id: string;
  severity: 'critical' | 'major' | 'minor';
  category: 'input' | 'calculation' | 'compliance' | 'convergence';
  message: string;
  location?: string;
  recommendation?: string;
}

export interface AnalysisWarning {
  id: string;
  category: 'assumption' | 'approximation' | 'recommendation';
  message: string;
  impact: 'low' | 'medium' | 'high';
}

export interface ComplianceCheck {
  code: string; // SNI 1726, SNI 1727, etc.
  section: string;
  requirement: string;
  actualValue: number;
  limitValue: number;
  unit: string;
  status: 'pass' | 'fail' | 'warning';
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceSummary {
  overallRating: 'excellent' | 'good' | 'adequate' | 'inadequate' | 'unsafe';
  structuralPerformance: {
    strength: number; // 0-100
    stability: number;
    serviceability: number;
    durability: number;
  };
  seismicPerformance?: {
    lateralResistance: number;
    driftControl: number;
    redundancy: number;
    regularity: number;
  };
  riskAssessment: {
    collapseProbability: number;
    economicLoss: number;
    lifeRisk: number;
  };
}

export interface CombinedAnalysisResults {
  metadata: AnalysisMetadata;
  validation: AnalysisValidation;
  staticAnalysis?: StaticAnalysisResults;
  dynamicAnalysis?: DynamicAnalysisResults;
  performanceSummary: PerformanceSummary;
  designRecommendations: DesignRecommendation[];
  costImplications: CostAnalysis;
}

export interface DesignRecommendation {
  category: 'structural' | 'seismic' | 'foundation' | 'material' | 'construction';
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  technicalBasis: string;
  estimatedCostImpact?: number;
  timelineImpact?: string;
}

export interface CostAnalysis {
  structuralCost: {
    concrete: number;
    steel: number;
    formwork: number;
    labor: number;
    total: number;
  };
  seismicUpgrades?: {
    baseCost: number;
    upgradeCost: number;
    savings: number;
  };
  lifecycle: {
    initial: number;
    maintenance: number;
    replacement: number;
    total: number;
  };
  pricePerSquareMeter: number;
  currency: string;
}

export class AnalysisResultsManager {
  private results: CombinedAnalysisResults;
  
  constructor(metadata: AnalysisMetadata) {
    this.results = {
      metadata,
      validation: {
        isValid: false,
        errors: [],
        warnings: [],
        compliance: []
      },
      performanceSummary: {
        overallRating: 'inadequate',
        structuralPerformance: {
          strength: 0,
          stability: 0,
          serviceability: 0,
          durability: 0
        },
        riskAssessment: {
          collapseProbability: 0,
          economicLoss: 0,
          lifeRisk: 0
        }
      },
      designRecommendations: [],
      costImplications: {
        structuralCost: {
          concrete: 0,
          steel: 0,
          formwork: 0,
          labor: 0,
          total: 0
        },
        lifecycle: {
          initial: 0,
          maintenance: 0,
          replacement: 0,
          total: 0
        },
        pricePerSquareMeter: 0,
        currency: 'IDR'
      }
    };
  }

  /**
   * Add static analysis results
   */
  public addStaticAnalysis(staticResults: StaticAnalysisResults): void {
    this.results.staticAnalysis = staticResults;
    this.validateStaticResults(staticResults);
    this.updatePerformanceSummary();
  }

  /**
   * Add dynamic analysis results
   */
  public addDynamicAnalysis(dynamicResults: DynamicAnalysisResults): void {
    this.results.dynamicAnalysis = dynamicResults;
    this.validateDynamicResults(dynamicResults);
    this.updatePerformanceSummary();
  }

  /**
   * Validate static analysis results
   */
  private validateStaticResults(results: StaticAnalysisResults): void {
    const { validation } = this.results;

    // Check utilization ratios
    if (results.utilization.maxUtilization > 1.0) {
      validation.errors.push({
        id: 'UTIL_EXCEED',
        severity: 'critical',
        category: 'calculation',
        message: `Maximum utilization ratio exceeds 1.0 (${(results.utilization.maxUtilization * 100).toFixed(1)}%)`,
        location: results.utilization.criticalMember,
        recommendation: 'Increase member sizes or reduce loads'
      });
    } else if (results.utilization.maxUtilization > 0.9) {
      validation.warnings.push({
        id: 'UTIL_HIGH',
        category: 'recommendation',
        message: `High utilization ratio detected (${(results.utilization.maxUtilization * 100).toFixed(1)}%)`,
        impact: 'medium'
      });
    }

    // Check deflections
    if (!results.deflections.serviceabilityCheck) {
      validation.errors.push({
        id: 'DEFL_EXCEED',
        severity: 'major',
        category: 'compliance',
        message: 'Deflection limits exceeded per SNI requirements',
        recommendation: 'Increase member stiffness or reduce spans'
      });
    }

    // Check drift ratio
    if (results.deflections.driftRatio > 0.0025) {
      validation.errors.push({
        id: 'DRIFT_EXCEED',
        severity: 'major',
        category: 'compliance',
        message: `Inter-story drift ratio exceeds limit (${(results.deflections.driftRatio * 100).toFixed(3)}% > 0.25%)`,
        recommendation: 'Increase lateral stiffness'
      });
    }

    // Add compliance checks
    validation.compliance.push({
      code: 'SNI 1727',
      section: '4.3',
      requirement: 'Maximum Utilization Ratio',
      actualValue: results.utilization.maxUtilization,
      limitValue: 1.0,
      unit: 'ratio',
      status: results.utilization.maxUtilization <= 1.0 ? 'pass' : 'fail',
      criticalityLevel: results.utilization.maxUtilization > 1.0 ? 'critical' : 'low'
    });

    validation.compliance.push({
      code: 'SNI 1727',
      section: '4.6',
      requirement: 'Serviceability Deflection',
      actualValue: results.deflections.maxVertical,
      limitValue: results.deflections.maxVertical * 1.5, // Approximate limit
      unit: 'mm',
      status: results.deflections.serviceabilityCheck ? 'pass' : 'fail',
      criticalityLevel: results.deflections.serviceabilityCheck ? 'low' : 'high'
    });
  }

  /**
   * Validate dynamic analysis results
   */
  private validateDynamicResults(results: DynamicAnalysisResults): void {
    const { validation } = this.results;

    // Check modal participation
    const minParticipation = 0.90; // 90% minimum per SNI 1726
    if (results.modalAnalysis.participatingMass.x < minParticipation) {
      validation.warnings.push({
        id: 'MODAL_PART_X',
        category: 'assumption',
        message: `Modal participation in X direction is ${(results.modalAnalysis.participatingMass.x * 100).toFixed(1)}% (< 90%)`,
        impact: 'high'
      });
    }

    if (results.modalAnalysis.participatingMass.y < minParticipation) {
      validation.warnings.push({
        id: 'MODAL_PART_Y',
        category: 'assumption',
        message: `Modal participation in Y direction is ${(results.modalAnalysis.participatingMass.y * 100).toFixed(1)}% (< 90%)`,
        impact: 'high'
      });
    }

    // Check fundamental period limits
    const fundamentalPeriod = results.modalAnalysis.modes[0].period;
    const maxAllowablePeriod = 2.0; // Simplified limit
    
    if (fundamentalPeriod > maxAllowablePeriod) {
      validation.warnings.push({
        id: 'PERIOD_HIGH',
        category: 'recommendation',
        message: `Fundamental period is high (${fundamentalPeriod.toFixed(3)}s)`,
        impact: 'medium'
      });
    }

    // Check drift compliance
    if (!results.driftCheck.compliant) {
      validation.errors.push({
        id: 'SEISMIC_DRIFT',
        severity: 'major',
        category: 'compliance',
        message: `Seismic drift exceeds limits (${(results.driftCheck.driftRatio * 100).toFixed(2)}% > 2.0%)`,
        recommendation: 'Increase lateral stiffness or add damping'
      });
    }

    // Add seismic compliance checks
    validation.compliance.push({
      code: 'SNI 1726',
      section: '7.8.6',
      requirement: 'Story Drift Limit',
      actualValue: results.driftCheck.maxDrift * 1000,
      limitValue: results.driftCheck.allowableDrift * 1000,
      unit: 'mm',
      status: results.driftCheck.compliant ? 'pass' : 'fail',
      criticalityLevel: results.driftCheck.compliant ? 'low' : 'high'
    });

    validation.compliance.push({
      code: 'SNI 1726',
      section: '12.9.1',
      requirement: 'Modal Participation X',
      actualValue: results.modalAnalysis.participatingMass.x * 100,
      limitValue: 90,
      unit: '%',
      status: results.modalAnalysis.participatingMass.x >= 0.9 ? 'pass' : 'warning',
      criticalityLevel: results.modalAnalysis.participatingMass.x >= 0.9 ? 'low' : 'medium'
    });
  }

  /**
   * Update performance summary based on analysis results
   */
  private updatePerformanceSummary(): void {
    const { staticAnalysis, dynamicAnalysis } = this.results;
    let summary = this.results.performanceSummary;

    if (staticAnalysis) {
      // Strength performance
      const utilization = staticAnalysis.utilization.maxUtilization;
      summary.structuralPerformance.strength = Math.max(0, (1 - utilization) * 100);

      // Serviceability performance
      summary.structuralPerformance.serviceability = staticAnalysis.deflections.serviceabilityCheck ? 90 : 40;

      // Stability performance
      const safetyFactor = staticAnalysis.utilization.safetyFactor;
      summary.structuralPerformance.stability = Math.min(100, safetyFactor * 40);

      // Durability (simplified based on material properties)
      summary.structuralPerformance.durability = 80; // Default good rating
    }

    if (dynamicAnalysis) {
      // Seismic performance
      summary.seismicPerformance = {
        lateralResistance: dynamicAnalysis.driftCheck.compliant ? 85 : 50,
        driftControl: dynamicAnalysis.driftCheck.compliant ? 90 : 40,
        redundancy: dynamicAnalysis.irregularityCheck.requiresDynamic ? 60 : 80,
        regularity: dynamicAnalysis.irregularityCheck.planIrregularity ? 50 : 90
      };
    }

    // Overall rating
    const avgStructural = Object.values(summary.structuralPerformance)
      .reduce((sum, val) => sum + val, 0) / 4;

    if (avgStructural >= 90) summary.overallRating = 'excellent';
    else if (avgStructural >= 75) summary.overallRating = 'good';
    else if (avgStructural >= 60) summary.overallRating = 'adequate';
    else if (avgStructural >= 40) summary.overallRating = 'inadequate';
    else summary.overallRating = 'unsafe';

    // Update validation status
    this.results.validation.isValid = this.results.validation.errors.length === 0;
  }

  /**
   * Generate design recommendations
   */
  public generateRecommendations(): void {
    const recommendations: DesignRecommendation[] = [];
    const { validation, staticAnalysis, dynamicAnalysis } = this.results;

    // Static analysis recommendations
    if (staticAnalysis) {
      if (staticAnalysis.utilization.maxUtilization > 0.9) {
        recommendations.push({
          category: 'structural',
          priority: staticAnalysis.utilization.maxUtilization > 1.0 ? 'critical' : 'high',
          description: 'Increase structural member sizes to reduce utilization ratio',
          technicalBasis: `Current max utilization: ${(staticAnalysis.utilization.maxUtilization * 100).toFixed(1)}%`,
          estimatedCostImpact: 15000000 // IDR
        });
      }

      if (!staticAnalysis.deflections.serviceabilityCheck) {
        recommendations.push({
          category: 'structural',
          priority: 'high',
          description: 'Increase member stiffness to control deflections',
          technicalBasis: 'Deflection limits exceeded per SNI 1727',
          estimatedCostImpact: 10000000
        });
      }
    }

    // Dynamic analysis recommendations
    if (dynamicAnalysis) {
      if (!dynamicAnalysis.driftCheck.compliant) {
        recommendations.push({
          category: 'seismic',
          priority: 'critical',
          description: 'Add shear walls or braced frames to control lateral drift',
          technicalBasis: `Current drift ratio: ${(dynamicAnalysis.driftCheck.driftRatio * 100).toFixed(2)}%`,
          estimatedCostImpact: 25000000
        });
      }

      if (dynamicAnalysis.irregularityCheck.torsionalIrregularity) {
        recommendations.push({
          category: 'seismic',
          priority: 'medium',
          description: 'Redistribute lateral force-resisting elements to reduce torsion',
          technicalBasis: 'Torsional irregularity detected',
          estimatedCostImpact: 12000000
        });
      }

      if (dynamicAnalysis.seismicCategory.sdc === 'D') {
        recommendations.push({
          category: 'seismic',
          priority: 'high',
          description: 'Consider special moment-resisting frame detailing for SDC D',
          technicalBasis: 'High seismicity region requires special detailing',
          estimatedCostImpact: 20000000
        });
      }
    }

    this.results.designRecommendations = recommendations;
  }

  /**
   * Get complete analysis results
   */
  public getResults(): CombinedAnalysisResults {
    return this.results;
  }

  /**
   * Export results to different formats
   */
  public exportResults(format: 'json' | 'summary' | 'report'): any {
    switch (format) {
      case 'json':
        return JSON.stringify(this.results, null, 2);
      
      case 'summary':
        return this.generateSummaryReport();
      
      case 'report':
        return this.generateDetailedReport();
      
      default:
        return this.results;
    }
  }

  /**
   * Generate summary report
   */
  private generateSummaryReport(): string {
    const { performanceSummary, validation } = this.results;
    
    return `
STRUCTURAL ANALYSIS SUMMARY REPORT
=================================

Overall Rating: ${performanceSummary.overallRating.toUpperCase()}

Structural Performance:
- Strength: ${performanceSummary.structuralPerformance.strength.toFixed(0)}%
- Stability: ${performanceSummary.structuralPerformance.stability.toFixed(0)}%
- Serviceability: ${performanceSummary.structuralPerformance.serviceability.toFixed(0)}%
- Durability: ${performanceSummary.structuralPerformance.durability.toFixed(0)}%

${performanceSummary.seismicPerformance ? `
Seismic Performance:
- Lateral Resistance: ${performanceSummary.seismicPerformance.lateralResistance.toFixed(0)}%
- Drift Control: ${performanceSummary.seismicPerformance.driftControl.toFixed(0)}%
- Redundancy: ${performanceSummary.seismicPerformance.redundancy.toFixed(0)}%
- Regularity: ${performanceSummary.seismicPerformance.regularity.toFixed(0)}%
` : ''}

Validation Status: ${validation.isValid ? 'PASSED' : 'FAILED'}
- Errors: ${validation.errors.length}
- Warnings: ${validation.warnings.length}
- Compliance Checks: ${validation.compliance.length}

Critical Actions Required: ${validation.errors.filter(e => e.severity === 'critical').length}
    `.trim();
  }

  /**
   * Generate detailed report
   */
  private generateDetailedReport(): string {
    // This would generate a comprehensive technical report
    // Including all calculations, checks, and recommendations
    return `Detailed report functionality would be implemented here with comprehensive technical details.`;
  }
}

export default AnalysisResultsManager;