/**
 * Optimized 3D Building Viewer
 * Complete structural elements: Tie Beams, Columns, Beams, Floor Slabs
 * Realistic building proportions and enhanced visualization
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  Layers,
  Box,
  Building2
} from 'lucide-react';

// Enhanced interfaces for building elements
interface BuildingGeometry {
  length: number;
  width: number;
  heightPerFloor: number;
  numberOfFloors: number;
  baySpacingX: number;
  baySpacingY: number;
  foundationDepth?: number;
}

interface BuildingElement {
  id: string;
  type: 'foundation' | 'tie-beam' | 'column' | 'beam' | 'slab';
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  material: string;
  visible: boolean;
  color: string;
  stress?: number;
  deformation?: { dx: number; dy: number; dz: number };
  floor: number;
}

interface ViewSettings {
  rotation: { x: number; y: number; z: number };
  zoom: number;
  showGrid: boolean;
  showLabels: boolean;
  showStress: boolean;
  showDeformation: boolean;
  wireframe: boolean;
  perspective: number;
}

interface ElementVisibility {
  foundations: boolean;
  tieBeams: boolean;
  columns: boolean;
  beams: boolean;
  slabs: boolean;
}

interface OptimizedBuildingViewer3DProps {
  geometry: BuildingGeometry;
  materialGrade: string;
  onElementSelect?: (element: BuildingElement) => void;
  analysisResults?: any;
  className?: string;
}

export const OptimizedBuildingViewer3D: React.FC<OptimizedBuildingViewer3DProps> = ({
  geometry,
  materialGrade = 'K-300',
  onElementSelect,
  analysisResults,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Enhanced view settings
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    rotation: { x: -20, y: 45, z: 0 },
    zoom: 1.0,
    showGrid: true,
    showLabels: false,
    showStress: false,
    showDeformation: false,
    wireframe: false,
    perspective: 800
  });

  // Element visibility controls
  const [elementVisibility, setElementVisibility] = useState<ElementVisibility>({
    foundations: true,
    tieBeams: true,
    columns: true,
    beams: true,
    slabs: true
  });

  // Animation controls
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);

  // Generate complete building elements
  const generateBuildingElements = useCallback((): BuildingElement[] => {
    const elements: BuildingElement[] = [];
    const { length, width, heightPerFloor, numberOfFloors, baySpacingX, baySpacingY, foundationDepth = 2 } = geometry;
    
    const columnsX = Math.ceil(length / baySpacingX) + 1;
    const columnsY = Math.ceil(width / baySpacingY) + 1;

    // Helper function for stress calculation
    const calculateStress = (elementType: string, floor: number): number => {
      const baseStress = {
        'foundation': 20,
        'tie-beam': 12,
        'column': 15,
        'beam': 10,
        'slab': 8
      }[elementType] || 10;
      
      const floorFactor = (numberOfFloors - floor + 1) / numberOfFloors;
      return baseStress * floorFactor + Math.random() * 3;
    };

    // 1. FOUNDATIONS (Pondasi)
    if (elementVisibility.foundations) {
      for (let x = 0; x < columnsX; x++) {
        for (let y = 0; y < columnsY; y++) {
          elements.push({
            id: `foundation-${x}-${y}`,
            type: 'foundation',
            position: { 
              x: x * baySpacingX, 
              y: y * baySpacingY, 
              z: -foundationDepth/2 
            },
            dimensions: { 
              width: 0.8,  // Foundation width
              height: foundationDepth,  // Foundation depth
              depth: 0.8   // Foundation depth
            },
            material: `Concrete ${materialGrade}`,
            visible: elementVisibility.foundations,
            color: '#4a5568',
            stress: calculateStress('foundation', 0),
            floor: 0
          });
        }
      }
    }

    // 2. TIE BEAMS (Sloof) - Ground level beams
    if (elementVisibility.tieBeams) {
      // Tie beams X direction
      for (let y = 0; y < columnsY; y++) {
        for (let x = 0; x < columnsX - 1; x++) {
          elements.push({
            id: `tie-beam-x-${x}-${y}`,
            type: 'tie-beam',
            position: { 
              x: x * baySpacingX + baySpacingX/2, 
              y: y * baySpacingY, 
              z: -0.2 // Slightly below ground level
            },
            dimensions: { 
              width: baySpacingX,  // Tie beam length
              height: 0.4,         // Tie beam height
              depth: 0.25          // Tie beam width
            },
            material: `Concrete ${materialGrade}`,
            visible: elementVisibility.tieBeams,
            color: '#2d3748',
            stress: calculateStress('tie-beam', 0),
            floor: 0
          });
        }
      }
      
      // Tie beams Y direction
      for (let x = 0; x < columnsX; x++) {
        for (let y = 0; y < columnsY - 1; y++) {
          elements.push({
            id: `tie-beam-y-${x}-${y}`,
            type: 'tie-beam',
            position: { 
              x: x * baySpacingX, 
              y: y * baySpacingY + baySpacingY/2, 
              z: -0.2
            },
            dimensions: { 
              width: 0.25,         // Tie beam width
              height: 0.4,         // Tie beam height
              depth: baySpacingY   // Tie beam length
            },
            material: `Concrete ${materialGrade}`,
            visible: elementVisibility.tieBeams,
            color: '#2d3748',
            stress: calculateStress('tie-beam', 0),
            floor: 0
          });
        }
      }
    }

    // 3. COLUMNS (Kolom) - Full height from foundation to roof
    if (elementVisibility.columns) {
      for (let floor = 0; floor <= numberOfFloors; floor++) {
        for (let x = 0; x < columnsX; x++) {
          for (let y = 0; y < columnsY; y++) {
            const columnHeight = floor === 0 ? heightPerFloor + 0.2 : heightPerFloor; // Ground floor slightly taller
            
            elements.push({
              id: `column-${floor}-${x}-${y}`,
              type: 'column',
              position: { 
                x: x * baySpacingX, 
                y: y * baySpacingY, 
                z: floor * heightPerFloor + columnHeight/2 
              },
              dimensions: { 
                width: 0.4,          // Column width
                height: columnHeight, // Column height
                depth: 0.4           // Column depth
              },
              material: `Concrete ${materialGrade}`,
              visible: elementVisibility.columns,
              color: '#8b5a2b',
              stress: calculateStress('column', floor),
              floor
            });
          }
        }
      }
    }

    // 4. BEAMS (Balok) - Floor level beams
    if (elementVisibility.beams) {
      for (let floor = 1; floor <= numberOfFloors; floor++) {
        // Main beams X direction
        for (let y = 0; y < columnsY; y++) {
          for (let x = 0; x < columnsX - 1; x++) {
            elements.push({
              id: `beam-x-${floor}-${x}-${y}`,
              type: 'beam',
              position: { 
                x: x * baySpacingX + baySpacingX/2, 
                y: y * baySpacingY, 
                z: floor * heightPerFloor - 0.3
              },
              dimensions: { 
                width: baySpacingX,  // Beam length
                height: 0.6,         // Beam height
                depth: 0.35          // Beam width
              },
              material: `Concrete ${materialGrade}`,
              visible: elementVisibility.beams,
              color: '#6b7280',
              stress: calculateStress('beam', floor),
              floor
            });
          }
        }
        
        // Main beams Y direction
        for (let x = 0; x < columnsX; x++) {
          for (let y = 0; y < columnsY - 1; y++) {
            elements.push({
              id: `beam-y-${floor}-${x}-${y}`,
              type: 'beam',
              position: { 
                x: x * baySpacingX, 
                y: y * baySpacingY + baySpacingY/2, 
                z: floor * heightPerFloor - 0.3
              },
              dimensions: { 
                width: 0.35,         // Beam width
                height: 0.6,         // Beam height
                depth: baySpacingY   // Beam length
              },
              material: `Concrete ${materialGrade}`,
              visible: elementVisibility.beams,
              color: '#6b7280',
              stress: calculateStress('beam', floor),
              floor
            });
          }
        }
      }
    }

    // 5. FLOOR SLABS (Plat Lantai)
    if (elementVisibility.slabs) {
      for (let floor = 1; floor <= numberOfFloors; floor++) {
        for (let x = 0; x < columnsX - 1; x++) {
          for (let y = 0; y < columnsY - 1; y++) {
            elements.push({
              id: `slab-${floor}-${x}-${y}`,
              type: 'slab',
              position: { 
                x: x * baySpacingX + baySpacingX/2, 
                y: y * baySpacingY + baySpacingY/2, 
                z: floor * heightPerFloor - 0.05
              },
              dimensions: { 
                width: baySpacingX * 0.95,  // Slab width
                height: 0.15,               // Slab thickness
                depth: baySpacingY * 0.95   // Slab depth
              },
              material: `Concrete ${materialGrade}`,
              visible: elementVisibility.slabs,
              color: '#cbd5e0',
              stress: calculateStress('slab', floor),
              floor
            });
          }
        }
      }
    }

    return elements;
  }, [geometry, materialGrade, elementVisibility, analysisResults]);

  // Enhanced 3D projection with proper perspective
  const project3D = (point: { x: number; y: number; z: number }): { x: number; y: number } => {
    const { rotation, zoom, perspective } = viewSettings;
    
    // Convert rotation to radians
    const rotX = (rotation.x * Math.PI) / 180;
    const rotY = (rotation.y * Math.PI) / 180;
    const rotZ = (rotation.z * Math.PI) / 180;
    
    // Center the building
    const centerX = geometry.length / 2;
    const centerY = geometry.width / 2;
    const centerZ = (geometry.numberOfFloors * geometry.heightPerFloor) / 2;
    
    // Translate to origin
    let x = point.x - centerX;
    let y = point.y - centerY;
    let z = point.z - centerZ;
    
    // Apply rotations
    // Rotation around X-axis (pitch)
    let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
    let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);
    
    // Rotation around Y-axis (yaw)  
    let x2 = x * Math.cos(rotY) + z1 * Math.sin(rotY);
    let z2 = -x * Math.sin(rotY) + z1 * Math.cos(rotY);
    
    // Rotation around Z-axis (roll)
    let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
    let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);
    
    // Apply perspective projection
    const distance = perspective + z2;
    const scale = (distance > 0 ? perspective / distance : 1) * zoom * 15;
    
    return {
      x: x3 * scale,
      y: y3 * scale
    };
  };

  // Enhanced drawing functions
  const drawElement = (ctx: CanvasRenderingContext2D, element: BuildingElement, centerX: number, centerY: number) => {
    if (!element.visible) return;

    const { position, dimensions, color, type } = element;
    
    // Calculate 8 corners of the 3D box
    const corners = [
      { x: position.x - dimensions.width/2, y: position.y - dimensions.depth/2, z: position.z - dimensions.height/2 },
      { x: position.x + dimensions.width/2, y: position.y - dimensions.depth/2, z: position.z - dimensions.height/2 },
      { x: position.x + dimensions.width/2, y: position.y + dimensions.depth/2, z: position.z - dimensions.height/2 },
      { x: position.x - dimensions.width/2, y: position.y + dimensions.depth/2, z: position.z - dimensions.height/2 },
      { x: position.x - dimensions.width/2, y: position.y - dimensions.depth/2, z: position.z + dimensions.height/2 },
      { x: position.x + dimensions.width/2, y: position.y - dimensions.depth/2, z: position.z + dimensions.height/2 },
      { x: position.x + dimensions.width/2, y: position.y + dimensions.depth/2, z: position.z + dimensions.height/2 },
      { x: position.x - dimensions.width/2, y: position.y + dimensions.depth/2, z: position.z + dimensions.height/2 }
    ];

    // Project all corners to 2D
    const projected = corners.map(corner => project3D(corner));
    
    // Adjust projected points to canvas center
    const adjustedPoints = projected.map(p => ({
      x: p.x + centerX,
      y: -p.y + centerY // Flip Y for proper orientation
    }));

    // Set element-specific visual properties
    let elementColor = color;
    let alpha = 0.8;
    
    if (viewSettings.showStress && element.stress) {
      // Color based on stress level
      const stressRatio = Math.min(element.stress / 25, 1); // Normalize to max 25 MPa
      const red = Math.floor(255 * stressRatio);
      const green = Math.floor(255 * (1 - stressRatio));
      elementColor = `rgb(${red}, ${green}, 0)`;
    }

    // Enhanced element type specific rendering
    ctx.fillStyle = elementColor;
    ctx.strokeStyle = viewSettings.wireframe ? '#333' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = alpha;

    if (viewSettings.wireframe) {
      // Wireframe rendering
      ctx.strokeStyle = elementColor;
      ctx.lineWidth = type === 'column' ? 2 : 1;
      
      // Draw edges
      const edges = [
        [0,1], [1,2], [2,3], [3,0], // Bottom face
        [4,5], [5,6], [6,7], [7,4], // Top face
        [0,4], [1,5], [2,6], [3,7]  // Vertical edges
      ];

      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(adjustedPoints[start].x, adjustedPoints[start].y);
        ctx.lineTo(adjustedPoints[end].x, adjustedPoints[end].y);
        ctx.stroke();
      });
    } else {
      // Solid rendering - draw visible faces
      
      // Top face (most visible)
      ctx.beginPath();
      ctx.moveTo(adjustedPoints[4].x, adjustedPoints[4].y);
      ctx.lineTo(adjustedPoints[5].x, adjustedPoints[5].y);
      ctx.lineTo(adjustedPoints[6].x, adjustedPoints[6].y);
      ctx.lineTo(adjustedPoints[7].x, adjustedPoints[7].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front face
      ctx.fillStyle = elementColor;
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath();
      ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
      ctx.lineTo(adjustedPoints[1].x, adjustedPoints[1].y);
      ctx.lineTo(adjustedPoints[5].x, adjustedPoints[5].y);
      ctx.lineTo(adjustedPoints[4].x, adjustedPoints[4].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right face
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.moveTo(adjustedPoints[1].x, adjustedPoints[1].y);
      ctx.lineTo(adjustedPoints[2].x, adjustedPoints[2].y);
      ctx.lineTo(adjustedPoints[6].x, adjustedPoints[6].y);
      ctx.lineTo(adjustedPoints[5].x, adjustedPoints[5].y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Reset alpha
    ctx.globalAlpha = 1;

    // Draw labels if enabled
    if (viewSettings.showLabels) {
      const labelPos = project3D({
        x: position.x,
        y: position.y,
        z: position.z + dimensions.height/2 + 0.5
      });
      
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        type.toUpperCase(),
        labelPos.x + centerX,
        -labelPos.y + centerY
      );
    }
  };

  // Grid drawing
  const drawGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    if (!viewSettings.showGrid) return;

    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);

    const gridSize = geometry.baySpacingX;
    const gridExtent = Math.max(geometry.length, geometry.width) * 1.5;

    for (let x = -gridExtent; x <= gridExtent; x += gridSize) {
      for (let y = -gridExtent; y <= gridExtent; y += gridSize) {
        const p1 = project3D({ x, y: -gridExtent, z: 0 });
        const p2 = project3D({ x, y: gridExtent, z: 0 });
        const p3 = project3D({ x: -gridExtent, y, z: 0 });
        const p4 = project3D({ x: gridExtent, y, z: 0 });

        ctx.beginPath();
        ctx.moveTo(p1.x + centerX, -p1.y + centerY);
        ctx.lineTo(p2.x + centerX, -p2.y + centerY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p3.x + centerX, -p3.y + centerY);
        ctx.lineTo(p4.x + centerX, -p4.y + centerY);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
  };

  // Main render function
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f7fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, centerX, centerY);

    // Generate and draw building elements
    const elements = generateBuildingElements();
    
    // Sort elements by distance for proper rendering order
    const sortedElements = elements.sort((a, b) => {
      const distA = Math.sqrt(a.position.x**2 + a.position.y**2 + a.position.z**2);
      const distB = Math.sqrt(b.position.x**2 + b.position.y**2 + b.position.z**2);
      return distB - distA;
    });

    // Draw elements
    sortedElements.forEach(element => {
      drawElement(ctx, element, centerX, centerY);
    });

    // Draw building info
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${geometry.numberOfFloors}-Story Building`, 10, 25);
    ctx.font = '12px Arial';
    ctx.fillText(`${geometry.length}m × ${geometry.width}m`, 10, 45);
    ctx.fillText(`Material: ${materialGrade}`, 10, 65);

  }, [geometry, materialGrade, viewSettings, elementVisibility, generateBuildingElements]);

  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setViewSettings(prev => ({
          ...prev,
          rotation: {
            ...prev.rotation,
            y: prev.rotation.y + animationSpeed
          }
        }));
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, animationSpeed]);

  // Render on settings change
  useEffect(() => {
    render();
  }, [render]);

  // Canvas resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = Math.min(container.clientWidth * 0.75, 600);
        render();
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [render]);

  // Control handlers
  const handleZoomIn = () => {
    setViewSettings(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.1, 3) }));
  };

  const handleZoomOut = () => {
    setViewSettings(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.1, 0.3) }));
  };

  const handleReset = () => {
    setViewSettings({
      rotation: { x: -20, y: 45, z: 0 },
      zoom: 1.0,
      showGrid: true,
      showLabels: false,
      showStress: false,
      showDeformation: false,
      wireframe: false,
      perspective: 800
    });
  };

  const handleRotation = (axis: 'x' | 'y' | 'z', delta: number) => {
    setViewSettings(prev => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        [axis]: prev.rotation[axis] + delta
      }
    }));
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Optimized 3D Building Viewer
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAnimating(!isAnimating)}
              className="flex items-center gap-1"
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAnimating ? 'Pause' : 'Rotate'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas */}
        <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            className="w-full cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startY = e.clientY;
              const startRotation = { ...viewSettings.rotation };
              
              const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                setViewSettings(prev => ({
                  ...prev,
                  rotation: {
                    x: startRotation.x - deltaY * 0.5,
                    y: startRotation.y + deltaX * 0.5,
                    z: startRotation.z
                  }
                }));
              };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? 0.9 : 1.1;
              setViewSettings(prev => ({ 
                ...prev, 
                zoom: Math.max(0.3, Math.min(3, prev.zoom * delta))
              }));
            }}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* View Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={viewSettings.showGrid}
                    onChange={(e) => setViewSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                  />
                  Grid
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={viewSettings.showLabels}
                    onChange={(e) => setViewSettings(prev => ({ ...prev, showLabels: e.target.checked }))}
                  />
                  Labels
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={viewSettings.wireframe}
                    onChange={(e) => setViewSettings(prev => ({ ...prev, wireframe: e.target.checked }))}
                  />
                  Wireframe
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={viewSettings.showStress}
                    onChange={(e) => setViewSettings(prev => ({ ...prev, showStress: e.target.checked }))}
                  />
                  Stress Colors
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Element Visibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Elements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={elementVisibility.foundations}
                  onChange={(e) => setElementVisibility(prev => ({ ...prev, foundations: e.target.checked }))}
                />
                Foundations
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={elementVisibility.tieBeams}
                  onChange={(e) => setElementVisibility(prev => ({ ...prev, tieBeams: e.target.checked }))}
                />
                Tie Beams
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={elementVisibility.columns}
                  onChange={(e) => setElementVisibility(prev => ({ ...prev, columns: e.target.checked }))}
                />
                Columns
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={elementVisibility.beams}
                  onChange={(e) => setElementVisibility(prev => ({ ...prev, beams: e.target.checked }))}
                />
                Beams
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={elementVisibility.slabs}
                  onChange={(e) => setElementVisibility(prev => ({ ...prev, slabs: e.target.checked }))}
                />
                Floor Slabs
              </label>
            </CardContent>
          </Card>

          {/* Building Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Box className="h-4 w-4" />
                Building Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              <div>Floors: {geometry.numberOfFloors}</div>
              <div>Dimensions: {geometry.length}m × {geometry.width}m</div>
              <div>Height: {(geometry.numberOfFloors * geometry.heightPerFloor).toFixed(1)}m</div>
              <div>Bay Spacing: {geometry.baySpacingX}m × {geometry.baySpacingY}m</div>
              <div>Material: {materialGrade}</div>
              <div className="pt-1 border-t">
                Total Elements: {generateBuildingElements().length}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedBuildingViewer3D;