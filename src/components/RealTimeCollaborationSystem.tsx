/**
 * Enhanced Real-time Collaboration System
 * Live user presence, shared sessions, team communication, and collaborative editing
 * Professional structural engineering collaboration platform
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Users, MessageCircle, Video, Share2, Cursor, 
  Edit3, Eye, Crown, UserCheck, Wifi, WifiOff,
  Settings, Bell, Phone, Monitor, Activity
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'engineer' | 'viewer' | 'guest';
  status: 'online' | 'away' | 'busy' | 'offline';
  isTyping: boolean;
  cursor?: { x: number; y: number };
  activeModule?: string;
  permissions: string[];
  lastSeen: Date;
}

interface CollaborationMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  type: 'text' | 'system' | 'calculation' | 'review';
  timestamp: Date;
  attachments?: string[];
  mentions?: string[];
  reactions?: Record<string, string[]>; // emoji -> userIds
}

interface CollaborationSession {
  id: string;
  projectId: string;
  title: string;
  host: string;
  participants: CollaborationUser[];
  activeModule: string;
  isRecording: boolean;
  isScreenSharing: boolean;
  settings: {
    allowGuests: boolean;
    requireApproval: boolean;
    recordSession: boolean;
    maxParticipants: number;
  };
  startTime: Date;
}

interface EditingEvent {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'move';
  elementType: 'node' | 'element' | 'load' | 'material';
  elementId: string;
  data: any;
  timestamp: Date;
}

const RealTimeCollaborationSystem: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CollaborationUser | null>(null);
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<CollaborationUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [editingEvents, setEditingEvents] = useState<EditingEvent[]>([]);
  const [showUserList, setShowUserList] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [isTyping, setIsTyping] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const initializeSocket = () => {
      socketRef.current = io('ws://localhost:3001', {
        transports: ['websocket'],
        upgrade: false
      });

      const socket = socketRef.current;

      // Connection events
      socket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to collaboration server');
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from collaboration server');
      });

      // User presence events
      socket.on('user-joined', (user: CollaborationUser) => {
        setOnlineUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
        addSystemMessage(`${user.name} joined the session`);
      });

      socket.on('user-left', (userId: string) => {
        const user = onlineUsers.find(u => u.id === userId);
        if (user) {
          setOnlineUsers(prev => prev.filter(u => u.id !== userId));
          addSystemMessage(`${user.name} left the session`);
        }
      });

      socket.on('user-update', (user: CollaborationUser) => {
        setOnlineUsers(prev => prev.map(u => u.id === user.id ? user : u));
      });

      // Message events
      socket.on('message-received', (message: CollaborationMessage) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });

      socket.on('typing-start', (userId: string) => {
        setIsTyping(prev => [...prev.filter(id => id !== userId), userId]);
      });

      socket.on('typing-stop', (userId: string) => {
        setIsTyping(prev => prev.filter(id => id !== userId));
      });

      // Real-time editing events
      socket.on('edit-event', (event: EditingEvent) => {
        setEditingEvents(prev => [...prev.slice(-99), event]); // Keep last 100 events
        handleEditingEvent(event);
      });

      // Session events
      socket.on('session-update', (updatedSession: CollaborationSession) => {
        setSession(updatedSession);
      });

      return socket;
    };

    const socket = initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Join collaboration session
  const joinSession = useCallback(async (sessionId: string, user: CollaborationUser) => {
    if (!socketRef.current) return;

    setCurrentUser(user);
    socketRef.current.emit('join-session', { sessionId, user });
  }, []);

  // Send message
  const sendMessage = useCallback(() => {
    if (!socketRef.current || !newMessage.trim() || !currentUser) return;

    const message: CollaborationMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date()
    };

    socketRef.current.emit('send-message', message);
    setNewMessage('');
    
    // Stop typing indicator
    socketRef.current.emit('typing-stop');
  }, [newMessage, currentUser]);

  // Handle typing
  const handleTyping = useCallback(() => {
    if (!socketRef.current || !currentUser) return;

    socketRef.current.emit('typing-start');

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('typing-stop');
    }, 2000);
  }, [currentUser]);

  // Add system message
  const addSystemMessage = (content: string) => {
    const message: CollaborationMessage = {
      id: Date.now().toString(),
      userId: 'system',
      userName: 'System',
      content,
      type: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  // Handle real-time editing events
  const handleEditingEvent = (event: EditingEvent) => {
    const user = onlineUsers.find(u => u.id === event.userId);
    if (user && user.id !== currentUser?.id) {
      // Show editing indicator or apply changes
      console.log(`${user.name} ${event.action}d ${event.elementType} ${event.elementId}`);
    }
  };

  // Broadcast editing event
  const broadcastEdit = useCallback((action: EditingEvent['action'], elementType: EditingEvent['elementType'], elementId: string, data: any) => {
    if (!socketRef.current || !currentUser) return;

    const event: EditingEvent = {
      userId: currentUser.id,
      action,
      elementType,
      elementId,
      data,
      timestamp: new Date()
    };

    socketRef.current.emit('edit-event', event);
  }, [currentUser]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    if (!socketRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      socketRef.current.emit('start-screen-share', { stream });
      // Handle screen sharing logic
    } catch (error) {
      console.error('Failed to start screen sharing:', error);
    }
  }, []);

  // Get user status color
  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get user role icon
  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'engineer': return Edit3;
      case 'viewer': return Eye;
      default: return UserCheck;
    }
  };

  // Mock data for demonstration
  useEffect(() => {
    // Simulate joining session
    const mockUser: CollaborationUser = {
      id: 'user-1',
      name: 'John Engineer',
      email: 'john@engineering.com',
      role: 'engineer',
      status: 'online',
      isTyping: false,
      activeModule: 'design',
      permissions: ['read', 'write', 'review'],
      lastSeen: new Date()
    };

    const mockSession: CollaborationSession = {
      id: 'session-1',
      projectId: 'project-1',
      title: 'Hospital Building - Structural Analysis',
      host: 'user-1',
      participants: [mockUser],
      activeModule: 'design',
      isRecording: false,
      isScreenSharing: false,
      settings: {
        allowGuests: true,
        requireApproval: false,
        recordSession: true,
        maxParticipants: 10
      },
      startTime: new Date()
    };

    setCurrentUser(mockUser);
    setSession(mockSession);
    setOnlineUsers([mockUser]);

    // Mock messages
    const mockMessages: CollaborationMessage[] = [
      {
        id: '1',
        userId: 'system',
        userName: 'System',
        content: 'Collaboration session started',
        type: 'system',
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        userId: 'user-2',
        userName: 'Sarah Architect',
        content: 'The beam design looks good, but we should verify the deflection limits',
        type: 'review',
        timestamp: new Date(Date.now() - 180000)
      }
    ];

    setMessages(mockMessages);
    setIsConnected(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Real-time Collaboration</h1>
                <p className="text-blue-100 text-sm">{session?.title || 'Professional Engineering Collaboration'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isConnected ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white'
              }`}>
                {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span className="text-sm font-semibold">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={startScreenShare}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all text-sm font-semibold flex items-center space-x-2"
              >
                <Monitor className="w-4 h-4" />
                <span>Share Screen</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Collaboration Area */}
        <div className="xl:col-span-3 space-y-6">
          {/* Session Info */}
          {session && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Session</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {onlineUsers.length} participants
                  </span>
                  {session.isRecording && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <Activity className="w-4 h-4" />
                      <span className="text-sm font-semibold">Recording</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Current Module</h3>
                  <p className="text-blue-700">{session.activeModule}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Session Duration</h3>
                  <p className="text-green-700">
                    {Math.floor((Date.now() - session.startTime.getTime()) / 60000)} minutes
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Host</h3>
                  <p className="text-purple-700">{currentUser?.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Real-time Activity Feed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {editingEvents.slice(-10).map((event, index) => {
                const user = onlineUsers.find(u => u.id === event.userId);
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{user?.name || 'Unknown User'}</span>
                        {' '}{event.action}d {event.elementType} #{event.elementId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              {editingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Online Users */}
          {showUserList && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Online Users</h2>
                <span className="text-sm text-gray-500">{onlineUsers.length} online</span>
              </div>
              
              <div className="space-y-3">
                {onlineUsers.map((user) => {
                  const RoleIcon = getUserRoleIcon(user.role);
                  return (
                    <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <RoleIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getUserStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role} • {user.activeModule}</p>
                      </div>
                      {user.isTyping && (
                        <div className="text-blue-600 text-xs">typing...</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat */}
          {showChat && (
            <div className="bg-white rounded-xl shadow-lg flex flex-col h-96">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Team Chat
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`${
                    message.type === 'system' ? 'text-center' : ''
                  }`}>
                    {message.type === 'system' ? (
                      <p className="text-sm text-gray-500 italic">{message.content}</p>
                    ) : (
                      <div className={`max-w-xs ${
                        message.userId === currentUser?.id ? 'ml-auto' : 'mr-auto'
                      }`}>
                        <div className={`rounded-lg p-3 ${
                          message.userId === currentUser?.id
                            ? 'bg-blue-600 text-white'
                            : message.type === 'review'
                            ? 'bg-yellow-100 border border-yellow-200'
                            : 'bg-gray-100'
                        }`}>
                          {message.userId !== currentUser?.id && (
                            <p className="text-xs font-semibold mb-1 text-gray-600">
                              {message.userName}
                            </p>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.userId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicators */}
                {isTyping.length > 0 && (
                  <div className="text-sm text-gray-500 italic">
                    {isTyping.map(userId => {
                      const user = onlineUsers.find(u => u.id === userId);
                      return user?.name;
                    }).filter(Boolean).join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeCollaborationSystem;