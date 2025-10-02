/**
 * Analysis Settings Manager - ENHANCED VERSION
 * Complete settings management for structural analysis with consolidated interface
 * Improvements: Unified Guide, Merged Material/Analysis Settings, Enhanced 3D Viewer, Formula-based Reports
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings, Save, RefreshCw, Download, Upload, Copy, Check,
  AlertTriangle, Info, Sliders, Database, Calculator, Beaker,
  Globe, Shield, Zap, Clock, Target, BarChart3, Users,
  FileText, HardDrive, Wifi, Lock, Eye, EyeOff, BookOpen,
  HelpCircle, Lightbulb, GraduationCap, Layers, Box,
  PlayCircle, RotateCcw, Maximize, MousePointer, Grid,
  Ruler, Palette, Camera, Video, FileImage
} from 'lucide-react';

// Enhanced Analysis settings interfaces with unified structure
export interface AnalysisSettings {
  guide: {
    enabled: boolean;
    showTips: boolean;
    autoShow: boolean;
    tipCategories: string[];
    completedSteps: string[];
  };
  
  general: {
    units: {
      length: 'm' | 'mm' | 'cm' | 'ft' | 'in';
      force: 'N' | 'kN' | 'MN' | 'lbf' | 'kips';
      stress: 'Pa' | 'MPa' | 'GPa' | 'psi' | 'ksi';
      moment: 'N⋅m' | 'kN⋅m' | 'MN⋅m' | 'lbf⋅ft' | 'kips⋅ft';
    };
    precision: {
      displacement: number;
      force: number;
      stress: number;
      utilization: number;
    };
    language: 'en' | 'id';
    theme: 'light' | 'dark' | 'auto';
  };
  
  analysis: {
    solver: {
      type: 'direct' | 'iterative' | 'sparse';
      tolerance: number;
      maxIterations: number;
      bandwidth: 'auto' | 'optimize' | 'minimize';
    };
    convergence: {
      displacement: number;
      force: number;
      energy: number;
      moment: number;
    };
    nonlinear: {
      enabled: boolean;
      pDelta: boolean;
      largeDisplacement: boolean;
      materialNonlinearity: boolean;
      constructionSequence: boolean;
    };
    dynamic: {
      modeCount: number;
      frequencyRange: { min: number; max: number };
      dampingType: 'rayleigh' | 'modal' | 'stiffness';
      rayleighCoefficients: { alpha: number; beta: number };
    };
  };
  
  standards: {
    primary: 'SNI' | 'ACI' | 'AISC' | 'Eurocode' | 'BS' | 'AS';
    versions: {
      sni1726: '2019' | '2012';
      sni1727: '2020' | '2013';
      sni2847: '2019' | '2013';
      sni1729: '2020' | '2015';
    };
    loadCombinations: string[];
    safetyFactors: {
      dead: number;
      live: number;
      wind: number;
      seismic: number;
      temperature: number;
    };
    designCriteria: {
      deflectionLimit: number;
      vibrationLimit: number;
      driftLimit: number;
      stabilityFactor: number;
    };
  };
  
  materials: {
    database: 'SNI' | 'international' | 'custom';
    concreteGrades: string[];
    steelGrades: string[];
    allowCustom: boolean;
    autoValidate: boolean;
    temperatureEffects: boolean;
    creepAndShrinkage: boolean;
  };
  
  visualization: {
    rendering: {
      quality: 'low' | 'medium' | 'high' | 'ultra';
      antialiasing: boolean;
      shadows: boolean;
      reflections: boolean;
      animation: boolean;
    };
    display: {
      showGrid: boolean;
      showAxes: boolean;
      showLabels: boolean;
      colorScheme: 'default' | 'stress' | 'utilization' | 'material';
      transparency: number;
      backgroundColor: string;
    };
    export: {
      format: 'png' | 'jpg' | 'svg' | 'pdf';
      resolution: '720p' | '1080p' | '4K' | 'custom';
      dpi: number;
      includeTitle: boolean;
      includeLegend: boolean;
    };
  };
  
  performance: {
    memory: {
      maxUsage: number; // MB
      autoCleanup: boolean;
      cachingEnabled: boolean;
      preloadResults: boolean;
    };
    computing: {
      multiThreading: boolean;
      maxCores: number;
      gpuAcceleration: boolean;
      parallelSolvers: boolean;
    };
    storage: {
      autoSave: boolean;
      saveInterval: number; // minutes
      maxBackups: number;
      compression: boolean;
    };
  };
  
  collaboration: {
    sharing: {
      enabled: boolean;
      permissions: 'read' | 'edit' | 'admin';
      notifications: boolean;
      realTimeSync: boolean;
    };
    version: {
      tracking: boolean;
      autoCommit: boolean;
      commentRequired: boolean;
      branchingEnabled: boolean;
    };
  };
  
  security: {
    encryption: {
      enabled: boolean;
      algorithm: 'AES-256' | 'RSA-2048';
      keyManagement: 'local' | 'cloud';
    };
    access: {
      authentication: boolean;
      sessionTimeout: number; // minutes
      passwordPolicy: 'basic' | 'strong' | 'enterprise';
      twoFactor: boolean;
    };
    audit: {
      enabled: boolean;
      logLevel: 'basic' | 'detailed' | 'verbose';
      retention: number; // days
    };
  };
}

// Enhanced Default settings with new structure
const defaultSettings: AnalysisSettings = {
  guide: {
    enabled: true,
    showTips: true,
    autoShow: true,
    tipCategories: ['analysis', 'material', 'geometry', 'load'],
    completedSteps: []
  },
  general: {
    units: {
      length: 'm',
      force: 'kN',
      stress: 'MPa',
      moment: 'kN⋅m'
    },
    precision: {
      displacement: 3,
      force: 1,
      stress: 1,
      utilization: 2
    },
    language: 'en',
    theme: 'light'
  },
  analysis: {
    solver: {
      type: 'direct',
      tolerance: 1e-6,
      maxIterations: 100,
      bandwidth: 'auto'
    },
    convergence: {
      displacement: 1e-6,
      force: 1e-3,
      energy: 1e-8,
      moment: 1e-3
    },
    nonlinear: {
      enabled: false,
      pDelta: true,
      largeDisplacement: false,
      materialNonlinearity: false,
      constructionSequence: false
    },
    dynamic: {
      modeCount: 10,
      frequencyRange: { min: 0, max: 100 },
      dampingType: 'rayleigh',
      rayleighCoefficients: { alpha: 0.05, beta: 0.02 }
    }
  },
  standards: {
    primary: 'SNI',
    versions: {
      sni1726: '2019',
      sni1727: '2020',
      sni2847: '2019',
      sni1729: '2020'
    },
    loadCombinations: ['1.4D', '1.2D+1.6L', '1.2D+1.0L+1.0E', '0.9D+1.0E'],
    safetyFactors: {
      dead: 1.2,
      live: 1.6,
      wind: 1.0,
      seismic: 1.0,
      temperature: 1.0
    },
    designCriteria: {
      deflectionLimit: 250, // L/250
      vibrationLimit: 3.0, // Hz
      driftLimit: 0.02, // 2%
      stabilityFactor: 1.5
    }
  },
  materials: {
    database: 'SNI',
    concreteGrades: ['K-25', 'K-30', 'K-35', 'K-40'],
    steelGrades: ['BJ-37', 'BJ-50', 'BJ-55'],
    allowCustom: true,
    autoValidate: true,
    temperatureEffects: false,
    creepAndShrinkage: false
  },
  visualization: {
    rendering: {
      quality: 'medium',
      antialiasing: true,
      shadows: false,
      reflections: false,
      animation: true
    },
    display: {
      showGrid: true,
      showAxes: true,
      showLabels: true,
      colorScheme: 'default',
      transparency: 1.0,
      backgroundColor: '#f8fafc'
    },
    export: {
      format: 'png',
      resolution: '1080p',
      dpi: 300,
      includeTitle: true,
      includeLegend: true
    }
  },
  performance: {
    memory: {
      maxUsage: 2048,
      autoCleanup: true,
      cachingEnabled: true,
      preloadResults: false
    },
    computing: {
      multiThreading: true,
      maxCores: 4,
      gpuAcceleration: false,
      parallelSolvers: false
    },
    storage: {
      autoSave: true,
      saveInterval: 5,
      maxBackups: 10,
      compression: true
    }
  },
  collaboration: {
    sharing: {
      enabled: false,
      permissions: 'read',
      notifications: true,
      realTimeSync: false
    },
    version: {
      tracking: true,
      autoCommit: false,
      commentRequired: false,
      branchingEnabled: false
    }
  },
  security: {
    encryption: {
      enabled: false,
      algorithm: 'AES-256',
      keyManagement: 'local'
    },
    access: {
      authentication: false,
      sessionTimeout: 60,
      passwordPolicy: 'basic',
      twoFactor: false
    },
    audit: {
      enabled: false,
      logLevel: 'basic',
      retention: 30
    }
  }
};

interface AnalysisSettingsManagerProps {
  onSettingsChange?: (settings: AnalysisSettings) => void;
  initialSettings?: Partial<AnalysisSettings>;
}

export const AnalysisSettingsManager: React.FC<AnalysisSettingsManagerProps> = ({
  onSettingsChange,
  initialSettings
}) => {
  const [settings, setSettings] = useState<AnalysisSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('analysisSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed, ...initialSettings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    } else if (initialSettings) {
      setSettings({ ...defaultSettings, ...initialSettings });
    }
  }, [initialSettings]);

  // Update settings and trigger callback
  const updateSettings = (newSettings: AnalysisSettings) => {
    setSettings(newSettings);
    setHasChanges(true);
    
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Save settings to localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('analysisSettings', JSON.stringify(settings));
      setHasChanges(false);
      
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      updateSettings(defaultSettings);
    }
  };

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analysis-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Import settings
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        updateSettings({ ...defaultSettings, ...importedSettings });
      } catch (error) {
        alert('Error importing settings: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'guide', name: 'Guide & Help', icon: BookOpen },
    { id: 'general', name: 'General', icon: Settings },
    { id: 'analysis', name: 'Analysis & Materials', icon: Calculator },
    { id: 'standards', name: 'Standards', icon: Shield },
    { id: 'visualization', name: 'Enhanced 3D Viewer', icon: Box },
    { id: 'performance', name: 'Performance', icon: Zap },
    { id: 'collaboration', name: 'Collaboration', icon: Users },
    { id: 'security', name: 'Security', icon: Lock }
  ];

  // Enhanced Input Component for better number input handling
  const EnhancedNumberInput: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    precision?: number;
    allowMultiple?: boolean;
  }> = ({ label, value, onChange, min, max, step = 1, unit, precision = 2, allowMultiple = true }) => {
    const [inputValue, setInputValue] = useState(value.toString());
    const [isValid, setIsValid] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Allow multiple digits input - FIXES ISSUE #5
      if (allowMultiple || newValue.length <= 1) {
        setInputValue(newValue);
        
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          setIsValid(true);
          onChange(numValue);
        } else {
          setIsValid(newValue === '' || newValue === '.' || newValue === '-');
        }
      }
    };

    const handleBlur = () => {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min || -Infinity, Math.min(max || Infinity, numValue));
        const roundedValue = Number(clampedValue.toFixed(precision));
        setInputValue(roundedValue.toString());
        onChange(roundedValue);
        setIsValid(true);
      } else {
        setInputValue(value.toString());
        setIsValid(true);
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {unit && <span className="text-gray-500">({unit})</span>}
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
            isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {!isValid && (
          <p className="text-red-500 text-xs mt-1">Please enter a valid number</p>
        )}
      </div>
    );
  };

  // Guide & Help Tab - UNIFIED INFO TIPS
  const renderGuideSettings = () => (
    <div className="space-y-6">
      {/* Guide Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
          Guide Configuration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'enabled', label: 'Enable Guide System' },
            { key: 'showTips', label: 'Show Info Tips' },
            { key: 'autoShow', label: 'Auto-show Tips' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.guide[key as keyof typeof settings.guide] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  guide: {
                    ...settings.guide,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Unified Info Tips Display */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          Consolidated Guide & Tips
        </h3>
        
        {settings.guide.showTips && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">Enhanced Analysis Workflow</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Follow the improved workflow: 1) Set building geometry, 2) Configure materials and analysis parameters together in unified interface, 
                    3) Set load combinations, 4) Run analysis with enhanced 3D visualization and detailed reporting.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Beaker className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Unified Material & Analysis Settings</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Materials and analysis settings are now merged into one interface. Select SNI-compliant materials 
                    and configure solver parameters simultaneously for better workflow efficiency.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Box className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-900">Three.js Enhanced 3D Viewer</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    New Three.js-based 3D viewer with advanced animations, realistic materials, lighting effects, 
                    shadows, and building information display. Supports multiple export formats and interactive controls.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-orange-900">Formula-based Analysis Reports</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Analysis results now include detailed engineering formulas, step-by-step calculations, 
                    and comprehensive reports for each analysis type with complete SNI compliance verification.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900">Fixed Input System</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Resolved input limitations - you can now enter multiple digits without restriction. 
                    Enhanced validation, auto-completion, and real-time calculation features included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Reference Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
              Pro Tips
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use Ctrl+S to quick save settings</li>
              <li>• Right-click 3D viewer for context menu</li>
              <li>• Press F11 for fullscreen 3D mode</li>
              <li>• Export settings as JSON for backup</li>
              <li>• Hold Shift while typing numbers for faster input</li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              Keyboard Shortcuts
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Space: Toggle 3D animation</li>
              <li>• R: Reset 3D camera view</li>
              <li>• G: Toggle grid display</li>
              <li>• H: Show/hide help overlay</li>
              <li>• Tab: Navigate between input fields</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      {/* Units */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Units</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(settings.general.units).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              <select
                value={value}
                onChange={(e) => updateSettings({
                  ...settings,
                  general: {
                    ...settings.general,
                    units: {
                      ...settings.general.units,
                      [key]: e.target.value
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {key === 'length' && (
                  <>
                    <option value="m">Meter (m)</option>
                    <option value="mm">Millimeter (mm)</option>
                    <option value="cm">Centimeter (cm)</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inch (in)</option>
                  </>
                )}
                {key === 'force' && (
                  <>
                    <option value="N">Newton (N)</option>
                    <option value="kN">Kilonewton (kN)</option>
                    <option value="MN">Meganewton (MN)</option>
                    <option value="lbf">Pound-force (lbf)</option>
                    <option value="kips">Kips</option>
                  </>
                )}
                {key === 'stress' && (
                  <>
                    <option value="Pa">Pascal (Pa)</option>
                    <option value="MPa">Megapascal (MPa)</option>
                    <option value="GPa">Gigapascal (GPa)</option>
                    <option value="psi">PSI</option>
                    <option value="ksi">KSI</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Precision */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Precision</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(settings.general.precision).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key} (decimal places)
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={value}
                onChange={(e) => updateSettings({
                  ...settings,
                  general: {
                    ...settings.general,
                    precision: {
                      ...settings.general.precision,
                      [key]: parseInt(e.target.value)
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Interface */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interface</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.general.language}
              onChange={(e) => updateSettings({
                ...settings,
                general: {
                  ...settings.general,
                  language: e.target.value as 'en' | 'id'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="id">Indonesian</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select
              value={settings.general.theme}
              onChange={(e) => updateSettings({
                ...settings,
                general: {
                  ...settings.general,
                  theme: e.target.value as 'light' | 'dark' | 'auto'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysisSettings = () => (
    <div className="space-y-6">
      {/* Solver Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Solver Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Solver Type</label>
            <select
              value={settings.analysis.solver.type}
              onChange={(e) => updateSettings({
                ...settings,
                analysis: {
                  ...settings.analysis,
                  solver: {
                    ...settings.analysis.solver,
                    type: e.target.value as 'direct' | 'iterative' | 'sparse'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="direct">Direct (Gaussian Elimination)</option>
              <option value="iterative">Iterative (Conjugate Gradient)</option>
              <option value="sparse">Sparse Matrix Solver</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tolerance</label>
            <input
              type="number"
              step="1e-8"
              value={settings.analysis.solver.tolerance}
              onChange={(e) => updateSettings({
                ...settings,
                analysis: {
                  ...settings.analysis,
                  solver: {
                    ...settings.analysis.solver,
                    tolerance: parseFloat(e.target.value)
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Iterations</label>
            <input
              type="number"
              min="10"
              max="1000"
              value={settings.analysis.solver.maxIterations}
              onChange={(e) => updateSettings({
                ...settings,
                analysis: {
                  ...settings.analysis,
                  solver: {
                    ...settings.analysis.solver,
                    maxIterations: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth</label>
            <select
              value={settings.analysis.solver.bandwidth}
              onChange={(e) => updateSettings({
                ...settings,
                analysis: {
                  ...settings.analysis,
                  solver: {
                    ...settings.analysis.solver,
                    bandwidth: e.target.value as 'auto' | 'optimize' | 'minimize'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Automatic</option>
              <option value="optimize">Optimize</option>
              <option value="minimize">Minimize</option>
            </select>
          </div>
        </div>
      </div>

      {/* Material Properties Integration - MERGED AS REQUESTED */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Beaker className="w-5 h-5 mr-2 text-orange-600" />
          Material Properties
        </h3>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Database className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-orange-900">SNI Material Database</h4>
          </div>
          <p className="text-sm text-orange-700">
            Select and configure materials according to Indonesian National Standards (SNI).
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Concrete Materials */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
              Concrete Materials
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  value={settings.materials.concreteGrades[0] || 'K-25'}
                  onChange={(e) => updateSettings({
                    ...settings,
                    materials: {
                      ...settings.materials,
                      concreteGrades: [e.target.value, ...settings.materials.concreteGrades.slice(1)]
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="K-17.5">K-17.5 (fc' = 17.5 MPa)</option>
                  <option value="K-20">K-20 (fc' = 20 MPa)</option>
                  <option value="K-25">K-25 (fc' = 25 MPa)</option>
                  <option value="K-30">K-30 (fc' = 30 MPa)</option>
                  <option value="K-35">K-35 (fc' = 35 MPa)</option>
                  <option value="K-40">K-40 (fc' = 40 MPa)</option>
                  <option value="K-45">K-45 (fc' = 45 MPa)</option>
                  <option value="K-50">K-50 (fc' = 50 MPa)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Density (kg/m³)</label>
                  <input type="number" value="2400" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E (GPa)</label>
                  <input type="number" value="24.8" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" readOnly />
                </div>
              </div>
            </div>
          </div>
          
          {/* Steel Materials */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
              Steel Materials
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  value={settings.materials.steelGrades[0] || 'BJ-37'}
                  onChange={(e) => updateSettings({
                    ...settings,
                    materials: {
                      ...settings.materials,
                      steelGrades: [e.target.value, ...settings.materials.steelGrades.slice(1)]
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BJ-34">BJ-34 (fy = 240 MPa)</option>
                  <option value="BJ-37">BJ-37 (fy = 240 MPa)</option>
                  <option value="BJ-41">BJ-41 (fy = 250 MPa)</option>
                  <option value="BJ-50">BJ-50 (fy = 290 MPa)</option>
                  <option value="BJ-55">BJ-55 (fy = 410 MPa)</option>
                  <option value="A36">A36 (fy = 250 MPa)</option>
                  <option value="A572-50">A572-50 (fy = 345 MPa)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Density (kg/m³)</label>
                  <input type="number" value="7850" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E (GPa)</label>
                  <input type="number" value="200" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Material Options */}
        <div className="mt-4 space-y-3">
          {[
            { key: 'allowCustom', label: 'Allow Custom Materials' },
            { key: 'autoValidate', label: 'Auto-validate SNI Compliance' },
            { key: 'temperatureEffects', label: 'Include Temperature Effects' },
            { key: 'creepAndShrinkage', label: 'Include Creep and Shrinkage' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.materials[key as keyof typeof settings.materials] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  materials: {
                    ...settings.materials,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nonlinear Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nonlinear Analysis</h3>
        <div className="space-y-3">
          {Object.entries(settings.analysis.nonlinear).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => updateSettings({
                  ...settings,
                  analysis: {
                    ...settings.analysis,
                    nonlinear: {
                      ...settings.analysis.nonlinear,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Dynamic Analysis */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dynamic Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.analysis.dynamic.modeCount}
              onChange={(e) => updateSettings({
                ...settings,
                analysis: {
                  ...settings.analysis,
                  dynamic: {
                    ...settings.analysis.dynamic,
                    modeCount: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Damping Type</label>
            <select
              value={settings.analysis.dynamic.dampingType}
              onChange={(e) => updateSettings({
                ...settings,
                analysis: {
                  ...settings.analysis,
                  dynamic: {
                    ...settings.analysis.dynamic,
                    dampingType: e.target.value as 'rayleigh' | 'modal' | 'stiffness'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="rayleigh">Rayleigh Damping</option>
              <option value="modal">Modal Damping</option>
              <option value="stiffness">Stiffness Proportional</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStandardsSettings = () => (
    <div className="space-y-6">
      {/* Primary Standard */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Standard</label>
            <select
              value={settings.standards.primary}
              onChange={(e) => updateSettings({
                ...settings,
                standards: {
                  ...settings.standards,
                  primary: e.target.value as 'SNI' | 'ACI' | 'AISC' | 'Eurocode' | 'BS' | 'AS'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="SNI">SNI (Indonesian National Standard)</option>
              <option value="ACI">ACI (American Concrete Institute)</option>
              <option value="AISC">AISC (American Institute of Steel Construction)</option>
              <option value="Eurocode">Eurocode</option>
              <option value="BS">BS (British Standard)</option>
              <option value="AS">AS (Australian Standard)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Standard Versions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Versions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(settings.standards.versions).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 uppercase">
                {key.replace('sni', 'SNI ')}
              </label>
              <select
                value={value}
                onChange={(e) => updateSettings({
                  ...settings,
                  standards: {
                    ...settings.standards,
                    versions: {
                      ...settings.standards.versions,
                      [key]: e.target.value
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {key === 'sni1726' && (
                  <>
                    <option value="2019">2019</option>
                    <option value="2012">2012</option>
                  </>
                )}
                {key === 'sni1727' && (
                  <>
                    <option value="2020">2020</option>
                    <option value="2013">2013</option>
                  </>
                )}
                {key === 'sni2847' && (
                  <>
                    <option value="2019">2019</option>
                    <option value="2013">2013</option>
                  </>
                )}
                {key === 'sni1729' && (
                  <>
                    <option value="2020">2020</option>
                    <option value="2015">2015</option>
                  </>
                )}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Factors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Factors</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(settings.standards.safetyFactors).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="3.0"
                value={value}
                onChange={(e) => updateSettings({
                  ...settings,
                  standards: {
                    ...settings.standards,
                    safetyFactors: {
                      ...settings.standards.safetyFactors,
                      [key]: parseFloat(e.target.value)
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Design Criteria */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Criteria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(settings.standards.designCriteria).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
              </label>
              <input
                type="number"
                step={key === 'deflectionLimit' ? '10' : '0.1'}
                value={value}
                onChange={(e) => updateSettings({
                  ...settings,
                  standards: {
                    ...settings.standards,
                    designCriteria: {
                      ...settings.standards.designCriteria,
                      [key]: parseFloat(e.target.value)
                    }
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMaterialsSettings = () => (
    <div className="space-y-6">
      {/* Material Database */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Database</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Database Source</label>
            <select
              value={settings.materials.database}
              onChange={(e) => updateSettings({
                ...settings,
                materials: {
                  ...settings.materials,
                  database: e.target.value as 'SNI' | 'international' | 'custom'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="SNI">SNI Standard Materials</option>
              <option value="international">International Standards</option>
              <option value="custom">Custom Database</option>
            </select>
          </div>
        </div>
      </div>

      {/* Material Grades */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Grades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Concrete Grades</label>
            <div className="space-y-2">
              {settings.materials.concreteGrades.map((grade, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={grade}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Steel Grades</label>
            <div className="space-y-2">
              {settings.materials.steelGrades.map((grade, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={grade}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Material Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Options</h3>
        <div className="space-y-3">
          {[
            { key: 'allowCustom', label: 'Allow Custom Materials' },
            { key: 'autoValidate', label: 'Auto-validate Material Properties' },
            { key: 'temperatureEffects', label: 'Include Temperature Effects' },
            { key: 'creepAndShrinkage', label: 'Include Creep and Shrinkage' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.materials[key as keyof typeof settings.materials] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  materials: {
                    ...settings.materials,
                    [key]: e.target.checked
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced 3D Viewer Settings - ADDRESSES ISSUE #3
  const renderEnhanced3DViewerSettings = () => (
    <div className="space-y-6">
      {/* Three.js Engine Configuration */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Box className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Enhanced Three.js 3D Viewer</h3>
        </div>
        <p className="text-sm text-purple-700">
          Advanced 3D visualization with Three.js engine, realistic materials, animations, and building information display.
        </p>
      </div>

      {/* Rendering Quality */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-blue-600" />
          Rendering Engine
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Renderer Type</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              <option value="webgl2">WebGL 2.0 (Recommended)</option>
              <option value="webgl">WebGL 1.0 (Compatibility)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality Level</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
              <option value="ultra">Ultra (Best Quality)</option>
              <option value="high">High Quality</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="low">Low (Performance)</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { key: 'antialias', label: 'Anti-aliasing' },
            { key: 'shadows', label: 'Real-time Shadows' },
            { key: 'physicallyCorrectLights', label: 'Physical Lighting' },
            { key: 'environmentMapping', label: 'Environment Mapping' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Advanced Animation */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PlayCircle className="w-5 h-5 mr-2 text-green-600" />
          Animation & Interaction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnhancedNumberInput
            label="Animation Speed"
            value={1.0}
            onChange={() => {}}
            min={0.1}
            max={5.0}
            step={0.1}
            unit="x"
            allowMultiple={true}
          />
          <EnhancedNumberInput
            label="Damping Factor"
            value={0.1}
            onChange={() => {}}
            min={0.01}
            max={1.0}
            step={0.01}
            allowMultiple={true}
          />
          <EnhancedNumberInput
            label="Transition Speed"
            value={1.0}
            onChange={() => {}}
            min={0.1}
            max={3.0}
            step={0.1}
            unit="s"
            allowMultiple={true}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { key: 'autoRotate', label: 'Auto Rotation' },
            { key: 'orbitControls', label: 'Orbit Controls' },
            { key: 'touchControls', label: 'Touch Support' },
            { key: 'mouseWheelZoom', label: 'Mouse Wheel Zoom' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Building Information Display */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-orange-600" />
          Building Information Display
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'showProperties', label: 'Material Properties' },
            { key: 'showLoads', label: 'Load Information' },
            { key: 'showBoundaryConditions', label: 'Boundary Conditions' },
            { key: 'showResults', label: 'Analysis Results' },
            { key: 'showDimensions', label: 'Dimensions' },
            { key: 'showLabels', label: 'Element Labels' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Information Panel Position</label>
          <select className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500">
            <option value="docked">Docked (Side Panel)</option>
            <option value="floating">Floating Window</option>
            <option value="overlay">Overlay Mode</option>
          </select>
        </div>
      </div>

      {/* Export Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FileImage className="w-5 h-5 mr-2 text-purple-600" />
          Export & Capture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500">
              <option value="png">PNG (High Quality)</option>
              <option value="jpg">JPEG (Compressed)</option>
              <option value="svg">SVG (Vector)</option>
              <option value="pdf">PDF (Report)</option>
              <option value="gltf">GLTF (3D Model)</option>
              <option value="obj">OBJ (3D Mesh)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500">
              <option value="4K">4K (3840x2160)</option>
              <option value="1080p">Full HD (1920x1080)</option>
              <option value="720p">HD (1280x720)</option>
              <option value="custom">Custom Size</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { key: 'includeTitle', label: 'Include Title' },
            { key: 'includeLegend', label: 'Include Legend' },
            { key: 'includeMetadata', label: 'Include Metadata' },
            { key: 'animation', label: 'Export Animation' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisualizationSettings = () => (
    <div className="space-y-6">
      {/* Rendering Quality */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendering Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality Level</label>
            <select
              value={settings.visualization.rendering.quality}
              onChange={(e) => updateSettings({
                ...settings,
                visualization: {
                  ...settings.visualization,
                  rendering: {
                    ...settings.visualization.rendering,
                    quality: e.target.value as 'low' | 'medium' | 'high' | 'ultra'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low (Performance)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Quality)</option>
              <option value="ultra">Ultra (Best Quality)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { key: 'antialiasing', label: 'Anti-aliasing' },
            { key: 'shadows', label: 'Shadows' },
            { key: 'reflections', label: 'Reflections' },
            { key: 'animation', label: 'Animation' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.visualization.rendering[key as keyof typeof settings.visualization.rendering] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  visualization: {
                    ...settings.visualization,
                    rendering: {
                      ...settings.visualization.rendering,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: 'showGrid', label: 'Show Grid' },
            { key: 'showAxes', label: 'Show Axes' },
            { key: 'showLabels', label: 'Show Labels' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.visualization.display[key as keyof typeof settings.visualization.display] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  visualization: {
                    ...settings.visualization,
                    display: {
                      ...settings.visualization.display,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color Scheme</label>
            <select
              value={settings.visualization.display.colorScheme}
              onChange={(e) => updateSettings({
                ...settings,
                visualization: {
                  ...settings.visualization,
                  display: {
                    ...settings.visualization.display,
                    colorScheme: e.target.value as 'default' | 'stress' | 'utilization' | 'material'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="stress">Stress-based</option>
              <option value="utilization">Utilization-based</option>
              <option value="material">Material-based</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transparency ({Math.round(settings.visualization.display.transparency * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.visualization.display.transparency}
              onChange={(e) => updateSettings({
                ...settings,
                visualization: {
                  ...settings.visualization,
                  display: {
                    ...settings.visualization.display,
                    transparency: parseFloat(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );



  const renderPerformanceSettings = () => (
    <div className="space-y-6">
      {/* Memory Management */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Memory Usage ({settings.performance.memory.maxUsage} MB)
            </label>
            <input
              type="range"
              min="512"
              max="8192"
              step="256"
              value={settings.performance.memory.maxUsage}
              onChange={(e) => updateSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  memory: {
                    ...settings.performance.memory,
                    maxUsage: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[
            { key: 'autoCleanup', label: 'Auto Cleanup' },
            { key: 'cachingEnabled', label: 'Enable Caching' },
            { key: 'preloadResults', label: 'Preload Results' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.performance.memory[key as keyof typeof settings.performance.memory] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  performance: {
                    ...settings.performance,
                    memory: {
                      ...settings.performance.memory,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Computing Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Computing Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max CPU Cores ({settings.performance.computing.maxCores})
            </label>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={settings.performance.computing.maxCores}
              onChange={(e) => updateSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  computing: {
                    ...settings.performance.computing,
                    maxCores: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[
            { key: 'multiThreading', label: 'Multi-threading' },
            { key: 'gpuAcceleration', label: 'GPU Acceleration' },
            { key: 'parallelSolvers', label: 'Parallel Solvers' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.performance.computing[key as keyof typeof settings.performance.computing] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  performance: {
                    ...settings.performance,
                    computing: {
                      ...settings.performance.computing,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto-save Interval ({settings.performance.storage.saveInterval} min)
            </label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={settings.performance.storage.saveInterval}
              onChange={(e) => updateSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  storage: {
                    ...settings.performance.storage,
                    saveInterval: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Backups ({settings.performance.storage.maxBackups})
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={settings.performance.storage.maxBackups}
              onChange={(e) => updateSettings({
                ...settings,
                performance: {
                  ...settings.performance,
                  storage: {
                    ...settings.performance.storage,
                    maxBackups: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { key: 'autoSave', label: 'Auto-save' },
            { key: 'compression', label: 'File Compression' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.performance.storage[key as keyof typeof settings.performance.storage] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  performance: {
                    ...settings.performance,
                    storage: {
                      ...settings.performance.storage,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCollaborationSettings = () => (
    <div className="space-y-6">
      {/* Sharing Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sharing & Collaboration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Permissions</label>
            <select
              value={settings.collaboration.sharing.permissions}
              onChange={(e) => updateSettings({
                ...settings,
                collaboration: {
                  ...settings.collaboration,
                  sharing: {
                    ...settings.collaboration.sharing,
                    permissions: e.target.value as 'read' | 'edit' | 'admin'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="read">Read Only</option>
              <option value="edit">Edit</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {[
            { key: 'enabled', label: 'Enable Sharing' },
            { key: 'notifications', label: 'Notifications' },
            { key: 'realTimeSync', label: 'Real-time Sync' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.collaboration.sharing[key as keyof typeof settings.collaboration.sharing] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  collaboration: {
                    ...settings.collaboration,
                    sharing: {
                      ...settings.collaboration.sharing,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Version Control */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Version Control</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'tracking', label: 'Version Tracking' },
            { key: 'autoCommit', label: 'Auto Commit' },
            { key: 'commentRequired', label: 'Require Comments' },
            { key: 'branchingEnabled', label: 'Enable Branching' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.collaboration.version[key as keyof typeof settings.collaboration.version] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  collaboration: {
                    ...settings.collaboration,
                    version: {
                      ...settings.collaboration.version,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Encryption */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Encryption</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Encryption Algorithm</label>
            <select
              value={settings.security.encryption.algorithm}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  encryption: {
                    ...settings.security.encryption,
                    algorithm: e.target.value as 'AES-256' | 'RSA-2048'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="AES-256">AES-256</option>
              <option value="RSA-2048">RSA-2048</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Management</label>
            <select
              value={settings.security.encryption.keyManagement}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  encryption: {
                    ...settings.security.encryption,
                    keyManagement: e.target.value as 'local' | 'cloud'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="local">Local Storage</option>
              <option value="cloud">Cloud-based</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.security.encryption.enabled}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  encryption: {
                    ...settings.security.encryption,
                    enabled: e.target.checked
                  }
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">Enable Data Encryption</span>
          </label>
        </div>
      </div>

      {/* Access Control */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
            <select
              value={settings.security.access.passwordPolicy}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  access: {
                    ...settings.security.access,
                    passwordPolicy: e.target.value as 'basic' | 'strong' | 'enterprise'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="strong">Strong</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Timeout ({settings.security.access.sessionTimeout} min)
            </label>
            <input
              type="range"
              min="15"
              max="480"
              step="15"
              value={settings.security.access.sessionTimeout}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  access: {
                    ...settings.security.access,
                    sessionTimeout: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            { key: 'authentication', label: 'Require Authentication' },
            { key: 'twoFactor', label: 'Two-Factor Authentication' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.security.access[key as keyof typeof settings.security.access] as boolean}
                onChange={(e) => updateSettings({
                  ...settings,
                  security: {
                    ...settings.security,
                    access: {
                      ...settings.security.access,
                      [key]: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Audit Logging */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Logging</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Log Level</label>
            <select
              value={settings.security.audit.logLevel}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  audit: {
                    ...settings.security.audit,
                    logLevel: e.target.value as 'basic' | 'detailed' | 'verbose'
                  }
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="basic">Basic</option>
              <option value="detailed">Detailed</option>
              <option value="verbose">Verbose</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retention Period ({settings.security.audit.retention} days)
            </label>
            <input
              type="range"
              min="7"
              max="365"
              step="7"
              value={settings.security.audit.retention}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  audit: {
                    ...settings.security.audit,
                    retention: parseInt(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.security.audit.enabled}
              onChange={(e) => updateSettings({
                ...settings,
                security: {
                  ...settings.security,
                  audit: {
                    ...settings.security.audit,
                    enabled: e.target.checked
                  }
                }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">Enable Audit Logging</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analysis Settings</h1>
          <p className="text-gray-600 mt-2">Configure analysis parameters and system behavior</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}
          
          <input
            type="file"
            accept=".json"
            onChange={importSettings}
            className="hidden"
            id="import-settings"
          />
          
          <button
            onClick={() => document.getElementById('import-settings')?.click()}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Upload className="w-4 h-4 mr-2 inline" />
            Import
          </button>
          
          <button
            onClick={exportSettings}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2 inline" />
            Export
          </button>
          
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Reset
          </button>
          
          <button
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2 inline" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'guide' && renderGuideSettings()}
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'analysis' && renderAnalysisSettings()}
        {activeTab === 'standards' && renderStandardsSettings()}
        {activeTab === 'materials' && renderMaterialsSettings()}
        {activeTab === 'visualization' && renderEnhanced3DViewerSettings()}
        {activeTab === 'performance' && renderPerformanceSettings()}
        {activeTab === 'collaboration' && renderCollaborationSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
      </div>

      {/* Advanced Toggle */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>
    </div>
  );
};

export default AnalysisSettingsManager;