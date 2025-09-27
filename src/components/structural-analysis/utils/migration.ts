// =====================================
// 🚨 DATA MIGRATION UTILITIES
// Professional Data Migration System
// Zero Error Tolerance Implementation
// =====================================

import { 
  SeismicParameters,
  MaterialProperties,
  SoilData,
  Geometry,
  Loads,
  ProjectInfo
} from '../interfaces';
import { ValidationResult, validateCompleteSystem } from '../calculations/validation-system';

// LEGACY DATA TYPES
interface LegacySeismicParameters {
  seismicZone?: string; // OLD: Zone-based system
  siteClass?: string;
  accelerationCoeff?: number; // OLD: Simplified coefficient
  responseModification?: number;
}

interface LegacyMaterialProperties {
  fc?: number | string; // OLD: Could be range like "20-25"
  fy?: number | string; // OLD: Could be range
  modulus?: number; // OLD: Single modulus value
}

interface LegacySoilData {
  soilType?: string; // OLD: Simple text description
  bearingCapacity?: number; // OLD: Single value
  soilClass?: string;
}

interface LegacyLoads {
  deadLoad?: number;
  liveLoad?: number;
  windLoad?: number; // OLD: Direct wind load value
  seismicLoad?: number; // OLD: Direct seismic load value
  occupancy?: string;
}

interface LegacyProjectData {
  project?: LegacyProjectInfo;
  geometry?: Geometry; // Usually compatible
  materials?: LegacyMaterialProperties;
  loads?: LegacyLoads;
  seismic?: LegacySeismicParameters;
  soil?: LegacySoilData;
  version?: string;
  createdDate?: string;
}

interface LegacyProjectInfo {
  name?: string;
  location?: string;
  type?: string; // OLD: different naming
  engineer?: string;
}

interface MigrationResult {
  success: boolean;
  migratedData: {
    projectInfo: ProjectInfo;
    geometry: Geometry;
    materials: MaterialProperties;
    loads: Loads;
    seismicParams: SeismicParameters;
    soilData: SoilData;
  };
  warnings: string[];
  criticalIssues: string[];
  validation: ValidationResult;
  requiresProfessionalReview: boolean;
  migrationReport: string;
}

// SEISMIC ZONE TO Ss/S1 MAPPING
const SEISMIC_ZONE_MAPPING: Record<string, { ss: number; s1: number }> = {
  '1': { ss: 0.4, s1: 0.1 }, // Low seismic
  '2': { ss: 0.6, s1: 0.15 }, // Moderate seismic
  '3': { ss: 0.8, s1: 0.2 }, // Moderate-high seismic
  '4': { ss: 1.0, s1: 0.3 }, // High seismic
  '5': { ss: 1.25, s1: 0.45 }, // Very high seismic
  '6': { ss: 1.5, s1: 0.6 }, // Extreme seismic
  'low': { ss: 0.5, s1: 0.12 },
  'moderate': { ss: 0.75, s1: 0.2 },
  'high': { ss: 1.1, s1: 0.35 },
  'very_high': { ss: 1.4, s1: 0.55 }
};

