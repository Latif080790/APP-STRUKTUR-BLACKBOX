/**
 * Advanced Analytics Dashboard
 * Comprehensive analytics with performance insights, user behavior tracking, and system health monitoring
 * Following user preferences: English UI, prominent features, consolidated interface
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PerformanceMonitor } from '../core/PerformanceMonitor';
import { 
  BarChart3, TrendingUp, Users, Clock, Activity, 
  Cpu, MemoryStick, HardDrive, Wifi, AlertTriangle,
  CheckCircle, Target, Zap, Filter, Calendar,
  Download, Eye, Settings, Maximize2, RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  performanceMetrics: {
    avgAnalysisTime: number;
    memoryEfficiency: number;
    systemUptime: string;
    errorRate: number;
  };
  userBehavior: {
    activeUsers: number;
    sessionsToday: number;
    popularModules: Array<{name: string; usage: number}>;
    peakUsageHours: string[];
  };
  analysisPatterns: {
    totalAnalyses: number;
    successRate: number;
    mostUsedAnalysisType: string;
    averageProjectSize: string;
  };
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    uptime: string;
    status: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

interface TrendData {
  timestamp: string;
  value: number;
  label: string;
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [performanceMonitor] = useState(() => new PerformanceMonitor());
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'users' | 'analysis' | 'system'>('performance');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [trends, setTrends] = useState<TrendData[]>([]);

  // Generate mock analytics data based on time range
  const generateAnalyticsData = useMemo((): AnalyticsData => {
    const baseMultiplier = {
      '1h': 1,
      '24h': 24,
      '7d': 168,
      '30d': 720
    }[selectedTimeRange];

    return {
      performanceMetrics: {
        avgAnalysisTime: 1200 + Math.random() * 500,
        memoryEfficiency: 85 + Math.random() * 10,
        systemUptime: '99.8%',
        errorRate: 0.5 + Math.random() * 1.5
      },
      userBehavior: {
        activeUsers: Math.floor(15 + Math.random() * 25),
        sessionsToday: Math.floor(45 * baseMultiplier + Math.random() * 30),
        popularModules: [
          { name: 'Static Analysis', usage: 45 + Math.random() * 20 },
          { name: 'Seismic Analysis', usage: 30 + Math.random() * 15 },
          { name: '3D Viewer', usage: 25 + Math.random() * 10 },
          { name: 'Dynamic Analysis', usage: 20 + Math.random() * 8 },
          { name: 'Wind Analysis', usage: 15 + Math.random() * 5 }
        ].sort((a, b) => b.usage - a.usage),
        peakUsageHours: ['09:00-11:00', '14:00-16:00', '19:00-21:00']
      },
      analysisPatterns: {
        totalAnalyses: Math.floor(500 * baseMultiplier + Math.random() * 200),
        successRate: 95 + Math.random() * 4,
        mostUsedAnalysisType: 'Static Analysis',
        averageProjectSize: '5.2 MB'
      },
      systemHealth: {
        cpuUsage: 25 + Math.random() * 30,
        memoryUsage: 45 + Math.random() * 25,
        diskUsage: 60 + Math.random() * 15,
        networkLatency: 20 + Math.random() * 10,
        uptime: '15d 7h 23m',
        status: Math.random() > 0.8 ? 'excellent' : Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'fair' : 'poor'
      }
    };
  }, [selectedTimeRange]);

  // Generate trend data
  const generateTrendData = useMemo((): TrendData[] => {
    const points = selectedTimeRange === '1h' ? 12 : selectedTimeRange === '24h' ? 24 : selectedTimeRange === '7d' ? 7 : 30;
    const data: TrendData[] = [];
    
    for (let i = 0; i < points; i++) {
      const baseValue = 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10;
      data.push({
        timestamp: new Date(Date.now() - (points - i) * (selectedTimeRange === '1h' ? 300000 : selectedTimeRange === '24h' ? 3600000 : selectedTimeRange === '7d' ? 86400000 : 2592000000)).toISOString(),
        value: Math.max(0, Math.min(100, baseValue)),
        label: selectedTimeRange === '1h' ? `${i * 5}min` : selectedTimeRange === '24h' ? `${i}h` : selectedTimeRange === '7d' ? `Day ${i + 1}` : `Week ${i + 1}`
      });
    }
    
    return data;
  }, [selectedTimeRange]);

  useEffect(() => {
    // Simulate data updates
    const updateData = () => {
      setAnalyticsData(generateAnalyticsData);
      setTrends(generateTrendData);
    };

    updateData();
    
    let interval: NodeJS.Timeout;
    if (isRealTimeEnabled) {
      interval = setInterval(updateData, 5000); // Update every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generateAnalyticsData, generateTrendData, isRealTimeEnabled]);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderMetricCards = () => {
    if (!analyticsData) return null;

    const metrics = {
      performance: [
        { label: 'Avg Analysis Time', value: `${(analyticsData.performanceMetrics.avgAnalysisTime / 1000).toFixed(1)}s`, icon: Clock, color: 'blue' },
        { label: 'Memory Efficiency', value: `${analyticsData.performanceMetrics.memoryEfficiency.toFixed(1)}%`, icon: MemoryStick, color: 'green' },
        { label: 'System Uptime', value: analyticsData.performanceMetrics.systemUptime, icon: Activity, color: 'purple' },
        { label: 'Error Rate', value: `${analyticsData.performanceMetrics.errorRate.toFixed(1)}%`, icon: AlertTriangle, color: 'red' }
      ],
      users: [
        { label: 'Active Users', value: analyticsData.userBehavior.activeUsers.toString(), icon: Users, color: 'blue' },
        { label: 'Sessions Today', value: analyticsData.userBehavior.sessionsToday.toString(), icon: Target, color: 'green' },
        { label: 'Peak Hours', value: analyticsData.userBehavior.peakUsageHours[0], icon: TrendingUp, color: 'orange' },
        { label: 'Popular Module', value: analyticsData.userBehavior.popularModules[0]?.name || 'N/A', icon: Zap, color: 'purple' }
      ],
      analysis: [
        { label: 'Total Analyses', value: analyticsData.analysisPatterns.totalAnalyses.toLocaleString(), icon: BarChart3, color: 'blue' },
        { label: 'Success Rate', value: `${analyticsData.analysisPatterns.successRate.toFixed(1)}%`, icon: CheckCircle, color: 'green' },
        { label: 'Most Used Type', value: analyticsData.analysisPatterns.mostUsedAnalysisType, icon: Target, color: 'purple' },
        { label: 'Avg Project Size', value: analyticsData.analysisPatterns.averageProjectSize, icon: HardDrive, color: 'orange' }
      ],
      system: [
        { label: 'CPU Usage', value: `${analyticsData.systemHealth.cpuUsage.toFixed(0)}%`, icon: Cpu, color: 'blue' },
        { label: 'Memory Usage', value: `${analyticsData.systemHealth.memoryUsage.toFixed(0)}%`, icon: MemoryStick, color: 'green' },
        { label: 'Disk Usage', value: `${analyticsData.systemHealth.diskUsage.toFixed(0)}%`, icon: HardDrive, color: 'orange' },
        { label: 'Network Latency', value: `${analyticsData.systemHealth.networkLatency.toFixed(0)}ms`, icon: Wifi, color: 'purple' }
      ]
    };

    return metrics[selectedMetric].map((metric, index) => (
      <div key={index} className={`bg-${metric.color}-50 rounded-xl p-6 border border-${metric.color}-100`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <metric.icon className={`w-6 h-6 text-${metric.color}-600 mr-3`} />
            <span className={`text-sm font-medium text-${metric.color}-800`}>{metric.label}</span>
          </div>
        </div>
        <div className={`text-2xl font-bold text-${metric.color}-900 mb-2`}>
          {metric.value}
        </div>
        <div className="flex items-center">
          <TrendingUp className={`w-4 h-4 text-${metric.color}-600 mr-1`} />
          <span className={`text-xs text-${metric.color}-600`}>
            {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 10).toFixed(1)}% vs last period
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Advanced Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights into system performance, user behavior, and analysis patterns
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Real-time Toggle */}
              <div className="flex items-center">
                <label className="text-sm font-medium text-gray-700 mr-2">Real-time:</label>
                <input
                  type="checkbox"
                  checked={isRealTimeEnabled}
                  onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              {/* Time Range Selector */}
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              
              {/* Export Button */}
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Metric Category Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'performance', label: 'Performance', icon: Activity },
                { id: 'users', label: 'User Behavior', icon: Users },
                { id: 'analysis', label: 'Analysis Patterns', icon: BarChart3 },
                { id: 'system', label: 'System Health', icon: Cpu }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedMetric(id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    selectedMetric === id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {renderMetricCards()}
            </div>
          </div>
        </div>

        {/* Trend Chart and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
              <div className="flex items-center space-x-2">
                <RefreshCw className={`w-4 h-4 ${isRealTimeEnabled ? 'animate-spin text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm text-gray-500">
                  {isRealTimeEnabled ? 'Live' : 'Static'}
                </span>
              </div>
            </div>
            
            <div className="h-64 flex items-end space-x-2">
              {trends.map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(point.value / 100) * 200}px` }}
                    title={`${point.label}: ${point.value.toFixed(1)}%`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Module Usage */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Popular Modules</h2>
            
            <div className="space-y-4">
              {analyticsData?.userBehavior.popularModules.map((module, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-yellow-500' : 
                      index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">{module.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-yellow-500' : 
                          index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(module.usage / analyticsData.userBehavior.popularModules[0].usage) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {module.usage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">System Health Overview</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              analyticsData ? getHealthStatusColor(analyticsData.systemHealth.status) : 'text-gray-600 bg-gray-100'
            }`}>
              {analyticsData?.systemHealth.status.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analyticsData && [
              { label: 'CPU', value: analyticsData.systemHealth.cpuUsage, icon: Cpu, color: 'blue' },
              { label: 'Memory', value: analyticsData.systemHealth.memoryUsage, icon: MemoryStick, color: 'green' },
              { label: 'Disk', value: analyticsData.systemHealth.diskUsage, icon: HardDrive, color: 'orange' },
              { label: 'Network', value: analyticsData.systemHealth.networkLatency, icon: Wifi, color: 'purple', unit: 'ms' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                </div>
                <div className={`text-2xl font-bold text-${item.color}-600 mb-1`}>
                  {item.unit ? item.value.toFixed(0) + item.unit : item.value.toFixed(0) + '%'}
                </div>
                <div className="text-sm text-gray-600">{item.label}</div>
                <div className={`w-full bg-${item.color}-100 rounded-full h-2 mt-2`}>
                  <div
                    className={`bg-${item.color}-500 h-2 rounded-full transition-all duration-500`}
                    style={{ width: item.unit ? '50%' : `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              <strong>System Uptime:</strong> {analyticsData?.systemHealth.uptime} | 
              <strong className="ml-4">Last Update:</strong> {new Date().toLocaleTimeString()} |
              <strong className="ml-4">Next Maintenance:</strong> Scheduled for Sunday 02:00 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;