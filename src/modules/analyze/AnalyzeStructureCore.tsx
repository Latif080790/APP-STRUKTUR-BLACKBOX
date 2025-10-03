/**
 * Analyze Structure Core Module - REFACTORED WITH ZUSTAND
 * Centralized state management and clean component architecture
 */
import React, { useEffect } from 'react';
import { useAnalysisStore } from '../../stores/useAnalysisStore';
import StaticAnalysisView from './views/StaticAnalysisView';
import DynamicAnalysisView from './views/DynamicAnalysisView';
import SeismicAnalysisView from './views/SeismicAnalysisView';
import WindAnalysisView from './views/WindAnalysisView';
import LinearAnalysisView from './views/LinearAnalysisView';
import NonLinearAnalysisView from './views/NonLinearAnalysisView';
import LoadCombinationsComponent from './LoadCombinationsComponent';
import AnalysisResultsComponent from './AnalysisResultsComponent';
import ConsolidatedAnalysisGuide from './components/ConsolidatedAnalysisGuide';
import MaterialPropertiesManager from '../materials/MaterialPropertiesManager';
import Enhanced3DStructuralViewerReactThreeFiber from '../viewer/Enhanced3DStructuralViewerReactThreeFiber';
import AnalysisSettingsManager from '../settings/AnalysisSettingsManager';
import { X } from 'lucide-react';

interface AnalyzeStructureCoreProps {
  initialAnalysisType?: string;
}

const AnalyzeStructureCore: React.FC<AnalyzeStructureCoreProps> = ({ initialAnalysisType = 'static' }) => {
  const {
    currentAnalysisType,
    setCurrentAnalysisType,
    buildingGeometry,
    selectedMaterials,
    analysisResults,
    analysisStatus,
    showMaterialManager,
    show3DViewer,
    showSettingsManager,
    showGuide,
    setShowMaterialManager,
    setShow3DViewer,
    setShowSettingsManager,
    setShowGuide,
    handleMaterialSelect,
    handleLoadCombinationsChange,
    handleClearResults
  } = useAnalysisStore();

  // Update analysis type when route changes
  useEffect(() => {
    setCurrentAnalysisType(initialAnalysisType);
  }, [initialAnalysisType, setCurrentAnalysisType]);

  // Render appropriate analysis view based on current type
  const renderAnalysisView = () => {
    switch (currentAnalysisType) {
      case 'static':
        return <StaticAnalysisView />;
      case 'dynamic':
        return <DynamicAnalysisView />;
      case 'seismic':
        return <SeismicAnalysisView />;
      case 'wind':
        return <WindAnalysisView />;
      case 'linear':
        return <LinearAnalysisView />;
      case 'nonlinear':
        return <NonLinearAnalysisView />;
      case 'combinations':
        return (
          <LoadCombinationsComponent 
            onCombinationsChange={handleLoadCombinationsChange}
            selectedCombinations={[]}
          />
        );
      case 'results':
        // Following Analysis Results Visibility Rule - only show results when analysis is completed
        if (analysisStatus.analysis === 'completed' && analysisResults) {
          return (
            <AnalysisResultsComponent 
              analysisResults={[
                {
                  id: '1',
                  name: `${analysisResults.status} Analysis`,
                  type: 'static',
                  date: analysisResults.timestamp ? new Date(analysisResults.timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
                  status: 'completed',
                  maxDisplacement: analysisResults.summary.maxDisplacement,
                  maxStress: analysisResults.summary.maxStress,
                  utilizationRatio: analysisResults.summary.maxStress / 250, // Assuming 250 MPa allowable
                  safetyFactor: analysisResults.summary.safetyFactor,
                  compliance: {
                    sni1726: analysisResults.compliance?.sni1726 || false,
                    sni1727: analysisResults.compliance?.sni1727 || false,
                    sni2847: analysisResults.compliance?.sni2847 || false,
                    sni1729: analysisResults.compliance?.sni1729 || false
                  }
                }
              ]}
              onClearResults={handleClearResults}
            />
          );
        } else {
          // Show message when no results available
          return (
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Results Available</h3>
              <p className="text-gray-600 mb-4">Run an analysis first to view results here.</p>
              <p className="text-sm text-gray-500">Current analysis status: <span className="font-medium">{analysisStatus.analysis}</span></p>
            </div>
          );
        }
      default:
        return <StaticAnalysisView />;
    }
  };

  return (
    <>
      {/* Main Analysis Content */}
      <div className="w-full bg-gray-50">
        <div className="p-6">
          {renderAnalysisView()}
        </div>
      </div>

      {/* Material Properties Manager Modal */}
      {showMaterialManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-5/6 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Material Properties Manager</h2>
              <button
                onClick={() => setShowMaterialManager(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full">
              <MaterialPropertiesManager 
                onMaterialSelect={(material) => handleMaterialSelect(material as any)}
                selectedMaterials={selectedMaterials}
                mode="select"
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced 3D Viewer Modal */}
      {show3DViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl h-5/6 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Enhanced 3D Structural Viewer
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Interactive visualization with grid system, materials, and analysis results
                </p>
              </div>
              <button
                onClick={() => setShow3DViewer(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-full p-6">
              <Enhanced3DStructuralViewerReactThreeFiber
                geometry={buildingGeometry}
                selectedMaterials={selectedMaterials}
                analysisResults={analysisResults ? {
                  maxDisplacement: analysisResults.summary.maxDisplacement,
                  maxStress: analysisResults.summary.maxStress,
                  safetyFactor: analysisResults.summary.safetyFactor
                } : undefined}
                onClose={() => setShow3DViewer(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Analysis Settings Manager Modal */}
      {showSettingsManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-5/6 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Analysis Settings Manager</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Configure analysis settings, materials, and SNI standards
                </p>
              </div>
              <button
                onClick={() => setShowSettingsManager(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-full p-6 overflow-y-auto">
              <AnalysisSettingsManager />
            </div>
          </div>
        </div>
      )}

      {/* Consolidated Analysis Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-5/6 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Analysis Guide & Help</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete documentation and help in one consolidated interface
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-full">
              <ConsolidatedAnalysisGuide />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnalyzeStructureCore;