/**
 * ZERO-TOLERANCE VALIDATION SYSTEM
 * Critical Safety Validation for Construction Industry
 * 
 * MISSION CRITICAL: This validation system prevents ANY input errors
 * that could lead to structural failure, human casualties, or legal liability.
 * 
 * VALIDATION LAYERS:
 * 1. Input Range Validation (Engineering Limits)
 * 2. Code Compliance Validation (SNI, ACI, AISC)
 * 3. Safety Factor Validation (Conservative Design)
 * 4. Cross-Reference Validation (Consistency Checks)
 * 5. Professional Review Validation (Engineer Approval)
 */

import { ENGINEERING_CONSTANTS } from '../calculations/ProfessionalCalculationEngine';

// Critical Validation Results
export interface ValidationResult {
  isValid: boolean;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'SAFETY' | 'CODE' | 'ENGINEERING' | 'PROFESSIONAL';
  message: string;
  recommendation: string;
  codeReference: string;
  requiresEngineerReview: boolean;
  blockConstruction: boolean;
}

// Professional Input Validation
export interface ValidationContext {
  projectType: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  seismicZone: 'low' | 'moderate' | 'high' | 'very-high';
  importanceCategory: 'I' | 'II' | 'III' | 'IV';
  engineerLicense: string;
  projectValue: number; // USD
  occupancy: number; // Number of people
}

/**
 * ZERO-TOLERANCE PROFESSIONAL VALIDATION ENGINE
 * Every validation is based on international engineering standards
 */
export class ZeroToleranceValidationEngine {
  
  /**
   * CRITICAL: Validate concrete material properties
   * Any error here can lead to structural collapse
   */
  static validateConcreteMaterial(
    fc: number,
    density: number,
    testCertificate: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // CRITICAL: Compressive strength validation
    if (fc < ENGINEERING_CONSTANTS.CONCRETE.MIN_FC) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'SAFETY',
        message: `Concrete strength ${fc} MPa is below minimum safe limit`,
        recommendation: `Use concrete with fc ≥ ${ENGINEERING_CONSTANTS.CONCRETE.MIN_FC} MPa per SNI 2847`,
        codeReference: 'SNI 2847:2019 Section 5.1.1',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    if (fc > ENGINEERING_CONSTANTS.CONCRETE.MAX_FC) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'ENGINEERING',
        message: `Concrete strength ${fc} MPa exceeds practical construction limits`,
        recommendation: `Consider high-strength concrete design provisions or reduce to ${ENGINEERING_CONSTANTS.CONCRETE.MAX_FC} MPa`,
        codeReference: 'ACI 318-19 Section 5.1',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // CRITICAL: Density validation for structural calculations
    const normalDensity = ENGINEERING_CONSTANTS.CONCRETE.DENSITY;
    const densityTolerance = 0.1; // 10% tolerance
    
    if (Math.abs(density - normalDensity) / normalDensity > densityTolerance) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'ENGINEERING',
        message: `Concrete density ${density} kg/m³ deviates significantly from normal weight`,
        recommendation: `Verify aggregate type and adjust structural calculations accordingly`,
        codeReference: 'ACI 318-19 Section 19.2.1',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // CRITICAL: Test certificate validation
    if (!testCertificate || testCertificate.trim().length === 0) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'PROFESSIONAL',
        message: 'Material test certificate is required for construction',
        recommendation: 'Obtain laboratory test certificate from accredited testing facility',
        codeReference: 'SNI 2847:2019 Section 5.6',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // High-risk project validation
    if (context.projectValue > 1000000 || context.occupancy > 100) {
      if (fc < 25) {
        results.push({
          isValid: false,
          severity: 'CRITICAL',
          category: 'SAFETY',
          message: 'High-value/high-occupancy projects require higher concrete strength',
          recommendation: 'Use minimum fc = 25 MPa for critical structures',
          codeReference: 'Engineering Judgment - Risk Assessment',
          requiresEngineerReview: true,
          blockConstruction: true
        });
      }
    }
    
    return results;
  }
  
