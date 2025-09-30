/**
 * Smart Integration Dashboard
 * Advanced dashboard that integrates AI Analysis, BIM, and Advanced Structural engines
 * Provides a unified interface for comprehensive structural analysis workflow
 */

import React, { useState, useEffect } from 'react';
import { Brain, Building, Zap, Settings, BarChart3, FileText, Download, Share2, Users, Wifi, WifiOff } from 'lucide-react';
import { AIAnalysisEngine, StructuralFeatures, OptimizationObjective, AIRecommendation } from '../structural-analysis/engines/AIAnalysisEngine';
import { BIMIntegrationEngine, BIMModel, IFCExportOptions, DWGExportOptions } from '../structural-analysis/engines/BIMIntegrationEngine';
import { AdvancedStructuralEngine, StructuralNode, StructuralElement, LoadCase } from '../structural-analysis/engines/AdvancedStructuralEngine';
import { apiService } from '../services/apiService';
import { webSocketService, RealTimeNotification, CollaborationUser } from '../services/webSocketService';

interface SmartIntegrationDashboardProps {
  onNavigate: (view: string) => void;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  features: StructuralFeatures;
  analysisResults?: any;
  aiRecommendations?: AIRecommendation[];
  bimModel?: BIMModel;
  lastModified: Date;
}

interface AnalysisProgress {
  stage: 'idle' | 'structural' | 'ai' | 'bim' | 'complete';
  progress: number;
  currentTask: string;
}

interface RealTimeState {
  connected: boolean;
  activeUsers: CollaborationUser[];
  notifications: RealTimeNotification[];
  lastUpdate?: Date;
}

export const SmartIntegrationDashboard: React.FC<SmartIntegrationDashboardProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({ 
    stage: 'idle', 
    progress: 0, 
    currentTask: 'Ready to start' 
  });
  const [engines, setEngines] = useState({
    ai: new AIAnalysisEngine(),
    bim: new BIMIntegrationEngine(),
    structural: new AdvancedStructuralEngine()
  });
  const [realTimeState, setRealTimeState] = useState<RealTimeState>({
    connected: false,
    activeUsers: [],
    notifications: [],
    lastUpdate: undefined
  });

  // Initialize demo project and WebSocket
  useEffect(() => {
    const demoProject: ProjectData = {
      id: 'demo-001',
      name: 'Gedung Perkantoran 15 Lantai',
      description: 'Struktur beton bertulang dengan sistem rangka terbuka',
      features: {
        geometry: {
          spans: [8, 6, 8],
          heights: [4.5, 3.8, 4.5],
          areas: [400, 300, 400],
          aspectRatios: [1.8, 1.6, 1.8],
          slendernessRatios: [12, 15, 12]
        },
        loads: {
          deadLoad: 25,
          liveLoad: 12,
          windLoad: 8,
          seismicLoad: 15,
          loadDistribution: 'uniform'
        },
        materials: {
          concreteStrength: 35,
          steelGrade: 400,
          elasticModulus: 25000,
          density: 2400
        },
        constraints: {
          deflectionLimit: 20,
          stressLimit: 15.75,
          frequencyLimit: 0.5
        }
      },
      lastModified: new Date()
    };

    setProjects([demoProject]);
    setCurrentProject(demoProject);
    
    // Initialize WebSocket service
    initializeWebSocket();
    
    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  // Initialize WebSocket with event handlers
  const initializeWebSocket = () => {
    webSocketService.setEventHandlers({
      onConnect: () => {
        console.log('🔗 Connected to real-time service');
        setRealTimeState(prev => ({ ...prev, connected: true, lastUpdate: new Date() }));
        if (currentProject) {
          webSocketService.joinProject(currentProject.id);
        }
      },
      onDisconnect: () => {
        console.log('❌ Disconnected from real-time service');
        setRealTimeState(prev => ({ ...prev, connected: false }));
      },
      onAnalysisUpdate: (data) => {
        console.log('📊 Real-time analysis update:', data);
        setAnalysisProgress(prev => ({ ...prev, ...data }));
      },
      onPerformanceUpdate: (data) => {
        console.log('⚡ Performance update:', data);
        // Handle performance updates
      },
      onUserJoined: (user) => {
        console.log('👤 User joined:', user);
        setRealTimeState(prev => ({
          ...prev,
          activeUsers: [...prev.activeUsers.filter(u => u.id !== user.id), user]
        }));
      },
      onUserLeft: (user) => {
        console.log('👋 User left:', user);
        setRealTimeState(prev => ({
          ...prev,
          activeUsers: prev.activeUsers.filter(u => u.id !== user.id)
        }));
      },
      onProjectUpdate: (project) => {
        console.log('🏢 Project update:', project);
        if (currentProject?.id === project.id) {
          setCurrentProject({ ...currentProject, ...project });
        }
      },
      onNotification: (notification) => {
        console.log('🔔 Notification:', notification);
        setRealTimeState(prev => ({
          ...prev,
          notifications: [notification, ...prev.notifications.slice(0, 4)]
        }));
      },
      onError: (error) => {
        console.error('❌ WebSocket error:', error);
      }
    });
    
    webSocketService.init();
  };

  const runComprehensiveAnalysis = async () => {
    if (!currentProject) return;

    try {
      // Stage 1: Structural Analysis
      setAnalysisProgress({ stage: 'structural', progress: 10, currentTask: 'Menjalankan analisis struktural...' });
      
      // Prepare analysis data
      const analysisData = {
        modelData: {
          nodes: [
            { id: 'N1', x: 0, y: 0, z: 0, constraints: { x: true, y: true, z: true, rx: true, ry: true, rz: true } },
            { id: 'N2', x: 8, y: 0, z: 0, constraints: { x: false, y: true, z: false, rx: false, ry: false, rz: false } }
          ],
          elements: [
            { id: 'E1', nodeIds: ['N1', 'N2'], material: { E: 25000000000, nu: 0.2 }, section: { A: 0.18, Ix: 0.0072 } }
          ]
        },
        analysisType: 'linear_static',
        loadCases: [
          { name: 'Dead Load', loads: [{ nodeId: 'N2', fx: 0, fy: -100, fz: 0 }] }
        ]
      };
      
      // Call backend API
      const structuralResults = await apiService.analysis.structural(analysisData);
      console.log('📊 Analisis struktural selesai:', structuralResults);
      
      // Send real-time update
      if (realTimeState.connected) {
        webSocketService.sendAnalysisUpdate(currentProject.id, {
          stage: 'ai',
          progress: 40,
          results: structuralResults
        });
      }
      
      setAnalysisProgress({ stage: 'ai', progress: 40, currentTask: 'Menghasilkan rekomendasi AI...' });
      
      // Stage 2: AI Analysis
      const aiRecommendations = await apiService.ai.getRecommendations(currentProject.features);
      console.log('🤖 Rekomendasi AI:', aiRecommendations);
      
      // Send real-time update
      if (realTimeState.connected) {
        webSocketService.sendAnalysisUpdate(currentProject.id, {
          stage: 'bim',
          progress: 80,
          aiRecommendations: aiRecommendations.recommendations
        });
      }
      
      setAnalysisProgress({ stage: 'bim', progress: 80, currentTask: 'Mengintegrasikan dengan BIM...' });
      
      // Stage 3: BIM Integration (simulated)
      const bimResponse = { success: true, fileId: 'bim_' + Date.now() };
      
      setAnalysisProgress({ stage: 'complete', progress: 100, currentTask: 'Analisis lengkap!' });

      // Update project with results
      const updatedProject: ProjectData = {
        ...currentProject,
        analysisResults: { 
          structural: structuralResults.results, 
          metadata: structuralResults.metadata 
        },
        aiRecommendations: aiRecommendations.recommendations || [],
        bimModel: bimResponse.fileId ? {
          id: bimResponse.fileId,
          name: 'Demo Model',
          version: '1.0',
          created: new Date(),
          modified: new Date(),
          author: 'AI System',
          description: 'Generated BIM model',
          elements: [],
          properties: {
            units: { length: 'm', force: 'kN', stress: 'MPa', angle: 'deg' },
            coordinateSystem: {
              origin: [0, 0, 0],
              xAxis: [1, 0, 0],
              yAxis: [0, 1, 0],
              zAxis: [0, 0, 1]
            },
            projectInfo: {
              name: 'Demo Project',
              site: 'Jakarta',
              client: 'Demo Client',
              architect: 'AI Architect',
              engineer: 'AI Engineer'
            },
            buildingInfo: {
              floors: 15,
              height: 67.5,
              area: 1100,
              volume: 74250,
              occupancy: 'Office',
              constructionType: 'Reinforced Concrete'
            }
          }
        } : undefined,
        lastModified: new Date()
      };
      
      setCurrentProject(updatedProject);
      
      // Send completion notification
      if (realTimeState.connected) {
        webSocketService.sendNotification({
          type: 'success',
          title: 'Analysis Complete',
          message: 'Smart analysis has been completed successfully',
          projectId: currentProject.id
        });
        
        webSocketService.sendAnalysisUpdate(currentProject.id, {
          stage: 'complete',
          progress: 100,
          analysisResults: updatedProject.analysisResults,
          aiRecommendations: updatedProject.aiRecommendations
        });
      }
      
      setTimeout(() => {
        setAnalysisProgress({ stage: 'idle', progress: 0, currentTask: 'Ready for next analysis' });
      }, 2000);

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setAnalysisProgress({ 
        stage: 'idle', 
        progress: 0, 
        currentTask: 'Analysis failed - Ready to retry' 
      });
      
      // Show error notification
      alert('Analisis gagal. Pastikan backend server berjalan di port 3001.');
    }
  };

  const exportResults = async (format: 'pdf' | 'dwg' | 'ifc') => {
    if (!currentProject?.bimModel) return;
    
    try {
      let exportedData: string;
      
      if (format === 'pdf') {
        // For PDF, we would generate a report (simplified for demo)
        exportedData = `PDF Report for ${currentProject.name}\nGenerated on: ${new Date().toISOString()}`;
      } else if (format === 'dwg') {
        const options: DWGExportOptions = {
          version: '2021',
          includeText: true,
          includeDimensions: true,
          includeHatching: true,
          layerStructure: 'byType',
          scale: 1,
          paperSize: 'A1'
        };
        await engines.bim.exportDWG(currentProject.bimModel.id, `${currentProject.name}.dwg`, options);
        exportedData = 'DWG export completed';
      } else {
        const options: IFCExportOptions = {
          version: '4.0',
          includeGeometry: true,
          includeMaterials: true,
          includeProperties: true,
          includeRelationships: true,
          levelOfDetail: 'detailed',
          coordinateSystem: 'global',
          units: {
            length: 'm',
            force: 'kN',
            stress: 'MPa',
            angle: 'deg'
          }
        };
        await engines.bim.exportIFC(currentProject.bimModel.id, `${currentProject.name}.ifc`, options);
        exportedData = 'IFC export completed';
      }
      
      // Create download link
      const blob = new Blob([exportedData], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/octet-stream' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Smart Integration Dashboard</h1>
              <p className="text-blue-200">AI-Powered Structural Analysis with BIM Integration</p>
            </div>
            <div className="flex space-x-3">
              {/* Real-time Status Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                realTimeState.connected 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {realTimeState.connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm">
                  {realTimeState.connected ? 'Connected' : 'Offline'}
                </span>
                {realTimeState.activeUsers.length > 0 && (
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {realTimeState.activeUsers.length} active
                  </span>
                )}
              </div>
              
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('workspace')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Workspace
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Notifications Panel */}
        {realTimeState.notifications.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Real-time Updates
            </h2>
            <div className="space-y-3">
              {realTimeState.notifications.slice(0, 3).map((notification, index) => (
                <div 
                  key={notification.id || index} 
                  className={`p-3 rounded-lg border border-white/10 ${
                    notification.type === 'success' ? 'bg-green-500/10' :
                    notification.type === 'error' ? 'bg-red-500/10' :
                    notification.type === 'warning' ? 'bg-yellow-500/10' :
                    'bg-blue-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white text-sm">{notification.title}</h4>
                      <p className="text-blue-200 text-xs mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-blue-300">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Overview */}
        {currentProject && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Project Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Project Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-blue-200 text-sm">Project Name</label>
                  <p className="text-white font-medium">{currentProject.name}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Description</label>
                  <p className="text-white">{currentProject.description}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Last Modified</label>
                  <p className="text-white">{currentProject.lastModified.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Analysis Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Analysis Controls
              </h2>
              
              {analysisProgress.stage !== 'idle' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-blue-200 mb-2">
                      <span>{analysisProgress.currentTask}</span>
                      <span>{analysisProgress.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-blue-200">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span>Processing...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={runComprehensiveAnalysis}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Brain className="w-5 h-5 inline mr-2" />
                    Run Smart Analysis
                  </button>
                  <p className="text-blue-200 text-sm text-center">
                    Comprehensive AI + BIM + Structural Analysis
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Project Stats
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{currentProject.features.geometry.spans.length}</p>
                  <p className="text-blue-200 text-sm">Spans</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{currentProject.features.materials.concreteStrength}</p>
                  <p className="text-blue-200 text-sm">fc' (MPa)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{currentProject.features.materials.steelGrade}</p>
                  <p className="text-blue-200 text-sm">fy (MPa)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-400">{currentProject.features.loads.deadLoad + currentProject.features.loads.liveLoad}</p>
                  <p className="text-blue-200 text-sm">Total Load</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {currentProject?.aiRecommendations && currentProject.aiRecommendations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              AI Smart Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProject.aiRecommendations.slice(0, 6).map((rec) => (
                <div key={rec.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">{rec.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rec.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                      rec.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                      rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-300">
                      Confidence: {(rec.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-blue-300">
                      {rec.implementation.effort} effort
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export & Share
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => exportResults('pdf')}
              disabled={!currentProject?.analysisResults}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-5 h-5" />
              <span>Export PDF Report</span>
            </button>
            <button
              onClick={() => exportResults('dwg')}
              disabled={!currentProject?.bimModel}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings className="w-5 h-5" />
              <span>Export DWG</span>
            </button>
            <button
              onClick={() => exportResults('ifc')}
              disabled={!currentProject?.bimModel}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-5 h-5" />
              <span>Export IFC</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartIntegrationDashboard;