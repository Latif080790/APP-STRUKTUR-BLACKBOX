import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Grid, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Node, Element, Structure3D } from '@/types/structural';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

interface StructureViewerProps {
  structure: Structure3D | null;
  showLabels?: boolean;
  showStress?: boolean;
  viewMode?: 'solid' | 'wireframe' | 'both';
  onElementClick: (element: Element) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface ForceVisualizationProps {
  position: THREE.Vector3;
  force: THREE.Vector3;
  type: 'load' | 'reaction';
  scale?: number;
}

interface DeformationData {
  originalPosition: THREE.Vector3;
  deformedPosition: THREE.Vector3;
  displacement: THREE.Vector3;
}

// Enhanced Grid Component with interactive controls
const InteractiveGrid = memo(({ visible, size = 50, divisions = 50 }: {
  visible: boolean;
  size?: number;
  divisions?: number;
}) => {
  if (!visible) return null;
  
  return (
    <group>
      <gridHelper 
        args={[size, divisions, '#666666', '#444444']} 
        position={[0, 0, 0]}
      />
      <gridHelper 
        args={[size, divisions, '#666666', '#444444']} 
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <gridHelper 
        args={[size, divisions, '#666666', '#444444']} 
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />
    </group>
  );
});

// Force Visualization Component
const ForceArrow = memo(({ position, force, type, scale = 1 }: ForceVisualizationProps) => {
  const forceDirection = force.clone().normalize();
  const forceMagnitude = force.length() * scale;
  
  const color = type === 'load' ? '#ff4444' : '#44ff44';
  
  return (
    <group position={position}>
      {/* Arrow shaft */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, forceMagnitude, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Arrow head */}
      <mesh position={[0, forceMagnitude / 2, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Force label */}
      <Html position={[0.5, forceMagnitude / 2, 0]}>
        <div className="bg-white px-2 py-1 rounded shadow text-xs">
          {type}: {forceMagnitude.toFixed(2)} kN
        </div>
      </Html>
    </group>
  );
});

// Deformation Visualization
const DeformationLine = memo(({ original, deformed }: {
  original: THREE.Vector3;
  deformed: THREE.Vector3;
}) => {
  const points = [original, deformed];
  
  return (
    <Line
      points={points}
      color="#ff9900"
      lineWidth={2}
      dashed={true}
    />
  );
});

// Enhanced Node Component with forces and deformation
const NodeComp = memo(({
  node,
  isSelected,
  showLabel,
  onClick,
  deformation,
  forces,
}: {
  node: Node;
  isSelected: boolean;
  showLabel: boolean;
  onClick: (node: Node) => void;
  deformation?: DeformationData;
  forces?: { load?: THREE.Vector3; reaction?: THREE.Vector3 };
}) => {
  const handleClick = useCallback((e: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    onClick(node);
  }, [node, onClick]);

  const currentPosition = deformation?.deformedPosition || new THREE.Vector3(node.x, node.y, node.z);
  const originalPosition = new THREE.Vector3(node.x, node.y, node.z);

  return (
    <group>
      {/* Original position (if deformed) */}
      {deformation && (
        <mesh position={originalPosition} onClick={handleClick}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color="#cccccc" 
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      )}
      
      {/* Current/Deformed position */}
      <mesh position={currentPosition} onClick={handleClick} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? '#e74c3c' : (deformation ? '#ff6b35' : '#f1c40f')}
          metalness={0.1}
          roughness={0.5}
        />
        {showLabel && node.label && (
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.2}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {node.label}
          </Text>
        )}
      </mesh>

      {/* Deformation line */}
      {deformation && (
        <DeformationLine original={originalPosition} deformed={currentPosition} />
      )}

      {/* Force arrows */}
      {forces?.load && (
        <ForceArrow 
          position={currentPosition} 
          force={forces.load} 
          type="load" 
          scale={1} 
        />
      )}
      {forces?.reaction && (
        <ForceArrow 
          position={currentPosition} 
          force={forces.reaction} 
          type="reaction" 
          scale={1} 
        />
      )}
    </group>
  );
});

// Enhanced Element Component with stress colors and deformation
interface ElementCompProps {
  element: Element;
  nodes: Node[];
  isSelected: boolean;
  viewMode: 'solid' | 'wireframe' | 'both';
  onClick: (element: Element) => void;
  onHover?: (hovered: boolean) => void;
  showStress?: boolean;
  deformationData?: Map<number, DeformationData>;
}

const ElementComp = memo(({
  element,
  nodes,
  isSelected,
  viewMode,
  onClick,
  onHover,
  showStress = false,
  deformationData,
}: ElementCompProps) => {
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);
  const [hovered, setHovered] = useState(false);

  if (!startNode || !endNode) {
    console.warn(`Element ${element.id} has invalid nodes:`, element.nodes);
    return null;
  }

  // Get deformed positions if available
  const startDeformation = deformationData?.get(startNode.id);
  const endDeformation = deformationData?.get(endNode.id);
  
  const start = startDeformation?.deformedPosition || new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const end = endDeformation?.deformedPosition || new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  
  const originalStart = new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const originalEnd = new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  
  const length = start.distanceTo(end);
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Calculate stress-based color
  const getStressColor = useCallback(() => {
    if (!showStress || element.stress === undefined) {
      return isSelected ? '#3b82f6' : (element.type === 'column' ? '#64748b' : '#94a3b8');
    }
    
    const stress = Math.abs(element.stress);
    const maxStress = 1.0; // Normalized max stress
    const intensity = Math.min(stress / maxStress, 1);
    
    if (element.stress > 0) {
      // Tension - Red gradient
      return `hsl(0, ${intensity * 100}%, ${100 - intensity * 30}%)`;
    } else {
      // Compression - Blue gradient  
      return `hsl(240, ${intensity * 100}%, ${100 - intensity * 30}%)`;
    }
  }, [element.stress, element.type, showStress, isSelected]);

  const handleHover = useCallback((hovered: boolean) => {
    setHovered(hovered);
    onHover?.(hovered);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick(element);
  }, [element, onClick]);

  return (
    <group>
      {/* Original element (if deformed) */}
      {(startDeformation || endDeformation) && (
        <mesh
          position={new THREE.Vector3().addVectors(originalStart, originalEnd).multiplyScalar(0.5)}
        >
          <cylinderGeometry
            args={[element.section.width / 2, element.section.width / 2, originalStart.distanceTo(originalEnd), 8]}
          />
          <meshStandardMaterial 
            color="#cccccc" 
            transparent 
            opacity={0.2} 
            wireframe 
          />
        </mesh>
      )}

      {/* Current/Deformed element */}
      <mesh
        position={center}
        onPointerOver={(e) => {
          e.stopPropagation();
          handleHover(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          handleHover(false);
        }}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[element.section.width / 2, element.section.width / 2, length, 8]}
        />
        <meshStandardMaterial 
          color={getStressColor()}
          transparent={viewMode === 'wireframe'}
          opacity={viewMode === 'wireframe' ? 0.7 : 1}
          wireframe={viewMode === 'wireframe' || viewMode === 'both'}
        />
      </mesh>

      {/* Enhanced tooltip with stress and deformation info */}
      {(hovered || isSelected) && (
        <Html position={center} center>
          <div className="bg-white text-black text-xs p-2 rounded shadow-lg pointer-events-none border">
            <div className="font-semibold">Element {element.id}</div>
            <div>Type: {element.type || 'beam'}</div>
            <div>Section: {element.section.width}×{element.section.height || element.section.width}</div>
            {element.stress !== undefined && (
              <div className="mt-1">
                <div>Stress: {(element.stress * 100).toFixed(2)}%</div>
                <div className="text-xs text-gray-600">
                  {element.stress > 0 ? 'Tension' : 'Compression'}
                </div>
              </div>
            )}
            {(startDeformation || endDeformation) && (
              <div className="mt-1 text-xs text-blue-600">
                Deformed (exaggerated)
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
});

// Enhanced Scene Component with working controls
const StructureScene = memo(({
  structure,
  onLoad,
  onElementClick,
  showLabels = false,
  showStress = false,
  viewMode = 'solid',
  showGrid = true,
  showColumns = true,
  showBeams = true,
  showSlabs = true,
  showFoundation = true,
  showForces = false,
  showDeformation = false,
  deformationScale = 10
}: StructureViewerProps & {
  showGrid?: boolean;
  showColumns?: boolean;
  showBeams?: boolean;
  showSlabs?: boolean;
  showFoundation?: boolean;
  showForces?: boolean;
  showDeformation?: boolean;
  deformationScale?: number;
}) => {
  const { camera } = useThree();
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate sample deformation data
  const deformationData = useMemo(() => {
    if (!showDeformation || !structure?.nodes) return new Map();
    
    const data = new Map<number, DeformationData>();
    structure.nodes.forEach(node => {
      const displacement = new THREE.Vector3(
        (Math.random() - 0.5) * deformationScale * 0.1,
        (Math.random() - 0.5) * deformationScale * 0.05,
        (Math.random() - 0.5) * deformationScale * 0.1
      );
      
      data.set(node.id, {
        originalPosition: new THREE.Vector3(node.x, node.y, node.z),
        deformedPosition: new THREE.Vector3(node.x, node.y, node.z).add(displacement),
        displacement
      });
    });
    
    return data;
  }, [structure, showDeformation, deformationScale]);

  // Generate sample force data
  const forceData = useMemo(() => {
    if (!showForces || !structure?.nodes) return new Map();
    
    const data = new Map();
    structure.nodes.forEach(node => {
      // Sample loads and reactions
      const forces: { load?: THREE.Vector3; reaction?: THREE.Vector3 } = {};
      
      if (node.y > 0) { // Upper nodes get loads
        forces.load = new THREE.Vector3(0, -10 - Math.random() * 20, 0);
      }
      
      if (node.y <= 0) { // Foundation nodes get reactions
        forces.reaction = new THREE.Vector3(0, 10 + Math.random() * 15, 0);
      }
      
      data.set(node.id, forces);
    });
    
    return data;
  }, [structure, showForces]);

  // Initialize camera and scene
  useEffect(() => {
    try {
      if (!structure) {
        throw new Error('Struktur tidak tersedia');
      }
      
      if (!structure.nodes?.length || !structure.elements?.length) {
        throw new Error('Struktur tidak valid: nodes atau elements kosong');
      }

      setError(null);
      
      // Set up camera
      const points = structure.nodes.map(n => new THREE.Vector3(n.x, n.y, n.z));
      const box = new THREE.Box3().setFromPoints(points);
      
      if (box.isEmpty()) {
        throw new Error('Bounding box kosong - koordinat node mungkin tidak valid');
      }

      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3()).length();

      camera.position.copy(center);
      camera.position.x += size * 1.5;
      camera.position.y += size * 1.5;
      camera.position.z += size * 1.5;
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      if (onLoad) onLoad();
    } catch (err) {
      console.error('Error in StructureScene:', err);
      setError(`Gagal memuat model 3D: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [structure, camera, onLoad]);

  // Show error if any
  if (error) {
    return (
      <Html center>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <p className="text-xs mt-2">Periksa console untuk detail lebih lanjut</p>
        </div>
      </Html>
    );
  }

  // Show loading if structure not ready
  if (!structure || !structure.nodes?.length || !structure.elements?.length) {
    return (
      <Html center>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p>Memuat model 3D...</p>
        </div>
      </Html>
    );
  }

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(element.id);
    onElementClick(element);
  }, [onElementClick]);

  // Filter elements based on visibility settings
  const visibleElements = structure.elements.filter(element => {
    switch (element.type) {
      case 'column': return showColumns;
      case 'beam': return showBeams;
      case 'slab': return showSlabs;
      case 'foundation': return showFoundation;
      default: return true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <directionalLight
        position={[-20, -10, -5]}
        intensity={0.3}
      />
      
      {/* Enhanced Grid */}
      <InteractiveGrid visible={showGrid} size={50} divisions={20} />
      
      {/* Coordinate axes */}
      <axesHelper args={[5]} />
      
      {/* Render nodes with forces and deformation */}
      {structure.nodes.map((node) => (
        <NodeComp
          key={`node-${node.id}`}
          node={node}
          isSelected={false}
          showLabel={showLabels}
          onClick={() => {}}
          deformation={deformationData.get(node.id)}
          forces={forceData.get(node.id)}
        />
      ))}
      
      {/* Render visible elements with enhanced features */}
      {visibleElements.map((element) => {
        const elementNodes = element.nodes
          .map(nodeId => structure.nodes.find(n => n.id === nodeId))
          .filter(Boolean) as Node[];
        
        if (elementNodes.length < 2) {
          console.warn(`Element ${element.id} has invalid nodes`);
          return null;
        }
        
        return (
          <ElementComp
            key={`element-${element.id}`}
            element={element}
            nodes={elementNodes}
            isSelected={selectedElement === element.id}
            viewMode={viewMode}
            onClick={handleElementClick}
            onHover={(hovered) => {
              setSelectedElement(hovered ? element.id : null);
            }}
            showStress={showStress}
            deformationData={deformationData}
          />
        );
      })}
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        screenSpacePanning={false}
        minDistance={1}
        maxDistance={1000}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
});

// Enhanced Control Panel Component
const ControlPanel = memo(({ 
  viewAngle, 
  rotation, 
  showColumns, 
  showBeams, 
  showSlabs, 
  showFoundation,
  showGrid,
  showForces,
  showDeformation,
  onViewAngleChange,
  onRotationChange,
  onToggleColumns,
  onToggleBeams,
  onToggleSlabs,
  onToggleFoundation,
  onToggleGrid,
  onToggleForces,
  onToggleDeformation
}: {
  viewAngle: number;
  rotation: number;
  showColumns: boolean;
  showBeams: boolean;
  showSlabs: boolean;
  showFoundation: boolean;
  showGrid: boolean;
  showForces: boolean;
  showDeformation: boolean;
  onViewAngleChange: (angle: number) => void;
  onRotationChange: (angle: number) => void;
  onToggleColumns: (show: boolean) => void;
  onToggleBeams: (show: boolean) => void;
  onToggleSlabs: (show: boolean) => void;
  onToggleFoundation: (show: boolean) => void;
  onToggleGrid: (show: boolean) => void;
  onToggleForces: (show: boolean) => void;
  onToggleDeformation: (show: boolean) => void;
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
      <h3 className="font-semibold mb-3 text-sm">3D Controls</h3>
      
      {/* View Controls */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="block mb-1">View Angle: {viewAngle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={viewAngle}
            onChange={(e) => onViewAngleChange(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block mb-1">Rotation: {rotation}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => onRotationChange(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Element Visibility */}
      <div className="mt-4 space-y-2">
        <h4 className="font-medium text-xs">Visibility</h4>
        <div className="space-y-1 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => onToggleGrid(e.target.checked)}
              className="w-3 h-3"
            />
            Grid
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showColumns}
              onChange={(e) => onToggleColumns(e.target.checked)}
              className="w-3 h-3"
            />
            Columns
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showBeams}
              onChange={(e) => onToggleBeams(e.target.checked)}
              className="w-3 h-3"
            />
            Beams
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showSlabs}
              onChange={(e) => onToggleSlabs(e.target.checked)}
              className="w-3 h-3"
            />
            Slabs
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showFoundation}
              onChange={(e) => onToggleFoundation(e.target.checked)}
              className="w-3 h-3"
            />
            Foundation
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showForces}
              onChange={(e) => onToggleForces(e.target.checked)}
              className="w-3 h-3"
            />
            Forces
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDeformation}
              onChange={(e) => onToggleDeformation(e.target.checked)}
              className="w-3 h-3"
            />
            Deformation
          </label>
        </div>
      </div>
    </div>
  );
});

// Main StructureViewer Component with enhanced functionality
const StructureViewer = memo(({
  structure,
  showLabels = false,
  showStress = false,
  viewMode = 'solid',
  onElementClick = () => { /* noop */ },
  onLoad,
  className = '',
  style
}: StructureViewerProps) => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced control states
  const [viewAngle, setViewAngle] = useState(20);
  const [rotation, setRotation] = useState(45);
  const [showGrid, setShowGrid] = useState(true);
  const [showColumns, setShowColumns] = useState(true);
  const [showBeams, setShowBeams] = useState(true);
  const [showSlabs, setShowSlabs] = useState(true);
  const [showFoundation, setShowFoundation] = useState(true);
  const [showForces, setShowForces] = useState(false);
  const [showDeformation, setShowDeformation] = useState(false);

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(prev => 
      prev?.id === element.id ? null : element
    );
    if (onElementClick) {
      onElementClick(element);
    }
  }, [onElementClick]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (onLoad) onLoad();
  }, [onLoad]);

  // Show message if no structure
  if (!structure) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-4">
          <div className="text-gray-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700">Tidak ada data struktur yang tersedia</p>
          <p className="text-sm text-gray-500 mt-1">Silakan periksa input atau coba lagi nanti</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`structure-viewer relative ${className}`} style={style}>
        {/* Enhanced Control Panel */}
        <ControlPanel
          viewAngle={viewAngle}
          rotation={rotation}
          showColumns={showColumns}
          showBeams={showBeams}
          showSlabs={showSlabs}
          showFoundation={showFoundation}
          showGrid={showGrid}
          showForces={showForces}
          showDeformation={showDeformation}
          onViewAngleChange={setViewAngle}
          onRotationChange={setRotation}
          onToggleColumns={setShowColumns}
          onToggleBeams={setShowBeams}
          onToggleSlabs={setShowSlabs}
          onToggleFoundation={setShowFoundation}
          onToggleGrid={setShowGrid}
          onToggleForces={setShowForces}
          onToggleDeformation={setShowDeformation}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading 3D Model...</p>
            </div>
          </div>
        )}
        
        {/* 3D Canvas */}
        <Canvas 
          camera={{ position: [15, 15, 15], fov: 50 }}
          shadows
          style={{ background: 'linear-gradient(to bottom, #87CEEB, #98D8E8)' }}
        >
          <StructureScene 
            structure={structure}
            showLabels={showLabels}
            showStress={showStress}
            viewMode={viewMode}
            onElementClick={handleElementClick}
            onLoad={handleLoad}
            showGrid={showGrid}
            showColumns={showColumns}
            showBeams={showBeams}
            showSlabs={showSlabs}
            showFoundation={showFoundation}
            showForces={showForces}
            showDeformation={showDeformation}
          />
        </Canvas>

        {/* Information panel for selected element */}
        {selectedElement && (
          <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-sm">
            <h4 className="font-semibold text-sm mb-2">Selected Element</h4>
            <div className="text-xs space-y-1">
              <p><span className="font-medium">ID:</span> {selectedElement.id}</p>
              <p><span className="font-medium">Type:</span> {selectedElement.type || 'beam'}</p>
              <p><span className="font-medium">Section:</span> {selectedElement.section.width}×{selectedElement.section.height || selectedElement.section.width}</p>
              {selectedElement.material && (
                <p><span className="font-medium">Material:</span> {selectedElement.material.name || 'Concrete'}</p>
              )}
              {selectedElement.stress !== undefined && (
                <p><span className="font-medium">Stress:</span> {(selectedElement.stress * 100).toFixed(2)}% ({selectedElement.stress > 0 ? 'Tension' : 'Compression'})</p>
              )}
            </div>
            <button
              onClick={() => setSelectedElement(null)}
              className="mt-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
            >
              Close
            </button>
          </div>
        )}

        {/* Quick action buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setShowStress(!showStress)}
            className={`p-2 rounded-lg shadow-md text-xs ${
              showStress 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            title="Toggle Stress Visualization"
          >
            Stress
          </button>
          <button
            onClick={() => setShowForces(!showForces)}
            className={`p-2 rounded-lg shadow-md text-xs ${
              showForces 
                ? 'bg-green-500 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            title="Toggle Force Visualization"
          >
            Forces
          </button>
          <button
            onClick={() => setShowDeformation(!showDeformation)}
            className={`p-2 rounded-lg shadow-md text-xs ${
              showDeformation 
                ? 'bg-orange-500 text-white' 
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
            title="Toggle Deformation"
          >
            Deform
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
});

StructureViewer.displayName = 'StructureViewer';

export default StructureViewer;

// Export types
export type Node3D = Node;
export type Element3D = Element;
export type Structure3DType = Structure3D;
