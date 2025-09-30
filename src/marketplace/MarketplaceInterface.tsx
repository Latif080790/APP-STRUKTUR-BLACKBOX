/**
 * Modern Marketplace Interface
 * Glassmorphism design for template library and plugin system
 */

import React, { useState, useEffect } from 'react';
import { 
  MarketplaceEngine, 
  MarketplaceTemplate, 
  MarketplacePlugin, 
  MarketplaceSearchFilter,
  MarketplaceSearchResult,
  InstalledPlugin
} from './MarketplaceEngine';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Zap, 
  Shield, 
  TrendingUp,
  Package,
  Users,
  Clock,
  Tag,
  ExternalLink
} from 'lucide-react';

interface MarketplaceInterfaceProps {
  marketplaceEngine: MarketplaceEngine;
  onTemplateSelected?: (template: MarketplaceTemplate) => void;
  onPluginInstalled?: (plugin: MarketplacePlugin) => void;
}

type MarketplaceTab = 'templates' | 'plugins' | 'installed' | 'my-items';

export const MarketplaceInterface: React.FC<MarketplaceInterfaceProps> = ({
  marketplaceEngine,
  onTemplateSelected,
  onPluginInstalled
}) => {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<MarketplaceSearchFilter>({});
  const [templates, setTemplates] = useState<MarketplaceSearchResult<MarketplaceTemplate> | null>(null);
  const [plugins, setPlugins] = useState<MarketplaceSearchResult<MarketplacePlugin> | null>(null);
  const [installedPlugins, setInstalledPlugins] = useState<InstalledPlugin[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceTemplate | MarketplacePlugin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on tab change
  useEffect(() => {
    loadData();
  }, [activeTab, searchQuery, searchFilters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'templates') {
        const result = await marketplaceEngine.searchTemplates(searchQuery, searchFilters);
        setTemplates(result);
      } else if (activeTab === 'plugins') {
        const result = await marketplaceEngine.searchPlugins(searchQuery, searchFilters);
        setPlugins(result);
      } else if (activeTab === 'installed') {
        const installed = marketplaceEngine.getInstalledPlugins();
        setInstalledPlugins(installed);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateDownload = async (template: MarketplaceTemplate) => {
    try {
      setLoading(true);
      const structureData = await marketplaceEngine.downloadTemplate(template.id);
      if (structureData && onTemplateSelected) {
        onTemplateSelected(template);
      }
    } catch (err) {
      setError('Failed to download template');
    } finally {
      setLoading(false);
    }
  };

  const handlePluginInstall = async (plugin: MarketplacePlugin) => {
    try {
      setLoading(true);
      const success = await marketplaceEngine.installPlugin(plugin.id);
      if (success && onPluginInstalled) {
        onPluginInstalled(plugin);
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to install plugin');
    } finally {
      setLoading(false);
    }
  };

  const renderTemplateCard = (template: MarketplaceTemplate) => (
    <div 
      key={template.id}
      className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedItem(template)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">{template.name}</h3>
            <p className="text-blue-200 text-sm">{template.author}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {template.is_verified && (
            <Shield className="w-5 h-5 text-green-400" />
          )}
          <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-green-300 text-xs font-medium">+12%</span>
          </div>
        </div>
      </div>
      
      <p className="text-blue-100 text-sm mb-4 line-clamp-2">{template.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {template.tags.slice(0, 3).map(tag => (
          <span 
            key={tag}
            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg border border-blue-400/30"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">{template.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm">{template.downloads.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white font-bold text-lg">
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTemplateDownload(template);
            }}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPluginCard = (plugin: MarketplacePlugin) => (
    <div 
      key={plugin.id}
      className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedItem(plugin)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg group-hover:text-purple-300 transition-colors">{plugin.name}</h3>
            <p className="text-blue-200 text-sm">{plugin.author} • v{plugin.version}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {plugin.is_verified && (
            <Shield className="w-5 h-5 text-green-400" />
          )}
          <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3 text-purple-400" />
            <span className="text-purple-300 text-xs font-medium">+8%</span>
          </div>
        </div>
      </div>
      
      <p className="text-blue-100 text-sm mb-4 line-clamp-2">{plugin.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {plugin.tags.slice(0, 3).map(tag => (
          <span 
            key={tag}
            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-400/30"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-medium">{plugin.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm">{plugin.downloads.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white font-bold text-lg">
            {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePluginInstall(plugin);
            }}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Installing...' : 'Install'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-blue-200">Discover templates, plugins, and extensions for your structural analysis projects</p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300">
              <Filter className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-8 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10">
          {[
            { id: 'templates', label: 'Templates', icon: Package },
            { id: 'plugins', label: 'Plugins', icon: Zap },
            { id: 'installed', label: 'Installed', icon: Download },
            { id: 'my-items', label: 'My Items', icon: Users }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MarketplaceTab)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30' 
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-200">Loading...</p>
          </div>
        )}

        {activeTab === 'templates' && templates && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Templates ({templates.total_count})</h2>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="text-blue-200 text-sm">Last updated: 2 hours ago</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.items.map(renderTemplateCard)}
            </div>
          </div>
        )}

        {activeTab === 'plugins' && plugins && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Plugins ({plugins.total_count})</h2>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-300" />
                <span className="text-blue-200 text-sm">Last updated: 1 hour ago</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.items.map(renderPluginCard)}
            </div>
          </div>
        )}

        {activeTab === 'installed' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Installed Plugins ({installedPlugins.length})</h2>
            {installedPlugins.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
                <p className="text-blue-200 text-lg mb-2">No plugins installed yet</p>
                <p className="text-blue-300">Browse the plugins tab to find and install useful extensions</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {installedPlugins.map(installedPlugin => (
                  <div key={installedPlugin.plugin.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">{installedPlugin.plugin.name}</h3>
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        installedPlugin.is_enabled 
                          ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                          : 'bg-red-500/20 text-red-300 border border-red-400/30'
                      }`}>
                        {installedPlugin.is_enabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <p className="text-blue-200 text-sm mb-4">{installedPlugin.plugin.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-300 text-sm">v{installedPlugin.plugin.version}</span>
                      <div className="space-x-2">
                        <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                          {installedPlugin.is_enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                          Uninstall
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-items' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-blue-300 mx-auto mb-4 opacity-50" />
            <p className="text-blue-200 text-lg mb-2">My Items</p>
            <p className="text-blue-300">Feature coming soon! You'll be able to manage your uploaded templates and plugins here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceInterface;