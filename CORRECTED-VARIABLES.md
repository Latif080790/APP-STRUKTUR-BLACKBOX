# 🎯 CORRECTED INDEPENDENT VARIABLES - SNI COMPLIANCE

**⚠️ CRITICAL UPDATE: Variabel bebas sistem telah diperbaiki sesuai standar teknik Indonesia (SNI) dan internasional. Implementasi parameter ini WAJIB untuk memastikan keselamatan struktural.**

---

## 📊 **VARIABEL BEBAS YANG DIPERBAIKI**

### 1️⃣ **PROJECT INFORMATION** *(Tidak berubah)*
```typescript
interface ProjectInfo {
  name: string;           // Project name
  location: string;       // Geographic location
  description: string;    // Project description  
  engineer: string;       // Licensed engineer name
  date: Date;            // Analysis date
  riskCategory: 'I' | 'II' | 'III' | 'IV'; // Building risk category
}
```

### 2️⃣ **GEOMETRY PARAMETERS** *(Validation ditambah)*
```typescript
interface GeometryParameters {
  // BASIC DIMENSIONS
  length: number;         // 5-200m (validated range)
  width: number;          // 5-200m (validated range)
  numberOfFloors: number; // 1-50 floors (height restrictions apply)
  heightPerFloor: number; // 2.5-6.0m (per SNI 1727:2020)
  
  // STRUCTURAL GRID
  baySpacingX: number;    // 3.0-15.0m (typical 4-8m)
  baySpacingY: number;    // 3.0-15.0m (typical 4-8m)
  
  // VALIDATION RULES
  aspectRatio: number;    // L/W ≤ 5:1 (irregularity check)
  slenderness: number;    // H/B ≤ 4:1 (stability check)
}
```

### 3️⃣ **MATERIAL PROPERTIES** *(MAJOR REVISION)*

#### A. CONCRETE SPECIFICATIONS
```typescript
interface ConcreteProperties {
  // STRENGTH (Per SNI 2847:2019)
  fc: 17 | 20 | 25 | 30 | 35 | 40 | 45 | 50; // MPa (discrete values only)
  
  // DERIVED PROPERTIES (Auto-calculated)
  Ec: number;             // = 4700√(fc') MPa
  density: 2200 | 2400;   // kg/m³ (normal weight)
  poissonRatio: 0.2;      // Standard value
  
  // COVER REQUIREMENTS (Per exposure)
  cover: {
    interior: 20;         // mm (minimum)
    exterior: 30;         // mm (minimum)
    ground: 50;           // mm (minimum)
    marine: 65;           // mm (minimum)
  };
}

interface ReinforcementSteel {
  // GRADES (Per SNI 2052:2017) - EXACT VALUES
  grade: 'BjTP-24' | 'BjTS-40' | 'BjTS-50';
  
  fy: 240 | 400 | 500;    // MPa (corresponding to grade)
  fu: 370 | 560 | 650;    // MPa (corresponding to grade)
  Es: 200000;             // MPa (constant)
  
  // SIZE AVAILABILITY
  diameterAvailable: [6, 8, 10, 12, 16, 19, 22, 25, 28, 32, 36]; // mm
}
```

#### B. STRUCTURAL STEEL
```typescript
interface StructuralSteel {
  // GRADES (Per SNI 1729:2020) - EXACT VALUES
  grade: 'BJ-34' | 'BJ-37' | 'BJ-41' | 'BJ-50' | 'A572-Gr50';
  
  fy: 210 | 240 | 250 | 290 | 345; // MPa (grade-specific)
  fu: 340 | 370 | 410 | 500 | 450; // MPa (grade-specific)
  E: 200000;              // MPa (constant)
  density: 7850;          // kg/m³ (constant)
}
```

### 4️⃣ **SEISMIC PARAMETERS** *(COMPLETE REVISION)*

