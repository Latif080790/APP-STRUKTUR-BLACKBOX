import React, { useState, useCallback, useMemo } from 'react';
import { 
  Brain, 
  Cpu, 
  Target, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  LineChart
} from 'lucide-react';

interface OptimizationParameters {
  objectives: {
    minimizeCost: boolean;
    minimizeWeight: boolean;
    maximizeStrength: boolean;
    minimizeDeflection: boolean;
  };
  constraints: {
    maxDeflection: number;
    minSafetyFactor: number;
    maxCost: number;
    maxWeight: number;
  };
  algorithmSettings: {
    populationSize: number;
    generations: number;
    mutationRate: number;
    crossoverRate: number;
  };
}

interface SectionCandidate {
  id: string;
  name: string;
  type: 'beam' | 'column' | 'brace';
  properties: {
    area: number;
    momentOfInertiaX: number;
    weight: number;
    cost: number;
  };
  material: {
    fy: number;
    fu: number;
  };
}

interface OptimizationResult {
  generation: number;
  bestFitness: number;
  selectedSections: SectionCandidate[];
  objectives: {
    cost: number;
    weight: number;
    strength: number;
    deflection: number;
  };
  constraints: {
    deflectionOK: boolean;
    safetyFactorOK: boolean;
    costOK: boolean;
    weightOK: boolean;
  };
}

const AIOptimizationEngine: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [bestSolution, setBestSolution] = useState<OptimizationResult | null>(null);
  
  const [parameters, setParameters] = useState<OptimizationParameters>({
    objectives: {
      minimizeCost: true,
      minimizeWeight: true,
      maximizeStrength: false,
      minimizeDeflection: true
    },
    constraints: {
      maxDeflection: 25,
      minSafetyFactor: 2.0,
      maxCost: 1000000,
      maxWeight: 5000
    },
    algorithmSettings: {
      populationSize: 50,
      generations: 100,
      mutationRate: 0.1,
      crossoverRate: 0.8
    }
  });

  const sectionDatabase: SectionCandidate[] = useMemo(() => [
    {
      id: 'wf-200x100',
      name: 'WF 200.100.5.5.5',
      type: 'beam',
      properties: { area: 2850, momentOfInertiaX: 23900000, weight: 22.4, cost: 25000 },
      material: { fy: 250, fu: 370 }
    },
    {
      id: 'wf-400x200',
      name: 'WF 400.200.8.13',
      type: 'beam',
      properties: { area: 8400, momentOfInertiaX: 234000000, weight: 66, cost: 72000 },
      material: { fy: 250, fu: 370 }
    },
    {
      id: 'hss-150x150',
      name: 'HSS 150.150.6',
      type: 'column',
      properties: { area: 3400, momentOfInertiaX: 12800000, weight: 26.7, cost: 32000 },
      material: { fy: 250, fu: 370 }
    },
    {
      id: 'hss-200x200',
      name: 'HSS 200.200.8',
      type: 'column',
      properties: { area: 5920, momentOfInertiaX: 30700000, weight: 46.5, cost: 52000 },
      material: { fy: 250, fu: 370 }
    }
  ], []);

  const geneticAlgorithm = useCallback(async () => {
    const { populationSize, generations } = parameters.algorithmSettings;
    
    let population = initializePopulation(populationSize);
    let bestFitness = -Infinity;
    let bestIndividual: SectionCandidate[] = [];
    
    for (let gen = 0; gen < generations; gen++) {
      setCurrentGeneration(gen + 1);
      setOptimizationProgress(((gen + 1) / generations) * 100);
      
      const fitnessScores = population.map(individual => evaluateFitness(individual));
      const currentBest = Math.max(...fitnessScores);
      const bestIndex = fitnessScores.indexOf(currentBest);
      
      if (currentBest > bestFitness) {
        bestFitness = currentBest;
        bestIndividual = [...population[bestIndex]];
        
        const result: OptimizationResult = {
          generation: gen + 1,
          bestFitness: currentBest,
          selectedSections: bestIndividual,
          objectives: calculateObjectives(bestIndividual),
          constraints: checkConstraints(bestIndividual)
        };
        
        setBestSolution(result);
      }
      
      // Evolution process (simplified)
      population = evolvePopulation(population, fitnessScores);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return bestIndividual;
  }, [parameters, sectionDatabase]);

  const initializePopulation = (size: number): SectionCandidate[][] => {
    const population: SectionCandidate[][] = [];
    
    for (let i = 0; i < size; i++) {
      const individual: SectionCandidate[] = [];
      for (let j = 0; j < 4; j++) {
        const type = j < 2 ? 'beam' : 'column';
        const availableSections = sectionDatabase.filter(s => s.type === type);
        const randomSection = availableSections[Math.floor(Math.random() * availableSections.length)];
        individual.push(randomSection);
      }
      population.push(individual);
    }
    
    return population;
  };

  const evaluateFitness = (individual: SectionCandidate[]): number => {
    const objectives = calculateObjectives(individual);
    const constraints = checkConstraints(individual);
    
    let fitness = 0;
    const maxCost = 400000;
    const maxWeight = 2000;
    
    if (parameters.objectives.minimizeCost) {
      fitness += (1 - objectives.cost / maxCost) * 0.4;
    }
    
    if (parameters.objectives.minimizeWeight) {
      fitness += (1 - objectives.weight / maxWeight) * 0.4;
    }
    
    if (parameters.objectives.minimizeDeflection) {
      fitness += (1 - objectives.deflection / 50) * 0.2;
    }
    
    // Constraint penalties
    let penalty = 0;
    if (!constraints.deflectionOK) penalty += 0.5;
    if (!constraints.safetyFactorOK) penalty += 0.5;
    if (!constraints.costOK) penalty += 0.3;
    if (!constraints.weightOK) penalty += 0.3;
    
    return Math.max(0, fitness - penalty);
  };

  const calculateObjectives = (individual: SectionCandidate[]) => {
    const totalCost = individual.reduce((sum, section) => sum + section.properties.cost, 0);
    const totalWeight = individual.reduce((sum, section) => sum + section.properties.weight, 0);
    const avgStrength = individual.reduce((sum, section) => sum + section.material.fy, 0) / individual.length;
    const avgMomentOfInertia = individual.reduce((sum, section) => sum + section.properties.momentOfInertiaX, 0) / individual.length;
    const estimatedDeflection = 50000000 / avgMomentOfInertia * 1000;
    
    return {
      cost: totalCost,
      weight: totalWeight,
      strength: avgStrength,
      deflection: estimatedDeflection
    };
  };

  const checkConstraints = (individual: SectionCandidate[]) => {
    const objectives = calculateObjectives(individual);
    
    return {
      deflectionOK: objectives.deflection <= parameters.constraints.maxDeflection,
      safetyFactorOK: objectives.strength >= parameters.constraints.minSafetyFactor * 100,
      costOK: objectives.cost <= parameters.constraints.maxCost,
      weightOK: objectives.weight <= parameters.constraints.maxWeight
    };
  };

  const evolvePopulation = (population: SectionCandidate[][], fitnessScores: number[]): SectionCandidate[][] => {
    const newPopulation: SectionCandidate[][] = [];
    const { populationSize, mutationRate, crossoverRate } = parameters.algorithmSettings;
    
    // Elite selection
    const eliteCount = Math.floor(populationSize * 0.1);
    const sortedIndices = fitnessScores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, eliteCount)
      .map(item => item.index);
    
    for (const index of sortedIndices) {
      newPopulation.push([...population[index]]);
    }
    
    // Generate offspring
    while (newPopulation.length < populationSize) {
      const parent1 = tournamentSelection(population, fitnessScores);
      const parent2 = tournamentSelection(population, fitnessScores);
      
      let offspring1, offspring2;
      if (Math.random() < crossoverRate) {
        [offspring1, offspring2] = crossover(parent1, parent2);
      } else {
        offspring1 = [...parent1];
        offspring2 = [...parent2];
      }
      
      if (Math.random() < mutationRate) {
        offspring1 = mutate(offspring1);
      }
      if (Math.random() < mutationRate) {
        offspring2 = mutate(offspring2);
      }
      
      newPopulation.push(offspring1);
      if (newPopulation.length < populationSize) {
        newPopulation.push(offspring2);
      }
    }
    
    return newPopulation;
  };

  const tournamentSelection = (population: SectionCandidate[][], fitnessScores: number[]): SectionCandidate[] => {
    let best = -1;
    let bestFitness = -Infinity;
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      if (fitnessScores[randomIndex] > bestFitness) {
        bestFitness = fitnessScores[randomIndex];
        best = randomIndex;
      }
    }
    
    return [...population[best]];
  };

  const crossover = (parent1: SectionCandidate[], parent2: SectionCandidate[]): [SectionCandidate[], SectionCandidate[]] => {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    
    const offspring1 = [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint)
    ];
    
    const offspring2 = [
      ...parent2.slice(0, crossoverPoint),
      ...parent1.slice(crossoverPoint)
    ];
    
    return [offspring1, offspring2];
  };

  const mutate = (individual: SectionCandidate[]): SectionCandidate[] => {
    const mutated = [...individual];
    const mutationIndex = Math.floor(Math.random() * individual.length);
    
    const currentType = individual[mutationIndex].type;
    const availableSections = sectionDatabase.filter(s => s.type === currentType);
    const randomSection = availableSections[Math.floor(Math.random() * availableSections.length)];
    
    mutated[mutationIndex] = randomSection;
    return mutated;
  };

  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    setCurrentGeneration(0);
    setBestSolution(null);
    
    try {
      await geneticAlgorithm();
    } catch (error) {
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const stopOptimization = () => {
    setIsOptimizing(false);
  };

  const resetOptimization = () => {
    setOptimizationProgress(0);
    setCurrentGeneration(0);
    setBestSolution(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-6 border-2 border-gray-300 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">AI-Powered Optimization Engine</h2>
            <p className="text-purple-100">Intelligent structural section optimization using genetic algorithms</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/15 rounded-lg p-3 border border-white/20">
            <div className="text-purple-100 text-sm font-medium">Current Generation</div>
            <div className="text-xl font-bold">{currentGeneration}</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3 border border-white/20">
            <div className="text-purple-100 text-sm font-medium">Progress</div>
            <div className="text-xl font-bold">{optimizationProgress.toFixed(1)}%</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3 border border-white/20">
            <div className="text-purple-100 text-sm font-medium">Best Fitness</div>
            <div className="text-xl font-bold">{bestSolution?.bestFitness.toFixed(3) || '0.000'}</div>
          </div>
          <div className="bg-white/15 rounded-lg p-3 border border-white/20">
            <div className="text-purple-100 text-sm font-medium">Database Size</div>
            <div className="text-xl font-bold">{sectionDatabase.length} sections</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimization Parameters */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-indigo-600" />
            Optimization Parameters
          </h3>

          <div className="mb-6">
            <h4 className="text-slate-800 font-bold mb-3">Objectives</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(parameters.objectives || {}).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      objectives: { ...prev.objectives, [key]: e.target.checked }
                    }))}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-slate-600 text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold mb-3">Algorithm Settings</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 text-sm mb-1">Population Size</label>
                <input
                  type="number"
                  value={parameters.algorithmSettings.populationSize}
                  onChange={(e) => setParameters(prev => ({
                    ...prev,
                    algorithmSettings: {
                      ...prev.algorithmSettings,
                      populationSize: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 text-sm mb-1">Generations</label>
                <input
                  type="number"
                  value={parameters.algorithmSettings.generations}
                  onChange={(e) => setParameters(prev => ({
                    ...prev,
                    algorithmSettings: {
                      ...prev.algorithmSettings,
                      generations: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md text-slate-800 focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-indigo-600" />
            Control Panel
          </h3>

          <div className="space-y-3 mb-6">
            <button
              onClick={startOptimization}
              disabled={isOptimizing}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-green-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 font-bold border-2 border-green-500 shadow-lg"
            >
              <Play className="w-5 h-5" />
              <span>{isOptimizing ? 'Optimizing...' : 'Start Optimization'}</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={stopOptimization}
                disabled={!isOptimizing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 border-2 border-red-500 font-bold"
              >
                <Pause className="w-4 h-4" />
                <span>Stop</span>
              </button>
              
              <button
                onClick={resetOptimization}
                disabled={isOptimizing}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 border-2 border-slate-500 font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {isOptimizing && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Optimization Progress</span>
                <span>{optimizationProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${optimizationProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {bestSolution && (
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Optimization Results (Generation {bestSolution.generation})
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-slate-800 font-bold mb-3">Optimized Sections</h4>
              <div className="space-y-2">
                {bestSolution.selectedSections.map((section, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border-2 border-gray-200">
                    <span className="text-slate-800 font-bold">{section.name}</span>
                    <span className="text-slate-600 text-sm font-medium px-2 py-1 bg-blue-100 rounded">{section.type}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-slate-800 font-bold mb-3">Performance Metrics</h4>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-800 text-sm font-bold">Total Cost</div>
                  <div className="text-blue-900 font-bold text-lg">Rp {bestSolution.objectives.cost.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-green-800 text-sm font-bold">Total Weight</div>
                  <div className="text-green-900 font-bold text-lg">{bestSolution.objectives.weight.toFixed(1)} kg</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="text-purple-800 text-sm font-bold">Avg Strength</div>
                  <div className="text-purple-900 font-bold text-lg">{bestSolution.objectives.strength.toFixed(0)} MPa</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-orange-800 text-sm font-bold">Max Deflection</div>
                  <div className="text-orange-900 font-bold text-lg">{bestSolution.objectives.deflection.toFixed(1)} mm</div>
                </div>
              </div>

              <h4 className="text-slate-800 font-bold mb-2">Constraint Compliance</h4>
              <div className="space-y-2">
                {Object.entries(bestSolution.constraints || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-slate-700 text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace('OK', '')}
                    </span>
                    <div className="flex items-center space-x-1">
                      {value ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-700 text-sm font-bold">Pass</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-red-700 text-sm font-bold">Fail</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIOptimizationEngine;