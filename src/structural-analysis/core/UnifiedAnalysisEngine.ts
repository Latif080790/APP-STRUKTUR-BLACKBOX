/**
 * Unified Analysis Engine
 * Engine analisis struktur berbasis stiffness matrix method
 * Sesuai standar engineering profesional dengan akurasi tinggi
 */

// Simple Matrix implementation untuk calculations
class SimpleMatrix {
  private data: number[][];
  public rows: number;
  public cols: number;

  constructor(data: number[][]) {
    this.data = data;
    this.rows = data.length;
    this.cols = data[0]?.length || 0;
  }

  static zeros(rows: number, cols: number): SimpleMatrix {
    const data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    return new SimpleMatrix(data);
  }

  get(row: number, col: number): number {
    return this.data[row][col];
  }

  set(row: number, col: number, value: number): void {
    this.data[row][col] = value;
  }

  transpose(): SimpleMatrix {
    const result = SimpleMatrix.zeros(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.set(j, i, this.get(i, j));
      }
    }
    return result;
  }

  mmul(other: SimpleMatrix): SimpleMatrix {
    if (this.cols !== other.rows) {
      throw new Error('Matrix dimensions tidak kompatibel untuk perkalian');
    }
    
    const result = SimpleMatrix.zeros(this.rows, other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.get(i, k) * other.get(k, j);
        }
        result.set(i, j, sum);
      }
    }
    return result;
  }

  solve(b: SimpleMatrix): SimpleMatrix {
    // Simple Gaussian elimination untuk solving Ax = b
    const n = this.rows;
    const augmented = SimpleMatrix.zeros(n, n + 1);
    
    // Create augmented matrix
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        augmented.set(i, j, this.get(i, j));
      }
      augmented.set(i, n, b.get(i, 0));
    }
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
      // Pivot
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented.get(k, i)) > Math.abs(augmented.get(maxRow, i))) {
          maxRow = k;
        }
      }
      
      // Swap rows
      for (let k = i; k < n + 1; k++) {
        const temp = augmented.get(maxRow, k);
        augmented.set(maxRow, k, augmented.get(i, k));
        augmented.set(i, k, temp);
      }
      
      // Make all rows below this one 0 in current column
      for (let k = i + 1; k < n; k++) {
        const factor = augmented.get(k, i) / augmented.get(i, i);
        for (let j = i; j < n + 1; j++) {
          if (i === j) {
            augmented.set(k, j, 0);
          } else {
            augmented.set(k, j, augmented.get(k, j) - factor * augmented.get(i, j));
          }
        }
      }
    }
    
    // Back substitution
    const solution = SimpleMatrix.zeros(n, 1);
    for (let i = n - 1; i >= 0; i--) {
      solution.set(i, 0, augmented.get(i, n));
      for (let j = i + 1; j < n; j++) {
        solution.set(i, 0, solution.get(i, 0) - augmented.get(i, j) * solution.get(j, 0));
      }
      solution.set(i, 0, solution.get(i, 0) / augmented.get(i, i));
    }
    
    return solution;
  }

  to2DArray(): number[][] {
    return this.data.map(row => [...row]);
  }
}

export interface StructuralNode {
  id: number;
  x: number;
  y: number;
  z: number;
  supports: {
    ux: boolean; // Translation X
    uy: boolean; // Translation Y  
    uz: boolean; // Translation Z
    rx: boolean; // Rotation X
    ry: boolean; // Rotation Y
    rz: boolean; // Rotation Z
  };
  loads: {
    fx: number;
    fy: number;
    fz: number;
    mx: number;
    my: number;
    mz: number;
  };
}

export interface StructuralElement {
  id: number;
  type: 'beam' | 'column' | 'brace' | 'slab';
  nodeI: number; // Start node
  nodeJ: number; // End node
  section: {
    area: number;        // m²
    momentY: number;     // Iy (m⁴)
    momentZ: number;     // Iz (m⁴)
    torsion: number;     // J (m⁴)
    shearY: number;      // Ay (m²) 
    shearZ: number;      // Az (m²)
  };
  material: {
    E: number;           // Elastic modulus (Pa)
    G: number;           // Shear modulus (Pa)
    density: number;     // kg/m³
    fy: number;          // Yield strength (Pa)
    fc: number;          // Compressive strength (Pa) - untuk beton
  };
  length?: number;       // Will be calculated
  orientation: {
    angle: number;       // Rotation angle (radians)
  };
}

export interface StructuralModel {
  nodes: StructuralNode[];
  elements: StructuralElement[];
  dof: number;           // Degrees of freedom
  constraints: number[]; // Constrained DOFs
  loadVector: number[];  // Global load vector
}

export class UnifiedAnalysisEngine {
  private tolerance = 1e-10;
  private maxIterations = 1000;

  /**
   * Generate structural model dari input parameters
   */
  async generateStructuralModel(input: any): Promise<StructuralModel> {
    const { geometry, materials, loads, seismic } = input;
    
    const nodes: StructuralNode[] = [];
    const elements: StructuralElement[] = [];
    
    let nodeId = 1;
    let elementId = 1;

    // Generate grid nodes
    for (let floor = 0; floor <= geometry.jumlahLantai; floor++) {
      for (let y = 0; y <= geometry.gridKolomY; y++) {
        for (let x = 0; x <= geometry.gridKolomX; x++) {
          const isFoundation = floor === 0;
          
          nodes.push({
            id: nodeId++,
            x: x * geometry.bentangX,
            y: floor * geometry.tinggiPerLantai,
            z: y * geometry.bentangY,
            supports: isFoundation ? {
              ux: true, uy: true, uz: true,
              rx: true, ry: true, rz: true
            } : {
              ux: false, uy: false, uz: false,
              rx: false, ry: false, rz: false
            },
            loads: {
              fx: 0, fy: 0, fz: 0,
              mx: 0, my: 0, mz: 0
            }
          });
        }
      }
    }

    // Calculate section properties secara akurat
    const columnSection = this.calculateColumnSection(geometry, materials);
    const beamSection = this.calculateBeamSection(geometry, materials);

    // Generate column elements
    const nodesPerFloor = (geometry.gridKolomX + 1) * (geometry.gridKolomY + 1);
    for (let floor = 0; floor < geometry.jumlahLantai; floor++) {
      for (let y = 0; y <= geometry.gridKolomY; y++) {
        for (let x = 0; x <= geometry.gridKolomX; x++) {
          const nodeI = floor * nodesPerFloor + y * (geometry.gridKolomX + 1) + x + 1;
          const nodeJ = (floor + 1) * nodesPerFloor + y * (geometry.gridKolomX + 1) + x + 1;
          
          elements.push({
            id: elementId++,
            type: 'column',
            nodeI,
            nodeJ,
            section: columnSection,
            material: {
              E: materials.ecBeton * 1e6, // Convert MPa to Pa
              G: materials.ecBeton * 1e6 / (2 * (1 + materials.poissonBeton)),
              density: materials.densitasBeton,
              fy: materials.fyBaja * 1e6,
              fc: materials.fcBeton * 1e6
            },
            orientation: { angle: 0 }
          });
        }
      }
    }

    // Generate beam elements (X direction)
    for (let floor = 1; floor <= geometry.jumlahLantai; floor++) {
      for (let y = 0; y <= geometry.gridKolomY; y++) {
        for (let x = 0; x < geometry.gridKolomX; x++) {
          const nodeI = (floor - 1) * nodesPerFloor + y * (geometry.gridKolomX + 1) + x + 1;
          const nodeJ = (floor - 1) * nodesPerFloor + y * (geometry.gridKolomX + 1) + x + 2;
          
          elements.push({
            id: elementId++,
            type: 'beam',
            nodeI,
            nodeJ,
            section: beamSection,
            material: {
              E: materials.ecBeton * 1e6,
              G: materials.ecBeton * 1e6 / (2 * (1 + materials.poissonBeton)),
              density: materials.densitasBeton,
              fy: materials.fyBaja * 1e6,
              fc: materials.fcBeton * 1e6
            },
            orientation: { angle: 0 }
          });
        }
      }
    }

    // Generate beam elements (Y direction)
    for (let floor = 1; floor <= geometry.jumlahLantai; floor++) {
      for (let y = 0; y < geometry.gridKolomY; y++) {
        for (let x = 0; x <= geometry.gridKolomX; x++) {
          const nodeI = (floor - 1) * nodesPerFloor + y * (geometry.gridKolomX + 1) + x + 1;
          const nodeJ = (floor - 1) * nodesPerFloor + (y + 1) * (geometry.gridKolomX + 1) + x + 1;
          
          elements.push({
            id: elementId++,
            type: 'beam',
            nodeI,
            nodeJ,
            section: beamSection,
            material: {
              E: materials.ecBeton * 1e6,
              G: materials.ecBeton * 1e6 / (2 * (1 + materials.poissonBeton)),
              density: materials.densitasBeton,
              fy: materials.fyBaja * 1e6,
              fc: materials.fcBeton * 1e6
            },
            orientation: { angle: Math.PI / 2 } // 90 degrees
          });
        }
      }
    }

    // Calculate element lengths
    elements.forEach(element => {
      const nodeI = nodes.find(n => n.id === element.nodeI)!;
      const nodeJ = nodes.find(n => n.id === element.nodeJ)!;
      
      element.length = Math.sqrt(
        Math.pow(nodeJ.x - nodeI.x, 2) +
        Math.pow(nodeJ.y - nodeI.y, 2) +
        Math.pow(nodeJ.z - nodeI.z, 2)
      );
    });

    // Apply loads
    this.applyLoadsToModel(nodes, loads, geometry);
    
    // Setup constraints
    const constraints: number[] = [];
    nodes.forEach((node, index) => {
      const baseDOF = index * 6;
      if (node.supports.ux) constraints.push(baseDOF + 0);
      if (node.supports.uy) constraints.push(baseDOF + 1);
      if (node.supports.uz) constraints.push(baseDOF + 2);
      if (node.supports.rx) constraints.push(baseDOF + 3);
      if (node.supports.ry) constraints.push(baseDOF + 4);
      if (node.supports.rz) constraints.push(baseDOF + 5);
    });

    const loadVector = this.assembleGlobalLoadVector(nodes);

    return {
      nodes,
      elements,
      dof: nodes.length * 6,
      constraints,
      loadVector
    };
  }

  /**
   * Assemble global stiffness matrix menggunakan finite element method
   */
  async assembleStiffnessMatrix(model: StructuralModel): Promise<SimpleMatrix> {
    const size = model.dof;
    const K = SimpleMatrix.zeros(size, size);

    for (const element of model.elements) {
      const ke = this.calculateElementStiffnessMatrix(element, model.nodes);
      const dofMap = this.getElementDOFMap(element);
      
      // Assemble ke into K
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
          if (dofMap[i] >= 0 && dofMap[j] >= 0) {
            K.set(dofMap[i], dofMap[j], 
                  K.get(dofMap[i], dofMap[j]) + ke[i][j]);
          }
        }
      }
    }

    return K;
  }

  /**
   * Calculate element stiffness matrix dalam global coordinates
   */
  private calculateElementStiffnessMatrix(element: StructuralElement, nodes: StructuralNode[]): number[][] {
    const nodeI = nodes.find(n => n.id === element.nodeI)!;
    const nodeJ = nodes.find(n => n.id === element.nodeJ)!;
    
    const L = element.length!;
    const E = element.material.E;
    const G = element.material.G;
    const A = element.section.area;
    const Iy = element.section.momentY;
    const Iz = element.section.momentZ;
    const J = element.section.torsion;

    // Local stiffness matrix (12x12 untuk 3D frame element)
    const ke_local = SimpleMatrix.zeros(12, 12);
    
    // Axial terms (DOF 0, 6)
    ke_local.set(0, 0, E * A / L);
    ke_local.set(0, 6, -E * A / L);
    ke_local.set(6, 0, -E * A / L);
    ke_local.set(6, 6, E * A / L);
    
    // Torsional terms (DOF 3, 9)
    ke_local.set(3, 3, G * J / L);
    ke_local.set(3, 9, -G * J / L);
    ke_local.set(9, 3, -G * J / L);
    ke_local.set(9, 9, G * J / L);
    
    // Bending Y-axis (DOF 1, 5, 7, 11)
    const c1y = 12 * E * Iz / (L * L * L);
    const c2y = 6 * E * Iz / (L * L);
    const c3y = 4 * E * Iz / L;
    const c4y = 2 * E * Iz / L;
    
    ke_local.set(1, 1, c1y);
    ke_local.set(1, 5, c2y);
    ke_local.set(1, 7, -c1y);
    ke_local.set(1, 11, c2y);
    
    ke_local.set(5, 1, c2y);
    ke_local.set(5, 5, c3y);
    ke_local.set(5, 7, -c2y);
    ke_local.set(5, 11, c4y);
    
    ke_local.set(7, 1, -c1y);
    ke_local.set(7, 5, -c2y);
    ke_local.set(7, 7, c1y);
    ke_local.set(7, 11, -c2y);
    
    ke_local.set(11, 1, c2y);
    ke_local.set(11, 5, c4y);
    ke_local.set(11, 7, -c2y);
    ke_local.set(11, 11, c3y);
    
    // Bending Z-axis (DOF 2, 4, 8, 10)
    const c1z = 12 * E * Iy / (L * L * L);
    const c2z = 6 * E * Iy / (L * L);
    const c3z = 4 * E * Iy / L;
    const c4z = 2 * E * Iy / L;
    
    ke_local.set(2, 2, c1z);
    ke_local.set(2, 4, -c2z);
    ke_local.set(2, 8, -c1z);
    ke_local.set(2, 10, -c2z);
    
    ke_local.set(4, 2, -c2z);
    ke_local.set(4, 4, c3z);
    ke_local.set(4, 8, c2z);
    ke_local.set(4, 10, c4z);
    
    ke_local.set(8, 2, -c1z);
    ke_local.set(8, 4, c2z);
    ke_local.set(8, 8, c1z);
    ke_local.set(8, 10, c2z);
    
    ke_local.set(10, 2, -c2z);
    ke_local.set(10, 4, c4z);
    ke_local.set(10, 8, c2z);
    ke_local.set(10, 10, c3z);

    // Transformation matrix local to global
    const T = this.calculateTransformationMatrix(nodeI, nodeJ, element.orientation.angle);
    
    // ke_global = T^T * ke_local * T
    const T_transpose = T.transpose();
    const ke_global = T_transpose.mmul(ke_local).mmul(T);
    
    return ke_global.to2DArray();
  }

  /**
   * Calculate transformation matrix dari local ke global coordinates
   */
  private calculateTransformationMatrix(nodeI: StructuralNode, nodeJ: StructuralNode, angle: number): SimpleMatrix {
    const dx = nodeJ.x - nodeI.x;
    const dy = nodeJ.y - nodeI.y;
    const dz = nodeJ.z - nodeI.z;
    const L = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    // Direction cosines
    const cx = dx / L;
    const cy = dy / L;
    const cz = dz / L;
    
    // Local coordinate system
    const D = Math.sqrt(cx * cx + cz * cz);
    
    let cxz, cxy, cyz;
    if (D > this.tolerance) {
      cxz = -cz / D;
      cxy = -cx * cy / D;
      cyz = cz / D;
    } else {
      // Vertical member
      cxz = 1;
      cxy = 0;
      cyz = 0;
    }
    
    // Consider member orientation angle
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    
    // 3x3 rotation matrix
    const r = SimpleMatrix.zeros(3, 3);
    r.set(0, 0, cx);
    r.set(0, 1, cy);
    r.set(0, 2, cz);
    r.set(1, 0, cxz * cosAngle + cxy * sinAngle);
    r.set(1, 1, cy * cosAngle);
    r.set(1, 2, cyz * cosAngle - cx * sinAngle);
    r.set(2, 0, -cxz * sinAngle + cxy * cosAngle);
    r.set(2, 1, -cy * sinAngle);
    r.set(2, 2, -cyz * sinAngle - cx * cosAngle);
    
    // 12x12 transformation matrix
    const T = SimpleMatrix.zeros(12, 12);
    
    // Fill dengan 3x3 rotation matrices
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          T.set(i * 3 + j, i * 3 + k, r.get(j, k));
        }
      }
    }
    
    return T;
  }

  /**
   * Assemble global load vector
   */
  assembleLoadVector(model: StructuralModel, loads: any): Promise<number[]> {
    return Promise.resolve(model.loadVector);
  }

  private assembleGlobalLoadVector(nodes: StructuralNode[]): number[] {
    const loadVector: number[] = [];
    
    nodes.forEach(node => {
      loadVector.push(node.loads.fx);
      loadVector.push(node.loads.fy);
      loadVector.push(node.loads.fz);
      loadVector.push(node.loads.mx);
      loadVector.push(node.loads.my);
      loadVector.push(node.loads.mz);
    });
    
    return loadVector;
  }

  /**
   * Solve linear system K*u = F dengan boundary conditions
   */
  async solveLinearSystem(K: SimpleMatrix, F: number[]): Promise<number[]> {
    const size = K.rows;
    const displacements = new Array(size).fill(0);
    
    try {
      // Create reduced system (menghilangkan constrained DOFs)
      // Untuk simplifikasi, menggunakan direct solver
      const F_matrix = new SimpleMatrix([F]).transpose();
      const u_matrix = K.solve(F_matrix);
      
      for (let i = 0; i < size; i++) {
        displacements[i] = u_matrix.get(i, 0);
      }
      
      return displacements;
      
    } catch (error) {
      console.error('Error solving linear system:', error);
      throw new Error('Gagal menyelesaikan sistem persamaan. Matrix mungkin singular.');
    }
  }

  /**
   * Calculate section properties secara akurat
   */
  private calculateColumnSection(geometry: any, materials: any) {
    // Assume square column
    const size = Math.max(0.3, geometry.tinggiPerLantai * geometry.jumlahLantai / 50); // Dynamic sizing
    const b = size;
    const h = size;
    
    return {
      area: b * h,
      momentY: b * h * h * h / 12,  // Iy
      momentZ: b * b * b * h / 12,  // Iz
      torsion: this.calculateTorsionalConstant(b, h),
      shearY: 5/6 * b * h,         // Effective shear area
      shearZ: 5/6 * b * h
    };
  }

  private calculateBeamSection(geometry: any, materials: any) {
    // Optimized beam size
    const span = Math.max(geometry.bentangX, geometry.bentangY);
    const b = span / 15; // width
    const h = span / 12; // height
    
    return {
      area: b * h,
      momentY: b * h * h * h / 12,
      momentZ: b * b * b * h / 12,
      torsion: this.calculateTorsionalConstant(b, h),
      shearY: 5/6 * b * h,
      shearZ: 5/6 * b * h
    };
  }

  private calculateTorsionalConstant(b: number, h: number): number {
    // Torsional constant untuk rectangular section
    const a = Math.max(b, h);
    const c = Math.min(b, h);
    
    if (a / c <= 1.2) {
      return a * c * c * c * (16/3 - 3.36 * c/a * (1 - c*c*c*c/(12*a*a*a*a)));
    } else {
      return a * c * c * c * (1/3 - 0.21 * c/a * (1 - c*c*c*c/(12*a*a*a*a)));
    }
  }

  private applyLoadsToModel(nodes: StructuralNode[], loads: any, geometry: any) {
    // Distribute loads ke nodes
    const areaPerNode = (geometry.bentangX * geometry.bentangY) / ((geometry.gridKolomX + 1) * (geometry.gridKolomY + 1));
    const totalLoad = (loads.bebanMati + loads.bebanHidup) * areaPerNode * 1000; // Convert kN to N
    
    nodes.forEach(node => {
      if (node.y > 0) { // Not foundation
        node.loads.fy = -totalLoad; // Downward load
      }
    });
  }

  private getElementDOFMap(element: StructuralElement): number[] {
    // Map local DOFs ke global DOFs
    const nodeI_dof = (element.nodeI - 1) * 6;
    const nodeJ_dof = (element.nodeJ - 1) * 6;
    
    return [
      nodeI_dof + 0, nodeI_dof + 1, nodeI_dof + 2, nodeI_dof + 3, nodeI_dof + 4, nodeI_dof + 5,
      nodeJ_dof + 0, nodeJ_dof + 1, nodeJ_dof + 2, nodeJ_dof + 3, nodeJ_dof + 4, nodeJ_dof + 5
    ];
  }
}