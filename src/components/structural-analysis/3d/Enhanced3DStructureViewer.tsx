/**
 * Enhanced 3D Structure Viewer with Functional Checklist and Material-Based Grid
 * Improved element visibility controls and material-based visualization
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  Eye, EyeOff, Grid3X3, Move3D, Zap, 
  Settings, Palette, Info, AlertTriangle 
} from 'lucide-react';
import { Element, Node, Structure3D } from '../../../types/structural';

// Enhanced Element Visibility Configuration
interface ElementVisibilityConfig {
  beams: boolean;
  columns: boolean;
  slabs: boolean;
  walls: boolean;
  foundations: boolean;
  piles: boolean;
  connections: boolean;
  loads: boolean;
  supports: boolean;
}

interface MaterialVisualizationConfig {
  concrete: { color: string; opacity: number; wireframe: boolean };
  steel: { color: string; opacity: number; wireframe: boolean };
  composite: { color: string; opacity: number; wireframe: boolean };
  reinforcement: { color: string; opacity: number; wireframe: boolean };
}

interface GridConfig {
  show: boolean;
  materialBased: boolean;
  size: number;
  divisions: number;
  colorScheme: 'material' | 'stress' | 'utilization';
  axisLabels: boolean;
}

interface DeformationConfig {
  show: boolean;
  scale: number;
  colorMap: 'stress' | 'displacement' | 'utilization';
  minColor: string;
  maxColor: string;
}

interface Enhanced3DViewerProps {
  structure: Structure3D | null;
  analysisResults?: {
    elementStresses?: Record<number, number>;
    elementUtilization?: Record<number, number>;
    nodeDisplacements?: Record<number, { x: number; y: number; z: number }>;
    maxStress?: number;
    maxUtilization?: number;
  };
  onElementClick?: (element: Element) => void;
  onNodeClick?: (node: Node) => void;
  className?: string;
}

// Enhanced Material-Based Grid Component
const MaterialBasedGrid = memo(({ 
  config, 
  structure 
}: { 
  config: GridConfig; 
  structure: Structure3D | null; 
}) => {
  if (!config.show || !structure) return null;

  const materialGrids = useMemo(() => {
    const grids: Array<{ position: [number, number, number]; color: string; material: string }> = [];
    
    if (config.materialBased && structure.elements) {
      // Create material-specific grids based on element locations
      const materialZones = new Map<string, Array<{ x: number; y: number; z: number }>>();
      
      structure.elements.forEach(element => {
        const material = element.materialType || 'concrete';
        const startNode = structure.nodes.find(n => n.id === element.nodes[0]);
        const endNode = structure.nodes.find(n => n.id === element.nodes[1]);
        
        if (startNode && endNode) {
          const centerX = (startNode.x + endNode.x) / 2;
          const centerY = (startNode.y + endNode.y) / 2;
          const centerZ = (startNode.z + endNode.z) / 2;
          
          if (!materialZones.has(material)) {
            materialZones.set(material, []);
          }
          materialZones.get(material)!.push({ x: centerX, y: centerY, z: centerZ });
        }
      });

      // Generate grids for each material zone
      materialZones.forEach((positions, material) => {
        const avgX = positions.reduce((sum, pos) => sum + pos.x, 0) / positions.length;
        const avgY = positions.reduce((sum, pos) => sum + pos.y, 0) / positions.length;
        const avgZ = positions.reduce((sum, pos) => sum + pos.z, 0) / positions.length;
        
        const materialColor = getMaterialColor(material);
        grids.push({
          position: [avgX, avgY, avgZ],
          color: materialColor,
          material: material
        });
      });
    }

    return grids;
  }, [config, structure]);

  const getMaterialColor = (material: string): string => {
    switch (material) {
      case 'concrete': return '#95a5a6';
      case 'steel': return '#34495e';
      case 'composite': return '#7f8c8d';
      case 'concrete-steel': return '#8e44ad';
      default: return '#bdc3c7';
    }
  };

  return (
    <group>
      {/* Main coordinate grid */}
      <gridHelper 
        args={[config.size, config.divisions, '#666666', '#333333']} 
        position={[0, 0, 0]}
      />
      
      {/* Vertical grid for elevation reference */}
      <gridHelper 
        args={[config.size, config.divisions, '#666666', '#333333']} 
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Material-based zone grids */}
      {config.materialBased && materialGrids.map((grid, index) => (
        <group key={index} position={grid.position}>
          <gridHelper 
            args={[10, 10, grid.color, grid.color]} 
            position={[0, 0, 0]}
          />
          <Html position={[0, 2, 0]}>
            <div className="bg-white/90 px-2 py-1 rounded text-xs font-medium border">
              {grid.material.toUpperCase()}
            </div>
          </Html>
        </group>
      ))}

      {/* Axis labels */}
      {config.axisLabels && (
        <group>
          <Text
            position={[config.size / 2, 0, 0]}
            rotation={[0, 0, 0]}
            fontSize={2}
            color="#e74c3c"
            anchorX="center"
            anchorY="middle"
          >
            X
          </Text>
          <Text
            position={[0, config.size / 2, 0]}
            rotation={[0, 0, 0]}
            fontSize={2}
            color="#27ae60"
            anchorX="center"
            anchorY="middle"
          >
            Y
          </Text>
          <Text
            position={[0, 0, config.size / 2]}
            rotation={[Math.PI / 2, 0, 0]}
            fontSize={2}
            color="#3498db"
            anchorX="center"
            anchorY="middle"
          >
            Z
          </Text>
        </group>
      )}
    </group>
  );
});

// Enhanced Element Renderer with deformation visualization
const EnhancedElementRenderer = memo(({ 
  element, 
  nodes, 
  visible, 
  materialConfig,
  deformationConfig,
  analysisResults,
  onElementClick 
}: {
  element: Element;
  nodes: Node[];
  visible: boolean;
  materialConfig: MaterialVisualizationConfig;
  deformationConfig: DeformationConfig;
  analysisResults?: Enhanced3DViewerProps['analysisResults'];
  onElementClick?: (element: Element) => void;
}) => {
  if (!visible) return null;

  const startNode = nodes.find(n => n.id === element.nodes[0]);
  const endNode = nodes.find(n => n.id === element.nodes[1]);

  if (!startNode || !endNode) return null;

  // Calculate element properties
  const start = new THREE.Vector3(startNode.x, startNode.y, startNode.z);
  const end = new THREE.Vector3(endNode.x, endNode.y, endNode.z);
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  // Apply deformation if available
  let deformedCenter = center.clone();
  if (deformationConfig.show && analysisResults?.nodeDisplacements) {
    const startDisp = analysisResults.nodeDisplacements[startNode.id];
    const endDisp = analysisResults.nodeDisplacements[endNode.id];
    
    if (startDisp && endDisp) {
      const avgDispX = (startDisp.x + endDisp.x) / 2 * deformationConfig.scale;
      const avgDispY = (startDisp.y + endDisp.y) / 2 * deformationConfig.scale;
      const avgDispZ = (startDisp.z + endDisp.z) / 2 * deformationConfig.scale;
      
      deformedCenter.add(new THREE.Vector3(avgDispX, avgDispY, avgDispZ));
    }
  }

  // Determine material and color
  const materialType = element.materialType || 'concrete';
  const baseConfig = materialConfig[materialType as keyof MaterialVisualizationConfig];
  
  // Color mapping based on analysis results
  let elementColor = baseConfig.color;
  if (deformationConfig.show && analysisResults) {
    const stress = analysisResults.elementStresses?.[element.id] || 0;
    const utilization = analysisResults.elementUtilization?.[element.id] || 0;
    const maxValue = deformationConfig.colorMap === 'stress' 
      ? analysisResults.maxStress || 1
      : analysisResults.maxUtilization || 1;
    
    const ratio = deformationConfig.colorMap === 'stress' 
      ? Math.abs(stress) / maxValue 
      : utilization;
    
    elementColor = interpolateColor(
      deformationConfig.minColor,
      deformationConfig.maxColor,
      Math.min(ratio, 1)
    );
  }

  // Element geometry based on type
  const getElementGeometry = () => {
    const baseScale = 0.1;
    switch (element.type) {
      case 'column':
        return (
          <boxGeometry 
            args={[
              element.section.width * baseScale,
              length,
              element.section.height * baseScale
            ]} 
          />
        );
      case 'beam':
        return (
          <boxGeometry 
            args={[
              length,
              element.section.height * baseScale,
              element.section.width * baseScale
            ]} 
          />
        );
      case 'slab':
        return (
          <boxGeometry 
            args={[
              Math.max(element.section.width * baseScale, 2),
              element.section.height * baseScale || 0.2,
              Math.max(element.section.height * baseScale, 2)
            ]} 
          />
        );
      default:
        return (
          <cylinderGeometry 
            args={[
              element.section.width * baseScale / 2,
              element.section.height * baseScale / 2,
              length,
              16
            ]} 
          />
        );
    }
  };

  // Element orientation
  const quaternion = new THREE.Quaternion();
  if (element.type === 'column') {
    quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize()
    );
  } else {
    quaternion.setFromUnitVectors(
      new THREE.Vector3(1, 0, 0),
      direction.clone().normalize()
    );
  }

  return (
    <group position={deformedCenter.toArray()} quaternion={quaternion.toArray()}>
      <mesh 
        onClick={() => onElementClick?.(element)}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
        }}
      >
        {getElementGeometry()}
        <meshStandardMaterial
          color={elementColor}
          opacity={baseConfig.opacity}
          transparent={baseConfig.opacity < 1}
          wireframe={baseConfig.wireframe}
          roughness={0.4}
          metalness={materialType === 'steel' ? 0.8 : 0.1}
        />
      </mesh>

      {/* Element label */}
      <Html position={[0, 0, 0]} center>
        <div className="bg-white/90 px-2 py-1 rounded text-xs border pointer-events-none">
          <div className="font-semibold">{element.type?.toUpperCase()}</div>
          <div className="text-gray-600">ID: {element.id}</div>
          {analysisResults?.elementUtilization?.[element.id] && (
            <div className={`text-xs ${
              (analysisResults.elementUtilization[element.id] || 0) > 0.8 
                ? 'text-red-600' 
                : (analysisResults.elementUtilization[element.id] || 0) > 0.5 
                ? 'text-orange-600' 
                : 'text-green-600'
            }`}>
              {((analysisResults.elementUtilization[element.id] || 0) * 100).toFixed(1)}%
            </div>
          )}
        </div>
      </Html>
    </group>
  );
});

// Color interpolation utility
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, factor).getHexString();
};

// Main Enhanced Viewer Component
const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
  structure,
  analysisResults,
  onElementClick,
  onNodeClick,
  className = ""
}) => {
  // State management
  const [elementVisibility, setElementVisibility] = useState<ElementVisibilityConfig>({
    beams: true,
    columns: true,
    slabs: true,
    walls: true,
    foundations: true,
    piles: false,
    connections: true,
    loads: false,
    supports: true
  });

  const [materialConfig, setMaterialConfig] = useState<MaterialVisualizationConfig>({
    concrete: { color: '#95a5a6', opacity: 0.8, wireframe: false },
    steel: { color: '#34495e', opacity: 1.0, wireframe: false },
    composite: { color: '#7f8c8d', opacity: 0.9, wireframe: false },
    reinforcement: { color: '#e67e22', opacity: 0.7, wireframe: false }
  });

  const [gridConfig, setGridConfig] = useState<GridConfig>({
    show: true,
    materialBased: true,
    size: 50,
    divisions: 25,
    colorScheme: 'material',
    axisLabels: true
  });

  const [deformationConfig, setDeformationConfig] = useState<DeformationConfig>({
    show: false,
    scale: 100,
    colorMap: 'utilization',
    minColor: '#2ecc71',
    maxColor: '#e74c3c'
  });

  const [showControls, setShowControls] = useState(true);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  // Event handlers
  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(element);
    onElementClick?.(element);
  }, [onElementClick]);

  const handleVisibilityToggle = useCallback((elementType: keyof ElementVisibilityConfig) => {
    setElementVisibility(prev => ({
      ...prev,
      [elementType]: !prev[elementType]
    }));
  }, []);

  const handleMaterialConfigChange = useCallback((
    materialType: keyof MaterialVisualizationConfig, 
    property: keyof MaterialVisualizationConfig[keyof MaterialVisualizationConfig],
    value: any
  ) => {
    setMaterialConfig(prev => ({
      ...prev,
      [materialType]: {
        ...prev[materialType],
        [property]: value
      }
    }));
  }, []);

  // Render filtered elements
  const visibleElements = useMemo(() => {
    if (!structure?.elements) return [];
    
    return structure.elements.filter(element => {
      switch (element.type) {
        case 'beam': return elementVisibility.beams;
        case 'column': return elementVisibility.columns;
        case 'slab': return elementVisibility.slabs;
        case 'wall': return elementVisibility.walls;
        case 'foundation': return elementVisibility.foundations;
        case 'pile': return elementVisibility.piles;
        default: return true;
      }
    });
  }, [structure?.elements, elementVisibility]);

  if (!structure) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Move3D className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No structure data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [20, 15, 20], fov: 60 }}
        shadows
        className="w-full h-full bg-gradient-to-b from-sky-100 to-blue-50"
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />

        {/* Enhanced Grid System */}
        <MaterialBasedGrid 
          config={gridConfig} 
          structure={structure} 
        />

        {/* Render Elements */}
        {visibleElements.map(element => (
          <EnhancedElementRenderer
            key={element.id}
            element={element}
            nodes={structure.nodes}
            visible={true}
            materialConfig={materialConfig}
            deformationConfig={deformationConfig}
            analysisResults={analysisResults}
            onElementClick={handleElementClick}
          />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          minDistance={5}
          maxDistance={100}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>

      {/* Control Panel */}
      {showControls && (
        <div className="absolute top-4 right-4 w-80 max-h-[80vh] overflow-y-auto">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  3D Controls
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowControls(false)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Element Visibility Controls */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Element Visibility
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(elementVisibility).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleVisibilityToggle(key as keyof ElementVisibilityConfig)}
                        className="rounded"
                      />
                      <span className="capitalize">{key}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grid Configuration */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Grid System
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gridConfig.show}
                      onChange={(e) => setGridConfig(prev => ({ ...prev, show: e.target.checked }))}
                      className="rounded"
                    />
                    Show Grid
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gridConfig.materialBased}
                      onChange={(e) => setGridConfig(prev => ({ ...prev, materialBased: e.target.checked }))}
                      className="rounded"
                    />
                    Material-Based Zones
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={gridConfig.axisLabels}
                      onChange={(e) => setGridConfig(prev => ({ ...prev, axisLabels: e.target.checked }))}
                      className="rounded"
                    />
                    Axis Labels
                  </label>
                </div>
              </div>

              {/* Deformation Visualization */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Deformation & Stress
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deformationConfig.show}
                      onChange={(e) => setDeformationConfig(prev => ({ ...prev, show: e.target.checked }))}
                      className="rounded"
                    />
                    Show Analysis Results
                  </label>
                  {deformationConfig.show && (
                    <div className="ml-6 space-y-2">
                      <div>
                        <label className="text-xs text-gray-600">Color Mapping:</label>
                        <select
                          value={deformationConfig.colorMap}
                          onChange={(e) => setDeformationConfig(prev => ({ 
                            ...prev, 
                            colorMap: e.target.value as 'stress' | 'displacement' | 'utilization' 
                          }))}
                          className="w-full text-xs p-1 border rounded"
                        >
                          <option value="utilization">Element Utilization</option>
                          <option value="stress">Stress Level</option>
                          <option value="displacement">Displacement</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Deformation Scale:</label>
                        <input
                          type="range"
                          min="1"
                          max="500"
                          value={deformationConfig.scale}
                          onChange={(e) => setDeformationConfig(prev => ({ 
                            ...prev, 
                            scale: parseInt(e.target.value) 
                          }))}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500">{deformationConfig.scale}x</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Material Visualization */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Material Properties
                </h4>
                <div className="space-y-2">
                  {Object.entries(materialConfig).map(([material, config]) => (
                    <div key={material} className="space-y-1">
                      <div className="text-xs font-medium capitalize">{material}</div>
                      <div className="flex items-center gap-2 ml-2">
                        <input
                          type="color"
                          value={config.color}
                          onChange={(e) => handleMaterialConfigChange(
                            material as keyof MaterialVisualizationConfig, 
                            'color', 
                            e.target.value
                          )}
                          className="w-6 h-6 rounded"
                        />
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={config.wireframe}
                            onChange={(e) => handleMaterialConfigChange(
                              material as keyof MaterialVisualizationConfig, 
                              'wireframe', 
                              e.target.checked
                            )}
                            className="rounded"
                          />
                          Wire
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={config.opacity}
                          onChange={(e) => handleMaterialConfigChange(
                            material as keyof MaterialVisualizationConfig, 
                            'opacity', 
                            parseFloat(e.target.value)
                          )}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Results Summary */}
              {analysisResults && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Analysis Summary
                  </h4>
                  <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                    <div>Elements: {structure.elements.length}</div>
                    <div>Nodes: {structure.nodes.length}</div>
                    {analysisResults.maxStress && (
                      <div>Max Stress: {analysisResults.maxStress.toFixed(2)} MPa</div>
                    )}
                    {analysisResults.maxUtilization && (
                      <div className={`${
                        analysisResults.maxUtilization > 0.8 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        Max Utilization: {(analysisResults.maxUtilization * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Color Legend */}
              {deformationConfig.show && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Color Legend</h4>
                  <div className="flex items-center text-xs">
                    <div className="flex-1 h-4 rounded" style={{
                      background: `linear-gradient(to right, ${deformationConfig.minColor}, ${deformationConfig.maxColor})`
                    }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>Safe</span>
                    <span>Critical</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show Controls Button (when hidden) */}
      {!showControls && (
        <Button
          className="absolute top-4 right-4"
          onClick={() => setShowControls(true)}
          size="sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}

      {/* Element Information Panel */}
      {selectedElement && (
        <div className="absolute bottom-4 left-4">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="text-sm space-y-1">
                <div className="font-semibold">Selected Element</div>
                <div>Type: {selectedElement.type?.toUpperCase()}</div>
                <div>ID: {selectedElement.id}</div>
                <div>Material: {selectedElement.materialType}</div>
                <div>Section: {selectedElement.section.width} × {selectedElement.section.height}</div>
                {analysisResults?.elementUtilization?.[selectedElement.id] && (
                  <div className="flex items-center gap-2">
                    <span>Utilization:</span>
                    <Badge variant={
                      (analysisResults.elementUtilization[selectedElement.id] || 0) > 0.8 
                        ? 'destructive' 
                        : (analysisResults.elementUtilization[selectedElement.id] || 0) > 0.5 
                        ? 'secondary' 
                        : 'default'
                    }>
                      {((analysisResults.elementUtilization[selectedElement.id] || 0) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Panel */}
      <div className="absolute bottom-4 right-4">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="text-xs space-y-1">
              <div className="font-semibold">Structure Stats</div>
              <div>Total Elements: {structure.elements.length}</div>
              <div>Visible Elements: {visibleElements.length}</div>
              <div>Nodes: {structure.nodes.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Enhanced3DViewer;