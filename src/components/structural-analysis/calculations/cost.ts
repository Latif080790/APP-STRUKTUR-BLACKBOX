import { Geometry, CostEstimate } from '../interfaces';

// Prices are for demonstration and should be updated with current data.
const prices = {
    concrete: 950000, // per m³
    rebar: 12500,     // per kg
    formwork: 75000,  // per m²
    laborFoundation: 150000, // per m²
    laborStructure: 200000, // per m²
    laborFinishing: 100000, // per m²
    equipment: 50000, // per m²
};

export const calculateCostEstimate = (geometry: Geometry): CostEstimate => {
    const floorArea = (geometry.length ?? 0) * (geometry.width ?? 0);
    const totalArea = floorArea * (geometry.numberOfFloors ?? 1);

    // Simplified material quantity estimations
    const totalColumns = ((geometry.columnGridX ?? 0) + 1) * ((geometry.columnGridY ?? 0) + 1);
    const concreteVolume = totalArea * 0.15 + 
                           (geometry.numberOfFloors ?? 1) * totalColumns * 0.4 * 0.4 * (geometry.heightPerFloor ?? 0) + 
                           (geometry.numberOfFloors ?? 1) * ((geometry.length ?? 0) + (geometry.width ?? 0)) * 2 * 0.3 * 0.6;
    const rebarWeight = concreteVolume * 150; // kg/m³ average
    const formworkArea = totalArea * 2.5;

    const materialCost = {
        concrete: concreteVolume * prices.concrete,
        steel: 0, // Not used in this example
        rebar: rebarWeight * prices.rebar,
        formwork: formworkArea * prices.formwork
    };

    const laborCost = {
        foundation: floorArea * prices.laborFoundation,
        structure: totalArea * prices.laborStructure,
        finishing: totalArea * prices.laborFinishing
    };

    const equipmentCost = totalArea * prices.equipment;

    const subtotal = Object.values(materialCost).reduce((a, b) => a + b, 0) +
                     Object.values(laborCost).reduce((a, b) => a + b, 0) +
                     equipmentCost;

    const overhead = subtotal * 0.15;
    const contingency = subtotal * 0.10;
    const total = subtotal + overhead + contingency;

    return {
        material: materialCost,
        labor: laborCost,
        equipment: equipmentCost,
        overhead,
        contingency,
        total,
        perSquareMeter: totalArea > 0 ? total / totalArea : 0
    };
};
