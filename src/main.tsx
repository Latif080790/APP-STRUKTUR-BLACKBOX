import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error boundary untuk menangkap error React
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b 0%, #dc2626 50%, #7f1d1d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Terjadi Kesalahan</h1>
            <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Aplikasi mengalami error saat memuat komponen.</p>
            <p style={{ marginBottom: '2rem', fontSize: '0.9rem', opacity: 0.6 }}>Error: {this.state.error?.message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Muat Ulang Halaman
              </button>
              <button 
                onClick={() => window.location.href = '/test.html'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Halaman Test
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Fungsi untuk memuat aplikasi dengan fallback
function SafeApp() {
  const [hasAppError, setHasAppError] = React.useState(false);

  // Coba render App component dengan error handling
  try {
    if (hasAppError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #3730a3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏗️ Sistem Analisis Struktural</h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.8 }}>Mode Aman - Komponen utama sedang dalam perbaikan</p>
            <button 
              onClick={() => setHasAppError(false)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Coba Lagi
            </button>
            <button 
              onClick={() => window.location.href = '/test.html'}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Mode Test
            </button>
          </div>
        </div>
      );
    }

    return <App />;
  } catch (error) {
    console.error('Error loading App component:', error);
    setHasAppError(true);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SafeApp />
    </ErrorBoundary>
  </React.StrictMode>
);