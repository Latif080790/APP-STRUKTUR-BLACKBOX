/**
 * Standards Validation Module
 * Comprehensive validation system for structural engineering standards
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertTriangle, X, 
  FileText, Download, Settings, RefreshCw,
  Globe, Flag, Book, AlertCircle, 
  Clock, Star, Filter, Search
} from 'lucide-react';

interface StandardsValidationProps {
  subModule: string;
}

const StandardsValidation: React.FC<StandardsValidationProps> = ({ subModule }) => {
  const [selectedStandard, setSelectedStandard] = useState('sni');
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);

  // Indonesian SNI Standards
  const sniStandards = [
    {
      id: 'sni1726',
      code: 'SNI 1726:2019',
      title: 'Tata Cara Perencanaan Ketahanan Gempa untuk Struktur Bangunan Gedung dan Non-gedung',
      category: 'Seismic Design',
      status: 'Active',
      lastUpdate: '2019-12-20',
      description: 'Standard untuk perencanaan struktur tahan gempa di Indonesia',
      keyRequirements: [
        'Analisis respons spektrum',
        'Kontrol drift antar lantai',
        'Detailing khusus untuk daerah seismik',
        'Faktor reduksi gempa (R)',
        'Sistem penahan gaya lateral'
      ],
      validationChecks: [
        { item: 'Response spectrum analysis', status: 'passed', description: 'Analysis method complies with SNI 1726' },
        { item: 'Drift limitations', status: 'passed', description: 'Inter-story drift ≤ 0.020h' },
        { item: 'Seismic detailing', status: 'warning', description: 'Review special detailing requirements' },
        { item: 'Base shear check', status: 'passed', description: 'Minimum base shear requirements met' }
      ]
    },
    {
      id: 'sni1727',
      code: 'SNI 1727:2020',
      title: 'Beban Desain Minimum dan Kriteria Terkait untuk Bangunan Gedung dan Struktur Lain',
      category: 'Load Standards',
      status: 'Active',
      lastUpdate: '2020-01-15',
      description: 'Standard pembebanan untuk perencanaan struktur',
      keyRequirements: [
        'Beban mati dan beban hidup',
        'Beban angin',
        'Beban hujan dan salju',
        'Kombinasi pembebanan',
        'Faktor beban dan reduksi'
      ],
      validationChecks: [
        { item: 'Dead load calculation', status: 'passed', description: 'Dead loads properly calculated' },
        { item: 'Live load requirements', status: 'passed', description: 'Live loads meet minimum requirements' },
        { item: 'Load combinations', status: 'passed', description: 'All required combinations included' },
        { item: 'Load factors', status: 'passed', description: 'Correct load factors applied' }
      ]
    },
    {
      id: 'sni2847',
      code: 'SNI 2847:2019',
      title: 'Persyaratan Beton Struktural untuk Bangunan Gedung dan Penjelasan',
      category: 'Concrete Design',
      status: 'Active',
      lastUpdate: '2019-10-30',
      description: 'Standard untuk perencanaan struktur beton bertulang',
      keyRequirements: [
        'Kuat tekan beton minimum',
        'Perencanaan lentur dan geser',
        'Detail penulangan',
        'Kontrol retak dan lendutan',
        'Sambungan dan penyaluran'
      ],
      validationChecks: [
        { item: 'Concrete strength', status: 'passed', description: 'fc\' meets minimum requirements' },
        { item: 'Flexural design', status: 'passed', description: 'Moment capacity adequate' },
        { item: 'Shear design', status: 'passed', description: 'Shear reinforcement sufficient' },
        { item: 'Reinforcement detailing', status: 'warning', description: 'Check minimum spacing requirements' }
      ]
    },
    {
      id: 'sni1729',
      code: 'SNI 1729:2020',
      title: 'Spesifikasi untuk Bangunan Gedung Baja Struktural',
      category: 'Steel Design',
      status: 'Active',
      lastUpdate: '2020-02-28',
      description: 'Standard untuk perencanaan struktur baja',
      keyRequirements: [
        'Kekuatan material baja',
        'Perencanaan lentur, tekan, dan tarik',
        'Stabilitas dan tekuk',
        'Sambungan baut dan las',
        'Kontrol lendutan'
      ],
      validationChecks: [
        { item: 'Steel grade compliance', status: 'passed', description: 'Steel grades meet SNI requirements' },
        { item: 'Member capacity', status: 'passed', description: 'All members have adequate capacity' },
        { item: 'Connection design', status: 'passed', description: 'Connections properly designed' },
        { item: 'Stability checks', status: 'passed', description: 'Lateral-torsional buckling checked' }
      ]
    }
  ];

  // International Standards
  const internationalStandards = [
    {
      id: 'asce7',
      code: 'ASCE 7-22',
      title: 'Minimum Design Loads and Associated Criteria for Buildings and Other Structures',
      country: 'USA',
      category: 'Load Standards',
      status: 'Active',
      description: 'American standard for structural loads and design criteria'
    },
    {
      id: 'aci318',
      code: 'ACI 318-19',
      title: 'Building Code Requirements for Structural Concrete',
      country: 'USA',
      category: 'Concrete Design',
      status: 'Active',
      description: 'American Concrete Institute standard for concrete design'
    },
    {
      id: 'aisc360',
      code: 'AISC 360-22',
      title: 'Specification for Structural Steel Buildings',
      country: 'USA',
      category: 'Steel Design',
      status: 'Active',
      description: 'American Institute of Steel Construction specification'
    },
    {
      id: 'eurocode1',
      code: 'EN 1991',
      title: 'Eurocode 1: Actions on structures',
      country: 'Europe',
      category: 'Load Standards',
      status: 'Active',
      description: 'European standard for structural actions and loads'
    },
    {
      id: 'eurocode2',
      code: 'EN 1992',
      title: 'Eurocode 2: Design of concrete structures',
      country: 'Europe',
      category: 'Concrete Design',
      status: 'Active',
      description: 'European standard for concrete design'
    },
    {
      id: 'eurocode3',
      code: 'EN 1993',
      title: 'Eurocode 3: Design of steel structures',
      country: 'Europe',
      category: 'Steel Design',
      status: 'Active',
      description: 'European standard for steel design'
    }
  ];

  const customStandards = [
    {
      id: 'custom1',
      name: 'Company Design Standard v2.1',
      description: 'Internal company standards for structural design',
      category: 'Internal',
      lastUpdated: '2023-12-15',
      status: 'Active'
    },
    {
      id: 'custom2',
      name: 'Project-Specific Requirements',
      description: 'Special requirements for high-rise buildings',
      category: 'Project',
      lastUpdated: '2024-01-05',
      status: 'Active'
    }
  ];

  const renderSNIStandards = () => {
    const overallCompliance = sniStandards.reduce((acc, standard) => {
      const passedChecks = standard.validationChecks.filter(check => check.status === 'passed').length;
      return acc + (passedChecks / standard.validationChecks.length);
    }, 0) / sniStandards.length;

    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white/90 flex items-center">
              <Flag className="w-6 h-6 mr-2 text-red-400" />
              SNI Standards (Indonesia)
            </h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{(overallCompliance * 100).toFixed(1)}%</div>
              <div className="text-white/60 text-sm">Overall Compliance</div>
            </div>
          </div>

          <div className="space-y-6">
            {sniStandards.map(standard => (
              <div key={standard.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-white/90 font-bold text-lg">{standard.code}</h4>
                    <p className="text-white/70 text-sm mt-1">{standard.title}</p>
                    <div className="flex items-center space-x-4 text-xs text-white/60 mt-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated: {standard.lastUpdate}</span>
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        standard.status === 'Active' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                      }`}>
                        {standard.status}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      standard.category === 'Seismic Design' ? 'bg-red-600/20 text-red-400' :
                      standard.category === 'Load Standards' ? 'bg-blue-600/20 text-blue-400' :
                      standard.category === 'Concrete Design' ? 'bg-green-600/20 text-green-400' :
                      'bg-orange-600/20 text-orange-400'
                    }`}>
                      {standard.category}
                    </span>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">{standard.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Requirements */}
                  <div>
                    <h5 className="text-white/80 font-medium mb-3">Key Requirements:</h5>
                    <ul className="space-y-2">
                      {standard.keyRequirements.map((req, index) => (
                        <li key={index} className="text-white/70 text-sm flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Validation Results */}
                  <div>
                    <h5 className="text-white/80 font-medium mb-3">Validation Results:</h5>
                    <div className="space-y-2">
                      {standard.validationChecks.map((check, index) => (
                        <div key={index} className={`p-3 rounded border ${
                          check.status === 'passed' ? 'bg-green-600/10 border-green-400/20' :
                          check.status === 'warning' ? 'bg-yellow-600/10 border-yellow-400/20' :
                          'bg-red-600/10 border-red-400/20'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {check.status === 'passed' ? 
                              <CheckCircle className="w-4 h-4 text-green-400" /> :
                              check.status === 'warning' ?
                              <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                              <X className="w-4 h-4 text-red-400" />
                            }
                            <span className={`text-sm font-medium ${
                              check.status === 'passed' ? 'text-green-400' :
                              check.status === 'warning' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {check.item}
                            </span>
                          </div>
                          <p className="text-white/70 text-xs ml-6">{check.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-4">
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Re-validate</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInternationalStandards = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-400" />
            International Standards
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalStandards.map(standard => (
              <div key={standard.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white/90 font-bold">{standard.code}</h4>
                    <p className="text-white/60 text-sm">{standard.country}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    standard.status === 'Active' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                  }`}>
                    {standard.status}
                  </span>
                </div>

                <h5 className="text-white/80 font-medium text-sm mb-2">{standard.title}</h5>
                <p className="text-white/70 text-xs mb-3">{standard.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs ${
                    standard.category === 'Load Standards' ? 'bg-blue-600/20 text-blue-400' :
                    standard.category === 'Concrete Design' ? 'bg-green-600/20 text-green-400' :
                    'bg-orange-600/20 text-orange-400'
                  }`}>
                    {standard.category}
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Enable Validation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomStandards = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white/90 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-purple-400" />
              Custom Standards
            </h3>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/20 rounded transition-all">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Add Standard</span>
            </button>
          </div>

          <div className="space-y-4">
            {customStandards.map(standard => (
              <div key={standard.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white/90 font-medium">{standard.name}</h4>
                    <p className="text-white/70 text-sm mt-1">{standard.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-white/60 mt-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated: {standard.lastUpdated}</span>
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        standard.category === 'Internal' ? 'bg-blue-600/20 text-blue-400' : 'bg-green-600/20 text-green-400'
                      }`}>
                        {standard.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 rounded transition-all">
                      <Settings className="w-4 h-4 text-blue-400" />
                    </button>
                    <button className="p-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/20 rounded transition-all">
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderComplianceChecker = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-green-400" />
            Compliance Checker
          </h3>

          {/* Quick Compliance Check */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
            <h4 className="text-white/90 font-medium mb-4">Quick Compliance Check</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Select Project:</label>
                <select className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
                  <option>High-Rise Building Project</option>
                  <option>Commercial Complex</option>
                  <option>Industrial Warehouse</option>
                </select>
              </div>
              <div>
                <label className="text-white/70 text-sm mb-2 block">Standards to Check:</label>
                <select className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
                  <option>All SNI Standards</option>
                  <option>SNI + International</option>
                  <option>Custom Selection</option>
                </select>
              </div>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600/20 hover:bg-green-600/30 border border-green-400/20 rounded transition-all">
              <Shield className="w-5 h-5" />
              <span>Run Compliance Check</span>
            </button>
          </div>

          {/* Compliance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-600/10 rounded-lg p-4 border border-green-400/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white/90">87%</div>
                  <div className="text-green-400 text-sm">Compliant</div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-600/10 rounded-lg p-4 border border-yellow-400/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-white/90">8%</div>
                  <div className="text-yellow-400 text-sm">Warnings</div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-600/10 rounded-lg p-4 border border-red-400/20">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <div>
                  <div className="text-2xl font-bold text-white/90">5%</div>
                  <div className="text-red-400 text-sm">Non-compliant</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-600/10 rounded-lg p-4 border border-blue-400/20">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white/90">12</div>
                  <div className="text-blue-400 text-sm">Checks Run</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStandardUpdates = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <RefreshCw className="w-6 h-6 mr-2 text-cyan-400" />
            Standard Updates
          </h3>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔄</div>
            <h4 className="text-white/90 font-medium mb-2">Automatic Updates</h4>
            <p className="text-white/60 mb-6">Stay up-to-date with the latest versions of structural engineering standards. We monitor updates from BSN, AISC, ACI, and other organizations.</p>
            <button className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-400/20 rounded-lg text-cyan-400 transition-all">
              Check for Updates
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderSubModule = () => {
    switch(subModule) {
      case 'sni-standards':
        return renderSNIStandards();
      case 'asce-standards':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">ASCE Standards</h3>
            <p className="text-white/60">ASCE standards validation coming soon...</p>
          </div>
        );
      case 'eurocode':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Eurocode Standards</h3>
            <p className="text-white/60">Eurocode validation coming soon...</p>
          </div>
        );
      case 'aci-standards':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">ACI Standards</h3>
            <p className="text-white/60">ACI standards validation coming soon...</p>
          </div>
        );
      case 'aisc-standards':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">AISC Standards</h3>
            <p className="text-white/60">AISC standards validation coming soon...</p>
          </div>
        );
      case 'custom-standards':
        return renderCustomStandards();
      case 'compliance-checker':
        return renderComplianceChecker();
      case 'standard-updates':
        return renderStandardUpdates();
      default:
        return renderSNIStandards();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Validasi Standar</h1>
          <p className="text-white/60">
            Comprehensive validation system for structural engineering standards compliance
          </p>
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'sni-standards', label: 'SNI Standards' },
            { id: 'compliance-checker', label: 'Compliance Checker' },
            { id: 'custom-standards', label: 'Custom Standards' },
            { id: 'standard-updates', label: 'Updates' }
          ].map(item => (
            <button
              key={item.id}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                subModule === item.id
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-400/30'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderSubModule()}
      </div>
    </div>
  );
};

export default StandardsValidation;