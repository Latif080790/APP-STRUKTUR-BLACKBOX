// =====================================
// 🚨 COMPREHENSIVE LOAD LIBRARY 
// Per SNI 1727:2020 - Zero Error Tolerance
// =====================================

// DEAD LOAD COMPONENTS - Exact Values per SNI Standards
export const DEAD_LOAD_COMPONENTS = {
  // Structural Materials - Exact densities
  structural: {
    concrete_normal: 24.0,        // kN/m³ - Normal weight concrete
    concrete_lightweight: 18.0,   // kN/m³ - Lightweight concrete  
    steel_structural: 78.5,       // kN/m³ - Structural steel
    steel_rebar: 78.5,           // kN/m³ - Reinforcement steel
    masonry_hollow: 14.0,        // kN/m³ - Hollow masonry units
    masonry_solid: 22.0,         // kN/m³ - Solid masonry units
    wood_hardwood: 8.0,          // kN/m³ - Hardwood timber
    wood_softwood: 5.0,          // kN/m³ - Softwood timber
  },
  
  // Architectural Finishes - Per SNI 1727:2020 Table 3-1
  finishes: {
    // Floor finishes
    ceramic_tile_20mm: 0.44,     // kN/m² (including mortar bed)
    marble_slab_20mm: 0.54,      // kN/m²
    granite_20mm: 0.56,          // kN/m²
    terrazzo_20mm: 0.67,         // kN/m²
    hardwood_flooring: 0.16,     // kN/m²
    carpet_heavy: 0.05,          // kN/m²
    vinyl_tile: 0.02,            // kN/m²
    
    // Wall finishes
    plaster_cement_20mm: 0.42,   // kN/m²
    plaster_gypsum_15mm: 0.18,   // kN/m²
    ceramic_wall_tile: 0.28,     // kN/m²
    
    // Ceiling finishes  
    suspended_acoustic: 0.10,     // kN/m²
    gypsum_board_12mm: 0.10,     // kN/m²
    plaster_lath: 0.34,          // kN/m²
    mineral_fiber: 0.08,         // kN/m²
  },
  
  // Partition Walls - SNI 1727:2020 Table 3-2
  partitions: {
    drywall_single_10cm: 0.48,   // kN/m²
    drywall_double_15cm: 0.72,   // kN/m²
    masonry_hollow_10cm: 1.90,   // kN/m²
    masonry_hollow_15cm: 2.80,   // kN/m²
    masonry_solid_10cm: 2.20,    // kN/m²
    masonry_solid_15cm: 3.30,    // kN/m²
    glazed_partition: 0.38,      // kN/m²
    movable_partition: 0.72,     // kN/m² (includes frame)
  },
  
  // Roofing Systems - SNI 1727:2020 Table 3-3
  roofing: {
    clay_tile: 0.72,             // kN/m²
    concrete_tile: 0.96,         // kN/m²
    metal_sheeting: 0.12,        // kN/m²
    asphalt_shingle: 0.24,       // kN/m²
    membrane_single: 0.07,       // kN/m²
    gravel_ballast_50mm: 0.96,   // kN/m²
    insulation_rigid_50mm: 0.05, // kN/m²
  },
  
  // MEP Systems - Engineering estimates
  mep: {
    hvac_ductwork: { min: 0.10, max: 0.25 },         // kN/m²
    hvac_equipment: { min: 0.15, max: 0.40 },        // kN/m²
    electrical_conduit: { min: 0.05, max: 0.10 },    // kN/m²
    electrical_panels: { min: 0.10, max: 0.20 },     // kN/m²
    plumbing_pipes: { min: 0.05, max: 0.15 },        // kN/m²
    fire_sprinkler: { min: 0.05, max: 0.15 },        // kN/m²
    lighting_fixtures: { min: 0.10, max: 0.25 },     // kN/m²
  }
} as const;

