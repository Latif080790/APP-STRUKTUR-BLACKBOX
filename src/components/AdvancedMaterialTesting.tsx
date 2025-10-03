/**
 * Advanced Material Testing Module - Phase 1: Material Excellence
 * Professional material certification system with real-time quality assurance protocols
 * Follows user preferences: English UI, prominent features, consolidated help system
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FlaskConical, Shield, CheckCircle2, AlertTriangle, TrendingUp,
  BarChart3, Clock, Award, RefreshCw, Download, Upload, 
  Microscope, Target, Zap, Database, FileCheck, Settings
} from 'lucide-react';

// Material test interfaces
interface MaterialTest {
  id: string;
  materialId: string;
  testType: 'compression' | 'tension' | 'flexure' | 'shear' | 'fatigue' | 'durability';
  testDate: Date;
  laboratory: string;
  technician: string;
  specimens: MaterialSpecimen[];
  results: TestResults;
  certification: CertificationStatus;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'certified';
}

interface MaterialSpecimen {
  id: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    diameter?: number;
  };
  age: number; // days
  curing: 'standard' | 'accelerated' | 'field';
  preparation: 'laboratory' | 'field-cured' | 'core';
}

interface TestResults {
  ultimate: number;
  yield?: number;
  modulus: number;
  strain: number;
  ductility?: number;
  toughness?: number;
  variationCoefficient: number;
  statisticalData: {
    mean: number;
    standardDeviation: number;
    confidence95: number;
    sampleSize: number;
  };
}

interface CertificationStatus {
  certified: boolean;
  certificationBody: string;
  certificateNumber?: string;
  validUntil?: Date;
  complianceStandards: string[];
  qualityGrade: 'A' | 'B' | 'C' | 'Reject';
}

interface QualityAssuranceProtocol {
  id: string;
  name: string;
  materialTypes: string[];
  testingStages: QualityStage[];
  acceptanceCriteria: AcceptanceCriteria;
  documentation: DocumentationRequirement[];
}

interface QualityStage {
  stage: string;
  description: string;
  requiredTests: string[];
  minimumSamples: number;
  frequency: string;
  holdPoints: boolean;
}

interface AcceptanceCriteria {
  strengthRequirement: {
    minimum: number;
    typical: number;
    variationLimit: number;
  };
  consistencyRequirement: {
    coefficientOfVariation: number;
    outlierDetection: boolean;
  };
  complianceStandards: string[];
}

interface DocumentationRequirement {
  document: string;
  required: boolean;
  retention: number; // years
  digitalStorage: boolean;
}

const AdvancedMaterialTesting: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'testing' | 'certification' | 'quality' | 'library'>('testing');
  const [materialTests, setMaterialTests] = useState<MaterialTest[]>([]);
  const [qualityProtocols, setQualityProtocols] = useState<QualityAssuranceProtocol[]>([]);
  const [selectedTest, setSelectedTest] = useState<MaterialTest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);

  // Material test database with SNI standards
  const materialTestDatabase = useMemo(() => ({
    concrete: {
      standardTests: [
        {
          type: 'compression',
          standard: 'SNI 1974:2011',
          ageRequirements: [7, 14, 28, 90], // days
          specimenSize: '150x150x150mm cube or φ150x300mm cylinder',
          minimumSamples: 3,
          acceptanceCriteria: 'fc ≥ specified strength with max 15% variation'
        },
        {
          type: 'tension',
          standard: 'SNI 2491:2014',
          specimenSize: 'φ150x300mm cylinder - split test',
          minimumSamples: 3,
          acceptanceCriteria: 'ft = 0.56√fc (MPa)'
        },
        {
          type: 'flexure',
          standard: 'SNI 4431:2011',
          specimenSize: '150x150x750mm beam',
          minimumSamples: 3,
          acceptanceCriteria: 'fr = 0.62√fc (MPa)'
        }
      ],
      qualityClasses: ['K-175', 'K-225', 'K-300', 'K-350', 'K-400', 'K-500'],
      certificationBodies: ['BSN', 'LPJK', 'SUCOFINDO', 'SGS', 'Intertek']
    },
    steel: {
      standardTests: [
        {
          type: 'tension',
          standard: 'SNI 2052:2017',
          specimenSize: 'φ16mm x 500mm length',
          minimumSamples: 3,
          acceptanceCriteria: 'fy ≥ specified yield, fu ≥ specified ultimate'
        },
        {
          type: 'fatigue',
          standard: 'ASTM A615',
          cycles: 2000000,
          minimumSamples: 6,
          acceptanceCriteria: 'No failure at stress range = 0.15fy'
        }
      ],
      qualityClasses: ['BjTP-24', 'BjTS-40', 'BjTS-50'],
      certificationBodies: ['BSN', 'KAN', 'LPJK']
    }
  }), []);

  // Real-time quality assurance protocols
  const defaultQualityProtocols: QualityAssuranceProtocol[] = useMemo(() => [
    {
      id: 'qa-concrete-standard',
      name: 'Standard Concrete Quality Assurance',
      materialTypes: ['concrete'],
      testingStages: [
        {
          stage: 'Material Acceptance',
          description: 'Incoming material verification',
          requiredTests: ['visual', 'documentation'],
          minimumSamples: 1,
          frequency: 'per batch',
          holdPoints: true
        },
        {
          stage: 'Fresh Concrete Testing',
          description: 'Workability and consistency testing',
          requiredTests: ['slump', 'air-content', 'temperature'],
          minimumSamples: 3,
          frequency: 'per 50m³ or per day',
          holdPoints: false
        },
        {
          stage: 'Strength Testing',
          description: 'Compressive strength verification',
          requiredTests: ['compression-7d', 'compression-28d'],
          minimumSamples: 6,
          frequency: 'per 150m³',
          holdPoints: true
        }
      ],
      acceptanceCriteria: {
        strengthRequirement: {
          minimum: 0.85, // 85% of specified strength
          typical: 1.00,
          variationLimit: 0.15 // 15% coefficient of variation
        },
        consistencyRequirement: {
          coefficientOfVariation: 0.15,
          outlierDetection: true
        },
        complianceStandards: ['SNI 2847:2019', 'SNI 1974:2011']
      },
      documentation: [
        {
          document: 'Material Certificates',
          required: true,
          retention: 10,
          digitalStorage: true
        },
        {
          document: 'Test Reports',
          required: true,
          retention: 10,
          digitalStorage: true
        },
        {
          document: 'Calibration Certificates',
          required: true,
          retention: 5,
          digitalStorage: true
        }
      ]
    }
  ], []);

  // Initialize quality protocols
  useEffect(() => {
    setQualityProtocols(defaultQualityProtocols);
  }, [defaultQualityProtocols]);

  // Simulate real-time test monitoring
  useEffect(() => {
    if (!realTimeMonitoring) return;

    const interval = setInterval(() => {
      // Simulate real-time updates for in-progress tests
      setMaterialTests(prev => prev.map(test => {
        if (test.status === 'in-progress') {
          // Simulate test progress
          const progress = Math.min(100, (Date.now() - test.testDate.getTime()) / 60000 * 10);
          if (progress >= 100) {
            return {
              ...test,
              status: 'completed',
              results: {
                ...test.results,
                ultimate: 25 + Math.random() * 10, // Simulated result
                modulus: 23500 + Math.random() * 2000,
                strain: 0.002 + Math.random() * 0.001,
                variationCoefficient: 0.08 + Math.random() * 0.05,
                statisticalData: {
                  mean: 27.5,
                  standardDeviation: 2.1,
                  confidence95: 1.96,
                  sampleSize: 6
                }
              }
            };
          }
        }
        return test;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeMonitoring]);

  // Create new material test
  const createMaterialTest = useCallback((materialType: string, testType: string) => {
    const newTest: MaterialTest = {
      id: `test_${Date.now()}`,
      materialId: `${materialType}_${Date.now()}`,
      testType: testType as any,
      testDate: new Date(),
      laboratory: 'Certified Testing Laboratory',
      technician: 'Licensed Test Engineer',
      specimens: Array.from({ length: 6 }, (_, i) => ({
        id: `specimen_${i + 1}`,
        dimensions: {
          length: 150,
          width: 150,
          height: 150
        },
        age: 28,
        curing: 'standard',
        preparation: 'laboratory'
      })),
      results: {
        ultimate: 0,
        modulus: 0,
        strain: 0,
        variationCoefficient: 0,
        statisticalData: {
          mean: 0,
          standardDeviation: 0,
          confidence95: 0,
          sampleSize: 6
        }
      },
      certification: {
        certified: false,
        certificationBody: 'BSN',
        complianceStandards: ['SNI 2847:2019'],
        qualityGrade: 'A'
      },
      status: 'in-progress'
    };

    setMaterialTests(prev => [...prev, newTest]);
    setSelectedTest(newTest);
  }, []);

  // Calculate test statistics
  const calculateTestStatistics = useCallback((tests: MaterialTest[]) => {
    const completedTests = tests.filter(t => t.status === 'completed');
    const certifiedTests = tests.filter(t => t.certification.certified);
    
    return {
      totalTests: tests.length,
      completedTests: completedTests.length,
      certifiedTests: certifiedTests.length,
      averageStrength: completedTests.length > 0 
        ? completedTests.reduce((sum, t) => sum + t.results.ultimate, 0) / completedTests.length
        : 0,
      passRate: completedTests.length > 0
        ? (certifiedTests.length / completedTests.length) * 100
        : 0
    };
  }, []);

  const testStats = useMemo(() => calculateTestStatistics(materialTests), [materialTests, calculateTestStatistics]);

  // Render testing interface
  const renderTestingInterface = () => (
    <div className="space-y-6">
      {/* Test Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-600/10 to-blue-800/10 border border-blue-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FlaskConical className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-blue-300 text-sm">Total Tests</div>
              <div className="text-blue-100 text-2xl font-bold">{testStats.totalTests}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600/10 to-green-800/10 border border-green-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-green-300 text-sm">Completed</div>
              <div className="text-green-100 text-2xl font-bold">{testStats.completedTests}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600/10 to-purple-800/10 border border-purple-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Award className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-purple-300 text-sm">Certified</div>
              <div className="text-purple-100 text-2xl font-bold">{testStats.certifiedTests}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-600/10 to-orange-800/10 border border-orange-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <div>
              <div className="text-orange-300 text-sm">Pass Rate</div>
              <div className="text-orange-100 text-2xl font-bold">{testStats.passRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Creation Panel */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
          <Microscope className="w-6 h-6 mr-2 text-blue-400" />
          Create New Material Test
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(materialTestDatabase).map(([materialType, data]) => (
            <div key={materialType} className="space-y-3">
              <h4 className="text-white/80 font-medium capitalize">{materialType} Tests</h4>
              {data.standardTests.map((test, index) => (
                <button
                  key={index}
                  onClick={() => createMaterialTest(materialType, test.type)}
                  className="w-full p-3 bg-gradient-to-r from-blue-600/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-800/30 border border-blue-400/20 rounded-lg transition-all text-left"
                >
                  <div className="text-white/90 font-medium capitalize">{test.type} Test</div>
                  <div className="text-white/60 text-sm">{test.standard}</div>
                  <div className="text-blue-400 text-xs mt-1">Start Test →</div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Active Tests List */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white/90 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-400" />
            Active Material Tests
          </h3>
          <button
            onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              realTimeMonitoring 
                ? 'bg-green-600/20 text-green-300 border border-green-400/30' 
                : 'bg-gray-600/20 text-gray-300 border border-gray-400/30'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${realTimeMonitoring ? 'animate-spin' : ''}`} />
            <span>Real-time Monitoring</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {materialTests.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active tests. Create a new test to begin material testing.</p>
            </div>
          ) : (
            materialTests.map(test => (
              <div
                key={test.id}
                onClick={() => setSelectedTest(test)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedTest?.id === test.id
                    ? 'bg-blue-600/20 border-blue-400/40'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white/90 font-medium capitalize">
                      {test.testType} Test - {test.materialId}
                    </div>
                    <div className="text-white/60 text-sm">
                      Lab: {test.laboratory} | Technician: {test.technician}
                    </div>
                    <div className="text-white/60 text-sm">
                      Test Date: {test.testDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.status === 'completed' ? 'bg-green-600/20 text-green-300' :
                      test.status === 'in-progress' ? 'bg-blue-600/20 text-blue-300' :
                      test.status === 'failed' ? 'bg-red-600/20 text-red-300' :
                      test.status === 'certified' ? 'bg-purple-600/20 text-purple-300' :
                      'bg-yellow-600/20 text-yellow-300'
                    }`}>
                      {test.status.toUpperCase()}
                    </div>
                    {test.results.ultimate > 0 && (
                      <div className="text-white/70 text-sm mt-1">
                        {test.results.ultimate.toFixed(1)} MPa
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2 flex items-center">
            <FlaskConical className="w-8 h-8 mr-3 text-blue-400" />
            Advanced Material Testing System
          </h1>
          <p className="text-white/60">
            Professional material certification with real-time quality assurance protocols
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'testing', label: 'Material Testing', icon: FlaskConical },
            { id: 'certification', label: 'Certification', icon: Award },
            { id: 'quality', label: 'Quality Assurance', icon: Shield },
            { id: 'library', label: 'Test Library', icon: Database }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-400/30'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'testing' && renderTestingInterface()}
        
        {/* Coming Soon placeholders for other tabs */}
        {activeTab !== 'testing' && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'certification' && <Award className="w-8 h-8 text-blue-400" />}
              {activeTab === 'quality' && <Shield className="w-8 h-8 text-blue-400" />}
              {activeTab === 'library' && <Database className="w-8 h-8 text-blue-400" />}
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-2 capitalize">
              {activeTab} Module
            </h3>
            <p className="text-white/60 mb-4">
              Advanced {activeTab} features coming in the next development cycle
            </p>
            <div className="text-blue-400 text-sm">Phase 1: Material Excellence - In Development</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedMaterialTesting;