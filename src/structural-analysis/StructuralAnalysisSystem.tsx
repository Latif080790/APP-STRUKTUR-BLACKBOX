import React, { useState } from 'react';
import { Structure3D, Element, AnalysisResult } from '@/types/structural';
import { BeamDesignModule } from './design/BeamDesignModule';
import { ColumnDesignModule } from './design/ColumnDesignModule';
import { SlabDesignModule } from './design/SlabDesignModule';
import { Structure3DViewer } from './Structure3DViewer';
import { StructuralDrawing } from './drawing/StructuralDrawing';
import { analyzeStructure } from './analysis/StructuralAnalyzer';

// Import icons
import { 
  Building2, 
  AlertCircle,
  Info,
  Star,
  Zap,
  Waves,
  Activity
} from 'lucide-react';

// Import dynamic analysis functions
import { dynamicAnalysis } from './analysis/DynamicAnalyzer';
import DynamicAnalysisResults from './DynamicAnalysisResults';

// Simple UI components
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border rounded-lg shadow-sm">{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b p-4">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4">{children}</div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'default' | 'outline';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'default', disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${
      disabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : variant === 'outline' 
        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
  >
    {children}
  </button>
);

const Select: React.FC<{ 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode 
}> = ({ value, onValueChange, children }) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded px-3 py-2 w-full appearance-none bg-white"
    >
      {children}
    </select>
  </div>
);

const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const SelectValue: React.FC = () => null;

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);

// Icons
const Building: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const Beams: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Columns: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const Slab: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const Eye: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 4 12 4c4.478 0 8.268 3.943 9.542 9 1.274 5.057 5.064 9 9.542 9C17.478 22 13.688 22 12 22c-4.478 0-8.268-3.943-9.542-9z" />
  </svg>
);

const Drawing: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const CheckCircle: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Calculator: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const StructuralAnalysisSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'beams' | 'columns' | 'slabs' | '3d' | 'drawing' | 'analysis' | 'dynamic'>('beams');
  const [structure, setStructure] = useState<Structure3D>({
    nodes: [],
    elements: [],
    loads: [],
    materials: [],
    sections: []
  });
  const [completedElements, setCompletedElements] = useState<Element[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [dynamicAnalysisResult, setDynamicAnalysisResult] = useState<any>(null);
  const [isDynamicAnalyzing, setIsDynamicAnalyzing] = useState(false);

  // Handle element completion from design modules
  const handleElementComplete = (element: Element) => {
    setCompletedElements(prev => [...prev, element]);
    
    // Add to structure
    setStructure(prev => ({
      ...prev,
      elements: [...prev.elements, element],
      materials: [...(prev.materials || []), element.material],
      sections: [...(prev.sections || []), element.section]
    }));
  };

  // Generate structure for visualization
  const generateStructure = (): Structure3D => {
    // Generate simple grid nodes for visualization
    const nodes = [];
    const elements = [...structure.elements];
    
    // Add nodes for visualization if none exist
    if (structure.nodes.length === 0) {
      // Create a simple 2x2 grid of nodes
      let nodeId = 1;
      for (let y = 0; y <= 1; y++) {
        for (let x = 0; x <= 1; x++) {
          nodes.push({
            id: `node-${nodeId++}`,
            x: x * 5,
            y: 0,
            z: y * 5
          });
        }
      }
    } else {
      nodes.push(...structure.nodes);
    }
    
    return {
      nodes,
      elements,
      loads: structure.loads || [],
      materials: structure.materials || [],
      sections: structure.sections || []
    };
  };

  // Perform structural analysis
  const performAnalysis = () => {
    const structureToAnalyze = generateStructure();
    const result = analyzeStructure(structureToAnalyze);
    setAnalysisResult(result);
    setActiveTab('analysis');
  };

  // Perform dynamic analysis
  const performDynamicAnalysis = async () => {
    setIsDynamicAnalyzing(true);
    try {
      const structureToAnalyze = generateStructure();
      const result = dynamicAnalysis(structureToAnalyze, 'modal', { numModes: 5 });
      setDynamicAnalysisResult(result);
      setActiveTab('dynamic');
    } catch (error) {
      console.error('Dynamic analysis error:', error);
    } finally {
      setIsDynamicAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Structural Analysis System
        </h1>
        <p className="text-gray-600">
          Design and analyze structural elements for building construction
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Structural Design Tools</CardTitle>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{completedElements.length} elements designed</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab('beams')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'beams'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Beams className="h-4 w-4" />
                Beams
              </button>
              <button
                onClick={() => setActiveTab('columns')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'columns'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Columns className="h-4 w-4" />
                Columns
              </button>
              <button
                onClick={() => setActiveTab('slabs')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'slabs'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Slab className="h-4 w-4" />
                Slabs
              </button>
              <button
                onClick={() => setActiveTab('3d')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === '3d'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="h-4 w-4" />
                3D View
              </button>
              <button
                onClick={() => setActiveTab('drawing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'drawing'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Drawing className="h-4 w-4" />
                Drawing
              </button>
              <button
                onClick={performAnalysis}
                disabled={structure.elements.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  structure.elements.length === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : activeTab === 'analysis'
                    ? 'bg-white shadow text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calculator className="h-4 w-4" />
                Analysis
              </button>
              <button
                onClick={performDynamicAnalysis}
                disabled={structure.elements.length === 0 || isDynamicAnalyzing}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  structure.elements.length === 0 || isDynamicAnalyzing
                    ? 'text-gray-400 cursor-not-allowed'
                    : activeTab === 'dynamic'
                    ? 'bg-white shadow text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Waves className="h-4 w-4" />
                Dynamic
              </button>
            </div>

            {/* Design Modules */}
            <div className="min-h-[600px]">
              {activeTab === 'beams' && (
                <BeamDesignModule onDesignComplete={handleElementComplete} />
              )}
              
              {activeTab === 'columns' && (
                <ColumnDesignModule onDesignComplete={handleElementComplete} />
              )}
              
              {activeTab === 'slabs' && (
                <SlabDesignModule onDesignComplete={handleElementComplete} />
              )}
              
              {activeTab === '3d' && (
                <div className="h-[600px]">
                  <Structure3DViewer structure={generateStructure()} />
                </div>
              )}
              
              {activeTab === 'drawing' && (
                <div className="h-[600px] border rounded-lg">
                  <StructuralDrawing structure={generateStructure()} />
                </div>
              )}
              
              {activeTab === 'analysis' && analysisResult && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg ${analysisResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                          <div className="text-sm text-gray-500">Structure Validity</div>
                          <div className={`text-xl font-bold ${analysisResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {analysisResult.isValid ? 'PASS' : 'FAIL'}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-500">Max Displacement</div>
                          <div className="text-xl font-bold">{(analysisResult.maxDisplacement * 1000).toFixed(2)} mm</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-500">Max Stress</div>
                          <div className="text-xl font-bold">{(analysisResult.maxStress / 1000000).toFixed(2)} MPa</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Displacements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {analysisResult.displacements.map((disp, index) => (
                            <div key={index} className="flex justify-between text-sm p-2 border-b">
                              <span>Node {disp.nodeId.toString()}</span>
                              <span>UX: {disp.ux.toFixed(6)}m, UY: {disp.uy.toFixed(6)}m</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Element Forces</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {analysisResult.forces.map((force, index) => (
                            <div key={index} className="flex justify-between text-sm p-2 border-b">
                              <span>Element {force.elementId.toString()}</span>
                              <span>Nx: {force.nx.toFixed(2)}N, My: {force.my.toFixed(2)}N·m</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
              
              {activeTab === 'dynamic' && (
                <div className="space-y-6">
                  {isDynamicAnalyzing ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Activity className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                        <p className="mt-2 text-gray-600">Performing dynamic analysis...</p>
                      </div>
                    </div>
                  ) : dynamicAnalysisResult ? (
                    <DynamicAnalysisResults 
                      modalResults={{
                        frequencies: dynamicAnalysisResult.frequencies,
                        modeShapes: dynamicAnalysisResult.modeShapes
                      }}
                    />
                  ) : (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <Waves className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">Dynamic Analysis</h3>
                      <p className="mt-2 text-gray-500">
                        Perform modal analysis to determine natural frequencies and mode shapes.
                      </p>
                      <div className="mt-4">
                        <Button 
                          onClick={performDynamicAnalysis}
                          disabled={structure.elements.length === 0}
                        >
                          <Waves className="h-4 w-4 mr-2" />
                          Run Dynamic Analysis
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Summary */}
            {completedElements.length > 0 && activeTab !== '3d' && activeTab !== 'drawing' && activeTab !== 'analysis' && (
              <Card>
                <CardHeader>
                  <CardTitle>Design Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-gray-500">Beams</div>
                        <div className="text-2xl font-bold">
                          {completedElements.filter(e => e.type === 'beam').length}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-gray-500">Columns</div>
                        <div className="text-2xl font-bold">
                          {completedElements.filter(e => e.type === 'column').length}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-gray-500">Slabs</div>
                        <div className="text-2xl font-bold">
                          {completedElements.filter(e => e.type === 'slab').length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="default" 
                        onClick={performAnalysis}
                        disabled={structure.elements.length === 0}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Analyze Structure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};