// LIVE LOADS BY OCCUPANCY - SNI 1727:2020 Table 4-1 EXACT VALUES
export const LIVE_LOADS_BY_OCCUPANCY = {
  // Residential Occupancies  
  residential: {
    // Uniform loads
    apartments: 1.9,              // kN/m²
    hotels_guest_rooms: 1.9,      // kN/m²
    hotels_public_rooms: 4.8,     // kN/m²
    single_family: 1.9,           // kN/m²
    dormitories: 1.9,             // kN/m²
    
    // Concentrated loads
    balconies_exterior: 2.9,      // kN/m²
    decks: 2.9,                   // kN/m²
    
    // Special areas
    corridors_private: 1.9,       // kN/m² (serving <10 people)
    corridors_public: 4.8,        // kN/m² (serving ≥10 people)
    stairs_private: 1.9,          // kN/m²
    stairs_public: 4.8,           // kN/m²
  },
  
  // Educational Facilities
  educational: {
    // Classrooms
    classrooms: 2.9,              // kN/m²
    lecture_halls_fixed: 2.9,     // kN/m²
    lecture_halls_movable: 4.8,   // kN/m²
    
    // Corridors and public areas
    corridors_above_first: 3.8,   // kN/m²
    corridors_first_floor: 4.8,   // kN/m²
    
    // Libraries
    libraries_reading: 2.9,       // kN/m²
    libraries_stack_room: 7.2,    // kN/m² (150 psf)
    libraries_corridors: 4.8,     // kN/m²
    
    // Sports facilities
    gymnasiums_main_floor: 4.8,   // kN/m²
    gymnasiums_balcony: 2.9,      // kN/m²
  },
  
  // Office Buildings
  office: {
    // Office spaces
    office_space: 2.4,            // kN/m²
    reception_areas: 2.4,         // kN/m²
    
    // Corridors above first floor
    corridors: 3.8,               // kN/m²
    
    // File and computer rooms
    file_rooms: 4.8,              // kN/m² (may require higher)
    computer_rooms: 2.4,          // kN/m² (plus equipment load)
    
    // Lobbies
    lobbies_first_floor: 4.8,     // kN/m²
    lobbies_other_floors: 3.8,    // kN/m²
  },
  
  // Commercial and Retail
  commercial: {
    // Retail stores
    retail_first_floor: 4.8,      // kN/m²
    retail_upper_floors: 3.8,     // kN/m²
    
    // Restaurants
    restaurants_dining: 4.8,      // kN/m²
    restaurants_kitchen: 4.8,     // kN/m²
    
    // Entertainment
    theaters_fixed_seats: 2.9,    // kN/m²
    theaters_movable_seats: 4.8,  // kN/m²
    theaters_lobbies: 4.8,        // kN/m²
    theaters_stage: 7.2,          // kN/m²
    
    // Shopping centers
    mall_concourse: 4.8,          // kN/m²
    
    // Parking garages
    passenger_cars: 2.4,          // kN/m²
    trucks_buses: 4.8,            // kN/m² (or actual wheel loads)
  },
  
  // Industrial Facilities
  industrial: {
    // Manufacturing
    light_manufacturing: 6.0,     // kN/m² (typical)
    heavy_manufacturing: 12.0,    // kN/m² (minimum, verify actual)
    
    // Storage
    warehouse_light: 6.0,         // kN/m²
    warehouse_heavy: 12.0,        // kN/m²
    
    // Note: Industrial loads highly variable, require specific analysis
  },
  
  // Institutional
  institutional: {
    // Hospitals
    patient_rooms: 1.9,           // kN/m²
    operating_rooms: 2.9,         // kN/m²
    laboratories: 2.9,            // kN/m²
    corridors_above_first: 3.8,   // kN/m²
    
    // Places of worship
    chapels_fixed_seats: 2.9,     // kN/m²
    chapels_movable_seats: 4.8,   // kN/m²
  },
  
  // Special Occupancies
  special: {
    // Assembly
    assembly_fixed_seats: 2.9,    // kN/m²
    assembly_movable_seats: 4.8,  // kN/m²
    assembly_concentrated: 4.8,   // kN/m²
    
    // Vehicular
    garages_passenger: 2.4,       // kN/m²
    driveways_fire_trucks: 12.0,  // kN/m² (minimum)
    
    // Walkways and platforms
    walkways_public: 4.8,         // kN/m²
    exit_facilities: 4.8,         // kN/m²
  }
} as const;

