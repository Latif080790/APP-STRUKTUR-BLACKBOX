/**
 * Building Geometry Panel Component
 * Separated from AnalyzeStructureCore for better maintainability
 */
import React from 'react';
import { Layers, Eye } from 'lucide-react';
import { useAnalysisStore } from '../../../stores/useAnalysisStore';

const BuildingGeometryPanel: React.FC = () => {
  const {
    buildingGeometry,
    setBuildingGeometry,
    setShow3DViewer
  } = useAnalysisStore();

  return (
    <div className="bg-white rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Building Geometry</h3>
        </div>
        <button 
          onClick={() => setShow3DViewer(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all text-sm font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-green-400 flex items-center space-x-2 animate-pulse hover:animate-none"
        >
          <Eye className="w-6 h-6" />
          <span>View 3D Model</span>
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full ml-1">
            ✨ Interactive
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
          <select 
            value={buildingGeometry.type}
            onChange={(e) => setBuildingGeometry(prev => ({ 
              ...prev, 
              type: e.target.value as any 
            }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="office">Office Building</option>
            <option value="residential">Residential Building</option>
            <option value="industrial">Industrial Building</option>
            <option value="educational">Educational Building</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stories</label>
          <input 
            type="number" 
            value={buildingGeometry.stories}
            onChange={(e) => setBuildingGeometry(prev => ({ 
              ...prev, 
              stories: parseInt(e.target.value) || 1 
            }))}
            min="1" 
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
          <input 
            type="number" 
            value={buildingGeometry.dimensions.length}
            onChange={(e) => {
              const length = parseFloat(e.target.value) || 0;
              setBuildingGeometry(prev => ({ 
                ...prev, 
                dimensions: { ...prev.dimensions, length },
                grid: { 
                  ...prev.grid, 
                  totalGridX: length, 
                  xBays: Math.round(length / prev.grid.xSpacing) || 1
                }
              }));
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Width (m)</label>
          <input 
            type="number" 
            value={buildingGeometry.dimensions.width}
            onChange={(e) => {
              const width = parseFloat(e.target.value) || 0;
              setBuildingGeometry(prev => ({ 
                ...prev, 
                dimensions: { ...prev.dimensions, width },
                grid: { 
                  ...prev.grid, 
                  totalGridY: width, 
                  yBays: Math.round(width / prev.grid.ySpacing) || 1
                }
              }));
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height (m)</label>
          <input 
            type="number" 
            value={buildingGeometry.dimensions.height}
            onChange={(e) => {
              const height = parseFloat(e.target.value) || 0;
              setBuildingGeometry(prev => ({ 
                ...prev, 
                dimensions: { ...prev.dimensions, height }
              }));
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grid X-Spacing (m)</label>
          <input 
            type="number" 
            value={buildingGeometry.grid.xSpacing}
            onChange={(e) => {
              const xSpacing = parseFloat(e.target.value) || 1;
              setBuildingGeometry(prev => ({ 
                ...prev, 
                grid: { 
                  ...prev.grid, 
                  xSpacing,
                  xBays: Math.round(prev.dimensions.length / xSpacing) || 1
                }
              }));
            }}
            step="0.5"
            min="1"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grid Y-Spacing (m)</label>
          <input 
            type="number" 
            value={buildingGeometry.grid.ySpacing}
            onChange={(e) => {
              const ySpacing = parseFloat(e.target.value) || 1;
              setBuildingGeometry(prev => ({ 
                ...prev, 
                grid: { 
                  ...prev.grid, 
                  ySpacing,
                  yBays: Math.round(prev.dimensions.width / ySpacing) || 1
                }
              }));
            }}
            step="0.5"
            min="1"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" 
          />
        </div>
      </div>

      {/* Structural System Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frame Type</label>
          <select 
            value={buildingGeometry.structural.frameType}
            onChange={(e) => setBuildingGeometry(prev => ({ 
              ...prev, 
              structural: { 
                ...prev.structural, 
                frameType: e.target.value as any 
              }
            }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="moment">Moment Frame</option>
            <option value="braced">Braced Frame</option>
            <option value="shearWall">Shear Wall</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foundation Type</label>
          <select 
            value={buildingGeometry.structural.foundation}
            onChange={(e) => setBuildingGeometry(prev => ({ 
              ...prev, 
              structural: { 
                ...prev.structural, 
                foundation: e.target.value as any 
              }
            }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="strip">Strip Foundation</option>
            <option value="mat">Mat Foundation</option>
            <option value="pile">Pile Foundation</option>
          </select>
        </div>
      </div>

      {/* Load Information with Validation */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Load Information</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dead Load (kN/m²)</label>
            <input 
              type="number" 
              value={buildingGeometry.loads.deadLoad}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                if (value >= 0 && value <= 20) { // Engineering limit validation
                  setBuildingGeometry(prev => ({ 
                    ...prev, 
                    loads: { 
                      ...prev.loads, 
                      deadLoad: value
                    }
                  }));
                }
              }}
              step="0.1"
              min="0"
              max="20"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${
                buildingGeometry.loads.deadLoad > 15 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}
            />
            {buildingGeometry.loads.deadLoad > 15 && (
              <div className="text-xs text-yellow-600 mt-1">⚠ High dead load - verify structural requirements</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Live Load (kN/m²)</label>
            <input 
              type="number" 
              value={buildingGeometry.loads.liveLoad}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                if (value >= 0 && value <= 15) { // Engineering limit validation
                  setBuildingGeometry(prev => ({ 
                    ...prev, 
                    loads: { 
                      ...prev.loads, 
                      liveLoad: value
                    }
                  }));
                }
              }}
              step="0.1"
              min="0"
              max="15"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${
                buildingGeometry.loads.liveLoad > 10 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}
            />
            {buildingGeometry.loads.liveLoad > 10 && (
              <div className="text-xs text-yellow-600 mt-1">⚠ High live load - check occupancy requirements</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wind Load (kN/m²)</label>
            <input 
              type="number" 
              value={buildingGeometry.loads.windLoad || 0}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                if (value >= 0 && value <= 5) { // Engineering limit validation
                  setBuildingGeometry(prev => ({ 
                    ...prev, 
                    loads: { 
                      ...prev.loads, 
                      windLoad: value
                    }
                  }));
                }
              }}
              step="0.1"
              min="0"
              max="5"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${
                (buildingGeometry.loads.windLoad || 0) > 3 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}
            />
            {(buildingGeometry.loads.windLoad || 0) > 3 && (
              <div className="text-xs text-yellow-600 mt-1">⚠ High wind load - verify design wind speed</div>
            )}
          </div>
        </div>
        
        {/* Load Validation Summary */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Load Validation:</strong> 
            {buildingGeometry.loads.deadLoad + buildingGeometry.loads.liveLoad > 20 
              ? ' ⚠ Total load exceeds typical limits - review structural capacity' 
              : ' ✓ Load values within typical ranges'}
          </div>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Grid Summary:</strong> {buildingGeometry.grid.xBays} × {buildingGeometry.grid.yBays} bays 
          ({buildingGeometry.grid.xSpacing}m × {buildingGeometry.grid.ySpacing}m spacing)
        </div>
        <div className="text-xs text-blue-600 mt-1">
          Total area: {(buildingGeometry.dimensions.length * buildingGeometry.dimensions.width).toFixed(1)} m²
        </div>
      </div>
    </div>
  );
};

export default BuildingGeometryPanel;