// CONCRETE STRENGTH MIGRATION
const migrateConcretStrength = (oldFc: number | string): number => {
  let fcValue: number;
  
  if (typeof oldFc === 'string') {
    // Handle ranges like "20-25" -> use conservative (lower) value
    const match = oldFc.match(/(\d+)(?:-(\d+))?/);
    if (match) {
      fcValue = parseInt(match[1]);
    } else {
      fcValue = 20; // Default safe value
    }
  } else {
    fcValue = oldFc;
  }
  
  // Round to nearest standard value
  const standardValues = [17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
  return standardValues.reduce((prev, curr) => 
    Math.abs(curr - fcValue) < Math.abs(prev - fcValue) ? curr : prev
  );
};

// STEEL STRENGTH MIGRATION
const migrateSteelStrength = (oldFy: number | string): number => {
  let fyValue: number;
  
  if (typeof oldFy === 'string') {
    const match = oldFy.match(/(\d+)/);
    fyValue = match ? parseInt(match[1]) : 400;
  } else {
    fyValue = oldFy;
  }
  
  // Map to Indonesian steel grades
  if (fyValue <= 280) return 240; // BjTP-24
  if (fyValue <= 450) return 400; // BjTS-40
  return 500; // BjTS-50
};

// OCCUPANCY TYPE MIGRATION
const OCCUPANCY_MIGRATION: Record<string, string> = {
  'residential': 'residential',
  'office': 'office',
  'retail': 'commercial',
  'warehouse': 'warehouse',
  'industrial': 'industrial',
  'school': 'educational',
  'hospital': 'healthcare',
  'hotel': 'hospitality',
  'apartment': 'residential',
  'shopping': 'commercial',
  'factory': 'industrial'
};

// MAIN MIGRATION FUNCTION
export const migrateProjectData = async (
  legacyData: LegacyProjectData,
  projectLocation?: { latitude?: number; longitude?: number }
): Promise<MigrationResult> => {
  
  const warnings: string[] = [];
  const criticalIssues: string[] = [];
  
  try {
    // MIGRATE PROJECT INFO
    const projectInfo: ProjectInfo = {
      name: legacyData.project?.name || 'Proyek Migrated',
      location: legacyData.project?.location || 'Jakarta',
      buildingFunction: OCCUPANCY_MIGRATION[legacyData.loads?.occupancy || 'office'] || 'office',
      riskCategory: 'II', // Default, requires professional assessment
      latitude: projectLocation?.latitude,
      longitude: projectLocation?.longitude,
      version: '2.0-SNI_COMPLIANT',
      migratedFrom: legacyData.version || 'legacy',
      migratedDate: new Date().toISOString()
    };
    
    // MIGRATE GEOMETRY (usually compatible)
    const geometry: Geometry = {
      length: legacyData.geometry?.length || 30,
      width: legacyData.geometry?.width || 20,
      numberOfFloors: legacyData.geometry?.numberOfFloors || 2,
      heightPerFloor: legacyData.geometry?.heightPerFloor || 3.5,
      baySpacingX: legacyData.geometry?.baySpacingX || 6,
      baySpacingY: legacyData.geometry?.baySpacingY || 6,
      columnGridX: legacyData.geometry?.columnGridX || Math.ceil((legacyData.geometry?.length || 30) / 6),
      columnGridY: legacyData.geometry?.columnGridY || Math.ceil((legacyData.geometry?.width || 20) / 6)
    };
    
    // MIGRATE MATERIALS
    const materials: MaterialProperties = {
      fc: legacyData.materials?.fc ? migrateConcretStrength(legacyData.materials.fc) : 25,
      fy: legacyData.materials?.fy ? migrateSteelStrength(legacyData.materials.fy) : 400,
      Ec: undefined, // Will be calculated automatically
      Es: 200000, // Standard Indonesian value
      poissonRatio: 0.2,
      unitWeightConcrete: 24, // kN/m³
      unitWeightSteel: 78.5 // kN/m³
    };
    
    // Add warning if materials were migrated
    if (legacyData.materials?.fc && typeof legacyData.materials.fc === 'string') {
      warnings.push(`Mutu beton dimigrasikan dari '${legacyData.materials.fc}' ke ${materials.fc} MPa (standar SNI)`);
    }
    
    // MIGRATE LOADS
    const loads: Loads = {
      deadLoad: legacyData.loads?.deadLoad || 3.0,
      liveLoad: legacyData.loads?.liveLoad || 2.5,
      windSpeed: 30, // Default Indonesian wind speed
      roofLiveLoad: 1.0,
      reductionFactor: {
        live: 1.0,
        wind: 1.0
      }
    };
    
    // Add warning if loads seem low
    if (loads.deadLoad < 2.0) {
      warnings.push(`Beban mati ${loads.deadLoad} kN/m² terlihat rendah, periksa kembali`);
    }
    
    // MIGRATE SEISMIC PARAMETERS
    let seismicParams: SeismicParameters;
    
    if (legacyData.seismic?.seismicZone) {
      const mapped = SEISMIC_ZONE_MAPPING[legacyData.seismic.seismicZone];
      if (mapped) {
        seismicParams = {
          ss: mapped.ss,
          s1: mapped.s1,
          siteClass: legacyData.seismic.siteClass || 'SD',
          fa: undefined, // Will be calculated
          fv: undefined, // Will be calculated
          sds: undefined, // Will be calculated
          sd1: undefined // Will be calculated
        };
        
        criticalIssues.push(
          `Parameter seismik dimigrasikan dari zona '${legacyData.seismic.seismicZone}' ke Ss=${mapped.ss}g, S1=${mapped.s1}g. ` +
          `WAJIB verifikasi dengan peta hazard gempa SNI 1726:2019 untuk lokasi ${projectInfo.location}`
        );
      } else {
        seismicParams = {
          ss: 0.8,
          s1: 0.25,
          siteClass: 'SD',
          fa: undefined,
          fv: undefined,
          sds: undefined,
          sd1: undefined
        };
        
        criticalIssues.push(
          `Zona seismik '${legacyData.seismic.seismicZone}' tidak dikenal. ` +
          `Menggunakan nilai default. WAJIB update dengan data SNI 1726:2019.`
        );
      }
    } else {
      seismicParams = {
        ss: 0.8,
        s1: 0.25,
        siteClass: 'SD',
        fa: undefined,
        fv: undefined,
        sds: undefined,
        sd1: undefined
      };
      
      criticalIssues.push(
        'Data seismik tidak tersedia. Menggunakan nilai default. ' +
        'WAJIB update dengan parameter Ss/S1 dari peta hazard gempa SNI 1726:2019.'
      );
    }
    
    // MIGRATE SOIL DATA
    const soilData: SoilData = {
      nspt: [10, 15, 20, 25, 30], // Default realistic SPT values
      depth: [2, 4, 6, 8, 10], // Default depths
      siteClass: seismicParams.siteClass,
      groundwaterDepth: 5, // Conservative assumption
      soilDescription: legacyData.soil?.soilType || 'Tanah lempung keras',
      bearingCapacity: legacyData.soil?.bearingCapacity || 200,
      needsSPTData: true // Flag for professional review
    };
    
    if (!legacyData.soil?.soilType) {
      criticalIssues.push(
        'Data tanah tidak tersedia. Menggunakan asumsi konservatif. ' +
        'WAJIB penyelidikan tanah sesuai SNI 8460:2017.'
      );
    }
    
    // VALIDATE MIGRATED DATA
    const validation = validateCompleteSystem(
      geometry,
      loads,
      materials,
      soilData,
      seismicParams,
      projectInfo
    );
    
    // GENERATE MIGRATION REPORT
    const migrationReport = generateMigrationReport({
      original: legacyData,
      migrated: { projectInfo, geometry, materials, loads, seismicParams, soilData },
      warnings,
      criticalIssues,
      validation
    });
    
    return {
      success: true,
      migratedData: {
        projectInfo,
        geometry,
        materials,
        loads,
        seismicParams,
        soilData
      },
      warnings,
      criticalIssues,
      validation,
      requiresProfessionalReview: criticalIssues.length > 0 || validation.professionalReviewRequired,
      migrationReport
    };
    
  } catch (error) {
    return {
      success: false,
      migratedData: {} as any,
      warnings: [],
      criticalIssues: [`Migration error: ${error}`],
      validation: {
        isValid: false,
        errors: [{ field: 'migration', message: `Migration failed: ${error}`, severity: 'error' }],
        warnings: [],
        codeViolations: [],
        professionalReviewRequired: true
      },
      requiresProfessionalReview: true,
      migrationReport: `MIGRATION FAILED: ${error}`
    };
  }
};

// GENERATE MIGRATION REPORT
const generateMigrationReport = (data: {
  original: LegacyProjectData;
  migrated: any;
  warnings: string[];
  criticalIssues: string[];
  validation: ValidationResult;
}): string => {
  
  const { original, migrated, warnings, criticalIssues, validation } = data;
  
  const report = `
=====================================
LAPORAN MIGRASI DATA STRUKTUR
=====================================

INFORMASI MIGRASI:
- Tanggal Migrasi: ${new Date().toLocaleDateString('id-ID')}
- Versi Asal: ${original.version || 'Legacy'}
- Versi Target: SNI Compliant 2.0
- Status: ${data.validation.isValid ? 'BERHASIL DENGAN VALIDASI' : 'BERHASIL DENGAN PERINGATAN'}

RINGKASAN PERUBAHAN:
${generateChangeSummary(original, migrated)}

PERINGATAN (${warnings.length}):
${warnings.map((w, i) => `${i + 1}. ${w}`).join('\n')}

ISU KRITIS (${criticalIssues.length}):
${criticalIssues.map((c, i) => `${i + 1}. ${c}`).join('\n')}

STATUS VALIDASI SNI:
- Valid: ${validation.isValid ? 'YA' : 'TIDAK'}
- Error: ${validation.errors.length}
- Pelanggaran Kode: ${validation.codeViolations.length}
- Review Profesional Diperlukan: ${validation.professionalReviewRequired ? 'YA' : 'TIDAK'}

TINDAKAN DIPERLUKAN:
${generateActionItems(criticalIssues, validation)}

REKOMENDASI:
1. Verifikasi semua parameter dengan standar SNI terbaru
2. Lakukan penyelidikan tanah sesuai SNI 8460:2017
3. Update parameter seismik dengan peta hazard gempa SNI 1726:2019
4. Konsultasi dengan ahli struktur berlisensi

=====================================
PENTING: Proyek yang dimigrasikan ini memerlukan review profesional
sebelum digunakan untuk konstruksi aktual.
=====================================
`;
  
  return report;
};

const generateChangeSummary = (original: LegacyProjectData, migrated: any): string => {
  const changes: string[] = [];
  
  // Material changes
  if (original.materials?.fc !== migrated.materials.fc) {
    changes.push(`• Mutu beton: ${original.materials?.fc} → ${migrated.materials.fc} MPa`);
  }
  
  if (original.materials?.fy !== migrated.materials.fy) {
    changes.push(`• Mutu baja: ${original.materials?.fy} → ${migrated.materials.fy} MPa`);
  }
  
  // Seismic changes
  if (original.seismic?.seismicZone && migrated.seismicParams.ss) {
    changes.push(`• Parameter seismik: Zona ${original.seismic.seismicZone} → Ss=${migrated.seismicParams.ss}g, S1=${migrated.seismicParams.s1}g`);
  }
  
  // Occupancy changes
  if (original.loads?.occupancy !== migrated.projectInfo.buildingFunction) {
    changes.push(`• Fungsi bangunan: ${original.loads?.occupancy} → ${migrated.projectInfo.buildingFunction}`);
  }
  
  return changes.length > 0 ? changes.join('\n') : '• Tidak ada perubahan mayor pada parameter dasar';
};

const generateActionItems = (criticalIssues: string[], validation: ValidationResult): string => {
  const actions: string[] = [];
  
  if (criticalIssues.some(issue => issue.includes('seismik'))) {
    actions.push('1. URGENT: Update parameter seismik dengan data SNI 1726:2019');
  }
  
  if (criticalIssues.some(issue => issue.includes('tanah'))) {
    actions.push('2. URGENT: Lakukan penyelidikan tanah lengkap');
  }
  
  if (validation.codeViolations.some(v => v.severity === 'critical')) {
    actions.push('3. CRITICAL: Perbaiki pelanggaran kode kritis sebelum analisis');
  }
  
  if (validation.professionalReviewRequired) {
    actions.push('4. MANDATORY: Review oleh ahli struktur berlisensi');
  }
  
  return actions.length > 0 ? actions.join('\n') : 'Tidak ada tindakan urgent diperlukan.';
};

// BATCH MIGRATION FOR MULTIPLE PROJECTS
export const batchMigrateProjects = async (
  legacyProjects: LegacyProjectData[]
): Promise<{
  successful: MigrationResult[];
  failed: { project: LegacyProjectData; error: string }[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    needsProfessionalReview: number;
  };
}> => {
  
  const successful: MigrationResult[] = [];
  const failed: { project: LegacyProjectData; error: string }[] = [];
  
  for (const project of legacyProjects) {
    try {
      const result = await migrateProjectData(project);
      if (result.success) {
        successful.push(result);
      } else {
        failed.push({
          project,
          error: result.criticalIssues.join('; ')
        });
      }
    } catch (error) {
      failed.push({
        project,
        error: `Migration exception: ${error}`
      });
    }
  }
  
  return {
    successful,
    failed,
    summary: {
      total: legacyProjects.length,
      successful: successful.length,
      failed: failed.length,
      needsProfessionalReview: successful.filter(s => s.requiresProfessionalReview).length
    }
  };
};

// EXPORT UTILITIES
export const exportMigrationReport = (result: MigrationResult): string => {
  return result.migrationReport;
};

export const isLegacyData = (data: any): boolean => {
  return (
    data.seismic?.seismicZone || // Zone-based seismic
    typeof data.materials?.fc === 'string' || // Range-based concrete
    data.soil?.soilType || // Text-based soil description
    !data.version || // No version info
    data.version.includes('legacy')
  );
};

// VALIDATION HELPERS FOR UI
export const getMigrationStatus = (result: MigrationResult): {
  status: 'success' | 'warning' | 'error';
  message: string;
  actions: string[];
} => {
  
  if (!result.success) {
    return {
      status: 'error',
      message: 'Migrasi gagal',
      actions: ['Perbaiki data sumber', 'Coba migrasi ulang']
    };
  }
  
  if (result.criticalIssues.length > 0) {
    return {
      status: 'warning',
      message: `Migrasi berhasil dengan ${result.criticalIssues.length} isu kritis`,
      actions: result.criticalIssues.slice(0, 3)
    };
  }
  
  if (result.warnings.length > 0) {
    return {
      status: 'warning',
      message: `Migrasi berhasil dengan ${result.warnings.length} peringatan`,
      actions: ['Review parameter yang dimigrasikan', 'Validasi dengan standar SNI']
    };
  }
  
  return {
    status: 'success',
    message: 'Migrasi berhasil tanpa masalah',
    actions: ['Data siap untuk analisis']
  };
};