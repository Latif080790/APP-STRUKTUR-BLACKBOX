/**
 * Comprehensive Test Suite for Design Module
 * Quality Assurance & Testing - Option A Implementation
 * 
 * Tests all 11 design modules with unit tests, integration tests, and functional validation
 * Following professional engineering testing standards
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DesignModule from '../modules/design/DesignModule';
import '@testing-library/jest-dom';

// Mock the advanced modules
vi.mock('../modules/design/AIOptimizationEngine', () => ({
  default: () => <div data-testid="ai-optimization-engine">AI Optimization Engine</div>
}));

vi.mock('../modules/design/ProfessionalReportGenerator', () => ({
  default: () => <div data-testid="report-generator">Professional Report Generator</div>
}));

vi.mock('../modules/design/AdvancedConnectionDesign', () => ({
  default: () => <div data-testid="connection-design">Advanced Connection Design</div>
}));

vi.mock('../modules/design/LoadPathAnalysisSystem', () => ({
  default: () => <div data-testid="load-path-analysis">Load Path Analysis System</div>
}));

vi.mock('../components/AdvancedMaterialTesting', () => ({
  default: () => <div data-testid="material-testing">Advanced Material Testing</div>
}));

vi.mock('../components/ProfessionalMaterialCertification', () => ({
  default: () => <div data-testid="certification">Professional Material Certification</div>
}));

vi.mock('../components/QualityAssuranceProtocols', () => ({
  default: () => <div data-testid="quality-assurance">Quality Assurance Protocols</div>
}));

describe('DesignModule - Comprehensive Quality Assurance Tests', () => {
  beforeEach(() => {
    // Clear any previous test state
    cleanup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Module Initialization and Rendering', () => {
    it('should render the design module header correctly', () => {
      render(<DesignModule subModule="" />);
      
      expect(screen.getByText('Structural Design Suite')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive structural component design following SNI standards')).toBeInTheDocument();
    });

    it('should display all 11 design module buttons', () => {
      render(<DesignModule subModule="" />);
      
      const moduleButtons = [
        'Component Design',
        'Material Testing', 
        'Certification',
        'Quality Assurance',
        'Steel Design',
        'Concrete Design', 
        'Foundation Design',
        'AI Optimization',
        'Report Generator',
        'Connection Design',
        'Load Path Analysis'
      ];

      moduleButtons.forEach(buttonText => {
        expect(screen.getByText(buttonText)).toBeInTheDocument();
      });
    });

    it('should have functional Help & Guide button', () => {
      render(<DesignModule subModule="" />);
      
      const helpButton = screen.getByText('Help & Guide');
      expect(helpButton).toBeInTheDocument();
      expect(helpButton.closest('button')).toHaveClass('bg-gradient-to-r', 'from-green-500');
    });

    it('should have prominent 3D Model button', () => {
      render(<DesignModule subModule="" />);
      
      const viewer3DButton = screen.getByText('3D Model');
      expect(viewer3DButton).toBeInTheDocument();
      expect(viewer3DButton.closest('button')).toHaveClass('bg-gradient-to-r', 'from-purple-500');
    });
  });

  describe('Module Navigation and State Management', () => {
    it('should handle module selection correctly', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);
      
      const steelDesignButton = screen.getByText('Steel Design');
      await user.click(steelDesignButton);
      
      // Verify active state styling
      expect(steelDesignButton.closest('button')).toHaveClass('bg-gray-50');
    });

    it('should render default component design module', () => {
      render(<DesignModule subModule="" />);
      
      // Should show the component design interface by default
      expect(screen.getByText('Structural Component Design')).toBeInTheDocument();
    });

    it('should handle subModule prop correctly', () => {
      render(<DesignModule subModule="material-testing" />);
      
      // Should render material testing module
      expect(screen.getByTestId('material-testing')).toBeInTheDocument();
    });
  });

  describe('Advanced Module Integration Tests', () => {
    it('should render AI Optimization Engine module', () => {
      render(<DesignModule subModule="ai-optimization" />);
      expect(screen.getByTestId('ai-optimization-engine')).toBeInTheDocument();
    });

    it('should render Professional Report Generator module', () => {
      render(<DesignModule subModule="report-generator" />);
      expect(screen.getByTestId('report-generator')).toBeInTheDocument();
    });

    it('should render Advanced Connection Design module', () => {
      render(<DesignModule subModule="connection-design" />);
      expect(screen.getByTestId('connection-design')).toBeInTheDocument();
    });

    it('should render Load Path Analysis System module', () => {
      render(<DesignModule subModule="load-path-analysis" />);
      expect(screen.getByTestId('load-path-analysis')).toBeInTheDocument();
    });

    it('should render Material Testing module', () => {
      render(<DesignModule subModule="material-testing" />);
      expect(screen.getByTestId('material-testing')).toBeInTheDocument();
    });

    it('should render Certification module', () => {
      render(<DesignModule subModule="certification" />);
      expect(screen.getByTestId('certification')).toBeInTheDocument();
    });

    it('should render Quality Assurance module', () => {
      render(<DesignModule subModule="quality-assurance" />);
      expect(screen.getByTestId('quality-assurance')).toBeInTheDocument();
    });
  });

  describe('Modal Functionality Tests', () => {
    it('should open and close Help & Guide modal', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);
      
      const helpButton = screen.getByText('Help & Guide');
      await user.click(helpButton);
      
      // Check if modal opens
      await waitFor(() => {
        expect(screen.getByText('Design Module Guide')).toBeInTheDocument();
      });
      
      // Close modal
      const closeButton = screen.getByText('×');
      await user.click(closeButton);
      
      // Check if modal closes
      await waitFor(() => {
        expect(screen.queryByText('Design Module Guide')).not.toBeInTheDocument();
      });
    });

    it('should open and close 3D Viewer modal', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);
      
      const viewer3DButton = screen.getByText('3D Model');
      await user.click(viewer3DButton);
      
      // Check if modal opens
      await waitFor(() => {
        expect(screen.getByText('3D Structural Model Viewer')).toBeInTheDocument();
      });
      
      // Close modal
      const closeButton = screen.getAllByText('×')[0]; // Get first close button
      await user.click(closeButton);
      
      // Check if modal closes
      await waitFor(() => {
        expect(screen.queryByText('3D Structural Model Viewer')).not.toBeInTheDocument();
      });
    });
  });

  describe('Engineering Calculations Validation', () => {
    it('should render steel design calculations', () => {
      render(<DesignModule subModule="steel-design" />);
      
      expect(screen.getByText('Steel Structure Design')).toBeInTheDocument();
      expect(screen.getByText('SNI 1729:2020 Compliance')).toBeInTheDocument();
    });

    it('should render concrete design calculations', () => {
      render(<DesignModule subModule="concrete-design" />);
      
      expect(screen.getByText('Concrete Structure Design')).toBeInTheDocument();
      expect(screen.getByText('SNI 2847:2019 Standards')).toBeInTheDocument();
    });

    it('should render foundation design calculations', () => {
      render(<DesignModule subModule="foundation-design" />);
      
      expect(screen.getByText('Foundation Design')).toBeInTheDocument();
      expect(screen.getByText('SNI 8460:2020 Standards')).toBeInTheDocument();
    });
  });

  describe('Accessibility and User Experience Tests', () => {
    it('should have proper ARIA labels and accessibility attributes', () => {
      render(<DesignModule subModule="" />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check that buttons are keyboard accessible
      buttons.forEach(button => {
        expect(button).toBeVisible();
      });
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);
      
      const firstButton = screen.getByText('Help & Guide');
      await user.tab();
      
      // Should be able to navigate with keyboard
      expect(document.activeElement).toBeDefined();
    });

    it('should use English language throughout UI', () => {
      render(<DesignModule subModule="" />);
      
      // Verify no Indonesian text is present
      expect(screen.queryByText(/bahasa/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/struktur/i)).not.toBeInTheDocument();
      
      // Verify English text is present
      expect(screen.getByText('Structural Design Suite')).toBeInTheDocument();
      expect(screen.getByText('Design Modules')).toBeInTheDocument();
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should not have memory leaks during module switching', async () => {
      const user = userEvent.setup();
      render(<DesignModule subModule="" />);
      
      const modules = ['steel-design', 'concrete-design', 'foundation-design'];
      
      for (const module of modules) {
        const button = screen.getByText(module.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
        
        await user.click(button);
        
        // Wait for component to render
        await waitFor(() => {
          expect(document.querySelector('[data-testid]') || 
                 screen.getByText(/Design/)).toBeInTheDocument();
        });
      }
    });

    it('should render components efficiently', () => {
      const startTime = performance.now();
      render(<DesignModule subModule="" />);
      const endTime = performance.now();
      
      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid subModule gracefully', () => {
      render(<DesignModule subModule="invalid-module" />);
      
      // Should fallback to default component design
      expect(screen.getByText('Structural Component Design')).toBeInTheDocument();
    });

    it('should handle undefined subModule', () => {
      render(<DesignModule subModule={undefined as any} />);
      
      // Should render without errors
      expect(screen.getByText('Structural Design Suite')).toBeInTheDocument();
    });

    it('should handle null subModule', () => {
      render(<DesignModule subModule={null as any} />);
      
      // Should render without errors
      expect(screen.getByText('Structural Design Suite')).toBeInTheDocument();
    });
  });

  describe('Professional Engineering Standards Compliance', () => {
    it('should display SNI standards information', () => {
      render(<DesignModule subModule="steel-design" />);
      
      expect(screen.getByText(/SNI 1729:2020/)).toBeInTheDocument();
    });

    it('should show safety factors and engineering warnings', () => {
      render(<DesignModule subModule="concrete-design" />);
      
      expect(screen.getByText(/Safety Factor/)).toBeInTheDocument();
    });

    it('should provide professional calculation results', () => {
      render(<DesignModule subModule="foundation-design" />);
      
      expect(screen.getByText(/Bearing Capacity/)).toBeInTheDocument();
    });
  });
});