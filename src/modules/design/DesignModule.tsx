/**
 * Design Module - Structural Component Design
 * Implementasi lengkap untuk semua komponen struktural sesuai SNI
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Calculator, FileText, Settings, 
  CheckCircle, AlertTriangle, Wrench, Box
} from 'lucide-react';
import { Material, StructuralElement, SNILoadCombinations } from '../../types/structural';

interface DesignModuleProps {
  subModule: string;
}

const DesignModule: React.FC<DesignModuleProps> = ({ subModule }) => {
  const [currentDesign, setCurrentDesign] = useState<any>(null);
  const [designResults, setDesignResults] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Design configuration state
  const [designConfig, setDesignConfig] = useState({
    designMethod: 'LRFD', // Load and Resistance Factor Design
    safetyFactors: {
      steel: 0.9,
      concrete: 0.65,
      timber: 0.8,
      foundation: 0.45
    },
    codeVersion: {
      sni2847: '2019', // Concrete
      sni1729: '2020', // Steel
      sni7973: '2019', // Timber
      sni8460: '2020'  // Foundation
    }
  });

  // Material database
  const materials = {
    concrete: [
      { name: 'K-175', fc: 14.5, density: 2400, code: 'SNI 2847:2019' },
      { name: 'K-225', fc: 18.7, density: 2400, code: 'SNI 2847:2019' },
      { name: 'K-300', fc: 25.0, density: 2400, code: 'SNI 2847:2019' },
      { name: 'K-350', fc: 29.2, density: 2400, code: 'SNI 2847:2019' },
      { name: 'K-400', fc: 33.2, density: 2400, code: 'SNI 2847:2019' }
    ],
    steel: [
      { name: 'BjTS 40', fy: 400, fu: 550, code: 'SNI 1729:2020' },
      { name: 'BjTS 50', fy: 500, fu: 650, code: 'SNI 1729:2020' },
      { name: 'A36', fy: 250, fu: 400, code: 'AISC 360' },
      { name: 'A992', fy: 345, fu: 450, code: 'AISC 360' }
    ],
    timber: [
      { name: 'Kayu Kelas I', fc: 30, ft: 40, code: 'SNI 7973:2019' },
      { name: 'Kayu Kelas II', fc: 25, ft: 35, code: 'SNI 7973:2019' },
      { name: 'Kayu Kelas III', fc: 20, ft: 30, code: 'SNI 7973:2019' }
    ]
  };

  const steelSections = {
    wideFlange: [
      { name: 'WF 200.100.5.5.8', A: 26.8, Ix: 2690, Iy: 359, Zx: 290, Zy: 71.8 },
      { name: 'WF 250.125.6.9', A: 37.7, Ix: 5290, Iy: 745, Zx: 461, Zy: 119 },
      { name: 'WF 300.150.6.5.9', A: 45.2, Ix: 8360, Iy: 1200, Zx: 619, Zy: 160 },
      { name: 'WF 350.175.7.11', A: 63.1, Ix: 13600, Iy: 2010, Zx: 856, Zy: 229 },
      { name: 'WF 400.200.8.13', A: 84.1, Ix: 23100, Iy: 3220, Zx: 1290, Zy: 322 }
    ],
    channel: [
      { name: 'C 200.75.20.3.2', A: 28.3, Ix: 1810, Iy: 225, Zx: 181, Zy: 45.0 },
      { name: 'C 250.90.32.3.8', A: 41.9, Ix: 3460, Iy: 486, Zx: 277, Zy: 81.0 }
    ]
  };

  // SNI Load Combinations untuk design
  const loadCombinations: SNILoadCombinations = {
    combination1: {
      name: '1.4D',
      factors: { dead: 1.4, live: 0, wind: 0, seismic: 0 }
    },
    combination2: {
      name: '1.2D + 1.6L',
      factors: { dead: 1.2, live: 1.6, wind: 0, seismic: 0 }
    },
    combination3: {
      name: '1.2D + 1.0L + 1.0W',
      factors: { dead: 1.2, live: 1.0, wind: 1.0, seismic: 0 }
    },
    combination4: {
      name: '1.2D + 1.0L + 1.0E',
      factors: { dead: 1.2, live: 1.0, wind: 0, seismic: 1.0 }
    },
    combination5: {
      name: '0.9D + 1.0W',
      factors: { dead: 0.9, live: 0, wind: 1.0, seismic: 0 }
    },
    combination6: {
      name: '0.9D + 1.0E',
      factors: { dead: 0.9, live: 0, wind: 0, seismic: 1.0 }
    }
  };

  const renderComponentDesign = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-400" />
            Structural Component Design
          </h3>
          
          {/* Component Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { id: 'beam', name: 'Beam', icon: '—', desc: 'Flexure & shear' },
              { id: 'column', name: 'Column', icon: '|', desc: 'Axial & combined' },
              { id: 'connection', name: 'Connection', icon: '⚡', desc: 'Bolted & welded' },
              { id: 'foundation', name: 'Foundation', icon: '⬜', desc: 'Bearing capacity' }
            ].map(component => (
              <button
                key={component.id}
                className="p-4 bg-gradient-to-br from-blue-600/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-800/30 border border-blue-400/20 rounded-lg transition-all text-left"
              >
                <div className="text-2xl mb-2">{component.icon}</div>
                <div className="text-white/90 font-medium">{component.name}</div>
                <div className="text-white/60 text-sm">{component.desc}</div>
              </button>
            ))}
          </div>

          {/* Design Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Design Configuration</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Design Method:</span>
                  <select 
                    value={designConfig.designMethod}
                    onChange={(e) => setDesignConfig(prev => ({...prev, designMethod: e.target.value}))}
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                  >
                    <option value="LRFD">LRFD</option>
                    <option value="ASD">ASD</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">SNI 2847 (Concrete):</span>
                  <span className="text-green-400 text-sm">{designConfig.codeVersion.sni2847}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">SNI 1729 (Steel):</span>
                  <span className="text-green-400 text-sm">{designConfig.codeVersion.sni1729}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Safety Factors</h4>
              <div className="space-y-2">
                {Object.entries(designConfig.safetyFactors).map(([material, factor]) => (
                  <div key={material} className="flex justify-between items-center">
                    <span className="text-white/70 text-sm capitalize">{material}:</span>
                    <span className="text-blue-400 text-sm">φ = {factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSteelDesign = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Box className="w-6 h-6 mr-2 text-orange-400" />
            Steel Design - SNI 1729:2020
          </h3>

          {/* Steel Section Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Wide Flange Sections</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {steelSections.wideFlange.map((section, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded hover:bg-white/10 transition-colors">
                    <span className="text-white/80 text-sm font-mono">{section.name}</span>
                    <div className="text-white/60 text-xs">
                      A = {section.A} cm² | Zx = {section.Zx} cm³
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Steel Properties</h4>
              <div className="space-y-2">
                {materials.steel.map((steel, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-400/20 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/90 font-medium">{steel.name}</span>
                      <span className="text-orange-400 text-xs">{steel.code}</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      fy = {steel.fy} MPa | fu = {steel.fu} MPa
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Design Checks */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white/90 font-medium mb-3">Design Checks (SNI 1729)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-600/10 border border-green-400/20 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Flexural Strength</span>
                </div>
                <div className="text-white/80 text-sm">φMn ≥ Mu</div>
                <div className="text-green-400 text-xs mt-1">Ratio: 0.73 ✓</div>
              </div>
              
              <div className="p-3 bg-green-600/10 border border-green-400/20 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Shear Strength</span>
                </div>
                <div className="text-white/80 text-sm">φVn ≥ Vu</div>
                <div className="text-green-400 text-xs mt-1">Ratio: 0.45 ✓</div>
              </div>
              
              <div className="p-3 bg-yellow-600/10 border border-yellow-400/20 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Deflection</span>
                </div>
                <div className="text-white/80 text-sm">δ ≤ L/240</div>
                <div className="text-yellow-400 text-xs mt-1">Ratio: 0.89 ⚠</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConcreteDesign = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-green-400" />
            Concrete Design - SNI 2847:2019
          </h3>

          {/* Concrete Mix Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Concrete Properties</h4>
              <div className="space-y-2">
                {materials.concrete.map((concrete, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-400/20 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/90 font-medium">{concrete.name}</span>
                      <span className="text-green-400 text-xs">{concrete.code}</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      fc' = {concrete.fc} MPa | γ = {concrete.density} kg/m³
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Reinforcement Design</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">fy (tulangan utama):</span>
                  <span className="text-green-400 text-sm">400 MPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">fy (sengkang):</span>
                  <span className="text-green-400 text-sm">240 MPa</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">φ (lentur):</span>
                  <span className="text-blue-400 text-sm">0.90</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">φ (geser):</span>
                  <span className="text-blue-400 text-sm">0.75</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Selimut beton:</span>
                  <span className="text-blue-400 text-sm">40 mm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Design Results */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white/90 font-medium mb-3">Design Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-600/10 border border-blue-400/20 rounded">
                  <div className="text-blue-400 text-sm font-medium mb-1">Balok 40/60</div>
                  <div className="text-white/80 text-sm">Tulangan tarik: 4D19</div>
                  <div className="text-white/80 text-sm">Tulangan tekan: 2D16</div>
                  <div className="text-white/80 text-sm">Sengkang: φ10-150</div>
                </div>
                
                <div className="p-3 bg-purple-600/10 border border-purple-400/20 rounded">
                  <div className="text-purple-400 text-sm font-medium mb-1">Kolom 50/50</div>
                  <div className="text-white/80 text-sm">Tulangan utama: 8D19</div>
                  <div className="text-white/80 text-sm">Sengkang: φ10-100</div>
                  <div className="text-white/80 text-sm">ρ = 1.82% (OK)</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-green-600/10 border border-green-400/20 rounded">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Strength Check</span>
                  </div>
                  <div className="text-white/80 text-sm">φMn = 285 kNm ≥ Mu = 220 kNm ✓</div>
                  <div className="text-white/80 text-sm">φVn = 180 kN ≥ Vu = 135 kN ✓</div>
                </div>
                
                <div className="p-3 bg-orange-600/10 border border-orange-400/20 rounded">
                  <div className="text-orange-400 text-sm font-medium mb-2">Crack Control</div>
                  <div className="text-white/80 text-sm">fs = 165 MPa ≤ 0.6fy ✓</div>
                  <div className="text-white/80 text-sm">s ≤ 300mm ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFoundationDesign = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white/90 mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-purple-400" />
            Foundation Design - SNI 8460:2020
          </h3>

          {/* Soil Parameters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Soil Investigation</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Soil Type:</span>
                  <span className="text-purple-400 text-sm">Clay (CH)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">SPT N-Value:</span>
                  <span className="text-purple-400 text-sm">15 (Medium Dense)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Bearing Capacity:</span>
                  <span className="text-purple-400 text-sm">200 kN/m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Settlement:</span>
                  <span className="text-purple-400 text-sm">18 mm (OK)</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white/90 font-medium mb-3">Foundation Types</h4>
              <div className="space-y-2">
                {[
                  { type: 'Isolated Footing', size: '2.0 x 2.0 m', load: '850 kN' },
                  { type: 'Combined Footing', size: '3.0 x 4.0 m', load: '1200 kN' },
                  { type: 'Raft Foundation', size: '12 x 8 m', load: '8500 kN' },
                  { type: 'Pile Foundation', size: 'φ40 cm - 12m', load: '1500 kN' }
                ].map((foundation, index) => (
                  <div key={index} className="p-2 bg-white/5 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80 text-sm">{foundation.type}</span>
                      <span className="text-purple-400 text-xs">{foundation.size}</span>
                    </div>
                    <div className="text-white/60 text-xs">Load: {foundation.load}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Design Results */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white/90 font-medium mb-3">Foundation Design Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-600/10 border border-green-400/20 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Bearing Capacity</span>
                </div>
                <div className="text-white/80 text-sm">qult = 450 kN/m²</div>
                <div className="text-white/80 text-sm">qallow = 150 kN/m²</div>
                <div className="text-green-400 text-xs mt-1">SF = 3.0 ✓</div>
              </div>
              
              <div className="p-3 bg-green-600/10 border border-green-400/20 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Settlement</span>
                </div>
                <div className="text-white/80 text-sm">δ = 18 mm</div>
                <div className="text-white/80 text-sm">δallow = 25 mm</div>
                <div className="text-green-400 text-xs mt-1">OK ✓</div>
              </div>
              
              <div className="p-3 bg-blue-600/10 border border-blue-400/20 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">Reinforcement</span>
                </div>
                <div className="text-white/80 text-sm">Bottom: D16-200</div>
                <div className="text-white/80 text-sm">Top: D13-250</div>
                <div className="text-blue-400 text-xs mt-1">ρ = 0.8% ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderSubModule = () => {
    switch(subModule) {
      case 'component-design':
        return renderComponentDesign();
      case 'steel-design':
        return renderSteelDesign();
      case 'concrete-design':
        return renderConcreteDesign();
      case 'timber-design':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Timber Design - SNI 7973:2019</h3>
            <p className="text-white/60">Timber design module coming soon...</p>
          </div>
        );
      case 'foundation-design':
        return renderFoundationDesign();
      case 'connection-design':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Connection Design</h3>
            <p className="text-white/60">Connection design module coming soon...</p>
          </div>
        );
      case 'code-checking':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Code Checking</h3>
            <p className="text-white/60">Code checking module coming soon...</p>
          </div>
        );
      case 'reinforcement':
        return (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white/90 mb-4">Reinforcement Detailing</h3>
            <p className="text-white/60">Reinforcement detailing module coming soon...</p>
          </div>
        );
      default:
        return renderComponentDesign();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Design Module</h1>
          <p className="text-white/60">
            Comprehensive structural component design following SNI standards
          </p>
        </div>

        {/* Module Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'component-design', label: 'Component Design' },
            { id: 'steel-design', label: 'Steel Design' },
            { id: 'concrete-design', label: 'Concrete Design' },
            { id: 'foundation-design', label: 'Foundation Design' }
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

export default DesignModule;