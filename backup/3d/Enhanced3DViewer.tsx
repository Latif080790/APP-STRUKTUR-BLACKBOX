/**
 * Enhanced 3D Structure Viewer with Advanced Controls
 * Menampilkan model 3D struktur dengan kontrol interaktif dan visualisasi yang lengkap
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { SimpleSelect } from '../../ui/simple-select';
import { 
  Eye, 
  EyeOff, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Grid3x3, 
  Tags,
  Palette,
  Layers,
  Activity
} from 'lucide-react';
import { Structure3D, Element } from '../../../types/structural';
import { VisualizationErrorBoundary } from '../../common/ErrorBoundary';

interface Enhanced3DViewerProps {
  structure: Structure3D | null;
  onElementClick?: (element: Element) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
  analysisResults?: any;
}

// Enhanced Node Component dengan interactive features
const EnhancedNodeComp = memo(({
  node,
  isSelected,
  showLabel,
  scale = 1,
  color,
  onClick,
}: {
  node: any;
  isSelected: boolean;
  showLabel: boolean;
  scale?: number;
  color?: string;
  onClick: (node: any) => void;
}) => {
  const [hovered, setHovered] = useState(false);

  const nodeColor = useMemo(() => {
    if (color) return color;
    if (isSelected) return '#e74c3c';
    if (hovered) return '#f39c12';
    return '#f1c40f';
  }, [color, isSelected, hovered]);

  return (
    <mesh 
      position={[node.x, node.y, node.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.15 * scale, 16, 16]} />
      <meshStandardMaterial 
        color={nodeColor}
        metalness={0.2}
        roughness={0.4}
        emissive={hovered ? nodeColor : '#000000'}
        emissiveIntensity={hovered ? 0.1 : 0}
      />
      
      {(showLabel || hovered) && (
        <Text
          position={[0, 0.4 * scale, 0]}
          fontSize={0.15 * scale}
          color="#2c3e50"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {node.label || `N${node.id}`}
        </Text>
      )}

      {hovered && (
        <Html position={[0, 0.6 * scale, 0]} center>
          <div className="bg-white border border-gray-300 rounded shadow-lg p-2 text-xs pointer-events-none">
            <div><strong>Node {node.id}</strong></div>
            <div>X: {node.x.toFixed(2)}m</div>
            <div>Y: {node.y.toFixed(2)}m</div>
            <div>Z: {node.z.toFixed(2)}m</div>
            {node.constraints && (
              <div className="mt-1 text-red-600">
                Restraints: {Object.entries(node.constraints)
                  .filter(([, value]) => value)
                  .map(([key]) => key.toUpperCase())
                  .join(', ')}
              </div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
});

// Enhanced Element Component dengan stress visualization
const EnhancedElementComp = memo(({
  element,
  nodes,
  isSelected,
  viewMode,
  showStress,
  stressScale = 1,
  onClick,
}: {
  element: Element;
  nodes: any[];
  isSelected: boolean;
  viewMode: 'solid' | 'wireframe' | 'both';
  showStress: boolean;
  stressScale?: number;
  onClick: (element: Element) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);

  if (!startNode || !endNode) return null;

  const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  const length = start.distanceTo(end);
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Calculate rotation to align cylinder with element direction
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

  // Material properties based on element type and stress
  const materialColor = useMemo(() => {
    if (isSelected) return '#3b82f6';
    if (hovered) return '#10b981';
    
    if (showStress && element.stress !== undefined) {
      const normalizedStress = Math.min(Math.abs(element.stress), 1);
      if (element.stress > 0) {
        // Tension - red gradient
        return `rgb(${Math.floor(255 * normalizedStress)}, ${Math.floor(100 * (1 - normalizedStress))}, 0)`;
      } else {
        // Compression - blue gradient
        return `rgb(0, ${Math.floor(100 * (1 - normalizedStress))}, ${Math.floor(255 * normalizedStress)})`;
      }
    }
    
    // Default colors by element type
    switch (element.type) {
      case 'column': return '#64748b';
      case 'beam': return '#94a3b8';
      case 'slab': return '#cbd5e1';
      default: return '#9ca3af';
    }
  }, [isSelected, hovered, showStress, element.stress, element.type]);

  // Element dimensions
  const width = element.section?.width || 0.3;
  const height = element.section?.height || 0.3;

  return (
    <group>
      {/* Main element geometry */}
      <mesh
        position={center}
        quaternion={quaternion}
        onClick={(e) => {
          e.stopPropagation();
          onClick(element);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        castShadow
        receiveShadow
      >
        {element.type === 'slab' ? (
          <boxGeometry args={[width, 0.2, length]} />
        ) : (
          <cylinderGeometry args={[width/2, height/2, length, 8]} />
        )}
        
        <meshStandardMaterial
          color={materialColor}
          metalness={0.1}
          roughness={0.7}
          wireframe={viewMode === 'wireframe'}
          transparent={true}
          opacity={hovered ? 0.8 : 1.0}
        />
      </mesh>

      {/* Wireframe overlay for 'both' mode */}
      {viewMode === 'both' && (
        <mesh position={center} quaternion={quaternion}>
          {element.type === 'slab' ? (
            <boxGeometry args={[width, 0.2, length]} />
          ) : (
            <cylinderGeometry args={[width/2, height/2, length, 8]} />
          )}
          <meshBasicMaterial color="#2c3e50" wireframe={true} />
        </mesh>
      )}

      {/* Element label and info */}
      {hovered && (
        <Html position={center} center>
          <div className="bg-white border border-gray-300 rounded shadow-lg p-3 text-xs pointer-events-none max-w-xs">
            <div className="font-bold text-gray-800 mb-1">
              {element.type?.toUpperCase() || 'ELEMENT'} {element.id}
            </div>
            <div className="grid grid-cols-2 gap-1 text-gray-600">
              <div>Length: {length.toFixed(2)}m</div>
              <div>Section: {width.toFixed(2)}×{height.toFixed(2)}</div>
              <div>Material: {element.materialType || 'concrete'}</div>
              {element.stress !== undefined && (
                <div className={`font-medium ${element.stress > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  Stress: {(element.stress * 100).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </Html>
      )}

      {/* Stress visualization arrows */}
      {showStress && element.stress !== undefined && Math.abs(element.stress) > 0.1 && (
        <mesh position={center}>
          <cylinderGeometry args={[0.05, 0.1, 0.5]} />
          <meshBasicMaterial color={element.stress > 0 ? '#ef4444' : '#3b82f6'} />
        </mesh>
      )}
    </group>
  );
});

// Main 3D Scene Component
const Enhanced3DScene = memo(({
  structure,
  onElementClick,
  onLoad,
  showLabels,
  showStress,
  viewMode,
  showGrid,
  nodeScale,
  elementTransparency
}: {
  structure: Structure3D;
  onElementClick: (element: Element) => void;
  onLoad?: () => void;
  showLabels: boolean;
  showStress: boolean;
  viewMode: 'solid' | 'wireframe' | 'both';
  showGrid: boolean;
  nodeScale: number;
  elementTransparency: number;
}) => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(prev => prev?.id === element.id ? null : element);
    onElementClick(element);
  }, [onElementClick]);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  // Calculate bounding box and center
  const { center, size } = useMemo(() => {
    if (!structure.nodes?.length) return { center: [0, 0, 0], size: 10 };
    
    const points = structure.nodes.map(n => new THREE.Vector3(n.x, n.y, n.z));
    const box = new THREE.Box3().setFromPoints(points);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    
    return { 
      center: [center.x, center.y, center.z] as [number, number, number], 
      size: Math.max(size, 10) 
    };
  }, [structure.nodes]);

  React.useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <>
      {/* Lighting setup */}
      <Environment preset="warehouse" />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[size, size, size]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={size * 3}
        shadow-camera-left={-size}
        shadow-camera-right={size}
        shadow-camera-top={size}
        shadow-camera-bottom={-size}
      />
      <directionalLight
        position={[-size, size, -size]}
        intensity={0.3}
      />

      {/* Ground plane and grid */}
      {showGrid && (
        <>
          <gridHelper 
            args={[size * 2, 20, '#e2e8f0', '#f1f5f9']} 
            position={[center[0], 0, center[2]]}
          />
          <ContactShadows
            position={[center[0], 0.01, center[2]]}
            opacity={0.3}
            scale={size * 2}
            blur={2}
          />
        </>
      )}

      {/* Coordinate axes */}
      <axesHelper args={[size * 0.3]} position={center} />

      {/* Render nodes */}
      {structure.nodes?.map((node) => (
        <EnhancedNodeComp
          key={`node-${node.id}`}
          node={node}
          isSelected={selectedNode?.id === node.id}
          showLabel={showLabels}
          scale={nodeScale}
          onClick={handleNodeClick}
        />
      ))}

      {/* Render elements */}
      {structure.elements?.map((element) => (
        <EnhancedElementComp
          key={`element-${element.id}`}
          element={element}
          nodes={structure.nodes}
          isSelected={selectedElement?.id === element.id}
          viewMode={viewMode}
          showStress={showStress}
          onClick={handleElementClick}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        screenSpacePanning={false}
        minDistance={size * 0.5}
        maxDistance={size * 5}
        target={center}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
});

// Control Panel Component
const ControlPanel = memo(({
  showLabels,
  setShowLabels,
  showStress,
  setShowStress,
  viewMode,
  setViewMode,
  showGrid,
  setShowGrid,
  nodeScale,
  setNodeScale,
  onReset,
  analysisResults
}: {
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
  showStress: boolean;
  setShowStress: (value: boolean) => void;
  viewMode: 'solid' | 'wireframe' | 'both';
  setViewMode: (value: 'solid' | 'wireframe' | 'both') => void;
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  nodeScale: number;
  setNodeScale: (value: number) => void;
  onReset: () => void;
  analysisResults?: any;
}) => {
  return (
    <Card className="absolute top-4 left-4 w-64 bg-white/90 backdrop-blur-sm z-10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          3D Viewer Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Mode */}
        <div>
          <Label className="text-xs font-medium">View Mode</Label>
          <SimpleSelect
            value={viewMode}
            onValueChange={setViewMode}
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'wireframe', label: 'Wireframe' },
              { value: 'both', label: 'Both' }
            ]}
            className="w-full mt-1"
          />
        </div>

        {/* Toggle Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={showLabels ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            className="flex items-center gap-1"
          >
            <Tags className="h-3 w-3" />
            Labels
          </Button>
          
          <Button
            variant={showStress ? "default" : "outline"}
            size="sm"
            onClick={() => setShowStress(!showStress)}
            className="flex items-center gap-1"
          >
            <Palette className="h-3 w-3" />
            Stress
          </Button>
          
          <Button
            variant={showGrid ? "default" : "outline"}
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center gap-1"
          >
            <Grid3x3 className="h-3 w-3" />
            Grid
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>

        {/* Node Scale */}
        <div>
          <Label className="text-xs font-medium">Node Scale</Label>
          <Input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={nodeScale}
            onChange={(e) => setNodeScale(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
          <div className="text-xs text-gray-500 mt-1">{nodeScale.toFixed(1)}x</div>
        </div>

        {/* Analysis Results Summary */}
        {analysisResults && (
          <div className="pt-2 border-t">
            <Label className="text-xs font-medium">Analysis Summary</Label>
            <div className="text-xs text-gray-600 mt-1 space-y-1">
              <div>Max Stress: {analysisResults.maxStress || 'N/A'}</div>
              <div>Max Drift: {analysisResults.maxDrift || 'N/A'}</div>
              <div>Period: {analysisResults.fundamentalPeriod || 'N/A'}s</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Main Enhanced 3D Viewer Component
export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
  structure,
  onElementClick = () => {},
  onLoad,
  className = '',
  style,
  analysisResults
}) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showStress, setShowStress] = useState(false);
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'both'>('solid');
  const [showGrid, setShowGrid] = useState(true);
  const [nodeScale, setNodeScale] = useState(1);
  const [cameraKey, setCameraKey] = useState(0);

  const handleReset = useCallback(() => {
    setCameraKey(prev => prev + 1);
    setViewMode('solid');
    setShowLabels(false);
    setShowStress(false);
    setShowGrid(true);
    setNodeScale(1);
  }, []);

  if (!structure || !structure.nodes?.length || !structure.elements?.length) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Structure Data</h3>
          <p className="text-gray-600">Please complete the form inputs to generate 3D visualization</p>
        </div>
      </div>
    );
  }

  return (
    <VisualizationErrorBoundary>
      <div className={`relative h-full w-full ${className}`} style={style}>
        <Canvas
          key={cameraKey}
          camera={{ 
            position: [20, 20, 20], 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          shadows
          className="bg-gradient-to-b from-sky-100 to-sky-50"
        >
          <Enhanced3DScene
            structure={structure}
            onElementClick={onElementClick}
            onLoad={onLoad}
            showLabels={showLabels}
            showStress={showStress}
            viewMode={viewMode}
            showGrid={showGrid}
            nodeScale={nodeScale}
            elementTransparency={1}
          />
        </Canvas>

        <ControlPanel
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showStress={showStress}
          setShowStress={setShowStress}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          nodeScale={nodeScale}
          setNodeScale={setNodeScale}
          onReset={handleReset}
          analysisResults={analysisResults}
        />
      </div>
    </VisualizationErrorBoundary>
  );
};

export default Enhanced3DViewer;