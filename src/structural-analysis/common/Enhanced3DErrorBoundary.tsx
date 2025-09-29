import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Info } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

// Enhanced error boundary specifically for 3D viewer components
export class Enhanced3DErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `3d-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const enhancedError = this.enhanceError(error);
    
    // Log detailed error information
    console.group(`🔴 3D Viewer Error [${this.state.errorId}]`);
    console.error('Original Error:', error);
    console.error('Enhanced Error:', enhancedError);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Stack:', error.stack);
    console.groupEnd();

    this.setState({
      error: enhancedError,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(enhancedError, errorInfo);
    }

    // Report to error tracking service (if available)
    this.reportError(enhancedError, errorInfo);
  }

  private enhanceError(error: Error): Error {
    const enhanced = new Error(error.message);
    enhanced.name = `Enhanced3DError: ${error.name}`;
    enhanced.stack = error.stack;

    // Add context-specific information
    const context = this.gatherErrorContext();
    enhanced.message = `${error.message}\n\nContext: ${JSON.stringify(context, null, 2)}`;

    return enhanced;
  }

  private gatherErrorContext() {
    return {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      webGLSupport: this.checkWebGLSupport(),
      memoryInfo: this.getMemoryInfo(),
      performanceInfo: this.getPerformanceInfo(),
      retryCount: this.retryCount,
      errorId: this.state.errorId
    };
  }

  private checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return { supported: false, reason: 'WebGL context not available' };

      return {
        supported: true,
        version: gl.getParameter(gl.VERSION),
        renderer: gl.getParameter(gl.RENDERER),
        vendor: gl.getParameter(gl.VENDOR),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)
      };
    } catch (e) {
      return { supported: false, reason: e instanceof Error ? e.message : 'Unknown error' };
    }
  }

  private getMemoryInfo() {
    try {
      // @ts-ignore - performance.memory is not in all browsers
      const memory = (performance as any).memory;
      if (memory) {
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
    } catch (e) {
      // Memory info not available
    }
    return { available: false };
  }

  private getPerformanceInfo() {
    try {
      return {
        timing: {
          navigationStart: performance.timing?.navigationStart,
          loadEventEnd: performance.timing?.loadEventEnd,
          domContentLoadedEventEnd: performance.timing?.domContentLoadedEventEnd
        },
        now: performance.now(),
        timeOrigin: performance.timeOrigin
      };
    } catch (e) {
      return { available: false };
    }
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // This would integrate with error reporting services like Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      context: this.gatherErrorContext(),
      timestamp: Date.now()
    };

    // For now, we'll just log to console
    // In production, you'd send this to your error tracking service
    console.warn('Error report prepared:', errorReport);
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`🔄 Retrying 3D viewer (attempt ${this.retryCount}/${this.maxRetries})`);
      
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });
    } else {
      console.error('🚫 Maximum retry attempts reached');
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private renderErrorDetails() {
    const { error, errorInfo } = this.state;
    if (!error) return null;

    return (
      <details className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          <Info className="inline w-4 h-4 mr-1" />
          Technical Details
        </summary>
        <div className="mt-2 text-xs text-gray-600 space-y-2">
          <div>
            <strong>Error:</strong> {error.message}
          </div>
          <div>
            <strong>Error ID:</strong> {this.state.errorId}
          </div>
          <div>
            <strong>Component Stack:</strong>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
              {errorInfo?.componentStack}
            </pre>
          </div>
          {error.stack && (
            <div>
              <strong>Stack Trace:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {error.stack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              3D Viewer Error
            </h3>
            <p className="text-red-600 mb-4">
              The 3D visualization encountered an error and cannot be displayed.
            </p>
            
            <div className="space-y-2">
              <p className="text-sm text-red-500">
                This could be due to:
              </p>
              <ul className="text-xs text-red-500 text-left list-disc list-inside space-y-1">
                <li>Invalid structural data</li>
                <li>WebGL compatibility issues</li>
                <li>Memory constraints</li>
                <li>Browser graphics limitations</li>
              </ul>
            </div>

            <div className="flex gap-2 justify-center mt-6">
              {this.retryCount < this.maxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry ({this.maxRetries - this.retryCount} left)
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </button>
            </div>

            {this.renderErrorDetails()}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Enhanced3DErrorBoundary;