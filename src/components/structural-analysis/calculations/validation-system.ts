// =====================================
// 🚨 COMPREHENSIVE VALIDATION SYSTEM
// Per SNI Standards - Zero Error Tolerance
// =====================================

import { 
  SeismicParameters, SoilData, MaterialProperties, Geometry, Loads, ProjectInfo, ValidationError
} from '../interfaces';
import { DEAD_LOAD_COMPONENTS, LIVE_LOADS_BY_OCCUPANCY } from './load-library';

// VALIDATION RESULT INTERFACE
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  codeViolations: CodeViolation[];
  professionalReviewRequired: boolean;
}

export interface CodeViolation {
  code: 'SNI_1726_2019' | 'SNI_2847_2019' | 'SNI_1727_2020' | 'SNI_1729_2020';
  section: string;
  violation: string;
  severity: 'critical' | 'major' | 'minor';
  recommendation: string;
  mustFix: boolean;
}

// SEISMIC VALIDATION - SNI 1726:2019 Compliance
export const validateSeismicParameters = (
  params: SeismicParameters,
  location: { latitude?: number; longitude?: number }
): ValidationResult => {
  
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const codeViolations: CodeViolation[] = [];
  
  // CRITICAL PARAMETER VALIDATION
  if (!params.ss || params.ss < 0.4 || params.ss > 1.5) {
    codeViolations.push({
      code: 'SNI_1726_2019',
      section: 'Peta Hazard Gempa',
      violation: `Ss = ${params.ss}g berada di luar rentang valid (0.4-1.5g)`,
      severity: 'critical',
      recommendation: 'Gunakan nilai Ss dari peta hazard gempa resmi SNI 1726:2019',
      mustFix: true
    });
  }
  
  if (!params.s1 || params.s1 < 0.1 || params.s1 > 0.6) {
    codeViolations.push({
      code: 'SNI_1726_2019',
      section: 'Peta Hazard Gempa',
      violation: `S1 = ${params.s1}g berada di luar rentang valid (0.1-0.6g)`,
      severity: 'critical',
      recommendation: 'Gunakan nilai S1 dari peta hazard gempa resmi SNI 1726:2019',
      mustFix: true
    });
  }
  
  // SITE CLASS VALIDATION
  const validSiteClasses = ['SA', 'SB', 'SC', 'SD', 'SE', 'SF'];
  if (!params.siteClass || !validSiteClasses.includes(params.siteClass)) {
    codeViolations.push({
      code: 'SNI_1726_2019',
      section: 'Tabel 3',
      violation: `Kelas situs '${params.siteClass}' tidak valid`,
      severity: 'critical',
      recommendation: 'Tentukan kelas situs berdasarkan penyelidikan tanah sesuai SNI 1726:2019',
      mustFix: true
    });
  }
  
  // SITE COEFFICIENT VALIDATION
  if (params.fa && (params.fa < 0.8 || params.fa > 2.5)) {
    warnings.push({
      field: 'fa',
      message: `Koefisien situs Fa = ${params.fa} di luar rentang umum (0.8-2.5)`,
      severity: 'warning'
    });
  }
  
  if (params.fv && (params.fv < 0.8 || params.fv > 3.5)) {
    warnings.push({
      field: 'fv',
      message: `Koefisien situs Fv = ${params.fv} di luar rentang umum (0.8-3.5)`,
      severity: 'warning'
    });
  }
  
  // DESIGN PARAMETER VALIDATION
  if (params.sds && params.sd1) {
    const expectedSDS = (2/3) * (params.fa || 1.0) * (params.ss || 0);
    const expectedSD1 = (2/3) * (params.fv || 1.0) * (params.s1 || 0);
    
    if (Math.abs(params.sds - expectedSDS) > 0.01) {
      errors.push({
        field: 'sds',
        message: `SDS = ${params.sds} tidak konsisten dengan rumus (2/3)×Fa×Ss = ${expectedSDS.toFixed(3)}`,
        severity: 'error'
      });
    }
    
    if (Math.abs(params.sd1 - expectedSD1) > 0.01) {
      errors.push({
        field: 'sd1',
        message: `SD1 = ${params.sd1} tidak konsisten dengan rumus (2/3)×Fv×S1 = ${expectedSD1.toFixed(3)}`,
        severity: 'error'
      });
    }
  }
  
  // LOCATION VALIDATION
  if (!location?.latitude || !location?.longitude) {
    codeViolations.push({
      code: 'SNI_1726_2019',
      section: 'Pasal 6.1',
      violation: 'Koordinat lokasi proyek tidak tersedia',
      severity: 'major',
      recommendation: 'Koordinat diperlukan untuk akurasi parameter seismik',
      mustFix: true
    });
  } else {
    // Indonesia coordinate bounds check
    if (location.latitude < -11 || location.latitude > 6 ||
        location.longitude < 95 || location.longitude > 141) {
      warnings.push({
        field: 'location',
        message: 'Koordinat berada di luar wilayah Indonesia',
        severity: 'warning'
      });
    }
  }
  
  return {
    isValid: errors.length === 0 && codeViolations.filter(v => v.mustFix).length === 0,
    errors,
    warnings,
    codeViolations,
    professionalReviewRequired: codeViolations.some(v => v.severity === 'critical')
  };
};

// MATERIAL VALIDATION - SNI 2847:2019 Compliance
export const validateMaterialProperties = (materials: MaterialProperties): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const codeViolations: CodeViolation[] = [];
  
  // CONCRETE STRENGTH VALIDATION
  const validConcreteStrengths = [17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
  if (!validConcreteStrengths.includes(materials.fc)) {
    codeViolations.push({
      code: 'SNI_2847_2019',
      section: 'Pasal 19.2.1.1',
      violation: `Mutu beton fc' = ${materials.fc} MPa tidak sesuai mutu standar`,
      severity: 'critical',
      recommendation: `Gunakan salah satu mutu standar: ${validConcreteStrengths.join(', ')} MPa`,
      mustFix: true
    });
  }
  
  // MINIMUM CONCRETE STRENGTH FOR STRUCTURAL USE
  if (materials.fc < 17) {
    codeViolations.push({
      code: 'SNI_2847_2019',
      section: 'Pasal 19.2.1.1',
      violation: `Mutu beton fc' = ${materials.fc} MPa di bawah minimum struktural`,
      severity: 'critical',
      recommendation: 'Mutu beton minimum fc\' = 17 MPa untuk struktur beton bertulang',
      mustFix: true
    });
  }
  
  // MODULUS ELASTICITY VALIDATION
  const expectedEc = 4700 * Math.sqrt(materials.fc);
  const providedEc = materials.Ec || materials.ec;
  
  if (providedEc && Math.abs(providedEc - expectedEc) > expectedEc * 0.1) {
    errors.push({
      field: 'Ec',
      message: `Ec = ${providedEc} MPa tidak konsisten dengan rumus 4700√fc' = ${expectedEc.toFixed(0)} MPa`,
      severity: 'error'
    });
  }
  
  // STEEL STRENGTH VALIDATION  
  const validSteelStrengths = [240, 400, 500]; // BjTP-24, BjTS-40, BjTS-50
  if (!validSteelStrengths.includes(materials.fy)) {
    codeViolations.push({
      code: 'SNI_2847_2019',
      section: 'Pasal 20.2.2.1',
      violation: `Mutu baja fy = ${materials.fy} MPa tidak sesuai grade Indonesia`,
      severity: 'major',
      recommendation: 'Gunakan BjTP-24 (240 MPa), BjTS-40 (400 MPa), atau BjTS-50 (500 MPa)',
      mustFix: false
    });
  }
  
  // STEEL MODULUS VALIDATION
  const expectedEs = 200000; // MPa
  const providedEs = materials.Es || materials.es;
  
  if (providedEs && Math.abs(providedEs - expectedEs) > expectedEs * 0.05) {
    warnings.push({
      field: 'Es',
      message: `Es = ${providedEs} MPa berbeda dari standar Es = 200,000 MPa`,
      severity: 'warning'
    });
  }
  
  return {
    isValid: errors.length === 0 && codeViolations.filter(v => v.mustFix).length === 0,
    errors,
    warnings,
    codeViolations,
    professionalReviewRequired: codeViolations.some(v => v.severity === 'critical')
  };
};

// SOIL DATA VALIDATION - Professional Requirements
export const validateSoilData = (soilData: SoilData): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const codeViolations: CodeViolation[] = [];
  
  // SPT DATA VALIDATION
  if (!soilData.nspt || soilData.nspt.length < 3) {
    codeViolations.push({
      code: 'SNI_1726_2019',
      section: 'Pasal 5.3',
      violation: 'Data SPT tidak memadai untuk klasifikasi situs',
      severity: 'critical',
      recommendation: 'Diperlukan minimum 3 titik SPT dengan kedalaman mencukupi',
      mustFix: true
    });
  }
  
  if (soilData.nspt) {
    // Check for unrealistic SPT values
    soilData.nspt.forEach((n, index) => {
      if (n < 0 || n > 100) {
        errors.push({
          field: 'nspt',
          message: `Nilai N-SPT = ${n} pada kedalaman ${soilData.depth[index]}m tidak realistis`,
          severity: 'error'
        });
      }
      
      if (n > 50) {
        warnings.push({
          field: 'nspt',
          message: `Nilai N-SPT = ${n} sangat tinggi, verifikasi hasil penyelidikan`,
          severity: 'warning'
        });
      }
    });
    
    // Check for consistent depth data
    if (!soilData.depth || soilData.depth.length !== soilData.nspt.length) {
      errors.push({
        field: 'depth',
        message: 'Data kedalaman SPT tidak konsisten dengan jumlah nilai N',
        severity: 'error'
      });
    }
  }
  
  // GROUNDWATER VALIDATION
  if (soilData.groundwaterDepth !== undefined) {
    if (soilData.groundwaterDepth < 0) {
      errors.push({
        field: 'groundwaterDepth',
        message: 'Kedalaman muka air tanah tidak boleh negatif',
        severity: 'error'
      });
    }
    
    if (soilData.groundwaterDepth > 30) {
      warnings.push({
        field: 'groundwaterDepth',
        message: 'Muka air tanah sangat dalam (>30m), verifikasi data',
        severity: 'warning'
      });
    }
  }
  
  // SITE CLASS CONSISTENCY
  if (soilData.siteClass && soilData.nspt) {
    const avgSPT = soilData.nspt.reduce((sum, val) => sum + val, 0) / soilData.nspt.length;
    
    // Site class correlation check (simplified)
    let expectedSiteClass: string;
    if (avgSPT > 50) expectedSiteClass = 'SB';
    else if (avgSPT > 15) expectedSiteClass = 'SC';  
    else if (avgSPT > 5) expectedSiteClass = 'SD';
    else expectedSiteClass = 'SE';
    
    if (soilData.siteClass !== expectedSiteClass) {
      warnings.push({
        field: 'siteClass',
        message: `Kelas situs ${soilData.siteClass} mungkin tidak konsisten dengan rata-rata N-SPT = ${avgSPT.toFixed(1)}`,
        severity: 'warning'
      });
    }
  }
  
  return {
    isValid: errors.length === 0 && codeViolations.filter(v => v.mustFix).length === 0,
    errors,
    warnings,
    codeViolations,
    professionalReviewRequired: true // Soil analysis always requires professional review
  };
};

