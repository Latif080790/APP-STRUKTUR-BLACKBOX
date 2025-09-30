import React, { useState } from 'react';

function App() {
  const [activeView, setActiveView] = useState('overview');
  
  const analysisData = {
    maxStress: 15.8,
    maxDeflection: 12.5,
    fundamentalPeriod: 2.1,
    safetyFactor: 2.5,
    analysisStatus: 'Selesai'
  };

  const renderContent = () => {
    switch (activeView) {
      case 'workspace':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white/90 mb-2">Professional Workspace</h2>
              <p className="text-white/60">Environment terintegrasi untuk analisis struktural enterprise</p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Analysis Tools */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Tools Analisis</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-600/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-800/30 border border-blue-400/20 rounded-lg text-left transition-all duration-200">
                    <span className="text-blue-400">📐</span>
                    <span className="text-white/80">Analisis Statis Linear</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-600/20 to-green-800/20 hover:from-green-600/30 hover:to-green-800/30 border border-green-400/20 rounded-lg text-left transition-all duration-200">
                    <span className="text-green-400">🌊</span>
                    <span className="text-white/80">Analisis Dinamis</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-600/20 to-purple-800/20 hover:from-purple-600/30 hover:to-purple-800/30 border border-purple-400/20 rounded-lg text-left transition-all duration-200">
                    <span className="text-purple-400">🏗️</span>
                    <span className="text-white/80">Analisis Non-Linear</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-600/20 to-orange-800/20 hover:from-orange-600/30 hover:to-orange-800/30 border border-orange-400/20 rounded-lg text-left transition-all duration-200">
                    <span className="text-orange-400">🌍</span>
                    <span className="text-white/80">Analisis Seismik</span>
                  </button>
                </div>
              </div>
              
              {/* 3D Viewer */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Model 3D Interactive</h3>
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg h-64 flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="text-4xl mb-3">🏢</div>
                    <p className="text-white/80 font-medium">Struktur Gedung 15 Lantai</p>
                    <p className="text-blue-300 text-sm mt-1">Beton Bertulang - K350</p>
                    <button className="mt-3 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 rounded-lg text-white/80 text-sm transition-all">
                      Buka 3D Viewer
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Material Library */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Perpustakaan Material</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Beton K-300</span>
                      <span className="text-green-400 text-sm">SNI 2847</span>
                    </div>
                    <div className="text-white/60 text-sm mt-1">fc' = 25 MPa</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Baja BjTS 40</span>
                      <span className="text-green-400 text-sm">SNI 1729</span>
                    </div>
                    <div className="text-white/60 text-sm mt-1">fy = 400 MPa</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Profil WF 400.200</span>
                      <span className="text-blue-400 text-sm">Standard</span>
                    </div>
                    <div className="text-white/60 text-sm mt-1">A = 84.12 cm²</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'integration':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white/90 mb-2">Smart Integration</h2>
              <p className="text-white/60">Integrasi AI dan export ke berbagai format</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">🤖 AI Analysis</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-600/20 rounded-lg border border-green-400/20">
                    <p className="text-green-300 text-sm">✓ Struktur aman dan efisien</p>
                  </div>
                  <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-400/20">
                    <p className="text-yellow-300 text-sm">⚠ Optimasi material di balok Lt.5</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">🏗️ Export Options</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded-lg text-center transition-all">
                    <p className="text-white text-sm">AutoCAD</p>
                  </button>
                  <button className="p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded-lg text-center transition-all">
                    <p className="text-white text-sm">Excel</p>
                  </button>
                  <button className="p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded-lg text-center transition-all">
                    <p className="text-white text-sm">PDF</p>
                  </button>
                  <button className="p-3 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-400/20 rounded-lg text-center transition-all">
                    <p className="text-white text-sm">Revit</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white/90 mb-2">Dashboard Professional</h2>
              <p className="text-white/60">Monitoring real-time sistem analisis struktural enterprise</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/20">
                <div className="text-3xl font-bold text-white/90 mb-2">24</div>
                <div className="text-blue-300 text-sm">Proyek Aktif</div>
                <div className="text-green-400 text-xs mt-1">+12% bulan ini</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-400/20">
                <div className="text-3xl font-bold text-white/90 mb-2">156</div>
                <div className="text-green-300 text-sm">Analisis Selesai</div>
                <div className="text-green-400 text-xs mt-1">+8% peningkatan</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/20">
                <div className="text-3xl font-bold text-white/90 mb-2">{analysisData.maxStress}</div>
                <div className="text-purple-300 text-sm">Max Stress (MPa)</div>
                <div className="text-green-400 text-xs mt-1">Dalam batas aman</div>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-lg rounded-xl p-6 border border-orange-400/20">
                <div className="text-3xl font-bold text-white/90 mb-2">12</div>
                <div className="text-orange-300 text-sm">Tim Kolaborator</div>
                <div className="text-green-400 text-xs mt-1">Online aktif</div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-white/90 font-semibold mb-4">Performa Sistem Real-time</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.8%</div>
                  <div className="text-white/60 text-sm">Uptime Sistem</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-blue-400 mb-2">1.2s</div>
                  <div className="text-white/60 text-sm">Response Time</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl font-bold text-purple-400 mb-2">847</div>
                  <div className="text-white/60 text-sm">Analisis Processed</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Professional Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🏗️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">StructuralPro Enterprise</h1>
                <p className="text-white/60 text-sm">Advanced Structural Analysis Suite</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm">Sistem Aktif</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="text-white/80 text-sm">{new Date().toLocaleTimeString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Professional Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'workspace', label: 'Workspace', icon: '🔧' },
                { id: 'integration', label: 'Integration', icon: '🤖' },
                { id: 'analytics', label: 'Analytics', icon: '📈' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-blue-600/30 text-white border border-blue-400/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>

      {/* Professional Footer */}
      <div className="bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-200">© 2025 StructuralPro BlackBox Enterprise Edition</p>
            <div className="flex space-x-4">
              <span className="text-green-400">● Frontend: Online</span>
              <span className="text-green-400">● Backend: Online</span>
              <span className="text-blue-400">● Mode: Professional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;