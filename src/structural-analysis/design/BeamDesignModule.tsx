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

interface BeamDesignProps {
  onDesignComplete: (element: Element) => void;
}

export const BeamDesignModule: React.FC<BeamDesignProps> = ({ onDesignComplete }) => {
  // Beam properties
  const [length, setLength] = useState<number>(5.0);
  const [load, setLoad] = useState<number>(20.0);
  const [supportType, setSupportType] = useState<'simple' | 'fixed' | 'cantilever'>('simple');
  const [materialType, setMaterialType] = useState<'concrete' | 'steel'>('concrete');
  const [sectionType, setSectionType] = useState<'rectangular' | 'i-section'>('rectangular');
  
  // Section dimensions
  const [width, setWidth] = useState<number>(0.3);
  const [height, setHeight] = useState<number>(0.5);
  const [flangeWidth, setFlangeWidth] = useState<number>(0.2);
  const [flangeThickness, setFlangeThickness] = useState<number>(0.02);
  const [webThickness, setWebThickness] = useState<number>(0.015);
  
  // Design results
  const [results, setResults] = useState<{
    moment: number;
    shear: number;
    deflection: number;
    stress: number;
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
      const area = width * height;
      const momentOfInertia = (width * Math.pow(height, 3)) / 12;
      const sectionModulus = momentOfInertia / (height / 2);
      return { area, momentOfInertia, sectionModulus };
    } else {
      // I-section properties
      const webArea = webThickness * (height - 2 * flangeThickness);
      const flangeArea = 2 * flangeWidth * flangeThickness;
      const area = webArea + flangeArea;
      
      const momentOfInertia = 
        (flangeWidth * Math.pow(height, 3) - (flangeWidth - webThickness) * Math.pow(height - 2 * flangeThickness, 3)) / 12;
      
      const sectionModulus = momentOfInertia / (height / 2);
      
      return { area, momentOfInertia, sectionModulus };
    }
  };

  // Perform beam design calculation
  const calculateBeam = () => {
    // Calculate maximum moment based on support type
    let maxMoment: number;
    let maxShear: number;
    let maxDeflection: number;
    
    switch (supportType) {
      case 'simple':
        maxMoment = (load * Math.pow(length, 2)) / 8;
        maxShear = load * length / 2;
        maxDeflection = (5 * load * Math.pow(length, 4)) / (384 * materialProps[materialType].modulus * calculateSectionProperties().momentOfInertia * 1000);
        break;
      case 'fixed':
        maxMoment = (load * Math.pow(length, 2)) / 24;
        maxShear = load * length / 2;
        maxDeflection = (load * Math.pow(length, 4)) / (384 * materialProps[materialType].modulus * calculateSectionProperties().momentOfInertia * 1000);
        break;
      case 'cantilever':
        maxMoment = (load * Math.pow(length, 2)) / 2;
        maxShear = load * length;
        maxDeflection = (load * Math.pow(length, 4)) / (8 * materialProps[materialType].modulus * calculateSectionProperties().momentOfInertia * 1000);
        break;
      default:
        maxMoment = 0;
        maxShear = 0;
        maxDeflection = 0;
    }
    
    const sectionProps = calculateSectionProperties();
    const maxStress = (maxMoment * 1000) / sectionProps.sectionModulus; // Convert kN·m to N·mm
    const allowableStress = materialType === 'concrete' 
      ? materialProps.concrete.strength * 0.6 // Use 60% of concrete strength for safety
      : materialProps.steel.strength * 0.6; // Use 60% of steel strength for safety
    
    const isSafe = maxStress < allowableStress && maxDeflection < (length * 1000) / 250; // L/250 deflection limit
    
    let message = '';
    if (!isSafe) {
      if (maxStress >= allowableStress) {
        message = 'Stress exceeds allowable limit. Consider increasing section size or using stronger material.';
      } else if (maxDeflection >= (length * 1000) / 250) {
        message = 'Deflection exceeds allowable limit (L/250). Consider increasing section stiffness.';
      }
    } else {
      message = 'Design is safe according to basic checks.';
    }
    
    setResults({
      moment: maxMoment,
      shear: maxShear,
      deflection: maxDeflection * 1000, // Convert to mm
      stress: maxStress,
      isSafe,
      message
    });
  };

  // Reset form
  const resetForm = () => {
    setLength(5.0);
    setLoad(20.0);
    setSupportType('simple');
    setMaterialType('concrete');
    setSectionType('rectangular');
    setWidth(0.3);
    setHeight(0.5);
    setFlangeWidth(0.2);
    setFlangeThickness(0.02);
    setWebThickness(0.015);
    setResults(null);
  };

  // Create beam element
  const createBeamElement = (): Element => {
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
      id: `beam-${sectionType}`,
      name: `${sectionType} section`,
      type: sectionType === 'rectangular' ? 'rectangular' : 'i-section',
      width: width,
      height: height,
      color: '#94a3b8'
    };
    
    return {
      id: 'beam-1',
      type: 'beam',
      nodes: ['node-1', 'node-2'],
      material,
      section,
      stress: results ? results.stress : 0
    };
  };

  // Handle design completion
  const handleDesignComplete = () => {
    if (results && results.isSafe) {
      const element = createBeamElement();
      onDesignComplete(element);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <CardTitle>Beam Design Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Parameters */}
              <div className="space-y-4">
                <h3 className="font-medium">Basic Parameters</h3>
                
                <div className="space-y-2">
                  <Label>Beam Length (m)</Label>
                  <Slider
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                    max={20}
                    min={1}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm">
                    <span>1m</span>
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    />
                    <span>20m</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Uniform Load (kN/m)</Label>
                  <Slider
                    value={[load]}
                    onValueChange={(value) => setLoad(value[0])}
                    max={100}
                    min={1}
                    step={1}
                  />
                  <div className="flex justify-between text-sm">
                    <span>1 kN/m</span>
                    <Input
                      type="number"
                      value={load}
                      onChange={(e) => setLoad(parseFloat(e.target.value) || 0)}
                    />
                    <span>100 kN/m</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Support Type</Label>
                  <Select value={supportType} onValueChange={(value: string) => setSupportType(value as 'simple' | 'fixed' | 'cantilever')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simply Supported</SelectItem>
                      <SelectItem value="fixed">Fixed/Fixed</SelectItem>
                      <SelectItem value="cantilever">Cantilever</SelectItem>
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
                  <Select value={sectionType} onValueChange={(value: string) => setSectionType(value as 'rectangular' | 'i-section')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangular">Rectangular</SelectItem>
                      <SelectItem value="i-section">I-Section</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {sectionType === 'rectangular' ? (
                  <>
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
                        <Label>Height (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={height}
                          onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Flange Width (m)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={flangeWidth}
                          onChange={(e) => setFlangeWidth(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Flange Thickness (m)</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={flangeThickness}
                          onChange={(e) => setFlangeThickness(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Web Thickness (m)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={webThickness}
                        onChange={(e) => setWebThickness(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (m)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={height}
                        onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                      />
                    </div>
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
                    <Label>Deflection Limit</Label>
                    <Select value="250" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="180">L/180</SelectItem>
                        <SelectItem value="250">L/250</SelectItem>
                        <SelectItem value="360">L/360</SelectItem>
                        <SelectItem value="500">L/500</SelectItem>
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
              <Button onClick={calculateBeam}>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="text-sm text-gray-500">Max Stress</div>
                  <div className="text-xl font-bold">{results.stress.toFixed(2)} MPa</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-500" />
                <span>
                  Allowable stress: {(materialType === 'concrete' 
                    ? materialProps.concrete.strength * 0.6 
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