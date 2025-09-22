import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box p={3}>
          <Alert 
            severity="error"
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => window.location.reload()}
              >
                Muat Ulang
              </Button>
            }
          >
            <AlertTitle>Terjadi Kesalahan</AlertTitle>
            <p>Maaf, terjadi kesalahan yang tidak terduga.</p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '1em' }}>
                <summary>Detail Kesalahan</summary>
                <pre style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error?.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component untuk ErrorBoundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<{ error: Error | null }>,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
  return (props: P) => (
    <ErrorBoundary 
      fallback={
        FallbackComponent ? (
          <FallbackComponent error={null} />
        ) : undefined
      }
      onError={onError}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
};
