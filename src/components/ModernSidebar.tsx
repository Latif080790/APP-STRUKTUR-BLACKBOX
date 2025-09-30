/**
 * Modern Sidebar Component
 * Professional glassmorphism sidebar with comprehensive module navigation
 */

import React, { useState } from 'react';
import { 
  Home,
  Building2, 
  ShoppingBag,
  Cloud,
  Brain,
  Eye,
  GraduationCap,
  Settings,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Calendar,
  FileText,
  Database,
  Box,
  Layers,
  Target,
  Gauge,
  Ruler,
  Building,
  Square,
  Activity,
  Zap,
  Search,
  Download
} from 'lucide-react';

import { NavigationItem } from './ui/ProfessionalUI';
import { moduleDefinitions, ModuleKey } from './routing/ModuleRouter';
import { theme } from '../styles/theme';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const ModernSidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['analysis']);

  // Group modules by category with icons
  const categoryIcons: Record<string, React.ReactNode> = {
    analysis: <Building2 className="w-4 h-4" />,
    design: <Ruler className="w-4 h-4" />,
    '3d': <Box className="w-4 h-4" />,
    visualization: <Eye className="w-4 h-4" />,
    tools: <Settings className="w-4 h-4" />,
    utilities: <Zap className="w-4 h-4" />,
    system: <Database className="w-4 h-4" />
  };

  const modulesByCategory = moduleDefinitions.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof moduleDefinitions>);

  // Quick access items (always visible)
  const quickAccessItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      isActive: currentView === 'dashboard',
      onClick: () => onNavigate('dashboard')
    },
    {
      id: 'structural-analysis',
      label: 'Analisis Utama',
      icon: <Building2 className="w-4 h-4" />,
      isActive: currentView === 'structural-analysis',
      onClick: () => onNavigate('structural-analysis')
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: <ShoppingBag className="w-4 h-4" />,
      isActive: currentView === 'marketplace',
      onClick: () => onNavigate('marketplace')
    },
    {
      id: 'educational',
      label: 'Pembelajaran',
      icon: <GraduationCap className="w-4 h-4" />,
      isActive: currentView === 'educational',
      onClick: () => onNavigate('educational')
    }
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full backdrop-blur-xl border-r transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      style={{
        background: theme.glass.heavy,
        borderColor: theme.colors.neutral[800]
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: theme.colors.neutral[800] }}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{
                    background: theme.gradients.primary,
                    boxShadow: theme.shadows.md
                  }}
                >
                  🏗️
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">StructureAI Platform</h2>
                  <p className="text-blue-300 text-xs">Sistem Analisis Struktur</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg transition-colors hover:bg-white/20"
              style={{
                background: theme.glass.light
              }}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Quick Access */}
          <div className="px-3 mb-6">
            {!isCollapsed && (
              <h3 className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                Akses Cepat
              </h3>
            )}
            <div className="space-y-1">
              {quickAccessItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  icon={item.icon}
                  label={isCollapsed ? '' : item.label}
                  isActive={item.isActive}
                  onClick={item.onClick}
                />
              ))}
            </div>
          </div>

          {/* Module Categories */}
          {!isCollapsed && (
            <div className="px-3">
              <h3 className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 px-3">
                Modul Sistem
              </h3>
              
              {Object.entries(modulesByCategory).map(([category, modules]) => {
                const isExpanded = expandedCategories.includes(category);
                const categoryIcon = categoryIcons[category] || <Box className="w-4 h-4" />;
                
                return (
                  <div key={category} className="mb-4">
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/10 text-blue-200 hover:text-white"
                    >
                      <div className="flex items-center space-x-2">
                        {categoryIcon}
                        <span className="text-sm font-medium capitalize">
                          {category === '3d' ? '3D Visualization' : category}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${theme.colors.primary[500]}20`,
                            color: theme.colors.primary[400]
                          }}
                        >
                          {modules.length}
                        </span>
                      </div>
                      <ChevronRight 
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {/* Category Modules */}
                    {isExpanded && (
                      <div className="mt-2 ml-4 space-y-1">
                        {modules.map((module) => (
                          <NavigationItem
                            key={module.key}
                            icon={<span className="text-sm">{module.icon}</span>}
                            label={module.title}
                            isActive={currentView === module.key}
                            onClick={() => onNavigate(module.key)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* System Items (collapsed view) */}
          {isCollapsed && (
            <div className="px-3 space-y-1">
              {Object.entries(modulesByCategory).slice(0, 6).map(([category, modules]) => {
                const categoryIcon = categoryIcons[category] || <Box className="w-4 h-4" />;
                const hasActiveModule = modules.some(m => m.key === currentView);
                
                return (
                  <button
                    key={category}
                    onClick={() => {
                      if (modules.length > 0) {
                        onNavigate(modules[0].key);
                      }
                    }}
                    className={`w-full p-3 rounded-xl transition-all duration-200 group ${
                      hasActiveModule
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30'
                        : 'hover:bg-white/10'
                    }`}
                    title={category.charAt(0).toUpperCase() + category.slice(1)}
                  >
                    <div className={`text-center ${
                      hasActiveModule ? 'text-blue-400' : 'text-blue-300 group-hover:text-white'
                    }`}>
                      {categoryIcon}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t" style={{ borderColor: theme.colors.neutral[800] }}>
          {/* System Settings */}
          <div className="space-y-1 mb-4">
            <NavigationItem
              icon={<Settings className="w-4 h-4" />}
              label={isCollapsed ? '' : 'Pengaturan'}
              isActive={currentView === 'settings'}
              onClick={() => onNavigate('settings')}
            />
            <NavigationItem
              icon={<HelpCircle className="w-4 h-4" />}
              label={isCollapsed ? '' : 'Bantuan'}
              isActive={currentView === 'help'}
              onClick={() => onNavigate('help')}
            />
          </div>

          {/* User Profile Section */}
          {!isCollapsed && (
            <div 
              className="p-3 rounded-xl border"
              style={{
                background: theme.glass.light,
                borderColor: theme.colors.neutral[700]
              }}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: theme.gradients.primary }}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Engineer</p>
                  <p className="text-blue-300 text-xs truncate">Structural Analysis</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};