// ROOF LIVE LOADS - SNI 1727:2020 Table 4-2
export const ROOF_LIVE_LOADS = {
  // Ordinary flat, pitched, and curved roofs
  ordinary_roof: {
    // Tributary area based reduction
    area_0_to_20m2: 0.96,         // kN/m²
    area_20_to_60m2: 0.72,        // kN/m² (interpolated)
    area_over_60m2: 0.58,         // kN/m²
  },
  
  // Special purpose roofs
  special_purpose: {
    roof_gardens: 1.44,           // kN/m² (30 psf)
    assembly_uses: 4.8,           // kN/m² (same as occupancy)
  },
  
  // Minimum requirements
  minimum: {
    primary_members: 0.96,        // kN/m² (20 psf)
    secondary_members: 0.58,      // kN/m² (12 psf)
  }
} as const;

// SNOW LOADS - For regions with snow (reference only)
export const SNOW_LOADS = {
  // Ground snow loads (region specific)
  ground_snow_load: {
    // Indonesia typically no snow, but for completeness
    tropical_regions: 0.0,        // kN/m²
    
    // For reference in cold climates
    light_snow_regions: 0.5,      // kN/m² (example)
    moderate_snow_regions: 1.0,   // kN/m² (example)
    heavy_snow_regions: 2.0,      // kN/m² (example)
  },
  
  // Conversion factors (region and condition specific)
  roof_snow_conversion: 0.7,      // Typical Ce * Ct * I
} as const;

// LOAD REDUCTION FACTORS - SNI 1727:2020 Section 4.3
export const LIVE_LOAD_REDUCTION = {
  // Members supporting tributary areas
  reduction_formula: {
    // R = 0.08(A - 15) ≤ 40% for members
    // R = 0.08(A - 15) ≤ 60% for columns  
    member_max_reduction: 0.40,   // 40%
    column_max_reduction: 0.60,   // 60%
    
    // Minimum reduced load factors
    member_min_factor: 0.50,      // 50% minimum for beams
    column_min_factor: 0.40,      // 40% minimum for columns
  },
  
  // Occupancies eligible for reduction
  eligible_occupancies: [
    'office', 'residential', 'educational', 'commercial'
  ],
  
  // Occupancies NOT eligible for reduction  
  non_eligible_occupancies: [
    'assembly', 'parking_garage', 'one_way_slab'
  ],
  
  // Minimum tributary area for reduction
  min_tributary_area: 15,         // m² (150 ft²)
} as const;

// LOAD COMBINATION UTILITY FUNCTIONS
export const calculateDeadLoad = (
  structuralSystem: 'concrete' | 'steel' | 'composite',
  finishingType: keyof typeof DEAD_LOAD_COMPONENTS.finishes,
  partitionType: keyof typeof DEAD_LOAD_COMPONENTS.partitions,
  roofingType: keyof typeof DEAD_LOAD_COMPONENTS.roofing,
  mepComplexity: 'simple' | 'typical' | 'complex'
): number => {
  
  let totalDeadLoad = 0;
  
  // Add structural self-weight (handled separately)
  
  // Add architectural finishes
  totalDeadLoad += DEAD_LOAD_COMPONENTS.finishes[finishingType];
  totalDeadLoad += DEAD_LOAD_COMPONENTS.partitions[partitionType];
  totalDeadLoad += DEAD_LOAD_COMPONENTS.roofing[roofingType];
  
  // Add MEP loads based on complexity
  const mepFactors = {
    simple: 0.25,    // Minimal MEP systems
    typical: 0.50,   // Standard commercial systems
    complex: 0.75    // Complex systems (hospitals, labs, etc.)
  };
  
  const mepLoad = Object.values(DEAD_LOAD_COMPONENTS.mep)
    .reduce((sum, range) => sum + (range.min + range.max) / 2, 0) * mepFactors[mepComplexity];
  
  totalDeadLoad += mepLoad;
  
  return Math.round(totalDeadLoad * 100) / 100; // Round to 0.01 kN/m²
};

