/**
 * SNI 1729:2020 - Spesifikasi untuk bangunan gedung baja struktural
 * Implementation of structural steel design requirements
 */

export interface SteelMaterial {
  id: string;
  name: string;
  grade: string;
  yieldStrength: number; // fy in MPa
  ultimateStrength: number; // fu in MPa
  modulusOfElasticity: number; // E in MPa
  poissonRatio: number;
  unitWeight: number; // kN/m³
  shearModulus: number; // G in MPa
}

export interface SteelSection {
  id: string;
  name: string;
  type: string;
  depth: number; // mm
  width: number; // mm
  flangeThickness: number; // mm
  webThickness: number; // mm
  area: number; // mm²
  momentOfInertiaX: number; // mm⁴
  momentOfInertiaY: number; // mm⁴
  sectionModulusX: number; // mm³
  sectionModulusY: number; // mm³
  radiusOfGyrationX: number; // mm
  radiusOfGyrationY: number; // mm
  torsionalConstant: number; // mm⁴
  warpingConstant: number; // mm⁶
}

// Steel material properties according to SNI 1729
export const STEEL_MATERIALS: SteelMaterial[] = [
  { 
    id: "bj37", 
    name: "Baja BJ 37", 
    grade: "BJ 37", 
    yieldStrength: 240, 
    ultimateStrength: 370, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  },
  { 
    id: "bj41", 
    name: "Baja BJ 41", 
    grade: "BJ 41", 
    yieldStrength: 250, 
    ultimateStrength: 410, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  },
  { 
    id: "bj50", 
    name: "Baja BJ 50", 
    grade: "BJ 50", 
    yieldStrength: 290, 
    ultimateStrength: 500, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  },
  { 
    id: "bj55", 
    name: "Baja BJ 55", 
    grade: "BJ 55", 
    yieldStrength: 410, 
    ultimateStrength: 550, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  }
];

// Common steel sections (simplified data)
export const STEEL_SECTIONS: SteelSection[] = [
  {
    id: "wf200x100x5.5x8",
    name: "WF 200x100x5.5x8",
    type: "I-Section",
    depth: 200,
    width: 100,
    flangeThickness: 8,
    webThickness: 5.5,
    area: 2830,
    momentOfInertiaX: 22500000,
    momentOfInertiaY: 2250000,
    sectionModulusX: 225000,
    sectionModulusY: 45000,
    radiusOfGyrationX: 89.2,
    radiusOfGyrationY: 28.2,
    torsionalConstant: 125000,
    warpingConstant: 450000000
  },
  {
    id: "wf250x125x6x9",
    name: "WF 250x125x6x9",
    type: "I-Section",
    depth: 250,
    width: 125,
    flangeThickness: 9,
    webThickness: 6,
    area: 4200,
    momentOfInertiaX: 53200000,
    momentOfInertiaY: 4200000,
    sectionModulusX: 426000,
    sectionModulusY: 67200,
    radiusOfGyrationX: 112.5,
    radiusOfGyrationY: 31.6,
    torsionalConstant: 225000,
    warpingConstant: 1050000000
  },
  {
    id: "wf300x150x6.5x9",
    name: "WF 300x150x6.5x9",
    type: "I-Section",
    depth: 300,
    width: 150,
    flangeThickness: 9,
    webThickness: 6.5,
    area: 5300,
    momentOfInertiaX: 98000000,
    momentOfInertiaY: 6500000,
    sectionModulusX: 653000,
    sectionModulusY: 86700,
    radiusOfGyrationX: 136.1,
    radiusOfGyrationY: 35.0,
    torsionalConstant: 350000,
    warpingConstant: 1950000000
  }
];

// Slenderness limits according to SNI 1729
export const SLENDERNESS_LIMITS = {
  tensionMembers: 300,
  compressionMembers: 200,
  flexuralMembers: 250,
  connectionElements: 300
};

// Safety factors according to SNI 1729
export const SAFETY_FACTORS = {
  yielding: 1.67,
  rupture: 2.00,
  buckling: 1.67,
  shear: 1.50,
  bearing: 1.50
};

/**
 * Calculate critical buckling stress for compression members
 * @param section Steel section properties
 * @param length Unsupported length in mm
 * @param endCondition End condition factor (0.5-2.0)
 * @returns Critical buckling stress in MPa
 */
export function calculateCriticalBucklingStress(
  section: SteelSection,
  length: number,
  endCondition: number = 1.0
): number {
  const effectiveLength = length * endCondition;
  const slendernessRatio = effectiveLength / section.radiusOfGyrationX;
  
  // Euler buckling formula
  const eulerStress = (Math.PI * Math.PI * STEEL_MATERIALS[0].modulusOfElasticity) / 
                      (slendernessRatio * slendernessRatio);
  
  return eulerStress;
}

/**
 * Calculate nominal axial compressive strength
 * @param section Steel section properties
 * @param length Unsupported length in mm
 * @param endCondition End condition factor
 * @returns Nominal compressive strength in kN
 */
export function calculateNominalCompressiveStrength(
  section: SteelSection,
  length: number,
  endCondition: number = 1.0
): number {
  const material = STEEL_MATERIALS[0]; // Default to BJ 37
  const criticalStress = calculateCriticalBucklingStress(section, length, endCondition);
  
  // Determine if member is slender or compact
  let nominalStress;
  if (criticalStress > material.yieldStrength) {
    // Elastic buckling controls
    nominalStress = criticalStress;
  } else {
    // Inelastic buckling controls
    nominalStress = Math.min(criticalStress, material.yieldStrength);
  }
  
  return (nominalStress * section.area) / 1000; // Convert to kN
}

/**
 * Calculate nominal flexural strength
 * @param section Steel section properties
 * @param laterallySupported Is the member laterally supported?
 * @returns Nominal flexural strength in kN·m
 */
export function calculateNominalFlexuralStrength(
  section: SteelSection,
  laterallySupported: boolean = true
): number {
  const material = STEEL_MATERIALS[0]; // Default to BJ 37
  
  if (laterallySupported) {
    // Yielding controls for laterally supported members
    const moment = (material.yieldStrength * section.sectionModulusX) / 1000000; // Convert to kN·m
    return moment;
  } else {
    // Lateral-torsional buckling for unsupported members
    // Simplified calculation - in practice this would be more complex
    const moment = (0.9 * material.yieldStrength * section.sectionModulusX) / 1000000;
    return moment;
  }
}

/**
 * Check slenderness ratio against limits
 * @param section Steel section properties
 * @param length Unsupported length in mm
 * @param endCondition End condition factor
 * @param memberType Type of member
 * @returns Boolean indicating if slenderness is within limits
 */
export function checkSlenderness(
  section: SteelSection,
  length: number,
  endCondition: number = 1.0,
  memberType: keyof typeof SLENDERNESS_LIMITS = "compressionMembers"
): boolean {
  const effectiveLength = length * endCondition;
  const slendernessRatio = effectiveLength / section.radiusOfGyrationX;
  const limit = SLENDERNESS_LIMITS[memberType];
  
  return slendernessRatio <= limit;
}

/**
 * Get steel material by ID
 * @param id Steel material ID
 * @returns Steel material object
 */
export function getSteelMaterial(id: string): SteelMaterial | undefined {
  return STEEL_MATERIALS.find(material => material.id === id);
}

/**
 * Get steel section by ID
 * @param id Steel section ID
 * @returns Steel section object
 */
export function getSteelSection(id: string): SteelSection | undefined {
  return STEEL_SECTIONS.find(section => section.id === id);
}

export default {
  STEEL_MATERIALS,
  STEEL_SECTIONS,
  SLENDERNESS_LIMITS,
  SAFETY_FACTORS,
  calculateCriticalBucklingStress,
  calculateNominalCompressiveStrength,
  calculateNominalFlexuralStrength,
  checkSlenderness,
  getSteelMaterial,
  getSteelSection
};