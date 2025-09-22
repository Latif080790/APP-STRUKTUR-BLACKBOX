/**
 * Project Manager Component
 * Provides UI for project management, auto-save, undo/redo, and data persistence
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Save,
  FolderOpen,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  Undo,
  Redo,
  Settings,
  Clock,
  FileText,
  History,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useStructuralStateManager, ProjectState } from '@/hooks/useStructuralStateManager';

interface ProjectManagerProps {
  onProjectChange?: (project: ProjectState | null) => void;
  onStateUpdate?: (updates: Partial<ProjectState>) => void;
  className?: string;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  onProjectChange,
  onStateUpdate,
  className = ''
}) => {
  const {
    currentProject,
    isModified,
    isSaving,
    lastSaveTime,
    history,
    canUndo,
    canRedo,
    settings,
    initializeProject,
    loadProject,
    saveProject,
    createNewProject,
    duplicateProject,
    deleteProject,
    getAllProjects,
    updateProjectState,
    undo,
    redo,
    exportProject,
    importProject,
    updateSettings
  } = useStructuralStateManager();

  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [importData, setImportData] = useState('');

  // Load all projects on component mount
  useEffect(() => {
    setProjects(getAllProjects());
  }, [getAllProjects]);

  // Notify parent of project changes
  useEffect(() => {
    if (onProjectChange) {
      onProjectChange(currentProject);
    }
  }, [currentProject, onProjectChange]);

  // Handle project creation
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const newProject = createNewProject({
      name: newProjectName.trim(),
      description: `Created on ${new Date().toLocaleDateString()}`
    });

    if (newProject) {
      setProjects(getAllProjects());
      setNewProjectName('');
      setShowProjectDialog(false);
    }
  };

  // Handle project loading
  const handleLoadProject = (projectId: string) => {
    const project = loadProject(projectId);
    if (project) {
      setProjects(getAllProjects());
      setShowProjectDialog(false);
    }
  };

  // Handle project duplication
  const handleDuplicateProject = (project: ProjectState) => {
    const duplicated = duplicateProject(project);
    if (duplicated) {
      setProjects(getAllProjects());
    }
  };

  // Handle project deletion
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
      setProjects(getAllProjects());
    }
  };

  // Handle manual save
  const handleSave = async () => {
    await saveProject();
  };

  // Handle export
  const handleExport = () => {
    const data = exportProject('json');
    if (data && currentProject) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.name.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const imported = importProject(content);
        if (imported) {
          setProjects(getAllProjects());
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle state updates
  const handleStateUpdate = (updates: Partial<ProjectState>, description?: string) => {
    const newState = updateProjectState(updates, description);
    if (newState && onStateUpdate) {
      onStateUpdate(updates);
    }
  };

  // Format time since last save
  const formatTimeSince = (date: Date | null) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Project Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="font-semibold">{currentProject?.name || 'No Project'}</h3>
                <p className="text-sm text-gray-500">
                  {currentProject ? (
                    <>
                      Last saved: {formatTimeSince(lastSaveTime)}
                      {isModified && <Badge variant="secondary" className="ml-2">Modified</Badge>}
                      {isSaving && <Badge variant="outline" className="ml-2">Saving...</Badge>}
                    </>
                  ) : 'Create or load a project to begin'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Undo/Redo */}
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>

              {/* Save */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={!currentProject || !isModified || isSaving}
                title="Save Project"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>

              {/* Auto-save indicator */}
              {settings.autoSave && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Auto-save
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Project Management */}
        <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FolderOpen className="h-4 w-4 mr-1" />
              Projects
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Project Management</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="open" className="w-full">
              <TabsList>
                <TabsTrigger value="open">Open Project</TabsTrigger>
                <TabsTrigger value="new">New Project</TabsTrigger>
              </TabsList>

              <TabsContent value="open" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {projects.map(project => (
                    <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm">{project.name}</CardTitle>
                            <p className="text-xs text-gray-500">
                              Modified: {new Date(project.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateProject(project)}
                              title="Duplicate"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-gray-600 mb-2">{project.description}</p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleLoadProject(project.id)}
                        >
                          Load Project
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Project Name</label>
                    <Input
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Project
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* History */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={!currentProject}>
              <History className="h-4 w-4 mr-1" />
              History
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project History</DialogTitle>
            </DialogHeader>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No history available</p>
              ) : (
                history.slice().reverse().map((entry, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{entry.action}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        {entry.description && (
                          <p className="text-xs text-gray-600 mt-1">{entry.description}</p>
                        )}
                      </div>
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Export */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={!currentProject}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>

        {/* Import */}
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-1" />
            Import
          </Button>
        </div>

        {/* Settings */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Settings</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Auto-save settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-save</h4>
                    <p className="text-sm text-gray-500">Automatically save changes</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                  />
                </div>

                {settings.autoSave && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Save Interval: {Math.floor(settings.saveInterval / 1000)} seconds
                    </label>
                    <Slider
                      value={[settings.saveInterval / 1000]}
                      onValueChange={([value]) => updateSettings({ saveInterval: value * 1000 })}
                      min={5}
                      max={300}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* History settings */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Max History Size: {settings.maxHistorySize}
                </label>
                <Slider
                  value={[settings.maxHistorySize]}
                  onValueChange={([value]) => updateSettings({ maxHistorySize: value })}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Number of undo/redo operations to keep
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Alerts */}
      {!currentProject && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No project is currently loaded. Create a new project or load an existing one to begin.
          </AlertDescription>
        </Alert>
      )}

      {currentProject && isModified && !settings.autoSave && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to save your work!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProjectManager;