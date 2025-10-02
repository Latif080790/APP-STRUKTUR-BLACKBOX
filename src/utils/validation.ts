/**
 * Comprehensive Validation System
 * Sistem validasi input yang teliti untuk semua modul aplikasi
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ProjectValidation extends ValidationResult {
  fieldErrors: {
    [key: string]: string[];
  };
}

export interface StructuralValidation extends ValidationResult {
  criticalErrors: string[];
  recommendations: string[];
}

/**
 * Validasi Project Data
 */
export const validateProjectData = (project: any): ProjectValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fieldErrors: { [key: string]: string[] } = {};

  // Validasi nama proyek
  if (!project.name || project.name.trim().length === 0) {
    const error = "Nama proyek wajib diisi";
    errors.push(error);
    fieldErrors.name = [error];
  } else if (project.name.length < 3) {
    const error = "Nama proyek minimal 3 karakter";
    errors.push(error);
    fieldErrors.name = [error];
  } else if (project.name.length > 100) {
    const error = "Nama proyek maksimal 100 karakter";
    errors.push(error);
    fieldErrors.name = [error];
  }

  // Validasi deskripsi
  if (project.description && project.description.length > 500) {
    const error = "Deskripsi maksimal 500 karakter";
    errors.push(error);
    fieldErrors.description = [error];
  }

  // Validasi owner
  if (!project.owner || project.owner.trim().length === 0) {
    const error = "Pemilik proyek wajib diisi";
    errors.push(error);
    fieldErrors.owner = [error];
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fieldErrors
  };
};

/**
 * Validasi Geometry Data
 */
export const validateGeometryData = (geometry: any): StructuralValidation => {
  const errors: string[] = [];
  const criticalErrors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validasi floors
  if (!geometry.floors || geometry.floors < 1) {
    const error = "Jumlah lantai minimal 1";
    errors.push(error);
    criticalErrors.push(error);
  } else if (geometry.floors > 50) {
    const error = "Jumlah lantai maksimal 50 untuk analisis standar";
    errors.push(error);
    criticalErrors.push(error);
  } else if (geometry.floors > 10) {
    warnings.push("Bangunan tinggi memerlukan analisis khusus sesuai SNI 1726");
    recommendations.push("Pertimbangkan analisis dinamik untuk bangunan > 10 lantai");
  }

  // Validasi floor height
  if (!geometry.floorHeight || geometry.floorHeight < 2.0) {
    const error = "Tinggi lantai minimal 2.0 meter";
    errors.push(error);
    criticalErrors.push(error);
  } else if (geometry.floorHeight > 6.0) {
    const error = "Tinggi lantai maksimal 6.0 meter untuk analisis standar";
    errors.push(error);
  } else if (geometry.floorHeight < 2.4) {
    warnings.push("Tinggi lantai < 2.4m mungkin tidak memenuhi standar habitabilitas");
  }

  // Validasi bay dimensions
  if (!geometry.bayLength || geometry.bayLength < 3.0) {
    const error = "Panjang bentang minimal 3.0 meter";
    errors.push(error);
  } else if (geometry.bayLength > 15.0) {
    warnings.push("Bentang > 15m memerlukan perhatian khusus pada defleksi");
    recommendations.push("Pertimbangkan penggunaan post-tensioned atau prestressed");
  }

  if (!geometry.bayWidth || geometry.bayWidth < 3.0) {
    const error = "Lebar bentang minimal 3.0 meter";
    errors.push(error);
  } else if (geometry.bayWidth > 15.0) {
    warnings.push("Bentang > 15m memerlukan perhatian khusus pada defleksi");
  }

  // Validasi number of bays
  if (!geometry.baysX || geometry.baysX < 1) {
    const error = "Jumlah bentang arah X minimal 1";
    errors.push(error);
    criticalErrors.push(error);
  } else if (geometry.baysX > 10) {
    warnings.push("Bangunan dengan > 10 bentang memerlukan analisis struktur khusus");
  }

  if (!geometry.baysY || geometry.baysY < 1) {
    const error = "Jumlah bentang arah Y minimal 1";
    errors.push(error);
    criticalErrors.push(error);
  } else if (geometry.baysY > 10) {
    warnings.push("Bangunan dengan > 10 bentang memerlukan analisis struktur khusus");
  }

  // Validasi building type
  const validTypes = ['residential', 'commercial', 'industrial'];
  if (!validTypes.includes(geometry.buildingType)) {
    const error = "Tipe bangunan tidak valid";
    errors.push(error);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    criticalErrors,
    recommendations
  };
};

/**
 * Validasi Material Data
 */
export const validateMaterialData = (materials: any): StructuralValidation => {
  const errors: string[] = [];
  const criticalErrors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validasi concrete properties
  if (materials.concrete) {
    const { fc, ec, density, poisson } = materials.concrete;

    if (!fc || fc < 15) {
      const error = "Kuat tekan beton minimal 15 MPa (K-175)";
      errors.push(error);
      criticalErrors.push(error);
    } else if (fc > 80) {
      const error = "Kuat tekan beton maksimal 80 MPa untuk analisis standar";
      errors.push(error);
    } else if (fc < 20) {
      warnings.push("Beton K-175 sebaiknya hanya untuk struktur ringan");
      recommendations.push("Pertimbangkan minimal K-225 untuk struktur penting");
    }

    if (!ec || ec < 15000) {
      const error = "Modulus elastisitas beton minimal 15000 MPa";
      errors.push(error);
    } else if (ec > 40000) {
      const error = "Modulus elastisitas beton terlalu tinggi";
      errors.push(error);
    }

    if (!density || density < 2200) {
      const error = "Density beton minimal 2200 kg/m³";
      errors.push(error);
    } else if (density > 2600) {
      const error = "Density beton maksimal 2600 kg/m³";
      errors.push(error);
    }

    if (!poisson || poisson < 0.15 || poisson > 0.25) {
      const error = "Poisson ratio beton harus antara 0.15 - 0.25";
      errors.push(error);
    }
  }

  // Validasi steel properties
  if (materials.steel) {
    const { fy, es, density } = materials.steel;

    if (!fy || fy < 240) {
      const error = "Tegangan leleh baja minimal 240 MPa";
      errors.push(error);
      criticalErrors.push(error);
    } else if (fy > 500) {
      const error = "Tegangan leleh baja maksimal 500 MPa untuk analisis standar";
      errors.push(error);
    }

    if (!es || Math.abs(es - 200000) > 10000) {
      warnings.push("Modulus elastisitas baja biasanya 200000 MPa");
    }

    if (!density || Math.abs(density - 7850) > 100) {
      warnings.push("Density baja biasanya 7850 kg/m³");
    }
  }

  // Validasi reinforcement
  if (materials.reinforcement) {
    const { fyMain, fyTie } = materials.reinforcement;

    if (!fyMain || fyMain < 240) {
      const error = "Tegangan leleh tulangan utama minimal 240 MPa";
      errors.push(error);
      criticalErrors.push(error);
    }

    if (!fyTie || fyTie < 240) {
      const error = "Tegangan leleh sengkang minimal 240 MPa";
      errors.push(error);
    }

    if (fyTie > fyMain) {
      warnings.push("Tegangan leleh sengkang biasanya ≤ tulangan utama");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    criticalErrors,
    recommendations
  };
};

/**
 * Validasi Load Data
 */
export const validateLoadData = (loads: any): StructuralValidation => {
  const errors: string[] = [];
  const criticalErrors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validasi dead load
  if (loads.deadLoad === undefined || loads.deadLoad < 0) {
    const error = "Beban mati tidak boleh negatif";
    errors.push(error);
    criticalErrors.push(error);
  } else if (loads.deadLoad > 15) {
    warnings.push("Beban mati > 15 kN/m² sangat tinggi, periksa perhitungan");
  } else if (loads.deadLoad < 2) {
    warnings.push("Beban mati < 2 kN/m² mungkin terlalu kecil");
    recommendations.push("Pertimbangkan berat sendiri struktur, lantai, dan finishing");
  }

  // Validasi live load
  if (loads.liveLoad === undefined || loads.liveLoad < 0) {
    const error = "Beban hidup tidak boleh negatif";
    errors.push(error);
    criticalErrors.push(error);
  } else if (loads.liveLoad > 10) {
    warnings.push("Beban hidup > 10 kN/m² sangat tinggi, sesuaikan dengan fungsi bangunan");
  } else if (loads.liveLoad < 1.5) {
    warnings.push("Beban hidup < 1.5 kN/m² mungkin tidak sesuai SNI 1727");
    recommendations.push("Periksa tabel beban hidup sesuai fungsi bangunan");
  }

  // Validasi wind load
  if (loads.windLoad !== undefined && loads.windLoad < 0) {
    const error = "Beban angin tidak boleh negatif";
    errors.push(error);
  } else if (loads.windLoad > 3) {
    warnings.push("Beban angin > 3 kN/m² tinggi, sesuaikan dengan lokasi dan ketinggian");
  }

  // Validasi seismic load
  if (loads.seismicLoad) {
    const { ss, s1, siteClass, importance } = loads.seismicLoad;

    if (!ss || ss < 0) {
      const error = "Parameter Ss wajib diisi dan tidak boleh negatif";
      errors.push(error);
      criticalErrors.push(error);
    } else if (ss > 2.0) {
      warnings.push("Parameter Ss > 2.0 menunjukkan zona seismik tinggi");
      recommendations.push("Pertimbangkan sistem penahan gempa khusus");
    }

    if (!s1 || s1 < 0) {
      const error = "Parameter S1 wajib diisi dan tidak boleh negatif";
      errors.push(error);
      criticalErrors.push(error);
    }

    const validSiteClasses = ['A', 'B', 'C', 'D', 'E', 'F'];
    if (!validSiteClasses.includes(siteClass)) {
      const error = "Site class harus A, B, C, D, E, atau F";
      errors.push(error);
    }

    if (!importance || importance < 1.0 || importance > 1.5) {
      const error = "Faktor keutamaan harus antara 1.0 - 1.5";
      errors.push(error);
    }
  }

  // Validasi load combinations
  if (!loads.loadCombinations || loads.loadCombinations.length === 0) {
    const error = "Minimal satu kombinasi beban wajib didefinisikan";
    errors.push(error);
    criticalErrors.push(error);
  } else {
    loads.loadCombinations.forEach((combo: any, index: number) => {
      if (!combo.name || combo.name.trim().length === 0) {
        errors.push(`Kombinasi beban ${index + 1}: Nama wajib diisi`);
      }

      if (!combo.factors) {
        errors.push(`Kombinasi beban ${index + 1}: Faktor beban wajib didefinisikan`);
      } else {
        const { dead, live, wind, seismic } = combo.factors;

        if (dead < 0 || live < 0 || wind < 0 || seismic < 0) {
          errors.push(`Kombinasi beban ${index + 1}: Faktor tidak boleh negatif`);
        }

        if (dead > 2.0 || live > 2.0 || wind > 2.0 || seismic > 2.0) {
          warnings.push(`Kombinasi beban ${index + 1}: Faktor > 2.0 tidak umum`);
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    criticalErrors,
    recommendations
  };
};

/**
 * Validasi Analysis Settings
 */
export const validateAnalysisSettings = (analysis: any): StructuralValidation => {
  const errors: string[] = [];
  const criticalErrors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validasi analysis type
  const validTypes = ['static', 'dynamic', 'nonlinear', 'seismic'];
  if (!validTypes.includes(analysis.type)) {
    const error = "Tipe analisis tidak valid";
    errors.push(error);
    criticalErrors.push(error);
  }

  // Validasi method
  const validMethods = ['LRFD', 'ASD'];
  if (!validMethods.includes(analysis.method)) {
    const error = "Metode analisis harus LRFD atau ASD";
    errors.push(error);
    criticalErrors.push(error);
  } else if (analysis.method === 'ASD') {
    warnings.push("Metode ASD sudah jarang digunakan, pertimbangkan LRFD");
  }

  // Validasi convergence tolerance
  if (!analysis.convergenceTolerance || analysis.convergenceTolerance <= 0) {
    const error = "Toleransi konvergensi harus > 0";
    errors.push(error);
  } else if (analysis.convergenceTolerance > 1e-3) {
    warnings.push("Toleransi konvergensi terlalu besar, hasil mungkin tidak akurat");
  } else if (analysis.convergenceTolerance < 1e-8) {
    warnings.push("Toleransi konvergensi terlalu kecil, analisis mungkin tidak konvergen");
  }

  // Validasi max iterations
  if (!analysis.maxIterations || analysis.maxIterations < 10) {
    const error = "Iterasi maksimal minimal 10";
    errors.push(error);
  } else if (analysis.maxIterations > 1000) {
    warnings.push("Iterasi maksimal > 1000 mungkin membuat analisis sangat lambat");
  }

  // Validasi standards
  if (!analysis.standards || analysis.standards.length === 0) {
    warnings.push("Tidak ada standar yang dipilih");
    recommendations.push("Pilih minimal SNI untuk struktur di Indonesia");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    criticalErrors,
    recommendations
  };
};

/**
 * Utility function untuk format error messages
 */
export const formatValidationMessage = (message: string, type: 'error' | 'warning' | 'info' = 'error'): string => {
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return `${icons[type]} ${message}`;
};

/**
 * Validate numeric input dengan range checking
 */
export const validateNumericInput = (
  value: any,
  fieldName: string,
  min?: number,
  max?: number,
  required: boolean = true
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} wajib diisi`);
    return { isValid: false, errors, warnings };
  }

  if (value !== undefined && value !== null && value !== '') {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      errors.push(`${fieldName} harus berupa angka`);
    } else {
      if (min !== undefined && numValue < min) {
        errors.push(`${fieldName} minimal ${min}`);
      }

      if (max !== undefined && numValue > max) {
        errors.push(`${fieldName} maksimal ${max}`);
      }

      // Warnings untuk nilai yang mencurigakan
      if (min !== undefined && max !== undefined) {
        const range = max - min;
        if (numValue < min + range * 0.1) {
          warnings.push(`${fieldName} mendekati batas minimum`);
        } else if (numValue > max - range * 0.1) {
          warnings.push(`${fieldName} mendekati batas maksimum`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Batch validation untuk multiple fields
 */
export const validateMultipleFields = (
  validations: (() => ValidationResult)[]
): ValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  validations.forEach(validation => {
    const result = validation();
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};