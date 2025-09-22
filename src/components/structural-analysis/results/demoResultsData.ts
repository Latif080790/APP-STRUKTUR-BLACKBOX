/**
 * Demo data generator for comprehensive results dashboard
 * Generates realistic structural analysis results for testing and demonstration
 */

import { ComprehensiveAnalysisResult } from './ComprehensiveResultsDashboard';

export const generateDemoResults = (projectName: string = "Demo Building Project"): ComprehensiveAnalysisResult => {
  return {
    general: {
      projectName,
      analysisDate: new Date().toLocaleDateString('id-ID'),
      analysisType: "Linear Static + Modal + Response Spectrum",
      buildingCode: "SNI 1726:2019, SNI 2847:2019",
      analyst: "Structural Analysis System",
      status: "completed",
      totalElements: 245,
      totalNodes: 156,
      convergence: true,
      iterations: 12
    },
    structural: {
      maxDisplacement: {
        value: 15.8,
        location: "Node 45 (Top Floor)",
        direction: "X-Direction",
        allowable: 25.0,
        ratio: 0.632
      },
      maxStress: {
        value: 18.5,
        location: "Element B-12 (Beam)",
        type: "Bending Stress",
        allowable: 25.0,
        ratio: 0.74
      },
      maxDeflection: {
        value: 12.3,
        location: "Beam B-25",
        allowable: 20.0,
        ratio: 0.615
      },
      stability: {
        bucklingFactors: [2.45, 2.78, 3.12, 3.89, 4.23],
        modalFrequencies: [2.85, 3.21, 4.78, 6.12, 7.85, 9.23, 11.45, 13.67, 15.89, 18.23],
        dampingRatios: [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05]
      }
    },
    seismic: {
      baseShear: {
        x: 1250.5,
        y: 1180.3,
        total: 1715.2
      },
      storyDrift: {
        max: 0.018,
        allowable: 0.025,
        location: "Story 5"
      },
      torsion: {
        irregularity: false,
        ratio: 1.15
      },
      responseSpectrumFactors: {
        Ss: 1.25,
        S1: 0.45,
        SDS: 0.85,
        SD1: 0.32,
        Fa: 1.1,
        Fv: 1.5
      }
    },
    design: {
      reinforcement: {
        beams: [
          { id: "B-01", longitudinal: { top: 12.5, bottom: 8.2 }, transverse: 6.8, utilization: 0.72 },
          { id: "B-02", longitudinal: { top: 10.8, bottom: 7.5 }, transverse: 5.9, utilization: 0.65 },
          { id: "B-03", longitudinal: { top: 14.2, bottom: 9.8 }, transverse: 7.5, utilization: 0.85 },
          { id: "B-04", longitudinal: { top: 11.5, bottom: 8.0 }, transverse: 6.2, utilization: 0.68 },
          { id: "B-05", longitudinal: { top: 13.8, bottom: 9.2 }, transverse: 7.1, utilization: 0.78 },
          { id: "B-06", longitudinal: { top: 9.8, bottom: 6.5 }, transverse: 5.5, utilization: 0.58 },
          { id: "B-07", longitudinal: { top: 15.2, bottom: 10.5 }, transverse: 8.2, utilization: 0.92 },
          { id: "B-08", longitudinal: { top: 12.0, bottom: 8.5 }, transverse: 6.5, utilization: 0.70 },
          { id: "B-09", longitudinal: { top: 11.2, bottom: 7.8 }, transverse: 6.0, utilization: 0.63 },
          { id: "B-10", longitudinal: { top: 13.5, bottom: 9.0 }, transverse: 7.0, utilization: 0.75 }
        ],
        columns: [
          { id: "C-01", longitudinal: 24.8, transverse: 12.5, utilization: 0.68 },
          { id: "C-02", longitudinal: 28.2, transverse: 14.2, utilization: 0.78 },
          { id: "C-03", longitudinal: 22.5, transverse: 11.5, utilization: 0.62 },
          { id: "C-04", longitudinal: 26.8, transverse: 13.8, utilization: 0.74 },
          { id: "C-05", longitudinal: 30.2, transverse: 15.5, utilization: 0.85 },
          { id: "C-06", longitudinal: 21.5, transverse: 11.0, utilization: 0.58 },
          { id: "C-07", longitudinal: 32.5, transverse: 16.8, utilization: 0.92 },
          { id: "C-08", longitudinal: 25.8, transverse: 13.2, utilization: 0.71 },
          { id: "C-09", longitudinal: 23.2, transverse: 12.0, utilization: 0.65 },
          { id: "C-10", longitudinal: 27.5, transverse: 14.5, utilization: 0.76 }
        ]
      },
      utilization: {
        max: 0.92,
        average: 0.71,
        distribution: [
          { range: "0-20%", count: 15, percentage: 6.1 },
          { range: "20-40%", count: 32, percentage: 13.1 },
          { range: "40-60%", count: 68, percentage: 27.8 },
          { range: "60-80%", count: 85, percentage: 34.7 },
          { range: "80-100%", count: 45, percentage: 18.4 }
        ]
      }
    },
    economics: {
      materialQuantities: {
        concrete: { 
          volume: 285.5, 
          cost: 142750000 // Rp 500,000 per m³
        },
        steel: { 
          weight: 12850, 
          cost: 192750000 // Rp 15,000 per kg
        },
        formwork: { 
          area: 1250.8, 
          cost: 87556000 // Rp 70,000 per m²
        }
      },
      totalCost: 423056000, // Total of all materials
      costPerSquareMeter: 5287000 // For 80 m² building
    },
    quality: {
      checks: [
        {
          category: "Structural Adequacy",
          description: "Maximum stress within allowable limits",
          status: "pass",
          value: 18.5,
          limit: 25.0,
          recommendation: "Design is adequate with good safety margin"
        },
        {
          category: "Displacement Control",
          description: "Story drift within code limits",
          status: "pass",
          value: 1.8,
          limit: 2.5,
          recommendation: "Displacement control satisfactory"
        },
        {
          category: "Seismic Performance",
          description: "Base shear and modal analysis",
          status: "pass",
          value: 1715.2,
          limit: 2000.0,
          recommendation: "Seismic design meets code requirements"
        },
        {
          category: "Reinforcement Ratio",
          description: "Steel reinforcement ratios",
          status: "warning",
          value: 92.0,
          limit: 95.0,
          recommendation: "Some elements approaching maximum utilization"
        },
        {
          category: "Deflection Control",
          description: "Beam deflection limits",
          status: "pass",
          value: 12.3,
          limit: 20.0,
          recommendation: "Deflection control adequate"
        },
        {
          category: "Foundation Design",
          description: "Foundation bearing capacity",
          status: "pass",
          value: 185.5,
          limit: 250.0,
          recommendation: "Foundation design satisfactory"
        },
        {
          category: "Connection Design",
          description: "Beam-column connections",
          status: "pass",
          value: 78.5,
          limit: 100.0,
          recommendation: "Connection design adequate"
        },
        {
          category: "Torsional Irregularity",
          description: "Building torsional response",
          status: "pass",
          value: 1.15,
          limit: 1.2,
          recommendation: "No significant torsional irregularity"
        }
      ],
      overallRating: "good"
    }
  };
};

export default generateDemoResults;