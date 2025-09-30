/**
 * Performance-Optimized 3D Structure Viewer
 * Uses InstancedMesh for rendering large structures efficiently
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Html, 
  Environment,
  Grid,
  ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  EyeOff,
  Grid3X3,
  Lightbulb,
  Camera,
  BarChart3,
  Activity,
  Maximize2,
  Download
} from 'lucide-react';

// Types for enhanced 3D visualization
interface Enhanced3DNode {
  id: string;
  position: [number, number, number];
  displacement?: [number, number, number];
  rotation?: [number, number, number];
  forces?: [number, number, number];
  moments?: [number, number, number];
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
  forces?: {
    axial: number[];
    shear: number[];
    moment: number[];
    positions: number[];
  };
  stresses?: {
    max: number;
    min: number;
    vonMises: number[];
  };
  utilization?: number;
  isSelected?: boolean;
}

interface Enhanced3DStructure {
  nodes: Enhanced3DNode[];
  elements: Enhanced3DElement[];
  loads: {
    nodeId: string;
    forces: [number, number, number];
    moments: [number, number, number];
  }[];
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
  scale: number;
}

interface Optimized3DViewerProps {
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

// Instanced Node Component for performance optimization
const InstancedNodes: React.FC<{
  nodes: Enhanced3DNode[];
  scale: number;
  showDeformation: boolean;
  deformationScale: number;
  showLabels: boolean;
  onNodeSelect: (nodeId: string) => void;
}> = ({ nodes, scale, showDeformation, deformationScale, showLabels, onNodeSelect }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Update instance positions
  useEffect(() => {
    if (!meshRef.current) return;

    nodes.forEach((node, index) => {
      // Calculate deformed position
      const position = showDeformation && node.displacement ? [
        node.position[0] + node.displacement[0] * deformationScale,
        node.position[1] + node.displacement[1] * deformationScale,
        node.position[2] + node.displacement[2] * deformationScale
      ] : node.position;

      tempObject.position.set(position[0], position[1], position[2]);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(index, tempObject.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [nodes, showDeformation, deformationScale, tempObject]);

  // Handle node selection
  const handleClick = useCallback((e: any) => {
    if (!meshRef.current) return;
    
    const intersections = e.intersections;
    if (intersections.length > 0) {
      const instanceId = intersections[0].instanceId;
      if (instanceId !== undefined && instanceId < nodes.length) {
        onNodeSelect(nodes[instanceId].id);
      }
    }
  }, [nodes, onNodeSelect]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, nodes.length]}
      onClick={handleClick}
      castShadow
      receiveShadow
      frustumCulled={true}
    >
      <sphereGeometry args={[0.1 * scale, 16, 16]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#3498db"
        metalness={0.2}
        roughness={0.3}
      />
    </instancedMesh>
  );
};

// Instanced Element Component for performance optimization
const InstancedElements: React.FC<{
  elements: Enhanced3DElement[];
  nodes: Enhanced3DNode[];
  scale: number;
  showDeformation: boolean;
  deformationScale: number;
  colorMode: string;
  showLabels: boolean;
  onElementSelect: (elementId: string) => void;
}> = ({ elements, nodes, scale, showDeformation, deformationScale, colorMode, showLabels, onElementSelect }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Update instance positions and rotations
  useEffect(() => {
    if (!meshRef.current) return;

    elements.forEach((element, index) => {
      // Find start and end nodes
      const startNode = nodes.find(n => n.id === element.startNode);
      const endNode = nodes.find(n => n.id === element.endNode);

      if (!startNode || !endNode) return;

      // Calculate deformed positions
      const startPos = showDeformation && startNode.displacement ? [
        startNode.position[0] + startNode.displacement[0] * deformationScale,
        startNode.position[1] + startNode.displacement[1] * deformationScale,
        startNode.position[2] + startNode.displacement[2] * deformationScale
      ] : startNode.position;

      const endPos = showDeformation && endNode.displacement ? [
        endNode.position[0] + endNode.displacement[0] * deformationScale,
        endNode.position[1] + endNode.displacement[1] * deformationScale,
        endNode.position[2] + endNode.displacement[2] * deformationScale
      ] : endNode.position;

      // Calculate element geometry
      const direction = new THREE.Vector3(
        endPos[0] - startPos[0],
        endPos[1] - startPos[1],
        endPos[2] - startPos[2]
      );
      const length = direction.length();
      const center = new THREE.Vector3(
        (startPos[0] + endPos[0]) / 2,
        (startPos[1] + endPos[1]) / 2,
        (startPos[2] + endPos[2]) / 2
      );

      // Calculate rotation
      const up = new THREE.Vector3(0, 1, 0);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.normalize());

      // Set position and rotation
      tempObject.position.copy(center);
      tempObject.quaternion.copy(quaternion);
      tempObject.scale.set(
        element.section.width * scale,
        length,
        element.section.height * scale
      );
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(index, tempObject.matrix);
    });
    
    meshRef.current!.instanceMatrix.needsUpdate = true;
  }, [elements, nodes, showDeformation, deformationScale, scale, tempObject]);

  // Handle element selection
  const handleClick = useCallback((e: any) => {
    if (!meshRef.current) return;
    
    const intersections = e.intersections;
    if (intersections.length > 0) {
      const instanceId = intersections[0].instanceId;
      if (instanceId !== undefined && instanceId < elements.length) {
        onElementSelect(elements[instanceId].id);
      }
    }
  }, [elements, onElementSelect]);

  // Color based on mode
  const getElementColor = () => {
    switch (colorMode) {
      case 'stress':
        return '#e74c3c'; // Red for stress visualization
      case 'utilization':
        return '#f39c12'; // Orange for utilization
      case 'material':
        return '#3498db'; // Blue for material
      case 'forces':
        return '#2ecc71'; // Green for forces
      default:
        return '#3498db';
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, elements.length]}
      onClick={handleClick}
      castShadow
      receiveShadow
      frustumCulled={true}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={getElementColor()}
        metalness={0.3}
        roughness={0.4}
      />
    </instancedMesh>
  );
};

// Optimized Scene Component
const Optimized3DScene: React.FC<{
  structure: Enhanced3DStructure;
  showDeformation: boolean;
  deformationScale: number;
  showStress: boolean;
  showForces: boolean;
  showLabels: boolean;
  colorMode: string;
  onElementSelect: (elementId: string) => void;
  onNodeSelect: (nodeId: string) => void;
}> = ({ 
  structure, 
  showDeformation, 
  deformationScale, 
  showStress, 
  showForces, 
  showLabels, 
  colorMode,
  onElementSelect,
  onNodeSelect 
}) => {
  const { camera } = useThree();

  useEffect(() => {
    // Auto-fit camera to structure
    const { min, max } = structure.boundingBox;
    const center = new THREE.Vector3(
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2
    );
    const size = Math.max(
      max[0] - min[0],
      max[1] - min[1],
      max[2] - min[2]
    );
    
    camera.position.set(center.x + size, center.y + size * 0.5, center.z + size);
    camera.lookAt(center);
  }, [structure, camera]);

  return (
    <group>
      {/* Environment and lighting */}
      <Environment preset="warehouse" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Ground grid */}
      <Grid 
        cellSize={1}
        cellThickness={0.5}
        cellColor="#bdc3c7"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#7f8c8d"
        infiniteGrid
        fadeDistance={50}
        position={[0, structure.boundingBox.min[1] - 0.5, 0]}
      />

      {/* Contact shadows */}
      <ContactShadows 
        position={[0, structure.boundingBox.min[1] - 0.1, 0]}
        opacity={0.3}
        scale={50}
        blur={2}
        far={10}
      />

      {/* Render nodes using instancing for performance */}
      <InstancedNodes
        nodes={structure.nodes}
        scale={structure.scale}
        showDeformation={showDeformation}
        deformationScale={deformationScale}
        showLabels={showLabels}
        onNodeSelect={onNodeSelect}
      />

      {/* Render elements using instancing for performance */}
      <InstancedElements
        elements={structure.elements}
        nodes={structure.nodes}
        scale={structure.scale}
        showDeformation={showDeformation}
        deformationScale={deformationScale}
        colorMode={colorMode}
        showLabels={showLabels}
        onElementSelect={onElementSelect}
      />
    </group>
  );
};

