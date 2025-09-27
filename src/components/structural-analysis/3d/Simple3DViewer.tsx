import React, { useCallback, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2 } from 'lucide-react';

interface Enhanced3DNode {
  id: string;
  position: [number, number, number];
  displacement?: [number, number, number]; // Add displacement for deformation
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
  forces?: { // Add forces for stress visualization
    axial: number;
    shearY: number;
    shearZ: number;
    momentY: number;
    momentZ: number;
  };
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
  showDeformation: boolean;
  deformationScale: number;
  onClick: (nodeId: string) => void;
}> = ({ node, scale, showDeformation, deformationScale, onClick }) => {
  const [hovered, setHovered] = useState(false);

  // Calculate deformed position
  const deformedPosition = useMemo(() => {
    if (!showDeformation || !node.displacement) return node.position;
    return [
      node.position[0] + node.displacement[0] * deformationScale,
      node.position[1] + node.displacement[1] * deformationScale,
      node.position[2] + node.displacement[2] * deformationScale
    ] as [number, number, number];
  }, [node.position, node.displacement, showDeformation, deformationScale]);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClick(node.id);
  }, [node.id, onClick]);

  const nodeColor = useMemo(() => {
    if (node.isSelected) return '#e74c3c';
    if (hovered) return '#f39c12';
    
    // Color by support conditions
    const hasSupport = Object.values(node.support).some(Boolean);
    if (hasSupport) return '#2ecc71';
    
    return '#3498db';
  }, [node.isSelected, hovered, node.support]);

  return (
    <group>
      {/* Original position indicator (if deformed) */}
      {showDeformation && node.displacement && (
        <mesh position={node.position}>
          <sphereGeometry args={[0.08 * scale, 12, 12]} />
          <meshBasicMaterial color="#bdc3c7" opacity={0.3} transparent />
        </mesh>
      )}
      
      {/* Main node at deformed position */}
      <mesh 
        position={deformedPosition} 
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <sphereGeometry args={[0.1 * scale, 16, 16]} />
        <meshStandardMaterial 
          color={nodeColor}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Deformation vector line */}
      {showDeformation && node.displacement && (
        <group>
          {/* Line from original to deformed position */}
          <mesh position={[
            (node.position[0] + deformedPosition[0]) / 2,
            (node.position[1] + deformedPosition[1]) / 2,
            (node.position[2] + deformedPosition[2]) / 2
          ]}>
            <cylinderGeometry 
              args={[0.02 * scale, 0.02 * scale, 
                Math.sqrt(
                  Math.pow(deformedPosition[0] - node.position[0], 2) +
                  Math.pow(deformedPosition[1] - node.position[1], 2) +
                  Math.pow(deformedPosition[2] - node.position[2], 2)
                )
              ]} 
            />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
        </group>
      )}
      
      {/* Support visualization */}
      {Object.values(node.support).some(Boolean) && (
        <group position={deformedPosition}>
          <mesh position={[0, -0.2 * scale, 0]}>
            <coneGeometry args={[0.15 * scale, 0.25 * scale, 8]} />
            <meshStandardMaterial color="#34495e" />
          </mesh>
        </group>
      )}
    </group>
  );
};

