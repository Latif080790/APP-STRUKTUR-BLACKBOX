import { z } from 'zod';

// Schema untuk Node
export const nodeSchema = z.object({
  id: z.number().int().positive(),
  x: z.number().finite(),
  y: z.number().finite(),
  z: z.number().finite(),
  label: z.string().optional(),
  constraints: z.object({
    x: z.boolean().optional(),
    y: z.boolean().optional(),
    z: z.boolean().optional(),
    rx: z.boolean().optional(),
    ry: z.boolean().optional(),
    rz: z.boolean().optional(),
  }).optional(),
  loads: z.object({
    fx: z.number().finite().optional(),
    fy: z.number().finite().optional(),
    fz: z.number().finite().optional(),
    mx: z.number().finite().optional(),
    my: z.number().finite().optional(),
    mz: z.number().finite().optional(),
  }).optional(),
});

// Schema untuk Section
export const sectionSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  area: z.number().positive().optional(),
  inertiaX: z.number().positive().optional(),
  inertiaY: z.number().positive().optional(),
  inertiaZ: z.number().positive().optional(),
});

// Schema untuk Material
export const materialSchema = z.object({
  elasticModulus: z.number().positive().optional(),
  shearModulus: z.number().positive().optional(),
  poissonsRatio: z.number().min(0).max(0.5).optional(),
  density: z.number().nonnegative().optional(),
  color: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
});

// Schema untuk Element
export const elementSchema = z.object({
  id: z.number().int().positive(),
  nodes: z.array(z.number().int().positive()).min(2),
  section: sectionSchema,
  material: materialSchema.optional(),
  type: z.enum(['column', 'beam', 'slab', 'wall', 'foundation']).optional(),
  materialType: z.enum(['concrete', 'steel', 'timber', 'masonry']).optional(),
  group: z.string().optional(),
  color: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
  visible: z.boolean().optional(),
  stress: z.number().finite().optional(),
});

// Schema untuk Structure3D
export const structure3DSchema = z.object({
  nodes: z.array(nodeSchema).min(1),
  elements: z.array(elementSchema).min(1),
});

// Fungsi validasi dengan pesan error yang lebih informatif
export function validateStructure(structure: unknown) {
  try {
    return {
      success: true as const,
      data: structure3DSchema.parse(structure),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
      };
    }
    throw error;
  }
}

// Fungsi untuk memvalidasi node
export function validateNode(node: unknown) {
  return nodeSchema.safeParse(node);
}

// Fungsi untuk memvalidasi element
export function validateElement(element: unknown) {
  return elementSchema.safeParse(element);
}
