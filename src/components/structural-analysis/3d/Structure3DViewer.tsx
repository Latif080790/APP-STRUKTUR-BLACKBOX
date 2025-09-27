/**
 * Structure 3D Viewer Component
 * Advanced 3D visualization for structural elements
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut, Move3D } from 'lucide-react';

interface Structure3DViewerProps {
  geometry: {
    length: number;
    width: number;
    numberOfFloors: number;
    heightPerFloor: number;
    baySpacingX: number;
    baySpacingY: number;
  };
  showColumns?: boolean;
  showBeams?: boolean;
  showSlabs?: boolean;
  showFoundation?: boolean;
}

const Structure3DViewer: React.FC<Structure3DViewerProps> = ({
  geometry,
  showColumns = true,
  showBeams = true,
  showSlabs = true,
  showFoundation = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewAngle, setViewAngle] = useState({ x: 20, y: 45, z: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  
  // Mock 3D rendering function - In real application, use Three.js or similar
  const render3DStructure = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set up isometric view transformation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / Math.max(geometry.length, geometry.width) * 0.6 * zoom;
    
    // Helper function for isometric projection
    const project = (x: number, y: number, z: number) => {
      const rotX = x * Math.cos(viewAngle.y * Math.PI / 180) - z * Math.sin(viewAngle.y * Math.PI / 180);
      const rotZ = x * Math.sin(viewAngle.y * Math.PI / 180) + z * Math.cos(viewAngle.y * Math.PI / 180);
      const rotY = y * Math.cos(viewAngle.x * Math.PI / 180) - rotZ * Math.sin(viewAngle.x * Math.PI / 180);
      
      return {
        x: centerX + rotX * scale,
        y: centerY - (rotY * scale)
      };
    };
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      
      for (let x = 0; x <= geometry.length; x += geometry.baySpacingX) {
        for (let y = 0; y <= geometry.width; y += geometry.baySpacingY) {
          const p1 = project(x - geometry.length/2, -2, y - geometry.width/2);
          const p2 = project(x - geometry.length/2, geometry.numberOfFloors * geometry.heightPerFloor, y - geometry.width/2);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    
    // Draw foundation if enabled
    if (showFoundation) {
      ctx.fillStyle = '#6b7280';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      
      // Foundation outline
      const corners = [
        project(-geometry.length/2, -2, -geometry.width/2),
        project(geometry.length/2, -2, -geometry.width/2),
        project(geometry.length/2, -2, geometry.width/2),
        project(-geometry.length/2, -2, geometry.width/2)
      ];
      
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      corners.forEach(corner => ctx.lineTo(corner.x, corner.y));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    
    // Draw columns if enabled
    if (showColumns) {
      ctx.fillStyle = '#dc2626';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      
      const columnsX = Math.floor(geometry.length / geometry.baySpacingX) + 1;
      const columnsY = Math.floor(geometry.width / geometry.baySpacingY) + 1;
      
      for (let floor = 0; floor <= geometry.numberOfFloors; floor++) {
        for (let i = 0; i < columnsX; i++) {
          for (let j = 0; j < columnsY; j++) {
            const x = (i * geometry.baySpacingX) - geometry.length/2;
            const y = (j * geometry.baySpacingY) - geometry.width/2;
            const z1 = floor * geometry.heightPerFloor;
            const z2 = (floor + 1) * geometry.heightPerFloor;
            
            if (floor < geometry.numberOfFloors) {
              // Column body
              const p1 = project(x, z1, y);
              const p2 = project(x, z2, y);
              
              ctx.beginPath();
              ctx.moveTo(p1.x - 2, p1.y);
              ctx.lineTo(p2.x - 2, p2.y);
              ctx.moveTo(p1.x + 2, p1.y);
              ctx.lineTo(p2.x + 2, p2.y);
              ctx.stroke();
              
              // Column top/bottom markers
              ctx.beginPath();
              ctx.arc(p1.x, p1.y, 3, 0, 2 * Math.PI);
              ctx.fill();
              ctx.arc(p2.x, p2.y, 3, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }
      }
    }
    
    // Draw beams if enabled
    if (showBeams) {
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 3;
      
      const columnsX = Math.floor(geometry.length / geometry.baySpacingX) + 1;
      const columnsY = Math.floor(geometry.width / geometry.baySpacingY) + 1;
      
      for (let floor = 1; floor <= geometry.numberOfFloors; floor++) {
        const z = floor * geometry.heightPerFloor;
        
        // X-direction beams
        for (let j = 0; j < columnsY; j++) {
          for (let i = 0; i < columnsX - 1; i++) {
            const x1 = (i * geometry.baySpacingX) - geometry.length/2;
            const x2 = ((i + 1) * geometry.baySpacingX) - geometry.length/2;
            const y = (j * geometry.baySpacingY) - geometry.width/2;
            
            const p1 = project(x1, z, y);
            const p2 = project(x2, z, y);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Y-direction beams
        for (let i = 0; i < columnsX; i++) {
          for (let j = 0; j < columnsY - 1; j++) {
            const x = (i * geometry.baySpacingX) - geometry.length/2;
            const y1 = (j * geometry.baySpacingY) - geometry.width/2;
            const y2 = ((j + 1) * geometry.baySpacingY) - geometry.width/2;
            
            const p1 = project(x, z, y1);
            const p2 = project(x, z, y2);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw slabs if enabled
    if (showSlabs) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 1;
      
      for (let floor = 1; floor <= geometry.numberOfFloors; floor++) {
        const z = floor * geometry.heightPerFloor;
        
        // Slab outline
        const corners = [
          project(-geometry.length/2, z, -geometry.width/2),
          project(geometry.length/2, z, -geometry.width/2),
          project(geometry.length/2, z, geometry.width/2),
          project(-geometry.length/2, z, geometry.width/2)
        ];
        
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        corners.forEach(corner => ctx.lineTo(corner.x, corner.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
    
    // Add labels and dimensions
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Building dimensions
    const bottomCorner = project(-geometry.length/2, -2, -geometry.width/2);
    ctx.fillText(`${geometry.length}m × ${geometry.width}m`, bottomCorner.x, bottomCorner.y + 20);
    ctx.fillText(`${geometry.numberOfFloors} floors`, bottomCorner.x, bottomCorner.y + 35);
    ctx.fillText(`H = ${(geometry.numberOfFloors * geometry.heightPerFloor).toFixed(1)}m`, bottomCorner.x, bottomCorner.y + 50);
  };
  
  // Re-render when geometry or view parameters change
  useEffect(() => {
    render3DStructure();
  }, [geometry, viewAngle, zoom, showGrid, showColumns, showBeams, showSlabs, showFoundation]);
  
  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width - 32; // Account for padding
        canvas.height = 400;
        render3DStructure();
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const resetView = () => {
    setViewAngle({ x: 20, y: 45, z: 0 });
    setZoom(1);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Move3D className="h-5 w-5" />
            <span>3D Structure Viewer</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              {showGrid ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              Grid
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(3, zoom + 0.2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* View controls */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span>View Angle:</span>
              <input
                type="range"
                min="0"
                max="90"
                value={viewAngle.x}
                onChange={(e) => setViewAngle(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                className="w-16"
              />
              <span className="w-8 text-center">{viewAngle.x}°</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Rotation:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={viewAngle.y}
                onChange={(e) => setViewAngle(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                className="w-16"
              />
              <span className="w-8 text-center">{viewAngle.y}°</span>
            </div>
          </div>
          
          {/* Element visibility controls */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showColumns}
                onChange={(e) => {}}
                className="form-checkbox"
              />
              <span>Columns</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showBeams}
                onChange={(e) => {}}
                className="form-checkbox"
              />
              <span>Beams</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSlabs}
                onChange={(e) => {}}
                className="form-checkbox"
              />
              <span>Slabs</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showFoundation}
                onChange={(e) => {}}
                className="form-checkbox"
              />
              <span>Foundation</span>
            </label>
          </div>
          
          {/* 3D Canvas */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full"
              style={{ height: '400px' }}
            />
          </div>
          
          {/* Structure info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Dimensions:</span><br />
                {geometry.length}m × {geometry.width}m
              </div>
              <div>
                <span className="font-semibold">Height:</span><br />
                {geometry.numberOfFloors} floors × {geometry.heightPerFloor}m
              </div>
              <div>
                <span className="font-semibold">Bay Spacing:</span><br />
                {geometry.baySpacingX}m × {geometry.baySpacingY}m
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Structure3DViewer;