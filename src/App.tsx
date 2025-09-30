import React, { useState, useEffect } from 'react';
import WorkflowController from './core/WorkflowController';

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [workflowController] = useState(() => new WorkflowController('project-001'));
  const [workflowState, setWorkflowState] = useState(workflowController.getState());
  const [progressReport, setProgressReport] = useState(workflowController.generateProgressReport());
  
  const analysisData = {
    maxStress: 15.8,
    maxDeflection: 12.5,
    fundamentalPeriod: 2.1,
    safetyFactor: 2.5,
    analysisStatus: 'Selesai'
  };

  // Subscribe to workflow changes
  useEffect(() => {
    const unsubscribe = workflowController.subscribe((state) => {
      setWorkflowState(state);
      setProgressReport(workflowController.generateProgressReport());
    });
    return unsubscribe;
  }, [workflowController]);

  // Simulate some data for demonstration
  useEffect(() => {
    // Set initial geometry data
    workflowController.setData('geometry', {
      height: 45,
      floors: 15,
      irregularity: 0.2,
      location: { seismicZone: 'high' }
    });
    
    // Set material data
    workflowController.setData('materials', {
      concrete: { fc: 35 },
      steel: { fy: 400 }
    });
    
    // Set load data
    workflowController.setData('loads', {
      deadLoad: 4.0,
      liveLoad: 2.5,
      seismicLoad: true
    });
  }, [workflowController]);

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
      
      case 'analytics':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white/90 mb-2">Analytics & Insights Terintegrasi</h2>
              <p className="text-white/60">Analisis mendalam dengan AI dan visualisasi data real-time</p>
            </div>
            
            {/* Real-time Analytics Dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <h3 className="text-white/90 font-semibold mb-4">Trend Analisis Real-time</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg p-4 border border-blue-400/20">
                      <div className="text-blue-400 text-sm mb-1">Efisiensi Struktur</div>
                      <div className="text-2xl font-bold text-white/90">87.3%</div>
                      <div className="text-white/60 text-xs mt-1">+2.1% dari baseline</div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{width: '87.3%'}}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg p-4 border border-green-400/20">
                      <div className="text-green-400 text-sm mb-1">Safety Factor</div>
                      <div className="text-2xl font-bold text-white/90">2.45</div>
                      <div className="text-white/60 text-xs mt-1">Aman sesuai SNI</div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '98%'}}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg p-4 border border-purple-400/20">
                      <div className="text-purple-400 text-sm mb-1">Material Usage</div>
                      <div className="text-2xl font-bold text-white/90">91.2%</div>
                      <div className="text-white/60 text-xs mt-1">Optimasi maksimal</div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div className="bg-purple-400 h-2 rounded-full" style={{width: '91.2%'}}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 rounded-lg p-4 border border-orange-400/20">
                      <div className="text-orange-400 text-sm mb-1">Cost Efficiency</div>
                      <div className="text-2xl font-bold text-white/90">Rp 12.8M</div>
                      <div className="text-white/60 text-xs mt-1">-8.3% dari estimasi</div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{width: '76%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI-Powered Insights */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">AI Insights</h3>
                <div className="space-y-4">
                  <div className="bg-green-600/10 border border-green-400/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <div className="text-green-400 text-sm font-medium">Optimasi Material</div>
                        <div className="text-white/70 text-xs mt-1">Gunakan profil WF 350.175 untuk penghematan 12%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-600/10 border border-blue-400/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <div className="text-blue-400 text-sm font-medium">Perkuatan Tambahan</div>
                        <div className="text-white/70 text-xs mt-1">Pertimbangkan bracing di grid C-D</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-600/10 border border-yellow-400/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                      <div>
                        <div className="text-yellow-400 text-sm font-medium">Review Koneksi</div>
                        <div className="text-white/70 text-xs mt-1">Verifikasi sambungan balok-kolom</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-600/10 border border-purple-400/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <div className="text-purple-400 text-sm font-medium">Compliance Check</div>
                        <div className="text-white/70 text-xs mt-1">Semua standar SNI terpenuhi ✓</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Workflow Integration Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Analisis Workflow Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Rata-rata waktu per stage</span>
                    <span className="text-blue-400 font-medium">2.3 menit</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Tingkat keberhasilan validasi</span>
                    <span className="text-green-400 font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Error rate</span>
                    <span className="text-yellow-400 font-medium">1.8%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Auto-correction rate</span>
                    <span className="text-purple-400 font-medium">89.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Prediksi Trend</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg border border-blue-400/20">
                    <div className="text-blue-400 text-sm font-medium mb-1">Proyeksi Beban Kerja</div>
                    <div className="text-white/70 text-xs">+15% peningkatan dalam 30 hari</div>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                      <div className="bg-blue-400 h-1 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-lg border border-green-400/20">
                    <div className="text-green-400 text-sm font-medium mb-1">Efisiensi Sistem</div>
                    <div className="text-white/70 text-xs">Optimasi otomatis tersedia</div>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                      <div className="bg-green-400 h-1 rounded-full" style={{width: '82%'}}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg border border-purple-400/20">
                    <div className="text-purple-400 text-sm font-medium mb-1">Resource Utilization</div>
                    <div className="text-white/70 text-xs">Peak hours: 14:00-16:00</div>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                      <div className="bg-purple-400 h-1 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Real-time System Health */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-white/90 font-semibold mb-4">System Health Monitor</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-green-400 mb-2">99.8%</div>
                  <div className="text-white/60 text-sm">Uptime</div>
                  <div className="text-green-400 text-xs mt-1">• Optimal</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-400 mb-2">847</div>
                  <div className="text-white/60 text-sm">Processes/day</div>
                  <div className="text-blue-400 text-xs mt-1">• High Load</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-400 mb-2">1.2s</div>
                  <div className="text-white/60 text-sm">Avg Response</div>
                  <div className="text-purple-400 text-xs mt-1">• Fast</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-orange-400 mb-2">24</div>
                  <div className="text-white/60 text-sm">Active Users</div>
                  <div className="text-orange-400 text-xs mt-1">• Normal</div>
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
              <p className="text-white/60">Monitoring real-time sistem analisis struktural enterprise dengan workflow terintegrasi</p>
            </div>
            
            {/* Workflow Progress Section */}
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Progress Workflow Terintegrasi</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">Stage: {workflowState.currentStage}</span>
                      <span className="text-blue-400 text-sm">{progressReport.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressReport.progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {['input', 'modeling', 'analysis', 'validation', 'export'].map((stage, index) => (
                        <div key={stage} className={`flex items-center space-x-2 text-sm ${
                          workflowState.currentStage === stage ? 'text-blue-400' : 
                          progressReport.progress > index * 20 ? 'text-green-400' : 'text-white/50'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            workflowState.currentStage === stage ? 'bg-blue-400 animate-pulse' :
                            progressReport.progress > index * 20 ? 'bg-green-400' : 'bg-white/30'
                          }`}></div>
                          <span>{stage === 'input' ? 'Input Geometri' : 
                                stage === 'modeling' ? 'Pemodelan Material' :
                                stage === 'analysis' ? 'Analisis Struktur' :
                                stage === 'validation' ? 'Validasi Hasil' : 'Export Laporan'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Validation Gates */}
                  <div>
                    <h4 className="text-white/80 font-medium mb-3">Status Validasi</h4>
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        progressReport.validationStatus.geometryValid ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}>
                        <span className="text-white/80 text-sm">Geometri</span>
                        <span className={progressReport.validationStatus.geometryValid ? 'text-green-400' : 'text-red-400'}>
                          {progressReport.validationStatus.geometryValid ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        progressReport.validationStatus.materialsValid ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}>
                        <span className="text-white/80 text-sm">Material</span>
                        <span className={progressReport.validationStatus.materialsValid ? 'text-green-400' : 'text-red-400'}>
                          {progressReport.validationStatus.materialsValid ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        progressReport.validationStatus.loadsValid ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}>
                        <span className="text-white/80 text-sm">Beban</span>
                        <span className={progressReport.validationStatus.loadsValid ? 'text-green-400' : 'text-red-400'}>
                          {progressReport.validationStatus.loadsValid ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between p-2 rounded-lg ${
                        progressReport.validationStatus.analysisValid ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}>
                        <span className="text-white/80 text-sm">Analisis</span>
                        <span className={progressReport.validationStatus.analysisValid ? 'text-green-400' : 'text-red-400'}>
                          {progressReport.validationStatus.analysisValid ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={() => workflowController.advanceToNextStage()}
                    className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/30 rounded-lg text-white transition-all"
                  >
                    Lanjut ke Stage Berikutnya
                  </button>
                  <button className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 border border-green-400/30 rounded-lg text-white transition-all">
                    Validasi Manual
                  </button>
                </div>
              </div>
            </div>
            
            {/* SNI Compliance Section */}
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-white/90 font-semibold mb-4">Kepatuhan Standar SNI</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {progressReport.compliance.map((standard, index) => (
                    <div key={index} className="bg-green-600/20 border border-green-400/20 rounded-lg p-3 text-center">
                      <div className="text-green-400 text-sm font-medium">{standard}</div>
                      <div className="text-green-300 text-xs mt-1">✓ Sesuai</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* AI Recommendations */}
            {progressReport.recommendations.length > 0 && (
              <div className="mb-8">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <h3 className="text-white/90 font-semibold mb-4">🤖 Rekomendasi AI</h3>
                  <div className="space-y-3">
                    {progressReport.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-blue-600/20 border border-blue-400/20 rounded-lg p-3">
                        <p className="text-blue-300 text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
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