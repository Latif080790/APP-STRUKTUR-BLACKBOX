import React, { useState, useCallback, useMemo } from 'react';
import {
  PenTool,
  Layers,
  Grid,
  Ruler,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Upload,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Square,
  Circle,
  Minus,
  Triangle,
  Type,
  Image,
  Settings
} from 'lucide-react';

interface DrawingElement {
  id: string;
  type: 'line' | 'rectangle' | 'circle' | 'text' | 'dimension' | 'symbol';
  properties: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    text?: string;
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    layer: string;
  };
  visible: boolean;
  locked: boolean;
}

interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  elements: string[];
}

interface DrawingTemplate {
  id: string;
  name: string;
  type: 'plan' | 'elevation' | 'section' | 'detail';
  description: string;
  layers: DrawingLayer[];
  elements: DrawingElement[];
}

const ConstructionDrawingSystem: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<DrawingTemplate | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [currentLayer, setCurrentLayer] = useState<string>('structural');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [gridVisible, setGridVisible] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);

  // Drawing Templates
  const drawingTemplates: DrawingTemplate[] = useMemo(() => [
    {
      id: 'foundation-plan',
      name: 'Foundation Plan',
      type: 'plan',
      description: 'Foundation layout with footings and pile caps',
      layers: [
        { id: 'structural', name: 'Structural Elements', visible: true, locked: false, color: '#000000', elements: [] },
        { id: 'dimensions', name: 'Dimensions', visible: true, locked: false, color: '#0000FF', elements: [] },
        { id: 'text', name: 'Text & Labels', visible: true, locked: false, color: '#008000', elements: [] },
        { id: 'grid', name: 'Grid Lines', visible: true, locked: false, color: '#808080', elements: [] }
      ],
      elements: []
    },
    {
      id: 'framing-plan',
      name: 'Framing Plan',
      type: 'plan',
      description: 'Structural framing layout with beams and columns',
      layers: [
        { id: 'beams', name: 'Beams', visible: true, locked: false, color: '#FF0000', elements: [] },
        { id: 'columns', name: 'Columns', visible: true, locked: false, color: '#0000FF', elements: [] },
        { id: 'bracing', name: 'Bracing', visible: true, locked: false, color: '#800080', elements: [] },
        { id: 'dimensions', name: 'Dimensions', visible: true, locked: false, color: '#000000', elements: [] }
      ],
      elements: []
    },
    {
      id: 'elevation',
      name: 'Building Elevation',
      type: 'elevation',
      description: 'Building elevation with structural elements',
      layers: [
        { id: 'structure', name: 'Structure', visible: true, locked: false, color: '#000000', elements: [] },
        { id: 'levels', name: 'Level Lines', visible: true, locked: false, color: '#0000FF', elements: [] },
        { id: 'dimensions', name: 'Dimensions', visible: true, locked: false, color: '#008000', elements: [] }
      ],
      elements: []
    },
    {
      id: 'connection-detail',
      name: 'Connection Details',
      type: 'detail',
      description: 'Detailed connection drawings with specifications',
      layers: [
        { id: 'steel', name: 'Steel Elements', visible: true, locked: false, color: '#000000', elements: [] },
        { id: 'bolts', name: 'Bolts & Fasteners', visible: true, locked: false, color: '#FF0000', elements: [] },
        { id: 'welds', name: 'Weld Symbols', visible: true, locked: false, color: '#800080', elements: [] },
        { id: 'dimensions', name: 'Dimensions', visible: true, locked: false, color: '#0000FF', elements: [] }
      ],
      elements: []
    }
  ], []);

  // Drawing Tools
  const drawingTools = [
    { id: 'select', name: 'Select', icon: Move },
    { id: 'line', name: 'Line', icon: Minus },
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'text', name: 'Text', icon: Type },
    { id: 'dimension', name: 'Dimension', icon: Ruler },
    { id: 'symbol', name: 'Symbol', icon: Triangle }
  ];

  // Create New Drawing
  const createNewDrawing = useCallback((template: DrawingTemplate) => {
    setActiveTemplate({ ...template });
    setSelectedTool('select');
    setCurrentLayer(template.layers[0]?.id || 'structural');
  }, []);

  // Toggle Layer Visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    if (!activeTemplate) return;
    
    const updatedTemplate = {
      ...activeTemplate,
      layers: activeTemplate.layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    };
    
    setActiveTemplate(updatedTemplate);
  }, [activeTemplate]);

  // Toggle Layer Lock
  const toggleLayerLock = useCallback((layerId: string) => {
    if (!activeTemplate) return;
    
    const updatedTemplate = {
      ...activeTemplate,
      layers: activeTemplate.layers.map(layer =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    };
    
    setActiveTemplate(updatedTemplate);
  }, [activeTemplate]);

  // Export Drawing
  const exportDrawing = useCallback((format: 'dwg' | 'pdf' | 'png') => {
    if (!activeTemplate) return;
    
    // Simulate export
    const blob = new Blob(['Drawing export data'], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate.name.replace(/\s+/g, '-')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [activeTemplate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-3">
          <PenTool className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Construction Drawing System</h2>
            <p className="text-indigo-100">Professional CAD integration with automated drawing generation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-indigo-100 text-sm">Active Template</div>
            <div className="text-xl font-bold">{activeTemplate?.name || 'None'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-indigo-100 text-sm">Current Layer</div>
            <div className="text-xl font-bold">{currentLayer}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-indigo-100 text-sm">Zoom Level</div>
            <div className="text-xl font-bold">{zoomLevel}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-indigo-100 text-sm">Templates</div>
            <div className="text-xl font-bold">{drawingTemplates.length}</div>
          </div>
        </div>
      </div>

      {/* Drawing Templates */}
      {!activeTemplate && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-indigo-600" />
            Drawing Templates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drawingTemplates.map((template) => (
              <div key={template.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      template.type === 'plan' ? 'bg-blue-100' :
                      template.type === 'elevation' ? 'bg-green-100' :
                      template.type === 'section' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      <PenTool className={`w-4 h-4 ${
                        template.type === 'plan' ? 'text-blue-600' :
                        template.type === 'elevation' ? 'text-green-600' :
                        template.type === 'section' ? 'text-orange-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{template.name}</h4>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase">
                        {template.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm mb-3">{template.description}</p>
                
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">Layers ({template.layers.length})</h5>
                  <div className="space-y-1">
                    {template.layers.map((layer) => (
                      <div key={layer.id} className="flex items-center space-x-2 text-xs">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: layer.color }}
                        ></div>
                        <span className="text-slate-600">{layer.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => createNewDrawing(template)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  Open Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawing Interface */}
      {activeTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Tools</h3>
            
            <div className="space-y-2 mb-6">
              {drawingTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    selectedTool === tool.id
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <tool.icon className="w-4 h-4" />
                  <span className="text-sm">{tool.name}</span>
                </button>
              ))}
            </div>
            
            {/* View Controls */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">View</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Zoom</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(25, prev - 25))}
                      className="p-1 text-slate-600 hover:text-slate-800"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-slate-500 w-12 text-center">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(400, prev + 25))}
                      className="p-1 text-slate-600 hover:text-slate-800"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gridVisible}
                    onChange={(e) => setGridVisible(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                  />
                  <span className="text-sm text-slate-600">Show Grid</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={snapToGrid}
                    onChange={(e) => setSnapToGrid(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded"
                  />
                  <span className="text-sm text-slate-600">Snap to Grid</span>
                </label>
              </div>
            </div>
          </div>

          {/* Drawing Canvas */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{activeTemplate.name}</h3>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTemplate(null)}
                  className="px-3 py-1 text-slate-600 hover:text-slate-800 text-sm"
                >
                  Close
                </button>
                
                <button
                  onClick={() => exportDrawing('dwg')}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  Export DWG
                </button>
              </div>
            </div>
            
            {/* Canvas Area */}
            <div className="relative bg-white" style={{ height: '500px' }}>
              {gridVisible && (
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <PenTool className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>Drawing Canvas</p>
                  <p className="text-sm">Use tools to create drawing elements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Layers Panel */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Layers</h3>
            
            <div className="space-y-2">
              {activeTemplate.layers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentLayer === layer.id
                      ? 'bg-indigo-50 border-indigo-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                  onClick={() => setCurrentLayer(layer.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: layer.color }}
                      ></div>
                      <span className="text-sm font-medium text-slate-800">{layer.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(layer.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    {layer.elements.length} elements
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstructionDrawingSystem;