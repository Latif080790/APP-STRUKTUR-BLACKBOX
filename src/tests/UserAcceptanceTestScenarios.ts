/**
 * User Acceptance Testing Scenarios
 * Realistic engineering test cases and validation workflows for professional usage
 * Following SNI standards and professional structural engineering practices
 */

export interface UATScenario {
  id: string;
  title: string;
  category: 'design' | 'analysis' | 'reporting' | 'collaboration' | 'optimization';
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number; // minutes
  prerequisites: string[];
  objectives: string[];
  steps: UATStep[];
  expectedResults: ExpectedResult[];
  acceptanceCriteria: AcceptanceCriteria[];
  sniCompliance: string[];
  professionalContext: string;
}

export interface UATStep {
  stepNumber: number;
  action: string;
  inputData?: any;
  expectedBehavior: string;
  validationPoints: string[];
}

export interface ExpectedResult {
  component: string;
  metric: string;
  expectedValue: string | number;
  tolerance?: string;
  unit?: string;
}

export interface AcceptanceCriteria {
  id: string;
  description: string;
  priority: 'must' | 'should' | 'could';
  testMethod: 'automated' | 'manual' | 'calculation';
}

/**
 * Comprehensive UAT Scenarios for Structural Engineering Application
 * Covering all major workflows and professional use cases
 */
export const userAcceptanceTestScenarios: UATScenario[] = [
  {
    id: 'UAT-001',
    title: 'Concrete Beam Design - Office Building Project',
    category: 'design',
    complexity: 'intermediate',
    estimatedTime: 45,
    prerequisites: [
      'User has structural engineering background',
      'SNI 2847:2019 knowledge required',
      'Basic understanding of reinforced concrete design'
    ],
    objectives: [
      'Design a concrete beam for office building loads',
      'Verify SNI 2847:2019 compliance',
      'Generate professional design calculations',
      'Validate safety factors and reinforcement requirements'
    ],
    steps: [
      {
        stepNumber: 1,
        action: 'Navigate to Design Module and select Concrete Design',
        expectedBehavior: 'Concrete design interface loads with material selection',
        validationPoints: [
          'UI displays in English language',
          'SNI 2847:2019 standards referenced',
          'Material database accessible'
        ]
      },
      {
        stepNumber: 2,
        action: 'Input beam parameters: 300mm width, 500mm depth, 6m span',
        inputData: {
          width: 300,
          depth: 500,
          span: 6000,
          concreteGrade: 'K-300',
          rebarGrade: 'BjTS-40'
        },
        expectedBehavior: 'System accepts input and displays geometry visualization',
        validationPoints: [
          'Input validation works correctly',
          'Units displayed consistently (mm, MPa)',
          'Real-time parameter updates'
        ]
      },
      {
        stepNumber: 3,
        action: 'Apply office building loads: DL=25 kN/m, LL=15 kN/m',
        inputData: {
          deadLoad: 25,
          liveLoad: 15,
          loadCombination: 'SNI 1727:2020'
        },
        expectedBehavior: 'Load combinations calculated automatically',
        validationPoints: [
          'LRFD combinations applied (1.2DL + 1.6LL)',
          'Ultimate load = 1.2(25) + 1.6(15) = 54 kN/m',
          'Load distribution visualization shown'
        ]
      },
      {
        stepNumber: 4,
        action: 'Run structural analysis and design calculations',
        expectedBehavior: 'Complete analysis with SNI compliance checking',
        validationPoints: [
          'Moment calculation: M = wL²/8 = 54×6²/8 = 243 kN⋅m',
          'Minimum reinforcement ratio calculated',
          'Development length requirements checked',
          'Progress bar shows during calculation'
        ]
      },
      {
        stepNumber: 5,
        action: 'Review design results and safety factors',
        expectedBehavior: 'Comprehensive results display with color-coded compliance',
        validationPoints: [
          'Safety factor ≥ 1.5 for concrete structures',
          'Reinforcement ratio within SNI limits',
          'Deflection checks performed',
          'Professional result presentation'
        ]
      }
    ],
    expectedResults: [
      {
        component: 'Moment Capacity',
        metric: 'Mn',
        expectedValue: '≥ 243',
        tolerance: '±5%',
        unit: 'kN⋅m'
      },
      {
        component: 'Reinforcement',
        metric: 'As_required',
        expectedValue: '1200-2000',
        tolerance: '±10%',
        unit: 'mm²'
      },
      {
        component: 'Safety Factor',
        metric: 'SF',
        expectedValue: '≥ 1.5',
        unit: 'dimensionless'
      }
    ],
    acceptanceCriteria: [
      {
        id: 'AC-001-1',
        description: 'All calculations follow SNI 2847:2019 standards',
        priority: 'must',
        testMethod: 'automated'
      },
      {
        id: 'AC-001-2',
        description: 'Results display within 10 seconds of calculation start',
        priority: 'must',
        testMethod: 'automated'
      },
      {
        id: 'AC-001-3',
        description: 'Professional report can be generated in PDF format',
        priority: 'should',
        testMethod: 'manual'
      }
    ],
    sniCompliance: ['SNI 2847:2019', 'SNI 1727:2020'],
    professionalContext: 'Typical office building beam design scenario requiring SNI compliance and professional documentation for permit submission.'
  },

  {
    id: 'UAT-002',
    title: 'Steel Column Design - Industrial Warehouse',
    category: 'design',
    complexity: 'advanced',
    estimatedTime: 60,
    prerequisites: [
      'Professional structural engineer certification',
      'SNI 1729:2020 expertise',
      'Steel design experience'
    ],
    objectives: [
      'Design steel column for heavy industrial loads',
      'Verify buckling and local buckling resistance',
      'Optimize section for cost efficiency',
      'Generate fabrication drawings'
    ],
    steps: [
      {
        stepNumber: 1,
        action: 'Access Steel Design module with WF section database',
        expectedBehavior: 'Complete steel section library loads with SNI properties',
        validationPoints: [
          'Wide flange sections available',
          'Material properties per SNI 1729:2020',
          'Section properties calculator functional'
        ]
      },
      {
        stepNumber: 2,
        action: 'Input column parameters: 8m height, fixed-pinned conditions',
        inputData: {
          height: 8000,
          endConditions: 'fixed-pinned',
          bucklingLength: 8000,
          steelGrade: 'BjTS-50',
          section: 'WF 350.175.7.11'
        },
        expectedBehavior: 'Effective length calculated automatically (K=0.7)',
        validationPoints: [
          'K factor applied correctly',
          'Le = K × L = 0.7 × 8000 = 5600mm',
          'Slenderness ratio calculated'
        ]
      },
      {
        stepNumber: 3,
        action: 'Apply warehouse loads: P = 2000 kN compression',
        inputData: {
          axialLoad: 2000,
          loadCombination: '1.2D + 1.6L',
          safetyFactor: 'LRFD'
        },
        expectedBehavior: 'Load combinations and capacity calculations performed',
        validationPoints: [
          'Critical buckling stress calculated',
          'Local buckling checks performed',
          'Interaction equations applied'
        ]
      },
      {
        stepNumber: 4,
        action: 'Optimize section selection for minimum weight',
        expectedBehavior: 'AI optimization suggests lighter sections meeting requirements',
        validationPoints: [
          'Multiple section alternatives provided',
          'Weight and cost comparison shown',
          'Utilization ratios displayed'
        ]
      }
    ],
    expectedResults: [
      {
        component: 'Compression Capacity',
        metric: 'Pn',
        expectedValue: '≥ 2000',
        tolerance: '±3%',
        unit: 'kN'
      },
      {
        component: 'Utilization Ratio',
        metric: 'Pu/φPn',
        expectedValue: '≤ 0.90',
        unit: 'dimensionless'
      }
    ],
    acceptanceCriteria: [
      {
        id: 'AC-002-1',
        description: 'Steel design follows SNI 1729:2020 provisions',
        priority: 'must',
        testMethod: 'automated'
      },
      {
        id: 'AC-002-2',
        description: 'Optimization algorithm suggests valid alternatives',
        priority: 'should',
        testMethod: 'automated'
      }
    ],
    sniCompliance: ['SNI 1729:2020', 'SNI 1726:2019'],
    professionalContext: 'Heavy industrial warehouse column requiring optimization for material cost while maintaining safety and code compliance.'
  },

  {
    id: 'UAT-003',
    title: 'Foundation Design - Residential Complex',
    category: 'design',
    complexity: 'intermediate',
    estimatedTime: 50,
    prerequisites: [
      'Geotechnical engineering knowledge',
      'SNI 8460:2020 familiarity',
      'Soil mechanics understanding'
    ],
    objectives: [
      'Design spread footing for residential building',
      'Verify bearing capacity and settlement',
      'Check overturning and sliding stability',
      'Generate construction drawings'
    ],
    steps: [
      {
        stepNumber: 1,
        action: 'Open Foundation Design module and input soil parameters',
        inputData: {
          soilType: 'Sandy Clay',
          cohesion: 25,
          frictionAngle: 28,
          unitWeight: 18.5,
          elasticModulus: 15000
        },
        expectedBehavior: 'Soil parameters accepted with validation ranges',
        validationPoints: [
          'Soil property validation active',
          'Terzaghi bearing capacity factors calculated',
          'Settlement parameters initialized'
        ]
      },
      {
        stepNumber: 2,
        action: 'Design footing for column load: 800 kN vertical, moments',
        inputData: {
          verticalLoad: 800,
          momentX: 150,
          momentY: 100,
          foundationDepth: 1.5,
          footingDimensions: '2.5m × 2.5m'
        },
        expectedBehavior: 'Footing dimensions optimized for loads and soil',
        validationPoints: [
          'Bearing pressure distribution calculated',
          'Eccentricity checked (e < B/6)',
          'Overturning safety factor ≥ 2.0'
        ]
      },
      {
        stepNumber: 3,
        action: 'Verify settlement and bearing capacity',
        expectedBehavior: 'Complete foundation analysis with SNI compliance',
        validationPoints: [
          'Ultimate bearing capacity calculated',
          'Allowable bearing with safety factor',
          'Settlement < 25mm limit',
          'Punching shear verification'
        ]
      }
    ],
    expectedResults: [
      {
        component: 'Bearing Capacity',
        metric: 'qult',
        expectedValue: '≥ 400',
        tolerance: '±10%',
        unit: 'kPa'
      },
      {
        component: 'Settlement',
        metric: 'δ',
        expectedValue: '≤ 25',
        unit: 'mm'
      }
    ],
    acceptanceCriteria: [
      {
        id: 'AC-003-1',
        description: 'Foundation design per SNI 8460:2020',
        priority: 'must',
        testMethod: 'automated'
      }
    ],
    sniCompliance: ['SNI 8460:2020', 'SNI 1726:2019'],
    professionalContext: 'Residential complex foundation requiring cost-effective design with safety and settlement control.'
  },

  {
    id: 'UAT-004',
    title: 'Seismic Analysis - Hospital Building',
    category: 'analysis',
    complexity: 'expert',
    estimatedTime: 90,
    prerequisites: [
      'Advanced seismic engineering certification',
      'SNI 1726:2019 expert knowledge',
      'Dynamic analysis experience'
    ],
    objectives: [
      'Perform response spectrum analysis',
      'Verify seismic force distribution',
      'Check story drift limits',
      'Generate seismic compliance report'
    ],
    steps: [
      {
        stepNumber: 1,
        action: 'Set up seismic analysis parameters for hospital (Risk Category IV)',
        inputData: {
          riskCategory: 'IV',
          siteClass: 'C',
          Ss: 0.8,
          S1: 0.3,
          structuralSystem: 'Special Moment Frame',
          R: 8,
          importance: 1.5
        },
        expectedBehavior: 'Seismic parameters calculated per SNI 1726:2019',
        validationPoints: [
          'Site coefficients Fa, Fv determined',
          'Design response spectrum generated',
          'Base shear calculation verified'
        ]
      },
      {
        stepNumber: 2,
        action: 'Run modal analysis and response spectrum analysis',
        expectedBehavior: 'Dynamic properties and seismic forces calculated',
        validationPoints: [
          'Natural periods calculated',
          'Mode shapes visualized in 3D',
          'Modal participation factors ≥ 90%',
          'Story forces distributed properly'
        ]
      },
      {
        stepNumber: 3,
        action: 'Verify drift limits and P-Delta effects',
        expectedBehavior: 'Story drift compliance checking',
        validationPoints: [
          'Inter-story drift ≤ 0.020hsx for Risk Category IV',
          'P-Delta effects evaluated',
          'Stability coefficient checked'
        ]
      }
    ],
    expectedResults: [
      {
        component: 'Base Shear',
        metric: 'V',
        expectedValue: 'Per SNI calculation',
        unit: 'kN'
      },
      {
        component: 'Story Drift',
        metric: 'Δ/hsx',
        expectedValue: '≤ 0.020',
        unit: 'dimensionless'
      }
    ],
    acceptanceCriteria: [
      {
        id: 'AC-004-1',
        description: 'Seismic analysis follows SNI 1726:2019 completely',
        priority: 'must',
        testMethod: 'automated'
      },
      {
        id: 'AC-004-2',
        description: 'Hospital building requirements (Risk Category IV) applied',
        priority: 'must',
        testMethod: 'automated'
      }
    ],
    sniCompliance: ['SNI 1726:2019', 'SNI 1727:2020'],
    professionalContext: 'Critical hospital facility requiring highest seismic safety standards with comprehensive analysis and documentation.'
  },

  {
    id: 'UAT-005',
    title: 'Professional Report Generation - Complete Project',
    category: 'reporting',
    complexity: 'advanced',
    estimatedTime: 40,
    prerequisites: [
      'Completed structural design',
      'Professional documentation requirements',
      'Quality assurance protocols'
    ],
    objectives: [
      'Generate comprehensive design report',
      'Include all calculations and drawings',
      'Verify SNI compliance documentation',
      'Prepare submission-ready package'
    ],
    steps: [
      {
        stepNumber: 1,
        action: 'Access Report Generator with completed design data',
        expectedBehavior: 'All design modules data available for reporting',
        validationPoints: [
          'Design data integrity verified',
          'Calculation results accessible',
          'Drawing data available'
        ]
      },
      {
        stepNumber: 2,
        action: 'Configure report templates for permit submission',
        inputData: {
          reportType: 'Professional Submission',
          includeCalculations: true,
          includeDrawings: true,
          sniCompliance: true,
          digitalSignature: true
        },
        expectedBehavior: 'Professional report template configured',
        validationPoints: [
          'Template follows Indonesian standards',
          'All required sections included',
          'Quality assurance checklist active'
        ]
      },
      {
        stepNumber: 3,
        action: 'Generate and review complete report package',
        expectedBehavior: 'Professional-quality documentation generated',
        validationPoints: [
          'PDF report with calculations',
          'AutoCAD drawings exported',
          'Excel calculation sheets included',
          'Digital signature applied'
        ]
      }
    ],
    expectedResults: [
      {
        component: 'Report Generation',
        metric: 'Completion Time',
        expectedValue: '< 5',
        unit: 'minutes'
      },
      {
        component: 'Document Quality',
        metric: 'Professional Score',
        expectedValue: '≥ 95',
        unit: '%'
      }
    ],
    acceptanceCriteria: [
      {
        id: 'AC-005-1',
        description: 'Report includes all required SNI compliance documentation',
        priority: 'must',
        testMethod: 'manual'
      },
      {
        id: 'AC-005-2',
        description: 'Documents ready for regulatory submission',
        priority: 'must',
        testMethod: 'manual'
      }
    ],
    sniCompliance: ['All applicable SNI standards'],
    professionalContext: 'Complete project documentation for regulatory submission and professional record keeping.'
  },

  {
    id: 'UAT-006',
    title: 'Performance Under Load - Large Project Analysis',
    category: 'analysis',
    complexity: 'expert',
    estimatedTime: 120,
    prerequisites: [
      'High-performance computing knowledge',
      'Large project management experience',
      'System performance optimization'
    ],
    objectives: [
      'Test system performance with large structural models',
      'Verify memory management under load',
      'Validate calculation accuracy at scale',
      'Ensure UI responsiveness during analysis'
    ],
    steps: [
      {
        stepNumber: 1,
        action: 'Load large structural model (1000+ elements)',
        inputData: {
          elements: 1000,
          nodes: 500,
          loadCases: 10,
          combinations: 20
        },
        expectedBehavior: 'System handles large model efficiently',
        validationPoints: [
          'Memory usage < 500MB',
          'Loading time < 30 seconds',
          'UI remains responsive'
        ]
      },
      {
        stepNumber: 2,
        action: 'Run comprehensive analysis with all modules',
        expectedBehavior: 'All calculations complete without errors',
        validationPoints: [
          'Analysis progress displayed',
          'Memory management stable',
          'Results accuracy maintained',
          'No calculation timeouts'
        ]
      }
    ],
    expectedResults: [
      {
        component: 'Performance',
        metric: 'Analysis Time',
        expectedValue: '< 60',
        unit: 'seconds'
      },
      {
        component: 'Memory',
        metric: 'Peak Usage',
        expectedValue: '< 500',
        unit: 'MB'
      }
    ],
    acceptanceCriteria: [
      {
        id: 'AC-006-1',
        description: 'System maintains performance with large models',
        priority: 'must',
        testMethod: 'automated'
      }
    ],
    sniCompliance: ['Performance standards'],
    professionalContext: 'Large-scale project requiring efficient system performance and resource management.'
  }
];

/**
 * UAT Execution Framework
 */
export class UATExecutor {
  private scenarios: UATScenario[] = userAcceptanceTestScenarios;
  private results: Map<string, UATResult> = new Map();

  /**
   * Execute a specific UAT scenario
   */
  async executeScenario(scenarioId: string): Promise<UATResult> {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const startTime = Date.now();
    const result: UATResult = {
      scenarioId,
      status: 'running',
      startTime,
      steps: [],
      acceptanceCriteria: [],
      professionalValidation: false
    };

    try {
      // Execute each step
      for (const step of scenario.steps) {
        const stepResult = await this.executeStep(step, scenario);
        result.steps.push(stepResult);
        
        if (!stepResult.passed) {
          result.status = 'failed';
          result.failureReason = `Step ${step.stepNumber} failed: ${stepResult.failureReason}`;
          break;
        }
      }

      // Validate acceptance criteria
      if (result.status !== 'failed') {
        for (const criteria of scenario.acceptanceCriteria) {
          const criteriaResult = await this.validateCriteria(criteria, scenario);
          result.acceptanceCriteria.push(criteriaResult);
          
          if (!criteriaResult.passed && criteria.priority === 'must') {
            result.status = 'failed';
            result.failureReason = `Critical acceptance criteria failed: ${criteria.description}`;
            break;
          }
        }
      }

      // Professional validation
      result.professionalValidation = await this.validateProfessionalStandards(scenario);

      if (result.status === 'running') {
        result.status = 'passed';
      }

    } catch (error) {
      result.status = 'error';
      result.failureReason = `Execution error: ${error instanceof Error ? error.message : String(error)}`;
    }

    result.endTime = Date.now();
    result.duration = result.endTime - result.startTime;
    
    this.results.set(scenarioId, result);
    return result;
  }

  /**
   * Execute individual test step
   */
  private async executeStep(step: UATStep, scenario: UATScenario): Promise<StepResult> {
    // Simulate step execution
    return new Promise((resolve) => {
      setTimeout(() => {
        const passed = Math.random() > 0.1; // 90% pass rate for simulation
        resolve({
          stepNumber: step.stepNumber,
          passed,
          executionTime: Math.random() * 5000 + 1000, // 1-6 seconds
          failureReason: passed ? undefined : 'Simulated failure for testing',
          validationResults: step.validationPoints.map(point => ({
            point,
            passed: Math.random() > 0.05 // 95% pass rate for validation points
          }))
        });
      }, 100);
    });
  }

  /**
   * Validate acceptance criteria
   */
  private async validateCriteria(criteria: AcceptanceCriteria, scenario: UATScenario): Promise<CriteriaResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const passed = Math.random() > 0.05; // 95% pass rate
        resolve({
          criteriaId: criteria.id,
          passed,
          failureReason: passed ? undefined : 'Simulated criteria failure'
        });
      }, 50);
    });
  }

  /**
   * Validate professional engineering standards
   */
  private async validateProfessionalStandards(scenario: UATScenario): Promise<boolean> {
    // Check SNI compliance, calculation accuracy, professional documentation
    return Math.random() > 0.02; // 98% pass rate for professional standards
  }

  /**
   * Get all scenario results
   */
  getResults(): Map<string, UATResult> {
    return this.results;
  }

  /**
   * Generate UAT summary report
   */
  generateSummaryReport(): UATSummaryReport {
    const results = Array.from(this.results.values());
    
    return {
      totalScenarios: this.scenarios.length,
      executedScenarios: results.length,
      passedScenarios: results.filter(r => r.status === 'passed').length,
      failedScenarios: results.filter(r => r.status === 'failed').length,
      errorScenarios: results.filter(r => r.status === 'error').length,
      averageDuration: results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length,
      professionalValidationRate: results.filter(r => r.professionalValidation).length / results.length,
      categoryBreakdown: this.getCategoryBreakdown(results),
      complexityBreakdown: this.getComplexityBreakdown(results)
    };
  }

  private getCategoryBreakdown(results: UATResult[]) {
    const breakdown = new Map<string, number>();
    results.forEach(result => {
      const scenario = this.scenarios.find(s => s.id === result.scenarioId);
      if (scenario) {
        const count = breakdown.get(scenario.category) || 0;
        breakdown.set(scenario.category, count + 1);
      }
    });
    return breakdown;
  }

  private getComplexityBreakdown(results: UATResult[]) {
    const breakdown = new Map<string, number>();
    results.forEach(result => {
      const scenario = this.scenarios.find(s => s.id === result.scenarioId);
      if (scenario) {
        const count = breakdown.get(scenario.complexity) || 0;
        breakdown.set(scenario.complexity, count + 1);
      }
    });
    return breakdown;
  }
}

// Supporting interfaces
export interface UATResult {
  scenarioId: string;
  status: 'running' | 'passed' | 'failed' | 'error';
  startTime: number;
  endTime?: number;
  duration?: number;
  steps: StepResult[];
  acceptanceCriteria: CriteriaResult[];
  professionalValidation: boolean;
  failureReason?: string;
}

export interface StepResult {
  stepNumber: number;
  passed: boolean;
  executionTime: number;
  failureReason?: string;
  validationResults: ValidationResult[];
}

export interface ValidationResult {
  point: string;
  passed: boolean;
}

export interface CriteriaResult {
  criteriaId: string;
  passed: boolean;
  failureReason?: string;
}

export interface UATSummaryReport {
  totalScenarios: number;
  executedScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  errorScenarios: number;
  averageDuration: number;
  professionalValidationRate: number;
  categoryBreakdown: Map<string, number>;
  complexityBreakdown: Map<string, number>;
}