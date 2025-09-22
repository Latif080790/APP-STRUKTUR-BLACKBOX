import { useState } from 'react';

// Simple demo page untuk structural analysis system
const SimpleDemoPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState({
    name: 'Gedung Contoh',
    location: 'Jakarta',
    length: 20,
    width: 15,
    floors: 3
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏗️ Sistem Analisis Struktur
          </h1>
          <p className="text-xl text-gray-600">
            Demo sistem analisis struktur beton bertulang
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'input', label: 'Input Data' },
                { id: 'analysis', label: 'Analisis' },
                { id: 'results', label: 'Hasil' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        📝
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900">Input System</h3>
                    </div>
                    <p className="text-blue-700">Form input untuk data proyek, geometri, material, dan beban</p>
                    <div className="mt-4">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        ✅ Ready
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        ⚡
                      </div>
                      <h3 className="text-lg font-semibold text-green-900">Analysis Engine</h3>
                    </div>
                    <p className="text-green-700">Perhitungan analisis struktur dengan progress tracking</p>
                    <div className="mt-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        🔧 Working
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        👁️
                      </div>
                      <h3 className="text-lg font-semibold text-purple-900">3D Visualization</h3>
                    </div>
                    <p className="text-purple-700">Visualisasi struktur 3D dengan Three.js</p>
                    <div className="mt-4">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        ✅ Ready
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Status Pengembangan</h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        Sistem basic sudah functional. Input, analisis sederhana, dan visualisasi 3D telah bekerja.
                        Fitur advanced sedang dalam pengembangan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Tab */}
            {activeTab === 'input' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Input Data Proyek</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Project Info */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Informasi Proyek</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Proyek
                        </label>
                        <input
                          type="text"
                          value={projectData.name}
                          onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lokasi
                        </label>
                        <input
                          type="text"
                          value={projectData.location}
                          onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Geometry */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Geometri Struktur</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Panjang (m)
                          </label>
                          <input
                            type="number"
                            value={projectData.length}
                            onChange={(e) => setProjectData(prev => ({ ...prev, length: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lebar (m)
                          </label>
                          <input
                            type="number"
                            value={projectData.width}
                            onChange={(e) => setProjectData(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jumlah Lantai
                        </label>
                        <input
                          type="number"
                          value={projectData.floors}
                          onChange={(e) => setProjectData(prev => ({ ...prev, floors: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    Lanjut ke Analisis →
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analisis Struktur</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Parameter Analisis</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Proyek:</span> {projectData.name}
                    </div>
                    <div>
                      <span className="font-medium">Lokasi:</span> {projectData.location}
                    </div>
                    <div>
                      <span className="font-medium">Dimensi:</span> {projectData.length}m × {projectData.width}m
                    </div>
                    <div>
                      <span className="font-medium">Lantai:</span> {projectData.floors} lantai
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      // Simulate analysis
                      setTimeout(() => setActiveTab('results'), 1000);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    🚀 Jalankan Analisis
                  </button>
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Hasil Analisis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Momen Maksimum</h3>
                    <p className="text-3xl font-bold text-blue-600">125.5 kN·m</p>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gaya Geser</h3>
                    <p className="text-3xl font-bold text-green-600">89.2 kN</p>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Defleksi Max</h3>
                    <p className="text-3xl font-bold text-orange-600">15.3 mm</p>
                  </div>

                  <div className="bg-white border rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Periode T1</h3>
                    <p className="text-3xl font-bold text-purple-600">0.85 s</p>
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Visualisasi 3D (Placeholder)</h3>
                  <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="text-4xl mb-2">🏗️</div>
                      <p>3D Viewer akan ditampilkan di sini</p>
                      <p className="text-sm">Three.js visualization coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDemoPage;