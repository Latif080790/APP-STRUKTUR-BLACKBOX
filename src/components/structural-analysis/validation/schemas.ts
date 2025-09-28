import { z } from 'zod';/**/**/**



// Basic validators * Simplified Zod validation schemas for structural analysis

export const geometrySchema = z.object({

  length: z.number().min(3).max(200), * Compatible with Zod v4 API * Comprehensive Zod validation schemas for structural analysis forms * Comprehensive Zod validation schemas for structural analysis forms

  width: z.number().min(3).max(200),

  heightPerFloor: z.number().min(2.5).max(6), */

  numberOfFloors: z.number().int().min(1).max(50)

}); * Provides type-safe validation with custom error messages and data transformation * Provides type-safe validation with custom error messages and data transformation



export const materialsSchema = z.object({import { z } from 'zod';

  fc: z.number().min(15).max(100),

  ec: z.number().min(15000).max(50000), */ */

  fy: z.number().min(240).max(600),

  fySteel: z.number().min(240).max(600),// Basic validators

  es: z.number().min(200000).max(220000),

  poissonRatio: z.number().min(0.1).max(0.5)export const geometrySchema = z.object({

});

  length: z.number().min(3).max(200),

export const loadsSchema = z.object({

  deadLoad: z.number().min(0).max(50),  width: z.number().min(3).max(200),import { z } from 'zod';import { z } from 'zod';

  liveLoad: z.number().min(0).max(20)

});  heightPerFloor: z.number().min(2.5).max(6),



export const seismicParametersSchema = z.object({  numberOfFloors: z.number().int().min(1).max(50)

  latitude: z.number().min(-11).max(6),

  longitude: z.number().min(95).max(141),});

  ss: z.number().min(0).max(2.5),

  s1: z.number().min(0).max(1.5),// Custom validators for Zod v4 compatibility// Custom validators  

  designCategory: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),

  siteClass: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),export const materialsSchema = z.object({

  fa: z.number().min(0.8).max(2.5),

  fv: z.number().min(0.8).max(3.5),  fc: z.number().min(15).max(100),const positiveNumber = (field: string) => const positiveNumber = (field: string) => 

  importanceFactor: z.number().min(1.0).max(1.5),

  responseModifier: z.number().min(1).max(8)  ec: z.number().min(15000).max(50000),

});

  fy: z.number().min(240).max(600),  z.number({  z.number({

export const analysisOptionsSchema = z.object({

  maxIterations: z.number().int().min(100).max(10000),  fySteel: z.number().min(240).max(600),

  tolerance: z.number().min(1e-8).max(1e-3),

  analysisType: z.enum(['static', 'modal', 'response-spectrum', 'time-history']),  es: z.number().min(200000).max(220000),    message: `${field} harus berupa angka yang valid`    message: `${field} harus berupa angka yang valid`

  numberOfModes: z.number().int().min(3).max(50),

  dampingRatio: z.number().min(0).max(10)  poissonRatio: z.number().min(0.1).max(0.5)

});

});  })  })

export const structureSchema = z.object({

  projectInfo: z.object({

    name: z.string().min(1),

    description: z.string().optional(),export const loadsSchema = z.object({  .positive(`${field} harus lebih besar dari 0`)  .positive(`${field} harus lebih besar dari 0`)

    engineer: z.string().min(1),

    date: z.date().default(() => new Date())  deadLoad: z.number().min(0).max(50),

  }),

  geometry: geometrySchema,  liveLoad: z.number().min(0).max(20)  .finite(`${field} harus berupa angka yang valid`);  .finite(`${field} harus berupa angka yang valid`);

  materials: materialsSchema,

  loads: loadsSchema,});

  seismicParameters: seismicParametersSchema,

  analysisOptions: analysisOptionsSchema

});

export const seismicParametersSchema = z.object({

// Type exports

export type GeometryData = z.infer<typeof geometrySchema>;  latitude: z.number().min(-11).max(6),const nonNegativeNumber = (field: string) =>const nonNegativeNumber = (field: string) =>

export type MaterialsData = z.infer<typeof materialsSchema>;

export type LoadsData = z.infer<typeof loadsSchema>;  longitude: z.number().min(95).max(141),

export type SeismicParametersData = z.infer<typeof seismicParametersSchema>;

export type AnalysisOptionsData = z.infer<typeof analysisOptionsSchema>;  ss: z.number().min(0).max(2.5),  z.number({  z.number({

export type StructureData = z.infer<typeof structureSchema>;

  s1: z.number().min(0).max(1.5),

// Error handling

export const handleValidationError = (error: z.ZodError) => ({  designCategory: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),    message: `${field} harus berupa angka yang valid`    message: `${field} harus berupa angka yang valid`

  success: false,

  errors: error.issues.map(err => ({  siteClass: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),

    path: err.path.join('.'),

    message: err.message,  fa: z.number().min(0.8).max(2.5),  })  })

    code: err.code

  }))  fv: z.number().min(0.8).max(3.5),

});

  importanceFactor: z.number().min(1.0).max(1.5),  .min(0, `${field} tidak boleh negatif`)  .min(0, `${field} tidak boleh negatif`)

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {

  try {  responseModifier: z.number().min(1).max(8)

    const result = schema.safeParse(data);

    return result.success });  .finite(`${field} harus berupa angka yang valid`);  .finite(`${field} harus berupa angka yang valid`);

      ? { success: true, data: result.data }

      : {

          success: false,

          errors: result.error.issues.map(err => ({export const analysisOptionsSchema = z.object({

            path: err.path.join('.'),

            message: err.message,  maxIterations: z.number().int().min(100).max(10000),

            code: err.code

          }))  tolerance: z.number().min(1e-8).max(1e-3),const percentageNumber = (field: string) =>const percentageNumber = (field: string) =>

        };

  } catch (error) {  analysisType: z.enum(['static', 'modal', 'response-spectrum', 'time-history']),

    return {

      success: false,  numberOfModes: z.number().int().min(3).max(50),  z.number({  z.number({

      errors: [{ path: '', message: 'Unexpected validation error', code: 'unknown' }]

    };  dampingRatio: z.number().min(0).max(10)

  }

};});    message: `${field} harus berupa angka yang valid`    message: `${field} harus berupa angka yang valid`



// Validation presets

export const validateStructuralInput = (data: unknown) => validateData(structureSchema, data);

export const validateGeometry = (data: unknown) => validateData(geometrySchema, data);export const structureSchema = z.object({  })  })

export const validateMaterials = (data: unknown) => validateData(materialsSchema, data);

export const validateLoads = (data: unknown) => validateData(loadsSchema, data);  projectInfo: z.object({

export const validateSeismicParameters = (data: unknown) => validateData(seismicParametersSchema, data);
    name: z.string().min(1),  .min(0, `${field} tidak boleh negatif`)  .min(0, `${field} tidak boleh negatif`)

    description: z.string().optional(),

    engineer: z.string().min(1),  .max(100, `${field} tidak boleh lebih dari 100%`)  .max(100, `${field} tidak boleh lebih dari 100%`)

    date: z.date().default(() => new Date())

  }),  .finite(`${field} harus berupa angka yang valid`);  .finite(`${field} harus berupa angka yang valid`);

  geometry: geometrySchema,

  materials: materialsSchema,

  loads: loadsSchema,

  seismicParameters: seismicParametersSchema,const coordinateNumber = (field: string) =>const coordinateNumber = (field: string) =>

  analysisOptions: analysisOptionsSchema

});  z.number({  z.number({



// Type exports    message: `${field} harus berupa angka yang valid`    message: `${field} harus berupa angka yang valid`

export type GeometryData = z.infer<typeof geometrySchema>;

export type MaterialsData = z.infer<typeof materialsSchema>;  })  })

export type LoadsData = z.infer<typeof loadsSchema>;

export type SeismicParametersData = z.infer<typeof seismicParametersSchema>;  .min(-1000, `${field} tidak boleh kurang dari -1000m`)  .min(-1000, `${field} tidak boleh kurang dari -1000m`)

export type AnalysisOptionsData = z.infer<typeof analysisOptionsSchema>;

export type StructureData = z.infer<typeof structureSchema>;  .max(1000, `${field} tidak boleh lebih dari 1000m`)  .max(1000, `${field} tidak boleh lebih dari 1000m`)



// Error handling  .finite(`${field} harus berupa angka yang valid`);  .finite(`${field} harus berupa angka yang valid`);

export const handleValidationError = (error: z.ZodError) => ({

  success: false,

  errors: error.issues.map(err => ({

    path: err.path.join('.'),// Geometry Schema// Geometry Schema

    message: err.message,

    code: err.codeexport const geometrySchema = z.object({export const geometrySchema = z.object({

  }))

});  length: positiveNumber('Panjang bangunan')  length: positiveNumber('Panjang bangunan')



export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {    .min(3, 'Panjang bangunan minimal 3 meter')    .min(3, 'Panjang bangunan minimal 3 meter')

  try {

    const result = schema.safeParse(data);    .max(200, 'Panjang bangunan maksimal 200 meter'),    .max(200, 'Panjang bangunan maksimal 200 meter'),

    return result.success 

      ? { success: true, data: result.data }    

      : {

          success: false,  width: positiveNumber('Lebar bangunan')  width: positiveNumber('Lebar bangunan')

          errors: result.error.issues.map(err => ({

            path: err.path.join('.'),    .min(3, 'Lebar bangunan minimal 3 meter')    .min(3, 'Lebar bangunan minimal 3 meter')

            message: err.message,

            code: err.code    .max(200, 'Lebar bangunan maksimal 200 meter'),    .max(200, 'Lebar bangunan maksimal 200 meter'),

          }))

        };    

  } catch (error) {

    return {  heightPerFloor: positiveNumber('Tinggi per lantai')  heightPerFloor: positiveNumber('Tinggi per lantai')

      success: false,

      errors: [{ path: '', message: 'Unexpected validation error', code: 'unknown' }]    .min(2.5, 'Tinggi per lantai minimal 2.5 meter')    .min(2.4, 'Tinggi per lantai minimal 2.4 meter')

    };

  }    .max(6, 'Tinggi per lantai maksimal 6 meter'),    .max(10, 'Tinggi per lantai maksimal 10 meter'),

};

    

// Validation presets

export const validateStructuralInput = (data: unknown) => validateData(structureSchema, data);  numberOfFloors: z.number({  numberOfFloors: z.number({

export const validateGeometry = (data: unknown) => validateData(geometrySchema, data);

export const validateMaterials = (data: unknown) => validateData(materialsSchema, data);    message: 'Jumlah lantai wajib diisi'    required_error: 'Jumlah lantai wajib diisi',

export const validateLoads = (data: unknown) => validateData(loadsSchema, data);

export const validateSeismicParameters = (data: unknown) => validateData(seismicParametersSchema, data);  })    invalid_type_error: 'Jumlah lantai harus berupa angka'

    .int('Jumlah lantai harus berupa bilangan bulat')  })

    .min(1, 'Minimal 1 lantai')    .int('Jumlah lantai harus berupa bilangan bulat')

    .max(50, 'Maksimal 50 lantai')    .min(1, 'Minimal 1 lantai')

});    .max(100, 'Maksimal 100 lantai'),

  

export type GeometryData = z.infer<typeof geometrySchema>;  columnGridX: positiveNumber('Grid kolom X')

    .min(3, 'Grid kolom X minimal 3 meter')

// Materials Schema    .max(20, 'Grid kolom X maksimal 20 meter')

export const materialsSchema = z.object({    .optional(),

  fc: positiveNumber('Kuat tekan beton (fc)')  

    .min(15, 'Kuat tekan beton minimal 15 MPa')  columnGridY: positiveNumber('Grid kolom Y')

    .max(100, 'Kuat tekan beton maksimal 100 MPa'),    .min(3, 'Grid kolom Y minimal 3 meter')

      .max(20, 'Grid kolom Y maksimal 20 meter')

  ec: positiveNumber('Modulus elastis beton (Ec)')    .optional(),

    .min(15000, 'Modulus elastis beton minimal 15,000 MPa')  

    .max(50000, 'Modulus elastis beton maksimal 50,000 MPa'),  foundationDepth: nonNegativeNumber('Kedalaman pondasi')

      .max(50, 'Kedalaman pondasi maksimal 50 meter')

  fy: positiveNumber('Kuat leleh baja (fy)')    .optional(),

    .min(240, 'Kuat leleh baja minimal 240 MPa')}).refine((data) => {

    .max(600, 'Kuat leleh baja maksimal 600 MPa'),  // Cross-field validation

    const totalHeight = data.heightPerFloor * data.numberOfFloors;

  fySteel: positiveNumber('Kuat leleh tulangan')  return totalHeight <= 500;

    .min(240, 'Kuat leleh tulangan minimal 240 MPa')}, {

    .max(600, 'Kuat leleh tulangan maksimal 600 MPa'),  message: 'Total tinggi bangunan tidak boleh lebih dari 500 meter',

      path: ['numberOfFloors']

  es: positiveNumber('Modulus elastis baja')});

    .min(200000, 'Modulus elastis baja minimal 200,000 MPa')

    .max(220000, 'Modulus elastis baja maksimal 220,000 MPa'),// Material Schema

export const materialPropertiesSchema = z.object({

  poissonRatio: z.number({  fc: positiveNumber("Kuat tekan beton (f'c)")

    message: 'Rasio Poisson wajib diisi'    .min(10, "Kuat tekan beton minimal 10 MPa")

  })    .max(80, "Kuat tekan beton maksimal 80 MPa"),

    .min(0.1, 'Rasio Poisson minimal 0.1')  

    .max(0.5, 'Rasio Poisson maksimal 0.5')  fy: positiveNumber('Kuat leleh baja (fy)')

});    .min(200, 'Kuat leleh baja minimal 200 MPa')

    .max(800, 'Kuat leleh baja maksimal 800 MPa'),

export type MaterialsData = z.infer<typeof materialsSchema>;  

  elasticModulus: positiveNumber('Modulus elastisitas')

// Loads Schema    .min(15000, 'Modulus elastisitas minimal 15000 MPa')

export const loadsSchema = z.object({    .max(50000, 'Modulus elastisitas maksimal 50000 MPa')

  deadLoad: nonNegativeNumber('Beban mati')    .optional(),

    .max(50, 'Beban mati maksimal 50 kN/m²'),  

    poissonRatio: z.number({

  liveLoad: positiveNumber('Beban hidup')    required_error: 'Rasio Poisson wajib diisi',

    .max(20, 'Beban hidup maksimal 20 kN/m²')    invalid_type_error: 'Rasio Poisson harus berupa angka'

});  })

    .min(0.1, 'Rasio Poisson minimal 0.1')

export type LoadsData = z.infer<typeof loadsSchema>;    .max(0.5, 'Rasio Poisson maksimal 0.5')

    .optional()

// Load Case Schema    .default(0.2),

export const loadCaseSchema = z.object({  

  id: z.string().min(1, 'ID kasus beban wajib diisi'),  density: positiveNumber('Densitas material')

  name: z.string().min(1, 'Nama kasus beban wajib diisi'),    .min(1000, 'Densitas minimal 1000 kg/m³')

  description: z.string().optional(),    .max(10000, 'Densitas maksimal 10000 kg/m³')

      .optional()

  type: z.enum(['dead', 'live', 'wind', 'seismic', 'point', 'distributed']),    .default(2400)

  });

  magnitude: z.number({

    message: 'Besar beban wajib diisi'// Section Schema

  }).finite('Besar beban harus berupa angka yang valid'),export const sectionPropertiesSchema = z.object({

    width: positiveNumber('Lebar penampang')

  direction: z.enum(['x', 'y', 'z', 'all']),    .min(0.1, 'Lebar penampang minimal 0.1 meter')

      .max(3, 'Lebar penampang maksimal 3 meter'),

  nodeIds: z.array(z.union([z.string(), z.number()])).optional(),  

  elementIds: z.array(z.union([z.string(), z.number()])).optional()  height: positiveNumber('Tinggi penampang')

});    .min(0.1, 'Tinggi penampang minimal 0.1 meter')

    .max(3, 'Tinggi penampang maksimal 3 meter'),

export type LoadCaseData = z.infer<typeof loadCaseSchema>;  

  area: positiveNumber('Luas penampang')

// Seismic Parameters Schema      .min(0.01, 'Luas penampang minimal 0.01 m²')

export const seismicParametersSchema = z.object({    .max(9, 'Luas penampang maksimal 9 m²')

  latitude: coordinateNumber('Lintang')    .optional(),

    .min(-11, 'Lintang minimal -11°')  

    .max(6, 'Lintang maksimal 6°'),  momentOfInertiaX: positiveNumber('Momen inersia X')

        .min(0.0001, 'Momen inersia X minimal 0.0001 m⁴')

  longitude: coordinateNumber('Bujur')    .max(10, 'Momen inersia X maksimal 10 m⁴')

    .min(95, 'Bujur minimal 95°')      .optional(),

    .max(141, 'Bujur maksimal 141°'),  

    momentOfInertiaY: positiveNumber('Momen inersia Y')

  ss: nonNegativeNumber('Parameter percepatan spektral SS')    .min(0.0001, 'Momen inersia Y minimal 0.0001 m⁴')

    .max(2.5, 'SS maksimal 2.5g'),    .max(10, 'Momen inersia Y maksimal 10 m⁴')

        .optional(),

  s1: nonNegativeNumber('Parameter percepatan spektral S1')   

    .max(1.5, 'S1 maksimal 1.5g'),  torsionalConstant: nonNegativeNumber('Konstanta torsi')

        .max(10, 'Konstanta torsi maksimal 10 m⁴')

  designCategory: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),    .optional()

  siteClass: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),}).refine((data) => {

    // Auto-calculate area if not provided

  fa: positiveNumber('Faktor amplifikasi Fa')  if (!data.area) {

    .min(0.8, 'Fa minimal 0.8')    data.area = data.width * data.height;

    .max(2.5, 'Fa maksimal 2.5'),  }

      return data.area === data.width * data.height;

  fv: positiveNumber('Faktor amplifikasi Fv')}, {

    .min(0.8, 'Fv minimal 0.8')   message: 'Luas penampang harus sesuai dengan lebar × tinggi',

    .max(3.5, 'Fv maksimal 3.5'),  path: ['area']

    });

  importanceFactor: z.number({

    message: 'Faktor keutamaan wajib diisi'// Load Schema

  })export const loadSchema = z.object({

    .min(1.0, 'Faktor keutamaan minimal 1.0')  type: z.enum(['dead', 'live', 'wind', 'seismic', 'point', 'distributed'], {

    .max(1.5, 'Faktor keutamaan maksimal 1.5'),    required_error: 'Jenis beban wajib dipilih',

        invalid_type_error: 'Jenis beban tidak valid'

  responseModifier: positiveNumber('Faktor modifikasi respons (R)')  }),

    .min(1, 'R minimal 1')  

    .max(8, 'R maksimal 8')  magnitude: z.number({

});    required_error: 'Besar beban wajib diisi',

    invalid_type_error: 'Besar beban harus berupa angka'

export type SeismicParametersData = z.infer<typeof seismicParametersSchema>;  })

    .min(-1000000, 'Besar beban minimal -1000000 N')

// Analysis Options Schema    .max(1000000, 'Besar beban maksimal 1000000 N')

export const analysisOptionsSchema = z.object({    .finite('Besar beban harus berupa angka yang valid'),

  maxIterations: z.number({  

    message: 'Maksimum iterasi wajib diisi'  direction: z.enum(['x', 'y', 'z', 'all'], {

  })    required_error: 'Arah beban wajib dipilih',

    .int('Maksimum iterasi harus bilangan bulat')    invalid_type_error: 'Arah beban tidak valid'

    .min(100, 'Maksimum iterasi minimal 100')  }).optional().default('z'),

    .max(10000, 'Maksimum iterasi maksimal 10,000'),  

      nodeId: z.union([z.string(), z.number()], {

  tolerance: positiveNumber('Toleransi konvergensi')    required_error: 'ID node wajib diisi'

    .min(1e-8, 'Toleransi minimal 1e-8')  }).optional(),

    .max(1e-3, 'Toleransi maksimal 1e-3'),  

      elementId: z.union([z.string(), z.number()], {

  analysisType: z.enum(['static', 'modal', 'response-spectrum', 'time-history']),    required_error: 'ID elemen wajib diisi'

    }).optional(),

  numberOfModes: z.number({  

    message: 'Jumlah mode wajib diisi'  description: z.string().optional()

  })}).refine((data) => {

    .int('Jumlah mode harus bilangan bulat')  // Ensure either nodeId or elementId is provided for point loads

    .min(3, 'Minimal 3 mode')  if (data.type === 'point') {

    .max(50, 'Maksimal 50 mode'),    return data.nodeId !== undefined || data.elementId !== undefined;

      }

  dampingRatio: percentageNumber('Rasio redaman')  return true;

    .max(10, 'Rasio redaman maksimal 10%')}, {

});  message: 'Beban titik harus memiliki nodeId atau elementId',

  path: ['nodeId']

