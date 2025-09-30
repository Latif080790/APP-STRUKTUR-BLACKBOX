/**
 * Performance Analytics Dashboard
 * Advanced analytics for structural performance monitoring
 * Real-time metrics, predictive analytics, and optimization insights
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Gauge, Shield, Zap, Activity, Clock, Target, AlertTriangle, BarChart3, PieChart, LineChart } from 'lucide-react';

interface PerformanceMetrics {
  structuralHealth: number;
  loadCapacity: number;
  safetyFactor: number;
  materialUtilization: number;
  efficiency: number;
  sustainability: number;
}

interface RealTimeData {
  timestamp: Date;
  stress: number;
  displacement: number;
  acceleration: number;
  temperature: number;
  humidity: number;
}

interface PredictiveInsight {
  category: 'performance' | 'maintenance' | 'safety' | 'cost';
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high';
  recommendation: string;
}

export const PerformanceAnalyticsDashboard: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    structuralHealth: 95,
    loadCapacity: 87,
    safetyFactor: 2.1,
    materialUtilization: 78,
    efficiency: 92,
    sustainability: 85
  });

  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([
    {
      category: 'performance',
      prediction: 'Struktur akan mencapai kapasitas optimal dalam 30 hari',
      confidence: 89,
      timeframe: '30 hari',
      impact: 'medium',
      recommendation: 'Monitor beban kerja dan lakukan penyesuaian distribusi beban'
    },
    {
      category: 'maintenance',
      prediction: 'Pemeliharaan preventif diperlukan pada joint connection',
      confidence: 76,
      timeframe: '45 hari',
      impact: 'low',
      recommendation: 'Jadwalkan inspeksi detail dan pelumasan connection'
    },
    {
      category: 'safety',
      prediction: 'Margin keamanan akan menurun 5% dalam kondisi seismik tinggi',
      confidence: 92,
      timeframe: '60 hari',
      impact: 'high',
      recommendation: 'Evaluasi sistem peredam getaran dan penguatan struktur'
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: RealTimeData = {
        timestamp: new Date(),
        stress: 15 + Math.random() * 10,
        displacement: 2.1 + Math.random() * 0.5,
        acceleration: 0.05 + Math.random() * 0.02,
        temperature: 22 + Math.random() * 4,
        humidity: 45 + Math.random() * 10
      };

      setRealTimeData(prev => {
        const updated = [...prev, newData];
        return updated.slice(-50); // Keep last 50 data points
      });

      // Simulate metric fluctuations
      setMetrics(prev => ({
        structuralHealth: Math.max(85, Math.min(100, prev.structuralHealth + (Math.random() - 0.5) * 2)),
        loadCapacity: Math.max(75, Math.min(95, prev.loadCapacity + (Math.random() - 0.5) * 3)),
        safetyFactor: Math.max(1.8, Math.min(2.5, prev.safetyFactor + (Math.random() - 0.5) * 0.1)),
        materialUtilization: Math.max(70, Math.min(90, prev.materialUtilization + (Math.random() - 0.5) * 2)),
        efficiency: Math.max(85, Math.min(98, prev.efficiency + (Math.random() - 0.5) * 1.5)),
        sustainability: Math.max(80, Math.min(95, prev.sustainability + (Math.random() - 0.5) * 1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    trend: 'up' | 'down' | 'stable';
  }> = ({ title, value, unit, icon, color, trend }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-blue-400'
        }`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-white">{value.toFixed(1)}</span>
        <span className="text-blue-200 ml-2">{unit}</span>
      </div>
    </div>
  );

  const InsightCard: React.FC<{ insight: PredictiveInsight }> = ({ insight }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${
          insight.category === 'performance' ? 'bg-blue-500/20' :
          insight.category === 'maintenance' ? 'bg-yellow-500/20' :
          insight.category === 'safety' ? 'bg-red-500/20' : 'bg-green-500/20'
        }`}>
          {insight.category === 'performance' && <BarChart3 className="w-4 h-4 text-blue-300" />}
          {insight.category === 'maintenance' && <Clock className="w-4 h-4 text-yellow-300" />}
          {insight.category === 'safety' && <Shield className="w-4 h-4 text-red-300" />}
          {insight.category === 'cost' && <Target className="w-4 h-4 text-green-300" />}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          insight.impact === 'high' ? 'bg-red-500/20 text-red-300' :
          insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
          'bg-green-500/20 text-green-300'
        }`}>
          {insight.impact} impact
        </span>
      </div>
      <p className="text-white text-sm mb-2">{insight.prediction}</p>
      <p className="text-blue-200 text-xs mb-3">{insight.recommendation}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-blue-300">Confidence: {insight.confidence}%</span>
        <span className="text-blue-300">{insight.timeframe}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
              <p className="text-blue-200">Real-time structural performance monitoring & predictive insights</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('smart-integration')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Smart Integration
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Structural Health"
            value={metrics.structuralHealth}
            unit="%"
            icon={<Shield className="w-6 h-6 text-green-300" />}
            color="bg-green-500/20"
            trend="stable"
          />
          <MetricCard
            title="Load Capacity"
            value={metrics.loadCapacity}
            unit="%"
            icon={<Gauge className="w-6 h-6 text-blue-300" />}
            color="bg-blue-500/20"
            trend="up"
          />
          <MetricCard
            title="Safety Factor"
            value={metrics.safetyFactor}
            unit=""
            icon={<AlertTriangle className="w-6 h-6 text-yellow-300" />}
            color="bg-yellow-500/20"
            trend="stable"
          />
          <MetricCard
            title="Material Utilization"
            value={metrics.materialUtilization}
            unit="%"
            icon={<Target className="w-6 h-6 text-purple-300" />}
            color="bg-purple-500/20"
            trend="up"
          />
          <MetricCard
            title="Efficiency"
            value={metrics.efficiency}
            unit="%"
            icon={<Zap className="w-6 h-6 text-orange-300" />}
            color="bg-orange-500/20"
            trend="up"
          />
          <MetricCard
            title="Sustainability"
            value={metrics.sustainability}
            unit="%"
            icon={<Activity className="w-6 h-6 text-green-300" />}
            color="bg-green-500/20"
            trend="stable"
          />
        </div>

        {/* Real-time Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Real-time Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <LineChart className="w-5 h-5 mr-2" />
              Real-time Monitoring
            </h2>
            
            <div className="h-64 bg-white/5 rounded-xl p-4 flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <p className="text-blue-200">Live monitoring active</p>
                <p className="text-blue-300 text-sm mt-2">
                  {realTimeData.length} data points collected
                </p>
              </div>
            </div>
            
            {/* Current readings */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-blue-200 text-sm">Stress</p>
                <p className="text-white font-semibold">
                  {realTimeData.length > 0 ? realTimeData[realTimeData.length - 1].stress.toFixed(2) : '0.00'} MPa
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-blue-200 text-sm">Displacement</p>
                <p className="text-white font-semibold">
                  {realTimeData.length > 0 ? realTimeData[realTimeData.length - 1].displacement.toFixed(2) : '0.00'} mm
                </p>
              </div>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Performance Distribution
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Optimal Range</span>
                <div className="flex items-center">
                  <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-white font-medium">85%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Warning Range</span>
                <div className="flex items-center">
                  <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <span className="text-white font-medium">12%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Critical Range</span>
                <div className="flex items-center">
                  <div className="w-32 bg-white/10 rounded-full h-2 mr-3">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '3%' }}></div>
                  </div>
                  <span className="text-white font-medium">3%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-green-300 font-medium mb-1">System Status: Optimal</p>
              <p className="text-green-200 text-sm">All parameters within safe operating limits</p>
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Predictive Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Monitoring Active</p>
                <p className="text-blue-200 text-sm">Real-time data collection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">AI Analysis</p>
                <p className="text-blue-200 text-sm">Predictive modeling active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Alerts</p>
                <p className="text-blue-200 text-sm">2 recommendations pending</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">Optimization</p>
                <p className="text-blue-200 text-sm">Continuous improvement</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PerformanceAnalyticsDashboard;