/**
 * Error Boundary Component untuk Menangani Error secara Graceful
 * Menggunakan React Error Boundary API dengan fallback UI yang informatif
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert } from '../ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'application' | 'component' | 'section';
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  title?: string;
  description?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      eventId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to external service (if configured)
    this.reportError(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys && resetKeys.length > 0) {
        this.resetErrorBoundary();
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        eventId: null,
      });
    }, 100);
  };

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Here you would typically send error to monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level: this.props.level || 'component',
      eventId: this.state.eventId,
    };

    // Log to console in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.group('🚨 Error Report');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.table(errorReport);
      console.groupEnd();
    }

    // Send to error reporting service
    // sendErrorToService(errorReport);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI based on level
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }

  private renderDefaultFallback() {
    const { level = 'component', title, description } = this.props;
    const { error, errorInfo, eventId } = this.state;

    if (level === 'application') {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6">
            <div className="text-center">
              <div className="text-6xl text-red-500 mb-4">💥</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title || 'Aplikasi Mengalami Error'}
              </h1>
              <p className="text-gray-600 mb-6">
                {description || 'Terjadi kesalahan yang tidak terduga. Tim pengembang telah diberitahu dan sedang mengatasi masalah ini.'}
              </p>
              
              <Alert className="mb-6 text-left">
                <div className="text-sm">
                  <strong>Error ID:</strong> {eventId}
                  <br />
                  <strong>Waktu:</strong> {new Date().toLocaleString('id-ID')}
                </div>
              </Alert>

              <div className="space-y-3">
                <Button 
                  onClick={this.resetErrorBoundary}
                  className="w-full"
                >
                  🔄 Coba Lagi
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  🔃 Refresh Halaman
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  🏠 Kembali ke Beranda
                </Button>
              </div>

              {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    🔍 Detail Error (Development)
                  </summary>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono overflow-auto max-h-40">
                    <div className="text-red-600 font-bold mb-2">
                      {error?.message}
                    </div>
                    <div className="text-gray-700">
                      {error?.stack}
                    </div>
                    {errorInfo?.componentStack && (
                      <div className="mt-2 text-blue-600">
                        <strong>Component Stack:</strong>
                        <pre>{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </Card>
        </div>
      );
    }

    if (level === 'section') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <div className="flex items-start">
            <div className="text-red-500 text-xl mr-3">⚠️</div>
            <div className="flex-1">
              <h3 className="text-red-800 font-medium mb-1">
                {title || 'Bagian ini mengalami error'}
              </h3>
              <p className="text-red-700 text-sm mb-3">
                {description || `Error ID: ${eventId}`}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={this.resetErrorBoundary}
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Default component level
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 my-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-yellow-800 text-sm">
              {title || 'Komponen error'}
            </span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={this.resetErrorBoundary}
            className="text-xs"
          >
            Reset
          </Button>
        </div>
      </div>
    );
  }
}

// Higher-Order Component untuk wrapping komponen dengan error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryConfig?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryConfig}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook untuk trigger error secara manual (untuk testing)
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}

// Utility functions
function generateErrorId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Error boundary untuk async operations
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      eventId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <div className="flex items-start">
            <span className="text-red-500 mr-2">🚨</span>
            <div>
              <h4 className="text-red-800 font-medium">
                Operasi async gagal
              </h4>
              <p className="text-red-700 text-sm mt-1">
                {this.state.error?.message || 'Terjadi kesalahan saat memproses data'}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="mt-2"
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Specific error boundaries for different parts of the application
export const StructuralAnalysisErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    level="section"
    title="Error pada Analisis Struktur"
    description="Terjadi kesalahan saat melakukan analisis struktur"
    onError={(error, errorInfo) => {
      console.error('Structural Analysis Error:', error, errorInfo);
      // Could send to structural analysis specific error reporting
    }}
    resetOnPropsChange={true}
  >
    {children}
  </ErrorBoundary>
);

export const FormErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    level="component"
    title="Error pada Form Input"
    description="Terjadi kesalahan pada form input"
    onError={(error, errorInfo) => {
      console.error('Form Error:', error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

export const VisualizationErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    level="section"
    fallback={
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="text-4xl text-gray-400 mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Visualisasi tidak dapat dimuat
        </h3>
        <p className="text-gray-600 text-sm">
          Terjadi kesalahan saat memuat komponen visualisasi
        </p>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);
