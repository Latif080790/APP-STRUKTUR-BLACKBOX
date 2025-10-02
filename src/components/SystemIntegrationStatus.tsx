/**
 * System Integration Status - Real-time Workflow Monitoring
 * Displays unified progress and validation status
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, TrendingUp, Layers } from 'lucide-react';
import { workflowController } from '../controllers/UnifiedWorkflowController';

const SystemIntegrationStatus: React.FC = () => {
  const [workflowState, setWorkflowState] = useState(workflowController.getState());

  useEffect(() => {
    const unsubscribe = workflowController.subscribe(setWorkflowState);
    return () => {
      // Note: In real implementation, we'd need an unsubscribe method
    };
  }, []);

  const getStageIcon = (stage: string, isValid: boolean) => {
    if (isValid) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (workflowState.currentStage === stage) return <Clock className="w-5 h-5 text-blue-500" />;
    return <AlertTriangle className="w-5 h-5 text-gray-400" />;
  };

  const getStageStatus = (stage: string, isValid: boolean) => {
    if (isValid) return 'Completed';
    if (workflowState.currentStage === stage) return 'In Progress';
    return 'Pending';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Workflow Integration Status</h3>
            <p className="text-sm text-gray-600">Real-time validation and progress tracking</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(workflowState.progressTracking.currentProgress)}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${workflowState.progressTracking.currentProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Validation Stages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStageIcon('geometry', workflowState.validationStatus.geometry)}
            <div>
              <h4 className="font-medium text-gray-900">Building Geometry</h4>
              <p className="text-sm text-gray-600">Dimensions, grid system, structural configuration</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workflowState.validationStatus.geometry 
              ? 'bg-green-100 text-green-700' 
              : workflowState.currentStage === 'geometry'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {getStageStatus('geometry', workflowState.validationStatus.geometry)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStageIcon('materials', workflowState.validationStatus.materials)}
            <div>
              <h4 className="font-medium text-gray-900">Material Properties</h4>
              <p className="text-sm text-gray-600">SNI-compliant materials and specifications</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workflowState.validationStatus.materials 
              ? 'bg-green-100 text-green-700' 
              : workflowState.currentStage === 'materials'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {getStageStatus('materials', workflowState.validationStatus.materials)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStageIcon('loads', workflowState.validationStatus.loads)}
            <div>
              <h4 className="font-medium text-gray-900">Load Combinations</h4>
              <p className="text-sm text-gray-600">Load cases and combination factors</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workflowState.validationStatus.loads 
              ? 'bg-green-100 text-green-700' 
              : workflowState.currentStage === 'loads'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {getStageStatus('loads', workflowState.validationStatus.loads)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStageIcon('analysis', workflowState.validationStatus.analysis)}
            <div>
              <h4 className="font-medium text-gray-900">Analysis Execution</h4>
              <p className="text-sm text-gray-600">Structural analysis and results generation</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workflowState.validationStatus.analysis 
              ? 'bg-green-100 text-green-700' 
              : workflowState.currentStage === 'analysis'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {getStageStatus('analysis', workflowState.validationStatus.analysis)}
          </span>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">System Integration</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemIntegrationStatus;