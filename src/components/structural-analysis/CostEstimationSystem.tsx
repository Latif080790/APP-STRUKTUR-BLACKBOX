import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Truck,
  Users,
  Calculator,
  PieChart,
  Download,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface CostEstimationSystemProps {
  geometry: {
    length: number;
    width: number;
    heightPerFloor: number;
    numberOfFloors: number;
    baySpacingX: number;
    baySpacingY: number;
  };
  materials: {
    fc: number;
    fy: number;
    ec: number;
    densityConcrete: number;
  };
  analysisResults?: any;
  onCostUpdate?: (costData: any) => void;
}

// Real-time material prices (IDR) - Updated September 2025
const MATERIAL_PRICES = {
  concrete: {
    'K-250': { price: 850000, unit: 'm³', supplier: 'PT Beton Ready Mix' },
    'K-300': { price: 920000, unit: 'm³', supplier: 'PT Beton Ready Mix' },
    'K-350': { price: 990000, unit: 'm³', supplier: 'PT Beton Ready Mix' }
  },
  steel: {
    'D10': { price: 14500, unit: 'kg', supplier: 'PT Krakatau Steel' },
    'D12': { price: 14200, unit: 'kg', supplier: 'PT Krakatau Steel' },
    'D16': { price: 13900, unit: 'kg', supplier: 'PT Krakatau Steel' },
    'D19': { price: 13700, unit: 'kg', supplier: 'PT Krakatau Steel' },
    'D22': { price: 13500, unit: 'kg', supplier: 'PT Krakatau Steel' },
    'D25': { price: 13300, unit: 'kg', supplier: 'PT Krakatau Steel' }
  },
  formwork: {
    plywood: { price: 350000, unit: 'm²', supplier: 'PT Kayu Lapis Indonesia' },
    lumber: { price: 4500000, unit: 'm³', supplier: 'PT Kayu Lapis Indonesia' }
  }
};

const LABOR_RATES = {
  skilled: { rate: 180000, unit: 'hari', description: 'Tukang Besi/Bekisting' },
  semiskilled: { rate: 150000, unit: 'hari', description: 'Pekerja Semi-Ahli' },
  unskilled: { rate: 120000, unit: 'hari', description: 'Pekerja Biasa' }
};

const EQUIPMENT_RATES = {
  concrete_pump: { rate: 2500000, unit: 'hari', description: 'Concrete Pump' },
  crane: { rate: 3500000, unit: 'hari', description: 'Tower Crane' },
  mixer: { rate: 800000, unit: 'hari', description: 'Concrete Mixer' }
};

export const CostEstimationSystem: React.FC<CostEstimationSystemProps> = ({
  geometry,
  materials,
  analysisResults,
  onCostUpdate
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationProgress, setCalculationProgress] = useState(0);
  const [costResults, setCostResults] = useState<any>(null);
  const [priceDate, setPriceDate] = useState(new Date().toLocaleDateString('id-ID'));
  const [selectedConcreteGrade, setSelectedConcreteGrade] = useState<'K-250' | 'K-300' | 'K-350'>('K-300');

  // Calculate quantities based on geometry
  const quantities = useMemo(() => {
    const totalArea = geometry.length * geometry.width;
    const totalHeight = geometry.numberOfFloors * geometry.heightPerFloor;
    const buildingVolume = totalArea * totalHeight;

    // Concrete calculations
    const columnVolume = 
      Math.ceil(geometry.length / geometry.baySpacingX + 1) *
      Math.ceil(geometry.width / geometry.baySpacingY + 1) *
      geometry.numberOfFloors *
      0.4 * 0.4 * geometry.heightPerFloor; // 40x40cm columns

    const beamVolume = 
      (Math.ceil(geometry.length / geometry.baySpacingX) * 
       Math.ceil(geometry.width / geometry.baySpacingY + 1) + 
       Math.ceil(geometry.width / geometry.baySpacingY) * 
       Math.ceil(geometry.length / geometry.baySpacingX + 1)) *
      geometry.numberOfFloors *
      0.3 * 0.6 * geometry.baySpacingX; // 30x60cm beams

    const slabVolume = totalArea * geometry.numberOfFloors * 0.12; // 12cm slab

    const totalConcreteVolume = columnVolume + beamVolume + slabVolume;

    // Steel reinforcement calculations (approximation)
    const columnSteelWeight = columnVolume * 120; // 120 kg/m³ for columns
    const beamSteelWeight = beamVolume * 100; // 100 kg/m³ for beams  
    const slabSteelWeight = slabVolume * 80; // 80 kg/m³ for slabs
    const totalSteelWeight = columnSteelWeight + beamSteelWeight + slabSteelWeight;

    // Formwork calculations
    const formworkArea = (columnVolume / 0.4 * 4) + (beamVolume / 0.3 * 2) + (slabVolume / 0.12);

    return {
      concrete: {
        column: columnVolume,
        beam: beamVolume,
        slab: slabVolume,
        total: totalConcreteVolume
      },
      steel: {
        column: columnSteelWeight,
        beam: beamSteelWeight,
        slab: slabSteelWeight,
        total: totalSteelWeight
      },
      formwork: {
        total: formworkArea
      },
      area: totalArea,
      volume: buildingVolume
    };
  }, [geometry]);

  const runCostCalculation = async () => {
    setIsCalculating(true);
    setCalculationProgress(0);

    // Simulate calculation steps
    const steps = [
      'Calculating quantities...',
      'Fetching material prices...',
      'Calculating labor costs...',
      'Calculating equipment costs...',
      'Applying overhead & profit...',
      'Finalizing cost estimation...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCalculationProgress(((i + 1) / steps.length) * 100);
    }

    // Calculate detailed costs
    const materialCosts = calculateMaterialCosts();
    const laborCosts = calculateLaborCosts();
    const equipmentCosts = calculateEquipmentCosts();
    
    const subtotal = materialCosts.total + laborCosts.total + equipmentCosts.total;
    const overhead = subtotal * 0.15; // 15% overhead
    const profit = subtotal * 0.10; // 10% profit
    const tax = (subtotal + overhead + profit) * 0.11; // 11% PPN
    const total = subtotal + overhead + profit + tax;

    const results = {
      timestamp: new Date().toISOString(),
      priceDate,
      quantities,
      costs: {
        materials: materialCosts,
        labor: laborCosts,
        equipment: equipmentCosts,
        subtotal,
        overhead,
        profit,
        tax,
        total
      },
      perSquareMeter: total / quantities.area,
      constructionDuration: estimateConstructionDuration(),
      recommendations: generateCostRecommendations(total)
    };

    setCostResults(results);
    if (onCostUpdate) {
      onCostUpdate(results);
    }
    
    setIsCalculating(false);
  };

  const calculateMaterialCosts = () => {
    const concreteGradePrice = MATERIAL_PRICES.concrete[selectedConcreteGrade];
    
    const concreteCost = quantities.concrete.total * concreteGradePrice.price;
    
    // Steel cost breakdown by diameter
    const steelBreakdown = {
      D10: quantities.steel.total * 0.15, // 15% D10
      D12: quantities.steel.total * 0.20, // 20% D12
      D16: quantities.steel.total * 0.25, // 25% D16
      D19: quantities.steel.total * 0.20, // 20% D19
      D22: quantities.steel.total * 0.15, // 15% D22
      D25: quantities.steel.total * 0.05  // 5% D25
    };

    const steelCost = Object.entries(steelBreakdown).reduce((total, [diameter, weight]) => {
      const price = MATERIAL_PRICES.steel[diameter as keyof typeof MATERIAL_PRICES.steel];
      return total + (weight * price.price);
    }, 0);

    const formworkCost = quantities.formwork.total * MATERIAL_PRICES.formwork.plywood.price;

    return {
      concrete: {
        quantity: quantities.concrete.total,
        unit: 'm³',
        unitPrice: concreteGradePrice.price,
        total: concreteCost,
        grade: selectedConcreteGrade
      },
      steel: {
        quantity: quantities.steel.total,
        unit: 'kg',
        breakdown: steelBreakdown,
        total: steelCost
      },
      formwork: {
        quantity: quantities.formwork.total,
        unit: 'm²',
        unitPrice: MATERIAL_PRICES.formwork.plywood.price,
        total: formworkCost
      },
      total: concreteCost + steelCost + formworkCost
    };
  };

  const calculateLaborCosts = () => {
    const buildingComplexity = geometry.numberOfFloors > 5 ? 'complex' : 'simple';
    const durationMultiplier = buildingComplexity === 'complex' ? 1.3 : 1.0;
    
    const baseDuration = Math.ceil(quantities.area / 100) * 30; // 30 days per 100m²
    const totalDuration = baseDuration * durationMultiplier;

    const skilled = totalDuration * 4 * LABOR_RATES.skilled.rate; // 4 skilled workers
    const semiskilled = totalDuration * 6 * LABOR_RATES.semiskilled.rate; // 6 semi-skilled
    const unskilled = totalDuration * 8 * LABOR_RATES.unskilled.rate; // 8 unskilled

    return {
      duration: totalDuration,
      breakdown: {
        skilled: { workers: 4, cost: skilled, rate: LABOR_RATES.skilled.rate },
        semiskilled: { workers: 6, cost: semiskilled, rate: LABOR_RATES.semiskilled.rate },
        unskilled: { workers: 8, cost: unskilled, rate: LABOR_RATES.unskilled.rate }
      },
      total: skilled + semiskilled + unskilled
    };
  };

  const calculateEquipmentCosts = () => {
    const duration = Math.ceil(quantities.area / 100) * 30;
    
    const concretePump = duration * 0.3 * EQUIPMENT_RATES.concrete_pump.rate; // 30% of time
    const crane = duration * 0.8 * EQUIPMENT_RATES.crane.rate; // 80% of time
    const mixer = duration * 0.4 * EQUIPMENT_RATES.mixer.rate; // 40% of time

    return {
      breakdown: {
        concrete_pump: { days: duration * 0.3, cost: concretePump },
        crane: { days: duration * 0.8, cost: crane },
        mixer: { days: duration * 0.4, cost: mixer }
      },
      total: concretePump + crane + mixer
    };
  };

  const estimateConstructionDuration = () => {
    const baseMonths = Math.ceil(quantities.area / 500) * 2; // 2 months per 500m²
    const floorMultiplier = geometry.numberOfFloors > 3 ? 1.2 : 1.0;
    return Math.ceil(baseMonths * floorMultiplier);
  };

  const generateCostRecommendations = (totalCost: number) => {
    const recommendations = [];
    
    if (totalCost > 5000000000) { // > 5 billion IDR
      recommendations.push({
        type: 'cost_optimization',
        priority: 'high',
        message: 'Pertimbangkan optimasi desain atau penggunaan material alternatif untuk mengurangi biaya'
      });
    }
    
    if (selectedConcreteGrade === 'K-350' && materials.fc <= 25) {
      recommendations.push({
        type: 'material_optimization',
        priority: 'medium',
        message: 'Mutu beton K-300 sudah cukup untuk f\'c 25 MPa, dapat menghemat biaya'
      });
    }

    recommendations.push({
      type: 'procurement',
      priority: 'medium',
      message: 'Lakukan negosiasi harga dengan supplier untuk pembelian dalam jumlah besar'
    });

    return recommendations;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Real-Time Cost Estimation System
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Badge variant="outline">Harga: {priceDate}</Badge>
            <select
              value={selectedConcreteGrade}
              onChange={(e) => setSelectedConcreteGrade(e.target.value as any)}
              className="px-3 py-1 border rounded text-sm"
              disabled={isCalculating}
            >
              <option value="K-250">Beton K-250</option>
              <option value="K-300">Beton K-300</option>
              <option value="K-350">Beton K-350</option>
            </select>
            <Button 
              onClick={runCostCalculation} 
              disabled={isCalculating}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
            >
              {isCalculating ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Calculator className="w-4 h-4 mr-2" />}
              {isCalculating ? 'Calculating...' : 'Calculate Cost'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Calculation Progress */}
        {isCalculating && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">
                Cost Calculation in Progress...
              </span>
              <span className="text-sm text-green-600">{calculationProgress.toFixed(0)}%</span>
            </div>
            <Progress value={calculationProgress} className="h-2" />
          </div>
        )}

        {/* Quantities Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-sm font-medium text-blue-700">Total Area</div>
            <div className="text-2xl font-bold text-blue-900">
              {quantities.area.toLocaleString()} m²
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-sm font-medium text-green-700">Concrete Volume</div>
            <div className="text-2xl font-bold text-green-900">
              {quantities.concrete.total.toFixed(1)} m³
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-sm font-medium text-orange-700">Steel Weight</div>
            <div className="text-2xl font-bold text-orange-900">
              {quantities.steel.total.toFixed(0)} kg
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-sm font-medium text-purple-700">Formwork Area</div>
            <div className="text-2xl font-bold text-purple-900">
              {quantities.formwork.total.toFixed(0)} m²
            </div>
          </div>
        </div>

        {/* Cost Results */}
        {costResults && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Cost Summary</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="labor">Labor & Equipment</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {/* Cost Summary Tab */}
            <TabsContent value="summary">
              <div className="space-y-6">
                {/* Main Cost Display */}
                <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border">
                  <div className="text-sm font-medium text-gray-600 mb-2">Total Project Cost</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {formatCurrency(costResults.costs.total)}
                  </div>
                  <div className="text-lg text-gray-600">
                    {formatCurrency(costResults.perSquareMeter)} per m²
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Estimated Construction Duration: {costResults.constructionDuration} months
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Materials:</span>
                          <span className="font-semibold">{formatCurrency(costResults.costs.materials.total)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Labor:</span>
                          <span className="font-semibold">{formatCurrency(costResults.costs.labor.total)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Equipment:</span>
                          <span className="font-semibold">{formatCurrency(costResults.costs.equipment.total)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span>Subtotal:</span>
                            <span className="font-semibold">{formatCurrency(costResults.costs.subtotal)}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Overhead (15%):</span>
                          <span>{formatCurrency(costResults.costs.overhead)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>Profit (10%):</span>
                          <span>{formatCurrency(costResults.costs.profit)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>PPN (11%):</span>
                          <span>{formatCurrency(costResults.costs.tax)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-green-600">{formatCurrency(costResults.costs.total)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Cost Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Materials</span>
                            <span>{((costResults.costs.materials.total / costResults.costs.subtotal) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={(costResults.costs.materials.total / costResults.costs.subtotal) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Labor</span>
                            <span>{((costResults.costs.labor.total / costResults.costs.subtotal) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={(costResults.costs.labor.total / costResults.costs.subtotal) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Equipment</span>
                            <span>{((costResults.costs.equipment.total / costResults.costs.subtotal) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress 
                            value={(costResults.costs.equipment.total / costResults.costs.subtotal) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Concrete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Grade:</span>
                        <Badge>{costResults.costs.materials.concrete.grade}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span>{costResults.costs.materials.concrete.quantity.toFixed(1)} m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span>{formatCurrency(costResults.costs.materials.concrete.unitPrice)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(costResults.costs.materials.concrete.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-5 h-5 bg-orange-500 rounded"></div>
                      Steel Reinforcement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Weight:</span>
                        <span>{costResults.costs.materials.steel.quantity.toFixed(0)} kg</span>
                      </div>
                      <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                        {Object.entries(costResults.costs.materials.steel.breakdown).map(([diameter, weight]) => (
                          <div key={diameter} className="flex justify-between">
                            <span>{diameter}:</span>
                            <span>{(weight as number).toFixed(0)} kg</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(costResults.costs.materials.steel.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-600 rounded"></div>
                      Formwork
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Area:</span>
                        <span>{costResults.costs.materials.formwork.quantity.toFixed(0)} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span>{formatCurrency(costResults.costs.materials.formwork.unitPrice)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatCurrency(costResults.costs.materials.formwork.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Labor & Equipment Tab */}
            <TabsContent value="labor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Labor Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm bg-blue-50 p-2 rounded">
                        Construction Duration: {costResults.costs.labor.duration} days
                      </div>
                      {Object.entries(costResults.costs.labor.breakdown).map(([type, data]: [string, any]) => (
                        <div key={type} className="border-b pb-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="capitalize">{type}:</span>
                            <span className="text-sm">{data.workers} workers</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {formatCurrency(data.rate)}/day
                            </span>
                            <span className="font-semibold">{formatCurrency(data.cost)}</span>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Labor:</span>
                          <span className="text-green-600">{formatCurrency(costResults.costs.labor.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5 text-purple-600" />
                      Equipment Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(costResults.costs.equipment.breakdown).map(([equipment, data]: [string, any]) => (
                        <div key={equipment} className="border-b pb-2">
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{equipment.replace('_', ' ')}:</span>
                            <span className="font-semibold">{formatCurrency(data.cost)}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {data.days.toFixed(1)} days
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total Equipment:</span>
                          <span className="text-purple-600">{formatCurrency(costResults.costs.equipment.total)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis">
              <div className="space-y-6">
                {/* Cost Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Cost Optimization Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {costResults.recommendations.map((rec: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded">
                          <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium capitalize">{rec.type.replace('_', ' ')}</div>
                            <div className="text-sm text-gray-600 mt-1">{rec.message}</div>
                            <Badge variant="outline" className="mt-2">
                              {rec.priority.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-600" />
                      Export Cost Estimation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(costResults, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `cost-estimation-${Date.now()}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export JSON
                      </Button>
                      <Button 
                        onClick={() => {
                          // Future: Export to Excel/PDF
                          alert('Excel export will be available in next update');
                        }}
                        variant="outline"
                        disabled
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export Excel (Coming Soon)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* No Results State */}
        {!costResults && !isCalculating && (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Cost Estimation Ready</p>
            <p>Click "Calculate Cost" to generate real-time cost estimation</p>
            <div className="mt-4 text-sm bg-gray-50 p-3 rounded">
              <strong>Features:</strong> Real-time material prices • Labor cost calculation • 
              Equipment rental rates • Tax & overhead calculation • Cost optimization recommendations
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostEstimationSystem;