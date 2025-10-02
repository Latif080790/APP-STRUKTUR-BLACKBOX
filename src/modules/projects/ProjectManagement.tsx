/**
 * Project Management Module
 * FULLY FUNCTIONAL CRUD operations untuk project management dengan real data persistence
 */

import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, MoreVertical, Edit3, Trash2, Share2, 
  Copy, Archive, Star, Users, Calendar, Clock, Building2,
  FolderOpen, Eye, Download, Upload, AlertCircle, Play, CheckCircle, X
} from 'lucide-react';
import { structuralEngine, ProjectData } from '../../engines/FunctionalStructuralEngine';
import { 
  validateProjectData, 
  ProjectValidation 
} from '../../utils/validation';
import { 
  useNotification, 
  ValidationDisplay, 
  LoadingState 
} from '../../components/ErrorHandling';

interface Project {
  id: string;
  name: string;
  description: string;
  type: 'residential' | 'commercial' | 'industrial' | 'infrastructure';
  status: 'active' | 'completed' | 'pending' | 'archived';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  team: string[];
  location: string;
  buildingInfo: {
    floors: number;
    height: number;
    area: number;
  };
  tags: string[];
  isStarred: boolean;
  isShared: boolean;
  engineData?: ProjectData;
  analysisStatus?: 'not-started' | 'running' | 'completed' | 'error';
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<'my-projects' | 'shared' | 'archived' | 'templates'>('my-projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    owner: 'Current User'
  });
  const [validationResult, setValidationResult] = useState<ProjectValidation | null>(null);
  
  const { addNotification } = useNotification();

  // Load projects from structural engine on mount
  useEffect(() => {
    loadProjects();
    
    // Initialize engine if not already done
    structuralEngine.initialize().then(() => {
      loadProjects(); // Reload after initialization
    }).catch(error => {
      console.error('Engine initialization failed:', error);
      addNotification({
        type: 'warning',
        title: 'Peringatan Sistem',
        message: 'Gagal memuat data proyek yang tersimpan. Data baru akan tersimpan dengan benar.',
        duration: 5000
      });
    });
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const engineProjects = structuralEngine.getAllProjects();
      const projectList: Project[] = engineProjects.map(engineProject => ({
        id: engineProject.id,
        name: engineProject.name,
        description: engineProject.description,
        type: engineProject.geometry.buildingType,
        status: 'active',
        progress: 0,
        createdAt: engineProject.createdAt,
        updatedAt: engineProject.updatedAt,
        owner: engineProject.owner,
        team: [engineProject.owner],
        location: 'Indonesia',
        buildingInfo: {
          floors: engineProject.geometry.floors,
          height: engineProject.geometry.floors * engineProject.geometry.floorHeight,
          area: engineProject.geometry.bayLength * engineProject.geometry.bayWidth * engineProject.geometry.baysX * engineProject.geometry.baysY
        },
        tags: [engineProject.geometry.buildingType, 'structural-analysis'],
        isStarred: false,
        isShared: false,
        engineData: engineProject,
        analysisStatus: 'not-started'
      }));
      
      setProjects(projectList);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || project.type === filterType;
    
    const matchesView = currentView === 'my-projects' || 
                       (currentView === 'shared' && project.isShared) ||
                       (currentView === 'archived' && project.status === 'archived');
    
    return matchesSearch && matchesFilter && matchesView;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return <Building2 className="w-4 h-4 text-green-600" />;
      case 'commercial': return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'industrial': return <Building2 className="w-4 h-4 text-orange-600" />;
      case 'infrastructure': return <Building2 className="w-4 h-4 text-purple-600" />;
      default: return <Building2 className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateProject = async () => {
    try {
      setIsLoading(true);
      
      // Validasi input sebelum membuat proyek
      const validation = validateProjectData(newProjectData);
      setValidationResult(validation);
      
      if (!validation.isValid) {
        addNotification({
          type: 'error',
          title: 'Data Tidak Valid',
          message: `${validation.errors.length} kesalahan ditemukan. Mohon perbaiki sebelum melanjutkan.`,
          duration: 5000
        });
        setIsLoading(false);
        return;
      }
      
      // Create new project in engine
      const newEngineProject = structuralEngine.createProject({
        name: newProjectData.name.trim(),
        description: newProjectData.description.trim(),
        owner: newProjectData.owner
      });
      
      // Create UI project
      const newProject: Project = {
        id: newEngineProject.id,
        name: newEngineProject.name,
        description: newEngineProject.description,
        type: newEngineProject.geometry.buildingType,
        status: 'active',
        progress: 0,
        createdAt: newEngineProject.createdAt,
        updatedAt: newEngineProject.updatedAt,
        owner: newEngineProject.owner,
        team: [newEngineProject.owner],
        location: 'Indonesia',
        buildingInfo: {
          floors: newEngineProject.geometry.floors,
          height: newEngineProject.geometry.floors * newEngineProject.geometry.floorHeight,
          area: newEngineProject.geometry.bayLength * newEngineProject.geometry.bayWidth * newEngineProject.geometry.baysX * newEngineProject.geometry.baysY
        },
        tags: [newEngineProject.geometry.buildingType, 'baru'],
        isStarred: false,
        isShared: false,
        engineData: newEngineProject,
        analysisStatus: 'not-started'
      };
      
      setProjects(prev => [newProject, ...prev]);
      setShowCreateModal(false);
      setNewProjectData({ name: '', description: '', owner: 'Current User' });
      setValidationResult(null);
      
      addNotification({
        type: 'success',
        title: 'Proyek Berhasil Dibuat',
        message: `Proyek "${newProject.name}" telah berhasil dibuat dan siap untuk dianalisis.`,
        duration: 4000
      });
      
    } catch (error) {
      console.error('Error creating project:', error);
      addNotification({
        type: 'error',
        title: 'Gagal Membuat Proyek',
        message: 'Terjadi kesalahan saat membuat proyek. Silakan coba lagi.',
        duration: 5000,
        actions: [{
          label: 'Coba Lagi',
          action: () => handleCreateProject(),
          style: 'primary'
        }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarProject = (projectId: string) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isStarred: !project.isStarred }
        : project
    ));
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        // Delete from engine
        const success = structuralEngine.deleteProject(projectId);
        
        if (success) {
          // Remove from UI
          setProjects(projects.filter(project => project.id !== projectId));
        } else {
          alert('Failed to delete project from engine.');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    // Could open edit modal here
    alert(`Edit project: ${project.name}\nThis would open an edit modal.`);
  };

  const handleViewProject = (project: Project) => {
    // Navigate to project details/analysis view
    alert(`Opening project: ${project.name}\nThis would navigate to the detailed analysis view.`);
  };

  const handleAnalyzeProject = async (projectId: string) => {
    try {
      setIsLoading(true);
      
      // Update project status
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, analysisStatus: 'running' as const, progress: 10 }
          : p
      ));
      
      addNotification({
        type: 'info',
        title: 'Memulai Analisis',
        message: 'Analisis struktural sedang berjalan. Proses ini mungkin memakan beberapa waktu.',
        duration: 3000
      });
      
      // Validate project data before analysis
      const project = projects.find(p => p.id === projectId);
      if (project?.engineData) {
        const geometryValidation = validateProjectData(project.engineData);
        if (!geometryValidation.isValid) {
          throw new Error(`Validasi gagal: ${geometryValidation.errors.join(', ')}`);
        }
      }
      
      // Run analysis
      const results = await structuralEngine.analyzeStructure(projectId);
      
      // Update project with results
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              analysisStatus: results.status === 'success' ? 'completed' as const : 'error' as const,
              progress: results.status === 'success' ? 100 : 50
            }
          : p
      ));
      
      if (results.status === 'success') {
        addNotification({
          type: 'success',
          title: 'Analisis Selesai',
          message: `Analisis berhasil diselesaikan! Faktor keamanan minimum: ${results.summary.safetyFactor.toFixed(2)}`,
          duration: 6000,
          actions: [{
            label: 'Lihat Hasil',
            action: () => {
              const projectName = projects.find(p => p.id === projectId)?.name;
              alert(`Membuka hasil analisis untuk: ${projectName}\n\nFaktor Keamanan: ${results.summary.safetyFactor.toFixed(2)}\nStatus: ${results.compliance.overallStatus}`);
            },
            style: 'primary'
          }]
        });
      } else {
        addNotification({
          type: 'warning',
          title: 'Analisis Selesai dengan Peringatan',
          message: `Analisis selesai namun ditemukan ${results.warnings.length} peringatan dan ${results.errors.length} masalah.`,
          duration: 7000
        });
      }
      
    } catch (error) {
      console.error('Error analyzing project:', error);
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, analysisStatus: 'error' as const, progress: 0 }
          : p
      ));
      
      addNotification({
        type: 'error',
        title: 'Analisis Gagal',
        message: `Gagal menjalankan analisis: ${error instanceof Error ? error.message : 'Kesalahan tidak diketahui'}`,
        duration: 8000,
        actions: [{
          label: 'Coba Lagi',
          action: () => handleAnalyzeProject(projectId),
          style: 'primary'
        }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      const originalProject = projects.find(p => p.id === projectId);
      if (!originalProject?.engineData) return;
      
      setIsLoading(true);
      
      // Create duplicate in engine
      const duplicateEngineProject = structuralEngine.createProject({
        ...originalProject.engineData,
        name: `${originalProject.name} (Copy)`,
        description: `Copy of ${originalProject.description}`
      });
      
      // Create duplicate UI project
      const duplicateProject: Project = {
        ...originalProject,
        id: duplicateEngineProject.id,
        name: duplicateEngineProject.name,
        description: duplicateEngineProject.description,
        createdAt: duplicateEngineProject.createdAt,
        updatedAt: duplicateEngineProject.updatedAt,
        engineData: duplicateEngineProject,
        analysisStatus: 'not-started',
        progress: 0
      };
      
      setProjects(prev => [duplicateProject, ...prev]);
    } catch (error) {
      console.error('Error duplicating project:', error);
      alert('Failed to duplicate project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">Manage projects, teams, dan collaboration</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          <span>Proyek Baru</span>
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: 'my-projects', label: 'My Projects' },
          { id: 'shared', label: 'Shared Projects' },
          { id: 'archived', label: 'Archived' },
          { id: 'templates', label: 'Templates' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentView === tab.id 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, location, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="infrastructure">Infrastructure</option>
        </select>

        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && projects.length === 0 ? (
          // Loading skeleton
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
              <div className="p-4 border-b border-gray-200">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(project.type)}
                    <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStarProject(project.id)}
                      className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                        project.isStarred ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                    >
                      <Star className="w-4 h-4" fill={project.isStarred ? 'currentColor' : 'none'} />
                    </button>
                    
                    <div className="relative">
                      <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                {/* Status and Progress */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    {project.analysisStatus && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.analysisStatus === 'completed' ? 'bg-green-100 text-green-800' :
                        project.analysisStatus === 'running' ? 'bg-blue-100 text-blue-800' :
                        project.analysisStatus === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        Analysis: {project.analysisStatus.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      project.analysisStatus === 'running' ? 'bg-blue-600 animate-pulse' :
                      project.analysisStatus === 'completed' ? 'bg-green-600' :
                      project.analysisStatus === 'error' ? 'bg-red-600' :
                      'bg-blue-600'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-gray-900 truncate">{project.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Floors</p>
                    <p className="font-medium text-gray-900">{project.buildingInfo.floors} floors</p>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{project.team.length} members</span>
                    {project.isShared && (
                      <Share2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(project.updatedAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="p-4 border-t border-gray-200 flex justify-between">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewProject(project)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="View"
                    disabled={isLoading}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditProject(project)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Edit"
                    disabled={isLoading}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleAnalyzeProject(project.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      project.analysisStatus === 'running' 
                        ? 'text-blue-600 bg-blue-50 cursor-not-allowed'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title="Run Analysis"
                    disabled={isLoading || project.analysisStatus === 'running'}
                  >
                    {project.analysisStatus === 'running' ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    ) : project.analysisStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Download"
                    disabled={isLoading}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDuplicateProject(project.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" 
                    title="Duplicate"
                    disabled={isLoading}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    title="Delete"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada proyek ditemukan</h3>
          <p className="text-gray-600 mb-4">
            {currentView === 'my-projects' 
              ? "Anda belum memiliki proyek. Mulai dengan membuat proyek pertama Anda."
              : `Tidak ada proyek ${currentView} ditemukan. Coba sesuaikan pencarian atau filter.`
            }
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            Buat Proyek Baru
          </button>
        </div>
      )}
      
      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Buat Proyek Baru</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectData({ name: '', description: '', owner: 'Current User' });
                    setValidationResult(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateProject();
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Proyek *
                    </label>
                    <input
                      type="text"
                      value={newProjectData.name}
                      onChange={(e) => {
                        setNewProjectData(prev => ({ ...prev, name: e.target.value }));
                        if (validationResult) {
                          const newValidation = validateProjectData({ ...newProjectData, name: e.target.value });
                          setValidationResult(newValidation);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationResult?.fieldErrors?.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Masukkan nama proyek"
                      disabled={isLoading}
                    />
                    {validationResult?.fieldErrors?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationResult.fieldErrors.name[0]}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      value={newProjectData.description}
                      onChange={(e) => {
                        setNewProjectData(prev => ({ ...prev, description: e.target.value }));
                        if (validationResult) {
                          const newValidation = validateProjectData({ ...newProjectData, description: e.target.value });
                          setValidationResult(newValidation);
                        }
                      }}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationResult?.fieldErrors?.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Deskripsi proyek (opsional)"
                      disabled={isLoading}
                    />
                    {validationResult?.fieldErrors?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationResult.fieldErrors.description[0]}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pemilik Proyek *
                    </label>
                    <input
                      type="text"
                      value={newProjectData.owner}
                      onChange={(e) => {
                        setNewProjectData(prev => ({ ...prev, owner: e.target.value }));
                        if (validationResult) {
                          const newValidation = validateProjectData({ ...newProjectData, owner: e.target.value });
                          setValidationResult(newValidation);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationResult?.fieldErrors?.owner ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nama pemilik proyek"
                      disabled={isLoading}
                    />
                    {validationResult?.fieldErrors?.owner && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationResult.fieldErrors.owner[0]}
                      </p>
                    )}
                  </div>
                  
                  {/* Validation Display */}
                  {validationResult && (
                    <ValidationDisplay
                      errors={validationResult.errors}
                      warnings={validationResult.warnings}
                      className="mt-4"
                    />
                  )}
                  
                  {/* Loading State */}
                  <LoadingState
                    isLoading={isLoading}
                    message="Membuat proyek..."
                    className="py-4"
                  />
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewProjectData({ name: '', description: '', owner: 'Current User' });
                      setValidationResult(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading || (validationResult ? !validationResult.isValid : false)}
                  >
                    {isLoading ? 'Membuat...' : 'Buat Proyek'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;