import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { SimpleSelect } from '../../ui/simple-select';
import { Loads } from '../interfaces';

interface LoadsFormProps {
  data: Loads;
  onChange: (data: Loads) => void;
  errors?: string[];
}

export const LoadsForm: React.FC<LoadsFormProps> = ({ data, onChange, errors = [] }) => {
  const handleInputChange = (field: keyof Loads, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numericValue });
  };

  const windCategories = [
    { value: '25', label: 'Kategori I - 25 m/s (90 km/h)' },
    { value: '30', label: 'Kategori II - 30 m/s (108 km/h)' },
    { value: '35', label: 'Kategori III - 35 m/s (126 km/h)' },
    { value: '40', label: 'Kategori IV - 40 m/s (144 km/h)' },
    { value: '45', label: 'Kategori V - 45 m/s (162 km/h)' }
  ];

  const seismicZones = [
    { value: '1', label: 'Zona 1 - Risiko Rendah' },
    { value: '2', label: 'Zona 2 - Risiko Menengah' },
    { value: '3', label: 'Zona 3 - Risiko Tinggi' },
    { value: '4', label: 'Zona 4 - Risiko Sangat Tinggi' },
    { value: '5', label: 'Zona 5 - Risiko Ekstrim' },
    { value: '6', label: 'Zona 6 - Risiko Maksimum' }
  ];

  // Calculate total loads
  const totalDeadLoad = data.deadLoad + data.partitionLoad + data.claddingLoad;
  const totalLoadPerFloor = totalDeadLoad + data.liveLoad;
  const windPressure = 0.613 * Math.pow(data.windSpeed, 2) / 1000; // kN/m² simplified

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beban Struktur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Beban Mati */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Beban Mati (Dead Load)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadLoad">Beban Mati Struktural (kN/m²) *</Label>
              <Input
                id="deadLoad"
                type="number"
                value={data.deadLoad.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('deadLoad', e.target.value)}
                placeholder="5.0"
                min="2"
                max="15"
                step="0.1"
                className={errors.some(e => e.includes('Beban mati')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Berat struktur utama</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partitionLoad">Beban Partisi (kN/m²)</Label>
              <Input
                id="partitionLoad"
                type="number"
                value={data.partitionLoad.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('partitionLoad', e.target.value)}
                placeholder="1.0"
                min="0"
                max="5"
                step="0.1"
              />
              <div className="text-xs text-gray-500">Dinding partisi, MEP</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claddingLoad">Beban Fasad (kN/m²)</Label>
              <Input
                id="claddingLoad"
                type="number"
                value={data.claddingLoad.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('claddingLoad', e.target.value)}
                placeholder="0.5"
                min="0"
                max="3"
                step="0.1"
              />
              <div className="text-xs text-gray-500">Cladding, finishing</div>
            </div>
          </div>
        </div>

        {/* Beban Hidup */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Beban Hidup (Live Load)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liveLoad">Beban Hidup Lantai (kN/m²) *</Label>
              <Input
                id="liveLoad"
                type="number"
                value={data.liveLoad.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('liveLoad', e.target.value)}
                placeholder="2.5"
                min="1.5"
                max="10"
                step="0.1"
                className={errors.some(e => e.includes('Beban hidup')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">
                <div>Perkantoran: 2.5 kN/m²</div>
                <div>Apartemen: 1.9 kN/m²</div>
                <div>Hotel: 1.9 kN/m²</div>
                <div>Sekolah: 3.0 kN/m²</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roofLiveLoad">Beban Hidup Atap (kN/m²)</Label>
              <Input
                id="roofLiveLoad"
                type="number"
                value={data.roofLiveLoad.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('roofLiveLoad', e.target.value)}
                placeholder="1.0"
                min="0.5"
                max="3"
                step="0.1"
              />
              <div className="text-xs text-gray-500">
                <div>Atap datar: 1.0 kN/m²</div>
                <div>Atap miring: 0.5 kN/m²</div>
              </div>
            </div>
          </div>
        </div>

        {/* Beban Angin */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Beban Angin (Wind Load)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windSpeedCategory">Kategori Kecepatan Angin *</Label>
              <SimpleSelect
                value={data.windSpeed.toString()}
                onChange={(value: string) => handleInputChange('windSpeed', value)}
                options={windCategories}
                placeholder="Pilih kategori angin"
                className={errors.some(e => e.includes('Kecepatan angin')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Sesuai peta angin Indonesia</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="windSpeed">Kecepatan Angin (m/s) *</Label>
              <Input
                id="windSpeed"
                type="number"
                value={data.windSpeed.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('windSpeed', e.target.value)}
                placeholder="30"
                min="20"
                max="60"
                step="1"
                className={errors.some(e => e.includes('Kecepatan angin')) ? 'border-red-500' : ''}
              />
              <div className="text-xs text-gray-500">Min: 20 m/s, Max: 60 m/s</div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-700">
              <span className="font-medium">Tekanan Angin Terhitung:</span> {windPressure.toFixed(2)} kN/m²
              <div className="text-xs mt-1">Rumus sederhana: q = 0.613 × V² (kN/m²)</div>
            </div>
          </div>
        </div>

        {/* Beban Seismik */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Beban Seismik (Earthquake Load)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seismicZone">Zona Gempa *</Label>
              <SimpleSelect
                value={(data.seismicZone || 3).toString()}
                onChange={(value: string) => handleInputChange('seismicZone', value)}
                options={seismicZones}
                placeholder="Pilih zona gempa"
              />
              <div className="text-xs text-gray-500">
                <div>Berdasarkan peta hazard gempa Indonesia 2017</div>
                <div>Zona 1-2: Sumatera Utara, Kalimantan</div>
                <div>Zona 3-4: Jawa, Bali, Sumatera Tengah</div>
                <div>Zona 5-6: Sumatera Barat, Sulawesi, Papua</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kombinasi Beban */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Kombinasi Beban (Sesuai SNI 1727)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="font-medium text-gray-700 mb-2">LRFD (Load and Resistance Factor Design):</div>
              <div className="space-y-1 text-gray-600">
                <div>1. 1.4D</div>
                <div>2. 1.2D + 1.6L</div>
                <div>3. 1.2D + 1.0L + 1.0W</div>
                <div>4. 1.2D + 1.0L + 1.0E</div>
                <div>5. 0.9D + 1.0W</div>
                <div>6. 0.9D + 1.0E</div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="font-medium text-gray-700 mb-2">ASD (Allowable Stress Design):</div>
              <div className="space-y-1 text-gray-600">
                <div>1. D + L</div>
                <div>2. D + L + W</div>
                <div>3. D + L + E</div>
                <div>4. D + W</div>
                <div>5. D + E</div>
                <div>6. 0.6D + W</div>
                <div>7. 0.6D + E</div>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Kalkulasi */}
        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-md">
          <h4 className="text-sm font-medium text-orange-800 mb-2">Ringkasan Beban:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-700">
            <div>
              <span className="font-medium">Total Beban Mati:</span>
              <div>{totalDeadLoad.toFixed(2)} kN/m²</div>
            </div>
            <div>
              <span className="font-medium">Total Beban per Lantai:</span>
              <div>{totalLoadPerFloor.toFixed(2)} kN/m²</div>
            </div>
            <div>
              <span className="font-medium">Tekanan Angin:</span>
              <div>{windPressure.toFixed(2)} kN/m²</div>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Kesalahan Input:</h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.filter(e => e.includes('Beban')).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};