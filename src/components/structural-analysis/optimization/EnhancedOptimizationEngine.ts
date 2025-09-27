/**
 * Enhanced Optimization Engine
 * Advanced algorithms including genetic algorithms, multi-objective optimization,
 * and sustainability optimization
 */

export interface OptimizationObjective {
  name: string;
  type: 'minimize' | 'maximize';
  weight: number; // 0-1, for weighted sum approach
  priority: 'high' | 'medium' | 'low';
  constraint?: {
    min?: number;
    max?: number;
    target?: number;
    tolerance?: number;
  };
  units: string;
}

export interface DesignVariable {
  name: string;
  type: 'discrete' | 'continuous' | 'categorical';
  bounds: {
    min: number;
    max: number;
  };
  step?: number; // for discrete variables
  options?: string[]; // for categorical variables
  current: number | string;
  description: string;
  units: string;
}

export interface OptimizationResult {
  solution: {
    variables: Map<string, number | string>;
    objectives: Map<string, number>;
    fitness: number;
    feasible: boolean;
    rank?: number; // for Pareto ranking
    crowdingDistance?: number;
  };
  performance: {
    cost: number;
    weight: number;
    sustainability: number;
    safety: number;
    constructability: number;
  };
  convergence: {
    generation: number;
    bestFitness: number;
    averageFitness: number;
    diversity: number;
  };
  analysis: {
    summary: string;
    recommendations: string[];
    tradeoffs: Array<{
      objective1: string;
      objective2: string;
      relationship: 'positive' | 'negative' | 'independent';
      strength: number; // correlation coefficient
    }>;
  };
}

export interface GeneticAlgorithmConfig {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  eliteSize: number;
  tournamentSize: number;
  diversityThreshold: number;
  convergenceTolerance: number;
  adaptiveParameters: boolean;
}

export interface MultiObjectiveConfig {
  method: 'NSGA-II' | 'SPEA2' | 'MOEA-D' | 'weighted-sum';
  paretoFrontSize: number;
  referencePoint?: number[]; // for MOEA-D
  weights?: number[]; // for weighted sum
  archiveSize: number;
  diversityMaintenance: 'crowding' | 'entropy' | 'hypervolume';
}

export interface SustainabilityMetrics {
  carbonFootprint: number; // kg CO2e
  embodiedEnergy: number; // MJ
  recyclability: number; // percentage
  durability: number; // years
  resourceEfficiency: number; // percentage
  environmentalImpact: number; // normalized score 0-100
  lifeyCycleCost: number; // IDR
  socialImpact: {
    localMaterials: number; // percentage
    laborIntensity: number; // hours per unit
    communityBenefit: number; // score 0-100
  };
}

export class Individual {
  public genes: Map<string, number | string> = new Map();
  public objectives: Map<string, number> = new Map();
  public constraints: Map<string, number> = new Map();
  public fitness: number = 0;
  public rank: number = 0;
  public crowdingDistance: number = 0;
  public feasible: boolean = true;
  public age: number = 0;

  constructor(variables: DesignVariable[]) {
    this.initializeRandomly(variables);
  }

  private initializeRandomly(variables: DesignVariable[]): void {
    variables.forEach(variable => {
      if (variable.type === 'continuous') {
        this.genes.set(variable.name, 
          variable.bounds.min + Math.random() * (variable.bounds.max - variable.bounds.min));
      } else if (variable.type === 'discrete') {
        const range = variable.bounds.max - variable.bounds.min;
        const steps = variable.step ? Math.floor(range / variable.step) : range;
        const value = variable.bounds.min + Math.floor(Math.random() * (steps + 1)) * (variable.step || 1);
        this.genes.set(variable.name, value);
      } else if (variable.type === 'categorical' && variable.options) {
        const randomIndex = Math.floor(Math.random() * variable.options.length);
        this.genes.set(variable.name, variable.options[randomIndex]);
      }
    });
  }

  public clone(): Individual {
    const clone = Object.create(Individual.prototype);
    clone.genes = new Map(this.genes);
    clone.objectives = new Map(this.objectives);
    clone.constraints = new Map(this.constraints);
    clone.fitness = this.fitness;
    clone.rank = this.rank;
    clone.crowdingDistance = this.crowdingDistance;
    clone.feasible = this.feasible;
    clone.age = this.age;
    return clone;
  }

  public dominates(other: Individual): boolean {
    let atLeastOneSmaller = false;
    let atLeastOneLarger = false;

    for (const [name, value] of this.objectives) {
      const otherValue = other.objectives.get(name) || 0;
      if (value < otherValue) atLeastOneSmaller = true;
      if (value > otherValue) atLeastOneLarger = true;
    }

    return atLeastOneSmaller && !atLeastOneLarger;
  }
}

export class EnhancedOptimizationEngine {
  private objectives: OptimizationObjective[] = [];
  private variables: DesignVariable[] = [];
  private gaConfig: GeneticAlgorithmConfig;
  private moConfig: MultiObjectiveConfig;
  private population: Individual[] = [];
  private archive: Individual[] = []; // For multi-objective optimization
  private history: Array<{
    generation: number;
    bestFitness: number;
    averageFitness: number;
    diversity: number;
    paretoFrontSize?: number;
  }> = [];

  constructor() {
    this.gaConfig = {
      populationSize: 100,
      generations: 500,
      crossoverRate: 0.8,
      mutationRate: 0.1,
      eliteSize: 10,
      tournamentSize: 5,
      diversityThreshold: 0.01,
      convergenceTolerance: 1e-6,
      adaptiveParameters: true
    };

    this.moConfig = {
      method: 'NSGA-II',
      paretoFrontSize: 50,
      archiveSize: 200,
      diversityMaintenance: 'crowding'
    };

    this.initializeDefaultObjectives();
    this.initializeDefaultVariables();
  }

  private initializeDefaultObjectives(): void {
    this.objectives = [
      {
        name: 'totalCost',
        type: 'minimize',
        weight: 0.4,
        priority: 'high',
        constraint: { max: 10000000000 }, // 10B IDR
        units: 'IDR'
      },
      {
        name: 'structuralWeight',
        type: 'minimize',
        weight: 0.2,
        priority: 'medium',
        units: 'kg'
      },
      {
        name: 'carbonFootprint',
        type: 'minimize',
        weight: 0.2,
        priority: 'high',
        units: 'kg CO2e'
      },
      {
        name: 'safetyFactor',
        type: 'maximize',
        weight: 0.1,
        priority: 'high',
        constraint: { min: 1.5 },
        units: 'ratio'
      },
      {
        name: 'constructability',
        type: 'maximize',
        weight: 0.1,
        priority: 'medium',
        constraint: { min: 0.7 },
        units: 'score'
      }
    ];
  }

  private initializeDefaultVariables(): void {
    this.variables = [
      {
        name: 'beamWidth',
        type: 'discrete',
        bounds: { min: 200, max: 600 },
        step: 50,
        current: 300,
        description: 'Beam width',
        units: 'mm'
      },
      {
        name: 'beamHeight',
        type: 'discrete',
        bounds: { min: 300, max: 800 },
        step: 50,
        current: 500,
        description: 'Beam height',
        units: 'mm'
      },
      {
        name: 'columnSize',
        type: 'discrete',
        bounds: { min: 300, max: 800 },
        step: 50,
        current: 400,
        description: 'Column dimension',
        units: 'mm'
      },
      {
        name: 'concreteGrade',
        type: 'categorical',
        bounds: { min: 0, max: 4 },
        options: ['fc20', 'fc25', 'fc30', 'fc35', 'fc40'],
        current: 'fc25',
        description: 'Concrete grade',
        units: 'MPa'
      },
      {
        name: 'steelGrade',
        type: 'categorical',
        bounds: { min: 0, max: 4 },
        options: ['BJ34', 'BJ37', 'BJ41', 'BJ50', 'BJ55'],
        current: 'BJ41',
        description: 'Steel grade',
        units: 'MPa'
      },
      {
        name: 'slabThickness',
        type: 'discrete',
        bounds: { min: 100, max: 300 },
        step: 25,
        current: 150,
        description: 'Slab thickness',
        units: 'mm'
      }
    ];
  }

  /**
   * Perform single-objective optimization using genetic algorithm
   */
  public async optimizeSingleObjective(
    evaluationFunction: (individual: Individual) => Promise<number>,
    objectiveName: string = 'totalCost'
  ): Promise<OptimizationResult> {
    console.log(`Starting single-objective optimization for: ${objectiveName}`);
    
    // Initialize population
    this.population = [];
    for (let i = 0; i < this.gaConfig.populationSize; i++) {
      this.population.push(new Individual(this.variables));
    }

    // Evolution loop
    for (let generation = 0; generation < this.gaConfig.generations; generation++) {
      // Evaluate population
      await this.evaluatePopulation(evaluationFunction);

      // Check convergence
      if (this.checkConvergence(generation)) {
        console.log(`Converged at generation ${generation}`);
        break;
      }

      // Selection, crossover, and mutation
      const newPopulation = [];
      
      // Elitism - keep best individuals
      const sortedPopulation = [...this.population].sort((a, b) => b.fitness - a.fitness);
      for (let i = 0; i < this.gaConfig.eliteSize; i++) {
        newPopulation.push(sortedPopulation[i]);
      }
      
      // Generate offspring
      while (newPopulation.length < this.gaConfig.populationSize) {
        const parent1 = this.tournamentSelection();
        const parent2 = this.tournamentSelection();
        
        let child1 = parent1.clone();
        let child2 = parent2.clone();
        
        if (Math.random() < this.gaConfig.crossoverRate) {
          [child1, child2] = this.crossover(parent1, parent2);
        }
        
        if (Math.random() < this.gaConfig.mutationRate) {
          this.mutate(child1);
        }
        if (Math.random() < this.gaConfig.mutationRate) {
          this.mutate(child2);
        }
        
        newPopulation.push(child1);
        if (newPopulation.length < this.gaConfig.populationSize) {
          newPopulation.push(child2);
        }
      }
      
      this.population = newPopulation;

      // Record history
      this.recordGenerationStats(generation);

      // Adaptive parameters
      if (this.gaConfig.adaptiveParameters) {
        this.adaptParameters(generation);
      }

      if (generation % 50 === 0) {
        console.log(`Generation ${generation}, Best fitness: ${this.getBestIndividual().fitness}`);
      }
    }

    const best = this.getBestIndividual();
    return this.createOptimizationResult(best, this.history.length - 1);
  }

  /**
   * Perform multi-objective optimization using NSGA-II
   */
  public async optimizeMultiObjective(
    evaluationFunction: (individual: Individual) => Promise<Map<string, number>>
  ): Promise<OptimizationResult[]> {
    console.log('Starting multi-objective optimization using NSGA-II');

    // Initialize population
    this.population = [];
    for (let i = 0; i < this.gaConfig.populationSize; i++) {
      this.population.push(new Individual(this.variables));
    }

    // Evolution loop
    for (let generation = 0; generation < this.gaConfig.generations; generation++) {
      // Evaluate population
      await this.evaluatePopulationMultiObjective(evaluationFunction);

      // Fast non-dominated sorting
      const fronts = this.fastNonDominatedSort(this.population);

      // Calculate crowding distance
      fronts.forEach(front => this.calculateCrowdingDistance(front));

      // Environmental selection
      this.population = this.environmentalSelection(fronts);

      // Update archive (Pareto front approximation)
      this.updateArchive(fronts[0]);

      // Evolution operators
      const offspring = await this.generateOffspring();
      this.population = this.population.concat(offspring);

      // Record stats
      this.recordGenerationStatsMultiObjective(generation, fronts);

      if (generation % 50 === 0) {
        console.log(`Generation ${generation}, Pareto front size: ${fronts[0].length}`);
      }
    }

    // Return Pareto front as results
    const paretoFront = this.fastNonDominatedSort(this.archive)[0];
    return paretoFront.map((individual, index) => 
      this.createOptimizationResult(individual, this.history.length - 1));
  }

  /**
   * Optimize for sustainability
   */
  public async optimizeSustainability(
    evaluationFunction: (individual: Individual) => Promise<SustainabilityMetrics>
  ): Promise<OptimizationResult> {
    console.log('Starting sustainability optimization');

    // Define sustainability-focused objectives
    const sustainabilityObjectives: OptimizationObjective[] = [
      {
        name: 'carbonFootprint',
        type: 'minimize',
        weight: 0.3,
        priority: 'high',
        units: 'kg CO2e'
      },
      {
        name: 'embodiedEnergy',
        type: 'minimize',
        weight: 0.2,
        priority: 'high',
        units: 'MJ'
      },
      {
        name: 'recyclability',
        type: 'maximize',
        weight: 0.2,
        priority: 'medium',
        units: 'percentage'
      },
      {
        name: 'resourceEfficiency',
        type: 'maximize',
        weight: 0.15,
        priority: 'medium',
        units: 'percentage'
      },
      {
        name: 'lifeyCycleCost',
        type: 'minimize',
        weight: 0.15,
        priority: 'medium',
        units: 'IDR'
      }
    ];

    // Temporary replace objectives
    const originalObjectives = this.objectives;
    this.objectives = sustainabilityObjectives;

    try {
      // Run multi-objective optimization
      const results = await this.optimizeMultiObjective(async (individual) => {
        const metrics = await evaluationFunction(individual);
        const objectiveMap = new Map<string, number>();
        
        objectiveMap.set('carbonFootprint', metrics.carbonFootprint);
        objectiveMap.set('embodiedEnergy', metrics.embodiedEnergy);
        objectiveMap.set('recyclability', metrics.recyclability);
        objectiveMap.set('resourceEfficiency', metrics.resourceEfficiency);
        objectiveMap.set('lifeyCycleCost', metrics.lifeyCycleCost);
        
        return objectiveMap;
      });

      // Find best compromise solution
      const bestCompromise = this.findBestCompromiseSolution(results);
      return bestCompromise;

    } finally {
      // Restore original objectives
      this.objectives = originalObjectives;
    }
  }

  /**
   * Evaluate population fitness
   */
  private async evaluatePopulation(evaluationFunction: (individual: Individual) => Promise<number>): Promise<void> {
    const promises = this.population.map(async (individual) => {
      individual.fitness = await evaluationFunction(individual);
      individual.feasible = this.checkFeasibility(individual);
    });

    await Promise.all(promises);
  }

  /**
   * Evaluate population for multiple objectives
   */
  private async evaluatePopulationMultiObjective(
    evaluationFunction: (individual: Individual) => Promise<Map<string, number>>
  ): Promise<void> {
    const promises = this.population.map(async (individual) => {
      individual.objectives = await evaluationFunction(individual);
      individual.feasible = this.checkFeasibility(individual);
      individual.fitness = this.calculateScalarFitness(individual.objectives);
    });

    await Promise.all(promises);
  }

  /**
   * Check feasibility of solution
   */
  private checkFeasibility(individual: Individual): boolean {
    for (const objective of this.objectives) {
      const value = individual.objectives.get(objective.name);
      if (value === undefined) continue;

      if (objective.constraint) {
        if (objective.constraint.min !== undefined && value < objective.constraint.min) return false;
        if (objective.constraint.max !== undefined && value > objective.constraint.max) return false;
      }
    }
    return true;
  }

  /**
   * Calculate scalar fitness from multiple objectives
   */
  private calculateScalarFitness(objectives: Map<string, number>): number {
    let fitness = 0;
    for (const objective of this.objectives) {
      const value = objectives.get(objective.name) || 0;
      const normalizedValue = objective.type === 'minimize' ? -value : value;
      fitness += objective.weight * normalizedValue;
    }
    return fitness;
  }

