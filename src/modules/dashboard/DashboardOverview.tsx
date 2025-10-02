/**
 * Dashboard Overview Module
 * Menampilkan project statistics, metrics, dan recent activities
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock, Users,
  FolderOpen, Calculator, Building2, FileText, Activity, Database,
  Zap, Target, PieChart, Calendar, Download, Upload, Eye, Settings, Plus
} from 'lucide-react';

interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
}

interface AnalysisMetrics {
  totalAnalyses: number;
  passedChecks: number;
  failedChecks: number;
  averageUtilization: number;
}

interface RecentActivity {
  id: string;
  type: 'analysis' | 'design' | 'report' | 'project';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'pending';
}

const DashboardOverview: React.FC = () => {
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    total: 24,
    active: 8,
    completed: 14,
    pending: 2
  });

  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetrics>({
    totalAnalyses: 156,
    passedChecks: 142,
    failedChecks: 14,
    averageUtilization: 0.73
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'analysis',
      title: 'Seismic Analysis - Tower Building',
      description: 'Static and dynamic analysis completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'success'
    },
    {
      id: '2',
      type: 'design',
      title: 'Steel Beam Design - Warehouse Project',
      description: 'Design check failed - utilization ratio exceeded',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'error'
    },
    {
      id: '3',
      type: 'report',
      title: 'Analysis Report Generated',
      description: 'PDF report exported for Office Complex project',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'success'
    },
    {
      id: '4',
      type: 'project',
      title: 'New Project Created',
      description: 'Residential Complex - Phase 1 project initialized',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'success'
    }
  ]);

  const [storageInfo, setStorageInfo] = useState({
    used: 87,
    total: 512,
    percentage: 17
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'analysis': return <Calculator className="w-4 h-4 text-blue-500" />;
      case 'design': return <Building2 className="w-4 h-4 text-green-500" />;
      case 'report': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'project': return <FolderOpen className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Monitor proyek aktif, statistics, dan recent activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2 inline" />
            New Project
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{projectStats.total}</p>
              <p className="text-green-600 text-sm mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +12% dari bulan lalu
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Analyses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Analyses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{analysisMetrics.totalAnalyses}</p>
              <p className="text-blue-600 text-sm mt-1">
                <Activity className="w-3 h-3 inline mr-1" />
                {analysisMetrics.passedChecks} passed checks
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Design Compliance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">SNI Compliance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round((analysisMetrics.passedChecks / analysisMetrics.totalAnalyses) * 100)}%
              </p>
              <p className="text-green-600 text-sm mt-1">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Standards compliant
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Average Utilization */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Utilization</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(analysisMetrics.averageUtilization * 100)}%
              </p>
              <p className="text-orange-600 text-sm mt-1">
                <Zap className="w-3 h-3 inline mr-1" />
                Material efficiency
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      {getStatusIcon(activity.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="space-y-6">
          {/* Project Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{projectStats.completed}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Active</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{projectStats.active}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Pending</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{projectStats.pending}</span>
              </div>
            </div>

            {/* Progress visualization */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${(projectStats.completed / projectStats.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((projectStats.completed / projectStats.total) * 100)}% projects completed
              </p>
            </div>
          </div>

          {/* Storage Monitor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Storage Capacity</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Used Space</span>
                <span className="text-sm font-medium text-gray-900">
                  {storageInfo.used} / {storageInfo.total} GB
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    storageInfo.percentage > 80 ? 'bg-red-500' : 
                    storageInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${storageInfo.percentage}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-gray-600">Projects</p>
                    <p className="font-medium">45 GB</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-gray-600">Reports</p>
                    <p className="font-medium">25 GB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">Run Analysis</span>
                </div>
                <span className="text-xs text-gray-500">Ctrl+R</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">Generate Report</span>
                </div>
                <span className="text-xs text-gray-500">Ctrl+G</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">3D Viewer</span>
                </div>
                <span className="text-xs text-gray-500">Ctrl+3</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;