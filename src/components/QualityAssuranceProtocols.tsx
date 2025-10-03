/**
 * Quality Assurance Protocols - Advanced Material Testing Support
 * Real-time quality control and compliance monitoring
 * Following user preferences: English UI, prominent features
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, CheckCircle, AlertTriangle, Clock, Target,
  FileCheck, Settings, TrendingUp, BarChart3, Zap,
  AlertCircle, CheckSquare, XCircle, Activity
} from 'lucide-react';

interface QualityMetrics {
  complianceRate: number;
  averageStrength: number;
  variationCoefficient: number;
  testingEfficiency: number;
  certificationRate: number;
  timeToCompletion: number;
}

interface QualityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  testId?: string;
  acknowledged: boolean;
}

interface ComplianceCheck {
  standard: string;
  requirement: string;
  status: 'pass' | 'fail' | 'pending';
  value: number;
  limit: number;
  severity: 'low' | 'medium' | 'high';
}

const QualityAssuranceProtocols: React.FC = () => {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    complianceRate: 94.2,
    averageStrength: 28.5,
    variationCoefficient: 0.12,
    testingEfficiency: 87.3,
    certificationRate: 91.8,
    timeToCompletion: 72 // hours
  });

  const [qualityAlerts, setQualityAlerts] = useState<QualityAlert[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);

  // Real-time monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate quality metrics updates
      setQualityMetrics(prev => ({
        ...prev,
        complianceRate: Math.max(85, Math.min(100, prev.complianceRate + (Math.random() - 0.5) * 2)),
        averageStrength: Math.max(20, Math.min(35, prev.averageStrength + (Math.random() - 0.5) * 0.5)),
        variationCoefficient: Math.max(0.05, Math.min(0.20, prev.variationCoefficient + (Math.random() - 0.5) * 0.02)),
        testingEfficiency: Math.max(70, Math.min(100, prev.testingEfficiency + (Math.random() - 0.5) * 3))
      }));

      // Simulate occasional quality alerts
      if (Math.random() < 0.1) { // 10% chance per update
        const alertTypes = ['critical', 'warning', 'info'] as const;
        const messages = [
          'Variation coefficient exceeds 15% limit',
          'New batch requires strength verification',
          'Calibration reminder: Testing equipment due for calibration',
          'Quality control inspection completed successfully',
          'Temperature monitoring: Curing environment optimal'
        ];

        const newAlert: QualityAlert = {
          id: `alert_${Date.now()}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          acknowledged: false
        };

        setQualityAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initialize compliance checks
  useEffect(() => {
    const checks: ComplianceCheck[] = [
      {
        standard: 'SNI 2847:2019',
        requirement: 'Minimum compressive strength',
        status: 'pass',
        value: 28.5,
        limit: 25.0,
        severity: 'high'
      },
      {
        standard: 'SNI 1974:2011',
        requirement: 'Coefficient of variation',
        status: qualityMetrics.variationCoefficient <= 0.15 ? 'pass' : 'fail',
        value: qualityMetrics.variationCoefficient,
        limit: 0.15,
        severity: 'medium'
      },
      {
        standard: 'SNI 2847:2019',
        requirement: 'Individual test strength',
        status: 'pass',
        value: 0.92,
        limit: 0.85,
        severity: 'high'
      },
      {
        standard: 'Laboratory QC',
        requirement: 'Testing frequency compliance',
        status: 'pass',
        value: 98.5,
        limit: 95.0,
        severity: 'low'
      }
    ];

    setComplianceChecks(checks);
  }, [qualityMetrics.variationCoefficient]);

  const acknowledgeAlert = (alertId: string) => {
    setQualityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const getMetricColor = (value: number, min: number, max: number) => {
    const normalized = (value - min) / (max - min);
    if (normalized >= 0.8) return 'text-green-400';
    if (normalized >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMetricBgColor = (value: number, min: number, max: number) => {
    const normalized = (value - min) / (max - min);
    if (normalized >= 0.8) return 'from-green-600/10 to-green-800/10 border-green-400/20';
    if (normalized >= 0.6) return 'from-yellow-600/10 to-yellow-800/10 border-yellow-400/20';
    return 'from-red-600/10 to-red-800/10 border-red-400/20';
  };

  return (
    <div className="space-y-6">
      {/* Quality Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`bg-gradient-to-r ${getMetricBgColor(qualityMetrics.complianceRate, 80, 100)} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <Shield className={`w-6 h-6 ${getMetricColor(qualityMetrics.complianceRate, 80, 100)}`} />
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="text-white/80 text-sm mb-1">Compliance Rate</div>
          <div className={`text-2xl font-bold ${getMetricColor(qualityMetrics.complianceRate, 80, 100)}`}>
            {qualityMetrics.complianceRate.toFixed(1)}%
          </div>
          <div className="text-white/60 text-xs mt-1">
            Target: ≥95% | SNI Standards
          </div>
        </div>

        <div className={`bg-gradient-to-r ${getMetricBgColor(qualityMetrics.averageStrength, 20, 35)} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <Target className={`w-6 h-6 ${getMetricColor(qualityMetrics.averageStrength, 20, 35)}`} />
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Live</span>
          </div>
          <div className="text-white/80 text-sm mb-1">Average Strength</div>
          <div className={`text-2xl font-bold ${getMetricColor(qualityMetrics.averageStrength, 20, 35)}`}>
            {qualityMetrics.averageStrength.toFixed(1)} MPa
          </div>
          <div className="text-white/60 text-xs mt-1">
            Target: ≥25 MPa | K-300 Grade
          </div>
        </div>

        <div className={`bg-gradient-to-r ${getMetricBgColor(1 - qualityMetrics.variationCoefficient, 0.8, 0.95)} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className={`w-6 h-6 ${getMetricColor(1 - qualityMetrics.variationCoefficient, 0.8, 0.95)}`} />
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Active</span>
          </div>
          <div className="text-white/80 text-sm mb-1">Variation Coefficient</div>
          <div className={`text-2xl font-bold ${getMetricColor(1 - qualityMetrics.variationCoefficient, 0.8, 0.95)}`}>
            {(qualityMetrics.variationCoefficient * 100).toFixed(1)}%
          </div>
          <div className="text-white/60 text-xs mt-1">
            Limit: ≤15% | SNI 1974:2011
          </div>
        </div>

        <div className={`bg-gradient-to-r ${getMetricBgColor(qualityMetrics.testingEfficiency, 70, 100)} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className={`w-6 h-6 ${getMetricColor(qualityMetrics.testingEfficiency, 70, 100)}`} />
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Monitor</span>
          </div>
          <div className="text-white/80 text-sm mb-1">Testing Efficiency</div>
          <div className={`text-2xl font-bold ${getMetricColor(qualityMetrics.testingEfficiency, 70, 100)}`}>
            {qualityMetrics.testingEfficiency.toFixed(1)}%
          </div>
          <div className="text-white/60 text-xs mt-1">
            Target: ≥85% | Lab Performance
          </div>
        </div>

        <div className={`bg-gradient-to-r ${getMetricBgColor(qualityMetrics.certificationRate, 80, 100)} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className={`w-6 h-6 ${getMetricColor(qualityMetrics.certificationRate, 80, 100)}`} />
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Updated</span>
          </div>
          <div className="text-white/80 text-sm mb-1">Certification Rate</div>
          <div className={`text-2xl font-bold ${getMetricColor(qualityMetrics.certificationRate, 80, 100)}`}>
            {qualityMetrics.certificationRate.toFixed(1)}%
          </div>
          <div className="text-white/60 text-xs mt-1">
            Target: ≥90% | BSN Certified
          </div>
        </div>

        <div className={`bg-gradient-to-r ${getMetricBgColor(120 - qualityMetrics.timeToCompletion, 48, 120)} border rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <Clock className={`w-6 h-6 ${getMetricColor(120 - qualityMetrics.timeToCompletion, 48, 120)}`} />
            <span className="text-xs bg-white/10 px-2 py-1 rounded">Time</span>
          </div>
          <div className="text-white/80 text-sm mb-1">Completion Time</div>
          <div className={`text-2xl font-bold ${getMetricColor(120 - qualityMetrics.timeToCompletion, 48, 120)}`}>
            {qualityMetrics.timeToCompletion}h
          </div>
          <div className="text-white/60 text-xs mt-1">
            Target: ≤72h | Standard Process
          </div>
        </div>
      </div>

      {/* Quality Alerts */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white/90 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-yellow-400" />
            Quality Alerts & Notifications
          </h3>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-green-400 text-sm">Live Monitoring</span>
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {qualityAlerts.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active quality alerts. System operating within normal parameters.</p>
            </div>
          ) : (
            qualityAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.acknowledged ? 'opacity-60' : ''
                } ${
                  alert.type === 'critical' ? 'bg-red-600/10 border-red-400' :
                  alert.type === 'warning' ? 'bg-yellow-600/10 border-yellow-400' :
                  'bg-blue-600/10 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    {alert.type === 'critical' && <XCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                    {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                    {alert.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />}
                    <div>
                      <div className={`font-medium ${
                        alert.type === 'critical' ? 'text-red-300' :
                        alert.type === 'warning' ? 'text-yellow-300' :
                        'text-blue-300'
                      }`}>
                        {alert.message}
                      </div>
                      <div className="text-white/60 text-sm">
                        {alert.timestamp.toLocaleString()}
                        {alert.testId && ` | Test ID: ${alert.testId}`}
                      </div>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/80 text-sm transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Compliance Checks */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
          <FileCheck className="w-6 h-6 mr-2 text-green-400" />
          Real-time Compliance Monitoring
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceChecks.map((check, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                check.status === 'pass' ? 'bg-green-600/10 border-green-400/20' :
                check.status === 'fail' ? 'bg-red-600/10 border-red-400/20' :
                'bg-yellow-600/10 border-yellow-400/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-white/90 font-medium">{check.requirement}</div>
                  <div className="text-white/60 text-sm">{check.standard}</div>
                </div>
                <div className={`p-1 rounded ${
                  check.status === 'pass' ? 'bg-green-600/20' :
                  check.status === 'fail' ? 'bg-red-600/20' :
                  'bg-yellow-600/20'
                }`}>
                  {check.status === 'pass' && <CheckSquare className="w-4 h-4 text-green-400" />}
                  {check.status === 'fail' && <XCircle className="w-4 h-4 text-red-400" />}
                  {check.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">
                  Value: {typeof check.value === 'number' && check.value < 1 ? 
                    (check.value * 100).toFixed(1) + '%' : 
                    check.value.toFixed(2) + (check.requirement.includes('strength') ? ' MPa' : '')
                  }
                </span>
                <span className="text-white/70 text-sm">
                  Limit: {typeof check.limit === 'number' && check.limit < 1 ? 
                    (check.limit * 100).toFixed(1) + '%' : 
                    check.limit.toFixed(2) + (check.requirement.includes('strength') ? ' MPa' : '')
                  }
                </span>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      check.status === 'pass' ? 'bg-green-400' :
                      check.status === 'fail' ? 'bg-red-400' :
                      'bg-yellow-400'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (check.value / check.limit) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Protocol Settings */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-purple-400" />
          Quality Protocol Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">Alert Thresholds</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Strength Variation:</span>
                <span className="text-yellow-400 text-sm">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Compliance Rate:</span>
                <span className="text-yellow-400 text-sm">90%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Test Frequency:</span>
                <span className="text-yellow-400 text-sm">Daily</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">Monitoring Settings</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Real-time Updates:</span>
                <span className="text-green-400 text-sm">Enabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Auto Alerts:</span>
                <span className="text-green-400 text-sm">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Data Retention:</span>
                <span className="text-green-400 text-sm">10 Years</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-white/80 font-medium">Certification Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">BSN Accredited:</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">ISO 17025:</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">SNI Compliant:</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssuranceProtocols;