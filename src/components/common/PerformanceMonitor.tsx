/**
 * Performance Monitor Component
 * Monitors and displays application performance metrics
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Monitor, 
  Cpu, 
  MemoryStick, 
  Zap, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  renderCount: number;
  lastUpdate: number;
  fps: number;
  bundle: {
    totalSize: number;
    jsSize: number;
    cssSize: number;
    chunksLoaded: number;
    totalChunks: number;
  };
}

interface PerformanceMonitorProps {
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className = ''
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    renderCount: 0,
    lastUpdate: Date.now(),
    fps: 60,
    bundle: {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunksLoaded: 0,
      totalChunks: 0
    }
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Performance measurement hooks
  const measureRenderTime = useCallback(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      return end - start;
    };
  }, []);

  // Memory usage estimation
  const estimateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }, []);

  // Bundle size estimation
  const estimateBundleSize = useCallback(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;

    // Estimate script sizes (rough calculation)
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('assets')) {
        jsSize += 100; // Rough estimate in KB
      }
    });

    // Estimate CSS sizes
    styles.forEach(style => {
      cssSize += 50; // Rough estimate in KB
    });

    totalSize = jsSize + cssSize;

    return {
      totalSize,
      jsSize,
      cssSize,
      chunksLoaded: scripts.length + styles.length,
      totalChunks: scripts.length + styles.length
    };
  }, []);

  // FPS calculation
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const calculateFPS = useCallback(() => {
    let frames = 0;
    let lastTime = performance.now();

    const frame = () => {
      const now = performance.now();
      frames++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        setFpsHistory(prev => [...prev.slice(-9), fps]); // Keep last 10 values
        frames = 0;
        lastTime = now;
      }

      if (isMonitoring) {
        requestAnimationFrame(frame);
      }
    };

    if (isMonitoring) {
      requestAnimationFrame(frame);
    }
  }, [isMonitoring]);

  // Component counting
  const countComponents = useCallback(() => {
    // Count React components in the DOM (rough estimate)
    const reactElements = document.querySelectorAll('[data-reactroot] *').length;
    return Math.max(reactElements, 50); // Minimum estimate
  }, []);

  // Update metrics
  const updateMetrics = useCallback(() => {
    const endRender = measureRenderTime();
    const memory = estimateMemoryUsage();
    const bundle = estimateBundleSize();
    const componentCount = countComponents();
    const avgFps = fpsHistory.length > 0 ? 
      Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length) : 60;

    setMetrics(prev => ({
      renderTime: endRender(),
      memoryUsage: memory.used,
      componentCount,
      renderCount: prev.renderCount + 1,
      lastUpdate: Date.now(),
      fps: avgFps,
      bundle
    }));
  }, [measureRenderTime, estimateMemoryUsage, estimateBundleSize, countComponents, fpsHistory]);

  // Start/stop monitoring
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(updateMetrics, 1000);
      calculateFPS();
      return () => clearInterval(interval);
    }
  }, [isMonitoring, updateMetrics, calculateFPS]);

  // Performance status
  const getPerformanceStatus = () => {
    if (metrics.fps < 30) return { status: 'poor', color: 'red', icon: AlertTriangle };
    if (metrics.fps < 45) return { status: 'fair', color: 'yellow', icon: Clock };
    return { status: 'good', color: 'green', icon: CheckCircle };
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Performance Monitor
            </CardTitle>
            <Button
              variant={isMonitoring ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              {isMonitoring ? "Stop" : "Start"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <performanceStatus.icon 
                className={`h-5 w-5 mr-2 text-${performanceStatus.color}-500`}
              />
              <span className="font-medium">Performance Status</span>
            </div>
            <Badge 
              variant={performanceStatus.status === 'good' ? 'default' : 'destructive'}
              className={performanceStatus.status === 'fair' ? 'bg-yellow-500' : ''}
            >
              {performanceStatus.status.toUpperCase()}
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {/* FPS */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm font-medium">FPS</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.fps}
              </div>
              <Progress value={Math.min(metrics.fps / 60 * 100, 100)} className="h-2" />
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center">
                <MemoryStick className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-sm font-medium">Memory</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.memoryUsage} MB
              </div>
              <Progress value={Math.min(metrics.memoryUsage / 100 * 100, 100)} className="h-2" />
            </div>

            {/* Render Time */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-500" />
                <span className="text-sm font-medium">Render Time</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.renderTime.toFixed(1)} ms
              </div>
            </div>

            {/* Component Count */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Cpu className="h-4 w-4 mr-2 text-orange-500" />
                <span className="text-sm font-medium">Components</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {metrics.componentCount}
              </div>
            </div>
          </div>

          {/* Bundle Information */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Bundle Analysis</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-medium text-blue-700">JavaScript</div>
                <div className="text-blue-600">{metrics.bundle.jsSize} KB</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-medium text-green-700">CSS</div>
                <div className="text-green-600">{metrics.bundle.cssSize} KB</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="font-medium text-purple-700">Total</div>
                <div className="text-purple-600">{metrics.bundle.totalSize} KB</div>
              </div>
            </div>
          </div>

          {/* Performance Tips */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-yellow-800 mb-2">Performance Tips</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Keep FPS above 30 for smooth interactions</li>
              <li>• Monitor memory usage during long sessions</li>
              <li>• Consider using React.memo for expensive components</li>
              <li>• Use lazy loading for large components</li>
            </ul>
          </div>

          {/* Render Stats */}
          {isMonitoring && (
            <div className="text-xs text-gray-500 text-center">
              Renders: {metrics.renderCount} | 
              Last Update: {new Date(metrics.lastUpdate).toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;