/**
 * Enhanced Notification System dengan Real-time Alerts
 * Sistem notifikasi profesional untuk monitoring dan feedback
 */

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  category: 'workflow' | 'analysis' | 'system' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  autoClose?: boolean;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  type: 'primary' | 'secondary';
}

export class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];
  private idCounter = 0;

  constructor() {
    this.initializeSystemNotifications();
  }

  private initializeSystemNotifications() {
    // Simulasi notifikasi sistem professional
    this.addNotification({
      type: 'success',
      title: 'Sistem Siap',
      message: 'WorkflowController berhasil diinisialisasi dengan validation gates aktif',
      category: 'system',
      priority: 'medium',
      autoClose: true,
      duration: 5000
    });

    this.addNotification({
      type: 'info',
      title: 'SNI Compliance Check',
      message: 'Semua standar SNI (1726, 1727, 2847, 1729) telah dimuat dan siap validasi',
      category: 'compliance',
      priority: 'medium',
      autoClose: true,
      duration: 6000
    });
  }

  public addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = `notif_${++this.idCounter}_${Date.now()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date()
    };

    this.notifications.unshift(newNotification);
    
    // Limit to 50 notifications untuk performance
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();

    // Auto-close jika diatur
    if (notification.autoClose && notification.duration) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }

    return id;
  }

  public removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  public clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.length;
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Professional notification generators untuk workflow events
  public notifyWorkflowAdvancement(fromStage: string, toStage: string, success: boolean): void {
    if (success) {
      this.addNotification({
        type: 'success',
        title: 'Stage Berhasil Diselesaikan',
        message: `Transisi dari ${this.translateStage(fromStage)} ke ${this.translateStage(toStage)} berhasil`,
        category: 'workflow',
        priority: 'medium',
        autoClose: true,
        duration: 4000
      });
    } else {
      this.addNotification({
        type: 'error',
        title: 'Stage Gagal',
        message: `Tidak dapat melanjutkan dari ${this.translateStage(fromStage)} - periksa validation errors`,
        category: 'workflow',
        priority: 'high',
        autoClose: false,
        actions: [{
          label: 'Lihat Detail',
          action: () => console.log('Navigate to validation details'),
          type: 'primary'
        }]
      });
    }
  }

  public notifyValidationError(stage: string, errors: string[]): void {
    this.addNotification({
      type: 'error',
      title: 'Validation Error',
      message: `${errors.length} error ditemukan di stage ${this.translateStage(stage)}`,
      category: 'workflow',
      priority: 'high',
      autoClose: false,
      actions: [{
        label: 'Perbaiki Sekarang',
        action: () => console.log('Navigate to fix errors'),
        type: 'primary'
      }]
    });
  }

  public notifyComplianceWarning(standard: string, warning: string): void {
    this.addNotification({
      type: 'warning',
      title: `Peringatan ${standard}`,
      message: warning,
      category: 'compliance',
      priority: 'medium',
      autoClose: false,
      actions: [{
        label: 'Review Standar',
        action: () => console.log(`Open ${standard} documentation`),
        type: 'secondary'
      }]
    });
  }

  public notifyAnalysisComplete(results: any): void {
    this.addNotification({
      type: 'success',
      title: 'Analisis Selesai',
      message: `Safety factor: ${results.safetyFactor}, Max stress: ${results.maxStress} MPa`,
      category: 'analysis',
      priority: 'high',
      autoClose: false,
      actions: [
        {
          label: 'Lihat Hasil',
          action: () => console.log('Navigate to results'),
          type: 'primary'
        },
        {
          label: 'Export Laporan',
          action: () => console.log('Export report'),
          type: 'secondary'
        }
      ]
    });
  }

  public notifySystemAlert(message: string, priority: 'low' | 'medium' | 'high' | 'critical'): void {
    this.addNotification({
      type: priority === 'critical' ? 'error' : priority === 'high' ? 'warning' : 'info',
      title: 'System Alert',
      message,
      category: 'system',
      priority,
      autoClose: priority === 'low' || priority === 'medium',
      duration: priority === 'low' ? 3000 : 5000
    });
  }

  private translateStage(stage: string): string {
    const translations: Record<string, string> = {
      'input': 'Input Geometri',
      'modeling': 'Pemodelan Material',
      'analysis': 'Analisis Struktur',
      'validation': 'Validasi Hasil',
      'export': 'Export Laporan'
    };
    return translations[stage] || stage;
  }

  // Enhanced analytics untuk notification patterns
  public getNotificationAnalytics(): {
    total: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    recentActivity: Notification[];
  } {
    const analytics = {
      total: this.notifications.length,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      recentActivity: this.notifications.slice(0, 10)
    };

    this.notifications.forEach(notification => {
      analytics.byType[notification.type] = (analytics.byType[notification.type] || 0) + 1;
      analytics.byCategory[notification.category] = (analytics.byCategory[notification.category] || 0) + 1;
      analytics.byPriority[notification.priority] = (analytics.byPriority[notification.priority] || 0) + 1;
    });

    return analytics;
  }
}

export default NotificationManager;