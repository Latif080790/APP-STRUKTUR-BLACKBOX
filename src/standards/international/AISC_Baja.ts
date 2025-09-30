/**
 * AISC 360-16 - Specification for Structural Steel Buildings
 * Implementation of structural steel design requirements
 */

export interface AISCSteelMaterial {
  id: string;
  name: string;
  grade: string;
  yieldStrength: number; // Fy in MPa
  ultimateStrength: number; // Fu in MPa
  modulusOfElasticity: number; // E in MPa
  poissonRatio: number;
  unitWeight: number; // kN/m³
  shearModulus: number; // G in MPa
}

export interface AISCSteelSection {
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

// Steel material properties according to AISC
export const AISC_STEEL_MATERIALS: AISCSteelMaterial[] = [
  { 
    id: "a36", 
    name: "A36 Steel", 
    grade: "A36", 
    yieldStrength: 250, 
    ultimateStrength: 400, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  },
  { 
    id: "a572", 
    name: "A572 Grade 50 Steel", 
    grade: "A572-50", 
    yieldStrength: 345, 
    ultimateStrength: 450, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  },
  { 
    id: "a992", 
    name: "A992 Steel", 
    grade: "A992", 
    yieldStrength: 345, 
    ultimateStrength: 450, 
    modulusOfElasticity: 200000, 
    poissonRatio: 0.3, 
    unitWeight: 77, 
    shearModulus: 77000 
  }
];

// Slenderness limits according to AISC
export const AISC_SLENDERNESS_LIMITS = {
  tensionMembers: 300,
  compressionMembers: 200,
  flexuralMembers: 300,
  connectionElements: 300
};

// Safety factors according to AISC
export const AISC_SAFETY_FACTORS = {
  yielding: 1.67,
  rupture: 2.00,
  buckling: 1.67,
  shear: 1.50,
  bearing: 1.50
};

/**
 * Calculate critical buckling stress for compression members according to AISC
 * @param section Steel section properties
 * @param length Unsupported length in mm
 * @param endCondition End condition factor (0.5-2.0)
 * @returns Critical buckling stress in MPa
 */
export function calculateAISCCriticalBucklingStress(
  section: AISCSteelSection,
  length: number,
  endCondition: number = 1.0
): number {
  const effectiveLength = length * endCondition;
  const slendernessRatio = effectiveLength / section.radiusOfGyrationX;
  
  // Euler buckling formula
  const eulerStress = (Math.PI * Math.PI * AISC_STEEL_MATERIALS[0].modulusOfElasticity) / 
                      (slendernessRatio * slendernessRatio);
  
  return eulerStress;
}

/**
 * Calculate nominal axial compressive strength according to AISC
 * @param section Steel section properties
 * @param length Unsupported length in mm
 * @param endCondition End condition factor
 * @returns Nominal compressive strength in kN
 */
export function calculateAISCNominalCompressiveStrength(
  section: AISCSteelSection,
  length: number,
  endCondition: number = 1.0
): number {
  const material = AISC_STEEL_MATERIALS[0]; // Default to A36
  const criticalStress = calculateAISCCriticalBucklingStress(section, length, endCondition);
  
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
 * Calculate nominal flexural strength according to AISC
 * @param section Steel section properties
 * @param laterallySupported Is the member laterally supported?
 * @returns Nominal flexural strength in kN·m
 */
export function calculateAISCNominalFlexuralStrength(
  section: AISCSteelSection,
  laterallySupported: boolean = true
): number {
  const material = AISC_STEEL_MATERIALS[0]; // Default to A36
  
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
 * Check slenderness ratio against limits according to AISC
 * @param section Steel section properties
 * @param length Unsupported length in mm
 * @param endCondition End condition factor
 * @param memberType Type of member
 * @returns Boolean indicating if slenderness is within limits
 */
export function checkAISCSlenderness(
  section: AISCSteelSection,
  length: number,
  endCondition: number = 1.0,
  memberType: keyof typeof AISC_SLENDERNESS_LIMITS = "compressionMembers"
): boolean {
  const effectiveLength = length * endCondition;
  const slendernessRatio = effectiveLength / section.radiusOfGyrationX;
  const limit = AISC_SLENDERNESS_LIMITS[memberType];
  
  return slendernessRatio <= limit;
}

/**
 * Get AISC steel material by ID
 * @param id Steel material ID
 * @returns AISC steel material object
 */
export function getAISCSteelMaterial(id: string): AISCSteelMaterial | undefined {
  return AISC_STEEL_MATERIALS.find(material => material.id === id);
}

/**
 * Get AISC steel section by ID
 * @param id Steel section ID
 * @returns AISC steel section object
 */
export function getAISCSteelSection(id: string): AISCSteelSection | undefined {
  // In a real implementation, this would reference a comprehensive database of AISC sections
  return undefined;
}

export default {
  AISC_STEEL_MATERIALS,
  AISC_SLENDERNESS_LIMITS,
  AISC_SAFETY_FACTORS,
  calculateAISCCriticalBucklingStress,
  calculateAISCNominalCompressiveStrength,
  calculateAISCNominalFlexuralStrength,
  checkAISCSlenderness,
  getAISCSteelMaterial,
  getAISCSteelSection
};