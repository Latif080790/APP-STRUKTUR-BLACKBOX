/**
 * Comprehensive Zod validation schemas for structural analysis forms
 * Provides type-safe validation with custom error messages and data transformation
 */

import { z } from 'zod';

// Custom validators
const positiveNumber = (field: string) => 
  z.number({
    required_error: `${field} wajib diisi`,
    invalid_type_error: `${field} harus berupa angka`
  })
  .positive(`${field} harus lebih besar dari 0`)
  .finite(`${field} harus berupa angka yang valid`);

const nonNegativeNumber = (field: string) =>
  z.number({
    required_error: `${field} wajib diisi`,
    invalid_type_error: `${field} harus berupa angka`
  })
  .min(0, `${field} tidak boleh negatif`)
  .finite(`${field} harus berupa angka yang valid`);

const percentageNumber = (field: string) =>
  z.number({
    required_error: `${field} wajib diisi`,
    invalid_type_error: `${field} harus berupa angka`
  })
  .min(0, `${field} tidak boleh negatif`)
  .max(100, `${field} tidak boleh lebih dari 100%`)
  .finite(`${field} harus berupa angka yang valid`);

const coordinateNumber = (field: string) =>
  z.number({
    required_error: `${field} wajib diisi`,
    invalid_type_error: `${field} harus berupa angka`
  })
  .min(-1000, `${field} tidak boleh kurang dari -1000m`)
  .max(1000, `${field} tidak boleh lebih dari 1000m`)
  .finite(`${field} harus berupa angka yang valid`);

// Geometry Schema
export const geometrySchema = z.object({
  length: positiveNumber('Panjang bangunan')
    .min(3, 'Panjang bangunan minimal 3 meter')
    .max(200, 'Panjang bangunan maksimal 200 meter'),
  
  width: positiveNumber('Lebar bangunan')
    .min(3, 'Lebar bangunan minimal 3 meter')
    .max(200, 'Lebar bangunan maksimal 200 meter'),
  
  heightPerFloor: positiveNumber('Tinggi per lantai')
    .min(2.4, 'Tinggi per lantai minimal 2.4 meter')
    .max(10, 'Tinggi per lantai maksimal 10 meter'),
  
  numberOfFloors: z.number({
    required_error: 'Jumlah lantai wajib diisi',
    invalid_type_error: 'Jumlah lantai harus berupa angka'
  })
    .int('Jumlah lantai harus berupa bilangan bulat')
    .min(1, 'Minimal 1 lantai')
    .max(100, 'Maksimal 100 lantai'),
  
  columnGridX: positiveNumber('Grid kolom X')
    .min(3, 'Grid kolom X minimal 3 meter')
    .max(20, 'Grid kolom X maksimal 20 meter')
    .optional(),
  
  columnGridY: positiveNumber('Grid kolom Y')
    .min(3, 'Grid kolom Y minimal 3 meter')
    .max(20, 'Grid kolom Y maksimal 20 meter')
    .optional(),
  
  foundationDepth: nonNegativeNumber('Kedalaman pondasi')
    .max(50, 'Kedalaman pondasi maksimal 50 meter')
    .optional(),
}).refine((data) => {
  // Cross-field validation
  const totalHeight = data.heightPerFloor * data.numberOfFloors;
  return totalHeight <= 500;
}, {
  message: 'Total tinggi bangunan tidak boleh lebih dari 500 meter',
  path: ['numberOfFloors']
});

// Material Schema
export const materialPropertiesSchema = z.object({
  fc: positiveNumber("Kuat tekan beton (f'c)")
    .min(10, "Kuat tekan beton minimal 10 MPa")
    .max(80, "Kuat tekan beton maksimal 80 MPa"),
  
  fy: positiveNumber('Kuat leleh baja (fy)')
    .min(200, 'Kuat leleh baja minimal 200 MPa')
    .max(800, 'Kuat leleh baja maksimal 800 MPa'),
  
  elasticModulus: positiveNumber('Modulus elastisitas')
    .min(15000, 'Modulus elastisitas minimal 15000 MPa')
    .max(50000, 'Modulus elastisitas maksimal 50000 MPa')
    .optional(),
  
  poissonRatio: z.number({
    required_error: 'Rasio Poisson wajib diisi',
    invalid_type_error: 'Rasio Poisson harus berupa angka'
  })
    .min(0.1, 'Rasio Poisson minimal 0.1')
    .max(0.5, 'Rasio Poisson maksimal 0.5')
    .optional()
    .default(0.2),
  
  density: positiveNumber('Densitas material')
    .min(1000, 'Densitas minimal 1000 kg/m³')
    .max(10000, 'Densitas maksimal 10000 kg/m³')
    .optional()
    .default(2400)
});

// Section Schema
export const sectionPropertiesSchema = z.object({
  width: positiveNumber('Lebar penampang')
    .min(0.1, 'Lebar penampang minimal 0.1 meter')
    .max(3, 'Lebar penampang maksimal 3 meter'),
  
  height: positiveNumber('Tinggi penampang')
    .min(0.1, 'Tinggi penampang minimal 0.1 meter')
    .max(3, 'Tinggi penampang maksimal 3 meter'),
  
  area: positiveNumber('Luas penampang')
    .min(0.01, 'Luas penampang minimal 0.01 m²')
    .max(9, 'Luas penampang maksimal 9 m²')
    .optional(),
  
  momentOfInertiaX: positiveNumber('Momen inersia X')
    .min(0.0001, 'Momen inersia X minimal 0.0001 m⁴')
    .max(10, 'Momen inersia X maksimal 10 m⁴')
    .optional(),
  
  momentOfInertiaY: positiveNumber('Momen inersia Y')
    .min(0.0001, 'Momen inersia Y minimal 0.0001 m⁴')
    .max(10, 'Momen inersia Y maksimal 10 m⁴')
    .optional(),
  
  torsionalConstant: nonNegativeNumber('Konstanta torsi')
    .max(10, 'Konstanta torsi maksimal 10 m⁴')
    .optional()
}).refine((data) => {
  // Auto-calculate area if not provided
  if (!data.area) {
    data.area = data.width * data.height;
  }
  return data.area === data.width * data.height;
}, {
  message: 'Luas penampang harus sesuai dengan lebar × tinggi',
  path: ['area']
});

// Load Schema
export const loadSchema = z.object({
  type: z.enum(['dead', 'live', 'wind', 'seismic', 'point', 'distributed'], {
    required_error: 'Jenis beban wajib dipilih',
    invalid_type_error: 'Jenis beban tidak valid'
  }),
  
  magnitude: z.number({
    required_error: 'Besar beban wajib diisi',
    invalid_type_error: 'Besar beban harus berupa angka'
  })
    .min(-1000000, 'Besar beban minimal -1000000 N')
    .max(1000000, 'Besar beban maksimal 1000000 N')
    .finite('Besar beban harus berupa angka yang valid'),
  
  direction: z.enum(['x', 'y', 'z', 'all'], {
    required_error: 'Arah beban wajib dipilih',
    invalid_type_error: 'Arah beban tidak valid'
  }).optional().default('z'),
  
  nodeId: z.union([z.string(), z.number()], {
    required_error: 'ID node wajib diisi'
  }).optional(),
  
  elementId: z.union([z.string(), z.number()], {
    required_error: 'ID elemen wajib diisi'
  }).optional(),
  
  description: z.string().optional()
}).refine((data) => {
  // Ensure either nodeId or elementId is provided for point loads
  if (data.type === 'point') {
    return data.nodeId !== undefined || data.elementId !== undefined;
  }
  return true;
}, {
  message: 'Beban titik harus memiliki nodeId atau elementId',
  path: ['nodeId']
});

// Node Schema
export const nodeSchema = z.object({
  id: z.union([z.string(), z.number()], {
    required_error: 'ID node wajib diisi'
  }),
  
  x: coordinateNumber('Koordinat X'),
  y: coordinateNumber('Koordinat Y'),
  z: coordinateNumber('Koordinat Z'),
  
  type: z.enum(['free', 'fixed', 'pinned', 'roller'], {
    invalid_type_error: 'Jenis tumpuan tidak valid'
  }).optional().default('free'),
  
  supports: z.object({
    dx: z.boolean().optional().default(false),
    dy: z.boolean().optional().default(false),
    dz: z.boolean().optional().default(false),
    rx: z.boolean().optional().default(false),
    ry: z.boolean().optional().default(false),
    rz: z.boolean().optional().default(false)
  }).optional()
});

// Element Schema
export const elementSchema = z.object({
  id: z.union([z.string(), z.number()], {
    required_error: 'ID elemen wajib diisi'
  }),
  
  type: z.enum(['beam', 'column', 'brace', 'slab', 'wall', 'truss'], {
    required_error: 'Jenis elemen wajib dipilih',
    invalid_type_error: 'Jenis elemen tidak valid'
  }),
  
  startNode: z.union([z.string(), z.number()], {
    required_error: 'Node awal wajib diisi'
  }),
  
  endNode: z.union([z.string(), z.number()], {
    required_error: 'Node akhir wajib diisi'
  }),
  
  material: z.union([
    z.string().min(1, 'Nama material wajib diisi'),
    materialPropertiesSchema
  ]),
  
  section: z.union([
    z.string().min(1, 'Nama penampang wajib diisi'),
    sectionPropertiesSchema
  ])
}).refine((data) => {
  // Ensure startNode and endNode are different
  return data.startNode !== data.endNode;
}, {
  message: 'Node awal dan node akhir harus berbeda',
  path: ['endNode']
});

// Structure Schema
export const structureSchema = z.object({
  nodes: z.array(nodeSchema)
    .min(1, 'Minimal harus ada 1 node')
    .max(10000, 'Maksimal 10000 node'),
  
  elements: z.array(elementSchema)
    .min(0, 'Jumlah elemen tidak boleh negatif')
    .max(50000, 'Maksimal 50000 elemen'),
  
  loads: z.array(loadSchema)
    .optional()
    .default([])
}).refine((data) => {
  // Check for duplicate node IDs
  const nodeIds = data.nodes.map(n => n.id.toString());
  const uniqueNodeIds = new Set(nodeIds);
  return nodeIds.length === uniqueNodeIds.size;
}, {
  message: 'ID node harus unik',
  path: ['nodes']
}).refine((data) => {
  // Check for duplicate element IDs
  const elementIds = data.elements.map(e => e.id.toString());
  const uniqueElementIds = new Set(elementIds);
  return elementIds.length === uniqueElementIds.size;
}, {
  message: 'ID elemen harus unik',
  path: ['elements']
}).refine((data) => {
  // Validate element node references
  const nodeIds = new Set(data.nodes.map(n => n.id.toString()));
  for (const element of data.elements) {
    if (!nodeIds.has(element.startNode.toString()) || !nodeIds.has(element.endNode.toString())) {
      return false;
    }
  }
  return true;
}, {
  message: 'Semua elemen harus mereferensikan node yang ada',
  path: ['elements']
});

// Seismic Analysis Schema
export const seismicAnalysisSchema = z.object({
  designCategory: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], {
    required_error: 'Kategori desain seismik wajib dipilih',
    invalid_type_error: 'Kategori desain seismik tidak valid'
  }),
  
  siteClass: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], {
    required_error: 'Kelas situs wajib dipilih',
    invalid_type_error: 'Kelas situs tidak valid'
  }),
  
  ss: percentageNumber('Parameter percepatan spektral Ss')
    .max(3, 'Nilai Ss maksimal 3.0g'),
  
  s1: percentageNumber('Parameter percepatan spektral S1')
    .max(2, 'Nilai S1 maksimal 2.0g'),
  
  importance: z.number({
    required_error: 'Faktor keutamaan wajib diisi',
    invalid_type_error: 'Faktor keutamaan harus berupa angka'
  })
    .min(1.0, 'Faktor keutamaan minimal 1.0')
    .max(1.5, 'Faktor keutamaan maksimal 1.5'),
  
  dampingRatio: percentageNumber('Rasio redaman')
    .min(1, 'Rasio redaman minimal 1%')
    .max(20, 'Rasio redaman maksimal 20%')
    .optional()
    .default(5),
  
  responseModification: positiveNumber('Faktor modifikasi respons')
    .min(1, 'Faktor R minimal 1')
    .max(8, 'Faktor R maksimal 8')
    .optional()
    .default(3),
  
  overstrengthFactor: positiveNumber('Faktor kelebihan kekuatan')
    .min(1, 'Faktor Ω minimal 1')
    .max(5, 'Faktor Ω maksimal 5')
    .optional()
    .default(2.5),
  
  deflectionAmplificationFactor: positiveNumber('Faktor pembesaran defleksi')
    .min(1, 'Faktor Cd minimal 1')
    .max(10, 'Faktor Cd maksimal 10')
    .optional()
    .default(3)
});

