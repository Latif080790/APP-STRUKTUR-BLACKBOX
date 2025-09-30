/**
 * Tests for BIM Integration Engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  BIMIntegrationEngine,
  BIMConfig,
  defaultBIMConfig,
  createBIMIntegrationEngine 
} from './BIMIntegrationEngine';
import { Structure3D } from '@/types/structural';

describe('BIM Integration Engine', () => {
  let engine: BIMIntegrationEngine;
  let mockStructure: Structure3D;

  beforeEach(() => {
    engine = new BIMIntegrationEngine(defaultBIMConfig);
    
    mockStructure = {
      nodes: [
        {
          id: 'N1',
          x: 0,
          y: 0,
          z: 0,
          supports: { ux: true, uy: true, uz: true }
        },
        {
          id: 'N2',
          x: 3,
          y: 0,
          z: 0,
          supports: {}
        }
      ],
      elements: [
        {
          id: 'E1',
          type: 'beam',
          nodes: ['N1', 'N2'],
          material: {
            id: 'M1',
            name: 'Steel',
            type: 'steel',
            elasticModulus: 2e11,
            density: 7850
          },
          section: {
            id: 'S1',
            name: 'Rectangle',
            type: 'rectangular',
            width: 0.2,
            height: 0.4
          }
        }
      ],
      loads: []
    };
  });

  describe('Constructor dan Factory', () => {
    it('should create engine dengan config', () => {
      expect(engine).toBeDefined();
      expect(engine).toBeInstanceOf(BIMIntegrationEngine);
    });

    it('should create engine menggunakan factory function', () => {
      const factoryEngine = createBIMIntegrationEngine(defaultBIMConfig);
      expect(factoryEngine).toBeInstanceOf(BIMIntegrationEngine);
    });

    it('should use default config', () => {
      expect(defaultBIMConfig.format).toBe('json');
      expect(defaultBIMConfig.units).toBe('m');
      expect(defaultBIMConfig.includeMaterials).toBe(true);
    });
  });

  describe('Format Detection', () => {
    it('should detect JSON format', async () => {
      const jsonFile = new File(['{}'], 'test.json', { type: 'application/json' });
      const result = await engine.importFile(jsonFile);
      
      expect(result).toBeDefined();
      // JSON import should be handled
    });

    it('should detect IFC format', async () => {
      const ifcContent = `ISO-10303-21;
      HEADER;
      FILE_DESCRIPTION(('Test'),'2;1');
      ENDSEC;
      DATA;
      ENDSEC;
      END-ISO-10303-21;`;
      
      const ifcFile = new File([ifcContent], 'test.ifc', { type: 'text/plain' });
      const result = await engine.importFile(ifcFile);
      
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });

    it('should detect OBJ format', async () => {
      const objContent = `# OBJ File
      v 0.0 0.0 0.0
      v 1.0 0.0 0.0
      l 1 2`;
      
      const objFile = new File([objContent], 'test.obj', { type: 'text/plain' });
      const result = await engine.importFile(objFile);
      
      expect(result).toBeDefined();
    });

    it('should handle unsupported format', async () => {
      const unsupportedFile = new File(['content'], 'test.xyz', { type: 'text/plain' });
      const result = await engine.importFile(unsupportedFile);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('JSON Import/Export', () => {
    it('should import valid JSON structure', async () => {
      const jsonContent = JSON.stringify(mockStructure);
      const jsonFile = new File([jsonContent], 'test.json', { type: 'application/json' });
      
      const result = await engine.importFile(jsonFile);
      
      expect(result.success).toBe(true);
      expect(result.structure).toBeDefined();
      expect(result.structure?.nodes.length).toBe(2);
      expect(result.structure?.elements.length).toBe(1);
    });

    it('should export structure to JSON', async () => {
      const result = await engine.exportStructure(mockStructure, 'test.json');
      
      expect(result.success).toBe(true);
      expect(result.fileContent).toBeDefined();
      expect(result.fileName).toBe('test.json');
      expect(result.fileSize).toBeGreaterThan(0);
    });

    it('should handle invalid JSON', async () => {
      const invalidJson = '{ invalid json }';
      const jsonFile = new File([invalidJson], 'test.json', { type: 'application/json' });
      
      const result = await engine.importFile(jsonFile);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('IFC Import/Export', () => {
    it('should import IFC file', async () => {
      const ifcContent = `ISO-10303-21;
      HEADER;
      FILE_DESCRIPTION(('Test IFC'),'2;1');
      FILE_NAME('test.ifc','2024-01-01T00:00:00',('Test'),('Test'),'','','');
      FILE_SCHEMA(('IFC2X3'));
      ENDSEC;
      DATA;
      #1= IFCPROJECT('123','Test Project',$,$,$,$,$,$,$);
      ENDSEC;
      END-ISO-10303-21;`;
      
      const ifcFile = new File([ifcContent], 'test.ifc', { type: 'text/plain' });
      const result = await engine.importFile(ifcFile);
      
      expect(result).toBeDefined();
      expect(result.conversionLog.length).toBeGreaterThan(0);
    });

    it('should export structure to IFC', async () => {
      const result = await engine.exportStructure(mockStructure, 'test.ifc');
      
      expect(result.success).toBe(true);
      expect(result.fileContent).toBeDefined();
      expect(result.fileName).toBe('test.ifc');
      
      if (result.fileContent) {
        const content = result.fileContent as string;
        expect(content).toContain('ISO-10303-21');
        expect(content).toContain('HEADER');
        expect(content).toContain('DATA');
      }
    });

    it('should handle malformed IFC', async () => {
      const malformedIfc = 'Not a valid IFC file';
      const ifcFile = new File([malformedIfc], 'test.ifc', { type: 'text/plain' });
      
      const result = await engine.importFile(ifcFile);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('OBJ Import/Export', () => {
    it('should import OBJ file', async () => {
      const objContent = `# Simple OBJ
      v 0.0 0.0 0.0
      v 1.0 0.0 0.0
      v 0.0 1.0 0.0
      l 1 2
      l 2 3`;
      
      const objFile = new File([objContent], 'test.obj', { type: 'text/plain' });
      const result = await engine.importFile(objFile);
      
      expect(result.success).toBe(true);
      expect(result.structure).toBeDefined();
      expect(result.structure?.nodes.length).toBe(3);
      expect(result.warnings.length).toBeGreaterThan(0); // Should warn about mesh-based structure
    });

    it('should export structure to OBJ', async () => {
      const result = await engine.exportStructure(mockStructure, 'test.obj');
      
      expect(result.success).toBe(true);
      expect(result.fileContent).toBeDefined();
      
      if (result.fileContent) {
        const content = result.fileContent as string;
        expect(content).toContain('v '); // Should contain vertices
        expect(content).toContain('l '); // Should contain lines
      }
    });
  });

  describe('DXF Export', () => {
    it('should export structure to DXF', async () => {
      const result = await engine.exportStructure(mockStructure, 'test.dxf');
      
      expect(result.success).toBe(true);
      expect(result.fileContent).toBeDefined();
      
      if (result.fileContent) {
        const content = result.fileContent as string;
        expect(content).toContain('SECTION');
        expect(content).toContain('ENTITIES');
        expect(content).toContain('POINT');
        expect(content).toContain('LINE');
      }
    });
  });

  describe('glTF Import/Export', () => {
    it('should import glTF file', async () => {
      const gltfContent = JSON.stringify({
        asset: { version: '2.0' },
        scene: 0,
        scenes: [{ nodes: [0] }],
        nodes: [
          { name: 'Node1', translation: [0, 0, 0] },
          { name: 'Node2', translation: [1, 0, 0] }
        ]
      });
      
      const gltfFile = new File([gltfContent], 'test.gltf', { type: 'application/json' });
      const result = await engine.importFile(gltfFile);
      
      expect(result.success).toBe(true);
      expect(result.structure).toBeDefined();
    });

    it('should export structure to glTF', async () => {
      const result = await engine.exportStructure(mockStructure, 'test.gltf');
      
      expect(result.success).toBe(true);
      expect(result.fileContent).toBeDefined();
      
      if (result.fileContent) {
        const content = JSON.parse(result.fileContent as string);
        expect(content.asset).toBeDefined();
        expect(content.nodes).toBeDefined();
      }
    });
  });

  describe('Configuration Options', () => {
    it('should respect unit configuration', async () => {
      const mmConfig: BIMConfig = {
        ...defaultBIMConfig,
        units: 'mm'
      };
      
      const mmEngine = new BIMIntegrationEngine(mmConfig);
      const result = await mmEngine.exportStructure(mockStructure, 'test.json');
      
      expect(result.success).toBe(true);
    });

    it('should respect include options', async () => {
      const limitedConfig: BIMConfig = {
        ...defaultBIMConfig,
        includeMaterials: false,
        includeSections: false,
        includeLoads: false
      };
      
      const limitedEngine = new BIMIntegrationEngine(limitedConfig);
      const result = await limitedEngine.exportStructure(mockStructure, 'test.json');
      
      expect(result.success).toBe(true);
    });

    it('should handle different level of detail', async () => {
      const configs = ['basic', 'detailed', 'full'] as const;
      
      for (const lod of configs) {
        const config: BIMConfig = {
          ...defaultBIMConfig,
          levelOfDetail: lod
        };
        
        const engine = new BIMIntegrationEngine(config);
        const result = await engine.exportStructure(mockStructure, 'test.json');
        
        expect(result.success).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle empty files', async () => {
      const emptyFile = new File([''], 'empty.json', { type: 'application/json' });
      const result = await engine.importFile(emptyFile);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle corrupted files', async () => {
      const corruptedFile = new File(['\x00\x01\x02'], 'corrupted.ifc', { type: 'text/plain' });
      const result = await engine.importFile(corruptedFile);
      
      expect(result.success).toBe(false);
    });

    it('should handle export errors gracefully', async () => {
      const invalidStructure = null as any;
      const result = await engine.exportStructure(invalidStructure, 'test.json');
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Model Information', () => {
    it('should calculate bounding box correctly', async () => {
      const jsonContent = JSON.stringify(mockStructure);
      const jsonFile = new File([jsonContent], 'test.json', { type: 'application/json' });
      
      const result = await engine.importFile(jsonFile);
      
      expect(result.success).toBe(true);
      expect(result.modelInfo).toBeDefined();
      expect(result.modelInfo?.boundingBox).toBeDefined();
      
      if (result.modelInfo) {
        const bbox = result.modelInfo.boundingBox;
        expect(bbox.min.x).toBe(0);
        expect(bbox.max.x).toBe(3);
        expect(bbox.min.y).toBe(0);
        expect(bbox.max.y).toBe(0);
      }
    });

    it('should count elements correctly', async () => {
      const jsonContent = JSON.stringify(mockStructure);
      const jsonFile = new File([jsonContent], 'test.json', { type: 'application/json' });
      
      const result = await engine.importFile(jsonFile);
      
      expect(result.modelInfo?.elementCount.nodes).toBe(2);
      expect(result.modelInfo?.elementCount.elements).toBe(1);
      expect(result.modelInfo?.elementCount.materials).toBe(1);
      expect(result.modelInfo?.elementCount.sections).toBe(1);
    });

    it('should include conversion log', async () => {
      const jsonContent = JSON.stringify(mockStructure);
      const jsonFile = new File([jsonContent], 'test.json', { type: 'application/json' });
      
      const result = await engine.importFile(jsonFile);
      
      expect(result.conversionLog).toBeDefined();
      expect(result.conversionLog.length).toBeGreaterThan(0);
      expect(result.conversionLog[0]).toContain('Starting import');
    });
  });
});