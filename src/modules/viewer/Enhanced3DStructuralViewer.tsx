/**
 * Enhanced 3D Structural Viewer - FULLY INTERACTIVE VERSION
 * Advanced 3D visualization with material-based rendering, real-time interaction,
 * and professional structural engineering features
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Box, Eye, Home, ZoomIn, ZoomOut, RefreshCw, RotateCcw,
  Grid3X3, Target, Settings, MousePointer, Move3D, RotateCw,
  Camera, Sun, Lightbulb, Layers, Maximize, Play, Pause
} from 'lucide-react';

interface Enhanced3DStructuralViewerProps {
  buildingGeometry?: any;
  selectedMaterials?: string[];
  analysisResults?: any;
  onElementSelect?: (elementId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
}

const Enhanced3DStructuralViewer: React.FC<Enhanced3DStructuralViewerProps> = ({
  buildingGeometry,
  selectedMaterials = [],
  analysisResults,
  onElementSelect,
  onNodeSelect,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [viewMode, setViewMode] = useState<'isometric' | 'plan' | 'elevation' | 'perspective'>('isometric');
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [lighting, setLighting] = useState({ ambient: 0.6, directional: 0.8 });
  const [displayOptions, setDisplayOptions] = useState({
    showGrid: true,
    showDimensions: true,
    showMaterials: true,
    showDeformation: false,
    showStress: false,
    showShadows: true,
    showAnimation: false,
    wireframe: false,
    xRay: false
  });

  // Material color mapping
  const getMaterialColor = (materialType: string, materialId?: string) => {
    const materialColors = {
      'concrete-k25': { primary: '#8B7355', secondary: '#A0896C', shade: '#6B5A47' },
      'concrete-k30': { primary: '#9B8B7A', secondary: '#AE9E8D', shade: '#7A6B5A' },
      'concrete-k35': { primary: '#A39080', secondary: '#B6A695', shade: '#8A7B6A' },
      'steel-bj37': { primary: '#C0C0C0', secondary: '#D5D5D5', shade: '#9E9E9E' },
      'steel-bj50': { primary: '#B8B8B8', secondary: '#CDCDCD', shade: '#969696' },
      'steel-bj55': { primary: '#A8A8A8', secondary: '#BDBDBD', shade: '#8E8E8E' },
      'default-concrete': { primary: '#95847A', secondary: '#A8978E', shade: '#7A6B62' },
      'default-steel': { primary: '#B0B0B0', secondary: '#C5C5C5', shade: '#8B8B8B' }
    };
    
    if (materialId && materialColors[materialId as keyof typeof materialColors]) {
      return materialColors[materialId as keyof typeof materialColors];
    }
    
    return materialType.includes('concrete') ? 
           materialColors['default-concrete'] : 
           materialColors['default-steel'];
  };
  
  // Enhanced animation loop
  const animate = useCallback(() => {
    if (isRotating) {
      setRotationAngle(prev => (prev + 1) % 360);
    }
    if (displayOptions.showAnimation && analysisResults) {
      // Animate deformation or stress visualization
      const time = Date.now() * 0.001;
      draw3DModel(Math.sin(time) * 0.5 + 0.5);
    } else {
      draw3DModel();
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isRotating, displayOptions.showAnimation, analysisResults]);
  
  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    if (viewMode === 'perspective' || viewMode === 'isometric') {
      setRotationAngle(prev => prev + deltaX * 0.5);
    } else {
      setPanX(prev => prev + deltaX * 0.1);
      setPanY(prev => prev + deltaY * 0.1);
    }
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simple click detection for elements/nodes
    const elementId = detectElementAt(x, y);
    if (elementId && onElementSelect) {
      onElementSelect(elementId);
    }
  };
  
  const detectElementAt = (x: number, y: number): string | null => {
    // Simplified element detection - in a real implementation this would be more sophisticated
    if (buildingGeometry && buildingGeometry.grid) {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const tolerance = 20;
      
      // Check if click is near a structural element
      if (Math.abs(x - centerX) < tolerance && Math.abs(y - centerY) < tolerance) {
        return 'column-center';
      }
    }
    return null;
  };
  const draw3DModel = (animationFactor: number = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!buildingGeometry) {
      // Enhanced placeholder
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Advanced 3D Structural Viewer', canvas.width/2, canvas.height/2 - 20);
      ctx.font = '16px Arial';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Configure building geometry to visualize structure', canvas.width/2, canvas.height/2 + 10);
      return;
    }
    
    // Calculate transforms with zoom and pan
    const centerX = canvas.width / 2 + panX;
    const centerY = canvas.height / 2 + panY;
    const scale = 8 * zoom;
    const rotation = (rotationAngle * Math.PI) / 180;
    
    // Building dimensions
    const width = buildingGeometry.dimensions.width * scale;
    const length = buildingGeometry.dimensions.length * scale;
    const height = buildingGeometry.dimensions.height * scale * 0.3; // Scale height for better view
    
    // Material-based coloring
    const selectedMaterialIds = selectedMaterials || [];
    const primaryMaterial = selectedMaterialIds[0] || 'concrete-k25';
    const materialColors = getMaterialColor(primaryMaterial, primaryMaterial);
    
    ctx.save();
    ctx.translate(centerX, centerY);
    if (viewMode === 'perspective' || viewMode === 'isometric') {
      ctx.rotate(rotation);
    }
    
    // Enhanced lighting simulation
    const lightIntensity = lighting.ambient + lighting.directional;
    const shadowOffset = displayOptions.showShadows ? height / 4 : 0;
    
    // Draw shadows first (if enabled)
    if (displayOptions.showShadows && (viewMode === 'isometric' || viewMode === 'perspective')) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(-width/2 + shadowOffset, -length/2 + shadowOffset, width, length);
    }
    
    // Draw building structure based on view mode
    if (viewMode === 'plan') {
      drawPlanView(ctx, width, length, materialColors, animationFactor);
    } else if (viewMode === 'elevation') {
      drawElevationView(ctx, width, height, materialColors, animationFactor);
    } else {
      drawIsometricView(ctx, width, length, height, materialColors, animationFactor);
    }
    
    // Draw structural grid system
    if (displayOptions.showGrid && buildingGeometry.grid) {
      drawStructuralGrid(ctx, width, length, height, scale);
    }
    
    // Draw dimensions
    if (displayOptions.showDimensions) {
      drawDimensions(ctx, width, length, height);
    }
    
    // Draw stress/deformation visualization
    if (displayOptions.showStress && analysisResults) {
      drawStressVisualization(ctx, width, length, height, animationFactor);
    }
    
    if (displayOptions.showDeformation && analysisResults) {
      drawDeformationVisualization(ctx, width, length, height, animationFactor);
    }
    
    ctx.restore();
    
    // Draw material legend
    if (displayOptions.showMaterials && selectedMaterialIds.length > 0) {
      drawMaterialLegend(ctx, selectedMaterialIds);
    }
  };
  
  // Drawing helper functions
  const drawPlanView = (ctx: CanvasRenderingContext2D, width: number, length: number, materialColors: any, animationFactor: number) => {
    // Draw building footprint
    ctx.fillStyle = materialColors.primary;
    ctx.fillRect(-width/2, -length/2, width, length);
    
    // Draw structural elements
    ctx.strokeStyle = materialColors.shade;
    ctx.lineWidth = 2;
    ctx.strokeRect(-width/2, -length/2, width, length);
    
    // Draw interior columns/walls if grid exists
    if (buildingGeometry?.grid) {
      const xBays = buildingGeometry.grid.xBays || 1;
      const yBays = buildingGeometry.grid.yBays || 1;
      
      ctx.strokeStyle = materialColors.secondary;
      ctx.lineWidth = 1;
      
      for (let i = 1; i < xBays; i++) {
        const x = -width/2 + (i * width / xBays);
        ctx.beginPath();
        ctx.moveTo(x, -length/2);
        ctx.lineTo(x, length/2);
        ctx.stroke();
      }
      
      for (let j = 1; j < yBays; j++) {
        const y = -length/2 + (j * length / yBays);
        ctx.beginPath();
        ctx.moveTo(-width/2, y);
        ctx.lineTo(width/2, y);
        ctx.stroke();
      }
    }
  };
  
  const drawElevationView = (ctx: CanvasRenderingContext2D, width: number, height: number, materialColors: any, animationFactor: number) => {
    // Draw building elevation
    ctx.fillStyle = materialColors.primary;
    ctx.fillRect(-width/2, -height/2, width, height);
    
    ctx.strokeStyle = materialColors.shade;
    ctx.lineWidth = 2;
    ctx.strokeRect(-width/2, -height/2, width, height);
    
    // Draw floor levels
    const stories = buildingGeometry?.stories || 1;
    ctx.strokeStyle = materialColors.secondary;
    ctx.lineWidth = 1;
    
    for (let i = 1; i < stories; i++) {
      const y = -height/2 + (i * height / stories);
      ctx.beginPath();
      ctx.moveTo(-width/2, y);
      ctx.lineTo(width/2, y);
      ctx.stroke();
    }
  };
  
  const drawIsometricView = (ctx: CanvasRenderingContext2D, width: number, length: number, height: number, materialColors: any, animationFactor: number) => {
    const offset = height / 3;
    
    // Draw base (ground floor)
    ctx.fillStyle = materialColors.primary;
    ctx.fillRect(-width/2, -length/2, width, length);
    
    // Draw vertical edges with perspective
    ctx.strokeStyle = materialColors.shade;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-width/2, -length/2);
    ctx.lineTo(-width/2 - offset, -length/2 - offset);
    ctx.moveTo(width/2, -length/2);
    ctx.lineTo(width/2 - offset, -length/2 - offset);
    ctx.moveTo(width/2, length/2);
    ctx.lineTo(width/2 - offset, length/2 - offset);
    ctx.moveTo(-width/2, length/2);
    ctx.lineTo(-width/2 - offset, length/2 - offset);
    ctx.stroke();
    
    // Draw top face
    ctx.fillStyle = materialColors.secondary;
    ctx.beginPath();
    ctx.moveTo(-width/2 - offset, -length/2 - offset);
    ctx.lineTo(width/2 - offset, -length/2 - offset);
    ctx.lineTo(width/2 - offset, length/2 - offset);
    ctx.lineTo(-width/2 - offset, length/2 - offset);
    ctx.closePath();
    ctx.fill();
    
    // Draw right face
    ctx.fillStyle = materialColors.shade;
    ctx.beginPath();
    ctx.moveTo(width/2, -length/2);
    ctx.lineTo(width/2 - offset, -length/2 - offset);
    ctx.lineTo(width/2 - offset, length/2 - offset);
    ctx.lineTo(width/2, length/2);
    ctx.closePath();
    ctx.fill();
    
    // Add animation effect for deformation
    if (displayOptions.showAnimation && analysisResults) {
      const deformationScale = Math.sin(animationFactor * Math.PI * 2) * 2;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 10 + deformationScale, 0, Math.PI * 2);
      ctx.stroke();
    }
  };
  
  const drawStructuralGrid = (ctx: CanvasRenderingContext2D, width: number, length: number, height: number, scale: number) => {
    if (!buildingGeometry?.grid) return;
    
    const xBays = buildingGeometry.grid.xBays || 1;
    const yBays = buildingGeometry.grid.yBays || 1;
    
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Draw grid lines
    for (let i = 0; i <= xBays; i++) {
      const x = -width/2 + (i * width / xBays);
      ctx.beginPath();
      ctx.moveTo(x, -length/2);
      ctx.lineTo(x, length/2);
      ctx.stroke();
    }
    
    for (let j = 0; j <= yBays; j++) {
      const y = -length/2 + (j * length / yBays);
      ctx.beginPath();
      ctx.moveTo(-width/2, y);
      ctx.lineTo(width/2, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
    
    // Draw grid point markers
    ctx.fillStyle = '#3b82f6';
    for (let i = 0; i <= xBays; i++) {
      for (let j = 0; j <= yBays; j++) {
        const x = -width/2 + (i * width / xBays);
        const y = -length/2 + (j * length / yBays);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };
  
  const drawDimensions = (ctx: CanvasRenderingContext2D, width: number, length: number, height: number) => {
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    
    // Width dimension
    ctx.fillText(`${buildingGeometry?.dimensions?.width || 0}m`, 0, length/2 + 25);
    
    // Length dimension
    ctx.save();
    ctx.translate(-width/2 - 25, 0);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(`${buildingGeometry?.dimensions?.length || 0}m`, 0, 0);
    ctx.restore();
    
    // Height dimension (for 3D views)
    if (viewMode === 'isometric' || viewMode === 'perspective') {
      ctx.fillText(`${buildingGeometry?.dimensions?.height || 0}m`, -width/2 - 40, -length/2 - 25);
    }
  };
  
  const drawStressVisualization = (ctx: CanvasRenderingContext2D, width: number, length: number, height: number, animationFactor: number) => {
    if (!analysisResults) return;
    
    // Create stress color overlay
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(width, length) / 2);
    const intensity = (analysisResults.maxStress || 0) * animationFactor;
    const alpha = Math.min(intensity / 100, 0.7);
    
    if (intensity > 80) {
      gradient.addColorStop(0, `rgba(239, 68, 68, ${alpha})`);
      gradient.addColorStop(1, `rgba(239, 68, 68, 0)`);
    } else if (intensity > 60) {
      gradient.addColorStop(0, `rgba(245, 158, 11, ${alpha})`);
      gradient.addColorStop(1, `rgba(245, 158, 11, 0)`);
    } else {
      gradient.addColorStop(0, `rgba(34, 197, 94, ${alpha})`);
      gradient.addColorStop(1, `rgba(34, 197, 94, 0)`);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-width/2, -length/2, width, length);
  };
  
  const drawDeformationVisualization = (ctx: CanvasRenderingContext2D, width: number, length: number, height: number, animationFactor: number) => {
    if (!analysisResults) return;
    
    const deformation = (analysisResults.maxDisplacement || 0) * 1000 * animationFactor; // Convert to mm
    
    // Draw deformation vectors
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    
    const scale = Math.min(width, length) / 100;
    const arrows = [
      { x: 0, y: -length/4, dx: deformation * scale, dy: deformation * scale * 0.5 },
      { x: width/4, y: 0, dx: deformation * scale * 0.7, dy: deformation * scale },
      { x: -width/4, y: length/4, dx: -deformation * scale * 0.5, dy: deformation * scale * 0.8 }
    ];
    
    arrows.forEach(arrow => {
      ctx.beginPath();
      ctx.moveTo(arrow.x, arrow.y);
      ctx.lineTo(arrow.x + arrow.dx, arrow.y + arrow.dy);
      ctx.stroke();
      
      // Arrow head
      const angle = Math.atan2(arrow.dy, arrow.dx);
      const headSize = 8;
      ctx.beginPath();
      ctx.moveTo(arrow.x + arrow.dx, arrow.y + arrow.dy);
      ctx.lineTo(
        arrow.x + arrow.dx - headSize * Math.cos(angle - Math.PI/6),
        arrow.y + arrow.dy - headSize * Math.sin(angle - Math.PI/6)
      );
      ctx.moveTo(arrow.x + arrow.dx, arrow.y + arrow.dy);
      ctx.lineTo(
        arrow.x + arrow.dx - headSize * Math.cos(angle + Math.PI/6),
        arrow.y + arrow.dy - headSize * Math.sin(angle + Math.PI/6)
      );
      ctx.stroke();
    });
  };
  
  const drawMaterialLegend = (ctx: CanvasRenderingContext2D, materialIds: string[]) => {
    const legendX = 20;
    const legendY = 20;
    const itemHeight = 25;
    
    // Legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(legendX - 10, legendY - 10, 200, materialIds.length * itemHeight + 20);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX - 10, legendY - 10, 200, materialIds.length * itemHeight + 20);
    
    // Legend items
    materialIds.forEach((materialId, index) => {
      const y = legendY + index * itemHeight;
      const colors = getMaterialColor('', materialId);
      
      // Color swatch
      ctx.fillStyle = colors.primary;
      ctx.fillRect(legendX, y, 15, 15);
      ctx.strokeStyle = colors.shade;
      ctx.strokeRect(legendX, y, 15, 15);
      
      // Material name
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      const materialName = materialId.replace(/-/g, ' ').toUpperCase();
      ctx.fillText(materialName, legendX + 25, y + 12);
    });
  };

  // Animation and interaction effects
  useEffect(() => {
    if (isRotating || displayOptions.showAnimation) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      draw3DModel();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [buildingGeometry, viewMode, displayOptions, selectedMaterials, analysisResults, 
      isRotating, rotationAngle, zoom, panX, panY, lighting, animate]);

  return (
    <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200 ${className}`}>
      {/* Enhanced Canvas with Interactions */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
      />
      
      {/* Enhanced Control Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 space-y-3">
        <h4 className="text-sm font-bold text-gray-800 flex items-center">
          <Box className="w-4 h-4 mr-2 text-blue-600" />
          Advanced 3D Viewer
        </h4>
        
        {/* View Mode Buttons */}
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setViewMode('isometric')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              viewMode === 'isometric' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Isometric
          </button>
          <button
            onClick={() => setViewMode('plan')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              viewMode === 'plan' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Plan
          </button>
          <button
            onClick={() => setViewMode('elevation')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              viewMode === 'elevation' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Elevation
          </button>
          <button
            onClick={() => setViewMode('perspective')}
            className={`px-2 py-1 text-xs rounded transition-all ${
              viewMode === 'perspective' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            3D View
          </button>
        </div>
        
        {/* Interactive Controls */}
        <div className="border-t border-gray-200 pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Auto Rotate</span>
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-1 rounded ${
                isRotating ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoom(prev => Math.max(0.1, prev * 0.8))}
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <div className="flex-1 text-center text-xs text-gray-600">
              {(zoom * 100).toFixed(0)}%
            </div>
            <button
              onClick={() => setZoom(prev => Math.min(5, prev * 1.25))}
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
          
          <button
            onClick={() => {
              setZoom(1);
              setPanX(0);
              setPanY(0);
              setRotationAngle(0);
            }}
            className="w-full p-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-600 flex items-center justify-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset View
          </button>
        </div>
      </div>
      
      {/* Enhanced Display Options */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3 space-y-2">
        <h4 className="text-sm font-bold text-gray-800 flex items-center">
          <Eye className="w-4 h-4 mr-2 text-green-600" />
          Display Options
        </h4>
        
        <div className="space-y-1">
          <label className="flex items-center justify-between text-xs">
            <span>Grid System</span>
            <input
              type="checkbox"
              checked={displayOptions.showGrid}
              onChange={(e) => setDisplayOptions(prev => ({ ...prev, showGrid: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
            />
          </label>
          
          <label className="flex items-center justify-between text-xs">
            <span>Dimensions</span>
            <input
              type="checkbox"
              checked={displayOptions.showDimensions}
              onChange={(e) => setDisplayOptions(prev => ({ ...prev, showDimensions: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
            />
          </label>
          
          <label className="flex items-center justify-between text-xs">
            <span>Materials</span>
            <input
              type="checkbox"
              checked={displayOptions.showMaterials}
              onChange={(e) => setDisplayOptions(prev => ({ ...prev, showMaterials: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
            />
          </label>
          
          <label className="flex items-center justify-between text-xs">
            <span>Shadows</span>
            <input
              type="checkbox"
              checked={displayOptions.showShadows}
              onChange={(e) => setDisplayOptions(prev => ({ ...prev, showShadows: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
            />
          </label>
          
          {analysisResults && (
            <>
              <label className="flex items-center justify-between text-xs">
                <span>Stress View</span>
                <input
                  type="checkbox"
                  checked={displayOptions.showStress}
                  onChange={(e) => setDisplayOptions(prev => ({ ...prev, showStress: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 scale-75"
                />
              </label>
              
              <label className="flex items-center justify-between text-xs">
                <span>Deformation</span>
                <input
                  type="checkbox"
                  checked={displayOptions.showDeformation}
                  onChange={(e) => setDisplayOptions(prev => ({ ...prev, showDeformation: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 scale-75"
                />
              </label>
              
              <label className="flex items-center justify-between text-xs">
                <span>Animation</span>
                <input
                  type="checkbox"
                  checked={displayOptions.showAnimation}
                  onChange={(e) => setDisplayOptions(prev => ({ ...prev, showAnimation: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 scale-75"
                />
              </label>
            </>
          )}
        </div>
        
        {/* Lighting Controls */}
        <div className="border-t border-gray-200 pt-2">
          <h5 className="text-xs font-medium text-gray-700 mb-1 flex items-center">
            <Sun className="w-3 h-3 mr-1" />
            Lighting
          </h5>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 w-12">Ambient</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={lighting.ambient}
                onChange={(e) => setLighting(prev => ({ ...prev, ambient: parseFloat(e.target.value) }))}
                className="flex-1 h-1 bg-gray-200 rounded appearance-none slider"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 w-12">Direct</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={lighting.directional}
                onChange={(e) => setLighting(prev => ({ ...prev, directional: parseFloat(e.target.value) }))}
                className="flex-1 h-1 bg-gray-200 rounded appearance-none slider"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Building Info Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
        <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
          <Home className="w-4 h-4 mr-2 text-orange-600" />
          Building Information
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          {buildingGeometry ? (
            <>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-medium">{buildingGeometry.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium">
                  {buildingGeometry.dimensions.length} × {buildingGeometry.dimensions.width} × {buildingGeometry.dimensions.height}m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Grid:</span>
                <span className="font-medium">
                  {buildingGeometry.grid?.xBays || 0} × {buildingGeometry.grid?.yBays || 0} bays
                </span>
              </div>
              <div className="flex justify-between">
                <span>Frame:</span>
                <span className="font-medium capitalize">{buildingGeometry.structural?.frameType || 'moment'}</span>
              </div>
              <div className="flex justify-between">
                <span>Materials:</span>
                <span className="font-medium text-blue-600">{selectedMaterials.length} selected</span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No building data available</div>
          )}
        </div>
      </div>
      
      {/* Analysis Results Panel */}
      {analysisResults && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-2 text-purple-600" />
            Analysis Results
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Max Displacement:</span>
              <span className={`font-medium ${
                (analysisResults.maxDisplacement * 1000) > 25 ? 'text-red-600' : 'text-green-600'
              }`}>
                {(analysisResults.maxDisplacement * 1000).toFixed(1)} mm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Max Stress:</span>
              <span className={`font-medium ${
                analysisResults.maxStress > 80 ? 'text-red-600' : 
                analysisResults.maxStress > 60 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {analysisResults.maxStress.toFixed(1)} MPa
              </span>
            </div>
            <div className="flex justify-between">
              <span>Safety Factor:</span>
              <span className={`font-medium ${
                analysisResults.safetyFactor < 2 ? 'text-red-600' : 
                analysisResults.safetyFactor < 2.5 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {analysisResults.safetyFactor.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Interactive Hints */}
      {isDragging && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-xs">
          {viewMode === 'perspective' || viewMode === 'isometric' ? 'Drag to rotate' : 'Drag to pan'} • Scroll to zoom
        </div>
      )}
      
      {selectedMaterials.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <Layers className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-blue-800">Select Materials</p>
          <p className="text-xs text-blue-600">Choose materials to see realistic 3D rendering</p>
        </div>
      )}
    </div>
  );
};

export default Enhanced3DStructuralViewer;