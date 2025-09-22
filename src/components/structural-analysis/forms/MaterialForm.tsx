import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { SimpleSelect } from '../../ui/simple-select';
import { MaterialProperties } from '../interfaces';

interface MaterialFormProps {
  data: MaterialProperties;
  onChange: (data: MaterialProperties) => void;
  errors?: string[];
}

export const MaterialForm: React.FC<MaterialFormProps> = ({ data, onChange, errors = [] }) => {
  const handleInputChange = (field: keyof MaterialProperties, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numericValue });
  };

  const handleSelectChange = (field: keyof MaterialProperties, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const concreteGrades = [
    { value: 'K-175', label: 'K-175 (fc = 14.53 MPa)' },
    { value: 'K-200', label: 'K-200 (fc = 16.60 MPa)' },
    { value: 'K-225', label: 'K-225 (fc = 18.68 MPa)' },
    { value: 'K-250', label: 'K-250 (fc = 20.75 MPa)' },
    { value: 'K-300', label: 'K-300 (fc = 24.90 MPa)' },
    { value: 'K-350', label: 'K-350 (fc = 29.05 MPa)' },
    { value: 'K-400', label: 'K-400 (fc = 33.20 MPa)' },
    { value: 'K-450', label: 'K-450 (fc = 37.35 MPa)' },
    { value: 'K-500', label: 'K-500 (fc = 41.50 MPa)' }
  ];

  const steelGrades = [
    { value: 'BJ-34', label: 'BJ-34 (fy = 210 MPa)' },
    { value: 'BJ-37', label: 'BJ-37 (fy = 240 MPa)' },
    { value: 'BJ-41', label: 'BJ-41 (fy = 250 MPa)' },
    { value: 'BJ-50', label: 'BJ-50 (fy = 290 MPa)' },
    { value: 'BJ-55', label: 'BJ-55 (fy = 410 MPa)' }
  ];

  const rebarGrades = [
    { value: 'BJTP-24', label: 'BJTP-24 (fy = 240 MPa)' },
    { value: 'BJTS-35', label: 'BJTS-35 (fy = 350 MPa)' },
    { value: 'BJTS-40', label: 'BJTS-40 (fy = 400 MPa)' },
    { value: 'BJTS-50', label: 'BJTS-50 (fy = 500 MPa)' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properti Material</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Material Beton */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Material Beton</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="concreteGrade">Mutu Beton *</Label>
              <SimpleSelect
                value={data.concreteGrade || 'K-250'}
                onChange={(value: string) => handleSelectChange('concreteGrade', value)}
                options={concreteGrades}
                placeholder="Pilih mutu beton"
                className={errors.some(e => e.includes('Mutu beton')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Sesuai SNI 2847</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fc">Kuat Tekan Beton (fc) MPa *</Label>
              <Input
                id="fc"
                type="number"
                value={data.fc.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fc', e.target.value)}
                placeholder="20.75"
                min="10"
                max="100"
                step="0.1"
                className={errors.some(e => e.includes('Kuat tekan beton')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Min: 10 MPa, Max: 100 MPa</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Ec">Modulus Elastisitas Beton (Ec) MPa</Label>
              <Input
                id="Ec"
                type="number"
                value={(data.Ec || 4700 * Math.sqrt(data.fc)).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('Ec', e.target.value)}
                placeholder={`${Math.round(4700 * Math.sqrt(data.fc))}`}
                min="15000"
                max="50000"
                step="100"
              />
              <div className="text-xs text-gray-500">Auto: 4700√fc</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gammaConcrete">Berat Jenis Beton (γc) kN/m³</Label>
              <Input
                id="gammaConcrete"
                type="number"
                value={(data.gammaConcrete || 24).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('gammaConcrete', e.target.value)}
                placeholder="24"
                min="20"
                max="30"
                step="0.1"
              />
              <div className="text-xs text-gray-500">Normal: 24 kN/m³</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poissonConcrete">Poisson Ratio Beton</Label>
              <Input
                id="poissonConcrete"
                type="number"
                value={(data.poissonConcrete || 0.2).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('poissonConcrete', e.target.value)}
                placeholder="0.2"
                min="0.1"
                max="0.3"
                step="0.01"
              />
              <div className="text-xs text-gray-500">Standar: 0.2</div>
            </div>
          </div>
        </div>

        {/* Material Baja Struktural */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Material Baja Struktural</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steelGrade">Mutu Baja Struktural *</Label>
              <SimpleSelect
                value={data.steelGrade || 'BJ-37'}
                onChange={(value: string) => handleSelectChange('steelGrade', value)}
                options={steelGrades}
                placeholder="Pilih mutu baja struktural"
              />
              <div className="text-xs text-gray-500">Sesuai SNI 1729</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fy">Tegangan Leleh Baja (fy) MPa *</Label>
              <Input
                id="fy"
                type="number"
                value={data.fy.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fy', e.target.value)}
                placeholder="240"
                min="200"
                max="500"
                step="10"
                className={errors.some(e => e.includes('Tegangan leleh baja')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Min: 200 MPa, Max: 500 MPa</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Es">Modulus Elastisitas Baja (Es) MPa</Label>
              <Input
                id="Es"
                type="number"
                value={(data.Es || 200000).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('Es', e.target.value)}
                placeholder="200000"
                min="200000"
                max="210000"
                step="1000"
              />
              <div className="text-xs text-gray-500">Standar: 200000 MPa</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gammaSteel">Berat Jenis Baja (γs) kN/m³</Label>
              <Input
                id="gammaSteel"
                type="number"
                value={(data.gammaSteel || 78.5).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('gammaSteel', e.target.value)}
                placeholder="78.5"
                min="75"
                max="85"
                step="0.1"
              />
              <div className="text-xs text-gray-500">Standar: 78.5 kN/m³</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poissonSteel">Poisson Ratio Baja</Label>
              <Input
                id="poissonSteel"
                type="number"
                value={(data.poissonSteel || 0.3).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('poissonSteel', e.target.value)}
                placeholder="0.3"
                min="0.25"
                max="0.35"
                step="0.01"
              />
              <div className="text-xs text-gray-500">Standar: 0.3</div>
            </div>
          </div>
        </div>

        {/* Material Tulangan */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Material Tulangan</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rebarGrade">Mutu Tulangan *</Label>
              <SimpleSelect
                value={data.rebarGrade || 'BJTS-40'}
                onChange={(value: string) => handleSelectChange('rebarGrade', value)}
                options={rebarGrades}
                placeholder="Pilih mutu tulangan"
              />
              <div className="text-xs text-gray-500">Sesuai SNI 2052</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fyRebar">Tegangan Leleh Tulangan (fy) MPa *</Label>
              <Input
                id="fyRebar"
                type="number"
                value={(data.fyRebar || 400).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fyRebar', e.target.value)}
                placeholder="400"
                min="240"
                max="500"
                step="10"
                className={errors.some(e => e.includes('Tegangan leleh tulangan')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Min: 240 MPa, Max: 500 MPa</div>
            </div>
          </div>
        </div>

        {/* Faktor Keamanan */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Faktor Keamanan (Sesuai SNI)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phiConcrete">φ Beton (Tekan)</Label>
              <Input
                id="phiConcrete"
                type="number"
                value={(data.phiConcrete || 0.65).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phiConcrete', e.target.value)}
                placeholder="0.65"
                min="0.5"
                max="0.9"
                step="0.05"
              />
              <div className="text-xs text-gray-500">SNI: 0.65</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phiTension">φ Tarik (Lentur)</Label>
              <Input
                id="phiTension"
                type="number"
                value={(data.phiTension || 0.9).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phiTension', e.target.value)}
                placeholder="0.9"
                min="0.7"
                max="0.95"
                step="0.05"
              />
              <div className="text-xs text-gray-500">SNI: 0.9</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phiShear">φ Geser</Label>
              <Input
                id="phiShear"
                type="number"
                value={(data.phiShear || 0.75).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phiShear', e.target.value)}
                placeholder="0.75"
                min="0.6"
                max="0.85"
                step="0.05"
              />
              <div className="text-xs text-gray-500">SNI: 0.75</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phiTorsion">φ Torsi</Label>
              <Input
                id="phiTorsion"
                type="number"
                value={(data.phiTorsion || 0.75).toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phiTorsion', e.target.value)}
                placeholder="0.75"
                min="0.6"
                max="0.85"
                step="0.05"
              />
              <div className="text-xs text-gray-500">SNI: 0.75</div>
            </div>
          </div>
        </div>

        {/* Informasi Kalkulasi */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="text-sm font-medium text-green-800 mb-2">Informasi Material:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <span className="font-medium">Rasio Modulus (n = Es/Ec):</span>
              <div>{((data.Es || data.es) / (data.Ec || data.ec || 4700 * Math.sqrt(data.fc))).toFixed(1)}</div>
            </div>
            <div>
              <span className="font-medium">Regangan Ultimate Beton:</span>
              <div>0.003</div>
            </div>
            <div>
              <span className="font-medium">Regangan Leleh Baja:</span>
              <div>{(data.fy / (data.Es || data.es)).toFixed(6)}</div>
            </div>
            <div>
              <span className="font-medium">Rasio Balanced (ρb):</span>
              <div>{(0.85 * data.fc / data.fy * 0.003 / (0.003 + data.fy / (data.Es || data.es))).toFixed(4)}</div>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Kesalahan Input:</h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.filter(e => e.includes('Material')).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};