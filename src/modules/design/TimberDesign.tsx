/**
 * Timber Design Module - SNI 7973:2019 
 * Professional timber structural design following Indonesian standards
 */

import React, { useState, useCallback } from 'react';
import { 
  Trees, 
  Calculator, 
  CheckCircle, 
  AlertTriangle, 
  Settings,
  Box,
  Target,
  Eye,
  RefreshCw,
  Shield
} from 'lucide-react';

interface TimberProperties {
  name: string;
  grade: 'I' | 'II' | 'III';
  fc: number; // Compression strength parallel to grain (MPa)
  ft: number; // Tension strength parallel to grain (MPa)
  fv: number; // Shear strength (MPa)
  E: number;  // Elastic modulus (MPa)
  density: number; // kg/m³
  moistureContent: number; // %
  code: string;
}

interface TimberSection {
  name: string;
  width: number;  // mm
  height: number; // mm
  area: number;   // mm²
  Ix: number;     // mm⁴
  Iy: number;     // mm⁴
  Zx: number;     // mm³
  Zy: number;     // mm³
}

const TimberDesign: React.FC = () => {
  const [selectedTimberGrade, setSelectedTimberGrade] = useState<TimberProperties | null>(null);
  const [selectedSection, setSelectedSection] = useState<TimberSection | null>(null);
  const [designInputs, setDesignInputs] = useState({
    length: 4000,     // mm
    moment: 50,       // kNm
    axialForce: 100,  // kN (compression positive)
    shearForce: 25,   // kN
    lateralSupport: true,
    loadDuration: 'permanent', // permanent, long-term, medium-term, short-term
    moistureService: 'dry'     // dry, wet
  });
  const [designResults, setDesignResults] = useState<any>(null);

  // Timber properties database per SNI 7973:2019
  const timberGrades: TimberProperties[] = [
    {
      name: 'Kayu Kelas I',
      grade: 'I',
      fc: 30, ft: 40, fv: 3.0,
      E: 12000, density: 800, moistureContent: 15,
      code: 'SNI 7973:2019'
    },
    {
      name: 'Kayu Kelas II', 
      grade: 'II',
      fc: 25, ft: 35, fv: 2.5,
      E: 10000, density: 700, moistureContent: 15,
      code: 'SNI 7973:2019'
    },
    {
      name: 'Kayu Kelas III',
      grade: 'III', 
      fc: 20, ft: 30, fv: 2.0,
      E: 8000, density: 600, moistureContent: 15,
      code: 'SNI 7973:2019'
    },
    {
      name: 'Glulam GL24h',
      grade: 'I',
      fc: 24, ft: 19.5, fv: 2.7,
      E: 11600, density: 420, moistureContent: 12,
      code: 'EN 14080'
    }
  ];

  // Standard timber sections
  const timberSections: TimberSection[] = [
    { name: '50 x 100', width: 50, height: 100, area: 5000, Ix: 4166667, Iy: 1041667, Zx: 83333, Zy: 41667 },
    { name: '50 x 150', width: 50, height: 150, area: 7500, Ix: 14062500, Iy: 1562500, Zx: 187500, Zy: 62500 },
    { name: '50 x 200', width: 50, height: 200, area: 10000, Ix: 33333333, Iy: 2083333, Zx: 333333, Zy: 83333 },
    { name: '75 x 150', width: 75, height: 150, area: 11250, Ix: 21093750, Iy: 3515625, Zx: 281250, Zy: 140625 },
    { name: '75 x 200', width: 75, height: 200, area: 15000, Ix: 50000000, Iy: 4687500, Zx: 500000, Zy: 187500 },
    { name: '100 x 150', width: 100, height: 150, area: 15000, Ix: 28125000, Iy: 7031250, Zx: 375000, Zy: 281250 },
    { name: '100 x 200', width: 100, height: 200, area: 20000, Ix: 66666667, Iy: 8333333, Zx: 666667, Zy: 333333 },
    { name: '150 x 200', width: 150, height: 200, area: 30000, Ix: 100000000, Iy: 18750000, Zx: 1000000, Zy: 625000 }
  ];

  const calculateTimberDesign = useCallback(() => {
    if (!selectedTimberGrade || !selectedSection) return;

    const timber = selectedTimberGrade;
    const section = selectedSection;
    
    // Load duration factors (Kd) per SNI 7973:2019
    const loadDurationFactors = {
      'permanent': 0.9,
      'long-term': 1.0,
      'medium-term': 1.15,
      'short-term': 1.25
    };
    
    // Moisture service factors (Km)
    const moistureFactors = {
      'dry': 1.0,
      'wet': 0.85
    };
    
    const Kd = loadDurationFactors[designInputs.loadDuration as keyof typeof loadDurationFactors];
    const Km = moistureFactors[designInputs.moistureService as keyof typeof moistureFactors];
    
    // Adjusted design values
    const fc_adj = timber.fc * Kd * Km;
    const ft_adj = timber.ft * Kd * Km;
    const fv_adj = timber.fv * Kd * Km;
    const E_adj = timber.E * Km;
    
    // Section properties
    const A = section.area; // mm²
    const Zx = section.Zx;  // mm³
    const Ix = section.Ix;  // mm⁴
    
    // Slenderness check for compression
    const Le = designInputs.length; // mm
    const d = section.height; // governing dimension
    const slenderness = Le / d;
    
    // Column stability factor (Cp) - simplified approach
    let Cp = 1.0;
    if (designInputs.axialForce > 0 && slenderness > 11) {
      const FE = 0.822 * E_adj / Math.pow(slenderness, 2);
      const ratio = FE / fc_adj;
      if (ratio <= 1) {
        Cp = ratio;
      } else {
        Cp = (1 + ratio) / (2 * 0.8) - Math.sqrt(Math.pow((1 + ratio) / (2 * 0.8), 2) - ratio / 0.8);
      }
    }
    
    // Design capacities
    const fc_design = fc_adj * Cp; // Adjusted compression capacity
    const ft_design = ft_adj;      // Adjusted tension capacity
    const fv_design = fv_adj;      // Adjusted shear capacity
    
    // Applied stresses
    const fa = Math.abs(designInputs.axialForce * 1000) / A; // MPa (convert kN to N)
    const fb = Math.abs(designInputs.moment * 1000000) / Zx; // MPa (convert kNm to Nmm)  
    const fvApplied = 1.5 * Math.abs(designInputs.shearForce * 1000) / A; // MPa (parabolic distribution)
    
    // Utilization ratios
    const axialUtilization = designInputs.axialForce >= 0 ? 
      (fa / fc_design) * 100 : (fa / ft_design) * 100;
    const flexureUtilization = (fb / ft_design) * 100;
    const shearUtilization = (fvApplied / fv_design) * 100;
    
    // Combined stress check for axial + bending (simplified interaction)
    let combinedUtilization = 0;
    if (Math.abs(designInputs.axialForce) > 0 && Math.abs(designInputs.moment) > 0) {
      if (designInputs.axialForce >= 0) {
        // Compression + bending
        combinedUtilization = (fa / fc_design + fb / ft_design) * 100;
      } else {
        // Tension + bending  
        combinedUtilization = (fa / ft_design + fb / ft_design) * 100;
      }
    } else {
      combinedUtilization = Math.max(axialUtilization, flexureUtilization);
    }
    
    // Deflection check (simplified)
    const allowableDeflection = Le / 240; // mm
    const appliedDeflection = (5 * designInputs.moment * 1000000 * Math.pow(Le, 2)) / (48 * E_adj * Ix); // mm (simplified)
    const deflectionUtilization = (appliedDeflection / allowableDeflection) * 100;
    
    // Safety checks
    const checks = {
      axial: axialUtilization <= 100,
      flexure: flexureUtilization <= 100,
      shear: shearUtilization <= 100,
      combined: combinedUtilization <= 100,
      deflection: deflectionUtilization <= 100,
      slenderness: slenderness <= 75,
      overall: axialUtilization <= 100 && flexureUtilization <= 100 && 
               shearUtilization <= 100 && combinedUtilization <= 100 && 
               deflectionUtilization <= 100 && slenderness <= 75
    };
    
    const results = {
      designValues: {
        fc_design: fc_design.toFixed(1),
        ft_design: ft_design.toFixed(1), 
        fv_design: fv_design.toFixed(1),
        E_adj: E_adj.toFixed(0)
      },
      appliedStresses: {
        fa: fa.toFixed(2),
        fb: fb.toFixed(2),
        fv: fvApplied.toFixed(2)
      },
      utilization: {
        axial: axialUtilization.toFixed(1),
        flexure: flexureUtilization.toFixed(1),
        shear: shearUtilization.toFixed(1),
        combined: combinedUtilization.toFixed(1),
        deflection: deflectionUtilization.toFixed(1)
      },
      factors: {
        Kd: Kd.toFixed(2),
        Km: Km.toFixed(2),
        Cp: Cp.toFixed(3)
      },
      geometry: {
        slenderness: slenderness.toFixed(1),
        allowableDeflection: allowableDeflection.toFixed(1),
        appliedDeflection: appliedDeflection.toFixed(1)
      },
      checks
    };
    
    setDesignResults(results);
  }, [selectedTimberGrade, selectedSection, designInputs]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-700 to-orange-800 rounded-xl p-6 border-2 border-gray-300 text-white">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <Trees className="w-8 h-8 mr-3" />
          Timber Design - SNI 7973:2019
        </h3>
        <p className="text-amber-100 mb-4">Professional timber structural design following Indonesian standards with comprehensive strength analysis</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-amber-100 text-sm">Timber Grades</div>
            <div className="text-xl font-bold">{timberGrades.length}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-amber-100 text-sm">Selected Grade</div>
            <div className="text-xl font-bold">{selectedTimberGrade?.grade || 'None'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-amber-100 text-sm">Section</div>
            <div className="text-xl font-bold">{selectedSection?.name || 'None'}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-amber-100 text-sm">Status</div>
            <div className="text-xl font-bold">{designResults?.checks.overall ? 'PASS' : 'CHECK'}</div>
          </div>
        </div>
      </div>

      {/* Timber Grade Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg p-4 border-2 border-gray-300 shadow-lg">
          <h4 className="text-amber-800 font-bold mb-3 flex items-center justify-between">
            <span>Timber Grades</span>
            {selectedTimberGrade && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-300 font-medium">
                Selected: {selectedTimberGrade.name}
              </span>
            )}
          </h4>
          <div className="space-y-2">
            {timberGrades.map((timber, index) => {
              const isSelected = selectedTimberGrade?.name === timber.name;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedTimberGrade(timber);
                    if (selectedSection) calculateTimberDesign();
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-green-50 border-green-500 shadow-lg text-green-800'
                      : 'bg-amber-50 border-gray-300 hover:bg-amber-100 hover:border-amber-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium ${
                      isSelected ? 'text-green-800' : 'text-amber-800'
                    }`}>
                      {timber.name}
                    </span>
                    <span className={`text-xs ${
                      isSelected ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {timber.code}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    isSelected ? 'text-green-700' : 'text-amber-600'
                  }`}>
                    fc = {timber.fc} MPa | ft = {timber.ft} MPa | E = {timber.E} MPa
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border-2 border-gray-300 shadow-lg">
          <h4 className="text-amber-800 font-bold mb-3 flex items-center justify-between">
            <span>Timber Sections</span>
            {selectedSection && (
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-300 font-medium">
                Selected: {selectedSection.name}
              </span>
            )}
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {timberSections.map((section, index) => {
              const isSelected = selectedSection?.name === section.name;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedSection(section);
                    if (selectedTimberGrade) calculateTimberDesign();
                  }}
                  className={`w-full flex justify-between items-center p-3 rounded-lg transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 shadow-lg text-blue-800'
                      : 'bg-amber-50 border-gray-300 hover:bg-amber-100 hover:border-amber-500 hover:shadow-md'
                  }`}
                >
                  <span className={`text-sm font-mono ${
                    isSelected ? 'text-blue-800 font-semibold' : 'text-amber-700'
                  }`}>
                    {section.name} mm
                  </span>
                  <div className={`text-xs ${
                    isSelected ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    A = {(section.area/100).toFixed(0)} cm² | Zx = {(section.Zx/1000).toFixed(0)} cm³
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimberDesign;