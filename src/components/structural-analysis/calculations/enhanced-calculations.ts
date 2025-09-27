/**
 * Enhanced Reinforcement and Cost Calculation Functions
 * For Advanced Structural Analysis System
 */

// Enhanced reinforcement design calculation
export const calculateReinforcementDetails = (structuralResults: any) => {
  return {
    columns: structuralResults.columns.map((col: any) => ({
      floor: col.floor,
      longitudinalBars: `${Math.ceil(col.demand / 500)}D25`, // Simplified
      ties: `D10-150mm`,
      reinforcementRatio: Math.min(0.02, col.demand / (col.capacity * 0.8))
    })),
    beams: structuralResults.beams.map((beam: any) => ({
      type: beam.type,
      topBars: `${Math.ceil(beam.moment / 50)}D20`,
      bottomBars: `${Math.ceil(beam.moment / 60)}D22`,
      stirrups: `D10-${beam.shear > 200 ? '100' : '150'}mm`
    })),
    slabs: structuralResults.slabs.map((slab: any) => ({
      mainReinforcement: `D10-${slab.thickness < 150 ? '150' : '200'}mm`,
      distributionReinforcement: `D10-200mm`,
      minimumRatio: 0.0018
    }))
  };
};

// Enhanced cost estimation with current Indonesian prices (2024)
export const calculateCostEstimation = (params: {
  concreteVolume: number;
  steelWeight: number;
  formworkArea: number;
  location: string;
}) => {
  // Current Indonesian construction prices (Rp)
  const basePrices = {
    concrete: {
      'K-250': 850000,  // per m³
      'K-300': 950000,
      'K-350': 1050000,
      'K-400': 1150000
    },
    steel: 14500,      // per kg for reinforcement
    formwork: 85000,   // per m²
    labor: 250000      // per m² floor area
  };

  // Location multipliers
  const locationMultipliers: Record<string, number> = {
    'Jakarta': 1.1,
    'Surabaya': 1.0,
    'Bandung': 1.05,
    'Medan': 1.0,
    'Semarang': 0.95,
    'default': 1.0
  };

  const cityName = params.location.split(',')[0].trim();
  const multiplier = locationMultipliers[cityName] || locationMultipliers.default;

  // Calculate costs
  const concrete = params.concreteVolume * basePrices.concrete['K-350'] * multiplier;
  const steel = params.steelWeight * basePrices.steel * multiplier;
  const formwork = params.formworkArea * basePrices.formwork * multiplier;
  
  const subtotal = concrete + steel + formwork;
  const overhead = subtotal * 0.15;
  const profit = subtotal * 0.12;
  const total = subtotal + overhead + profit;

  // Calculate per square meter cost based on typical floor area
  const estimatedFloorArea = Math.sqrt(params.concreteVolume / 0.15); // Rough estimate
  const pricePerSqm = estimatedFloorArea > 0 ? total / estimatedFloorArea : 0;

  return {
    concrete: Math.round(concrete),
    steel: Math.round(steel),
    formwork: Math.round(formwork),
    total: Math.round(total),
    pricePerSqm: Math.round(pricePerSqm)
  };
};