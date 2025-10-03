/**
 * Advanced 3D Visualization Engine
 * Enhanced WebGL rendering, realistic animations, lighting controls, material legends
 * Professional visualization features for structural engineering applications
 */

import React, { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, Text, Html, Environment, ContactShadows, 
  useGLTF, useTexture, Lightformer, AccumulativeShadows,
  RandomizedLight, Sphere, useHelper, Stats, Edges,
  Float, MeshReflectorMaterial, BakeShadows, SoftShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  Sun, Moon, Lightbulb, Eye, EyeOff, Play, Pause, 
  RotateCcw, ZoomIn, ZoomOut, Settings, Palette,
  Layers, Activity, Monitor, Camera, Download,
  Grid3X3, Volume2, VolumeX, Maximize, Minimize
} from 'lucide-react';

interface VisualizationSettings {
  // Lighting
  ambientIntensity: number;
  directionalIntensity: number;
  shadows: boolean;
  environmentPreset: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city';
  
  // Materials and Rendering
  materialQuality: 'low' | 'medium' | 'high' | 'ultra';
  wireframe: boolean;
  transparency: boolean;
  reflections: boolean;
  postProcessing: boolean;
  
  // Animation
  animationSpeed: number;
  autoRotate: boolean;
  enablePhysics: boolean;
  particleEffects: boolean;
  
  // Information Display
  showLabels: boolean;
  showGrid: boolean;
  showAxes: boolean;
  showLoadPaths: boolean;
  showStressVisualization: boolean;
  showDeformation: boolean;
  
  // Performance
  levelOfDetail: boolean;
  frustumCulling: boolean;
  occlusionCulling: boolean;
  adaptiveQuality: boolean;
}

interface StructuralElement {
  id: string;
  type: 'beam' | 'column' | 'slab' | 'foundation' | 'connection';
  geometry: THREE.BufferGeometry;
  material: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  stress?: number;
  displacement?: [number, number, number];
  force?: [number, number, number];
  properties: Record<string, any>;
}

interface VisualizationState {
  selectedElements: string[];
  currentTime: number;
  animationDuration: number;
  isPlaying: boolean;
  viewMode: 'realistic' | 'technical' | 'analysis' | 'presentation';
  cameraPreset: 'iso' | 'front' | 'side' | 'top' | 'perspective';
}

const Advanced3DVisualizationEngine: React.FC = () => {
  const [settings, setSettings] = useState<VisualizationSettings>({
    // Lighting defaults
    ambientIntensity: 0.5,
    directionalIntensity: 1.0,
    shadows: true,
    environmentPreset: 'warehouse',
    
    // Materials
    materialQuality: 'high',
    wireframe: false,
    transparency: false,
    reflections: true,
    postProcessing: true,
    
    // Animation
    animationSpeed: 1.0,
    autoRotate: false,
    enablePhysics: false,
    particleEffects: false,
    
    // Display
    showLabels: true,
    showGrid: true,
    showAxes: true,
    showLoadPaths: false,
    showStressVisualization: false,
    showDeformation: false,
    
    // Performance
    levelOfDetail: true,
    frustumCulling: true,
    occlusionCulling: false,
    adaptiveQuality: true
  });

  const [state, setState] = useState<VisualizationState>({
    selectedElements: [],
    currentTime: 0,
    animationDuration: 10,
    isPlaying: false,
    viewMode: 'realistic',
    cameraPreset: 'iso'
  });

  const [showControls, setShowControls] = useState(true);
  const [showMaterialLegend, setShowMaterialLegend] = useState(true);
  const [showInfoPanel, setShowInfoPanel] = useState(true);
  const [performanceStats, setPerformanceStats] = useState({
    fps: 60,
    triangles: 0,
    drawCalls: 0,
    memoryUsage: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<any>(null);

  // Sample structural elements for demonstration
  const structuralElements: StructuralElement[] = useMemo(() => [
    {
      id: 'beam-1',
      type: 'beam',
      geometry: new THREE.BoxGeometry(6, 0.3, 0.4),
      material: 'steel',
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      stress: 150,
      properties: { section: 'WF 300x150', grade: 'BjTS-50' }
    },
    {
      id: 'column-1',
      type: 'column',
      geometry: new THREE.BoxGeometry(0.3, 4, 0.3),
      material: 'concrete',
      position: [-3, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      stress: 200,
      properties: { section: '300x300', grade: 'K-300' }
    },
    {
      id: 'column-2',
      type: 'column',
      geometry: new THREE.BoxGeometry(0.3, 4, 0.3),
      material: 'concrete',
      position: [3, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      stress: 180,
      properties: { section: '300x300', grade: 'K-300' }
    },
    {
      id: 'foundation-1',
      type: 'foundation',
      geometry: new THREE.BoxGeometry(8, 0.5, 2),
      material: 'concrete',
      position: [0, -2.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      stress: 50,
      properties: { type: 'Strip Foundation', depth: '1.5m' }
    }
  ], []);

  // Material library with realistic properties
  const materialLibrary = useMemo(() => ({
    steel: {
      name: 'Structural Steel',
      color: '#8B9DC3',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#000000',
      envMapIntensity: 1.0
    },
    concrete: {
      name: 'Reinforced Concrete',
      color: '#D3D3D3',
      metalness: 0.0,
      roughness: 0.8,
      emissive: '#000000',
      envMapIntensity: 0.2
    },
    timber: {
      name: 'Engineered Timber',
      color: '#DEB887',
      metalness: 0.0,
      roughness: 0.6,
      emissive: '#000000',
      envMapIntensity: 0.3
    },
    composite: {
      name: 'Composite Material',
      color: '#2F4F4F',
      metalness: 0.3,
      roughness: 0.4,
      emissive: '#000000',
      envMapIntensity: 0.7
    }
  }), []);

  // Professional lighting setup
  const LightingRig: React.FC = () => {
    const lightRef = useRef<THREE.DirectionalLight>(null);
    
    // useHelper(lightRef, THREE.DirectionalLightHelper, 1);

    return (
      <>
        <ambientLight intensity={settings.ambientIntensity} />
        <directionalLight 
          ref={lightRef}
          position={[10, 10, 5]} 
          intensity={settings.directionalIntensity}
          castShadow={settings.shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {settings.environmentPreset !== 'night' && (
          <Lightformer
            intensity={2}
            color="white"
            position={[0, 5, -9]}
            rotation={[0, 0, Math.PI / 3]}
            target={[0, 0, 0]}
          />
        )}
      </>
    );
  };

  // Enhanced structural element component
  const StructuralElementComponent: React.FC<{ 
    element: StructuralElement;
    isSelected: boolean;
    animationTime: number;
  }> = ({ element, isSelected, animationTime }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    const material = materialLibrary[element.material] || materialLibrary.steel;
    
    // Stress color mapping
    const stressColor = useMemo(() => {
      if (!settings.showStressVisualization || !element.stress) return material.color;
      
      const normalizedStress = Math.min(element.stress / 300, 1); // Normalize to 300 MPa max
      const hue = (1 - normalizedStress) * 240; // Blue to red
      return `hsl(${hue}, 70%, 50%)`;
    }, [element.stress, settings.showStressVisualization, material.color]);

    // Animation effects
    useFrame((frameState) => {
      if (!meshRef.current) return;

      // Deformation animation
      if (settings.showDeformation && element.displacement) {
        const scale = Math.sin(animationTime * 2) * 0.1 + 1;
        meshRef.current.scale.setScalar(scale);
      }

      // Auto-rotation
      if (settings.autoRotate && element.type === 'beam') {
        meshRef.current.rotation.z += 0.01;
      }
    });

    return (
      <group position={element.position} rotation={element.rotation}>
        <mesh 
          ref={meshRef}
          geometry={element.geometry}
          onClick={() => handleElementClick(element.id)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={stressColor}
            metalness={material.metalness}
            roughness={material.roughness}
            wireframe={settings.wireframe}
            transparent={settings.transparency}
            opacity={settings.transparency ? 0.8 : 1.0}
            envMapIntensity={material.envMapIntensity}
            emissive={isSelected ? '#ff6b6b' : hovered ? '#4ecdc4' : material.emissive}
            emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
          />
          
          {settings.wireframe && !settings.materialQuality && (
            <Edges color="#ffffff" lineWidth={1} />
          )}
        </mesh>

        {(settings.showLabels || hovered) && (
          <Text
            position={[0, element.geometry.parameters.height / 2 + 0.5, 0]}
            fontSize={0.2}
            color="#2c3e50"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {element.id.toUpperCase()}
          </Text>
        )}

        {hovered && (
          <Html position={[0, element.geometry.parameters.height / 2 + 1, 0]} center>
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 pointer-events-none min-w-48">
              <h4 className="font-bold text-gray-800 mb-2">{element.id.toUpperCase()}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Type:</strong> {element.type}</div>
                <div><strong>Material:</strong> {material.name}</div>
                {element.stress && (
                  <div className="text-red-600">
                    <strong>Stress:</strong> {element.stress.toFixed(1)} MPa
                  </div>
                )}
                {Object.entries(element.properties).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          </Html>
        )}
      </group>
    );
  };

  // Scene environment and effects
  const SceneEnvironment: React.FC = () => (
    <>
      <Environment preset={settings.environmentPreset} />
      
      {settings.shadows && (
        <AccumulativeShadows 
          temporal 
          frames={100} 
          color="#9d4b4b" 
          colorBlend={0.5} 
          alphaTest={0.9} 
          scale={20}
          position={[0, -3, 0]}
        >
          <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
        </AccumulativeShadows>
      )}

      {settings.showGrid && (
        <gridHelper args={[20, 20, '#888888', '#444444']} position={[0, -3, 0]} />
      )}

      {settings.showAxes && (
        <axesHelper args={[5]} />
      )}

      {settings.reflections && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      )}
    </>
  );

  // Handle element selection
  const handleElementClick = useCallback((elementId: string) => {
    setState(prev => ({
      ...prev,
      selectedElements: prev.selectedElements.includes(elementId)
        ? prev.selectedElements.filter(id => id !== elementId)
        : [...prev.selectedElements, elementId]
    }));
  }, []);

  // Animation controls
  const toggleAnimation = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  // Camera presets
  const setCameraPreset = useCallback((preset: VisualizationState['cameraPreset']) => {
    setState(prev => ({ ...prev, cameraPreset: preset }));
    
    if (controlsRef.current) {
      const controls = controlsRef.current;
      switch (preset) {
        case 'iso':
          controls.object.position.set(10, 10, 10);
          break;
        case 'front':
          controls.object.position.set(0, 0, 15);
          break;
        case 'side':
          controls.object.position.set(15, 0, 0);
          break;
        case 'top':
          controls.object.position.set(0, 15, 0);
          break;
        case 'perspective':
          controls.object.position.set(8, 6, 12);
          break;
      }
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, []);

  // Export screenshot
  const exportScreenshot = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `structural-view-${new Date().toISOString().slice(0, 19)}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  }, []);

  // Animation loop
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentTime: (prev.currentTime + 0.1 * settings.animationSpeed) % prev.animationDuration
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [state.isPlaying, settings.animationSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Advanced 3D Visualization Engine</h1>
              <p className="text-white/70 text-sm">Professional structural engineering visualization</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Controls</span>
            </button>
            
            <button
              onClick={exportScreenshot}
              className="px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm flex items-center space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas
            ref={canvasRef}
            shadows={settings.shadows}
            camera={{ position: [10, 10, 10], fov: 50 }}
            gl={{ 
              antialias: settings.materialQuality !== 'low',
              powerPreference: "high-performance",
              alpha: false
            }}
            onCreated={({ gl }) => {
              gl.setClearColor('#0f172a');
              if (settings.postProcessing) {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.25;
              }
            }}
          >
            <Suspense fallback={null}>
              <LightingRig />
              <SceneEnvironment />
              
              {structuralElements.map((element) => (
                <StructuralElementComponent
                  key={element.id}
                  element={element}
                  isSelected={state.selectedElements.includes(element.id)}
                  animationTime={state.currentTime}
                />
              ))}

              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                autoRotate={settings.autoRotate}
                autoRotateSpeed={2}
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI}
              />

              {settings.materialQuality === 'ultra' && <Stats />}
            </Suspense>
          </Canvas>

          {/* Animation Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 backdrop-blur-lg rounded-lg p-4 flex items-center space-x-3">
              <button
                onClick={toggleAnimation}
                className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {state.isPlaying ? 
                  <Pause className="w-5 h-5 text-white" /> : 
                  <Play className="w-5 h-5 text-white" />
                }
              </button>
              
              <div className="text-white text-sm">
                Time: {state.currentTime.toFixed(1)}s / {state.animationDuration}s
              </div>
              
              <input
                type="range"
                min="0"
                max={state.animationDuration}
                step="0.1"
                value={state.currentTime}
                onChange={(e) => setState(prev => ({ 
                  ...prev, 
                  currentTime: parseFloat(e.target.value) 
                }))}
                className="w-32"
              />
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        {showControls && (
          <div className="w-80 bg-white/10 backdrop-blur-lg border-l border-white/20 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* View Controls */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  View Controls
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['iso', 'front', 'side', 'top'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCameraPreset(preset as any)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        state.cameraPreset === preset
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {preset.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Controls */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Lighting
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-white text-sm mb-1 block">Ambient</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.ambientIntensity}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        ambientIntensity: parseFloat(e.target.value) 
                      }))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white text-sm mb-1 block">Directional</label>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="0.1"
                      value={settings.directionalIntensity}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        directionalIntensity: parseFloat(e.target.value) 
                      }))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="shadows"
                      checked={settings.shadows}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        shadows: e.target.checked 
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="shadows" className="text-white text-sm">Shadows</label>
                  </div>
                </div>
              </div>

              {/* Material Controls */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Materials
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="wireframe"
                      checked={settings.wireframe}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        wireframe: e.target.checked 
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="wireframe" className="text-white text-sm">Wireframe</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="reflections"
                      checked={settings.reflections}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        reflections: e.target.checked 
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="reflections" className="text-white text-sm">Reflections</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="stressViz"
                      checked={settings.showStressVisualization}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        showStressVisualization: e.target.checked 
                      }))}
                      className="rounded"
                    />
                    <label htmlFor="stressViz" className="text-white text-sm">Stress Colors</label>
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Layers className="w-4 h-4 mr-2" />
                  Display
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'showLabels', label: 'Labels' },
                    { key: 'showGrid', label: 'Grid' },
                    { key: 'showAxes', label: 'Axes' },
                    { key: 'showDeformation', label: 'Deformation' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={settings[key as keyof VisualizationSettings] as boolean}
                        onChange={(e) => setSettings(prev => ({ 
                          ...prev, 
                          [key]: e.target.checked 
                        }))}
                        className="rounded"
                      />
                      <label htmlFor={key} className="text-white text-sm">{label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Material Legend */}
        {showMaterialLegend && (
          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-lg rounded-lg p-4 w-64">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Material Legend
            </h3>
            <div className="space-y-2">
              {Object.entries(materialLibrary).map(([key, material]) => (
                <div key={key} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded border border-white/30"
                    style={{ backgroundColor: material.color }}
                  />
                  <span className="text-white text-sm">{material.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advanced3DVisualizationEngine;