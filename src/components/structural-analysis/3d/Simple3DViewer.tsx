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
  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';
  startNode: string;
  endNode: string;
  section: {
    width: number;
    height: number;
    thickness?: number;
  };
  material: 'concrete' | 'steel' | 'composite';
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
  
  const length = Math.sqrt(
    Math.pow(endPos[0] - startPos[0], 2) +
    Math.pow(endPos[1] - startPos[1], 2) +
    Math.pow(endPos[2] - startPos[2], 2)
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
    switch (element.material) {
      case 'concrete': return '#95a5a6';
      case 'steel': return '#34495e';
      case 'composite': return '#9b59b6';
      default: return '#3498db';
    }
  };

  return (
    <mesh position={center} onClick={handleClick}>
      <boxGeometry args={[
        element.section.width * scale,
        length,
        element.section.height * scale
      ]} />
      <meshStandardMaterial 
        color={getElementColor()}
        transparent={element.isSelected}
        opacity={element.isSelected ? 0.7 : 1.0}
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