// Main Optimized 3D Viewer Component
export const Optimized3DViewer: React.FC<Optimized3DViewerProps> = ({
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
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [currentDeformationScale, setCurrentDeformationScale] = useState(deformationScale);
  const [currentColorMode, setCurrentColorMode] = useState(colorMode);
  const [showGrid, setShowGrid] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);

  // Handle element selection
  const handleElementSelect = useCallback((elementId: string) => {
    if (onElementSelect) {
      onElementSelect(elementId);
    }
  }, [onElementSelect]);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId);
    }
  }, [onNodeSelect]);

  // Reset camera view
  const resetView = useCallback(() => {
    // This would typically trigger a camera reset
  }, []);

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
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [10, 10, 10], fov: 60 }}
        shadows
        className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50"
      >
        <Optimized3DScene
          structure={structure}
          showDeformation={showDeformation}
          deformationScale={currentDeformationScale}
          showStress={showStress}
          showForces={showForces}
          showLabels={showLabels}
          colorMode={currentColorMode}
          onElementSelect={handleElementSelect}
          onNodeSelect={handleNodeSelect}
        />
        <OrbitControls 
          enabled={controlsEnabled}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          dampingFactor={0.1}
          enableDamping
        />
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 space-y-2">
        <Card className="p-3 bg-white/90 backdrop-blur-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              View Controls
            </h4>
            
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant={currentColorMode === 'material' ? 'default' : 'outline'}
                onClick={() => setCurrentColorMode('material')}
                className="text-xs"
              >
                Material
              </Button>
              <Button
                size="sm"
                variant={currentColorMode === 'stress' ? 'default' : 'outline'}
                onClick={() => setCurrentColorMode('stress')}
                className="text-xs"
              >
                Stress
              </Button>
              <Button
                size="sm"
                variant={currentColorMode === 'utilization' ? 'default' : 'outline'}
                onClick={() => setCurrentColorMode('utilization')}
                className="text-xs"
              >
                Utilization
              </Button>
              <Button
                size="sm"
                variant={currentColorMode === 'forces' ? 'default' : 'outline'}
                onClick={() => setCurrentColorMode('forces')}
                className="text-xs"
              >
                Forces
              </Button>
            </div>

            {showDeformation && (
              <div className="space-y-1">
                <label className="text-xs font-medium">Deformation Scale: {currentDeformationScale.toFixed(1)}x</label>
                <Slider
                  value={currentDeformationScale}
                  onChange={(value: number) => setCurrentDeformationScale(value)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}

          </div>
        </Card>

        <Card className="p-3 bg-white/90 backdrop-blur-sm">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Display Options
            </h4>
            
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant={showGrid ? 'default' : 'outline'}
                onClick={() => setShowGrid(!showGrid)}
                className="text-xs"
              >
                <Grid3X3 className="w-3 h-3 mr-1" />
                Grid
              </Button>
              <Button
                size="sm"
                variant={autoRotate ? 'default' : 'outline'}
                onClick={() => setAutoRotate(!autoRotate)}
                className="text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Rotate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={resetView}
                className="text-xs"
              >
                <ZoomIn className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Panel */}
      <div className="absolute top-4 right-4">
        <Card className="p-3 bg-white/90 backdrop-blur-sm">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Structure Info
            </h4>
            <div className="text-xs space-y-0.5">
              <div>Nodes: <Badge variant="secondary">{structure.nodes.length}</Badge></div>
              <div>Elements: <Badge variant="secondary">{structure.elements.length}</Badge></div>
              {analysisResults && (
                <div>Status: <Badge variant="default">Analyzed</Badge></div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Legend for color coding */}
      {(currentColorMode === 'stress' || currentColorMode === 'utilization') && (
        <div className="absolute bottom-4 left-4">
          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">
                {currentColorMode === 'stress' ? 'Stress Legend' : 'Utilization Legend'}
              </h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Low</span>
                <div className="w-8 h-2 bg-gradient-to-r from-green-500 to-red-500 rounded"></div>
                <span className="text-xs">High</span>
                <div className="w-3 h-3 bg-red-500 rounded"></div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Optimized3DViewer;