// Analysis Options Schema
export const analysisOptionsSchema = z.object({
  includeNonlinear: z.boolean().optional().default(false),
  includeSecondOrder: z.boolean().optional().default(false),
  convergenceTolerance: positiveNumber('Toleransi konvergensi')
    .min(1e-10, 'Toleransi terlalu kecil')
    .max(1e-3, 'Toleransi terlalu besar')
    .optional()
    .default(1e-6),
  
  maxIterations: z.number({
    required_error: 'Maksimum iterasi wajib diisi',
    invalid_type_error: 'Maksimum iterasi harus berupa angka'
  })
    .int('Maksimum iterasi harus bilangan bulat')
    .min(10, 'Maksimum iterasi minimal 10')
    .max(1000, 'Maksimum iterasi maksimal 1000')
    .optional()
    .default(100),
  
  analysisType: z.enum(['static', 'modal', 'response-spectrum', 'time-history'], {
    required_error: 'Jenis analisis wajib dipilih',
    invalid_type_error: 'Jenis analisis tidak valid'
  }),
  
  numberOfModes: z.number({
    required_error: 'Jumlah mode wajib diisi',
    invalid_type_error: 'Jumlah mode harus berupa angka'
  })
    .int('Jumlah mode harus bilangan bulat')
    .min(1, 'Minimal 1 mode')
    .max(100, 'Maksimal 100 mode')
    .optional()
    .default(10)
});

// Complete Analysis Input Schema
export const completeAnalysisInputSchema = z.object({
  geometry: geometrySchema,
  material: materialPropertiesSchema,
  section: sectionPropertiesSchema.optional(),
  structure: structureSchema.optional(),
  seismic: seismicAnalysisSchema.optional(),
  options: analysisOptionsSchema.optional()
}).refine((data) => {
  // Ensure seismic analysis is provided if analysis type requires it
  if (data.options?.analysisType === 'response-spectrum' && !data.seismic) {
    return false;
  }
  return true;
}, {
  message: 'Analisis seismik diperlukan untuk analisis spektrum respons',
  path: ['seismic']
});

// Type exports for TypeScript inference
export type GeometryFormData = z.infer<typeof geometrySchema>;
export type MaterialFormData = z.infer<typeof materialPropertiesSchema>;
export type SectionFormData = z.infer<typeof sectionPropertiesSchema>;
export type LoadFormData = z.infer<typeof loadSchema>;
export type NodeFormData = z.infer<typeof nodeSchema>;
export type ElementFormData = z.infer<typeof elementSchema>;
export type StructureFormData = z.infer<typeof structureSchema>;
export type SeismicAnalysisFormData = z.infer<typeof seismicAnalysisSchema>;
export type AnalysisOptionsFormData = z.infer<typeof analysisOptionsSchema>;
export type CompleteAnalysisInputFormData = z.infer<typeof completeAnalysisInputSchema>;

// Validation helper functions
export const validateAndTransform = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    return {
      success: true as const,
      data: schema.parse(data),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        data: null,
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      success: false as const,
      data: null,
      errors: [{
        path: 'unknown',
        message: 'Validation error occurred',
        code: 'custom' as const
      }]
    };
  }
};

// Safe parsing with partial validation
export const partialValidation = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { valid: true, data: result.data, errors: [] };
    } else {
      return {
        valid: false,
        data: null,
        errors: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      };
    }
  } catch (error) {
    return {
      valid: false,
      data: null,
      errors: [{ 
        field: 'general', 
        message: error instanceof Error ? error.message : 'Unknown validation error' 
      }]
    };
  }
};