/**
 * Recovery Modal for handling corrupt data and crash recovery
 * Provides user-friendly recovery options when data corruption is detected
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, RotateCcw, Download, Trash2, CheckCircle } from 'lucide-react';
import { useRecovery, useProjectStore } from '@/stores/projectStore';

interface RecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackupInfo {
  key: string;
  timestamp: string;
  size: string;
  projectName?: string;
  isValid: boolean;
}

const RecoveryModal: React.FC<RecoveryModalProps> = ({ isOpen, onClose }) => {
  const { hasCorruptData, recoveryData, recoverFromBackup, clearRecovery } = useRecovery();
  const [availableBackups, setAvailableBackups] = useState<BackupInfo[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'detection' | 'options' | 'recovering' | 'success' | 'failed'>('detection');

  // Scan for available backups on mount
  useEffect(() => {
    if (isOpen) {
      scanForBackups();
    }
  }, [isOpen]);

  const scanForBackups = () => {
    try {
      const backups: BackupInfo[] = [];
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('project-backup-')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              const timestamp = key.replace('project-backup-', '');
              const date = new Date(parseInt(timestamp));
              
              backups.push({
                key,
                timestamp: date.toLocaleString(),
                size: `${Math.round(data.length / 1024)} KB`,
                projectName: parsed.name || 'Unknown Project',
                isValid: !!(parsed.geometry && parsed.materials && parsed.loads)
              });
            }
          } catch (e) {
            console.warn(`Invalid backup found: ${key}`);
          }
        }
      });
      
      // Sort by timestamp (newest first)
      backups.sort((a, b) => {
        const timestampA = parseInt(a.key.replace('project-backup-', ''));
        const timestampB = parseInt(b.key.replace('project-backup-', ''));
        return timestampB - timestampA;
      });
      
      setAvailableBackups(backups);
    } catch (error) {
      console.error('Failed to scan backups:', error);
      setAvailableBackups([]);
    }
  };

  const handleRecoverFromBackup = async (backupKey?: string) => {
    setIsRecovering(true);
    setRecoveryStep('recovering');

    try {
      if (backupKey) {
        // Recover from specific backup
        const data = localStorage.getItem(backupKey);
        if (data) {
          const parsed = JSON.parse(data);
          const store = useProjectStore.getState();
          
          store.updateProject({
            ...parsed,
            name: `${parsed.name} (Recovered)`,
            lastModified: new Date().toISOString()
          });
        }
      } else {
        // Use store's recovery mechanism
        const success = recoverFromBackup();
        if (!success) {
          throw new Error('Recovery failed');
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Show recovery progress
      
      setRecoveryStep('success');
      clearRecovery();
      
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to ensure clean state
      }, 2000);

    } catch (error) {
      console.error('Recovery failed:', error);
      setRecoveryStep('failed');
    } finally {
      setIsRecovering(false);
    }
  };

  const handleStartFresh = () => {
    try {
      // Clear all data and start fresh
      localStorage.removeItem('project-store');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('project-backup-')) {
          localStorage.removeItem(key);
        }
      });
      
      clearRecovery();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to start fresh:', error);
    }
  };

  const handleExportCorruptData = () => {
    if (recoveryData) {
      const dataStr = JSON.stringify(recoveryData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `corrupt-project-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200 bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-xl font-semibold text-red-800">Data Recovery Required</h2>
            <p className="text-red-600 text-sm">
              We detected corrupted data in your project. Let's get you back up and running.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {recoveryStep === 'detection' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Data Corruption Detected
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your project data appears to be corrupted, possibly due to:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Browser crash or unexpected shutdown</li>
                        <li>Storage quota exceeded</li>
                        <li>Browser data corruption</li>
                        <li>Extension conflicts</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Recovery Options</h3>
                
                <div className="grid gap-4">
                  {availableBackups.length > 0 && (
                    <button
                      onClick={() => setRecoveryStep('options')}
                      className="p-4 border border-green-200 rounded-lg hover:bg-green-50 text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <RotateCcw className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">
                            Restore from Backup
                          </div>
                          <div className="text-sm text-green-600">
                            {availableBackups.length} backup(s) available
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => handleRecoverFromBackup()}
                    className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-left transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">
                          Auto Recovery
                        </div>
                        <div className="text-sm text-blue-600">
                          Let us try to recover your data automatically
                        </div>
                      </div>
                    </div>
                  </button>

                  {recoveryData && (
                    <button
                      onClick={handleExportCorruptData}
                      className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 text-left transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium text-orange-800">
                            Export Corrupt Data
                          </div>
                          <div className="text-sm text-orange-600">
                            Download the corrupted data for manual recovery
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={handleStartFresh}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Trash2 className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-800">
                          Start Fresh
                        </div>
                        <div className="text-sm text-gray-600">
                          Clear all data and begin with a new project
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {recoveryStep === 'options' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setRecoveryStep('detection')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back
                </button>
                <h3 className="text-lg font-medium text-gray-900">Available Backups</h3>
              </div>

              <div className="space-y-3">
                {availableBackups.map((backup) => (
                  <div
                    key={backup.key}
                    className={`p-4 border rounded-lg ${
                      backup.isValid 
                        ? 'border-green-200 hover:bg-green-50' 
                        : 'border-red-200 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {backup.isValid ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            {backup.projectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {backup.timestamp} • {backup.size}
                          </div>
                        </div>
                      </div>
                      {backup.isValid && (
                        <button
                          onClick={() => handleRecoverFromBackup(backup.key)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {availableBackups.filter(b => b.isValid).length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No valid backups found. Try auto recovery instead.
                  </p>
                </div>
              )}
            </div>
          )}

          {recoveryStep === 'recovering' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recovering Your Data...
              </h3>
              <p className="text-gray-600">
                Please wait while we restore your project.
              </p>
            </div>
          )}

          {recoveryStep === 'success' && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recovery Successful!
              </h3>
              <p className="text-gray-600">
                Your project has been recovered. The page will reload shortly.
              </p>
            </div>
          )}

          {recoveryStep === 'failed' && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Recovery Failed
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't recover your data automatically. 
                Please try a manual backup or start fresh.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => setRecoveryStep('detection')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Try Other Options
                </button>
                <button
                  onClick={handleStartFresh}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Start Fresh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(recoveryStep === 'detection' || recoveryStep === 'options') && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Auto-save is enabled to prevent future data loss
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isRecovering}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryModal;