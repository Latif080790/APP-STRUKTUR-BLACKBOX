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

interface ColumnDesignProps {
  onDesignComplete: (element: Element) => void;
}

export const ColumnDesignModule: React.FC<ColumnDesignProps> = ({ onDesignComplete }) => {
  // Column properties
  const [height, setHeight] = useState<number>(3.5);
  const [axialLoad, setAxialLoad] = useState<number>(500);
  const [momentX, setMomentX] = useState<number>(20);
  const [momentY, setMomentY] = useState<number>(15);
  const [endCondition, setEndCondition] = useState<'pinned' | 'fixed'>('pinned');
  const [materialType, setMaterialType] = useState<'concrete' | 'steel'>('concrete');
  const [sectionType, setSectionType] = useState<'rectangular' | 'circular' | 'i-section'>('rectangular');
  
  // Section dimensions
  const [width, setWidth] = useState<number>(0.4);
  const [depth, setDepth] = useState<number>(0.4);
  const [diameter, setDiameter] = useState<number>(0.4);
  
  // Design results
  const [results, setResults] = useState<{
    axialStress: number;
    bendingStressX: number;
    bendingStressY: number;
    slenderness: number;
    isSafe: boolean;
    message: string;
  } | null>(null);
  
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Material properties (in MPa)
  const materialProps = {
    concrete: { strength: 25, modulus: 25000 },
    steel: { strength: 250, modulus: 200000 }
  };

  // Calculate section properties
  const calculateSectionProperties = () => {
    if (sectionType === 'rectangular') {
      const area = width * depth;
      const momentOfInertiaX = (width * Math.pow(depth, 3)) / 12;
      const momentOfInertiaY = (depth * Math.pow(width, 3)) / 12;
      const radiusOfGyration = Math.sqrt(momentOfInertiaX / area);
      return { area, momentOfInertiaX, momentOfInertiaY, radiusOfGyration };
    } else if (sectionType === 'circular') {
      const area = Math.PI * Math.pow(diameter / 2, 2);
      const momentOfInertia = (Math.PI * Math.pow(diameter, 4)) / 64;
      const radiusOfGyration = diameter / 4;
      return { area, momentOfInertiaX: momentOfInertia, momentOfInertiaY: momentOfInertia, radiusOfGyration };
    } else {
      // I-section properties (simplified)
      const flangeArea = 0.2 * 0.02 * 2; // 200mm x 20mm flanges
      const webArea = 0.36 * 0.015; // 360mm x 15mm web
      const area = flangeArea + webArea;
      const momentOfInertiaX = (0.2 * Math.pow(0.4, 3) - (0.2 - 0.015) * Math.pow(0.36, 3)) / 12;
      const momentOfInertiaY = (0.02 * Math.pow(0.2, 3) * 2 + 0.36 * Math.pow(0.015, 3)) / 12;
      const radiusOfGyration = Math.sqrt(momentOfInertiaX / area);
      return { area, momentOfInertiaX, momentOfInertiaY, radiusOfGyration };
    }
  };

  // Perform column design calculation
  const calculateColumn = () => {
    const sectionProps = calculateSectionProperties();
    
    // Axial stress
    const axialStress = (axialLoad * 1000) / (sectionProps.area * 1000000); // Convert kN to N, mm² to m²
    
    // Bending stresses
    const bendingStressX = (momentX * 1000000) / (sectionProps.momentOfInertiaX * 1000000000) * (depth / 2 * 1000); // Convert kN·m to N·mm, mm⁴ to m⁴
    const bendingStressY = (momentY * 1000000) / (sectionProps.momentOfInertiaY * 1000000000) * (width / 2 * 1000);
    
    // Slenderness ratio
    const effectiveLength = endCondition === 'pinned' ? height : 0.8 * height; // Effective length factor
    const slenderness = (effectiveLength * 1000) / (sectionProps.radiusOfGyration * 1000); // Convert to mm
    
    // Check safety
    const allowableStress = materialType === 'concrete' 
      ? materialProps.concrete.strength * 0.4 // Use 40% of concrete strength for safety
      : materialProps.steel.strength * 0.6; // Use 60% of steel strength for safety
    
    const combinedStress = axialStress + Math.abs(bendingStressX) + Math.abs(bendingStressY);
    const isSafe = combinedStress < allowableStress && slenderness < 200; // Slenderness limit
    
    let message = '';
    if (!isSafe) {
      if (combinedStress >= allowableStress) {
        message = 'Combined stress exceeds allowable limit. Consider increasing section size or using stronger material.';
      } else if (slenderness >= 200) {
        message = 'Column is too slender (slenderness ratio > 200). Consider increasing section size or reducing height.';
      }
    } else {
      message = 'Design is safe according to basic checks.';
    }
    
    setResults({
      axialStress,
      bendingStressX,
      bendingStressY,
      slenderness,
      isSafe,
      message
    });
  };

  // Reset form
  const resetForm = () => {
    setHeight(3.5);
    setAxialLoad(500);
    setMomentX(20);
    setMomentY(15);
    setEndCondition('pinned');
    setMaterialType('concrete');
    setSectionType('rectangular');
    setWidth(0.4);
    setDepth(0.4);
    setDiameter(0.4);
    setResults(null);
  };

  // Create column element
  const createColumnElement = (): Element => {
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
      id: `column-${sectionType}`,
      name: `${sectionType} section`,
      type: sectionType === 'rectangular' ? 'rectangular' : sectionType === 'circular' ? 'circular' : 'i-section',
      width: sectionType === 'circular' ? diameter : width,
      height: sectionType === 'circular' ? diameter : depth,
      color: '#94a3b8'
    };
    
    return {
      id: 'column-1',
      type: 'column',
      nodes: ['node-1', 'node-2'],
      material,
      section,
      stress: results ? results.axialStress : 0
    };
  };

  // Handle design completion
  const handleDesignComplete = () => {
    if (results && results.isSafe) {
      const element = createColumnElement();
      onDesignComplete(element);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Column Design Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Parameters */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Parameters</h3>
                
                <div className="space-y-2">
                  <Label>Column Height (m)</Label>
                  <Slider
                    value={[height]}
                    onValueChange={(value) => setHeight(value[0])}
                    max={10}
                    min={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm">
                    <span>1m</span>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    />
                    <span>10m</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Axial Load (kN)</Label>
                  <Slider
                    value={[axialLoad]}
                    onValueChange={(value) => setAxialLoad(value[0])}
                    max={2000}
                    min={10}
                    step={10}
                  />
                  <div className="flex justify-between text-sm">
                    <span>10 kN</span>
                    <Input
                      type="number"
                      value={axialLoad}
                      onChange={(e) => setAxialLoad(parseFloat(e.target.value) || 0)}
                    />
                    <span>2000 kN</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Moment X (kN·m)</Label>
                    <Input
                      type="number"
                      value={momentX}
                      onChange={(e) => setMomentX(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Moment Y (kN·m)</Label>
                    <Input
                      type="number"
                      value={momentY}
                      onChange={(e) => setMomentY(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>End Condition</Label>
                  <Select value={endCondition} onValueChange={(value: string) => setEndCondition(value as 'pinned' | 'fixed')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pinned">Pinned-Pinned</SelectItem>
                      <SelectItem value="fixed">Fixed-Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Material & Section */}
              <div className="space-y-4">
                <h3 className="font-medium">Material & Section</h3>
                
                <div className="space-y-2">
                  <Label>Material Type</Label>
                  <Select value={materialType} onValueChange={(value: string) => setMaterialType(value as 'concrete' | 'steel')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concrete">Concrete (25 MPa)</SelectItem>
                      <SelectItem value="steel">Steel (250 MPa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Section Type</Label>
                  <Select value={sectionType} onValueChange={(value: string) => setSectionType(value as 'rectangular' | 'circular' | 'i-section')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangular">Rectangular</SelectItem>
                      <SelectItem value="circular">Circular</SelectItem>
                      <SelectItem value="i-section">I-Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {sectionType === 'rectangular' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Width (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={width}
                        onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Depth (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={depth}
                        onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ) : sectionType === 'circular' ? (
                  <div className="space-y-2">
                    <Label>Diameter (m)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={diameter}
                      onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    I-Section dimensions are predefined for this calculator.
                  </div>
                )}
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
                    <Label>Slenderness Limit</Label>
                    <Select value="200" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="150">150</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="250">250</SelectItem>
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
              <Button onClick={calculateColumn}>
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
                  <div className="text-sm text-gray-500">Axial Stress</div>
                  <div className="text-xl font-bold">{results.axialStress.toFixed(2)} MPa</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Bending X</div>
                  <div className="text-xl font-bold">{results.bendingStressX.toFixed(2)} MPa</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Bending Y</div>
                  <div className="text-xl font-bold">{results.bendingStressY.toFixed(2)} MPa</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Slenderness</div>
                  <div className="text-xl font-bold">{results.slenderness.toFixed(1)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-500">Combined</div>
                  <div className="text-xl font-bold">
                    {(results.axialStress + Math.abs(results.bendingStressX) + Math.abs(results.bendingStressY)).toFixed(2)} MPa
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-500" />
                <span>
                  Allowable stress: {(materialType === 'concrete' 
                    ? materialProps.concrete.strength * 0.4 
                    : materialProps.steel.strength * 0.6).toFixed(1)} MPa
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};