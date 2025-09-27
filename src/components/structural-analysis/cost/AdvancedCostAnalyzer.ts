/**
 * Advanced Cost Analysis System
 * Life-cycle cost analysis with regional cost databases and material price tracking
 */

export interface RegionalCostDatabase {
  region: 'jakarta' | 'surabaya' | 'bandung' | 'medan' | 'semarang' | 'makassar' | 'other';
  lastUpdated: Date;
  materials: {
    concrete: {
      fc20: number; // IDR/m³
      fc25: number;
      fc30: number;
      fc35: number;
      fc40: number;
    };
    steel: {
      bj34: number; // IDR/kg
      bj37: number;
      bj41: number;
      bj50: number;
      bj55: number;
      wiremesh: number;
    };
    formwork: {
      plywood: number; // IDR/m²
      steel: number;
      aluminum: number;
    };
    labor: {
      skilled: number; // IDR/hour
      unskilled: number;
      supervisor: number;
      engineer: number;
    };
    equipment: {
      excavator: number; // IDR/hour
      crane: number;
      concretePump: number;
      mixer: number;
    };
  };
  transportation: {
    fuelCost: number; // IDR/liter
    distance: number; // km from supplier
    weightFactor: number; // IDR/ton/km
  };
  overheads: {
    contractor: number; // percentage
    profit: number; // percentage
    tax: number; // percentage (PPN)
    insurance: number; // percentage
  };
}

export interface PriceFluctuation {
  material: string;
  historicalPrices: Array<{
    date: Date;
    price: number;
    source: string;
  }>;
  currentPrice: number;
  predictedPrices: Array<{
    month: number; // months from now
    price: number;
    confidence: number; // 0-1
  }>;
  volatility: number; // standard deviation
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonalFactors: Array<{
    month: number; // 1-12
    factor: number; // multiplier
  }>;
}

export interface LifeCycleCostAnalysis {
  initialCost: {
    design: number;
    materials: number;
    labor: number;
    equipment: number;
    overhead: number;
    total: number;
  };
  operationalCost: {
    maintenance: Array<{
      year: number;
      description: string;
      cost: number;
      probability: number; // 0-1
    }>;
    repair: Array<{
      year: number;
      description: string;
      cost: number;
      probability: number;
    }>;
    replacement: Array<{
      year: number;
      component: string;
      cost: number;
    }>;
    inspection: Array<{
      frequency: number; // years
      cost: number;
    }>;
  };
  endOfLife: {
    demolition: number;
    disposal: number;
    recycling: number; // negative cost = revenue
    environmental: number;
    total: number;
  };
  financial: {
    discountRate: number; // percentage
    inflationRate: number; // percentage
    designLife: number; // years
    npv: number; // Net Present Value
    irr: number; // Internal Rate of Return
    paybackPeriod: number; // years
    costPerYear: number; // Annualized cost
  };
  riskAnalysis: {
    scenarios: Array<{
      name: string;
      probability: number;
      costImpact: number;
      description: string;
    }>;
    expectedValue: number;
    confidenceInterval: {
      low: number;
      high: number;
      confidence: number; // typically 95%
    };
  };
  sustainability: {
    carbonFootprint: number; // kg CO2 equivalent
    energyConsumption: number; // kWh
    waterUsage: number; // liters
    wasteGeneration: number; // kg
    recyclability: number; // percentage
    certificationPoints: {
      greenship: number;
      leed: number;
      breeam: number;
    };
  };
}

export interface CostOptimization {
  alternatives: Array<{
    name: string;
    description: string;
    initialCost: number;
    lifecycleCost: number;
    savings: number;
    paybackPeriod: number;
    feasibility: 'high' | 'medium' | 'low';
    risks: string[];
    benefits: string[];
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    savings: number;
    implementation: string;
    timeline: string;
  }>;
  valueEngineering: Array<{
    function: string;
    currentCost: number;
    alternativeCost: number;
    valueIndex: number; // performance/cost
    recommendation: string;
  }>;
}

export class AdvancedCostAnalyzer {
  private regionalData: Map<string, RegionalCostDatabase> = new Map();
  private priceHistory: Map<string, PriceFluctuation> = new Map();

  constructor() {
    this.initializeRegionalData();
    this.initializePriceHistory();
  }

  /**
   * Initialize regional cost databases
   */
  private initializeRegionalData(): void {
    // Jakarta pricing (baseline - highest)
    this.regionalData.set('jakarta', {
      region: 'jakarta',
      lastUpdated: new Date(),
      materials: {
        concrete: { fc20: 950000, fc25: 1100000, fc30: 1250000, fc35: 1400000, fc40: 1550000 },
        steel: { bj34: 14000, bj37: 15000, bj41: 16000, bj50: 18000, bj55: 20000, wiremesh: 16000 },
        formwork: { plywood: 85000, steel: 150000, aluminum: 200000 },
        labor: { skilled: 45000, unskilled: 35000, supervisor: 65000, engineer: 150000 },
        equipment: { excavator: 450000, crane: 650000, concretePump: 850000, mixer: 350000 }
      },
      transportation: { fuelCost: 7650, distance: 15, weightFactor: 850 },
      overheads: { contractor: 15, profit: 10, tax: 11, insurance: 2 }
    });

    // Surabaya pricing (10% lower)
    const surabayaBase = this.regionalData.get('jakarta')!;
    this.regionalData.set('surabaya', {
      ...surabayaBase,
      region: 'surabaya',
      materials: this.scaleCosts(surabayaBase.materials, 0.9),
      labor: this.scaleCosts(surabayaBase.labor, 0.85),
      equipment: this.scaleCosts(surabayaBase.equipment, 0.88)
    } as RegionalCostDatabase);

    // Bandung pricing (5% lower)
    this.regionalData.set('bandung', {
      ...surabayaBase,
      region: 'bandung',
      materials: this.scaleCosts(surabayaBase.materials, 0.95),
      labor: this.scaleCosts(surabayaBase.labor, 0.90),
      equipment: this.scaleCosts(surabayaBase.equipment, 0.92)
    } as RegionalCostDatabase);

    // Other regions (15-25% lower)
    ['medan', 'semarang', 'makassar'].forEach((region, index) => {
      const scaleFactor = 0.85 - (index * 0.05);
      this.regionalData.set(region, {
        ...surabayaBase,
        region: region as any,
        materials: this.scaleCosts(surabayaBase.materials, scaleFactor),
        labor: this.scaleCosts(surabayaBase.labor, scaleFactor - 0.1),
        equipment: this.scaleCosts(surabayaBase.equipment, scaleFactor - 0.05)
      } as RegionalCostDatabase);
    });
  }

  /**
   * Scale costs by factor
   */
  private scaleCosts(costs: any, factor: number): any {
    const scaled: any = {};
    for (const [key, value] of Object.entries(costs)) {
      if (typeof value === 'number') {
        scaled[key] = Math.round(value * factor);
      } else if (typeof value === 'object') {
        scaled[key] = this.scaleCosts(value, factor);
      }
    }
    return scaled;
  }

  /**
   * Initialize price history and fluctuation data
   */
  private initializePriceHistory(): void {
    // Steel price history (BJ41 example)
    const steelHistory = [];
    const basePrice = 16000;
    const currentDate = new Date();
    
    // Generate 24 months of historical data
    for (let i = 24; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const seasonalFactor = 1 + 0.1 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      const trendFactor = 1 + (24 - i) * 0.002; // 0.2% monthly increase
      const volatility = 0.95 + Math.random() * 0.1; // ±5% random
      const price = Math.round(basePrice * seasonalFactor * trendFactor * volatility);
      
      steelHistory.push({
        date,
        price,
        source: i > 0 ? 'Historical' : 'Current'
      });
    }

    // Generate predictions (next 12 months)
    const predictions = [];
    for (let i = 1; i <= 12; i++) {
      const seasonalFactor = 1 + 0.1 * Math.sin(((currentDate.getMonth() + i) / 12) * 2 * Math.PI);
      const trendFactor = 1 + (24 + i) * 0.002;
      const basePrice = steelHistory[steelHistory.length - 1].price;
      const confidence = Math.max(0.5, 1 - i * 0.05); // Decreasing confidence
      
      predictions.push({
        month: i,
        price: Math.round(basePrice * seasonalFactor * trendFactor),
        confidence
      });
    }

    this.priceHistory.set('steel_bj41', {
      material: 'Steel BJ41',
      historicalPrices: steelHistory,
      currentPrice: steelHistory[steelHistory.length - 1].price,
      predictedPrices: predictions,
      volatility: this.calculateVolatility(steelHistory.map(h => h.price)),
      trend: 'increasing',
      seasonalFactors: this.calculateSeasonalFactors(steelHistory)
    });

    // Similar for concrete (simplified)
    this.priceHistory.set('concrete_fc25', {
      material: 'Concrete fc25',
      historicalPrices: this.generateMockHistory(1100000, 0.001, 0.05),
      currentPrice: 1100000,
      predictedPrices: this.generateMockPredictions(1100000, 0.001),
      volatility: 0.03,
      trend: 'stable',
      seasonalFactors: []
    });
  }

  /**
   * Calculate volatility from price series
   */
  private calculateVolatility(prices: number[]): number {
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate seasonal factors
   */
  private calculateSeasonalFactors(history: any[]): any[] {
    const monthlyAverages = new Array(12).fill(0).map(() => ({ sum: 0, count: 0 }));
    
    history.forEach(h => {
      const month = h.date.getMonth();
      monthlyAverages[month].sum += h.price;
      monthlyAverages[month].count += 1;
    });

    const overallAverage = history.reduce((sum, h) => sum + h.price, 0) / history.length;
    
    return monthlyAverages.map((monthly, index) => ({
      month: index + 1,
      factor: monthly.count > 0 ? (monthly.sum / monthly.count) / overallAverage : 1
    }));
  }

  /**
   * Generate mock historical data
   */
  private generateMockHistory(basePrice: number, trend: number, volatility: number): any[] {
    const history = [];
    const currentDate = new Date();
    
    for (let i = 24; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const trendFactor = 1 + (24 - i) * trend;
      const randomFactor = 1 + (Math.random() - 0.5) * volatility * 2;
      const price = Math.round(basePrice * trendFactor * randomFactor);
      
      history.push({ date, price, source: i > 0 ? 'Historical' : 'Current' });
    }
    
    return history;
  }

  /**
   * Generate mock predictions
   */
  private generateMockPredictions(currentPrice: number, trend: number): any[] {
    const predictions = [];
    for (let i = 1; i <= 12; i++) {
      predictions.push({
        month: i,
        price: Math.round(currentPrice * (1 + trend * i)),
        confidence: Math.max(0.5, 1 - i * 0.05)
      });
    }
    return predictions;
  }

  /**
   * Perform comprehensive life-cycle cost analysis
   */
  public performLifeCycleAnalysis(
    projectData: any,
    region: string = 'jakarta',
    designLife: number = 50
  ): LifeCycleCostAnalysis {
    const regionalCosts = this.regionalData.get(region) || this.regionalData.get('jakarta')!;
    const discountRate = 0.08; // 8%
    const inflationRate = 0.035; // 3.5%

    const initialCost = this.calculateInitialCost(projectData, regionalCosts);
    const operationalCost = this.calculateOperationalCost(projectData, designLife, inflationRate);
    const endOfLife = this.calculateEndOfLifeCost(projectData, designLife, inflationRate);
    const financial = this.calculateFinancialMetrics(initialCost, operationalCost, endOfLife, discountRate, inflationRate, designLife);
    const riskAnalysis = this.performRiskAnalysis(initialCost, operationalCost, endOfLife);
    const sustainability = this.calculateSustainabilityMetrics(projectData);

    return {
      initialCost,
      operationalCost,
      endOfLife,
      financial,
      riskAnalysis,
      sustainability
    };
  }

  /**
   * Calculate initial construction cost
   */
  private calculateInitialCost(projectData: any, regionalCosts: RegionalCostDatabase): any {
    const volume = projectData.volume || 100; // m³
    const area = projectData.area || 500; // m²
    const steelQuantity = projectData.steelQuantity || volume * 100; // kg

    const design = area * 15000; // Design fee
    const materials = volume * regionalCosts.materials.concrete.fc25 + 
                     steelQuantity * regionalCosts.materials.steel.bj41;
    const labor = area * regionalCosts.labor.skilled * 8; // 8 hours per m²
    const equipment = volume * 50000; // Equipment cost per m³
    const overhead = (materials + labor + equipment) * (regionalCosts.overheads.contractor / 100);

    return {
      design,
      materials,
      labor,
      equipment,
      overhead,
      total: design + materials + labor + equipment + overhead
    };
  }

  /**
   * Calculate operational costs over design life
   */
  private calculateOperationalCost(projectData: any, designLife: number, inflationRate: number): any {
    const maintenance = [];
    const repair = [];
    const replacement = [];
    const inspection = [];

    // Routine maintenance (every 3 years)
    for (let year = 3; year <= designLife; year += 3) {
      maintenance.push({
        year,
        description: 'Routine maintenance and minor repairs',
        cost: Math.round(projectData.initialCost * 0.02 * Math.pow(1 + inflationRate, year)),
        probability: 0.9
      });
    }

    // Major repairs (probabilistic)
    [10, 20, 30, 40].forEach(year => {
      if (year < designLife) {
        repair.push({
          year,
          description: `Major structural repair at year ${year}`,
          cost: Math.round(projectData.initialCost * 0.15 * Math.pow(1 + inflationRate, year)),
          probability: 0.3 + (year / designLife) * 0.4
        });
      }
    });

    // Component replacement
    if (designLife > 25) {
      replacement.push({
        year: 25,
        component: 'Building systems and finishes',
        cost: Math.round(projectData.initialCost * 0.3 * Math.pow(1 + inflationRate, 25))
      });
    }

    // Inspections (every 5 years)
    for (let year = 5; year <= designLife; year += 5) {
      inspection.push({
        frequency: 5,
        cost: Math.round(50000 * Math.pow(1 + inflationRate, year))
      });
    }

    return { maintenance, repair, replacement, inspection };
  }

  /**
   * Calculate end-of-life costs
   */
  private calculateEndOfLifeCost(projectData: any, designLife: number, inflationRate: number): any {
    const futureValue = Math.pow(1 + inflationRate, designLife);
    
    const demolition = Math.round(projectData.volume * 150000 * futureValue);
    const disposal = Math.round(projectData.volume * 75000 * futureValue);
    const recycling = Math.round(-projectData.steelQuantity * 8000 * futureValue); // Revenue from steel
    const environmental = Math.round(projectData.volume * 25000 * futureValue);

    return {
      demolition,
      disposal,
      recycling,
      environmental,
      total: demolition + disposal + recycling + environmental
    };
  }

  /**
   * Calculate financial metrics
   */
  private calculateFinancialMetrics(initialCost: any, operationalCost: any, endOfLife: any, discountRate: number, inflationRate: number, designLife: number): any {
    let npv = initialCost.total;
    
    // Add operational costs
    operationalCost.maintenance.forEach((m: any) => {
      npv += (m.cost * m.probability) / Math.pow(1 + discountRate, m.year);
    });
    
    operationalCost.repair.forEach((r: any) => {
      npv += (r.cost * r.probability) / Math.pow(1 + discountRate, r.year);
    });
    
    operationalCost.replacement.forEach((rep: any) => {
      npv += rep.cost / Math.pow(1 + discountRate, rep.year);
    });

    // Add end-of-life costs
    npv += endOfLife.total / Math.pow(1 + discountRate, designLife);

    const costPerYear = npv / designLife;

    // IRR calculation (simplified)
    const totalCashFlow = npv;
    const annualCashFlow = totalCashFlow / designLife;
    const irr = (annualCashFlow / initialCost.total) - 1;

    // Payback period (simplified)
    const paybackPeriod = initialCost.total / (initialCost.total / designLife);

    return {
      discountRate,
      inflationRate,
      designLife,
      npv,
      irr,
      paybackPeriod,
      costPerYear
    };
  }

  /**
   * Perform risk analysis
   */
  private performRiskAnalysis(initialCost: any, operationalCost: any, endOfLife: any): any {
    const scenarios = [
      {
        name: 'Cost Overrun',
        probability: 0.3,
        costImpact: initialCost.total * 0.15,
        description: '15% construction cost overrun due to unforeseen conditions'
      },
      {
        name: 'Material Price Increase',
        probability: 0.4,
        costImpact: initialCost.materials * 0.1,
        description: '10% increase in material prices during construction'
      },
      {
        name: 'Extended Construction',
        probability: 0.25,
        costImpact: initialCost.labor * 0.2,
        description: 'Construction delays leading to 20% labor cost increase'
      },
      {
        name: 'Accelerated Deterioration',
        probability: 0.15,
        costImpact: initialCost.total * 0.05,
        description: 'Faster than expected deterioration increasing maintenance costs'
      }
    ];

    const expectedValue = scenarios.reduce((sum, scenario) => 
      sum + (scenario.probability * scenario.costImpact), 0
    );

    const confidenceInterval = {
      low: initialCost.total * 0.95,
      high: initialCost.total * 1.25,
      confidence: 0.95
    };

    return {
      scenarios,
      expectedValue,
      confidenceInterval
    };
  }

  /**
   * Calculate sustainability metrics
   */
  private calculateSustainabilityMetrics(projectData: any): any {
    const volume = projectData.volume || 100;
    const steelQuantity = projectData.steelQuantity || volume * 100;

    return {
      carbonFootprint: volume * 250 + steelQuantity * 2.5, // kg CO2e
      energyConsumption: volume * 150, // kWh
      waterUsage: volume * 500, // liters
      wasteGeneration: volume * 25, // kg
      recyclability: 85, // percentage
      certificationPoints: {
        greenship: 65,
        leed: 55,
        breeam: 70
      }
    };
  }

  /**
   * Optimize costs and provide recommendations
   */
  public optimizeCosts(projectData: any, currentAnalysis: LifeCycleCostAnalysis): CostOptimization {
    const alternatives = [
      {
        name: 'Higher Grade Concrete',
        description: 'Use fc30 instead of fc25 for better durability',
        initialCost: currentAnalysis.initialCost.total * 1.08,
        lifecycleCost: currentAnalysis.financial.npv * 0.92,
        savings: currentAnalysis.financial.npv * 0.08 - currentAnalysis.initialCost.total * 0.08,
        paybackPeriod: 15,
        feasibility: 'high',
        risks: ['Higher initial investment'],
        benefits: ['Reduced maintenance', 'Extended service life', 'Better durability']
      },
      {
        name: 'Protective Coatings',
        description: 'Apply protective coatings to reduce maintenance',
        initialCost: currentAnalysis.initialCost.total * 1.03,
        lifecycleCost: currentAnalysis.financial.npv * 0.95,
        savings: currentAnalysis.financial.npv * 0.05 - currentAnalysis.initialCost.total * 0.03,
        paybackPeriod: 8,
        feasibility: 'high',
        risks: ['Coating degradation', 'Application quality'],
        benefits: ['Reduced corrosion', 'Lower maintenance frequency']
      },
      {
        name: 'Prefabricated Elements',
        description: 'Use precast elements for faster construction',
        initialCost: currentAnalysis.initialCost.total * 0.95,
        lifecycleCost: currentAnalysis.financial.npv * 1.02,
        savings: currentAnalysis.initialCost.total * 0.05,
        paybackPeriod: 0,
        feasibility: 'medium',
        risks: ['Transportation', 'Assembly complexity', 'Limited customization'],
        benefits: ['Faster construction', 'Better quality control', 'Reduced labor']
      }
    ];

    const recommendations = [
      {
        priority: 'high' as const,
        action: 'Implement value engineering during design phase',
        savings: currentAnalysis.initialCost.total * 0.05,
        implementation: 'Conduct VE workshop with design team',
        timeline: 'Design phase'
      },
      {
        priority: 'medium' as const,
        action: 'Establish preventive maintenance program',
        savings: currentAnalysis.financial.npv * 0.03,
        implementation: 'Develop maintenance schedule and train staff',
        timeline: 'First year of operation'
      },
      {
        priority: 'medium' as const,
        action: 'Use regional suppliers to reduce transportation costs',
        savings: currentAnalysis.initialCost.materials * 0.02,
        implementation: 'Qualify local suppliers and adjust specifications',
        timeline: 'Procurement phase'
      }
    ];

    const valueEngineering = [
      {
        function: 'Structural Support',
        currentCost: currentAnalysis.initialCost.materials * 0.6,
        alternativeCost: currentAnalysis.initialCost.materials * 0.55,
        valueIndex: 1.1,
        recommendation: 'Optimize member sizes using advanced analysis'
      },
      {
        function: 'Durability',
        currentCost: currentAnalysis.initialCost.materials * 0.3,
        alternativeCost: currentAnalysis.initialCost.materials * 0.35,
        valueIndex: 1.8,
        recommendation: 'Invest in higher quality materials for better durability'
      }
    ];

    return {
      alternatives,
      recommendations,
      valueEngineering
    };
  }

  /**
   * Get current market prices with predictions
   */
  public getMarketPrices(region: string = 'jakarta'): { current: RegionalCostDatabase; predictions: Map<string, PriceFluctuation> } {
    return {
      current: this.regionalData.get(region) || this.regionalData.get('jakarta')!,
      predictions: this.priceHistory
    };
  }

  /**
   * Update regional prices
   */
  public updateRegionalPrices(region: string, updates: Partial<RegionalCostDatabase>): void {
    const current = this.regionalData.get(region);
    if (current) {
      this.regionalData.set(region, { ...current, ...updates, lastUpdated: new Date() });
    }
  }
}

export default AdvancedCostAnalyzer;