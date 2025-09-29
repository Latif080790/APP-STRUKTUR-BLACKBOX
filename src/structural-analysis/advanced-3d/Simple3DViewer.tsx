/**
 * Simple 3D Structure Viewer 
 * Basic 3D visualization for structural elements using Three.js
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Grid3x3, 
  Activity
} from 'lucide-react';
import { Structure3D, Element } from '@/types/structural';

// Simple UI components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-b p-4 ${className}`}>{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'default' | 'outline';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'default', className = '', disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${
      disabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : variant === 'outline' 
        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    } ${className}`}
  >
    {children}
  </button>
);

// Simple Error Boundary for Visualization
const VisualizationErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

interface Simple3DViewerProps {
  structure: Structure3D | null;
  onElementClick?: (element: Element) => void;
  onLoad?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// Simple Node Component
const SimpleNode = ({ node, onClick }: { node: any; onClick: (node: any) => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh 
      position={[node.x, node.y, node.z]}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(node);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={hovered ? '#f39c12' : '#f1c40f'} />
    </mesh>
  );
};

// Simple Element Component
const SimpleElement = ({ 
  element, 
  nodes, 
  isSelected, 
  onClick 
}: { 
  element: Element; 
  nodes: any[]; 
  isSelected: boolean; 
  onClick: (element: Element) => void; 
}) => {
  const [hovered, setHovered] = useState(false);
  
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);

  if (!startNode || !endNode) return null;

  const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  const length = start.distanceTo(end);
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  // Calculate rotation
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

  const getColor = () => {
    if (isSelected) return '#3b82f6';
    if (hovered) return '#10b981';
    return element.type === 'column' ? '#64748b' : '#94a3b8';
  };

  return (
    <mesh
      position={center}
      quaternion={quaternion}
      onClick={(e: any) => {
        e.stopPropagation();
        onClick(element);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <cylinderGeometry args={[0.15, 0.15, length, 8]} />
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
};

// Main 3D Scene
const Simple3DScene = ({ 
  structure, 
  onElementClick, 
  onLoad,
  showGrid 
}: { 
  structure: Structure3D; 
  onElementClick: (element: Element) => void; 
  onLoad?: () => void;
  showGrid: boolean;
}) => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement((prev: Element | null) => prev?.id === element.id ? null : element);
    onElementClick(element);
  }, [onElementClick]);

  // Calculate scene bounds
  const bounds = useMemo(() => {
    if (!structure.nodes?.length) return { center: [0, 0, 0] as [number, number, number], size: 10 };
    
    const points = structure.nodes.map((n: any) => new THREE.Vector3(n.x, n.y, n.z));
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
      {/* Basic lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Grid */}
      {showGrid && (
        <gridHelper 
          args={[bounds.size * 2, 20, '#e2e8f0', '#f1f5f9']} 
          position={bounds.center}
        />
      )}

      {/* Coordinate axes */}
      <axesHelper args={[bounds.size * 0.2]} position={bounds.center} />

      {/* Render nodes */}
      {structure.nodes?.map((node: any) => (
        <SimpleNode
          key={`node-${node.id}`}
          node={node}
          onClick={() => {}}
        />
      ))}

      {/* Render elements */}
      {structure.elements?.map((element: any) => (
        <SimpleElement
          key={`element-${element.id}`}
          element={element}
          nodes={structure.nodes}
          isSelected={selectedElement?.id === element.id}
          onClick={handleElementClick}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        target={bounds.center}
        minDistance={bounds.size * 0.5}
        maxDistance={bounds.size * 3}
      />
    </>
  );
};

// Simple Control Panel
const SimpleControlPanel = ({ 
  showGrid, 
  setShowGrid, 
  onReset 
}: { 
  showGrid: boolean; 
  setShowGrid: (value: boolean) => void; 
  onReset: () => void; 
}) => {
  return (
    <Card className="absolute top-4 left-4 w-48 bg-white/90 backdrop-blur-sm z-10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          3D Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant={showGrid ? "default" : "outline"}
            onClick={() => setShowGrid(!showGrid)}
            className="flex items-center gap-1 flex-1 text-sm"
          >
            <Grid3x3 className="h-3 w-3" />
            Grid
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-1 flex-1 text-sm"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Simple 3D Viewer Component
export const Simple3DViewer: React.FC<Simple3DViewerProps> = ({
  structure,
  onElementClick = () => {},
  onLoad,
  className = '',
  style
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [cameraKey, setCameraKey] = useState(0);

  const handleReset = useCallback(() => {
    setCameraKey(prev => prev + 1);
  }, []);

  if (!structure || !structure.nodes?.length || !structure.elements?.length) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Structure Data</h3>
          <p className="text-gray-600">Complete the form inputs to generate 3D visualization</p>
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
            position: [15, 15, 15], 
            fov: 50
          }}
          className="bg-gradient-to-b from-sky-100 to-sky-50"
        >
          <Simple3DScene
            structure={structure}
            onElementClick={onElementClick}
            onLoad={onLoad}
            showGrid={showGrid}
          />
        </Canvas>

        <SimpleControlPanel
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          onReset={handleReset}
        />
      </div>
    </VisualizationErrorBoundary>
  );
};

export default Simple3DViewer;