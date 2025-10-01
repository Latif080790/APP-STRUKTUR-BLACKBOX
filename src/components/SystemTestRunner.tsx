/**
 * Test Runner Interface
 * Interface untuk menjalankan dan menampilkan hasil integration testing
 */

import React, { useState, useEffect } from 'react';
import SystemIntegrationTest from '../tests/SystemIntegrationTest';

interface TestResult {
  success: boolean;
  results: any;
  errors: string[];
  recommendations: string[];
  timestamp: Date;
  duration: number;
}

export const SystemTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);

  const runIntegrationTest = async () => {
    setIsRunning(true);
    const startTime = Date.now();

    try {
      const tester = new SystemIntegrationTest();
      const result = await tester.runComprehensiveTest();
      
      const testResult: TestResult = {
        ...result,
        timestamp: new Date(),
        duration: Date.now() - startTime
      };

      setTestResult(testResult);
      setTestHistory(prev => [testResult, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      const errorResult: TestResult = {
        success: false,
        results: {},
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['Sistem memerlukan debugging menyeluruh'],
        timestamp: new Date(),
        duration: Date.now() - startTime
      };
      
      setTestResult(errorResult);
      setTestHistory(prev => [errorResult, ...prev.slice(0, 4)]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (success: boolean) => {
    return success ? '✅' : '❌';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white/90 mb-2">System Integration Testing</h2>
        <p className="text-white/60">Testing comprehensive untuk memastikan semua modul terintegrasi dengan baik</p>
      </div>

      {/* Test Control Panel */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/90 font-semibold">Control Panel Testing</h3>
          <button
            onClick={runIntegrationTest}
            disabled={isRunning}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isRunning
                ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600/30 to-blue-800/30 hover:from-blue-600/50 hover:to-blue-800/50 text-white border border-blue-400/30'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Testing...</span>
              </span>
            ) : (
              '🚀 Run Comprehensive Test'
            )}
          </button>
        </div>

        {isRunning && (
          <div className="bg-blue-600/20 border border-blue-400/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-blue-300 font-medium">Menjalankan Integration Test...</p>
                <p className="text-blue-200 text-sm">Testing semua modul sistem secara comprehensive</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Test Results */}
      {testResult && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/90 font-semibold">Hasil Test Terbaru</h3>
            <div className="flex items-center space-x-3">
              <span className={`text-lg ${getStatusColor(testResult.success)}`}>
                {getStatusIcon(testResult.success)}
              </span>
              <span className={`font-medium ${getStatusColor(testResult.success)}`}>
                {testResult.success ? 'BERHASIL' : 'GAGAL'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Summary */}
            <div className="space-y-4">
              <h4 className="text-white/80 font-medium">Ringkasan Test</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Total Durasi</span>
                  <span className="text-blue-400 font-medium">{testResult.duration}ms</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Timestamp</span>
                  <span className="text-green-400 font-medium">
                    {testResult.timestamp.toLocaleTimeString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                  <span className="text-white/70">Total Errors</span>
                  <span className={`font-medium ${testResult.errors.length === 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {testResult.errors.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Module Results */}
            <div className="space-y-4">
              <h4 className="text-white/80 font-medium">Status Modul</h4>
              <div className="space-y-2">
                {Object.entries(testResult.results).map(([module, result]: [string, any]) => (
                  <div key={module} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70 capitalize">{module}</span>
                    <span className={`font-medium ${getStatusColor(result?.success || false)}`}>
                      {getStatusIcon(result?.success || false)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Errors */}
          {testResult.errors.length > 0 && (
            <div className="mt-6">
              <h4 className="text-red-400 font-medium mb-3">Errors Ditemukan</h4>
              <div className="space-y-2">
                {testResult.errors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-600/20 border border-red-400/20 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {testResult.recommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="text-blue-400 font-medium mb-3">Rekomendasi</h4>
              <div className="space-y-2">
                {testResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-blue-600/20 border border-blue-400/20 rounded-lg">
                    <p className="text-blue-300 text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-white/90 font-semibold mb-4">Riwayat Testing</h3>
          <div className="space-y-3">
            {testHistory.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className={`text-lg ${getStatusColor(test.success)}`}>
                    {getStatusIcon(test.success)}
                  </span>
                  <div>
                    <p className="text-white/80 text-sm">
                      {test.timestamp.toLocaleString('id-ID')}
                    </p>
                    <p className="text-white/60 text-xs">
                      {test.duration}ms • {test.errors.length} errors
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(test.success)}`}>
                  {test.success ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {testResult && testResult.results.analysis && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-white/90 font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-600/20 border border-green-400/20 rounded-lg">
              <div className="text-green-300 text-sm">Analysis Time</div>
              <div className="text-2xl font-bold text-white">
                {testResult.results.analysis?.details?.analysisTime?.toFixed(0) || 'N/A'}ms
              </div>
            </div>
            <div className="p-4 bg-blue-600/20 border border-blue-400/20 rounded-lg">
              <div className="text-blue-300 text-sm">Max Displacement</div>
              <div className="text-2xl font-bold text-white">
                {(testResult.results.analysis?.details?.maxDisplacement * 1000)?.toFixed(2) || 'N/A'}mm
              </div>
            </div>
            <div className="p-4 bg-purple-600/20 border border-purple-400/20 rounded-lg">
              <div className="text-purple-300 text-sm">Structural Validity</div>
              <div className="text-2xl font-bold text-white">
                {testResult.results.analysis?.details?.isStructurallyValid ? 'VALID' : 'INVALID'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemTestRunner;