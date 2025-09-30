/**
 * Advanced Visualization Interface Component
 * Provides user interface for VR and stress contour visualization
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Structure3D } from '../../types/structural';
import { 
  AdvancedVisualizationEngine,
  VisualizationConfig,
  VRConfig,
  VisualizationResult,
  StressContour,
  VisualizationUtils
} from './AdvancedVisualizationEngine';

// Simple UI Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b p-4">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'default' | 'outline' | 'destructive';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'default', disabled = false, className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400',
    destructive: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Slider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label?: string;
}> = ({ value, onChange, min, max, step = 1, label }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium">{label}</label>}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
    <div className="text-xs text-gray-500">{value}</div>
  </div>
);

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; }[];
  label?: string;
}> = ({ value, onChange, options, label }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded-md bg-white"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
    />
    {label && <label className="text-sm">{label}</label>}
  </div>
);

// Icons as simple SVGs
const VRIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="8" width="22" height="8" rx="2" ry="2"/>
    <path d="m9 15 0 4"/>
    <path d="m15 15 0 4"/>
    <path d="m9 19 6 0"/>
  </svg>
);

const StressIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="m12 1 0 6m0 6 0 6"/>
    <path d="m17 5-3.5 3.5"/>
    <path d="m14 14-3.5 3.5"/>
    <path d="m7 5 3.5 3.5"/>
    <path d="m10 14 3.5 3.5"/>
  </svg>
);

// Props interface
export interface AdvancedVisualizationInterfaceProps {
  structure: Structure3D | null;
  analysisResults?: any;
  className?: string;
}

// Component state
interface VisualizationState {
  isInitialized: boolean;
  isRendering: boolean;
  isVRActive: boolean;
  isAnimationPlaying: boolean;
  currentFrame: number;
  config: VisualizationConfig;
  vrConfig: VRConfig;
  result: VisualizationResult | null;
  error: string | null;
}

/**
 * Advanced Visualization Interface Component
 */
export const AdvancedVisualizationInterface: React.FC<AdvancedVisualizationInterfaceProps> = ({
  structure,
  analysisResults,
  className = ''
}) => {
  // State management
  const [state, setState] = useState<VisualizationState>({
    isInitialized: false,
    isRendering: false,
    isVRActive: false,
    isAnimationPlaying: false,
    currentFrame: 0,
    config: {
      enableVR: true,
      enableStressContours: true,
      enableDeformationAnimation: true,
      enableForceFlow: true,
      renderQuality: 'high',
      frameRate: 60,
      shadows: true,
      antiAliasing: true,
      backgroundColor: '#f0f0f0',
      gridEnabled: true
    },
    vrConfig: {
      enabled: true,
      roomScale: true,
      handTracking: false,
      snapTurning: true,
      teleportMovement: true,
      controllerInteraction: true,
      hapticFeedback: true
    },
    result: null,
    error: null
  });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<AdvancedVisualizationEngine | null>(null);
  const animationRef = useRef<number>(0);

  // Initialize visualization engine
  useEffect(() => {
    const initializeEngine = async () => {
      if (!canvasRef.current) return;

      try {
        engineRef.current = new AdvancedVisualizationEngine(state.config);
        const initialized = await engineRef.current.initialize(canvasRef.current);
        
        setState(prev => ({
          ...prev,
          isInitialized: initialized,
          error: initialized ? null : 'Failed to initialize visualization engine'
        }));

      } catch (error) {
        setState(prev => ({
          ...prev,
          error: `Initialization failed: ${error}`
        }));
      }
    };

    initializeEngine();
  }, []);

  // Render visualization
  const renderVisualization = useCallback(async () => {
    if (!structure || !engineRef.current || state.isRendering) return;

    setState(prev => ({ ...prev, isRendering: true, error: null }));

    try {
      const result = await engineRef.current.render(structure, analysisResults);
      setState(prev => ({
        ...prev,
        isRendering: false,
        result
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isRendering: false,
        error: `Rendering failed: ${error}`
      }));
    }
  }, [structure, analysisResults, state.isRendering]);

  // Start VR session
  const startVR = useCallback(async () => {
    if (!engineRef.current) return;

    try {
      const started = await engineRef.current.startVRSession();
      setState(prev => ({
        ...prev,
        isVRActive: started,
        error: started ? null : 'Failed to start VR session'
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `VR start failed: ${error}`
      }));
    }
  }, []);

  // Stop VR session
  const stopVR = useCallback(async () => {
    if (!engineRef.current) return;

    try {
      await engineRef.current.stopVRSession();
      setState(prev => ({ ...prev, isVRActive: false }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `VR stop failed: ${error}`
      }));
    }
  }, []);

  // Toggle animation playback
  const toggleAnimation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAnimationPlaying: !prev.isAnimationPlaying
    }));

    if (!state.isAnimationPlaying && state.result?.deformationFrames) {
      // Start animation loop
      const animate = () => {
        setState(prev => {
          if (!prev.isAnimationPlaying) return prev;
          
          const nextFrame = (prev.currentFrame + 1) % (state.result?.deformationFrames.length || 1);
          return { ...prev, currentFrame: nextFrame };
        });

        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else {
      // Stop animation
      cancelAnimationFrame(animationRef.current);
    }
  }, [state.isAnimationPlaying, state.result]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<VisualizationConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }));

    if (engineRef.current) {
      engineRef.current.updateConfig(newConfig);
    }
  }, []);

  // Update VR configuration
  const updateVRConfig = useCallback((newVRConfig: Partial<VRConfig>) => {
    setState(prev => ({
      ...prev,
      vrConfig: { ...prev.vrConfig, ...newVRConfig }
    }));

    if (engineRef.current) {
      engineRef.current.updateVRConfig(newVRConfig);
    }
  }, []);

  // Render stress contour legend
  const renderStressLegend = (contour: StressContour) => (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Stress Contour - {contour.stressType}</h4>
      <div className="flex items-center space-x-2 text-xs">
        <span>Min: {contour.minValue.toFixed(1)} {contour.units}</span>
        <div className="flex-1 h-4 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
        <span>Max: {contour.maxValue.toFixed(1)} {contour.units}</span>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <VRIcon className="w-8 h-8 text-purple-600" />
              <div>
                <CardTitle>Advanced Visualization</CardTitle>
                <p className="text-sm text-gray-600">VR support and stress contour visualization</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={renderVisualization}
                disabled={!structure || !state.isInitialized || state.isRendering}
                variant="default"
              >
                {state.isRendering ? 'Rendering...' : 'Render'}
              </Button>
              
              {state.isVRActive ? (
                <Button onClick={stopVR} variant="destructive">
                  <VRIcon className="w-4 h-4 mr-2" />
                  Stop VR
                </Button>
              ) : (
                <Button 
                  onClick={startVR} 
                  disabled={!state.isInitialized}
                  variant="outline"
                >
                  <VRIcon className="w-4 h-4 mr-2" />
                  Start VR
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Error Display */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-800">
              <strong>Error:</strong> {state.error}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Visualization Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>3D Visualization</span>
                {state.isVRActive && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    VR Active
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-96 border rounded-lg bg-gray-100"
                style={{ maxHeight: '400px' }}
              />
              
              {/* Animation Controls */}
              {state.result?.deformationFrames && state.result.deformationFrames.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Deformation Animation</h4>
                    <Button
                      onClick={toggleAnimation}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      {state.isAnimationPlaying ? (
                        <PauseIcon className="w-4 h-4" />
                      ) : (
                        <PlayIcon className="w-4 h-4" />
                      )}
                      <span>{state.isAnimationPlaying ? 'Pause' : 'Play'}</span>
                    </Button>
                  </div>
                  
                  <Slider
                    value={state.currentFrame}
                    onChange={(frame) => setState(prev => ({ ...prev, currentFrame: frame }))}
                    min={0}
                    max={(state.result?.deformationFrames.length || 1) - 1}
                    label={`Frame: ${state.currentFrame + 1} / ${state.result?.deformationFrames.length || 0}`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Visualization Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                checked={state.config.enableStressContours}
                onChange={(checked) => updateConfig({ enableStressContours: checked })}
                label="Stress Contours"
              />
              
              <Toggle
                checked={state.config.enableDeformationAnimation}
                onChange={(checked) => updateConfig({ enableDeformationAnimation: checked })}
                label="Deformation Animation"
              />
              
              <Toggle
                checked={state.config.enableForceFlow}
                onChange={(checked) => updateConfig({ enableForceFlow: checked })}
                label="Force Flow"
              />
              
              <Toggle
                checked={state.config.shadows}
                onChange={(checked) => updateConfig({ shadows: checked })}
                label="Shadows"
              />
              
              <Toggle
                checked={state.config.antiAliasing}
                onChange={(checked) => updateConfig({ antiAliasing: checked })}
                label="Anti-aliasing"
              />

              <Select
                value={state.config.renderQuality}
                onChange={(value) => updateConfig({ renderQuality: value as any })}
                options={[
                  { value: 'low', label: 'Low Quality' },
                  { value: 'medium', label: 'Medium Quality' },
                  { value: 'high', label: 'High Quality' },
                  { value: 'ultra', label: 'Ultra Quality' }
                ]}
                label="Render Quality"
              />

              <Slider
                value={state.config.frameRate}
                onChange={(value) => updateConfig({ frameRate: value })}
                min={30}
                max={120}
                step={10}
                label="Target FPS"
              />
            </CardContent>
          </Card>

          {/* VR Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <VRIcon className="w-5 h-5" />
                <span>VR Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Toggle
                checked={state.vrConfig.roomScale}
                onChange={(checked) => updateVRConfig({ roomScale: checked })}
                label="Room Scale"
              />
              
              <Toggle
                checked={state.vrConfig.handTracking}
                onChange={(checked) => updateVRConfig({ handTracking: checked })}
                label="Hand Tracking"
              />
              
              <Toggle
                checked={state.vrConfig.snapTurning}
                onChange={(checked) => updateVRConfig({ snapTurning: checked })}
                label="Snap Turning"
              />
              
              <Toggle
                checked={state.vrConfig.teleportMovement}
                onChange={(checked) => updateVRConfig({ teleportMovement: checked })}
                label="Teleport Movement"
              />
              
              <Toggle
                checked={state.vrConfig.hapticFeedback}
                onChange={(checked) => updateVRConfig({ hapticFeedback: checked })}
                label="Haptic Feedback"
              />
            </CardContent>
          </Card>

          {/* Performance Info */}
          {state.result && (
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>FPS:</span>
                  <span className="font-mono">{state.result.performance.fps.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frame Time:</span>
                  <span className="font-mono">{state.result.performance.frameTime.toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Vertices:</span>
                  <span className="font-mono">{state.result.renderingInfo.totalVertices.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span className="font-mono">{state.result.renderingInfo.memoryUsage.toFixed(1)}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>VR Support:</span>
                  <span className={state.result.vrSupported ? 'text-green-600' : 'text-red-600'}>
                    {state.result.vrSupported ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stress Contour Legend */}
          {state.result?.stressContours && state.result.stressContours.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <StressIcon className="w-5 h-5" />
                  <span>Stress Legend</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.result.stressContours.slice(0, 3).map((contour, index) => (
                  <div key={index}>
                    {renderStressLegend(contour)}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedVisualizationInterface;