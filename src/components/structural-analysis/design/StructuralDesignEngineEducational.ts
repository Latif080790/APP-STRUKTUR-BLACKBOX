/**
 * Educational Structural Design Engine
 * Focus on input validation and educational feedback for better learning
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recommendations: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  reason: string;
  correctRange?: string;
  example?: string;
  reference?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
}

export interface DesignInput {
  elementType: 'beam' | 'column' | 'slab';
  geometry: {
    width: number; // mm
    height: number; // mm  
    length?: number; // mm
    clearCover: number; // mm
  };
  materials: {
    fc: number; // MPa - Concrete compressive strength
    fy: number; // MPa - Steel yield strength
  };
  loads: {
    deadLoad: number; // kN/m or kN
    liveLoad: number; // kN/m or kN
    windLoad?: number; // kN/m or kN
    seismicLoad?: number; // kN/m or kN
  };
  forces: {
    momentX: number; // kN.m
    momentY?: number; // kN.m
    shearX: number; // kN
    shearY?: number; // kN
    axial?: number; // kN (compression +, tension -)
    torsion?: number; // kN.m
  };
  constraints: {
    deflectionLimit?: number; // L/value
    crackWidth?: number; // mm
    fireRating?: number; // hours
    exposureCondition?: 'mild' | 'moderate' | 'severe' | 'very_severe' | 'extreme';
  };
}

export interface DesignResults {
  isValid: boolean;
  element: {
    type: 'beam' | 'column' | 'slab' | 'wall';
    dimensions: { width: number; height: number; length?: number };
    concreteGrade: string;
    steelGrade: string;
  };
  reinforcement: {
    main: {
      diameter: number;
      count: number;
      area: number;
      layout: string;
    };
    compression?: {
      diameter: number;
      count: number;
      area: number;
    };
    shear: {
      diameter: number;
      spacing: number;
      legs: number;
      area: number;
    };
    development: {
      tension: number;
      compression: number;
      hook: number;
      splice: number;
    };
  };
  checks: {
    flexuralStrength: { required: number; provided: number; ratio: number; status: 'pass' | 'fail' };
    shearStrength: { required: number; provided: number; ratio: number; status: 'pass' | 'fail' };
    deflection: { calculated: number; allowable: number; ratio: number; status: 'pass' | 'fail' };
    cracking: { calculated: number; allowable: number; ratio: number; status: 'pass' | 'fail' };
    minReinforcement: { required: number; provided: number; status: 'pass' | 'fail' };
    maxReinforcement: { limit: number; provided: number; status: 'pass' | 'fail' };
  };
  cost: {
    concrete: number;
    steel: number;
    formwork?: number;
    labor: number;
    total: number;
    breakdown?: {
      steelRatio?: number;
      materialCost?: number;
      constructionCost?: number;
    };
  };
  drawings: {
    elevation: string;
    section: string;
    details: string[];
  };
  summary: string;
  recommendations: string[];
}

export class EducationalStructuralDesignEngine {
  private input: DesignInput;
  
  constructor(input: DesignInput) {
    this.input = input;
  }

  /**
   * Comprehensive input validation with educational feedback
   */
  public validateInput(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const recommendations: string[] = [];

    // Validate geometry
    this.validateGeometry(errors, warnings);

    // Validate materials
    this.validateMaterials(errors, warnings);

    // Validate loads and forces
    this.validateLoadsAndForces(errors, warnings);

    // Generate educational recommendations
    recommendations.push(...this.generateEducationalRecommendations());

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations
    };
  }

  private validateGeometry(errors: ValidationError[], warnings: ValidationWarning[]): void {
    const { geometry, elementType } = this.input;

    // Width validation
    if (geometry.width <= 0) {
      errors.push({
        field: 'geometry.width',
        message: 'Lebar elemen harus lebih besar dari 0',
        reason: 'Elemen struktur tidak bisa memiliki dimensi nol atau negatif',
        correctRange: 'Minimum 150mm untuk balok, 200mm untuk kolom',
        example: 'Balok: 300mm, Kolom: 400mm',
        reference: 'SNI 2847-2019 Pasal 7.6'
      });
    } else {
      if (elementType === 'beam' && geometry.width < 150) {
        warnings.push({
          field: 'geometry.width',
          message: 'Lebar balok sangat kecil (< 150mm)',
          suggestion: 'Pertimbangkan lebar minimum 250mm untuk balok utama, 200mm untuk balok anak',
          impact: 'high'
        });
      }
      
      if (elementType === 'column' && geometry.width < 200) {
        errors.push({
          field: 'geometry.width',
          message: 'Lebar kolom terlalu kecil (< 200mm)',
          reason: 'SNI 2847-2019 mensyaratkan dimensi minimum kolom 200mm',
          correctRange: 'Minimum 200mm, disarankan 300mm atau lebih',
          example: 'Kolom 300x300mm, 400x500mm',
          reference: 'SNI 2847-2019 Pasal 10.6.1.1'
        });
      }

      if (geometry.width > 1500) {
        warnings.push({
          field: 'geometry.width',
          message: 'Lebar elemen sangat besar (> 1500mm)',
          suggestion: 'Periksa kembali input - mungkin terjadi kesalahan satuan (m vs mm)',
          impact: 'medium'
        });
      }
    }

    // Height validation
    if (geometry.height <= 0) {
      errors.push({
        field: 'geometry.height',
        message: 'Tinggi elemen harus lebih besar dari 0',
        reason: 'Elemen struktur tidak bisa memiliki dimensi nol atau negatif',
        correctRange: 'Minimum sesuai persyaratan defleksi dan kekuatan',
        example: 'Balok: h = L/12 untuk bentang sederhana',
        reference: 'SNI 2847-2019 Tabel 9.3.1.1'
      });
    }

    // Clear cover validation
    if (geometry.clearCover <= 0) {
      errors.push({
        field: 'geometry.clearCover',
        message: 'Selimut beton harus lebih besar dari 0',
        reason: 'Selimut beton diperlukan untuk perlindungan tulangan dari korosi',
        correctRange: '20-75mm tergantung kondisi lingkungan',
        example: 'Interior: 25mm, Eksterior: 40mm, Tanah: 75mm',
        reference: 'SNI 2847-2019 Tabel 20.5.1.3.1'
      });
    } else {
      const exposureCondition = this.input.constraints?.exposureCondition || 'mild';
      const minCover = this.getMinimumClearCover(exposureCondition);
      
      if (geometry.clearCover < minCover) {
        warnings.push({
          field: 'geometry.clearCover',
          message: `Selimut beton kurang dari minimum untuk kondisi ${exposureCondition}`,
          suggestion: `Gunakan minimum ${minCover}mm untuk kondisi ${exposureCondition}`,
          impact: 'high'
        });
      }
    }

    // Aspect ratio checks
    const aspectRatio = geometry.height / geometry.width;
    if (elementType === 'beam') {
      if (aspectRatio < 1.0) {
        warnings.push({
          field: 'geometry',
          message: 'Rasio tinggi/lebar balok kurang dari 1.0',
          suggestion: 'Balok umumnya lebih tinggi dari lebar. Periksa orientasi elemen.',
          impact: 'medium'
        });
      }
      if (aspectRatio > 4.0) {
        warnings.push({
          field: 'geometry',
          message: 'Balok sangat tinggi (h/b > 4.0)',
          suggestion: 'Pertimbangkan stabilitas lateral - mungkin perlu pengaku lateral',
          impact: 'medium'
        });
      }
    }
  }

  private validateMaterials(errors: ValidationError[], warnings: ValidationWarning[]): void {
    const { materials } = this.input;

    // Concrete strength validation
    if (materials.fc <= 0) {
      errors.push({
        field: 'materials.fc',
        message: 'Kuat tekan beton harus lebih besar dari 0',
        reason: 'Kuat tekan beton menentukan kapasitas struktur',
        correctRange: '17-65 MPa untuk bangunan umum',
        example: 'K-225 (fc = 18.7 MPa), K-300 (fc = 25 MPa), K-350 (fc = 29 MPa)',
        reference: 'SNI 2847-2019 Pasal 19.2.1.1'
      });
    } else {
      if (materials.fc < 17) {
        errors.push({
          field: 'materials.fc',
          message: 'Kuat tekan beton terlalu rendah (< 17 MPa)',
          reason: 'SNI 2847-2019 mensyaratkan fc minimum 17 MPa untuk struktur beton bertulang',
          correctRange: 'Minimum 17 MPa (K-200)',
          example: 'Gunakan K-225 (fc = 18.7 MPa) atau lebih tinggi',
          reference: 'SNI 2847-2019 Pasal 19.2.1.1'
        });
      }

      if (materials.fc > 65) {
        warnings.push({
          field: 'materials.fc',
          message: 'Kuat tekan beton sangat tinggi (> 65 MPa)',
          suggestion: 'Beton mutu tinggi memerlukan pertimbangan khusus untuk desain dan pelaksanaan',
          impact: 'high'
        });
      }

      // Standard concrete grade checks
      const standardGrades = [17, 18.7, 25, 29, 35, 41.5, 50];
      const isStandardGrade = standardGrades.some(grade => Math.abs(materials.fc - grade) < 1);
      
      if (!isStandardGrade) {
        warnings.push({
          field: 'materials.fc',
          message: 'Kuat tekan beton tidak sesuai grade standar',
          suggestion: 'Gunakan grade standar: K-200 (17 MPa), K-225 (18.7 MPa), K-300 (25 MPa), K-350 (29 MPa)',
          impact: 'low'
        });
      }
    }

    // Steel strength validation
    if (materials.fy <= 0) {
      errors.push({
        field: 'materials.fy',
        message: 'Kuat leleh baja harus lebih besar dari 0',
        reason: 'Kuat leleh baja menentukan kapasitas tulangan',
        correctRange: '240-500 MPa untuk baja tulangan',
        example: 'BJTD 24 (fy = 240 MPa), BJTD 40 (fy = 400 MPa)',
        reference: 'SNI 2052-2017'
      });
    } else {
      if (materials.fy < 240) {
        warnings.push({
          field: 'materials.fy',
          message: 'Kuat leleh baja rendah (< 240 MPa)',
          suggestion: 'Pertimbangkan menggunakan BJTD 40 (400 MPa) untuk efisiensi yang lebih baik',
          impact: 'medium'
        });
      }

      if (materials.fy > 500) {
        warnings.push({
          field: 'materials.fy',
          message: 'Kuat leleh baja sangat tinggi (> 500 MPa)',
          suggestion: 'Baja mutu tinggi memerlukan detailing khusus dan kontrol kualitas ketat',
          impact: 'high'
        });
      }

      // Standard steel grade checks
      const standardSteelGrades = [240, 280, 320, 400, 420, 500];
      const isStandardSteel = standardSteelGrades.some(grade => Math.abs(materials.fy - grade) < 10);
      
      if (!isStandardSteel) {
        warnings.push({
          field: 'materials.fy',
          message: 'Kuat leleh baja tidak sesuai grade standar Indonesia',
          suggestion: 'Gunakan grade standar: BJTD 24 (240 MPa), BJTD 40 (400 MPa), atau BJTD 50 (500 MPa)',
          impact: 'medium'
        });
      }
    }

    // Material compatibility check
    const fcToFyRatio = materials.fc / materials.fy;
    if (fcToFyRatio < 0.05) {
      warnings.push({
        field: 'materials',
        message: 'Rasio fc/fy sangat rendah - kombinasi beton lemah dengan baja kuat',
        suggestion: 'Pertimbangkan meningkatkan mutu beton atau menurunkan mutu baja untuk optimasi',
        impact: 'medium'
      });
    }
  }

  private validateLoadsAndForces(errors: ValidationError[], warnings: ValidationWarning[]): void {
    const { loads, forces, elementType } = this.input;

    // Load validation
    if (loads.deadLoad < 0 || loads.liveLoad < 0) {
      errors.push({
        field: 'loads',
        message: 'Beban tidak boleh negatif',
        reason: 'Beban mati dan hidup selalu bernilai positif (ke bawah)',
        correctRange: 'deadLoad ≥ 0, liveLoad ≥ 0',
        example: 'deadLoad: 5 kN/m, liveLoad: 3 kN/m untuk balok',
        reference: 'SNI 1727-2020'
      });
    }

    // Dead load to live load ratio check
    if (loads.deadLoad > 0 && loads.liveLoad > 0) {
      const dlToLlRatio = loads.deadLoad / loads.liveLoad;
      if (dlToLlRatio < 0.5) {
        warnings.push({
          field: 'loads',
          message: 'Rasio beban mati terhadap beban hidup sangat rendah',
          suggestion: 'Periksa kembali nilai beban - umumnya beban mati ≥ 50% dari beban hidup',
          impact: 'medium'
        });
      }
      if (dlToLlRatio > 5.0) {
        warnings.push({
          field: 'loads',
          message: 'Rasio beban mati terhadap beban hidup sangat tinggi',
          suggestion: 'Periksa apakah beban mati sudah termasuk beban tambahan yang seharusnya masuk beban hidup',
          impact: 'low'
        });
      }
    }

    // Force validation
    if (Math.abs(forces.momentX) === 0 && Math.abs(forces.shearX) === 0) {
      warnings.push({
        field: 'forces',
        message: 'Momen dan geser bernilai nol',
        suggestion: 'Pastikan analisis struktur sudah dilakukan dengan benar',
        impact: 'high'
      });
    }

    // Element-specific force checks
    if (elementType === 'beam') {
      if (forces.axial && Math.abs(forces.axial) > Math.abs(forces.momentX) * 0.1) {
        warnings.push({
          field: 'forces.axial',
          message: 'Gaya aksial pada balok cukup signifikan',
          suggestion: 'Pertimbangkan efek gaya aksial dalam desain - mungkin perlu analisis sebagai beam-column',
          impact: 'high'
        });
      }
    }

    if (elementType === 'column') {
      if (!forces.axial || forces.axial === 0) {
        warnings.push({
          field: 'forces.axial',
          message: 'Kolom tidak memiliki gaya aksial',
          suggestion: 'Kolom umumnya menerima gaya aksial - periksa model struktur',
          impact: 'high'
        });
      }
    }
  }

  private generateEducationalRecommendations(): string[] {
    const recommendations: string[] = [];
    const { elementType, geometry, materials } = this.input;

    recommendations.push("📚 TIPS PEMBELAJARAN DESAIN STRUKTUR:");
    recommendations.push("");

    // Basic design principles
    recommendations.push("🏗️ PRINSIP DASAR:");
    recommendations.push("• Selalu periksa unit (mm, MPa, kN) sebelum menghitung");
    recommendations.push("• Pahami perbedaan beban terfaktor vs beban layanan");
    recommendations.push("• Gunakan faktor keamanan sesuai SNI 2847-2019");
    recommendations.push("");

    // Material understanding
    if (materials.fc && materials.fy) {
      recommendations.push("🧱 PEMAHAMAN MATERIAL:");
      recommendations.push(`• fc' = ${materials.fc} MPa adalah kuat tekan beton pada umur 28 hari`);
      recommendations.push(`• fy = ${materials.fy} MPa adalah kuat leleh baja tulangan`);
      recommendations.push(`• Rasio fc'/fy = ${(materials.fc / materials.fy).toFixed(3)} menentukan efisiensi desain`);
      
      if (materials.fc < 25) {
        recommendations.push("• Beton mutu rendah → lebih banyak tulangan diperlukan");
      }
      if (materials.fy > 400) {
        recommendations.push("• Baja mutu tinggi → perhatikan daktilitas dan lebar retak");
      }
      recommendations.push("");
    }

    // Geometry insights
    if (elementType === 'beam') {
      recommendations.push("📐 GEOMETRI BALOK:");
      recommendations.push("• Tinggi efektif (d) = h - selimut - Ø sengkang - Ø tulangan/2");
      recommendations.push("• Rasio h/L umumnya 1/10 sampai 1/15 untuk defleksi yang baik");
      recommendations.push("• Lebar minimum balok umumnya h/4 untuk stabilitas");
      
      if (geometry.length) {
        const heightToSpanRatio = geometry.height / geometry.length;
        recommendations.push(`• Rasio h/L Anda = ${heightToSpanRatio.toFixed(3)}`);
        if (heightToSpanRatio < 1/15) {
          recommendations.push("  → Balok mungkin terlalu pendek, periksa defleksi");
        }
        if (heightToSpanRatio > 1/8) {
          recommendations.push("  → Balok cukup tinggi, efisien untuk momen besar");
        }
      }
      recommendations.push("");
    }

    if (elementType === 'column') {
      recommendations.push("🏛️ GEOMETRI KOLOM:");
      recommendations.push("• Dimensi minimum 200mm per SNI 2847");
      recommendations.push("• Rasio tulangan 1-6% dari luas bruto");
      recommendations.push("• Pertimbangkan kelangsingan untuk kolom tinggi");
      recommendations.push("");
    }

    // Common mistakes
    recommendations.push("⚠️ KESALAHAN UMUM YANG HARUS DIHINDARI:");
    recommendations.push("• Menggunakan satuan yang tidak konsisten (mm vs m)");
    recommendations.push("• Lupa menggunakan faktor beban (1.2DL + 1.6LL)");
    recommendations.push("• Selimut beton terlalu besar/kecil untuk kondisi lingkungan");
    recommendations.push("• Tidak mempertimbangkan tulangan minimum dan maksimum");
    recommendations.push("• Mengabaikan persyaratan detailing (panjang penyaluran, sambungan)");
    recommendations.push("");

    // Study references
    recommendations.push("📖 REFERENSI BELAJAR:");
    recommendations.push("• SNI 2847-2019: Persyaratan Beton Struktural");
    recommendations.push("• SNI 1727-2020: Beban Desain Minimum dan Kriteria Terkait");
    recommendations.push("• Buku: 'Design of Concrete Structures' - Nilson & Darwin");
    recommendations.push("• Buku: 'Reinforced Concrete Design' - Mosley & Bungey");

    return recommendations;
  }

  private getMinimumClearCover(exposureCondition: string): number {
    const coverMap: { [key: string]: number } = {
      'mild': 20,
      'moderate': 25,
      'severe': 40,
      'very_severe': 50,
      'extreme': 75
    };
    return coverMap[exposureCondition] || 25;
  }

  /**
   * Create educational error result with detailed explanations
   */
  public createEducationalErrorResult(validation: ValidationResult): DesignResults {
    const errorMessages: string[] = [];
    
    errorMessages.push("❌ KESALAHAN INPUT TERDETEKSI");
    errorMessages.push("=".repeat(50));
    errorMessages.push("Mohon perbaiki kesalahan berikut untuk melanjutkan desain:");
    errorMessages.push("");
    
    validation.errors.forEach((error, index) => {
      errorMessages.push(`${index + 1}. KESALAHAN: ${error.message}`);
      errorMessages.push(`   💡 MENGAPA SALAH: ${error.reason}`);
      if (error.correctRange) {
        errorMessages.push(`   ✅ NILAI YANG BENAR: ${error.correctRange}`);
      }
      if (error.example) {
        errorMessages.push(`   📝 CONTOH: ${error.example}`);
      }
      if (error.reference) {
        errorMessages.push(`   📚 DASAR ATURAN: ${error.reference}`);
      }
      errorMessages.push("");
    });

    if (validation.warnings.length > 0) {
      errorMessages.push("⚠️ PERINGATAN PENTING:");
      errorMessages.push("=".repeat(30));
      validation.warnings.forEach((warning, index) => {
        errorMessages.push(`${index + 1}. ${warning.message}`);
        errorMessages.push(`   💭 SARAN: ${warning.suggestion}`);
        errorMessages.push(`   📊 DAMPAK: ${warning.impact.toUpperCase()}`);
        errorMessages.push("");
      });
    }

    errorMessages.push("📚 REKOMENDASI PEMBELAJARAN:");
    errorMessages.push("=".repeat(40));
    errorMessages.push(...validation.recommendations);

    return {
      isValid: false,
      element: {
        type: this.input.elementType,
        dimensions: { width: 0, height: 0 },
        concreteGrade: 'N/A',
        steelGrade: 'N/A'
      },
      reinforcement: {
        main: { diameter: 0, count: 0, area: 0, layout: 'N/A' },
        shear: { diameter: 0, spacing: 0, legs: 0, area: 0 },
        development: { tension: 0, compression: 0, hook: 0, splice: 0 }
      },
      checks: {
        flexuralStrength: { required: 0, provided: 0, ratio: 0, status: 'fail' },
        shearStrength: { required: 0, provided: 0, ratio: 0, status: 'fail' },
        deflection: { calculated: 0, allowable: 0, ratio: 0, status: 'fail' },
        cracking: { calculated: 0, allowable: 0, ratio: 0, status: 'fail' },
        minReinforcement: { required: 0, provided: 0, status: 'fail' },
        maxReinforcement: { limit: 0, provided: 0, status: 'fail' }
      },
      cost: { concrete: 0, steel: 0, labor: 0, total: 0 },
      drawings: {
        elevation: '<svg width="600" height="400"><text x="50" y="200" font-size="18" fill="red">Perbaiki input terlebih dahulu untuk melihat gambar teknis</text></svg>',
        section: '<svg width="400" height="400"><text x="50" y="200" font-size="16" fill="red">Validasi input diperlukan</text></svg>',
        details: []
      },
      summary: '❌ Desain gagal karena kesalahan input - silakan pelajari rekomendasi di bawah ini',
      recommendations: errorMessages
    };
  }
}

export default EducationalStructuralDesignEngine;