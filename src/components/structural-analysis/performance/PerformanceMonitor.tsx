/**
 * Performance Monitor Component
 * Monitors and displays application performance metrics
 */

import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { 
  Activity, 
  Zap, 
  Clock, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Cpu,
  HardDrive
} from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  analysisTime: number;
  cacheHitRate: number;
  componentCount: number;
  slowRenders: number;
  errorCount: number;
}

interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = memo(({
  className = '',
  showDetails = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    analysisTime: 0,
    cacheHitRate: 95,
    componentCount: 0,
    slowRenders: 0,
    errorCount: 0
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceEntries, setPerformanceEntries] = useState<PerformanceEntry[]>([]);

  // Collect performance metrics
  const collectMetrics = useCallback(() => {
    try {
      // Get navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Get memory usage (if available)
      const memInfo = (performance as any).memory;
      
      // Get resource timing
      const resources = performance.getEntriesByType('resource');
      
      // Calculate bundle size from resources
      const bundleSize = resources
        .filter(r => r.name.includes('.js') || r.name.includes('.css'))
        .reduce((total, r) => total + (r as PerformanceResourceTiming).transferSize || 0, 0);

      // Get render timing entries
      const paintEntries = performance.getEntriesByType('paint');
      const renderTime = paintEntries.length > 0 
        ? paintEntries[paintEntries.length - 1].startTime 
        : 0;

      // Count React components (approximate)
      const componentCount = document.querySelectorAll('[data-reactroot], [data-react-]').length;

      const newMetrics: PerformanceMetrics = {
        renderTime: Math.round(renderTime),
        bundleSize: Math.round(bundleSize / 1024), // KB
        memoryUsage: memInfo ? Math.round(memInfo.usedJSHeapSize / 1024 / 1024) : 0, // MB
        analysisTime: metrics.analysisTime, // Preserve existing value
        cacheHitRate: metrics.cacheHitRate, // Preserve existing value
        componentCount,
        slowRenders: metrics.slowRenders, // Preserve existing value
        errorCount: metrics.errorCount // Preserve existing value
      };

      setMetrics(newMetrics);

      // Store performance entries for detailed analysis
      const allEntries = performance.getEntries();
      setPerformanceEntries(allEntries.slice(-100)); // Keep last 100 entries

    } catch (error) {
      console.warn('Performance monitoring error:', error);
    }
  }, [metrics.analysisTime, metrics.cacheHitRate, metrics.slowRenders, metrics.errorCount]);

  // Start/stop monitoring
  const toggleMonitoring = useCallback(() => {
    if (isMonitoring) {
      setIsMonitoring(false);
    } else {
      setIsMonitoring(true);
      collectMetrics();
    }
  }, [isMonitoring, collectMetrics]);

  // Monitor interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isMonitoring) {
      interval = setInterval(collectMetrics, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring, collectMetrics]);

  // Performance score calculation
  const calculatePerformanceScore = useCallback(() => {
    let score = 100;
    
    // Deduct points for slow renders
    if (metrics.renderTime > 100) score -= 20;
    else if (metrics.renderTime > 50) score -= 10;
    
    // Deduct points for large bundle
    if (metrics.bundleSize > 2000) score -= 15; // >2MB
    else if (metrics.bundleSize > 1000) score -= 8; // >1MB
    
    // Deduct points for high memory usage
    if (metrics.memoryUsage > 100) score -= 15; // >100MB
    else if (metrics.memoryUsage > 50) score -= 8; // >50MB
    
    // Deduct points for slow analysis
    if (metrics.analysisTime > 5000) score -= 10; // >5s
    else if (metrics.analysisTime > 2000) score -= 5; // >2s
    
    // Deduct points for errors
    score -= metrics.errorCount * 5;
    
    return Math.max(0, Math.min(100, score));
  }, [metrics]);

  const performanceScore = calculatePerformanceScore();

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <Activity className="h-4 w-4 mr-2" />
            Performance Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={getScoreVariant(performanceScore)}
              className={getScoreColor(performanceScore)}
            >
              Score: {performanceScore}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMonitoring}
            >
              {isMonitoring ? (
                <>
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  Stop
                </>
              ) : (
                <>
                  <Activity className="h-3 w-3 mr-1" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Performance Score */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(performanceScore)}`}>
            {performanceScore}
          </div>
          <div className="text-sm text-gray-500">Performance Score</div>
          <Progress value={performanceScore} className="mt-2" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-semibold">{metrics.renderTime}ms</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Render Time</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <HardDrive className="h-4 w-4 text-green-600" />
              <span className="text-lg font-semibold">{metrics.bundleSize}KB</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Bundle Size</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <Cpu className="h-4 w-4 text-purple-600" />
              <span className="text-lg font-semibold">{metrics.memoryUsage}MB</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Memory Usage</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <span className="text-lg font-semibold">{metrics.componentCount}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Components</div>
          </div>
        </div>

        {/* Detailed metrics */}
        {showDetails && (
          <div className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Detailed Metrics</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Analysis Time:</span>
                  <span className="font-medium">{metrics.analysisTime}ms</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Hit Rate:</span>
                  <span className="font-medium">{metrics.cacheHitRate}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Slow Renders:</span>
                  <span className={`font-medium ${metrics.slowRenders > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {metrics.slowRenders}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Count:</span>
                  <span className={`font-medium ${metrics.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {metrics.errorCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance suggestions */}
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Optimization Suggestions</h4>
              <div className="space-y-1 text-xs text-gray-600">
                {metrics.bundleSize > 1000 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Consider code splitting to reduce bundle size</span>
                  </div>
                )}
                
                {metrics.renderTime > 50 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Optimize render performance with React.memo</span>
                  </div>
                )}
                
                {metrics.memoryUsage > 50 && (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>High memory usage - check for memory leaks</span>
                  </div>
                )}
                
                {performanceScore >= 90 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Excellent performance! All metrics look good.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-xs text-gray-500 text-center">
          {isMonitoring ? (
            <span className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Monitoring active
            </span>
          ) : (
            <span>Monitoring stopped</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

PerformanceMonitor.displayName = 'PerformanceMonitor';

export default PerformanceMonitor;