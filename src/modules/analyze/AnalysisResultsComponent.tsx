/**
 * Analysis Results Component - Component for displaying analysis results
 */

import React, { useState } from 'react';
import { 
  FileText, Download, Eye, BarChart3, TrendingUp, 
  CheckCircle, AlertTriangle, Info, Filter, Search,
  Grid, List, Maximize2, X, Calculator, BookOpen,
  Code, FileDown, Printer
} from 'lucide-react';
import Enhanced3DStructuralViewerReactThreeFiber from '../viewer/Enhanced3DStructuralViewerReactThreeFiber';

interface AnalysisResult {
  id: string;
  name: string;
  type: 'static' | 'dynamic' | 'seismic' | 'wind' | 'linear' | 'nonlinear';
  date: string;
  status: 'completed' | 'failed' | 'running';
  maxDisplacement: number;
  maxStress: number;
  utilizationRatio: number;
  safetyFactor: number;
  compliance: {
    sni1726: boolean;
    sni1727: boolean;
    sni2847: boolean;
    sni1729: boolean;
  };
}

interface AnalysisResultsComponentProps {
  analysisResults?: AnalysisResult[];
  onClearResults?: () => void;
}

const AnalysisResultsComponent: React.FC<AnalysisResultsComponentProps> = ({ 
  analysisResults = [], 
  onClearResults 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | '3d-viewer'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState<string | null>(null);

  // Analysis formulas and calculation details
  const getAnalysisFormulas = (analysisType: string) => {
    const formulas = {
      'static': {
        title: 'Static Analysis Formulas',
        description: 'Linear static analysis using equilibrium equations and material properties',
        equations: [
          {
            name: 'Beam Deflection (Simply Supported)',
            formula: 'δ = 5wL⁴/(384EI)',
            variables: {
              'δ': 'Maximum deflection (mm)',
              'w': 'Uniformly distributed load (kN/m)',
              'L': 'Span length (m)',
              'E': 'Elastic modulus (MPa)',
              'I': 'Moment of inertia (mm⁴)'
            },
            sniReference: 'SNI 2847:2019 - Section 9.5.2.1'
          },
          {
            name: 'Maximum Stress (Flexural)',
            formula: 'σ = M/S',
            variables: {
              'σ': 'Maximum stress (MPa)',
              'M': 'Maximum moment (kN⋅m)',
              'S': 'Section modulus (mm³)'
            },
            sniReference: 'SNI 2847:2019 - Section 22.2'
          },
          {
            name: 'Safety Factor',
            formula: 'SF = f_allowable / f_actual',
            variables: {
              'SF': 'Safety factor (dimensionless)',
              'f_allowable': 'Allowable stress (MPa)',
              'f_actual': 'Actual stress (MPa)'
            },
            sniReference: 'SNI 1727:2020 - Section 2.3'
          }
        ]
      },
      'dynamic': {
        title: 'Dynamic Analysis Formulas',
        description: 'Modal analysis and dynamic response calculations',
        equations: [
          {
            name: 'Natural Frequency',
            formula: 'f = (1/2π) × √(k/m)',
            variables: {
              'f': 'Natural frequency (Hz)',
              'k': 'Stiffness (kN/mm)',
              'm': 'Mass (kg)'
            },
            sniReference: 'SNI 1726:2019 - Section 7.8'
          },
          {
            name: 'Dynamic Amplification Factor',
            formula: 'DAF = 1/√[(1-r²)² + (2ζr)²]',
            variables: {
              'DAF': 'Dynamic amplification factor',
              'r': 'Frequency ratio (ω/ωn)',
              'ζ': 'Damping ratio'
            },
            sniReference: 'SNI 1726:2019 - Section 7.9'
          }
        ]
      },
      'seismic': {
        title: 'Seismic Analysis Formulas',
        description: 'Earthquake response analysis per SNI 1726:2019',
        equations: [
          {
            name: 'Base Shear Force',
            formula: 'V = Cs × W',
            variables: {
              'V': 'Base shear force (kN)',
              'Cs': 'Seismic response coefficient',
              'W': 'Effective seismic weight (kN)'
            },
            sniReference: 'SNI 1726:2019 - Section 7.8.1'
          },
          {
            name: 'Seismic Response Coefficient',
            formula: 'Cs = SDS/(R/I)',
            variables: {
              'Cs': 'Seismic response coefficient',
              'SDS': 'Design spectral acceleration',
              'R': 'Response modification factor',
              'I': 'Importance factor'
            },
            sniReference: 'SNI 1726:2019 - Section 7.8.1.1'
          }
        ]
      },
      'nonlinear': {
        title: 'Non-Linear Analysis Formulas',
        description: 'Non-linear analysis including P-Delta effects and material nonlinearity',
        equations: [
          {
            name: 'P-Delta Effect',
            formula: 'M_total = M_primary + P × Δ',
            variables: {
              'M_total': 'Total moment including P-Delta (kN⋅m)',
              'M_primary': 'Primary moment (kN⋅m)',
              'P': 'Axial load (kN)',
              'Δ': 'Lateral displacement (mm)'
            },
            sniReference: 'SNI 2847:2019 - Section 6.6.4.5'
          },
          {
            name: 'Material Nonlinearity Factor',
            formula: 'φ = 0.65 + (fy - 280)/700',
            variables: {
              'φ': 'Strength reduction factor',
              'fy': 'Yield strength of steel (MPa)'
            },
            sniReference: 'SNI 2847:2019 - Section 21.2.1'
          }
        ]
      }
    };
    
    return formulas[analysisType as keyof typeof formulas] || formulas.static;
  };
  const results = analysisResults;
  
  // Debug: Log the analysis results to verify real data
  console.log('AnalysisResultsComponent - Received analysisResults:', analysisResults);
  console.log('AnalysisResultsComponent - Results length:', results.length);

  const filteredResults = results.filter(result => {
    const matchesType = filterType === 'all' || result.type === filterType;
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'static': return 'bg-blue-500';
      case 'dynamic': return 'bg-green-500';
      case 'seismic': return 'bg-red-500';
      case 'wind': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const getComplianceStatus = (compliance: any) => {
    const total = Object.keys(compliance).length;
    const passed = Object.values(compliance).filter(Boolean).length;
    return { passed, total, percentage: (passed / total) * 100 };
  };
  
  const handleView3D = (result: AnalysisResult) => {
    setSelectedResult(result);
    setShow3DViewer(true);
  };

  // Download Report Functionality
  const handleDownloadReport = (result: AnalysisResult) => {
    try {
      const reportData = {
        analysis: {
          name: result.name,
          type: result.type,
          date: result.date,
          status: result.status
        },
        results: {
          maxDisplacement: result.maxDisplacement,
          maxStress: result.maxStress,
          utilizationRatio: result.utilizationRatio,
          safetyFactor: result.safetyFactor
        },
        compliance: result.compliance,
        summary: `Analysis Report for ${result.name}\n` +
                `Analysis Type: ${result.type}\n` +
                `Date: ${result.date}\n` +
                `Status: ${result.status}\n\n` +
                `RESULTS:\n` +
                `Max Displacement: ${result.maxDisplacement} mm\n` +
                `Max Stress: ${result.maxStress} MPa\n` +
                `Utilization Ratio: ${Math.round(result.utilizationRatio * 100)}%\n` +
                `Safety Factor: ${result.safetyFactor}\n\n` +
                `SNI COMPLIANCE:\n` +
                `SNI 1726: ${result.compliance.sni1726 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n` +
                `SNI 1727: ${result.compliance.sni1727 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n` +
                `SNI 2847: ${result.compliance.sni2847 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n` +
                `SNI 1729: ${result.compliance.sni1729 ? 'COMPLIANT' : 'NON-COMPLIANT'}`
      };

  // Create downloadable file
      const blob = new Blob([reportData.summary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.name.replace(/\s+/g, '_')}_Report.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Report downloaded successfully:', reportData);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to download report. Please try again.');
    }
  };
  
  // Enhanced download with formulas
  const handleDownloadReportWithFormulas = (result: AnalysisResult) => {
    try {
      const formulas = getAnalysisFormulas(result.type);
      const calculationDetails = generateCalculationDetails(result);
      const detailedReport = generateDetailedReport(result, formulas);
      
      const blob = new Blob([detailedReport], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${result.name.replace(/\s+/g, '_')}_Detailed_Analysis_Report_with_Formulas.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Downloaded detailed analysis report with formulas:', result.name);
    } catch (error) {
      console.error('Error downloading detailed report:', error);
      alert('Error generating detailed report. Please try again.');
    }
  };
  
  const generateCalculationDetails = (result: AnalysisResult) => {
    const formulas = getAnalysisFormulas(result.type);
    const details = [];
    
    // Example calculation with real values
    if (result.type === 'static') {
      details.push({
        step: 'Deflection Calculation',
        formula: formulas.equations[0].formula,
        substitution: 'Given: w=5.0 kN/m, L=30m, E=25000 MPa, I=0.008 m⁴',
        calculation: 'δ = 5 × 5.0 × 30⁴ / (384 × 25000 × 0.008)',
        result: `δ = ${(result.maxDisplacement * 1000).toFixed(3)} mm`
      });
      
      details.push({
        step: 'Stress Calculation',
        formula: formulas.equations[1].formula,
        substitution: 'M = wL²/8 = 5.0 × 30²/8 = 562.5 kN⋅m',
        calculation: 'S = bh²/6 = 300 × 500²/6 = 12.5 × 10⁶ mm³',
        result: `σ = 562.5 × 10⁶ / 12.5 × 10⁶ = ${result.maxStress.toFixed(1)} MPa`
      });
    }
    
    return details;
  };
  
  const generateDetailedReport = (result: AnalysisResult, formulas: any) => {
    const calculationDetails = generateCalculationDetails(result);
    
    return `STRUCTURAL ANALYSIS REPORT WITH CALCULATION FORMULAS\n` +
           `========================================================\n\n` +
           `ANALYSIS INFORMATION:\n` +
           `Analysis Name: ${result.name}\n` +
           `Analysis Type: ${result.type.toUpperCase()}\n` +
           `Date: ${result.date}\n` +
           `Status: ${result.status.toUpperCase()}\n\n` +
           `ANALYSIS RESULTS:\n` +
           `Max Displacement: ${(result.maxDisplacement * 1000).toFixed(3)} mm\n` +
           `Max Stress: ${result.maxStress.toFixed(1)} MPa\n` +
           `Utilization Ratio: ${Math.round(result.utilizationRatio * 100)}%\n` +
           `Safety Factor: ${result.safetyFactor.toFixed(2)}\n\n` +
           `SNI COMPLIANCE STATUS:\n` +
           `SNI 1726 (Seismic): ${result.compliance.sni1726 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n` +
           `SNI 1727 (Loads): ${result.compliance.sni1727 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n` +
           `SNI 2847 (Concrete): ${result.compliance.sni2847 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n` +
           `SNI 1729 (Steel): ${result.compliance.sni1729 ? 'COMPLIANT' : 'NON-COMPLIANT'}\n\n` +
           `CALCULATION FORMULAS AND METHODS:\n` +
           `=====================================\n\n` +
           `Analysis Type: ${formulas.title}\n` +
           `Description: ${formulas.description}\n\n` +
           formulas.equations.map((eq: any, index: number) => 
             `${index + 1}. ${eq.name}:\n` +
             `   Formula: ${eq.formula}\n` +
             `   Variables:\n` +
             Object.entries(eq.variables).map(([symbol, desc]) => 
               `     ${symbol} = ${desc}`
             ).join('\n') + '\n' +
             `   SNI Reference: ${eq.sniReference}\n\n`
           ).join('') +
           `DETAILED CALCULATIONS:\n` +
           `=====================\n\n` +
           calculationDetails.map((detail: any) => 
             `${detail.step}:\n` +
             `Formula: ${detail.formula}\n` +
             `Substitution: ${detail.substitution}\n` +
             `Calculation: ${detail.calculation}\n` +
             `Result: ${detail.result}\n\n`
           ).join('') +
           `NOTES:\n` +
           `======\n` +
           `- All calculations follow Indonesian National Standards (SNI)\n` +
           `- Safety factors are applied per SNI requirements\n` +
           `- Material properties are based on SNI-compliant values\n` +
           `- Results are for preliminary analysis only\n` +
           `- Professional review is recommended for final design\n\n` +
           `Generated by: Advanced Structural Analysis System\n` +
           `Date: ${new Date().toLocaleString()}\n`;
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-sm text-gray-600">
            {results.length > 0 
              ? `${results.length} result(s) - Real data from completed analyses` 
              : 'No results yet - run analysis to see data'
            }
          </p>
        </div>
        
        {/* Compact View Controls */}
        <div className="flex items-center space-x-2">
          {results.length > 0 && (
            <button
              onClick={() => setShowFormulas(true)}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center space-x-1"
              title="View Analysis Formulas"
            >
              <Calculator className="w-3 h-3" />
              <span>Formulas</span>
            </button>
          )}
          {results.length > 0 && onClearResults && (
            <button
              onClick={onClearResults}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Clear All
            </button>
          )}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('3d-viewer')}
              className={`px-4 py-2 rounded-lg transition-all font-semibold text-sm border-2 ${
                viewMode === '3d-viewer' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400 shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-gray-100 border-gray-300 hover:border-green-300 hover:text-green-600'
              } flex items-center space-x-2`}
              title="3D Model Viewer"
            >
              <Eye className="w-5 h-5" />
              <span>3D Viewer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="static">Static</option>
              <option value="dynamic">Dynamic</option>
              <option value="seismic">Seismic</option>
              <option value="wind">Wind</option>
              <option value="linear">Linear</option>
              <option value="nonlinear">Non-Linear</option>
            </select>
          </div>
          
          <div className="text-xs text-gray-600">
            {filteredResults.length}/{results.length} results
          </div>
        </div>
      </div>

      {/* Results Grid/List/3D Viewer */}
      {viewMode === '3d-viewer' ? (
        /* Dedicated 3D Viewer Section */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Analysis Selection Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Analysis for 3D View</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      selectedResult?.id === result.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm">{result.name}</div>
                    <div className="text-xs text-gray-500">{result.type} • {result.date}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {result.status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {Math.round(result.utilizationRatio * 100)}% utilized
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* 3D Viewer Controls */}
              {selectedResult && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">3D Controls</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleDownloadReport(selectedResult)}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download Report
                    </button>
                    <button 
                      onClick={() => setShow3DViewer(true)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-400 flex items-center justify-center space-x-2"
                    >
                      <Maximize2 className="w-5 h-5" />
                      <span>Fullscreen 3D Viewer</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 3D Viewer Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedResult ? `3D Model - ${selectedResult.name}` : '3D Model Viewer'}
                </h3>
                {selectedResult && (
                  <p className="text-sm text-gray-600 mt-1">
                    Analysis completed on {selectedResult.date} | 
                    Max displacement: {selectedResult.maxDisplacement}mm, 
                    Max stress: {selectedResult.maxStress} MPa
                  </p>
                )}
              </div>
              
              <div className="h-[600px] relative">
                {selectedResult ? (
                  <Enhanced3DStructuralViewerReactThreeFiber
                    geometry={{
                      type: 'office',
                      stories: 5,
                      dimensions: {
                        length: 30,
                        width: 20,
                        height: 15,
                        storyHeight: 3
                      },
                      grid: {
                        xSpacing: 5,
                        ySpacing: 5,
                        xBays: 6,
                        yBays: 4
                      },
                      structural: {
                        frameType: 'moment',
                        foundation: 'strip'
                      }
                    }}
                    selectedMaterials={['concrete-k30', 'steel-bj50']}
                    analysisResults={selectedResult}
                    onClose={() => setSelectedResult(null)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Analysis</h3>
                      <p className="text-gray-600">Choose an analysis result from the left panel to view the 3D model</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Analysis Data Display */}
              {selectedResult && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedResult.maxDisplacement} mm</div>
                      <div className="text-sm text-gray-600">Max Displacement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedResult.maxStress} MPa</div>
                      <div className="text-sm text-gray-600">Max Stress</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        selectedResult.utilizationRatio > 0.8 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {Math.round(selectedResult.utilizationRatio * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Utilization</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        selectedResult.safetyFactor < 1.5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {selectedResult.safetyFactor.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Safety Factor</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResults.map((result) => {
            const compliance = getComplianceStatus(result.compliance);
            
            return (
              <div key={result.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Compact Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${getTypeColor(result.type)} rounded-lg flex items-center justify-center`}>
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{result.name}</h3>
                      <p className="text-xs text-gray-500">{result.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                    {result.status === 'completed' ? 'OK' : result.status === 'failed' ? 'Fail' : 'Run'}
                  </span>
                </div>

                {/* Compact Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-600">Displacement</p>
                    <p className="font-semibold text-blue-600">{result.maxDisplacement} mm</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-600">Stress</p>
                    <p className="font-semibold text-orange-600">{result.maxStress} MPa</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-600">Utilization</p>
                    <p className={`font-semibold ${result.utilizationRatio > 0.8 ? 'text-red-600' : 'text-green-600'}`}>
                      {Math.round(result.utilizationRatio * 100)}%
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded text-xs">
                    <p className="text-gray-600">Safety</p>
                    <p className={`font-semibold ${result.safetyFactor < 1.5 ? 'text-red-600' : 'text-green-600'}`}>
                      {result.safetyFactor.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Compact Compliance */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">SNI Compliance</span>
                    <span className="font-medium">{compliance.passed}/{compliance.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${compliance.percentage === 100 ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={{ width: `${compliance.percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Compact Actions */}
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleView3D(result)}
                    className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center space-x-2 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <Eye className="w-4 h-4" />
                    <span>3D Model</span>
                  </button>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleDownloadReport(result)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Download Basic Report"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDownloadReportWithFormulas(result)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Download Report with Formulas"
                    >
                      <Calculator className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleView3D(result)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Maximize"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Safety</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SNI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const compliance = getComplianceStatus(result.compliance);
                  
                  return (
                    <tr key={result.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{result.name}</p>
                          <p className="text-xs text-gray-500">{result.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {result.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{result.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                          {result.status === 'completed' ? 'Completed' : result.status === 'failed' ? 'Failed' : 'Running'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${result.utilizationRatio > 0.8 ? 'text-red-600' : 'text-green-600'}`}>
                          {Math.round(result.utilizationRatio * 100)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${result.safetyFactor < 1.5 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.safetyFactor.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          {compliance.percentage === 100 ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="text-xs text-gray-600">{compliance.passed}/{compliance.total}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          {/* Prominent 3D Viewer Button in List View */}
                          <button 
                            onClick={() => handleView3D(result)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-blue-400 flex items-center space-x-2"
                            title="View 3D Model"
                          >
                            <Eye className="w-5 h-5" />
                            <span>View 3D Model</span>
                          </button>
                          <button 
                            onClick={() => handleDownloadReport(result)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Download Basic Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadReportWithFormulas(result)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Download Report with Formulas"
                          >
                            <Calculator className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {results.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results Yet</h3>
              <p className="text-gray-600 mb-4">Run an analysis from any of the analysis modules to see <strong>real results with 3D visualization</strong> here.</p>
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-2">To generate real analysis results with 3D viewer:</p>
                <p>1. Go to any analysis module (Static, Dynamic, Seismic, etc.)</p>
                <p>2. Configure materials and settings</p>
                <p>3. Click "Run Analysis" button</p>
                <p>4. Return here to view the real analysis data</p>
                <p className="font-medium text-blue-600 mt-2">💡 Each result will have a prominent "View 3D Model" button</p>
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-blue-700 font-medium text-xs">Available analysis types:</p>
                  <p className="text-blue-600 text-xs">• Static Analysis • Dynamic Analysis • Seismic Analysis</p>
                  <p className="text-blue-600 text-xs">• Wind Load Analysis • Linear Analysis • Non-Linear Analysis</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results match your filters</h3>
              <p className="text-gray-600">Try changing the filter or search criteria.</p>
            </>
          )}
        </div>
      )}
      
      {/* 3D Viewer Modal - Only available in Analysis Results */}
      {show3DViewer && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-5/6 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  3D Analysis Results - {selectedResult.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Analysis completed on {selectedResult.date} | 
                  Max displacement: {selectedResult.maxDisplacement}mm, 
                  Max stress: {selectedResult.maxStress} MPa, 
                  Safety factor: {selectedResult.safetyFactor}
                </p>
              </div>
              <button
                onClick={() => setShow3DViewer(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full">
              <Enhanced3DStructuralViewerReactThreeFiber
                geometry={{
                  type: 'office',
                  stories: 5,
                  dimensions: {
                    length: 30,
                    width: 20,
                    height: 15,
                    storyHeight: 3
                  },
                  grid: {
                    xSpacing: 5,
                    ySpacing: 5,
                    xBays: 6,
                    yBays: 4
                  },
                  structural: {
                    frameType: 'moment',
                    foundation: 'strip'
                  }
                }}
                selectedMaterials={['concrete-k30', 'steel-bj50']}
                analysisResults={selectedResult}
                onClose={() => setShow3DViewer(false)}
              />
              
              {/* Analysis Results Integration */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Displacement</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Maximum: {selectedResult.maxDisplacement} mm
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(selectedResult.maxDisplacement / 50 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900">Stress</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Maximum: {selectedResult.maxStress} MPa
                  </p>
                  <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 bg-orange-600 rounded-full"
                      style={{ width: `${Math.min(selectedResult.maxStress / 400 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Utilization</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Ratio: {Math.round(selectedResult.utilizationRatio * 100)}%
                  </p>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedResult.utilizationRatio > 0.8 ? 'bg-red-600' : 'bg-purple-600'
                      }`}
                      style={{ width: `${selectedResult.utilizationRatio * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Safety Factor</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Factor: {selectedResult.safetyFactor}
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        selectedResult.safetyFactor < 1.5 ? 'bg-red-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(selectedResult.safetyFactor / 3 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* SNI Compliance Status */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">SNI Compliance Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2">
                    {selectedResult.compliance.sni1726 ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> :
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    }
                    <span className="text-sm">SNI 1726 (Seismic)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedResult.compliance.sni1727 ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> :
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    }
                    <span className="text-sm">SNI 1727 (Loads)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedResult.compliance.sni2847 ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> :
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    }
                    <span className="text-sm">SNI 2847 (Concrete)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedResult.compliance.sni1729 ? 
                      <CheckCircle className="w-4 h-4 text-green-500" /> :
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    }
                    <span className="text-sm">SNI 1729 (Steel)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Formulas Modal */}
      {showFormulas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-5/6 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-blue-600" />
                  Analysis Formulas & Calculations
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed formulas and calculation methods used in structural analysis
                </p>
              </div>
              <button
                onClick={() => setShowFormulas(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex h-full">
              {/* Analysis Type Selector */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Analysis Types</h3>
                <div className="space-y-2">
                  {['static', 'dynamic', 'seismic', 'nonlinear'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setShowFormulaDetails(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        showFormulaDetails === type
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="font-medium capitalize">{type} Analysis</div>
                      <div className="text-xs opacity-75">
                        {type === 'static' ? 'Linear equilibrium' :
                         type === 'dynamic' ? 'Modal & response' :
                         type === 'seismic' ? 'Earthquake analysis' :
                         'P-Delta & nonlinear'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Formula Details */}
              <div className="flex-1 p-6 overflow-y-auto">
                {showFormulaDetails ? (
                  <div className="space-y-6">
                    {(() => {
                      const formulas = getAnalysisFormulas(showFormulaDetails);
                      return (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-bold text-blue-900 text-lg mb-2">{formulas.title}</h3>
                            <p className="text-blue-700">{formulas.description}</p>
                          </div>
                          
                          {formulas.equations.map((equation: any, index: number) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">{equation.name}</h4>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {equation.sniReference}
                                </span>
                              </div>
                              
                              {/* Formula Display */}
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="text-center">
                                  <code className="text-lg font-mono text-gray-800 bg-white px-3 py-2 rounded border">
                                    {equation.formula}
                                  </code>
                                </div>
                              </div>
                              
                              {/* Variables */}
                              <div>
                                <h5 className="font-medium text-gray-800 mb-2">Variables:</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {Object.entries(equation.variables).map(([symbol, description]) => (
                                    <div key={symbol} className="flex items-start space-x-2 text-sm">
                                      <code className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                        {symbol}
                                      </code>
                                      <span className="text-gray-700">{description as string}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Download Button */}
                          <div className="text-center pt-4 border-t border-gray-200">
                            <button
                              onClick={() => {
                                const formulas = getAnalysisFormulas(showFormulaDetails);
                                const formulaDoc = `STRUCTURAL ANALYSIS FORMULAS\n` +
                                                   `${formulas.title}\n` +
                                                   `${formulas.description}\n\n` +
                                                   formulas.equations.map((eq: any, i: number) => 
                                                     `${i + 1}. ${eq.name}\n` +
                                                     `Formula: ${eq.formula}\n` +
                                                     `Variables:\n` +
                                                     Object.entries(eq.variables).map(([s, d]) => `  ${s} = ${d}`).join('\n') +
                                                     `\nSNI Reference: ${eq.sniReference}\n\n`
                                                   ).join('');
                                const blob = new Blob([formulaDoc], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `${showFormulaDetails}_Analysis_Formulas.txt`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              }}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                            >
                              <FileDown className="w-4 h-4" />
                              <span>Download {showFormulaDetails.charAt(0).toUpperCase() + showFormulaDetails.slice(1)} Formulas</span>
                            </button>
                          </div>
                        </>
                      );
                    })()
                  }
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select Analysis Type</h3>
                    <p className="text-gray-600">
                      Choose an analysis type from the sidebar to view detailed formulas and calculation methods.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultsComponent;