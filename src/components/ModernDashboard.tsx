/**
 * Modern Dashboard Component
 * Professional glassmorphism design with comprehensive module integration
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Zap,
  Cloud,
  Brain,
  Eye,
  ShoppingBag,
  GraduationCap,
  Settings,
  Bell,
  Search,
  MapPin,
  ArrowUpRight,
  Calendar,
  Clock,
  Box,
  Layers,
  Activity,
  FileText,
  Gauge,
  Target
} from 'lucide-react';

import { GlassCard, ModernButton, StatCard, NavigationItem } from './ui/ProfessionalUI';
import { moduleDefinitions, ModuleKey } from './routing/ModuleRouter';
import { theme } from '../styles/theme';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const ModernDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Group modules by category
  const modulesByCategory = moduleDefinitions.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof moduleDefinitions>);

  // Quick stats for the dashboard
  const dashboardStats = [
    {
      title: 'Analysis Modules',
      value: modulesByCategory.analysis?.length || 0,
      change: '+2 new',
      trend: 'up' as const,
      icon: '🔧',
      gradient: 'primary' as keyof typeof theme.gradients,
      onClick: () => setSelectedCategory('analysis')
    },
    {
      title: 'Design Tools',
      value: modulesByCategory.design?.length || 0,
      change: 'Updated',
      trend: 'neutral' as const,
      icon: '📐',
      gradient: 'success' as keyof typeof theme.gradients,
      onClick: () => setSelectedCategory('design')
    },
    {
      title: 'AI & Analytics',
      value: modulesByCategory.tools?.length || 0,
      change: '+1 beta',
      trend: 'up' as const,
      icon: '🤖',
      gradient: 'warning' as keyof typeof theme.gradients,
      onClick: () => setSelectedCategory('tools')
    }
  ];

  const filteredModules = selectedCategory 
    ? modulesByCategory[selectedCategory] || []
    : moduleDefinitions;

  const searchFilteredModules = filteredModules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: theme.gradients.dark }}>
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.1) 0%, transparent 50%)'
        }}
      />
      
      {/* Main Container */}
      <div className="relative min-h-screen p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: theme.gradients.primary,
                boxShadow: theme.shadows.lg
              }}
            >
              🏗️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">StructureAI Platform</h1>
              <p className="text-blue-200 text-lg">Professional Structural Analysis System</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="text-blue-300 text-sm">
                  {currentTime.toLocaleTimeString('en-US')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <GlassCard className="flex-1 lg:flex-none">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search modules, features, or functions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-80 bg-transparent border-0 pl-10 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl"
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            </GlassCard>
            
            {/* Notification */}
            <GlassCard className="!p-3">
              <Bell className="w-5 h-5 text-white" />
            </GlassCard>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value.toString()}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              gradient={stat.gradient}
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <ModernButton
              variant={selectedCategory === null ? 'primary' : 'ghost'}
              onClick={() => setSelectedCategory(null)}
              size="sm"
            >
              All Modules ({moduleDefinitions.length})
            </ModernButton>
            {Object.entries(modulesByCategory).map(([category, modules]) => (
              <ModernButton
                key={category}
                variant={selectedCategory === category ? 'primary' : 'ghost'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({modules.length})
              </ModernButton>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchFilteredModules.map((module) => (
            <GlassCard
              key={module.key}
              onClick={() => onNavigate(module.key)}
              hover={true}
              className="group"
            >
              <div className="flex flex-col h-full">
                {/* Module Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: theme.gradients.primary,
                      boxShadow: theme.shadows.md
                    }}
                  >
                    {module.icon}
                  </div>
                  <div 
                    className="px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      backgroundColor: `${theme.colors.primary[500]}20`,
                      color: theme.colors.primary[400]
                    }}
                  >
                    {module.category}
                  </div>
                </div>
                
                {/* Module Info */} 
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {module.description}
                  </p>
                </div>
                
                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-300 text-xs font-medium">Click to open</span>
                    <ArrowUpRight className="w-4 h-4 text-blue-300 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        
        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <GlassCard>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">🎯 Integrated Structural Analysis Platform</h3>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Comprehensive system for structural analysis, design, 3D visualization, and AI optimization. 
                Designed to improve efficiency and accuracy in civil engineering data processing.
              </p>
              <div className="flex items-center justify-center space-x-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{moduleDefinitions.length}</div>
                  <div className="text-blue-200 text-sm">Total Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-blue-200 text-sm">Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">Pro</div>
                  <div className="text-blue-200 text-sm">Level</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};