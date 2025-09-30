/**
 * Marketplace Engine for Template Library and Plugin System
 * Provides template management, plugin discovery, and marketplace functionality
 */

import { Structure3D, Material, Section } from '../types/structural';

// Core marketplace interfaces
export interface MarketplaceTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  author: string;
  version: string;
  tags: string[];
  preview_image: string;
  structure_data: Structure3D;
  metadata: TemplateMetadata;
  downloads: number;
  rating: number;
  reviews: TemplateReview[];
  price: number; // 0 for free
  license: TemplateLicense;
  created_at: Date;
  updated_at: Date;
  is_verified: boolean;
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  description: string;
  category: PluginCategory;
  author: string;
  version: string;
  tags: string[];
  icon: string;
  entry_point: string;
  permissions: PluginPermission[];
  dependencies: PluginDependency[];
  metadata: PluginMetadata;
  downloads: number;
  rating: number;
  reviews: PluginReview[];
  price: number;
  license: PluginLicense;
  created_at: Date;
  updated_at: Date;
  is_verified: boolean;
  compatibility: string[]; // supported versions
}

export type TemplateCategory = 
  | 'residential' 
  | 'commercial' 
  | 'industrial' 
  | 'infrastructure' 
  | 'educational' 
  | 'healthcare' 
  | 'recreational'
  | 'utility';

export type PluginCategory = 
  | 'analysis' 
  | 'visualization' 
  | 'export' 
  | 'import' 
  | 'optimization' 
  | 'reporting' 
  | 'ai' 
  | 'collaboration'
  | 'integration';

export interface TemplateMetadata {
  building_type: string;
  structural_system: string;
  materials: string[];
  codes: string[];
  seismic_zone?: string;
  wind_zone?: string;
  occupancy_category?: string;
  floor_count?: number;
  total_area?: number;
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface PluginMetadata {
  plugin_type: 'analysis' | 'visualization' | 'utility' | 'integration';
  api_version: string;
  min_app_version: string;
  max_app_version?: string;
  file_size: number;
  installation_guide: string;
  documentation_url?: string;
  support_url?: string;
}

export interface TemplateReview {
  id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  created_at: Date;
  helpful_votes: number;
}

export interface PluginReview {
  id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  created_at: Date;
  helpful_votes: number;
}

export type TemplateLicense = 'free' | 'commercial' | 'educational' | 'open_source';
export type PluginLicense = 'free' | 'commercial' | 'educational' | 'open_source' | 'trial';

export interface PluginPermission {
  type: 'file_access' | 'network_access' | 'system_access' | 'user_data' | 'cloud_storage';
  description: string;
  required: boolean;
}

export interface PluginDependency {
  name: string;
  version: string;
  type: 'plugin' | 'library' | 'service';
  optional: boolean;
}

export interface MarketplaceSearchFilter {
  category?: TemplateCategory | PluginCategory;
  tags?: string[];
  price_range?: { min: number; max: number };
  rating_min?: number;
  license?: TemplateLicense | PluginLicense;
  verified_only?: boolean;
  free_only?: boolean;
}

export interface MarketplaceSearchResult<T> {
  items: T[];
  total_count: number;
  page: number;
  page_size: number;
  filters_applied: MarketplaceSearchFilter;
}

export interface InstalledPlugin {
  plugin: MarketplacePlugin;
  installed_at: Date;
  is_enabled: boolean;
  installation_path: string;
  config: Record<string, any>;
}

export interface UserMarketplace {
  user_id: string;
  purchased_templates: string[];
  purchased_plugins: string[];
  installed_plugins: InstalledPlugin[];
  favorites: string[];
  reviews_written: string[];
}

export class MarketplaceEngine {
  private templates: Map<string, MarketplaceTemplate> = new Map();
  private plugins: Map<string, MarketplacePlugin> = new Map();
  private userMarketplace: UserMarketplace | null = null;
  private installedPlugins: Map<string, InstalledPlugin> = new Map();
  private pluginEventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeDefaultPlugins();
  }

  // Template Management
  async searchTemplates(
    query: string = '',
    filters: MarketplaceSearchFilter = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<MarketplaceSearchResult<MarketplaceTemplate>> {
    let results = Array.from(this.templates.values());

    // Apply text search
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(template => 
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    if (filters.category) {
      results = results.filter(template => template.category === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(template => 
        filters.tags!.some(tag => template.tags.includes(tag))
      );
    }

    if (filters.price_range) {
      results = results.filter(template => 
        template.price >= filters.price_range!.min && 
        template.price <= filters.price_range!.max
      );
    }

    if (filters.rating_min) {
      results = results.filter(template => template.rating >= filters.rating_min!);
    }

    if (filters.verified_only) {
      results = results.filter(template => template.is_verified);
    }

    if (filters.free_only) {
      results = results.filter(template => template.price === 0);
    }

    // Sort by popularity (downloads * rating)
    results.sort((a, b) => (b.downloads * b.rating) - (a.downloads * a.rating));

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedResults,
      total_count: results.length,
      page,
      page_size: pageSize,
      filters_applied: filters
    };
  }

  async getTemplate(templateId: string): Promise<MarketplaceTemplate | null> {
    return this.templates.get(templateId) || null;
  }

  async downloadTemplate(templateId: string): Promise<Structure3D | null> {
    const template = this.templates.get(templateId);
    if (!template) return null;

    // Increment download count
    template.downloads++;
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return template.structure_data;
  }

  async uploadTemplate(template: Omit<MarketplaceTemplate, 'id' | 'downloads' | 'reviews' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTemplate: MarketplaceTemplate = {
      ...template,
      id,
      downloads: 0,
      reviews: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    this.templates.set(id, newTemplate);
    return id;
  }

  // Plugin Management
  async searchPlugins(
    query: string = '',
    filters: MarketplaceSearchFilter = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<MarketplaceSearchResult<MarketplacePlugin>> {
    let results = Array.from(this.plugins.values());

    // Apply similar filtering logic as templates
    if (query) {
      const searchLower = query.toLowerCase();
      results = results.filter(plugin => 
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters (similar to templates)
    if (filters.category) {
      results = results.filter(plugin => plugin.category === filters.category);
    }

    if (filters.verified_only) {
      results = results.filter(plugin => plugin.is_verified);
    }

    if (filters.free_only) {
      results = results.filter(plugin => plugin.price === 0);
    }

    // Sort by popularity
    results.sort((a, b) => (b.downloads * b.rating) - (a.downloads * a.rating));

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedResults,
      total_count: results.length,
      page,
      page_size: pageSize,
      filters_applied: filters
    };
  }

  async getPlugin(pluginId: string): Promise<MarketplacePlugin | null> {
    return this.plugins.get(pluginId) || null;
  }

  async installPlugin(pluginId: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    // Check dependencies
    for (const dep of plugin.dependencies) {
      if (!dep.optional && !this.isDependencyAvailable(dep)) {
        throw new Error(`Missing required dependency: ${dep.name} ${dep.version}`);
      }
    }

    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const installedPlugin: InstalledPlugin = {
      plugin,
      installed_at: new Date(),
      is_enabled: true,
      installation_path: `/plugins/${plugin.id}`,
      config: {}
    };

    this.installedPlugins.set(pluginId, installedPlugin);
    plugin.downloads++;

    // Initialize plugin
    await this.initializePlugin(pluginId);

    return true;
  }

  async uninstallPlugin(pluginId: string): Promise<boolean> {
    const installedPlugin = this.installedPlugins.get(pluginId);
    if (!installedPlugin) return false;

    // Cleanup plugin
    await this.cleanupPlugin(pluginId);
    
    this.installedPlugins.delete(pluginId);
    return true;
  }

  async enablePlugin(pluginId: string): Promise<boolean> {
    const installedPlugin = this.installedPlugins.get(pluginId);
    if (!installedPlugin) return false;

    installedPlugin.is_enabled = true;
    await this.initializePlugin(pluginId);
    return true;
  }

  async disablePlugin(pluginId: string): Promise<boolean> {
    const installedPlugin = this.installedPlugins.get(pluginId);
    if (!installedPlugin) return false;

    installedPlugin.is_enabled = false;
    await this.cleanupPlugin(pluginId);
    return true;
  }

  getInstalledPlugins(): InstalledPlugin[] {
    return Array.from(this.installedPlugins.values());
  }

  getEnabledPlugins(): InstalledPlugin[] {
    return Array.from(this.installedPlugins.values()).filter(p => p.is_enabled);
  }

  // Plugin Event System
  addEventListener(pluginId: string, eventType: string, callback: Function): void {
    const key = `${pluginId}:${eventType}`;
    if (!this.pluginEventListeners.has(key)) {
      this.pluginEventListeners.set(key, []);
    }
    this.pluginEventListeners.get(key)!.push(callback);
  }

  removeEventListener(pluginId: string, eventType: string, callback: Function): void {
    const key = `${pluginId}:${eventType}`;
    const listeners = this.pluginEventListeners.get(key);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emitPluginEvent(pluginId: string, eventType: string, data: any): void {
    const key = `${pluginId}:${eventType}`;
    const listeners = this.pluginEventListeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Plugin event error (${pluginId}:${eventType}):`, error);
        }
      });
    }
  }

  // Review and Rating System
  async addTemplateReview(templateId: string, userId: string, username: string, rating: number, comment: string): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const review: TemplateReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      username,
      rating: Math.max(1, Math.min(5, rating)),
      comment,
      created_at: new Date(),
      helpful_votes: 0
    };

    template.reviews.push(review);
    this.updateTemplateRating(templateId);
    return true;
  }

  async addPluginReview(pluginId: string, userId: string, username: string, rating: number, comment: string): Promise<boolean> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    const review: PluginReview = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      username,
      rating: Math.max(1, Math.min(5, rating)),
      comment,
      created_at: new Date(),
      helpful_votes: 0
    };

    plugin.reviews.push(review);
    this.updatePluginRating(pluginId);
    return true;
  }

  // Private helper methods
  private updateTemplateRating(templateId: string): void {
    const template = this.templates.get(templateId);
    if (!template || template.reviews.length === 0) return;

    const totalRating = template.reviews.reduce((sum, review) => sum + review.rating, 0);
    template.rating = Math.round((totalRating / template.reviews.length) * 10) / 10;
  }

  private updatePluginRating(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || plugin.reviews.length === 0) return;

    const totalRating = plugin.reviews.reduce((sum, review) => sum + review.rating, 0);
    plugin.rating = Math.round((totalRating / plugin.reviews.length) * 10) / 10;
  }

  private isDependencyAvailable(dependency: PluginDependency): boolean {
    // Simulate dependency checking
    return true; // In real implementation, check actual dependencies
  }

  private async initializePlugin(pluginId: string): Promise<void> {
    const installedPlugin = this.installedPlugins.get(pluginId);
    if (!installedPlugin || !installedPlugin.is_enabled) return;

    // Simulate plugin initialization
    await new Promise(resolve => setTimeout(resolve, 200));
    
    this.emitPluginEvent(pluginId, 'initialized', { 
      plugin: installedPlugin.plugin,
      timestamp: new Date()
    });
  }

  private async cleanupPlugin(pluginId: string): Promise<void> {
    // Simulate plugin cleanup
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.emitPluginEvent(pluginId, 'cleanup', { 
      pluginId,
      timestamp: new Date()
    });
  }

  private initializeDefaultTemplates(): void {
    // Add some default templates for demonstration
    const sampleMaterial: Material = {
      id: 'steel1',
      name: 'steel',
      type: 'steel',
      density: 7850,
      elasticModulus: 200000000000, // 200 GPa
      poissonsRatio: 0.3,
      yieldStrength: 250000000 // 250 MPa
    };

    const sampleSection: Section = {
      id: 'w12x26',
      name: 'W12x26',
      type: 'i-section',
      width: 0.165,
      height: 0.31,
      area: 0.005,
      momentOfInertiaY: 0.000204,
      momentOfInertiaZ: 0.0000343
    };

    const sampleStructure: Structure3D = {
      nodes: [
        { id: 'n1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true } },
        { id: 'n2', x: 10, y: 0, z: 0, supports: { ux: false, uy: true, uz: true } }
      ],
      elements: [
        { id: 'e1', type: 'beam', nodes: ['n1', 'n2'], material: sampleMaterial, section: sampleSection }
      ],
      materials: [sampleMaterial],
      sections: [sampleSection],
      loads: []
    };

    const templates: Omit<MarketplaceTemplate, 'id' | 'downloads' | 'reviews' | 'created_at' | 'updated_at'>[] = [
      {
        name: 'Simple Frame Structure',
        description: 'Basic steel frame structure template for small buildings',
        category: 'commercial',
        author: 'StructuralTemplates',
        version: '1.0.0',
        tags: ['steel', 'frame', 'basic', 'beginner'],
        preview_image: '/templates/simple_frame.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'Office Building',
          structural_system: 'Steel Frame',
          materials: ['Steel'],
          codes: ['AISC 360'],
          complexity_level: 'beginner',
          floor_count: 2,
          total_area: 1000
        },
        rating: 4.5,
        price: 0,
        license: 'free',
        is_verified: true
      }
    ];

    templates.forEach(template => {
      const id = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.templates.set(id, {
        ...template,
        id,
        downloads: Math.floor(Math.random() * 1000),
        reviews: [],
        created_at: new Date(),
        updated_at: new Date()
      });
    });
  }

  private initializeDefaultPlugins(): void {
    const plugins: Omit<MarketplacePlugin, 'id' | 'downloads' | 'reviews' | 'created_at' | 'updated_at'>[] = [
      {
        name: 'Advanced Seismic Analysis',
        description: 'Enhanced seismic analysis with response spectrum and time history',
        category: 'analysis',
        author: 'SeismicSoft',
        version: '2.1.0',
        tags: ['seismic', 'earthquake', 'analysis', 'advanced'],
        icon: '/plugins/seismic_icon.png',
        entry_point: 'seismic_analysis_main.js',
        permissions: [
          { type: 'file_access', description: 'Read structural model files', required: true },
          { type: 'network_access', description: 'Download seismic data', required: false }
        ],
        dependencies: [
          { name: 'math_engine', version: '1.0.0', type: 'library', optional: false }
        ],
        metadata: {
          plugin_type: 'analysis',
          api_version: '1.0',
          min_app_version: '1.0.0',
          file_size: 2048000,
          installation_guide: 'Download and install automatically',
          documentation_url: 'https://seismicsoft.com/docs',
          support_url: 'https://seismicsoft.com/support'
        },
        rating: 4.8,
        price: 299,
        license: 'commercial',
        is_verified: true,
        compatibility: ['1.0.0', '1.1.0', '2.0.0']
      },
      {
        name: 'Basic Report Generator',
        description: 'Free plugin for generating simple structural analysis reports',
        category: 'reporting',
        author: 'OpenStructure',
        version: '1.0.0',
        tags: ['report', 'pdf', 'free', 'basic'],
        icon: '/plugins/report_icon.png',
        entry_point: 'report_generator_main.js',
        permissions: [
          { type: 'file_access', description: 'Write report files', required: true }
        ],
        dependencies: [],
        metadata: {
          plugin_type: 'utility',
          api_version: '1.0',
          min_app_version: '1.0.0',
          file_size: 512000,
          installation_guide: 'Download and install automatically',
          documentation_url: 'https://openstructure.org/docs'
        },
        rating: 4.2,
        price: 0,
        license: 'free',
        is_verified: true,
        compatibility: ['1.0.0', '1.1.0', '2.0.0']
      }
    ];

    plugins.forEach(plugin => {
      const id = `plugin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.plugins.set(id, {
        ...plugin,
        id,
        downloads: Math.floor(Math.random() * 500),
        reviews: [],
        created_at: new Date(),
        updated_at: new Date()
      });
    });
  }
}