/**
 * Cloud Collaboration Interface Component
 * Provides UI for multi-user collaboration and cloud storage
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Structure3D } from '../types/structural';
import { 
  CloudServiceEngine, 
  CloudUser, 
  CloudProject, 
  ProjectComment,
  CloudUtils
} from './CloudServiceEngine';

// Simple UI Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>{children}</div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, disabled = false, className = '' }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 ${className}`}
  >
    {children}
  </button>
);

const Input: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full p-2 border rounded-md"
  />
);

// Props interface
export interface CloudCollaborationInterfaceProps {
  structure: Structure3D | null;
  onStructureUpdate?: (structure: Structure3D) => void;
  className?: string;
}

// Component state
interface CloudState {
  isAuthenticated: boolean;
  currentUser: CloudUser | null;
  currentProject: CloudProject | null;
  projects: CloudProject[];
  comments: ProjectComment[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Cloud Collaboration Interface Component
 */
export const CloudCollaborationInterface: React.FC<CloudCollaborationInterfaceProps> = ({
  structure,
  onStructureUpdate,
  className = ''
}) => {
  // State management
  const [state, setState] = useState<CloudState>({
    isAuthenticated: false,
    currentUser: null,
    currentProject: null,
    projects: [],
    comments: [],
    isLoading: false,
    error: null
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [commentForm, setCommentForm] = useState('');

  const cloudEngine = useRef<CloudServiceEngine | null>(null);

  // Initialize cloud service
  useEffect(() => {
    const initializeCloud = async () => {
      try {
        cloudEngine.current = new CloudServiceEngine();
        await cloudEngine.current.initialize();
      } catch (error) {
        setState(prev => ({ ...prev, error: `Cloud initialization failed: ${error}` }));
      }
    };
    initializeCloud();
  }, []);

  // Authentication
  const handleLogin = useCallback(async () => {
    if (!cloudEngine.current) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await cloudEngine.current.authenticate(loginForm);
      if (user) {
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          currentUser: user,
          isLoading: false
        }));
        
        // Load projects
        const projectsResponse = await cloudEngine.current.listProjects();
        if (projectsResponse.success) {
          setState(prev => ({ ...prev, projects: projectsResponse.data || [] }));
        }
      } else {
        setState(prev => ({ ...prev, error: 'Invalid credentials', isLoading: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: `Login failed: ${error}`, isLoading: false }));
    }
  }, [loginForm]);

  const handleLogout = useCallback(async () => {
    if (!cloudEngine.current) return;
    await cloudEngine.current.signOut();
    setState({
      isAuthenticated: false,
      currentUser: null,
      currentProject: null,
      projects: [],
      comments: [],
      isLoading: false,
      error: null
    });
  }, []);

  // Project management
  const createProject = useCallback(async () => {
    if (!cloudEngine.current || !structure) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const project = await cloudEngine.current.createProject(projectForm.name, structure);
      if (project) {
        setState(prev => ({
          ...prev,
          currentProject: project,
          projects: [...prev.projects, project],
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: `Failed to create project: ${error}`, isLoading: false }));
    }
  }, [structure, projectForm]);

  const loadProject = useCallback(async (projectId: string) => {
    if (!cloudEngine.current) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const project = await cloudEngine.current.loadProject(projectId);
      if (project) {
        setState(prev => ({ ...prev, currentProject: project, isLoading: false }));
        if (onStructureUpdate) {
          onStructureUpdate(project.structure);
        }

        // Load comments
        const comments = await cloudEngine.current.getComments(projectId);
        setState(prev => ({ ...prev, comments }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: `Failed to load project: ${error}`, isLoading: false }));
    }
  }, [onStructureUpdate]);

  const addComment = useCallback(async () => {
    if (!cloudEngine.current || !state.currentProject || !commentForm.trim()) return;

    try {
      const comment = await cloudEngine.current.addComment(state.currentProject.id, commentForm.trim());
      if (comment) {
        setState(prev => ({ ...prev, comments: [...prev.comments, comment] }));
        setCommentForm('');
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: `Failed to add comment: ${error}` }));
    }
  }, [state.currentProject, commentForm]);

  // Render login form
  if (!state.isAuthenticated) {
    return (
      <div className={`max-w-md mx-auto ${className}`}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cloud Authentication</h3>
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-800">
              {state.error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              value={loginForm.email}
              onChange={(value) => setLoginForm(prev => ({ ...prev, email: value }))}
              placeholder="Email"
              type="email"
            />
            <Input
              value={loginForm.password}
              onChange={(value) => setLoginForm(prev => ({ ...prev, password: value }))}
              placeholder="Password"
              type="password"
            />
            <Button
              onClick={handleLogin}
              disabled={state.isLoading || !loginForm.email || !loginForm.password}
              className="w-full"
            >
              {state.isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Render main interface
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Cloud Collaboration</h3>
            <p className="text-sm text-gray-600">{state.currentUser?.displayName}</p>
          </div>
          <Button onClick={handleLogout} className="bg-gray-600 hover:bg-gray-700">
            Logout
          </Button>
        </div>
      </Card>

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
          <strong>Error:</strong> {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Section */}
        <div className="space-y-6">
          {/* Create Project */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Create New Project</h4>
            <div className="space-y-3">
              <Input
                value={projectForm.name}
                onChange={(value) => setProjectForm(prev => ({ ...prev, name: value }))}
                placeholder="Project name"
              />
              <Button
                onClick={createProject}
                disabled={state.isLoading || !projectForm.name || !structure}
              >
                Create Project
              </Button>
            </div>
          </Card>

          {/* Projects List */}
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Your Projects</h4>
            <div className="space-y-2">
              {state.projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                    state.currentProject?.id === project.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => loadProject(project.id)}
                >
                  <h5 className="font-medium">{project.name}</h5>
                  <p className="text-sm text-gray-600">
                    {project.structure.nodes.length} nodes, {project.structure.elements.length} elements
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          {state.currentProject && (
            <>
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Current Project: {state.currentProject.name}</h4>
                <div className="text-sm text-gray-600">
                  <p>Status: {state.currentProject.metadata.status}</p>
                  <p>Last Updated: {new Date(state.currentProject.updatedAt).toLocaleDateString()}</p>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-4">Comments ({state.comments.length})</h4>
                
                {/* Add Comment */}
                <div className="space-y-3 mb-4">
                  <textarea
                    value={commentForm}
                    onChange={(e) => setCommentForm(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="w-full p-2 border rounded-md resize-none"
                  />
                  <Button
                    onClick={addComment}
                    disabled={!commentForm.trim()}
                    className="text-sm px-3 py-1"
                  >
                    Add Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {state.comments.map((comment) => (
                    <div key={comment.id} className="p-2 border rounded bg-gray-50">
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {state.comments.length === 0 && (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudCollaborationInterface;