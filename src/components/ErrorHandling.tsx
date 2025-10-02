/**
 * Comprehensive Error Handling & User Feedback System
 * Sistem penanganan error dan feedback yang teliti
 */

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, CheckCircle, Info, X, AlertCircle,
  RefreshCw, Bug, Wifi, WifiOff, Clock
} from 'lucide-react';

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

interface ValidationDisplayProps {
  errors: string[];
  warnings: string[];
  recommendations?: string[];
  className?: string;
}

interface LoadingStateProps {
  isLoading: boolean;
  message?: string;
  progress?: number;
  className?: string;
}

interface ConnectionStatusProps {
  isOnline: boolean;
  isConnectedToServer: boolean;
  className?: string;
}

// Context untuk notifikasi global
interface NotificationContextType {
  notifications: NotificationMessage[];
  addNotification: (notification: Omit<NotificationMessage, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const NotificationContext = React.createContext<NotificationContextType | null>(null);

// Hook untuk menggunakan notifikasi
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification harus digunakan dalam NotificationProvider');
  }
  return context;
};

// Provider untuk notifikasi
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = (notification: Omit<NotificationMessage, 'id' | 'timestamp'>) => {
    const newNotification: NotificationMessage = {
      ...notification,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto remove setelah duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Container untuk menampilkan notifikasi
const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Komponen untuk menampilkan notifikasi individual
const NotificationCard: React.FC<{
  notification: NotificationMessage;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`
      transform transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      ${getBackgroundColor()}
      border rounded-lg shadow-lg p-4 min-w-0 max-w-md
    `}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-700 break-words">
            {notification.message}
          </p>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 flex space-x-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`
                    px-3 py-1 text-xs font-medium rounded
                    ${action.style === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }
                    transition-colors
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500">
            {notification.timestamp.toLocaleTimeString('id-ID')}
          </div>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Error Boundary untuk menangkap error React
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error Boundary menangkap error:', error, errorInfo);
    this.setState({ errorInfo });

    // Log error ke service monitoring (implementasi sesuai kebutuhan)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: any) {
    // Implementasi logging ke service eksternal
    console.log('Logging error to service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} onRetry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Bug className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Terjadi Kesalahan Sistem
            </h2>
            
            <p className="text-gray-600 mb-4">
              Maaf, aplikasi mengalami kesalahan yang tidak terduga. 
              Tim pengembang telah diberitahu.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded p-3 mb-4 text-left">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Detail Error:</h4>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Coba Lagi
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Komponen untuk menampilkan validasi
export const ValidationDisplay: React.FC<ValidationDisplayProps> = ({
  errors,
  warnings,
  recommendations,
  className = ''
}) => {
  if (errors.length === 0 && warnings.length === 0 && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h4 className="text-sm font-medium text-red-800">
              {errors.length} Kesalahan Ditemukan
            </h4>
          </div>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start space-x-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <h4 className="text-sm font-medium text-orange-800">
              {warnings.length} Peringatan
            </h4>
          </div>
          <ul className="space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-sm text-orange-700 flex items-start space-x-2">
                <span className="text-orange-500 mt-0.5">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-medium text-blue-800">
              Rekomendasi
            </h4>
          </div>
          <ul className="space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Komponen untuk loading state
export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  message = 'Memuat...',
  progress,
  className = ''
}) => {
  if (!isLoading) return null;

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm mb-2">{message}</p>
        {progress !== undefined && (
          <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            ></div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Komponen untuk status koneksi
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isOnline,
  isConnectedToServer,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!isOnline || !isConnectedToServer);
    
    if (!isOnline || !isConnectedToServer) {
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isConnectedToServer]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <div className={`
        px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2
        ${!isOnline ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'}
      `}>
        {!isOnline ? (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Tidak ada koneksi internet</span>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Koneksi ke server terputus</span>
          </>
        )}
      </div>
    </div>
  );
};

// Hook untuk monitor koneksi
export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectedToServer, setIsConnectedToServer] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check server connection periodically
    const checkServerConnection = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        setIsConnectedToServer(response.ok);
      } catch {
        setIsConnectedToServer(false);
      }
    };

    const interval = setInterval(checkServerConnection, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, isConnectedToServer };
};

// Komponen untuk retry dengan exponential backoff
export const withRetry = <T extends any[]>(
  fn: (...args: T) => Promise<any>,
  maxRetries: number = 3,
  baseDelay: number = 1000
) => {
  return async (...args: T) => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };
};