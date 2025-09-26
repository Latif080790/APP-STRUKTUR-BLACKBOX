/**
 * PROFESSIONAL SYSTEM TEST DATA
 * Two comprehensive test scenarios for validation system testing
 * 
 * TEST CASE 1: CORRECT DATA (Should pass all validations)
 * TEST CASE 2: INCORRECT DATA (Should trigger validation errors)
 */

export const CORRECT_TEST_DATA = {
  projectInfo: {
    projectName: "Gedung Office Modern Jakarta",
    projectNumber: "PROJ-2025-CORRECT",
    location: "Jakarta, Indonesia",
    engineer: "Ir. Ahmad Structural, M.T.",
    licenseNumber: "LPJK-STR-12345-2025",
    reviewedBy: "Ir. Budi Review, M.T.",
    approvedBy: "Ir. Candra Approved, M.T.",
    date: "2025-09-27",
    revision: 1
  },
  geometry: {
    length: 25,           // Realistic office building dimension
    width: 20,            // Good aspect ratio
    height: 12,           // 3 floors @ 4m each
    numberOfFloors: 3,
    baySpacingX: 6,       // Standard bay spacing
    baySpacingY: 5,       // Standard bay spacing
    foundationDepth: 2,   // Adequate foundation depth
    soilBearingCapacity: 200  // Good soil bearing capacity
  },
  materials: {
    concrete: {
      fc: 25,             // Standard concrete strength
      fcTest: 28.5,       // Test results higher than design
      density: 2400,      // Normal weight concrete
      poissonRatio: 0.18, // Standard value
      thermalExpansion: 0.00001,
      aggregateType: 'normal' as const,
      testCertificate: "LAB-CERT-CON-2025-001"
    },
    steel: {
      fy: 400,            // BjTS-40 standard
      fu: 550,            // Good fu/fy ratio = 1.375
      fyTest: 425,        // Test results higher than design
      fuTest: 580,        // Good test results
      elasticModulus: 200000,
      density: 7850,
      grade: 'BjTS-40' as const,
      testCertificate: "LAB-CERT-STEEL-2025-001"
    }
  },
  loads: {
    deadLoad: {
      structuralWeight: 6.5,    // Realistic structural weight
      additionalDeadLoad: 2.0,  // Finishes, MEP
      partitionLoad: 1.0        // Movable partitions
    },
    liveLoad: {
      occupancyLoad: 4.0,       // Office building per SNI 1727
      occupancyType: 'office' as const,
      reductionFactor: 0.8,
      concentratedLoads: []
    },
    windLoad: {
      basicWindSpeed: 35,       // Jakarta wind speed
      exposureCategory: 'B' as const,
      topographicFactor: 1.0,
      directionality: 0.85,
      windImportanceFactor: 1.0
    },
    seismicLoad: {
      ss: 0.8,                  // Jakarta seismic zone
      s1: 0.35,                 // Jakarta seismic parameters
      siteClass: 'SC' as const, // Medium soil
      importanceFactor: 1.0,    // Standard building
      responseModificationFactor: 8,  // Concrete moment frame
      overstrengthFactor: 3,
      deflectionAmplificationFactor: 5.5
    },
    specialLoads: {
      earthquakeLoad: true,
      tsunamiLoad: false,
      blastLoad: false,
      thermalLoad: false,
      settlementLoad: false
    }
  },
  analysisParameters: {
    analysisType: 'linear' as const,
    loadCombinations: [
      '1.2D + 1.6L',
      '1.2D + 1.0L + 1.0W',
      '1.2D + 1.0L + 1.0E',
      '0.9D + 1.0W',
      '0.9D + 1.0E'
    ],
    safetyFactors: {
      dead: 1.2,
      live: 1.6,
      wind: 1.0,
      seismic: 1.0
    },
    serviceabilityLimits: {
      deflectionLimit: 250,
      driftLimit: 0.020,
      crackWidth: 0.3
    }
  }
};

export const INCORRECT_TEST_DATA = {
  projectInfo: {
    projectName: "Proyek Berbahaya - Test Error",
    projectNumber: "PROJ-2025-WRONG",
    location: "Area Seismik Tinggi",
    engineer: "",                    // ❌ CRITICAL: No engineer assigned
    licenseNumber: "",               // ❌ CRITICAL: No license number
    reviewedBy: "",
    approvedBy: "",
    date: "2025-09-27",
    revision: 1
  },
  geometry: {
    length: 50,                      // Large building
    width: 8,                        // ❌ WARNING: High aspect ratio (6.25)
    height: 45,                      // ❌ WARNING: Very tall building
    numberOfFloors: 15,              // High-rise
    baySpacingX: 15,                 // ❌ CRITICAL: Too large bay spacing
    baySpacingY: 20,                 // ❌ CRITICAL: Extremely large bay spacing
    foundationDepth: 1,              // ❌ WARNING: Shallow foundation
    soilBearingCapacity: 80          // ❌ WARNING: Low soil capacity
  },
  materials: {
    concrete: {
      fc: 12,                        // ❌ CRITICAL: Below minimum 17 MPa
      fcTest: 10,                    // ❌ CRITICAL: Test lower than design
      density: 1800,                 // ❌ WARNING: Low density (lightweight?)
      poissonRatio: 0.35,            // ❌ WARNING: Unusual poisson ratio
      thermalExpansion: 0.00001,
      aggregateType: 'normal' as const,
      testCertificate: ""            // ❌ CRITICAL: No test certificate
    },
    steel: {
      fy: 180,                       // ❌ CRITICAL: Below minimum 240 MPa
      fu: 200,                       // ❌ CRITICAL: fu/fy ratio = 1.11 (too low)
      fyTest: 160,                   // ❌ CRITICAL: Test lower than design
      fuTest: 180,                   // ❌ CRITICAL: Poor test results
      elasticModulus: 200000,
      density: 7850,
      grade: 'BjTS-40' as const,     // ❌ WARNING: Grade inconsistent with fy
      testCertificate: ""            // ❌ CRITICAL: No test certificate
    }
  },
  loads: {
    deadLoad: {
      structuralWeight: 1.5,         // ❌ CRITICAL: Unrealistically low
      additionalDeadLoad: 0.5,       // Too low
      partitionLoad: 0.2             // Too low
    },
    liveLoad: {
      occupancyLoad: 1.5,            // ❌ CRITICAL: Below code minimum for office
      occupancyType: 'office' as const,
      reductionFactor: 0.8,
      concentratedLoads: []
    },
    windLoad: {
      basicWindSpeed: 80,            // ❌ WARNING: Very high wind speed
      exposureCategory: 'D' as const, // Open terrain
      topographicFactor: 1.5,        // Hill effect
      directionality: 0.85,
      windImportanceFactor: 1.5      // High importance
    },
    seismicLoad: {
      ss: 2.8,                       // ❌ CRITICAL: Very high seismic zone
      s1: 1.2,                       // ❌ CRITICAL: Extremely high
      siteClass: 'SF' as const,      // ❌ CRITICAL: Requires site-specific study
      importanceFactor: 1.5,         // Essential facility
      responseModificationFactor: 12, // ❌ WARNING: Too high for concrete
      overstrengthFactor: 2,         // Too low
      deflectionAmplificationFactor: 8 // Too high
    },
    specialLoads: {
      earthquakeLoad: true,
      tsunamiLoad: true,             // ❌ WARNING: Tsunami zone
      blastLoad: true,               // ❌ WARNING: Blast consideration
      thermalLoad: true,
      settlementLoad: true
    }
  },
  analysisParameters: {
    analysisType: 'nonlinear' as const,
    loadCombinations: [
      '1.2D + 1.6L',
      '1.2D + 1.0L + 1.0W',
      '1.2D + 1.0L + 1.0E'
    ],
    safetyFactors: {
      dead: 1.0,                     // ❌ WARNING: Below standard
      live: 1.2,                     // ❌ WARNING: Below standard
      wind: 0.8,                     // ❌ WARNING: Below standard
      seismic: 0.9                   // ❌ WARNING: Below standard
    },
    serviceabilityLimits: {
      deflectionLimit: 100,          // ❌ WARNING: Too flexible
      driftLimit: 0.035,             // ❌ WARNING: Above code limit
      crackWidth: 0.8                // ❌ WARNING: Too wide
    }
  }
};

// Test execution function
export const executeSystemTest = (testData: any, testName: string) => {
  console.log(`\n🧪 EXECUTING TEST: ${testName}`);
  console.log("=".repeat(50));
  
  console.log("📋 Test Data Summary:");
  console.log(`Engineer: ${testData.projectInfo.engineer || 'NOT ASSIGNED'}`);
  console.log(`License: ${testData.projectInfo.licenseNumber || 'NOT PROVIDED'}`);
  console.log(`Concrete fc: ${testData.materials.concrete.fc} MPa`);
  console.log(`Steel fy: ${testData.materials.steel.fy} MPa`);
  console.log(`Bay Spacing: ${testData.geometry.baySpacingX} × ${testData.geometry.baySpacingY} m`);
  console.log(`Seismic: Ss=${testData.loads.seismicLoad.ss}, S1=${testData.loads.seismicLoad.s1}`);
  console.log(`Live Load: ${testData.loads.liveLoad.occupancyLoad} kN/m²`);
  
  console.log(`\n🎯 EXPECTED RESULTS for ${testName}:`);
  if (testName.includes('CORRECT')) {
    console.log("✅ Should pass all validations");
    console.log("✅ Should allow construction to proceed");
    console.log("✅ Should show minimal warnings");
    console.log("✅ Should generate accurate analysis results");
  } else {
    console.log("❌ Should fail multiple critical validations");
    console.log("❌ Should block construction");
    console.log("❌ Should require engineer review");
    console.log("❌ Should show detailed error messages");
  }
  
  return testData;
};

export default { CORRECT_TEST_DATA, INCORRECT_TEST_DATA, executeSystemTest };