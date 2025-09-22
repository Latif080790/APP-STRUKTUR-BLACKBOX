import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
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

// Komponen untuk node
const NodeComp = memo(({
  node,
  isSelected,
  showLabel,
  onClick,
}: {
  node: Node;
  isSelected: boolean;
  showLabel: boolean;
  onClick: (node: Node) => void;
}) => {
  // Menggunakan Three.js event type untuk event handler
  const handleClick = useCallback((e: any) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    onClick(node);
  }, [node, onClick]);

  return (
    <mesh 
      position={[node.x, node.y, node.z]}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial 
        color={isSelected ? '#e74c3c' : '#f1c40f'}
        metalness={0.1}
        roughness={0.5}
      />
      {showLabel && node.label && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
      )}
    </mesh>
  );
});

// Komponen untuk elemen struktur
interface ElementCompProps {
  element: Element;
  nodes: Node[];
  isSelected: boolean;
  viewMode: 'solid' | 'wireframe' | 'both';
  onClick: (element: Element) => void;
  onHover?: (hovered: boolean) => void;
  showStress?: boolean;
}

const ElementComp = memo(({
  element,
  nodes,
  isSelected,
  viewMode,
  onClick,
  onHover,
  showStress = false,
}: ElementCompProps) => {
  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);
  const [hovered, setHovered] = useState(false);

  if (!startNode || !endNode) {
    console.warn(`Element ${element.id} has invalid nodes:`, element.nodes);
    return null;
  }

  const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  const length = start.distanceTo(end);
  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Gunakan material default jika tidak ada material yang didefinisikan
  const defaultMaterial = useMemo(() => ({
    color: isSelected ? '#3b82f6' : (element.type === 'column' ? '#64748b' : '#94a3b8'),
    opacity: 1,
    transparent: true,
    wireframe: viewMode === 'wireframe' || viewMode === 'both',
  }), [isSelected, viewMode, element.type]);

  // Gabungkan dengan material dari elemen jika ada
  const materialProps = useMemo(() => {
    const merged = { ...defaultMaterial };
    
    if (element.material) {
      if (element.material.color !== undefined) {
        merged.color = element.material.color;
      }
      if (element.material.opacity !== undefined) {
        merged.opacity = element.material.opacity;
      }
    }
    
    return merged;
  }, [defaultMaterial, element.material]);
  
  // Handle stress visualization
  const stressColor = useMemo(() => {
    if (!showStress || element.stress === undefined) return null;
    
    // Convert stress to color (red for tension, blue for compression)
    const intensity = Math.min(Math.abs(element.stress) * 10, 1);
    return element.stress > 0 
      ? `rgb(${Math.floor(255 * intensity)}, 0, 0)` // Red for tension
      : `rgb(0, 0, ${Math.floor(255 * intensity)})`; // Blue for compression
  }, [element.stress, showStress]);
  
  const handleHover = useCallback((hovered: boolean) => {
    setHovered(hovered);
    onHover?.(hovered);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick(element);
  }, [element, onClick]);

  return (
    <group>
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
          args={[
            element.section.width / 2,
            element.section.width / 2,
            length,
            8,
            1,
            false
          ]}
        />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Tooltip saat hover */}
      {(hovered || isSelected) && (
        <Html position={center} center>
          <div className="bg-white text-black text-xs p-1 rounded shadow-lg pointer-events-none">
            <div>ID: {element.id}</div>
            {element.type && <div>Tipe: {element.type}</div>}
            {element.stress !== undefined && (
              <div>Tegangan: {(element.stress * 100).toFixed(1)}%</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
});

// Scene utama
const StructureScene = memo(({
  structure,
  onLoad,
  onElementClick,
  showLabels = false,
  showStress = false,
  viewMode = 'solid'
}: StructureViewerProps) => {
  const { camera } = useThree();
  
  // Inisialisasi kamera
  useEffect(() => {
    if (!structure) return;
    
    // Hitung bounding box dari struktur
    const box = new THREE.Box3().setFromPoints(
      structure.nodes.map(node => new THREE.Vector3(node.x, node.y, node.z))
    );
    
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Atur posisi kamera
    camera.position.set(
      center.x,
      center.y,
      center.z + Math.max(size.x, size.y, size.z) * 2
    );
    camera.lookAt(center);
    camera.updateProjectionMatrix();
    
    // Panggil callback onLoad jika ada
    if (onLoad) onLoad();
  }, [structure, camera, onLoad]);
  
  if (!structure || !structure.nodes || !structure.elements) {
    return (
      <Html center>
        <div className="text-center p-4 bg-white bg-opacity-75 rounded">
          <p>Struktur tidak valid atau tidak tersedia</p>
        </div>
      </Html>
    );
  }
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scene = useThree(state => state.scene);

  // Debug: Log struktur data yang diterima
  useEffect(() => {
    if (!structure) {
      console.warn('Structure is null or undefined');
      return;
    }
    
    console.log('Structure data received:', {
      nodes: structure.nodes?.length,
      elements: structure.elements?.length
    });
    
    console.log('Structure data received:', {
      nodes: structure?.nodes?.length,
      elements: structure?.elements?.length,
      firstNode: structure?.nodes?.[0],
      firstElement: structure?.elements?.[0]
    });
  }, [structure]);

  // Inisialisasi kamera dan scene
  useEffect(() => {
    try {
      if (!structure) {
        throw new Error('Struktur tidak tersedia');
      }
      
      if (!structure.nodes?.length || !structure.elements?.length) {
        throw new Error('Struktur tidak valid: nodes atau elements kosong');
      }

      // Reset error jika ada
      setError(null);
      
      // Atur kamera
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

      // Panggil callback onLoad setelah semua selesai
      if (onLoad) onLoad();
    } catch (err) {
      console.error('Error in StructureScene:', err);
      setError(`Gagal memuat model 3D: ${err.message}`);
    }
  }, [structure, camera, onLoad]);

  // Tampilkan pesan error jika ada
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

  // Tampilkan loading jika struktur belum siap
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
    setHoveredElement(element.id);
    onElementClick(element);
  }, [onElementClick]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.5}
      />
      
      {/* Grid dan sumbu */}
      <gridHelper args={[100, 100, '#ccc', '#eee']} rotation={[Math.PI / 2, 0, 0]} />
      <axesHelper args={[10]} />
      
      {/* Render nodes */}
      {structure.nodes.map((node) => (
        <NodeComp
          key={`node-${node.id}`}
          node={node}
          isSelected={false}
          showLabel={showLabels}
          onClick={() => {}}
        />
      ))}
      
      {/* Render elements */}
      {structure.elements.map((element) => {
        // Dapatkan node yang direferensikan oleh elemen ini
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
            isSelected={hoveredElement === element.id}
            viewMode={viewMode}
            onClick={handleElementClick}
            onHover={(hovered) => {
              setHoveredElement(hovered ? element.id : null);
            }}
            showStress={showStress}
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
      />
    </>
  );
});

// Komponen utama StructureViewer
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
  // Gunakan useMemo untuk mencegah re-render yang tidak perlu
  const sceneProps = useMemo(() => ({
    structure,
    showLabels,
    showStress,
    viewMode,
    onElementClick,
    onLoad,
  }), [structure, showLabels, showStress, viewMode, onElementClick, onLoad]);
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
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [localShowLabels, setLocalShowLabels] = useState(showLabels);
  const [localViewMode, setLocalViewMode] = useState(viewMode);

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

  // Tampilkan pesan jika struktur tidak ada
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
      <div className={`structure-viewer ${className}`} style={style}>
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <StructureScene {...sceneProps} />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
});

StructureViewer.displayName = 'StructureViewer';

export default StructureViewer;

// Ekspor tipe-tipe yang diperlukan dengan nama yang berbeda
export type Node3D = Node;
export type Element3D = Element;
export type Structure3DType = Structure3D;
