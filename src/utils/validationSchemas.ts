/**
 * Schema Validasi untuk Sistem Analisis Struktur
 * Berdasarkan Standar SNI yang Berlaku di Indonesia
 * 
 * Referensi:
 * - SNI 1726:2019 - Tata cara perencanaan ketahanan gempa untuk struktur bangunan gedung dan non gedung
 * - SNI 1727:2020 - Beban desain minimum dan kriteria terkait untuk bangunan gedung dan struktur lain
 * - SNI 2847:2019 - Persyaratan beton struktural untuk bangunan gedung
 * - SNI 1729:2020 - Spesifikasi untuk bangunan gedung baja struktural
 */

import { ProjectInfo, Geometry, MaterialProperties, Loads, SeismicParameters } from '../components/structural-analysis/interfaces';

export interface ValidationRule<T = any> {
  field: keyof T;
  type: 'required' | 'range' | 'enum' | 'custom' | 'dependency';
  message: string;
  validator: (value: any, data?: T, additionalData?: any) => boolean;
  severity: 'error' | 'warning' | 'info';
  sniReference?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  sniReference?: string;
}

// ================== VALIDASI PROJECT INFO ==================
export const projectInfoValidationRules: ValidationRule<ProjectInfo>[] = [
  {
    field: 'name',
    type: 'required',
    message: 'Nama proyek wajib diisi',
    validator: (value: string) => Boolean(value && value.trim().length >= 3),
    severity: 'error'
  },
  {
    field: 'location',
    type: 'required',
    message: 'Lokasi proyek wajib diisi untuk menentukan parameter seismik',
    validator: (value: string) => Boolean(value && value.trim().length >= 3),
    severity: 'error',
    sniReference: 'SNI 1726:2019 Pasal 14'
  },
  {
    field: 'buildingFunction',
    type: 'enum',
    message: 'Fungsi bangunan harus dipilih sesuai klasifikasi SNI',
    validator: (value: string) => [
      'residential', 'office', 'retail', 'hotel', 'hospital', 
      'school', 'warehouse', 'industrial', 'other'
    ].includes(value),
    severity: 'error',
    sniReference: 'SNI 1727:2020 Tabel 4.3-1'
  },
  {
    field: 'riskCategory',
    type: 'enum',
    message: 'Kategori risiko harus sesuai klasifikasi SNI',
    validator: (value: string) => ['I', 'II', 'III', 'IV'].includes(value),
    severity: 'error',
    sniReference: 'SNI 1726:2019 Tabel 1'
  }
];

// ================== VALIDASI GEOMETRI ==================
export const geometryValidationRules: ValidationRule<Geometry>[] = [
  {
    field: 'length',
    type: 'range',
    message: 'Panjang bangunan harus antara 5-200 meter',
    validator: (value: number) => value >= 5 && value <= 200,
    severity: 'error'
  },
  {
    field: 'width',
    type: 'range',
    message: 'Lebar bangunan harus antara 5-200 meter',
    validator: (value: number) => value >= 5 && value <= 200,
    severity: 'error'
  },
  {
    field: 'heightPerFloor',
    type: 'range',
    message: 'Tinggi per lantai harus antara 2.5-6.0 meter sesuai SNI',
    validator: (value: number) => value >= 2.5 && value <= 6.0,
    severity: 'error',
    sniReference: 'SNI 03-1726-2019 Pasal 7.3'
  },
  {
    field: 'numberOfFloors',
    type: 'range',
    message: 'Jumlah lantai harus antara 1-50 lantai',
    validator: (value: number) => value >= 1 && value <= 50 && Number.isInteger(value),
    severity: 'error'
  },
  {
    field: 'baySpacingX',
    type: 'range',
    message: 'Jarak bentang X harus antara 3-15 meter untuk efisiensi struktural',
    validator: (value: number) => value >= 3 && value <= 15,
    severity: 'warning'
  },
  {
    field: 'baySpacingY',
    type: 'range',
    message: 'Jarak bentang Y harus antara 3-15 meter untuk efisiensi struktural',
    validator: (value: number) => value >= 3 && value <= 15,
    severity: 'warning'
  },
  {
    field: 'length',
    type: 'custom',
    message: 'Rasio aspek bangunan (L/W) tidak boleh melebihi 4:1 untuk stabilitas lateral',
    validator: (value: number, data?: Geometry) => {
      if (!data) return true;
      const aspectRatio = Math.max(value / data.width, data.width / value);
      return aspectRatio <= 4;
    },
    severity: 'warning',
    sniReference: 'SNI 1726:2019 Pasal 7.3.2'
  }
];

// ================== VALIDASI MATERIAL ==================
export const materialValidationRules: ValidationRule<MaterialProperties>[] = [
  // Validasi Beton
  {
    field: 'fc',
    type: 'range',
    message: 'Kuat tekan beton (fc) harus antara 17-83 MPa sesuai SNI 2847',
    validator: (value: number) => value >= 17 && value <= 83,
    severity: 'error',
    sniReference: 'SNI 2847:2019 Pasal 19.2.1'
  },
  {
    field: 'ec',
    type: 'custom',
    message: 'Modulus elastisitas beton tidak sesuai dengan rumus Ec = 4700√fc',
    validator: (value: number, data?: MaterialProperties) => {
      if (!data) return true;
      const expectedEc = 4700 * Math.sqrt(data.fc);
      const tolerance = 0.15; // 15% toleransi
      return Math.abs(value - expectedEc) <= tolerance * expectedEc;
    },
    severity: 'warning',
    sniReference: 'SNI 2847:2019 Pasal 19.2.2'
  },
  {
    field: 'poissonConcrete',
    type: 'range',
    message: 'Poisson ratio beton harus antara 0.15-0.25',
    validator: (value: number) => !value || (value >= 0.15 && value <= 0.25),
    severity: 'warning'
  },
  
  // Validasi Baja Struktural
  {
    field: 'fy',
    type: 'range',
    message: 'Tegangan leleh baja (fy) harus antara 200-500 MPa sesuai SNI 1729',
    validator: (value: number) => value >= 200 && value <= 500,
    severity: 'error',
    sniReference: 'SNI 1729:2020 Tabel 2.4-1'
  },
  {
    field: 'fySteel',
    type: 'dependency',
    message: 'Tegangan leleh baja struktural harus konsisten',
    validator: (value: number, data?: MaterialProperties) => {
      if (!data) return true;
      return Math.abs(value - data.fy) <= 50; // Toleransi 50 MPa
    },
    severity: 'warning'
  },
  
  // Validasi Tulangan
  {
    field: 'fyRebar',
    type: 'range',
    message: 'Tegangan leleh tulangan harus antara 240-500 MPa sesuai SNI 2052',
    validator: (value: number) => !value || (value >= 240 && value <= 500),
    severity: 'error',
    sniReference: 'SNI 2052:2017 Tabel 1'
  },
  
  // Validasi Faktor Reduksi
  {
    field: 'phiConcrete',
    type: 'range',
    message: 'Faktor reduksi beton (φ) harus antara 0.65-0.85 sesuai SNI 2847',
    validator: (value: number) => !value || (value >= 0.65 && value <= 0.85),
    severity: 'warning',
    sniReference: 'SNI 2847:2019 Tabel 21.2.1'
  },
  {
    field: 'phiTension',
    type: 'range',
    message: 'Faktor reduksi lentur (φ) harus antara 0.85-0.95 sesuai SNI 2847',
    validator: (value: number) => !value || (value >= 0.85 && value <= 0.95),
    severity: 'warning',
    sniReference: 'SNI 2847:2019 Tabel 21.2.1'
  }
];

