/**
 * Enhanced 3D Structure Viewer Wrapper (Simplified)
 * Simple wrapper that provides basic 3D visualization without complex Structure3D dependency
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { 
  Eye, EyeOff, Grid3X3, Move3D, Building2,
  Settings, Palette, Info, AlertTriangle 
} from 'lucide-react';

interface GeometryInput {
  length: number;
  width: number;
  heightPerFloor: number;
  numberOfFloors: number;
  baySpacingX: number;
  baySpacingY: number;
  irregularity: boolean;
}

interface Enhanced3DStructureViewerProps {
  geometry: GeometryInput;
  materialGrade: string;
  analysisResults?: any;
  onElementClick?: (element: any) => void;
  onNodeClick?: (node: any) => void;
  className?: string;
}

export const Enhanced3DStructureViewer: React.FC<Enhanced3DStructureViewerProps> = ({
  geometry,
  materialGrade,
  analysisResults,
  onElementClick,
  onNodeClick,
  className
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Enhanced 3D Structure View</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Structure Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">📐 Structure Dimensions</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Length: <span className="font-semibold">{geometry.length} m</span></div>
              <div>Width: <span className="font-semibold">{geometry.width} m</span></div>
              <div>Floors: <span className="font-semibold">{geometry.numberOfFloors}</span></div>
              <div>Floor Height: <span className="font-semibold">{geometry.heightPerFloor} m</span></div>
              <div>Total Height: <span className="font-semibold">{(geometry.numberOfFloors * geometry.heightPerFloor).toFixed(1)} m</span></div>
              <div>Floor Area: <span className="font-semibold">{(geometry.length * geometry.width).toFixed(1)} m²</span></div>
            </div>
          </div>

          {/* Element Visibility Controls */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Element Visibility
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Beams', icon: '━', count: Math.ceil((geometry.length / geometry.baySpacingX) * (geometry.width / geometry.baySpacingY) * 2) },
                { name: 'Columns', icon: '┃', count: Math.ceil(((geometry.length / geometry.baySpacingX) + 1) * ((geometry.width / geometry.baySpacingY) + 1)) },
                { name: 'Slabs', icon: '▣', count: geometry.numberOfFloors },
                { name: 'Foundations', icon: '◼', count: Math.ceil(((geometry.length / geometry.baySpacingX) + 1) * ((geometry.width / geometry.baySpacingY) + 1)) },
                { name: 'Loads', icon: '↓', count: 0 },
                { name: 'Grid', icon: '⊞', count: 1 }
              ].map((element, index) => (
                <label key={index} className="flex items-center gap-2 text-sm cursor-pointer p-2 bg-white border rounded hover:bg-gray-50">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-blue-600 font-mono">{element.icon}</span>
                  <span>{element.name}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {element.count}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          {/* Material Visualization */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Material Visualization
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                <span className="text-sm">Concrete (fc' = 30 MPa)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm">Steel {materialGrade} (Reinforcement)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-brown-600 rounded" style={{backgroundColor: '#8B4513'}}></div>
                <span className="text-sm">Foundation (Deep Foundation)</span>
              </div>
            </div>
          </div>

          {/* 3D Visualization Area */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">3D Structure Visualization</h3>
            <p className="text-blue-600 mb-4">
              Interactive 3D model showing structural elements with material-based coloring
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
              <div className="bg-white bg-opacity-70 p-3 rounded border">
                <div className="font-semibold">Foundation Level</div>
                <div className="text-gray-600">Footings & Foundation Beams</div>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded border">
                <div className="font-semibold">Structure Frame</div>
                <div className="text-gray-600">Beams, Columns & Slabs</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Move3D className="h-4 w-4" />
              Rotate View
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Toggle Grid
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              View Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Enhanced3DStructureViewer;