  /**
   * Fast non-dominated sorting (NSGA-II)
   */
  private fastNonDominatedSort(population: Individual[]): Individual[][] {
    const fronts: Individual[][] = [];
    const dominationCount = new Map<Individual, number>();
    const dominatedSolutions = new Map<Individual, Individual[]>();

    // Initialize
    population.forEach(individual => {
      dominationCount.set(individual, 0);
      dominatedSolutions.set(individual, []);
      individual.rank = 0;
    });

    // Calculate domination relationships
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const p = population[i];
        const q = population[j];

        if (p.dominates(q)) {
          dominatedSolutions.get(p)!.push(q);
          dominationCount.set(q, dominationCount.get(q)! + 1);
        } else if (q.dominates(p)) {
          dominatedSolutions.get(q)!.push(p);
          dominationCount.set(p, dominationCount.get(p)! + 1);
        }
      }
    }

    // Identify first front
    let currentFront: Individual[] = [];
    population.forEach(individual => {
      if (dominationCount.get(individual) === 0) {
        individual.rank = 0;
        currentFront.push(individual);
      }
    });

    // Build subsequent fronts
    let frontIndex = 0;
    while (currentFront.length > 0) {
      fronts.push([...currentFront]);
      const nextFront: Individual[] = [];

      currentFront.forEach(p => {
        dominatedSolutions.get(p)!.forEach(q => {
          dominationCount.set(q, dominationCount.get(q)! - 1);
          if (dominationCount.get(q) === 0) {
            q.rank = frontIndex + 1;
            nextFront.push(q);
          }
        });
      });

      currentFront = nextFront;
      frontIndex++;
    }

    return fronts;
  }

  /**
   * Calculate crowding distance for diversity maintenance
   */
  private calculateCrowdingDistance(front: Individual[]): void {
    const frontSize = front.length;
    
    front.forEach(individual => individual.crowdingDistance = 0);

    for (const objective of this.objectives) {
      // Sort by objective value
      front.sort((a, b) => {
        const aVal = a.objectives.get(objective.name) || 0;
        const bVal = b.objectives.get(objective.name) || 0;
        return aVal - bVal;
      });

      // Set boundary points to infinite distance
      front[0].crowdingDistance = Infinity;
      front[frontSize - 1].crowdingDistance = Infinity;

      const objectiveValues = front.map(ind => ind.objectives.get(objective.name) || 0);
      const maxValue = Math.max(...objectiveValues);
      const minValue = Math.min(...objectiveValues);
      const range = maxValue - minValue;

      if (range > 0) {
        for (let i = 1; i < frontSize - 1; i++) {
          const distance = (objectiveValues[i + 1] - objectiveValues[i - 1]) / range;
          front[i].crowdingDistance += distance;
        }
      }
    }
  }

  /**
   * Environmental selection for next generation
   */
  private environmentalSelection(fronts: Individual[][]): Individual[] {
    const newPopulation: Individual[] = [];
    let frontIndex = 0;

    // Add complete fronts
    while (frontIndex < fronts.length && 
           newPopulation.length + fronts[frontIndex].length <= this.gaConfig.populationSize) {
      newPopulation.push(...fronts[frontIndex]);
      frontIndex++;
    }

    // Add partial front using crowding distance
    if (frontIndex < fronts.length && newPopulation.length < this.gaConfig.populationSize) {
      const remaining = this.gaConfig.populationSize - newPopulation.length;
      const lastFront = fronts[frontIndex];
      
      // Sort by crowding distance (descending)
      lastFront.sort((a, b) => b.crowdingDistance - a.crowdingDistance);
      
      newPopulation.push(...lastFront.slice(0, remaining));
    }

    return newPopulation;
  }

  /**
   * Generate offspring through crossover and mutation
   */
  private async generateOffspring(): Promise<Individual[]> {
    const offspring: Individual[] = [];
    const offspringSize = this.gaConfig.populationSize;

    for (let i = 0; i < offspringSize; i += 2) {
      // Tournament selection
      const parent1 = this.tournamentSelection();
      const parent2 = this.tournamentSelection();

      // Crossover
      let child1 = parent1.clone();
      let child2 = parent2.clone();

      if (Math.random() < this.gaConfig.crossoverRate) {
        [child1, child2] = this.crossover(parent1, parent2);
      }

      // Mutation
      if (Math.random() < this.gaConfig.mutationRate) {
        this.mutate(child1);
      }
      if (Math.random() < this.gaConfig.mutationRate) {
        this.mutate(child2);
      }

      offspring.push(child1);
      if (offspring.length < offspringSize) {
        offspring.push(child2);
      }
    }

    return offspring;
  }

  /**
   * Tournament selection
   */
  private tournamentSelection(): Individual {
    const tournament: Individual[] = [];
    
    for (let i = 0; i < this.gaConfig.tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * this.population.length);
      tournament.push(this.population[randomIndex]);
    }

    // Select best individual from tournament
    tournament.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return b.crowdingDistance - a.crowdingDistance;
    });

    return tournament[0];
  }

  /**
   * Simulated Binary Crossover (SBX)
   */
  private crossover(parent1: Individual, parent2: Individual): [Individual, Individual] {
    const child1 = parent1.clone();
    const child2 = parent2.clone();
    const eta = 20; // Distribution index

    this.variables.forEach(variable => {
      if (variable.type === 'continuous' || variable.type === 'discrete') {
        const p1Val = parent1.genes.get(variable.name) as number;
        const p2Val = parent2.genes.get(variable.name) as number;

        if (Math.abs(p1Val - p2Val) > 1e-14) {
          const u = Math.random();
          const beta = u <= 0.5 ? Math.pow(2 * u, 1 / (eta + 1)) : 
                                  Math.pow(1 / (2 * (1 - u)), 1 / (eta + 1));

          const c1 = 0.5 * ((p1Val + p2Val) - beta * Math.abs(p1Val - p2Val));
          const c2 = 0.5 * ((p1Val + p2Val) + beta * Math.abs(p1Val - p2Val));

          // Apply bounds
          const c1Bounded = Math.max(variable.bounds.min, Math.min(variable.bounds.max, c1));
          const c2Bounded = Math.max(variable.bounds.min, Math.min(variable.bounds.max, c2));

          child1.genes.set(variable.name, variable.type === 'discrete' ? 
            Math.round(c1Bounded / (variable.step || 1)) * (variable.step || 1) : c1Bounded);
          child2.genes.set(variable.name, variable.type === 'discrete' ? 
            Math.round(c2Bounded / (variable.step || 1)) * (variable.step || 1) : c2Bounded);
        }
      } else if (variable.type === 'categorical' && variable.options) {
        // Uniform crossover for categorical variables
        if (Math.random() < 0.5) {
          const temp = child1.genes.get(variable.name);
          child1.genes.set(variable.name, child2.genes.get(variable.name)!);
          child2.genes.set(variable.name, temp!);
        }
      }
    });

    return [child1, child2];
  }

  /**
   * Polynomial mutation
   */
  private mutate(individual: Individual): void {
    const eta = 20; // Distribution index

    this.variables.forEach(variable => {
      if (Math.random() < 1.0 / this.variables.length) { // Variable-wise mutation probability
        if (variable.type === 'continuous' || variable.type === 'discrete') {
          const currentVal = individual.genes.get(variable.name) as number;
          const u = Math.random();
          const delta = u < 0.5 ? 
            Math.pow(2 * u, 1 / (eta + 1)) - 1 :
            1 - Math.pow(2 * (1 - u), 1 / (eta + 1));

          const range = variable.bounds.max - variable.bounds.min;
          const mutatedVal = currentVal + delta * range * 0.1; // 10% of range

          const boundedVal = Math.max(variable.bounds.min, Math.min(variable.bounds.max, mutatedVal));
          
          individual.genes.set(variable.name, variable.type === 'discrete' ?
            Math.round(boundedVal / (variable.step || 1)) * (variable.step || 1) : boundedVal);
        } else if (variable.type === 'categorical' && variable.options) {
          const randomIndex = Math.floor(Math.random() * variable.options.length);
          individual.genes.set(variable.name, variable.options[randomIndex]);
        }
      }
    });
  }

  /**
   * Update archive with non-dominated solutions
   */
  private updateArchive(paretoFront: Individual[]): void {
    // Combine current archive with new Pareto front
    const combined = [...this.archive, ...paretoFront];
    
    // Remove dominated solutions
    const nonDominated = this.fastNonDominatedSort(combined)[0];
    
    // Maintain archive size
    if (nonDominated.length > this.moConfig.archiveSize) {
      this.calculateCrowdingDistance(nonDominated);
      nonDominated.sort((a, b) => b.crowdingDistance - a.crowdingDistance);
      this.archive = nonDominated.slice(0, this.moConfig.archiveSize);
    } else {
      this.archive = nonDominated;
    }
  }

  /**
   * Find best compromise solution from Pareto front
   */
  private findBestCompromiseSolution(results: OptimizationResult[]): OptimizationResult {
    // Use technique for order of preference by similarity to ideal solution (TOPSIS)
    const objectives = this.objectives;
    const matrix = results.map(result => 
      objectives.map(obj => result.solution.objectives.get(obj.name) || 0));

    // Normalize the matrix
    const normalizedMatrix = this.normalizeMatrix(matrix);
    
    // Calculate weighted normalized matrix
    const weightedMatrix = normalizedMatrix.map(row => 
      row.map((val, colIndex) => val * objectives[colIndex].weight));

    // Determine ideal and anti-ideal solutions
    const ideal: number[] = [];
    const antiIdeal: number[] = [];
    
    for (let j = 0; j < objectives.length; j++) {
      const column = weightedMatrix.map(row => row[j]);
      if (objectives[j].type === 'minimize') {
        ideal[j] = Math.min(...column);
        antiIdeal[j] = Math.max(...column);
      } else {
        ideal[j] = Math.max(...column);
        antiIdeal[j] = Math.min(...column);
      }
    }

    // Calculate distances and closeness
    let bestIndex = 0;
    let bestCloseness = -1;

    results.forEach((result, index) => {
      const distanceToIdeal = Math.sqrt(
        weightedMatrix[index].reduce((sum, val, j) => sum + Math.pow(val - ideal[j], 2), 0));
      const distanceToAntiIdeal = Math.sqrt(
        weightedMatrix[index].reduce((sum, val, j) => sum + Math.pow(val - antiIdeal[j], 2), 0));
      
      const closeness = distanceToAntiIdeal / (distanceToIdeal + distanceToAntiIdeal);
      
      if (closeness > bestCloseness) {
        bestCloseness = closeness;
        bestIndex = index;
      }
    });

    return results[bestIndex];
  }

  /**
   * Normalize decision matrix
   */
  private normalizeMatrix(matrix: number[][]): number[][] {
    const normalized: number[][] = [];
    
    for (let i = 0; i < matrix.length; i++) {
      normalized[i] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        const columnSum = matrix.reduce((sum, row) => sum + Math.pow(row[j], 2), 0);
        normalized[i][j] = matrix[i][j] / Math.sqrt(columnSum);
      }
    }
    
    return normalized;
  }

  /**
   * Check convergence criteria
   */
  private checkConvergence(generation: number): boolean {
    if (generation < 10) return false;

    const recentHistory = this.history.slice(-10);
    if (recentHistory.length < 10) return false;

    const fitnessVariation = Math.max(...recentHistory.map(h => h.bestFitness)) - 
                           Math.min(...recentHistory.map(h => h.bestFitness));
    
    return fitnessVariation < this.gaConfig.convergenceTolerance;
  }

  /**
   * Adapt algorithm parameters based on progress
   */
  private adaptParameters(generation: number): void {
    const progress = generation / this.gaConfig.generations;
    
    // Decrease mutation rate over time
    this.gaConfig.mutationRate = 0.1 * (1 - progress) + 0.01 * progress;
    
    // Increase selection pressure over time
    this.gaConfig.tournamentSize = Math.floor(3 + progress * 7);
  }

  /**
   * Get best individual from population
   */
  private getBestIndividual(): Individual {
    return this.population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best);
  }

  /**
   * Record generation statistics
   */
  private recordGenerationStats(generation: number): void {
    const fitnesses = this.population.map(ind => ind.fitness);
    const bestFitness = Math.max(...fitnesses);
    const averageFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;
    
    // Calculate diversity (average pairwise distance)
    let diversity = 0;
    let pairCount = 0;
    for (let i = 0; i < this.population.length; i++) {
      for (let j = i + 1; j < this.population.length; j++) {
        diversity += this.calculateDistance(this.population[i], this.population[j]);
        pairCount++;
      }
    }
    diversity = pairCount > 0 ? diversity / pairCount : 0;

    this.history.push({
      generation,
      bestFitness,
      averageFitness,
      diversity
    });
  }

  /**
   * Record multi-objective statistics
   */
  private recordGenerationStatsMultiObjective(generation: number, fronts: Individual[][]): void {
    const paretoFront = fronts[0];
    const fitnesses = this.population.map(ind => ind.fitness);
    const bestFitness = Math.max(...fitnesses);
    const averageFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;
    
    let diversity = 0;
    if (paretoFront.length > 1) {
      diversity = paretoFront.reduce((sum, ind) => sum + ind.crowdingDistance, 0) / paretoFront.length;
    }

    this.history.push({
      generation,
      bestFitness,
      averageFitness,
      diversity,
      paretoFrontSize: paretoFront.length
    });
  }

  /**
   * Calculate Euclidean distance between individuals
   */
  private calculateDistance(ind1: Individual, ind2: Individual): number {
    let distance = 0;
    this.variables.forEach(variable => {
      if (variable.type === 'continuous' || variable.type === 'discrete') {
        const val1 = ind1.genes.get(variable.name) as number;
        const val2 = ind2.genes.get(variable.name) as number;
        const range = variable.bounds.max - variable.bounds.min;
        distance += Math.pow((val1 - val2) / range, 2);
      } else if (variable.type === 'categorical') {
        const val1 = ind1.genes.get(variable.name);
        const val2 = ind2.genes.get(variable.name);
        distance += val1 === val2 ? 0 : 1;
      }
    });
    return Math.sqrt(distance);
  }

  /**
   * Create optimization result from individual
   */
  private createOptimizationResult(individual: Individual, generation: number): OptimizationResult {
    const recommendations = [];
    
    // Analyze solution characteristics
    const costObjective = individual.objectives.get('totalCost');
    const weightObjective = individual.objectives.get('structuralWeight');
    const sustainabilityObjective = individual.objectives.get('carbonFootprint');

    if (costObjective && costObjective < 5000000000) {
      recommendations.push('Cost-effective solution achieved');
    }
    if (weightObjective && weightObjective < 50000) {
      recommendations.push('Lightweight design achieved');
    }
    if (sustainabilityObjective && sustainabilityObjective < 10000) {
      recommendations.push('Low carbon footprint design');
    }

    // Analyze tradeoffs
    const tradeoffs = [];
    if (costObjective && weightObjective) {
      const correlation = this.calculateCorrelation('totalCost', 'structuralWeight');
      tradeoffs.push({
        objective1: 'totalCost',
        objective2: 'structuralWeight',
        relationship: correlation > 0.1 ? 'positive' : correlation < -0.1 ? 'negative' : 'independent',
        strength: Math.abs(correlation)
      });
    }

    return {
      solution: {
        variables: new Map(individual.genes),
        objectives: new Map(individual.objectives),
        fitness: individual.fitness,
        feasible: individual.feasible,
        rank: individual.rank,
        crowdingDistance: individual.crowdingDistance
      },
      performance: {
        cost: individual.objectives.get('totalCost') || 0,
        weight: individual.objectives.get('structuralWeight') || 0,
        sustainability: individual.objectives.get('carbonFootprint') || 0,
        safety: individual.objectives.get('safetyFactor') || 0,
        constructability: individual.objectives.get('constructability') || 0
      },
      convergence: {
        generation,
        bestFitness: individual.fitness,
        averageFitness: this.history[generation]?.averageFitness || 0,
        diversity: this.history[generation]?.diversity || 0
      },
      analysis: {
        summary: this.generateSolutionSummary(individual),
        recommendations,
        tradeoffs: tradeoffs as any
      }
    };
  }

  /**
   * Calculate correlation between two objectives across population
   */
  private calculateCorrelation(obj1: string, obj2: string): number {
    const values1 = this.population.map(ind => ind.objectives.get(obj1) || 0);
    const values2 = this.population.map(ind => ind.objectives.get(obj2) || 0);

    if (values1.length === 0 || values2.length === 0) return 0;

    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < values1.length; i++) {
      const diff1 = values1[i] - mean1;
      const diff2 = values2[i] - mean2;
      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(denominator1 * denominator2);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  /**
   * Generate solution summary
   */
  private generateSolutionSummary(individual: Individual): string {
    const variables = Array.from(individual.genes.entries()).map(([name, value]) => 
      `${name}: ${value}`).join(', ');
    
    const objectives = Array.from(individual.objectives.entries()).map(([name, value]) => 
      `${name}: ${value.toFixed(2)}`).join(', ');

    return `Optimized solution with variables [${variables}] achieving objectives [${objectives}]. ` +
           `Fitness: ${individual.fitness.toFixed(4)}, Feasible: ${individual.feasible}`;
  }

  /**
   * Set optimization configuration
   */
  public setConfiguration(config: Partial<GeneticAlgorithmConfig & MultiObjectiveConfig>): void {
    this.gaConfig = { ...this.gaConfig, ...config };
    this.moConfig = { ...this.moConfig, ...config };
  }

  /**
   * Get optimization history
   */
  public getOptimizationHistory(): typeof this.history {
    return this.history;
  }

  /**
   * Reset optimizer state
   */
  public reset(): void {
    this.population = [];
    this.archive = [];
    this.history = [];
  }
}

export default EnhancedOptimizationEngine;