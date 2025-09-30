/**
 * WebSocket Service untuk Real-time Collaboration
 * Menyediakan fitur real-time updates, collaboration, dan notifications
 */

// Simplified WebSocket service without socket.io-client dependency
interface WebSocketEventHandlers {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onAnalysisUpdate?: (data: any) => void;
  onPerformanceUpdate?: (data: any) => void;
  onUserJoined?: (user: any) => void;
  onUserLeft?: (user: any) => void;
  onProjectUpdate?: (project: any) => void;
  onNotification?: (notification: any) => void;
  onError?: (error: any) => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private handlers: WebSocketEventHandlers = {};
  private reconnectInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Auto-connect will be called when needed
  }

  private connect(): void {
    const wsUrl = (process.env.VITE_WS_URL || 'ws://localhost:3001').replace('http', 'ws') + '/socket.io/?EIO=4&transport=websocket';
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('❌ WebSocket connection failed:', error);
      this.scheduleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('🔗 WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.clearReconnectInterval();
      this.handlers.onConnect?.();
    };

    this.ws.onclose = (event) => {
      console.log('❌ WebSocket disconnected:', event.reason);
      this.isConnected = false;
      this.handlers.onDisconnect?.();
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.handlers.onError?.(error);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('❌ Failed to parse WebSocket message:', error);
      }
    };
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'analysis-updated':
        this.handlers.onAnalysisUpdate?.(data.payload);
        break;
      case 'performance-updated':
        this.handlers.onPerformanceUpdate?.(data.payload);
        break;
      case 'user-joined':
        this.handlers.onUserJoined?.(data.payload);
        break;
      case 'user-left':
        this.handlers.onUserLeft?.(data.payload);
        break;
      case 'project-updated':
        this.handlers.onProjectUpdate?.(data.payload);
        break;
      case 'notification':
        this.handlers.onNotification?.(data.payload);
        break;
      default:
        console.log('📨 Received unknown message type:', data.type);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    
    console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    this.reconnectInterval = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  private sendMessage(type: string, payload: any): void {
    if (this.ws && this.isConnected) {
      const message = JSON.stringify({ type, payload });
      this.ws.send(message);
    } else {
      console.warn('⚠️ WebSocket not connected, message not sent:', type);
    }
  }

  // Public methods
  public setEventHandlers(handlers: WebSocketEventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  public init(): void {
    if (!this.ws && !this.isConnected) {
      this.connect();
    }
  }

  public joinProject(projectId: string): void {
    this.sendMessage('join-project', { projectId });
    console.log(`🏢 Joined project: ${projectId}`);
  }

  public leaveProject(projectId: string): void {
    this.sendMessage('leave-project', { projectId });
    console.log(`🚪 Left project: ${projectId}`);
  }

  public sendAnalysisUpdate(projectId: string, analysisData: any): void {
    this.sendMessage('analysis-update', {
      projectId,
      ...analysisData,
      timestamp: new Date().toISOString()
    });
    console.log('📊 Analysis update sent');
  }

  public sendPerformanceData(projectId: string, performanceData: any): void {
    this.sendMessage('performance-data', {
      projectId,
      ...performanceData,
      timestamp: new Date().toISOString()
    });
    console.log('⚡ Performance data sent');
  }

  public sendNotification(notification: {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    projectId?: string;
  }): void {
    this.sendMessage('notification', {
      ...notification,
      timestamp: new Date().toISOString()
    });
    console.log('🔔 Notification sent');
  }

  public isSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionStatus(): {
    connected: boolean;
    reconnectAttempts: number;
  } {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  public disconnect(): void {
    this.clearReconnectInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      console.log('🔌 WebSocket disconnected manually');
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// Export types
export interface RealTimeNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  projectId?: string;
  userId?: string;
}

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
  currentProject?: string;
}

export interface RealTimeUpdate {
  type: 'analysis' | 'performance' | 'project' | 'user' | 'notification';
  data: any;
  timestamp: string;
  userId?: string;
  projectId?: string;
}

export default webSocketService;