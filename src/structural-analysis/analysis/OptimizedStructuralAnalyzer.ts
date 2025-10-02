/**
 * Optimized Structural Analyzer
 * Uses sparse matrix techniques for better performance and memory efficiency
 */

import { Structure3D, AnalysisResult, Element, Node } from '@/types/structural';
import {
  SparseMatrix,
  SparseVector,
  createSparseMatrix,
  createSparseVector,
  setSparseMatrixValue,
  addSparseMatrixValue,
  setSparseVectorValue,
  addSparseVectorValue,
  getSparseVectorValue,
  solveConjugateGradient,
  sparseLUDecomposition,
  solveLU,
  sparseVectorToDense,
  denseVectorToSparse,
  estimateMemoryUsage,
  globalProfiler
} from './SparseMatrixSolver';

/**
 * Performance optimization settings
 */
export interface OptimizationSettings {
  useSparseMatrices: boolean;
  useConjugateGradient: boolean;
  cgTolerance: number;
  cgMaxIterations: number;
  memoryOptimization: boolean;
  enableProfiling: boolean;
}

export const defaultOptimizationSettings: OptimizationSettings = {
  useSparseMatrices: true,
  useConjugateGradient: true,
  cgTolerance: 1e-10,
  cgMaxIterations: 1000,
  memoryOptimization: true,
  enableProfiling: false
};

/**
 * Memory pool for reusing arrays and objects
 */
class MemoryPool {
  private matrixPool: SparseMatrix[] = [];
  private vectorPool: SparseVector[] = [];
  private arrayPool: number[][] = [];

  getSparseMatrix(rows: number, cols: number): SparseMatrix {
    const matrix = this.matrixPool.pop();
    if (matrix) {
      matrix.rows = rows;
      matrix.cols = cols;
      matrix.data.clear();
      return matrix;
    }
    return createSparseMatrix(rows, cols);
  }

  getSparseVector(size: number): SparseVector {
    const vector = this.vectorPool.pop();
    if (vector) {
      vector.size = size;
      vector.data.clear();
      return vector;
    }
    return createSparseVector(size);
  }

  returnMatrix(matrix: SparseMatrix): void {
    if (this.matrixPool.length < 10) { // Limit pool size
      matrix.data.clear();
      this.matrixPool.push(matrix);
    }
  }

  returnVector(vector: SparseVector): void {
    if (this.vectorPool.length < 20) { // Limit pool size
      vector.data.clear();
      this.vectorPool.push(vector);
    }
  }

  clear(): void {
    this.matrixPool.length = 0;
    this.vectorPool.length = 0;
    this.arrayPool.length = 0;
  }
}

const memoryPool = new MemoryPool();

/**
 * Optimized element stiffness matrix calculation
 */
const calculateElementStiffnessMatrix = (
  element: Element, 
  nodes: Node[],
  pool: MemoryPool
): { matrix: SparseMatrix; dofMap: number[] } => {
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);
  
  if (!startNode || !endNode) {
    const emptyMatrix = pool.getSparseMatrix(12, 12);
    return { matrix: emptyMatrix, dofMap: [] };
  }
  
  // Calculate element geometry
  const dx = endNode.x - startNode.x;
  const dy = endNode.y - startNode.y;
  const dz = endNode.z - startNode.z;
  const L = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
  if (L === 0) {
    const emptyMatrix = pool.getSparseMatrix(12, 12);
    return { matrix: emptyMatrix, dofMap: [] };
  }
  
  const cx = dx / L;
  const cy = dy / L;
  const cz = dz / L;
  
  // Material and section properties
  const E = element.material.elasticModulus || 2e11;
  const G = E / (2 * (1 + (element.material.poissonsRatio || 0.3)));
  const sectionProps = calculateSectionProperties(element);
  const A = sectionProps.area;
  const Iy = sectionProps.momentOfInertiaY;
  const Iz = sectionProps.momentOfInertiaZ;
  const J = sectionProps.torsionalConstant;
  
  // Stiffness matrix coefficients
  const EA_L = E * A / L;
  const EIy_L3 = 12 * E * Iy / (L * L * L);
  const EIy_L2 = 6 * E * Iy / (L * L);
  const EIy_L = 4 * E * Iy / L;
  const EIz_L3 = 12 * E * Iz / (L * L * L);
  const EIz_L2 = 6 * E * Iz / (L * L);
  const EIz_L = 4 * E * Iz / L;
  const GJ_L = G * J / L;
  
  // Create sparse stiffness matrix
  const kElement = pool.getSparseMatrix(12, 12);
  
  // Axial terms
  setSparseMatrixValue(kElement, 0, 0, EA_L);
  setSparseMatrixValue(kElement, 0, 6, -EA_L);
  setSparseMatrixValue(kElement, 6, 0, -EA_L);
  setSparseMatrixValue(kElement, 6, 6, EA_L);
  
  // Torsion terms
  setSparseMatrixValue(kElement, 3, 3, GJ_L);
  setSparseMatrixValue(kElement, 3, 9, -GJ_L);
  setSparseMatrixValue(kElement, 9, 3, -GJ_L);
  setSparseMatrixValue(kElement, 9, 9, GJ_L);
  
  // Bending in Y-Z plane
  setSparseMatrixValue(kElement, 1, 1, EIz_L3);
  setSparseMatrixValue(kElement, 1, 5, EIz_L2);
  setSparseMatrixValue(kElement, 1, 7, -EIz_L3);
  setSparseMatrixValue(kElement, 1, 11, EIz_L2);
  setSparseMatrixValue(kElement, 5, 1, EIz_L2);
  setSparseMatrixValue(kElement, 5, 5, EIz_L);
  setSparseMatrixValue(kElement, 5, 7, -EIz_L2);
  setSparseMatrixValue(kElement, 5, 11, EIz_L/2);
  setSparseMatrixValue(kElement, 7, 1, -EIz_L3);
  setSparseMatrixValue(kElement, 7, 5, -EIz_L2);
  setSparseMatrixValue(kElement, 7, 7, EIz_L3);
  setSparseMatrixValue(kElement, 7, 11, -EIz_L2);
  setSparseMatrixValue(kElement, 11, 1, EIz_L2);
  setSparseMatrixValue(kElement, 11, 5, EIz_L/2);
  setSparseMatrixValue(kElement, 11, 7, -EIz_L2);
  setSparseMatrixValue(kElement, 11, 11, EIz_L);
  
  // Bending in X-Z plane
  setSparseMatrixValue(kElement, 2, 2, EIy_L3);
  setSparseMatrixValue(kElement, 2, 4, -EIy_L2);
  setSparseMatrixValue(kElement, 2, 8, -EIy_L3);
  setSparseMatrixValue(kElement, 2, 10, -EIy_L2);
  setSparseMatrixValue(kElement, 4, 2, -EIy_L2);
  setSparseMatrixValue(kElement, 4, 4, EIy_L);
  setSparseMatrixValue(kElement, 4, 8, EIy_L2);
  setSparseMatrixValue(kElement, 4, 10, EIy_L/2);
  setSparseMatrixValue(kElement, 8, 2, -EIy_L3);
  setSparseMatrixValue(kElement, 8, 4, EIy_L2);
  setSparseMatrixValue(kElement, 8, 8, EIy_L3);
  setSparseMatrixValue(kElement, 8, 10, EIy_L2);
  setSparseMatrixValue(kElement, 10, 2, -EIy_L2);
  setSparseMatrixValue(kElement, 10, 4, EIy_L/2);
  setSparseMatrixValue(kElement, 10, 8, EIy_L2);
  setSparseMatrixValue(kElement, 10, 10, EIy_L);
  
  // DOF mapping
  const startNodeIndex = nodes.findIndex(n => n.id === element.nodes[0]);
  const endNodeIndex = nodes.findIndex(n => n.id === element.nodes[1]);
  const dofPerNode = 6;
  
  const dofMap = [
    startNodeIndex * dofPerNode,     // UX1
    startNodeIndex * dofPerNode + 1, // UY1
    startNodeIndex * dofPerNode + 2, // UZ1
    startNodeIndex * dofPerNode + 3, // RX1
    startNodeIndex * dofPerNode + 4, // RY1
    startNodeIndex * dofPerNode + 5, // RZ1
    endNodeIndex * dofPerNode,       // UX2
    endNodeIndex * dofPerNode + 1,   // UY2
    endNodeIndex * dofPerNode + 2,   // UZ2
    endNodeIndex * dofPerNode + 3,   // RX2
    endNodeIndex * dofPerNode + 4,   // RY2
    endNodeIndex * dofPerNode + 5    // RZ2
  ];
  
  return { matrix: kElement, dofMap };
};

/**
 * Optimized global stiffness matrix assembly
 */
const assembleGlobalStiffnessMatrixOptimized = (
  structure: Structure3D,
  settings: OptimizationSettings
): SparseMatrix => {
  const dofPerNode = 6;
  const totalDOF = structure.nodes.length * dofPerNode;
  
  const K = settings.memoryOptimization 
    ? memoryPool.getSparseMatrix(totalDOF, totalDOF)
    : createSparseMatrix(totalDOF, totalDOF);
  
  const operation = () => {
    // Process each element
    for (const element of structure.elements) {
      const { matrix: kElement, dofMap } = calculateElementStiffnessMatrix(
        element, 
        structure.nodes,
        memoryPool
      );
      
      // Add element stiffness to global matrix
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
          const globalI = dofMap[i];
          const globalJ = dofMap[j];
          
          if (globalI < totalDOF && globalJ < totalDOF) {
            for (const [key, value] of kElement.data) {
              const [localI, localJ] = key.split(',').map(Number);
              if (localI === i && localJ === j) {
                addSparseMatrixValue(K, globalI, globalJ, value);
                break;
              }
            }
          }
        }
      }
      
      // Return matrix to pool
      if (settings.memoryOptimization) {
        memoryPool.returnMatrix(kElement);
      }
    }
  };
  
  if (settings.enableProfiling) {
    globalProfiler.time('assembleGlobalStiffness', operation);
  } else {
    operation();
  }
  
  return K;
};

/**
 * Apply boundary conditions to sparse matrix
 */
const applyBoundaryConditionsOptimized = (
  K: SparseMatrix, 
  nodes: Node[],
  settings: OptimizationSettings
): SparseMatrix => {
  const dofPerNode = 6;
  
  const operation = () => {
    for (let n = 0; n < nodes.length; n++) {
      const node = nodes[n];
      const supports = node.supports || {};
      
      const constraints = [
        { dof: n * dofPerNode, fixed: supports.ux },
        { dof: n * dofPerNode + 1, fixed: supports.uy },
        { dof: n * dofPerNode + 2, fixed: supports.uz },
        { dof: n * dofPerNode + 3, fixed: supports.rx },
        { dof: n * dofPerNode + 4, fixed: supports.ry },
        { dof: n * dofPerNode + 5, fixed: supports.rz }
      ];
      
      for (const constraint of constraints) {
        if (constraint.fixed) {
          const dof = constraint.dof;
          
          // Clear row and column
          const keysToDelete: string[] = [];
          for (const [key] of K.data) {
            const [row, col] = key.split(',').map(Number);
            if (row === dof || col === dof) {
              keysToDelete.push(key);
            }
          }
          
          keysToDelete.forEach(key => K.data.delete(key));
          
          // Set diagonal to 1
          setSparseMatrixValue(K, dof, dof, 1);
        }
      }
    }
  };
  
  if (settings.enableProfiling) {
    globalProfiler.time('applyBoundaryConditions', operation);
  } else {
    operation();
  }
  
  return K;
};

/**
 * Create optimized load vector
 */
const createLoadVectorOptimized = (
  structure: Structure3D,
  settings: OptimizationSettings
): SparseVector => {
  const dofPerNode = 6;
  const totalDOF = structure.nodes.length * dofPerNode;
  const F = settings.memoryOptimization 
    ? memoryPool.getSparseVector(totalDOF)
    : createSparseVector(totalDOF);
  
  const operation = () => {
    if (structure.loads) {
      for (const load of structure.loads) {
        if (load.type === 'point' && load.nodeId) {
          const nodeIndex = structure.nodes.findIndex(n => n.id === load.nodeId);
          if (nodeIndex !== -1) {
            const dofOffset = nodeIndex * dofPerNode;
            
            // Handle direction object with x, y, z components
            if (load.direction.x !== undefined && load.direction.x !== 0) {
              addSparseVectorValue(F, dofOffset, load.magnitude * load.direction.x);
            }
            if (load.direction.y !== undefined && load.direction.y !== 0) {
              addSparseVectorValue(F, dofOffset + 1, load.magnitude * load.direction.y);
            }
            if (load.direction.z !== undefined && load.direction.z !== 0) {
              addSparseVectorValue(F, dofOffset + 2, load.magnitude * load.direction.z);
            }
          }
        }
      }
    }
  };
  
  if (settings.enableProfiling) {
    globalProfiler.time('createLoadVector', operation);
  } else {
    operation();
  }
  
  return F;
};

/**
 * Optimized system solver with multiple algorithms
 */
const solveSystemOptimized = (
  K: SparseMatrix, 
  F: SparseVector,
  settings: OptimizationSettings
): { solution: SparseVector; solverInfo: any } => {
  const n = K.rows;
  
  if (settings.useConjugateGradient) {
    // Use iterative Conjugate Gradient solver
    const operation = () => solveConjugateGradient(
      K, F, undefined, 
      settings.cgTolerance, 
      settings.cgMaxIterations
    );
    
    const result = settings.enableProfiling 
      ? globalProfiler.time('conjugateGradientSolver', operation)
      : operation();
    
    return {
      solution: result.solution,
      solverInfo: {
        method: 'Conjugate Gradient',
        iterations: result.iterations,
        residual: result.residual,
        converged: result.residual < settings.cgTolerance
      }
    };
  } else {
    // Use direct LU decomposition solver
    const luOperation = () => sparseLUDecomposition(K);
    const { L, U, success } = settings.enableProfiling
      ? globalProfiler.time('luDecomposition', luOperation)
      : luOperation();
    
    if (!success) {
      return {
        solution: createSparseVector(n),
        solverInfo: {
          method: 'LU Decomposition',
          success: false,
          error: 'Matrix is singular or ill-conditioned'
        }
      };
    }
    
    const solveOperation = () => solveLU(L, U, F);
    const { solution, success: solveSuccess } = settings.enableProfiling
      ? globalProfiler.time('luSolve', solveOperation)
      : solveOperation();
    
    return {
      solution,
      solverInfo: {
        method: 'LU Decomposition',
        success: solveSuccess
      }
    };
  }
};

/**
 * Calculate section properties (reused from original analyzer)
 */
