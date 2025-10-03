/**
 * User Acceptance Testing Dashboard
 * Interactive interface for executing and monitoring UAT scenarios
 * Professional quality assurance for structural engineering applications
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, XCircle, Clock, Play, Pause, RotateCcw,
  FileText, BarChart3, TrendingUp, AlertCircle, 
  Users, Target, Award, Settings
} from 'lucide-react';
import { 
  UATScenario, 
  UATResult, 
  UATExecutor, 
  userAcceptanceTestScenarios 
} from './UserAcceptanceTestScenarios';

const UserAcceptanceTestDashboard: React.FC = () => {
  const [scenarios] = useState<UATScenario[]>(userAcceptanceTestScenarios);
  const [executor] = useState(new UATExecutor());
  const [results, setResults] = useState<Map<string, UATResult>>(new Map());
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterComplexity, setFilterComplexity] = useState<string>('all');

  // Execute a UAT scenario
  const executeScenario = useCallback(async (scenarioId: string) => {
    setIsExecuting(scenarioId);
    
    try {
      const result = await executor.executeScenario(scenarioId);
      setResults(new Map(executor.getResults()));
    } catch (error) {
      console.error('Failed to execute scenario:', error);
    } finally {
      setIsExecuting(null);
    }
  }, [executor]);

  // Execute all scenarios
  const executeAllScenarios = useCallback(async () => {
    for (const scenario of scenarios) {
      if (!isExecuting) {
        await executeScenario(scenario.id);
      }
    }
  }, [scenarios, executeScenario, isExecuting]);

  // Filter scenarios
  const filteredScenarios = scenarios.filter(scenario => {
    const categoryMatch = filterCategory === 'all' || scenario.category === filterCategory;
    const complexityMatch = filterComplexity === 'all' || scenario.complexity === filterComplexity;
    return categoryMatch && complexityMatch;
  });

  // Get result for scenario
  const getScenarioResult = (scenarioId: string): UATResult | undefined => {
    return results.get(scenarioId);
  };

  // Get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'design': return Target;
      case 'analysis': return BarChart3;
      case 'reporting': return FileText;
      case 'collaboration': return Users;
      case 'optimization': return TrendingUp;
      default: return Settings;
    }
  };

  // Generate summary statistics
  const summaryStats = {
    total: scenarios.length,
    executed: results.size,
    passed: Array.from(results.values()).filter(r => r.status === 'passed').length,
    failed: Array.from(results.values()).filter(r => r.status === 'failed').length,
    successRate: results.size > 0 ? (Array.from(results.values()).filter(r => r.status === 'passed').length / results.size * 100) : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">User Acceptance Testing Dashboard</h1>
                <p className="text-green-100 text-sm">Professional validation scenarios for structural engineering workflows</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={executeAllScenarios}
                disabled={!!isExecuting}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold flex items-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Run All Tests</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {[
          { label: 'Total Scenarios', value: summaryStats.total, icon: FileText, color: 'blue' },
          { label: 'Executed', value: summaryStats.executed, icon: Play, color: 'purple' },
          { label: 'Passed', value: summaryStats.passed, icon: CheckCircle, color: 'green' },
          { label: 'Failed', value: summaryStats.failed, icon: XCircle, color: 'red' },
          { label: 'Success Rate', value: `${summaryStats.successRate.toFixed(1)}%`, icon: TrendingUp, color: 'emerald' }
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-100`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {value}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scenario List */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Test Scenarios</h2>
            
            {/* Filters */}
            <div className="flex items-center space-x-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="design">Design</option>
                <option value="analysis">Analysis</option>
                <option value="reporting">Reporting</option>
                <option value="collaboration">Collaboration</option>
                <option value="optimization">Optimization</option>
              </select>
              
              <select
                value={filterComplexity}
                onChange={(e) => setFilterComplexity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Complexity</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredScenarios.map((scenario) => {
              const result = getScenarioResult(scenario.id);
              const CategoryIcon = getCategoryIcon(scenario.category);
              const isRunning = isExecuting === scenario.id;

              return (
                <div 
                  key={scenario.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedScenario === scenario.id ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white'
                  }`}
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {scenario.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {scenario.professionalContext}
                        </p>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className={`px-2 py-1 rounded-full font-semibold ${getComplexityColor(scenario.complexity)}`}>
                            {scenario.complexity}
                          </span>
                          <span className="text-gray-500">
                            ~{scenario.estimatedTime} min
                          </span>
                          <span className="text-gray-500">
                            {scenario.steps.length} steps
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {result && (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          executeScenario(scenario.id);
                        }}
                        disabled={isRunning}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-semibold flex items-center space-x-1 disabled:opacity-50"
                      >
                        {isRunning ? (
                          <>
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>Running</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Run Test</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* SNI Compliance Tags */}
                  <div className="flex items-center space-x-2">
                    {scenario.sniCompliance.map((standard) => (
                      <span 
                        key={standard}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scenario Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {selectedScenario ? (
            (() => {
              const scenario = scenarios.find(s => s.id === selectedScenario)!;
              const result = getScenarioResult(selectedScenario);
              
              return (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Scenario Details
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Objectives</h3>
                      <ul className="space-y-1">
                        {scenario.objectives.map((objective, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Prerequisites</h3>
                      <ul className="space-y-1">
                        {scenario.prerequisites.map((prerequisite, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {prerequisite}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Test Steps</h3>
                      <div className="space-y-2">
                        {scenario.steps.map((step) => {
                          const stepResult = result?.steps.find(s => s.stepNumber === step.stepNumber);
                          
                          return (
                            <div key={step.stepNumber} className="border border-gray-200 rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">
                                  Step {step.stepNumber}
                                </span>
                                {stepResult && (
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    stepResult.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {stepResult.passed ? 'Passed' : 'Failed'}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-1">
                                {step.action}
                              </p>
                              <p className="text-xs text-gray-500">
                                Expected: {step.expectedBehavior}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {result && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Test Results</h3>
                        <div className="bg-gray-50 rounded p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <span className={`font-semibold ${
                              result.status === 'passed' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Duration:</span>
                            <span>{((result.duration || 0) / 1000).toFixed(1)}s</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Professional Validation:</span>
                            <span className={result.professionalValidation ? 'text-green-600' : 'text-red-600'}>
                              {result.professionalValidation ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                          {result.failureReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                              <p className="text-sm text-red-700">
                                <strong>Failure Reason:</strong> {result.failureReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Test Scenario
              </h3>
              <p className="text-gray-600">
                Choose a scenario from the list to view details and execute tests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAcceptanceTestDashboard;