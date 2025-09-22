/**
 * Advanced Input Validation System
 * Real-time validation with SNI compliance checks
 */

import type { 
  ProjectInfo, 
  StructuralGeometry, 
  MaterialProperties, 
  SeismicParameters,
  ValidationError,
  ValidationResult
} from '../types/structural-interfaces';

// ============ VALIDATION FUNCTIONS ============

export class StructuralValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];
  private info: ValidationError[] = [];

  // Clear all validation messages
  clear(): void {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  // Add validation error
  addError(field: string, message: string, code?: string, suggestion?: string): void {
    this.errors.push({
      field,
      message,
      severity: 'error',
      code,
      suggestion
    });
  }

  // Add validation warning
  addWarning(field: string, message: string, code?: string, suggestion?: string): void {
    this.warnings.push({
      field,
      message,
      severity: 'warning',
      code,
      suggestion
    });
  }

  // Add validation info
  addInfo(field: string, message: string, code?: string): void {
    this.info.push({
      field,
      message,
      severity: 'info',
      code
    });
  }

  // Get validation result
  getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info
    };
  }

  // Validate project information
  validateProject(project: Partial<ProjectInfo>): ValidationResult {
    this.clear();

    // Required field validations
    if (!project.id || project.id.trim() === '') {
      this.addError('id', 'Project ID is required', 'REQUIRED_FIELD');
    }

    if (!project.name || project.name.trim() === '') {
      this.addError('name', 'Project name is required', 'REQUIRED_FIELD');
    } else {
      if (project.name.length < 3) {
        this.addError('name', 'Project name must be at least 3 characters', 'MIN_LENGTH');
      }
      if (project.name.length > 100) {
        this.addError('name', 'Project name must not exceed 100 characters', 'MAX_LENGTH');
      }
      if (!/^[a-zA-Z0-9\s\-_()]+$/.test(project.name)) {
        this.addError('name', 'Project name contains invalid characters', 'INVALID_PATTERN');
      }
    }

    if (!project.location || project.location.trim() === '') {
      this.addError('location', 'Location is required', 'REQUIRED_FIELD');
    } else {
      if (project.location.length < 3) {
        this.addError('location', 'Location must be at least 3 characters', 'MIN_LENGTH');
      }
      if (project.location.length > 200) {
        this.addError('location', 'Location must not exceed 200 characters', 'MAX_LENGTH');
      }
    }

    if (!project.engineer || project.engineer.trim() === '') {
      this.addError('engineer', 'Engineer name is required', 'REQUIRED_FIELD');
    } else {
      if (project.engineer.length < 3) {
        this.addError('engineer', 'Engineer name must be at least 3 characters', 'MIN_LENGTH');
      }
      if (project.engineer.length > 100) {
        this.addError('engineer', 'Engineer name must not exceed 100 characters', 'MAX_LENGTH');
      }
    }

    // Optional field validations
    if (project.company && project.company.length > 100) {
      this.addError('company', 'Company name must not exceed 100 characters', 'MAX_LENGTH');
    }

    if (project.description && project.description.length > 500) {
      this.addError('description', 'Description must not exceed 500 characters', 'MAX_LENGTH');
    }

    // Enum validations
    const validBuildingTypes = ['residential', 'office', 'commercial', 'industrial', 'public'];
    if (project.buildingType && !validBuildingTypes.includes(project.buildingType)) {
      this.addError('buildingType', 'Invalid building type', 'INVALID_ENUM');
    }

    const validImportanceClasses = ['I', 'II', 'III', 'IV'];
    if (project.importanceClass && !validImportanceClasses.includes(project.importanceClass)) {
      this.addError('importanceClass', 'Invalid importance class', 'INVALID_ENUM');
    }

    // Design life validation
    if (project.designLife !== undefined) {
      if (project.designLife < 10) {
        this.addError('designLife', 'Design life must be at least 10 years', 'MIN_VALUE');
      }
      if (project.designLife > 200) {
        this.addError('designLife', 'Design life must not exceed 200 years', 'MAX_VALUE');
      }
      if (!Number.isInteger(project.designLife)) {
        this.addError('designLife', 'Design life must be a whole number', 'INVALID_TYPE');
      }
    }

    // Business logic validations
    if (project.buildingType === 'residential' && project.importanceClass === 'IV') {
      this.addWarning(
        'importanceClass',
        'Importance Class IV is unusual for residential buildings',
        'BUILDING_TYPE_MISMATCH',
        'Consider reviewing building classification'
      );
    }

    return this.getResult();
  }

  // Validate geometry with SNI compliance
  validateGeometry(geometry: Partial<StructuralGeometry>): ValidationResult {
    this.clear();

    // Building dimensions validation
    if (geometry.buildingDimensions) {
      const { length, width, height } = geometry.buildingDimensions;
      
      if (length !== undefined) {
        if (length < 3) {
          this.addError('buildingDimensions.length', 'Building length must be at least 3 meters', 'MIN_VALUE');
        }
        if (length > 500) {
          this.addError('buildingDimensions.length', 'Building length must not exceed 500 meters', 'MAX_VALUE');
        }
      }

      if (width !== undefined) {
        if (width < 3) {
          this.addError('buildingDimensions.width', 'Building width must be at least 3 meters', 'MIN_VALUE');
        }
        if (width > 500) {
          this.addError('buildingDimensions.width', 'Building width must not exceed 500 meters', 'MAX_VALUE');
        }
      }

      if (height !== undefined) {
        if (height < 2.5) {
          this.addError('buildingDimensions.height', 'Building height must be at least 2.5 meters', 'MIN_VALUE');
        }
        if (height > 300) {
          this.addError('buildingDimensions.height', 'Building height must not exceed 300 meters', 'MAX_VALUE');
        }
        if (height > 40) {
          this.addInfo(
            'buildingDimensions.height',
            'Buildings over 40m require special seismic considerations (SNI 1726:2019)',
            'SNI_HEIGHT_LIMIT'
          );
        }
      }

      // Aspect ratio check
      if (length && width) {
        const aspectRatio = Math.max(length, width) / Math.min(length, width);
        if (aspectRatio > 5) {
          this.addWarning(
            'buildingDimensions',
            `High aspect ratio (${aspectRatio.toFixed(1)}:1) may cause torsional irregularity`,
            'SNI_ASPECT_RATIO',
            'Consider adding structural walls or reducing aspect ratio'
          );
        }
      }
    }

    // Floor height validation
    if (geometry.floorHeight !== undefined) {
      if (geometry.floorHeight < 2.5) {
        this.addError('floorHeight', 'Floor height must be at least 2.5 meters (SNI requirement)', 'MIN_VALUE');
      }
      if (geometry.floorHeight > 10) {
        this.addError('floorHeight', 'Floor height must not exceed 10 meters', 'MAX_VALUE');
      }
    }

    // Number of floors validation
    if (geometry.numberOfFloors !== undefined) {
      if (geometry.numberOfFloors < 1) {
        this.addError('numberOfFloors', 'Must have at least 1 floor', 'MIN_VALUE');
      }
      if (geometry.numberOfFloors > 100) {
        this.addError('numberOfFloors', 'Maximum 100 floors allowed', 'MAX_VALUE');
      }
      if (!Number.isInteger(geometry.numberOfFloors)) {
        this.addError('numberOfFloors', 'Number of floors must be a whole number', 'INVALID_TYPE');
      }
      if (geometry.numberOfFloors > 10) {
        this.addInfo(
          'numberOfFloors',
          'Buildings over 10 floors require special design considerations',
          'HIGH_RISE_REQUIREMENTS'
        );
      }
    }

    // Bays validation
    if (geometry.baysX !== undefined) {
      if (geometry.baysX < 1) {
        this.addError('baysX', 'Must have at least 1 bay in X direction', 'MIN_VALUE');
      }
      if (geometry.baysX > 20) {
        this.addError('baysX', 'Maximum 20 bays in X direction', 'MAX_VALUE');
      }
      if (!Number.isInteger(geometry.baysX)) {
        this.addError('baysX', 'Number of bays must be a whole number', 'INVALID_TYPE');
      }
    }

    if (geometry.baysY !== undefined) {
      if (geometry.baysY < 1) {
        this.addError('baysY', 'Must have at least 1 bay in Y direction', 'MIN_VALUE');
      }
      if (geometry.baysY > 20) {
        this.addError('baysY', 'Maximum 20 bays in Y direction', 'MAX_VALUE');
      }
      if (!Number.isInteger(geometry.baysY)) {
        this.addError('baysY', 'Number of bays must be a whole number', 'INVALID_TYPE');
      }
    }

    return this.getResult();
  }

  // Validate material properties
  validateMaterials(materials: Partial<MaterialProperties>): ValidationResult {
    this.clear();

    // Concrete validation
    if (materials.concrete) {
      const concrete = materials.concrete;

      if (concrete.fc !== undefined) {
        if (concrete.fc < 15) {
          this.addError('concrete.fc', 'Concrete strength must be at least 15 MPa (SNI minimum)', 'MIN_VALUE');
        }
        if (concrete.fc > 80) {
          this.addError('concrete.fc', 'Concrete strength must not exceed 80 MPa', 'MAX_VALUE');
        }
      }

      if (concrete.ec !== undefined) {
        if (concrete.ec < 15000) {
          this.addError('concrete.ec', 'Elastic modulus too low', 'MIN_VALUE');
        }
        if (concrete.ec > 50000) {
          this.addError('concrete.ec', 'Elastic modulus too high', 'MAX_VALUE');
        }
      }

      if (concrete.density !== undefined) {
        if (concrete.density < 2200) {
          this.addError('concrete.density', 'Concrete density must be at least 2200 kg/m³', 'MIN_VALUE');
        }
        if (concrete.density > 2600) {
          this.addError('concrete.density', 'Concrete density must not exceed 2600 kg/m³', 'MAX_VALUE');
        }
      }

      if (concrete.poissonRatio !== undefined) {
        if (concrete.poissonRatio < 0.1) {
          this.addError('concrete.poissonRatio', 'Poisson ratio too low', 'MIN_VALUE');
        }
        if (concrete.poissonRatio > 0.3) {
          this.addError('concrete.poissonRatio', 'Poisson ratio too high', 'MAX_VALUE');
        }
      }

      if (!concrete.grade || concrete.grade.trim() === '') {
        this.addError('concrete.grade', 'Concrete grade is required', 'REQUIRED_FIELD');
      } else {
        const validGrades = ['K-175', 'K-200', 'K-225', 'K-250', 'K-275', 'K-300', 'K-325', 'K-350', 'K-400', 'K-450', 'K-500'];
        if (!validGrades.includes(concrete.grade)) {
          this.addWarning(
            'concrete.grade',
            'Non-standard concrete grade specified',
            'NON_STANDARD_GRADE',
            `Consider using standard SNI grades: ${validGrades.join(', ')}`
          );
        }
      }

      // Check concrete strength vs. elastic modulus relationship
      if (concrete.fc && concrete.ec) {
        const expectedEc = 4700 * Math.sqrt(concrete.fc); // ACI formula
        const ratio = concrete.ec / expectedEc;
        if (ratio < 0.8 || ratio > 1.2) {
          this.addWarning(
            'concrete.ec',
            'Elastic modulus may not match concrete strength',
            'EC_FC_MISMATCH',
            `Expected Ec ≈ ${expectedEc.toFixed(0)} MPa for fc = ${concrete.fc} MPa`
          );
        }
      }
    }

    // Reinforcement steel validation
    if (materials.reinforcement) {
      const steel = materials.reinforcement;

      if (steel.fy !== undefined) {
        if (steel.fy < 240) {
          this.addError('reinforcement.fy', 'Steel yield strength must be at least 240 MPa', 'MIN_VALUE');
        }
        if (steel.fy > 500) {
          this.addError('reinforcement.fy', 'Steel yield strength must not exceed 500 MPa', 'MAX_VALUE');
        }
      }

      if (steel.fu !== undefined) {
        if (steel.fu < 300) {
          this.addError('reinforcement.fu', 'Steel ultimate strength must be at least 300 MPa', 'MIN_VALUE');
        }
        if (steel.fu > 650) {
          this.addError('reinforcement.fu', 'Steel ultimate strength must not exceed 650 MPa', 'MAX_VALUE');
        }
      }

      if (steel.es !== undefined) {
        if (steel.es < 180000) {
          this.addError('reinforcement.es', 'Steel elastic modulus too low', 'MIN_VALUE');
        }
        if (steel.es > 220000) {
          this.addError('reinforcement.es', 'Steel elastic modulus too high', 'MAX_VALUE');
        }
      }

      if (steel.density !== undefined) {
        if (steel.density < 7800) {
          this.addError('reinforcement.density', 'Steel density must be at least 7800 kg/m³', 'MIN_VALUE');
        }
        if (steel.density > 7900) {
          this.addError('reinforcement.density', 'Steel density must not exceed 7900 kg/m³', 'MAX_VALUE');
        }
      }

      if (steel.poissonRatio !== undefined) {
        if (steel.poissonRatio < 0.25) {
          this.addError('reinforcement.poissonRatio', 'Poisson ratio too low', 'MIN_VALUE');
        }
        if (steel.poissonRatio > 0.35) {
          this.addError('reinforcement.poissonRatio', 'Poisson ratio too high', 'MAX_VALUE');
        }
      }

      if (!steel.grade || steel.grade.trim() === '') {
        this.addError('reinforcement.grade', 'Steel grade is required', 'REQUIRED_FIELD');
      } else {
        const validReinforcementGrades = ['BjTP280', 'BjTS400', 'BjTS420', 'BjTS500'];
        if (!validReinforcementGrades.includes(steel.grade)) {
          this.addWarning(
            'reinforcement.grade',
            'Non-standard reinforcement grade specified',
            'NON_STANDARD_GRADE',
            `Consider using standard SNI grades: ${validReinforcementGrades.join(', ')}`
          );
        }
      }

      // Check fy/fu ratio
      if (steel.fy && steel.fu) {
        const ratio = steel.fy / steel.fu;
        if (ratio > 0.85) {
          this.addWarning(
            'reinforcement',
            'Yield to ultimate strength ratio is high',
            'HIGH_FY_FU_RATIO',
            'Verify steel grade specifications'
          );
        }
      }
    }

    return this.getResult();
  }

  // Validate seismic parameters according to SNI 1726:2019
  validateSeismic(seismic: Partial<SeismicParameters>): ValidationResult {
    this.clear();

    if (seismic.ss !== undefined) {
      if (seismic.ss < 0) {
        this.addError('ss', 'Ss cannot be negative', 'MIN_VALUE');
      }
      if (seismic.ss > 3.0) {
        this.addWarning('ss', 'Ss value seems unusually high', 'HIGH_VALUE');
      }
    }

    if (seismic.s1 !== undefined) {
      if (seismic.s1 < 0) {
        this.addError('s1', 'S1 cannot be negative', 'MIN_VALUE');
      }
      if (seismic.s1 > 2.0) {
        this.addWarning('s1', 'S1 value seems unusually high', 'HIGH_VALUE');
      }
    }

    const validSiteClasses = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF'];
    if (seismic.siteClass && !validSiteClasses.includes(seismic.siteClass)) {
      this.addError('siteClass', 'Invalid site class', 'INVALID_ENUM');
    }

    if (seismic.responseModificationFactor !== undefined) {
      if (seismic.responseModificationFactor < 1) {
        this.addError('responseModificationFactor', 'R factor must be at least 1', 'MIN_VALUE');
      }
      if (seismic.responseModificationFactor > 8) {
        this.addError('responseModificationFactor', 'R factor must not exceed 8', 'MAX_VALUE');
      }
    }

    if (seismic.overstrengthFactor !== undefined) {
      if (seismic.overstrengthFactor < 1) {
        this.addError('overstrengthFactor', 'Overstrength factor must be at least 1', 'MIN_VALUE');
      }
      if (seismic.overstrengthFactor > 5) {
        this.addError('overstrengthFactor', 'Overstrength factor must not exceed 5', 'MAX_VALUE');
      }
    }

    if (seismic.deflectionAmplificationFactor !== undefined) {
      if (seismic.deflectionAmplificationFactor < 1) {
        this.addError('deflectionAmplificationFactor', 'Deflection amplification factor must be at least 1', 'MIN_VALUE');
      }
      if (seismic.deflectionAmplificationFactor > 8) {
        this.addError('deflectionAmplificationFactor', 'Deflection amplification factor must not exceed 8', 'MAX_VALUE');
      }
    }

    const validSeismicCategories = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (seismic.seismicDesignCategory && !validSeismicCategories.includes(seismic.seismicDesignCategory)) {
      this.addError('seismicDesignCategory', 'Invalid seismic design category', 'INVALID_ENUM');
    }

    if (!seismic.structuralSystem || seismic.structuralSystem.trim() === '') {
      this.addError('structuralSystem', 'Structural system description is required', 'REQUIRED_FIELD');
    }

    // SNI 1726:2019 specific validations
    if (seismic.ss && seismic.s1) {
      // Check Ss and S1 consistency
      if (seismic.s1 > seismic.ss) {
        this.addWarning(
          'seismic',
          'S1 should typically be less than Ss',
          'SNI_SEISMIC_CONSISTENCY',
          'Verify seismic hazard map values'
        );
      }
    }

    // Determine appropriate site class warnings
    if (seismic.siteClass === 'SE' || seismic.siteClass === 'SF') {
      this.addInfo(
        'siteClass',
        'Site Class E or F requires special site response analysis',
        'SNI_SITE_CLASS_SPECIAL'
      );
    }

    return this.getResult();
  }

  // Real-time validation for forms
  validateFieldRealTime(field: string, value: any): ValidationError[] {
    const fieldErrors: ValidationError[] = [];

    // Implement real-time validation logic based on field name
    switch (field) {
      case 'fc':
        if (value < 15) {
          fieldErrors.push({
            field,
            message: 'Minimum concrete strength is 15 MPa per SNI requirements',
            severity: 'error',
            code: 'MIN_CONCRETE_STRENGTH'
          });
        }
        break;

      case 'floorHeight':
        if (value < 2.5) {
          fieldErrors.push({
            field,
            message: 'Minimum floor height is 2.5m per SNI building code',
            severity: 'error',
            code: 'MIN_FLOOR_HEIGHT'
          });
        }
        break;

      case 'numberOfFloors':
        if (value > 10) {
          fieldErrors.push({
            field,
            message: 'Buildings over 10 floors require special design considerations',
            severity: 'info',
            code: 'HIGH_RISE_REQUIREMENTS'
          });
        }
        break;

      case 'aspectRatio':
        if (value > 5) {
          fieldErrors.push({
            field,
            message: 'High aspect ratio may cause torsional irregularity',
            severity: 'warning',
            code: 'HIGH_ASPECT_RATIO'
          });
        }
        break;
    }

    return fieldErrors;
  }
}

// Export singleton instance
export const validator = new StructuralValidator();

// Utility functions for common validations
export const validateRequired = (value: any, fieldName: string): ValidationError | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      severity: 'error',
      code: 'REQUIRED_FIELD'
    };
  }
  return null;
};

export const validateRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string,
  unit: string = ''
): ValidationError | null => {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max} ${unit}`.trim(),
      severity: 'error',
      code: 'VALUE_OUT_OF_RANGE'
    };
  }
  return null;
};

export const validatePositive = (value: number, fieldName: string): ValidationError | null => {
  if (value <= 0) {
    return {
      field: fieldName,
      message: `${fieldName} must be positive`,
      severity: 'error',
      code: 'MUST_BE_POSITIVE'
    };
  }
  return null;
};

export const validateArray = (value: any[], fieldName: string, minLength?: number, maxLength?: number): ValidationError | null => {
  if (!Array.isArray(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be an array`,
      severity: 'error',
      code: 'MUST_BE_ARRAY'
    };
  }
  
  if (minLength !== undefined && value.length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must have at least ${minLength} items`,
      severity: 'error',
      code: 'MIN_ARRAY_LENGTH'
    };
  }
  
  if (maxLength !== undefined && value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must have at most ${maxLength} items`,
      severity: 'error',
      code: 'MAX_ARRAY_LENGTH'
    };
  }
  
  return null;
};

// SNI-specific validation functions
export const validateSNICompliance = {
  concreteGrade: (grade: string): boolean => {
    const validGrades = ['K-175', 'K-200', 'K-225', 'K-250', 'K-275', 'K-300', 'K-325', 'K-350', 'K-400', 'K-450', 'K-500'];
    return validGrades.includes(grade);
  },
  
  steelGrade: (grade: string): boolean => {
    const validGrades = ['BjTP280', 'BjTS400', 'BjTS420', 'BjTS500'];
    return validGrades.includes(grade);
  },
  
  seismicCategory: (category: string): boolean => {
    const validCategories = ['A', 'B', 'C', 'D', 'E', 'F'];
    return validCategories.includes(category);
  },
  
  siteClass: (siteClass: string): boolean => {
    const validClasses = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF'];
    return validClasses.includes(siteClass);
  }
};