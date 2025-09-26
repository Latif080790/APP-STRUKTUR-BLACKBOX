/**
 * Auto-Save Status Indicator
 * Shows current save status and provides manual save controls
 */

import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';
import { useAutoSave, useProjectStore } from '@/stores/projectStore';

interface AutoSaveStatusProps {
  className?: string;
}

const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ className = '' }) => {
  const { enabled, lastSaved, isDirty } = useAutoSave();
  const triggerSave = useProjectStore(state => state.triggerSave);
  const enableAutoSave = useProjectStore(state => state.enableAutoSave);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showManualSave, setShowManualSave] = useState(false);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Calculate time since last save
  const getTimeSinceLastSave = () => {
    if (!lastSaved) return 'Never';
    
    const now = new Date();
    const savedTime = new Date(lastSaved);
    const diffMs = now.getTime() - savedTime.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Get status info
  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: 'Offline',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }

    if (isDirty && enabled) {
      return {
        icon: Clock,
        text: 'Saving...',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }

    if (!isDirty && lastSaved) {
      return {
        icon: Check,
        text: `Saved ${getTimeSinceLastSave()}`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }

    if (!enabled) {
      return {
        icon: AlertCircle,
        text: 'Auto-save disabled',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }

    return {
      icon: Save,
      text: 'Not saved',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const handleManualSave = () => {
    triggerSave();
    setShowManualSave(false);
  };

  const toggleAutoSave = () => {
    enableAutoSave(!enabled);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main status indicator */}
      <div
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${statusInfo.bgColor} ${statusInfo.borderColor} hover:opacity-80`}
        onClick={() => setShowManualSave(!showManualSave)}
        title="Click for save options"
      >
        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
        <span className={`text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </span>
        
        {/* Auto-save indicator */}
        {enabled && isOnline && (
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {showManualSave && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowManualSave(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-4">
              <div className="space-y-3">
                {/* Save status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Save Status</span>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                    <span className={`text-sm ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* Auto-save toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Auto-save</span>
                    {!isOnline && (
                      <WifiOff className="h-4 w-4 text-red-500" aria-label="Requires internet connection" />
                    )}
                  </div>
                  <button
                    onClick={toggleAutoSave}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      enabled && isOnline ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    disabled={!isOnline}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        enabled && isOnline ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Manual save button */}
                <button
                  onClick={handleManualSave}
                  disabled={!isDirty && !isOnline}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {isDirty ? 'Save Now' : 'Saved'}
                  </span>
                </button>

                {/* Last saved info */}
                {lastSaved && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      <div>Last saved: {getTimeSinceLastSave()}</div>
                      <div>Auto-save every 30 seconds</div>
                    </div>
                  </div>
                )}

                {/* Offline notice */}
                {!isOnline && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs text-red-600">
                      <WifiOff className="h-3 w-3" />
                      <span>Working offline - changes saved locally</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AutoSaveStatus;