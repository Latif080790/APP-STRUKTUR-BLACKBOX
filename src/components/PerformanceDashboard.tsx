/**
 * Performance Dashboard Component
 * Real-time performance monitoring with optimized components integration
 */

import React, { useState, useEffect } from 'react';
import { PerformanceMonitor } from '../core/PerformanceMonitor';
import { OptimizedComponents } from '../structural-analysis/OptimizedComponents';
import { withPerformanceMonitoring } from '../structural-analysis/performance-OptimizedComponents';
import { 
  Monitor, Cpu, MemoryStick, Activity, 
  TrendingUp, TrendingDown, Minus,
  CheckCircle, AlertTriangle, Clock
} from 'lucide-react';

interface PerformanceMetrics {
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  analysisTime: {
    average: number;
    latest: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
  systemLoad: {
    cpu: number;
    network: number;
    storage: number;
  };
  userActivity: {
    activeUsers: number;
    sessionsPerHour: number;
    errorRate: number;
  };
}

interface PerformanceDashboardProps {
  className?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  className = '' 
}) => {
  const [performanceMonitor] = useState(() => new PerformanceMonitor());
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to performance metrics
    const unsubscribe = performanceMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      
      // Generate alerts for demo
      const newAlerts = [];
      if (newMetrics.memoryUsage.percentage > 75) {
        newAlerts.push({
          id: 'memory-high',
          type: 'warning',
          message: 'Memory usage is high'
        });
      }
      setAlerts(newAlerts);
    });

    return () => {
      performanceMonitor.stopMonitoring();
      unsubscribe();
    };
  }, [performanceMonitor]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'degrading': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleOptimization = () => {
    setIsOptimized(!isOptimized);
    console.log(`Performance optimization ${!isOptimized ? 'enabled' : 'disabled'}`);
  };

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <Activity className="w-8 h-8 animate-pulse text-blue-600" />
          <span className="ml-2 text-gray-600">Loading performance metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <Monitor className="w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold">Performance Monitor</h2>
          </div>
          <div className="flex items-center space-x-2">
            {alerts.length > 0 && (
              <div className="flex items-center text-yellow-300">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-sm">{alerts.length} alerts</span>
              </div>
            )}
            <button
              onClick={toggleOptimization}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isOptimized
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              Optimization: {isOptimized ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Memory Usage */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MemoryStick className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Memory</span>
            </div>
            <span className="text-lg font-bold text-blue-900">
              {metrics.memoryUsage.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.memoryUsage.percentage}%` }}
            />
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {(metrics.memoryUsage.used / 1024 / 1024).toFixed(1)} MB used
          </div>
        </div>

        {/* Analysis Time */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Analysis</span>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-green-900 mr-1">
                {(metrics.analysisTime.latest / 1000).toFixed(1)}s
              </span>
              {getTrendIcon(metrics.analysisTime.trend)}
            </div>
          </div>
          <div className="text-xs text-green-600">
            Avg: {(metrics.analysisTime.average / 1000).toFixed(1)}s | 
            Trend: {metrics.analysisTime.trend}
          </div>
        </div>

        {/* CPU Load */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Cpu className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-orange-800">CPU</span>
            </div>
            <span className="text-lg font-bold text-orange-900">
              {metrics.systemLoad.cpu.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${metrics.systemLoad.cpu}%` }}
            />
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Network: {metrics.systemLoad.network.toFixed(0)}%
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-800">Users</span>
            </div>
            <span className="text-lg font-bold text-purple-900">
              {metrics.userActivity.activeUsers}
            </span>
          </div>
          <div className="text-xs text-purple-600">
            Sessions: {metrics.userActivity.sessionsPerHour}/hr<br/>
            Error Rate: {metrics.userActivity.errorRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Performance Optimization Status */}
      <div className="px-4 pb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Performance Optimization Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">React.memo Components</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">Lazy Loading</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">Optimized Rendering</span>
            </div>
          </div>
          
          {isOptimized && (
            <div className="mt-3 p-3 bg-green-100 rounded border border-green-200">
              <div className="text-sm text-green-800">
                ✅ Performance optimizations are active:
                <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                  <li>Using OptimizedInputForm with React.memo</li>
                  <li>Lazy 3D Viewer with Suspense</li>
                  <li>Optimized tab content rendering</li>
                  <li>Memoized chart components</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">
              Performance Alerts
            </h3>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center text-sm text-yellow-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {alert.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced version with performance monitoring HOC
export const EnhancedPerformanceDashboard = withPerformanceMonitoring(
  PerformanceDashboard, 
  'PerformanceDashboard'
);

export default PerformanceDashboard;