const Simple3DElement: React.FC<{
  element: Enhanced3DElement;
  nodes: Enhanced3DNode[];
  scale: number;
  showDeformation: boolean;
  deformationScale: number;
  colorMode: string;
  onClick: (elementId: string) => void;
}> = ({ element, nodes, scale, showDeformation, deformationScale, colorMode, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const startNode = nodes.find(n => n.id === element.startNode);
  const endNode = nodes.find(n => n.id === element.endNode);

  if (!startNode || !endNode) return null;

  // Get positions (deformed or original)
  const getNodePosition = (node: Enhanced3DNode) => {
    if (!showDeformation || !node.displacement) return node.position;
    return [
      node.position[0] + node.displacement[0] * deformationScale,
      node.position[1] + node.displacement[1] * deformationScale,
      node.position[2] + node.displacement[2] * deformationScale
    ] as [number, number, number];
  };

  const startPos = getNodePosition(startNode);
  const endPos = getNodePosition(endNode);
  
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
    if (hovered) return '#ffa726';
    
    // Color based on mode
    switch (colorMode) {
      case 'stress':
        if (element.forces) {
          const maxStress = Math.abs(element.forces.axial) / (element.section.width * element.section.height);
          const stressRatio = Math.min(maxStress / 25, 1); // Normalize to 25 MPa
          return `hsl(${120 - stressRatio * 60}, 70%, 50%)`; // Green to red
        }
        return '#95a5a6';
        
      case 'utilization':
        if (element.utilization !== undefined) {
          const ratio = Math.min(element.utilization, 1);
          return `hsl(${120 - ratio * 60}, 70%, 50%)`; // Green to red
        }
        return '#95a5a6';
        
      case 'forces':
        if (element.forces) {
          const forceRatio = Math.min(Math.abs(element.forces.axial) / 1000, 1); // Normalize to 1000 kN
          return `hsl(${210 - forceRatio * 60}, 70%, 50%)`; // Blue to red
        }
        return '#95a5a6';
        
      default: // material
        switch (element.type) {
          case 'column': return '#e74c3c';
          case 'beam': return '#3498db';
          case 'slab': return '#2ecc71';
          case 'foundation': return '#8b4513';
          case 'pile-cap': return '#a0522d';
          case 'pile': return '#654321';
          case 'pedestal': return '#5f4e37';
          case 'wall': return '#9b59b6';
          default: return '#95a5a6';
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
    <group>
      {/* Original position (if deformed) */}
      {showDeformation && (startNode.displacement || endNode.displacement) && (
        <group position={[
          (startNode.position[0] + endNode.position[0]) / 2,
          (startNode.position[1] + endNode.position[1]) / 2,
          (startNode.position[2] + endNode.position[2]) / 2
        ]}>
          <mesh rotation={rotation}>
            <boxGeometry args={dimensions} />
            <meshBasicMaterial 
              color="#bdc3c7" 
              opacity={0.2} 
              transparent 
              wireframe 
            />
          </mesh>
        </group>
      )}
      
      {/* Main element at deformed position */}
      <mesh position={position} rotation={rotation} onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}>
        <boxGeometry args={dimensions} />
        <meshStandardMaterial 
          color={getElementColor()}
          transparent={element.type === 'slab' || element.isSelected}
          opacity={element.type === 'slab' ? 0.4 : (element.isSelected ? 0.8 : 1.0)}
          metalness={element.material === 'steel' ? 0.8 : 0.1}
          roughness={element.material === 'steel' ? 0.2 : 0.8}
        />
      </mesh>
    </group>
  );
};

const Simple3DScene: React.FC<{
  structure: Enhanced3DStructure;
  showDeformation: boolean;
  deformationScale: number;
  colorMode: string;
  onElementSelect: (elementId: string) => void;
  onNodeSelect: (nodeId: string) => void;
}> = ({ structure, showDeformation, deformationScale, colorMode, onElementSelect, onNodeSelect }) => {
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
          showDeformation={showDeformation}
          deformationScale={deformationScale}
          onClick={onNodeSelect}
        />
      ))}

      {structure.elements.map(element => (
        <Simple3DElement
          key={element.id}
          element={element}
          nodes={structure.nodes}
          scale={structure.scale}
          showDeformation={showDeformation}
          deformationScale={deformationScale}
          colorMode={colorMode}
          onClick={onElementSelect}
        />
      ))}
    </group>
  );
};

const Simple3DViewer: React.FC<Enhanced3DViewerProps> = ({
  structure,
  analysisResults,
  showDeformation: initialShowDeformation = false,
  deformationScale: initialDeformationScale = 1,
  showStress = false,
  showForces = false,
  showLabels = true,
  viewMode = 'solid',
  colorMode: initialColorMode = 'material',
  onElementSelect,
  onNodeSelect,
  className = ''
}) => {
  // Local state for controls
  const [showDeformation, setShowDeformation] = useState(initialShowDeformation);
  const [deformationScale, setDeformationScale] = useState(initialDeformationScale);
  const [colorMode, setColorMode] = useState<'material' | 'stress' | 'utilization' | 'forces'>(initialColorMode);

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
          showDeformation={showDeformation}
          deformationScale={deformationScale}
          colorMode={colorMode}
          onElementSelect={handleElementSelect}
          onNodeSelect={handleNodeSelect}
        />
        <OrbitControls 
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 left-4">
        <Card className="p-3 bg-white/90 backdrop-blur-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">3D Controls</h4>
            
            {/* Deformation controls */}
            {analysisResults && (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-xs">Deformation</label>
                  <input
                    type="checkbox"
                    checked={showDeformation}
                    onChange={(e) => setShowDeformation(e.target.checked)}
                    className="ml-2"
                  />
                </div>
                
                {showDeformation && (
                  <div className="space-y-1">
                    <label className="text-xs">Scale: {deformationScale}x</label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={deformationScale}
                      onChange={(e) => setDeformationScale(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </>
            )}
            
            {/* Color mode */}
            <div className="space-y-1">
              <label className="text-xs">Color Mode</label>
              <select 
                value={colorMode} 
                onChange={(e) => setColorMode(e.target.value as 'material' | 'stress' | 'utilization' | 'forces')}
                className="w-full text-xs p-1 rounded border"
              >
                <option value="material">Material</option>
                <option value="stress">Stress</option>
                <option value="utilization">Utilization</option>
                <option value="forces">Forces</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      <div className="absolute top-4 right-4">
        <Card className="p-3 bg-white/90 backdrop-blur-sm">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">Structure Info</h4>
            <div className="text-xs space-y-0.5">
              <div>Nodes: <span className="font-medium">{structure.nodes.length}</span></div>
              <div>Elements: <span className="font-medium">{structure.elements.length}</span></div>
              {analysisResults && (
                <>
                  <div>Status: <span className="font-medium text-green-600">Analyzed</span></div>
                  {showDeformation && structure.nodes.some(n => n.displacement) && (
                    <div>Max Disp.: <span className="font-medium text-orange-600">
                      {(Math.max(...structure.nodes
                        .filter(n => n.displacement)
                        .map(n => Math.sqrt(
                          Math.pow(n.displacement![0], 2) +
                          Math.pow(n.displacement![1], 2) +
                          Math.pow(n.displacement![2], 2)
                        ))) * 1000).toFixed(1)}mm
                    </span></div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Color: {colorMode.charAt(0).toUpperCase() + colorMode.slice(1)}
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Simple3DViewer;
