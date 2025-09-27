import React, { useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2 } from 'lucide-react';

interface Enhanced3DNode {
  id: string;
  position: [number, number, number];
  support: {
    x: boolean;
    y: boolean;
    z: boolean;
    rx: boolean;
    ry: boolean;
    rz: boolean;
  };
  isSelected?: boolean;
}

interface Enhanced3DElement {
  id: string;
  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation' | 'pile-cap' | 'pile' | 'pedestal';
  startNode: string;
  endNode: string;
  section: {
    width: number;
    height: number;
    thickness?: number;
    diameter?: number; // For piles
  };
  material: 'concrete' | 'steel' | 'composite' | 'concrete-steel';
  direction?: 'X' | 'Y' | 'Z'; // Element direction
  utilization?: number;
  isSelected?: boolean;
}

interface Enhanced3DStructure {
  nodes: Enhanced3DNode[];
  elements: Enhanced3DElement[];
  loads: any[];
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
  scale: number;
}

interface Enhanced3DViewerProps {
  structure: Enhanced3DStructure | null;
  analysisResults?: any;
  showDeformation?: boolean;
  deformationScale?: number;
  showStress?: boolean;
  showForces?: boolean;
  showLabels?: boolean;
  viewMode?: 'solid' | 'wireframe' | 'both';
  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';
  onElementSelect?: (elementId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
}

const Simple3DNode: React.FC<{
  node: Enhanced3DNode;
  scale: number;
  onClick: (nodeId: string) => void;
}> = ({ node, scale, onClick }) => {
  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClick(node.id);
  }, [node.id, onClick]);

  return (
    <mesh position={node.position} onClick={handleClick}>
      <sphereGeometry args={[0.1 * scale, 16, 16]} />
      <meshStandardMaterial 
        color={node.isSelected ? '#e74c3c' : '#3498db'}
      />
    </mesh>
  );
};

const Simple3DElement: React.FC<{
  element: Enhanced3DElement;
  nodes: Enhanced3DNode[];
  scale: number;
  onClick: (elementId: string) => void;
}> = ({ element, nodes, scale, onClick }) => {
  const startNode = nodes.find(n => n.id === element.startNode);
  const endNode = nodes.find(n => n.id === element.endNode);

  if (!startNode || !endNode) return null;

  const startPos = startNode.position;
  const endPos = endNode.position;
  
  // Calculate direction vector and length
  const direction = [
    endPos[0] - startPos[0],
    endPos[1] - startPos[1], 
    endPos[2] - startPos[2]
  ];
  
  const length = Math.sqrt(
    Math.pow(direction[0], 2) +
    Math.pow(direction[1], 2) +
    Math.pow(direction[2], 2)
  );
  
  const center: [number, number, number] = [
    (startPos[0] + endPos[0]) / 2,
    (startPos[1] + endPos[1]) / 2,
    (startPos[2] + endPos[2]) / 2
  ];

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClick(element.id);
  }, [element.id, onClick]);

  const getElementColor = () => {
    if (element.isSelected) return '#ff6b6b';
    
    switch (element.type) {
      case 'column': return '#4ecdc4';
      case 'beam': return '#45b7d1';
      case 'slab': return '#96ceb4';
      case 'foundation': return '#8b4513';
      case 'pile-cap': return '#a0522d';
      case 'pile': return '#654321';
      case 'pedestal': return '#5f4e37';
      case 'wall': return '#dda0dd';
      default:
        switch (element.material) {
          case 'concrete': return '#95a5a6';
          case 'steel': return '#34495e';
          case 'composite': return '#9b59b6';
          case 'concrete-steel': return '#7f8c8d';
          default: return '#3498db';
        }
    }
  };

  // Calculate rotation for proper orientation
  const getRotation = (): [number, number, number] => {
    if (element.type === 'slab' || element.type === 'foundation' || element.type === 'pile-cap') {
      return [0, 0, 0]; // Horizontal slabs
    }
    
    if (element.type === 'column' || element.type === 'pedestal' || element.type === 'pile') {
      return [0, 0, 0]; // Vertical elements
    }
    
    // For beams - proper horizontal orientation
    const normalizedDir = [
      direction[0] / length,
      direction[1] / length,
      direction[2] / length
    ];
    
    // Beam along X-direction (no rotation)
    if (Math.abs(normalizedDir[0]) > 0.7) {
      return [0, 0, 0];
    }
    // Beam along Z-direction (rotate 90° around Y)
    else if (Math.abs(normalizedDir[2]) > 0.7) {
      return [0, Math.PI / 2, 0];
    }
    
    return [0, 0, 0];
  };

  // Get proper dimensions based on element type
  const getDimensions = (): [number, number, number] => {
    const baseScale = scale;
    
    switch (element.type) {
      case 'column':
      case 'pedestal':
        return [
          element.section.width * baseScale,
          length, // Vertical height
          element.section.width * baseScale
        ];
        
      case 'pile':
        const diameter = element.section.diameter || element.section.width;
        return [
          diameter * baseScale,
          length, // Pile length
          diameter * baseScale
        ];
        
      case 'slab':
        return [
          Math.max(20, element.section.width * baseScale), // Building width
          element.section.thickness! * baseScale,
          Math.max(20, element.section.height * baseScale) // Building depth
        ];
        
      case 'pile-cap':
        return [
          element.section.width * baseScale * 1.5,
          element.section.thickness! * baseScale,
          element.section.height * baseScale * 1.5
        ];
        
      case 'foundation':
        return [
          element.section.width * baseScale * 2,
          element.section.thickness! * baseScale,
          element.section.height * baseScale * 2
        ];
        
      case 'beam':
      default:
        return [
          length, // Beam length
          element.section.height * baseScale,
          element.section.width * baseScale
        ];
    }
  };

  const rotation = getRotation();
  const dimensions = getDimensions();

  // Special positioning for different element types
  const getPosition = (): [number, number, number] => {
    switch (element.type) {
      case 'slab':
        // Position slab at floor level
        const floorLevel = Math.min(startPos[1], endPos[1]);
        return [center[0], floorLevel, center[2]];
        
      case 'foundation':
        // Foundation below ground level
        return [center[0], center[1] - 2, center[2]];
        
      case 'pile-cap':
        // Pile cap slightly below ground
        return [center[0], center[1] - 1, center[2]];
        
      case 'pile':
        // Pile extends deep into ground
        return [startPos[0], startPos[1] - length/2, startPos[2]];
        
      case 'pedestal':
        // Pedestal on foundation
        return [center[0], startPos[1], center[2]];
        
      default:
        return center;
    }
  };

  const position = getPosition();

  return (
    <mesh position={position} rotation={rotation} onClick={handleClick}>
      <boxGeometry args={dimensions} />
      <meshStandardMaterial 
        color={getElementColor()}
        transparent={element.type === 'slab' || element.isSelected}
        opacity={element.type === 'slab' ? 0.4 : (element.isSelected ? 0.8 : 1.0)}
        metalness={element.material === 'steel' ? 0.8 : 0.1}
        roughness={element.material === 'steel' ? 0.2 : 0.8}
      />
    </mesh>
  );
};

const Simple3DScene: React.FC<{
  structure: Enhanced3DStructure;
  onElementSelect: (elementId: string) => void;
  onNodeSelect: (nodeId: string) => void;
}> = ({ structure, onElementSelect, onNodeSelect }) => {
  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {structure.nodes.map(node => (
        <Simple3DNode
          key={node.id}
          node={node}
          scale={structure.scale}
          onClick={onNodeSelect}
        />
      ))}

      {structure.elements.map(element => (
        <Simple3DElement
          key={element.id}
          element={element}
          nodes={structure.nodes}
          scale={structure.scale}
          onClick={onElementSelect}
        />
      ))}
    </group>
  );
};

const Simple3DViewer: React.FC<Enhanced3DViewerProps> = ({
  structure,
  analysisResults,
  showDeformation = false,
  deformationScale = 1,
  showStress = false,
  showForces = false,
  showLabels = true,
  viewMode = 'solid',
  colorMode = 'material',
  onElementSelect,
  onNodeSelect,
  className = ''
}) => {
  const handleElementSelect = useCallback((elementId: string) => {
    if (onElementSelect) {
      onElementSelect(elementId);
    }
  }, [onElementSelect]);

  const handleNodeSelect = useCallback((nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  }, [onNodeSelect]);

  if (!structure) {
    return (
      <Card className={`h-full ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-500 mb-2">
              <Maximize2 className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Structure Data</h3>
            <p className="text-gray-500">Load a structural model to view in 3D</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50"
      >
        <Simple3DScene
          structure={structure}
          onElementSelect={handleElementSelect}
          onNodeSelect={handleNodeSelect}
        />
        <OrbitControls 
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>

      <div className="absolute top-4 right-4">
        <Card className="p-3 bg-white/90 backdrop-blur-sm">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Structure Info</h4>
            <div className="text-xs space-y-0.5">
              <div>Nodes: <span className="font-medium">{structure.nodes.length}</span></div>
              <div>Elements: <span className="font-medium">{structure.elements.length}</span></div>
              {analysisResults && (
                <div>Status: <span className="font-medium text-green-600">Analyzed</span></div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Simple3DViewer;
