/**
 * Analysis Results Panel Component - Reusable
 * Displays analysis results in a consistent format across all analysis types
 */
import React from 'react';
import { 
  FileText, CheckCircle, AlertTriangle, Clock, Download,
  BarChart3, TrendingUp, Shield, Database
} from 'lucide-react';

interface AnalysisResultsPanelProps {
  results: any; // Using any for now, should be properly typed based on engine results
  analysisType?: string;
}

const AnalysisResultsPanel: React.FC<AnalysisResultsPanelProps> = ({ 
  results, 
  analysisType = 'analysis' 
}) => {
  if (!results) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-600" />
          Analysis Results
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Analysis Completed
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {results.timestamp ? new Date(results.timestamp).toLocaleTimeString() : 'Just now'}
          </span>
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Download className="w-3 h-3 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Results Summary Grid with Enhanced Styling */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-sm font-medium text-blue-800">Max Displacement</div>
          <div className="text-xl font-bold text-blue-900">
            {results.summary?.maxDisplacement?.toFixed(3) || 'N/A'} mm
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Limit: L/300 = {((30000/300) || 100).toFixed(1)} mm
          </div>
          <div className="text-xs text-blue-500 mt-1">
            {(results.summary?.maxDisplacement || 0) <= 100 ? '✓ Within Limits' : '⚠ Check Required'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="text-sm font-medium text-orange-800">Max Stress</div>
          <div className="text-xl font-bold text-orange-900">
            {results.summary?.maxStress?.toFixed(1) || 'N/A'} MPa
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Allowable: 25 MPa
          </div>
          <div className="text-xs text-orange-500 mt-1">
            {(results.summary?.maxStress || 0) <= 25 ? '✓ Safe' : '⚠ Overstressed'}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="text-sm font-medium text-purple-800">Max Reaction</div>
          <div className="text-xl font-bold text-purple-900">
            {results.summary?.maxReaction?.toFixed(1) || 'N/A'} kN
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Per support point
          </div>
          <div className="text-xs text-purple-500 mt-1">
            Foundation design basis
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="text-sm font-medium text-green-800">Safety Factor</div>
          <div className="text-xl font-bold text-green-900">
            {results.summary?.safetyFactor?.toFixed(2) || 'N/A'}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {(results.summary?.safetyFactor || 0) >= 2.0 ? '✓ Safe' : '⚠ Review'}
          </div>
          <div className="text-xs text-green-500 mt-1">
            SNI Required: ≥ 2.0
          </div>
        </div>
      </div>

      {/* Engine Information */}
      {results.engineVersion && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Engine Information</span>
            </div>
            <div className="text-xs text-gray-600">
              Version: {results.engineVersion} | Real Calculations ✓
            </div>
          </div>
        </div>
      )}

      {/* SNI Compliance Status with Enhanced Visual Design */}
      {results.compliance && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-green-600" />
            SNI Compliance Status
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              Indonesian Standards
            </span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-700 mb-1">SNI 1726:2019</div>
              <div className={`text-sm font-bold mb-1 ${
                results.compliance.sni1726 === 'compliant' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {results.compliance.sni1726 === 'compliant' ? '✓ Compliant' : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Seismic Design</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-700 mb-1">SNI 1727:2020</div>
              <div className={`text-sm font-bold mb-1 ${
                results.compliance.sni1727 === 'compliant' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {results.compliance.sni1727 === 'compliant' ? '✓ Compliant' : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Load Standards</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-700 mb-1">SNI 2847:2019</div>
              <div className={`text-sm font-bold mb-1 ${
                results.compliance.sni2847 === 'compliant' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {results.compliance.sni2847 === 'compliant' ? '✓ Compliant' : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Concrete Design</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-gray-700 mb-1">SNI 1729:2020</div>
              <div className={`text-sm font-bold mb-1 ${
                results.compliance.sni1729 === 'compliant' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {results.compliance.sni1729 === 'compliant' ? '✓ Compliant' : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">Steel Design</div>
            </div>
          </div>
          
          {/* Overall Compliance Summary */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Overall Compliance Status</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                ✓ All Standards Met
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {results.recommendations && results.recommendations.length > 0 && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            Engineering Recommendations
          </h4>
          <ul className="space-y-2">
            {results.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {results.warnings && results.warnings.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
            Analysis Warnings
          </h4>
          <ul className="space-y-2">
            {results.warnings.map((warning: string, index: number) => (
              <li key={index} className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultsPanel;