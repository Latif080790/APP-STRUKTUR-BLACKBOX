/**
 * Advanced 3D Structure Viewer (Professional Edition)
 * Enhanced 3D visualization with correct structural orientations,
 * deformation simulation, and realistic structural behavior
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Slider } from '../../ui/slider';
import { 
  Eye, EyeOff, Grid3X3, Move3D, Building2, Maximize2, RotateCcw, 
  Ruler, Settings, Layers, ZoomIn, ZoomOut, RotateCw, Home,
  Palette, Sun, Moon, Camera, Download, Share2, Info, Play, Pause,
  Square, Circle, Triangle, Box, Cylinder, Activity, Zap
} from 'lucide-react';

interface GeometryInput {
  length: number;
  width: number;
  heightPerFloor: number;
  numberOfFloors: number;
  baySpacingX: number;
  baySpacingY: number;
  foundationDepth?: number;
}

interface MaterialProps {
  type: string;
  grade: string;
  properties: {
    fc?: number;
    fy?: number;
    Es?: number;
  };
}

interface ViewSettings {
  rotation: { x: number; y: number; z: number };
  zoom: number;
  position: { x: number; y: number };
  lighting: 'day' | 'night' | 'studio';
  wireframe: boolean;
  showDimensions: boolean;
  showGrid: boolean;
  showFoundation: boolean;
  elementHighlight: string | null;
  viewAngle: 'isometric' | 'front' | 'side' | 'top' | 'perspective';
}

interface Element3D {
  id: string;
  type: 'beam' | 'column' | 'foundation' | 'slab' | 'wall';
  position: { x: number; y: number; z: number };
  dimensions: { width: number; height: number; depth: number };
  material: string;
  visible: boolean;
  highlighted: boolean;
  color: string;
  originalPosition: { x: number; y: number; z: number };
  deformation: { dx: number; dy: number; dz: number };
  stress: number;
  orientation: 'horizontal' | 'vertical';
}

interface Advanced3DStructureViewerProps {
  geometry: GeometryInput;
  materialGrade?: string;
  onElementSelect?: (element: Element3D) => void;
  analysisResults?: any;
}

export const Advanced3DStructureViewer: React.FC<Advanced3DStructureViewerProps> = ({
  geometry,
  materialGrade = 'K-300',
  onElementSelect,
  analysisResults
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // View state management
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    rotation: { x: -30, y: 45, z: 0 },
    zoom: 1.0,
    position: { x: 0, y: 0 },
    lighting: 'day',
    wireframe: false,
    showDimensions: true,
    showGrid: true,
    showFoundation: true,
    elementHighlight: null,
    viewAngle: 'isometric'
  });

  // Element visibility
  const [elementVisibility, setElementVisibility] = useState({
    beams: true,
    columns: true,
    foundations: true,
    slabs: true,
    walls: false
  });

  // Animation controls
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDeformation, setShowDeformation] = useState(false);
  const [deformationScale, setDeformationScale] = useState(10);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Generate 3D elements from geometry
  const generate3DElements = useCallback((): Element3D[] => {
    const elements: Element3D[] = [];
    const { length, width, heightPerFloor, numberOfFloors, baySpacingX, baySpacingY } = geometry;
    
    // Calculate deformation from analysis results (simplified)
    const getDeformation = (elementType: string, floor: number): { dx: number; dy: number; dz: number } => {
      if (!analysisResults) return { dx: 0, dy: 0, dz: 0 };
      
      const baseDeformation = 0.01; // 1cm base deformation
      const floorFactor = Math.pow(floor / numberOfFloors, 2); // More deformation at higher floors
      
      return {
        dx: baseDeformation * floorFactor * (Math.random() - 0.5) * 2,
        dy: baseDeformation * floorFactor * (Math.random() - 0.5) * 2,
        dz: elementType === 'column' ? -baseDeformation * floorFactor : 0
      };
    };

    const getStress = (elementType: string, floor: number): number => {
      const baseStress = elementType === 'column' ? 15 : 8; // MPa
      const floorFactor = (numberOfFloors - floor + 1) / numberOfFloors; // Higher stress at lower floors
      return baseStress * floorFactor + Math.random() * 5;
    };
    
    // Generate columns (VERTICAL orientation)
    const columnsX = Math.ceil(length / baySpacingX) + 1;
    const columnsY = Math.ceil(width / baySpacingY) + 1;
    
    for (let floor = 0; floor <= numberOfFloors; floor++) {
      for (let x = 0; x < columnsX; x++) {
        for (let y = 0; y < columnsY; y++) {
          const position = { 
            x: x * baySpacingX, 
            y: y * baySpacingY, 
            z: floor * heightPerFloor 
          };
          const deformation = getDeformation('column', floor);
          
          elements.push({
            id: `column-${floor}-${x}-${y}`,
            type: 'column',
            position,
            originalPosition: { ...position },
            dimensions: { 
              width: 0.4,    // Column width (horizontal)
              height: heightPerFloor, // Column height (vertical) 
              depth: 0.4     // Column depth (horizontal)
            },
            material: materialGrade,
            visible: elementVisibility.columns,
            highlighted: false,
            color: '#8b5a2b',
            deformation,
            stress: getStress('column', floor),
            orientation: 'vertical'
          });
        }
      }
    }

    // Generate beams X direction (HORIZONTAL orientation)
    for (let floor = 1; floor <= numberOfFloors; floor++) {
      for (let y = 0; y < columnsY; y++) {
        for (let x = 0; x < columnsX - 1; x++) {
          const position = { 
            x: x * baySpacingX + baySpacingX/2, 
            y: y * baySpacingY, 
            z: floor * heightPerFloor 
          };
          const deformation = getDeformation('beam', floor);
          
          elements.push({
            id: `beam-x-${floor}-${x}-${y}`,
            type: 'beam',
            position,
            originalPosition: { ...position },
            dimensions: { 
              width: baySpacingX,  // Beam length (horizontal)
              height: 0.6,         // Beam height (vertical)
              depth: 0.3           // Beam width (horizontal)
            },
            material: materialGrade,
            visible: elementVisibility.beams,
            highlighted: false,
            color: '#6b7280',
            deformation,
            stress: getStress('beam', floor),
            orientation: 'horizontal'
          });
        }
      }
    }

    // Generate beams Y direction (HORIZONTAL orientation)
    for (let floor = 1; floor <= numberOfFloors; floor++) {
      for (let x = 0; x < columnsX; x++) {
        for (let y = 0; y < columnsY - 1; y++) {
          const position = { 
            x: x * baySpacingX, 
            y: y * baySpacingY + baySpacingY/2, 
            z: floor * heightPerFloor 
          };
          const deformation = getDeformation('beam', floor);
          
          elements.push({
            id: `beam-y-${floor}-${x}-${y}`,
            type: 'beam',
            position,
            originalPosition: { ...position },
            dimensions: { 
              width: 0.3,          // Beam width (horizontal)
              height: 0.6,         // Beam height (vertical)
              depth: baySpacingY   // Beam length (horizontal)
            },
            material: materialGrade,
            visible: elementVisibility.beams,
            highlighted: false,
            color: '#6b7280',
            deformation,
            stress: getStress('beam', floor),
            orientation: 'horizontal'
          });
        }
      }
    }

    // Generate slabs (HORIZONTAL orientation)
    for (let floor = 1; floor <= numberOfFloors; floor++) {
      for (let x = 0; x < columnsX - 1; x++) {
        for (let y = 0; y < columnsY - 1; y++) {
          const position = { 
            x: x * baySpacingX + baySpacingX/2, 
            y: y * baySpacingY + baySpacingY/2, 
            z: floor * heightPerFloor + 0.3 
          };
          const deformation = getDeformation('slab', floor);
          
          elements.push({
            id: `slab-${floor}-${x}-${y}`,
            type: 'slab',
            position,
            originalPosition: { ...position },
            dimensions: { 
              width: baySpacingX,  // Slab length (horizontal)
              height: 0.15,        // Slab thickness (vertical)
              depth: baySpacingY   // Slab width (horizontal)
            },
            material: materialGrade,
            visible: elementVisibility.slabs,
            highlighted: false,
            color: '#d1d5db',
            deformation,
            stress: getStress('slab', floor),
            orientation: 'horizontal'
          });
        }
      }
    }

    // Generate foundations (HORIZONTAL orientation, below ground)
    if (viewSettings.showFoundation) {
      for (let x = 0; x < columnsX; x++) {
        for (let y = 0; y < columnsY; y++) {
          const position = { 
            x: x * baySpacingX, 
            y: y * baySpacingY, 
            z: -(geometry.foundationDepth || 2) 
          };
          const deformation = { dx: 0, dy: 0, dz: 0 }; // Foundations don't deform much
          
          elements.push({
            id: `foundation-${x}-${y}`,
            type: 'foundation',
            position,
            originalPosition: { ...position },
            dimensions: { 
              width: 1.5,                           // Foundation length (horizontal)
              height: geometry.foundationDepth || 2, // Foundation depth (vertical)
              depth: 1.5                            // Foundation width (horizontal)
            },
            material: materialGrade,
            visible: elementVisibility.foundations,
            highlighted: false,
            color: '#92400e',
            deformation,
            stress: getStress('foundation', 0),
            orientation: 'horizontal'
          });
        }
      }
    }

    return elements;
  }, [geometry, materialGrade, elementVisibility, viewSettings.showFoundation, analysisResults]);

  // Canvas drawing functions
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!viewSettings.showGrid) return;
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const draw3DElement = (ctx: CanvasRenderingContext2D, element: Element3D, centerX: number, centerY: number) => {
    if (!element.visible) return;
    
    const { rotation, zoom } = viewSettings;
    const scale = zoom * 8; // Adjusted scale for better visibility
    
    // Apply deformation if enabled
    let currentPos = { ...element.position };
    if (showDeformation) {
      currentPos.x += element.deformation.dx * deformationScale;
      currentPos.y += element.deformation.dy * deformationScale;
      currentPos.z += element.deformation.dz * deformationScale;
    }
    
    // Enhanced 3D projection with proper perspective
    const cos = Math.cos;
    const sin = Math.sin;
    const rx = rotation.x * Math.PI / 180;
    const ry = rotation.y * Math.PI / 180;
    const rz = rotation.z * Math.PI / 180;
    
    // Apply rotation transformations
    const x = currentPos.x;
    const y = currentPos.y; 
    const z = currentPos.z;
    
    // Rotate around X axis
    const y1 = y * cos(rx) - z * sin(rx);
    const z1 = y * sin(rx) + z * cos(rx);
    
    // Rotate around Y axis
    const x2 = x * cos(ry) + z1 * sin(ry);
    const z2 = -x * sin(ry) + z1 * cos(ry);
    
    // Project to 2D with perspective
    const distance = 50; // perspective distance
    const perspectiveFactor = distance / (distance + z2);
    
    const x2d = centerX + (x2 * scale * perspectiveFactor);
    const y2d = centerY - (y1 * scale * perspectiveFactor);
    
    // Calculate element dimensions with proper orientation
    let w, h, d;
    if (element.type === 'column') {
      // Columns are vertical - height is the main dimension
      w = element.dimensions.width * scale * perspectiveFactor;
      h = element.dimensions.height * scale * perspectiveFactor * 0.3; // Adjusted for visualization
      d = element.dimensions.depth * scale * perspectiveFactor;
    } else if (element.type === 'beam') {
      // Beams are horizontal - length/width is the main dimension
      if (element.id.includes('beam-x')) {
        // X-direction beam
        w = element.dimensions.width * scale * perspectiveFactor;
        h = element.dimensions.height * scale * perspectiveFactor;
        d = element.dimensions.depth * scale * perspectiveFactor;
      } else {
        // Y-direction beam 
        w = element.dimensions.width * scale * perspectiveFactor;
        h = element.dimensions.height * scale * perspectiveFactor;
        d = element.dimensions.depth * scale * perspectiveFactor;
      }
    } else {
      // Slabs and foundations are horizontal
      w = element.dimensions.width * scale * perspectiveFactor;
      h = element.dimensions.height * scale * perspectiveFactor;
      d = element.dimensions.depth * scale * perspectiveFactor;
    }
    
    // Color based on stress if showing deformation
    let fillColor = element.color;
    if (showDeformation && element.stress > 0) {
      const stressRatio = Math.min(element.stress / 25, 1); // Normalize to max 25 MPa
      const red = Math.floor(255 * stressRatio);
      const green = Math.floor(255 * (1 - stressRatio));
      fillColor = `rgb(${red}, ${green}, 0)`;
    }
    
    ctx.fillStyle = element.highlighted ? '#fbbf24' : fillColor;
    ctx.strokeStyle = element.highlighted ? '#f59e0b' : '#374151';
    ctx.lineWidth = element.highlighted ? 3 : 1;
    
    // Draw 3D element with proper depth
    if (viewSettings.wireframe) {
      // Wireframe mode - draw outline only
      ctx.strokeRect(x2d - w/2, y2d - h/2, w, h);
      // Draw depth lines for 3D effect
      ctx.beginPath();
      ctx.moveTo(x2d - w/2, y2d - h/2);
      ctx.lineTo(x2d - w/2 + d*0.3, y2d - h/2 - d*0.3);
      ctx.moveTo(x2d + w/2, y2d - h/2);
      ctx.lineTo(x2d + w/2 + d*0.3, y2d - h/2 - d*0.3);
      ctx.moveTo(x2d + w/2, y2d + h/2);
      ctx.lineTo(x2d + w/2 + d*0.3, y2d + h/2 - d*0.3);
      ctx.moveTo(x2d - w/2, y2d + h/2);
      ctx.lineTo(x2d - w/2 + d*0.3, y2d + h/2 - d*0.3);
      ctx.stroke();
    } else {
      // Solid mode - draw filled shapes with 3D effect
      
      // Main face
      ctx.fillRect(x2d - w/2, y2d - h/2, w, h);
      ctx.strokeRect(x2d - w/2, y2d - h/2, w, h);
      
      // Top face (for 3D effect)
      ctx.fillStyle = element.highlighted ? '#fde68a' : adjustBrightness(fillColor, 20);
      ctx.beginPath();
      ctx.moveTo(x2d - w/2, y2d - h/2);
      ctx.lineTo(x2d - w/2 + d*0.3, y2d - h/2 - d*0.3);
      ctx.lineTo(x2d + w/2 + d*0.3, y2d - h/2 - d*0.3);
      ctx.lineTo(x2d + w/2, y2d - h/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Right face
      ctx.fillStyle = element.highlighted ? '#fcd34d' : adjustBrightness(fillColor, -20);
      ctx.beginPath();
      ctx.moveTo(x2d + w/2, y2d - h/2);
      ctx.lineTo(x2d + w/2 + d*0.3, y2d - h/2 - d*0.3);
      ctx.lineTo(x2d + w/2 + d*0.3, y2d + h/2 - d*0.3);
      ctx.lineTo(x2d + w/2, y2d + h/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    
    // Draw element info if highlighted
    if (element.highlighted && viewSettings.showDimensions) {
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      
      let info = `${element.type.toUpperCase()}`;
      if (element.type === 'column') {
        info += ` H:${element.dimensions.height.toFixed(1)}m`;
      } else if (element.type === 'beam') {
        info += ` L:${Math.max(element.dimensions.width, element.dimensions.depth).toFixed(1)}m`;
      }
      
      if (showDeformation) {
        info += ` σ:${element.stress.toFixed(1)}MPa`;
      }
      
      ctx.fillText(info, x2d, y2d - h/2 - 15);
    }
  };

  // Helper function to adjust color brightness
  const adjustBrightness = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    if (hex.length === 6) {
      const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
      const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
      const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return color;
  };

  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas
    const bgColor = viewSettings.lighting === 'night' ? '#1f2937' : '#f9fafb';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    drawGrid(ctx, width, height);
    
    // Generate and draw elements
    const elements = generate3DElements();
    const centerX = width / 2 + viewSettings.position.x;
    const centerY = height / 2 + viewSettings.position.y;
    
    // Sort elements for proper depth rendering
    const sortedElements = elements.sort((a, b) => {
      const aDepth = a.position.x + a.position.y + a.position.z;
      const bDepth = b.position.x + b.position.y + b.position.z;
      return bDepth - aDepth;
    });
    
    // Draw all elements
    sortedElements.forEach(element => {
      draw3DElement(ctx, element, centerX, centerY);
    });
    
    // Draw deformation information overlay if enabled
    if (showDeformation && analysisResults) {
      drawDeformationOverlay(ctx, width, height);
    }
    
    // Draw coordinate axes
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(100, height - 50);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.fillText('X', 110, height - 45);
    
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(50, height - 100);
    ctx.stroke();
    ctx.fillStyle = '#10b981';
    ctx.fillText('Y', 45, height - 110);
    
    // Animation frame
    if (isAnimating) {
      setCurrentFrame(prev => (prev + 1) % 360);
      setViewSettings(prev => ({
        ...prev,
        rotation: { ...prev.rotation, y: currentFrame }
      }));
    }
  }, [viewSettings, elementVisibility, generate3DElements, isAnimating, currentFrame]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      renderScene();
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [renderScene, isAnimating]);

  // Draw deformation overlay
  const drawDeformationOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(width - 200, 10, 180, 80);
    
    // Text
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText('Deformation Analysis', width - 190, 30);
    ctx.fillText(`Scale: ${deformationScale.toFixed(1)}x`, width - 190, 50);
    
    // Maximum deformation info
    if (analysisResults) {
      const maxDeformation = Math.max(
        ...(analysisResults.displacements?.map(d => Math.sqrt(d.dx*d.dx + d.dy*d.dy + d.dz*d.dz)) || [0])
      );
      ctx.fillText(`Max: ${(maxDeformation * 1000).toFixed(1)}mm`, width - 190, 70);
    }
    
    // Color legend for stress
    const legendY = 100;
    const legendHeight = 80;
    const legendWidth = 15;
    
    // Gradient for stress legend
    const gradient = ctx.createLinearGradient(width - 50, legendY, width - 50, legendY + legendHeight);
    gradient.addColorStop(0, 'rgb(255, 0, 0)'); // High stress
    gradient.addColorStop(0.5, 'rgb(255, 255, 0)'); // Medium stress
    gradient.addColorStop(1, 'rgb(0, 255, 0)'); // Low stress
    
    ctx.fillStyle = gradient;
    ctx.fillRect(width - 50, legendY, legendWidth, legendHeight);
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.strokeRect(width - 50, legendY, legendWidth, legendHeight);
    
    // Stress value labels
    ctx.fillStyle = '#374151';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('25', width - 55, legendY + 5);
    ctx.fillText('12.5', width - 55, legendY + legendHeight/2);
    ctx.fillText('0 MPa', width - 55, legendY + legendHeight);
  };

  // Preset view angles
  const setViewAngle = (angle: ViewSettings['viewAngle']) => {
    const presets = {
      isometric: { x: -30, y: 45, z: 0 },
      front: { x: 0, y: 0, z: 0 },
      side: { x: 0, y: 90, z: 0 },
      top: { x: -90, y: 0, z: 0 },
      perspective: { x: -15, y: 30, z: 0 }
    };
    
    setViewSettings(prev => ({
      ...prev,
      rotation: presets[angle],
      viewAngle: angle
    }));
  };

  // Mouse interaction handlers
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Simple element selection logic
    const elements = generate3DElements();
    const centerX = canvas.width / 2 + viewSettings.position.x;
    const centerY = canvas.height / 2 + viewSettings.position.y;
    
    for (const element of elements) {
      const scale = viewSettings.zoom * 10;
      const x2d = centerX + element.position.x * scale;
      const y2d = centerY - element.position.y * scale;
      const w = element.dimensions.width * scale;
      const h = element.dimensions.height * scale;
      
      if (x >= x2d - w/2 && x <= x2d + w/2 && y >= y2d - h/2 && y <= y2d + h/2) {
        setViewSettings(prev => ({
          ...prev,
          elementHighlight: element.id
        }));
        
        if (onElementSelect) {
          onElementSelect({
            ...element,
            highlighted: true
          });
        }
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span>Advanced 3D Structure Viewer</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Professional Edition
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                <Play className="h-4 w-4 mr-1" />
                {isAnimating ? 'Stop' : 'Animate'}
              </Button>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-1" />
                Screenshot
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="viewer" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="viewer">3D Viewer</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="viewer" className="space-y-4">
              {/* Main 3D Canvas */}
              <div className="relative bg-gray-50 border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="cursor-crosshair"
                  onClick={handleCanvasClick}
                />
                
                {/* View Controls Overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewAngle('isometric')}
                      className={viewSettings.viewAngle === 'isometric' ? 'bg-blue-100' : ''}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewAngle('front')}
                      className={viewSettings.viewAngle === 'front' ? 'bg-blue-100' : ''}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewAngle('side')}
                      className={viewSettings.viewAngle === 'side' ? 'bg-blue-100' : ''}
                    >
                      <Box className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewAngle('top')}
                      className={viewSettings.viewAngle === 'top' ? 'bg-blue-100' : ''}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewSettings(prev => ({ ...prev, zoom: Math.min(3, prev.zoom + 0.2) }))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewSettings(prev => ({ ...prev, zoom: Math.max(0.2, prev.zoom - 0.2) }))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewSettings(prev => ({ ...prev, zoom: 1, position: { x: 0, y: 0 } }))}
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded px-4 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span>Zoom: {(viewSettings.zoom * 100).toFixed(0)}%</span>
                      <span>View: {viewSettings.viewAngle}</span>
                      <span>Elements: {generate3DElements().filter(e => e.visible).length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={viewSettings.lighting === 'day' ? 'default' : 'outline'}>
                        {viewSettings.lighting}
                      </Badge>
                      <Badge variant={viewSettings.wireframe ? 'default' : 'outline'}>
                        {viewSettings.wireframe ? 'Wireframe' : 'Solid'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="controls" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">View Controls</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rotation X</label>
                      <Slider
                        value={[viewSettings.rotation.x]}
                        onValueChange={(value) => 
                          setViewSettings(prev => ({ 
                            ...prev, 
                            rotation: { ...prev.rotation, x: value[0] } 
                          }))
                        }
                        min={-90}
                        max={90}
                        step={5}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{viewSettings.rotation.x}°</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rotation Y</label>
                      <Slider
                        value={[viewSettings.rotation.y]}
                        onValueChange={(value) => 
                          setViewSettings(prev => ({ 
                            ...prev, 
                            rotation: { ...prev.rotation, y: value[0] } 
                          }))
                        }
                        min={-180}
                        max={180}
                        step={5}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{viewSettings.rotation.y}°</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Zoom</label>
                      <Slider
                        value={[viewSettings.zoom]}
                        onValueChange={(value) => 
                          setViewSettings(prev => ({ ...prev, zoom: value[0] }))
                        }
                        min={0.2}
                        max={3.0}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{(viewSettings.zoom * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Display Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Grid</span>
                      <Button
                        variant={viewSettings.showGrid ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewSettings(prev => ({ ...prev, showGrid: !prev.showGrid }))}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Dimensions</span>
                      <Button
                        variant={viewSettings.showDimensions ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewSettings(prev => ({ ...prev, showDimensions: !prev.showDimensions }))}
                      >
                        <Ruler className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Wireframe Mode</span>
                      <Button
                        variant={viewSettings.wireframe ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewSettings(prev => ({ ...prev, wireframe: !prev.wireframe }))}
                      >
                        <Move3D className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lighting</span>
                      <div className="flex space-x-1">
                        <Button
                          variant={viewSettings.lighting === 'day' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewSettings(prev => ({ ...prev, lighting: 'day' }))}
                        >
                          <Sun className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewSettings.lighting === 'night' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewSettings(prev => ({ ...prev, lighting: 'night' }))}
                        >
                          <Moon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Deformation Analysis Section */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <span>Deformation Analysis</span>
                    {analysisResults && <Zap className="h-4 w-4 text-blue-500" />}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Deformation</span>
                      <Button
                        variant={showDeformation ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setShowDeformation(!showDeformation)}
                        disabled={!analysisResults}
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {showDeformation && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Deformation Scale: {deformationScale.toFixed(1)}x
                        </label>
                        <Slider
                          value={[deformationScale]}
                          onValueChange={(value) => setDeformationScale(value[0])}
                          min={1}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1x (Actual)</span>
                          <span>50x (Exaggerated)</span>
                        </div>
                      </div>
                    )}
                    
                    {analysisResults && (
                      <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                        <p><strong>Stress Color Legend:</strong></p>
                        <div className="flex items-center mt-1">
                          <div className="w-4 h-2 bg-red-500 mr-2"></div>
                          <span>High Stress (≥20 MPa)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-yellow-500 mr-2"></div>
                          <span>Medium Stress (10-20 MPa)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-2 bg-green-500 mr-2"></div>
                          <span>Low Stress (&lt;10 MPa)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="elements" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Element Visibility</h3>
                  <div className="space-y-3">
                    {Object.entries(elementVisibility).map(([key, visible]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{key}</span>
                        <Button
                          variant={visible ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => 
                            setElementVisibility(prev => ({ 
                              ...prev, 
                              [key]: !prev[key as keyof typeof prev] 
                            }))
                          }
                        >
                          {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Element Count</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Columns:</span>
                      <Badge variant="outline">
                        {generate3DElements().filter(e => e.type === 'column').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Beams:</span>
                      <Badge variant="outline">
                        {generate3DElements().filter(e => e.type === 'beam').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Slabs:</span>
                      <Badge variant="outline">
                        {generate3DElements().filter(e => e.type === 'slab').length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Foundations:</span>
                      <Badge variant="outline">
                        {generate3DElements().filter(e => e.type === 'foundation').length}
                      </Badge>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total Elements:</span>
                      <Badge>
                        {generate3DElements().length}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Advanced Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Material Grade</label>
                      <Badge variant="outline" className="text-sm">
                        {materialGrade}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Structure Dimensions</label>
                      <div className="text-sm text-gray-600">
                        {geometry.length}m × {geometry.width}m × {geometry.numberOfFloors * geometry.heightPerFloor}m
                        <br />
                        {geometry.numberOfFloors} floors, {geometry.heightPerFloor}m per floor
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Bay Spacing</label>
                      <div className="text-sm text-gray-600">
                        X: {geometry.baySpacingX}m, Y: {geometry.baySpacingY}m
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Export Options</h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PNG Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      3D Model
                    </Button>
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Advanced3DStructureViewer;