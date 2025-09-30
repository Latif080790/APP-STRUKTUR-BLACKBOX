/**
 * Marketplace Engine Test Suite
 * Comprehensive tests for template library and plugin system functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  MarketplaceEngine,
  MarketplaceTemplate,
  MarketplacePlugin,
  MarketplaceSearchFilter
} from './MarketplaceEngine';
import { Material, Section, Structure3D } from '../types/structural';

describe('MarketplaceEngine', () => {
  let marketplace: MarketplaceEngine;
  let sampleStructure: Structure3D;
  let sampleMaterial: Material;
  let sampleSection: Section;

  beforeEach(() => {
    marketplace = new MarketplaceEngine();
    
    sampleMaterial = {
      id: 'test_steel',
      name: 'Test Steel',
      type: 'steel',
      density: 7850,
      elasticModulus: 200000000000
    };

    sampleSection = {
      id: 'test_section',
      name: 'Test Section',
      type: 'i-section',
      width: 0.2,
      height: 0.3,
      area: 0.01
    };

    sampleStructure = {
      nodes: [
        { id: 'n1', x: 0, y: 0, z: 0 },
        { id: 'n2', x: 5, y: 0, z: 0 }
      ],
      elements: [
        { id: 'e1', type: 'beam', nodes: ['n1', 'n2'], material: sampleMaterial, section: sampleSection }
      ],
      materials: [sampleMaterial],
      sections: [sampleSection],
      loads: []
    };
  });

  describe('Template Management', () => {
    it('should search templates with no filters', async () => {
      const result = await marketplace.searchTemplates();
      
      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.total_count).toBeGreaterThanOrEqual(0);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(20);
    });

    it('should search templates with text query', async () => {
      const result = await marketplace.searchTemplates('frame');
      
      expect(result).toBeDefined();
      expect(result.items.every(template => 
        template.name.toLowerCase().includes('frame') ||
        template.description.toLowerCase().includes('frame') ||
        template.tags.some(tag => tag.toLowerCase().includes('frame'))
      )).toBe(true);
    });

    it('should filter templates by category', async () => {
      const filters: MarketplaceSearchFilter = { category: 'commercial' };
      const result = await marketplace.searchTemplates('', filters);
      
      expect(result.items.every(template => template.category === 'commercial')).toBe(true);
    });

    it('should filter templates by verified status', async () => {
      const filters: MarketplaceSearchFilter = { verified_only: true };
      const result = await marketplace.searchTemplates('', filters);
      
      expect(result.items.every(template => template.is_verified)).toBe(true);
    });

    it('should filter templates by free status', async () => {
      const filters: MarketplaceSearchFilter = { free_only: true };
      const result = await marketplace.searchTemplates('', filters);
      
      expect(result.items.every(template => template.price === 0)).toBe(true);
    });

    it('should filter templates by rating', async () => {
      const filters: MarketplaceSearchFilter = { rating_min: 4.0 };
      const result = await marketplace.searchTemplates('', filters);
      
      expect(result.items.every(template => template.rating >= 4.0)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await marketplace.searchTemplates('', {}, 1, 5);
      const page2 = await marketplace.searchTemplates('', {}, 2, 5);
      
      expect(page1.page).toBe(1);
      expect(page1.page_size).toBe(5);
      expect(page1.items.length).toBeLessThanOrEqual(5);
      
      expect(page2.page).toBe(2);
      expect(page2.page_size).toBe(5);
    });

    it('should upload a new template', async () => {
      const templateData = {
        name: 'Test Template',
        description: 'A test template for unit testing',
        category: 'residential' as const,
        author: 'Test Author',
        version: '1.0.0',
        tags: ['test', 'residential'],
        preview_image: '/test.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'House',
          structural_system: 'Steel Frame',
          materials: ['Steel'],
          codes: ['AISC'],
          complexity_level: 'beginner' as const
        },
        rating: 0,
        price: 0,
        license: 'free' as const,
        is_verified: false
      };

      const templateId = await marketplace.uploadTemplate(templateData);
      
      expect(templateId).toBeDefined();
      expect(typeof templateId).toBe('string');
      
      const retrievedTemplate = await marketplace.getTemplate(templateId);
      expect(retrievedTemplate).toBeDefined();
      expect(retrievedTemplate?.name).toBe(templateData.name);
    });

    it('should download template and increment download count', async () => {
      // First, upload a template
      const templateData = {
        name: 'Download Test Template',
        description: 'Template for testing downloads',
        category: 'commercial' as const,
        author: 'Test Author',
        version: '1.0.0',
        tags: ['test'],
        preview_image: '/test.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'Office',
          structural_system: 'Steel Frame',
          materials: ['Steel'],
          codes: ['AISC'],
          complexity_level: 'intermediate' as const
        },
        rating: 0,
        price: 0,
        license: 'free' as const,
        is_verified: false
      };

      const templateId = await marketplace.uploadTemplate(templateData);
      const initialTemplate = await marketplace.getTemplate(templateId);
      const initialDownloads = initialTemplate?.downloads || 0;

      // Download the template
      const structure = await marketplace.downloadTemplate(templateId);
      
      expect(structure).toBeDefined();
      expect(structure?.nodes).toEqual(sampleStructure.nodes);
      
      // Check that download count increased
      const updatedTemplate = await marketplace.getTemplate(templateId);
      expect(updatedTemplate?.downloads).toBe(initialDownloads + 1);
    });

    it('should return null for non-existent template', async () => {
      const template = await marketplace.getTemplate('non_existent_id');
      expect(template).toBeNull();
    });

    it('should return null when downloading non-existent template', async () => {
      const structure = await marketplace.downloadTemplate('non_existent_id');
      expect(structure).toBeNull();
    });
  });

  describe('Plugin Management', () => {
    it('should search plugins with no filters', async () => {
      const result = await marketplace.searchPlugins();
      
      expect(result).toBeDefined();
      expect(result.items).toBeInstanceOf(Array);
      expect(result.total_count).toBeGreaterThanOrEqual(0);
    });

    it('should search plugins with text query', async () => {
      const result = await marketplace.searchPlugins('analysis');
      
      expect(result).toBeDefined();
      // At least some results should match the search query
      if (result.items.length > 0) {
        expect(result.items.some(plugin => 
          plugin.name.toLowerCase().includes('analysis') ||
          plugin.description.toLowerCase().includes('analysis') ||
          plugin.tags.some(tag => tag.toLowerCase().includes('analysis'))
        )).toBe(true);
      }
    });

    it('should install plugin successfully', async () => {
      // Get available plugins
      const searchResult = await marketplace.searchPlugins();
      
      if (searchResult.items.length > 0) {
        const plugin = searchResult.items[0];
        const initialDownloads = plugin.downloads;
        
        const success = await marketplace.installPlugin(plugin.id);
        
        expect(success).toBe(true);
        
        // Check that plugin is now installed
        const installedPlugins = marketplace.getInstalledPlugins();
        const installedPlugin = installedPlugins.find(p => p.plugin.id === plugin.id);
        
        expect(installedPlugin).toBeDefined();
        expect(installedPlugin?.is_enabled).toBe(true);
        
        // Check that download count increased
        const updatedPlugin = await marketplace.getPlugin(plugin.id);
        expect(updatedPlugin?.downloads).toBe(initialDownloads + 1);
      }
    });

    it('should fail to install non-existent plugin', async () => {
      const success = await marketplace.installPlugin('non_existent_plugin');
      expect(success).toBe(false);
    });

    it('should uninstall plugin successfully', async () => {
      // First install a plugin
      const searchResult = await marketplace.searchPlugins();
      
      if (searchResult.items.length > 0) {
        const plugin = searchResult.items[0];
        await marketplace.installPlugin(plugin.id);
        
        // Verify it's installed
        let installedPlugins = marketplace.getInstalledPlugins();
        expect(installedPlugins.some(p => p.plugin.id === plugin.id)).toBe(true);
        
        // Uninstall it
        const success = await marketplace.uninstallPlugin(plugin.id);
        expect(success).toBe(true);
        
        // Verify it's no longer installed
        installedPlugins = marketplace.getInstalledPlugins();
        expect(installedPlugins.some(p => p.plugin.id === plugin.id)).toBe(false);
      }
    });

    it('should enable and disable plugins', async () => {
      // Install a plugin first
      const searchResult = await marketplace.searchPlugins();
      
      if (searchResult.items.length > 0) {
        const plugin = searchResult.items[0];
        await marketplace.installPlugin(plugin.id);
        
        // Disable the plugin
        const disableSuccess = await marketplace.disablePlugin(plugin.id);
        expect(disableSuccess).toBe(true);
        
        let installedPlugins = marketplace.getInstalledPlugins();
        let installedPlugin = installedPlugins.find(p => p.plugin.id === plugin.id);
        expect(installedPlugin?.is_enabled).toBe(false);
        
        // Re-enable the plugin
        const enableSuccess = await marketplace.enablePlugin(plugin.id);
        expect(enableSuccess).toBe(true);
        
        installedPlugins = marketplace.getInstalledPlugins();
        installedPlugin = installedPlugins.find(p => p.plugin.id === plugin.id);
        expect(installedPlugin?.is_enabled).toBe(true);
      }
    });

    it('should return only enabled plugins', async () => {
      // Install and setup plugins
      const searchResult = await marketplace.searchPlugins();
      
      if (searchResult.items.length > 0) {
        const plugin = searchResult.items[0];
        await marketplace.installPlugin(plugin.id);
        await marketplace.disablePlugin(plugin.id);
        
        const enabledPlugins = marketplace.getEnabledPlugins();
        const allInstalledPlugins = marketplace.getInstalledPlugins();
        
        expect(enabledPlugins.length).toBeLessThanOrEqual(allInstalledPlugins.length);
        expect(enabledPlugins.every(p => p.is_enabled)).toBe(true);
      }
    });
  });

  describe('Plugin Event System', () => {
    it('should add and trigger event listeners', async () => {
      const mockCallback = vi.fn();
      const pluginId = 'test_plugin';
      
      marketplace.addEventListener(pluginId, 'test_event', mockCallback);
      marketplace.emitPluginEvent(pluginId, 'test_event', { test: 'data' });
      
      expect(mockCallback).toHaveBeenCalledWith({ test: 'data' });
    });

    it('should remove event listeners', async () => {
      const mockCallback = vi.fn();
      const pluginId = 'test_plugin';
      
      marketplace.addEventListener(pluginId, 'test_event', mockCallback);
      marketplace.removeEventListener(pluginId, 'test_event', mockCallback);
      marketplace.emitPluginEvent(pluginId, 'test_event', { test: 'data' });
      
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should handle plugin event errors gracefully', async () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Test error');
      });
      const normalCallback = vi.fn();
      const pluginId = 'test_plugin';
      
      marketplace.addEventListener(pluginId, 'test_event', errorCallback);
      marketplace.addEventListener(pluginId, 'test_event', normalCallback);
      
      // Should not throw error
      expect(() => {
        marketplace.emitPluginEvent(pluginId, 'test_event', { test: 'data' });
      }).not.toThrow();
      
      expect(errorCallback).toHaveBeenCalled();
      expect(normalCallback).toHaveBeenCalled();
    });
  });

  describe('Review and Rating System', () => {
    it('should add template review and update rating', async () => {
      // Upload a template first
      const templateData = {
        name: 'Review Test Template',
        description: 'Template for testing reviews',
        category: 'residential' as const,
        author: 'Test Author',
        version: '1.0.0',
        tags: ['test'],
        preview_image: '/test.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'House',
          structural_system: 'Steel Frame',
          materials: ['Steel'],
          codes: ['AISC'],
          complexity_level: 'beginner' as const
        },
        rating: 0,
        price: 0,
        license: 'free' as const,
        is_verified: false
      };

      const templateId = await marketplace.uploadTemplate(templateData);
      
      // Add a review
      const success = await marketplace.addTemplateReview(
        templateId, 
        'user123', 
        'TestUser', 
        5, 
        'Great template!'
      );
      
      expect(success).toBe(true);
      
      // Check that review was added and rating updated
      const template = await marketplace.getTemplate(templateId);
      expect(template?.reviews.length).toBe(1);
      expect(template?.reviews[0].rating).toBe(5);
      expect(template?.reviews[0].comment).toBe('Great template!');
      expect(template?.rating).toBe(5.0);
    });

    it('should add plugin review and update rating', async () => {
      const searchResult = await marketplace.searchPlugins();
      
      if (searchResult.items.length > 0) {
        const plugin = searchResult.items[0];
        const initialReviewCount = plugin.reviews.length;
        
        const success = await marketplace.addPluginReview(
          plugin.id, 
          'user123', 
          'TestUser', 
          4, 
          'Useful plugin!'
        );
        
        expect(success).toBe(true);
        
        // Check that review was added
        const updatedPlugin = await marketplace.getPlugin(plugin.id);
        expect(updatedPlugin?.reviews.length).toBe(initialReviewCount + 1);
      }
    });

    it('should handle rating bounds correctly', async () => {
      const templateData = {
        name: 'Rating Bounds Test',
        description: 'Template for testing rating bounds',
        category: 'commercial' as const,
        author: 'Test Author',
        version: '1.0.0',
        tags: ['test'],
        preview_image: '/test.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'Office',
          structural_system: 'Steel Frame',
          materials: ['Steel'],
          codes: ['AISC'],
          complexity_level: 'beginner' as const
        },
        rating: 0,
        price: 0,
        license: 'free' as const,
        is_verified: false
      };

      const templateId = await marketplace.uploadTemplate(templateData);
      
      // Test upper bound
      await marketplace.addTemplateReview(templateId, 'user1', 'User1', 10, 'Test'); // Should be clamped to 5
      
      // Test lower bound  
      await marketplace.addTemplateReview(templateId, 'user2', 'User2', -1, 'Test'); // Should be clamped to 1
      
      const template = await marketplace.getTemplate(templateId);
      expect(template?.reviews[0].rating).toBe(5);
      expect(template?.reviews[1].rating).toBe(1);
    });

    it('should return false for non-existent template review', async () => {
      const success = await marketplace.addTemplateReview(
        'non_existent_template', 
        'user123', 
        'TestUser', 
        5, 
        'Review'
      );
      
      expect(success).toBe(false);
    });

    it('should return false for non-existent plugin review', async () => {
      const success = await marketplace.addPluginReview(
        'non_existent_plugin', 
        'user123', 
        'TestUser', 
        5, 
        'Review'
      );
      
      expect(success).toBe(false);
    });
  });

  describe('Integration Testing', () => {
    it('should handle complete workflow: search, install, enable, disable, uninstall', async () => {
      // Search for plugins
      const searchResult = await marketplace.searchPlugins('', { free_only: true });
      expect(searchResult.items.length).toBeGreaterThan(0);
      
      const plugin = searchResult.items[0];
      const initialDownloads = plugin.downloads;
      
      // Install plugin
      const installSuccess = await marketplace.installPlugin(plugin.id);
      expect(installSuccess).toBe(true);
      
      // Check installation
      let installedPlugins = marketplace.getInstalledPlugins();
      let installedPlugin = installedPlugins.find(p => p.plugin.id === plugin.id);
      expect(installedPlugin).toBeDefined();
      expect(installedPlugin?.is_enabled).toBe(true);
      
      // Test enabled plugins list
      let enabledPlugins = marketplace.getEnabledPlugins();
      expect(enabledPlugins.some(p => p.plugin.id === plugin.id)).toBe(true);
      
      // Disable plugin
      const disableSuccess = await marketplace.disablePlugin(plugin.id);
      expect(disableSuccess).toBe(true);
      
      enabledPlugins = marketplace.getEnabledPlugins();
      expect(enabledPlugins.some(p => p.plugin.id === plugin.id)).toBe(false);
      
      // Re-enable plugin
      const enableSuccess = await marketplace.enablePlugin(plugin.id);
      expect(enableSuccess).toBe(true);
      
      enabledPlugins = marketplace.getEnabledPlugins();
      expect(enabledPlugins.some(p => p.plugin.id === plugin.id)).toBe(true);
      
      // Uninstall plugin
      const uninstallSuccess = await marketplace.uninstallPlugin(plugin.id);
      expect(uninstallSuccess).toBe(true);
      
      installedPlugins = marketplace.getInstalledPlugins();
      expect(installedPlugins.some(p => p.plugin.id === plugin.id)).toBe(false);
      
      // Verify download count increased
      const updatedPlugin = await marketplace.getPlugin(plugin.id);
      expect(updatedPlugin?.downloads).toBe(initialDownloads + 1);
    });

    it('should handle complete template workflow: upload, search, download, review', async () => {
      const templateData = {
        name: 'Complete Workflow Template',
        description: 'Template for testing complete workflow',
        category: 'industrial' as const,
        author: 'Workflow Tester',
        version: '2.0.0',
        tags: ['workflow', 'test', 'industrial'],
        preview_image: '/workflow.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'Factory',
          structural_system: 'Steel Frame',
          materials: ['Steel', 'Concrete'],
          codes: ['AISC', 'ACI'],
          complexity_level: 'advanced' as const,
          floor_count: 1,
          total_area: 5000
        },
        rating: 0,
        price: 99,
        license: 'commercial' as const,
        is_verified: true
      };

      // Upload template
      const templateId = await marketplace.uploadTemplate(templateData);
      expect(templateId).toBeDefined();
      
      // Search for the uploaded template
      const searchResult = await marketplace.searchTemplates('Complete Workflow');
      const foundTemplate = searchResult.items.find(t => t.id === templateId);
      expect(foundTemplate).toBeDefined();
      
      // Download template
      const structure = await marketplace.downloadTemplate(templateId);
      expect(structure).toBeDefined();
      expect(structure?.nodes.length).toBe(2);
      
      // Add multiple reviews
      await marketplace.addTemplateReview(templateId, 'user1', 'User1', 5, 'Excellent!');
      await marketplace.addTemplateReview(templateId, 'user2', 'User2', 4, 'Very good');
      await marketplace.addTemplateReview(templateId, 'user3', 'User3', 5, 'Perfect!');
      
      // Check updated template
      const finalTemplate = await marketplace.getTemplate(templateId);
      expect(finalTemplate?.reviews.length).toBe(3);
      expect(finalTemplate?.rating).toBeCloseTo(4.7, 1); // (5+4+5)/3 = 4.67
      expect(finalTemplate?.downloads).toBe(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty search results gracefully', async () => {
      const result = await marketplace.searchTemplates('very_unique_search_that_matches_nothing_12345');
      
      expect(result.items).toEqual([]);
      expect(result.total_count).toBe(0);
    });

    it('should handle invalid page numbers', async () => {
      const result = await marketplace.searchTemplates('', {}, -1, 10);
      
      expect(result.page).toBe(-1); // Should accept the input as-is
      expect(result.items).toEqual([]); // But return empty results
    });

    it('should handle very large page sizes', async () => {
      const result = await marketplace.searchTemplates('', {}, 1, 1000);
      
      expect(result.page_size).toBe(1000);
      expect(result.items.length).toBeLessThanOrEqual(1000);
    });

    it('should handle concurrent plugin operations safely', async () => {
      const searchResult = await marketplace.searchPlugins();
      
      if (searchResult.items.length > 0) {
        const plugin = searchResult.items[0];
        
        // Install plugin
        await marketplace.installPlugin(plugin.id);
        
        // Try concurrent operations
        const promises = [
          marketplace.enablePlugin(plugin.id),
          marketplace.disablePlugin(plugin.id),
          marketplace.enablePlugin(plugin.id)
        ];
        
        // Should not throw errors
        await expect(Promise.all(promises)).resolves.toBeDefined();
        
        // Clean up
        await marketplace.uninstallPlugin(plugin.id);
      }
    });

    it('should validate review data bounds', async () => {
      const templateData = {
        name: 'Validation Test Template',
        description: 'Template for validation testing',
        category: 'utility' as const,
        author: 'Validator',
        version: '1.0.0',
        tags: ['validation'],
        preview_image: '/validation.png',
        structure_data: sampleStructure,
        metadata: {
          building_type: 'Utility Building',
          structural_system: 'Steel Frame',
          materials: ['Steel'],
          codes: ['AISC'],
          complexity_level: 'beginner' as const
        },
        rating: 0,
        price: 0,
        license: 'free' as const,
        is_verified: false
      };

      const templateId = await marketplace.uploadTemplate(templateData);
      
      // Test extreme values
      await marketplace.addTemplateReview(templateId, 'user1', 'User1', 999, 'Extreme high');
      await marketplace.addTemplateReview(templateId, 'user2', 'User2', -999, 'Extreme low');
      
      const template = await marketplace.getTemplate(templateId);
      expect(template?.reviews[0].rating).toBe(5); // Clamped to max
      expect(template?.reviews[1].rating).toBe(1); // Clamped to min
    });
  });
});