```typescript
interface SeismicParameters {
  // SITE LOCATION (Replaces old zone system)
  latitude: number;       // Decimal degrees
  longitude: number;      // Decimal degrees
  
  // MCE PARAMETERS (From peta hazard)
  Ss: number;            // 0.4-1.5g (site-specific)
  S1: number;            // 0.1-0.6g (site-specific)
  PGA: number;           // 0.1-0.8g (site-specific)
  
  // SITE CLASSIFICATION (Per SNI 1726:2019)
  siteClass: 'SA' | 'SB' | 'SC' | 'SD' | 'SE' | 'SF';
  
  // SITE COEFFICIENTS (Auto-calculated based on Ss, S1, Site Class)
  Fa: number;            // Site coefficient for short periods
  Fv: number;            // Site coefficient for 1-sec period
  
  // DESIGN PARAMETERS (Auto-calculated)
  SDS: number;           // = (2/3) × Fa × Ss
  SD1: number;           // = (2/3) × Fv × S1
  
  // SEISMIC DESIGN CATEGORY (Auto-determined)
  SDC: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  
  // STRUCTURAL SYSTEM SELECTION
  structuralSystem: {
    type: 'SRPMK' | 'SRPMM' | 'SRPMB' | 'SRBK' | 'SPBK' | 'SPBM';
    R: 3.0 | 4.5 | 5.0 | 5.5 | 8.0;  // Response modification
    Cd: 2.5 | 4.0 | 4.5 | 5.0 | 5.5; // Deflection amplification
    Omega0: 2.5 | 3.0;               // Overstrength factor
  };
  
  // IMPORTANCE FACTOR
  Ie: 1.0 | 1.25 | 1.5;   // Based on risk category
}
```

### 5️⃣ **LOAD PARAMETERS** *(MAJOR EXPANSION)*

#### A. DEAD LOADS
```typescript
interface DeadLoads {
  // STRUCTURAL WEIGHTS (Auto-calculated from materials)
  structural: {
    concrete: 24.0;       // kN/m³
    steel: 78.5;          // kN/m³
    masonry: 14.0 | 22.0; // kN/m³ (hollow | solid)
  };
  
  // ARCHITECTURAL LOADS (User selectable)
  floorFinishes: {
    type: 'ceramic' | 'terrazzo' | 'marble' | 'hardwood' | 'carpet';
    load: 0.02 | 0.44 | 0.67 | 0.78 | 0.16 | 0.05; // kN/m²
  };
  
  ceiling: {
    type: 'suspended_acoustic' | 'gypsum' | 'plaster';
    load: 0.10 | 0.10 | 0.34; // kN/m²
  };
  
  partitions: {
    type: 'drywall_10cm' | 'masonry_10cm' | 'masonry_15cm' | 'glazed';
    load: 0.48 | 1.90 | 2.80 | 0.38; // kN/m²
  };
  
  // MEP SYSTEMS
  mep: {
    hvac: number;         // 0.15-0.25 kN/m²
    electrical: number;   // 0.05-0.10 kN/m²
    plumbing: number;     // 0.05-0.15 kN/m²
    fireProtection: number; // 0.05-0.10 kN/m²
  };
}
```

#### B. LIVE LOADS (Per SNI 1727:2020)
```typescript
interface LiveLoads {
  // OCCUPANCY-BASED (Exact values from SNI 1727:2020)
  occupancyType: 'residential' | 'office' | 'educational' | 'commercial' | 'industrial';
  
  floorLiveLoad: {
    'residential': 1.9;      // kN/m²
    'office': 2.4;           // kN/m²
    'educational': 2.9;      // kN/m²
    'commercial': 4.8;       // kN/m²
    'industrial': 6.0 | 12.0; // kN/m² (light | heavy)
  };
  
  roofLiveLoad: {
    slope_0_4deg: 1.0;       // kN/m²
    slope_4_20deg: number;   // Linear interpolation
    slope_over_20deg: 0.6;   // kN/m²
  };
  
  // REDUCTION FACTORS (Per code)
  reductionFactor: {
    tributaryArea: number;   // m²
    R1: number;             // = 1.0 - 0.001×At (≥ 0.6)
    R2: number;             // = 1.2 - 0.05×F
  };
}
```

#### C. WIND LOADS (Per SNI 1727:2020)
```typescript
interface WindLoads {
  // BASIC PARAMETERS
  basicWindSpeed: number;   // 25-50 m/s (region-specific)
  
  exposureCategory: 'A' | 'B' | 'C' | 'D';
  importanceFactor: 0.87 | 1.00 | 1.15; // Based on risk category
  
  // TOPOGRAPHIC EFFECTS
  topographicFactor: number; // Kzt = 1.0-1.3
  
  // DIRECTIONAL FACTOR
  directionalityFactor: 0.85; // Kd (all buildings)
  
  // CALCULATED VALUES
  designWindPressure: number; // qz = 0.613 × Kz × Kzt × Kd × V² × I
}
```

### 6️⃣ **FOUNDATION PARAMETERS** *(COMPLETE OVERHAUL)*

```typescript
interface FoundationParameters {
  // SOIL INVESTIGATION DATA (Required)
  soilData: {
    sptValues: number[];     // N-SPT at each depth
    depths: number[];        // Corresponding depths (m)
    
    // SOIL CLASSIFICATION
    undrainedShearStrength: number; // Su (kPa) for clay
    frictionAngle: number;   // φ (degrees) for sand
    unitWeight: number;      // γ (kN/m³)
    
    // GROUNDWATER
    gwDepth: number;         // Groundwater depth (m)
  };
  
  // FOUNDATION TYPE SELECTION (Auto-recommended)
  foundationType: {
    recommended: 'shallow' | 'bored_pile' | 'driven_pile' | 'micro_pile';
    
    // SELECTION CRITERIA (Auto-calculated)
    criteria: {
      avgSPT: number;        // Average N-SPT in bearing zone
      bearingCapacity: number; // Calculated qa (kPa)
      settlementEstimate: number; // mm
      liquefactionRisk: boolean;
    };
  };
  
  // PILE SPECIFICATIONS (If applicable)
  pileDesign: {
    // STANDARD SIZES ONLY
    diameter: 30 | 40 | 50 | 60 | 80 | 100 | 120; // cm (bored)
    squareSize: 25 | 30 | 35 | 40; // cm (driven precast)
    
    length: number;          // 8-50m (calculated from SPT)
    
    // CAPACITY CALCULATIONS
    ultimateCapacity: number; // Qu = Qp + Qs (kN)
    allowableCapacity: number; // Qa = Qu/FS (kN)
    safetyFactor: 2.0 | 2.5 | 3.0; // Based on reliability
  };
  
  // PILE CAP DESIGN
  pileCap: {
    thickness: number;       // 0.6-2.0m (span/8 minimum)
    reinforcement: {
      topSteel: number;      // mm²/m
      bottomSteel: number;   // mm²/m
      shearReinforcement: boolean;
    };
  };
}
```

### 7️⃣ **ANALYSIS PARAMETERS** *(Enhanced)*

```typescript
interface AnalysisParameters {
  // ANALYSIS TYPE
  analysisType: 'static' | 'modal' | 'response_spectrum' | 'time_history';
  
  // LOAD COMBINATIONS (Per SNI 1727:2020)
  loadCombinations: {
    'LC1': '1.4D';
    'LC2': '1.2D + 1.6L + 0.5(Lr or S)';
    'LC3': '1.2D + 1.6(Lr or S) + 0.5L';
    'LC4': '1.2D ± 1.0E + 0.5L';
    'LC5': '0.9D ± 1.0E';
    'LC6': '1.2D + 1.0W + 0.5L';
    'LC7': '0.9D + 1.0W';
  };
  
  // DYNAMIC ANALYSIS PARAMETERS
  modalAnalysis: {
    numberOfModes: number;   // 6-50 (minimum 90% mass participation)
    dampingRatio: 0.02 | 0.03 | 0.05 | 0.07; // 2%, 3%, 5%, 7%
  };
  
  // CONVERGENCE CRITERIA
  convergence: {
    displacement: 1e-4;      // Relative tolerance
    force: 1e-4;            // Relative tolerance
    maxIterations: 1000;     // Maximum iterations
  };
}
```

### 8️⃣ **SAFETY FACTORS** *(Per SNI 2847:2019)*

```typescript
interface SafetyFactors {
  // STRENGTH REDUCTION FACTORS (φ) - EXACT VALUES
  flexure: {
    tensionControlled: 0.90;     // εt ≥ 0.005
    compressionControlled: 0.65; // εt ≤ 0.002
    transition: number;          // 0.65 + (εt-0.002)×833/3 ≤ 0.90
  };
  
  compression: {
    spiralReinforced: 0.75;
    tiedReinforced: 0.65;
  };
  
  shear: {
    normalWeight: 0.75;
    lightweightAllSand: 0.70;
    lightweightAll: 0.65;
  };
  
  bearing: 0.65;
  torsion: 0.75;
  
  // LOAD FACTORS (From load combinations above)
  loadFactors: {
    deadLoad: 1.2 | 1.4 | 0.9;
    liveLoad: 1.6 | 0.5;
    earthquake: 1.0;
    wind: 1.0;
  };
}
```

### 9️⃣ **DESIGN LIMITS** *(Code-mandated)*

```typescript
interface DesignLimits {
  // DEFLECTION LIMITS
  deflection: {
    liveLoad: {
      floors: 'L/360';       // Immediate deflection
      roofs: 'L/240';        // Immediate deflection
    };
    totalLoad: {
      floors: 'L/240';       // Long-term deflection
      roofs: 'L/180';        // Long-term deflection
    };
  };
  
  // DRIFT LIMITS (Per SNI 1726:2019)
  storyDrift: {
    riskCategoryI: 'H/400';    // 0.25% drift ratio
    riskCategoryII: 'H/400';   // 0.25% drift ratio
    riskCategoryIII: 'H/400';  // 0.25% drift ratio  
    riskCategoryIV: 'H/600';   // 0.17% drift ratio
  };
  
  // REINFORCEMENT LIMITS
  reinforcement: {
    minimum: {
      flexural: 0.0018;      // ρmin = 1.4/fy
      temperature: 0.0018;    // Temperature reinforcement
      shear: 0.0025;         // Minimum shear reinforcement
    };
    maximum: {
      flexural: 0.025;       // ρmax (typical)
      compression: 0.08;      // Gross area basis
    };
  };
  
  // SPACING LIMITS
  spacing: {
    maximumStirrup: 'd/2';    // Shear reinforcement
    maximumTie: '16db';       // Longitudinal bar spacing
    minimumClear: 'db | 25mm'; // Clear spacing between bars
  };
}
```

### 🔟 **QUALITY CONTROL PARAMETERS** *(New addition)*

```typescript
interface QualityControl {
  // CONCRETE QUALITY
  concrete: {
    testingFrequency: {
      compressive: '2 specimens per 100m³';
      slump: 'Each truck load';
      airContent: 'Each day of placement';
    };
    
    acceptanceCriteria: {
      individualTest: 'fc - 3.5 MPa';
      averageOfThree: 'fc + 0.8 MPa';
      averageOfTwo: 'fc + 2.3 MPa';
    };
  };
  
  // REINFORCEMENT QUALITY
  reinforcement: {
    millCertification: boolean;
    tensileTest: 'Random sampling per lot';
    bendTest: 'Ductility verification';
  };
  
  // CONSTRUCTION TOLERANCES
  tolerances: {
    columnLocation: '±13mm';
    beamLocation: '±13mm';
    elevation: '±13mm';
    plumbness: 'H/500';
  };
}
```

---

## 🚨 **CRITICAL CHANGES IMPLEMENTED**

