import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="p-6 bg-red-50/80 backdrop-blur-lg rounded-xl border border-red-200">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong with the analysis system
              </h3>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-red-700">
              {this.state.error?.message || 'An unexpected error occurred during structural analysis.'}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reload Page
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-red-800">
                Technical Details (Development Mode)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-3 rounded overflow-auto">
                {this.state.error.stack}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs text-red-600 bg-red-100 p-3 rounded overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized Error Boundary for Analysis Operations
export const AnalysisErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const AnalysisFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => (
    <div className="p-8 bg-orange-50/80 backdrop-blur-lg rounded-xl border border-orange-200 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 14.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-orange-900 mb-2">
        Analysis System Error
      </h3>
      
      <p className="text-sm text-orange-700 mb-6 max-w-sm mx-auto">
        There was a problem with the structural analysis. This might be due to invalid input data or a system issue.
      </p>
      
      <div className="space-x-3">
        <button
          onClick={retry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Retry Analysis
        </button>
        
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={AnalysisFallback}>
      {children}
    </ErrorBoundary>
  );
};