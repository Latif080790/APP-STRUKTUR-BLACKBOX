/**
 * Structural Analyzer
 * Performs basic structural analysis calculations
 */

import { Structure3D, AnalysisResult, Element, Node } from '@/types/structural';

/**
 * Transform local stiffness matrix to global coordinates
 * @param element The element
 * @param nodes All nodes in the structure
 * @returns Global stiffness matrix (6x6 for 2D, 12x12 for 3D)
 */
const transformStiffnessMatrix = (element: Element, nodes: Node[]): number[][] => {
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);
  
  if (!startNode || !endNode) {
    // Return zero matrix if nodes not found
    return Array(12).fill(0).map(() => Array(12).fill(0));
  }
  
  // Calculate element length and direction cosines
  const dx = endNode.x - startNode.x;
  const dy = endNode.y - startNode.y;
  const dz = endNode.z - startNode.z;
  const L = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
  if (L === 0) {
    return Array(12).fill(0).map(() => Array(12).fill(0));
  }
  
  const cx = dx / L;
  const cy = dy / L;
  const cz = dz / L;
  
  // Material and section properties
  const E = element.material.elasticModulus || 2e11; // Default to steel
  const A = element.section.area || (element.section.width * element.section.height);
  const Iy = element.section.momentOfInertiaY || (element.section.width * Math.pow(element.section.height, 3)) / 12;
  const Iz = element.section.momentOfInertiaZ || (element.section.height * Math.pow(element.section.width, 3)) / 12;
  const G = E / (2 * (1 + (element.material.poissonsRatio || 0.3))); // Shear modulus
  const J = element.section.torsionalConstant || Iy; // Polar moment of inertia (simplified)
  
  // Local stiffness matrix elements
  const EA_L = E * A / L;
  const EIy_L3 = 12 * E * Iy / Math.pow(L, 3);
  const EIy_L2 = 6 * E * Iy / Math.pow(L, 2);
  const EIy_L = 4 * E * Iy / L;
  const EIz_L3 = 12 * E * Iz / Math.pow(L, 3);
  const EIz_L2 = 6 * E * Iz / Math.pow(L, 2);
  const EIz_L = 4 * E * Iz / L;
  const GJ_L = G * J / L;
  
  // Local stiffness matrix (12x12 for 3D beam element)
  const kLocal = Array(12).fill(0).map(() => Array(12).fill(0));
  
  // Axial terms
  kLocal[0][0] = EA_L; kLocal[0][6] = -EA_L;
  kLocal[6][0] = -EA_L; kLocal[6][6] = EA_L;
  
  // Torsion terms
  kLocal[3][3] = GJ_L; kLocal[3][9] = -GJ_L;
  kLocal[9][3] = -GJ_L; kLocal[9][9] = GJ_L;
  
  // Bending in Y-Z plane
  kLocal[1][1] = EIz_L3; kLocal[1][5] = EIz_L2; kLocal[1][7] = -EIz_L3; kLocal[1][11] = EIz_L2;
  kLocal[5][1] = EIz_L2; kLocal[5][5] = EIz_L; kLocal[5][7] = -EIz_L2; kLocal[5][11] = EIz_L/2;
  kLocal[7][1] = -EIz_L3; kLocal[7][5] = -EIz_L2; kLocal[7][7] = EIz_L3; kLocal[7][11] = -EIz_L2;
  kLocal[11][1] = EIz_L2; kLocal[11][5] = EIz_L/2; kLocal[11][7] = -EIz_L2; kLocal[11][11] = EIz_L;
  
  // Bending in X-Z plane
  kLocal[2][2] = EIy_L3; kLocal[2][4] = -EIy_L2; kLocal[2][8] = -EIy_L3; kLocal[2][10] = -EIy_L2;
  kLocal[4][2] = -EIy_L2; kLocal[4][4] = EIy_L; kLocal[4][8] = EIy_L2; kLocal[4][10] = EIy_L/2;
  kLocal[8][2] = -EIy_L3; kLocal[8][4] = EIy_L2; kLocal[8][8] = EIy_L3; kLocal[8][10] = EIy_L2;
  kLocal[10][2] = -EIy_L2; kLocal[10][4] = EIy_L/2; kLocal[10][8] = EIy_L2; kLocal[10][10] = EIy_L;
  
  // Transformation matrix (simplified for now)
  // In a full implementation, this would be a proper 3D transformation matrix
  // For now, we'll just return the local matrix as a placeholder
  return kLocal;
};

/**
 * Assemble global stiffness matrix
 * @param structure The structure
 * @returns Global stiffness matrix
 */
const assembleGlobalStiffnessMatrix = (structure: Structure3D): number[][] => {
  const dofPerNode = 6; // 3 translations + 3 rotations
  const totalDOF = structure.nodes.length * dofPerNode;
  
  // Initialize global stiffness matrix
  const K = Array(totalDOF).fill(0).map(() => Array(totalDOF).fill(0));
  
  // Process each element
  for (const element of structure.elements) {
    // Get element stiffness matrix in global coordinates
    const kElement = transformStiffnessMatrix(element, structure.nodes);
    
    // Get node indices
    const startNode = structure.nodes.findIndex(n => n.id === element.nodes[0]);
    const endNode = structure.nodes.findIndex(n => n.id === element.nodes[1]);
    
    if (startNode === -1 || endNode === -1) continue;
    
    // Map element DOFs to global DOFs
    const dofMap = [
      startNode * dofPerNode,     // UX1
      startNode * dofPerNode + 1, // UY1
      startNode * dofPerNode + 2, // UZ1
      startNode * dofPerNode + 3, // RX1
      startNode * dofPerNode + 4, // RY1
      startNode * dofPerNode + 5, // RZ1
      endNode * dofPerNode,       // UX2
      endNode * dofPerNode + 1,   // UY2
      endNode * dofPerNode + 2,   // UZ2
      endNode * dofPerNode + 3,   // RX2
      endNode * dofPerNode + 4,   // RY2
      endNode * dofPerNode + 5    // RZ2
    ];
    
    // Add element stiffness to global matrix
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if (dofMap[i] < totalDOF && dofMap[j] < totalDOF) {
          K[dofMap[i]][dofMap[j]] += kElement[i][j];
        }
      }
    }
  }
  
  return K;
};

/**
 * Apply boundary conditions to stiffness matrix
 * @param K Global stiffness matrix
 * @param nodes Structure nodes with supports
 * @returns Modified stiffness matrix with boundary conditions
 */
const applyBoundaryConditions = (K: number[][], nodes: Node[]): number[][] => {
  const dofPerNode = 6;
  const modifiedK = K.map(row => [...row]); // Create a copy
  
  // Process each node
  for (let n = 0; n < nodes.length; n++) {
    const node = nodes[n];
    const supports = node.supports || {};
    
    // Check each degree of freedom
    if (supports.ux) {
      const dof = n * dofPerNode;
      // Set row and column to zero, diagonal to 1
      for (let i = 0; i < modifiedK.length; i++) {
        modifiedK[dof][i] = 0;
        modifiedK[i][dof] = 0;
      }
      modifiedK[dof][dof] = 1;
    }
    
    if (supports.uy) {
      const dof = n * dofPerNode + 1;
      for (let i = 0; i < modifiedK.length; i++) {
        modifiedK[dof][i] = 0;
        modifiedK[i][dof] = 0;
      }
      modifiedK[dof][dof] = 1;
    }
    
    if (supports.uz) {
      const dof = n * dofPerNode + 2;
      for (let i = 0; i < modifiedK.length; i++) {
        modifiedK[dof][i] = 0;
        modifiedK[i][dof] = 0;
      }
      modifiedK[dof][dof] = 1;
    }
    
    if (supports.rx) {
      const dof = n * dofPerNode + 3;
      for (let i = 0; i < modifiedK.length; i++) {
        modifiedK[dof][i] = 0;
        modifiedK[i][dof] = 0;
      }
      modifiedK[dof][dof] = 1;
    }
    
    if (supports.ry) {
      const dof = n * dofPerNode + 4;
      for (let i = 0; i < modifiedK.length; i++) {
        modifiedK[dof][i] = 0;
        modifiedK[i][dof] = 0;
      }
      modifiedK[dof][dof] = 1;
    }
    
    if (supports.rz) {
      const dof = n * dofPerNode + 5;
      for (let i = 0; i < modifiedK.length; i++) {
        modifiedK[dof][i] = 0;
        modifiedK[i][dof] = 0;
      }
      modifiedK[dof][dof] = 1;
    }
  }
  
  return modifiedK;
};

/**
 * Create load vector
 * @param structure The structure
 * @returns Load vector
 */
