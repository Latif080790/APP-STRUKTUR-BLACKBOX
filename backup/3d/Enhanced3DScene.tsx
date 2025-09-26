/**
 * Enhanced 3D Scene with Stress Visualization
 * Advanced Three.js scene with color-coded stress visualization, animations, and interactive features
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Text, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Structure3D, Node, Element } from '../../../types/structural';
import { ViewPreset, ColorMode, RenderMode } from './Enhanced3DControls';
import { AnalysisResult } from '../../../utils/structuralAnalysis';

// Extend Three.js with additional geometries if needed
extend({ LineBasicMaterial: THREE.LineBasicMaterial });

export interface Enhanced3DSceneProps {
  structure: Structure3D;
  analysisResults?: AnalysisResult | null;
  
  // View Controls
  viewPreset: ViewPreset;
  
  // Display Options
  showLabels: boolean;
  showNodes: boolean;
  showElements: boolean;
  showLoads: boolean;
  showSupports: boolean;
  
  // Rendering Options
  colorMode: ColorMode;
  renderMode: RenderMode;
  
  // Animation
  isAnimating: boolean;
  animationSpeed: number;
  animationScale: number;
  
  // Interaction
  selectedElementId?: string | null;
  onElementClick?: (element: Element) => void;
  onNodeClick?: (node: Node) => void;
}

// Color palettes for different visualization modes
const STRESS_COLORS = {
  low: new THREE.Color(0x0066cc),      // Blue
  medium: new THREE.Color(0x00cc66),   // Green
  high: new THREE.Color(0xcccc00),     // Yellow
  critical: new THREE.Color(0xff0000)  // Red
};

const MEMBER_TYPE_COLORS = {
  beam: new THREE.Color(0x8B4513),      // Brown
  column: new THREE.Color(0x4682B4),    // Steel Blue
  slab: new THREE.Color(0x808080),      // Gray
  wall: new THREE.Color(0xD2B48C),      // Tan
  foundation: new THREE.Color(0x654321)  // Dark Brown
};

const MATERIAL_COLORS = {
  concrete: new THREE.Color(0xC0C0C0),  // Silver
  steel: new THREE.Color(0x4682B4),     // Steel Blue
  composite: new THREE.Color(0x8A2BE2), // Blue Violet
  timber: new THREE.Color(0xDEB887)     // Burlywood
};

// Stress visualization component for elements
const StressVisualizedElement: React.FC<{
  element: Element;
  nodes: Node[];
  stress?: number;
  maxStress: number;
  colorMode: ColorMode;
  renderMode: RenderMode;
  isSelected: boolean;
  onClick: (element: Element) => void;
  animationTime?: number;
  animationScale?: number;
}> = ({
  element,
  nodes,
  stress = 0,
  maxStress,
  colorMode,
  renderMode,
  isSelected,
  onClick,
  animationTime = 0,
  animationScale = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);

  // Get start and end nodes
  const startNode = nodes.find(n => n.id === element.startNodeId);
  const endNode = nodes.find(n => n.id === element.endNodeId);

  if (!startNode || !endNode) return null;

  // Calculate element properties
  const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Calculate color based on color mode
  const getElementColor = useCallback(() => {
    switch (colorMode) {
      case 'stress':
        if (maxStress === 0) return STRESS_COLORS.low;
        const stressRatio = Math.abs(stress) / maxStress;
        if (stressRatio < 0.25) return STRESS_COLORS.low;
        if (stressRatio < 0.5) return STRESS_COLORS.medium;
        if (stressRatio < 0.75) return STRESS_COLORS.high;
        return STRESS_COLORS.critical;
      
      case 'member-type':
        return MEMBER_TYPE_COLORS[element.type] || MEMBER_TYPE_COLORS.beam;
      
      case 'material':
        return MATERIAL_COLORS.concrete; // Default to concrete
      
      case 'displacement':
        // Similar to stress but for displacement
        return STRESS_COLORS.low;
        
      default:
        return MEMBER_TYPE_COLORS[element.type] || MEMBER_TYPE_COLORS.beam;
    }
  }, [colorMode, stress, maxStress, element.type]);

  const color = getElementColor();

  // Animation deformation
  const animatedCenter = useMemo(() => {
    if (!animationTime || animationScale === 1) return center;
    
    // Simple sinusoidal deformation for demonstration
    const deformation = Math.sin(animationTime) * animationScale * 0.01;
    return center.clone().add(new THREE.Vector3(0, deformation, 0));
  }, [center, animationTime, animationScale]);

  // Element geometry based on type
  const geometry = useMemo(() => {
    switch (element.type) {
      case 'column':
        return new THREE.CylinderGeometry(0.15, 0.15, length, 8);
      case 'beam':
        return new THREE.BoxGeometry(0.2, 0.3, length);
      case 'slab':
        return new THREE.BoxGeometry(length, 0.1, 1.0);
      default:
        return new THREE.CylinderGeometry(0.1, 0.1, length, 6);
    }
  }, [element.type, length]);

  // Material based on render mode
  const material = useMemo(() => {
    const baseProps = {
      color: isSelected ? new THREE.Color(0xff6b6b) : color,
      transparent: renderMode === 'transparent',
      opacity: renderMode === 'transparent' ? 0.7 : 1.0
    };

    switch (renderMode) {
      case 'wireframe':
        return new THREE.MeshBasicMaterial({ ...baseProps, wireframe: true });
      case 'both':
      case 'transparent':
      case 'solid':
      default:
        return new THREE.MeshStandardMaterial({
          ...baseProps,
          metalness: 0.2,
          roughness: 0.8
        });
    }
  }, [color, isSelected, renderMode]);

  // Calculate rotation to align with element direction
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const axis = new THREE.Vector3().crossVectors(up, direction.normalize());
    const angle = Math.acos(up.dot(direction.normalize()));
    return new THREE.Quaternion().setFromAxisAngle(axis.normalize(), angle);
  }, [direction]);

  // Click handler
  const handleClick = useCallback((e: any) => {
    e?.stopPropagation?.();
    onClick(element);
  }, [element, onClick]);

  return (
    <group>
      {/* Main element mesh */}
      {(renderMode === 'solid' || renderMode === 'both' || renderMode === 'transparent') && (
        <mesh
          ref={meshRef}
          position={animatedCenter}
          quaternion={quaternion}
          geometry={geometry}
          material={material}
          onClick={handleClick}
          castShadow
          receiveShadow
        />
      )}

      {/* Wireframe overlay */}
      {renderMode === 'both' && (
        <mesh
          position={animatedCenter}
          quaternion={quaternion}
          geometry={geometry}
          onClick={handleClick}
        >
          <meshBasicMaterial color={0x000000} wireframe />
        </mesh>
      )}

      {/* Pure wireframe mode */}
      {renderMode === 'wireframe' && (
        <Line
          ref={lineRef}
          points={[start, end]}
          color={isSelected ? 0xff6b6b : color}
          lineWidth={3}
          onClick={handleClick}
        />
      )}
    </group>
  );
};

// Enhanced node component with support visualization
const EnhancedNode: React.FC<{
  node: Node;
  isSelected: boolean;
  showLabel: boolean;
  showSupports: boolean;
  onClick: (node: Node) => void;
}> = ({ node, isSelected, showLabel, showSupports, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const handleClick = useCallback((e: any) => {
    e?.stopPropagation?.();
    onClick(node);
  }, [node, onClick]);

  // Determine if node is a support
  const isSupport = node.constraints && (
    node.constraints.dx || node.constraints.dy || node.constraints.dz ||
    node.constraints.rx || node.constraints.ry || node.constraints.rz
  );

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Node sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[isSupport ? 0.25 : 0.15, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? 0xff6b6b : (isSupport ? 0x4caf50 : 0xffc107)}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Support visualization */}
      {showSupports && isSupport && (
        <group>
          {/* Fixed support visualization */}
          {node.constraints?.dx && node.constraints?.dy && node.constraints?.dz && (
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.6, 0.1, 0.6]} />
              <meshStandardMaterial color={0x8bc34a} />
            </mesh>
          )}
          
          {/* Pin support visualization */}
          {node.constraints?.dx && node.constraints?.dy && !node.constraints?.dz && (
            <mesh position={[0, -0.25, 0]}>
              <coneGeometry args={[0.2, 0.4, 6]} />
              <meshStandardMaterial color={0x8bc34a} />
            </mesh>
          )}

          {/* Roller support visualization */}
          {((node.constraints?.dx && !node.constraints?.dy) || 
            (!node.constraints?.dx && node.constraints?.dy)) && (
            <group position={[0, -0.3, 0]}>
              <mesh position={[-0.2, 0, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={0x8bc34a} />
              </mesh>
              <mesh position={[0.2, 0, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={0x8bc34a} />
              </mesh>
            </group>
          )}
        </group>
      )}

      {/* Node label */}
      {showLabel && (
        <Html distanceFactor={10} position={[0, 0.4, 0]}>
          <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs border shadow-sm">
            Node {node.id}
          </div>
        </Html>
      )}
    </group>
  );
};

// Main Enhanced 3D Scene component
export const Enhanced3DScene: React.FC<Enhanced3DSceneProps> = ({
  structure,
  analysisResults,
  viewPreset,
  showLabels,
  showNodes,
  showElements,
  showLoads,
  showSupports,
  colorMode,
  renderMode,
  isAnimating,
  animationSpeed,
  animationScale,
  selectedElementId,
  onElementClick = () => {},
  onNodeClick = () => {}
}) => {
  const { camera, scene } = useThree();
  const [animationTime, setAnimationTime] = useState(0);

  // Animation frame
  useFrame((_, delta) => {
    if (isAnimating) {
      setAnimationTime(prev => prev + delta * animationSpeed);
    }
  });

  // Camera positioning based on view preset
  useEffect(() => {
    const distance = 15;
    let position: [number, number, number];

    switch (viewPreset) {
      case 'front':
        position = [0, 0, distance];
        break;
      case 'back':
        position = [0, 0, -distance];
        break;
      case 'left':
        position = [-distance, 0, 0];
        break;
      case 'right':
        position = [distance, 0, 0];
        break;
      case 'top':
        position = [0, distance, 0];
        break;
      case 'bottom':
        position = [0, -distance, 0];
        break;
      case 'isometric':
      default:
        position = [distance * 0.7, distance * 0.7, distance * 0.7];
        break;
    }

    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
  }, [viewPreset, camera]);

  // Calculate max stress for color scaling
  const maxStress = useMemo(() => {
    if (!analysisResults?.success) return 0;
    // This would be calculated from actual analysis results
    return 100; // Mock value
  }, [analysisResults]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />

      {/* Nodes */}
      {showNodes && structure.nodes.map(node => (
        <EnhancedNode
          key={node.id}
          node={node}
          isSelected={false} // Could be extended for node selection
          showLabel={showLabels}
          showSupports={showSupports}
          onClick={onNodeClick}
        />
      ))}

      {/* Elements */}
      {showElements && structure.elements.map(element => (
        <StressVisualizedElement
          key={element.id}
          element={element}
          nodes={structure.nodes}
          stress={Math.random() * 100} // Mock stress value
          maxStress={maxStress}
          colorMode={colorMode}
          renderMode={renderMode}
          isSelected={selectedElementId === element.id.toString()}
          onClick={onElementClick}
          animationTime={isAnimating ? animationTime : 0}
          animationScale={animationScale}
        />
      ))}

      {/* Load visualization */}
      {showLoads && structure.loads?.map((load, index) => (
        <group key={index} position={[load.x || 0, load.y || 0, load.z || 0]}>
          {/* Load arrow */}
          <mesh>
            <coneGeometry args={[0.1, 0.5, 8]} />
            <meshStandardMaterial color={0xff5722} />
          </mesh>
          
          {showLabels && (
            <Html distanceFactor={15} position={[0, 0.8, 0]}>
              <div className="bg-orange-100 px-2 py-1 rounded text-xs border">
                {load.magnitude} kN
              </div>
            </Html>
          )}
        </group>
      ))}

      {/* Ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={0xf5f5f5} transparent opacity={0.3} />
      </mesh>
    </>
  );
};

export default Enhanced3DScene;