### ✅ **1. SEISMIC SYSTEM OVERHAUL**
- **REMOVED:** Invalid "Zone 1-6" system
- **ADDED:** Site-specific Ss, S1, SDS, SD1 parameters
- **ADDED:** Proper site coefficients Fa, Fv
- **ADDED:** Structural system R, Cd, Ω0 values

### ✅ **2. MATERIAL PROPERTIES CORRECTION**
- **CORRECTED:** Discrete concrete strength values only
- **CORRECTED:** Exact steel grade specifications
- **ADDED:** Auto-calculated derived properties
- **ADDED:** Cover requirements per exposure

### ✅ **3. LOAD SYSTEM EXPANSION**
- **ADDED:** Complete dead load component library
- **ADDED:** Occupancy-specific live loads
- **ADDED:** Proper load reduction factors
- **ADDED:** Wind load calculation framework

### ✅ **4. FOUNDATION LOGIC UPGRADE**
- **REPLACED:** Simplified soil conditions
- **ADDED:** SPT-based selection criteria
- **ADDED:** Standard pile size limitations
- **ADDED:** Bearing capacity calculations

### ✅ **5. SAFETY FACTOR CORRECTION**
- **CORRECTED:** Exact φ values per SNI 2847:2019
- **ADDED:** Load combination specifications
- **ADDED:** Design limit requirements
- **ADDED:** Quality control parameters

---

## ⚖️ **VALIDATION RULES** *(NEW)*

```typescript
interface ValidationRules {
  // INPUT VALIDATION
  geometryChecks: {
    aspectRatio: 'L/W ≤ 5:1 (irregularity warning)';
    slenderness: 'H/W ≤ 4:1 (stability check)';
    minDimensions: 'L,W ≥ 3m (practical minimum)';
  };
  
  // SEISMIC VALIDATION  
  seismicChecks: {
    siteParameters: 'Ss, S1 from official maps only';
    systemCompatibility: 'R factor must match SDC';
    irregularityCheck: 'Plan and vertical irregularity';
  };
  
  // FOUNDATION VALIDATION
  foundationChecks: {
    sptRequirement: 'Minimum 3 SPT per foundation';
    capacityCheck: 'Factor of safety ≥ 2.0';
    settlementLimit: 'Total < 25mm, Differential < 20mm';
  };
  
  // PROFESSIONAL OVERSIGHT
  engineeringChecks: {
    licensedEngineer: boolean;      // PE stamp required
    peerReview: boolean;            // Third-party review
    codeCompliance: boolean;        // Official code check
  };
}
```

---

## 📈 **TOTAL CORRECTED VARIABLES: 150+ Parameters**

### **CRITICALITY CLASSIFICATION:**

**🔴 CRITICAL (No tolerance for error):**
- Seismic parameters (Ss, S1, SDS, SD1)
- Material strengths (fc', fy, fu)  
- Safety factors (φ values)
- Load factors and combinations
- Foundation bearing capacity

**🟡 IMPORTANT (Controlled tolerance):**
- Geometry within code limits
- Load magnitudes per occupancy
- Analysis parameters
- Quality control limits

**🟢 CONFIGURABLE (Engineering judgment):**
- Construction tolerances
- Quality assurance levels
- Documentation requirements

---

## 🎯 **IMPLEMENTATION REQUIREMENTS**

### **IMMEDIATE (Critical):**
1. Update seismic parameter input system
2. Correct material property ranges  
3. Implement proper safety factors
4. Add foundation selection logic
5. Create validation rule engine

### **Short-term (Important):**
1. Expand load classification system
2. Add quality control parameters
3. Implement code compliance checking
4. Create professional oversight tracking

### **Long-term (Enhancement):**
1. Regional code variations
2. Advanced analysis options
3. AI-powered optimization
4. Integration with official databases

---

**⚠️ ENGINEERING RESPONSIBILITY:**
These corrected variables ensure compliance with current Indonesian and international standards. Any deviation from these parameters requires explicit professional engineering justification and may compromise structural safety.

*This correction addresses all identified deficiencies and establishes a foundation for safe, code-compliant structural analysis.*