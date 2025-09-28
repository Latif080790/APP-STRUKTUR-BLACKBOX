/**
 * Enhanced Educational Structural Design Engine
 * Combines full design functionality with comprehensive educational validation
 */

import { StructuralDesignEngine, DesignInput, DesignResults } from './StructuralDesignEngine';
import { EducationalStructuralDesignEngine, ValidationResult } from './StructuralDesignEngineEducational';

export interface EnhancedDesignResults extends DesignResults {
  validation: ValidationResult;
  educationalFeedback: {
    inputQuality: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    learningPoints: string[];
    bestPractices: string[];
    commonMistakes: string[];
  };
}

export class EnhancedEducationalDesignEngine {
  private designEngine: StructuralDesignEngine;
  private educationalEngine: EducationalStructuralDesignEngine;
  
  constructor(input: DesignInput) {
    this.designEngine = new StructuralDesignEngine(input);
    this.educationalEngine = new EducationalStructuralDesignEngine(input);
  }
  
  /**
   * Perform comprehensive design with educational validation
   */
  public performEducationalDesign(elementType: 'beam' | 'column' | 'slab'): EnhancedDesignResults {
    // First, validate input with educational feedback
    const validation = this.educationalEngine.validateInput();
    
    // Perform the actual design
    const designResults = this.designEngine.performDesign(elementType);
    
    // Generate educational feedback
    const educationalFeedback = this.generateEducationalFeedback(validation, designResults);
    
    return {
      ...designResults,
      validation,
      educationalFeedback
    };
  }
  
  /**
   * Get educational validation only (for input checking)
   */
  public validateInputEducationally(): ValidationResult {
    return this.educationalEngine.validateInput();
  }
  
  /**
   * Get design recommendations with educational context
   */
  public getEducationalRecommendations(): string[] {
    const validation = this.educationalEngine.validateInput();
    const recommendations: string[] = [];
    
    // Add recommendations based on validation results
    validation.errors.forEach(error => {
      recommendations.push(`❌ ${error.message}`);
      recommendations.push(`   💡 ${error.reason}`);
      if (error.example) {
        recommendations.push(`   📋 Example: ${error.example}`);
      }
    });
    
    validation.warnings.forEach(warning => {
      recommendations.push(`⚠️  ${warning.message}`);
      recommendations.push(`   💡 ${warning.suggestion}`);
    });
    
    // Add general learning recommendations
    if (validation.isValid) {
      recommendations.push(
        "✅ Input validation passed! You're ready for design calculations.",
        "📚 Consider reviewing SNI 2847-2019 for detailed requirements.",
        "🎯 Practice with different load combinations to improve understanding."
      );
    }
    
    return recommendations;
  }
  
  private generateEducationalFeedback(validation: ValidationResult, designResults: DesignResults): any {
    const errorCount = validation.errors.length;
    const warningCount = validation.warnings.length;
    
    let inputQuality: 'excellent' | 'good' | 'needs_improvement' | 'poor';
    if (errorCount === 0 && warningCount === 0) {
      inputQuality = 'excellent';
    } else if (errorCount === 0 && warningCount <= 2) {
      inputQuality = 'good';
    } else if (errorCount <= 2) {
      inputQuality = 'needs_improvement';
    } else {
      inputQuality = 'poor';
    }
    
    const learningPoints: string[] = [];
    const bestPractices: string[] = [];
    const commonMistakes: string[] = [];
    
    // Generate learning points based on design results
    if (designResults.isValid) {
      learningPoints.push("Design successfully meets all structural requirements");
      
      if (designResults.checks.flexuralStrength.ratio < 1.2) {
        learningPoints.push("Consider increasing safety margins for critical structures");
      }
      
      if (designResults.reinforcement.main.area > 0) {
        learningPoints.push(`Steel ratio: ${(designResults.reinforcement.main.area / (designResults.element.dimensions.width * designResults.element.dimensions.height) * 100).toFixed(2)}%`);
      }
    }
    
    // Best practices
    bestPractices.push("Always check minimum and maximum reinforcement ratios");
    bestPractices.push("Consider constructability during design phase");
    bestPractices.push("Verify deflection limits for serviceability");
    bestPractices.push("Ensure adequate concrete cover for durability");
    
    // Common mistakes based on validation errors
    validation.errors.forEach(error => {
      if (error.field.includes('geometry')) {
        commonMistakes.push("Unrealistic member dimensions - check architectural constraints");
      }
      if (error.field.includes('materials')) {
        commonMistakes.push("Incorrect material grades - verify project specifications");
      }
      if (error.field.includes('loads')) {
        commonMistakes.push("Incorrect load magnitudes - review load calculations");
      }
    });
    
    if (commonMistakes.length === 0) {
      commonMistakes.push("No common mistakes detected - good input quality!");
    }
    
    return {
      inputQuality,
      learningPoints,
      bestPractices,
      commonMistakes
    };
  }
  
  /**
   * Get detailed explanation of a specific design check
   */
  public explainDesignCheck(checkType: 'flexural' | 'shear' | 'deflection' | 'cracking'): string {
    switch (checkType) {
      case 'flexural':
        return `
Flexural Strength Check (SNI 2847-2019):
- Compares factored moment (Mu) with design moment capacity (φMn)
- φ = 0.9 for tension-controlled sections
- Ensures adequate flexural reinforcement without over-reinforcement
- Balanced reinforcement ratio controls ductile failure mode
        `.trim();
        
      case 'shear':
        return `
Shear Strength Check (SNI 2847-2019):
- Total shear capacity = φ(Vc + Vs)
- Vc = concrete contribution = λ/6 × √f'c × b × d
- Vs = stirrup contribution = Av × fy × d / s
- φ = 0.75 for shear strength reduction factor
        `.trim();
        
      case 'deflection':
        return `
Deflection Check (Serviceability):
- Uses effective moment of inertia (Ie) considering cracking
- Limits: L/360 for live load, L/240 for total load
- Cracked section properties used when Ma > Mcr
- Long-term effects include creep and shrinkage
        `.trim();
        
      case 'cracking':
        return `
Crack Width Control (SNI 2847-2019):
- Limits crack width to 0.33mm for interior exposure
- Based on steel stress, bar spacing, and concrete cover
- w = 11 × fs × β × (dc × A)^(1/3) / Es
- Proper reinforcement detailing prevents excessive cracking
        `.trim();
        
      default:
        return "Unknown check type";
    }
  }
}

export default EnhancedEducationalDesignEngine;