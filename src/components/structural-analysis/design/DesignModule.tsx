/**
 * Fixed Design Module - Clean Implementation
 */

import React, { useState } from 'react';
import { EnhancedEducationalDesignEngine, EnhancedDesignResults } from './EnhancedEducationalDesignEngine';
import { DesignInput } from './StructuralDesignEngine';

interface DesignModuleProps {
  analysisResults?: any;
  projectInfo?: {
    name: string;
    date: string;
    engineer: string;
    checker: string;
  };
}

export const DesignModule: React.FC<DesignModuleProps> = ({ 
  analysisResults,
  projectInfo 
}) => {
  const [results, setResults] = useState<EnhancedDesignResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    const sampleInput: DesignInput = {
      elementType: 'beam',
      geometry: { width: 300, height: 500, length: 6000, clearCover: 40 },
      materials: { fc: 30, fy: 400 },
      loads: { deadLoad: 15, liveLoad: 20 },
      forces: { momentX: 180, shearX: 120 },
      constraints: { deflectionLimit: 250, exposureCondition: 'moderate' }
    };

    try {
      const engine = new EnhancedEducationalDesignEngine(sampleInput);
      const designResults = engine.performEducationalDesign('beam');
      setResults(designResults);
    } catch (error) {
      console.error('Design error:', error);
    }
    
    setIsCalculating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Enhanced Design Module</h1>
        <p className="mt-2">Professional structural design with educational feedback</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Design Calculator</h2>
        
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className={`px-6 py-3 rounded-lg text-white font-medium ${
            isCalculating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isCalculating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Calculating...</span>
            </div>
          ) : (
            'Calculate Beam Design'
          )}
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Design Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Element Details</h4>
                <p className="text-sm text-gray-600">
                  {results.element.dimensions.width}×{results.element.dimensions.height}mm {results.element.type}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Design Status</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  results.isValid 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {results.isValid ? 'PASSED' : 'FAILED'}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-gray-800">Input Quality</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  results.educationalFeedback.inputQuality === 'excellent' ? 'bg-green-100 text-green-800' :
                  results.educationalFeedback.inputQuality === 'good' ? 'bg-blue-100 text-blue-800' :
                  results.educationalFeedback.inputQuality === 'needs_improvement' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {results.educationalFeedback.inputQuality.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Main Reinforcement</h4>
                <p className="text-sm text-gray-600">
                  {results.reinforcement.main.count}D{results.reinforcement.main.diameter}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800">Stirrups</h4>
                <p className="text-sm text-gray-600">
                  D{results.reinforcement.shear.diameter}-{results.reinforcement.shear.spacing}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800">Total Cost</h4>
                <p className="text-sm text-gray-600">
                  Rp {results.cost.total.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {results.educationalFeedback.learningPoints.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Learning Points</h4>
              <ul className="space-y-1">
                {results.educationalFeedback.learningPoints.map((point, index) => (
                  <li key={index} className="text-sm text-blue-700">• {point}</li>
                ))}
              </ul>
            </div>
          )}

          {results.educationalFeedback.bestPractices.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Best Practices</h4>
              <ul className="space-y-1">
                {results.educationalFeedback.bestPractices.slice(0, 3).map((practice, index) => (
                  <li key={index} className="text-sm text-green-700">• {practice}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignModule;