/**
 * Tests for Security Utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeInput,
  sanitizeNumber,
  validateNode,
  validateMaterial,
  validateElement,
  validateStructure,
  validateFile,
  defaultSecurityConfig,
  AuditLogger,
  RateLimiter
} from '../security/SecurityUtils';

describe('Security Utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const dangerous = '<script>alert("xss")</script>';
      const result = sanitizeInput(dangerous);
      expect(result).toBe('scriptalert(xss)/script');
    });

    it('should normalize whitespace', () => {
      const input = 'hello    world   ';
      const result = sanitizeInput(input);
      expect(result).toBe('hello world');
    });

    it('should limit length', () => {
      const longInput = 'a'.repeat(2000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(1000);
    });

    it('should handle non-string input', () => {
      const result = sanitizeInput(123 as any);
      expect(result).toBe('');
    });
  });

  describe('sanitizeNumber', () => {
    it('should sanitize valid numbers', () => {
      expect(sanitizeNumber('123.45')).toBe(123.45);
      expect(sanitizeNumber(456)).toBe(456);
    });

    it('should handle invalid input', () => {
      expect(sanitizeNumber('abc')).toBe(0);
      expect(sanitizeNumber(null)).toBe(0);
      expect(sanitizeNumber(undefined)).toBe(0);
    });

    it('should respect min/max bounds', () => {
      expect(sanitizeNumber(150, 0, 100)).toBe(100);
      expect(sanitizeNumber(-50, 0, 100)).toBe(0);
      expect(sanitizeNumber(50, 0, 100)).toBe(50);
    });
  });

  describe('validateNode', () => {
    it('should validate correct node', () => {
      const validNode = {
        id: 'N1',
        x: 10,
        y: 20,
        z: 30,
        supports: { ux: true, uy: false }
      };

      const result = validateNode(validNode);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject node without ID', () => {
      const invalidNode = {
        x: 10,
        y: 20,
        z: 30
      };

      const result = validateNode(invalidNode);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should warn about large coordinates', () => {
      const nodeWithLargeCoords = {
        id: 'N1',
        x: 1000,
        y: 2000,
        z: 3000
      };

      const result = validateNode(nodeWithLargeCoords);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should validate support constraints', () => {
      const nodeWithInvalidSupport = {
        id: 'N1',
        x: 0,
        y: 0,
        z: 0,
        supports: { invalid_support: true }
      };

      const result = validateNode(nodeWithInvalidSupport);
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateMaterial', () => {
    it('should validate steel material', () => {
      const steelMaterial = {
        type: 'steel',
        elasticModulus: 200e9,
        yieldStrength: 250e6,
        poissonsRatio: 0.3
      };

      const result = validateMaterial(steelMaterial);
      expect(result.isValid).toBe(true);
    });

    it('should reject material without type', () => {
      const invalidMaterial = {
        elasticModulus: 200e9
      };

      const result = validateMaterial(invalidMaterial);
      expect(result.isValid).toBe(false);
    });

    it('should warn about unusual properties', () => {
      const unusualMaterial = {
        type: 'steel',
        elasticModulus: 1e6, // Very low
        yieldStrength: 50e6 // Low for steel
      };

      const result = validateMaterial(unusualMaterial);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateStructure', () => {
    it('should validate empty structure', () => {
      const emptyStructure = {
        nodes: [],
        elements: []
      };

      const result = validateStructure(emptyStructure);
      expect(result.isValid).toBe(false); // Should require at least one node
    });

    it('should validate basic structure', () => {
      const basicStructure = {
        nodes: [
          { id: 'N1', x: 0, y: 0, z: 0 },
          { id: 'N2', x: 1, y: 0, z: 0 }
        ],
        elements: [
          {
            id: 'E1',
            type: 'beam',
            nodes: ['N1', 'N2'],
            material: { type: 'steel', elasticModulus: 200e9 },
            section: { type: 'rectangular', width: 0.1, height: 0.2 }
          }
        ]
      };

      const result = validateStructure(basicStructure);
      expect(result.isValid).toBe(true);
    });

    it('should detect duplicate IDs', () => {
      const structureWithDuplicates = {
        nodes: [
          { id: 'N1', x: 0, y: 0, z: 0 },
          { id: 'N1', x: 1, y: 0, z: 0 } // Duplicate ID
        ],
        elements: []
      };

      const result = validateStructure(structureWithDuplicates);
      expect(result.isValid).toBe(false);
    });

    it('should respect security config', () => {
      const structure = {
        nodes: Array(2000).fill(0).map((_, i) => ({ id: `N${i}`, x: i, y: 0, z: 0 })),
        elements: []
      };

      const result = validateStructure(structure, { ...defaultSecurityConfig, maxStructureSize: 1000 });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should validate correct file', () => {
      const file = new File(['content'], 'test.json', { type: 'application/json' });
      const result = validateFile(file);
      expect(result.isValid).toBe(true);
    });

    it('should reject large files', () => {
      const largeContent = 'x'.repeat(20 * 1024 * 1024); // 20MB
      const file = new File([largeContent], 'large.json', { type: 'application/json' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
    });

    it('should reject disallowed file types', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/octet-stream' });
      const result = validateFile(file);
      expect(result.isValid).toBe(false);
    });
  });

  describe('AuditLogger', () => {
    let logger: AuditLogger;

    beforeEach(() => {
      logger = new AuditLogger();
    });

    it('should log entries', () => {
      logger.log('test_action', { data: 'test' });
      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].action).toBe('test_action');
    });

    it('should filter by severity', () => {
      logger.log('info_action', {}, 'info');
      logger.log('error_action', {}, 'error');
      
      const errorLogs = logger.getLogs('error');
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].severity).toBe('error');
    });

    it('should clear logs', () => {
      logger.log('test_action', {});
      logger.clearLogs();
      expect(logger.getLogs()).toHaveLength(0);
    });
  });

  describe('RateLimiter', () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
      rateLimiter = new RateLimiter();
    });

    it('should allow requests within limit', () => {
      rateLimiter.setLimit('test_action', 3, 1000);
      
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
    });

    it('should block requests over limit', () => {
      rateLimiter.setLimit('test_action', 2, 1000);
      
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
      expect(rateLimiter.isAllowed('test_action')).toBe(false);
    });

    it('should reset limits', () => {
      rateLimiter.setLimit('test_action', 1, 1000);
      
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
      expect(rateLimiter.isAllowed('test_action')).toBe(false);
      
      rateLimiter.reset('test_action');
      expect(rateLimiter.isAllowed('test_action')).toBe(true);
    });

    it('should allow unlimited actions without limits', () => {
      expect(rateLimiter.isAllowed('unlimited_action')).toBe(true);
      expect(rateLimiter.isAllowed('unlimited_action')).toBe(true);
    });
  });
});