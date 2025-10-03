/**
 * Code Checking Module - Multi-Standard Compliance Verification
 * Comprehensive design code verification for Indonesian and international standards
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, FileText, Settings, 
  Search, Filter, Download, Eye, Activity, BookOpen, 
  Target, Layers, RefreshCw, Award, HelpCircle
} from 'lucide-react';

interface CodeCheckingProps {
  subModule?: string;
}

const CodeChecking: React.FC<CodeCheckingProps> = ({ subModule }) => {
  const [selectedStandards, setSelectedStandards] = useState<string[]>(['SNI']);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkingResults, setCheckingResults] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [designData, setDesignData] = useState<any>(null);

  // Available design standards
  const designStandards = {
    SNI: {
      name: 'Indonesian National Standard',
      codes: [
        { 
          code: 'SNI 2847:2019', 
          title: 'Structural Concrete Requirements', 
          scope: 'Reinforced concrete design and detailing',
          status: 'active'
        },
        { 
          code: 'SNI 1729:2020', 
          title: 'Steel Structure Specifications', 
          scope: 'Structural steel design and connections',
          status: 'active'
        },
        { 
          code: 'SNI 7973:2019', 
          title: 'Timber Construction Specifications', 
          scope: 'Structural timber design and connections',
          status: 'active'
        },
        { 
          code: 'SNI 8460:2020', 
          title: 'Geotechnical Design Requirements', 
          scope: 'Foundation and earth structure design',
          status: 'active'
        },
        { 
          code: 'SNI 1726:2019', 
          title: 'Earthquake Resistance Planning', 
          scope: 'Seismic design requirements',
          status: 'active'
        },
        { 
          code: 'SNI 1727:2020', 
          title: 'Minimum Loads for Building Design', 
          scope: 'Load combinations and load factors',
          status: 'active'
        }
      ]
    },
    AISC: {
      name: 'American Institute of Steel Construction',
      codes: [
        { 
          code: 'AISC 360-22', 
          title: 'Specification for Structural Steel Buildings', 
          scope: 'Steel design specifications',
          status: 'active'
        },
        { 
          code: 'AISC 341-22', 
          title: 'Seismic Provisions for Structural Steel Buildings', 
          scope: 'Seismic steel design',
          status: 'active'
        },
        { 
          code: 'AISC 358-22', 
          title: 'Prequalified Connections for Special and Intermediate Steel', 
          scope: 'Steel connections',
          status: 'active'
        }
      ]
    },
    ACI: {
      name: 'American Concrete Institute',
      codes: [
        { 
          code: 'ACI 318-19', 
          title: 'Building Code Requirements for Structural Concrete', 
          scope: 'Concrete design requirements',
          status: 'active'
        },
        { 
          code: 'ACI 350-20', 
          title: 'Code Requirements for Environmental Engineering Concrete', 
          scope: 'Environmental concrete structures',
          status: 'active'
        }
      ]
    },
    ASCE: {
      name: 'American Society of Civil Engineers',
      codes: [
        { 
          code: 'ASCE 7-22', 
          title: 'Minimum Design Loads and Associated Criteria', 
          scope: 'Load requirements and combinations',
          status: 'active'
        },
        { 
          code: 'ASCE 41-23', 
          title: 'Seismic Evaluation and Retrofit of Existing Buildings', 
          scope: 'Seismic assessment and retrofit',
          status: 'active'
        }
      ]
    },
    EUROCODE: {
      name: 'European Committee for Standardization',
      codes: [
        { 
          code: 'EN 1992-1-1', 
          title: 'Eurocode 2: Design of concrete structures', 
          scope: 'Concrete design rules',
          status: 'active'
        },
        { 
          code: 'EN 1993-1-1', 
          title: 'Eurocode 3: Design of steel structures', 
          scope: 'Steel design rules',
          status: 'active'
        },
        { 
          code: 'EN 1995-1-1', 
          title: 'Eurocode 5: Design of timber structures', 
          scope: 'Timber design rules',
          status: 'active'
        }
      ]
    }
  };

  // Sample design data for checking
  const sampleDesignData = {
    beamDesign: {
      material: 'Concrete K-300',
      dimensions: { width: 300, height: 500, length: 6000 },
      reinforcement: { main: 'D19', count: 6, stirrups: 'D10-150' },
      loading: { moment: 250, shear: 120, axial: 0 },
      results: { momentCapacity: 280, shearCapacity: 140, utilization: 0.89 }
    },
    columnDesign: {
      material: 'Steel BjTS-50',
      section: 'WF 300x150x6.5x9',
      loading: { axial: 1200, momentX: 180, momentY: 60 },
      slenderness: { ratioX: 65, ratioY: 45 },
      results: { axialCapacity: 1450, momentCapacityX: 220, utilization: 0.92 }
    },
    foundationDesign: {
      type: 'Shallow Foundation',
      soil: 'Dense Sand',
      dimensions: { length: 3.0, width: 2.5, depth: 1.5 },
      loading: { vertical: 1500, horizontal: 150, moment: 300 },
      results: { bearingCapacity: 450, appliedPressure: 240, settlement: 18 }
    }
  };

  // Code checking functions
  const performCodeChecking = useCallback(async () => {
    setIsChecking(true);
    setDesignData(sampleDesignData);
    
    // Simulate code checking process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = {
      summary: {
        totalChecks: 24,
        passedChecks: 21,
        failedChecks: 2,
        warningChecks: 1,
        complianceRate: 87.5
      },
      standardsChecked: selectedStandards,
      checkDetails: {
        'SNI 2847:2019': {
          checks: [
            { 
              item: 'Minimum reinforcement ratio', 
              requirement: 'ρ ≥ 0.0033', 
              actual: '0.0035', 
              status: 'PASS',
              clause: '9.6.1.2'
            },
            { 
              item: 'Maximum reinforcement ratio', 
              requirement: 'ρ ≤ 0.025', 
              actual: '0.0035', 
              status: 'PASS',
              clause: '9.6.1.3'
            },
            { 
              item: 'Development length', 
              requirement: 'ld ≥ 460mm', 
              actual: '520mm', 
              status: 'PASS',
              clause: '25.4.2'
            },
            { 
              item: 'Shear reinforcement spacing', 
              requirement: 's ≤ d/2', 
              actual: '150mm (d/2=230mm)', 
              status: 'PASS',
              clause: '9.7.6.2'
            },
            { 
              item: 'Cover requirements', 
              requirement: 'c ≥ 40mm', 
              actual: '40mm', 
              status: 'PASS',
              clause: '20.5.1'
            }
          ]
        },
        'SNI 1729:2020': {
          checks: [
            { 
              item: 'Slenderness ratio', 
              requirement: 'kL/r ≤ 200', 
              actual: '65', 
              status: 'PASS',
              clause: 'E2.1'
            },
            { 
              item: 'Local buckling - flange', 
              requirement: 'b/t ≤ λp', 
              actual: '6.8 ≤ 10.8', 
              status: 'PASS',
              clause: 'B4.1'
            },
            { 
              item: 'Local buckling - web', 
              requirement: 'h/tw ≤ λp', 
              actual: '44.6 ≤ 106.8', 
              status: 'PASS',
              clause: 'B4.1'
            },
            { 
              item: 'Interaction equation', 
              requirement: 'Unity check ≤ 1.0', 
              actual: '0.92', 
              status: 'PASS',
              clause: 'H1.1'
            }
          ]
        },
        'SNI 8460:2020': {
          checks: [
            { 
              item: 'Bearing capacity factor of safety', 
              requirement: 'FS ≥ 3.0', 
              actual: '1.875', 
              status: 'FAIL',
              clause: '7.4.1'
            },
            { 
              item: 'Settlement limit', 
              requirement: 'S ≤ 25mm', 
              actual: '18mm', 
              status: 'PASS',
              clause: '7.5.2'
            },
            { 
              item: 'Sliding resistance', 
              requirement: 'FS ≥ 1.5', 
              actual: '2.1', 
              status: 'PASS',
              clause: '7.6.1'
            }
          ]
        },
        'SNI 1726:2019': {
          checks: [
            { 
              item: 'Base shear coefficient', 
              requirement: 'Cs within limits', 
              actual: 'Cs = 0.085', 
              status: 'WARNING',
              clause: '7.8.1'
            },
            { 
              item: 'Drift limitation', 
              requirement: 'Δ ≤ 0.020hsx', 
              actual: 'Δ = 0.016hsx', 
              status: 'PASS',
              clause: '7.12.1'
            }
          ]
        }
      },
      recommendations: [
        'Foundation bearing capacity factor of safety is below 3.0 - consider increasing foundation size',
        'Base shear coefficient should be verified with detailed seismic analysis',
        'Consider peer review for critical structural elements',
        'Update material specifications to latest standard versions'
      ],
      overallCompliance: 'SUBSTANTIAL COMPLIANCE with minor issues'
    };
    
    setCheckingResults(results);
    setIsChecking(false);
  }, [selectedStandards]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PASS': return 'text-green-400';
      case 'FAIL': return 'text-red-400';
      case 'WARNING': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PASS': return <CheckCircle className="w-4 h-4" />;
      case 'FAIL': return <AlertTriangle className="w-4 h-4" />;
      case 'WARNING': return <HelpCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Professional Styling */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Shield className="w-7 h-7 mr-3 text-purple-600" />
              Code Checking Module
            </h2>
            <p className="text-gray-600 mt-2 font-medium">Multi-standard design code compliance verification</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md border border-blue-500 font-medium">
              <Eye className="w-4 h-4 mr-2" />
              View Report
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md border border-green-500 font-medium">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation with High Contrast */}
        <div className="flex space-x-4 mb-6">
          {[
            { id: 'overview', name: 'Overview', icon: Target },
            { id: 'standards', name: 'Standards', icon: BookOpen },
            { id: 'results', name: 'Results', icon: Award },
            { id: 'recommendations', name: 'Recommendations', icon: Layers }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg flex items-center transition-colors shadow-md border font-medium ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-400'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content with Professional Styling */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Standard Selection with High Contrast */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b-2 border-gray-200 pb-3">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Select Design Standards
            </h3>

            <div className="space-y-4">
              {Object.entries(designStandards).map(([key, standard]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      checked={selectedStandards.includes(key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStandards(prev => [...prev, key]);
                        } else {
                          setSelectedStandards(prev => prev.filter(s => s !== key));
                        }
                      }}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <label htmlFor={key} className="ml-3 text-gray-800 font-bold">
                      {key} - {standard.name}
                    </label>
                  </div>
                  <div className="ml-7 space-y-1">
                    {standard.codes.slice(0, 3).map(code => (
                      <div key={code.code} className="text-gray-600 text-sm font-medium">
                        • {code.code}: {code.title}
                      </div>
                    ))}
                    {standard.codes.length > 3 && (
                      <div className="text-gray-500 text-sm">
                        + {standard.codes.length - 3} more codes...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={performCodeChecking}
              disabled={selectedStandards.length === 0 || isChecking}
              className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-md border border-purple-500 transition-colors"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking Code Compliance...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Run Code Check
                </>
              )}
            </button>
          </div>

          {/* Design Data Preview with Professional Styling */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b-2 border-gray-200 pb-3">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Design Data Summary
            </h3>

            {designData ? (
              <div className="space-y-4">
                {Object.entries(designData).map(([key, data]: [string, any]) => (
                  <div key={key} className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                    <div className="font-bold text-gray-800 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-700 font-medium">Material:</div>
                      <div className="text-blue-700 font-bold">{data.material}</div>
                      {data.dimensions && (
                        <>
                          <div className="text-gray-700 font-medium">Dimensions:</div>
                          <div className="text-blue-700 font-bold">
                            {Object.values(data.dimensions).join(' × ')}
                          </div>
                        </>
                      )}
                      {data.results?.utilization && (
                        <>
                          <div className="text-gray-700 font-medium">Utilization:</div>
                          <div className="text-yellow-700 font-bold">
                            {(data.results.utilization * 100).toFixed(1)}%
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="font-medium">Run code check to see design data analysis</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'standards' && (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Available Design Standards</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(designStandards).map(([key, standard]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-800 font-bold">{key}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedStandards.includes(key)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {selectedStandards.includes(key) ? 'Selected' : 'Available'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm font-medium">{standard.name}</p>
                
                <div className="space-y-2">
                  {standard.codes.map(code => (
                    <div key={code.code} className="p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-800 text-sm font-bold">{code.code}</span>
                        <span className="text-green-600 text-xs font-medium">Active</span>
                      </div>
                      <div className="text-gray-700 text-sm font-medium">{code.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{code.scope}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'results' && checkingResults && (
        <div className="space-y-6">
          {/* Results Summary with High Contrast */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Code Checking Results</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 border-2 border-green-400 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">{checkingResults.summary.passedChecks}</div>
                <div className="text-green-700 text-sm font-medium">Passed</div>
              </div>
              <div className="p-4 bg-red-50 border-2 border-red-400 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-red-600">{checkingResults.summary.failedChecks}</div>
                <div className="text-red-700 text-sm font-medium">Failed</div>
              </div>
              <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{checkingResults.summary.warningChecks}</div>
                <div className="text-yellow-700 text-sm font-medium">Warnings</div>
              </div>
              <div className="p-4 bg-blue-50 border-2 border-blue-400 rounded-lg text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{checkingResults.summary.complianceRate.toFixed(1)}%</div>
                <div className="text-blue-700 text-sm font-medium">Compliance</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 shadow-sm ${
              checkingResults.summary.complianceRate >= 90 ? 'bg-green-50 border-green-400' :
              checkingResults.summary.complianceRate >= 70 ? 'bg-yellow-50 border-yellow-400' :
              'bg-red-50 border-red-400'
            }`}>
              <div className={`font-bold ${
                checkingResults.summary.complianceRate >= 90 ? 'text-green-800' :
                checkingResults.summary.complianceRate >= 70 ? 'text-yellow-800' :
                'text-red-800'
              }`}>{checkingResults.overallCompliance}</div>
            </div>
          </div>

          {/* Detailed Check Results with Professional Styling */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Check Results</h3>
            
            <div className="space-y-6">
              {Object.entries(checkingResults.checkDetails).map(([standard, details]: [string, any]) => (
                <div key={standard}>
                  <h4 className="text-gray-800 font-bold mb-3">{standard}</h4>
                  <div className="space-y-2">
                    {details.checks.map((check: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className={getStatusColor(check.status)}>
                              {getStatusIcon(check.status)}
                            </div>
                            <span className="text-gray-800 text-sm font-medium ml-2">{check.item}</span>
                            <span className="text-gray-600 text-xs ml-2">({check.clause})</span>
                          </div>
                          <div className="text-gray-600 text-xs mt-1">
                            Required: {check.requirement} | Actual: {check.actual}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          check.status === 'PASS' ? 'bg-green-500 text-white' :
                          check.status === 'FAIL' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {check.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && checkingResults && (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Design Recommendations</h3>
          
          <div className="space-y-4">
            {checkingResults.recommendations.map((recommendation: string, idx: number) => (
              <div key={idx} className="flex items-start p-4 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-gray-800 text-sm font-medium">{recommendation}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-400 rounded-lg shadow-sm">
            <h4 className="text-purple-800 font-bold mb-2">Next Steps</h4>
            <ul className="text-gray-800 text-sm space-y-1 font-medium">
              <li>• Address all failed checks before finalizing design</li>
              <li>• Review warnings and consider design improvements</li>
              <li>• Conduct independent peer review for critical elements</li>
              <li>• Update drawings and specifications to reflect code requirements</li>
              <li>• Schedule follow-up code check after revisions</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeChecking;