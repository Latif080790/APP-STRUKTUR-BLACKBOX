import React, { useState, useEffect, useCallback } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Settings,
  MousePointer2,
  Maximize,
  RotateCcw,
  Eye,
  Grid,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Move,
  Hand,
  MousePointer,
  Navigation,
  Layout,
  Layers
} from 'lucide-react';

interface DeviceProfile {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  pixelRatio: number;
  touchEnabled: boolean;
  orientation: 'portrait' | 'landscape';
  icon: React.ReactNode;
}

interface TouchGesture {
  type: 'tap' | 'double-tap' | 'long-press' | 'pinch' | 'pan' | 'swipe';
  fingers: number;
  action: string;
  description: string;
}

interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
  columns: number;
  padding: string;
  fontSize: string;
  iconSize: string;
}

const MobileResponsivenessOptimization: React.FC = () => {
  const [currentDevice, setCurrentDevice] = useState<DeviceProfile | null>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [touchMode, setTouchMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [gestureDemo, setGestureDemo] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Device profiles for testing
  const deviceProfiles: DeviceProfile[] = [
    {
      id: 'iphone-14',
      name: 'iPhone 14',
      type: 'mobile',
      width: 393,
      height: 852,
      pixelRatio: 3,
      touchEnabled: true,
      orientation: 'portrait',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      id: 'samsung-galaxy',
      name: 'Samsung Galaxy S23',
      type: 'mobile',
      width: 412,
      height: 915,
      pixelRatio: 2.75,
      touchEnabled: true,
      orientation: 'portrait',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      id: 'ipad-pro',
      name: 'iPad Pro 12.9"',
      type: 'tablet',
      width: 1024,
      height: 1366,
      pixelRatio: 2,
      touchEnabled: true,
      orientation: 'portrait',
      icon: <Tablet className="w-5 h-5" />
    },
    {
      id: 'surface-pro',
      name: 'Surface Pro',
      type: 'tablet',
      width: 1368,
      height: 912,
      pixelRatio: 1.5,
      touchEnabled: true,
      orientation: 'landscape',
      icon: <Tablet className="w-5 h-5" />
    },
    {
      id: 'desktop',
      name: 'Desktop 1920x1080',
      type: 'desktop',
      width: 1920,
      height: 1080,
      pixelRatio: 1,
      touchEnabled: false,
      orientation: 'landscape',
      icon: <Monitor className="w-5 h-5" />
    }
  ];

  // Touch gestures for structural engineering app
  const touchGestures: TouchGesture[] = [
    {
      type: 'tap',
      fingers: 1,
      action: 'Select Element',
      description: 'Single tap to select structural elements or activate buttons'
    },
    {
      type: 'double-tap',
      fingers: 1,
      action: 'Zoom to Fit',
      description: 'Double tap to zoom to fit selected element or reset view'
    },
    {
      type: 'long-press',
      fingers: 1,
      action: 'Context Menu',
      description: 'Long press to open context menu with element properties'
    },
    {
      type: 'pinch',
      fingers: 2,
      action: 'Zoom In/Out',
      description: 'Pinch to zoom in/out of the 3D model or 2D drawings'
    },
    {
      type: 'pan',
      fingers: 1,
      action: 'Move View',
      description: 'Single finger drag to pan around the model'
    },
    {
      type: 'pan',
      fingers: 2,
      action: 'Rotate View',
      description: 'Two finger drag to rotate the 3D model view'
    },
    {
      type: 'swipe',
      fingers: 1,
      action: 'Navigate Tabs',
      description: 'Swipe left/right to navigate between analysis tabs'
    },
    {
      type: 'swipe',
      fingers: 3,
      action: 'Toggle Panels',
      description: 'Three finger swipe to show/hide side panels'
    }
  ];

  // Responsive breakpoints
  const breakpoints: ResponsiveBreakpoint[] = [
    {
      name: 'Mobile Portrait',
      minWidth: 0,
      maxWidth: 480,
      columns: 1,
      padding: '1rem',
      fontSize: '0.875rem',
      iconSize: '1.25rem'
    },
    {
      name: 'Mobile Landscape',
      minWidth: 481,
      maxWidth: 768,
      columns: 2,
      padding: '1.5rem',
      fontSize: '0.875rem',
      iconSize: '1.25rem'
    },
    {
      name: 'Tablet Portrait',
      minWidth: 769,
      maxWidth: 1024,
      columns: 3,
      padding: '2rem',
      fontSize: '1rem',
      iconSize: '1.5rem'
    },
    {
      name: 'Tablet Landscape',
      minWidth: 1025,
      maxWidth: 1366,
      columns: 4,
      padding: '2rem',
      fontSize: '1rem',
      iconSize: '1.5rem'
    },
    {
      name: 'Desktop',
      minWidth: 1367,
      columns: 6,
      padding: '2.5rem',
      fontSize: '1rem',
      iconSize: '1.5rem'
    }
  ];

  // Update viewport size on window resize
  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

  // Auto-detect device type based on viewport
  useEffect(() => {
    const detectDevice = () => {
      const width = viewportSize.width;
      if (width <= 768) {
        setCurrentDevice(deviceProfiles[0]); // Mobile
      } else if (width <= 1024) {
        setCurrentDevice(deviceProfiles[2]); // Tablet
      } else {
        setCurrentDevice(deviceProfiles[4]); // Desktop
      }
    };

    if (viewportSize.width > 0) {
      detectDevice();
    }
  }, [viewportSize, deviceProfiles]);

  const handleDeviceChange = useCallback((device: DeviceProfile) => {
    setCurrentDevice(device);
    setOrientation(device.orientation);
    setTouchMode(device.touchEnabled);
  }, []);

  const handleOrientationToggle = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
    if (currentDevice) {
      setCurrentDevice(prev => prev ? {
        ...prev,
        width: prev.height,
        height: prev.width,
        orientation: orientation === 'portrait' ? 'landscape' : 'portrait'
      } : null);
    }
  }, [orientation, currentDevice]);

  const getCurrentBreakpoint = useCallback(() => {
    const width = currentDevice?.width || viewportSize.width;
    return breakpoints.find(bp => 
      width >= bp.minWidth && (bp.maxWidth ? width <= bp.maxWidth : true)
    ) || breakpoints[breakpoints.length - 1];
  }, [currentDevice, viewportSize.width, breakpoints]);

  const renderDevicePreview = () => {
    if (!currentDevice) return null;

    const scale = Math.min(400 / currentDevice.width, 300 / currentDevice.height);
    const scaledWidth = currentDevice.width * scale;
    const scaledHeight = currentDevice.height * scale;

    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {currentDevice.name} ({currentDevice.width}×{currentDevice.height})
          </span>
          <button
            onClick={handleOrientationToggle}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            title="Rotate Device"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div 
          className="border-2 border-gray-300 rounded-lg bg-white shadow-lg relative overflow-hidden"
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
        >
          {/* Device Status Bar */}
          <div className="h-6 bg-gray-900 flex items-center justify-between px-2">
            <div className="text-white text-xs">9:41</div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
              <div className="text-white text-xs">100%</div>
            </div>
          </div>
          
          {/* App Preview */}
          <div className="flex-1 p-2 bg-gray-50">
            <div className="grid grid-cols-2 gap-2 h-full">
              <div className="bg-blue-100 rounded p-2 text-xs">
                <div className="font-semibold mb-1">Design Module</div>
                <div className="text-gray-600">Concrete analysis tools optimized for mobile</div>
              </div>
              <div className="bg-green-100 rounded p-2 text-xs">
                <div className="font-semibold mb-1">3D Viewer</div>
                <div className="text-gray-600">Touch-enabled 3D navigation</div>
              </div>
              <div className="bg-yellow-100 rounded p-2 text-xs">
                <div className="font-semibold mb-1">Reports</div>
                <div className="text-gray-600">Mobile-friendly calculations</div>
              </div>
              <div className="bg-purple-100 rounded p-2 text-xs">
                <div className="font-semibold mb-1">Export</div>
                <div className="text-gray-600">One-tap sharing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTouchGestureDemo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <MousePointer2 className="w-5 h-5" />
        Touch Gestures
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {touchGestures.map((gesture, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                {gesture.type === 'tap' && <MousePointer className="w-4 h-4 text-blue-600" />}
                {gesture.type === 'double-tap' && <MousePointer className="w-4 h-4 text-blue-600" />}
                {gesture.type === 'long-press' && <Hand className="w-4 h-4 text-blue-600" />}
                {gesture.type === 'pinch' && <ZoomIn className="w-4 h-4 text-blue-600" />}
                {gesture.type === 'pan' && <Move className="w-4 h-4 text-blue-600" />}
                {gesture.type === 'swipe' && <Navigation className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {gesture.fingers} Finger {gesture.type.charAt(0).toUpperCase() + gesture.type.slice(1)}
                </h4>
                <p className="text-sm font-medium text-blue-600">{gesture.action}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{gesture.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResponsiveBreakpoints = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Layout className="w-5 h-5" />
        Responsive Breakpoints
      </h3>
      
      <div className="space-y-3">
        {breakpoints.map((breakpoint, index) => {
          const isActive = breakpoint === getCurrentBreakpoint();
          return (
            <div 
              key={index}
              className={`p-4 border-2 rounded-lg transition-all ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{breakpoint.name}</h4>
                {isActive && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                    Active
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Width:</span>
                  <div className="font-medium">
                    {breakpoint.minWidth}px{breakpoint.maxWidth ? ` - ${breakpoint.maxWidth}px` : '+'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Columns:</span>
                  <div className="font-medium">{breakpoint.columns}</div>
                </div>
                <div>
                  <span className="text-gray-600">Padding:</span>
                  <div className="font-medium">{breakpoint.padding}</div>
                </div>
                <div>
                  <span className="text-gray-600">Font Size:</span>
                  <div className="font-medium">{breakpoint.fontSize}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mobile Responsiveness Optimization</h2>
            <p className="text-gray-600">Touch interface, responsive design, and mobile-first approach</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Current: {viewportSize.width}×{viewportSize.height}
          </span>
        </div>
      </div>

      {/* Device Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Device Testing</h3>
        <div className="flex flex-wrap gap-2">
          {deviceProfiles.map(device => (
            <button
              key={device.id}
              onClick={() => handleDeviceChange(device)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                currentDevice?.id === device.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {device.icon}
              <span className="text-sm font-medium">{device.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Device Preview */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Preview</h3>
        <div className="flex justify-center">
          {renderDevicePreview()}
        </div>
      </div>

      {/* Touch Gestures */}
      <div className="mb-8">
        {renderTouchGestureDemo()}
      </div>

      {/* Responsive Breakpoints */}
      <div className="mb-8">
        {renderResponsiveBreakpoints()}
      </div>

      {/* Mobile Optimization Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Optimization Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <MousePointer2 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-800">Touch-First Interface</h4>
            </div>
            <p className="text-sm text-gray-600">
              Large touch targets, gesture navigation, and haptic feedback for engineering tools
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-3 mb-2">
              <Grid className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-800">Adaptive Layout</h4>
            </div>
            <p className="text-sm text-gray-600">
              Dynamic grid system that adapts to screen size and orientation changes
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-800">Optimized Performance</h4>
            </div>
            <p className="text-sm text-gray-600">
              Lazy loading, efficient rendering, and reduced memory usage for mobile devices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileResponsivenessOptimization;