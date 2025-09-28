/**
 * Smart Design Input Validator with Info Tips and Recommendations
 * Provides intelligent guidance and auto-corrections for design input errors
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Alert, AlertDescription } from '../../ui/alert';
import { 
  AlertTriangle, CheckCircle, Info, Lightbulb, 
  Zap, TrendingUp, Shield, Wrench, BookOpen,
  X, Check, ArrowRight, Calculator
} from 'lucide-react';

// Enhanced validation and recommendation types
interface ValidationResult {
  field: string;
  status: 'valid' | 'warning' | 'error' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  explanation: string;
  recommendation?: string;
  autoFix?: {
    description: string;
    newValue: any;
    reason: string;
    impact: string;
  };
  references: {
    code: string;
    section: string;
    description: string;
  }[];
}

interface IntelligentRecommendation {
  id: string;
  type: 'optimization' | 'safety' | 'economy' | 'constructability' | 'code_compliance';
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  implementation: {
    changes: Record<string, any>;
    description: string;
    effort: 'easy' | 'moderate' | 'complex';
  };
  impact: {
    cost: number; // percentage change
    performance: number; // percentage change
    constructability: number; // 1-5 scale
  };
  codeReferences: string[];
}

interface SmartTipContent {
  title: string;
  description: string;
  examples: string[];
  commonMistakes: string[];
  bestPractices: string[];
  codeRequirements: string[];
  calculationTips?: string[];
}

interface DesignInputValidatorProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onValidationChange?: (isValid: boolean, errors: ValidationResult[]) => void;
  designStandard: 'SNI' | 'ACI' | 'AISC';
  elementType: 'beam' | 'column' | 'slab' | 'footing' | 'wall';
}

// Smart Tips Database
const SMART_TIPS: Record<string, SmartTipContent> = {
  'geometry.width': {
    title: 'Element Width Guidelines',
    description: 'Width affects flexural capacity, shear resistance, and constructability.',
    examples: [
      'Beams: L/10 to L/15 for typical spans',
      'Columns: 300-800mm for buildings',
      'Footings: Based on soil bearing capacity'
    ],
    commonMistakes: [
      'Too narrow causing excessive deflection',
      'Too wide causing unnecessary material cost',
      'Not considering formwork modularity'
    ],
    bestPractices: [
      'Use modular dimensions (50mm increments)',
      'Consider reinforcement arrangement',
      'Account for cover requirements',
      'Check deflection limits early'
    ],
    codeRequirements: [
      'SNI 2847: Minimum beam width 250mm',
      'SNI 2847: b/h ratio typically 0.3-0.8',
      'Consider fire resistance requirements'
    ],
    calculationTips: [
      'Check shear capacity: Vc = (1/6)√fc\' × bw × d',
      'Verify reinforcement fit: bars + stirrups + cover',
      'Consider torsion if applicable'
    ]
  },
  'geometry.height': {
    title: 'Element Height Optimization',
    description: 'Height is critical for moment capacity and serviceability.',
    examples: [
      'Beams: L/12 to L/20 for typical loading',
      'Columns: Based on slenderness ratio',
      'Slabs: L/30 to L/25 for deflection'
    ],
    commonMistakes: [
      'Insufficient height causing flexural failure',
      'Excessive height causing buckling',
      'Ignoring minimum reinforcement requirements'
    ],
    bestPractices: [
      'Start with span/depth ratios from code',
      'Consider construction sequences',
      'Account for serviceability limits',
      'Optimize for material efficiency'
    ],
    codeRequirements: [
      'SNI 2847: Minimum depth for deflection control',
      'Slenderness limits for columns',
      'Fire resistance thickness requirements'
    ]
  },
  'materials.concrete.fc': {
    title: 'Concrete Strength Selection',
    description: 'Concrete strength affects capacity, cost, and constructability.',
    examples: [
      'K-300 (25 MPa): General construction',
      'K-400 (35 MPa): High-rise buildings',
      'K-500 (45 MPa): Specialized applications'
    ],
    commonMistakes: [
      'Over-specifying strength unnecessarily',
      'Under-specifying for high loads',
      'Ignoring local material availability'
    ],
    bestPractices: [
      'Match strength to structural requirements',
      'Consider pump-ability and workability',
      'Account for quality control capabilities',
      'Balance strength and economy'
    ],
    codeRequirements: [
      'SNI 2847: Minimum fc\' = 17 MPa for structural',
      'Higher grades for seismic zones',
      'Durability requirements by exposure'
    ]
  },
  'materials.steel.fy': {
    title: 'Steel Grade Selection',
    description: 'Steel grade affects capacity, ductility, and cost.',
    examples: [
      'BjTS-40 (400 MPa): Standard reinforcement',
      'BjTS-50 (500 MPa): High-strength applications',
      'BJ-37 (240 MPa): Structural steel'
    ],
    commonMistakes: [
      'Using high-grade steel unnecessarily',
      'Insufficient ductility for seismic zones',
      'Ignoring weldability requirements'
    ],
    bestPractices: [
      'Match grade to design requirements',
      'Consider seismic ductility needs',
      'Verify local availability',
      'Balance strength and cost'
    ],
    codeRequirements: [
      'SNI 2847: fy ≤ 550 MPa for reinforcement',
      'SNI 1729: Various grades for structural steel',
      'Seismic zones require special detailing'
    ]
  },
  'loads.deadLoad': {
    title: 'Dead Load Estimation',
    description: 'Accurate dead load is essential for safe design.',
    examples: [
      'RC slab: 24 kN/m³ × thickness',
      'Finishes: 1-3 kN/m² typical',
      'Partitions: 1-2 kN/m² for flexibility'
    ],
    commonMistakes: [
      'Underestimating finishes and MEP',
      'Ignoring future modifications',
      'Inaccurate material densities'
    ],
    bestPractices: [
      'Include all permanent loads',
      'Account for construction loads',
      'Consider staged construction',
      'Use conservative estimates when uncertain'
    ],
    codeRequirements: [
      'SNI 1727: Minimum dead load factors',
      'Include all permanent elements',
      'Consider future superimposed loads'
    ]
  }
};

// Validation Rules Engine
class DesignValidationEngine {
  private standard: 'SNI' | 'ACI' | 'AISC';
  private elementType: string;

  constructor(standard: 'SNI' | 'ACI' | 'AISC', elementType: string) {
    this.standard = standard;
    this.elementType = elementType;
  }

  validateField(field: string, value: any, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];

    switch (field) {
      case 'geometry.width':
        results.push(...this.validateWidth(value, formData));
        break;
      case 'geometry.height':
        results.push(...this.validateHeight(value, formData));
        break;
      case 'materials.concrete.fc':
        results.push(...this.validateConcreteStrength(value, formData));
        break;
      case 'materials.steel.fy':
        results.push(...this.validateSteelGrade(value, formData));
        break;
      case 'loads.deadLoad':
        results.push(...this.validateDeadLoad(value, formData));
        break;
      case 'loads.liveLoad':
        results.push(...this.validateLiveLoad(value, formData));
        break;
      default:
        break;
    }

    return results;
  }

  private validateWidth(width: number, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];
    const minWidth = this.getMinimumWidth();
    const height = formData.geometry?.height || 0;

    // Minimum width check
    if (width < minWidth) {
      results.push({
        field: 'geometry.width',
        status: 'error',
        severity: 'high',
        message: `Width too small (minimum ${minWidth}mm)`,
        explanation: 'Insufficient width may cause shear failure and construction difficulties.',
        recommendation: `Increase width to at least ${minWidth}mm for structural adequacy.`,
        autoFix: {
          description: `Set width to minimum required: ${minWidth}mm`,
          newValue: minWidth,
          reason: `${this.standard} requires minimum width of ${minWidth}mm for ${this.elementType}`,
          impact: 'Ensures structural safety and code compliance'
        },
        references: [{
          code: this.standard === 'SNI' ? 'SNI 2847:2019' : 'ACI 318',
          section: '9.5.1',
          description: 'Minimum dimensions for structural members'
        }]
      });
    }

    // Width-to-height ratio check
    if (height > 0) {
      const ratio = width / height;
      const [minRatio, maxRatio] = this.getWidthHeightRatioLimits();
      
      if (ratio < minRatio) {
        results.push({
          field: 'geometry.width',
          status: 'warning',
          severity: 'medium',
          message: `Width-to-height ratio (${ratio.toFixed(2)}) is low`,
          explanation: 'Low b/h ratio may cause lateral instability and excessive deflection.',
          recommendation: `Consider increasing width to achieve b/h ratio of ${minRatio}-${maxRatio}`,
          references: [{
            code: this.standard === 'SNI' ? 'SNI 2847:2019' : 'ACI 318',
            section: '9.5.2',
            description: 'Proportioning guidelines for beams'
          }]
        });
      }
    }

    // Constructability check
    if (width % 50 !== 0) {
      results.push({
        field: 'geometry.width',
        status: 'info',
        severity: 'low',
        message: 'Consider using 50mm modular dimensions',
        explanation: 'Modular dimensions simplify formwork and reduce construction cost.',
        recommendation: `Round to nearest 50mm: ${Math.round(width / 50) * 50}mm`,
        autoFix: {
          description: `Round to modular dimension: ${Math.round(width / 50) * 50}mm`,
          newValue: Math.round(width / 50) * 50,
          reason: 'Improves constructability and reduces formwork cost',
          impact: 'Minor cost savings and easier construction'
        },
        references: [{
          code: 'Industry Practice',
          section: 'Construction Guidelines',
          description: 'Modular dimensions for concrete construction'
        }]
      });
    }

    return results;
  }

  private validateHeight(height: number, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];
    const span = formData.geometry?.length || 6000;
    const minHeight = Math.max(span / 20, 250); // Conservative estimate

    // Minimum height for deflection
    if (height < minHeight) {
      results.push({
        field: 'geometry.height',
        status: 'warning',
        severity: 'high',
        message: `Height may be insufficient for deflection control`,
        explanation: `For span of ${span}mm, minimum height is approximately ${Math.round(minHeight)}mm`,
        recommendation: `Consider increasing height to ${Math.round(minHeight)}mm or perform deflection check`,
        autoFix: {
          description: `Increase height to ${Math.round(minHeight)}mm`,
          newValue: Math.round(minHeight),
          reason: 'Meets typical span-to-depth ratio for deflection control',
          impact: 'Reduces deflection and improves serviceability'
        },
        references: [{
          code: this.standard === 'SNI' ? 'SNI 2847:2019' : 'ACI 318',
          section: 'Table 9.5(a)',
          description: 'Minimum thickness for deflection control'
        }]
      });
    }

    return results;
  }

  private validateConcreteStrength(fc: number, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // Minimum strength
    if (fc < 17) {
      results.push({
        field: 'materials.concrete.fc',
        status: 'error',
        severity: 'critical',
        message: 'Concrete strength below minimum requirement',
        explanation: `${this.standard} requires minimum fc' = 17 MPa for structural concrete`,
        recommendation: 'Use minimum K-250 concrete (20 MPa)',
        autoFix: {
          description: 'Set to minimum required strength: 20 MPa',
          newValue: 20,
          reason: `${this.standard} minimum requirement for structural concrete`,
          impact: 'Ensures code compliance and structural adequacy'
        },
        references: [{
          code: this.standard === 'SNI' ? 'SNI 2847:2019' : 'ACI 318',
          section: '19.2.1',
          description: 'Minimum concrete strength for structural members'
        }]
      });
    }

    // Practical upper limit check
    if (fc > 50) {
      results.push({
        field: 'materials.concrete.fc',
        status: 'warning',
        severity: 'medium',
        message: 'Very high concrete strength specified',
        explanation: 'High-strength concrete requires special quality control and may be uneconomical',
        recommendation: 'Verify if high strength is actually needed or consider optimizing dimensions',
        references: [{
          code: 'Industry Practice',
          section: 'High-Strength Concrete',
          description: 'Special considerations for fc\' > 50 MPa'
        }]
      });
    }

    return results;
  }

  private validateSteelGrade(fy: number, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Check against standard grades
    const standardGrades = this.standard === 'SNI' ? [240, 400, 500] : [280, 420, 520];
    
    if (!standardGrades.includes(fy)) {
      const closest = standardGrades.reduce((prev, curr) => 
        Math.abs(curr - fy) < Math.abs(prev - fy) ? curr : prev
      );
      
      results.push({
        field: 'materials.steel.fy',
        status: 'warning',
        severity: 'medium',
        message: 'Non-standard steel grade specified',
        explanation: 'Using standard grades ensures availability and economy',
        recommendation: `Consider using standard grade: ${closest} MPa`,
        autoFix: {
          description: `Use nearest standard grade: ${closest} MPa`,
          newValue: closest,
          reason: 'Standard grades are more readily available and economical',
          impact: 'Improves availability and may reduce cost'
        },
        references: [{
          code: this.standard === 'SNI' ? 'SNI 2847:2019' : 'ACI 318',
          section: '20.2.2',
          description: 'Standard reinforcing steel grades'
        }]
      });
    }

    return results;
  }

  private validateDeadLoad(deadLoad: number, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];
    const elementWeight = this.calculateSelfWeight(formData);
    
    if (deadLoad < elementWeight) {
      results.push({
        field: 'loads.deadLoad',
        status: 'error',
        severity: 'high',
        message: 'Dead load less than self-weight',
        explanation: `Element self-weight is approximately ${elementWeight.toFixed(1)} kN/m²`,
        recommendation: `Increase dead load to at least ${(elementWeight * 1.2).toFixed(1)} kN/m² including finishes`,
        autoFix: {
          description: `Set dead load including self-weight: ${(elementWeight * 1.2).toFixed(1)} kN/m²`,
          newValue: elementWeight * 1.2,
          reason: 'Includes self-weight plus typical finishes',
          impact: 'Ensures accurate load assessment'
        },
        references: [{
          code: 'SNI 1727:2020',
          section: '3.1',
          description: 'Dead loads must include all permanent loads'
        }]
      });
    }

    return results;
  }

  private validateLiveLoad(liveLoad: number, formData: any): ValidationResult[] {
    const results: ValidationResult[] = [];
    const occupancy = formData.loads?.occupancy || 'office';
    const minLiveLoad = this.getMinimumLiveLoad(occupancy);

    if (liveLoad < minLiveLoad) {
      results.push({
        field: 'loads.liveLoad',
        status: 'error',
        severity: 'high',
        message: `Live load below minimum for ${occupancy}`,
        explanation: `Minimum live load for ${occupancy} is ${minLiveLoad} kN/m²`,
        recommendation: `Increase live load to minimum ${minLiveLoad} kN/m²`,
        autoFix: {
          description: `Set minimum live load: ${minLiveLoad} kN/m²`,
          newValue: minLiveLoad,
          reason: `Code requirement for ${occupancy} occupancy`,
          impact: 'Ensures code compliance and safety'
        },
        references: [{
          code: 'SNI 1727:2020',
          section: '4.3',
          description: 'Minimum live loads by occupancy'
        }]
      });
    }

    return results;
  }

  // Helper methods
  private getMinimumWidth(): number {
    switch (this.elementType) {
      case 'beam': return 250;
      case 'column': return 300;
      case 'slab': return 120;
      default: return 200;
    }
  }

  private getWidthHeightRatioLimits(): [number, number] {
    switch (this.elementType) {
      case 'beam': return [0.3, 0.8];
      case 'column': return [0.4, 2.0];
      default: return [0.2, 2.0];
    }
  }

  private calculateSelfWeight(formData: any): number {
    const width = formData.geometry?.width || 300;
    const height = formData.geometry?.height || 400;
    const density = 24; // kN/m³ for RC
    
    return (width * height / 1000000) * density; // kN/m²
  }

  private getMinimumLiveLoad(occupancy: string): number {
    const liveLoads: Record<string, number> = {
      'residential': 1.92,
      'office': 2.4,
      'commercial': 4.8,
      'storage': 7.2,
      'parking': 2.4
    };
    return liveLoads[occupancy] || 2.4;
  }
}

// Smart recommendations generator
const generateRecommendations = (formData: any, validationResults: ValidationResult[]): IntelligentRecommendation[] => {
  const recommendations: IntelligentRecommendation[] = [];
  const errors = validationResults.filter(r => r.status === 'error').length;
  const warnings = validationResults.filter(r => r.status === 'warning').length;

  // Auto-optimization recommendation
  if (warnings > 2) {
    recommendations.push({
      id: 'optimize-dimensions',
      type: 'optimization',
      priority: 'high',
      icon: <TrendingUp className="h-4 w-4" />,
      title: 'Optimize Element Dimensions',
      description: 'Multiple dimension warnings detected. Auto-optimize for better performance.',
      benefits: [
        'Improved structural efficiency',
        'Better cost-performance ratio',
        'Code compliance assurance'
      ],
      implementation: {
        changes: {
          'geometry.width': Math.round((formData.geometry?.width || 300) * 1.1 / 50) * 50,
          'geometry.height': Math.round((formData.geometry?.height || 400) * 1.05 / 50) * 50
        },
        description: 'Adjust dimensions based on span ratios and code requirements',
        effort: 'easy'
      },
      impact: {
        cost: 5, // 5% increase
        performance: 20, // 20% improvement
        constructability: 4 // 4/5 rating
      },
      codeReferences: ['SNI 2847:2019 Section 9.5', 'Deflection control requirements']
    });
  }

  // Material optimization
  if (formData.materials?.concrete?.fc > 35) {
    recommendations.push({
      id: 'optimize-materials',
      type: 'economy',
      priority: 'medium',
      icon: <Lightbulb className="h-4 w-4" />,
      title: 'Consider Standard Concrete Grade',
      description: 'High-strength concrete may be over-specified. Standard grades offer better value.',
      benefits: [
        'Reduced material cost',
        'Better availability',
        'Easier quality control'
      ],
      implementation: {
        changes: {
          'materials.concrete.fc': 30,
          'geometry.height': Math.round((formData.geometry?.height || 400) * 1.1 / 50) * 50
        },
        description: 'Use K-350 concrete with slightly increased depth',
        effort: 'easy'
      },
      impact: {
        cost: -15, // 15% savings
        performance: -5, // 5% reduction, compensated by increased depth
        constructability: 5 // 5/5 rating
      },
      codeReferences: ['Standard concrete grades', 'Economic design principles']
    });
  }

  // Safety enhancement
  if (errors > 0) {
    recommendations.push({
      id: 'safety-enhancement',
      type: 'safety',
      priority: 'high',
      icon: <Shield className="h-4 w-4" />,
      title: 'Fix Critical Safety Issues',
      description: 'Design errors detected that compromise structural safety.',
      benefits: [
        'Code compliance',
        'Structural safety assurance',
        'Reduced liability risk'
      ],
      implementation: {
        changes: validationResults
          .filter(r => r.autoFix && r.status === 'error')
          .reduce((acc, r) => ({ ...acc, [r.field]: r.autoFix!.newValue }), {}),
        description: 'Apply automatic corrections for critical errors',
        effort: 'easy'
      },
      impact: {
        cost: 8,
        performance: 25,
        constructability: 4
      },
      codeReferences: validationResults
        .filter(r => r.status === 'error')
        .map(r => r.references[0]?.code)
        .filter(Boolean)
    });
  }

  return recommendations;
};

// Main component
const SmartDesignValidator: React.FC<DesignInputValidatorProps> = ({
  formData,
  onChange,
  onValidationChange,
  designStandard,
  elementType
}) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [recommendations, setRecommendations] = useState<IntelligentRecommendation[]>([]);
  const [showTips, setShowTips] = useState<Record<string, boolean>>({});
  const [appliedFixes, setAppliedFixes] = useState<string[]>([]);

  const validator = new DesignValidationEngine(designStandard, elementType);

  // Validate all fields
  const validateAll = useCallback(() => {
    const allResults: ValidationResult[] = [];
    const fieldsToValidate = [
      'geometry.width',
      'geometry.height',
      'materials.concrete.fc',
      'materials.steel.fy',
      'loads.deadLoad',
      'loads.liveLoad'
    ];

    fieldsToValidate.forEach(field => {
      const value = getNestedValue(formData, field);
      if (value !== undefined) {
        const fieldResults = validator.validateField(field, value, formData);
        allResults.push(...fieldResults);
      }
    });

    setValidationResults(allResults);
    setRecommendations(generateRecommendations(formData, allResults));
    
    const isValid = !allResults.some(r => r.status === 'error');
    onValidationChange?.(isValid, allResults);
  }, [formData, validator, onValidationChange]);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const applyAutoFix = (result: ValidationResult) => {
    if (!result.autoFix) return;

    onChange(result.field, result.autoFix.newValue);
    setAppliedFixes(prev => [...prev, result.field]);
    
    setTimeout(() => {
      setAppliedFixes(prev => prev.filter(f => f !== result.field));
    }, 2000);
  };

  const applyRecommendation = (recommendation: IntelligentRecommendation) => {
    Object.entries(recommendation.implementation.changes).forEach(([field, value]) => {
      onChange(field, value);
    });
  };

  const toggleTip = (field: string) => {
    setShowTips(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    validateAll();
  }, [validateAll]);

  const errorCount = validationResults.filter(r => r.status === 'error').length;
  const warningCount = validationResults.filter(r => r.status === 'warning').length;
  const infoCount = validationResults.filter(r => r.status === 'info').length;

  return (
    <div className="space-y-4">
      {/* Validation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Smart Design Validation</span>
            </div>
            <div className="flex items-center space-x-2">
              {errorCount > 0 && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{errorCount} Error{errorCount > 1 ? 's' : ''}</span>
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{warningCount} Warning{warningCount > 1 ? 's' : ''}</span>
                </Badge>
              )}
              {errorCount === 0 && warningCount === 0 && (
                <Badge variant="default" className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>All Good</span>
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        {(validationResults.length > 0 || recommendations.length > 0) && (
          <CardContent className="space-y-4">
            {/* Validation Results */}
            {validationResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Validation Results</h4>
                {validationResults.map((result, index) => (
                  <Alert key={index} variant={
                    result.status === 'error' ? 'destructive' : 
                    result.status === 'warning' ? 'default' : 
                    'default'
                  }>
                    <div className="flex">
                      {result.status === 'error' ? <AlertTriangle className="h-4 w-4" /> :
                       result.status === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                       <Info className="h-4 w-4" />}
                      <div className="flex-1 ml-2">
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{result.message}</span>
                              <div className="flex items-center space-x-2">
                                {result.autoFix && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => applyAutoFix(result)}
                                    disabled={appliedFixes.includes(result.field)}
                                    className="text-xs"
                                  >
                                    {appliedFixes.includes(result.field) ? (
                                      <>
                                        <Check className="h-3 w-3 mr-1" />
                                        Applied
                                      </>
                                    ) : (
                                      <>
                                        <Zap className="h-3 w-3 mr-1" />
                                        Quick Fix
                                      </>
                                    )}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleTip(result.field)}
                                  className="text-xs"
                                >
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  Tips
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600">{result.explanation}</p>
                            
                            {result.recommendation && (
                              <p className="text-sm text-blue-600">
                                <strong>Recommendation:</strong> {result.recommendation}
                              </p>
                            )}
                            
                            {result.autoFix && (
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                <strong>Auto-fix:</strong> {result.autoFix.description} - {result.autoFix.reason}
                              </div>
                            )}

                            {/* Smart Tips */}
                            {showTips[result.field] && SMART_TIPS[result.field] && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                                <div className="space-y-3">
                                  <h5 className="font-medium text-blue-900">
                                    {SMART_TIPS[result.field].title}
                                  </h5>
                                  
                                  <p className="text-sm text-blue-700">
                                    {SMART_TIPS[result.field].description}
                                  </p>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <strong className="text-blue-900">Examples:</strong>
                                      <ul className="list-disc list-inside text-blue-700 mt-1">
                                        {SMART_TIPS[result.field].examples.map((example, i) => (
                                          <li key={i}>{example}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <strong className="text-blue-900">Best Practices:</strong>
                                      <ul className="list-disc list-inside text-blue-700 mt-1">
                                        {SMART_TIPS[result.field].bestPractices.slice(0, 3).map((practice, i) => (
                                          <li key={i}>{practice}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>

                                  {SMART_TIPS[result.field].calculationTips && (
                                    <div>
                                      <strong className="text-blue-900 text-xs">Calculation Tips:</strong>
                                      <ul className="list-disc list-inside text-blue-700 text-xs mt-1">
                                        {SMART_TIPS[result.field].calculationTips!.map((tip, i) => (
                                          <li key={i} className="font-mono">{tip}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {/* Smart Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Smart Recommendations</h4>
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {rec.icon}
                            <span className="font-medium">{rec.title}</span>
                            <Badge variant={
                              rec.priority === 'high' ? 'destructive' :
                              rec.priority === 'medium' ? 'secondary' : 'outline'
                            }>
                              {rec.priority}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => applyRecommendation(rec)}
                            className="flex items-center space-x-1"
                          >
                            <ArrowRight className="h-3 w-3" />
                            <span>Apply</span>
                          </Button>
                        </div>
                        
                        <p className="text-sm text-gray-600">{rec.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="text-center">
                            <div className={`font-medium ${rec.impact.cost > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {rec.impact.cost > 0 ? '+' : ''}{rec.impact.cost}%
                            </div>
                            <div className="text-gray-500">Cost</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-medium ${rec.impact.performance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {rec.impact.performance > 0 ? '+' : ''}{rec.impact.performance}%
                            </div>
                            <div className="text-gray-500">Performance</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-blue-600">
                              {rec.impact.constructability}/5
                            </div>
                            <div className="text-gray-500">Buildability</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <strong>Benefits:</strong> {rec.benefits.join(' • ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SmartDesignValidator;