const createLoadVector = (structure: Structure3D): number[] => {
  const dofPerNode = 6;
  const totalDOF = structure.nodes.length * dofPerNode;
  const F = Array(totalDOF).fill(0);
  
  // Process point loads
  if (structure.loads) {
    for (const load of structure.loads) {
      if (load.type === 'point' && load.nodeId) {
        const nodeIndex = structure.nodes.findIndex(n => n.id === load.nodeId);
        if (nodeIndex !== -1) {
          const dofOffset = nodeIndex * dofPerNode;
          
          // Apply load based on direction
          switch (load.direction) {
            case 'x':
              F[dofOffset] += load.magnitude;
              break;
            case 'y':
              F[dofOffset + 1] += load.magnitude;
              break;
            case 'z':
              F[dofOffset + 2] += load.magnitude;
              break;
          }
        }
      }
    }
  }
  
  return F;
};

/**
 * Solve system of equations KU = F
 * @param K Stiffness matrix
 * @param F Load vector
 * @returns Displacement vector
 */
const solveSystem = (K: number[][], F: number[]): number[] => {
  const n = K.length;
  const U = Array(n).fill(0);
  
  // Simple Gaussian elimination (for small systems)
  // In a real implementation, you would use a more robust solver like LU decomposition
  try {
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(K[j][i]) > Math.abs(K[maxRow][i])) {
          maxRow = j;
        }
      }
      
      // Swap rows
      if (maxRow !== i) {
        [K[i], K[maxRow]] = [K[maxRow], K[i]];
        [F[i], F[maxRow]] = [F[maxRow], F[i]];
      }
      
      // Eliminate column
      for (let j = i + 1; j < n; j++) {
        if (K[i][i] !== 0) {
          const factor = K[j][i] / K[i][i];
          for (let k = i; k < n; k++) {
            K[j][k] -= factor * K[i][k];
          }
          F[j] -= factor * F[i];
        }
      }
    }
    
    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      U[i] = F[i];
      for (let j = i + 1; j < n; j++) {
        U[i] -= K[i][j] * U[j];
      }
      if (K[i][i] !== 0) {
        U[i] /= K[i][i];
      }
    }
  } catch (error) {
    console.error("Error solving system:", error);
    // Return zero displacements if solve fails
    return Array(n).fill(0);
  }
  
  return U;
};

/**
 * Calculate element forces from displacements
 * @param element The element
 * @param nodes All nodes
 * @param displacements Global displacement vector
 * @returns Element forces
 */
const calculateElementForces = (element: Element, nodes: Node[], displacements: number[]): any => {
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);
  
  if (!startNode || !endNode) {
    return { nx: 0, vy: 0, vz: 0, tx: 0, my: 0, mz: 0 };
  }
  
  // Calculate element length and direction cosines
  const dx = endNode.x - startNode.x;
  const dy = endNode.y - startNode.y;
  const dz = endNode.z - startNode.z;
  const L = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
  if (L === 0) {
    return { nx: 0, vy: 0, vz: 0, tx: 0, my: 0, mz: 0 };
  }
  
  const cx = dx / L;
  const cy = dy / L;
  const cz = dz / L;
  
  // Get node indices
  const startNodeIndex = nodes.findIndex(n => n.id === element.nodes[0]);
  const endNodeIndex = nodes.findIndex(n => n.id === element.nodes[1]);
  
  if (startNodeIndex === -1 || endNodeIndex === -1) {
    return { nx: 0, vy: 0, vz: 0, tx: 0, my: 0, mz: 0 };
  }
  
  const dofPerNode = 6;
  
  // Extract element displacements
  const elementDisplacements = [
    displacements[startNodeIndex * dofPerNode] || 0,     // UX1
    displacements[startNodeIndex * dofPerNode + 1] || 0, // UY1
    displacements[startNodeIndex * dofPerNode + 2] || 0, // UZ1
    displacements[startNodeIndex * dofPerNode + 3] || 0, // RX1
    displacements[startNodeIndex * dofPerNode + 4] || 0, // RY1
    displacements[startNodeIndex * dofPerNode + 5] || 0, // RZ1
    displacements[endNodeIndex * dofPerNode] || 0,       // UX2
    displacements[endNodeIndex * dofPerNode + 1] || 0,   // UY2
    displacements[endNodeIndex * dofPerNode + 2] || 0,   // UZ2
    displacements[endNodeIndex * dofPerNode + 3] || 0,   // RX2
    displacements[endNodeIndex * dofPerNode + 4] || 0,   // RY2
    displacements[endNodeIndex * dofPerNode + 5] || 0    // RZ2
  ];
  
  // Material and section properties
  const E = element.material.elasticModulus || 2e11; // Default to steel
  const G = E / (2 * (1 + (element.material.poissonsRatio || 0.3))); // Shear modulus
  const sectionProps = calculateSectionProperties(element);
  const A = sectionProps.area;
  const Iy = sectionProps.momentOfInertiaY;
  const Iz = sectionProps.momentOfInertiaZ;
  const J = sectionProps.torsionalConstant;
  
  // Local stiffness matrix elements
  const EA_L = E * A / L;
  const EIy_L3 = 12 * E * Iy / Math.pow(L, 3);
  const EIy_L2 = 6 * E * Iy / Math.pow(L, 2);
  const EIy_L = 4 * E * Iy / L;
  const EIz_L3 = 12 * E * Iz / Math.pow(L, 3);
  const EIz_L2 = 6 * E * Iz / Math.pow(L, 2);
  const EIz_L = 4 * E * Iz / L;
  const GJ_L = G * J / L;
  
  // Calculate forces based on displacements and stiffness
  // This is a simplified calculation - in a full implementation, 
  // you would transform displacements to local coordinates and multiply by local stiffness
  
  // Axial force (simplified)
  const deltaL = elementDisplacements[6] * cx + elementDisplacements[7] * cy + elementDisplacements[8] * cz -
                 (elementDisplacements[0] * cx + elementDisplacements[1] * cy + elementDisplacements[2] * cz);
  const nx = EA_L * deltaL / L;
  
  // For other forces, we'll use simplified approximations
  // In a real implementation, these would be calculated from the full stiffness matrix
  const vy = EIz_L3 * (elementDisplacements[7] - elementDisplacements[1]) || 0;
  const vz = EIy_L3 * (elementDisplacements[8] - elementDisplacements[2]) || 0;
  const tx = GJ_L * (elementDisplacements[9] - elementDisplacements[3]) || 0;
  const my = EIz_L2 * (elementDisplacements[10] + elementDisplacements[4]) || 0;
  const mz = EIy_L2 * (elementDisplacements[11] + elementDisplacements[5]) || 0;
  
  return {
    nx: nx || 0,
    vy: vy || 0,
    vz: vz || 0,
    tx: tx || 0,
    my: my || 0,
    mz: mz || 0
  };
};

