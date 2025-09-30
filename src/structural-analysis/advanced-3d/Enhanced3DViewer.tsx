/**
 * Enhanced 3D Structure Viewer with Advanced Controls
 * Menampilkan model 3D struktur dengan kontrol interaktif dan visualisasi yang lengkap
 */

import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
// Custom UI components defined inline
const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'default', size = 'default', className = '', disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${
      variant === 'outline' 
        ? 'border border-input hover:bg-accent hover:text-accent-foreground' 
        : 'bg-primary text-primary-foreground hover:bg-primary/90'
    } ${
      size === 'sm' ? 'h-9 px-3 rounded-md' :
      size === 'lg' ? 'h-11 px-8 rounded-md' :
      'h-10 py-2 px-4'
    } ${className}`}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string; className?: string }> = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { className?: string }> = ({ className = '', ...props }) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const SimpleSelect: React.FC<{ 
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}> = ({ value, onValueChange, options, className = '' }) => (
  <select 
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
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
import { Structure3D, Element } from '@/types/structural';
import VisualizationErrorBoundary from '../common/Enhanced3DErrorBoundary';

interface Enhanced3DViewerProps {
  structure: Structure3D | null;
  onElementClick?: (element: Element) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
  analysisResults?: any;
  // Add animation props
  timeSeriesData?: any[]; // Time series analysis results
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
  const meshRef = useRef<THREE.Mesh>(null);

  const nodeColor = useMemo(() => {
    if (color) return color;
    if (isSelected) return '#e74c3c';
    if (hovered) return '#f39c12';
    return '#f1c40f';
  }, [color, isSelected, hovered]);

  // Enable frustum culling for better performance
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.frustumCulled = true;
    }
  }, []);

  return (
    <mesh 
      ref={meshRef}
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
  cameraPosition
}: {
  element: Element;
  nodes: any[];
  isSelected: boolean;
  viewMode: 'solid' | 'wireframe' | 'both';
  showStress: boolean;
  stressScale?: number;
  onClick: (element: Element) => void;
  cameraPosition: THREE.Vector3;
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
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

  // Level of Detail (LOD) implementation
  const distanceToCamera = center.distanceTo(cameraPosition);
  const elementCount = nodes.length + element.nodes.length;
  
  // LOD logic - reduce detail based on distance and complexity
  const useLOD = (distance: number, count: number) => {
    if (distance > 50 && count > 1000) {
      return 'low'; // Low detail for distant, complex structures
    } else if (distance > 20 && count > 500) {
      return 'medium'; // Medium detail
    }
    return 'high'; // High detail for close or simple structures
  };
  
  const lodLevel = useLOD(distanceToCamera, elementCount);
  
  // Adjust geometry detail based on LOD level
  const segments = lodLevel === 'low' ? 4 : lodLevel === 'medium' ? 6 : 8;
  const width = element.section?.width || 0.3;
  const height = element.section?.height || 0.3;

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

  // Enable frustum culling for better performance
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.frustumCulled = true;
    }
  }, []);

  return (
    <group>
      {/* Main element geometry */}
      <mesh
        ref={meshRef}
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
          <cylinderGeometry args={[width/2, height/2, length, segments]} />
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
            <cylinderGeometry args={[width/2, height/2, length, segments]} />
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
              <div>Material: {element.material?.type || 'concrete'}</div>
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
  elementTransparency,
  // Animation props
  isAnimating,
  currentTimeIndex,
  timeSeriesData
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
  // Animation props
  isAnimating: boolean;
  currentTimeIndex: number;
  timeSeriesData?: any[];
}) => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const { camera } = useThree();

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(prev => prev?.id === element.id ? null : element);
    onElementClick(element);
  }, [onElementClick]);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode((prev: any) => prev?.id === node.id ? null : node);
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

  // Get camera position for LOD calculations
  const cameraPosition = useMemo(() => {
    return new THREE.Vector3().copy(camera.position);
  }, [camera.position]);

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
      <axesHelper args={[size * 0.3]} position={center as [number, number, number]} />

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
          cameraPosition={cameraPosition}
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
        target={center as [number, number, number]}
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
  analysisResults,
  // Animation controls
  isAnimating,
  setIsAnimating,
  animationSpeed,
  setAnimationSpeed,
  currentTimeIndex,
  setTimeIndex,
  timeSeriesData
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
  // Animation controls
  isAnimating: boolean;
  setIsAnimating: (value: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
  currentTimeIndex: number;
  setTimeIndex: (value: number) => void;
  timeSeriesData?: any[];
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
            onValueChange={(value) => setViewMode(value as 'solid' | 'wireframe' | 'both')}
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

        {/* Animation Controls */}
        {timeSeriesData && timeSeriesData.length > 0 && (
          <div className="pt-2 border-t">
            <Label className="text-xs font-medium">Animation</Label>
            <div className="flex items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
                className="flex items-center gap-1"
              >
                {isAnimating ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    Pause
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    Play
                  </>
                )}
              </Button>
              
              <Input
                type="range"
                min="0"
                max={timeSeriesData.length - 1}
                step="1"
                value={currentTimeIndex}
                onChange={(e) => setTimeIndex(parseInt(e.target.value))}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Label className="text-xs">Speed:</Label>
              <Input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-8">{animationSpeed.toFixed(1)}x</span>
            </div>
            
            <div className="text-xs text-gray-600 mt-1">
              Time: {currentTimeIndex + 1} / {timeSeriesData.length}
            </div>
          </div>
        )}

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
  analysisResults,
  timeSeriesData // Add time series data prop
}) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showStress, setShowStress] = useState(false);
  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'both'>('solid');
  const [showGrid, setShowGrid] = useState(true);
  const [nodeScale, setNodeScale] = useState(1);
  const [cameraKey, setCameraKey] = useState(0);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [currentTimeIndex, setTimeIndex] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Animation loop
  useEffect(() => {
    if (isAnimating && timeSeriesData && timeSeriesData.length > 0) {
      const animate = () => {
        setTimeIndex(prev => {
          if (prev >= timeSeriesData.length - 1) {
            return 0; // Loop back to start
          }
          return prev + 1;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, timeSeriesData]);

  const handleReset = useCallback(() => {
    setCameraKey(prev => prev + 1);
    setViewMode('solid');
    setShowLabels(false);
    setShowStress(false);
    setShowGrid(true);
    setNodeScale(1);
    // Reset animation
    setIsAnimating(false);
    setTimeIndex(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
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
            // Animation props
            isAnimating={isAnimating}
            currentTimeIndex={currentTimeIndex}
            timeSeriesData={timeSeriesData}
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
          // Animation controls
          isAnimating={isAnimating}
          setIsAnimating={setIsAnimating}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          currentTimeIndex={currentTimeIndex}
          setTimeIndex={setTimeIndex}
          timeSeriesData={timeSeriesData}
        />
      </div>
    </VisualizationErrorBoundary>
  );
};

export default Enhanced3DViewer;