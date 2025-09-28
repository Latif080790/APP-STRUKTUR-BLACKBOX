/**
 * Enhanced 3D Structure Viewer Wrapper
 * Converts geometry input to Structure3D format for Enhanced3DViewer
 */

import React, { useMemo } from 'react';
import Enhanced3DViewer from './Enhanced3DStructureViewer';
import { Structure3D, Element, Node } from '../../../types/structural';

interface GeometryInput {
  length: number;
  width: number;
  heightPerFloor: number;
  numberOfFloors: number;
  baySpacingX: number;
  baySpacingY: number;
  irregularity: boolean;
}

interface Enhanced3DStructureViewerProps {
  geometry: GeometryInput;
  materialGrade: string;
  analysisResults?: {
    elementStresses?: Record<number, number>;
    elementUtilization?: Record<number, number>;
    nodeDisplacements?: Record<number, { x: number; y: number; z: number }>;
    maxStress?: number;
    maxUtilization?: number;
  };
  onElementClick?: (element: Element) => void;
  onNodeClick?: (node: Node) => void;
  className?: string;
}

export const Enhanced3DStructureViewer: React.FC<Enhanced3DStructureViewerProps> = ({
  geometry,
  materialGrade,
  analysisResults,
  onElementClick,
  onNodeClick,
  className
}) => {
  const structure3D = useMemo((): Structure3D => {
    const nodes: Node[] = [];
    const elements: Element[] = [];
    
    const { length, width, heightPerFloor, numberOfFloors, baySpacingX, baySpacingY } = geometry;
    
    // Calculate number of bays
    const baysX = Math.max(1, Math.floor(length / baySpacingX));
    const baysY = Math.max(1, Math.floor(width / baySpacingY));
    const actualSpacingX = length / baysX;
    const actualSpacingY = width / baysY;
    
    let nodeId = 1;
    let elementId = 1;
    
    // Create nodes for all floors
    for (let floor = 0; floor <= numberOfFloors; floor++) {
      const z = floor * heightPerFloor;
      
      for (let i = 0; i <= baysX; i++) {
        for (let j = 0; j <= baysY; j++) {
          const x = i * actualSpacingX;
          const y = j * actualSpacingY;
          
          nodes.push({
            id: nodeId,
            x,
            y,
            z,
            restraints: floor === 0 ? { dx: true, dy: true, dz: true, rx: true, ry: true, rz: true } : {}
          });
          nodeId++;
        }
      }
    }
    
    // Helper function to get node ID based on grid position
    const getNodeId = (floor: number, i: number, j: number) => {
      return floor * (baysX + 1) * (baysY + 1) + i * (baysY + 1) + j + 1;
    };
    
    // Create beams (horizontal elements in X direction)
    for (let floor = 0; floor <= numberOfFloors; floor++) {
      for (let i = 0; i < baysX; i++) {
        for (let j = 0; j <= baysY; j++) {
          const startNodeId = getNodeId(floor, i, j);
          const endNodeId = getNodeId(floor, i + 1, j);
          
          elements.push({
            id: elementId,
            type: 'beam',
            nodes: [startNodeId, endNodeId],
            materialType: 'concrete',
            section: {
              width: 0.3,
              height: floor === 0 ? 0.8 : 0.6, // Foundation beams are deeper
              area: 0.18,
              Ix: 0.0054,
              Iy: 0.00135
            }
          });
          elementId++;
        }
      }
    }
    
    // Create beams (horizontal elements in Y direction)
    for (let floor = 0; floor <= numberOfFloors; floor++) {
      for (let i = 0; i <= baysX; i++) {
        for (let j = 0; j < baysY; j++) {
          const startNodeId = getNodeId(floor, i, j);
          const endNodeId = getNodeId(floor, i, j + 1);
          
          elements.push({
            id: elementId,
            type: 'beam',
            nodes: [startNodeId, endNodeId],
            materialType: 'concrete',
            section: {
              width: 0.3,
              height: floor === 0 ? 0.8 : 0.6, // Foundation beams are deeper
              area: 0.18,
              Ix: 0.0054,
              Iy: 0.00135
            }
          });
          elementId++;
        }
      }
    }
    
    // Create columns (vertical elements)
    for (let floor = 0; floor < numberOfFloors; floor++) {
      for (let i = 0; i <= baysX; i++) {
        for (let j = 0; j <= baysY; j++) {
          const bottomNodeId = getNodeId(floor, i, j);
          const topNodeId = getNodeId(floor + 1, i, j);
          
          elements.push({
            id: elementId,
            type: 'column',
            nodes: [bottomNodeId, topNodeId],
            materialType: 'concrete',
            section: {
              width: floor === 0 ? 0.5 : 0.4, // Foundation columns are larger
              height: floor === 0 ? 0.5 : 0.4,
              area: floor === 0 ? 0.25 : 0.16,
              Ix: floor === 0 ? 0.0052 : 0.0021,
              Iy: floor === 0 ? 0.0052 : 0.0021
            }
          });
          elementId++;
        }
      }
    }
    
    // Create slab elements
    for (let floor = 1; floor <= numberOfFloors; floor++) { // Start from floor 1 (slabs above foundation)
      for (let i = 0; i < baysX; i++) {
        for (let j = 0; j < baysY; j++) {
          // Create a shell element for each bay
          const node1 = getNodeId(floor, i, j);
          const node2 = getNodeId(floor, i + 1, j);
          const node3 = getNodeId(floor, i + 1, j + 1);
          const node4 = getNodeId(floor, i, j + 1);
          
          elements.push({
            id: elementId,
            type: 'slab',
            nodes: [node1, node2, node3, node4],
            materialType: 'concrete',
            section: {
              width: actualSpacingX,
              height: actualSpacingY,
              thickness: 0.12, // 12cm slab thickness
              area: actualSpacingX * actualSpacingY,
              Ix: actualSpacingX * Math.pow(0.12, 3) / 12,
              Iy: actualSpacingY * Math.pow(0.12, 3) / 12
            }
          });
          elementId++;
        }
      }
    }
    
    // Create foundation elements (footings)
    for (let i = 0; i <= baysX; i++) {
      for (let j = 0; j <= baysY; j++) {
        const nodeId = getNodeId(0, i, j);
        
        // Create a footing at each foundation node
        elements.push({
          id: elementId,
          type: 'foundation',
          nodes: [nodeId],
          materialType: 'concrete',
          section: {
            width: 1.5,
            height: 1.5,
            depth: 0.8,
            area: 2.25,
            Ix: 0.42,
            Iy: 0.42
          }
        });
        elementId++;
      }
    }
    
    return {
      id: 'generated-structure',
      name: 'Generated Structure',
      nodes,
      elements,
      materials: {
        concrete: {
          name: 'Concrete',
          fc: 30,
          Ec: 25000,
          density: 2400,
          poissonRatio: 0.2
        },
        steel: {
          name: materialGrade,
          fy: 420,
          Es: 200000,
          density: 7850,
          poissonRatio: 0.3
        }
      },
      loadCases: [],
      loadCombinations: []
    };
  }, [geometry, materialGrade]);

  return (
    <Enhanced3DViewer
      structure={structure3D}
      analysisResults={analysisResults}
      onElementClick={onElementClick}
      onNodeClick={onNodeClick}
      className={className}
    />
  );
};

export default Enhanced3DStructureViewer;