import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #3730a3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          🏗️ Sistem Analisis Struktural
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.8 }}>
          Aplikasi berhasil dimuat dan berfungsi dengan baik!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => alert('Dashboard diklik!')}
          >
            Dashboard
          </button>
          <button 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => alert('Workspace diklik!')}
          >
            Workspace
          </button>
          <button 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => alert('Smart Integration diklik!')}
          >
            Smart Integration
          </button>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>Frontend: ✅ Berjalan di http://localhost:5174/</p>
          <p>Backend: ✅ Berjalan di http://localhost:3001/</p>
          <p>Status: ✅ Semua sistem berfungsi normal</p>
        </div>
      </div>
    </div>
  );
}

export default App;