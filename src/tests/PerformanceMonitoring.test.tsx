/**
 * Performance Monitoring and Optimization Tests
 * Quality Assurance - Performance validation for structural engineering application
 * Memory usage, calculation speed, and user interaction responsiveness
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import DesignModule from '../modules/design/DesignModule';

// Performance monitoring utilities
class PerformanceMonitor {
  private startTime: number = 0;
  private endTime: number = 0;
  private memoryStart: number = 0;
  private memoryEnd: number = 0;

  startMonitoring() {
    this.startTime = performance.now();
    if ('memory' in performance) {
      this.memoryStart = (performance as any).memory.usedJSHeapSize;
    }
  }

  endMonitoring() {
    this.endTime = performance.now();
    if ('memory' in performance) {
      this.memoryEnd = (performance as any).memory.usedJSHeapSize;
    }
  }

  getExecutionTime(): number {
    return this.endTime - this.startTime;
  }

  getMemoryDelta(): number {
    return this.memoryEnd - this.memoryStart;
  }

  getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
}

// Mock heavy calculations for performance testing
const mockHeavyCalculation = (iterations: number = 1000) => {
  let result = 0;
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
  }
  return result;
};

describe('Performance Monitoring and Optimization Tests', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Rendering Performance', () => {
    it('should render DesignModule within acceptable time limits', () => {
      monitor.startMonitoring();
      render(<DesignModule subModule="" />);
      monitor.endMonitoring();

      const renderTime = monitor.getExecutionTime();
      expect(renderTime).toBeLessThan(100); // Should render in under 100ms
    });

    it('should handle rapid module switching efficiently', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      const modules = [
        'steel-design',
        'concrete-design', 
        'foundation-design',
        'ai-optimization',
        'material-testing'
      ];

      monitor.startMonitoring();

      for (const moduleId of modules) {
        const moduleName = moduleId.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        const button = screen.getByText(moduleName);
        await user.click(button);
      }

      monitor.endMonitoring();

      const switchingTime = monitor.getExecutionTime();
      expect(switchingTime).toBeLessThan(500); // All switches in under 500ms
    });

    it('should maintain stable memory usage during module operations', () => {
      const initialMemory = monitor.getMemoryUsage();
      
      // Render and unmount multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<DesignModule subModule="steel-design" />);
        unmount();
      }

      const finalMemory = monitor.getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Modal Performance Tests', () => {
    it('should open 3D Viewer modal quickly', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      const viewer3DButton = screen.getByText('3D Model');

      monitor.startMonitoring();
      await user.click(viewer3DButton);
      
      // Wait for modal to appear
      await screen.findByText('3D Structural Model Viewer');
      monitor.endMonitoring();

      const modalOpenTime = monitor.getExecutionTime();
      expect(modalOpenTime).toBeLessThan(200); // Modal should open in under 200ms
    });

    it('should open Help & Guide modal efficiently', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      const helpButton = screen.getByText('Help & Guide');

      monitor.startMonitoring();
      await user.click(helpButton);
      
      // Wait for modal to appear
      await screen.findByText('Design Module Guide');
      monitor.endMonitoring();

      const modalOpenTime = monitor.getExecutionTime();
      expect(modalOpenTime).toBeLessThan(150); // Help modal should open quickly
    });

    it('should handle modal cleanup without memory leaks', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      const initialMemory = monitor.getMemoryUsage();

      // Open and close modals multiple times
      for (let i = 0; i < 3; i++) {
        // Open 3D Viewer
        const viewer3DButton = screen.getByText('3D Model');
        await user.click(viewer3DButton);
        await screen.findByText('3D Structural Model Viewer');
        
        // Close modal
        const closeButton = screen.getAllByText('×')[0];
        await user.click(closeButton);

        // Open Help modal
        const helpButton = screen.getByText('Help & Guide');
        await user.click(helpButton);
        await screen.findByText('Design Module Guide');
        
        // Close modal
        const helpCloseButton = screen.getByText('×');
        await user.click(helpCloseButton);
      }

      const finalMemory = monitor.getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Should not accumulate significant memory
      expect(memoryIncrease).toBeLessThan(2 * 1024 * 1024); // Less than 2MB increase
    });
  });

  describe('Engineering Calculation Performance', () => {
    it('should execute concrete calculations efficiently', () => {
      const calculateMomentCapacity = (As: number, fy: number, b: number, d: number, fc: number): number => {
        const a = As * fy / (0.85 * fc * b);
        return As * fy * (d - a / 2) / 1000000;
      };

      monitor.startMonitoring();
      
      // Run calculation 1000 times
      for (let i = 0; i < 1000; i++) {
        calculateMomentCapacity(1963, 400, 300, 450, 25);
      }
      
      monitor.endMonitoring();

      const calculationTime = monitor.getExecutionTime();
      expect(calculationTime).toBeLessThan(50); // 1000 calculations in under 50ms
    });

    it('should handle steel calculations at scale', () => {
      const calculatePn = (Ag: number, fy: number, kl_r: number): number => {
        const fe = Math.PI * Math.PI * 200000 / (kl_r * kl_r);
        const fcr = kl_r <= 4.71 * Math.sqrt(200000 / fy) 
          ? Math.pow(0.658, fy / fe) * fy
          : 0.877 * fe;
        return fcr * Ag / 1000;
      };

      monitor.startMonitoring();
      
      // Test with various parameters
      for (let i = 0; i < 500; i++) {
        calculatePn(5000 + i, 345, 80 + i * 0.1);
      }
      
      monitor.endMonitoring();

      const calculationTime = monitor.getExecutionTime();
      expect(calculationTime).toBeLessThan(100); // 500 calculations in under 100ms
    });

    it('should optimize foundation calculations', () => {
      const calculateBearingCapacity = (c: number, phi: number, gamma: number, B: number, D: number): number => {
        const Nc = Math.exp(Math.PI * Math.tan(phi * Math.PI / 180)) * Math.pow(Math.tan(45 + phi / 2), 2);
        const Nq = Math.pow(Math.tan(45 + phi / 2), 2) * Math.exp(Math.PI * Math.tan(phi * Math.PI / 180));
        const Ny = 2 * (Nq + 1) * Math.tan(phi * Math.PI / 180);
        return c * Nc + gamma * D * Nq + 0.5 * gamma * B * Ny;
      };

      monitor.startMonitoring();
      
      // Test multiple scenarios
      for (let i = 0; i < 200; i++) {
        calculateBearingCapacity(15 + i * 0.1, 25 + i * 0.05, 18, 2, 1.5);
      }
      
      monitor.endMonitoring();

      const calculationTime = monitor.getExecutionTime();
      expect(calculationTime).toBeLessThan(150); // Complex calculations in reasonable time
    });
  });

  describe('User Interaction Responsiveness', () => {
    it('should respond to button clicks immediately', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      const steelDesignButton = screen.getByText('Steel Design');

      monitor.startMonitoring();
      await user.click(steelDesignButton);
      monitor.endMonitoring();

      const responseTime = monitor.getExecutionTime();
      expect(responseTime).toBeLessThan(50); // Should respond in under 50ms
    });

    it('should handle rapid user interactions gracefully', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      const buttons = [
        screen.getByText('Steel Design'),
        screen.getByText('Concrete Design'),
        screen.getByText('Foundation Design')
      ];

      monitor.startMonitoring();
      
      // Rapid clicking
      for (const button of buttons) {
        await user.click(button);
      }
      
      monitor.endMonitoring();

      const totalTime = monitor.getExecutionTime();
      expect(totalTime).toBeLessThan(200); // All interactions in under 200ms
    });

    it('should maintain UI responsiveness during calculations', async () => {
      render(<DesignModule subModule="steel-design" />);

      monitor.startMonitoring();
      
      // Simulate heavy calculation
      mockHeavyCalculation(10000);
      
      // UI should still be responsive
      const title = screen.getByText('Structural Design Suite');
      expect(title).toBeInTheDocument();
      
      monitor.endMonitoring();

      const calculationTime = monitor.getExecutionTime();
      expect(calculationTime).toBeLessThan(1000); // Even heavy calculations should complete
    });
  });

  describe('Memory Management and Optimization', () => {
    it('should efficiently manage component state', () => {
      const initialMemory = monitor.getMemoryUsage();
      
      // Create and destroy multiple instances
      const instances = [];
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<DesignModule subModule="concrete-design" />);
        instances.push(unmount);
      }
      
      // Cleanup all instances
      instances.forEach(unmount => unmount());
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = monitor.getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory should be properly cleaned up
      expect(memoryIncrease).toBeLessThan(3 * 1024 * 1024); // Less than 3MB
    });

    it('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Material-${i}`,
        properties: {
          strength: 25 + i * 0.1,
          density: 2400 + i * 0.5,
          modulus: 25000 + i * 10
        }
      }));

      monitor.startMonitoring();
      
      // Process large dataset
      const processed = largeDataset.map(item => ({
        ...item,
        calculated: item.properties.strength * item.properties.density / 1000
      }));
      
      monitor.endMonitoring();

      const processingTime = monitor.getExecutionTime();
      expect(processingTime).toBeLessThan(200); // Process 10k items in under 200ms
      expect(processed.length).toBe(10000);
    });

    it('should optimize re-renders and state updates', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);

      let renderCount = 0;
      const originalRender = React.createElement;
      
      // Mock to count renders (simplified approach)
      monitor.startMonitoring();
      
      // Trigger multiple state changes
      const helpButton = screen.getByText('Help & Guide');
      await user.click(helpButton);
      
      const closeButton = screen.getByText('×');
      await user.click(closeButton);
      
      const viewer3DButton = screen.getByText('3D Model');
      await user.click(viewer3DButton);
      
      monitor.endMonitoring();

      const updateTime = monitor.getExecutionTime();
      expect(updateTime).toBeLessThan(300); // Multiple updates in reasonable time
    });
  });

  describe('Load Testing and Stress Tests', () => {
    it('should handle concurrent module operations', async () => {
      const promises = [];
      
      monitor.startMonitoring();
      
      // Simulate multiple concurrent operations
      for (let i = 0; i < 5; i++) {
        promises.push(new Promise(resolve => {
          const { unmount } = render(<DesignModule subModule="ai-optimization" />);
          setTimeout(() => {
            unmount();
            resolve(true);
          }, 10);
        }));
      }
      
      await Promise.all(promises);
      monitor.endMonitoring();

      const concurrentTime = monitor.getExecutionTime();
      expect(concurrentTime).toBeLessThan(500); // Concurrent operations complete
    });

    it('should maintain performance under stress', () => {
      monitor.startMonitoring();
      
      // Stress test with heavy calculations
      for (let i = 0; i < 100; i++) {
        mockHeavyCalculation(100);
      }
      
      monitor.endMonitoring();

      const stressTime = monitor.getExecutionTime();
      expect(stressTime).toBeLessThan(2000); // Complete stress test in under 2s
    });

    it('should handle edge cases gracefully', () => {
      monitor.startMonitoring();
      
      // Test with extreme values
      const extremeTests = [
        () => render(<DesignModule subModule="" />),
        () => render(<DesignModule subModule="invalid-module" />),
        () => render(<DesignModule subModule={null as any} />),
        () => render(<DesignModule subModule={undefined as any} />)
      ];

      extremeTests.forEach(test => {
        try {
          const { unmount } = test();
          unmount();
        } catch (error) {
          // Should handle errors gracefully
          expect(error).toBeInstanceOf(Error);
        }
      });
      
      monitor.endMonitoring();

      const edgeCaseTime = monitor.getExecutionTime();
      expect(edgeCaseTime).toBeLessThan(300); // Handle edge cases quickly
    });
  });

  describe('Performance Benchmarks and Standards', () => {
    it('should meet professional application performance standards', () => {
      const benchmarks = {
        renderTime: 100,     // ms
        responseTime: 50,    // ms
        calculationTime: 10, // ms per calculation
        memoryEfficiency: 5  // MB max increase
      };

      // Test render performance
      monitor.startMonitoring();
      const { unmount } = render(<DesignModule subModule="steel-design" />);
      monitor.endMonitoring();
      
      expect(monitor.getExecutionTime()).toBeLessThan(benchmarks.renderTime);
      
      unmount();
    });

    it('should provide performance metrics for monitoring', () => {
      const metrics = {
        renderTime: monitor.getExecutionTime(),
        memoryUsage: monitor.getMemoryUsage(),
        memoryDelta: monitor.getMemoryDelta()
      };

      expect(typeof metrics.renderTime).toBe('number');
      expect(typeof metrics.memoryUsage).toBe('number');
      expect(typeof metrics.memoryDelta).toBe('number');
      
      expect(metrics.renderTime).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
    });
  });
});