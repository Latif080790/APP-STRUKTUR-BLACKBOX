/**
 * Enhanced 3D Controls Component
 * Provides advanced controls for 3D viewer including view presets, animations, and display options
 */

import React, { useState, useCallback } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import {
  Camera,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  Palette,
  Play,
  Pause,
  RotateCcw,
  Move3D,
  Layers,
  Settings,
  Info
} from 'lucide-react';

export type ViewPreset = 'isometric' | 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
export type ColorMode = 'material' | 'stress' | 'displacement' | 'member-type' | 'load-path';
export type RenderMode = 'solid' | 'wireframe' | 'both' | 'transparent';

export interface Enhanced3DControlsProps {
  // View Controls
  currentView: ViewPreset;
  onViewChange: (view: ViewPreset) => void;
  onResetView: () => void;
  
  // Display Options
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  showNodes: boolean;
  onShowNodesChange: (show: boolean) => void;
  showElements: boolean;
  onShowElementsChange: (show: boolean) => void;
  showLoads: boolean;
  onShowLoadsChange: (show: boolean) => void;
  showSupports: boolean;
  onShowSupportsChange: (show: boolean) => void;
  
  // Color and Rendering
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
  renderMode: RenderMode;
  onRenderModeChange: (mode: RenderMode) => void;
  
  // Animation
  isAnimating: boolean;
  onAnimationToggle: () => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  animationScale: number;
  onAnimationScaleChange: (scale: number) => void;
  
  // Analysis Results
  hasResults: boolean;
  maxStress?: number;
  maxDisplacement?: number;
  
  className?: string;
}

export const Enhanced3DControls: React.FC<Enhanced3DControlsProps> = ({
  // View Controls
  currentView,
  onViewChange,
  onResetView,
  
  // Display Options
  showLabels,
  onShowLabelsChange,
  showNodes,
  onShowNodesChange,
  showElements,
  onShowElementsChange,
  showLoads,
  onShowLoadsChange,
  showSupports,
  onShowSupportsChange,
  
  // Color and Rendering
  colorMode,
  onColorModeChange,
  renderMode,
  onRenderModeChange,
  
  // Animation
  isAnimating,
  onAnimationToggle,
  animationSpeed,
  onAnimationSpeedChange,
  animationScale,
  onAnimationScaleChange,
  
  // Analysis Results
  hasResults,
  maxStress = 0,
  maxDisplacement = 0,
  
  className = ''
}) => {
  
  const [isExpanded, setIsExpanded] = useState(false);

  const viewPresets = [
    { key: 'isometric' as ViewPreset, label: 'Isometric', icon: Move3D },
    { key: 'front' as ViewPreset, label: 'Front', icon: Eye },
    { key: 'back' as ViewPreset, label: 'Back', icon: Eye },
    { key: 'left' as ViewPreset, label: 'Left', icon: Eye },
    { key: 'right' as ViewPreset, label: 'Right', icon: Eye },
    { key: 'top' as ViewPreset, label: 'Top', icon: Eye },
    { key: 'bottom' as ViewPreset, label: 'Bottom', icon: Eye }
  ];

  const colorModes = [
    { key: 'material' as ColorMode, label: 'Material', description: 'Color by material properties' },
    { key: 'member-type' as ColorMode, label: 'Member Type', description: 'Color by structural member type' },
    ...(hasResults ? [
      { key: 'stress' as ColorMode, label: 'Stress', description: 'Color by stress magnitude' },
      { key: 'displacement' as ColorMode, label: 'Displacement', description: 'Color by displacement magnitude' },
      { key: 'load-path' as ColorMode, label: 'Load Path', description: 'Show load transfer path' }
    ] : [])
  ];

  const renderModes = [
    { key: 'solid' as RenderMode, label: 'Solid', description: 'Solid rendering' },
    { key: 'wireframe' as RenderMode, label: 'Wireframe', description: 'Wireframe only' },
    { key: 'both' as RenderMode, label: 'Both', description: 'Solid with wireframe' },
    { key: 'transparent' as RenderMode, label: 'Transparent', description: 'Transparent solid' }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-base">
            <Camera className="h-4 w-4 mr-2" />
            3D Controls
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* View Presets */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">View Presets</Label>
          <div className="grid grid-cols-4 gap-1">
            {viewPresets.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "outline"}
                size="sm"
                onClick={() => onViewChange(key)}
                className="flex flex-col items-center h-auto py-2"
              >
                <Icon className="h-3 w-3 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>
        </div>

        {/* Quick Display Toggles */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Display Options</Label>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-labels" className="text-xs">Labels</Label>
              <Switch
                id="show-labels"
                checked={showLabels}
                onCheckedChange={onShowLabelsChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-nodes" className="text-xs">Nodes</Label>
              <Switch
                id="show-nodes"
                checked={showNodes}
                onCheckedChange={onShowNodesChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-elements" className="text-xs">Elements</Label>
              <Switch
                id="show-elements"
                checked={showElements}
                onCheckedChange={onShowElementsChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-loads" className="text-xs">Loads</Label>
              <Switch
                id="show-loads"
                checked={showLoads}
                onCheckedChange={onShowLoadsChange}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="show-supports" className="text-xs">Supports</Label>
              <Switch
                id="show-supports"
                checked={showSupports}
                onCheckedChange={onShowSupportsChange}
              />
            </div>
          </div>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="render">Render</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
            </TabsList>

            {/* Color Controls */}
            <TabsContent value="colors" className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Color Mode</Label>
                <div className="space-y-2">
                  {colorModes.map(({ key, label, description }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`color-${key}`}
                        name="colorMode"
                        checked={colorMode === key}
                        onChange={() => onColorModeChange(key)}
                        className="w-3 h-3"
                      />
                      <div>
                        <Label htmlFor={`color-${key}`} className="text-xs font-medium">
                          {label}
                        </Label>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Legend for Stress/Displacement */}
              {(colorMode === 'stress' || colorMode === 'displacement') && hasResults && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <Label className="text-xs font-medium mb-2 block">
                    {colorMode === 'stress' ? 'Stress Scale' : 'Displacement Scale'}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-4 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0</span>
                    <span>
                      {colorMode === 'stress' 
                        ? `${maxStress.toFixed(1)} MPa`
                        : `${maxDisplacement.toFixed(2)} mm`
                      }
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Render Controls */}
            <TabsContent value="render" className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Render Mode</Label>
                <div className="space-y-2">
                  {renderModes.map(({ key, label, description }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`render-${key}`}
                        name="renderMode"
                        checked={renderMode === key}
                        onChange={() => onRenderModeChange(key)}
                        className="w-3 h-3"
                      />
                      <div>
                        <Label htmlFor={`render-${key}`} className="text-xs font-medium">
                          {label}
                        </Label>
                        <p className="text-xs text-gray-500">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Animation Controls */}
            <TabsContent value="animation" className="space-y-4">
              {hasResults ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Animation</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAnimationToggle}
                    >
                      {isAnimating ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Animation Speed: {animationSpeed.toFixed(1)}x</Label>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={([value]) => onAnimationSpeedChange(value)}
                        min={0.1}
                        max={3.0}
                        step={0.1}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Deformation Scale: {animationScale.toFixed(0)}x</Label>
                      <Slider
                        value={[animationScale]}
                        onValueChange={([value]) => onAnimationScaleChange(value)}
                        min={1}
                        max={100}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Info className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm">Run analysis to enable animation</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Analysis Status */}
        {hasResults && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Results Available
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Max Stress:</span>
                <br />
                <span className="text-blue-600">{maxStress.toFixed(1)} MPa</span>
              </div>
              <div>
                <span className="font-medium">Max Displacement:</span>
                <br />
                <span className="text-blue-600">{maxDisplacement.toFixed(2)} mm</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Enhanced3DControls;