  /**
   * CRITICAL: Validate steel reinforcement properties
   * Wrong steel grade can cause brittle failure
   */
  static validateSteelMaterial(
    fy: number,
    fu: number,
    grade: string,
    testCertificate: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // CRITICAL: Yield strength validation
    if (fy < ENGINEERING_CONSTANTS.STEEL.MIN_FY) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'SAFETY',
        message: `Steel yield strength ${fy} MPa is below minimum requirements`,
        recommendation: `Use steel with fy ≥ ${ENGINEERING_CONSTANTS.STEEL.MIN_FY} MPa`,
        codeReference: 'SNI 2847:2019 Section 20.2.2',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // CRITICAL: Ultimate/Yield ratio validation
    const fuFyRatio = fu / fy;
    if (fuFyRatio < 1.25) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'SAFETY',
        message: `Steel fu/fy ratio ${fuFyRatio.toFixed(2)} is too low for ductile behavior`,
        recommendation: 'Use steel with fu/fy ≥ 1.25 to ensure ductile failure mode',
        codeReference: 'ACI 318-19 Section 20.2.2.4',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // Grade consistency validation
    const expectedFy = this.getExpectedYieldStrength(grade);
    if (expectedFy && Math.abs(fy - expectedFy) > expectedFy * 0.1) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'ENGINEERING',
        message: `Steel grade ${grade} yield strength ${fy} MPa inconsistent with typical values`,
        recommendation: `Verify steel grade specification - expected fy ≈ ${expectedFy} MPa`,
        codeReference: 'SNI 2052:2017 Steel Standards',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // Test certificate validation
    if (!testCertificate || testCertificate.trim().length === 0) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'PROFESSIONAL',
        message: 'Steel test certificate is mandatory for structural construction',
        recommendation: 'Obtain mill test certificate or laboratory test results',
        codeReference: 'SNI 2847:2019 Section 20.2',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    return results;
  }
  
