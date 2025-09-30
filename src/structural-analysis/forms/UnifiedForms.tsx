import React, { useState } from 'react';
import { 
  ProjectInfoFormData, 
  GeometryFormData, 
  MaterialFormData, 
  LoadsFormData, 
  SeismicFormData 
} from '../types/UnifiedTypes';

// Project Information Form
export const ProjectInfoForm: React.FC<{
  data: ProjectInfo;
  onChange: (data: ProjectInfo) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            placeholder="Enter project name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            placeholder="Enter project description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Engineer</label>
          <input
            type="text"
            value={data.engineer}
            onChange={(e) => onChange({ ...data, engineer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            placeholder="Engineer name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ ...data, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
          />
        </div>
      </div>
    </div>
  );
};

// Geometry Definition Form
export const GeometryForm: React.FC<{
  data: GeometryDefinition;
  onChange: (data: GeometryDefinition) => void;
}> = ({ data, onChange }) => {
  const addNode = () => {
    const newNode = {
      id: `node_${data.nodes.length + 1}`,
      x: 0,
      y: 0,
      z: 0,
      restraints: { dx: false, dy: false, dz: false, rx: false, ry: false, rz: false }
    };
    onChange({ ...data, nodes: [...data.nodes, newNode] });
  };

  const addElement = () => {
    if (data.nodes.length >= 2) {
      const newElement = {
        id: `element_${data.elements.length + 1}`,
        nodeIds: [data.nodes[0].id, data.nodes[1].id],
        section: {
          name: 'Default',
          area: 0.01,
          momentOfInertiaY: 0.0001,
          momentOfInertiaZ: 0.0001,
          torsionalConstant: 0.0001,
          height: 0.3,
          width: 0.2
        },
        type: 'beam' as const
      };
      onChange({ ...data, elements: [...data.elements, newElement] });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Geometry Definition</h3>
      
      {/* Nodes Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-gray-700">Nodes</h4>
          <button
            onClick={addNode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Node
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/50 rounded-lg">
            <thead>
              <tr className="bg-gray-100/50">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">X (m)</th>
                <th className="px-4 py-2 text-left">Y (m)</th>
                <th className="px-4 py-2 text-left">Z (m)</th>
                <th className="px-4 py-2 text-left">Restraints</th>
              </tr>
            </thead>
            <tbody>
              {data.nodes.map((node, index) => (
                <tr key={node.id}>
                  <td className="px-4 py-2">{node.id}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={node.x}
                      onChange={(e) => {
                        const newNodes = [...data.nodes];
                        newNodes[index].x = parseFloat(e.target.value) || 0;
                        onChange({ ...data, nodes: newNodes });
                      }}
                      className="w-20 px-2 py-1 border rounded"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={node.y}
                      onChange={(e) => {
                        const newNodes = [...data.nodes];
                        newNodes[index].y = parseFloat(e.target.value) || 0;
                        onChange({ ...data, nodes: newNodes });
                      }}
                      className="w-20 px-2 py-1 border rounded"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={node.z}
                      onChange={(e) => {
                        const newNodes = [...data.nodes];
                        newNodes[index].z = parseFloat(e.target.value) || 0;
                        onChange({ ...data, nodes: newNodes });
                      }}
                      className="w-20 px-2 py-1 border rounded"
                      step="0.1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1 text-xs">
                      {['dx', 'dy', 'dz', 'rx', 'ry', 'rz'].map((restraint) => (
                        <label key={restraint} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={node.restraints[restraint as keyof typeof node.restraints]}
                            onChange={(e) => {
                              const newNodes = [...data.nodes];
                              newNodes[index].restraints[restraint as keyof typeof node.restraints] = e.target.checked;
                              onChange({ ...data, nodes: newNodes });
                            }}
                            className="mr-1"
                          />
                          {restraint}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Elements Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium text-gray-700">Elements</h4>
          <button
            onClick={addElement}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={data.nodes.length < 2}
          >
            Add Element
          </button>
        </div>
        
        <div className="grid gap-4">
          {data.elements.map((element, index) => (
            <div key={element.id} className="p-4 bg-white/30 rounded-lg border">
              <h5 className="font-medium mb-2">{element.id}</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <label>Node 1:</label>
                  <select
                    value={element.nodeIds[0]}
                    onChange={(e) => {
                      const newElements = [...data.elements];
                      newElements[index].nodeIds[0] = e.target.value;
                      onChange({ ...data, elements: newElements });
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    {data.nodes.map(node => (
                      <option key={node.id} value={node.id}>{node.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Node 2:</label>
                  <select
                    value={element.nodeIds[1]}
                    onChange={(e) => {
                      const newElements = [...data.elements];
                      newElements[index].nodeIds[1] = e.target.value;
                      onChange({ ...data, elements: newElements });
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    {data.nodes.map(node => (
                      <option key={node.id} value={node.id}>{node.id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Area (m²):</label>
                  <input
                    type="number"
                    value={element.section.area}
                    onChange={(e) => {
                      const newElements = [...data.elements];
                      newElements[index].section.area = parseFloat(e.target.value) || 0;
                      onChange({ ...data, elements: newElements });
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                    step="0.001"
                  />
                </div>
                <div>
                  <label>Iy (m⁴):</label>
                  <input
                    type="number"
                    value={element.section.momentOfInertiaY}
                    onChange={(e) => {
                      const newElements = [...data.elements];
                      newElements[index].section.momentOfInertiaY = parseFloat(e.target.value) || 0;
                      onChange({ ...data, elements: newElements });
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                    step="0.0001"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Material Properties Form
export const MaterialForm: React.FC<{
  data: MaterialProperties;
  onChange: (data: MaterialProperties) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Material Properties</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
          <select
            value={data.type}
            onChange={(e) => onChange({ ...data, type: e.target.value as 'concrete' | 'steel' | 'timber' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
          >
            <option value="concrete">Concrete</option>
            <option value="steel">Steel</option>
            <option value="timber">Timber</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Young's Modulus (MPa)</label>
          <input
            type="number"
            value={data.youngModulus}
            onChange={(e) => onChange({ ...data, youngModulus: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="1000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poisson's Ratio</label>
          <input
            type="number"
            value={data.poissonRatio}
            onChange={(e) => onChange({ ...data, poissonRatio: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="0.01"
            min="0"
            max="0.5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Density (kg/m³)</label>
          <input
            type="number"
            value={data.density}
            onChange={(e) => onChange({ ...data, density: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Yield Strength (MPa)</label>
          <input
            type="number"
            value={data.yieldStrength}
            onChange={(e) => onChange({ ...data, yieldStrength: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ultimate Strength (MPa)</label>
          <input
            type="number"
            value={data.ultimateStrength}
            onChange={(e) => onChange({ ...data, ultimateStrength: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="10"
          />
        </div>
      </div>
      
      {/* Predefined Materials */}
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Predefined Materials</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onChange({
              type: 'concrete',
              youngModulus: 25000,
              poissonRatio: 0.2,
              density: 2400,
              yieldStrength: 25,
              ultimateStrength: 30
            })}
            className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-800 transition-colors"
          >
            Concrete fc' = 25 MPa
          </button>
          
          <button
            onClick={() => onChange({
              type: 'steel',
              youngModulus: 200000,
              poissonRatio: 0.3,
              density: 7850,
              yieldStrength: 250,
              ultimateStrength: 400
            })}
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-800 transition-colors"
          >
            Steel Grade 250
          </button>
          
          <button
            onClick={() => onChange({
              type: 'timber',
              youngModulus: 12000,
              poissonRatio: 0.4,
              density: 600,
              yieldStrength: 40,
              ultimateStrength: 50
            })}
            className="p-3 bg-green-100 hover:bg-green-200 rounded-lg text-sm text-green-800 transition-colors"
          >
            Timber Class II
          </button>
        </div>
      </div>
    </div>
  );
};

// Load Definition Form
export const LoadsForm: React.FC<{
  data: LoadDefinition[];
  onChange: (data: LoadDefinition[]) => void;
}> = ({ data, onChange }) => {
  const addLoad = () => {
    const newLoad: LoadDefinition = {
      id: `load_${data.length + 1}`,
      type: 'point',
      magnitude: 0,
      direction: 'vertical',
      nodeId: '',
      elementId: '',
      position: 0,
      loadCase: 'dead'
    };
    onChange([...data, newLoad]);
  };

  const removeLoad = (index: number) => {
    const newLoads = data.filter((_, i) => i !== index);
    onChange(newLoads);
  };

  return (
    <div className="space-y-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Load Definition</h3>
        <button
          onClick={addLoad}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Add Load
        </button>
      </div>
      
      <div className="space-y-4">
        {data.map((load, index) => (
          <div key={load.id} className="p-4 bg-white/30 rounded-lg border">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">{load.id}</h4>
              <button
                onClick={() => removeLoad(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Load Type</label>
                <select
                  value={load.type}
                  onChange={(e) => {
                    const newLoads = [...data];
                    newLoads[index].type = e.target.value as 'point' | 'distributed' | 'moment';
                    onChange(newLoads);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="point">Point Load</option>
                  <option value="distributed">Distributed Load</option>
                  <option value="moment">Moment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Magnitude</label>
                <input
                  type="number"
                  value={load.magnitude}
                  onChange={(e) => {
                    const newLoads = [...data];
                    newLoads[index].magnitude = parseFloat(e.target.value) || 0;
                    onChange(newLoads);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                <select
                  value={load.direction}
                  onChange={(e) => {
                    const newLoads = [...data];
                    newLoads[index].direction = e.target.value as 'vertical' | 'horizontal' | 'axial';
                    onChange(newLoads);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="vertical">Vertical</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="axial">Axial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Load Case</label>
                <select
                  value={load.loadCase}
                  onChange={(e) => {
                    const newLoads = [...data];
                    newLoads[index].loadCase = e.target.value as 'dead' | 'live' | 'wind' | 'seismic';
                    onChange(newLoads);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="dead">Dead Load</option>
                  <option value="live">Live Load</option>
                  <option value="wind">Wind Load</option>
                  <option value="seismic">Seismic Load</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No loads defined. Click "Add Load" to start.
          </div>
        )}
      </div>
    </div>
  );
};

// Seismic Parameters Form
export const SeismicForm: React.FC<{
  data: SeismicParameters;
  onChange: (data: SeismicParameters) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Seismic Parameters (SNI 1726:2019)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Class</label>
          <select
            value={data.siteClass}
            onChange={(e) => onChange({ ...data, siteClass: e.target.value as 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
          >
            <option value="SA">SA - Hard Rock</option>
            <option value="SB">SB - Rock</option>
            <option value="SC">SC - Very Dense Soil/Soft Rock</option>
            <option value="SD">SD - Stiff Soil</option>
            <option value="SE">SE - Soft Clay Soil</option>
            <option value="SF">SF - Special Site</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Risk Category</label>
          <select
            value={data.riskCategory}
            onChange={(e) => onChange({ ...data, riskCategory: e.target.value as 'I' | 'II' | 'III' | 'IV' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
          >
            <option value="I">I - Low Risk</option>
            <option value="II">II - Standard</option>
            <option value="III">III - Important</option>
            <option value="IV">IV - Essential</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ss (g)</label>
          <input
            type="number"
            value={data.ss}
            onChange={(e) => onChange({ ...data, ss: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="0.01"
            placeholder="Mapped spectral acceleration"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">S1 (g)</label>
          <input
            type="number"
            value={data.s1}
            onChange={(e) => onChange({ ...data, s1: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="0.01"
            placeholder="Mapped spectral acceleration"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Response Modification Factor (R)</label>
          <input
            type="number"
            value={data.responseModificationFactor}
            onChange={(e) => onChange({ ...data, responseModificationFactor: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="0.5"
            min="1"
            max="8"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deflection Amplification Factor (Cd)</label>
          <input
            type="number"
            value={data.deflectionAmplificationFactor}
            onChange={(e) => onChange({ ...data, deflectionAmplificationFactor: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/80"
            step="0.5"
            min="1"
            max="7"
          />
        </div>
      </div>
      
      {/* Computed Values Display */}
      <div className="mt-6 p-4 bg-blue-50/50 rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Computed Seismic Parameters</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Fa:</span>
            <span className="ml-2">{data.fa?.toFixed(3) || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">Fv:</span>
            <span className="ml-2">{data.fv?.toFixed(3) || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">SMS:</span>
            <span className="ml-2">{data.sms?.toFixed(3) || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">SM1:</span>
            <span className="ml-2">{data.sm1?.toFixed(3) || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">SDS:</span>
            <span className="ml-2">{data.sds?.toFixed(3) || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">SD1:</span>
            <span className="ml-2">{data.sd1?.toFixed(3) || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium">T0:</span>
            <span className="ml-2">{data.t0?.toFixed(3) || 'N/A'} s</span>
          </div>
          <div>
            <span className="font-medium">Ts:</span>
            <span className="ml-2">{data.ts?.toFixed(3) || 'N/A'} s</span>
          </div>
        </div>
      </div>
    </div>
  );
};