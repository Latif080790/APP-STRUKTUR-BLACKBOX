import React, { useRef, useEffect } from 'react';
import { Structure3D, Node, Element } from '@/types/structural';

interface Structure3DViewerProps {
  structure: Structure3D;
  className?: string;
}

// Simple SVG-based 3D viewer for structural elements
export const Structure3DViewer: React.FC<Structure3DViewerProps> = ({ 
  structure, 
  className = '' 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Calculate viewBox based on structure bounds
  const calculateViewBox = () => {
    if (structure.nodes.length === 0) {
      return { x: 0, y: 0, width: 800, height: 600 };
    }
    
    const xCoords = structure.nodes.map(n => n.x);
    const zCoords = structure.nodes.map(n => n.z);
    
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minZ = Math.min(...zCoords);
    const maxZ = Math.max(...zCoords);
    
    const width = maxX - minX;
    const height = maxZ - minZ;
    
    // Add some padding
    const padding = Math.max(width, height) * 0.1;
    
    return {
      x: minX - padding,
      y: minZ - padding,
      width: width + padding * 2,
      height: height + padding * 2
    };
  };
  
  const viewBox = calculateViewBox();
  
  // Project 3D coordinates to 2D for SVG display
  const projectTo2D = (node: Node) => {
    // Simple orthographic projection (top view)
    return {
      x: node.x,
      y: node.z
    };
  };
  
  // Render nodes as circles
  const renderNodes = () => {
    return structure.nodes.map(node => {
      const pos = projectTo2D(node);
      return (
        <circle
          key={`node-${node.id}`}
          cx={pos.x}
          cy={pos.y}
          r="0.2"
          className="node-point"
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth="0.05"
        />
      );
    });
  };
  
  // Render elements as lines
  const renderElements = () => {
    return structure.elements.map(element => {
      const startNode = structure.nodes.find(n => n.id === element.nodes[0]);
      const endNode = structure.nodes.find(n => n.id === element.nodes[1]);
      
      if (!startNode || !endNode) return null;
      
      const startPos = projectTo2D(startNode);
      const endPos = projectTo2D(endNode);
      
      return (
        <line
          key={`element-${element.id}`}
          x1={startPos.x}
          y1={startPos.y}
          x2={endPos.x}
          y2={endPos.y}
          className={`element-line ${element.type}`}
          strokeWidth="0.1"
          stroke={element.type === 'column' ? '#64748b' : element.type === 'beam' ? '#94a3b8' : '#9ca3af'}
        />
      );
    });
  };
  
  // Render grid lines
  const renderGrid = () => {
    const gridLines = [];
    const gridSize = 10;
    const gridSpacing = 1;
    
    // Vertical lines
    for (let i = 0; i <= gridSize; i++) {
      const x = i * gridSpacing;
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={gridSize}
          className="grid-lines"
          strokeWidth="0.02"
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      const y = i * gridSpacing;
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={gridSize}
          y2={y}
          className="grid-lines"
          strokeWidth="0.02"
        />
      );
    }
    
    return gridLines;
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full bg-gradient-to-b from-sky-50 to-sky-100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {renderGrid()}
        
        {/* Elements */}
        {renderElements()}
        
        {/* Nodes */}
        {renderNodes()}
      </svg>
      
      {structure.elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 bg-white/80 rounded-lg shadow">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Structure Data</h3>
            <p className="text-gray-600">Design elements to generate 3D visualization</p>
          </div>
        </div>
      )}
    </div>
  );
};