// GEOMETRY VALIDATION - Engineering Limits
export const validateGeometry = (geometry: Geometry): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const codeViolations: CodeViolation[] = [];
  
  // BASIC DIMENSION VALIDATION
  if (geometry.length <= 0 || geometry.width <= 0) {
    errors.push({
      field: 'dimensions',
      message: 'Dimensi bangunan harus positif',
      severity: 'error'
    });
  }
  
  if (geometry.numberOfFloors <= 0 || !Number.isInteger(geometry.numberOfFloors)) {
    errors.push({
      field: 'numberOfFloors',
      message: 'Jumlah lantai harus bilangan bulat positif',
      severity: 'error'
    });
  }
  
  // FLOOR HEIGHT VALIDATION
  if (geometry.heightPerFloor < 2.8) {
    codeViolations.push({
      code: 'SNI_2847_2019',
      section: 'Pasal 7.6.5',
      violation: `Tinggi lantai ${geometry.heightPerFloor}m kurang dari minimum struktural`,
      severity: 'major',
      recommendation: 'Tinggi lantai minimum 2.8m untuk kemudahan pelaksanaan dan kenyamanan',
      mustFix: false
    });
  }
  
  if (geometry.heightPerFloor > 6.0) {
    warnings.push({
      field: 'heightPerFloor',
      message: `Tinggi lantai ${geometry.heightPerFloor}m sangat tinggi, periksa efisiensi struktural`,
      severity: 'warning'
    });
  }
  
  // SPAN LIMITATIONS
  if (geometry.baySpacingX > 12 || geometry.baySpacingY > 12) {
    codeViolations.push({
      code: 'SNI_2847_2019',
      section: 'Pasal 8.3.3',
      violation: `Bentang ${Math.max(geometry.baySpacingX, geometry.baySpacingY)}m melebihi batas praktis balok beton`,
      severity: 'major',
      recommendation: 'Bentang maksimum 12m untuk sistem balok-kolom konvensional',
      mustFix: false
    });
  }
  
  if (geometry.baySpacingX < 3.0 || geometry.baySpacingY < 3.0) {
    warnings.push({
      field: 'baySpacing',
      message: 'Bentang kolom sangat kecil, periksa efisiensi struktur',
      severity: 'warning'
    });
  }
  
  // REGULARITY CHECK
  const aspectRatio = Math.max(geometry.length, geometry.width) / Math.min(geometry.length, geometry.width);
  if (aspectRatio > 3.0) {
    warnings.push({
      field: 'aspect_ratio',
      message: `Rasio aspek bangunan = ${aspectRatio.toFixed(1)} > 3.0 dapat menyebabkan irregularitas`,
      severity: 'warning'
    });
  }
  
  // HEIGHT LIMITATION CHECK
  const totalHeight = geometry.heightPerFloor * geometry.numberOfFloors;
  if (totalHeight > 60) {
    codeViolations.push({
      code: 'SNI_1726_2019',
      section: 'Pasal 7.2.1',
      violation: `Tinggi bangunan ${totalHeight}m melebihi batas untuk analisis sederhana`,
      severity: 'major',
      recommendation: 'Bangunan >60m memerlukan analisis dinamik riwayat waktu',
      mustFix: false
    });
  }
  
  return {
    isValid: errors.length === 0 && codeViolations.filter(v => v.mustFix).length === 0,
    errors,
    warnings,
    codeViolations,
    professionalReviewRequired: totalHeight > 40 || codeViolations.some(v => v.severity === 'critical')
  };
};

// LOAD VALIDATION - SNI 1727:2020 Compliance
export const validateLoads = (
  loads: Loads,
  geometry: Geometry,
  occupancyType: string = 'office'
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const codeViolations: CodeViolation[] = [];
  
  // DEAD LOAD VALIDATION
  const minDeadLoad = occupancyType === 'industrial' ? 4.0 : 
                     occupancyType === 'commercial' ? 3.0 : 2.5; // kN/m²
  
  if (loads.deadLoad < minDeadLoad) {
    warnings.push({
      field: 'deadLoad',
      message: `Beban mati ${loads.deadLoad} kN/m² rendah untuk ${occupancyType}`,
      severity: 'warning'
    });
  }
  
  // LIVE LOAD VALIDATION  
  try {
    const occupancyLoads = (LIVE_LOADS_BY_OCCUPANCY as any)[occupancyType];
    if (occupancyLoads) {
      const minLiveLoad = Math.min(...Object.values(occupancyLoads) as number[]);
      
      if (loads.liveLoad < minLiveLoad) {
        codeViolations.push({
          code: 'SNI_1727_2020',
          section: 'Tabel 4-1',
          violation: `Beban hidup ${loads.liveLoad} kN/m² di bawah minimum SNI untuk ${occupancyType}`,
          severity: 'critical',
          recommendation: `Gunakan minimum ${minLiveLoad} kN/m² sesuai SNI 1727:2020`,
          mustFix: true
        });
      }
    }
  } catch (error) {
    warnings.push({
      field: 'occupancy',
      message: `Tipe hunian '${occupancyType}' tidak dikenal`,
      severity: 'warning'
    });
  }
  
  // WIND LOAD VALIDATION
  if (loads.windSpeed && (loads.windSpeed < 25 || loads.windSpeed > 60)) {
    warnings.push({
      field: 'windSpeed',
      message: `Kecepatan angin ${loads.windSpeed} m/s di luar rentang umum Indonesia (25-60 m/s)`,
      severity: 'warning'
    });
  }
  
  // TOTAL LOAD REASONABLENESS
  const totalLoad = loads.deadLoad + loads.liveLoad;
  const maxReasonableLoad = occupancyType === 'industrial' ? 20.0 : 
                           occupancyType === 'commercial' ? 12.0 : 8.0;
  
  if (totalLoad > maxReasonableLoad) {
    warnings.push({
      field: 'total_load',
      message: `Total beban ${totalLoad} kN/m² sangat tinggi, verifikasi perhitungan`,
      severity: 'warning'
    });
  }
  
  return {
    isValid: errors.length === 0 && codeViolations.filter(v => v.mustFix).length === 0,
    errors,
    warnings,
    codeViolations,
    professionalReviewRequired: codeViolations.some(v => v.severity === 'critical')
  };
};

// COMPREHENSIVE VALIDATION - All Systems
export const validateCompleteSystem = (
  geometry: Geometry,
  loads: Loads,
  materials: MaterialProperties,
  soilData: SoilData,
  seismicParams: SeismicParameters,
  projectInfo?: ProjectInfo
): ValidationResult => {
  
  // Run individual validations
  const geometryValidation = validateGeometry(geometry);
  const loadValidation = validateLoads(loads, geometry, projectInfo?.buildingFunction || 'office');
  const materialValidation = validateMaterialProperties(materials);
  const soilValidation = validateSoilData(soilData);
  const seismicValidation = validateSeismicParameters(seismicParams, {
    latitude: projectInfo?.latitude,
    longitude: projectInfo?.longitude
  });
  
  // Combine all results
  const allErrors = [
    ...geometryValidation.errors,
    ...loadValidation.errors,
    ...materialValidation.errors,
    ...soilValidation.errors,
    ...seismicValidation.errors
  ];
  
  const allWarnings = [
    ...geometryValidation.warnings,
    ...loadValidation.warnings,
    ...materialValidation.warnings,
    ...soilValidation.warnings,
    ...seismicValidation.warnings
  ];
  
  const allCodeViolations = [
    ...geometryValidation.codeViolations,
    ...loadValidation.codeViolations,
    ...materialValidation.codeViolations,
    ...soilValidation.codeViolations,
    ...seismicValidation.codeViolations
  ];
  
  // Check system compatibility
  const compatibilityErrors: ValidationError[] = [];
  
  // High seismic + weak concrete check
  if (seismicParams.sds && seismicParams.sds > 0.5 && materials.fc < 25) {
    compatibilityErrors.push({
      field: 'seismic_material',
      message: 'Zona seismik tinggi memerlukan mutu beton minimum fc\' = 25 MPa',
      severity: 'error'
    });
  }
  
  // High building + soft soil check
  const totalHeight = geometry.heightPerFloor * geometry.numberOfFloors;
  const avgSPT = soilData.nspt ? soilData.nspt.reduce((sum, val) => sum + val, 0) / soilData.nspt.length : 10;
  
  if (totalHeight > 30 && avgSPT < 15) {
    compatibilityErrors.push({
      field: 'height_soil',
      message: 'Bangunan tinggi di tanah lunak memerlukan analisis dinamik tanah-struktur',
      severity: 'warning'
    });
  }
  
  return {
    isValid: allErrors.length === 0 && 
             compatibilityErrors.length === 0 && 
             allCodeViolations.filter(v => v.mustFix).length === 0,
    errors: [...allErrors, ...compatibilityErrors],
    warnings: allWarnings,
    codeViolations: allCodeViolations,
    professionalReviewRequired: [
      geometryValidation,
      loadValidation,
      materialValidation,
      soilValidation,
      seismicValidation
    ].some(v => v.professionalReviewRequired) || allCodeViolations.some(v => v.severity === 'critical')
  };
};

// EXPORT UTILITY FUNCTIONS
export const getValidationSummary = (validation: ValidationResult): string => {
  const criticalViolations = validation.codeViolations.filter(v => v.severity === 'critical').length;
  const majorViolations = validation.codeViolations.filter(v => v.severity === 'major').length;
  const errors = validation.errors.length;
  const warnings = validation.warnings.length;
  
  if (!validation.isValid) {
    return `SISTEM TIDAK VALID: ${criticalViolations} pelanggaran kritis, ${majorViolations} pelanggaran major, ${errors} error, ${warnings} warning.`;
  } else if (validation.professionalReviewRequired) {
    return `SISTEM VALID - Memerlukan review profesional: ${majorViolations} pelanggaran major, ${warnings} warning.`;
  } else {
    return `SISTEM VALID: ${warnings} warning ditemukan.`;
  }
};

export const getMustFixIssues = (validation: ValidationResult): (ValidationError | CodeViolation)[] => {
  return [
    ...validation.errors,
    ...validation.codeViolations.filter(v => v.mustFix)
  ];
};