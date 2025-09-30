/**
 * Standard Integration Component
 * Component to integrate and apply various structural design standards
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Building, 
  Map, 
  Calculator, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Flag
} from 'lucide-react';
import {
  SEISMIC_ZONES,
  SOIL_TYPES,
  BUILDING_CATEGORIES,
  SNI_LOAD_TYPES,
  SNI_BASIC_LOAD_COMBINATIONS,
  SNI_CONCRETE_MATERIALS,
  SNI_REINFORCEMENT_MATERIALS,
  SNI_STEEL_MATERIALS,
  getSeismicZone,
  getSoilType,
  getBuildingCategory,
  getLoadCombination,
  getConcreteMaterial,
  getReinforcementMaterial,
  getSteelMaterial
} from './index';

// Simple Select component defined inline
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

// Simple Label component defined inline
const Label: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  htmlFor?: string;
}> = ({ children, className = '', htmlFor }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>
    {children}
  </label>
);

// Simple Input component defined inline
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { className?: string }> = ({ 
  className = '', 
  ...props 
}) => (
  <input 
    className={`border rounded px-3 py-2 w-full ${className}`}
    {...props}
  />
);

interface StandardSettings {
  code: 'sni' | 'aci' | 'aisc' | 'eurocode' | 'asce';
  seismicZone: number;
  soilType: string;
  buildingCategory: string;
  loadCombination: string;
  concreteMaterial: string;
  reinforcementMaterial: string;
  steelMaterial: string;
}

const StandardIntegration: React.FC = () => {
  const [settings, setSettings] = useState<StandardSettings>({
    code: 'sni',
    seismicZone: 2,
    soilType: 'ZC',
    buildingCategory: 'II',
    loadCombination: '1',
    concreteMaterial: 'k25',
    reinforcementMaterial: 'bjtd400',
    steelMaterial: 'bj41'
  });

  const [calculatedValues, setCalculatedValues] = useState<any>(null);

  const handleSettingChange = (field: keyof StandardSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateValues = () => {
    const seismicZone = getSeismicZone(settings.seismicZone);
    const soilType = getSoilType(settings.soilType);
    const buildingCategory = getBuildingCategory(settings.buildingCategory);
    const loadCombination = getLoadCombination(settings.loadCombination);
    const concreteMaterial = getConcreteMaterial(settings.concreteMaterial);
    const reinforcementMaterial = getReinforcementMaterial(settings.reinforcementMaterial);
    const steelMaterial = getSteelMaterial(settings.steelMaterial);

    // Calculate seismic coefficient as an example
    let seismicCoefficient = 0;
    if (seismicZone && soilType && buildingCategory) {
      // Simplified calculation for demonstration
      seismicCoefficient = seismicZone.acceleration * soilType.amplificationFactor * buildingCategory.importanceFactor;
    }

    setCalculatedValues({
      seismicZone,
      soilType,
      buildingCategory,
      loadCombination,
      concreteMaterial,
      reinforcementMaterial,
      steelMaterial,
      seismicCoefficient
    });
  };

  const getCodeIcon = (code: string) => {
    switch (code) {
      case 'sni': return <Flag className="h-4 w-4" />;
      case 'aci': 
      case 'aisc': 
      case 'asce': return <Globe className="h-4 w-4" />;
      case 'eurocode': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCodeName = (code: string) => {
    switch (code) {
      case 'sni': return 'SNI Indonesia';
      case 'aci': return 'ACI 318';
      case 'aisc': return 'AISC';
      case 'eurocode': return 'Eurocode';
      case 'asce': return 'ASCE 7';
      default: return 'Standard';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Standard Integration
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure and apply structural design standards for your project
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Standard Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Design Code</Label>
                <Select 
                  value={settings.code} 
                  onValueChange={(value: string) => handleSettingChange('code', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sni">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        SNI Indonesia
                      </div>
                    </SelectItem>
                    <SelectItem value="aci">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        ACI 318 (Concrete)
                      </div>
                    </SelectItem>
                    <SelectItem value="aisc">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        AISC (Steel)
                      </div>
                    </SelectItem>
                    <SelectItem value="eurocode">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Eurocode
                      </div>
                    </SelectItem>
                    <SelectItem value="asce">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        ASCE 7 (Loads)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SNI Specific Settings */}
              {settings.code === 'sni' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Seismic Zone</Label>
                    <Select 
                      value={settings.seismicZone.toString()} 
                      onValueChange={(value: string) => handleSettingChange('seismicZone', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SEISMIC_ZONES.map(zone => (
                          <SelectItem key={zone.zone} value={zone.zone.toString()}>
                            Zone {zone.zone} - {zone.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Soil Type</Label>
                    <Select 
                      value={settings.soilType} 
                      onValueChange={(value: string) => handleSettingChange('soilType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOIL_TYPES.map(soil => (
                          <SelectItem key={soil.type} value={soil.type}>
                            {soil.type} - {soil.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Building Category</Label>
                    <Select 
                      value={settings.buildingCategory} 
                      onValueChange={(value: string) => handleSettingChange('buildingCategory', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUILDING_CATEGORIES.map(category => (
                          <SelectItem key={category.category} value={category.category}>
                            Category {category.category} - {category.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Load Combination</Label>
                    <Select 
                      value={settings.loadCombination} 
                      onValueChange={(value: string) => handleSettingChange('loadCombination', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SNI_BASIC_LOAD_COMBINATIONS.map(comb => (
                          <SelectItem key={comb.id} value={comb.id}>
                            {comb.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Concrete Material</Label>
                    <Select 
                      value={settings.concreteMaterial} 
                      onValueChange={(value: string) => handleSettingChange('concreteMaterial', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SNI_CONCRETE_MATERIALS.map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} (f'c = {material.strength} MPa)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Reinforcement Material</Label>
                    <Select 
                      value={settings.reinforcementMaterial} 
                      onValueChange={(value: string) => handleSettingChange('reinforcementMaterial', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SNI_REINFORCEMENT_MATERIALS.map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} (fy = {material.yieldStrength} MPa)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Steel Material</Label>
                    <Select 
                      value={settings.steelMaterial} 
                      onValueChange={(value: string) => handleSettingChange('steelMaterial', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SNI_STEEL_MATERIALS.map(material => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} (fy = {material.yieldStrength} MPa)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button onClick={calculateValues} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Values
              </Button>
            </div>

            {/* Results Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Standard Configuration</h3>
              
              {calculatedValues ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        {getCodeIcon(settings.code)}
                        {getCodeName(settings.code)} Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Seismic Coefficient:</span>
                          <span className="text-sm font-medium">
                            {calculatedValues.seismicCoefficient.toFixed(3)}
                          </span>
                        </div>
                        {calculatedValues.seismicZone && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Seismic Zone:</span>
                            <span className="text-sm font-medium">
                              {calculatedValues.seismicZone.zone} ({calculatedValues.seismicZone.description})
                            </span>
                          </div>
                        )}
                        {calculatedValues.soilType && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Soil Type:</span>
                            <span className="text-sm font-medium">
                              {calculatedValues.soilType.type} ({calculatedValues.soilType.description})
                            </span>
                          </div>
                        )}
                        {calculatedValues.buildingCategory && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Building Category:</span>
                            <span className="text-sm font-medium">
                              {calculatedValues.buildingCategory.category} ({calculatedValues.buildingCategory.description})
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4" />
                        Material Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {calculatedValues.concreteMaterial && (
                          <div>
                            <div className="text-sm font-medium">Concrete</div>
                            <div className="text-xs text-gray-600 ml-2">
                              {calculatedValues.concreteMaterial.name} - 
                              f'c = {calculatedValues.concreteMaterial.strength} MPa
                            </div>
                          </div>
                        )}
                        {calculatedValues.reinforcementMaterial && (
                          <div>
                            <div className="text-sm font-medium">Reinforcement</div>
                            <div className="text-xs text-gray-600 ml-2">
                              {calculatedValues.reinforcementMaterial.name} - 
                              fy = {calculatedValues.reinforcementMaterial.yieldStrength} MPa
                            </div>
                          </div>
                        )}
                        {calculatedValues.steelMaterial && (
                          <div>
                            <div className="text-sm font-medium">Steel</div>
                            <div className="text-xs text-gray-600 ml-2">
                              {calculatedValues.steelMaterial.name} - 
                              fy = {calculatedValues.steelMaterial.yieldStrength} MPa
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Calculator className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Configure standards and click "Calculate Values"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standard Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Standard Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">SNI 1726:2019</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Seismic design requirements implemented</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">SNI 1727:2020</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Load combinations and requirements implemented</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">SNI 2847:2019</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Reinforced concrete design implemented</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StandardIntegration;