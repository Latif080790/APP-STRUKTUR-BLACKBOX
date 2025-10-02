/**
 * Enhanced Grid System Manager - Complete X/Y Grid Controls
 */
import React, { useState } from 'react';
import { Grid3x3, Plus, Minus, Save } from 'lucide-react';

interface GridLine {
  id: string;
  position: number;
  label: string;
}

interface EnhancedGridSystem {
  xSpacing: number;
  ySpacing: number;
  xBays: number;
  yBays: number;
  gridLines: {
    xLines: GridLine[];
    yLines: GridLine[];
  };
}

interface EnhancedGridSystemManagerProps {
  dimensions: { length: number; width: number };
  currentGrid: EnhancedGridSystem;
  onGridUpdate: (grid: EnhancedGridSystem) => void;
  onClose: () => void;
}

const EnhancedGridSystemManager: React.FC<EnhancedGridSystemManagerProps> = ({
  dimensions,
  currentGrid,
  onGridUpdate,
  onClose
}) => {
  const [gridSystem, setGridSystem] = useState<EnhancedGridSystem>(currentGrid);

  const generateGridLines = (spacing: number, total: number, direction: 'x' | 'y') => {
    const lines: GridLine[] = [];
    const count = Math.ceil(total / spacing) + 1;
    
    for (let i = 0; i < count; i++) {
      const position = i * spacing;
      if (position <= total) {
        lines.push({
          id: `${direction}${i + 1}`,
          position,
          label: direction === 'x' ? `${i + 1}` : String.fromCharCode(65 + i)
        });
      }
    }
    return lines;
  };

  const updateGridSystem = (updates: Partial<EnhancedGridSystem>) => {
    const newGrid = { ...gridSystem, ...updates };
    
    if (updates.xSpacing !== undefined || updates.ySpacing !== undefined) {
      newGrid.gridLines = {
        xLines: generateGridLines(newGrid.xSpacing, dimensions.length, 'x'),
        yLines: generateGridLines(newGrid.ySpacing, dimensions.width, 'y')
      };
      newGrid.xBays = Math.ceil(dimensions.length / newGrid.xSpacing);
      newGrid.yBays = Math.ceil(dimensions.width / newGrid.ySpacing);
    }
    
    setGridSystem(newGrid);
  };

  const handleSave = () => {
    onGridUpdate(gridSystem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-4xl h-[80%] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Enhanced Grid System</h2>
              <p className="text-sm text-gray-600">
                Building: {dimensions.length}m × {dimensions.width}m
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Controls */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-auto">
            <div className="space-y-6">
              {/* X-Direction Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-Direction Spacing (Length)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={gridSystem.xSpacing}
                      onChange={(e) => updateGridSystem({ xSpacing: parseFloat(e.target.value) || 1 })}
                      min="1"
                      step="0.5"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">m</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Bays: {gridSystem.xBays}</span>
                    <span>Total: {dimensions.length}m</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateGridSystem({ xSpacing: Math.max(1, gridSystem.xSpacing - 0.5) })}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateGridSystem({ xSpacing: gridSystem.xSpacing + 0.5 })}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Y-Direction Spacing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Y-Direction Spacing (Width)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={gridSystem.ySpacing}
                      onChange={(e) => updateGridSystem({ ySpacing: parseFloat(e.target.value) || 1 })}
                      min="1"
                      step="0.5"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">m</span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Bays: {gridSystem.yBays}</span>
                    <span>Total: {dimensions.width}m</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateGridSystem({ ySpacing: Math.max(1, gridSystem.ySpacing - 0.5) })}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateGridSystem({ ySpacing: gridSystem.ySpacing + 0.5 })}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Grid Statistics</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total X Lines:</span>
                    <span>{gridSystem.gridLines.xLines.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Y Lines:</span>
                    <span>{gridSystem.gridLines.yLines.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Bays:</span>
                    <span>{gridSystem.xBays * gridSystem.yBays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bay Area:</span>
                    <span>{(gridSystem.xSpacing * gridSystem.ySpacing).toFixed(1)} m²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Grid */}
          <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <svg 
                viewBox={`0 0 ${dimensions.length * 20} ${dimensions.width * 20}`}
                className="w-full h-80 border border-gray-200 rounded-lg"
              >
                {/* Building outline */}
                <rect
                  x="0" y="0"
                  width={dimensions.length * 20}
                  height={dimensions.width * 20}
                  fill="none" stroke="#374151" strokeWidth="2"
                />
                
                {/* Grid lines */}
                {gridSystem.gridLines.xLines.map(line => (
                  <line
                    key={line.id}
                    x1={line.position * 20} y1="0"
                    x2={line.position * 20} y2={dimensions.width * 20}
                    stroke="#6b7280" strokeWidth="1"
                  />
                ))}
                
                {gridSystem.gridLines.yLines.map(line => (
                  <line
                    key={line.id}
                    x1="0" y1={line.position * 20}
                    x2={dimensions.length * 20} y2={line.position * 20}
                    stroke="#6b7280" strokeWidth="1"
                  />
                ))}
                
                {/* Labels */}
                {gridSystem.gridLines.xLines.map(line => (
                  <text
                    key={`label-${line.id}`}
                    x={line.position * 20} y="-5"
                    textAnchor="middle" className="text-xs fill-gray-600"
                    fontSize="12"
                  >
                    {line.label}
                  </text>
                ))}
                
                {gridSystem.gridLines.yLines.map(line => (
                  <text
                    key={`label-${line.id}`}
                    x="-15" y={line.position * 20 + 4}
                    textAnchor="middle" className="text-xs fill-gray-600"
                    fontSize="12"
                  >
                    {line.label}
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Grid: {gridSystem.xBays}x{gridSystem.yBays} bays
          </div>
          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Apply Grid System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGridSystemManager;