import React, { useCallback } from 'react';/**/**/**

import { Canvas } from '@react-three/fiber';

import { OrbitControls } from '@react-three/drei'; * Enhanced 3D Structure Viewer

import { Card, CardContent } from '@/components/ui/card';

import { Maximize2 } from 'lucide-react'; * Professional-grade 3D visualization for structural analysis * Enhanced 3D Structure Viewer with Advanced Features * Enhanced 3D Structure Viewer with Advanced Controls



interface Enhanced3DNode { */

  id: string;

  position: [number, number, number]; * Professional-grade 3D visualization for structural analysis * Menampilkan model 3D struktur dengan kontrol interaktif dan visualisasi yang lengkap

  support: {

    x: boolean;import React, { useCallback, useMemo } from 'react';

    y: boolean;

    z: boolean;import { Canvas } from '@react-three/fiber'; */ */

    rx: boolean;

    ry: boolean;import { OrbitControls } from '@react-three/drei';

    rz: boolean;

  };import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  isSelected?: boolean;

}import { Maximize2 } from 'lucide-react';



interface Enhanced3DElement {import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';import React, { useState, useCallback, useMemo, memo } from 'react';

  id: string;

  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';// Types for 3D visualization

  startNode: string;

  endNode: string;interface Enhanced3DNode {import { Canvas, useThree, useFrame } from '@react-three/fiber';import { Canvas } from '@react-three/fiber';

  section: {

    width: number;  id: string;

    height: number;

    thickness?: number;  position: [number, number, number];import { import { OrbitControls, Text, Html, Environment, ContactShadows } from '@react-three/drei';

  };

  material: 'concrete' | 'steel' | 'composite';  displacement?: [number, number, number];

  utilization?: number;

  isSelected?: boolean;  forces?: [number, number, number];  OrbitControls, import * as THREE from 'three';

}

  moments?: [number, number, number];

interface Enhanced3DStructure {

  nodes: Enhanced3DNode[];  support: {  Text, import { Button } from '../../ui/button';

  elements: Enhanced3DElement[];

  loads: any[];    x: boolean;

  boundingBox: {

    min: [number, number, number];    y: boolean;  Html, import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

    max: [number, number, number];

  };    z: boolean;

  scale: number;

}    rx: boolean;  Environment,import { Label } from '../../ui/label';



interface Enhanced3DViewerProps {    ry: boolean;

  structure: Enhanced3DStructure | null;

  analysisResults?: any;    rz: boolean;  Grid,import { Input } from '../../ui/input';

  showDeformation?: boolean;

  deformationScale?: number;  };

  showStress?: boolean;

  showForces?: boolean;  isSelected?: boolean;  ContactShadows,import { SimpleSelect } from '../../ui/simple-select';

  showLabels?: boolean;

  viewMode?: 'solid' | 'wireframe' | 'both';}

  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';

  onElementSelect?: (elementId: string) => void;  PerspectiveCamera,import { 

  onNodeSelect?: (nodeId: string) => void;

  className?: string;interface Enhanced3DElement {

}

  id: string;  Box,  Eye, 

const Simple3DNode: React.FC<{

  node: Enhanced3DNode;  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';

  scale: number;

  onClick: (nodeId: string) => void;  startNode: string;  Sphere,  EyeOff, 

}> = ({ node, scale, onClick }) => {

  const handleClick = useCallback((e: any) => {  endNode: string;

    e.stopPropagation();

    onClick(node.id);  section: {  Line  RotateCcw, 

  }, [node.id, onClick]);

    width: number;

  return (

    <mesh position={node.position} onClick={handleClick}>    height: number;} from '@react-three/drei';  ZoomIn, 

      <sphereGeometry args={[0.1 * scale, 16, 16]} />

      <meshStandardMaterial     thickness?: number;

        color={node.isSelected ? '#e74c3c' : '#3498db'}

      />  };import * as THREE from 'three';  ZoomOut, 

    </mesh>

  );  material: 'concrete' | 'steel' | 'composite';

};

  utilization?: number;import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';  Grid3x3, 

const Simple3DElement: React.FC<{

  element: Enhanced3DElement;  isSelected?: boolean;

  nodes: Enhanced3DNode[];

  scale: number;}import { Button } from '@/components/ui/button';  Tags,

  onClick: (elementId: string) => void;

}> = ({ element, nodes, scale, onClick }) => {

  const startNode = nodes.find(n => n.id === element.startNode);

  const endNode = nodes.find(n => n.id === element.endNode);interface Enhanced3DStructure {import { Badge } from '@/components/ui/badge';  Palette,



  if (!startNode || !endNode) return null;  nodes: Enhanced3DNode[];



  const startPos = startNode.position;  elements: Enhanced3DElement[];import { Slider } from '@/components/ui/slider';  Layers,

  const endPos = endNode.position;

    loads: {

  const length = Math.sqrt(

    Math.pow(endPos[0] - startPos[0], 2) +    nodeId: string;import {   Activity

    Math.pow(endPos[1] - startPos[1], 2) +

    Math.pow(endPos[2] - startPos[2], 2)    forces: [number, number, number];

  );

      moments: [number, number, number];  RotateCcw, } from 'lucide-react';

  const center: [number, number, number] = [

    (startPos[0] + endPos[0]) / 2,  }[];

    (startPos[1] + endPos[1]) / 2,

    (startPos[2] + endPos[2]) / 2  boundingBox: {  ZoomIn, import { Structure3D, Element } from '../../../types/structural';

  ];

    min: [number, number, number];

  const handleClick = useCallback((e: any) => {

    e.stopPropagation();    max: [number, number, number];  ZoomOut, import { VisualizationErrorBoundary } from '../../common/ErrorBoundary';

    onClick(element.id);

  }, [element.id, onClick]);  };



  const getElementColor = () => {  scale: number;  Eye, 

    switch (element.material) {

      case 'concrete': return '#95a5a6';}

      case 'steel': return '#34495e';

      case 'composite': return '#9b59b6';  EyeOff,interface Enhanced3DViewerProps {

      default: return '#3498db';

    }interface Enhanced3DViewerProps {

  };

  structure: Enhanced3DStructure | null;  Grid3X3,  structure: Structure3D | null;

  return (

    <mesh position={center} onClick={handleClick}>  analysisResults?: any;

      <boxGeometry args={[

        element.section.width * scale,  showDeformation?: boolean;  Lightbulb,  onElementClick?: (element: Element) => void;

        length,

        element.section.height * scale  deformationScale?: number;

      ]} />

      <meshStandardMaterial   showStress?: boolean;  Camera,  onLoad?: () => void;

        color={getElementColor()}

        transparent={element.isSelected}  showForces?: boolean;

        opacity={element.isSelected ? 0.7 : 1.0}

      />  showLabels?: boolean;  BarChart3,  className?: string;

    </mesh>

  );  viewMode?: 'solid' | 'wireframe' | 'both';

};

  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';  Activity,  style?: React.CSSProperties;

const Simple3DScene: React.FC<{

  structure: Enhanced3DStructure;  onElementSelect?: (elementId: string) => void;

  onElementSelect: (elementId: string) => void;

  onNodeSelect: (nodeId: string) => void;  onNodeSelect?: (nodeId: string) => void;  Maximize2,  analysisResults?: any;

}> = ({ structure, onElementSelect, onNodeSelect }) => {

  return (  className?: string;

    <group>

      <ambientLight intensity={0.6} />}  Download}

      <directionalLight position={[10, 10, 5]} intensity={1} />

      <pointLight position={[-10, -10, -5]} intensity={0.5} />



      {structure.nodes.map(node => (// Simple Node Component} from 'lucide-react';

        <Simple3DNode

          key={node.id}const Simple3DNode: React.FC<{

          node={node}

          scale={structure.scale}  node: Enhanced3DNode;// Enhanced Node Component dengan interactive features

          onClick={onNodeSelect}

        />  scale: number;

      ))}

  onClick: (nodeId: string) => void;// Types for enhanced 3D visualizationconst EnhancedNodeComp = memo(({

      {structure.elements.map(element => (

        <Simple3DElement}> = ({ node, scale, onClick }) => {

          key={element.id}

          element={element}  const handleClick = useCallback((e: any) => {interface Enhanced3DNode {  node,

          nodes={structure.nodes}

          scale={structure.scale}    e.stopPropagation();

          onClick={onElementSelect}

        />    onClick(node.id);  id: string;  isSelected,

      ))}

    </group>  }, [node.id, onClick]);

  );

};  position: [number, number, number];  showLabel,



const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({  return (

  structure,

  analysisResults,    <mesh position={node.position} onClick={handleClick}>  displacement?: [number, number, number];  scale = 1,

  showDeformation = false,

  deformationScale = 1,      <sphereGeometry args={[0.1 * scale, 16, 16]} />

  showStress = false,

  showForces = false,      <meshStandardMaterial   rotation?: [number, number, number];  color,

  showLabels = true,

  viewMode = 'solid',        color={node.isSelected ? '#e74c3c' : '#3498db'}

  colorMode = 'material',

  onElementSelect,      />  forces?: [number, number, number];  onClick,

  onNodeSelect,

  className = ''    </mesh>

}) => {

  const handleElementSelect = useCallback((elementId: string) => {  );  moments?: [number, number, number];}: {

    if (onElementSelect) {

      onElementSelect(elementId);};

    }

  }, [onElementSelect]);  support: {  node: any;



  const handleNodeSelect = useCallback((nodeId: string) => {// Simple Element Component

    if (onNodeSelect) {

      onNodeSelect(nodeId);const Simple3DElement: React.FC<{    x: boolean;  isSelected: boolean;

    }

  }, [onNodeSelect]);  element: Enhanced3DElement;



  if (!structure) {  nodes: Enhanced3DNode[];    y: boolean;  showLabel: boolean;

    return (

      <Card className={`h-full ${className}`}>  scale: number;

        <CardContent className="flex items-center justify-center h-full">

          <div className="text-center">  onClick: (elementId: string) => void;    z: boolean;  scale?: number;

            <div className="text-gray-500 mb-2">

              <Maximize2 className="w-16 h-16 mx-auto" />}> = ({ element, nodes, scale, onClick }) => {

            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Structure Data</h3>  // Find start and end nodes    rx: boolean;  color?: string;

            <p className="text-gray-500">Load a structural model to view in 3D</p>

          </div>  const startNode = nodes.find(n => n.id === element.startNode);

        </CardContent>

      </Card>  const endNode = nodes.find(n => n.id === element.endNode);    ry: boolean;  onClick: (node: any) => void;

    );

  }



  return (  if (!startNode || !endNode) return null;    rz: boolean;}) => {

    <div className={`relative w-full h-full ${className}`}>

      <Canvas

        camera={{ position: [15, 15, 15], fov: 60 }}

        className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50"  // Calculate element geometry  };  const [hovered, setHovered] = useState(false);

      >

        <Simple3DScene  const startPos = startNode.position;

          structure={structure}

          onElementSelect={handleElementSelect}  const endPos = endNode.position;  isSelected?: boolean;

          onNodeSelect={handleNodeSelect}

        />  

        <OrbitControls 

          enableDamping  const length = Math.sqrt(}  const nodeColor = useMemo(() => {

          dampingFactor={0.1}

        />    Math.pow(endPos[0] - startPos[0], 2) +

      </Canvas>

    Math.pow(endPos[1] - startPos[1], 2) +    if (color) return color;

      <div className="absolute top-4 right-4">

        <Card className="p-3 bg-white/90 backdrop-blur-sm">    Math.pow(endPos[2] - startPos[2], 2)

          <div className="space-y-1">

            <h4 className="font-semibold text-sm">Structure Info</h4>  );interface Enhanced3DElement {    if (isSelected) return '#e74c3c';

            <div className="text-xs space-y-0.5">

              <div>Nodes: <span className="font-medium">{structure.nodes.length}</span></div>  

              <div>Elements: <span className="font-medium">{structure.elements.length}</span></div>

              {analysisResults && (  const center: [number, number, number] = [  id: string;    if (hovered) return '#f39c12';

                <div>Status: <span className="font-medium text-green-600">Analyzed</span></div>

              )}    (startPos[0] + endPos[0]) / 2,

            </div>

          </div>    (startPos[1] + endPos[1]) / 2,  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';    return '#f1c40f';

        </Card>

      </div>    (startPos[2] + endPos[2]) / 2

    </div>

  );  ];  startNode: string;  }, [color, isSelected, hovered]);

};



export default Enhanced3DViewer;
  const handleClick = useCallback((e: any) => {  endNode: string;

    e.stopPropagation();

    onClick(element.id);  section: {  return (

  }, [element.id, onClick]);

    width: number;    <mesh 

  // Color based on material

  const getElementColor = () => {    height: number;      position={[node.x, node.y, node.z]}

    switch (element.material) {

      case 'concrete': return '#95a5a6';    thickness?: number;      onClick={(e) => {

      case 'steel': return '#34495e';

      case 'composite': return '#9b59b6';  };        e.stopPropagation();

      default: return '#3498db';

    }  material: 'concrete' | 'steel' | 'composite';        onClick(node);

  };

  forces?: {      }}

  return (

    <mesh position={center} onClick={handleClick}>    axial: number[];      onPointerOver={(e) => {

      <boxGeometry args={[

        element.section.width * scale,    shear: number[];        e.stopPropagation();

        length,

        element.section.height * scale    moment: number[];        setHovered(true);

      ]} />

      <meshStandardMaterial     positions: number[];      }}

        color={getElementColor()}

        transparent={element.isSelected}  };      onPointerOut={(e) => {

        opacity={element.isSelected ? 0.7 : 1.0}

      />  stresses?: {        e.stopPropagation();

    </mesh>

  );    max: number;        setHovered(false);

};

    min: number;      }}

// Scene Component

const Simple3DScene: React.FC<{    vonMises: number[];      castShadow

  structure: Enhanced3DStructure;

  onElementSelect: (elementId: string) => void;  };      receiveShadow

  onNodeSelect: (nodeId: string) => void;

}> = ({ structure, onElementSelect, onNodeSelect }) => {  utilization?: number;    >

  return (

    <group>  isSelected?: boolean;      <sphereGeometry args={[0.15 * scale, 16, 16]} />

      {/* Lighting */}

      <ambientLight intensity={0.6} />}      <meshStandardMaterial 

      <directionalLight position={[10, 10, 5]} intensity={1} />

      <pointLight position={[-10, -10, -5]} intensity={0.5} />        color={nodeColor}



      {/* Render nodes */}interface Enhanced3DStructure {        metalness={0.2}

      {structure.nodes.map(node => (

        <Simple3DNode  nodes: Enhanced3DNode[];        roughness={0.4}

          key={node.id}

          node={node}  elements: Enhanced3DElement[];        emissive={hovered ? nodeColor : '#000000'}

          scale={structure.scale}

          onClick={onNodeSelect}  loads: {        emissiveIntensity={hovered ? 0.1 : 0}

        />

      ))}    nodeId: string;      />



      {/* Render elements */}    forces: [number, number, number];      

      {structure.elements.map(element => (

        <Simple3DElement    moments: [number, number, number];      {(showLabel || hovered) && (

          key={element.id}

          element={element}  }[];        <Text

          nodes={structure.nodes}

          scale={structure.scale}  boundingBox: {          position={[0, 0.4 * scale, 0]}

          onClick={onElementSelect}

        />    min: [number, number, number];          fontSize={0.15 * scale}

      ))}

    </group>    max: [number, number, number];          color="#2c3e50"

  );

};  };          anchorX="center"



// Main Enhanced 3D Viewer Component  scale: number;          anchorY="middle"

const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({

  structure,}          fontWeight="bold"

  analysisResults,

  showDeformation = false,        >

  deformationScale = 1,

  showStress = false,interface Enhanced3DViewerProps {          {node.label || `N${node.id}`}

  showForces = false,

  showLabels = true,  structure: Enhanced3DStructure | null;        </Text>

  viewMode = 'solid',

  colorMode = 'material',  analysisResults?: any;      )}

  onElementSelect,

  onNodeSelect,  showDeformation?: boolean;

  className = ''

}) => {  deformationScale?: number;      {hovered && (

  // Handle element selection

  const handleElementSelect = useCallback((elementId: string) => {  showStress?: boolean;        <Html position={[0, 0.6 * scale, 0]} center>

    if (onElementSelect) {

      onElementSelect(elementId);  showForces?: boolean;          <div className="bg-white border border-gray-300 rounded shadow-lg p-2 text-xs pointer-events-none">

    }

  }, [onElementSelect]);  showLabels?: boolean;            <div><strong>Node {node.id}</strong></div>



  // Handle node selection  viewMode?: 'solid' | 'wireframe' | 'both';            <div>X: {node.x.toFixed(2)}m</div>

  const handleNodeSelect = useCallback((nodeId: string) => {

    if (onNodeSelect) {  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';            <div>Y: {node.y.toFixed(2)}m</div>

      onNodeSelect(nodeId);

    }  onElementSelect?: (elementId: string) => void;            <div>Z: {node.z.toFixed(2)}m</div>

  }, [onNodeSelect]);

  onNodeSelect?: (nodeId: string) => void;            {node.constraints && (

  if (!structure) {

    return (  className?: string;              <div className="mt-1 text-red-600">

      <Card className={`h-full ${className}`}>

        <CardContent className="flex items-center justify-center h-full">}                Restraints: {Object.entries(node.constraints)

          <div className="text-center">

            <div className="text-gray-500 mb-2">                  .filter(([, value]) => value)

              <Maximize2 className="w-16 h-16 mx-auto" />

            </div>// Enhanced Node Component with support visualization                  .map(([key]) => key.toUpperCase())

            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Structure Data</h3>

            <p className="text-gray-500">Load a structural model to view in 3D</p>const Enhanced3DNode: React.FC<{                  .join(', ')}

          </div>

        </CardContent>  node: Enhanced3DNode;              </div>

      </Card>

    );  scale: number;            )}

  }

  showDeformation: boolean;          </div>

  return (

    <div className={`relative w-full h-full ${className}`}>  deformationScale: number;        </Html>

      {/* 3D Canvas */}

      <Canvas  showLabels: boolean;      )}

        camera={{ position: [15, 15, 15], fov: 60 }}

        className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50"  onClick: (nodeId: string) => void;    </mesh>

      >

        <Simple3DScene}> = ({ node, scale, showDeformation, deformationScale, showLabels, onClick }) => {  );

          structure={structure}

          onElementSelect={handleElementSelect}  const nodeRef = useRef<THREE.Mesh>(null);});

          onNodeSelect={handleNodeSelect}

        />  

        <OrbitControls 

          enableDamping  // Calculate deformed position// Enhanced Element Component dengan stress visualization

          dampingFactor={0.1}

        />  const deformedPosition = useMemo(() => {const EnhancedElementComp = memo(({

      </Canvas>

    if (!showDeformation || !node.displacement) return node.position;  element,

      {/* Info Panel */}

      <div className="absolute top-4 right-4">    return [  nodes,

        <Card className="p-3 bg-white/90 backdrop-blur-sm">

          <div className="space-y-1">      node.position[0] + node.displacement[0] * deformationScale,  isSelected,

            <h4 className="font-semibold text-sm">Structure Info</h4>

            <div className="text-xs space-y-0.5">      node.position[1] + node.displacement[1] * deformationScale,  viewMode,

              <div>Nodes: <span className="font-medium">{structure.nodes.length}</span></div>

              <div>Elements: <span className="font-medium">{structure.elements.length}</span></div>      node.position[2] + node.displacement[2] * deformationScale  showStress,

              {analysisResults && (

                <div>Status: <span className="font-medium text-green-600">Analyzed</span></div>    ] as [number, number, number];  stressScale = 1,

              )}

            </div>  }, [node.position, node.displacement, showDeformation, deformationScale]);  onClick,

          </div>

        </Card>}: {

      </div>

    </div>  // Support visualization  element: Element;

  );

};  const supportGeometry = useMemo(() => {  nodes: any[];



export default Enhanced3DViewer;    const supports = [];  isSelected: boolean;

    const { support } = node;  viewMode: 'solid' | 'wireframe' | 'both';

      showStress: boolean;

    if (support.x || support.y || support.z) {  stressScale?: number;

      // Fixed support  onClick: (element: Element) => void;

      if (support.x && support.y && support.z) {}) => {

        supports.push({ type: 'fixed', size: 0.3 });  const [hovered, setHovered] = useState(false);

      }  

      // Pinned support  const startNode = nodes.find(n => n.id === element.nodes[0]);

      else if ((support.x && support.y) || (support.y && support.z) || (support.x && support.z)) {  const endNode = nodes.find(n => n.id === element.nodes[1]);

        supports.push({ type: 'pinned', size: 0.25 });

      }  if (!startNode || !endNode) return null;

      // Roller support

      else {  const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);

        supports.push({ type: 'roller', size: 0.2 });  const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);

      }  const length = start.distanceTo(end);

    }  const direction = new THREE.Vector3().subVectors(end, start).normalize();

      const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

    return supports;

  }, [node.support]);  // Calculate rotation to align cylinder with element direction

  const up = new THREE.Vector3(0, 1, 0);

  const handleClick = useCallback((e: any) => {  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

    e.stopPropagation();

    onClick(node.id);  // Material properties based on element type and stress

  }, [node.id, onClick]);  const materialColor = useMemo(() => {

    if (isSelected) return '#3b82f6';

  return (    if (hovered) return '#10b981';

    <group position={deformedPosition}>    

      {/* Main node sphere */}    if (showStress && element.stress !== undefined) {

      <mesh ref={nodeRef} onClick={handleClick} castShadow receiveShadow>      const normalizedStress = Math.min(Math.abs(element.stress), 1);

        <sphereGeometry args={[0.1 * scale, 16, 16]} />      if (element.stress > 0) {

        <meshStandardMaterial         // Tension - red gradient

          color={node.isSelected ? '#e74c3c' : '#3498db'}        return `rgb(${Math.floor(255 * normalizedStress)}, ${Math.floor(100 * (1 - normalizedStress))}, 0)`;

          metalness={0.2}      } else {

          roughness={0.3}        // Compression - blue gradient

        />        return `rgb(0, ${Math.floor(100 * (1 - normalizedStress))}, ${Math.floor(255 * normalizedStress)})`;

      </mesh>      }

    }

      {/* Support visualization */}    

      {supportGeometry.map((support, index) => (    // Default colors by element type

        <group key={index}>    switch (element.type) {

          {support.type === 'fixed' && (      case 'column': return '#64748b';

            <mesh position={[0, -support.size, 0]}>      case 'beam': return '#94a3b8';

              <boxGeometry args={[support.size, support.size * 0.2, support.size]} />      case 'slab': return '#cbd5e1';

              <meshStandardMaterial color="#2c3e50" />      default: return '#9ca3af';

            </mesh>    }

          )}  }, [isSelected, hovered, showStress, element.stress, element.type]);

          {support.type === 'pinned' && (

            <mesh position={[0, -support.size * 0.7, 0]}>  // Element dimensions

              <coneGeometry args={[support.size * 0.7, support.size * 0.5, 8]} />  const width = element.section?.width || 0.3;

              <meshStandardMaterial color="#e67e22" />  const height = element.section?.height || 0.3;

            </mesh>

          )}  return (

          {support.type === 'roller' && (    <group>

            <>      {/* Main element geometry */}

              <mesh position={[0, -support.size * 0.5, 0]}>      <mesh

                <cylinderGeometry args={[support.size * 0.3, support.size * 0.3, support.size * 0.2, 16]} />        position={center}

                <meshStandardMaterial color="#f39c12" />        quaternion={quaternion}

              </mesh>        onClick={(e) => {

              <mesh position={[0, -support.size * 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>          e.stopPropagation();

                <boxGeometry args={[support.size * 1.5, support.size * 0.1, support.size * 0.1]} />          onClick(element);

                <meshStandardMaterial color="#2c3e50" />        }}

              </mesh>        onPointerOver={(e) => {

            </>          e.stopPropagation();

          )}          setHovered(true);

        </group>        }}

      ))}        onPointerOut={(e) => {

          e.stopPropagation();

      {/* Force vectors */}          setHovered(false);

      {node.forces && (        }}

        <group>        castShadow

          {node.forces[1] !== 0 && ( // Y-force (vertical)        receiveShadow

            <group>      >

              <mesh position={[0, node.forces[1] > 0 ? 0.5 : -0.5, 0]}>        {element.type === 'slab' ? (

                <coneGeometry args={[0.05, 0.2, 8]} />          <boxGeometry args={[width, 0.2, length]} />

                <meshStandardMaterial color="#e74c3c" />        ) : (

              </mesh>          <cylinderGeometry args={[width/2, height/2, length, 8]} />

              <mesh position={[0, node.forces[1] > 0 ? 0.3 : -0.3, 0]}>        )}

                <cylinderGeometry args={[0.02, 0.02, Math.abs(node.forces[1]) * 0.01, 8]} />        

                <meshStandardMaterial color="#e74c3c" />        <meshStandardMaterial

              </mesh>          color={materialColor}

            </group>          metalness={0.1}

          )}          roughness={0.7}

        </group>          wireframe={viewMode === 'wireframe'}

      )}          transparent={true}

          opacity={hovered ? 0.8 : 1.0}

      {/* Node label */}        />

      {showLabels && (      </mesh>

        <Html center>

          <div className="bg-white/90 px-1 py-0.5 rounded text-xs font-medium text-gray-800 border">      {/* Wireframe overlay for 'both' mode */}

            {node.id}      {viewMode === 'both' && (

          </div>        <mesh position={center} quaternion={quaternion}>

        </Html>          {element.type === 'slab' ? (

      )}            <boxGeometry args={[width, 0.2, length]} />

    </group>          ) : (

  );            <cylinderGeometry args={[width/2, height/2, length, 8]} />

};          )}

          <meshBasicMaterial color="#2c3e50" wireframe={true} />

// Enhanced Element Component with stress visualization        </mesh>

const Enhanced3DElement: React.FC<{      )}

  element: Enhanced3DElement;

  nodes: Enhanced3DNode[];      {/* Element label and info */}

  scale: number;      {hovered && (

  showDeformation: boolean;        <Html position={center} center>

  deformationScale: number;          <div className="bg-white border border-gray-300 rounded shadow-lg p-3 text-xs pointer-events-none max-w-xs">

  colorMode: string;            <div className="font-bold text-gray-800 mb-1">

  showLabels: boolean;              {element.type?.toUpperCase() || 'ELEMENT'} {element.id}

  onClick: (elementId: string) => void;            </div>

}> = ({ element, nodes, scale, showDeformation, deformationScale, colorMode, showLabels, onClick }) => {            <div className="grid grid-cols-2 gap-1 text-gray-600">

  const elementRef = useRef<THREE.Mesh>(null);              <div>Length: {length.toFixed(2)}m</div>

              <div>Section: {width.toFixed(2)}×{height.toFixed(2)}</div>

  // Find start and end nodes              <div>Material: {element.materialType || 'concrete'}</div>

  const startNode = nodes.find(n => n.id === element.startNode);              {element.stress !== undefined && (

  const endNode = nodes.find(n => n.id === element.endNode);                <div className={`font-medium ${element.stress > 0 ? 'text-red-600' : 'text-blue-600'}`}>

                  Stress: {(element.stress * 100).toFixed(1)}%

  if (!startNode || !endNode) return null;                </div>

              )}

  // Calculate deformed positions            </div>

  const startPos = showDeformation && startNode.displacement ? [          </div>

    startNode.position[0] + startNode.displacement[0] * deformationScale,        </Html>

    startNode.position[1] + startNode.displacement[1] * deformationScale,      )}

    startNode.position[2] + startNode.displacement[2] * deformationScale

  ] : startNode.position;      {/* Stress visualization arrows */}

      {showStress && element.stress !== undefined && Math.abs(element.stress) > 0.1 && (

  const endPos = showDeformation && endNode.displacement ? [        <mesh position={center}>

    endNode.position[0] + endNode.displacement[0] * deformationScale,          <cylinderGeometry args={[0.05, 0.1, 0.5]} />

    endNode.position[1] + endNode.displacement[1] * deformationScale,          <meshBasicMaterial color={element.stress > 0 ? '#ef4444' : '#3b82f6'} />

    endNode.position[2] + endNode.displacement[2] * deformationScale        </mesh>

  ] : endNode.position;      )}

    </group>

  // Calculate element geometry  );

  const direction = new THREE.Vector3(});

    endPos[0] - startPos[0],

    endPos[1] - startPos[1],// Main 3D Scene Component

    endPos[2] - startPos[2]const Enhanced3DScene = memo(({

  );  structure,

  const length = direction.length();  onElementClick,

  const center = [  onLoad,

    (startPos[0] + endPos[0]) / 2,  showLabels,

    (startPos[1] + endPos[1]) / 2,  showStress,

    (startPos[2] + endPos[2]) / 2  viewMode,

  ] as [number, number, number];  showGrid,

  nodeScale,

  // Calculate rotation  elementTransparency

  const up = new THREE.Vector3(0, 1, 0);}: {

  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.normalize());  structure: Structure3D;

  onElementClick: (element: Element) => void;

  // Color based on mode  onLoad?: () => void;

  const getElementColor = () => {  showLabels: boolean;

    switch (colorMode) {  showStress: boolean;

      case 'stress':  viewMode: 'solid' | 'wireframe' | 'both';

        if (element.stresses?.vonMises) {  showGrid: boolean;

          const maxStress = Math.max(...element.stresses.vonMises);  nodeScale: number;

          const intensity = Math.min(maxStress / 25, 1); // Normalize to 25 MPa  elementTransparency: number;

          return new THREE.Color().lerpColors(}) => {

            new THREE.Color('#2ecc71'), // Green for low stress  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

            new THREE.Color('#e74c3c'), // Red for high stress  const [selectedNode, setSelectedNode] = useState<any | null>(null);

            intensity

          );  const handleElementClick = useCallback((element: Element) => {

        }    setSelectedElement(prev => prev?.id === element.id ? null : element);

        break;    onElementClick(element);

      case 'utilization':  }, [onElementClick]);

        if (element.utilization) {

          const intensity = Math.min(element.utilization, 1);  const handleNodeClick = useCallback((node: any) => {

          return new THREE.Color().lerpColors(    setSelectedNode(prev => prev?.id === node.id ? null : node);

            new THREE.Color('#2ecc71'), // Green for low utilization  }, []);

            new THREE.Color('#e74c3c'), // Red for high utilization

            intensity  // Calculate bounding box and center

          );  const { center, size } = useMemo(() => {

        }    if (!structure.nodes?.length) return { center: [0, 0, 0], size: 10 };

        break;    

      case 'material':    const points = structure.nodes.map(n => new THREE.Vector3(n.x, n.y, n.z));

        switch (element.material) {    const box = new THREE.Box3().setFromPoints(points);

          case 'concrete': return new THREE.Color('#95a5a6');    const center = box.getCenter(new THREE.Vector3());

          case 'steel': return new THREE.Color('#34495e');    const size = box.getSize(new THREE.Vector3()).length();

          case 'composite': return new THREE.Color('#9b59b6');    

        }    return { 

        break;      center: [center.x, center.y, center.z] as [number, number, number], 

      default:      size: Math.max(size, 10) 

        return new THREE.Color('#3498db');    };

    }  }, [structure.nodes]);

    return new THREE.Color('#3498db');

  };  React.useEffect(() => {

    if (onLoad) onLoad();

  const elementColor = getElementColor();  }, [onLoad]);



  const handleClick = useCallback((e: any) => {  return (

    e.stopPropagation();    <>

    onClick(element.id);      {/* Lighting setup */}

  }, [element.id, onClick]);      <Environment preset="warehouse" />

      <ambientLight intensity={0.4} />

  return (      <directionalLight

    <group position={center} quaternion={quaternion}>        position={[size, size, size]}

      {/* Main element geometry */}        intensity={0.8}

      {element.type === 'beam' || element.type === 'column' ? (        castShadow

        <mesh ref={elementRef} onClick={handleClick} castShadow receiveShadow>        shadow-mapSize-width={2048}

          <boxGeometry args={[        shadow-mapSize-height={2048}

            element.section.width * scale,        shadow-camera-far={size * 3}

            length,        shadow-camera-left={-size}

            element.section.height * scale        shadow-camera-right={size}

          ]} />        shadow-camera-top={size}

          <meshStandardMaterial         shadow-camera-bottom={-size}

            color={elementColor}      />

            metalness={element.material === 'steel' ? 0.8 : 0.1}      <directionalLight

            roughness={element.material === 'steel' ? 0.2 : 0.8}        position={[-size, size, -size]}

            transparent={element.isSelected}        intensity={0.3}

            opacity={element.isSelected ? 0.7 : 1.0}      />

          />

        </mesh>      {/* Ground plane and grid */}

      ) : (      {showGrid && (

        // Slab or wall representation        <>

        <mesh ref={elementRef} onClick={handleClick} castShadow receiveShadow>          <gridHelper 

          <boxGeometry args={[            args={[size * 2, 20, '#e2e8f0', '#f1f5f9']} 

            element.section.width * scale,            position={[center[0], 0, center[2]]}

            element.section.thickness ? element.section.thickness * scale : 0.2,          />

            length          <ContactShadows

          ]} />            position={[center[0], 0.01, center[2]]}

          <meshStandardMaterial             opacity={0.3}

            color={elementColor}            scale={size * 2}

            metalness={0.1}            blur={2}

            roughness={0.8}          />

            transparent={element.isSelected}        </>

            opacity={element.isSelected ? 0.7 : 1.0}      )}

          />

        </mesh>      {/* Coordinate axes */}

      )}      <axesHelper args={[size * 0.3]} position={center} />



      {/* Element label */}      {/* Render nodes */}

      {showLabels && (      {structure.nodes?.map((node) => (

        <Html center>        <EnhancedNodeComp

          <div className="bg-white/90 px-1 py-0.5 rounded text-xs font-medium text-gray-800 border">          key={`node-${node.id}`}

            {element.id}          node={node}

            {element.utilization && (          isSelected={selectedNode?.id === node.id}

              <div className="text-xs text-gray-600">          showLabel={showLabels}

                U: {(element.utilization * 100).toFixed(1)}%          scale={nodeScale}

              </div>          onClick={handleNodeClick}

            )}        />

          </div>      ))}

        </Html>

      )}      {/* Render elements */}

    </group>      {structure.elements?.map((element) => (

  );        <EnhancedElementComp

};          key={`element-${element.id}`}

          element={element}

// Enhanced Scene Component          nodes={structure.nodes}

const Enhanced3DScene: React.FC<{          isSelected={selectedElement?.id === element.id}

  structure: Enhanced3DStructure;          viewMode={viewMode}

  showDeformation: boolean;          showStress={showStress}

  deformationScale: number;          onClick={handleElementClick}

  showStress: boolean;        />

  showForces: boolean;      ))}

  showLabels: boolean;

  colorMode: string;      {/* Camera controls */}

  onElementSelect: (elementId: string) => void;      <OrbitControls

  onNodeSelect: (nodeId: string) => void;        enableDamping

}> = ({         dampingFactor={0.05}

  structure,         screenSpacePanning={false}

  showDeformation,         minDistance={size * 0.5}

  deformationScale,         maxDistance={size * 5}

  showStress,         target={center}

  showForces,         enablePan={true}

  showLabels,         enableZoom={true}

  colorMode,        enableRotate={true}

  onElementSelect,        maxPolarAngle={Math.PI}

  onNodeSelect         minPolarAngle={0}

}) => {      />

  const { camera } = useThree();    </>

  );

  useEffect(() => {});

    // Auto-fit camera to structure

    const { min, max } = structure.boundingBox;// Control Panel Component

    const center = new THREE.Vector3(const ControlPanel = memo(({

      (min[0] + max[0]) / 2,  showLabels,

      (min[1] + max[1]) / 2,  setShowLabels,

      (min[2] + max[2]) / 2  showStress,

    );  setShowStress,

    const size = Math.max(  viewMode,

      max[0] - min[0],  setViewMode,

      max[1] - min[1],  showGrid,

      max[2] - min[2]  setShowGrid,

    );  nodeScale,

      setNodeScale,

    camera.position.set(center.x + size, center.y + size * 0.5, center.z + size);  onReset,

    camera.lookAt(center);  analysisResults

  }, [structure, camera]);}: {

  showLabels: boolean;

  return (  setShowLabels: (value: boolean) => void;

    <group>  showStress: boolean;

      {/* Environment and lighting */}  setShowStress: (value: boolean) => void;

      <Environment preset="warehouse" />  viewMode: 'solid' | 'wireframe' | 'both';

      <ambientLight intensity={0.6} />  setViewMode: (value: 'solid' | 'wireframe' | 'both') => void;

      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />  showGrid: boolean;

      <pointLight position={[-10, -10, -5]} intensity={0.5} />  setShowGrid: (value: boolean) => void;

  nodeScale: number;

      {/* Ground grid */}  setNodeScale: (value: number) => void;

      <Grid   onReset: () => void;

        cellSize={1}  analysisResults?: any;

        cellThickness={0.5}}) => {

        cellColor="#bdc3c7"  return (

        sectionSize={5}    <Card className="absolute top-4 left-4 w-64 bg-white/90 backdrop-blur-sm z-10">

        sectionThickness={1}      <CardHeader className="pb-3">

        sectionColor="#7f8c8d"        <CardTitle className="text-sm flex items-center gap-2">

        infiniteGrid          <Activity className="h-4 w-4" />

        fadeDistance={50}          3D Viewer Controls

        position={[0, structure.boundingBox.min[1] - 0.5, 0]}        </CardTitle>

      />      </CardHeader>

      <CardContent className="space-y-4">

      {/* Contact shadows */}        {/* View Mode */}

      <ContactShadows         <div>

        position={[0, structure.boundingBox.min[1] - 0.1, 0]}          <Label className="text-xs font-medium">View Mode</Label>

        opacity={0.3}          <SimpleSelect

        scale={50}            value={viewMode}

        blur={2}            onValueChange={setViewMode}

        far={10}            options={[

      />              { value: 'solid', label: 'Solid' },

              { value: 'wireframe', label: 'Wireframe' },

      {/* Render nodes */}              { value: 'both', label: 'Both' }

      {structure.nodes.map(node => (            ]}

        <Enhanced3DNode            className="w-full mt-1"

          key={node.id}          />

          node={node}        </div>

          scale={structure.scale}

          showDeformation={showDeformation}        {/* Toggle Controls */}

          deformationScale={deformationScale}        <div className="grid grid-cols-2 gap-2">

          showLabels={showLabels}          <Button

          onClick={onNodeSelect}            variant={showLabels ? "default" : "outline"}

        />            size="sm"

      ))}            onClick={() => setShowLabels(!showLabels)}

            className="flex items-center gap-1"

      {/* Render elements */}          >

      {structure.elements.map(element => (            <Tags className="h-3 w-3" />

        <Enhanced3DElement            Labels

          key={element.id}          </Button>

          element={element}          

          nodes={structure.nodes}          <Button

          scale={structure.scale}            variant={showStress ? "default" : "outline"}

          showDeformation={showDeformation}            size="sm"

          deformationScale={deformationScale}            onClick={() => setShowStress(!showStress)}

          colorMode={colorMode}            className="flex items-center gap-1"

          showLabels={showLabels}          >

          onClick={onElementSelect}            <Palette className="h-3 w-3" />

        />            Stress

      ))}          </Button>

    </group>          

  );          <Button

};            variant={showGrid ? "default" : "outline"}

            size="sm"

// Main Enhanced 3D Viewer Component            onClick={() => setShowGrid(!showGrid)}

export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({            className="flex items-center gap-1"

  structure,          >

  analysisResults,            <Grid3x3 className="h-3 w-3" />

  showDeformation = false,            Grid

  deformationScale = 1,          </Button>

  showStress = false,          

  showForces = false,          <Button

  showLabels = true,            variant="outline"

  viewMode = 'solid',            size="sm"

  colorMode = 'material',            onClick={onReset}

  onElementSelect,            className="flex items-center gap-1"

  onNodeSelect,          >

  className = ''            <RotateCcw className="h-3 w-3" />

}) => {            Reset

  const [controlsEnabled, setControlsEnabled] = useState(true);          </Button>

  const [currentDeformationScale, setCurrentDeformationScale] = useState(deformationScale);        </div>

  const [currentColorMode, setCurrentColorMode] = useState(colorMode);

  const [showGrid, setShowGrid] = useState(true);        {/* Node Scale */}

  const [autoRotate, setAutoRotate] = useState(false);        <div>

  const [wireframeMode, setWireframeMode] = useState(false);          <Label className="text-xs font-medium">Node Scale</Label>

          <Input

  // Handle element selection            type="range"

  const handleElementSelect = useCallback((elementId: string) => {            min="0.5"

    if (onElementSelect) {            max="2"

      onElementSelect(elementId);            step="0.1"

    }            value={nodeScale}

  }, [onElementSelect]);            onChange={(e) => setNodeScale(parseFloat(e.target.value))}

            className="w-full mt-1"

  // Handle node selection          />

  const handleNodeSelect = useCallback((nodeId: string) => {          <div className="text-xs text-gray-500 mt-1">{nodeScale.toFixed(1)}x</div>

    if (onNodeSelect) {        </div>

      onNodeSelect(nodeId);

    }        {/* Analysis Results Summary */}

  }, [onNodeSelect]);        {analysisResults && (

          <div className="pt-2 border-t">

  // Reset camera view            <Label className="text-xs font-medium">Analysis Summary</Label>

  const resetView = useCallback(() => {            <div className="text-xs text-gray-600 mt-1 space-y-1">

    // This would typically trigger a camera reset              <div>Max Stress: {analysisResults.maxStress || 'N/A'}</div>

  }, []);              <div>Max Drift: {analysisResults.maxDrift || 'N/A'}</div>

              <div>Period: {analysisResults.fundamentalPeriod || 'N/A'}s</div>

  if (!structure) {            </div>

    return (          </div>

      <Card className={`h-full ${className}`}>        )}

        <CardContent className="flex items-center justify-center h-full">      </CardContent>

          <div className="text-center">    </Card>

            <div className="text-gray-500 mb-2">  );

              <Maximize2 className="w-16 h-16 mx-auto" />});

            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Structure Data</h3>// Main Enhanced 3D Viewer Component

            <p className="text-gray-500">Load a structural model to view in 3D</p>export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({

          </div>  structure,

        </CardContent>  onElementClick = () => {},

      </Card>  onLoad,

    );  className = '',

  }  style,

  analysisResults

  return (}) => {

    <div className={`relative w-full h-full ${className}`}>  const [showLabels, setShowLabels] = useState(false);

      {/* 3D Canvas */}  const [showStress, setShowStress] = useState(false);

      <Canvas  const [viewMode, setViewMode] = useState<'solid' | 'wireframe' | 'both'>('solid');

        camera={{ position: [10, 10, 10], fov: 60 }}  const [showGrid, setShowGrid] = useState(true);

        shadows  const [nodeScale, setNodeScale] = useState(1);

        className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50"  const [cameraKey, setCameraKey] = useState(0);

      >

        <Enhanced3DScene  const handleReset = useCallback(() => {

          structure={structure}    setCameraKey(prev => prev + 1);

          showDeformation={showDeformation}    setViewMode('solid');

          deformationScale={currentDeformationScale}    setShowLabels(false);

          showStress={showStress}    setShowStress(false);

          showForces={showForces}    setShowGrid(true);

          showLabels={showLabels}    setNodeScale(1);

          colorMode={currentColorMode}  }, []);

          onElementSelect={handleElementSelect}

          onNodeSelect={handleNodeSelect}  if (!structure || !structure.nodes?.length || !structure.elements?.length) {

        />    return (

        <OrbitControls       <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">

          enabled={controlsEnabled}        <div className="text-center p-8">

          autoRotate={autoRotate}          <div className="text-gray-400 mb-4">

          autoRotateSpeed={0.5}            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">

          dampingFactor={0.1}              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />

          enableDamping            </svg>

        />          </div>

      </Canvas>          <h3 className="text-lg font-medium text-gray-900 mb-2">No Structure Data</h3>

          <p className="text-gray-600">Please complete the form inputs to generate 3D visualization</p>

      {/* Control Panel */}        </div>

      <div className="absolute top-4 left-4 space-y-2">      </div>

        <Card className="p-3 bg-white/90 backdrop-blur-sm">    );

          <div className="space-y-2">  }

            <h4 className="font-semibold text-sm flex items-center gap-2">

              <Activity className="w-4 h-4" />  return (

              View Controls    <VisualizationErrorBoundary>

            </h4>      <div className={`relative h-full w-full ${className}`} style={style}>

                    <Canvas

            <div className="grid grid-cols-2 gap-1">          key={cameraKey}

              <Button          camera={{ 

                size="sm"            position: [20, 20, 20], 

                variant={currentColorMode === 'material' ? 'default' : 'outline'}            fov: 50,

                onClick={() => setCurrentColorMode('material')}            near: 0.1,

                className="text-xs"            far: 1000

              >          }}

                Material          shadows

              </Button>          className="bg-gradient-to-b from-sky-100 to-sky-50"

              <Button        >

                size="sm"          <Enhanced3DScene

                variant={currentColorMode === 'stress' ? 'default' : 'outline'}            structure={structure}

                onClick={() => setCurrentColorMode('stress')}            onElementClick={onElementClick}

                className="text-xs"            onLoad={onLoad}

              >            showLabels={showLabels}

                Stress            showStress={showStress}

              </Button>            viewMode={viewMode}

              <Button            showGrid={showGrid}

                size="sm"            nodeScale={nodeScale}

                variant={currentColorMode === 'utilization' ? 'default' : 'outline'}            elementTransparency={1}

                onClick={() => setCurrentColorMode('utilization')}          />

                className="text-xs"        </Canvas>

              >

                Utilization        <ControlPanel

              </Button>          showLabels={showLabels}

              <Button          setShowLabels={setShowLabels}

                size="sm"          showStress={showStress}

                variant={currentColorMode === 'forces' ? 'default' : 'outline'}          setShowStress={setShowStress}

                onClick={() => setCurrentColorMode('forces')}          viewMode={viewMode}

                className="text-xs"          setViewMode={setViewMode}

              >          showGrid={showGrid}

                Forces          setShowGrid={setShowGrid}

              </Button>          nodeScale={nodeScale}

            </div>          setNodeScale={setNodeScale}

          onReset={handleReset}

            {showDeformation && (          analysisResults={analysisResults}

              <div className="space-y-1">        />

                <label className="text-xs font-medium">Deformation Scale: {currentDeformationScale.toFixed(1)}x</label>      </div>

                <Slider    </VisualizationErrorBoundary>

                  value={[currentDeformationScale]}  );

                  onValueChange={(value) => setCurrentDeformationScale(value[0])}};

                  min={0.1}

                  max={10}export default Enhanced3DViewer;
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
                variant={showLabels ? 'default' : 'outline'}
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
          </div>
        </Card>
      )}
    </div>
  );
};

export default Enhanced3DViewer;