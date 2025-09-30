import { describe, it, expect } from 'vitest';
import { modalAnalysis, responseSpectrumAnalysis, dynamicAnalysis } from './DynamicAnalyzer';
import { simpleBeam, simplePortal } from '../../tests/sample-structures';

describe('DynamicAnalyzer', () => {
  describe('modalAnalysis', () => {
    it('should perform modal analysis on simple beam', () => {
      const result = modalAnalysis(simpleBeam, 3);
      
      expect(result.success).toBe(true);
      expect(result.frequencies).toHaveLength(3);
      expect(result.modeShapes).toHaveLength(3);
      expect(result.message).toBe('Modal analysis completed successfully');
    });
    
    it('should perform modal analysis on portal frame', () => {
      const result = modalAnalysis(simplePortal, 5);
      
      expect(result.success).toBe(true);
      expect(result.frequencies).toHaveLength(5);
      expect(result.modeShapes).toHaveLength(5);
    });
    
    it('should handle invalid structures gracefully', () => {
      const emptyStructure = {
        nodes: [],
        elements: []
      };
      
      const result = modalAnalysis(emptyStructure as any, 3);
      
      expect(result.success).toBe(true); // Should still succeed but with empty results
    });
  });
  
  describe('responseSpectrumAnalysis', () => {
    it('should perform response spectrum analysis', () => {
      const spectrum = {
        periods: [0.1, 0.5, 1.0, 2.0],
        accelerations: [1.5, 1.2, 0.8, 0.4]
      };
      
      const result = responseSpectrumAnalysis(simplePortal, spectrum);
      
      expect(result.success).toBe(true);
      expect(result.modalResults).toBeDefined();
      expect(result.spectralAccelerations).toHaveLength(3);
      expect(typeof result.baseShear).toBe('number');
    });
  });
  
  describe('dynamicAnalysis', () => {
    it('should perform modal analysis when requested', () => {
      const result = dynamicAnalysis(simpleBeam, 'modal', { numModes: 4 });
      
      expect(result.success).toBe(true);
      expect(result.frequencies).toHaveLength(4);
    });
    
    it('should perform response spectrum analysis when requested', () => {
      const result = dynamicAnalysis(simplePortal, 'response-spectrum');
      
      expect(result.success).toBe(true);
      expect(result.modalResults).toBeDefined();
    });
    
    it('should handle unsupported analysis types', () => {
      const result = dynamicAnalysis(simpleBeam, 'time-history' as any);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Time history analysis not implemented yet');
    });
  });
});