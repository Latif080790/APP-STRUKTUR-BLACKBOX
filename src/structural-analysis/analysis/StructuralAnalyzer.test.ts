import { describe, it, expect, vi } from 'vitest';
import { analyzeStructure, calculateSectionProperties, checkElementSafety } from './StructuralAnalyzer';
import { Structure3D, Element, Node, Material, Section } from '@/types/structural';

// Mock the DOM APIs that are not available in Node.js environment
Object.defineProperty(globalThis, 'document', {
  value: {
    createElement: vi.fn().mockImplementation((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: vi.fn(),
          style: {}
        };
      } else if (tag === 'canvas') {
        return {
          width: 800,
          height: 600,
          getContext: vi.fn().mockReturnValue({
            scale: vi.fn(),
            drawImage: vi.fn()
          }),
          toDataURL: vi.fn().mockReturnValue('data:image/png;base64,test')
        };
      }
      return {};
    }),
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn()
    },
    querySelector: vi.fn().mockReturnValue({
      width: 800,
      height: 600,
      getContext: vi.fn().mockReturnValue({
        scale: vi.fn(),
        drawImage: vi.fn()
      })
    })
  }
});

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: vi.fn().mockReturnValue('blob:test'),
    revokeObjectURL: vi.fn()
  }
});

Object.defineProperty(globalThis, 'window', {
  value: {
    location: {
      href: ''
    }
  }
});

describe('StructuralAnalyzer', () => {
  describe('analyzeStructure', () => {
    it('should return default results for empty structure', () => {
      const structure: Structure3D = {
        nodes: [],
        elements: []
      };
      
      const result = analyzeStructure(structure);
      
      expect(result.displacements).toEqual([]);
      expect(result.forces).toEqual([]);
      expect(result.stresses).toEqual([]);
      expect(result.isValid).toBe(true); // With zero displacements and stresses, it's valid
      expect(result.maxDisplacement).toBe(0);
      expect(result.maxStress).toBe(0);
    });
    
    it('should calculate displacements for simple structure', () => {
      const nodes: Node[] = [
        { id: '1', x: 0, y: 0, z: 0 },
        { id: '2', x: 5, y: 0, z: 0 }
      ];
      
      const material: Material = {
        id: 'steel',
        name: 'Steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 2e11,
        yieldStrength: 250e6
      };
      
      const section: Section = {
        id: 'rect1',
        name: 'Rectangular Section',
        type: 'rectangular',
        width: 0.2,
        height: 0.4
      };
      
      const elements: Element[] = [
        {
          id: '1',
          type: 'beam',
          nodes: ['1', '2'],
          material,
          section
        }
      ];
      
      const structure: Structure3D = {
        nodes,
        elements
      };
      
      const result = analyzeStructure(structure);
      
      expect(result.displacements).toHaveLength(2);
      expect(result.forces).toHaveLength(1);
      expect(result.stresses).toHaveLength(1);
    });
  });
  
  describe('calculateSectionProperties', () => {
    it('should calculate properties for rectangular section', () => {
      const element: Element = {
        id: '1',
        type: 'beam',
        nodes: ['1', '2'],
        material: {
          id: 'concrete',
          name: 'Concrete',
          type: 'concrete',
          density: 2400,
          elasticModulus: 30e9
        },
        section: {
          id: 'rect1',
          name: 'Rectangular Section',
          type: 'rectangular',
          width: 0.3,
          height: 0.5
        }
      };
      
      const props = calculateSectionProperties(element);
      
      expect(props.area).toBeCloseTo(0.15);
      expect(props.momentOfInertiaY).toBeCloseTo(0.3 * Math.pow(0.5, 3) / 12);
      expect(props.momentOfInertiaZ).toBeCloseTo(0.5 * Math.pow(0.3, 3) / 12);
    });
    
    it('should calculate properties for circular section', () => {
      const element: Element = {
        id: '1',
        type: 'column',
        nodes: ['1', '2'],
        material: {
          id: 'steel',
          name: 'Steel',
          type: 'steel',
          density: 7850,
          elasticModulus: 2e11
        },
        section: {
          id: 'circ1',
          name: 'Circular Section',
          type: 'circular',
          width: 0.4, // diameter
          height: 0.4
        }
      };
      
      const props = calculateSectionProperties(element);
      
      const radius = 0.2;
      const expectedArea = Math.PI * Math.pow(radius, 2);
      const expectedMoment = (Math.PI * Math.pow(radius, 4)) / 4;
      
      expect(props.area).toBeCloseTo(expectedArea);
      expect(props.momentOfInertiaY).toBeCloseTo(expectedMoment);
      expect(props.momentOfInertiaZ).toBeCloseTo(expectedMoment);
    });
  });
  
  describe('checkElementSafety', () => {
    const element: Element = {
      id: '1',
      type: 'beam',
      nodes: ['1', '2'],
      material: {
        id: 'steel',
        name: 'Steel',
        type: 'steel',
        density: 7850,
        elasticModulus: 2e11,
        yieldStrength: 250e6
      },
      section: {
        id: 'rect1',
        name: 'Rectangular Section',
        type: 'rectangular',
        width: 0.2,
        height: 0.4
      }
    };
    
    it('should pass safety check for low stresses', () => {
      const result = checkElementSafety(element, 10000, 500, 300);
      
      expect(result.isSafe).toBe(true);
    });
    
    it('should fail safety check for high stresses', () => {
      // Very high axial force to exceed allowable stress
      const result = checkElementSafety(element, 1e8, 500, 300);
      
      expect(result.isSafe).toBe(false);
    });
  });
});