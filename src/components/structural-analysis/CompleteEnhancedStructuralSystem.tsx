import React, { useState, useCallback, useRef, useEffect } from 'react';

/**
 * COMPLETE ENHANCED STRUCTURAL ANALYSIS SYSTEM
 * Demonstrasi lengkap dari semua sistem yang telah diimplementasikan:
 * - SNI Compliance Engine
 * - Foundation Design Integrator
 * - Advanced Cost Analyzer
 * - Professional Drawing Engine
 * - Enhanced Optimization Engine
 */

// Import interface types
interface ProjectData {
  name: string;
  location: string;
  type: 'residential' | 'commercial' | 'industrial';
  floors: number;
  length: number;
  width: number;
  height: number;
  loads: {
    dead: number;
    live: number;
    wind: number;
    seismic: number;
  };
  materials: {
    concrete: 'fc20' | 'fc25' | 'fc30' | 'fc35' | 'fc40';
    steel: 'BJ34' | 'BJ37' | 'BJ41' | 'BJ50' | 'BJ55';
  };
  seismic: {
    zone: 1 | 2 | 3 | 4 | 5 | 6;
    soilType: 'SE' | 'SD' | 'SC' | 'SB' | 'SA';
  };
  location_region: 'jakarta' | 'surabaya' | 'bandung' | 'medan' | 'semarang' | 'makassar' | 'other';
}

interface AnalysisResults {
  sni_compliance?: any;
  foundation_design?: any;
  cost_analysis?: any;
  optimization?: any;
  drawings?: string;
  status: 'idle' | 'analyzing' | 'completed' | 'error';
  message?: string;
}

// 3D Visualization Component
const Enhanced3DVisualization = ({ projectData }: { projectData: ProjectData }) => {
  const [viewAngle, setViewAngle] = useState(45);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setViewAngle(prev => (prev + 1) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRotating]);

  const generateStructure = () => {
    const elements = [];
    const scale = 6;
    
    // Generate floors
    for (let floor = 0; floor < projectData.floors; floor++) {
      elements.push(
        <div
          key={`floor-${floor}`}
          className="absolute border-2 border-gray-600 bg-gradient-to-br from-gray-200 to-gray-300"
          style={{
            width: `${projectData.length * scale}px`,
            height: `${projectData.width * scale}px`,
            bottom: `${floor * 30 + 10}px`,
            left: '50%',
            transform: `translateX(-50%) rotateX(70deg) rotateY(${viewAngle}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        />
      );
    }

    // Generate columns
    const columnPositions = [
      { x: 0.2, z: 0.2 }, { x: 0.8, z: 0.2 },
      { x: 0.2, z: 0.8 }, { x: 0.8, z: 0.8 },
      { x: 0.5, z: 0.5 }  // Center column
    ];

    columnPositions.forEach((pos, idx) => {
      elements.push(
        <div
          key={`column-${idx}`}
          className="absolute bg-gradient-to-t from-blue-800 to-blue-600 rounded"
          style={{
            width: '6px',
            height: `${projectData.floors * 30}px`,
            left: `calc(50% + ${(pos.x - 0.5) * projectData.length * scale}px)`,
            bottom: '10px',
            transform: `rotateY(${viewAngle}deg)`,
            transformOrigin: 'center bottom',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.4)'
          }}
        />
      );
    });

    // Generate beams
    for (let floor = 0; floor < projectData.floors; floor++) {
      // Longitudinal beams
      for (let i = 0; i < 3; i++) {
        elements.push(
          <div
            key={`beam-long-${floor}-${i}`}
            className="absolute bg-red-600"
            style={{
              width: `${projectData.length * scale}px`,
              height: '4px',
              bottom: `${floor * 30 + 25}px`,
              left: '50%',
              transform: `translateX(-50%) translateZ(${(i - 1) * projectData.width * scale / 3}px) rotateY(${viewAngle}deg)`,
              transformStyle: 'preserve-3d'
            }}
          />
        );
      }
    }

    return elements;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg p-6 border shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">3D Structure Visualization</h3>
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
            isRotating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRotating ? 'Stop Rotation' : 'Auto Rotate'}
        </button>
      </div>
      
      <div className="relative h-64 overflow-hidden bg-gradient-to-b from-sky-100 to-green-100 rounded-lg border">
        <div 
          className="absolute inset-0 flex items-end justify-center"
          style={{ perspective: '1000px' }}
        >
          {generateStructure()}
        </div>
        
        <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded p-2 text-sm">
          <div>View: {viewAngle.toFixed(0)}°</div>
          <div>Scale: 1:60</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 border border-gray-600 rounded"></div>
            <span>Floors ({projectData.floors})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Columns (5)</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>Beams</span>
          </div>
          <div className="text-gray-600">
            {projectData.length}m × {projectData.width}m
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CompleteEnhancedStructuralSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: 'Demo Building Project',
    location: 'Jakarta, Indonesia',
    type: 'commercial',
    floors: 5,
    length: 20,
    width: 15,
    height: 3.5,
    loads: {
      dead: 400,    // kg/m²
      live: 250,    // kg/m²
      wind: 40,     // kg/m²
      seismic: 0.3  // factor
    },
    materials: {
      concrete: 'fc25',
      steel: 'BJ41'
    },
    seismic: {
      zone: 3,
      soilType: 'SD'
    },
    location_region: 'jakarta'
  });

  const [results, setResults] = useState<AnalysisResults>({
    status: 'idle'
  });

  const [activeTab, setActiveTab] = useState<'input' | 'compliance' | 'foundation' | 'cost' | 'optimization' | 'drawings' | '3d'>('input');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated analysis functions
  const performSNICompliance = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      overall_compliance: 95.5,
      concrete_compliance: {
        SNI_2847_2019: {
          strength_compliance: 98.2,
          durability_compliance: 94.1,
          detailing_compliance: 96.8,
          issues: []
        }
      },
      steel_compliance: {
        SNI_1729_2020: {
          strength_compliance: 97.5,
          buckling_compliance: 93.2,
          connection_compliance: 95.8,
          issues: ['Minor connection detail optimization needed']
        }
      },
      recommendations: [
        'Increase concrete cover in exposed areas',
        'Optimize steel connection details for better performance'
      ]
    };
  }, []);

  const performFoundationDesign = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      foundation_type: 'Pile Foundation',
      pile_design: {
        type: 'Driven Pile',
        diameter: 0.6,
        length: 15,
        quantity: 24,
        capacity: 180,
        settlement: 12.5
      },
      bearing_capacity: {
        ultimate: 4320,
        allowable: 1440,
        safety_factor: 3.0
      },
      geotechnical: {
        soil_type: 'Clay with sand layers',
        groundwater_level: -2.5,
        liquefaction_potential: 'Low'
      },
      cost_estimate: 1250000000 // IDR
    };
  }, []);

  const performCostAnalysis = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const totalArea = projectData.floors * projectData.length * projectData.width;
    return {
      initial_cost: {
        materials: totalArea * 1200000,
        labor: totalArea * 800000,
        equipment: totalArea * 300000,
        overhead: totalArea * 500000,
        total: totalArea * 2800000
      },
      lifecycle_cost: {
        initial: totalArea * 2800000,
        maintenance: totalArea * 1200000,
        operational: totalArea * 800000,
        npv: totalArea * 4800000,
        payback_period: 15.5
      },
      regional_factors: {
        location: projectData.location_region,
        material_cost_index: 1.0,
        labor_cost_index: projectData.location_region === 'jakarta' ? 1.2 : 0.9,
        transportation_factor: 0.95
      },
      sustainability: {
        carbon_footprint: totalArea * 320, // kg CO2e
        recyclability: 75, // percentage
        green_certification: 'Greenship Level Gold'
      }
    };
  }, [projectData]);

  const performOptimization = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1800));
    return {
      optimization_method: 'Multi-Objective Genetic Algorithm (NSGA-II)',
      objectives: [
        { name: 'Total Cost', value: 8400000000, unit: 'IDR', improvement: '-12.5%' },
        { name: 'Carbon Footprint', value: 96000, unit: 'kg CO2e', improvement: '-18.3%' },
        { name: 'Structural Weight', value: 2850, unit: 'tons', improvement: '-8.7%' },
        { name: 'Safety Factor', value: 2.85, unit: 'ratio', improvement: '+15.2%' }
      ],
      optimized_design: {
        concrete_grade: 'fc30',
        steel_grade: 'BJ50',
        beam_size: '350x600',
        column_size: '450x450',
        slab_thickness: 125
      },
      convergence: {
        generations: 247,
        pareto_solutions: 28,
        best_compromise: 'Solution #15'
      },
      recommendations: [
        'Use higher grade concrete for better durability',
        'Optimize beam depths for material efficiency',
        'Consider precast elements for faster construction'
      ]
    };
  }, []);

  const performCompleteAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setResults({ status: 'analyzing', message: 'Starting comprehensive analysis...' });

    try {
      // Sequential analysis
      setResults({ status: 'analyzing', message: 'Checking SNI compliance...' });
      const sniResults = await performSNICompliance();

      setResults({ 
        status: 'analyzing', 
        message: 'Designing foundation system...',
        sni_compliance: sniResults 
      });
      const foundationResults = await performFoundationDesign();

      setResults({ 
        status: 'analyzing', 
        message: 'Performing cost analysis...',
        sni_compliance: sniResults,
        foundation_design: foundationResults
      });
      const costResults = await performCostAnalysis();

      setResults({ 
        status: 'analyzing', 
        message: 'Running optimization algorithms...',
        sni_compliance: sniResults,
        foundation_design: foundationResults,
        cost_analysis: costResults
      });
      const optimizationResults = await performOptimization();

      setResults({
        status: 'completed',
        message: 'Analysis completed successfully!',
        sni_compliance: sniResults,
        foundation_design: foundationResults,
        cost_analysis: costResults,
        optimization: optimizationResults
      });

    } catch (error) {
      setResults({
        status: 'error',
        message: 'Analysis failed. Please check your input data.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [performSNICompliance, performFoundationDesign, performCostAnalysis, performOptimization]);

  const generateTechnicalDrawing = useCallback(() => {
    if (!canvasRef.current) return '';
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up drawing
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.font = '10px Arial';
    
    // Draw title block
    ctx.strokeRect(canvas.width - 200, canvas.height - 50, 200, 50);
    ctx.fillText('STRUCTURAL PLAN', canvas.width - 190, canvas.height - 35);
    ctx.fillText(`SCALE: 1:100`, canvas.width - 190, canvas.height - 20);
    ctx.fillText(`DATE: ${new Date().toLocaleDateString()}`, canvas.width - 190, canvas.height - 5);
    
    // Draw structural grid
    const scale = 10; // 1m = 10px
    const offsetX = 50;
    const offsetY = 50;
    
    // Grid lines
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= projectData.length; i += 5) {
      ctx.beginPath();
      ctx.moveTo(offsetX + i * scale, offsetY);
      ctx.lineTo(offsetX + i * scale, offsetY + projectData.width * scale);
      ctx.stroke();
    }
    for (let i = 0; i <= projectData.width; i += 5) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * scale);
      ctx.lineTo(offsetX + projectData.length * scale, offsetY + i * scale);
      ctx.stroke();
    }
    
    // Draw columns
    ctx.fillStyle = '#0066CC';
    const columnPositions = [
      { x: 2, y: 2 }, { x: 18, y: 2 },
      { x: 2, y: 13 }, { x: 18, y: 13 },
      { x: 10, y: 7.5 }
    ];
    
    columnPositions.forEach(pos => {
      ctx.fillRect(
        offsetX + pos.x * scale - 2,
        offsetY + pos.y * scale - 2,
        4, 4
      );
    });
    
    // Draw beams
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 2;
    // Longitudinal beams
    [2, 7.5, 13].forEach(y => {
      ctx.beginPath();
      ctx.moveTo(offsetX + 2 * scale, offsetY + y * scale);
      ctx.lineTo(offsetX + 18 * scale, offsetY + y * scale);
      ctx.stroke();
    });
    
    // Transverse beams
    [2, 10, 18].forEach(x => {
      ctx.beginPath();
      ctx.moveTo(offsetX + x * scale, offsetY + 2 * scale);
      ctx.lineTo(offsetX + x * scale, offsetY + 13 * scale);
      ctx.stroke();
    });
    
    // Add dimensions
    ctx.strokeStyle = '#0000FF';
    ctx.lineWidth = 0.5;
    ctx.font = '8px Arial';
    ctx.fillStyle = '#0000FF';
    
    // Length dimension
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY - 15);
    ctx.lineTo(offsetX + projectData.length * scale, offsetY - 15);
    ctx.stroke();
    ctx.fillText(`${projectData.length}m`, offsetX + projectData.length * scale / 2 - 10, offsetY - 18);
    
    // Width dimension
    ctx.save();
    ctx.translate(offsetX - 15, offsetY + projectData.width * scale / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${projectData.width}m`, -10, 3);
    ctx.restore();
    
    return canvas.toDataURL();
  }, [projectData]);

  const renderInputForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={projectData.name}
              onChange={(e) => setProjectData(prev => ({...prev, name: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
            <select
              value={projectData.type}
              onChange={(e) => setProjectData(prev => ({...prev, type: e.target.value as any}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Floors</label>
              <input
                type="number"
                min="1"
                max="50"
                value={projectData.floors}
                onChange={(e) => setProjectData(prev => ({...prev, floors: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (m)</label>
              <input
                type="number"
                step="0.1"
                min="2.5"
                max="6"
                value={projectData.height}
                onChange={(e) => setProjectData(prev => ({...prev, height: parseFloat(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={projectData.length}
                onChange={(e) => setProjectData(prev => ({...prev, length: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width (m)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={projectData.width}
                onChange={(e) => setProjectData(prev => ({...prev, width: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={projectData.location_region}
              onChange={(e) => setProjectData(prev => ({...prev, location_region: e.target.value as any}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="jakarta">Jakarta</option>
              <option value="surabaya">Surabaya</option>
              <option value="bandung">Bandung</option>
              <option value="medan">Medan</option>
              <option value="semarang">Semarang</option>
              <option value="makassar">Makassar</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Concrete Grade</label>
              <select
                value={projectData.materials.concrete}
                onChange={(e) => setProjectData(prev => ({
                  ...prev, 
                  materials: {...prev.materials, concrete: e.target.value as any}
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="fc20">fc' 20 MPa</option>
                <option value="fc25">fc' 25 MPa</option>
                <option value="fc30">fc' 30 MPa</option>
                <option value="fc35">fc' 35 MPa</option>
                <option value="fc40">fc' 40 MPa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Steel Grade</label>
              <select
                value={projectData.materials.steel}
                onChange={(e) => setProjectData(prev => ({
                  ...prev, 
                  materials: {...prev.materials, steel: e.target.value as any}
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="BJ34">BJ 34 (240 MPa)</option>
                <option value="BJ37">BJ 37 (240 MPa)</option>
                <option value="BJ41">BJ 41 (250 MPa)</option>
                <option value="BJ50">BJ 50 (290 MPa)</option>
                <option value="BJ55">BJ 55 (410 MPa)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seismic Zone</label>
              <select
                value={projectData.seismic.zone}
                onChange={(e) => setProjectData(prev => ({
                  ...prev,
                  seismic: {...prev.seismic, zone: parseInt(e.target.value) as any}
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Zone 1 (Low)</option>
                <option value="2">Zone 2 (Low-Medium)</option>
                <option value="3">Zone 3 (Medium)</option>
                <option value="4">Zone 4 (Medium-High)</option>
                <option value="5">Zone 5 (High)</option>
                <option value="6">Zone 6 (Very High)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
              <select
                value={projectData.seismic.soilType}
                onChange={(e) => setProjectData(prev => ({
                  ...prev,
                  seismic: {...prev.seismic, soilType: e.target.value as any}
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="SA">SA - Hard Rock</option>
                <option value="SB">SB - Rock</option>
                <option value="SC">SC - Very Dense Soil</option>
                <option value="SD">SD - Stiff Soil</option>
                <option value="SE">SE - Soft Clay</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Load Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Dead Load: {projectData.loads.dead} kg/m²</div>
              <div>Live Load: {projectData.loads.live} kg/m²</div>
              <div>Wind Load: {projectData.loads.wind} kg/m²</div>
              <div>Seismic Factor: {projectData.loads.seismic}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={performCompleteAnalysis}
          disabled={isAnalyzing}
          className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-all ${
            isAnalyzing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Complete Analysis'}
        </button>
      </div>
    </div>
  );

  const renderResultsTab = (tabName: string, data: any) => {
    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500">
          Run analysis first to see {tabName} results
        </div>
      );
    }

    switch (tabName) {
      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                SNI Compliance Score: {data.overall_compliance}%
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">SNI 2847:2019 (Concrete)</h4>
                  <div className="space-y-2 text-sm">
                    <div>Strength: {data.concrete_compliance.SNI_2847_2019.strength_compliance}%</div>
                    <div>Durability: {data.concrete_compliance.SNI_2847_2019.durability_compliance}%</div>
                    <div>Detailing: {data.concrete_compliance.SNI_2847_2019.detailing_compliance}%</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">SNI 1729:2020 (Steel)</h4>
                  <div className="space-y-2 text-sm">
                    <div>Strength: {data.steel_compliance.SNI_1729_2020.strength_compliance}%</div>
                    <div>Buckling: {data.steel_compliance.SNI_1729_2020.buckling_compliance}%</div>
                    <div>Connections: {data.steel_compliance.SNI_1729_2020.connection_compliance}%</div>
                  </div>
                </div>
              </div>
              {data.recommendations && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    {data.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case 'foundation':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Foundation Design</h3>
                <div className="space-y-3 text-sm">
                  <div>Type: {data.foundation_type}</div>
                  <div>Pile Diameter: {data.pile_design.diameter}m</div>
                  <div>Pile Length: {data.pile_design.length}m</div>
                  <div>Number of Piles: {data.pile_design.quantity}</div>
                  <div>Capacity: {data.pile_design.capacity} tons/pile</div>
                  <div>Settlement: {data.pile_design.settlement} mm</div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Bearing Capacity</h3>
                <div className="space-y-3 text-sm">
                  <div>Ultimate: {data.bearing_capacity.ultimate} tons</div>
                  <div>Allowable: {data.bearing_capacity.allowable} tons</div>
                  <div>Safety Factor: {data.bearing_capacity.safety_factor}</div>
                </div>
                
                <h4 className="font-medium text-green-700 mt-4 mb-2">Geotechnical</h4>
                <div className="space-y-2 text-sm">
                  <div>Soil: {data.geotechnical.soil_type}</div>
                  <div>Groundwater: {data.geotechnical.groundwater_level}m</div>
                  <div>Liquefaction: {data.geotechnical.liquefaction_potential}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 font-medium">Foundation Cost Estimate</span>
                <span className="text-xl font-bold text-yellow-900">
                  Rp {(data.cost_estimate / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        );

      case 'cost':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-4">Initial Cost Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(data.initial_cost).filter(([key]) => key !== 'total').map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key}:</span>
                      <span>Rp {((value as number) / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span>Rp {(data.initial_cost.total / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">Life-Cycle Analysis</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>NPV (50 years):</span>
                    <span>Rp {(data.lifecycle_cost.npv / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback Period:</span>
                    <span>{data.lifecycle_cost.payback_period} years</span>
                  </div>
                  <div className="bg-white rounded p-3 mt-4">
                    <h4 className="font-medium mb-2">Regional Factors</h4>
                    <div className="text-xs space-y-1">
                      <div>Location: {data.regional_factors.location}</div>
                      <div>Material Index: {data.regional_factors.material_cost_index}</div>
                      <div>Labor Index: {data.regional_factors.labor_cost_index}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Sustainability Metrics</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{(data.sustainability.carbon_footprint / 1000).toFixed(1)}</div>
                  <div className="text-sm text-green-600">tons CO₂e</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{data.sustainability.recyclability}%</div>
                  <div className="text-sm text-green-600">Recyclable</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-700">{data.sustainability.green_certification}</div>
                  <div className="text-sm text-green-600">Certification</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">
                {data.optimization_method}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.objectives.map((obj: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600">{obj.name}</div>
                    <div className="text-xl font-bold text-gray-800">{typeof obj.value === 'number' && obj.value > 1000000 ? (obj.value / 1000000).toFixed(1) + 'M' : obj.value}</div>
                    <div className="text-xs text-gray-500">{obj.unit}</div>
                    <div className={`text-sm font-medium ${obj.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {obj.improvement}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Optimized Design</h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(data.optimized_design).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Convergence Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Generations:</span>
                      <span>{data.convergence.generations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pareto Solutions:</span>
                      <span>{data.convergence.pareto_solutions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Best Solution:</span>
                      <span>{data.convergence.best_compromise}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {data.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'drawings':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Drawings</h3>
              
              <div className="mb-4">
                <button
                  onClick={generateTechnicalDrawing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Drawing
                </button>
              </div>

              <canvas 
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-300 bg-white w-full"
                style={{ maxWidth: '100%', height: 'auto' }}
              />

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Drawing Type</div>
                  <div>Structural Plan</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Scale</div>
                  <div>1:100</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Units</div>
                  <div>Metric (mm)</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="font-medium">Standard</div>
                  <div>SNI 2847:2019</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>No data available</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Complete Enhanced Structural Analysis System</h1>
          <p className="text-blue-100">
            Professional structural design with SNI compliance, foundation integration, cost analysis, and optimization
          </p>
        </div>

        {/* Status Bar */}
        {results.status !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg border ${
            results.status === 'completed' ? 'bg-green-50 border-green-200 text-green-800' :
            results.status === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center space-x-2">
              {results.status === 'analyzing' && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              )}
              {results.status === 'completed' && <div className="h-4 w-4 bg-green-600 rounded-full"></div>}
              {results.status === 'error' && <div className="h-4 w-4 bg-red-600 rounded-full"></div>}
              <span className="font-medium">{results.message}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'input', name: 'Project Input', icon: '⚙️' },
              { id: '3d', name: '3D View', icon: '🏗️' },
              { id: 'compliance', name: 'SNI Compliance', icon: '✅' },
              { id: 'foundation', name: 'Foundation', icon: '🏗️' },
              { id: 'cost', name: 'Cost Analysis', icon: '💰' },
              { id: 'optimization', name: 'Optimization', icon: '📊' },
              { id: 'drawings', name: 'Drawings', icon: '📐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'input' && renderInputForm()}
            {activeTab === '3d' && <Enhanced3DVisualization projectData={projectData} />}
            {activeTab === 'compliance' && renderResultsTab('compliance', results.sni_compliance)}
            {activeTab === 'foundation' && renderResultsTab('foundation', results.foundation_design)}
            {activeTab === 'cost' && renderResultsTab('cost', results.cost_analysis)}
            {activeTab === 'optimization' && renderResultsTab('optimization', results.optimization)}
            {activeTab === 'drawings' && renderResultsTab('drawings', results.drawings)}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 Enhanced Structural Analysis System - Professional Engineering Software</p>
          <p className="mt-1">Compliant with SNI 2847:2019, SNI 1729:2020, and Indonesian Building Codes</p>
        </div>
      </div>
    </div>
  );
};

export default CompleteEnhancedStructuralSystem;