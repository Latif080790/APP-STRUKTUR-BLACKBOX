/**
 * Advanced validation utilities for 3D viewer components
 * Provides comprehensive validation for structural data before rendering
 */

import { Node, Element, Structure3D } from '@/types/structural';
import { Geometry } from '../interfaces';

// Validation result interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedData?: any;
}

export interface NodeValidationResult extends ValidationResult {
  correctedData?: Node;
}

export interface ElementValidationResult extends ValidationResult {
  correctedData?: Element;
}

export interface StructureValidationResult extends ValidationResult {
  correctedData?: Structure3D;
  stats?: {
    nodeCount: number;
    elementCount: number;
    boundingBox: {
      min: { x: number; y: number; z: number };
      max: { x: number; y: number; z: number };
    };
  };
}

// Utility functions
const isValidNumber = (value: any): value is number => 
  typeof value === 'number' && !isNaN(value) && isFinite(value);

const isPositiveNumber = (value: any): value is number =>
  isValidNumber(value) && value > 0;

const clampNumber = (value: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, value));

const sanitizeCoordinate = (coord: any, defaultValue: number = 0): number => {
  if (!isValidNumber(coord)) return defaultValue;
  // Clamp to reasonable structural dimensions (-1000m to +1000m)
  return clampNumber(coord, -1000, 1000);
};

// Node validation functions
export const validateNode = (node: any): NodeValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let correctedNode: Node | undefined;

  try {
    // Check if node exists
    if (!node) {
      return {
        isValid: false,
        errors: ['Node is null or undefined'],
        warnings: []
      };
    }

    // Validate node ID
    if (typeof node.id !== 'number' && typeof node.id !== 'string') {
      errors.push('Node ID must be a number or string');
    }

    // Validate coordinates
    const originalX = node.x;
    const originalY = node.y;
    const originalZ = node.z;

    const x = sanitizeCoordinate(originalX);
    const y = sanitizeCoordinate(originalY);
    const z = sanitizeCoordinate(originalZ);

    if (x !== originalX) warnings.push(`Node ${node.id}: X coordinate corrected from ${originalX} to ${x}`);
    if (y !== originalY) warnings.push(`Node ${node.id}: Y coordinate corrected from ${originalY} to ${y}`);
    if (z !== originalZ) warnings.push(`Node ${node.id}: Z coordinate corrected from ${originalZ} to ${z}`);

    // Check for extreme coordinates
    const maxCoord = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
    if (maxCoord > 500) {
      warnings.push(`Node ${node.id}: Very large coordinates detected (${maxCoord}m)`);
    }

    // Validate node type if present
    if (node.type && !['fixed', 'pinned', 'free', 'roller'].includes(node.type)) {
      warnings.push(`Node ${node.id}: Unknown node type '${node.type}', using 'free'`);
    }

    // Create corrected node
    correctedNode = {
      id: node.id,
      x,
      y,
      z,
      type: node.type || 'free',
      ...(node.supports && { supports: node.supports })
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedData: correctedNode
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Node validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
};

// Element validation functions
export const validateElement = (element: any, nodes: Node[]): ElementValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let correctedElement: Element | undefined;

  try {
    if (!element) {
      return {
        isValid: false,
        errors: ['Element is null or undefined'],
        warnings: []
      };
    }

    // Validate element ID
    if (typeof element.id !== 'number' && typeof element.id !== 'string') {
      errors.push('Element ID must be a number or string');
    }

    // Validate node connectivity
    const startNodeId = element.startNode ?? element.nodeIds?.[0];
    const endNodeId = element.endNode ?? element.nodeIds?.[1];

    if (startNodeId === undefined || endNodeId === undefined) {
      errors.push(`Element ${element.id}: Missing node connectivity`);
    } else {
      // Check if referenced nodes exist
      const startNodeExists = nodes.some(n => n.id === startNodeId);
      const endNodeExists = nodes.some(n => n.id === endNodeId);

      if (!startNodeExists) {
        errors.push(`Element ${element.id}: Start node ${startNodeId} not found`);
      }
      if (!endNodeExists) {
        errors.push(`Element ${element.id}: End node ${endNodeId} not found`);
      }

      // Check for self-connecting elements
      if (startNodeId === endNodeId) {
        errors.push(`Element ${element.id}: Element connects to itself (node ${startNodeId})`);
      }

      // Calculate element length if nodes exist
      if (startNodeExists && endNodeExists) {
        const startNode = nodes.find(n => n.id === startNodeId)!;
        const endNode = nodes.find(n => n.id === endNodeId)!;
        
        const length = Math.sqrt(
          Math.pow(endNode.x - startNode.x, 2) +
          Math.pow(endNode.y - startNode.y, 2) +
          Math.pow(endNode.z - startNode.z, 2)
        );

        if (length < 0.001) {
          warnings.push(`Element ${element.id}: Very short element length (${length.toFixed(6)}m)`);
        }
        
        if (length > 100) {
          warnings.push(`Element ${element.id}: Very long element length (${length.toFixed(2)}m)`);
        }
      }
    }

    // Validate element type
    const validTypes = ['beam', 'column', 'brace', 'slab', 'wall', 'truss'];
    if (element.type && !validTypes.includes(element.type)) {
      warnings.push(`Element ${element.id}: Unknown element type '${element.type}', using 'beam'`);
    }

    // Validate section properties if present
    if (element.section) {
      if (typeof element.section === 'string') {
        // Parse section string (e.g., "400x600")
        const sectionMatch = element.section.match(/(\d+)x(\d+)/);
        if (!sectionMatch) {
          warnings.push(`Element ${element.id}: Invalid section format '${element.section}'`);
        }
      } else if (typeof element.section === 'object') {
        // Validate section object properties
        if (element.section.width && !isPositiveNumber(element.section.width)) {
          warnings.push(`Element ${element.id}: Invalid section width`);
        }
        if (element.section.height && !isPositiveNumber(element.section.height)) {
          warnings.push(`Element ${element.id}: Invalid section height`);
        }
        if (element.section.area && !isPositiveNumber(element.section.area)) {
          warnings.push(`Element ${element.id}: Invalid section area`);
        }
      }
    }

    // Validate material properties if present
    if (element.material) {
      if (typeof element.material === 'string') {
        // Valid material string (e.g., "C25", "Steel")
      } else if (typeof element.material === 'object') {
        if (element.material.elasticModulus && !isPositiveNumber(element.material.elasticModulus)) {
          warnings.push(`Element ${element.id}: Invalid elastic modulus`);
        }
        if (element.material.fc && !isPositiveNumber(element.material.fc)) {
          warnings.push(`Element ${element.id}: Invalid concrete strength`);
        }
      }
    }

    // Create corrected element
    correctedElement = {
      id: element.id,
      type: element.type || 'beam',
      startNode: startNodeId,
      endNode: endNodeId,
      ...(element.nodeIds && { nodeIds: [startNodeId, endNodeId] }),
      ...(element.section && { section: element.section }),
      ...(element.material && { material: element.material })
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedData: correctedElement
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Element validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
};

// Structure validation functions
export const validateStructure3D = (structure: any): StructureValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let correctedStructure: Structure3D | undefined;

  try {
    if (!structure) {
      return {
        isValid: false,
        errors: ['Structure is null or undefined'],
        warnings: []
      };
    }

    // Validate nodes array
    if (!Array.isArray(structure.nodes)) {
      errors.push('Structure must have a nodes array');
      return { isValid: false, errors, warnings };
    }

    if (structure.nodes.length === 0) {
      errors.push('Structure must have at least one node');
      return { isValid: false, errors, warnings };
    }

    // Validate elements array
    if (!Array.isArray(structure.elements)) {
      errors.push('Structure must have an elements array');
      return { isValid: false, errors, warnings };
    }

    if (structure.elements.length === 0) {
      warnings.push('Structure has no elements');
    }

    // Validate each node
    const validatedNodes: Node[] = [];
    const nodeIds = new Set<string | number>();
    
    for (let i = 0; i < structure.nodes.length; i++) {
      const nodeResult = validateNode(structure.nodes[i]);
      
      if (!nodeResult.isValid) {
        errors.push(`Node ${i}: ${nodeResult.errors.join(', ')}`);
        continue;
      }

      if (nodeResult.warnings.length > 0) {
        warnings.push(...nodeResult.warnings);
      }

      if (nodeResult.correctedData) {
        // Check for duplicate node IDs
        if (nodeIds.has(nodeResult.correctedData.id)) {
          errors.push(`Duplicate node ID: ${nodeResult.correctedData.id}`);
          continue;
        }

        nodeIds.add(nodeResult.correctedData.id);
        validatedNodes.push(nodeResult.correctedData);
      }
    }

    if (validatedNodes.length === 0) {
      errors.push('No valid nodes found');
      return { isValid: false, errors, warnings };
    }

    // Validate each element
    const validatedElements: Element[] = [];
    const elementIds = new Set<string | number>();

    for (let i = 0; i < structure.elements.length; i++) {
      const elementResult = validateElement(structure.elements[i], validatedNodes);
      
      if (!elementResult.isValid) {
        errors.push(`Element ${i}: ${elementResult.errors.join(', ')}`);
        continue;
      }

      if (elementResult.warnings.length > 0) {
        warnings.push(...elementResult.warnings);
      }

      if (elementResult.correctedData) {
        // Check for duplicate element IDs
        if (elementIds.has(elementResult.correctedData.id)) {
          errors.push(`Duplicate element ID: ${elementResult.correctedData.id}`);
          continue;
        }

        elementIds.add(elementResult.correctedData.id);
        validatedElements.push(elementResult.correctedData);
      }
    }

    // Calculate bounding box and stats
    const stats = calculateStructureStats(validatedNodes, validatedElements);

    // Check for reasonable structure size
    const maxDimension = Math.max(
      stats.boundingBox.max.x - stats.boundingBox.min.x,
      stats.boundingBox.max.y - stats.boundingBox.min.y,
      stats.boundingBox.max.z - stats.boundingBox.min.z
    );

    if (maxDimension > 1000) {
      warnings.push(`Very large structure detected (${maxDimension.toFixed(2)}m maximum dimension)`);
    }

    if (maxDimension < 0.1) {
      warnings.push(`Very small structure detected (${maxDimension.toFixed(6)}m maximum dimension)`);
    }

    // Create corrected structure
    correctedStructure = {
      nodes: validatedNodes,
      elements: validatedElements,
      loads: structure.loads || []
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      correctedData: correctedStructure,
      stats
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Structure validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings
    };
  }
};

// Geometry validation for frame generation
export const validateGeometry = (geometry: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    if (!geometry) {
      return {
        isValid: false,
        errors: ['Geometry is null or undefined'],
        warnings: []
      };
    }

    // Required properties
    const requiredProps = ['length', 'width', 'heightPerFloor', 'numberOfFloors'];
    for (const prop of requiredProps) {
      if (!isPositiveNumber(geometry[prop])) {
        errors.push(`Invalid ${prop}: must be a positive number`);
      }
    }

    // Optional properties with validation
    if (geometry.columnGridX !== undefined && !isPositiveNumber(geometry.columnGridX)) {
      warnings.push('Invalid columnGridX, using default value');
    }

    if (geometry.columnGridY !== undefined && !isPositiveNumber(geometry.columnGridY)) {
      warnings.push('Invalid columnGridY, using default value');
    }

    // Reasonable range checks
    if (geometry.length > 200) warnings.push('Building length is very large (>200m)');
    if (geometry.width > 200) warnings.push('Building width is very large (>200m)');
    if (geometry.heightPerFloor > 10) warnings.push('Floor height is very large (>10m)');
    if (geometry.numberOfFloors > 100) warnings.push('Number of floors is very large (>100)');

    if (geometry.length < 3) warnings.push('Building length is very small (<3m)');
    if (geometry.width < 3) warnings.push('Building width is very small (<3m)');
    if (geometry.heightPerFloor < 2) warnings.push('Floor height is very small (<2m)');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Geometry validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
};

// Helper function to calculate structure statistics
const calculateStructureStats = (nodes: Node[], elements: Element[]) => {
  if (nodes.length === 0) {
    return {
      nodeCount: 0,
      elementCount: elements.length,
      boundingBox: {
        min: { x: 0, y: 0, z: 0 },
        max: { x: 0, y: 0, z: 0 }
      }
    };
  }

  let minX = nodes[0].x, maxX = nodes[0].x;
  let minY = nodes[0].y, maxY = nodes[0].y;
  let minZ = nodes[0].z, maxZ = nodes[0].z;

  for (const node of nodes) {
    minX = Math.min(minX, node.x);
    maxX = Math.max(maxX, node.x);
    minY = Math.min(minY, node.y);
    maxY = Math.max(maxY, node.y);
    minZ = Math.min(minZ, node.z);
    maxZ = Math.max(maxZ, node.z);
  }

  return {
    nodeCount: nodes.length,
    elementCount: elements.length,
    boundingBox: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ }
    }
  };
};

// WebGL capability checking
export const checkWebGLCapabilities = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return {
        supported: false,
        errors: ['WebGL is not supported by this browser'],
        warnings: []
      };
    }

    const warnings: string[] = [];
    
    // Check maximum texture size
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTextureSize < 4096) {
      warnings.push(`Low maximum texture size: ${maxTextureSize}x${maxTextureSize}`);
    }

    // Check maximum viewport dimensions
    const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    if (maxViewport[0] < 4096 || maxViewport[1] < 4096) {
      warnings.push(`Low maximum viewport: ${maxViewport[0]}x${maxViewport[1]}`);
    }

    // Check for required extensions
    const extensions = {
      depthTexture: gl.getExtension('WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture'),
      floatTexture: gl.getExtension('OES_texture_float'),
      anisotropic: gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    };

    if (!extensions.depthTexture) warnings.push('Depth texture extension not available');
    if (!extensions.floatTexture) warnings.push('Float texture extension not available');
    if (!extensions.anisotropic) warnings.push('Anisotropic filtering not available');

    return {
      supported: true,
      errors: [],
      warnings,
      info: {
        version: gl.getParameter(gl.VERSION),
        renderer: gl.getParameter(gl.RENDERER),
        vendor: gl.getParameter(gl.VENDOR),
        maxTextureSize,
        maxViewport,
        extensions: Object.keys(extensions).filter(key => extensions[key as keyof typeof extensions])
      }
    };

  } catch (error) {
    return {
      supported: false,
      errors: [`WebGL capability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      warnings: []
    };
  }
};

export default {
  validateNode,
  validateElement,
  validateStructure3D,
  validateGeometry,
  checkWebGLCapabilities
};