/**
 * Enhanced User Experience Component
 * Accessibility improvements, keyboard navigation, and responsive design optimization
 * Following user preferences: English UI, prominent features, consolidated interface
 */

import React, { useState, useEffect } from 'react';
import { 
  Accessibility, Keyboard, Monitor, Eye, 
  Type, Contrast, Navigation, Settings,
  CheckCircle, User, Smartphone
} from 'lucide-react';

interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'inverted';
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
}

export const EnhancedUserExperience: React.FC = () => {
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    keyboardNavigation: true,
    focusIndicators: true
  });

  const [viewportInfo, setViewportInfo] = useState({
    width: 1920,
    height: 1080,
    breakpoint: 'desktop' as 'mobile' | 'tablet' | 'desktop' | 'wide'
  });

  const [activeTab, setActiveTab] = useState<'accessibility' | 'responsive' | 'shortcuts'>('accessibility');

  // Update viewport info
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let breakpoint: typeof viewportInfo.breakpoint = 'desktop';
      if (width < 768) breakpoint = 'mobile';
      else if (width < 1024) breakpoint = 'tablet';
      else if (width >= 1440) breakpoint = 'wide';

      setViewportInfo({ width, height, breakpoint });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px', 'extra-large': '22px' };
    root.style.fontSize = fontSizes[accessibilitySettings.fontSize];

    // Contrast
    root.classList.toggle('high-contrast', accessibilitySettings.contrast === 'high');
    root.classList.toggle('inverted-contrast', accessibilitySettings.contrast === 'inverted');
    
    // Motion and focus
    root.classList.toggle('reduced-motion', accessibilitySettings.reducedMotion);
    root.classList.toggle('enhanced-focus', accessibilitySettings.focusIndicators);
  }, [accessibilitySettings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setAccessibilitySettings(prev => ({ ...prev, [key]: value }));
  };

  const renderAccessibilityTab = () => (
    <div className="space-y-6">
      {/* Font Size */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Type className="w-5 h-5 mr-2 text-blue-600" />
          Font Size & Readability
        </h3>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateSetting('fontSize', size)}
              className={`p-3 rounded-lg border-2 transition-all ${
                accessibilitySettings.fontSize === size
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-base">Aa</div>
              <div className="text-xs mt-1 capitalize">{size.replace('-', ' ')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Contrast Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Contrast className="w-5 h-5 mr-2 text-purple-600" />
          Contrast & Visual Settings
        </h3>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {(['normal', 'high', 'inverted'] as const).map((contrast) => (
            <button
              key={contrast}
              onClick={() => updateSetting('contrast', contrast)}
              className={`p-4 rounded-lg border-2 transition-all ${
                accessibilitySettings.contrast === contrast
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold capitalize">{contrast}</div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={accessibilitySettings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-3"
            />
            <span className="font-medium">Reduce motion and animations</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={accessibilitySettings.focusIndicators}
              onChange={(e) => updateSetting('focusIndicators', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-3"
            />
            <span className="font-medium">Enhanced focus indicators</span>
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-green-600" />
          Navigation & Input Assistance
        </h3>
        
        <label className="flex items-center justify-between">
          <div className="flex items-center">
            <Keyboard className="w-5 h-5 mr-3 text-green-600" />
            <div>
              <span className="font-medium">Keyboard Navigation</span>
              <p className="text-sm text-gray-600">Navigate using Tab, Enter, and arrow keys</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={accessibilitySettings.keyboardNavigation}
            onChange={(e) => updateSetting('keyboardNavigation', e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
        </label>
      </div>
    </div>
  );

  const renderResponsiveTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-blue-600" />
          Current Viewport Information
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">{viewportInfo.width}</div>
            <div className="text-sm text-blue-800">Width (px)</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">{viewportInfo.height}</div>
            <div className="text-sm text-green-800">Height (px)</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">{viewportInfo.breakpoint}</div>
            <div className="text-sm text-purple-800">Breakpoint</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          {[
            { name: 'Mobile', width: 375, icon: Smartphone },
            { name: 'Tablet', width: 768, icon: Monitor },
            { name: 'Desktop', width: 1200, icon: Monitor },
            { name: 'Wide', width: 1920, icon: Monitor }
          ].map((device) => (
            <div key={device.name} className={`p-4 rounded-lg border-2 ${
              device.width <= viewportInfo.width ? 'border-green-500 bg-green-50' : 'border-gray-200'
            }`}>
              <device.icon className={`w-5 h-5 mx-auto mb-2 ${
                device.width <= viewportInfo.width ? 'text-green-600' : 'text-gray-400'
              }`} />
              <div className="text-center font-medium">{device.name}</div>
              {device.width <= viewportInfo.width && (
                <CheckCircle className="w-4 h-4 text-green-600 mx-auto mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderShortcutsTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Keyboard className="w-5 h-5 mr-2 text-purple-600" />
        Keyboard Shortcuts
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { category: 'File Actions', shortcuts: [
            { key: 'Ctrl + S', action: 'Save Project' },
            { key: 'Ctrl + N', action: 'New Analysis' },
            { key: 'Ctrl + O', action: 'Open Project' }
          ]},
          { category: 'Navigation', shortcuts: [
            { key: 'Tab', action: 'Next Element' },
            { key: 'Shift + Tab', action: 'Previous Element' },
            { key: 'Enter', action: 'Activate Element' }
          ]},
          { category: 'Modules', shortcuts: [
            { key: 'Alt + 1', action: 'Analysis Module' },
            { key: 'Alt + 2', action: '3D Viewer' },
            { key: 'Alt + 3', action: 'Reports' }
          ]},
          { category: 'Help', shortcuts: [
            { key: 'F1', action: 'Help' },
            { key: 'Escape', action: 'Close Modal' },
            { key: 'Space', action: 'Run Analysis' }
          ]}
        ].map((group) => (
          <div key={group.category} className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              {group.category}
            </h4>
            <div className="space-y-2">
              {group.shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{shortcut.action}</span>
                  <kbd className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Accessibility className="w-8 h-8 mr-3 text-blue-600" />
                Enhanced User Experience
              </h1>
              <p className="text-gray-600 mt-1">
                Accessibility improvements, responsive design optimization, and user preferences
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {viewportInfo.breakpoint} • {accessibilitySettings.fontSize} font
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              {[
                { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
                { id: 'responsive', label: 'Responsive Design', icon: Monitor },
                { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'accessibility' && renderAccessibilityTab()}
            {activeTab === 'responsive' && renderResponsiveTab()}
            {activeTab === 'shortcuts' && renderShortcutsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserExperience;