/**
 * 3D View Structure Module
 * Advanced 3D visualization with deformation and stress analysis
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw, ZoomIn, ZoomOut, Eye, EyeOff, Settings,
  Layers, Move, Square, MousePointer
} from 'lucide-react';
import { structuralEngine, ProjectData } from '../../engines/FunctionalStructuralEngine';

interface Viewer3DProps {
  subModule: string;
  projectId?: string;
}

interface ViewerState {
  zoom: number;
  rotation: { x: number; y: number; z: number };
  position: { x: number; y: number };
  showGrid: boolean;
  showLoads: boolean;
  showDeformation: boolean;
  showStresses: boolean;
  selectedElement: string | null;
}

interface Structural3DElement {
  id: string;
  type: 'beam' | 'column' | 'slab';
  startPoint: { x: number; y: number; z: number };
  endPoint: { x: number; y: number; z: number };
  color: string;
  stress?: number;
  utilization?: number;
}

const Viewer3D: React.FC<Viewer3DProps> = ({ subModule, projectId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewerState, setViewerState] = useState<ViewerState>({
    zoom: 1.0,
    rotation: { x: 15, y: 30, z: 0 },
    position: { x: 0, y: 0 },
    showGrid: true,
    showLoads: false,
    showDeformation: false,
    showStresses: false,
    selectedElement: null,
  });
  
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [structuralElements, setStructuralElements] = useState<Structural3DElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData(projectId);
    } else {
      generateSampleModel();
    }
  }, [projectId]);

  useEffect(() => {
    render3DScene();
  }, [viewerState, structuralElements]);

  const loadProjectData = async (id: string) => {
    try {
      setIsLoading(true);
      const project = structuralEngine.getProject(id);
      if (project) {
        setProjectData(project);
        const elements = generateStructuralElements(project);
        setStructuralElements(elements);
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleModel = () => {
    const elements: Structural3DElement[] = [];
    const floors = 3, baysX = 3, baysY = 3;
    const bayWidth = 6, bayLength = 6, floorHeight = 3.5;
    
    // Generate columns
    for (let floor = 0; floor < floors; floor++) {
      for (let x = 0; x <= baysX; x++) {
        for (let y = 0; y <= baysY; y++) {
          elements.push({
            id: `col_${floor}_${x}_${y}`,
            type: 'column',
            startPoint: { x: x * bayWidth, y: y * bayLength, z: floor * floorHeight },
            endPoint: { x: x * bayWidth, y: y * bayLength, z: (floor + 1) * floorHeight },
            color: '#8B4513',
            stress: Math.random() * 25,
            utilization: Math.random() * 0.8
          });
        }
      }
    }
    
    // Generate beams (X direction)
    for (let floor = 1; floor <= floors; floor++) {
      for (let y = 0; y <= baysY; y++) {
        for (let x = 0; x < baysX; x++) {
          elements.push({
            id: `beam_x_${floor}_${x}_${y}`,
            type: 'beam',
            startPoint: { x: x * bayWidth, y: y * bayLength, z: floor * floorHeight },
            endPoint: { x: (x + 1) * bayWidth, y: y * bayLength, z: floor * floorHeight },
            color: '#4169E1',
            stress: Math.random() * 20,
            utilization: Math.random() * 0.7
          });
        }
      }
    }
    
    setStructuralElements(elements);
  };

  const generateStructuralElements = (project: ProjectData): Structural3DElement[] => {
    const elements: Structural3DElement[] = [];
    const { geometry } = project;
    
    // Generate elements based on project geometry
    for (let floor = 0; floor < geometry.floors; floor++) {
      for (let x = 0; x <= geometry.baysX; x++) {
        for (let y = 0; y <= geometry.baysY; y++) {
          elements.push({
            id: `col_${floor}_${x}_${y}`,
            type: 'column',
            startPoint: { x: x * geometry.bayLength, y: y * geometry.bayWidth, z: floor * geometry.floorHeight },
            endPoint: { x: x * geometry.bayLength, y: y * geometry.bayWidth, z: (floor + 1) * geometry.floorHeight },
            color: '#8B4513',
            stress: Math.random() * 25,
            utilization: Math.random() * 0.8
          });
        }
      }
    }
    
    return elements;
  };

  const render3DScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    if (viewerState.showGrid) drawGrid(ctx, centerX, centerY);
    
    structuralElements.forEach(element => {
      drawStructuralElement(ctx, element, centerX, centerY);
    });
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 1;
    
    const gridSize = 50 * viewerState.zoom;
    const gridLines = 20;
    
    for (let i = -gridLines; i <= gridLines; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX + i * gridSize + viewerState.position.x, centerY - gridLines * gridSize + viewerState.position.y);
      ctx.lineTo(centerX + i * gridSize + viewerState.position.x, centerY + gridLines * gridSize + viewerState.position.y);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - gridLines * gridSize + viewerState.position.x, centerY + i * gridSize + viewerState.position.y);
      ctx.lineTo(centerX + gridLines * gridSize + viewerState.position.x, centerY + i * gridSize + viewerState.position.y);
      ctx.stroke();
    }
  };

  const drawStructuralElement = (ctx: CanvasRenderingContext2D, element: Structural3DElement, centerX: number, centerY: number) => {
    const scale = 20 * viewerState.zoom;
    
    const projected = project3DPoint(element.startPoint, viewerState.rotation, scale, centerX + viewerState.position.x, centerY + viewerState.position.y);
    const projectedEnd = project3DPoint(element.endPoint, viewerState.rotation, scale, centerX + viewerState.position.x, centerY + viewerState.position.y);
    
    let color = element.color;
    if (viewerState.showStresses && element.utilization !== undefined) {
      color = getStressColor(element.utilization);
    }
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = element.type === 'column' ? 6 : 4;
    
    if (element.id === viewerState.selectedElement) {
      ctx.strokeStyle = '#FF6B35';
      ctx.lineWidth += 2;
    }
    
    ctx.beginPath();
    ctx.moveTo(projected.x, projected.y);
    ctx.lineTo(projectedEnd.x, projectedEnd.y);
    ctx.stroke();
    
    if (element.type === 'column') {
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(projectedEnd.x, projectedEnd.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const project3DPoint = (point: {x: number, y: number, z: number}, rotation: {x: number, y: number, z: number}, scale: number, offsetX: number, offsetY: number) => {
    const cosX = Math.cos(rotation.x * Math.PI / 180);
    const sinX = Math.sin(rotation.x * Math.PI / 180);
    const cosY = Math.cos(rotation.y * Math.PI / 180);
    const sinY = Math.sin(rotation.y * Math.PI / 180);
    
    let x1 = point.x * cosY - point.z * sinY;
    let z1 = point.x * sinY + point.z * cosY;
    let y1 = point.y * cosX - z1 * sinX;
    
    return {
      x: offsetX + x1 * scale,
      y: offsetY - y1 * scale
    };
  };

  const getStressColor = (utilization: number): string => {
    if (utilization > 0.8) return '#FF4444';
    if (utilization > 0.6) return '#FF8800';
    if (utilization > 0.4) return '#FFAA00';
    return '#44AA44';
  };

  const resetView = () => {
    setViewerState(prev => ({
      ...prev,
      zoom: 1.0,
      rotation: { x: 15, y: 30, z: 0 },
      position: { x: 0, y: 0 }
    }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-900">3D Structural Viewer</h2>
          {projectData && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              {projectData.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <button
            onClick={() => setViewerState(prev => ({ ...prev, zoom: Math.min(5.0, prev.zoom * 1.2) }))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewerState(prev => ({ ...prev, zoom: Math.max(0.1, prev.zoom * 0.8) }))}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          {/* Display Options */}
          <button
            onClick={() => setViewerState(prev => ({ ...prev, showGrid: !prev.showGrid }))}
            className={`p-2 rounded-lg transition-colors ${
              viewerState.showGrid 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Toggle Grid"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewerState(prev => ({ ...prev, showLoads: !prev.showLoads }))}
            className={`p-2 rounded-lg transition-colors ${
              viewerState.showLoads 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Show Loads"
          >
            <Move className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewerState(prev => ({ ...prev, showStresses: !prev.showStresses }))}
            className={`p-2 rounded-lg transition-colors ${
              viewerState.showStresses 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Show Stresses"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.style.cursor = 'grabbing';
          }}
          onMouseUp={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.style.cursor = 'grab';
          }}
          onWheel={(e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            setViewerState(prev => ({
              ...prev,
              zoom: Math.max(0.1, Math.min(5.0, prev.zoom * zoomFactor))
            }));
          }}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600">Loading structural model...</p>
            </div>
          </div>
        )}
        
        {/* Info Panel */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-sm">
          <div className="space-y-1">
            <div>Elements: {structuralElements.length}</div>
            <div>Zoom: {(viewerState.zoom * 100).toFixed(0)}%</div>
            <div>View: 3D</div>
            {viewerState.selectedElement && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="font-medium">Selected:</div>
                <div>{viewerState.selectedElement}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600">
          <div>Mouse wheel: Zoom</div>
          <div>Click + drag: Rotate</div>
          <div>Shift + drag: Pan</div>
        </div>
      </div>
    </div>
  );
};

export default Viewer3D;
