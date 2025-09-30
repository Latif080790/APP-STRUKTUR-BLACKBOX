/**
 * Advanced Visualization Engine Tests
 * Comprehensive test suite for VR and stress contour visualization
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  AdvancedVisualizationEngine, 
  createAdvancedVisualizationEngine,
  VisualizationUtils,
  ColorMapUtils
} from './AdvancedVisualizationEngine';
import { Structure3D } from '../../types/structural';

// Mock WebGL and WebXR APIs
const mockWebGLContext = {
  enable: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  drawImage: vi.fn(),
  createShader: vi.fn(),
  createProgram: vi.fn(),
  getUniformLocation: vi.fn(),
  uniform1f: vi.fn(),
  uniform3fv: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  bindBuffer: vi.fn(),
  drawArrays: vi.fn(),
  viewport: vi.fn()
};

const mockCanvas = {
  getContext: vi.fn().mockReturnValue(mockWebGLContext),
  width: 800,
  height: 600
} as unknown as HTMLCanvasElement;

// Mock navigator.xr
const mockXR = {
  isSessionSupported: vi.fn().mockResolvedValue(true),
  requestSession: vi.fn().mockResolvedValue({
    addEventListener: vi.fn(),
    requestAnimationFrame: vi.fn(),
    end: vi.fn().mockResolvedValue(undefined)
  })
};

Object.defineProperty(navigator, 'xr', {
  value: mockXR,
  writable: true
});

describe('Advanced Visualization Engine', () => {
  let engine: AdvancedVisualizationEngine;
  let mockStructure: Structure3D;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Initialize engine with test config
    engine = createAdvancedVisualizationEngine({
      enableVR: true,
      enableStressContours: true,
      renderQuality: 'high',
      frameRate: 60
    });

    // Create mock structure for testing
    mockStructure = {
      nodes: [
        { id: '1', x: 0, y: 0, z: 0, supports: { ux: true, uy: true, uz: true } },
        { id: '2', x: 5, y: 0, z: 0 },
        { id: '3', x: 10, y: 0, z: 0 },
        { id: '4', x: 5, y: 3, z: 0 }
      ],
      elements: [
        {
          id: '1',
          type: 'beam',
          nodes: ['1', '2'],
          material: {
            id: 'steel',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200000
          },
          section: {
            id: 'rect1',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.3,
            height: 0.5
          }
        },
        {
          id: '2',
          type: 'beam',
          nodes: ['2', '3'],
          material: {
            id: 'steel',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200000
          },
          section: {
            id: 'rect2',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.25,
            height: 0.4
          }
        },
        {
          id: '3',
          type: 'beam',
          nodes: ['2', '4'],
          material: {
            id: 'steel',
            name: 'Steel',
            type: 'steel',
            density: 7850,
            elasticModulus: 200000
          },
          section: {
            id: 'rect3',
            name: 'Rectangular',
            type: 'rectangular',
            width: 0.2,
            height: 0.3
          }
        }
      ],
      loads: [
        {
          id: '1',
          type: 'point',
          nodeId: '3',
          direction: 'y',
          magnitude: -15000
        }
      ]
    };
  });

  describe('Engine Initialization', () => {
    it('should create visualization engine with default config', () => {
      const defaultEngine = createAdvancedVisualizationEngine();
      expect(defaultEngine).toBeInstanceOf(AdvancedVisualizationEngine);
    });

    it('should create visualization engine with custom config', () => {
      const customEngine = createAdvancedVisualizationEngine({
        renderQuality: 'ultra',
        frameRate: 120,
        enableVR: false
      });
      expect(customEngine).toBeInstanceOf(AdvancedVisualizationEngine);
    });

    it('should initialize with canvas successfully', async () => {
      const initialized = await engine.initialize(mockCanvas);
      expect(initialized).toBe(true);
      expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl2', expect.any(Object));
    });

    it('should handle WebGL initialization failure', async () => {
      const failingCanvas = {
        getContext: vi.fn().mockReturnValue(null)
      } as unknown as HTMLCanvasElement;

      const initialized = await engine.initialize(failingCanvas);
      expect(initialized).toBe(false);
    });
  });

  describe('Stress Contour Generation', () => {
    beforeEach(async () => {
      await engine.initialize(mockCanvas);
    });

    it('should generate stress contours for all elements', async () => {
      const mockAnalysisResults = {
        elementStresses: new Map([
          ['1', 25.5],
          ['2', 30.2],
          ['3', 18.7]
        ])
      };

      const contours = await engine.generateStressContours(mockStructure, mockAnalysisResults);

      expect(contours).toBeDefined();
      expect(contours.length).toBe(mockStructure.elements.length);
      
      contours.forEach(contour => {
        expect(contour.elementId).toBeDefined();
        expect(contour.stressType).toBe('vonMises');
        expect(contour.values.length).toBeGreaterThan(0);
        expect(contour.positions.length).toBeGreaterThan(0);
        expect(contour.minValue).toBeLessThanOrEqual(contour.maxValue);
        expect(contour.units).toBe('MPa');
      });
    });

    it('should handle empty structure gracefully', async () => {
      const emptyStructure: Structure3D = {
        nodes: [],
        elements: [],
        loads: []
      };

      const contours = await engine.generateStressContours(emptyStructure, {});
      expect(contours).toEqual([]);
    });

    it('should generate valid stress values', async () => {
      const contours = await engine.generateStressContours(mockStructure, {});
      
      contours.forEach(contour => {
        expect(contour.values.every(v => typeof v === 'number')).toBe(true);
        expect(contour.values.every(v => v >= 0)).toBe(true); // Stress values should be non-negative
      });
    });
  });

  describe('Deformation Animation', () => {
    beforeEach(async () => {
      await engine.initialize(mockCanvas);
    });

    it('should generate deformation animation frames', async () => {
      const mockTimeHistoryResults = {
        timeSteps: Array.from({ length: 20 }, (_, i) => i * 0.01),
        displacements: new Map()
      };

      const frames = await engine.generateDeformationAnimation(mockStructure, mockTimeHistoryResults);

      expect(frames).toBeDefined();
      expect(frames.length).toBe(20);
      
      frames.forEach((frame, index) => {
        expect(frame.timeStep).toBe(index / (frames.length - 1));
        expect(frame.nodeDisplacements.size).toBe(mockStructure.nodes.length);
        expect(frame.elementStresses.size).toBe(mockStructure.elements.length);
        expect(frame.scaleFactor).toBeGreaterThan(0);
      });
    });

    it('should generate default animation without time history', async () => {
      const frames = await engine.generateDeformationAnimation(mockStructure);

      expect(frames).toBeDefined();
      expect(frames.length).toBe(50); // Default frame count
      
      frames.forEach(frame => {
        expect(frame.nodeDisplacements.size).toBe(mockStructure.nodes.length);
        expect(frame.elementStresses.size).toBe(mockStructure.elements.length);
      });
    });

    it('should generate realistic displacement values', async () => {
      const frames = await engine.generateDeformationAnimation(mockStructure);
      
      frames.forEach(frame => {
        frame.nodeDisplacements.forEach(displacement => {
          expect(Math.abs(displacement.x)).toBeLessThan(1); // Reasonable displacement range
          expect(Math.abs(displacement.y)).toBeLessThan(1);
          expect(Math.abs(displacement.z)).toBeLessThan(1);
        });
      });
    });
  });

  describe('Force Flow Visualization', () => {
    beforeEach(async () => {
      await engine.initialize(mockCanvas);
    });

    it('should generate force flows for all elements', async () => {
      const mockAnalysisResults = {
        elementForces: new Map([
          ['1', 5000],  // Tension
          ['2', -3000], // Compression
          ['3', 8000]   // Tension
        ])
      };

      const forceFlows = await engine.generateForceFlows(mockStructure, mockAnalysisResults);

      expect(forceFlows).toBeDefined();
      expect(forceFlows.length).toBe(mockStructure.elements.length);
      
      forceFlows.forEach(flow => {
        expect(flow.elementId).toBeDefined();
        expect(flow.startPoint.length).toBe(3);
        expect(flow.endPoint.length).toBe(3);
        expect(flow.direction.length).toBe(3);
        expect(flow.magnitude).toBeGreaterThan(0);
        expect(['tension', 'compression']).toContain(flow.forceType);
        expect(flow.opacity).toBeGreaterThan(0);
        expect(flow.opacity).toBeLessThanOrEqual(1);
      });
    });

    it('should assign correct force types', async () => {
      const forceFlows = await engine.generateForceFlows(mockStructure, {});
      
      forceFlows.forEach(flow => {
        if (flow.forceType === 'tension') {
          expect(flow.color).toBe('#ff4444');
        } else if (flow.forceType === 'compression') {
          expect(flow.color).toBe('#4444ff');
        }
      });
    });

    it('should calculate normalized directions', async () => {
      const forceFlows = await engine.generateForceFlows(mockStructure, {});
      
      forceFlows.forEach(flow => {
        const [dx, dy, dz] = flow.direction;
        const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
        expect(Math.abs(magnitude - 1.0)).toBeLessThan(0.001); // Should be unit vector
      });
    });
  });

  describe('VR Functionality', () => {
    beforeEach(async () => {
      await engine.initialize(mockCanvas);
    });

    it('should start VR session successfully', async () => {
      const started = await engine.startVRSession();
      expect(started).toBe(true);
      expect(mockXR.requestSession).toHaveBeenCalledWith('immersive-vr', expect.any(Object));
    });

    it('should stop VR session successfully', async () => {
      await engine.startVRSession();
      await engine.stopVRSession();
      // Should not throw any errors
    });

    it('should handle VR session failure gracefully', async () => {
      mockXR.requestSession.mockRejectedValueOnce(new Error('VR not available'));
      
      const started = await engine.startVRSession();
      expect(started).toBe(false);
    });

    it('should handle missing WebXR support', async () => {
      // Temporarily remove navigator.xr
      const originalXR = (navigator as any).xr;
      delete (navigator as any).xr;
      
      const started = await engine.startVRSession();
      expect(started).toBe(false);
      
      // Restore navigator.xr
      (navigator as any).xr = originalXR;
    });
  });

  describe('Rendering', () => {
    beforeEach(async () => {
      await engine.initialize(mockCanvas);
    });

    it('should render visualization successfully', async () => {
      const result = await engine.render(mockStructure);

      expect(result).toBeDefined();
      expect(result.stressContours).toBeInstanceOf(Array);
      expect(result.deformationFrames).toBeInstanceOf(Array);
      expect(result.forceFlows).toBeInstanceOf(Array);
      expect(result.renderingInfo).toBeDefined();
      expect(result.performance).toBeDefined();
      expect(typeof result.vrSupported).toBe('boolean');
    });

    it('should measure rendering performance', async () => {
      const result = await engine.render(mockStructure);

      expect(result.renderingInfo.renderTime).toBeGreaterThan(0);
      expect(result.performance.fps).toBeGreaterThan(0);
      expect(result.performance.frameTime).toBeGreaterThan(0);
      expect(result.renderingInfo.totalVertices).toBeGreaterThan(0);
      expect(result.renderingInfo.totalFaces).toBeGreaterThan(0);
    });

    it('should estimate memory usage', async () => {
      const result = await engine.render(mockStructure);

      expect(result.renderingInfo.memoryUsage).toBeGreaterThan(0);
      expect(result.performance.gpuMemory).toBeGreaterThan(0);
    });

    it('should handle rendering errors gracefully', async () => {
      // Mock a WebGL error
      mockWebGLContext.enable.mockImplementation(() => {
        throw new Error('WebGL error');
      });

      await expect(engine.render(mockStructure)).rejects.toThrow();
    });
  });

  describe('Configuration Updates', () => {
    it('should update visualization config', () => {
      const newConfig = {
        renderQuality: 'ultra' as const,
        frameRate: 120,
        shadows: false
      };

      engine.updateConfig(newConfig);
      // Should not throw any errors
    });

    it('should update VR config', () => {
      const newVRConfig = {
        handTracking: true,
        hapticFeedback: false,
        roomScale: false
      };

      engine.updateVRConfig(newVRConfig);
      // Should not throw any errors
    });
  });

  describe('Utility Functions', () => {
    describe('ColorMapUtils', () => {
      it('should generate rainbow colors correctly', () => {
        const color1 = ColorMapUtils.rainbow(0, 0, 100);
        const color2 = ColorMapUtils.rainbow(50, 0, 100);
        const color3 = ColorMapUtils.rainbow(100, 0, 100);

        expect(color1).toMatch(/^hsl\(\d+,\s*100%,\s*50%\)$/);
        expect(color2).toMatch(/^hsl\(\d+,\s*100%,\s*50%\)$/);
        expect(color3).toMatch(/^hsl\(\d+,\s*100%,\s*50%\)$/);
      });

      it('should generate thermal colors correctly', () => {
        const color1 = ColorMapUtils.thermal(0, 0, 100);
        const color2 = ColorMapUtils.thermal(50, 0, 100);
        const color3 = ColorMapUtils.thermal(100, 0, 100);

        expect(color1).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
        expect(color2).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
        expect(color3).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      });

      it('should generate plasma colors correctly', () => {
        const color1 = ColorMapUtils.plasma(0, 0, 100);
        const color2 = ColorMapUtils.plasma(50, 0, 100);
        const color3 = ColorMapUtils.plasma(100, 0, 100);

        expect(color1).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
        expect(color2).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
        expect(color3).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      });
    });

    describe('VisualizationUtils', () => {
      it('should convert stress to color correctly', () => {
        const color = VisualizationUtils.stressToColor(50, 0, 100, 'rainbow');
        expect(color).toMatch(/^hsl\(\d+,\s*100%,\s*50%\)$/);
      });

      it('should handle different color maps', () => {
        const rainbowColor = VisualizationUtils.stressToColor(50, 0, 100, 'rainbow');
        const thermalColor = VisualizationUtils.stressToColor(50, 0, 100, 'thermal');
        const plasmaColor = VisualizationUtils.stressToColor(50, 0, 100, 'plasma');
        const grayscaleColor = VisualizationUtils.stressToColor(50, 0, 100, 'grayscale');

        expect(rainbowColor).toMatch(/^hsl\(/);
        expect(thermalColor).toMatch(/^rgb\(/);
        expect(plasmaColor).toMatch(/^rgb\(/);
        expect(grayscaleColor).toMatch(/^rgb\(/);
      });

      it('should interpolate colors', () => {
        const color1 = '#ff0000';
        const color2 = '#0000ff';
        
        const interpolated1 = VisualizationUtils.interpolateColor(color1, color2, 0.25);
        const interpolated2 = VisualizationUtils.interpolateColor(color1, color2, 0.75);

        expect(interpolated1).toBe(color1);
        expect(interpolated2).toBe(color2);
      });

      it('should calculate optimal view distance', () => {
        const distance = VisualizationUtils.calculateOptimalViewDistance(mockStructure);
        expect(distance).toBeGreaterThan(0);
        expect(distance).toBeLessThan(1000); // Reasonable distance
      });

      it('should handle empty structure for view distance', () => {
        const emptyStructure: Structure3D = { nodes: [], elements: [], loads: [] };
        const distance = VisualizationUtils.calculateOptimalViewDistance(emptyStructure);
        expect(distance).toBe(10); // Default distance
      });
    });
  });

  describe('Performance', () => {
    beforeEach(async () => {
      await engine.initialize(mockCanvas);
    });

    it('should complete rendering within reasonable time', async () => {
      const startTime = Date.now();
      await engine.render(mockStructure);
      const endTime = Date.now();

      const renderTime = endTime - startTime;
      expect(renderTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle large structures efficiently', async () => {
      // Create a larger structure
      const largeStructure: Structure3D = {
        nodes: Array.from({ length: 100 }, (_, i) => ({
          id: String(i + 1),
          x: (i % 10) * 2,
          y: Math.floor(i / 10) * 2,
          z: 0,
          supports: i < 10 ? { ux: true, uy: true, uz: true } : {}
        })),
        elements: Array.from({ length: 99 }, (_, i) => ({
          id: String(i + 1),
          type: 'beam' as const,
          nodes: [String(i + 1), String(i + 2)],
          material: {
            id: 'steel',
            name: 'Steel',
            type: 'steel' as const,
            density: 7850,
            elasticModulus: 200000
          },
          section: {
            id: 'rect',
            name: 'Rectangular',
            type: 'rectangular' as const,
            width: 0.3,
            height: 0.5
          }
        })),
        loads: []
      };

      const startTime = Date.now();
      const result = await engine.render(largeStructure);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(10000); // Should handle large structure within 10 seconds
    });
  });

  describe('Error Handling', () => {
    it('should handle null structure gracefully', async () => {
      await engine.initialize(mockCanvas);
      
      const nullStructure = null as any;
      await expect(engine.render(nullStructure)).rejects.toThrow();
    });

    it('should handle malformed structure', async () => {
      await engine.initialize(mockCanvas);
      
      const malformedStructure = {
        nodes: null,
        elements: undefined,
        loads: 'invalid'
      } as any;

      await expect(engine.render(malformedStructure)).rejects.toThrow();
    });

    it('should handle WebGL context loss', async () => {
      const contextLostCanvas = {
        getContext: vi.fn().mockReturnValue(null)
      } as unknown as HTMLCanvasElement;

      const initialized = await engine.initialize(contextLostCanvas);
      expect(initialized).toBe(false);
    });
  });

  describe('Integration', () => {
    it('should work with analysis results', async () => {
      await engine.initialize(mockCanvas);

      const analysisResults = {
        elementStresses: new Map([
          ['1', 25.5],
          ['2', 30.2],
          ['3', 18.7]
        ]),
        nodeDisplacements: new Map([
          ['1', { x: 0, y: 0, z: 0 }],
          ['2', { x: 0.001, y: -0.002, z: 0 }],
          ['3', { x: 0.002, y: -0.004, z: 0 }],
          ['4', { x: 0.001, y: -0.001, z: 0 }]
        ])
      };

      const result = await engine.render(mockStructure, analysisResults);
      expect(result).toBeDefined();
      expect(result.stressContours.length).toBeGreaterThan(0);
    });

    it('should maintain consistency across multiple renders', async () => {
      await engine.initialize(mockCanvas);

      const result1 = await engine.render(mockStructure);
      const result2 = await engine.render(mockStructure);

      expect(result1.stressContours.length).toBe(result2.stressContours.length);
      expect(result1.deformationFrames.length).toBe(result2.deformationFrames.length);
      expect(result1.forceFlows.length).toBe(result2.forceFlows.length);
    });
  });
});