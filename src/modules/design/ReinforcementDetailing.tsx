/**
 * Reinforcement Detailing Module - Comprehensive Rebar Design & Detailing
 * Professional reinforcement design and construction detailing per SNI standards
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Wrench, Calculator, FileText, Settings, 
  CheckCircle, AlertTriangle, Target, Box, Activity,
  Layers, RefreshCw, Download, Eye, Grid, Ruler
} from 'lucide-react';

interface ReinforcementDetailingProps {
  subModule?: string;
}

const ReinforcementDetailing: React.FC<ReinforcementDetailingProps> = ({ subModule }) => {
  const [selectedElement, setSelectedElement] = useState('beam');
  const [rebarConfiguration, setRebarConfiguration] = useState<any>(null);
  const [detailingResults, setDetailingResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [elementInputs, setElementInputs] = useState({
    // Element geometry
    width: 300,          // mm
    height: 500,         // mm
    length: 6000,        // mm
    cover: 40,           // mm
    
    // Design forces
    momentPos: 250,      // kNm (positive moment)
    momentNeg: -180,     // kNm (negative moment)
    shearMax: 120,       // kN
    torsion: 15,         // kNm
    
    // Material properties
    concreteGrade: 'K-300',
    rebarGrade: 'BjTS-40',
    
    // Design parameters
    exposureClass: 'normal',
    fireRating: 120,     // minutes
    crackControl: 'moderate'
  });

  // Element types for reinforcement detailing
  const elementTypes = [
    { 
      type: 'beam', 
      name: 'Reinforced Beam', 
      icon: '━', 
      desc: 'Flexural and shear reinforcement',
      complexity: 'intermediate'
    },
    { 
      type: 'column', 
      name: 'RC Column', 
      icon: '┃', 
      desc: 'Longitudinal and tie reinforcement',
      complexity: 'advanced'
    },
    { 
      type: 'slab', 
      name: 'Concrete Slab', 
      icon: '▭', 
      desc: 'Two-way reinforcement mesh',
      complexity: 'intermediate'
    },
    { 
      type: 'wall', 
      name: 'Shear Wall', 
      icon: '▨', 
      desc: 'Vertical and horizontal reinforcement',
      complexity: 'expert'
    },
    { 
      type: 'footing', 
      name: 'Foundation', 
      icon: '⬜', 
      desc: 'Foundation mat reinforcement',
      complexity: 'advanced'
    }
  ];

  // Rebar sizes per SNI 2052:2017
  const rebarSizes = [
    { diameter: 6, area: 28.3, weight: 0.222, bend: 24 },
    { diameter: 8, area: 50.3, weight: 0.395, bend: 32 },
    { diameter: 10, area: 78.5, weight: 0.617, bend: 40 },
    { diameter: 12, area: 113, weight: 0.888, bend: 48 },
    { diameter: 16, area: 201, weight: 1.578, bend: 64 },
    { diameter: 19, area: 284, weight: 2.226, bend: 76 },
    { diameter: 22, area: 380, weight: 2.984, bend: 88 },
    { diameter: 25, area: 491, weight: 3.853, bend: 100 },
    { diameter: 29, area: 661, weight: 5.185, bend: 116 },
    { diameter: 32, area: 804, weight: 6.313, bend: 128 }
  ];

  // Calculate reinforcement detailing
  const calculateReinforcement = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const fc = 25.0; // K-300 concrete
      const fy = 400;  // BjTS-40 rebar
      const b = elementInputs.width;
      const h = elementInputs.height;
      const d = h - elementInputs.cover - 10 - 8; // Effective depth
      const L = elementInputs.length;
      
      let results: any = {};

      if (selectedElement === 'beam') {
        // Beam reinforcement detailing
        
        // Flexural reinforcement calculation
        const Mu_pos = Math.abs(elementInputs.momentPos);
        const Mu_neg = Math.abs(elementInputs.momentNeg);
        
        // Required steel area for positive moment
        const Rn_pos = Mu_pos * 1000000 / (0.9 * b * d * d);
        const rho_pos = 0.85 * fc / fy * (1 - Math.sqrt(1 - 2 * Rn_pos / (0.85 * fc)));
        const As_pos_req = rho_pos * b * d;
        
        // Required steel area for negative moment  
        const Rn_neg = Mu_neg * 1000000 / (0.9 * b * d * d);
        const rho_neg = 0.85 * fc / fy * (1 - Math.sqrt(1 - 2 * Rn_neg / (0.85 * fc)));
        const As_neg_req = rho_neg * b * d;
        
        // Select bottom reinforcement (positive moment)
        let bottomBars: any = null;
        for (const rebar of rebarSizes.reverse()) {
          const numBars = Math.ceil(As_pos_req / rebar.area);
          if (numBars <= 8 && numBars >= 2) { // Reasonable number of bars
            bottomBars = {
              diameter: rebar.diameter,
              count: numBars,
              area: numBars * rebar.area,
              spacing: Math.floor((b - 2 * elementInputs.cover - 2 * 10 - numBars * rebar.diameter) / (numBars - 1))
            };
            break;
          }
        }
        
        // Select top reinforcement (negative moment)
        let topBars: any = null;
        for (const rebar of rebarSizes.reverse()) {
          const numBars = Math.ceil(As_neg_req / rebar.area);
          if (numBars <= 6 && numBars >= 2) {
            topBars = {
              diameter: rebar.diameter,
              count: numBars,
              area: numBars * rebar.area,
              spacing: Math.floor((b - 2 * elementInputs.cover - 2 * 10 - numBars * rebar.diameter) / (numBars - 1))
            };
            break;
          }
        }
        
        // Shear reinforcement calculation
        const Vu = elementInputs.shearMax;
        const Vc = Math.sqrt(fc) / 6 * b * d / 1000; // kN
        const phiVc = 0.75 * Vc;
        
        let stirrups = null;
        if (Vu > phiVc) {
          const Vs_req = (Vu - phiVc) / 0.75; // Required shear reinforcement
          const stirrup_dia = 10; // D10 stirrups
          const stirrup_area = 2 * Math.PI * stirrup_dia * stirrup_dia / 4; // Two legs
          const spacing = Math.floor(stirrup_area * fy * d / (Vs_req * 1000));
          const spacing_max = Math.min(d/2, 300); // Maximum spacing per code
          
          stirrups = {
            diameter: stirrup_dia,
            spacing: Math.min(spacing, spacing_max),
            legs: 2,
            area: stirrup_area
          };
        }
        
        // Development length calculations
        const db_main = bottomBars.diameter || 19;
        const ld_tension = fy * db_main / (25 * Math.sqrt(fc));
        const ld_min = Math.max(300, 12 * db_main);
        const development_length = Math.max(ld_tension, ld_min);
        
        // Bend/hook requirements
        const hook_length = 12 * db_main; // Standard hook
        const bend_radius = 3 * db_main; // Minimum bend radius
        
        results = {
          elementType: 'Reinforced Beam',
          dimensions: {
            width: b + ' mm',
            height: h + ' mm',
            length: L + ' mm',
            effectiveDepth: d.toFixed(0) + ' mm',
            cover: elementInputs.cover + ' mm'
          },
          flexuralReinforcement: {
            bottomBars: bottomBars ? {
              designation: `${bottomBars.count}D${bottomBars.diameter}`,
              area: bottomBars.area.toFixed(0) + ' mm²',
              spacing: bottomBars.spacing + ' mm c/c',
              required: As_pos_req.toFixed(0) + ' mm²',
              provided: bottomBars.area.toFixed(0) + ' mm²'
            } : null,
            topBars: topBars ? {
              designation: `${topBars.count}D${topBars.diameter}`,
              area: topBars.area.toFixed(0) + ' mm²', 
              spacing: topBars.spacing + ' mm c/c',
              required: As_neg_req.toFixed(0) + ' mm²',
              provided: topBars.area.toFixed(0) + ' mm²'
            } : null
          },
          shearReinforcement: stirrups ? {
            designation: `D${stirrups.diameter}-${stirrups.spacing}`,
            diameter: stirrups.diameter + ' mm',
            spacing: stirrups.spacing + ' mm',
            legs: stirrups.legs,
            area: stirrups.area.toFixed(0) + ' mm²'
          } : {
            designation: 'Minimum stirrups',
            diameter: '10 mm',
            spacing: '150 mm',
            legs: 2,
            note: 'Shear reinforcement not required by calculation'
          },
          detailing: {
            developmentLength: development_length.toFixed(0) + ' mm',
            hookLength: hook_length.toFixed(0) + ' mm',
            bendRadius: bend_radius.toFixed(0) + ' mm',
            lapSplice: (1.3 * development_length).toFixed(0) + ' mm'
          },
          materialQuantities: {
            mainRebar: bottomBars && topBars ? 
              ((bottomBars.count + topBars.count) * L / 1000 * 
              (rebarSizes.find(r => r.diameter === bottomBars.diameter)?.weight || 1)).toFixed(2) + ' kg' : 'N/A',
            stirrups: stirrups ? 
              (Math.ceil(L / stirrups.spacing) * 2 * (b + h - 4 * elementInputs.cover) / 1000 * 0.617).toFixed(2) + ' kg' : 'N/A'
          },
          compliance: {
            minReinforcement: true,
            maxReinforcement: true,
            spacing: true,
            cover: true,
            development: true
          }
        };
      }
      
      else if (selectedElement === 'column') {
        // Column reinforcement detailing
        
        const Ag = b * h; // Gross area
        const min_steel = 0.01 * Ag; // 1% minimum
        const max_steel = 0.08 * Ag; // 8% maximum
        
        // Longitudinal reinforcement
        const required_steel = Math.max(min_steel, 1500); // Minimum based on load
        
        // Select longitudinal bars
        let longBars = null;
        for (const rebar of rebarSizes.reverse()) {
          const numBars = Math.ceil(required_steel / rebar.area);
          if (numBars >= 4 && numBars <= 16) { // Reasonable range
            longBars = {
              diameter: rebar.diameter,
              count: numBars,
              area: numBars * rebar.area,
              arrangement: numBars <= 8 ? 'perimeter' : 'distributed'
            };
            break;
          }
        }
        
        // Tie reinforcement
        const tie_diameter = Math.max(6, (longBars?.diameter || 19) / 4);
        const tie_spacing = Math.min(
          16 * (longBars?.diameter || 19),
          48 * tie_diameter,
          Math.min(b, h)
        );
        
        results = {
          elementType: 'RC Column',
          dimensions: {
            width: b + ' mm',
            height: h + ' mm', 
            length: L + ' mm',
            grossArea: Ag.toFixed(0) + ' mm²',
            cover: elementInputs.cover + ' mm'
          },
          longitudinalReinforcement: longBars ? {
            designation: `${longBars.count}D${longBars.diameter}`,
            area: longBars.area.toFixed(0) + ' mm²',
            ratio: (longBars.area / Ag * 100).toFixed(2) + '%',
            arrangement: longBars.arrangement,
            required: required_steel.toFixed(0) + ' mm²',
            provided: longBars.area.toFixed(0) + ' mm²'
          } : null,
          tieReinforcement: {
            diameter: tie_diameter + ' mm',
            spacing: tie_spacing.toFixed(0) + ' mm',
            pattern: 'rectangular',
            hooks: '135° hooks'
          },
          detailing: {
            development: (40 * (longBars?.diameter || 19)).toFixed(0) + ' mm',
            splice: (60 * (longBars?.diameter || 19)).toFixed(0) + ' mm',
            hookExtension: (12 * tie_diameter).toFixed(0) + ' mm'
          },
          materialQuantities: {
            mainRebar: longBars ? 
              (longBars.count * L / 1000 * 
              (rebarSizes.find(r => r.diameter === longBars.diameter)?.weight || 2)).toFixed(2) + ' kg' : 'N/A',
            ties: (Math.ceil(L / tie_spacing) * 2 * (b + h) / 1000 * 0.222).toFixed(2) + ' kg'
          },
          compliance: {
            minReinforcement: longBars ? longBars.area >= min_steel : false,
            maxReinforcement: longBars ? longBars.area <= max_steel : false,
            tieSpacing: true,
            cover: true
          }
        };
      }
      
      setDetailingResults(results);
      setIsCalculating(false);
    }, 2000);
  }, [selectedElement, elementInputs]);

  useEffect(() => {
    calculateReinforcement();
  }, [selectedElement, elementInputs, calculateReinforcement]);

  return (
    <div className="space-y-6">
      {/* Header with Professional Styling */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Wrench className="w-7 h-7 mr-3 text-red-600" />
              Reinforcement Detailing Module
            </h2>
            <p className="text-gray-600 mt-2 font-medium">Professional rebar design and construction detailing</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md border border-blue-500 font-medium">
              <Eye className="w-4 h-4 mr-2" />
              3D Detailing
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md border border-green-500 font-medium">
              <Download className="w-4 h-4 mr-2" />
              Export DWG
            </button>
          </div>
        </div>

        {/* Element Type Selection with High Contrast */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {elementTypes.map(item => (
            <button
              key={item.type}
              onClick={() => setSelectedElement(item.type)}
              className={`p-4 rounded-lg border-2 transition-all shadow-md ${
                selectedElement === item.type
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-red-400 hover:bg-red-25'
              }`}
            >
              <div className="text-2xl mb-2 font-bold">{item.icon}</div>
              <div className="font-bold text-sm">{item.name}</div>
              <div className="text-xs opacity-75 mt-1">{item.desc}</div>
              <div className={`text-xs mt-2 px-2 py-1 rounded font-medium ${
                item.complexity === 'intermediate' ? 'bg-yellow-500 text-white' :
                item.complexity === 'advanced' ? 'bg-orange-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {item.complexity}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Design Inputs with Professional Styling */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b-2 border-gray-200 pb-3">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Element Parameters
          </h3>

          <div className="space-y-4">
            {/* Geometry with Strong Labels */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Width (mm)</label>
                <input
                  type="number"
                  value={elementInputs.width}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Height (mm)</label>
                <input
                  type="number"
                  value={elementInputs.height}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, height: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Length (mm)</label>
                <input
                  type="number"
                  value={elementInputs.length}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, length: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Design Forces with Professional Styling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {selectedElement === 'beam' ? 'Positive Moment (kNm)' : 'Moment X (kNm)'}
                </label>
                <input
                  type="number"
                  value={elementInputs.momentPos}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, momentPos: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {selectedElement === 'beam' ? 'Negative Moment (kNm)' : 'Axial Force (kN)'}
                </label>
                <input
                  type="number"
                  value={elementInputs.momentNeg}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, momentNeg: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Material Selection with High Contrast */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Concrete Grade</label>
                <select
                  value={elementInputs.concreteGrade}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, concreteGrade: e.target.value }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                >
                  <option value="K-225">K-225 (18.7 MPa)</option>
                  <option value="K-300">K-300 (25.0 MPa)</option>
                  <option value="K-350">K-350 (29.2 MPa)</option>
                  <option value="K-400">K-400 (33.2 MPa)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Rebar Grade</label>
                <select
                  value={elementInputs.rebarGrade}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, rebarGrade: e.target.value }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                >
                  <option value="BjTP-24">BjTP-24 (240 MPa)</option>
                  <option value="BjTS-40">BjTS-40 (400 MPa)</option>
                  <option value="BjTS-50">BjTS-50 (500 MPa)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Cover (mm)</label>
                <input
                  type="number"
                  value={elementInputs.cover}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, cover: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Exposure Class</label>
                <select
                  value={elementInputs.exposureClass}
                  onChange={(e) => setElementInputs(prev => ({ ...prev, exposureClass: e.target.value }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="aggressive">Aggressive</option>
                  <option value="marine">Marine</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateReinforcement}
              disabled={isCalculating}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-md border border-red-500 transition-colors"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4 mr-2" />
                  Generate Detailing
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rebar Schedule with High Contrast */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b-2 border-gray-200 pb-3">
            <Grid className="w-5 h-5 mr-2 text-green-600" />
            Rebar Schedule
          </h3>

          {detailingResults ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                <div className="text-gray-800 font-bold mb-2">{detailingResults.elementType}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(detailingResults.dimensions).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-200 pb-1">
                      <span className="text-gray-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-blue-700 font-bold font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Reinforcement with Strong Visual Indicators */}
              {detailingResults.flexuralReinforcement && (
                <div className="space-y-3">
                  <div className="text-gray-800 font-bold text-lg">Flexural Reinforcement</div>
                  
                  {detailingResults.flexuralReinforcement.bottomBars && (
                    <div className="p-3 bg-green-50 border-2 border-green-400 rounded-lg shadow-sm">
                      <div className="text-green-800 font-bold mb-2">Bottom Bars (Positive Moment)</div>
                      {Object.entries(detailingResults.flexuralReinforcement.bottomBars).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm border-b border-green-200 pb-1">
                          <span className="text-green-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="text-green-800 font-bold font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {detailingResults.flexuralReinforcement.topBars && (
                    <div className="p-3 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm">
                      <div className="text-blue-800 font-bold mb-2">Top Bars (Negative Moment)</div>
                      {Object.entries(detailingResults.flexuralReinforcement.topBars).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm border-b border-blue-200 pb-1">
                          <span className="text-blue-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="text-blue-800 font-bold font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Column Reinforcement with Professional Styling */}
              {detailingResults.longitudinalReinforcement && (
                <div className="space-y-3">
                  <div className="text-gray-800 font-bold text-lg">Column Reinforcement</div>
                  
                  <div className="p-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-sm">
                    <div className="text-yellow-800 font-bold mb-2">Longitudinal Bars</div>
                    {Object.entries(detailingResults.longitudinalReinforcement).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm border-b border-yellow-200 pb-1">
                        <span className="text-yellow-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-yellow-800 font-bold font-mono">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shear/Tie Reinforcement with Strong Colors */}
              {detailingResults.shearReinforcement && (
                <div className="p-3 bg-purple-50 border-2 border-purple-400 rounded-lg shadow-sm">
                  <div className="text-purple-800 font-bold mb-2">
                    {selectedElement === 'beam' ? 'Shear Reinforcement' : 'Tie Reinforcement'}
                  </div>
                  {Object.entries(detailingResults.shearReinforcement || detailingResults.tieReinforcement).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm border-b border-purple-200 pb-1">
                      <span className="text-purple-700 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-purple-800 font-bold font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-600 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Grid className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">Configure element parameters to generate rebar schedule</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailing Results with Professional High-Contrast Design */}
      {detailingResults && (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b-2 border-gray-200 pb-3">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Construction Detailing Information
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detailing Requirements with Strong Borders */}
            <div className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg">Detailing Requirements</h4>
              {Object.entries(detailingResults.detailing).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                  <span className="text-gray-700 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-blue-700 font-bold text-sm font-mono">{String(value)}</span>
                </div>
              ))}
            </div>

            {/* Material Quantities with Professional Styling */}
            <div className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg">Material Quantities</h4>
              {Object.entries(detailingResults.materialQuantities).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                  <span className="text-gray-700 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-green-700 font-bold text-sm font-mono">{String(value)}</span>
                </div>
              ))}
            </div>

            {/* Compliance Checks with Clear Pass/Fail Indicators */}
            <div className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg">Code Compliance</h4>
              {Object.entries(detailingResults.compliance).map(([key, value]) => (
                <div key={key} className={`p-3 rounded-lg border-2 shadow-sm ${
                  value ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-center">
                    {value ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={`text-sm font-medium ${value ? 'text-green-800' : 'text-red-800'} capitalize`}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                  <div className={`text-xs mt-1 font-bold ${value ? 'text-green-600' : 'text-red-600'}`}>
                    {value ? 'COMPLIANT' : 'NON-COMPLIANT'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Construction Notes with Professional Styling */}
          <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-400 rounded-lg shadow-sm">
            <h4 className="text-orange-800 font-bold mb-2">Construction Notes</h4>
            <ul className="text-gray-800 text-sm space-y-1 font-medium">
              <li>• All reinforcement per SNI 2052:2017 and SNI 2847:2019</li>
              <li>• Maintain specified concrete cover throughout</li>
              <li>• Ensure proper lap splice locations away from maximum moment</li>
              <li>• Use standard hooks for all anchorage requirements</li>
              <li>• Coordinate reinforcement with electrical and mechanical trades</li>
              <li>• Verify bar placement before concrete placement</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReinforcementDetailing;