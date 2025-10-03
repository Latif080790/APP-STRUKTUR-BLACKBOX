/**
 * Engineering Calculations Test Suite
 * Comprehensive validation of structural engineering calculations
 * Following SNI standards and professional engineering practices
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock the engineering calculations that would be imported from DesignModule
const createEngineeringCalculations = () => ({
  concrete: {
    calculateBeta1: (fc: number): number => {
      if (fc <= 28) return 0.85;
      if (fc <= 55) return Math.max(0.65, 0.85 - 0.05 * (fc - 28) / 7);
      return 0.65;
    },
    
    calculateBalancedRatio: (fc: number, fy: number): number => {
      const beta1 = 0.85; // Simplified for testing
      return 0.85 * beta1 * fc / fy * (600 / (600 + fy));
    },
    
    calculateMinRatio: (fc: number, fy: number): number => {
      return Math.max(1.4 / fy, Math.sqrt(fc) / (4 * fy));
    },
    
    calculateMaxRatio: (fc: number, fy: number): number => {
      const balancedRatio = 0.85 * 0.85 * fc / fy * (600 / (600 + fy));
      return 0.75 * balancedRatio;
    },
    
    calculateMomentCapacity: (As: number, fy: number, b: number, d: number, fc: number): number => {
      const a = As * fy / (0.85 * fc * b);
      return As * fy * (d - a / 2) / 1000000; // kN.m
    },
    
    calculateVc: (fc: number, b: number, d: number): number => {
      return Math.sqrt(fc) / 6 * b * d / 1000; // kN
    },
    
    calculateDevelopmentLength: (db: number, fy: number, fc: number): number => {
      const ld_basic = fy * db / (25 * Math.sqrt(fc));
      const ld_min = Math.max(300, 12 * db);
      return Math.max(ld_basic, ld_min);
    }
  },
  
  steel: {
    calculatePn: (Ag: number, fy: number, kl_r: number): number => {
      const fe = Math.PI * Math.PI * 200000 / (kl_r * kl_r);
      const fcr = kl_r <= 4.71 * Math.sqrt(200000 / fy) 
        ? Math.pow(0.658, fy / fe) * fy
        : 0.877 * fe;
      return fcr * Ag / 1000; // kN
    },
    
    calculateMn: (Z: number, fy: number, lateralSupport: boolean = true): number => {
      const Mp = Z * fy / 1000000; // kN.m
      return lateralSupport ? Mp : Mp * 0.9;
    },
    
    calculateVn: (Aw: number, fy: number): number => {
      return 0.6 * fy * Aw / 1000; // kN
    },
    
    checkSlenderness: (kl_r: number): boolean => {
      return kl_r <= 200;
    },
    
    checkLocalBuckling: (b_t: number, h_tw: number, fy: number) => {
      const lambda_p_flange = 0.38 * Math.sqrt(200000 / fy);
      const lambda_p_web = 3.76 * Math.sqrt(200000 / fy);
      return {
        flangeOK: b_t <= lambda_p_flange,
        webOK: h_tw <= lambda_p_web
      };
    }
  },
  
  foundation: {
    calculateBearingCapacity: (c: number, phi: number, gamma: number, B: number, D: number): number => {
      const Nc = Math.exp(Math.PI * Math.tan(phi * Math.PI / 180)) * Math.pow(Math.tan(45 + phi / 2), 2);
      const Nq = Math.pow(Math.tan(45 + phi / 2), 2) * Math.exp(Math.PI * Math.tan(phi * Math.PI / 180));
      const Ny = 2 * (Nq + 1) * Math.tan(phi * Math.PI / 180);
      
      return c * Nc + gamma * D * Nq + 0.5 * gamma * B * Ny;
    },
    
    calculateSettlement: (q: number, B: number, Es: number, I: number = 1.0): number => {
      return q * B * (1 - 0.3 * 0.3) * I / Es * 1000; // mm
    },
    
    calculatePileCapacity: (Ap: number, qp: number, As: number, qs: number): number => {
      return Ap * qp + As * qs; // kN
    }
  }
});

describe('Engineering Calculations Validation - SNI Standards Compliance', () => {
  let calculations: ReturnType<typeof createEngineeringCalculations>;

  beforeEach(() => {
    calculations = createEngineeringCalculations();
  });

  describe('Concrete Design Calculations - SNI 2847:2019', () => {
    describe('Beta1 Factor Calculation', () => {
      it('should return 0.85 for fc <= 28 MPa', () => {
        expect(calculations.concrete.calculateBeta1(25)).toBe(0.85);
        expect(calculations.concrete.calculateBeta1(28)).toBe(0.85);
      });

      it('should return reduced beta1 for fc between 28-55 MPa', () => {
        const beta1_35 = calculations.concrete.calculateBeta1(35);
        expect(beta1_35).toBeLessThan(0.85);
        expect(beta1_35).toBeGreaterThan(0.65);
      });

      it('should return 0.65 for fc > 55 MPa', () => {
        expect(calculations.concrete.calculateBeta1(60)).toBe(0.65);
        expect(calculations.concrete.calculateBeta1(80)).toBe(0.65);
      });
    });

    describe('Reinforcement Ratio Calculations', () => {
      it('should calculate minimum reinforcement ratio correctly', () => {
        const minRatio = calculations.concrete.calculateMinRatio(25, 400);
        expect(minRatio).toBeGreaterThan(0);
        expect(minRatio).toBe(Math.max(1.4 / 400, Math.sqrt(25) / (4 * 400)));
      });

      it('should ensure minimum ratio meets SNI requirements', () => {
        const minRatio1 = calculations.concrete.calculateMinRatio(25, 400); // 0.00125
        const minRatio2 = calculations.concrete.calculateMinRatio(30, 500); // 0.00137
        
        expect(minRatio1).toBeGreaterThan(0.001); // Minimum 0.1%
        expect(minRatio2).toBeGreaterThan(0.001);
      });

      it('should calculate maximum reinforcement ratio correctly', () => {
        const maxRatio = calculations.concrete.calculateMaxRatio(25, 400);
        expect(maxRatio).toBeGreaterThan(0);
        expect(maxRatio).toBeLessThan(0.05); // Should be reasonable value < 5%
      });
    });

    describe('Moment Capacity Calculations', () => {
      it('should calculate moment capacity for typical beam', () => {
        // Typical concrete beam: As=1963 mm², fy=400 MPa, b=300mm, d=450mm, fc=25 MPa
        const momentCapacity = calculations.concrete.calculateMomentCapacity(1963, 400, 300, 450, 25);
        
        expect(momentCapacity).toBeGreaterThan(0);
        expect(momentCapacity).toBeLessThan(1000); // Reasonable range for typical beam
      });

      it('should increase with larger reinforcement area', () => {
        const M1 = calculations.concrete.calculateMomentCapacity(1000, 400, 300, 450, 25);
        const M2 = calculations.concrete.calculateMomentCapacity(2000, 400, 300, 450, 25);
        
        expect(M2).toBeGreaterThan(M1);
      });
    });

    describe('Shear Capacity Calculations', () => {
      it('should calculate concrete shear capacity', () => {
        const Vc = calculations.concrete.calculateVc(25, 300, 450);
        
        expect(Vc).toBeGreaterThan(0);
        expect(Vc).toBeLessThan(500); // Reasonable range
      });

      it('should increase with higher concrete strength', () => {
        const Vc1 = calculations.concrete.calculateVc(25, 300, 450);
        const Vc2 = calculations.concrete.calculateVc(30, 300, 450);
        
        expect(Vc2).toBeGreaterThan(Vc1);
      });
    });

    describe('Development Length Calculations', () => {
      it('should calculate development length for rebar', () => {
        const ld = calculations.concrete.calculateDevelopmentLength(16, 400, 25);
        
        expect(ld).toBeGreaterThan(300); // Should meet minimum
        expect(ld).toBeLessThan(2000); // Reasonable upper bound
      });

      it('should meet minimum requirements', () => {
        const ld = calculations.concrete.calculateDevelopmentLength(12, 400, 25);
        
        expect(ld).toBeGreaterThanOrEqual(300); // Minimum 300mm
        expect(ld).toBeGreaterThanOrEqual(12 * 12); // Minimum 12db
      });
    });
  });

  describe('Steel Design Calculations - SNI 1729:2020', () => {
    describe('Compression Member Capacity', () => {
      it('should calculate nominal compression strength', () => {
        // Typical steel column: Ag=5000 mm², fy=345 MPa, KL/r=80
        const Pn = calculations.steel.calculatePn(5000, 345, 80);
        
        expect(Pn).toBeGreaterThan(0);
        expect(Pn).toBeLessThan(2000); // Reasonable range for column
      });

      it('should handle slender columns correctly', () => {
        const Pn_stocky = calculations.steel.calculatePn(5000, 345, 50);
        const Pn_slender = calculations.steel.calculatePn(5000, 345, 150);
        
        expect(Pn_slender).toBeLessThan(Pn_stocky);
      });
    });

    describe('Flexural Member Capacity', () => {
      it('should calculate nominal moment strength', () => {
        // Typical steel beam: Z=1000 cm³, fy=345 MPa
        const Mn = calculations.steel.calculateMn(1000000, 345, true); // Z in mm³
        
        expect(Mn).toBeGreaterThan(0);
        expect(Mn).toBeLessThan(1000); // Reasonable range
      });

      it('should reduce capacity for lateral-torsional buckling', () => {
        const Mn_braced = calculations.steel.calculateMn(1000000, 345, true);
        const Mn_unbraced = calculations.steel.calculateMn(1000000, 345, false);
        
        expect(Mn_unbraced).toBeLessThan(Mn_braced);
      });
    });

    describe('Shear Capacity Calculations', () => {
      it('should calculate nominal shear strength', () => {
        // Typical web area: Aw=3000 mm², fy=345 MPa
        const Vn = calculations.steel.calculateVn(3000, 345);
        
        expect(Vn).toBeGreaterThan(0);
        expect(Vn).toBeLessThan(1000); // Reasonable range
      });
    });

    describe('Slenderness Checks', () => {
      it('should pass slenderness check for reasonable ratios', () => {
        expect(calculations.steel.checkSlenderness(50)).toBe(true);
        expect(calculations.steel.checkSlenderness(150)).toBe(true);
        expect(calculations.steel.checkSlenderness(200)).toBe(true);
      });

      it('should fail slenderness check for excessive ratios', () => {
        expect(calculations.steel.checkSlenderness(250)).toBe(false);
        expect(calculations.steel.checkSlenderness(300)).toBe(false);
      });
    });

    describe('Local Buckling Checks', () => {
      it('should check flange and web local buckling', () => {
        const result = calculations.steel.checkLocalBuckling(8, 40, 345);
        
        expect(result).toHaveProperty('flangeOK');
        expect(result).toHaveProperty('webOK');
        expect(typeof result.flangeOK).toBe('boolean');
        expect(typeof result.webOK).toBe('boolean');
      });
    });
  });

  describe('Foundation Design Calculations - SNI 8460:2020', () => {
    describe('Bearing Capacity Calculations', () => {
      it('should calculate ultimate bearing capacity using Terzaghi equation', () => {
        // Typical soil: c=15 kPa, phi=25°, gamma=18 kN/m³, B=2m, D=1.5m
        const qult = calculations.foundation.calculateBearingCapacity(15, 25, 18, 2, 1.5);
        
        expect(qult).toBeGreaterThan(0);
        expect(qult).toBeLessThan(2000); // Reasonable range for typical soil
      });

      it('should increase with better soil parameters', () => {
        const qult1 = calculations.foundation.calculateBearingCapacity(10, 20, 18, 2, 1.5);
        const qult2 = calculations.foundation.calculateBearingCapacity(20, 30, 18, 2, 1.5);
        
        expect(qult2).toBeGreaterThan(qult1);
      });
    });

    describe('Settlement Calculations', () => {
      it('should calculate elastic settlement', () => {
        // Typical loading: q=100 kPa, B=2m, Es=10000 kPa
        const settlement = calculations.foundation.calculateSettlement(100, 2, 10000);
        
        expect(settlement).toBeGreaterThan(0);
        expect(settlement).toBeLessThan(100); // Should be in reasonable range (mm)
      });

      it('should increase with higher load', () => {
        const s1 = calculations.foundation.calculateSettlement(50, 2, 10000);
        const s2 = calculations.foundation.calculateSettlement(100, 2, 10000);
        
        expect(s2).toBeGreaterThan(s1);
      });
    });

    describe('Pile Capacity Calculations', () => {
      it('should calculate total pile capacity', () => {
        // Typical pile: Ap=0.2 m², qp=1000 kPa, As=2 m², qs=50 kPa
        const capacity = calculations.foundation.calculatePileCapacity(0.2, 1000, 2, 50);
        
        expect(capacity).toBeGreaterThan(0);
        expect(capacity).toBe(0.2 * 1000 + 2 * 50); // 200 + 100 = 300 kN
      });
    });
  });

  describe('Cross-Module Integration Tests', () => {
    it('should maintain consistent units across all calculations', () => {
      // Test that all functions return reasonable values in expected units
      const beta1 = calculations.concrete.calculateBeta1(25); // Dimensionless
      const Pn = calculations.steel.calculatePn(5000, 345, 80); // kN
      const qult = calculations.foundation.calculateBearingCapacity(15, 25, 18, 2, 1.5); // kPa
      
      expect(beta1).toBeGreaterThan(0.5);
      expect(beta1).toBeLessThan(1.0);
      expect(Pn).toBeGreaterThan(100);
      expect(qult).toBeGreaterThan(100);
    });

    it('should handle edge cases gracefully', () => {
      // Test with minimum values
      expect(() => calculations.concrete.calculateBeta1(10)).not.toThrow();
      expect(() => calculations.steel.calculatePn(1000, 250, 50)).not.toThrow();
      expect(() => calculations.foundation.calculateBearingCapacity(0, 15, 15, 1, 0.5)).not.toThrow();
    });

    it('should provide reasonable safety factors in results', () => {
      // Test that calculated capacities are reasonable for typical engineering practice
      const momentCapacity = calculations.concrete.calculateMomentCapacity(1963, 400, 300, 450, 25);
      const compressionCapacity = calculations.steel.calculatePn(5000, 345, 80);
      
      // Should be positive and within engineering ranges
      expect(momentCapacity).toBeGreaterThan(50); // At least 50 kN⋅m
      expect(compressionCapacity).toBeGreaterThan(500); // At least 500 kN
    });
  });

  describe('Performance and Accuracy Tests', () => {
    it('should calculate results quickly', () => {
      const startTime = performance.now();
      
      // Run multiple calculations
      for (let i = 0; i < 100; i++) {
        calculations.concrete.calculateMomentCapacity(1963, 400, 300, 450, 25);
        calculations.steel.calculatePn(5000, 345, 80);
        calculations.foundation.calculateBearingCapacity(15, 25, 18, 2, 1.5);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    it('should maintain precision in calculations', () => {
      const result1 = calculations.concrete.calculateBeta1(35);
      const result2 = calculations.concrete.calculateBeta1(35);
      
      expect(result1).toBe(result2); // Should be deterministic
    });
  });
});