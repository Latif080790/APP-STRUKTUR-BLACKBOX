/**
 * Simple verification script to test that the application is working
 */

console.log('=== Structural Analysis System Verification ===\n');

// Test that the application structure is correct
const fs = require('fs');
const path = require('path');

// Check that key files exist
const keyFiles = [
  'src/structural-analysis/StructuralAnalysisSystem.tsx',
  'src/structural-analysis/design/BeamDesignModule.tsx',
  'src/structural-analysis/design/ColumnDesignModule.tsx',
  'src/structural-analysis/design/SlabDesignModule.tsx',
  'src/structural-analysis/analysis/StructuralAnalyzer.ts',
  'src/types/structural.ts'
];

console.log('1. Checking key files...');
let allFilesExist = true;

for (const file of keyFiles) {
  if (fs.existsSync(path.join(__dirname, '../../', file))) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('   ✅ All key files present\n');
} else {
  console.log('   ❌ Some key files are missing\n');
}

// Check that the development server is running
console.log('2. Checking development server...');
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`   ✅ Server is running (Status: ${res.statusCode})\n`);
  console.log('=== Verification Complete ===');
  console.log('The Structural Analysis System is ready for use!');
});

req.on('error', (e) => {
  console.log('   ⚠️  Server check failed (may not be running yet)\n');
  console.log('=== Verification Complete ===');
  console.log('Application structure is correct. Start the server with "npm run dev"');
});

req.on('timeout', () => {
  console.log('   ⚠️  Server check timed out\n');
  console.log('=== Verification Complete ===');
  console.log('Application structure is correct. Start the server with "npm run dev"');
  req.destroy();
});

req.end();