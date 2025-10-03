/**
 * Professional Material Certification System
 * Advanced certification management with digital certificates and compliance tracking
 * Following user preferences: English UI, prominent features, consolidated help
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award, Shield, FileCheck, Download, Upload, QrCode,
  Calendar, User, Building, CheckCircle2, AlertTriangle,
  Clock, Stamp, Database, Search, Filter, RefreshCw
} from 'lucide-react';

interface MaterialCertificate {
  id: string;
  certificateNumber: string;
  materialType: string;
  materialGrade: string;
  manufacturer: string;
  batchNumber: string;
  productionDate: Date;
  testingDate: Date;
  expiryDate: Date;
  certificationBody: string;
  technicalProperties: MaterialProperties;
  testResults: CertificationTestResults;
  complianceStandards: string[];
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  digitalSignature: string;
  qrCode: string;
}

interface MaterialProperties {
  compressiveStrength?: number;
  tensileStrength?: number;
  yieldStrength?: number;
  ultimateStrength?: number;
  elasticModulus?: number;
  poissonRatio?: number;
  density: number;
  thermalExpansion?: number;
  fireResistance?: string;
  durabilityClass?: string;
}

interface CertificationTestResults {
  testId: string;
  specimenCount: number;
  averageStrength: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  individualResults: number[];
  passRate: number;
  testStandard: string;
  laboratory: string;
  testEngineer: string;
}

interface CertificationBody {
  id: string;
  name: string;
  code: string;
  accreditation: string[];
  validUntil: Date;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  certificationScope: string[];
}

const ProfessionalMaterialCertification: React.FC = () => {
  const [certificates, setCertificates] = useState<MaterialCertificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<MaterialCertificate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Certification bodies database
  const certificationBodies: CertificationBody[] = useMemo(() => [
    {
      id: 'bsn',
      name: 'Badan Standardisasi Nasional',
      code: 'BSN',
      accreditation: ['ISO/IEC 17025', 'ISO/IEC 17065'],
      validUntil: new Date('2025-12-31'),
      contactInfo: {
        address: 'Gedung Manggala Wanabakti Blok IV Lt. 4, Jakarta',
        phone: '+62-21-5747043',
        email: 'info@bsn.go.id',
        website: 'www.bsn.go.id'
      },
      certificationScope: ['concrete', 'steel', 'timber', 'aggregate']
    },
    {
      id: 'sucofindo',
      name: 'PT Sucofindo (Persero)',
      code: 'SUCOFINDO',
      accreditation: ['ISO/IEC 17025', 'KAN-P-901'],
      validUntil: new Date('2025-06-30'),
      contactInfo: {
        address: 'Jl. Raya Pasar Minggu Km 34, Jakarta Selatan',
        phone: '+62-21-7918-3333',
        email: 'info@sucofindo.co.id',
        website: 'www.sucofindo.co.id'
      },
      certificationScope: ['concrete', 'steel', 'chemical', 'mechanical']
    },
    {
      id: 'sgs',
      name: 'SGS Indonesia',
      code: 'SGS',
      accreditation: ['ISO/IEC 17025', 'ILAC-MRA'],
      validUntil: new Date('2025-09-15'),
      contactInfo: {
        address: 'Jl. Tanjung Elmo, Tanjung Priok, Jakarta Utara',
        phone: '+62-21-3910-2882',
        email: 'sgs.indonesia@sgs.com',
        website: 'www.sgs.com'
      },
      certificationScope: ['concrete', 'steel', 'polymer', 'aggregate']
    }
  ], []);

  // Sample certificates for demonstration
  const sampleCertificates: MaterialCertificate[] = useMemo(() => [
    {
      id: 'cert_001',
      certificateNumber: 'BSN-CON-2024-001',
      materialType: 'concrete',
      materialGrade: 'K-300',
      manufacturer: 'PT Beton Jaya Indonesia',
      batchNumber: 'BJI-24-0156',
      productionDate: new Date('2024-01-15'),
      testingDate: new Date('2024-02-12'),
      expiryDate: new Date('2025-02-12'),
      certificationBody: 'BSN',
      technicalProperties: {
        compressiveStrength: 30.2,
        tensileStrength: 3.1,
        elasticModulus: 25400,
        poissonRatio: 0.2,
        density: 2400,
        thermalExpansion: 10e-6,
        durabilityClass: 'XC3'
      },
      testResults: {
        testId: 'TEST-BSN-240212',
        specimenCount: 6,
        averageStrength: 30.2,
        standardDeviation: 1.8,
        coefficientOfVariation: 0.06,
        individualResults: [29.8, 30.1, 31.2, 30.5, 29.7, 30.9],
        passRate: 100,
        testStandard: 'SNI 1974:2011',
        laboratory: 'BSN Testing Laboratory',
        testEngineer: 'Ir. Ahmad Structural, M.T.'
      },
      complianceStandards: ['SNI 2847:2019', 'SNI 1974:2011'],
      status: 'valid',
      digitalSignature: 'SHA256:a1b2c3d4e5f6...',
      qrCode: 'QR-BSN-CON-2024-001'
    },
    {
      id: 'cert_002',
      certificateNumber: 'SGS-STL-2024-078',
      materialType: 'steel',
      materialGrade: 'BjTS-50',
      manufacturer: 'PT Krakatau Steel',
      batchNumber: 'KS-50-2024-034',
      productionDate: new Date('2024-02-01'),
      testingDate: new Date('2024-02-28'),
      expiryDate: new Date('2025-02-28'),
      certificationBody: 'SGS',
      technicalProperties: {
        yieldStrength: 500,
        ultimateStrength: 650,
        elasticModulus: 200000,
        poissonRatio: 0.3,
        density: 7850,
        thermalExpansion: 12e-6
      },
      testResults: {
        testId: 'TEST-SGS-240228',
        specimenCount: 3,
        averageStrength: 520,
        standardDeviation: 15,
        coefficientOfVariation: 0.03,
        individualResults: [515, 520, 525],
        passRate: 100,
        testStandard: 'SNI 2052:2017',
        laboratory: 'SGS Materials Testing',
        testEngineer: 'Dr. Sarah Materials, Ph.D.'
      },
      complianceStandards: ['SNI 1729:2020', 'SNI 2052:2017'],
      status: 'valid',
      digitalSignature: 'SHA256:f6e5d4c3b2a1...',
      qrCode: 'QR-SGS-STL-2024-078'
    }
  ], []);

  // Initialize certificates
  useEffect(() => {
    setCertificates(sampleCertificates);
  }, [sampleCertificates]);

  // Filter certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cert.materialGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cert.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
      const matchesMaterial = filterMaterial === 'all' || cert.materialType === filterMaterial;
      
      return matchesSearch && matchesStatus && matchesMaterial;
    });
  }, [certificates, searchTerm, filterStatus, filterMaterial]);

  // Certificate statistics
  const certificateStats = useMemo(() => {
    const total = certificates.length;
    const valid = certificates.filter(c => c.status === 'valid').length;
    const expired = certificates.filter(c => c.status === 'expired').length;
    const pending = certificates.filter(c => c.status === 'pending').length;
    const expiringThisMonth = certificates.filter(c => {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      return c.expiryDate <= nextMonth && c.status === 'valid';
    }).length;

    return { total, valid, expired, pending, expiringThisMonth };
  }, [certificates]);

  const generateCertificateReport = (certificate: MaterialCertificate) => {
    // Simulate PDF generation
    console.log('Generating certificate report for:', certificate.certificateNumber);
    // In real implementation, this would generate a PDF report
  };

  const verifyCertificate = async (certificateNumber: string) => {
    setIsLoading(true);
    // Simulate certificate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    // In real implementation, this would verify against certification body database
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-400 bg-green-600/20 border-green-400/30';
      case 'expired': return 'text-red-400 bg-red-600/20 border-red-400/30';
      case 'revoked': return 'text-red-400 bg-red-600/20 border-red-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-600/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-600/20 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Certification Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-r from-blue-600/10 to-blue-800/10 border border-blue-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-400" />
            <div>
              <div className="text-blue-300 text-sm">Total Certificates</div>
              <div className="text-blue-100 text-xl font-bold">{certificateStats.total}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-green-800/10 border border-green-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <div>
              <div className="text-green-300 text-sm">Valid</div>
              <div className="text-green-100 text-xl font-bold">{certificateStats.valid}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-red-800/10 border border-red-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <div className="text-red-300 text-sm">Expired</div>
              <div className="text-red-100 text-xl font-bold">{certificateStats.expired}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-800/10 border border-yellow-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-yellow-300 text-sm">Pending</div>
              <div className="text-yellow-100 text-xl font-bold">{certificateStats.pending}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-orange-800/10 border border-orange-400/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-orange-400" />
            <div>
              <div className="text-orange-300 text-sm">Expiring Soon</div>
              <div className="text-orange-100 text-xl font-bold">{certificateStats.expiringThisMonth}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search certificates by number, grade, or manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
          >
            <option value="all">All Status</option>
            <option value="valid">Valid</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
            <option value="revoked">Revoked</option>
          </select>

          <select
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400/50"
          >
            <option value="all">All Materials</option>
            <option value="concrete">Concrete</option>
            <option value="steel">Steel</option>
            <option value="timber">Timber</option>
            <option value="aggregate">Aggregate</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterMaterial('all');
            }}
            className="px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-400/20 rounded-lg text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white/90 flex items-center">
            <Award className="w-6 h-6 mr-2 text-purple-400" />
            Material Certificates ({filteredCertificates.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-blue-300 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload Certificate</span>
            </button>
            <button className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 rounded-lg text-green-300 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Sync Database</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No certificates found matching your criteria.</p>
            </div>
          ) : (
            filteredCertificates.map(certificate => (
              <div
                key={certificate.id}
                onClick={() => setSelectedCertificate(certificate)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedCertificate?.id === certificate.id
                    ? 'bg-blue-600/20 border-blue-400/40'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white/90 font-medium">{certificate.certificateNumber}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(certificate.status)}`}>
                        {certificate.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-white/60">Material</div>
                        <div className="text-white/80">{certificate.materialGrade} ({certificate.materialType})</div>
                      </div>
                      <div>
                        <div className="text-white/60">Manufacturer</div>
                        <div className="text-white/80">{certificate.manufacturer}</div>
                      </div>
                      <div>
                        <div className="text-white/60">Certification Body</div>
                        <div className="text-white/80">{certificate.certificationBody}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-white/60">
                      <span>Tested: {certificate.testingDate.toLocaleDateString()}</span>
                      <span>Expires: {certificate.expiryDate.toLocaleDateString()}</span>
                      <span>Batch: {certificate.batchNumber}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateCertificateReport(certificate);
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Download Certificate"
                    >
                      <Download className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show QR code
                      }}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="View QR Code"
                    >
                      <QrCode className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Certificate Details Panel */}
      {selectedCertificate && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <FileCheck className="w-6 h-6 mr-2 text-green-400" />
            Certificate Details - {selectedCertificate.certificateNumber}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technical Properties */}
            <div className="space-y-4">
              <h4 className="text-white/80 font-medium">Technical Properties</h4>
              <div className="space-y-2">
                {Object.entries(selectedCertificate.technicalProperties).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <span className="text-white/70 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-blue-400 text-sm font-mono">
                      {typeof value === 'number' ? 
                        (value < 1 ? value.toFixed(6) : value.toFixed(1)) + 
                        (key.includes('Strength') ? ' MPa' : 
                         key.includes('Modulus') ? ' MPa' : 
                         key.includes('density') ? ' kg/m³' : '') : 
                        value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Test Results */}
            <div className="space-y-4">
              <h4 className="text-white/80 font-medium">Test Results</h4>
              <div className="space-y-2">
                <div className="p-3 bg-white/5 rounded">
                  <div className="text-white/80 text-sm mb-2">Average Strength: {selectedCertificate.testResults.averageStrength.toFixed(1)} MPa</div>
                  <div className="text-white/80 text-sm mb-2">Coefficient of Variation: {(selectedCertificate.testResults.coefficientOfVariation * 100).toFixed(1)}%</div>
                  <div className="text-white/80 text-sm mb-2">Pass Rate: {selectedCertificate.testResults.passRate}%</div>
                  <div className="text-white/60 text-xs">Test Standard: {selectedCertificate.testResults.testStandard}</div>
                  <div className="text-white/60 text-xs">Laboratory: {selectedCertificate.testResults.laboratory}</div>
                </div>
                
                <div className="p-3 bg-white/5 rounded">
                  <div className="text-white/80 text-sm mb-2">Individual Test Results:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCertificate.testResults.individualResults.map((result, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">
                        {result.toFixed(1)} MPa
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compliance Standards */}
          <div className="mt-6">
            <h4 className="text-white/80 font-medium mb-3">Compliance Standards</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCertificate.complianceStandards.map((standard, index) => (
                <span key={index} className="px-3 py-1 bg-green-600/20 text-green-300 text-sm rounded-full border border-green-400/30">
                  {standard}
                </span>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => generateCertificateReport(selectedCertificate)}
              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-blue-300 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            
            <button
              onClick={() => verifyCertificate(selectedCertificate.certificateNumber)}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-400/30 rounded-lg text-green-300 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Shield className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Verifying...' : 'Verify Certificate'}</span>
            </button>
            
            <button className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/30 rounded-lg text-purple-300 transition-colors flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>Show QR Code</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalMaterialCertification;