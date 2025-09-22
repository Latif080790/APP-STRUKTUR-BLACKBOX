import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Simple test application to ensure everything works
const SimpleTestApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ 
          color: '#333', 
          marginBottom: '1rem',
          fontSize: '2.5rem'
        }}>
          🏗️ Structural Analysis System
        </h1>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          System is running successfully on port 6001!
        </p>

        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#28a745', marginBottom: '1rem' }}>✅ Status: WORKING</h3>
          <div style={{ textAlign: 'left', fontSize: '0.9rem' }}>
            <div>✅ React Application: Running</div>
            <div>✅ Vite Dev Server: Active</div>
            <div>✅ Port 6001: Available</div>
            <div>✅ Compilation: Success</div>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
        >
          🔄 Refresh Test
        </button>

        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: '#e9ecef',
          borderRadius: '0.5rem',
          fontSize: '0.8rem',
          color: '#6c757d'
        }}>
          <strong>Next Steps:</strong><br/>
          1. Verify this page loads properly<br/>
          2. Test browser refresh functionality<br/>
          3. Ready for structural analysis components
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleTestApp />
  </StrictMode>,
)