/**
 * Test Educational Design System
 * Comprehensive testing of the educational design engine functionality
 */

import { EnhancedEducationalDesignEngine } from './EnhancedEducationalDesignEngine';
import type { DesignInput } from './StructuralDesignEngine';

// Test case 1: Valid beam design with good inputs
const validBeamInput: DesignInput = {
  elementType: 'beam',
  geometry: {
    width: 300,
    height: 500,
    length: 6000,
    clearCover: 40
  },
  materials: {
    fc: 30,
    fy: 400
  },
  loads: {
    deadLoad: 15,
    liveLoad: 20
  },
  forces: {
    momentX: 120,
    shearX: 45
  },
  constraints: {
    deflectionLimit: 300,
    crackWidth: 0.3,
    exposureCondition: 'moderate'
  }
};

// Test case 2: Invalid inputs for educational feedback
const invalidInputs: DesignInput = {
  elementType: 'beam',
  geometry: {
    width: 50, // Too small - will trigger error
    height: 1000, // Too tall for width - will trigger warning
    length: 2000, // Short span
    clearCover: 15 // Too small for moderate exposure
  },
  materials: {
    fc: 15, // Too low
    fy: 600 // Too high
  },
  loads: {
    deadLoad: 100, // Very high
    liveLoad: 150 // Very high
  },
  forces: {
    momentX: 500, // High moment
    shearX: 200 // High shear
  },
  constraints: {
    deflectionLimit: 500, // L/500 is strict
    crackWidth: 0.2,
    exposureCondition: 'moderate'
  }
};

// Test case 3: Column design
const columnInput: DesignInput = {
  elementType: 'column',
  geometry: {
    width: 400,
    height: 400,
    clearCover: 40
  },
  materials: {
    fc: 35,
    fy: 400
  },
  loads: {
    deadLoad: 800,
    liveLoad: 600
  },
  forces: {
    momentX: 150,
    shearX: 80,
    axial: 1400
  },
  constraints: {
    exposureCondition: 'mild'
  }
};

console.log("=".repeat(80));
console.log("EDUCATIONAL STRUCTURAL DESIGN ENGINE - COMPREHENSIVE TEST");
console.log("=".repeat(80));

// Test 1: Valid Beam Design
console.log("\n🧪 TEST 1: Valid Beam Design with Educational Feedback");
console.log("-".repeat(60));

try {
  const validEngine = new EnhancedEducationalDesignEngine(validBeamInput);
  
  // Get educational validation first
  console.log("\n📋 INPUT VALIDATION:");
  const validation = validEngine.validateInputEducationally();
  console.log(`✅ Valid: ${validation.isValid}`);
  console.log(`❌ Errors: ${validation.errors.length}`);
  console.log(`⚠️  Warnings: ${validation.warnings.length}`);
  
  validation.errors.forEach((error, index) => {
    console.log(`   Error ${index + 1}: ${error.message}`);
    console.log(`   💡 ${error.reason}`);
  });
  
  validation.warnings.forEach((warning, index) => {
    console.log(`   Warning ${index + 1}: ${warning.message}`);
    console.log(`   💡 ${warning.suggestion}`);
  });
  
  if (validation.isValid) {
    // Perform design with educational feedback
    console.log("\n🏗️  DESIGN RESULTS:");
    const results = validEngine.performEducationalDesign('beam');
    
    console.log(`Design Status: ${results.isValid ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Input Quality: ${results.educationalFeedback.inputQuality.toUpperCase()}`);
    console.log(`Element: ${results.element.dimensions.width}×${results.element.dimensions.height}mm beam`);
    console.log(`Main Steel: ${results.reinforcement.main.count}D${results.reinforcement.main.diameter}`);
    console.log(`Stirrups: D${results.reinforcement.shear.diameter}-${results.reinforcement.shear.spacing}`);
    console.log(`Total Cost: Rp ${results.cost.total.toLocaleString()}`);
    
    console.log("\n📚 LEARNING POINTS:");
    results.educationalFeedback.learningPoints.forEach(point => {
      console.log(`   • ${point}`);
    });
    
    console.log("\n💡 BEST PRACTICES:");
    results.educationalFeedback.bestPractices.slice(0, 3).forEach(practice => {
      console.log(`   • ${practice}`);
    });
  }
  
} catch (error) {
  console.error("❌ Test 1 failed:", error);
}

// Test 2: Invalid Inputs for Educational Feedback
console.log("\n\n🧪 TEST 2: Invalid Inputs - Educational Feedback");
console.log("-".repeat(60));

try {
  const invalidEngine = new EnhancedEducationalDesignEngine(invalidInputs);
  
  console.log("\n📋 INPUT VALIDATION (Invalid Inputs):");
  const invalidValidation = invalidEngine.validateInputEducationally();
  console.log(`✅ Valid: ${invalidValidation.isValid}`);
  console.log(`❌ Errors: ${invalidValidation.errors.length}`);
  console.log(`⚠️  Warnings: ${invalidValidation.warnings.length}`);
  
  console.log("\n🚨 DETAILED ERROR ANALYSIS:");
  invalidValidation.errors.forEach((error, index) => {
    console.log(`\n   Error ${index + 1}: ${error.field}`);
    console.log(`   ❌ ${error.message}`);
    console.log(`   💡 Reason: ${error.reason}`);
    if (error.correctRange) {
      console.log(`   📏 Correct Range: ${error.correctRange}`);
    }
    if (error.example) {
      console.log(`   📋 Example: ${error.example}`);
    }
    if (error.reference) {
      console.log(`   📖 Reference: ${error.reference}`);
    }
  });
  
  console.log("\n⚠️  WARNINGS:");
  invalidValidation.warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning.message}`);
    console.log(`      💡 ${warning.suggestion}`);
  });
  
  console.log("\n🎓 EDUCATIONAL RECOMMENDATIONS:");
  const recommendations = invalidEngine.getEducationalRecommendations();
  recommendations.slice(0, 10).forEach(rec => {
    console.log(`   ${rec}`);
  });
  
} catch (error) {
  console.error("❌ Test 2 failed:", error);
}

// Test 3: Design Check Explanations
console.log("\n\n🧪 TEST 3: Design Check Explanations");
console.log("-".repeat(60));

try {
  const engine = new EnhancedEducationalDesignEngine(validBeamInput);
  
  console.log("\n📖 FLEXURAL STRENGTH EXPLANATION:");
  console.log(engine.explainDesignCheck('flexural'));
  
  console.log("\n📖 SHEAR STRENGTH EXPLANATION:");
  console.log(engine.explainDesignCheck('shear'));
  
} catch (error) {
  console.error("❌ Test 3 failed:", error);
}

// Test 4: Column Design
console.log("\n\n🧪 TEST 4: Column Design");
console.log("-".repeat(60));

try {
  const columnEngine = new EnhancedEducationalDesignEngine(columnInput);
  
  const columnValidation = columnEngine.validateInputEducationally();
  console.log(`Column Input Valid: ${columnValidation.isValid}`);
  
  if (columnValidation.isValid) {
    const columnResults = columnEngine.performEducationalDesign('column');
    console.log(`Column Design: ${columnResults.isValid ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Main Steel: ${columnResults.reinforcement.main.count}D${columnResults.reinforcement.main.diameter}`);
    console.log(`Ties: D${columnResults.reinforcement.shear.diameter}-${columnResults.reinforcement.shear.spacing}`);
  }
  
} catch (error) {
  console.error("❌ Test 4 failed:", error);
}

console.log("\n" + "=".repeat(80));
console.log("✅ EDUCATIONAL DESIGN ENGINE TESTING COMPLETE");
console.log("=".repeat(80));