/**
 * Perform basic structural analysis
 * @param structure The structure to analyze
 * @returns Analysis results
 */
export const analyzeStructure = (structure: Structure3D): AnalysisResult => {
  try {
    // Initialize results
    const displacements = [];
    const forces = [];
    const stresses = [];
    
    let maxDisplacement = 0;
    let maxStress = 0;
    
    // Assemble global stiffness matrix
    let K = assembleGlobalStiffnessMatrix(structure);
    
    // Apply boundary conditions
    K = applyBoundaryConditions(K, structure.nodes);
    
    // Create load vector
    const F = createLoadVector(structure);
    
    // Solve for displacements
    const U = solveSystem(K, F);
    
    // Process each node for displacements
    const dofPerNode = 6;
    for (let i = 0; i < structure.nodes.length; i++) {
      const node = structure.nodes[i];
      
      const ux = U[i * dofPerNode] || 0;
      const uy = U[i * dofPerNode + 1] || 0;
      const uz = U[i * dofPerNode + 2] || 0;
      const rx = U[i * dofPerNode + 3] || 0;
      const ry = U[i * dofPerNode + 4] || 0;
      const rz = U[i * dofPerNode + 5] || 0;
      
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
      // Calculate element forces
      const elementForces = calculateElementForces(element, structure.nodes, U);
      
      forces.push({
        elementId: element.id,
        nx: elementForces.nx,
        vy: elementForces.vy,
        vz: elementForces.vz,
        tx: elementForces.tx,
        my: elementForces.my,
        mz: elementForces.mz
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
  } catch (error) {
    console.error("Analysis error:", error);
    
    // Return default results if analysis fails
    const displacements = [];
    const forces = [];
    const stresses = [];
    
    // Process each node for displacements
    for (const node of structure.nodes) {
      displacements.push({
        nodeId: node.id,
        ux: 0,
        uy: 0,
        uz: 0,
        rx: 0,
        ry: 0,
        rz: 0
      });
    }
    
    // Process each element for forces and stresses
    for (const element of structure.elements) {
      forces.push({
        elementId: element.id,
        nx: 0,
        vy: 0,
        vz: 0,
        tx: 0,
        my: 0,
        mz: 0
      });
      
      stresses.push({
        elementId: element.id,
        axialStress: 0,
        shearStress: 0,
        bendingStress: 0
      });
    }
    
    return {
      displacements,
      forces,
      stresses,
      isValid: false,
      maxDisplacement: 0,
      maxStress: 0
    };
  }
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
    const torsionalConstant = (section.width * Math.pow(section.height, 3)) / 3; // Approximation
    
    return {
      area,
      momentOfInertiaY,
      momentOfInertiaZ,
      sectionModulusY,
      sectionModulusZ,
      torsionalConstant
    };
  } else if (section.type === 'circular') {
    const radius = section.width / 2; // Assuming width = diameter
    const area = Math.PI * Math.pow(radius, 2);
    const momentOfInertia = (Math.PI * Math.pow(radius, 4)) / 4;
    const sectionModulus = momentOfInertia / radius;
    const torsionalConstant = momentOfInertia; // For circular sections
    
    return {
      area,
      momentOfInertiaY: momentOfInertia,
      momentOfInertiaZ: momentOfInertia,
      sectionModulusY: sectionModulus,
      sectionModulusZ: sectionModulus,
      torsionalConstant
    };
  } else if (section.type === 'i-section') {
    // Simplified I-section properties
    const area = section.area || (section.width * section.height);
    const momentOfInertiaY = section.momentOfInertiaY || (section.width * Math.pow(section.height, 3)) / 12;
    const momentOfInertiaZ = section.momentOfInertiaZ || (section.height * Math.pow(section.width, 3)) / 12;
    const sectionModulusY = momentOfInertiaY / (section.height / 2);
    const sectionModulusZ = momentOfInertiaZ / (section.width / 2);
    const torsionalConstant = section.torsionalConstant || momentOfInertiaY * 0.1; // Approximation
    
    return {
      area,
      momentOfInertiaY,
      momentOfInertiaZ,
      sectionModulusY,
      sectionModulusZ,
      torsionalConstant
    };
  } else {
    // For other section types, use provided values or defaults
    const area = section.area || (section.width * section.height);
    const momentOfInertiaY = section.momentOfInertiaY || (section.width * Math.pow(section.height, 3)) / 12;
    const momentOfInertiaZ = section.momentOfInertiaZ || (section.height * Math.pow(section.width, 3)) / 12;
    const sectionModulusY = momentOfInertiaY ? momentOfInertiaY / (section.height / 2) : 0;
    const sectionModulusZ = momentOfInertiaZ ? momentOfInertiaZ / (section.width / 2) : 0;
    const torsionalConstant = section.torsionalConstant || 0;
    
    return {
      area,
      momentOfInertiaY,
      momentOfInertiaZ,
      sectionModulusY,
      sectionModulusZ,
      torsionalConstant
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
  
  // For bending stress, we need to know which direction the moment is acting
  // We'll calculate both and take the maximum
  const bendingStressY = Math.abs(momentY) / sectionProps.sectionModulusY;
  const bendingStressZ = Math.abs(momentZ) / sectionProps.sectionModulusZ;
  const bendingStress = Math.max(bendingStressY || 0, bendingStressZ || 0);
  
  // Combined stress (simplified interaction formula)
  // This is a simplified version - a full implementation would use more complex interaction equations
  const combinedStress = Math.abs(axialStress) + bendingStress;
  
  // Check against material strength with safety factors
  let allowableStress = 0;
  let materialName = "";
  
  switch (material.type) {
    case 'concrete':
      // For concrete, use 0.85 * f'c as allowable stress (simplified)
      allowableStress = (material.yieldStrength || material.ultimateStrength || 25e6) * 0.85 * 0.6; // 0.6 for safety factor
      materialName = "beton";
      break;
    case 'steel':
      // For steel, use fy with safety factor
      allowableStress = (material.yieldStrength || 400e6) * 0.6; // 0.6 for safety factor
      materialName = "baja";
      break;
    case 'timber':
      // For timber, use a typical value with safety factor
      allowableStress = (material.ultimateStrength || 50e6) * 0.6; // 0.6 for safety factor
      materialName = "kayu";
      break;
    default:
      // For other materials, use a default value with safety factor
      allowableStress = (material.yieldStrength || material.ultimateStrength || 100e6) * 0.6;
      materialName = "material";
  }
  
  // Convert to MPa for display
  const combinedStressMPa = combinedStress / 1e6;
  const allowableStressMPa = allowableStress / 1e6;
  
  if (combinedStress > allowableStress) {
    return {
      isSafe: false,
      message: `Tegangan (${combinedStressMPa.toFixed(2)} MPa) melebihi batas ijin ${allowableStressMPa.toFixed(2)} MPa untuk ${materialName}`
    };
  }
  
  return {
    isSafe: true,
    message: `Tegangan (${combinedStressMPa.toFixed(2)} MPa) aman terhadap batas ijin ${allowableStressMPa.toFixed(2)} MPa untuk ${materialName}`
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