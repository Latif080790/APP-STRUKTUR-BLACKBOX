/**
 * Security Module for Structural Analysis System
 * Provides data validation and security utilities
 */

import { Structure3D } from '@/types/structural';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SecurityConfig {
  enableInputValidation: boolean;
  enableAuditLogging: boolean;
  maxStructureSize: number;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export const defaultSecurityConfig: SecurityConfig = {
  enableInputValidation: true,
  enableAuditLogging: true,
  maxStructureSize: 1000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.json', '.csv', '.txt']
};

/**
 * Data sanitization utilities
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>"']/g, '') // Remove potential XSS characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 1000); // Limit length
};

export const sanitizeNumber = (input: any, min: number = -Infinity, max: number = Infinity): number => {
  const num = parseFloat(input);
  
  if (isNaN(num)) return 0;
  if (num < min) return min;
  if (num > max) return max;
  
  return num;
};

/**
 * Validate node data
 */
export const validateNode = (node: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!node.id || typeof node.id !== 'string') {
    errors.push('Node ID is required and must be a string');
  }
  
  const x = sanitizeNumber(node.x, -1000, 1000);
  const y = sanitizeNumber(node.y, -1000, 1000);
  const z = sanitizeNumber(node.z, -1000, 1000);
  
  if (Math.abs(x) > 500) warnings.push(`Node ${node.id}: X coordinate is very large (${x}m)`);
  if (Math.abs(y) > 500) warnings.push(`Node ${node.id}: Y coordinate is very large (${y}m)`);
  if (Math.abs(z) > 500) warnings.push(`Node ${node.id}: Z coordinate is very large (${z}m)`);
  
  if (node.supports) {
    const validSupports = ['ux', 'uy', 'uz', 'rx', 'ry', 'rz'];
    for (const support in node.supports) {
      if (!validSupports.includes(support)) {
        errors.push(`Node ${node.id}: Invalid support type '${support}'`);
      }
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
};

/**
 * Validate material data
 */
export const validateMaterial = (material: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!material.type || typeof material.type !== 'string') {
    errors.push('Material type is required');
  }
  
  const validMaterialTypes = ['concrete', 'steel', 'timber', 'masonry'];
  if (material.type && !validMaterialTypes.includes(material.type)) {
    errors.push(`Invalid material type: ${material.type}`);
  }
  
  const E = sanitizeNumber(material.elasticModulus, 1e6, 1e12);
  if (E < 1e9) warnings.push('Elastic modulus seems low for typical structural materials');
  if (E > 5e11) warnings.push('Elastic modulus seems high for typical structural materials');
  
  if (material.yieldStrength) {
    const fy = sanitizeNumber(material.yieldStrength, 1e6, 1e9);
    if (material.type === 'concrete' && fy > 100e6) {
      warnings.push('Yield strength is high for concrete (consider compression strength)');
    }
    if (material.type === 'steel' && fy < 200e6) {
      warnings.push('Yield strength is low for structural steel');
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
};

/**
 * Validate element data
 */
export const validateElement = (element: any, nodes: any[]): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!element.id || typeof element.id !== 'string') {
    errors.push('Element ID is required');
  }
  
  const validElementTypes = ['beam', 'column', 'truss', 'frame', 'shell'];
  if (element.type && !validElementTypes.includes(element.type)) {
    errors.push(`Invalid element type: ${element.type}`);
  }
  
  if (!Array.isArray(element.nodes) || element.nodes.length !== 2) {
    errors.push('Element must connect exactly 2 nodes');
  } else {
    const nodeIds = nodes.map(n => n.id);
    for (const nodeId of element.nodes) {
      if (!nodeIds.includes(nodeId)) {
        errors.push(`Element ${element.id} references non-existent node: ${nodeId}`);
      }
    }
    
    if (element.nodes[0] === element.nodes[1]) {
      errors.push(`Element ${element.id} connects node to itself`);
    }
  }
  
  if (element.material) {
    const materialValidation = validateMaterial(element.material);
    errors.push(...materialValidation.errors);
    warnings.push(...materialValidation.warnings);
  } else {
    errors.push('Element material is required');
  }
  
  return { isValid: errors.length === 0, errors, warnings };
};

/**
 * Validate complete structure
 */
export const validateStructure = (structure: any, config: SecurityConfig = defaultSecurityConfig): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!config.enableInputValidation) {
    return { isValid: true, errors: [], warnings: ['Input validation is disabled'] };
  }
  
  const totalSize = (structure.nodes?.length || 0) + (structure.elements?.length || 0);
  if (totalSize > config.maxStructureSize) {
    errors.push(`Structure too large: ${totalSize} entities (max: ${config.maxStructureSize})`);
  }
  
  if (!Array.isArray(structure.nodes) || structure.nodes.length === 0) {
    errors.push('Structure must have at least one node');
  } else {
    const nodeIds = structure.nodes.map((n: any) => n.id);
    const duplicateIds = nodeIds.filter((id: string, index: number) => nodeIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate node IDs found: ${duplicateIds.join(', ')}`);
    }
    
    for (const node of structure.nodes) {
      const nodeValidation = validateNode(node);
      errors.push(...nodeValidation.errors);
      warnings.push(...nodeValidation.warnings);
    }
  }
  
  if (!Array.isArray(structure.elements) || structure.elements.length === 0) {
    errors.push('Structure must have at least one element');
  } else {
    const elementIds = structure.elements.map((e: any) => e.id);
    const duplicateIds = elementIds.filter((id: string, index: number) => elementIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate element IDs found: ${duplicateIds.join(', ')}`);
    }
    
    for (const element of structure.elements) {
      const elementValidation = validateElement(element, structure.nodes);
      errors.push(...elementValidation.errors);
      warnings.push(...elementValidation.warnings);
    }
  }
  
  // Structural stability checks
  if (structure.nodes && structure.elements && errors.length === 0) {
    const connectedNodeIds = new Set();
    for (const element of structure.elements) {
      if (element.nodes && Array.isArray(element.nodes)) {
        element.nodes.forEach((nodeId: string) => connectedNodeIds.add(nodeId));
      }
    }
    
    const unconnectedNodes = structure.nodes.filter((node: any) => !connectedNodeIds.has(node.id));
    if (unconnectedNodes.length > 0) {
      warnings.push(`Unconnected nodes found: ${unconnectedNodes.map((n: any) => n.id).join(', ')}`);
    }
    
    const supportedNodes = structure.nodes.filter((node: any) => 
      node.supports && Object.values(node.supports).some(Boolean)
    );
    
    if (supportedNodes.length === 0) {
      warnings.push('No support constraints found - structure may be unstable');
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
};

/**
 * File validation
 */
export const validateFile = (file: File, config: SecurityConfig = defaultSecurityConfig): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (file.size > config.maxFileSize) {
    errors.push(`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds limit`);
  }
  
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!config.allowedFileTypes.includes(fileExtension)) {
    errors.push(`File type '${fileExtension}' is not allowed`);
  }
  
  const sanitizedName = sanitizeInput(file.name);
  if (sanitizedName !== file.name) {
    warnings.push('File name contains special characters that have been sanitized');
  }
  
  return { isValid: errors.length === 0, errors, warnings };
};

/**
 * Audit logging
 */
export interface AuditLog {
  timestamp: string;
  action: string;
  details: any;
  severity: 'info' | 'warning' | 'error';
}

export class AuditLogger {
  private logs: AuditLog[] = [];
  private maxLogs: number = 1000;
  
  log(action: string, details: any, severity: 'info' | 'warning' | 'error' = 'info'): void {
    const logEntry: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      details,
      severity
    };
    
    this.logs.push(logEntry);
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT:${severity.toUpperCase()}] ${action}:`, details);
    }
  }
  
  getLogs(severity?: 'info' | 'warning' | 'error'): AuditLog[] {
    if (severity) {
      return this.logs.filter(log => log.severity === severity);
    }
    return [...this.logs];
  }
  
  clearLogs(): void {
    this.logs = [];
  }
}

export const globalAuditLogger = new AuditLogger();

/**
 * Rate limiting
 */
export class RateLimiter {
  private calls: Map<string, number[]> = new Map();
  private limits: Map<string, { count: number; window: number }> = new Map();
  
  setLimit(action: string, count: number, windowMs: number): void {
    this.limits.set(action, { count, window: windowMs });
  }
  
  isAllowed(action: string, identifier: string = 'default'): boolean {
    const key = `${action}:${identifier}`;
    const limit = this.limits.get(action);
    
    if (!limit) return true;
    
    const now = Date.now();
    const calls = this.calls.get(key) || [];
    
    const recentCalls = calls.filter(time => now - time < limit.window);
    
    if (recentCalls.length >= limit.count) {
      return false;
    }
    
    recentCalls.push(now);
    this.calls.set(key, recentCalls);
    
    return true;
  }
  
  reset(action?: string): void {
    if (action) {
      for (const key of this.calls.keys()) {
        if (key.startsWith(action + ':')) {
          this.calls.delete(key);
        }
      }
    } else {
      this.calls.clear();
    }
  }
}

export const globalRateLimiter = new RateLimiter();

// Set default rate limits
globalRateLimiter.setLimit('analysis', 10, 60000); // 10 analyses per minute
globalRateLimiter.setLimit('export', 5, 60000); // 5 exports per minute
globalRateLimiter.setLimit('file_upload', 3, 60000); // 3 file uploads per minute