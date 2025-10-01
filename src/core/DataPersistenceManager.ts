/**
 * Advanced Data Persistence Manager
 * Sistem penyimpanan data workflow yang persistent dengan real-time sync
 */

interface PersistentData {
  projectId: string;
  timestamp: Date;
  workflowData: any;
  analysisResults: any;
  userSettings: any;
  version: string;
}

interface DataBackup {
  id: string;
  timestamp: Date;
  data: PersistentData;
  description: string;
  autoBackup: boolean;
}

export class DataPersistenceManager {
  private readonly STORAGE_KEY = 'struktural_analysis_data';
  private readonly BACKUP_KEY = 'struktural_analysis_backups';
  private readonly VERSION = '2.0.0';
  
  private autoSaveInterval?: NodeJS.Timeout;
  private isAutoSaveEnabled = true;
  private listeners: Array<(data: PersistentData) => void> = [];

  constructor() {
    this.initializeAutoSave();
  }

  /**
   * Simpan data workflow secara persistent
   */
  public saveWorkflowData(
    projectId: string,
    workflowData: any,
    analysisResults?: any,
    userSettings?: any
  ): void {
    try {
      const persistentData: PersistentData = {
        projectId,
        timestamp: new Date(),
        workflowData,
        analysisResults: analysisResults || {},
        userSettings: userSettings || {},
        version: this.VERSION
      };

      // Simpan ke localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persistentData));
      
      // Auto backup setiap save
      this.createAutoBackup(persistentData);
      
      // Notify listeners
      this.notifyListeners(persistentData);
      
      console.log('✅ Data workflow berhasil disimpan:', projectId);
    } catch (error) {
      console.error('❌ Error menyimpan data workflow:', error);
      throw new Error(`Gagal menyimpan data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Load data workflow dari storage
   */
  public loadWorkflowData(): PersistentData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const data = JSON.parse(stored) as PersistentData;
      
      // Validasi version compatibility
      if (!this.isVersionCompatible(data.version)) {
        console.warn('⚠️ Data version tidak kompatibel, migrasi diperlukan');
        return this.migrateData(data);
      }

      return data;
    } catch (error) {
      console.error('❌ Error loading data workflow:', error);
      return null;
    }
  }

  /**
   * Buat backup manual dengan deskripsi
   */
  public createManualBackup(description: string): string {
    try {
      const currentData = this.loadWorkflowData();
      if (!currentData) {
        throw new Error('Tidak ada data untuk dibackup');
      }

      return this.createBackup(currentData, description, false);
    } catch (error) {
      console.error('❌ Error creating manual backup:', error);
      throw error;
    }
  }

  /**
   * Load daftar backup yang tersedia
   */
  public getAvailableBackups(): DataBackup[] {
    try {
      const stored = localStorage.getItem(this.BACKUP_KEY);
      if (!stored) return [];

      const backups = JSON.parse(stored) as DataBackup[];
      
      // Sort by timestamp (newest first)
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('❌ Error loading backups:', error);
      return [];
    }
  }

  /**
   * Restore data dari backup
   */
  public restoreFromBackup(backupId: string): boolean {
    try {
      const backups = this.getAvailableBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup tidak ditemukan');
      }

      // Restore data
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backup.data));
      
      // Notify listeners
      this.notifyListeners(backup.data);
      
      console.log('✅ Data berhasil di-restore dari backup:', backup.description);
      return true;
    } catch (error) {
      console.error('❌ Error restoring backup:', error);
      return false;
    }
  }

  /**
   * Hapus backup
   */
  public deleteBackup(backupId: string): boolean {
    try {
      const backups = this.getAvailableBackups();
      const updatedBackups = backups.filter(b => b.id !== backupId);
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(updatedBackups));
      
      console.log('✅ Backup berhasil dihapus:', backupId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting backup:', error);
      return false;
    }
  }

  /**
   * Export data ke file JSON
   */
  public exportToFile(): void {
    try {
      const data = this.loadWorkflowData();
      if (!data) {
        throw new Error('Tidak ada data untuk diekspor');
      }

      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        exportVersion: this.VERSION
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `structural_analysis_${data.projectId}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Data berhasil diekspor ke file');
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Import data dari file JSON
   */
  public importFromFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const importedData = JSON.parse(content);
            
            // Validasi struktur data
            if (!this.validateImportedData(importedData)) {
              throw new Error('Format file tidak valid');
            }

            // Buat backup current data sebelum import
            const currentData = this.loadWorkflowData();
            if (currentData) {
              this.createBackup(currentData, 'Backup sebelum import', true);
            }

            // Import data
            const persistentData: PersistentData = {
              projectId: importedData.projectId,
              timestamp: new Date(),
              workflowData: importedData.workflowData,
              analysisResults: importedData.analysisResults || {},
              userSettings: importedData.userSettings || {},
              version: this.VERSION
            };

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(persistentData));
            this.notifyListeners(persistentData);

            console.log('✅ Data berhasil diimport dari file');
            resolve(true);
          } catch (error) {
            console.error('❌ Error parsing imported file:', error);
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clear semua data (dengan konfirmasi)
   */
  public clearAllData(confirmation: string): boolean {
    if (confirmation !== 'CLEAR_ALL_DATA') {
      throw new Error('Konfirmasi tidak valid');
    }

    try {
      // Buat final backup
      const currentData = this.loadWorkflowData();
      if (currentData) {
        this.createBackup(currentData, 'Final backup sebelum clear', true);
      }

      // Clear data
      localStorage.removeItem(this.STORAGE_KEY);
      
      console.log('✅ Semua data berhasil dihapus');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return false;
    }
  }

  /**
   * Subscribe to data changes
   */
  public subscribe(listener: (data: PersistentData) => void): () => void {
    this.listeners.push(listener);
    
    // Send current data immediately
    const currentData = this.loadWorkflowData();
    if (currentData) {
      listener(currentData);
    }

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Enable/disable auto save
   */
  public setAutoSave(enabled: boolean): void {
    this.isAutoSaveEnabled = enabled;
    
    if (enabled && !this.autoSaveInterval) {
      this.initializeAutoSave();
    } else if (!enabled && this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }

    console.log(`Auto save ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get storage usage statistics
   */
  public getStorageStats(): {
    dataSize: number;
    backupSize: number;
    totalSize: number;
    available: number;
    usagePercentage: number;
  } {
    try {
      const dataStr = localStorage.getItem(this.STORAGE_KEY) || '';
      const backupStr = localStorage.getItem(this.BACKUP_KEY) || '';
      
      const dataSize = new Blob([dataStr]).size;
      const backupSize = new Blob([backupStr]).size;
      const totalSize = dataSize + backupSize;
      
      // Estimate localStorage quota (usually 5-10MB)
      const estimatedQuota = 5 * 1024 * 1024; // 5MB
      const available = estimatedQuota - totalSize;
      const usagePercentage = (totalSize / estimatedQuota) * 100;

      return {
        dataSize,
        backupSize,
        totalSize,
        available,
        usagePercentage
      };
    } catch (error) {
      console.error('❌ Error calculating storage stats:', error);
      return {
        dataSize: 0,
        backupSize: 0,
        totalSize: 0,
        available: 0,
        usagePercentage: 0
      };
    }
  }

  // Private methods
  private initializeAutoSave(): void {
    if (this.autoSaveInterval) return;

    this.autoSaveInterval = setInterval(() => {
      if (this.isAutoSaveEnabled) {
        // Auto save logic could be triggered by other components
        // For now, just maintain the interval
      }
    }, 30000); // Every 30 seconds
  }

  private createAutoBackup(data: PersistentData): void {
    this.createBackup(data, `Auto backup - ${new Date().toLocaleString('id-ID')}`, true);
  }

  private createBackup(data: PersistentData, description: string, isAutoBackup: boolean): string {
    try {
      const backup: DataBackup = {
        id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        data: { ...data },
        description,
        autoBackup: isAutoBackup
      };

      const existingBackups = this.getAvailableBackups();
      const updatedBackups = [backup, ...existingBackups];
      
      // Keep only last 20 backups untuk menghemat storage
      const limitedBackups = updatedBackups.slice(0, 20);
      
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(limitedBackups));
      
      return backup.id;
    } catch (error) {
      console.error('❌ Error creating backup:', error);
      throw error;
    }
  }

  private isVersionCompatible(version: string): boolean {
    // Simple version compatibility check
    const currentMajor = parseInt(this.VERSION.split('.')[0]);
    const dataMajor = parseInt(version.split('.')[0]);
    
    return currentMajor === dataMajor;
  }

  private migrateData(data: any): PersistentData {
    // Data migration logic for older versions
    console.log('🔄 Migrasi data dari version:', data.version);
    
    return {
      projectId: data.projectId || 'migrated-project',
      timestamp: new Date(),
      workflowData: data.workflowData || {},
      analysisResults: data.analysisResults || {},
      userSettings: data.userSettings || {},
      version: this.VERSION
    };
  }

  private validateImportedData(data: any): boolean {
    return (
      data &&
      typeof data.projectId === 'string' &&
      typeof data.workflowData === 'object'
    );
  }

  private notifyListeners(data: PersistentData): void {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('❌ Error notifying data persistence listener:', error);
      }
    });
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
    this.listeners = [];
  }
}

export default DataPersistenceManager;