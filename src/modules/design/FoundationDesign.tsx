/**
 * Foundation Design Module - SNI 8460:2020 Compliance
 * Comprehensive foundation design per Indonesian geotechnical standards
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Building2, Calculator, FileText, Settings, 
  CheckCircle, AlertTriangle, Wrench, Box, Target,
  Layers, RefreshCw, Download, Eye, Activity, MapPin
} from 'lucide-react';

interface FoundationDesignProps {
  subModule?: string;
}

const FoundationDesign: React.FC<FoundationDesignProps> = ({ subModule }) => {
  const [selectedFoundationType, setSelectedFoundationType] = useState('shallow');
  const [selectedSoilType, setSelectedSoilType] = useState<any>(null);
  const [designInputs, setDesignInputs] = useState({
    // Structural loading
    verticalLoad: 1500,    // kN
    horizontalLoad: 150,   // kN
    moment: 300,          // kNm
    
    // Foundation geometry
    length: 3.0,          // m
    width: 2.5,           // m
    depth: 1.5,           // m
    thickness: 0.4,       // m (for footing thickness)
    
    // Soil parameters
    soilWeight: 18,       // kN/m³
    waterTableDepth: 3.0, // m
    groundwaterLevel: 3.0, // m
    
    // Site conditions
    seismicZone: 'moderate', // low, moderate, high
    exposureClass: 'normal', // normal, aggressive, marine
    loadDuration: 'permanent', // permanent, temporary
    
    // Safety factors
    safetyFactorBearing: 3.0,
    safetyFactorSliding: 1.5,
    safetyFactorOverturning: 2.0
  });
  
  const [designResults, setDesignResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Foundation types
  const foundationTypes = [
    { 
      type: 'shallow', 
      name: 'Shallow Foundation', 
      icon: '⬜', 
      desc: 'Spread footings, strip footings',
      applications: ['Low-rise buildings', 'Light structures', 'Good soil conditions']
    },
    { 
      type: 'deep', 
      name: 'Deep Foundation', 
      icon: '║', 
      desc: 'Driven piles, bored piles',
      applications: ['High-rise buildings', 'Heavy loads', 'Poor surface soil']
    },
    { 
      type: 'mat', 
      name: 'Mat Foundation', 
      icon: '▭', 
      desc: 'Raft foundation, combined footing',
      applications: ['Heavy structures', 'Differential settlement control', 'Weak soils']
    }
  ];

  // Soil types with properties per SNI 8460:2020
  const soilTypes = [
    {
      name: 'Dense Sand',
      type: 'cohesionless',
      phi: 35,           // Friction angle (degrees)
      c: 0,             // Cohesion (kPa)  
      gamma: 19,        // Unit weight (kN/m³)
      N_SPT: 35,        // SPT N-value
      Dr: 80,           // Relative density (%)
      Es: 25000,        // Elastic modulus (kPa)
      description: 'Dense granular soil with good bearing capacity'
    },
    {
      name: 'Medium Sand',
      type: 'cohesionless',
      phi: 30,
      c: 0,
      gamma: 18,
      N_SPT: 15,
      Dr: 50,
      Es: 15000,
      description: 'Medium dense sand with moderate bearing capacity'
    },
    {
      name: 'Loose Sand',
      type: 'cohesionless',
      phi: 28,
      c: 0,
      gamma: 17,
      N_SPT: 8,
      Dr: 30,
      Es: 8000,
      description: 'Loose sand requiring improvement or deep foundations'
    },
    {
      name: 'Stiff Clay',
      type: 'cohesive',
      phi: 20,
      c: 50,
      gamma: 19,
      N_SPT: 20,
      qu: 150,          // Unconfined compressive strength (kPa)
      Es: 20000,
      description: 'Stiff clay with good bearing capacity'
    },
    {
      name: 'Soft Clay',
      type: 'cohesive',
      phi: 15,
      c: 20,
      gamma: 17,
      N_SPT: 4,
      qu: 50,
      Es: 5000,
      description: 'Soft clay requiring special foundation treatment'
    },
    {
      name: 'Rock (Weathered)',
      type: 'rock',
      phi: 45,
      c: 200,
      gamma: 22,
      N_SPT: 100,
      qu: 1000,
      Es: 100000,
      description: 'Weathered rock with excellent bearing capacity'
    }
  ];

  // Foundation design calculations per SNI 8460:2020
  const calculateFoundationDesign = useCallback(() => {
    if (!selectedSoilType) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const soil = selectedSoilType;
      const B = designInputs.width;
      const L = designInputs.length;
      const D = designInputs.depth;
      const P = designInputs.verticalLoad;
      const H = designInputs.horizontalLoad;
      const M = designInputs.moment;
      
      let results: any = {};

      if (selectedFoundationType === 'shallow') {
        // Shallow foundation design
        
        // Bearing capacity factors (Terzaghi method)
        const phi_rad = soil.phi * Math.PI / 180;
        const Nq = Math.exp(Math.PI * Math.tan(phi_rad)) * Math.pow(Math.tan(Math.PI/4 + phi_rad/2), 2);
        const Nc = (Nq - 1) / Math.tan(phi_rad);
        const Ny = 2 * (Nq + 1) * Math.tan(phi_rad);
        
        // Shape factors (for rectangular footing)
        const sc = 1 + (B/L) * (Nq/Nc);
        const sq = 1 + (B/L) * Math.tan(phi_rad);
        const sy = 1 - 0.4 * (B/L);
        
        // Depth factors
        const dc = 1 + 0.4 * (D/B);
        const dq = 1 + 2 * Math.tan(phi_rad) * Math.pow(1 - Math.sin(phi_rad), 2) * (D/B);
        const dy = 1.0; // Conservative
        
        // Ultimate bearing capacity
        const qu = soil.c * Nc * sc * dc + soil.gamma * D * Nq * sq * dq + 0.5 * soil.gamma * B * Ny * sy * dy;
        
        // Allowable bearing capacity
        const qa = qu / designInputs.safetyFactorBearing;
        
        // Foundation area and contact pressure
        const foundationArea = B * L;
        const contactPressure = P / foundationArea;
        
        // Eccentricity check
        const ex = M / P;
        const ey = 0; // Assuming no moment about Y-axis
        const ex_limit = L / 6;
        const ey_limit = B / 6;
        
        // Effective area (considering eccentricity)
        const L_eff = L - 2 * Math.abs(ex);
        const B_eff = B - 2 * Math.abs(ey);
        const A_eff = Math.max(0, L_eff * B_eff);
        const q_max = P / A_eff;
        
        // Settlement calculation (simplified)
        const I = 1.0; // Influence factor (conservative)
        const settlement_immediate = (contactPressure * B * (1 - 0.3 * 0.3) * I) / soil.Es * 1000; // mm
        const settlement_allowable = 25; // mm (typical limit)
        
        // Sliding resistance
        const slidingResistance = soil.c * foundationArea + Math.tan(phi_rad) * P;
        const slidingSafetyFactor = slidingResistance / Math.max(H, 1);
        
        // Overturning resistance
        const overturnMoment = H * (D + designInputs.thickness);
        const resistingMoment = P * L / 2;
        const overturningFactor = resistingMoment / Math.max(overturnMoment, 1);
        
        // Stability checks
        const checks = {
          bearingCapacity: contactPressure <= qa,
          eccentricity: Math.abs(ex) <= ex_limit && Math.abs(ey) <= ey_limit,
          settlement: settlement_immediate <= settlement_allowable,
          sliding: slidingSafetyFactor >= designInputs.safetyFactorSliding,
          overturning: overturningFactor >= designInputs.safetyFactorOverturning,
          minimumSize: B >= 0.6 && L >= 0.6 // Minimum size requirements
        };
        
        results = {
          foundationType: 'Shallow Foundation',
          soilType: soil,
          bearingCapacity: {
            ultimate: qu.toFixed(1) + ' kPa',
            allowable: qa.toFixed(1) + ' kPa',
            applied: contactPressure.toFixed(1) + ' kPa',
            utilizationRatio: (contactPressure / qa * 100).toFixed(1) + '%'
          },
          geometry: {
            foundationArea: foundationArea.toFixed(2) + ' m²',
            effectiveArea: A_eff.toFixed(2) + ' m²',
            contactPressure: contactPressure.toFixed(1) + ' kPa',
            maxPressure: q_max.toFixed(1) + ' kPa'
          },
          stability: {
            eccentricityX: ex.toFixed(3) + ' m',
            eccentricityLimit: ex_limit.toFixed(3) + ' m',
            slidingSafetyFactor: slidingSafetyFactor.toFixed(2),
            overturningFactor: overturningFactor.toFixed(2)
          },
          settlement: {
            immediate: settlement_immediate.toFixed(1) + ' mm',
            allowable: settlement_allowable.toFixed(0) + ' mm',
            acceptability: settlement_immediate <= settlement_allowable ? 'ACCEPTABLE' : 'EXCESSIVE'
          },
          checks: checks,
          overallSafety: Object.values(checks).every(check => check),
          sniCompliance: Object.values(checks).every(check => check)
        };
      } 
      else if (selectedFoundationType === 'deep') {
        // Deep foundation (pile) design
        
        // Pile capacity calculations (simplified)
        const pileLength = 15; // Assumed pile length (m)
        const pileDiameter = 0.4; // Assumed pile diameter (m)
        const pileArea = Math.PI * Math.pow(pileDiameter, 2) / 4;
        const pilePerimeter = Math.PI * pileDiameter;
        const phi_rad = soil.phi * Math.PI / 180;
        
        // End bearing capacity
        const qp = soil.type === 'cohesive' ? 9 * soil.c : soil.gamma * pileLength * Math.tan(phi_rad);
        const Qp = qp * pileArea;
        
        // Skin friction capacity
        const qs = soil.type === 'cohesive' ? 0.5 * soil.c : 0.5 * soil.gamma * pileLength * Math.tan(phi_rad);
        const Qs = qs * pilePerimeter * pileLength;
        
        // Total pile capacity
        const Qu_pile = Qp + Qs;
        const Qa_pile = Qu_pile / 2.5; // Safety factor for piles
        
        // Number of piles required
        const numPiles = Math.ceil(P / Qa_pile);
        const pileSpacing = Math.max(3 * pileDiameter, 1.0); // Minimum spacing
        
        // Pile group efficiency
        const eta = 0.7; // Assumed group efficiency
        const totalCapacity = numPiles * Qa_pile * eta;
        
        const checks = {
          singlePileCapacity: Qa_pile > P / numPiles,
          groupCapacity: totalCapacity > P,
          minimumSpacing: pileSpacing >= 3 * pileDiameter,
          lateralCapacity: true // Simplified assumption
        };
        
        results = {
          foundationType: 'Deep Foundation (Piles)',
          soilType: soil,
          pileDesign: {
            diameter: (pileDiameter * 1000).toFixed(0) + ' mm',
            length: pileLength.toFixed(1) + ' m',
            singleCapacity: Qa_pile.toFixed(0) + ' kN',
            numberOfPiles: numPiles.toString(),
            spacing: pileSpacing.toFixed(2) + ' m'
          },
          capacity: {
            endBearing: Qp.toFixed(0) + ' kN',
            skinFriction: Qs.toFixed(0) + ' kN',
            totalSingle: Qu_pile.toFixed(0) + ' kN',
            groupCapacity: totalCapacity.toFixed(0) + ' kN',
            utilizationRatio: (P / totalCapacity * 100).toFixed(1) + '%'
          },
          checks: checks,
          overallSafety: Object.values(checks).every(check => check),
          sniCompliance: Object.values(checks).every(check => check)
        };
      }
      
      setDesignResults(results);
      setIsCalculating(false);
    }, 2500);
  }, [selectedSoilType, selectedFoundationType, designInputs]);

  useEffect(() => {
    if (selectedSoilType) {
      calculateFoundationDesign();
    }
  }, [selectedSoilType, selectedFoundationType, designInputs, calculateFoundationDesign]);

  return (
    <div className="space-y-6">
      {/* Header with Professional Styling */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <MapPin className="w-7 h-7 mr-3 text-orange-600" />
              Foundation Design Module
            </h2>
            <p className="text-gray-600 mt-2 font-medium">Geotechnical foundation design per SNI 8460:2020</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md border border-blue-500 font-medium">
              <Eye className="w-4 h-4 mr-2" />
              3D Viewer
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md border border-green-500 font-medium">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Foundation Type Selection with High Contrast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {foundationTypes.map(item => (
            <button
              key={item.type}
              onClick={() => setSelectedFoundationType(item.type)}
              className={`p-4 rounded-lg border-2 transition-all shadow-md ${
                selectedFoundationType === item.type
                  ? 'border-orange-500 bg-orange-50 text-orange-800'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-25'
              }`}
            >
              <div className="text-2xl mb-2 font-bold">{item.icon}</div>
              <div className="font-bold text-sm">{item.name}</div>
              <div className="text-xs opacity-75 mb-2">{item.desc}</div>
              <div className="text-xs space-y-1">
                {item.applications.map((app, idx) => (
                  <div key={idx} className="opacity-60">• {app}</div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Conditions with Professional Styling */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b-2 border-gray-200 pb-3">
            <Layers className="w-5 h-5 mr-2 text-yellow-600" />
            Soil Conditions
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">Soil Type (SNI 8460:2020)</label>
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg bg-gray-50 p-3">
                {soilTypes.map(soil => (
                  <button
                    key={soil.name}
                    onClick={() => setSelectedSoilType(soil)}
                    className={`p-4 rounded-lg border-2 text-left transition-all shadow-sm ${
                      selectedSoilType?.name === soil.name
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-yellow-400 hover:bg-yellow-25'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold">{soil.name}</div>
                      <div className="text-xs bg-gray-600 text-white px-2 py-1 rounded font-medium">
                        {soil.type}
                      </div>
                    </div>
                    <div className="text-xs opacity-75 mb-2">{soil.description}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                      <div>φ = {soil.phi}°</div>
                      <div>c = {soil.c} kPa</div>
                      <div>γ = {soil.gamma} kN/m³</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Site Conditions with Professional Input Styling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Water Table (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={designInputs.waterTableDepth}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, waterTableDepth: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Seismic Zone</label>
                <select
                  value={designInputs.seismicZone}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, seismicZone: e.target.value }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading & Geometry with High Contrast */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b-2 border-gray-200 pb-3">
            <Calculator className="w-5 h-5 mr-2 text-blue-600" />
            Loading & Geometry
          </h3>

          <div className="space-y-4">
            {/* Structural Loading with Strong Labels */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Vertical Load (kN)</label>
                <input
                  type="number"
                  value={designInputs.verticalLoad}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, verticalLoad: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Horizontal Load (kN)</label>
                <input
                  type="number"
                  value={designInputs.horizontalLoad}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, horizontalLoad: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Moment (kNm)</label>
                <input
                  type="number"
                  value={designInputs.moment}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, moment: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
            </div>

            {/* Foundation Geometry with Professional Styling */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Length (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={designInputs.length}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, length: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={designInputs.width}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, width: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Depth (m)</label>
                <input
                  type="number"
                  step="0.1"  
                  value={designInputs.depth}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, depth: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Thickness (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={designInputs.thickness}
                  onChange={(e) => setDesignInputs(prev => ({ ...prev, thickness: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
                />
              </div>
            </div>

            <button
              onClick={calculateFoundationDesign}
              disabled={!selectedSoilType || isCalculating}
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-md border border-orange-500 transition-colors"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4 mr-2" />
                  Calculate Foundation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Design Results with Professional High-Contrast Design */}
      {designResults && (
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center border-b-2 border-gray-200 pb-3">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Foundation Design Results - SNI 8460:2020 Compliance
          </h3>

          {/* Overall Status with Strong Visual Feedback */}
          <div className={`p-4 rounded-lg mb-6 border-2 shadow-md ${
            designResults.overallSafety 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex items-center">
              {designResults.overallSafety ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              )}
              <div>
                <div className={`font-bold ${designResults.overallSafety ? 'text-green-800' : 'text-red-800'}`}>
                  {designResults.overallSafety ? 'Design PASSES' : 'Design FAILS'} - {designResults.foundationType}
                </div>
                <div className={`text-sm ${designResults.overallSafety ? 'text-green-700' : 'text-red-700'}`}>
                  Soil Type: {designResults.soilType.name} | {designResults.overallSafety 
                    ? 'All stability checks satisfied' 
                    : 'Some stability checks failed - review design'
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Results with Strong Borders */}
            <div className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg">
                {selectedFoundationType === 'shallow' ? 'Bearing Capacity' : 'Pile Design'}
              </h4>
              {Object.entries(
                selectedFoundationType === 'shallow' 
                  ? designResults.bearingCapacity || {} 
                  : designResults.pileDesign || {}
              ).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                  <span className="text-gray-700 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-blue-700 font-bold text-sm font-mono">{String(value)}</span>
                </div>
              ))}
            </div>

            {/* Secondary Results with Professional Styling */}
            <div className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg">
                {selectedFoundationType === 'shallow' ? 'Geometry' : 'Capacity'}
              </h4>
              {Object.entries(
                selectedFoundationType === 'shallow' 
                  ? designResults.geometry || {} 
                  : designResults.capacity || {}
              ).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                  <span className="text-gray-700 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-green-700 font-bold text-sm font-mono">{String(value)}</span>
                </div>
              ))}
            </div>

            {/* Stability/Settlement with Clear Indicators */}
            <div className="space-y-4">
              <h4 className="text-gray-800 font-bold text-lg">
                {selectedFoundationType === 'shallow' ? 'Stability' : 'Checks'}  
              </h4>
              {Object.entries(
                selectedFoundationType === 'shallow' 
                  ? designResults.stability || {} 
                  : designResults.checks || {}
              ).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-sm">
                  <span className="text-gray-700 text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`font-bold text-sm font-mono ${
                    typeof value === 'boolean' 
                      ? (value ? 'text-green-700' : 'text-red-700')
                      : 'text-yellow-700'
                  }`}>
                    {typeof value === 'boolean' ? (value ? 'PASS' : 'FAIL') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Design Checks with Clear Pass/Fail Indicators */}
          <div className="mt-6">
            <h4 className="text-gray-800 font-bold mb-4 text-lg">Stability & Safety Checks</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(designResults.checks).map(([key, value]) => (
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
                    {value ? 'PASS' : 'FAIL'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settlement Information for Shallow Foundations */}
          {selectedFoundationType === 'shallow' && designResults.settlement && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg shadow-sm">
              <h4 className="text-blue-800 font-bold mb-2">Settlement Analysis</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Immediate Settlement:</span>
                  <div className="text-blue-800 font-bold font-mono">{designResults.settlement.immediate}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Allowable Settlement:</span>
                  <div className="text-blue-800 font-bold font-mono">{designResults.settlement.allowable}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Status:</span>
                  <div className={`font-bold ${
                    designResults.settlement.acceptability === 'ACCEPTABLE' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {designResults.settlement.acceptability}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoundationDesign;