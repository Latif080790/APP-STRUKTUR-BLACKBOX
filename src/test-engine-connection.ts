/**
 * Test script to verify the real structural engine connection
 */

import { structuralEngine } from './engines/FunctionalStructuralEngine';

async function testEngineConnection() {
  console.log('🔧 Testing Real Structural Engine Connection...');
  
  try {
    // Initialize engine
    await structuralEngine.initialize();
    console.log('✅ Engine initialized successfully');
    
    // Create a test project
    const project = structuralEngine.createProject({
      name: 'Connection Test',
      geometry: {
        buildingType: 'residential' as const,
        floors: 1,
        floorHeight: 3.0,
        bayLength: 6.0,
        bayWidth: 6.0,
        baysX: 1,
        baysY: 1,
        foundations: [],
        beams: [],
        columns: [],
        slabs: []
      }
    });
    
    console.log('✅ Project created:', project.id);
    
    // Run real analysis
    const results = await structuralEngine.analyzeStructure(project.id);
    
    console.log('🎉 REAL ANALYSIS RESULTS:');
    console.log('   Status:', results.status);
    console.log('   Max Displacement:', (results.summary.maxDisplacement * 1000).toFixed(3), 'mm');
    console.log('   Max Stress:', (results.summary.maxStress / 1000000).toFixed(2), 'MPa');
    console.log('   Safety Factor:', results.summary.safetyFactor.toFixed(2));
    console.log('   Elements:', results.elements.length);
    console.log('   Nodes:', results.nodes.length);
    console.log('   Converged:', results.summary.convergenceStatus);
    console.log('   Iterations:', results.summary.iterationsUsed);
    
    if (results.performance) {
      console.log('   Analysis Time:', results.performance.analysisTime, 'ms');
      console.log('   Element Count:', results.performance.elementCount);
      console.log('   Node Count:', results.performance.nodeCount);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Engine connection test failed:', error);
    return false;
  }
}

// Only run if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - attach to window for manual testing
  (window as any).testEngineConnection = testEngineConnection;
  console.log('🔧 Engine test function attached to window.testEngineConnection()');
}

export { testEngineConnection };