// ================== VALIDASI BEBAN ==================
export const loadsValidationRules: ValidationRule<Loads>[] = [
  {
    field: 'deadLoad',
    type: 'range',
    message: 'Beban mati harus antara 2-15 kN/m² untuk bangunan gedung',
    validator: (value: number) => value >= 2 && value <= 15,
    severity: 'error',
    sniReference: 'SNI 1727:2020 Pasal 3.1'
  },
  {
    field: 'liveLoad',
    type: 'custom',
    message: 'Beban hidup tidak sesuai dengan fungsi bangunan berdasarkan SNI 1727',
    validator: (value: number, _data?: Loads, projectInfo?: ProjectInfo) => {
      if (!projectInfo) return true;
      
      const minLiveLoads: Record<string, number> = {
        'residential': 1.9,
        'office': 2.4,
        'retail': 4.8,
        'hotel': 1.9,
        'hospital': 1.9,
        'school': 2.9,
        'warehouse': 6.0,
        'industrial': 11.97
      };
      
      const minLoad = minLiveLoads[projectInfo.buildingFunction] || 2.4;
      return value >= minLoad;
    },
    severity: 'warning',
    sniReference: 'SNI 1727:2020 Tabel 4.3-1'
  },
  {
    field: 'roofLiveLoad',
    type: 'range',
    message: 'Beban hidup atap harus antara 0.96-1.44 kN/m² sesuai SNI',
    validator: (value: number) => value >= 0.96 && value <= 1.44,
    severity: 'warning',
    sniReference: 'SNI 1727:2020 Tabel 4.3-1'
  },
  {
    field: 'windSpeed',
    type: 'range',
    message: 'Kecepatan angin dasar harus antara 20-60 m/s berdasarkan peta angin Indonesia',
    validator: (value: number) => value >= 20 && value <= 60,
    severity: 'error',
    sniReference: 'SNI 1727:2020 Pasal 26.5'
  }
];

// ================== VALIDASI SEISMIK ==================
export const seismicValidationRules: ValidationRule<SeismicParameters>[] = [
  {
    field: 'ss',
    type: 'range',
    message: 'Parameter spektral SS harus antara 0.1-2.5g berdasarkan peta hazard Indonesia',
    validator: (value: number) => value >= 0.1 && value <= 2.5,
    severity: 'error',
    sniReference: 'SNI 1726:2019 Peta Hazard Gempa'
  },
  {
    field: 's1',
    type: 'range',
    message: 'Parameter spektral S1 harus antara 0.05-1.5g berdasarkan peta hazard Indonesia',
    validator: (value: number) => value >= 0.05 && value <= 1.5,
    severity: 'error',
    sniReference: 'SNI 1726:2019 Peta Hazard Gempa'
  },
  {
    field: 'siteClass',
    type: 'enum',
    message: 'Kelas situs harus sesuai klasifikasi SNI 1726',
    validator: (value: string) => ['SA', 'SB', 'SC', 'SD', 'SE', 'SF'].includes(value),
    severity: 'error',
    sniReference: 'SNI 1726:2019 Tabel 3'
  },
  {
    field: 'importance',
    type: 'enum',
    message: 'Faktor keutamaan harus sesuai kategori risiko SNI',
    validator: (value: number) => [1.0, 1.25, 1.5].includes(value),
    severity: 'error',
    sniReference: 'SNI 1726:2019 Tabel 2'
  },
  {
    field: 'r',
    type: 'range',
    message: 'Faktor modifikasi respons (R) harus antara 1.5-8.0 sesuai sistem struktur',
    validator: (value: number) => value >= 1.5 && value <= 8.0,
    severity: 'error',
    sniReference: 'SNI 1726:2019 Tabel 9'
  },
  {
    field: 'cd',
    type: 'custom',
    message: 'Faktor amplifikasi defleksi (Cd) harus konsisten dengan R',
    validator: (value: number, data?: SeismicParameters) => {
      if (!data) return true;
      // Umumnya Cd = 0.75 * R untuk kebanyakan sistem
      const expectedCd = 0.75 * data.r;
      const tolerance = 0.5;
      return Math.abs(value - expectedCd) <= tolerance;
    },
    severity: 'warning',
    sniReference: 'SNI 1726:2019 Tabel 9'
  },
  {
    field: 'fa',
    type: 'range',
    message: 'Faktor amplifikasi Fa harus antara 0.8-2.5 berdasarkan tabel SNI',
    validator: (value: number) => !value || (value >= 0.8 && value <= 2.5),
    severity: 'warning',
    sniReference: 'SNI 1726:2019 Tabel 4'
  },
  {
    field: 'fv',
    type: 'range',
    message: 'Faktor amplifikasi Fv harus antara 0.8-3.5 berdasarkan tabel SNI',
    validator: (value: number) => !value || (value >= 0.8 && value <= 3.5),
    severity: 'warning',
    sniReference: 'SNI 1726:2019 Tabel 5'
  }
];

// ================== FUNGSI VALIDASI UTAMA ==================
export function validateProjectInfo(data: ProjectInfo): ValidationResult {
  return validateWithRules(data, projectInfoValidationRules);
}

export function validateGeometry(data: Geometry): ValidationResult {
  return validateWithRules(data, geometryValidationRules);
}

export function validateMaterialProperties(data: MaterialProperties): ValidationResult {
  return validateWithRules(data, materialValidationRules);
}

export function validateLoads(data: Loads, projectInfo?: ProjectInfo): ValidationResult {
  return validateWithRules(data, loadsValidationRules, undefined, projectInfo);
}

export function validateSeismicParameters(data: SeismicParameters): ValidationResult {
  return validateWithRules(data, seismicValidationRules);
}

// ================== HELPER FUNCTIONS ==================
function validateWithRules<T>(
  data: T, 
  rules: ValidationRule<T>[], 
  _context?: any,
  additionalData?: any
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  for (const rule of rules) {
    try {
      const value = (data as any)[rule.field];
      const isValid = rule.validator(value, data, additionalData);
      
      if (!isValid) {
        const error: ValidationError = {
          field: String(rule.field),
          message: rule.message,
          severity: rule.severity,
          sniReference: rule.sniReference
        };
        
        if (rule.severity === 'error') {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
    } catch (err) {
      console.error(`Validation error for field ${String(rule.field)}:`, err);
      errors.push({
        field: String(rule.field),
        message: `Error validating ${String(rule.field)}: ${err}`,
        severity: 'error'
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ================== VALIDASI KOMPREHENSIF ==================
export function validateCompleteStructure(data: {
  projectInfo: ProjectInfo;
  geometry: Geometry;
  materials: MaterialProperties;
  loads: Loads;
  seismicParams: SeismicParameters;
}): ValidationResult {
  const results = [
    validateProjectInfo(data.projectInfo),
    validateGeometry(data.geometry),
    validateMaterialProperties(data.materials),
    validateLoads(data.loads, data.projectInfo),
    validateSeismicParameters(data.seismicParams)
  ];
  
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings);
  
  // Validasi antar-komponen
  const crossValidationErrors = performCrossValidation(data);
  allErrors.push(...crossValidationErrors.errors);
  allWarnings.push(...crossValidationErrors.warnings);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

function performCrossValidation(data: {
  projectInfo: ProjectInfo;
  geometry: Geometry;
  materials: MaterialProperties;
  loads: Loads;
  seismicParams: SeismicParameters;
}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Validasi tinggi bangunan vs kategori seismik
  const totalHeight = data.geometry.heightPerFloor * data.geometry.numberOfFloors;
  if (totalHeight > 40 && data.seismicParams.r > 6) {
    warnings.push({
      field: 'seismicParams.r',
      message: 'Bangunan tinggi (>40m) disarankan menggunakan R ≤ 6 untuk keamanan ekstra',
      severity: 'warning',
      sniReference: 'SNI 1726:2019 Pasal 7.2.5'
    });
  }
  
  // Validasi beban vs dimensi
  const floorArea = data.geometry.length * data.geometry.width;
  if (floorArea > 2000 && data.loads.liveLoad < 2.0) {
    warnings.push({
      field: 'loads.liveLoad',
      message: 'Bangunan dengan luas lantai besar (>2000m²) disarankan beban hidup minimum 2.0 kN/m²',
      severity: 'warning'
    });
  }
  
  // Validasi material vs tinggi bangunan
  if (totalHeight > 20 && data.materials.fc < 25) {
    warnings.push({
      field: 'materials.fc',
      message: 'Bangunan tinggi (>20m) disarankan menggunakan beton fc ≥ 25 MPa',
      severity: 'warning',
      sniReference: 'SNI 2847:2019 Pasal 19.3'
    });
  }
  
  return { isValid: errors.length === 0, errors, warnings };
}

// ================== UTILITAS VALIDASI ==================
export function getValidationSummary(result: ValidationResult): string {
  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;
  
  if (errorCount === 0 && warningCount === 0) {
    return '✅ Semua validasi passed';
  }
  
  let summary = '';
  if (errorCount > 0) {
    summary += `❌ ${errorCount} error${errorCount > 1 ? 's' : ''}`;
  }
  if (warningCount > 0) {
    if (summary) summary += ', ';
    summary += `⚠️ ${warningCount} warning${warningCount > 1 ? 's' : ''}`;
  }
  
  return summary;
}

export function formatValidationMessage(error: ValidationError): string {
  let message = error.message;
  if (error.sniReference) {
    message += ` (${error.sniReference})`;
  }
  return message;
}
