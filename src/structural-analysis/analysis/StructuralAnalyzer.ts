/**
 * Structural Analyzer
 * Performs basic structural analysis calculations
 */

import { Structure3D, AnalysisResult, Element, Node } from '@/types/structural';

/**
 * Perform basic structural analysis
 * @param structure The structure to analyze
 * @returns Analysis results
 */
export const analyzeStructure = (structure: Structure3D): AnalysisResult => {
  // Initialize results
  const displacements = [];
  const forces = [];
  const stresses = [];
  
  let maxDisplacement = 0;
  let maxStress = 0;
  
  // Process each node for displacements
  for (const node of structure.nodes) {
    // Simplified displacement calculation (in a real system, this would involve solving matrix equations)
    const ux = 0; // X displacement
    const uy = 0; // Y displacement (vertical)
    const uz = 0; // Z displacement
    const rx = 0; // X rotation
    const ry = 0; // Y rotation
    const rz = 0; // Z rotation
    
    displacements.push({
      nodeId: node.id,
      ux,
      uy,
      uz,
      rx,
      ry,
      rz
    });
    
    // Track maximum displacement
    const totalDisplacement = Math.sqrt(ux*ux + uy*uy + uz*uz);
    if (totalDisplacement > maxDisplacement) {
      maxDisplacement = totalDisplacement;
    }
  }
  
  // Process each element for forces and stresses
  for (const element of structure.elements) {
    // Simplified force calculation
    const nx = 0; // Axial force
    const vy = 0; // Shear force Y
    const vz = 0; // Shear force Z
    const tx = 0; // Torsion
    const my = 0; // Moment Y
    const mz = 0; // Moment Z
    
    forces.push({
      elementId: element.id,
      nx,
      vy,
      vz,
      tx,
      my,
      mz
    });
    
    // Simplified stress calculation
    const axialStress = 0; // Pa
    const shearStress = 0; // Pa
    const bendingStress = 0; // Pa
    
    stresses.push({
      elementId: element.id,
      axialStress,
      shearStress,
      bendingStress
    });
    
    // Track maximum stress
    const maxElementStress = Math.max(Math.abs(axialStress), Math.abs(shearStress), Math.abs(bendingStress));
    if (maxElementStress > maxStress) {
      maxStress = maxElementStress;
    }
  }
  
  // Determine if structure is valid (simplified check)
  const isValid = maxDisplacement < 0.01 && maxStress < 100000000; // 100 MPa limit
  
  return {
    displacements,
    forces,
    stresses,
    isValid,
    maxDisplacement,
    maxStress
  };
};

/**
 * Calculate element length
 * @param element The element
 * @param nodes All nodes in the structure
 * @returns Length of the element
 */
export const calculateElementLength = (element: Element, nodes: Node[]): number => {
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);
  
  if (!startNode || !endNode) {
    return 0;
  }
  
  return Math.sqrt(
    Math.pow(endNode.x - startNode.x, 2) +
    Math.pow(endNode.y - startNode.y, 2) +
    Math.pow(endNode.z - startNode.z, 2)
  );
};

/**
 * Calculate section properties
 * @param element The element
 * @returns Section properties
 */
export const calculateSectionProperties = (element: Element) => {
  const section = element.section;
  
  if (section.type === 'rectangular') {
    const area = section.width * section.height;
    const momentOfInertiaY = (section.width * Math.pow(section.height, 3)) / 12;
    const momentOfInertiaZ = (section.height * Math.pow(section.width, 3)) / 12;
    const sectionModulusY = momentOfInertiaY / (section.height / 2);
    const sectionModulusZ = momentOfInertiaZ / (section.width / 2);
    
    return {
      area,
      momentOfInertiaY,
      momentOfInertiaZ,
      sectionModulusY,
      sectionModulusZ
    };
  } else if (section.type === 'circular') {
    const radius = section.width / 2; // Assuming width = diameter
    const area = Math.PI * Math.pow(radius, 2);
    const momentOfInertia = (Math.PI * Math.pow(radius, 4)) / 4;
    const sectionModulus = momentOfInertia / radius;
    
    return {
      area,
      momentOfInertiaY: momentOfInertia,
      momentOfInertiaZ: momentOfInertia,
      sectionModulusY: sectionModulus,
      sectionModulusZ: sectionModulus
    };
  } else {
    // For other section types, use provided values or defaults
    return {
      area: section.area || (section.width * section.height),
      momentOfInertiaY: section.momentOfInertiaY || 0,
      momentOfInertiaZ: section.momentOfInertiaZ || 0,
      sectionModulusY: section.momentOfInertiaY ? section.momentOfInertiaY / (section.height / 2) : 0,
      sectionModulusZ: section.momentOfInertiaZ ? section.momentOfInertiaZ / (section.width / 2) : 0
    };
  }
};

/**
 * Check element safety
 * @param element The element to check
 * @param axialForce Axial force in the element
 * @param momentY Moment about Y axis
 * @param momentZ Moment about Z axis
 * @returns Safety status
 */
export const checkElementSafety = (
  element: Element,
  axialForce: number,
  momentY: number,
  momentZ: number
): { isSafe: boolean; message: string } => {
  const material = element.material;
  const sectionProps = calculateSectionProperties(element);
  
  // Calculate stresses
  const axialStress = axialForce / sectionProps.area;
  const bendingStressY = momentY / sectionProps.sectionModulusY;
  const bendingStressZ = momentZ / sectionProps.sectionModulusZ;
  
  // Combined stress (simplified)
  const combinedStress = Math.abs(axialStress) + Math.abs(bendingStressY) + Math.abs(bendingStressZ);
  
  // Check against material strength (with safety factor)
  const allowableStress = material.yieldStrength ? material.yieldStrength * 0.6 : 100000000; // 100 MPa default
  
  if (combinedStress > allowableStress) {
    return {
      isSafe: false,
      message: `Stress (${(combinedStress / 1000000).toFixed(2)} MPa) exceeds allowable limit (${(allowableStress / 1000000).toFixed(2)} MPa)`
    };
  }
  
  return {
    isSafe: true,
    message: `Stress (${(combinedStress / 1000000).toFixed(2)} MPa) is within allowable limit`
  };
};

/**
 * Generate analysis report
 * @param analysisResult The analysis results
 * @returns Formatted report
 */
export const generateAnalysisReport = (analysisResult: AnalysisResult): string => {
  let report = `STRUCTURAL ANALYSIS REPORT\n`;
  report += `========================\n\n`;
  
  report += `STRUCTURE VALIDITY: ${analysisResult.isValid ? 'PASS' : 'FAIL'}\n`;
  report += `MAX DISPLACEMENT: ${(analysisResult.maxDisplacement * 1000).toFixed(2)} mm\n`;
  report += `MAX STRESS: ${(analysisResult.maxStress / 1000000).toFixed(2)} MPa\n\n`;
  
  report += `DISPLACEMENTS:\n`;
  for (const disp of analysisResult.displacements) {
    report += `  Node ${disp.nodeId}: UX=${disp.ux.toFixed(6)}m, UY=${disp.uy.toFixed(6)}m, UZ=${disp.uz.toFixed(6)}m\n`;
  }
  
  report += `\nINTERNAL FORCES:\n`;
  for (const force of analysisResult.forces) {
    report += `  Element ${force.elementId}: Nx=${force.nx.toFixed(2)}N, Vy=${force.vy.toFixed(2)}N, Vz=${force.vz.toFixed(2)}N\n`;
  }
  
  report += `\nSTRESSES:\n`;
  for (const stress of analysisResult.stresses) {
    report += `  Element ${stress.elementId}: σ_axial=${(stress.axialStress / 1000000).toFixed(2)}MPa, σ_shear=${(stress.shearStress / 1000000).toFixed(2)}MPa\n`;
  }
  
  return report;
};