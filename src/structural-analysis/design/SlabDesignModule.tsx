import React, { useState } from 'react';
import { Element, Section, Material } from '@/types/structural';

// Simple UI components
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border rounded-lg shadow-sm">{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-b p-4">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold">{children}</h3>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4">{children}</div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    className="border rounded px-3 py-2 w-full" 
    {...props} 
  />
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">{children}</label>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'default' | 'outline';
}> = ({ children, onClick, variant = 'default' }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      variant === 'outline' 
        ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
    }`}
  >
    {children}
  </button>
);

const Select: React.FC<{ 
  value: string; 
  onValueChange: (value: string) => void; 
  children: React.ReactNode 
}> = ({ value, onValueChange, children }) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onValueChange(e.target.value)}
      className="border rounded px-3 py-2 w-full appearance-none bg-white"
    >
      {children}
    </select>
  </div>
);

const SelectTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const SelectValue: React.FC = () => null;

const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const Slider: React.FC<{ 
  value: number[]; 
  onValueChange: (value: number[]) => void; 
  max: number; 
  min: number; 
  step: number 
}> = ({ value, onValueChange, max, min, step }) => (
  <input 
    type="range" 
    min={min} 
    max={max} 
    step={step} 
    value={value[0]} 
    onChange={(e) => onValueChange([parseFloat(e.target.value)])}
    className="w-full"
  />
);

const Switch: React.FC<{ 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}> = ({ checked, onCheckedChange, id }) => (
  <input 
    type="checkbox" 
    id={id}
    checked={checked} 
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="rounded"
  />
);

const Alert: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'default' | 'destructive';
}> = ({ children, variant = 'default' }) => (
  <div className={`p-4 rounded ${
    variant === 'destructive' 
      ? 'bg-red-50 border border-red-200 text-red-800' 
      : 'bg-blue-50 border border-blue-200'
  }`}>
    {children}
  </div>
);

const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

// Icons
const Calculator: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const AlertTriangle: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircle: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Info: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RotateCcw: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface SlabDesignProps {
  onDesignComplete: (element: Element) => void;
}

export const SlabDesignModule: React.FC<SlabDesignProps> = ({ onDesignComplete }) => {
  // Slab properties
  const [length, setLength] = useState<number>(6.0);
  const [width, setWidth] = useState<number>(4.0);
  const [thickness, setThickness] = useState<number>(0.2);
  const [load, setLoad] = useState<number>(10.0);
  const [supportType, setSupportType] = useState<'fourSides' | 'twoSides' | 'cantilever'>('fourSides');
  const [materialType, setMaterialType] = useState<'concrete' | 'steel'>('concrete');
  const [reinforcementType, setReinforcementType] = useState<'main' | 'secondary'>('main');
  
  // Design results
  const [results, setResults] = useState<{
    moment: number;
    shear: number;
    deflection: number;
    requiredSteel: number;
    stress: number;
    isSafe: boolean;
    message: string;
  } | null>(null);
  
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Material properties (in MPa)
  const materialProps = {
    concrete: { strength: 25, modulus: 25000 },
    steel: { strength: 400, modulus: 200000 }
  };

  // Calculate slab design
  const calculateSlab = () => {
    // Calculate maximum moment based on support type
    let maxMoment: number;
    let maxShear: number;
    let maxDeflection: number;
    
    // Convert thickness to mm for calculations
    const thicknessMM = thickness * 1000;
    
    switch (supportType) {
      case 'fourSides':
        // Four sides supported - use coefficient method
        const mCoeff = Math.min(length, width) / Math.max(length, width);
        const coeff = mCoeff <= 1 ? 0.042 * Math.pow(mCoeff, 2) + 0.032 * mCoeff + 0.02 : 0.02;
        maxMoment = coeff * load * Math.pow(Math.min(length, width), 2);
        maxShear = load * Math.min(length, width) / 2;
        maxDeflection = (coeff * load * Math.pow(Math.min(length, width), 4) * 1000) / 
          (materialProps.concrete.modulus * (Math.pow(thicknessMM, 3) / 12));
        break;
      case 'twoSides':
        // Two sides supported (beam action)
        maxMoment = (load * Math.pow(Math.max(length, width), 2)) / 8;
        maxShear = load * Math.max(length, width) / 2;
        maxDeflection = (5 * load * Math.pow(Math.max(length, width), 4) * 1000) / 
          (384 * materialProps.concrete.modulus * (Math.pow(thicknessMM, 3) / 12));
        break;
      case 'cantilever':
        // Cantilever slab
        const cantileverLength = Math.max(length, width);
        maxMoment = (load * Math.pow(cantileverLength, 2)) / 2;
        maxShear = load * cantileverLength;
        maxDeflection = (load * Math.pow(cantileverLength, 4) * 1000) / 
          (8 * materialProps.concrete.modulus * (Math.pow(thicknessMM, 3) / 12));
        break;
      default:
        maxMoment = 0;
        maxShear = 0;
        maxDeflection = 0;
    }
    
    // Required steel reinforcement (simplified)
    const effectiveDepth = thicknessMM - 25; // Assume 25mm cover
    const requiredSteel = (maxMoment * 1000000) / (0.87 * materialProps.steel.strength * effectiveDepth);
    
    // Calculate stress
    const stress = maxMoment / (thickness * 1000 * Math.pow(thickness, 2) / 6); // Section modulus for 1m width
    
    // Check safety
    const allowableStress = materialProps.concrete.strength * 0.4; // Use 40% of concrete strength for safety
    const isSafe = stress < allowableStress && maxDeflection < (Math.min(length, width) * 1000) / 250; // L/250 deflection limit
    
    let message = '';
    if (!isSafe) {
      if (stress >= allowableStress) {
        message = 'Stress exceeds allowable limit. Consider increasing slab thickness.';
      } else if (maxDeflection >= (Math.min(length, width) * 1000) / 250) {
        message = 'Deflection exceeds allowable limit (L/250). Consider increasing slab thickness.';
      }
    } else {
      message = 'Design is safe according to basic checks.';
    }
    
    setResults({
      moment: maxMoment,
      shear: maxShear,
      deflection: maxDeflection,
      requiredSteel: requiredSteel / 1000, // Convert to cm²
      stress: stress,
      isSafe,
      message
    });
  };

  // Reset form
  const resetForm = () => {
    setLength(6.0);
    setWidth(4.0);
    setThickness(0.2);
    setLoad(10.0);
    setSupportType('fourSides');
    setMaterialType('concrete');
    setReinforcementType('main');
    setResults(null);
  };

  // Create slab element
  const createSlabElement = (): Element => {
    const material: Material = {
      id: materialType,
      name: materialType === 'concrete' ? 'Concrete' : 'Steel',
      type: materialType,
      density: materialType === 'concrete' ? 2400 : 7850,
      elasticModulus: materialProps[materialType].modulus * 1000, // Convert MPa to Pa
      yieldStrength: materialProps[materialType].strength * 1000000, // Convert MPa to Pa
      color: materialType === 'concrete' ? '#94a3b8' : '#64748b'
    };
    
    const section: Section = {
      id: 'slab-section',
      name: 'Slab section',
      type: 'rectangular',
      width: thickness, // Thickness as width for slab element
      height: 1.0, // Assume 1m width for analysis
      color: '#94a3b8'
    };
    
    return {
      id: 'slab-1',
      type: 'slab',
      nodes: ['node-1', 'node-2'], // Simplified to two nodes for slab element
      material,
      section,
      stress: results ? results.moment : 0
    };
  };

  // Handle design completion
  const handleDesignComplete = () => {
    if (results && results.isSafe) {
      const element = createSlabElement();
      onDesignComplete(element);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Slab Design Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Parameters */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Parameters</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Length (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Width (m)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Thickness (m)</Label>
                  <Slider
                    value={[thickness]}
                    onValueChange={(value) => setThickness(value[0])}
                    max={0.5}
                    min={0.1}
                    step={0.01}
                  />
                  <div className="flex justify-between text-sm">
                    <span>0.1m</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={thickness}
                      onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <span>0.5m</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Load (kN/m²)</Label>
                  <Slider
                    value={[load]}
                    onValueChange={(value) => setLoad(value[0])}
                    max={20}
                    min={2}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm">
                    <span>2 kN/m²</span>
                    <Input
                      type="number"
                      step="0.5"
                      value={load}
                      onChange={(e) => setLoad(parseFloat(e.target.value) || 0)}
                      className="w-20 text-center"
                    />
                    <span>20 kN/m²</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Support Type</Label>
                  <Select value={supportType} onValueChange={(value: string) => setSupportType(value as 'fourSides' | 'twoSides' | 'cantilever')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fourSides">Four Sides Supported</SelectItem>
                      <SelectItem value="twoSides">Two Sides Supported</SelectItem>
                      <SelectItem value="cantilever">Cantilever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Material & Reinforcement */}
              <div className="space-y-4">
                <h3 className="font-medium">Material & Reinforcement</h3>
                
                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <Select value={materialType} onValueChange={(value: string) => setMaterialType(value as 'concrete' | 'steel')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concrete">Concrete (25 MPa)</SelectItem>
                      <SelectItem value="steel">Steel (400 MPa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Reinforcement Type</Label>
                  <Select value={reinforcementType} onValueChange={(value: string) => setReinforcementType(value as 'main' | 'secondary')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Reinforcement</SelectItem>
                      <SelectItem value="secondary">Secondary Reinforcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Reinforcement Guidelines</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Main bars: 12-20mm diameter</li>
                    <li>• Spacing: 100-200mm</li>
                    <li>• Minimum reinforcement: 0.12% of area</li>
                    <li>• Cover: 20-40mm</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Advanced Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="advanced-mode"
                  checked={showAdvanced}
                  onCheckedChange={setShowAdvanced}
                />
                <Label htmlFor="advanced-mode">Advanced Options</Label>
              </div>
              <Button variant="outline" onClick={resetForm}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            {showAdvanced && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Advanced Design Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Load Factor</Label>
                    <Input type="number" defaultValue="1.4" />
                  </div>
                  <div>
                    <Label>Deflection Limit</Label>
                    <Select value="250" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="180">L/180</SelectItem>
                        <SelectItem value="250">L/250</SelectItem>
                        <SelectItem value="360">L/360</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Code Standard</Label>
                    <Select value="sni" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sni">SNI 2847:2019</SelectItem>
                        <SelectItem value="aci">ACI 318</SelectItem>
                        <SelectItem value="eurocode">Eurocode 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={calculateSlab}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              {results && results.isSafe && (
                <Button onClick={handleDesignComplete} variant="default">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Use This Design
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Design Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.isSafe ? (
                <Alert variant="default">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <AlertDescription>
                      <strong>Design is Safe</strong> - {results.message}
                    </AlertDescription>
                  </div>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <AlertDescription>
                      <strong>Design is Not Safe</strong> - {results.message}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Max Moment</div>
                  <div className="text-xl font-bold">{results.moment.toFixed(2)} kN·m</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Max Shear</div>
                  <div className="text-xl font-bold">{results.shear.toFixed(2)} kN</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Deflection</div>
                  <div className="text-xl font-bold">{results.deflection.toFixed(2)} mm</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Steel Required</div>
                  <div className="text-xl font-bold">{results.requiredSteel.toFixed(2)} cm²/m</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Stress</div>
                  <div className="text-xl font-bold">{results.stress.toFixed(2)} MPa</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-500" />
                <span>
                  Allowable stress: {(materialProps.concrete.strength * 0.4).toFixed(1)} MPa
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};