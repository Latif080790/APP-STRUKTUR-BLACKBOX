/**
 * Advanced Analysis Interface
 * User interface for sophisticated structural analysis methods
 */

import React, { useState, useCallback } from 'react';
import { Structure3D } from '@/types/structural';
import { 
  AdvancedAnalysisEngine, 
  TimeHistoryConfig, 
  PushoverConfig, 
  BucklingConfig,
  AdvancedAnalysisResult 
} from './AdvancedAnalysisEngine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdvancedAnalysisInterfaceProps {
  structure: Structure3D;
  onAnalysisComplete: (result: AdvancedAnalysisResult) => void;
}

export const AdvancedAnalysisInterface: React.FC<AdvancedAnalysisInterfaceProps> = ({
  structure,
  onAnalysisComplete
}) => {
  const [activeTab, setActiveTab] = useState<'time-history' | 'pushover' | 'buckling'>('time-history');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Time-History Analysis State
  const [timeHistoryConfig, setTimeHistoryConfig] = useState<TimeHistoryConfig>({
    timeStep: 0.01,
    totalTime: 10.0,
    dampingRatio: 0.05,
    integrationMethod: 'newmark',
    loadHistory: [
      {
        time: 0,
        loads: []
      },
      {
        time: 1.0,
        loads: [
          {
            nodeId: 'N1',
            direction: 'y',
            magnitude: -10000
          }
        ]
      }
    ]
  });

  // Pushover Analysis State
  const [pushoverConfig, setPushoverConfig] = useState<PushoverConfig>({
    controlNode: 'N1',
    controlDirection: 'x',
    maxDisplacement: 0.1,
    incrementSteps: 100,
    convergenceTolerance: 1e-6,
    yieldCriteria: {
      materialStrainLimit: 0.002,
      elementRotationLimit: 0.02
    }
  });

  // Buckling Analysis State
  const [bucklingConfig, setBucklingConfig] = useState<BucklingConfig>({
    numberOfModes: 5,
    shiftValue: 0,
    includeGeometricStiffness: true,
    loadPattern: [
      {
        nodeId: 'N1',
        direction: 'y',
        magnitude: -1000
      }
    ]
  });

  const handleTimeHistoryAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const engine = new AdvancedAnalysisEngine(structure);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      const result = await engine.performTimeHistoryAnalysis(timeHistoryConfig);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Time-history analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [structure, timeHistoryConfig, onAnalysisComplete]);

  const handlePushoverAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const engine = new AdvancedAnalysisEngine(structure);
      
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 5, 90));
      }, 200);
      
      const result = await engine.performPushoverAnalysis(pushoverConfig);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Pushover analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [structure, pushoverConfig, onAnalysisComplete]);

  const handleBucklingAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const engine = new AdvancedAnalysisEngine(structure);
      
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 15, 90));
      }, 300);
      
      const result = await engine.performBucklingAnalysis(bucklingConfig);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Buckling analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [structure, bucklingConfig, onAnalysisComplete]);

  const renderTimeHistoryPanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Time Step (s)</label>
          <input
            type="number"
            step="0.001"
            value={timeHistoryConfig.timeStep}
            onChange={(e) => setTimeHistoryConfig(prev => ({
              ...prev,
              timeStep: parseFloat(e.target.value) || 0.01
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Total Time (s)</label>
          <input
            type="number"
            step="0.1"
            value={timeHistoryConfig.totalTime}
            onChange={(e) => setTimeHistoryConfig(prev => ({
              ...prev,
              totalTime: parseFloat(e.target.value) || 10.0
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Damping Ratio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={timeHistoryConfig.dampingRatio}
            onChange={(e) => setTimeHistoryConfig(prev => ({
              ...prev,
              dampingRatio: parseFloat(e.target.value) || 0.05
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Integration Method</label>
          <select
            value={timeHistoryConfig.integrationMethod}
            onChange={(e) => setTimeHistoryConfig(prev => ({
              ...prev,
              integrationMethod: e.target.value as any
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="newmark">Newmark-β</option>
            <option value="wilson">Wilson-θ</option>
            <option value="central-difference">Central Difference</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3">Load History</h4>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600 mb-2">
            Define time-varying loads for dynamic analysis
          </p>
          <div className="space-y-2">
            {timeHistoryConfig.loadHistory.map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm">t = {point.time}s:</span>
                <span className="text-sm">{point.loads.length} loads</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleTimeHistoryAnalysis}
        disabled={isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? `Analyzing... ${analysisProgress}%` : 'Run Time-History Analysis'}
      </Button>
    </div>
  );

  const renderPushoverPanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Control Node</label>
          <select
            value={pushoverConfig.controlNode}
            onChange={(e) => setPushoverConfig(prev => ({
              ...prev,
              controlNode: e.target.value
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {structure.nodes.map(node => (
              <option key={node.id} value={node.id}>{node.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Control Direction</label>
          <select
            value={pushoverConfig.controlDirection}
            onChange={(e) => setPushoverConfig(prev => ({
              ...prev,
              controlDirection: e.target.value as any
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="x">X Direction</option>
            <option value="y">Y Direction</option>
            <option value="z">Z Direction</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Max Displacement (m)</label>
          <input
            type="number"
            step="0.001"
            value={pushoverConfig.maxDisplacement}
            onChange={(e) => setPushoverConfig(prev => ({
              ...prev,
              maxDisplacement: parseFloat(e.target.value) || 0.1
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Increment Steps</label>
          <input
            type="number"
            min="10"
            max="1000"
            value={pushoverConfig.incrementSteps}
            onChange={(e) => setPushoverConfig(prev => ({
              ...prev,
              incrementSteps: parseInt(e.target.value) || 100
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3">Yield Criteria</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Material Strain Limit</label>
            <input
              type="number"
              step="0.0001"
              value={pushoverConfig.yieldCriteria.materialStrainLimit}
              onChange={(e) => setPushoverConfig(prev => ({
                ...prev,
                yieldCriteria: {
                  ...prev.yieldCriteria,
                  materialStrainLimit: parseFloat(e.target.value) || 0.002
                }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Element Rotation Limit (rad)</label>
            <input
              type="number"
              step="0.001"
              value={pushoverConfig.yieldCriteria.elementRotationLimit}
              onChange={(e) => setPushoverConfig(prev => ({
                ...prev,
                yieldCriteria: {
                  ...prev.yieldCriteria,
                  elementRotationLimit: parseFloat(e.target.value) || 0.02
                }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handlePushoverAnalysis}
        disabled={isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? `Analyzing... ${analysisProgress}%` : 'Run Pushover Analysis'}
      </Button>
    </div>
  );

  const renderBucklingPanel = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Number of Modes</label>
          <input
            type="number"
            min="1"
            max="20"
            value={bucklingConfig.numberOfModes}
            onChange={(e) => setBucklingConfig(prev => ({
              ...prev,
              numberOfModes: parseInt(e.target.value) || 5
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Shift Value</label>
          <input
            type="number"
            value={bucklingConfig.shiftValue || 0}
            onChange={(e) => setBucklingConfig(prev => ({
              ...prev,
              shiftValue: parseFloat(e.target.value) || 0
            }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="geometricStiffness"
          checked={bucklingConfig.includeGeometricStiffness}
          onChange={(e) => setBucklingConfig(prev => ({
            ...prev,
            includeGeometricStiffness: e.target.checked
          }))}
          className="w-4 h-4"
        />
        <label htmlFor="geometricStiffness" className="text-sm font-medium">
          Include Geometric Stiffness Effects
        </label>
      </div>
      
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-3">Load Pattern</h4>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600 mb-2">
            Define reference load pattern for buckling analysis
          </p>
          <div className="space-y-2">
            {bucklingConfig.loadPattern.map((load, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">
                  Node {load.nodeId}: {load.magnitude}N ({load.direction})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleBucklingAnalysis}
        disabled={isAnalyzing}
        className="w-full"
      >
        {isAnalyzing ? `Analyzing... ${analysisProgress}%` : 'Run Buckling Analysis'}
      </Button>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🔬 Advanced Structural Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('time-history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'time-history' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🕐 Time-History
          </button>
          <button
            onClick={() => setActiveTab('pushover')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pushover' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📈 Pushover
          </button>
          <button
            onClick={() => setActiveTab('buckling')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'buckling' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🔀 Buckling
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'time-history' && renderTimeHistoryPanel()}
        {activeTab === 'pushover' && renderPushoverPanel()}
        {activeTab === 'buckling' && renderBucklingPanel()}

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Analysis in progress... {analysisProgress}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedAnalysisInterface;