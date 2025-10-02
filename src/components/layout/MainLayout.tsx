/**
 * Main Layout Component dengan Primary Navigation
 * Implementasi skema navigasi hierarkis sesuai spesifikasi
 */

import React, { useState } from 'react';
import { 
  Home, FolderOpen, Calculator, Building2, GraduationCap, 
  ShoppingCart, FileText, Shield, Settings, Search, 
  Bell, User, Plus, ChevronDown, Menu, X
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

// Primary Navigation Structure
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    children: [
      { id: 'overview', label: 'Overview Proyek' },
      { id: 'statistics', label: 'Quick Statistics' },
      { id: 'activities', label: 'Recent Activities' },
      { id: 'storage', label: 'Storage Monitor' }
    ]
  },
  {
    id: 'projects',
    label: 'Project Management',
    icon: FolderOpen,
    children: [
      { id: 'my-projects', label: 'My Projects' },
      { id: 'create-new', label: 'Create New Project' },
      { id: 'shared', label: 'Shared Projects' },
      { id: 'archived', label: 'Archived Projects' },
      { id: 'templates', label: 'Project Templates' }
    ]
  },
  {
    id: 'analyze',
    label: 'Analyze Structure ⭐',
    icon: Calculator,
    badge: 'CORE',
    children: [
      { id: 'static-analysis', label: 'Static Analysis' },
      { id: 'dynamic-analysis', label: 'Dynamic Analysis' },
      { id: 'linear-analysis', label: 'Linear Analysis' },
      { id: 'nonlinear-analysis', label: 'Non-Linear Analysis' },
      { id: 'seismic-analysis', label: 'Seismic Analysis' },
      { id: 'wind-load', label: 'Wind Load Analysis' },
      { id: 'load-combinations', label: 'Load Combinations' },
      { id: 'analysis-results', label: 'Analysis Results' }
    ]
  },
  {
    id: 'design',
    label: 'Design Module',
    icon: Building2,
    children: [
      { id: 'component-design', label: 'Structural Component Design' },
      { id: 'steel-design', label: 'Steel Design' },
      { id: 'concrete-design', label: 'Concrete Design' },
      { id: 'timber-design', label: 'Timber Design' },
      { id: 'foundation-design', label: 'Foundation Design' },
      { id: 'connection-design', label: 'Connection Design' },
      { id: 'code-checking', label: 'Code Checking' },
      { id: 'reinforcement', label: 'Reinforcement Detailing' }
    ]
  },
  {
    id: '3d-viewer',
    label: '3D View Structure',
    icon: Building2,
    children: [
      { id: '3d-model', label: '3D Model Viewer' },
      { id: 'deformation', label: 'Deformation Visualization' },
      { id: 'stress-view', label: 'Stress Analysis View' },
      { id: 'layer-management', label: 'Layer Management' },
      { id: 'section-views', label: 'Section Views' },
      { id: 'animation', label: 'Animation & Simulation' },
      { id: 'rendering', label: 'Rendering Options' },
      { id: 'model-comparison', label: 'Model Comparison' }
    ]
  },
  {
    id: 'education',
    label: 'Learning Education',
    icon: GraduationCap,
    children: [
      { id: 'tutorials', label: 'Tutorial Library' },
      { id: 'courses', label: 'Video Courses' },
      { id: 'case-studies', label: 'Case Studies' },
      { id: 'documentation', label: 'Documentation' },
      { id: 'best-practices', label: 'Best Practices' },
      { id: 'certification', label: 'Certification Programs' },
      { id: 'community', label: 'Community Forum' },
      { id: 'knowledge-base', label: 'Knowledge Base' }
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: ShoppingCart,
    children: [
      { id: 'bim-plugins', label: 'BIM Plugins' },
      { id: 'analysis-tools', label: 'Analysis Tools' },
      { id: 'design-templates', label: 'Design Templates' },
      { id: 'material-libraries', label: 'Material Libraries' },
      { id: 'my-purchases', label: 'My Purchases' },
      { id: 'plugin-management', label: 'Plugin Management' },
      { id: 'developer-resources', label: 'Developer Resources' }
    ]
  },
  {
    id: 'reports',
    label: 'System Report',
    icon: FileText,
    children: [
      { id: 'analysis-reports', label: 'Analysis Reports' },
      { id: 'design-reports', label: 'Design Reports' },
      { id: 'material-schedules', label: 'Material Schedules' },
      { id: 'cost-estimation', label: 'Cost Estimation' },
      { id: 'technical-docs', label: 'Technical Documentation' },
      { id: 'export-options', label: 'Export Options (PDF/Excel/DWG)' },
      { id: 'report-templates', label: 'Report Templates' },
      { id: 'automated-reports', label: 'Automated Reports' }
    ]
  },
  {
    id: 'validation',
    label: 'Validasi Standar',
    icon: Shield,
    children: [
      { id: 'sni-standards', label: 'SNI Standards' },
      { id: 'asce-standards', label: 'ASCE Standards' },
      { id: 'eurocode', label: 'Eurocode' },
      { id: 'aci-standards', label: 'ACI Standards' },
      { id: 'aisc-standards', label: 'AISC Standards' },
      { id: 'custom-standards', label: 'Custom Standards' },
      { id: 'compliance-checker', label: 'Compliance Checker' },
      { id: 'standard-updates', label: 'Standard Updates' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings & Preferences',
    icon: Settings,
    children: [
      { id: 'user-profile', label: 'User Profile' },
      { id: 'team-management', label: 'Team Management' },
      { id: 'units-formats', label: 'Units & Formats' },
      { id: 'material-database', label: 'Material Database' },
      { id: 'load-patterns', label: 'Load Patterns Library' },
      { id: 'integration-settings', label: 'Integration Settings' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'billing', label: 'Subscription & Billing' }
    ]
  }
];

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  currentModule, 
  onModuleChange 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasChildren: boolean) => {
    if (hasChildren) {
      toggleExpanded(itemId);
    } else {
      onModuleChange(itemId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Primary Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        bg-gray-900 text-white flex flex-col shadow-2xl
      `}>
        {/* Logo & Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">StructureApp</span>
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors hidden md:block"
          >
            <Menu className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isExpanded = expandedItems.includes(item.id);
            const hasChildren = item.children && item.children.length > 0;
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id, hasChildren)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-left
                    transition-colors duration-150 group
                    ${currentModule === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {!sidebarCollapsed && hasChildren && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>

                {/* Sub-navigation */}
                {!sidebarCollapsed && hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children?.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => onModuleChange(child.id)}
                        className={`
                          w-full text-left px-3 py-2 text-sm rounded-lg transition-colors
                          ${currentModule === child.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }
                        `}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          {!sidebarCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Engineer User</p>
                <p className="text-xs text-gray-400">Pro License</p>
              </div>
            </div>
          ) : (
            <button className="w-full p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <User className="w-4 h-4 mx-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              {/* Breadcrumb */}
              <nav className="text-sm text-gray-500">
                <span>Home</span>
                <span className="mx-2">›</span>
                <span className="text-gray-900 font-medium">
                  {navigationItems.find(item => item.id === currentModule)?.label || 'Dashboard'}
                </span>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              {/* Global Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, analysis, reports..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Quick Actions */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden md:inline">New Project</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

        {/* Status Bar */}
        <footer className="bg-white border-t border-gray-200 px-6 py-2">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Status: Ready</span>
              <span>Units: SI (Metric)</span>
              <span>SNI 2847-2019</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Analysis Engine: v2.1.0</span>
              <span>© 2024 StructureApp</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;