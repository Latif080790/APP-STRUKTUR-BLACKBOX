import { SoilData, MaterialProperties, LoadCombination, Geometry, Loads, ProjectInfo, ValidationError } from '../interfaces';

// Note: The function bodies are simplified based on the provided text.
// You will need to fill in the detailed logic.

export const performBasicCalculations = (
  geometry: Geometry, 
  loads: Loads, 
  projectInfo: ProjectInfo, 
  materials: MaterialProperties, 
  soilData: SoilData
) => {
  // Lakukan perhitungan dasar di sini
  const results = {
    // Contoh hasil perhitungan
    totalArea: geometry.length * geometry.width,
    totalVolume: geometry.length * geometry.width * geometry.heightPerFloor * geometry.numberOfFloors,
    // Tambahkan hasil perhitungan lain sesuai kebutuhan
  };
  
  return results;
};

export const validateInputs = (geometry: Geometry, loads: Loads, projectInfo: ProjectInfo, materials: MaterialProperties, soilData: SoilData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Example validation logic (to be expanded)
  if (geometry.heightPerFloor < 2.4) {
    errors.push({
      field: 'heightPerFloor',
      message: 'Tinggi lantai minimum 2.4m (SNI 03-1728-2002)',
      severity: 'error'
    });
  }

  if (materials.fc < 20) {
    errors.push({
      field: 'fc',
      message: 'Mutu beton minimum fc\' = 20 MPa untuk struktur (SNI 2847:2019)',
      severity: 'error'
    });
  }

  if (geometry.length <= 0) {
    errors.push({
      field: 'length',
      message: 'Panjang bangunan harus lebih besar dari 0.',
      severity: 'error'
    });
  }

  if (geometry.width <= 0) {
    errors.push({
      field: 'width',
      message: 'Lebar bangunan harus lebih besar dari 0.',
      severity: 'error'
    });
  }

  if (geometry.numberOfFloors <= 0) {
    errors.push({
      field: 'numberOfFloors',
      message: 'Jumlah lantai harus lebih besar dari 0.',
      severity: 'error'
    });
  }

  if (geometry.baySpacingX <= 0) {
    errors.push({
      field: 'baySpacingX',
      message: 'Jarak antar kolom arah X harus lebih besar dari 0.',
      severity: 'error'
    });
  }

  if (geometry.baySpacingY <= 0) {
    errors.push({
      field: 'baySpacingY',
      message: 'Jarak antar kolom arah Y harus lebih besar dari 0.',
      severity: 'error'
    });
  }

  if (loads.deadLoad <= 0) {
    errors.push({
      field: 'deadLoad',
      message: 'Beban mati harus lebih besar dari 0.',
      severity: 'warning'
    });
  }

  if (loads.liveLoad <= 0) {
    errors.push({
      field: 'liveLoad',
      message: 'Beban hidup harus lebih besar dari 0.',
      severity: 'warning'
    });
  }

  return errors;
};

export const getLoadCombinations = (): LoadCombination[] => {
  return [
    { id: 'U1', name: 'Dead only', formula: '1.4D', dead: 1.4, live: 0, wind: 0, earthquake: 0, roof: 0, rain: 0 },
    { id: 'U2', name: 'Dead + Live', formula: '1.2D + 1.6L + 0.5Lr', dead: 1.2, live: 1.6, wind: 0, earthquake: 0, roof: 0.5, rain: 0 },
    { id: 'U3', name: 'Dead + Wind', formula: '1.2D + 1.0W + L + 0.5Lr', dead: 1.2, live: 1.0, wind: 1.0, earthquake: 0, roof: 0.5, rain: 0 },
    { id: 'U4', name: 'Dead + Seismic', formula: '1.2D + 1.0E + L', dead: 1.2, live: 1.0, wind: 0, earthquake: 1.0, roof: 0, rain: 0 },
    { id: 'U5', name: 'Reduced Dead + Wind', formula: '0.9D + 1.0W', dead: 0.9, live: 0, wind: 1.0, earthquake: 0, roof: 0, rain: 0 },
    { id: 'U6', name: 'Reduced Dead + Seismic', formula: '0.9D + 1.0E', dead: 0.9, live: 0, wind: 0, earthquake: 1.0, roof: 0, rain: 0 }
  ];
};

export const calculateBearingCapacity = (soilData: SoilData): number => {
    const c = soilData.cu; // kPa
    const phi = soilData.phi * Math.PI / 180; // Convert to radians
    const gamma = soilData.gamma; // kN/m³
    const B = 2; // Assumed foundation width (m)
    const Df = 1.5; // Foundation depth (m)
    
    let Nq: number, Nc: number, Ngamma: number;
    if (Math.abs(phi) < 1e-6) {
        // For phi ≈ 0°, typical values
        Nq = 1;
        Nc = 5.7;
        Ngamma = 0;
    } else {
        const tanPhi = Math.tan(phi);
        const term = Math.tan(Math.PI / 4 + phi / 2);
        Nq = Math.exp(Math.PI * tanPhi) * Math.pow(term, 2);
        Nc = (Nq - 1) / tanPhi;
        Ngamma = 2 * (Nq + 1) * tanPhi;
    }
    
    const qu = c * Nc + gamma * Df * Nq + 0.5 * gamma * B * Ngamma;
    const SF = 3;
    const qa = qu / SF;
    
    return qa;
};

export const calculateColumn = (floor: number, geometry: Geometry, loads: Loads, materials: MaterialProperties) => {
    // Simplified logic
    const tributaryArea = (geometry.baySpacingX * geometry.baySpacingY);
    const gf = 9.81 / 1000; // kN per kg
    const deadLoad = (loads.deadLoad + loads.partitionLoad) * gf; // kN/m²
    const liveLoad = loads.liveLoad * gf; // kN/m²
    const Pu = (1.2 * deadLoad + 1.6 * liveLoad) * tributaryArea * (geometry.numberOfFloors - floor + 1); // kN
    const Ag = Pu * 1000 / (0.65 * 0.8 * (0.85 * materials.fc * 0.99 + materials.fy * 0.01));
    const side = Math.sqrt(Ag);
    return { dimension: Math.ceil(side / 50) * 50, demand: Pu };
};

export const calculateBeam = (type: 'main' | 'secondary', geometry: Geometry, loads: Loads) => {
    const span = type === 'main' ? geometry.baySpacingX : geometry.baySpacingY;
    const tributaryWidth = type === 'main' ? geometry.baySpacingY / 2 : geometry.baySpacingX / 2;
    const gf = 9.81 / 1000; // kN per kg
    const deadLoad = (loads.deadLoad + loads.partitionLoad) * gf; // kN/m²
    const liveLoad = loads.liveLoad * gf; // kN/m²
    const wu = (1.2 * deadLoad + 1.6 * liveLoad) * tributaryWidth; // kN/m
    const Mu = wu * span * span / 8; // kNm
    return { moment: Mu };
};

export const calculateSlab = (geometry: Geometry, loads: Loads) => {
    const Lx = Math.min(geometry.baySpacingX, geometry.baySpacingY);
    const Ly = Math.max(geometry.baySpacingX, geometry.baySpacingY);
    const ratio = Ly / Lx;
    const isTwoWay = ratio <= 2;
    const hMin = isTwoWay ? Lx * 1000 / 30 : Lx * 1000 / 24;
    return { thickness: Math.max(hMin, 120), type: isTwoWay ? 'Two-way' : 'One-way' };
};