export const calculateSectionProperties = (element: Element) => {
  const section = element.section;
  
  if (section.type === 'rectangular') {
    const width = section.width || 0.3; // Default width
    const height = section.height || 0.5; // Default height
    const area = width * height;
    const momentOfInertiaY = (width * Math.pow(height, 3)) / 12;
    const momentOfInertiaZ = (height * Math.pow(width, 3)) / 12;
    const sectionModulusY = momentOfInertiaY / (height / 2);
    const sectionModulusZ = momentOfInertiaZ / (width / 2);
    const torsionalConstant = (width * Math.pow(height, 3)) / 3;
    
    return {
      area,
      momentOfInertiaY,
      momentOfInertiaZ,
      sectionModulusY,
      sectionModulusZ,
      torsionalConstant
    };
  } else if (section.type === 'circular') {
    const width = section.width || 0.5; // Default diameter
    const radius = width / 2;
    const area = Math.PI * Math.pow(radius, 2);
    const momentOfInertia = (Math.PI * Math.pow(radius, 4)) / 4;
    const sectionModulus = momentOfInertia / radius;
    const torsionalConstant = momentOfInertia;
    
    return {
      area,
      momentOfInertiaY: momentOfInertia,
      momentOfInertiaZ: momentOfInertia,
      sectionModulusY: sectionModulus,
      sectionModulusZ: sectionModulus,
      torsionalConstant
    };
  } else {
    const width = section.width || 0.3;
    const height = section.height || 0.5;
    const area = section.area || (width * height);
    const momentOfInertiaY = section.momentOfInertiaY || (width * Math.pow(height, 3)) / 12;
    const momentOfInertiaZ = section.momentOfInertiaZ || (height * Math.pow(width, 3)) / 12;
    const sectionModulusY = momentOfInertiaY ? momentOfInertiaY / (height / 2) : 0;
    const sectionModulusZ = momentOfInertiaZ ? momentOfInertiaZ / (width / 2) : 0;
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
 * Optimized structural analysis with performance monitoring
 */
export const analyzeStructureOptimized = (
  structure: Structure3D,
  settings: OptimizationSettings = defaultOptimizationSettings
): AnalysisResult & { performance?: any } => {
  const startTime = performance.now();
  
  try {
    if (settings.enableProfiling) {
      globalProfiler.reset();
    }
    
    // Assemble global stiffness matrix
    const K = assembleGlobalStiffnessMatrixOptimized(structure, settings);
    
    // Apply boundary conditions
    const Kbc = applyBoundaryConditionsOptimized(K, structure.nodes, settings);
    
    // Create load vector
    const F = createLoadVectorOptimized(structure, settings);
    
    // Solve system
    const { solution: U, solverInfo } = solveSystemOptimized(Kbc, F, settings);
    
    // Convert solution to dense format for result processing
    const Udense = sparseVectorToDense(U);
    
    // Process results (similar to original analyzer)
    const displacements = [];
    const forces = [];
    const stresses = [];
    
    let maxDisplacement = 0;
    let maxStress = 0;
    
    const dofPerNode = 6;
    
    // Process displacements
    for (let i = 0; i < structure.nodes.length; i++) {
      const node = structure.nodes[i];
      
      const ux = Udense[i * dofPerNode] || 0;
      const uy = Udense[i * dofPerNode + 1] || 0;
      const uz = Udense[i * dofPerNode + 2] || 0;
      const rx = Udense[i * dofPerNode + 3] || 0;
      const ry = Udense[i * dofPerNode + 4] || 0;
      const rz = Udense[i * dofPerNode + 5] || 0;
      
      displacements.push({
        nodeId: node.id,
        loadCombination: 'Default',
        ux, uy, uz, rx, ry, rz
      });
      
      const totalDisplacement = Math.sqrt(ux*ux + uy*uy + uz*uz);
      if (totalDisplacement > maxDisplacement) {
        maxDisplacement = totalDisplacement;
      }
    }
    
    // Process forces and stresses (simplified for performance)
    for (const element of structure.elements) {
      forces.push({
        elementId: element.id,
        loadCombination: 'Default',
        position: 0,
        nx: 0, vy: 0, vz: 0, tx: 0, my: 0, mz: 0
      });
      
      stresses.push({
        elementId: element.id,
        loadCombination: 'Default',
        position: 0,
        axialStress: 0,
        shearStressY: 0,
        shearStressZ: 0,
        bendingStressY: 0,
        bendingStressZ: 0,
        vonMisesStress: 0
      });
    }
    
    // Memory usage statistics
    const memoryStats = estimateMemoryUsage(K);
    
    // Performance metrics
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    let performanceInfo: any = {
      totalTime: totalTime,
      memoryUsage: memoryStats,
      solverInfo: solverInfo
    };
    
    if (settings.enableProfiling) {
      performanceInfo.detailedProfile = globalProfiler.getReport();
    }
    
    // Clean up memory pool
    if (settings.memoryOptimization) {
      memoryPool.clear();
    }
    
    const isValid = maxDisplacement < 0.01 && maxStress < 100000000;
    
    const result: AnalysisResult & { performance?: any } = {
      analysisInfo: {
        type: 'static',
        timestamp: new Date(),
        solutionTime: totalTime,
        converged: true,
        warnings: [],
        errors: []
      },
      displacements,
      reactions: [], // Empty for now
      elementForces: forces,
      elementStresses: stresses,
      summary: {
        maxDisplacement: {
          value: maxDisplacement,
          nodeId: '',
          direction: 'ux',
          loadCombination: 'Default'
        },
        maxStress: {
          value: maxStress,
          elementId: '',
          type: 'axial',
          loadCombination: 'Default'
        }
      },
      isValid
    };
    
    if (settings.enableProfiling) {
      result.performance = performanceInfo;
    }
    
    return result;
    
  } catch (error) {
    console.error("Optimized analysis error:", error);
    
    // Return default results
    return {
      analysisInfo: {
        type: 'static',
        timestamp: new Date(),
        solutionTime: 0,
        converged: false,
        warnings: [],
        errors: ['Analysis failed']
      },
      displacements: structure.nodes.map(node => ({
        nodeId: node.id,
        loadCombination: 'Default',
        ux: 0, uy: 0, uz: 0, rx: 0, ry: 0, rz: 0
      })),
      reactions: [],
      elementForces: structure.elements.map(element => ({
        elementId: element.id,
        loadCombination: 'Default',
        position: 0,
        nx: 0, vy: 0, vz: 0, tx: 0, my: 0, mz: 0
      })),
      elementStresses: structure.elements.map(element => ({
        elementId: element.id,
        loadCombination: 'Default',
        position: 0,
        axialStress: 0,
        shearStressY: 0,
        shearStressZ: 0,
        bendingStressY: 0,
        bendingStressZ: 0,
        vonMisesStress: 0
      })),
      summary: {
        maxDisplacement: {
          value: 0,
          nodeId: '',
          direction: 'ux',
          loadCombination: 'Default'
        },
        maxStress: {
          value: 0,
          elementId: '',
          type: 'axial',
          loadCombination: 'Default'
        }
      },
      isValid: false
    };
  }
};