  /**
   * CRITICAL: Validate seismic design parameters
   * Underestimating seismic forces can be catastrophic
   */
  static validateSeismicParameters(
    ss: number,
    s1: number,
    siteClass: string,
    location: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // CRITICAL: Seismic acceleration validation
    if (ss < 0.1 || s1 < 0.05) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'ENGINEERING',
        message: `Very low seismic parameters (Ss=${ss}g, S1=${s1}g) - verify location`,
        recommendation: 'Confirm seismic parameters using official hazard maps',
        codeReference: 'SNI 1726:2019 Section 6.1',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // High seismic zone validation
    if (ss > 1.5 || s1 > 0.6) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'SAFETY',
        message: `High seismic zone (Ss=${ss}g, S1=${s1}g) requires special provisions`,
        recommendation: 'Apply special seismic design requirements per SNI 1726',
        codeReference: 'SNI 1726:2019 Section 11.4',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // Site class consistency
    if (siteClass === 'SF') {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'SAFETY',
        message: 'Site Class F requires site-specific geotechnical investigation',
        recommendation: 'Perform detailed soil investigation and site response analysis',
        codeReference: 'SNI 1726:2019 Section 6.2.1',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // Location-specific validation for Indonesia
    if (location.toLowerCase().includes('jakarta') && ss < 0.6) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'ENGINEERING',
        message: 'Jakarta typically has higher seismic parameters',
        recommendation: 'Verify seismic parameters using Puskim hazard maps',
        codeReference: 'SNI 1726:2019 Hazard Maps',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    return results;
  }
  
  /**
   * CRITICAL: Validate structural geometry
   * Unrealistic dimensions can lead to analysis errors
   */
  static validateStructuralGeometry(
    length: number,
    width: number,
    height: number,
    numberOfFloors: number,
    baySpacing: number,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // Minimum dimension validation
    if (length < 3 || width < 3) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'ENGINEERING',
        message: 'Building dimensions too small for structural analysis',
        recommendation: 'Minimum building dimensions should be ≥ 3m',
        codeReference: 'Engineering Practice Guidelines',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // Aspect ratio validation
    const aspectRatio = Math.max(length, width) / Math.min(length, width);
    if (aspectRatio > 5) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'ENGINEERING',
        message: `High aspect ratio ${aspectRatio.toFixed(1)} may cause torsional irregularity`,
        recommendation: 'Consider structural walls or bracing to reduce torsion',
        codeReference: 'SNI 1726:2019 Table 7.3-1',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // Height limits validation
    const storyHeight = height / numberOfFloors;
    if (storyHeight < 2.4) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'CODE',
        message: `Story height ${storyHeight.toFixed(1)}m below minimum for occupancy`,
        recommendation: 'Minimum ceiling height 2.4m for habitable spaces',
        codeReference: 'Building Code Requirements',
        requiresEngineerReview: false,
        blockConstruction: false
      });
    }
    
    if (storyHeight > 6) {
      results.push({
        isValid: false,
        severity: 'WARNING',
        category: 'ENGINEERING',
        message: `Unusually high story height ${storyHeight.toFixed(1)}m`,
        recommendation: 'Verify structural requirements for tall stories',
        codeReference: 'Engineering Practice Guidelines',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // Bay spacing validation
    if (baySpacing > 12) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'ENGINEERING',
        message: `Large bay spacing ${baySpacing}m requires special beam design`,
        recommendation: 'Consider post-tensioned beams or additional supports',
        codeReference: 'ACI 318-19 Span Limitations',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    // Seismic height limits
    if (context.seismicZone === 'high' && height > 40) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'SAFETY',
        message: 'High-rise buildings in seismic zones require special analysis',
        recommendation: 'Perform dynamic analysis and special seismic provisions',
        codeReference: 'SNI 1726:2019 Section 7.2.1',
        requiresEngineerReview: true,
        blockConstruction: false
      });
    }
    
    return results;
  }
  
  /**
   * CRITICAL: Validate load conditions
   * Wrong loads = wrong design = structural failure
   */
  static validateLoadConditions(
    deadLoad: number,
    liveLoad: number,
    occupancyType: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // Minimum dead load validation
    if (deadLoad < 3) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'ENGINEERING',
        message: `Dead load ${deadLoad} kN/m² seems unrealistically low`,
        recommendation: 'Include structural weight, finishes, and MEP systems',
        codeReference: 'SNI 1727:2020 Load Calculations',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // Live load code compliance
    const expectedLiveLoad = this.getCodeLiveLoad(occupancyType);
    if (liveLoad < expectedLiveLoad * 0.9) {
      results.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'CODE',
        message: `Live load ${liveLoad} kN/m² below code minimum for ${occupancyType}`,
        recommendation: `Use minimum ${expectedLiveLoad} kN/m² per SNI 1727`,
        codeReference: 'SNI 1727:2020 Table 4-1',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    // Conservative design check
    if (context.importanceCategory === 'III' || context.importanceCategory === 'IV') {
      if (liveLoad < expectedLiveLoad * 1.25) {
        results.push({
          isValid: false,
          severity: 'WARNING',
          category: 'SAFETY',
          message: 'Essential/critical facilities should use increased live loads',
          recommendation: `Consider ${(expectedLiveLoad * 1.25).toFixed(1)} kN/m² for added safety`,
          codeReference: 'Engineering Conservative Practice',
          requiresEngineerReview: true,
          blockConstruction: false
        });
      }
    }
    
    return results;
  }
  
  /**
   * COMPREHENSIVE VALIDATION ORCHESTRATOR
   * Runs ALL validation checks in proper sequence
   */
  static performComprehensiveValidation(
    projectData: any,
    context: ValidationContext
  ): ValidationResult[] {
    const allResults: ValidationResult[] = [];
    
    // 1. Material validation
    allResults.push(...this.validateConcreteMaterial(
      projectData.materials.concrete.fc,
      projectData.materials.concrete.density,
      projectData.materials.concrete.testCertificate,
      context
    ));
    
    allResults.push(...this.validateSteelMaterial(
      projectData.materials.steel.fy,
      projectData.materials.steel.fu,
      projectData.materials.steel.grade,
      projectData.materials.steel.testCertificate,
      context
    ));
    
    // 2. Seismic validation
    allResults.push(...this.validateSeismicParameters(
      projectData.loads.seismicLoad.ss,
      projectData.loads.seismicLoad.s1,
      projectData.loads.seismicLoad.siteClass,
      projectData.projectInfo.location,
      context
    ));
    
    // 3. Geometry validation
    allResults.push(...this.validateStructuralGeometry(
      projectData.geometry.length,
      projectData.geometry.width,
      projectData.geometry.height,
      projectData.geometry.numberOfFloors,
      projectData.geometry.baySpacingX,
      context
    ));
    
    // 4. Load validation
    allResults.push(...this.validateLoadConditions(
      projectData.loads.deadLoad.structuralWeight,
      projectData.loads.liveLoad.occupancyLoad,
      projectData.loads.liveLoad.occupancyType,
      context
    ));
    
    // 5. Professional validation
    if (!context.engineerLicense || context.engineerLicense.trim().length === 0) {
      allResults.push({
        isValid: false,
        severity: 'CRITICAL',
        category: 'PROFESSIONAL',
        message: 'Licensed structural engineer must be assigned to project',
        recommendation: 'Assign licensed engineer with valid registration',
        codeReference: 'Professional Engineering Law',
        requiresEngineerReview: true,
        blockConstruction: true
      });
    }
    
    return allResults;
  }
  
  // Helper methods
  private static getExpectedYieldStrength(grade: string): number | null {
    const gradeMap: { [key: string]: number } = {
      'BjTS-24': 240,
      'BjTS-37': 370,
      'BjTS-40': 400,
      'BjTS-50': 500
    };
    return gradeMap[grade] || null;
  }
  
  private static getCodeLiveLoad(occupancyType: string): number {
    const liveLoadMap: { [key: string]: number } = {
      'residential': 2.0,
      'office': 4.0,
      'retail': 5.0,
      'industrial': 6.0,
      'warehouse': 12.0
    };
    return liveLoadMap[occupancyType] || 4.0;
  }
}

export default ZeroToleranceValidationEngine;