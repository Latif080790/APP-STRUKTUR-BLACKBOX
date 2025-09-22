import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Geometry } from '../interfaces';

interface GeometryFormProps {
  data: Geometry;
  onChange: (data: Geometry) => void;
  errors?: string[];
}

export const GeometryForm: React.FC<GeometryFormProps> = ({ data, onChange, errors = [] }) => {
  const handleInputChange = (field: keyof Geometry, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numericValue });
  };

  const totalArea = data.length * data.width;
  const totalHeight = data.heightPerFloor * data.numberOfFloors;
  const totalVolume = totalArea * totalHeight;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geometri Bangunan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dimensi Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="length">Panjang Bangunan (m) *</Label>
            <Input
              id="length"
              type="number"
              value={data.length.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('length', e.target.value)}
              placeholder="50"
              min="1"
              max="1000"
              step="0.1"
              className={errors.some(e => e.includes('Panjang bangunan')) ? 'border-red-500' : ''}
            />
            <div className="text-xs text-gray-500">Min: 1m, Max: 1000m</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Lebar Bangunan (m) *</Label>
            <Input
              id="width"
              type="number"
              value={data.width.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('width', e.target.value)}
              placeholder="30"
              min="1"
              max="1000"
              step="0.1"
              className={errors.some(e => e.includes('Lebar bangunan')) ? 'border-red-500' : ''}
            />
            <div className="text-xs text-gray-500">Min: 1m, Max: 1000m</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfFloors">Jumlah Lantai *</Label>
            <Input
              id="numberOfFloors"
              type="number"
              value={data.numberOfFloors.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('numberOfFloors', e.target.value)}
              placeholder="3"
              min="1"
              max="200"
              step="1"
              className={errors.some(e => e.includes('Jumlah lantai')) ? 'border-red-500' : ''}
            />
            <div className="text-xs text-gray-500">Min: 1, Max: 200</div>
          </div>
        </div>

        {/* Tinggi dan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heightPerFloor">Tinggi per Lantai (m) *</Label>
            <Input
              id="heightPerFloor"
              type="number"
              value={data.heightPerFloor.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('heightPerFloor', e.target.value)}
              placeholder="4"
              min="2.5"
              max="10"
              step="0.1"
              className={errors.some(e => e.includes('Tinggi per lantai')) ? 'border-red-500' : ''}
            />
            <div className="text-xs text-gray-500">Min: 2.5m, Max: 10m</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baySpacingX">Jarak Bentang X (m) *</Label>
            <Input
              id="baySpacingX"
              type="number"
              value={data.baySpacingX.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('baySpacingX', e.target.value)}
              placeholder="6"
              min="3"
              max="15"
              step="0.1"
            />
            <div className="text-xs text-gray-500">Jarak antar kolom arah X</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baySpacingY">Jarak Bentang Y (m) *</Label>
            <Input
              id="baySpacingY"
              type="number"
              value={data.baySpacingY.toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('baySpacingY', e.target.value)}
              placeholder="7.5"
              min="3"
              max="15"
              step="0.1"
            />
            <div className="text-xs text-gray-500">Jarak antar kolom arah Y</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="columnGridX">Grid Kolom X</Label>
            <Input
              id="columnGridX"
              type="number"
              value={(data.columnGridX || Math.ceil(data.length / data.baySpacingX)).toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('columnGridX', e.target.value)}
              placeholder="8"
              min="1"
              max="50"
              step="1"
            />
            <div className="text-xs text-gray-500">Jumlah grid arah X</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="columnGridY">Grid Kolom Y</Label>
            <Input
              id="columnGridY"
              type="number"
              value={(data.columnGridY || Math.ceil(data.width / data.baySpacingY)).toString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('columnGridY', e.target.value)}
              placeholder="4"
              min="1"
              max="50"
              step="1"
            />
            <div className="text-xs text-gray-500">Jumlah grid arah Y</div>
          </div>
        </div>

        {/* Informasi Kalkulasi */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Informasi Kalkulasi:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <span className="font-medium">Luas Total:</span>
              <div>{totalArea.toFixed(2)} m²</div>
            </div>
            <div>
              <span className="font-medium">Tinggi Total:</span>
              <div>{totalHeight.toFixed(2)} m</div>
            </div>
            <div>
              <span className="font-medium">Volume Total:</span>
              <div>{totalVolume.toFixed(2)} m³</div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <span className="font-medium">Estimasi Jumlah Kolom:</span>
              <div>{((data.columnGridX || 1) + 1) * ((data.columnGridY || 1) + 1)} kolom</div>
            </div>
            <div>
              <span className="font-medium">Aspek Rasio L/W:</span>
              <div>{(data.length / data.width).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Kesalahan Input:</h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.filter(e => e.includes('Geometri')).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};