export type AnalysisOptionsData = z.infer<typeof analysisOptionsSchema>;});



// Complete Structure Schema - simplified for now// Node Schema

export const structureSchema = z.object({export const nodeSchema = z.object({

  projectInfo: z.object({  id: z.union([z.string(), z.number()], {

    name: z.string().min(1, 'Nama proyek wajib diisi'),    required_error: 'ID node wajib diisi'

    description: z.string().optional(),  }),

    engineer: z.string().min(1, 'Nama engineer wajib diisi'),  

    date: z.date().default(() => new Date())  x: coordinateNumber('Koordinat X'),

  }),  y: coordinateNumber('Koordinat Y'),

    z: coordinateNumber('Koordinat Z'),

  geometry: geometrySchema,  

  materials: materialsSchema,  type: z.enum(['free', 'fixed', 'pinned', 'roller'], {

  loads: loadsSchema,    invalid_type_error: 'Jenis tumpuan tidak valid'

  seismicParameters: seismicParametersSchema,  }).optional().default('free'),

  analysisOptions: analysisOptionsSchema  

});  supports: z.object({

    dx: z.boolean().optional().default(false),

export type StructureData = z.infer<typeof structureSchema>;    dy: z.boolean().optional().default(false),

    dz: z.boolean().optional().default(false),

// Error handling utilities    rx: z.boolean().optional().default(false),

export const handleValidationError = (error: z.ZodError) => {    ry: z.boolean().optional().default(false),

  try {    rz: z.boolean().optional().default(false)

    return {  }).optional()

      success: false,});

      errors: error.issues.map(err => ({

        path: err.path.join('.'),// Element Schema

        message: err.message,export const elementSchema = z.object({

        code: err.code  id: z.union([z.string(), z.number()], {

      }))    required_error: 'ID elemen wajib diisi'

    };  }),

  } catch (e) {  

    return {  type: z.enum(['beam', 'column', 'brace', 'slab', 'wall', 'truss'], {

      success: false,    required_error: 'Jenis elemen wajib dipilih',

      errors: [{ path: '', message: 'Validation error occurred', code: 'unknown' }]    invalid_type_error: 'Jenis elemen tidak valid'

    };  }),

  }  

};  startNode: z.union([z.string(), z.number()], {

    required_error: 'Node awal wajib diisi'

// Generic validation function  }),

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {  

  try {  endNode: z.union([z.string(), z.number()], {

    const result = schema.safeParse(data);    required_error: 'Node akhir wajib diisi'

      }),

    if (result.success) {  

      return { success: true, data: result.data };  material: z.union([

    } else {    z.string().min(1, 'Nama material wajib diisi'),

      return {    materialPropertiesSchema

        success: false,  ]),

        errors: result.error.issues.map(err => ({  

          path: err.path.join('.'),  section: z.union([

          message: err.message,    z.string().min(1, 'Nama penampang wajib diisi'),

          code: err.code    sectionPropertiesSchema

        }))  ])

      };}).refine((data) => {

    }  // Ensure startNode and endNode are different

  } catch (error) {  return data.startNode !== data.endNode;

    return {}, {

      success: false,  message: 'Node awal dan node akhir harus berbeda',

      errors: [{ path: '', message: 'Unexpected validation error', code: 'unknown' }]  path: ['endNode']

    };});

  }

};// Structure Schema

export const structureSchema = z.object({

// Validation presets for common use cases  nodes: z.array(nodeSchema)

export const validateStructuralInput = (data: unknown) =>     .min(1, 'Minimal harus ada 1 node')

  validateData(structureSchema, data);    .max(10000, 'Maksimal 10000 node'),

  

export const validateGeometry = (data: unknown) =>   elements: z.array(elementSchema)

  validateData(geometrySchema, data);    .min(0, 'Jumlah elemen tidak boleh negatif')

    .max(50000, 'Maksimal 50000 elemen'),

export const validateMaterials = (data: unknown) =>   

  validateData(materialsSchema, data);  loads: z.array(loadSchema)

    .optional()

export const validateLoads = (data: unknown) =>     .default([])

  validateData(loadsSchema, data);}).refine((data) => {

  // Check for duplicate node IDs

export const validateSeismicParameters = (data: unknown) =>   const nodeIds = data.nodes.map(n => n.id.toString());

  validateData(seismicParametersSchema, data);  const uniqueNodeIds = new Set(nodeIds);
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