/**
 * Modul Validasi untuk Aplikasi Analisis Struktur
 * Berdasarkan Standar SNI yang Berlaku
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validasi parameter material beton sesuai SNI 2847:2019
 */
export const validateConcreteProperties = (fc: number, ec: number): ValidationResult => {
  // Kekuatan beton minimum dan maksimum (dalam MPa)
  if (fc < 17 || fc > 83) {
    return {
      isValid: false,
      message: `Kekuatan beton (fc') ${fc} MPa di luar rentang yang diijinkan (17-83 MPa) sesuai SNI 2847:2019`,
      errors: [`Kekuatan beton (fc') ${fc} MPa di luar rentang yang diijinkan (17-83 MPa) sesuai SNI 2847:2019`]
    };
  }

  // Modulus elastisitas beton
  const wc = 2400; // Berat jenis beton normal (kg/m³)
  const expectedEc = 4700 * Math.sqrt(fc); // Rumus SNI 2847:2019
  
  if (Math.abs(ec - expectedEc) > 0.1 * expectedEc) {
    return {
      isValid: false,
      message: `Modulus elastisitas beton (Ec) tidak sesuai dengan perkiraan ${expectedEc.toFixed(0)} MPa untuk fc'=${fc} MPa`
    };
  }

  return { isValid: true };
};

/**
 * Validasi parameter material baja tulangan sesuai SNI 2847:2019
 */
export const validateSteelProperties = (fy: number): ValidationResult => {
  // Kekuatan leleh baja tulangan yang umum digunakan (MPa)
  const allowedFy = [240, 400, 500];
  
  if (!allowedFy.includes(fy)) {
    return {
      isValid: false,
      message: `Kekuatan leleh baja (fy) ${fy} MPa tidak standar. Gunakan salah satu dari: ${allowedFy.join(', ')} MPa`
    };
  }

  return { isValid: true };
};

/**
 * Validasi parameter geometri struktur
 */
export const validateGeometry = (geometry: {
  length: number;
  width: number;
  heightPerFloor: number;
  numberOfFloors: number;
}): ValidationResult => {
  const { length, width, heightPerFloor, numberOfFloors } = geometry;
  
  // Rasio aspek denah
  const aspectRatio = Math.max(length, width) / Math.min(length, width);
  if (aspectRatio > 6) {
    return {
      isValid: false,
      message: 'Rasio aspek denah melebihi batas yang direkomendasikan (maks 6:1)'
    };
  }

  // Tinggi lantai tipikal
  if (heightPerFloor < 2.8 || heightPerFloor > 5.0) {
    return {
      isValid: false,
      message: 'Tinggi lantai tipikal di luar rentang yang wajar (2.8m - 5.0m)'
    };
  }

  // Jumlah lantai
  if (numberOfFloors < 1 || numberOfFloors > 100) {
    return {
      isValid: false,
      message: 'Jumlah lantai di luar rentang yang valid (1-100)'
    };
  }

  return { isValid: true };
};

/**
 * Validasi parameter beban sesuai SNI 1727:2020
 */
export const validateLoads = (liveLoad: number, deadLoad: number): ValidationResult => {
  // Beban hidup minimum untuk lantai perkantoran (kN/m²)
  const MIN_LIVE_LOAD = 2.4;
  const MAX_LIVE_LOAD = 5.0;
  
  if (liveLoad < MIN_LIVE_LOAD || liveLoad > MAX_LIVE_LOAD) {
    return {
      isValid: false,
      message: `Beban hidup ${liveLoad} kN/m² di luar rentang tipikal untuk lantai perkantoran (${MIN_LIVE_LOAD}-${MAX_LIVE_LOAD} kN/m²)`
    };
  }

  // Rasio beban mati terhadap beban hidup
  const loadRatio = deadLoad / liveLoad;
  if (loadRatio < 1.5 || loadRatio > 3.0) {
    return {
      isValid: false,
      message: `Rasio beban mati/hidup (${loadRatio.toFixed(1)}) di luar rentang yang wajar (1.5-3.0)`
    };
  }

  return { isValid: true };
};

/**
 * Validasi parameter gempa sesuai SNI 1726:2019
 */
export const validateSeismicParameters = ({
  zoneFactor,
  soilType,
  importanceFactor,
  responseModifier
}: {
  zoneFactor: number;
  soilType: string;
  importanceFactor: number;
  responseModifier: number;
}): ValidationResult => {
  // Validasi zona gempa
  if (zoneFactor < 0.05 || zoneFactor > 0.35) {
    return {
      isValid: false,
      message: `Faktor zona gempa (${zoneFactor}) di luar rentang yang valid (0.05-0.35)`
    };
  }

  // Validasi tipe tanah
  const validSoilTypes = ['SD', 'SC', 'SB', 'SA', 'SE'];
  if (!validSoilTypes.includes(soilType)) {
    return {
      isValid: false,
      message: `Tipe tanah '${soilType}' tidak valid. Gunakan salah satu dari: ${validSoilTypes.join(', ')}`
    };
  }

  // Validasi faktor kepentingan
  if (![0.8, 1.0, 1.2, 1.5].includes(importanceFactor)) {
    return {
      isValid: false,
      message: 'Faktor kepentingan harus salah satu dari: 0.8, 1.0, 1.2, atau 1.5'
    };
  }

  // Validasi faktor modifikasi respons
  if (responseModifier < 1.5 || responseModifier > 8.0) {
    return {
      isValid: false,
      message: `Faktor modifikasi respons (${responseModifier}) di luar rentang yang valid (1.5-8.0)`
    };
  }

  return { isValid: true };
};

/**
 * Validasi keseluruhan model struktur
 */
export const validateStructuralModel = (model: {
  materials: {
    fc: number;
    ec: number;
    fy: number;
  };
  geometry: {
    length: number;
    width: number;
    heightPerFloor: number;
    numberOfFloors: number;
  };
  loads: {
    liveLoad: number;
    deadLoad: number;
  };
  seismic?: {
    zoneFactor: number;
    soilType: string;
    importanceFactor: number;
    responseModifier: number;
  };
}): ValidationResult => {
  // Validasi material
  const concreteValidation = validateConcreteProperties(model.materials.fc, model.materials.ec);
  if (!concreteValidation.isValid) return concreteValidation;

  const steelValidation = validateSteelProperties(model.materials.fy);
  if (!steelValidation.isValid) return steelValidation;

  // Validasi geometri
  const geometryValidation = validateGeometry(model.geometry);
  if (!geometryValidation.isValid) return geometryValidation;

  // Validasi beban
  const loadValidation = validateLoads(model.loads.liveLoad, model.loads.deadLoad);
  if (!loadValidation.isValid) return loadValidation;

  // Validasi parameter gempa (jika ada)
  if (model.seismic) {
    const seismicValidation = validateSeismicParameters(model.seismic);
    if (!seismicValidation.isValid) return seismicValidation;
  }

  return { isValid: true };
};
