/**import React, { useEffect, useRef, useState } from 'react';import React, { useEffect, useRef, useState } from 'react';/**

 * Advanced 3D Structure Viewer with Deformation Analysis

 * Professional Three.js implementation with post-analysis visualizationimport * as THREE from 'three';

 */

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';import * as THREE from 'three'; * Enhanced 3D Structure Viewer with Advanced Features

import React, { useState, useCallback, useMemo } from 'react';

import { Canvas } from '@react-three/fiber';import { Button } from '../../ui/button';

import { OrbitControls, Grid, Environment, Html, Text } from '@react-three/drei';

import * as THREE from 'three';import { RotateCcw, Eye, Settings, Move3D } from 'lucide-react';import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'; * Professional-grade 3D visualization for structural analysis

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

import { Button } from '../../ui/button';

import { Badge } from '../../ui/badge';

import { interface Advanced3DViewerProps {import { Button } from '../../ui/button'; */

  Eye, 

  EyeOff,   structure: {

  RotateCcw, 

  ZoomIn,     nodes: Array<{import { RotateCcw, ZoomIn, ZoomOut, Move3D, Eye, Settings } from 'lucide-react';

  ZoomOut, 

  Grid3x3,      id: number;

  Activity,

  BarChart3,      x: number;import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

  Download,

  Settings      y: number;

} from 'lucide-react';

      z: number;interface Advanced3DViewerProps {import { Canvas, useThree, useFrame } from '@react-three/fiber';

interface Enhanced3DNode {

  id: string;      type: 'fixed' | 'pinned' | 'free';

  position: [number, number, number];

  displacement?: [number, number, number];    }>;  structure: {import { 

  reaction?: [number, number, number];

  support: {    elements: Array<{

    x: boolean;

    y: boolean;      id: number;    nodes: Array<{  OrbitControls, 

    z: boolean;

    rx: boolean;      type: 'column' | 'beam' | 'slab';

    ry: boolean;

    rz: boolean;      startNode: number;      id: number;  Text, 

  };

  isSelected?: boolean;      endNode: number;

}

      section: string;      x: number;  Html, 

interface Enhanced3DElement {

  id: string;      material: string;

  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation' | 'pile-cap' | 'pile' | 'pedestal';

  startNode: string;    }>;      y: number;  Environment,

  endNode: string;

  section: {  };

    width: number;

    height: number;  analysisResults?: {      z: number;  Grid,

    thickness?: number;

    diameter?: number;    summary: {

  };

  material: 'concrete' | 'steel' | 'composite' | 'concrete-steel';      maxStress: number;      type: 'fixed' | 'pinned' | 'free';  ContactShadows,

  forces?: {

    axial: number;      maxDrift: number;

    shearY: number;

    shearZ: number;      baseShear: number;    }>;  PerspectiveCamera,

    momentY: number;

    momentZ: number;    };

    torsion: number;

  };  };    elements: Array<{  Box,

  utilization?: number;

  isSelected?: boolean;  onElementClick?: (element: any) => void;

}

  showStress?: boolean;      id: number;  Sphere,

interface Enhanced3DStructure {

  nodes: Enhanced3DNode[];  showDeformation?: boolean;

  elements: Enhanced3DElement[];

  boundingBox: {}      type: 'column' | 'beam' | 'slab';  Line

    min: [number, number, number];

    max: [number, number, number];

  };

  scale: number;export const Advanced3DViewer: React.FC<Advanced3DViewerProps> = ({       startNode: number;} from '@react-three/drei';

}

  structure, 

interface Advanced3DViewerProps {

  structure: Enhanced3DStructure | null;  analysisResults,      endNode: number;import * as THREE from 'three';

  analysisResults?: any;

  showDeformation?: boolean;  onElementClick,

  deformationScale?: number;

  showStress?: boolean;  showStress = false,      section: string;import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  showForces?: boolean;

  showLabels?: boolean;  showDeformation = false

  showSupports?: boolean;

  viewMode?: 'solid' | 'wireframe' | 'both';}) => {      material: string;import { Button } from '@/components/ui/button';

  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';

  onElementSelect?: (elementId: string) => void;  const mountRef = useRef<HTMLDivElement>(null);

  onNodeSelect?: (nodeId: string) => void;

  className?: string;  const sceneRef = useRef<THREE.Scene>();    }>;import { Badge } from '@/components/ui/badge';

}

  const rendererRef = useRef<THREE.WebGLRenderer>();

// Advanced Node Component with Deformation

const Advanced3DNode: React.FC<{  const cameraRef = useRef<THREE.PerspectiveCamera>();  };import { Slider } from '@/components/ui/slider';

  node: Enhanced3DNode;

  scale: number;  const frameRef = useRef<number>();

  showDeformation: boolean;

  deformationScale: number;    analysisResults?: {import { 

  showSupports: boolean;

  showLabels: boolean;  const [isWireframe, setIsWireframe] = useState(false);

  onClick: (nodeId: string) => void;

}> = ({ node, scale, showDeformation, deformationScale, showSupports, showLabels, onClick }) => {  const [showGrid, setShowGrid] = useState(true);    summary: {  RotateCcw, 

  const [hovered, setHovered] = useState(false);



  // Calculate deformed position

  const deformedPosition = useMemo(() => {  useEffect(() => {      maxStress: number;  ZoomIn, 

    if (!showDeformation || !node.displacement) return node.position;

    return [    if (!mountRef.current) return;

      node.position[0] + node.displacement[0] * deformationScale,

      node.position[1] + node.displacement[1] * deformationScale,      maxDrift: number;  ZoomOut, 

      node.position[2] + node.displacement[2] * deformationScale

    ] as [number, number, number];    // Scene setup

  }, [node.position, node.displacement, showDeformation, deformationScale]);

    const scene = new THREE.Scene();      baseShear: number;  Eye, 

  const handleClick = useCallback((e: any) => {

    e.stopPropagation();    scene.background = new THREE.Color(0xf8fafc);

    onClick(node.id);

  }, [node.id, onClick]);    sceneRef.current = scene;    };  EyeOff,



  const nodeColor = useMemo(() => {

    if (node.isSelected) return '#e74c3c';

    if (hovered) return '#f39c12';    // Camera setup  };  Grid3X3,

    

    // Color by support conditions    const camera = new THREE.PerspectiveCamera(

    const hasSupport = Object.values(node.support).some(Boolean);

    if (hasSupport) return '#2ecc71';      75,  onElementClick?: (element: any) => void;  Lightbulb,

    

    return '#3498db';      mountRef.current.clientWidth / mountRef.current.clientHeight,

  }, [node.isSelected, hovered, node.support]);

      0.1,  showStress?: boolean;  Camera,

  // Support visualization

  const renderSupport = () => {      1000

    if (!showSupports) return null;

        );  showDeformation?: boolean;  BarChart3,

    const hasSupport = Object.values(node.support).some(Boolean);

    if (!hasSupport) return null;    camera.position.set(50, 40, 50);



    return (    cameraRef.current = camera;}  Activity,

      <group position={[0, -0.3, 0]}>

        {/* Support base */}

        <mesh>

          <coneGeometry args={[0.2 * scale, 0.3 * scale, 8]} />    // Renderer setup  Maximize2,

          <meshStandardMaterial color="#34495e" />

        </mesh>    const renderer = new THREE.WebGLRenderer({ 

        

        {/* Support symbols */}      antialias: true,export const Advanced3DViewer: React.FC<Advanced3DViewerProps> = ({   Download

        {node.support.x && (

          <mesh position={[0.3 * scale, 0, 0]}>      alpha: true

            <boxGeometry args={[0.1 * scale, 0.1 * scale, 0.02 * scale]} />

            <meshStandardMaterial color="#e74c3c" />    });  structure, } from 'lucide-react';

          </mesh>

        )}    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

        {node.support.y && (

          <mesh position={[0, 0.3 * scale, 0]}>    renderer.shadowMap.enabled = true;  analysisResults,

            <boxGeometry args={[0.02 * scale, 0.1 * scale, 0.1 * scale]} />

            <meshStandardMaterial color="#e74c3c" />    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

          </mesh>

        )}    rendererRef.current = renderer;  onElementClick,// Types for enhanced 3D visualization

        {node.support.z && (

          <mesh position={[0, 0, 0.3 * scale]}>

            <boxGeometry args={[0.1 * scale, 0.02 * scale, 0.1 * scale]} />

            <meshStandardMaterial color="#e74c3c" />    // Lighting setup  showStress = false,interface Enhanced3DNode {

          </mesh>

        )}    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);

      </group>

    );    scene.add(ambientLight);  showDeformation = false  id: string;

  };



  return (

    <group position={deformedPosition}>    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);}) => {  position: [number, number, number];

      {/* Original position indicator (if deformed) */}

      {showDeformation && node.displacement && (    directionalLight.position.set(100, 100, 50);

        <group position={node.position}>

          <mesh>    directionalLight.castShadow = true;  const mountRef = useRef<HTMLDivElement>(null);  displacement?: [number, number, number];

            <sphereGeometry args={[0.08 * scale, 12, 12]} />

            <meshBasicMaterial color="#bdc3c7" opacity={0.5} transparent />    directionalLight.shadow.mapSize.width = 2048;

          </mesh>

        </group>    directionalLight.shadow.mapSize.height = 2048;  const sceneRef = useRef<THREE.Scene>();  rotation?: [number, number, number];

      )}

          scene.add(directionalLight);

      {/* Main node */}

      <mesh  const rendererRef = useRef<THREE.WebGLRenderer>();  forces?: [number, number, number];

        onClick={handleClick}

        onPointerEnter={() => setHovered(true)}    // Grid helper

        onPointerLeave={() => setHovered(false)}

      >    const gridHelper = new THREE.GridHelper(100, 50);  const cameraRef = useRef<THREE.PerspectiveCamera>();  moments?: [number, number, number];

        <sphereGeometry args={[0.12 * scale, 16, 16]} />

        <meshStandardMaterial     gridHelper.material.opacity = 0.3;

          color={nodeColor}

          metalness={0.3}    gridHelper.material.transparent = true;  const controlsRef = useRef<any>();  support: {

          roughness={0.4}

        />    scene.add(gridHelper);

      </mesh>

  const frameRef = useRef<number>();    x: boolean;

      {/* Support visualization */}

      {renderSupport()}    // Simple mouse controls



      {/* Node label */}    let mouseDown = false;      y: boolean;

      {showLabels && (

        <Html distanceFactor={10}>    let mouseX = 0;

          <div className="bg-white px-2 py-1 rounded shadow text-xs">

            Node: {node.id}    let mouseY = 0;  const [isWireframe, setIsWireframe] = useState(false);    z: boolean;

            {node.displacement && showDeformation && (

              <div className="text-orange-600">

                Δ: {(Math.sqrt(

                  Math.pow(node.displacement[0], 2) +    const onMouseDown = (event: MouseEvent) => {  const [showGrid, setShowGrid] = useState(true);    rx: boolean;

                  Math.pow(node.displacement[1], 2) +

                  Math.pow(node.displacement[2], 2)      mouseDown = true;

                ) * 1000).toFixed(1)}mm

              </div>      mouseX = event.clientX;  const [cameraMode, setCameraMode] = useState<'perspective' | 'orthographic'>('perspective');    ry: boolean;

            )}

          </div>      mouseY = event.clientY;

        </Html>

      )}    };    rz: boolean;



      {/* Deformation vector */}

      {showDeformation && node.displacement && (

        <group>    const onMouseUp = () => {  useEffect(() => {  };

          <mesh position={[

            node.displacement[0] * deformationScale / 2,      mouseDown = false;

            node.displacement[1] * deformationScale / 2,

            node.displacement[2] * deformationScale / 2    };    if (!mountRef.current) return;  isSelected?: boolean;

          ]}>

            <cylinderGeometry args={[0.02 * scale, 0.02 * scale, 

              Math.sqrt(

                Math.pow(node.displacement[0] * deformationScale, 2) +    const onMouseMove = (event: MouseEvent) => {}

                Math.pow(node.displacement[1] * deformationScale, 2) +

                Math.pow(node.displacement[2] * deformationScale, 2)      if (!mouseDown) return;

              )

            ]} />          // Scene setup

            <meshStandardMaterial color="#e74c3c" />

          </mesh>      const deltaX = event.clientX - mouseX;

        </group>

      )}      const deltaY = event.clientY - mouseY;    const scene = new THREE.Scene();interface Enhanced3DElement {

    </group>

  );      

};

      // Simple orbit controls    scene.background = new THREE.Color(0xf8fafc);  id: string;

// Advanced Element Component with Stress Visualization

const Advanced3DElement: React.FC<{      const spherical = new THREE.Spherical();

  element: Enhanced3DElement;

  nodes: Enhanced3DNode[];      spherical.setFromVector3(camera.position);    sceneRef.current = scene;  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';

  scale: number;

  showDeformation: boolean;      spherical.theta -= deltaX * 0.01;

  deformationScale: number;

  colorMode: string;      spherical.phi += deltaY * 0.01;  startNode: string;

  showLabels: boolean;

  onClick: (elementId: string) => void;      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

}> = ({ element, nodes, scale, showDeformation, deformationScale, colorMode, showLabels, onClick }) => {

  const [hovered, setHovered] = useState(false);          // Camera setup  endNode: string;



  const startNode = nodes.find(n => n.id === element.startNode);      camera.position.setFromSpherical(spherical);

  const endNode = nodes.find(n => n.id === element.endNode);

      camera.lookAt(0, 0, 0);    const camera = new THREE.PerspectiveCamera(  section: {

  if (!startNode || !endNode) return null;

      

  // Get positions (deformed or original)

  const getNodePosition = (node: Enhanced3DNode) => {      mouseX = event.clientX;      75,    width: number;

    if (!showDeformation || !node.displacement) return node.position;

    return [      mouseY = event.clientY;

      node.position[0] + node.displacement[0] * deformationScale,

      node.position[1] + node.displacement[1] * deformationScale,    };      mountRef.current.clientWidth / mountRef.current.clientHeight,    height: number;

      node.position[2] + node.displacement[2] * deformationScale

    ] as [number, number, number];

  };

    const onWheel = (event: WheelEvent) => {      0.1,    thickness?: number;

  const startPos = getNodePosition(startNode);

  const endPos = getNodePosition(endNode);      const scale = event.deltaY > 0 ? 1.1 : 0.9;



  // Calculate element geometry      camera.position.multiplyScalar(scale);      1000  };

  const direction = [

    endPos[0] - startPos[0],    };

    endPos[1] - startPos[1], 

    endPos[2] - startPos[2]    );  material: 'concrete' | 'steel' | 'composite';

  ];

      mountRef.current.addEventListener('mousedown', onMouseDown);

  const length = Math.sqrt(

    Math.pow(direction[0], 2) +    mountRef.current.addEventListener('mouseup', onMouseUp);    camera.position.set(50, 40, 50);  forces?: {

    Math.pow(direction[1], 2) +

    Math.pow(direction[2], 2)    mountRef.current.addEventListener('mousemove', onMouseMove);

  );

      mountRef.current.addEventListener('wheel', onWheel);    cameraRef.current = camera;    axial: number[];

  const center: [number, number, number] = [

    (startPos[0] + endPos[0]) / 2,    

    (startPos[1] + endPos[1]) / 2,

    (startPos[2] + endPos[2]) / 2    mountRef.current.appendChild(renderer.domElement);    shear: number[];

  ];



  const handleClick = useCallback((e: any) => {

    e.stopPropagation();    // Create structure geometry    // Renderer setup    moment: number[];

    onClick(element.id);

  }, [element.id, onClick]);    createStructureGeometry(scene, structure, showStress, analysisResults);



  // Color based on mode    const renderer = new THREE.WebGLRenderer({     positions: number[];

  const getElementColor = () => {

    if (element.isSelected) return '#ff6b6b';    // Animation loop

    if (hovered) return '#ffa726';

        const animate = () => {      antialias: true,  };

    switch (colorMode) {

      case 'stress':      frameRef.current = requestAnimationFrame(animate);

        if (element.forces) {

          const maxStress = Math.abs(element.forces.axial) / (element.section.width * element.section.height);      renderer.render(scene, camera);      alpha: true  stresses?: {

          const stressRatio = Math.min(maxStress / 25, 1); // Normalize to 25 MPa

          return new THREE.Color().setHSL(0.3 - stressRatio * 0.3, 0.8, 0.5);    };

        }

        return '#95a5a6';    animate();    });    max: number;

        

      case 'utilization':

        if (element.utilization !== undefined) {

          const ratio = Math.min(element.utilization, 1);    // Cleanup    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);    min: number;

          return new THREE.Color().setHSL(0.3 - ratio * 0.3, 0.8, 0.5);

        }    return () => {

        return '#95a5a6';

              if (frameRef.current) {    renderer.shadowMap.enabled = true;    vonMises: number[];

      case 'forces':

        if (element.forces) {        cancelAnimationFrame(frameRef.current);

          const forceRatio = Math.min(Math.abs(element.forces.axial) / 1000, 1); // Normalize to 1000 kN

          return new THREE.Color().setHSL(0.6 - forceRatio * 0.3, 0.8, 0.5);      }    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  };

        }

        return '#95a5a6';      if (mountRef.current && renderer.domElement) {

        

      default: // material        mountRef.current.removeChild(renderer.domElement);    rendererRef.current = renderer;  utilization?: number;

        switch (element.type) {

          case 'column': return '#e74c3c';      }

          case 'beam': return '#3498db';

          case 'slab': return '#2ecc71';      renderer.dispose();  isSelected?: boolean;

          case 'foundation': return '#8b4513';

          case 'pile-cap': return '#a0522d';    };

          case 'pile': return '#654321';

          case 'pedestal': return '#5f4e37';  }, [structure, showStress, analysisResults, isWireframe]);    // Lighting setup}

          case 'wall': return '#9b59b6';

          default: return '#95a5a6';

        }

    }  const createStructureGeometry = (    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);

  };

    scene: THREE.Scene, 

  // Calculate proper rotation

  const getRotation = (): [number, number, number] => {    structure: Advanced3DViewerProps['structure'],    scene.add(ambientLight);interface Enhanced3DStructure {

    const normalizedDir = [

      direction[0] / length,    showStress: boolean,

      direction[1] / length,

      direction[2] / length    analysisResults?: Advanced3DViewerProps['analysisResults']  nodes: Enhanced3DNode[];

    ];

      ) => {

    // Calculate rotation angles

    const yaw = Math.atan2(normalizedDir[0], normalizedDir[2]);    // Clear existing geometry    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);  elements: Enhanced3DElement[];

    const pitch = Math.asin(-normalizedDir[1]);

        const existingStructure = scene.getObjectByName('structure');

    return [pitch, yaw, 0];

  };    if (existingStructure) {    directionalLight.position.set(100, 100, 50);  loads: {



  // Get dimensions based on element type      scene.remove(existingStructure);

  const getDimensions = (): [number, number, number] => {

    const baseScale = scale * 0.5;    }    directionalLight.castShadow = true;    nodeId: string;

    

    switch (element.type) {

      case 'column':

      case 'pedestal':    const structureGroup = new THREE.Group();    directionalLight.shadow.mapSize.width = 2048;    forces: [number, number, number];

        return [

          element.section.width * baseScale,    structureGroup.name = 'structure';

          length,

          element.section.width * baseScale    directionalLight.shadow.mapSize.height = 2048;    moments: [number, number, number];

        ];

            // Materials with stress coloring

      case 'pile':

        const diameter = element.section.diameter || element.section.width;    const getStressColor = (stress: number) => {    scene.add(directionalLight);  }[];

        return [

          diameter * baseScale,      if (stress < 0.5) return 0x4CAF50; // Green - Safe

          length,

          diameter * baseScale      if (stress < 0.8) return 0xFF9800; // Orange - Caution    boundingBox: {

        ];

              return 0xF44336; // Red - Critical

      case 'slab':

        return [    };    // Grid helper    min: [number, number, number];

          length,

          element.section.thickness! * baseScale,

          element.section.width * baseScale

        ];    // Create nodes    const gridHelper = new THREE.GridHelper(100, 50);    max: [number, number, number];

        

      case 'foundation':    structure.nodes.forEach(node => {

      case 'pile-cap':

        return [      const nodeGeometry = new THREE.SphereGeometry(0.5, 12, 8);    gridHelper.material.opacity = 0.3;  };

          element.section.width * baseScale,

          element.section.thickness! * baseScale,      const nodeMaterial = new THREE.MeshLambertMaterial({ 

          element.section.height * baseScale

        ];        color: node.type === 'fixed' ? 0xff0000 : 0x333333,    gridHelper.material.transparent = true;  scale: number;

        

      default: // beam        wireframe: isWireframe

        return [

          length,      });    scene.add(gridHelper);}

          element.section.height * baseScale,

          element.section.width * baseScale      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);

        ];

    }      nodeMesh.position.set(node.x, node.y, node.z);

  };

      nodeMesh.userData = { type: 'node', id: node.id };

  const rotation = getRotation();

  const dimensions = getDimensions();      structureGroup.add(nodeMesh);    // Controls (simplified mouse controls)interface Enhanced3DViewerProps {

  const color = getElementColor();

    });

  return (

    <group position={center}>    let mouseDown = false;  structure: Enhanced3DStructure | null;

      {/* Original position (if deformed) */}

      {showDeformation && (    // Create elements

        <group position={[

          (startNode.position[0] + endNode.position[0]) / 2 - center[0],    structure.elements.forEach((element, index) => {    let mouseX = 0;  analysisResults?: any;

          (startNode.position[1] + endNode.position[1]) / 2 - center[1],

          (startNode.position[2] + endNode.position[2]) / 2 - center[2]      const startNode = structure.nodes.find(n => n.id === element.startNode);

        ]}>

          <mesh rotation={rotation}>      const endNode = structure.nodes.find(n => n.id === element.endNode);    let mouseY = 0;  showDeformation?: boolean;

            <boxGeometry args={dimensions} />

            <meshBasicMaterial       

              color="#bdc3c7" 

              opacity={0.3}       if (!startNode || !endNode) return;  deformationScale?: number;

              transparent 

              wireframe 

            />

          </mesh>      const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);    const onMouseDown = (event: MouseEvent) => {  showStress?: boolean;

        </group>

      )}      const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);

      

      {/* Main element */}      const direction = new THREE.Vector3().subVectors(end, start);      mouseDown = true;  showForces?: boolean;

      <mesh 

        rotation={rotation}      const length = direction.length();

        onClick={handleClick}

        onPointerEnter={() => setHovered(true)}      mouseX = event.clientX;  showLabels?: boolean;

        onPointerLeave={() => setHovered(false)}

      >      let geometry: THREE.BufferGeometry;

        <boxGeometry args={dimensions} />

        <meshStandardMaterial       let material: THREE.Material;      mouseY = event.clientY;  viewMode?: 'solid' | 'wireframe' | 'both';

          color={color}

          transparent={element.type === 'slab'}

          opacity={element.type === 'slab' ? 0.6 : 1.0}

          metalness={element.material === 'steel' ? 0.8 : 0.1}      // Stress-based coloring    };  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';

          roughness={element.material === 'steel' ? 0.2 : 0.8}

        />      const stressLevel = showStress && analysisResults ? 

      </mesh>

        Math.random() * analysisResults.summary.maxStress : 0.3;  onElementSelect?: (elementId: string) => void;

      {/* Element label */}

      {showLabels && (      

        <Html distanceFactor={15}>

          <div className="bg-white px-2 py-1 rounded shadow text-xs">      const color = showStress ? getStressColor(stressLevel) :     const onMouseUp = () => {  onNodeSelect?: (nodeId: string) => void;

            {element.type.toUpperCase()}: {element.id}

            {element.forces && (        (element.type === 'column' ? 0x2196F3 : 0x4CAF50);

              <div className="text-blue-600">

                N: {(element.forces.axial / 1000).toFixed(1)}kN      mouseDown = false;  className?: string;

              </div>

            )}      if (element.type === 'column') {

            {element.utilization !== undefined && (

              <div className={`${element.utilization > 0.8 ? 'text-red-600' : 'text-green-600'}`}>        geometry = new THREE.BoxGeometry(0.8, length, 0.8);    };}

                η: {(element.utilization * 100).toFixed(0)}%

              </div>        material = new THREE.MeshLambertMaterial({ 

            )}

          </div>          color,

        </Html>

      )}          transparent: !isWireframe,

    </group>

  );          opacity: isWireframe ? 1 : 0.8,    const onMouseMove = (event: MouseEvent) => {// Enhanced Node Component with support visualization

};

          wireframe: isWireframe

// Main 3D Scene

const Advanced3DScene: React.FC<{        });      if (!mouseDown) return;const Enhanced3DNode: React.FC<{

  structure: Enhanced3DStructure;

  showDeformation: boolean;      } else {

  deformationScale: number;

  showStress: boolean;        geometry = new THREE.BoxGeometry(0.6, 1.2, length);        node: Enhanced3DNode;

  showForces: boolean;

  showLabels: boolean;        material = new THREE.MeshLambertMaterial({ 

  showSupports: boolean;

  colorMode: string;          color,      const deltaX = event.clientX - mouseX;  scale: number;

  onElementSelect: (elementId: string) => void;

  onNodeSelect: (nodeId: string) => void;          transparent: !isWireframe,

}> = ({ 

  structure,           opacity: isWireframe ? 1 : 0.8,      const deltaY = event.clientY - mouseY;  showDeformation: boolean;

  showDeformation, 

  deformationScale,           wireframe: isWireframe

  showStress, 

  showForces,         });        deformationScale: number;

  showLabels, 

  showSupports,      }

  colorMode,

  onElementSelect,      // Simple orbit controls  showLabels: boolean;

  onNodeSelect 

}) => {      const mesh = new THREE.Mesh(geometry, material);

  return (

    <group>      mesh.position.copy(start).add(direction.multiplyScalar(0.5));      const spherical = new THREE.Spherical();  onClick: (nodeId: string) => void;

      {/* Lighting */}

      <ambientLight intensity={0.4} />      

      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <pointLight position={[-10, -10, -5]} intensity={0.3} />      // Orient element      spherical.setFromVector3(camera.position);}> = ({ node, scale, showDeformation, deformationScale, showLabels, onClick }) => {

      

      {/* Environment and Grid */}      if (element.type === 'column') {

      <Environment preset="studio" />

      <Grid args={[100, 100]} />        // Columns are vertical      spherical.theta -= deltaX * 0.01;  const nodeRef = useRef<THREE.Mesh>(null);

      

      {/* Structure elements */}        const quaternion = new THREE.Quaternion();

      {structure.nodes.map(node => (

        <Advanced3DNode        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());      spherical.phi += deltaY * 0.01;  

          key={node.id}

          node={node}        mesh.applyQuaternion(quaternion);

          scale={structure.scale}

          showDeformation={showDeformation}      } else {      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));  // Calculate deformed position

          deformationScale={deformationScale}

          showSupports={showSupports}        // Beams are horizontal

          showLabels={showLabels}

          onClick={onNodeSelect}        const quaternion = new THREE.Quaternion();        const deformedPosition = useMemo(() => {

        />

      ))}        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());



      {structure.elements.map(element => (        mesh.applyQuaternion(quaternion);      camera.position.setFromSpherical(spherical);    if (!showDeformation || !node.displacement) return node.position;

        <Advanced3DElement

          key={element.id}      }

          element={element}

          nodes={structure.nodes}      camera.lookAt(0, 0, 0);    return [

          scale={structure.scale}

          showDeformation={showDeformation}      mesh.userData = { 

          deformationScale={deformationScale}

          colorMode={colorMode}        type: 'element',             node.position[0] + node.displacement[0] * deformationScale,

          showLabels={showLabels}

          onClick={onElementSelect}        id: element.id, 

        />

      ))}        elementType: element.type,      mouseX = event.clientX;      node.position[1] + node.displacement[1] * deformationScale,

    </group>

  );        section: element.section,

};

        stress: stressLevel      mouseY = event.clientY;      node.position[2] + node.displacement[2] * deformationScale

// Main Advanced 3D Viewer Component

const Advanced3DViewer: React.FC<Advanced3DViewerProps> = ({      };

  structure,

  analysisResults,    };    ] as [number, number, number];

  showDeformation: initialShowDeformation = false,

  deformationScale: initialDeformationScale = 10,      mesh.castShadow = true;

  showStress = false,

  showForces = false,      mesh.receiveShadow = true;  }, [node.position, node.displacement, showDeformation, deformationScale]);

  showLabels = true,

  showSupports = true,      structureGroup.add(mesh);

  viewMode = 'solid',

  colorMode: initialColorMode = 'material',    });    mountRef.current.addEventListener('mousedown', onMouseDown);

  onElementSelect,

  onNodeSelect,

  className = ''

}) => {    scene.add(structureGroup);    mountRef.current.addEventListener('mouseup', onMouseUp);  // Support visualization

  const [controlsEnabled, setControlsEnabled] = useState(true);

  const [showDeformation, setShowDeformation] = useState(initialShowDeformation);  };

  const [deformationScale, setDeformationScale] = useState(initialDeformationScale);

  const [colorMode, setColorMode] = useState(initialColorMode);    mountRef.current.addEventListener('mousemove', onMouseMove);  const supportGeometry = useMemo(() => {

  const [showGrid, setShowGrid] = useState(true);

  const [autoRotate, setAutoRotate] = useState(false);  const resetCamera = () => {

  const [cameraKey, setCameraKey] = useState(0);

    if (cameraRef.current) {        const supports = [];

  const handleElementSelect = useCallback((elementId: string) => {

    if (onElementSelect) onElementSelect(elementId);      cameraRef.current.position.set(50, 40, 50);

  }, [onElementSelect]);

      cameraRef.current.lookAt(0, 0, 0);    mountRef.current.appendChild(renderer.domElement);    const { support } = node;

  const handleNodeSelect = useCallback((nodeId: string) => {

    if (onNodeSelect) onNodeSelect(nodeId);    }

  }, [onNodeSelect]);

  };    

  const resetView = useCallback(() => {

    setCameraKey(prev => prev + 1);

    setShowDeformation(false);

    setDeformationScale(10);  const toggleWireframe = () => {    // Create structure geometry    if (support.x || support.y || support.z) {

    setColorMode('material');

    setAutoRotate(false);    setIsWireframe(!isWireframe);

  }, []);

  };    createStructureGeometry(scene, structure, showStress, analysisResults);      // Fixed support

  if (!structure) {

    return (

      <Card className={`h-full ${className}`}>

        <CardContent className="flex items-center justify-center h-full">  const toggleGrid = () => {      if (support.x && support.y && support.z) {

          <div className="text-center">

            <div className="text-gray-500 mb-2">    setShowGrid(!showGrid);

              <BarChart3 className="w-16 h-16 mx-auto" />

            </div>    if (sceneRef.current) {    // Animation loop        supports.push({ type: 'fixed', size: 0.3 });

            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Structure Data</h3>

            <p className="text-gray-500">Load and analyze a structural model to view in 3D</p>      const grid = sceneRef.current.children.find(child => child instanceof THREE.GridHelper);

          </div>

        </CardContent>      if (grid) {    const animate = () => {      }

      </Card>

    );        grid.visible = !showGrid;

  }

      }      frameRef.current = requestAnimationFrame(animate);      // Pinned support

  return (

    <div className={`relative w-full h-full ${className}`}>    }

      {/* 3D Canvas */}

      <Canvas  };      renderer.render(scene, camera);      else if ((support.x && support.y) || (support.y && support.z) || (support.x && support.z)) {

        key={cameraKey}

        camera={{ position: [15, 15, 15], fov: 60 }}

        shadows

        className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50"  return (    };        supports.push({ type: 'pinned', size: 0.25 });

      >

        <Advanced3DScene    <Card className="w-full">

          structure={structure}

          showDeformation={showDeformation}      <CardHeader>    animate();      }

          deformationScale={deformationScale}

          showStress={showStress}        <div className="flex justify-between items-center">

          showForces={showForces}

          showLabels={showLabels}          <CardTitle className="flex items-center gap-2">      // Roller support

          showSupports={showSupports}

          colorMode={colorMode}            <Move3D className="w-5 h-5 text-blue-600" />

          onElementSelect={handleElementSelect}

          onNodeSelect={handleNodeSelect}            Advanced 3D Structure Viewer    // Cleanup      else {

        />

        <OrbitControls           </CardTitle>

          enabled={controlsEnabled}

          autoRotate={autoRotate}          <div className="flex gap-2">    return () => {        supports.push({ type: 'roller', size: 0.2 });

          autoRotateSpeed={0.5}

          dampingFactor={0.1}            <Button

          enableDamping

        />              variant="outline"      if (frameRef.current) {      }

      </Canvas>

              size="sm"

      {/* Control Panel */}

      <div className="absolute top-4 left-4 space-y-2">              onClick={resetCamera}        cancelAnimationFrame(frameRef.current);    }

        <Card className="p-3 bg-white/90 backdrop-blur-sm">

          <div className="space-y-3">              title="Reset Kamera"

            <div className="flex items-center justify-between">

              <h4 className="font-semibold text-sm">Advanced 3D View</h4>            >      }    

              <Button variant="outline" size="sm" onClick={resetView}>

                <RotateCcw className="h-4 w-4" />              <RotateCcw className="w-4 h-4" />

              </Button>

            </div>            </Button>      if (mountRef.current && renderer.domElement) {    return supports;

            

            {/* View controls */}            <Button

            <div className="space-y-2">

              <div className="flex items-center space-x-2">              variant={isWireframe ? "default" : "outline"}        mountRef.current.removeChild(renderer.domElement);  }, [node.support]);

                <Button

                  variant={showGrid ? "default" : "outline"}              size="sm"

                  size="sm"

                  onClick={() => setShowGrid(!showGrid)}              onClick={toggleWireframe}      }

                >

                  <Grid3x3 className="h-4 w-4" />              title="Toggle Wireframe"

                </Button>

                            >      renderer.dispose();  const handleClick = useCallback((e: any) => {

                <Button

                  variant={autoRotate ? "default" : "outline"}              <Eye className="w-4 h-4" />

                  size="sm"

                  onClick={() => setAutoRotate(!autoRotate)}            </Button>    };    e.stopPropagation();

                >

                  <Activity className="h-4 w-4" />            <Button

                </Button>

              </div>              variant={showGrid ? "default" : "outline"}  }, [structure, showStress, analysisResults]);    onClick(node.id);

              

              {/* Deformation controls */}              size="sm"

              {analysisResults && (

                <div className="space-y-2">              onClick={toggleGrid}  }, [node.id, onClick]);

                  <div className="flex items-center justify-between">

                    <label className="text-xs">Deformation</label>              title="Toggle Grid"

                    <input

                      type="checkbox"            >  const createStructureGeometry = (

                      checked={showDeformation}

                      onChange={(e) => setShowDeformation(e.target.checked)}              <Settings className="w-4 h-4" />

                    />

                  </div>            </Button>    scene: THREE.Scene,   return (

                  

                  {showDeformation && (          </div>

                    <div>

                      <label className="text-xs">Scale: {deformationScale}x</label>        </div>    structure: Advanced3DViewerProps['structure'],    <group position={deformedPosition}>

                      <input

                        type="range"      </CardHeader>

                        min="1"

                        max="100"      <CardContent>    showStress: boolean,      {/* Main node sphere */}

                        value={deformationScale}

                        onChange={(e) => setDeformationScale(parseInt(e.target.value))}        <div className="space-y-4">

                        className="w-full"

                      />          {/* Analysis Info */}    analysisResults?: Advanced3DViewerProps['analysisResults']      <mesh ref={nodeRef} onClick={handleClick} castShadow receiveShadow>

                    </div>

                  )}          <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">

                </div>

              )}            <div className="text-center">  ) => {        <sphereGeometry args={[0.1 * scale, 16, 16]} />

              

              {/* Color mode */}              <div className="text-sm font-medium text-gray-600">Nodes</div>

              <div>

                <label className="text-xs">Color Mode</label>              <div className="text-xl font-bold text-blue-600">{structure.nodes.length}</div>    // Clear existing geometry        <meshStandardMaterial 

                <select 

                  value={colorMode}             </div>

                  onChange={(e) => setColorMode(e.target.value)}

                  className="w-full text-xs p-1 rounded border"            <div className="text-center">    const existingStructure = scene.getObjectByName('structure');          color={node.isSelected ? '#e74c3c' : '#3498db'}

                >

                  <option value="material">Material</option>              <div className="text-sm font-medium text-gray-600">Elements</div>

                  <option value="stress">Stress</option>

                  <option value="utilization">Utilization</option>              <div className="text-xl font-bold text-green-600">{structure.elements.length}</div>    if (existingStructure) {          metalness={0.2}

                  <option value="forces">Forces</option>

                </select>            </div>

              </div>

            </div>            <div className="text-center">      scene.remove(existingStructure);          roughness={0.3}

          </div>

        </Card>              <div className="text-sm font-medium text-gray-600">Max Stress</div>

      </div>

              <div className="text-xl font-bold text-orange-600">    }        />

      {/* Info Panel */}

      <div className="absolute top-4 right-4">                {analysisResults ? `${(analysisResults.summary.maxStress * 100).toFixed(1)}%` : 'N/A'}

        <Card className="p-3 bg-white/90 backdrop-blur-sm">

          <div className="space-y-1">              </div>      </mesh>

            <h4 className="font-semibold text-sm">Structure Info</h4>

            <div className="text-xs space-y-0.5">            </div>

              <div>Nodes: <span className="font-medium">{structure.nodes.length}</span></div>

              <div>Elements: <span className="font-medium">{structure.elements.length}</span></div>            <div className="text-center">    const structureGroup = new THREE.Group();

              {analysisResults && (

                <>              <div className="text-sm font-medium text-gray-600">Base Shear</div>

                  <div>Status: <Badge variant="default" className="text-xs">Analyzed</Badge></div>

                  {showDeformation && (              <div className="text-xl font-bold text-purple-600">    structureGroup.name = 'structure';      {/* Support visualization */}

                    <div>Max Disp.: <span className="font-medium text-orange-600">

                      {(Math.max(...structure.nodes                {analysisResults ? `${analysisResults.summary.baseShear.toFixed(0)} kN` : 'N/A'}

                        .filter(n => n.displacement)

                        .map(n => Math.sqrt(              </div>      {supportGeometry.map((support, index) => (

                          Math.pow(n.displacement![0], 2) +

                          Math.pow(n.displacement![1], 2) +            </div>

                          Math.pow(n.displacement![2], 2)

                        ))) * 1000).toFixed(1)}mm          </div>    // Materials        <group key={index}>

                    </span></div>

                  )}

                </>

              )}          {/* Legend */}    const columnMaterial = new THREE.MeshLambertMaterial({           {support.type === 'fixed' && (

            </div>

          </div>          {showStress && (

        </Card>

      </div>            <div className="flex items-center justify-center gap-6 p-3 bg-gray-50 rounded">      color: showStress ? 0xff6b6b : 0x4a90e2,            <mesh position={[0, -support.size, 0]}>



      {/* Legend */}              <div className="flex items-center gap-2">

      {colorMode !== 'material' && (

        <div className="absolute bottom-4 left-4">                <div className="w-4 h-4 bg-green-500 rounded"></div>      transparent: !isWireframe,              <boxGeometry args={[support.size, support.size * 0.2, support.size]} />

          <Card className="p-3 bg-white/90 backdrop-blur-sm">

            <div className="space-y-1">                <span className="text-sm">Safe (&lt;50%)</span>

              <h5 className="font-semibold text-xs">Legend</h5>

              <div className="text-xs space-y-0.5">              </div>      opacity: isWireframe ? 1 : 0.8              <meshStandardMaterial color="#2c3e50" />

                {colorMode === 'stress' && (

                  <>              <div className="flex items-center gap-2">

                    <div className="flex items-center space-x-2">

                      <div className="w-3 h-3 bg-green-500"></div>                <div className="w-4 h-4 bg-orange-500 rounded"></div>    });            </mesh>

                      <span>Low Stress</span>

                    </div>                <span className="text-sm">Caution (50-80%)</span>

                    <div className="flex items-center space-x-2">

                      <div className="w-3 h-3 bg-yellow-500"></div>              </div>    const beamMaterial = new THREE.MeshLambertMaterial({           )}

                      <span>Medium Stress</span>

                    </div>              <div className="flex items-center gap-2">

                    <div className="flex items-center space-x-2">

                      <div className="w-3 h-3 bg-red-500"></div>                <div className="w-4 h-4 bg-red-500 rounded"></div>      color: showStress ? 0xffa726 : 0x66bb6a,          {support.type === 'pinned' && (

                      <span>High Stress</span>

                    </div>                <span className="text-sm">Critical (&gt;80%)</span>

                  </>

                )}              </div>      transparent: !isWireframe,            <mesh position={[0, -support.size * 0.7, 0]}>

                {colorMode === 'utilization' && (

                  <>            </div>

                    <div className="flex items-center space-x-2">

                      <div className="w-3 h-3 bg-green-500"></div>          )}      opacity: isWireframe ? 1 : 0.8              <coneGeometry args={[support.size * 0.7, support.size * 0.5, 8]} />

                      <span>&lt; 50%</span>

                    </div>

                    <div className="flex items-center space-x-2">

                      <div className="w-3 h-3 bg-yellow-500"></div>          {/* 3D Viewer */}    });              <meshStandardMaterial color="#e67e22" />

                      <span>50-80%</span>

                    </div>          <div 

                    <div className="flex items-center space-x-2">

                      <div className="w-3 h-3 bg-red-500"></div>            ref={mountRef}             </mesh>

                      <span>&gt; 80%</span>

                    </div>            className="w-full h-96 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden shadow-inner"

                  </>

                )}            style={{ cursor: 'grab' }}    if (isWireframe) {          )}

              </div>

            </div>          />

          </Card>

        </div>      columnMaterial.wireframe = true;          {support.type === 'roller' && (

      )}

    </div>          {/* Controls */}

  );

};          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-400">      beamMaterial.wireframe = true;            <>



export default Advanced3DViewer;            <strong>🎮 Kontrol Interaktif:</strong><br/>

            • <strong>Rotasi:</strong> Klik kiri + drag untuk memutar struktur<br/>    }              <mesh position={[0, -support.size * 0.5, 0]}>

            • <strong>Zoom:</strong> Scroll mouse untuk memperbesar/memperkecil<br/>

            • <strong>Mode:</strong> {isWireframe ? 'Wireframe (Kerangka)' : 'Solid (Padat)'}<br/>                <cylinderGeometry args={[support.size * 0.3, support.size * 0.3, support.size * 0.2, 16]} />

            • <strong>Grid:</strong> {showGrid ? 'Aktif' : 'Nonaktif'} | 

            <strong> Stress View:</strong> {showStress ? 'Aktif (Warna = Tingkat Stress)' : 'Nonaktif'}    // Create nodes as small spheres                <meshStandardMaterial color="#f39c12" />

          </div>

        </div>    structure.nodes.forEach(node => {              </mesh>

      </CardContent>

    </Card>      const nodeGeometry = new THREE.SphereGeometry(0.3, 8, 6);              <mesh position={[0, -support.size * 0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>

  );

};      const nodeMaterial = new THREE.MeshBasicMaterial({                 <boxGeometry args={[support.size * 1.5, support.size * 0.1, support.size * 0.1]} />



export default Advanced3DViewer;        color: node.type === 'fixed' ? 0xff0000 : 0x333333                 <meshStandardMaterial color="#2c3e50" />

      });              </mesh>

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);            </>

      nodeMesh.position.set(node.x, node.y, node.z);          )}

      nodeMesh.userData = { type: 'node', id: node.id };        </group>

      structureGroup.add(nodeMesh);      ))}

    });

      {/* Force vectors */}

    // Create elements      {node.forces && (

    structure.elements.forEach(element => {        <group>

      const startNode = structure.nodes.find(n => n.id === element.startNode);          {node.forces[1] !== 0 && ( // Y-force (vertical)

      const endNode = structure.nodes.find(n => n.id === element.endNode);            <group>

                    <mesh position={[0, node.forces[1] > 0 ? 0.5 : -0.5, 0]}>

      if (!startNode || !endNode) return;                <coneGeometry args={[0.05, 0.2, 8]} />

                <meshStandardMaterial color="#e74c3c" />

      const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);              </mesh>

      const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);              <mesh position={[0, node.forces[1] > 0 ? 0.3 : -0.3, 0]}>

      const direction = new THREE.Vector3().subVectors(end, start);                <cylinderGeometry args={[0.02, 0.02, Math.abs(node.forces[1]) * 0.01, 8]} />

      const length = direction.length();                <meshStandardMaterial color="#e74c3c" />

              </mesh>

      let geometry: THREE.BufferGeometry;            </group>

      let material: THREE.Material;          )}

        </group>

      if (element.type === 'column') {      )}

        geometry = new THREE.BoxGeometry(0.4, length, 0.4);

        material = columnMaterial;      {/* Node label */}

      } else {      {showLabels && (

        geometry = new THREE.BoxGeometry(0.3, 0.6, length);        <Html center>

        material = beamMaterial;          <div className="bg-white/90 px-1 py-0.5 rounded text-xs font-medium text-gray-800 border">

      }            {node.id}

          </div>

      const mesh = new THREE.Mesh(geometry, material);        </Html>

      mesh.position.copy(start).add(direction.multiplyScalar(0.5));      )}

          </group>

      // Orient the element  );

      const axis = new THREE.Vector3(0, 1, 0);};

      const angle = axis.angleTo(direction.normalize());

      const rotationAxis = new THREE.Vector3().crossVectors(axis, direction).normalize();// Enhanced Element Component with stress visualization

      if (rotationAxis.length() > 0) {const Enhanced3DElement: React.FC<{

        mesh.rotateOnAxis(rotationAxis, angle);  element: Enhanced3DElement;

      }  nodes: Enhanced3DNode[];

  scale: number;

      mesh.userData = {   showDeformation: boolean;

        type: 'element',   deformationScale: number;

        id: element.id,   colorMode: string;

        elementType: element.type,  showLabels: boolean;

        section: element.section  onClick: (elementId: string) => void;

      };}> = ({ element, nodes, scale, showDeformation, deformationScale, colorMode, showLabels, onClick }) => {

  const elementRef = useRef<THREE.Mesh>(null);

      mesh.castShadow = true;

      mesh.receiveShadow = true;  // Find start and end nodes

      structureGroup.add(mesh);  const startNode = nodes.find(n => n.id === element.startNode);

    });  const endNode = nodes.find(n => n.id === element.endNode);



    scene.add(structureGroup);  if (!startNode || !endNode) return null;

  };

  // Calculate deformed positions

  const resetCamera = () => {  const startPos = showDeformation && startNode.displacement ? [

    if (cameraRef.current) {    startNode.position[0] + startNode.displacement[0] * deformationScale,

      cameraRef.current.position.set(50, 40, 50);    startNode.position[1] + startNode.displacement[1] * deformationScale,

      cameraRef.current.lookAt(0, 0, 0);    startNode.position[2] + startNode.displacement[2] * deformationScale

    }  ] : startNode.position;

  };

  const endPos = showDeformation && endNode.displacement ? [

  const toggleWireframe = () => {    endNode.position[0] + endNode.displacement[0] * deformationScale,

    setIsWireframe(!isWireframe);    endNode.position[1] + endNode.displacement[1] * deformationScale,

    // Force re-render    endNode.position[2] + endNode.displacement[2] * deformationScale

    if (sceneRef.current && structure) {  ] : endNode.position;

      createStructureGeometry(sceneRef.current, structure, showStress, analysisResults);

    }  // Calculate element geometry

  };  const direction = new THREE.Vector3(

    endPos[0] - startPos[0],

  const toggleGrid = () => {    endPos[1] - startPos[1],

    setShowGrid(!showGrid);    endPos[2] - startPos[2]

    if (sceneRef.current) {  );

      const grid = sceneRef.current.getObjectByName('GridHelper');  const length = direction.length();

      if (grid) {  const center = [

        grid.visible = !showGrid;    (startPos[0] + endPos[0]) / 2,

      }    (startPos[1] + endPos[1]) / 2,

    }    (startPos[2] + endPos[2]) / 2

  };  ] as [number, number, number];



  return (  // Calculate rotation

    <Card className="w-full">  const up = new THREE.Vector3(0, 1, 0);

      <CardHeader>  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.normalize());

        <div className="flex justify-between items-center">

          <CardTitle className="flex items-center gap-2">  // Color based on mode

            <Move3D className="w-5 h-5" />  const getElementColor = () => {

            Visualisasi 3D Struktur    switch (colorMode) {

          </CardTitle>      case 'stress':

          <div className="flex gap-2">        if (element.stresses?.vonMises) {

            <Button          const maxStress = Math.max(...element.stresses.vonMises);

              variant="outline"          const intensity = Math.min(maxStress / 25, 1); // Normalize to 25 MPa

              size="sm"          return new THREE.Color().lerpColors(

              onClick={resetCamera}            new THREE.Color('#2ecc71'), // Green for low stress

              title="Reset Kamera"            new THREE.Color('#e74c3c'), // Red for high stress

            >            intensity

              <RotateCcw className="w-4 h-4" />          );

            </Button>        }

            <Button        break;

              variant="outline"      case 'utilization':

              size="sm"        if (element.utilization) {

              onClick={toggleWireframe}          const intensity = Math.min(element.utilization, 1);

              title="Toggle Wireframe"          return new THREE.Color().lerpColors(

            >            new THREE.Color('#2ecc71'), // Green for low utilization

              <Eye className="w-4 h-4" />            new THREE.Color('#e74c3c'), // Red for high utilization

            </Button>            intensity

            <Button          );

              variant="outline"        }

              size="sm"        break;

              onClick={toggleGrid}      case 'material':

              title="Toggle Grid"        switch (element.material) {

            >          case 'concrete': return new THREE.Color('#95a5a6');

              <Settings className="w-4 h-4" />          case 'steel': return new THREE.Color('#34495e');

            </Button>          case 'composite': return new THREE.Color('#9b59b6');

          </div>        }

        </div>        break;

      </CardHeader>      default:

      <CardContent>        return new THREE.Color('#3498db');

        <div className="space-y-4">    }

          {/* Stats Display */}    return new THREE.Color('#3498db');

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded">  };

            <div className="text-center">

              <div className="text-sm font-medium text-gray-600">Total Nodes</div>  const elementColor = getElementColor();

              <div className="text-lg font-bold text-blue-600">{structure.nodes.length}</div>

            </div>  const handleClick = useCallback((e: any) => {

            <div className="text-center">    e.stopPropagation();

              <div className="text-sm font-medium text-gray-600">Total Elements</div>    onClick(element.id);

              <div className="text-lg font-bold text-green-600">{structure.elements.length}</div>  }, [element.id, onClick]);

            </div>

            <div className="text-center">  return (

              <div className="text-sm font-medium text-gray-600">Max Stress</div>    <group position={center} quaternion={quaternion}>

              <div className="text-lg font-bold text-orange-600">      {/* Main element geometry */}

                {analysisResults ? `${(analysisResults.summary.maxStress * 100).toFixed(1)}%` : 'N/A'}      {element.type === 'beam' || element.type === 'column' ? (

              </div>        <mesh ref={elementRef} onClick={handleClick} castShadow receiveShadow>

            </div>          <boxGeometry args={[

          </div>            element.section.width * scale,

            length,

          {/* 3D Viewer Container */}            element.section.height * scale

          <div           ]} />

            ref={mountRef}           <meshStandardMaterial 

            className="w-full h-96 border rounded bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden"            color={elementColor}

            style={{ cursor: 'grab' }}            metalness={element.material === 'steel' ? 0.8 : 0.1}

          />            roughness={element.material === 'steel' ? 0.2 : 0.8}

            transparent={element.isSelected}

          {/* Controls Info */}            opacity={element.isSelected ? 0.7 : 1.0}

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">          />

            <strong>Kontrol:</strong> Klik + drag untuk merotasi kamera | Scroll untuk zoom |         </mesh>

            {isWireframe ? ' Mode: Wireframe' : ' Mode: Solid'} |       ) : (

            Grid: {showGrid ? 'On' : 'Off'}        // Slab or wall representation

          </div>        <mesh ref={elementRef} onClick={handleClick} castShadow receiveShadow>

        </div>          <boxGeometry args={[

      </CardContent>            element.section.width * scale,

    </Card>            element.section.thickness ? element.section.thickness * scale : 0.2,

  );            length

};          ]} />

          <meshStandardMaterial 

export default Advanced3DViewer;            color={elementColor}
            metalness={0.1}
            roughness={0.8}
            transparent={element.isSelected}
            opacity={element.isSelected ? 0.7 : 1.0}
          />
        </mesh>
      )}

      {/* Element label */}
      {showLabels && (
        <Html center>
          <div className="bg-white/90 px-1 py-0.5 rounded text-xs font-medium text-gray-800 border">
            {element.id}
            {element.utilization && (
              <div className="text-xs text-gray-600">
                U: {(element.utilization * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

// Enhanced Scene Component
const Enhanced3DScene: React.FC<{
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

      {/* Render nodes */}
      {structure.nodes.map(node => (
        <Enhanced3DNode
          key={node.id}
          node={node}
          scale={structure.scale}
          showDeformation={showDeformation}
          deformationScale={deformationScale}
          showLabels={showLabels}
          onClick={onNodeSelect}
        />
      ))}

      {/* Render elements */}
      {structure.elements.map(element => (
        <Enhanced3DElement
          key={element.id}
          element={element}
          nodes={structure.nodes}
          scale={structure.scale}
          showDeformation={showDeformation}
          deformationScale={deformationScale}
          colorMode={colorMode}
          showLabels={showLabels}
          onClick={onElementSelect}
        />
      ))}
    </group>
  );
};

// Main Enhanced 3D Viewer Component
export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
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
        <Enhanced3DScene
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
                  value={[currentDeformationScale]}
                  onValueChange={(value) => setCurrentDeformationScale(value[0])}
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
          </Card>
        </div>
      )}
    </div>
  );
};

export default Enhanced3DViewer;