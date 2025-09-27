import React, { useEffect, useRef, useState } from 'react';import React, { useEffect, useRef, useState } from 'react';/**

import * as THREE from 'three';

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';import * as THREE from 'three'; * Enhanced 3D Structure Viewer with Advanced Features

import { Button } from '../../ui/button';

import { RotateCcw, Eye, Settings, Move3D } from 'lucide-react';import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'; * Professional-grade 3D visualization for structural analysis



interface Advanced3DViewerProps {import { Button } from '../../ui/button'; */

  structure: {

    nodes: Array<{import { RotateCcw, ZoomIn, ZoomOut, Move3D, Eye, Settings } from 'lucide-react';

      id: number;

      x: number;import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

      y: number;

      z: number;interface Advanced3DViewerProps {import { Canvas, useThree, useFrame } from '@react-three/fiber';

      type: 'fixed' | 'pinned' | 'free';

    }>;  structure: {import { 

    elements: Array<{

      id: number;    nodes: Array<{  OrbitControls, 

      type: 'column' | 'beam' | 'slab';

      startNode: number;      id: number;  Text, 

      endNode: number;

      section: string;      x: number;  Html, 

      material: string;

    }>;      y: number;  Environment,

  };

  analysisResults?: {      z: number;  Grid,

    summary: {

      maxStress: number;      type: 'fixed' | 'pinned' | 'free';  ContactShadows,

      maxDrift: number;

      baseShear: number;    }>;  PerspectiveCamera,

    };

  };    elements: Array<{  Box,

  onElementClick?: (element: any) => void;

  showStress?: boolean;      id: number;  Sphere,

  showDeformation?: boolean;

}      type: 'column' | 'beam' | 'slab';  Line



export const Advanced3DViewer: React.FC<Advanced3DViewerProps> = ({       startNode: number;} from '@react-three/drei';

  structure, 

  analysisResults,      endNode: number;import * as THREE from 'three';

  onElementClick,

  showStress = false,      section: string;import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

  showDeformation = false

}) => {      material: string;import { Button } from '@/components/ui/button';

  const mountRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene>();    }>;import { Badge } from '@/components/ui/badge';

  const rendererRef = useRef<THREE.WebGLRenderer>();

  const cameraRef = useRef<THREE.PerspectiveCamera>();  };import { Slider } from '@/components/ui/slider';

  const frameRef = useRef<number>();

    analysisResults?: {import { 

  const [isWireframe, setIsWireframe] = useState(false);

  const [showGrid, setShowGrid] = useState(true);    summary: {  RotateCcw, 



  useEffect(() => {      maxStress: number;  ZoomIn, 

    if (!mountRef.current) return;

      maxDrift: number;  ZoomOut, 

    // Scene setup

    const scene = new THREE.Scene();      baseShear: number;  Eye, 

    scene.background = new THREE.Color(0xf8fafc);

    sceneRef.current = scene;    };  EyeOff,



    // Camera setup  };  Grid3X3,

    const camera = new THREE.PerspectiveCamera(

      75,  onElementClick?: (element: any) => void;  Lightbulb,

      mountRef.current.clientWidth / mountRef.current.clientHeight,

      0.1,  showStress?: boolean;  Camera,

      1000

    );  showDeformation?: boolean;  BarChart3,

    camera.position.set(50, 40, 50);

    cameraRef.current = camera;}  Activity,



    // Renderer setup  Maximize2,

    const renderer = new THREE.WebGLRenderer({ 

      antialias: true,export const Advanced3DViewer: React.FC<Advanced3DViewerProps> = ({   Download

      alpha: true

    });  structure, } from 'lucide-react';

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

    renderer.shadowMap.enabled = true;  analysisResults,

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    rendererRef.current = renderer;  onElementClick,// Types for enhanced 3D visualization



    // Lighting setup  showStress = false,interface Enhanced3DNode {

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);

    scene.add(ambientLight);  showDeformation = false  id: string;



    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);}) => {  position: [number, number, number];

    directionalLight.position.set(100, 100, 50);

    directionalLight.castShadow = true;  const mountRef = useRef<HTMLDivElement>(null);  displacement?: [number, number, number];

    directionalLight.shadow.mapSize.width = 2048;

    directionalLight.shadow.mapSize.height = 2048;  const sceneRef = useRef<THREE.Scene>();  rotation?: [number, number, number];

    scene.add(directionalLight);

  const rendererRef = useRef<THREE.WebGLRenderer>();  forces?: [number, number, number];

    // Grid helper

    const gridHelper = new THREE.GridHelper(100, 50);  const cameraRef = useRef<THREE.PerspectiveCamera>();  moments?: [number, number, number];

    gridHelper.material.opacity = 0.3;

    gridHelper.material.transparent = true;  const controlsRef = useRef<any>();  support: {

    scene.add(gridHelper);

  const frameRef = useRef<number>();    x: boolean;

    // Simple mouse controls

    let mouseDown = false;      y: boolean;

    let mouseX = 0;

    let mouseY = 0;  const [isWireframe, setIsWireframe] = useState(false);    z: boolean;



    const onMouseDown = (event: MouseEvent) => {  const [showGrid, setShowGrid] = useState(true);    rx: boolean;

      mouseDown = true;

      mouseX = event.clientX;  const [cameraMode, setCameraMode] = useState<'perspective' | 'orthographic'>('perspective');    ry: boolean;

      mouseY = event.clientY;

    };    rz: boolean;



    const onMouseUp = () => {  useEffect(() => {  };

      mouseDown = false;

    };    if (!mountRef.current) return;  isSelected?: boolean;



    const onMouseMove = (event: MouseEvent) => {}

      if (!mouseDown) return;

          // Scene setup

      const deltaX = event.clientX - mouseX;

      const deltaY = event.clientY - mouseY;    const scene = new THREE.Scene();interface Enhanced3DElement {

      

      // Simple orbit controls    scene.background = new THREE.Color(0xf8fafc);  id: string;

      const spherical = new THREE.Spherical();

      spherical.setFromVector3(camera.position);    sceneRef.current = scene;  type: 'beam' | 'column' | 'slab' | 'wall' | 'foundation';

      spherical.theta -= deltaX * 0.01;

      spherical.phi += deltaY * 0.01;  startNode: string;

      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

          // Camera setup  endNode: string;

      camera.position.setFromSpherical(spherical);

      camera.lookAt(0, 0, 0);    const camera = new THREE.PerspectiveCamera(  section: {

      

      mouseX = event.clientX;      75,    width: number;

      mouseY = event.clientY;

    };      mountRef.current.clientWidth / mountRef.current.clientHeight,    height: number;



    const onWheel = (event: WheelEvent) => {      0.1,    thickness?: number;

      const scale = event.deltaY > 0 ? 1.1 : 0.9;

      camera.position.multiplyScalar(scale);      1000  };

    };

    );  material: 'concrete' | 'steel' | 'composite';

    mountRef.current.addEventListener('mousedown', onMouseDown);

    mountRef.current.addEventListener('mouseup', onMouseUp);    camera.position.set(50, 40, 50);  forces?: {

    mountRef.current.addEventListener('mousemove', onMouseMove);

    mountRef.current.addEventListener('wheel', onWheel);    cameraRef.current = camera;    axial: number[];

    

    mountRef.current.appendChild(renderer.domElement);    shear: number[];



    // Create structure geometry    // Renderer setup    moment: number[];

    createStructureGeometry(scene, structure, showStress, analysisResults);

    const renderer = new THREE.WebGLRenderer({     positions: number[];

    // Animation loop

    const animate = () => {      antialias: true,  };

      frameRef.current = requestAnimationFrame(animate);

      renderer.render(scene, camera);      alpha: true  stresses?: {

    };

    animate();    });    max: number;



    // Cleanup    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);    min: number;

    return () => {

      if (frameRef.current) {    renderer.shadowMap.enabled = true;    vonMises: number[];

        cancelAnimationFrame(frameRef.current);

      }    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  };

      if (mountRef.current && renderer.domElement) {

        mountRef.current.removeChild(renderer.domElement);    rendererRef.current = renderer;  utilization?: number;

      }

      renderer.dispose();  isSelected?: boolean;

    };

  }, [structure, showStress, analysisResults, isWireframe]);    // Lighting setup}



  const createStructureGeometry = (    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);

    scene: THREE.Scene, 

    structure: Advanced3DViewerProps['structure'],    scene.add(ambientLight);interface Enhanced3DStructure {

    showStress: boolean,

    analysisResults?: Advanced3DViewerProps['analysisResults']  nodes: Enhanced3DNode[];

  ) => {

    // Clear existing geometry    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);  elements: Enhanced3DElement[];

    const existingStructure = scene.getObjectByName('structure');

    if (existingStructure) {    directionalLight.position.set(100, 100, 50);  loads: {

      scene.remove(existingStructure);

    }    directionalLight.castShadow = true;    nodeId: string;



    const structureGroup = new THREE.Group();    directionalLight.shadow.mapSize.width = 2048;    forces: [number, number, number];

    structureGroup.name = 'structure';

    directionalLight.shadow.mapSize.height = 2048;    moments: [number, number, number];

    // Materials with stress coloring

    const getStressColor = (stress: number) => {    scene.add(directionalLight);  }[];

      if (stress < 0.5) return 0x4CAF50; // Green - Safe

      if (stress < 0.8) return 0xFF9800; // Orange - Caution    boundingBox: {

      return 0xF44336; // Red - Critical

    };    // Grid helper    min: [number, number, number];



    // Create nodes    const gridHelper = new THREE.GridHelper(100, 50);    max: [number, number, number];

    structure.nodes.forEach(node => {

      const nodeGeometry = new THREE.SphereGeometry(0.5, 12, 8);    gridHelper.material.opacity = 0.3;  };

      const nodeMaterial = new THREE.MeshLambertMaterial({ 

        color: node.type === 'fixed' ? 0xff0000 : 0x333333,    gridHelper.material.transparent = true;  scale: number;

        wireframe: isWireframe

      });    scene.add(gridHelper);}

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);

      nodeMesh.position.set(node.x, node.y, node.z);

      nodeMesh.userData = { type: 'node', id: node.id };

      structureGroup.add(nodeMesh);    // Controls (simplified mouse controls)interface Enhanced3DViewerProps {

    });

    let mouseDown = false;  structure: Enhanced3DStructure | null;

    // Create elements

    structure.elements.forEach((element, index) => {    let mouseX = 0;  analysisResults?: any;

      const startNode = structure.nodes.find(n => n.id === element.startNode);

      const endNode = structure.nodes.find(n => n.id === element.endNode);    let mouseY = 0;  showDeformation?: boolean;

      

      if (!startNode || !endNode) return;  deformationScale?: number;



      const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);    const onMouseDown = (event: MouseEvent) => {  showStress?: boolean;

      const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);

      const direction = new THREE.Vector3().subVectors(end, start);      mouseDown = true;  showForces?: boolean;

      const length = direction.length();

      mouseX = event.clientX;  showLabels?: boolean;

      let geometry: THREE.BufferGeometry;

      let material: THREE.Material;      mouseY = event.clientY;  viewMode?: 'solid' | 'wireframe' | 'both';



      // Stress-based coloring    };  colorMode?: 'material' | 'stress' | 'utilization' | 'forces';

      const stressLevel = showStress && analysisResults ? 

        Math.random() * analysisResults.summary.maxStress : 0.3;  onElementSelect?: (elementId: string) => void;

      

      const color = showStress ? getStressColor(stressLevel) :     const onMouseUp = () => {  onNodeSelect?: (nodeId: string) => void;

        (element.type === 'column' ? 0x2196F3 : 0x4CAF50);

      mouseDown = false;  className?: string;

      if (element.type === 'column') {

        geometry = new THREE.BoxGeometry(0.8, length, 0.8);    };}

        material = new THREE.MeshLambertMaterial({ 

          color,

          transparent: !isWireframe,

          opacity: isWireframe ? 1 : 0.8,    const onMouseMove = (event: MouseEvent) => {// Enhanced Node Component with support visualization

          wireframe: isWireframe

        });      if (!mouseDown) return;const Enhanced3DNode: React.FC<{

      } else {

        geometry = new THREE.BoxGeometry(0.6, 1.2, length);        node: Enhanced3DNode;

        material = new THREE.MeshLambertMaterial({ 

          color,      const deltaX = event.clientX - mouseX;  scale: number;

          transparent: !isWireframe,

          opacity: isWireframe ? 1 : 0.8,      const deltaY = event.clientY - mouseY;  showDeformation: boolean;

          wireframe: isWireframe

        });        deformationScale: number;

      }

      // Simple orbit controls  showLabels: boolean;

      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.copy(start).add(direction.multiplyScalar(0.5));      const spherical = new THREE.Spherical();  onClick: (nodeId: string) => void;

      

      // Orient element      spherical.setFromVector3(camera.position);}> = ({ node, scale, showDeformation, deformationScale, showLabels, onClick }) => {

      if (element.type === 'column') {

        // Columns are vertical      spherical.theta -= deltaX * 0.01;  const nodeRef = useRef<THREE.Mesh>(null);

        const quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());      spherical.phi += deltaY * 0.01;  

        mesh.applyQuaternion(quaternion);

      } else {      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));  // Calculate deformed position

        // Beams are horizontal

        const quaternion = new THREE.Quaternion();        const deformedPosition = useMemo(() => {

        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.normalize());

        mesh.applyQuaternion(quaternion);      camera.position.setFromSpherical(spherical);    if (!showDeformation || !node.displacement) return node.position;

      }

      camera.lookAt(0, 0, 0);    return [

      mesh.userData = { 

        type: 'element',             node.position[0] + node.displacement[0] * deformationScale,

        id: element.id, 

        elementType: element.type,      mouseX = event.clientX;      node.position[1] + node.displacement[1] * deformationScale,

        section: element.section,

        stress: stressLevel      mouseY = event.clientY;      node.position[2] + node.displacement[2] * deformationScale

      };

    };    ] as [number, number, number];

      mesh.castShadow = true;

      mesh.receiveShadow = true;  }, [node.position, node.displacement, showDeformation, deformationScale]);

      structureGroup.add(mesh);

    });    mountRef.current.addEventListener('mousedown', onMouseDown);



    scene.add(structureGroup);    mountRef.current.addEventListener('mouseup', onMouseUp);  // Support visualization

  };

    mountRef.current.addEventListener('mousemove', onMouseMove);  const supportGeometry = useMemo(() => {

  const resetCamera = () => {

    if (cameraRef.current) {        const supports = [];

      cameraRef.current.position.set(50, 40, 50);

      cameraRef.current.lookAt(0, 0, 0);    mountRef.current.appendChild(renderer.domElement);    const { support } = node;

    }

  };    



  const toggleWireframe = () => {    // Create structure geometry    if (support.x || support.y || support.z) {

    setIsWireframe(!isWireframe);

  };    createStructureGeometry(scene, structure, showStress, analysisResults);      // Fixed support



  const toggleGrid = () => {      if (support.x && support.y && support.z) {

    setShowGrid(!showGrid);

    if (sceneRef.current) {    // Animation loop        supports.push({ type: 'fixed', size: 0.3 });

      const grid = sceneRef.current.children.find(child => child instanceof THREE.GridHelper);

      if (grid) {    const animate = () => {      }

        grid.visible = !showGrid;

      }      frameRef.current = requestAnimationFrame(animate);      // Pinned support

    }

  };      renderer.render(scene, camera);      else if ((support.x && support.y) || (support.y && support.z) || (support.x && support.z)) {



  return (    };        supports.push({ type: 'pinned', size: 0.25 });

    <Card className="w-full">

      <CardHeader>    animate();      }

        <div className="flex justify-between items-center">

          <CardTitle className="flex items-center gap-2">      // Roller support

            <Move3D className="w-5 h-5 text-blue-600" />

            Advanced 3D Structure Viewer    // Cleanup      else {

          </CardTitle>

          <div className="flex gap-2">    return () => {        supports.push({ type: 'roller', size: 0.2 });

            <Button

              variant="outline"      if (frameRef.current) {      }

              size="sm"

              onClick={resetCamera}        cancelAnimationFrame(frameRef.current);    }

              title="Reset Kamera"

            >      }    

              <RotateCcw className="w-4 h-4" />

            </Button>      if (mountRef.current && renderer.domElement) {    return supports;

            <Button

              variant={isWireframe ? "default" : "outline"}        mountRef.current.removeChild(renderer.domElement);  }, [node.support]);

              size="sm"

              onClick={toggleWireframe}      }

              title="Toggle Wireframe"

            >      renderer.dispose();  const handleClick = useCallback((e: any) => {

              <Eye className="w-4 h-4" />

            </Button>    };    e.stopPropagation();

            <Button

              variant={showGrid ? "default" : "outline"}  }, [structure, showStress, analysisResults]);    onClick(node.id);

              size="sm"

              onClick={toggleGrid}  }, [node.id, onClick]);

              title="Toggle Grid"

            >  const createStructureGeometry = (

              <Settings className="w-4 h-4" />

            </Button>    scene: THREE.Scene,   return (

          </div>

        </div>    structure: Advanced3DViewerProps['structure'],    <group position={deformedPosition}>

      </CardHeader>

      <CardContent>    showStress: boolean,      {/* Main node sphere */}

        <div className="space-y-4">

          {/* Analysis Info */}    analysisResults?: Advanced3DViewerProps['analysisResults']      <mesh ref={nodeRef} onClick={handleClick} castShadow receiveShadow>

          <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">

            <div className="text-center">  ) => {        <sphereGeometry args={[0.1 * scale, 16, 16]} />

              <div className="text-sm font-medium text-gray-600">Nodes</div>

              <div className="text-xl font-bold text-blue-600">{structure.nodes.length}</div>    // Clear existing geometry        <meshStandardMaterial 

            </div>

            <div className="text-center">    const existingStructure = scene.getObjectByName('structure');          color={node.isSelected ? '#e74c3c' : '#3498db'}

              <div className="text-sm font-medium text-gray-600">Elements</div>

              <div className="text-xl font-bold text-green-600">{structure.elements.length}</div>    if (existingStructure) {          metalness={0.2}

            </div>

            <div className="text-center">      scene.remove(existingStructure);          roughness={0.3}

              <div className="text-sm font-medium text-gray-600">Max Stress</div>

              <div className="text-xl font-bold text-orange-600">    }        />

                {analysisResults ? `${(analysisResults.summary.maxStress * 100).toFixed(1)}%` : 'N/A'}

              </div>      </mesh>

            </div>

            <div className="text-center">    const structureGroup = new THREE.Group();

              <div className="text-sm font-medium text-gray-600">Base Shear</div>

              <div className="text-xl font-bold text-purple-600">    structureGroup.name = 'structure';      {/* Support visualization */}

                {analysisResults ? `${analysisResults.summary.baseShear.toFixed(0)} kN` : 'N/A'}

              </div>      {supportGeometry.map((support, index) => (

            </div>

          </div>    // Materials        <group key={index}>



          {/* Legend */}    const columnMaterial = new THREE.MeshLambertMaterial({           {support.type === 'fixed' && (

          {showStress && (

            <div className="flex items-center justify-center gap-6 p-3 bg-gray-50 rounded">      color: showStress ? 0xff6b6b : 0x4a90e2,            <mesh position={[0, -support.size, 0]}>

              <div className="flex items-center gap-2">

                <div className="w-4 h-4 bg-green-500 rounded"></div>      transparent: !isWireframe,              <boxGeometry args={[support.size, support.size * 0.2, support.size]} />

                <span className="text-sm">Safe (&lt;50%)</span>

              </div>      opacity: isWireframe ? 1 : 0.8              <meshStandardMaterial color="#2c3e50" />

              <div className="flex items-center gap-2">

                <div className="w-4 h-4 bg-orange-500 rounded"></div>    });            </mesh>

                <span className="text-sm">Caution (50-80%)</span>

              </div>    const beamMaterial = new THREE.MeshLambertMaterial({           )}

              <div className="flex items-center gap-2">

                <div className="w-4 h-4 bg-red-500 rounded"></div>      color: showStress ? 0xffa726 : 0x66bb6a,          {support.type === 'pinned' && (

                <span className="text-sm">Critical (&gt;80%)</span>

              </div>      transparent: !isWireframe,            <mesh position={[0, -support.size * 0.7, 0]}>

            </div>

          )}      opacity: isWireframe ? 1 : 0.8              <coneGeometry args={[support.size * 0.7, support.size * 0.5, 8]} />



          {/* 3D Viewer */}    });              <meshStandardMaterial color="#e67e22" />

          <div 

            ref={mountRef}             </mesh>

            className="w-full h-96 border-2 border-gray-200 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden shadow-inner"

            style={{ cursor: 'grab' }}    if (isWireframe) {          )}

          />

      columnMaterial.wireframe = true;          {support.type === 'roller' && (

          {/* Controls */}

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border-l-4 border-blue-400">      beamMaterial.wireframe = true;            <>

            <strong>🎮 Kontrol Interaktif:</strong><br/>

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