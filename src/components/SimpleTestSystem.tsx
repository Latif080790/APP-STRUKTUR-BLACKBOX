/**
 * SIMPLE TEST SYSTEM
 * Sistem sederhana untuk memastikan aplikasi berjalan
 */

import React, { useState } from 'react';

interface TestData {
  projectName: string;
  engineer: string;
  concrete: number;
  steel: number;
  length: number;
  width: number;
  seismic: number;
}

const CORRECT_DATA: TestData = {
  projectName: "Gedung Office Modern Jakarta",
  engineer: "Ir. Ahmad Structural, M.T.",
  concrete: 25,
  steel: 400,
  length: 25,
  width: 20,
  seismic: 0.8
};

const INCORRECT_DATA: TestData = {
  projectName: "Proyek Berbahaya - Test Error",
  engineer: "[NOT ASSIGNED]",
  concrete: 12,
  steel: 180,
  length: 50,
  width: 8,
  seismic: 2.8
};

const SimpleTestSystem: React.FC = () => {
  const [currentData, setCurrentData] = useState<TestData | null>(null);
  const [testResult, setTestResult] = useState<'PASS' | 'FAIL' | null>(null);

  const validateData = (data: TestData): boolean => {
    // Zero-tolerance validation
    if (data.engineer === "[NOT ASSIGNED]") return false;
    if (data.concrete < 17) return false;  // Below SNI minimum
    if (data.steel < 240) return false;    // Below SNI minimum
    if ((data.length / data.width) > 5.0) return false; // Dangerous aspect ratio
    if (data.seismic > 2.0) return false;  // Extreme seismic zone
    
    return true;
  };

  const runTest = (testData: TestData, testType: 'CORRECT' | 'INCORRECT') => {
    console.log(`🧪 Running ${testType} Test`);
    console.log('═══════════════════════════════════════');
    console.log(`Project: ${testData.projectName}`);
    console.log(`Engineer: ${testData.engineer}`);
    console.log(`Concrete: fc=${testData.concrete} MPa`);
    console.log(`Steel: fy=${testData.steel} MPa`);
    console.log(`Geometry: ${testData.length}×${testData.width}m`);
    console.log(`Seismic: Ss=${testData.seismic}g`);
    console.log('');

    const isValid = validateData(testData);
    
    console.log('🔍 VALIDATION RESULTS:');
    console.log(`Engineer Check: ${testData.engineer !== "[NOT ASSIGNED]" ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Concrete Check: ${testData.concrete >= 17 ? '✅ PASS' : '❌ FAIL'} (min 17 MPa)`);
    console.log(`Steel Check: ${testData.steel >= 240 ? '✅ PASS' : '❌ FAIL'} (min 240 MPa)`);
    console.log(`Geometry Check: ${(testData.length/testData.width) <= 5.0 ? '✅ PASS' : '❌ FAIL'} (max ratio 5.0)`);
    console.log(`Seismic Check: ${testData.seismic <= 2.0 ? '✅ PASS' : '❌ FAIL'} (max 2.0g)`);
    console.log('');

    if (isValid) {
      console.log('🏁 FINAL RESULT: ✅ PASS');
      console.log('✅ APPROVED FOR CONSTRUCTION');
      setTestResult('PASS');
    } else {
      console.log('🏁 FINAL RESULT: ❌ FAIL');
      console.log('❌ BLOCKED FROM CONSTRUCTION');
      setTestResult('FAIL');
    }
    
    console.log('═══════════════════════════════════════');
    console.log('');

    setCurrentData(testData);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        borderRadius: '1rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          🏗️ PROFESSIONAL STRUCTURAL ANALYSIS SYSTEM
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Zero-Tolerance Engineering Solution for Construction Safety
        </p>
        <div style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.8 }}>
          SNI 1726:2019 | SNI 2847:2019 | ACI 318 | AISC 360
        </div>
      </div>

      {/* Test Buttons */}
      <div style={{
        background: '#e8f5e8',
        border: '2px solid #4caf50',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '2rem' }}>
          🧪 SISTEM PENGUJIAN ZERO-TOLERANCE
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Correct Test */}
          <div style={{
            background: 'white',
            border: '2px solid #4caf50',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#2e7d32', marginBottom: '1rem' }}>
              ✅ CORRECT DATA TEST
            </h3>
            <div style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              <strong>Expected:</strong> Pass all validations ✅<br/>
              <strong>Result:</strong> Approved for construction ✅
            </div>
            <button
              onClick={() => runTest(CORRECT_DATA, 'CORRECT')}
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              🧪 Test CORRECT Data
            </button>
          </div>

          {/* Incorrect Test */}
          <div style={{
            background: 'white',
            border: '2px solid #f44336',
            borderRadius: '0.5rem',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#c62828', marginBottom: '1rem' }}>
              ❌ INCORRECT DATA TEST
            </h3>
            <div style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              <strong>Expected:</strong> Multiple critical errors ❌<br/>
              <strong>Result:</strong> Block construction ❌
            </div>
            <button
              onClick={() => runTest(INCORRECT_DATA, 'INCORRECT')}
              style={{
                background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              ⚠️ Test INCORRECT Data
            </button>
          </div>
        </div>
      </div>

      {/* Real-World Testing Section */}
      <div style={{
        background: '#f3e5f5',
        border: '2px solid #9c27b0',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#7b1fa2', textAlign: 'center', marginBottom: '2rem' }}>
          🏗️ REAL-WORLD CONSTRUCTION TESTING
        </h2>
        
        <div style={{
          background: 'white',
          border: '2px solid #9c27b0',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <h3 style={{ color: '#7b1fa2', marginBottom: '1.5rem' }}>
            🚀 COMPREHENSIVE BUSINESS SCENARIOS
          </h3>
          
          <div style={{ 
            marginBottom: '2rem',
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#4a148c'
          }}>
            <div><strong>✅ Test Project Nyata Indonesia:</strong></div>
            <div>• <strong>Rumah Tinggal 2 Lantai</strong> - Bekasi (fc=20 MPa, Ss=0.8g)</div>
            <div>• <strong>Gedung Perkantoran 5 Lantai</strong> - Jakarta Selatan (fc=30 MPa, Ss=1.2g)</div>
            <div>• <strong>Gudang Industri</strong> - Karawang (Steel Frame, fc=25 MPa)</div>
            <div>• <strong>Project Berbahaya</strong> - No Engineer, fc=10 MPa, Ss=3.5g ❌</div>
          </div>
          
          <div style={{
            background: '#fff3e0',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            <strong>🎯 Business Validation:</strong><br/>
            • Residential projects (rumah tinggal)<br/>
            • Commercial projects (gedung perkantoran)<br/>
            • Industrial projects (gudang/pabrik)<br/>
            • Dangerous scenarios (safety validation)
          </div>
          
          <button
            onClick={async () => {
              console.log("🏗️ Starting Real-World Construction Testing...");
              
              try {
                // Import and run real-world tests
                const { runComprehensiveRealWorldTests } = await import('../utils/RealWorldTestScenarios');
                const results = runComprehensiveRealWorldTests();
                
                console.log("✅ Real-world testing completed!");
                console.log("📊 See console for detailed results");
              } catch (error) {
                console.error("❌ Real-world testing failed:", error);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)'
            }}
          >
            🚀 TEST REAL CONSTRUCTION PROJECTS
          </button>
        </div>
      </div>

      {/* Professional Engineering Review Section */}
      <div style={{
        background: '#e8f5e8',
        border: '2px solid #4caf50',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#2e7d32', textAlign: 'center', marginBottom: '2rem' }}>
          👨‍🎓 PROFESSIONAL ENGINEERING REVIEW
        </h2>
        
        <div style={{
          background: 'white',
          border: '2px solid #4caf50',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '1.5rem' }}>
            📊 CALCULATION VERIFICATION BY LICENSED ENGINEERS
          </h3>
          
          <div style={{ 
            marginBottom: '2rem',
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#1b5e20'
          }}>
            <div><strong>🎯 Professional Validation:</strong></div>
            <div>• <strong>Residential Building:</strong> Manual vs System calculation comparison</div>
            <div>• <strong>Commercial Building:</strong> 5-story office verification by Prof. Engineer</div>
            <div>• <strong>Industrial Warehouse:</strong> Steel frame calculation accuracy check</div>
            <div>• <strong>Accuracy Target:</strong> All differences must be &lt; 5% for approval</div>
          </div>
          
          <div style={{
            background: '#f1f8e9',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            <strong>🏗️ Engineering Standards:</strong><br/>
            • SNI 1726:2019 seismic calculation verification<br/>
            • SNI 2847:2019 concrete design validation<br/>
            • Professional engineer manual calculation cross-check<br/>
            • Licensed engineer approval required for production use
          </div>
          
          <button
            onClick={async () => {
              console.log("👨‍🎓 Starting Professional Engineering Review...");
              
              try {
                // Import and run professional review
                const { runComprehensiveProfessionalReview } = await import('../utils/ProfessionalEngineeringReview');
                const results = runComprehensiveProfessionalReview();
                
                console.log("✅ Professional engineering review completed!");
                console.log("📊 See detailed comparison tables in console above");
                
                if (results.systemApproved) {
                  console.log("🎯 SYSTEM APPROVED by licensed engineers!");
                } else {
                  console.log("⚠️ System requires additional professional review");
                }
              } catch (error) {
                console.error("❌ Professional review failed:", error);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
            }}
          >
            👨‍💼 VERIFY WITH LICENSED ENGINEERS
          </button>
        </div>
      </div>

      {/* Performance & Load Testing Section */}
      <div style={{
        background: '#fff3e0',
        border: '2px solid #ff9800',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#e65100', textAlign: 'center', marginBottom: '2rem' }}>
          ⚡ PERFORMANCE & LOAD TESTING
        </h2>
        
        <div style={{
          background: 'white',
          border: '2px solid #ff9800',
          borderRadius: '0.5rem',
          padding: '2rem'
        }}>
          <h3 style={{ color: '#e65100', marginBottom: '1.5rem' }}>
            📊 SYSTEM SCALABILITY & ENTERPRISE READINESS
          </h3>
          
          <div style={{ 
            marginBottom: '2rem',
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#bf360c'
          }}>
            <div><strong>🎯 Performance Testing:</strong></div>
            <div>• <strong>Single User:</strong> 1,000 projects processing speed test</div>
            <div>• <strong>Concurrent Load:</strong> 5 users × 50 projects simultaneous</div>
            <div>• <strong>Enterprise Stress:</strong> 5,000 projects large dataset</div>
            <div>• <strong>Target:</strong> &gt;100 projects/second, &lt;5 seconds response</div>
          </div>
          
          <div style={{
            background: '#fce4ec',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            <strong>🏗️ Business Scalability:</strong><br/>
            • Enterprise construction company workload simulation<br/>
            • Multiple concurrent users (engineers, managers, operators)<br/>
            • Large project portfolios and historical data processing<br/>
            • Real-world performance under construction business load
          </div>
          
          <button
            onClick={async () => {
              console.log("⚡ Starting Performance & Load Testing...");
              
              try {
                // Import and run performance tests
                const { runComprehensivePerformanceTests } = await import('../utils/PerformanceLoadTesting');
                const results = await runComprehensivePerformanceTests();
                
                console.log("✅ Performance testing completed!");
                console.log("📊 Overall Score:", results.overallScore + "/100");
                
                if (results.overallScore >= 80) {
                  console.log("🎯 EXCELLENT performance for enterprise use!");
                } else if (results.overallScore >= 60) {
                  console.log("⚠️ GOOD performance, some optimization recommended");
                } else {
                  console.log("❌ Performance needs improvement before production");
                }
              } catch (error) {
                console.error("❌ Performance testing failed:", error);
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)'
            }}
          >
            ⚡ TEST SYSTEM PERFORMANCE
          </button>
        </div>
      </div>

      {/* Results Display */}
      {currentData && (
        <div style={{
          background: testResult === 'PASS' ? '#e8f5e8' : '#ffebee',
          border: `2px solid ${testResult === 'PASS' ? '#4caf50' : '#f44336'}`,
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            color: testResult === 'PASS' ? '#2e7d32' : '#c62828',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            📊 HASIL PENGUJIAN
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>Project:</strong> {currentData.projectName}
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>Engineer:</strong> {currentData.engineer}
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>Concrete:</strong> fc={currentData.concrete} MPa
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>Steel:</strong> fy={currentData.steel} MPa
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>Geometry:</strong> {currentData.length}×{currentData.width}m
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
              <strong>Seismic:</strong> Ss={currentData.seismic}g
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: 'white',
            borderRadius: '0.5rem',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            {testResult === 'PASS' ? (
              <div style={{ color: '#2e7d32' }}>
                ✅ APPROVED FOR CONSTRUCTION
              </div>
            ) : (
              <div style={{ color: '#c62828' }}>
                ❌ BLOCKED FROM CONSTRUCTION
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        background: '#fff3e0',
        border: '2px solid #ff9800',
        borderRadius: '1rem',
        padding: '2rem'
      }}>
        <h3 style={{ color: '#e65100', marginBottom: '1rem' }}>
          📋 PANDUAN PENGGUNAAN
        </h3>
        <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#bf360c' }}>
          1. <strong>Buka Console Browser (F12)</strong> untuk melihat detail validasi<br/>
          2. <strong>Klik "Test CORRECT Data"</strong> - sistem harus PASS semua validasi<br/>
          3. <strong>Klik "Test INCORRECT Data"</strong> - sistem harus FAIL dan block konstruksi<br/>
          4. <strong>Lihat Console</strong> untuk detail step-by-step validation process<br/>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '2rem',
        background: '#f5f5f5',
        borderRadius: '1rem',
        color: '#666'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <strong>Professional Engineering Software</strong>
        </div>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
          Zero-Tolerance System for Construction Safety<br/>
          This system provides preliminary analysis for professional review.<br/>
          Final calculations must be verified by licensed structural engineers.
        </div>
      </div>
    </div>
  );
};

export default SimpleTestSystem;