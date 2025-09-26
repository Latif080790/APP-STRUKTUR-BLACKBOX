/**
 * Modul Analisis Struktur
 * Mengimplementasikan standar SNI untuk analisis struktur
 */

import { validateStructuralModel } from './validation';

// Tipe data untuk hasil analisis
export interface AnalysisResult {
  success: boolean;
  message?: string;
  results?: {
    period: number; // Periode getar struktur (detik)
    baseShear: number; // Gaya geser dasar (kN)
    drift: number; // Simpangan antar lantai (mm)
    demandCapacityRatio: number; // Rasio kebutuhan terhadap kapasitas
    isPass: boolean; // Apakah struktur memenuhi persyaratan
  };
  warnings?: string[];
  errors?: string[];
}

/**
 * Menghitung periode dasar struktur berdasarkan SNI 1726:2019 Pasal 7.8.2
 * @param height Tinggi total struktur (m)
 * @param ct Koefisien periode (0.0466 untuk rangka beton, 0.0724 untuk rangka baja)
 * @returns Periode dasar struktur (detik)
 */
export const calculateFundamentalPeriod = (height: number, structureType: 'concrete' | 'steel' = 'concrete'): number => {
  const ct = structureType === 'concrete' ? 0.0466 : 0.0724;
  const exponent = structureType === 'concrete' ? 0.9 : 0.8;
  return ct * Math.pow(height, exponent);
};

/**
 * Menghitung gaya geser dasar seismik berdasarkan SNI 1726:2019
 */
export const calculateBaseShear = ({
  spectralAcceleration,
  weight,
  responseModifier,
  importanceFactor
}: {
  spectralAcceleration: number; // Spektra respons percepatan (g)
  weight: number; // Berat seismik efektif (kN)
  responseModifier: number; // Faktor modifikasi respons (R)
  importanceFactor: number; // Faktor kepentingan (Ie)
}): number => {
  // Persamaan 7.8-1 SNI 1726:2019
  return (spectralAcceleration * weight * importanceFactor) / responseModifier;
};

/**
 * Menghitung simpangan antar lantai (drift) berdasarkan SNI 1726:2019
 */
export const calculateStoryDrift = ({
  displacement,
  storyHeight,
  importanceFactor,
  driftLimit = 0.02 // Batas drift untuk kategori risiko I (2% menurut Tabel 15)
}: {
  displacement: number; // Simpangan relatif antar lantai (mm)
  storyHeight: number; // Tinggi lantai (mm)
  importanceFactor: number; // Faktor kepentingan (Ie)
  driftLimit?: number; // Batas drift yang diijinkan
}): {
  driftRatio: number; // Rasio drift (Δ/h)
  isPass: boolean; // Apakah memenuhi persyaratan drift
  allowedDrift: number; // Simpangan yang diijinkan (mm)
} => {
  const driftRatio = displacement / storyHeight;
  const allowedDrift = driftLimit / importanceFactor;
  
  return {
    driftRatio,
    isPass: driftRatio <= allowedDrift,
    allowedDrift: allowedDrift * storyHeight // Kembalikan dalam satuan mm
  };
};

/**
 * Melakukan analisis struktur lengkap
 */
