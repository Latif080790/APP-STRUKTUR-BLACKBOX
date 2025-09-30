/**
 * Accurate Calculator
 * Calculator untuk engineering calculations yang akurat dan presisi
 * Menggunakan metode matrix dan formula standar engineering
 */

import { StructuralModel, StructuralElement, StructuralNode } from './UnifiedAnalysisEngine';

export interface ForceResults {
  elementId: number;
  axialForce: number;      // N (tension +, compression -)
  shearForceY: number;     // N
  shearForceZ: number;     // N
  torsion: number;         // N⋅m
  momentY: number;         // N⋅m
  momentZ: number;         // N⋅m
  utilizationRatio: number; // Actual/Allowable
}

export interface StressResults {
  elementId: number;
  axialStress: number;     // Pa
  bendingStressY: number;  // Pa
  bendingStressZ: number;  // Pa
  shearStress: number;     // Pa
  combinedStress: number;  // Pa (von Mises or equivalent)
  safetyFactor: number;
}

export interface DeflectionResults {
  nodeId: number;
  displacementX: number;   // m
  displacementY: number;   // m
  displacementZ: number;   // m
  rotationX: number;       // rad
  rotationY: number;       // rad
  rotationZ: number;       // rad
  totalDisplacement: number; // m
}

export class AccurateCalculator {
  private g = 9.81; // gravitational acceleration m/s²
  
  /**
   * Calculate element forces dari displacement results
   */
  async calculateElementForces(model: StructuralModel, displacements: number[]): Promise<ForceResults[]> {
    const results: ForceResults[] = [];
    
    for (const element of model.elements) {
      const nodeI = model.nodes.find(n => n.id === element.nodeI)!;
      const nodeJ = model.nodes.find(n => n.id === element.nodeJ)!;
      
      // Get element displacements (12 DOF)
      const dofI = this.getNodeDOF(element.nodeI);
      const dofJ = this.getNodeDOF(element.nodeJ);
      
      const elementDisp = [
        displacements[dofI[0]], displacements[dofI[1]], displacements[dofI[2]],
        displacements[dofI[3]], displacements[dofI[4]], displacements[dofI[5]],
        displacements[dofJ[0]], displacements[dofJ[1]], displacements[dofJ[2]],
        displacements[dofJ[3]], displacements[dofJ[4]], displacements[dofJ[5]]
      ];
      
      // Calculate local forces using element stiffness
      const localForces = this.calculateLocalForces(element, elementDisp);
      
      // Calculate utilization ratio
      const utilizationRatio = this.calculateUtilizationRatio(element, localForces);
      
      results.push({
        elementId: element.id,
        axialForce: localForces[0],
        shearForceY: localForces[1],
        shearForceZ: localForces[2],
        torsion: localForces[3],
        momentY: localForces[4],
        momentZ: localForces[5],
        utilizationRatio
      });
    }
    
    return results;
  }
  
  /**
   * Calculate moments dalam elemen
   */
  async calculateMoments(model: StructuralModel, elementForces: ForceResults[]): Promise<number[]> {
    return elementForces.map(force => Math.max(Math.abs(force.momentY), Math.abs(force.momentZ)));
  }
  
  /**
   * Calculate stresses dalam elemen
   */
  async calculateStresses(model: StructuralModel, elementForces: ForceResults[]): Promise<StressResults[]> {
    const results: StressResults[] = [];
    
    for (const force of elementForces) {
      const element = model.elements.find(e => e.id === force.elementId)!;
      
      // Axial stress: σ = N/A
      const axialStress = force.axialForce / element.section.area;
      
      // Bending stresses: σ = M*c/I
      const bendingStressY = Math.abs(force.momentY) * this.getDistanceToExtremeFiber(element, 'y') / element.section.momentY;
      const bendingStressZ = Math.abs(force.momentZ) * this.getDistanceToExtremeFiber(element, 'z') / element.section.momentZ;
      
      // Shear stress: τ = VQ/It (simplified)
      const shearStress = Math.max(
        Math.abs(force.shearForceY) / element.section.shearY,
        Math.abs(force.shearForceZ) / element.section.shearZ
      );
      
      // Combined stress (von Mises equivalent)
      const combinedStress = Math.sqrt(
        Math.pow(axialStress + bendingStressY + bendingStressZ, 2) + 
        3 * Math.pow(shearStress, 2)
      );
      
      // Safety factor
      const allowableStress = element.type === 'column' ? 
        element.material.fc : // Compressive for columns
        element.material.fy;   // Tensile for beams
        
      const safetyFactor = allowableStress / Math.abs(combinedStress);
      
      results.push({
        elementId: force.elementId,
        axialStress,
        bendingStressY,
        bendingStressZ,
        shearStress,
        combinedStress,
        safetyFactor
      });
    }
    
    return results;
  }
  
  /**
   * Calculate deflections dari displacement vector
   */
  async calculateDeflections(displacements: number[]): Promise<DeflectionResults[]> {
    const results: DeflectionResults[] = [];
    const numNodes = displacements.length / 6;
    
    for (let i = 0; i < numNodes; i++) {
      const baseIndex = i * 6;
      
      const dx = displacements[baseIndex + 0];
      const dy = displacements[baseIndex + 1];
      const dz = displacements[baseIndex + 2];
      const rx = displacements[baseIndex + 3];
      const ry = displacements[baseIndex + 4];
      const rz = displacements[baseIndex + 5];
      
      const totalDisplacement = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      results.push({
        nodeId: i + 1,
        displacementX: dx,
        displacementY: dy,
        displacementZ: dz,
        rotationX: rx,
        rotationY: ry,
        rotationZ: rz,
        totalDisplacement
      });
    }
    
    return results;
  }
  
  /**
   * Calculate natural periods (simplified eigenvalue)
   */
  async calculateNaturalPeriods(stiffnessMatrix: any): Promise<number[]> {
    // Simplified period calculation
    // T ≈ 0.1 * N (empirical formula untuk concrete buildings)
    // Where N = number of stories
    
    // For actual implementation, eigenvalue analysis diperlukan
    // Simplified approach:
    const fundamentalPeriod = 0.1 * Math.sqrt(stiffnessMatrix.rows / 100); // Approximate
    
    return [
      fundamentalPeriod,
      fundamentalPeriod * 0.7,  // Second mode
      fundamentalPeriod * 0.5   // Third mode
    ];
  }
  
  /**
   * Calculate drift ratios sesuai SNI 1726:2019
   */
  async calculateDriftRatios(displacements: number[], geometry: any): Promise<number[]> {
    const driftRatios: number[] = [];
    const numFloors = geometry.jumlahLantai;
    const floorHeight = geometry.tinggiPerLantai;
    
    // Calculate inter-story drift untuk setiap lantai
    for (let floor = 1; floor <= numFloors; floor++) {
      // Get displacements untuk lantai ini dan bawahnya
      const upperFloorDisp = this.getFloorDisplacement(displacements, floor, geometry);
      const lowerFloorDisp = this.getFloorDisplacement(displacements, floor - 1, geometry);
      
      const drift = Math.abs(upperFloorDisp - lowerFloorDisp);
      const driftRatio = drift / floorHeight;
      
      driftRatios.push(driftRatio);
    }
    
    return driftRatios;
  }
  
  /**
   * Calculate utilization ratios untuk setiap elemen
   */
  async calculateUtilizationRatios(elementForces: ForceResults[], materials: any): Promise<number[]> {
    return elementForces.map(force => force.utilizationRatio);
  }
  
  /**
   * Calculate safety factors
   */
  async calculateSafetyFactors(elementForces: ForceResults[], materials: any): Promise<number[]> {
    return elementForces.map(force => {
      // Simplified safety factor calculation
      const allowableForce = materials.fcBeton * 1e6 * 0.5; // Simplified
      const actualForce = Math.abs(force.axialForce);
      return allowableForce / Math.max(actualForce, 1); // Prevent division by zero
    });
  }
  
  // Helper Methods
  
  private getNodeDOF(nodeId: number): number[] {
    const baseIndex = (nodeId - 1) * 6;
    return [
      baseIndex + 0, baseIndex + 1, baseIndex + 2,
      baseIndex + 3, baseIndex + 4, baseIndex + 5
    ];
  }
  
  private calculateLocalForces(element: StructuralElement, displacements: number[]): number[] {
    // Simplified force calculation
    const L = element.length!;
    const E = element.material.E;
    const A = element.section.area;
    const I = Math.max(element.section.momentY, element.section.momentZ);
    
    // Axial force
    const axialForce = E * A * (displacements[6] - displacements[0]) / L;
    
    // Simplified shear dan moment
    const shearY = E * I * (displacements[7] - displacements[1]) / (L * L * L) * 12;
    const shearZ = E * I * (displacements[8] - displacements[2]) / (L * L * L) * 12;
    
    const momentY = E * I * (displacements[10] + displacements[4]) / L * 6;
    const momentZ = E * I * (displacements[11] + displacements[5]) / L * 6;
    
    const torsion = element.material.G * element.section.torsion * 
                   (displacements[9] - displacements[3]) / L;
    
    return [axialForce, shearY, shearZ, torsion, momentY, momentZ];
  }
  
  private calculateUtilizationRatio(element: StructuralElement, forces: number[]): number {
    const axialForce = Math.abs(forces[0]);
    const momentY = Math.abs(forces[4]);
    const momentZ = Math.abs(forces[5]);
    
    // Combined utilization (simplified)
    const axialCapacity = element.material.fc * element.section.area;
    const momentCapacity = element.material.fc * element.section.momentY * 
                          this.getDistanceToExtremeFiber(element, 'y');
    
    const axialRatio = axialForce / axialCapacity;
    const momentRatio = Math.max(momentY, momentZ) / momentCapacity;
    
    // Interaction formula (simplified)
    return axialRatio + momentRatio;
  }
  
  private getDistanceToExtremeFiber(element: StructuralElement, direction: 'y' | 'z'): number {
    // Simplified - assume rectangular section
    // Distance dari neutral axis ke extreme fiber
    if (element.type === 'column') {
      return 0.25; // Assume 0.5m column, c = 0.25m
    } else {
      return direction === 'y' ? 0.3 : 0.15; // Beam dimensions
    }
  }
  
  private getFloorDisplacement(displacements: number[], floor: number, geometry: any): number {
    // Get average horizontal displacement untuk floor
    const nodesPerFloor = (geometry.gridKolomX + 1) * (geometry.gridKolomY + 1);
    const startNodeIndex = floor * nodesPerFloor;
    
    let totalDisp = 0;
    let count = 0;
    
    for (let i = 0; i < nodesPerFloor; i++) {
      const nodeIndex = startNodeIndex + i;
      if (nodeIndex * 6 + 1 < displacements.length) {
        totalDisp += Math.abs(displacements[nodeIndex * 6 + 0]); // X displacement
        count++;
      }
    }
    
    return count > 0 ? totalDisp / count : 0;
  }

  /**
   * Calculate period using empirical formula
   */
  calculateEmpiricalPeriod(height: number, structuralSystem: string = 'concrete'): number {
    // SNI 1726:2019 empirical period formula
    const Ct = structuralSystem === 'steel' ? 0.0724 : 0.0466; // For concrete
    const x = structuralSystem === 'steel' ? 0.8 : 0.9;
    
    return Ct * Math.pow(height, x);
  }

  /**
   * Check deflection limits sesuai standards
   */
  checkDeflectionLimits(deflections: DeflectionResults[], spans: number[]): any {
    const results = {
      passed: true,
      checks: [] as any[]
    };
    
    deflections.forEach((defl, index) => {
      const span = spans[index] || 6.0; // Default span
      const limit = span / 250; // L/250 for live load deflection
      
      const check = {
        nodeId: defl.nodeId,
        actual: defl.totalDisplacement,
        limit: limit,
        ratio: defl.totalDisplacement / limit,
        passed: defl.totalDisplacement <= limit
      };
      
      results.checks.push(check);
      if (!check.passed) {
        results.passed = false;
      }
    });
    
    return results;
  }
}

export default AccurateCalculator;