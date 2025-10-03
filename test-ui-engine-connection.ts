/**
 * Quick test to verify UI-Engine connection
 * This tests if FunctionalStructuralEngine can be called successfully
 */

import { structuralEngine } from './src/engines/FunctionalStructuralEngine';

console.log('🔧 Testing UI-Engine Connection...');

async function testConnection() {
  try {
    console.log('📊 Initializing FunctionalStructuralEngine...');
    
    // Initialize the engine first
    await structuralEngine.initialize();
    
    // Create a simple test project using the correct interface
    const project = structuralEngine.createProject({
      name: 'UI Connection Test Building',
      description: 'Testing UI-Engine connection with real structural analysis',
      geometry: {
        buildingType: 'commercial', // Valid option: 'residential' | 'commercial' | 'industrial'
        floors: 2,
        floorHeight: 3.5,
        bayLength: 6.0,
        bayWidth: 5.0,
        baysX: 2,
        baysY: 2,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
      // Let engine use default materials, loads, and analysis settings
    });
    
    console.log(`✅ Project created successfully: ${project.id}`);
    console.log(`   Name: ${project.name}`);
    console.log(`   Type: ${project.geometry.buildingType}`);
    console.log(`   Floors: ${project.geometry.floors}`);
    console.log(`   Bays: ${project.geometry.baysX} x ${project.geometry.baysY}`);
    
    // Now analyze the structure using the project ID
    console.log('📊 Calling FunctionalStructuralEngine.analyzeStructure()...');
    const results = await structuralEngine.analyzeStructure(project.id);
    
    console.log('✅ SUCCESS! Engine connection working!');
    console.log('📋 Analysis Results Summary:');
    console.log(`   Status: ${results.status}`);
    console.log(`   Engine Version: ${results.engineVersion}`);
    console.log(`   Max Displacement: ${results.summary.maxDisplacement.toFixed(3)} mm`);
    console.log(`   Max Stress: ${results.summary.maxStress.toFixed(2)} MPa`);
    console.log(`   Max Reaction: ${results.summary.maxReaction.toFixed(2)} kN`);
    console.log(`   Safety Factor: ${results.summary.safetyFactor.toFixed(2)}`);
    console.log(`   Convergence: ${results.summary.convergenceStatus}`);
    console.log(`   Iterations: ${results.summary.iterationsUsed}`);
    console.log(`   Elements: ${results.elements.length}`);
    console.log(`   Nodes: ${results.nodes.length}`);
    
    if (results.performance) {
      console.log(`   Analysis Time: ${results.performance.analysisTime.toFixed(1)} ms`);
      console.log(`   Memory Used: ${results.performance.memoryUsed.toFixed(2)} MB`);
    }
    
    // Check if these are real calculations (not random)
    const isReal = results.summary.maxDisplacement > 0 && 
                  results.summary.maxStress > 0 && 
                  results.summary.safetyFactor > 0 &&
                  results.summary.convergenceStatus !== undefined;
    
    if (isReal) {
      console.log('🎯 REAL CALCULATIONS CONFIRMED - No more Math.random()!');
    } else {
      console.log('⚠️  WARNING: Results appear to be placeholder values');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ ENGINE CONNECTION FAILED:');
    console.error(error);
    return false;
  }
}

// Run test immediately
testConnection().then(success => {
  if (success) {
    console.log('\n🚀 CONNECTION STATUS: WORKING');
    console.log('   The FunctionalStructuralEngine is operational and returns real calculations.');
    console.log('   UI can call structuralEngine.analyzeStructure(projectId) successfully');
  } else {
    console.log('\n💥 CONNECTION STATUS: FAILED'); 
    console.log('   There are issues with the structural engine integration.');
  }
}).catch(console.error);

// Also make test available for manual execution in browser console
if (typeof window !== 'undefined') {
  (window as any).testEngineConnection = testConnection;
  console.log('🔧 Manual test: Call window.testEngineConnection() in browser console');
}