export const performStructuralAnalysis = (model: {
  materials: {
    fc: number;
    fy: number;
  };
  geometry: {
    length: number;
    width: number;
    heightPerFloor: number;
    numberOfFloors: number;
  };
  loads: {
    deadLoad: number; // kN/m²
    liveLoad: number; // kN/m²
  };
  seismic?: {
    zoneFactor: number;
    soilType: string;
    importanceFactor: number;
    responseModifier: number;
  };
}): AnalysisResult => {
  // Validasi input terlebih dahulu
  const modelWithEc = {
    ...model,
    materials: {
      ...model.materials,
      ec: model.materials.fc * 4700 // Standard approximation
    }
  };
  const validation = validateStructuralModel(modelWithEc);
  if (!validation.isValid) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: [validation.message || 'Parameter struktur tidak valid']
    };
  }

  const { materials, geometry, loads, seismic } = model;
  const results: AnalysisResult = {
    success: true,
    warnings: [],
    results: {
      period: 0,
      baseShear: 0,
      drift: 0,
      demandCapacityRatio: 0,
      isPass: false
    }
  };

  try {
    // 1. Hitung berat total struktur
    const area = geometry.length * geometry.width; // m²
    const totalHeight = geometry.heightPerFloor * geometry.numberOfFloors; // m
    const totalWeight = area * geometry.numberOfFloors * (loads.deadLoad + 0.3 * loads.liveLoad); // kN

    // 2. Analisis respons spektral (jika parameter gempa disediakan)
    if (seismic) {
      // Hitung periode dasar struktur
      const period = calculateFundamentalPeriod(totalHeight, 'concrete');
      
      // Hitung spektra respons (sederhana)
      const spectralAcceleration = seismic.zoneFactor * (1.0 / Math.pow(period, 0.75));
      
      // Hitung gaya geser dasar
      const baseShear = calculateBaseShear({
        spectralAcceleration,
        weight: totalWeight,
        responseModifier: seismic.responseModifier,
        importanceFactor: seismic.importanceFactor
      });

      // Hitung simpangan antar lantai
      const driftResults = calculateStoryDrift({
        displacement: 0.01 * geometry.heightPerFloor * 1000, // Contoh: 1% drift
        storyHeight: geometry.heightPerFloor * 1000, // Konversi ke mm
        importanceFactor: seismic.importanceFactor
      });

      // Update hasil analisis
      if (results.results) {
        results.results.period = period;
        results.results.baseShear = baseShear;
        results.results.drift = driftResults.driftRatio * 100; // dalam persen
        results.results.demandCapacityRatio = 0.75; // Contoh nilai D/C ratio
        results.results.isPass = driftResults.isPass && results.results.demandCapacityRatio <= 1.0;
      }

      // Tambahkan peringatan jika perlu
      if (driftResults.driftRatio > 0.01) {
        results.warnings?.push('Drift melebihi 1%, pertimbangkan untuk memperbesar dimensi elemen struktur');
      }
    }

    // 3. Analisis kapasitas lentur (contoh sederhana)
    if (results.results) {
      // Hitung kapasitas lentur balok (contoh sederhana)
      const b = 300; // lebar balok (mm)
      const d = 500; // tinggi efektif balok (mm)
      const As = 3 * 0.25 * Math.PI * Math.pow(16, 2); // Luas tulangan (3D16)
      
      // Hitung kapasitas momen nominal (SNI 2847:2019 Pasal 21.2)
      const a = (As * materials.fy) / (0.85 * materials.fc * b);
      const Mn = As * materials.fy * (d - a/2) / 1e6; // kNm
      
      // Hitung momen perlu (contoh sederhana)
      const wu = 1.2 * loads.deadLoad + 1.6 * loads.liveLoad; // Beban terfaktor (kN/m²)
      const Mu = (wu * Math.pow(geometry.width, 2)) / 10; // Momen perlu (kNm)
      
      // Hitung rasio kebutuhan terhadap kapasitas
      const demandCapacityRatio = Mu / (0.9 * Mn); // Faktor reduksi kekuatan = 0.9
      
      if (results.results) {
        results.results.demandCapacityRatio = demandCapacityRatio;
        results.results.isPass = demandCapacityRatio <= 1.0;
      }

      if (demandCapacityRatio > 0.9) {
        results.warnings?.push(`Rasio kebutuhan/kapasitas (${demandCapacityRatio.toFixed(2)}) mendekati batas maksimum. Pertimbangkan untuk menambah tulangan.`);
      }
    }

    return results;
  } catch (error) {
    console.error('Error dalam analisis struktur:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan dalam analisis struktur',
      errors: [error instanceof Error ? error.message : 'Kesalahan tidak diketahui']
    };
  }
};