export const getLiveLoad = (
  occupancyType: string,
  specificUse: string,
  tributaryArea?: number
): { uniform: number; concentrated?: number; reduced?: number } => {
  
  // Navigate the occupancy structure
  const occupancy = (LIVE_LOADS_BY_OCCUPANCY as any)[occupancyType];
  if (!occupancy) {
    throw new Error(`Unknown occupancy type: ${occupancyType}`);
  }
  
  const uniformLoad = occupancy[specificUse];
  if (uniformLoad === undefined) {
    throw new Error(`Unknown specific use: ${specificUse} for occupancy: ${occupancyType}`);
  }
  
  const result: { uniform: number; concentrated?: number; reduced?: number } = {
    uniform: uniformLoad
  };
  
  // Calculate live load reduction if applicable
  if (tributaryArea && tributaryArea > LIVE_LOAD_REDUCTION.min_tributary_area) {
    if (LIVE_LOAD_REDUCTION.eligible_occupancies.some(occ => occupancyType.includes(occ))) {
      const reductionPercent = Math.min(
        0.08 * (tributaryArea - 15),
        LIVE_LOAD_REDUCTION.reduction_formula.member_max_reduction * 100
      );
      const reductionFactor = 1 - (reductionPercent / 100);
      const minFactor = LIVE_LOAD_REDUCTION.reduction_formula.member_min_factor;
      
      result.reduced = uniformLoad * Math.max(reductionFactor, minFactor);
      result.reduced = Math.round(result.reduced * 100) / 100;
    }
  }
  
  return result;
};

export const getRoofLiveLoad = (tributaryArea: number): number => {
  if (tributaryArea <= 20) {
    return ROOF_LIVE_LOADS.ordinary_roof.area_0_to_20m2;
  } else if (tributaryArea <= 60) {
    // Linear interpolation
    const factor = (tributaryArea - 20) / 40; // 0 to 1
    return ROOF_LIVE_LOADS.ordinary_roof.area_20_to_60m2 * (1 - factor) + 
           ROOF_LIVE_LOADS.ordinary_roof.area_over_60m2 * factor;
  } else {
    return ROOF_LIVE_LOADS.ordinary_roof.area_over_60m2;
  }
};

// VALIDATION FUNCTIONS
export const validateLoadInputs = (
  occupancyType: string,
  specificUse: string,
  proposedDeadLoad: number,
  proposedLiveLoad: number
): { isValid: boolean; warnings: string[]; errors: string[] } => {
  
  const warnings: string[] = [];
  const errors: string[] = [];
  
  try {
    // Validate occupancy and use
    const occupancy = (LIVE_LOADS_BY_OCCUPANCY as any)[occupancyType];
    if (!occupancy) {
      errors.push(`Occupancy type '${occupancyType}' not found in SNI 1727:2020`);
      return { isValid: false, warnings, errors };
    }
    
    const standardLiveLoad = occupancy[specificUse];
    if (standardLiveLoad === undefined) {
      errors.push(`Specific use '${specificUse}' not found for occupancy '${occupancyType}'`);
      return { isValid: false, warnings, errors };
    }
    
    // Validate live load
    if (proposedLiveLoad < standardLiveLoad) {
      errors.push(`Proposed live load ${proposedLiveLoad} kN/m² is less than SNI minimum ${standardLiveLoad} kN/m²`);
    } else if (proposedLiveLoad > standardLiveLoad * 1.5) {
      warnings.push(`Proposed live load ${proposedLiveLoad} kN/m² is significantly higher than SNI value ${standardLiveLoad} kN/m²`);
    }
    
    // Validate dead load reasonableness
    const minDeadLoad = occupancyType === 'industrial' ? 4.0 : 
                       occupancyType === 'commercial' ? 3.0 : 2.5;
    
    if (proposedDeadLoad < minDeadLoad) {
      warnings.push(`Dead load ${proposedDeadLoad} kN/m² seems low for ${occupancyType} occupancy`);
    }
    
    const maxDeadLoad = occupancyType === 'industrial' ? 15.0 : 
                       occupancyType === 'commercial' ? 8.0 : 6.0;
    
    if (proposedDeadLoad > maxDeadLoad) {
      warnings.push(`Dead load ${proposedDeadLoad} kN/m² seems high for ${occupancyType} occupancy`);
    }
    
  } catch (error) {
    errors.push(`Validation error: ${error}`);
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors
  };
};

// EXPORT ALL CONSTANTS AND FUNCTIONS
export default {
  DEAD_LOAD_COMPONENTS,
  LIVE_LOADS_BY_OCCUPANCY,
  ROOF_LIVE_LOADS,
  SNOW_LOADS,
  LIVE_LOAD_REDUCTION,
  calculateDeadLoad,
  getLiveLoad,
  getRoofLiveLoad,
  validateLoadInputs
};