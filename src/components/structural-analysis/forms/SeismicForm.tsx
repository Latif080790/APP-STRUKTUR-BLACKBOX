import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { SimpleSelect } from '../../ui/simple-select';
import { SeismicParameters } from '../interfaces';

interface SeismicFormProps {
  data: SeismicParameters;
  onChange: (data: SeismicParameters) => void;
  errors?: string[];
}

export const SeismicForm: React.FC<SeismicFormProps> = ({ data, onChange, errors = [] }) => {
  const handleInputChange = (field: keyof SeismicParameters, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onChange({ ...data, [field]: numericValue });
  };

  const handleSelectChange = (field: keyof SeismicParameters, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleBooleanChange = (field: keyof SeismicParameters, value: boolean) => {
    onChange({ ...data, [field]: value });
  };

  const siteClasses = [
    { value: 'SA', label: 'SA - Batuan Keras (Vs > 1500 m/s)' },
    { value: 'SB', label: 'SB - Batuan (750 < Vs ≤ 1500 m/s)' },
    { value: 'SC', label: 'SC - Tanah Keras (350 < Vs ≤ 750 m/s)' },
    { value: 'SD', label: 'SD - Tanah Sedang (175 < Vs ≤ 350 m/s)' },
    { value: 'SE', label: 'SE - Tanah Lunak (Vs ≤ 175 m/s)' },
    { value: 'SF', label: 'SF - Tanah Khusus (Analisis Situs)' }
  ];

  const importanceFactors = [
    { value: '1.0', label: 'I = 1.0 - Kategori Risiko I' },
    { value: '1.0', label: 'I = 1.0 - Kategori Risiko II' },
    { value: '1.25', label: 'I = 1.25 - Kategori Risiko III' },
    { value: '1.5', label: 'I = 1.5 - Kategori Risiko IV' }
  ];

  const structuralSystems = [
    { value: '8.0', label: 'R = 8.0 - Rangka Momen Khusus' },
    { value: '5.0', label: 'R = 5.0 - Rangka Momen Menengah' },
    { value: '3.5', label: 'R = 3.5 - Rangka Momen Biasa' },
    { value: '6.0', label: 'R = 6.0 - Dinding Geser Khusus' },
    { value: '4.5', label: 'R = 4.5 - Dinding Geser Biasa' },
    { value: '7.0', label: 'R = 7.0 - Sistem Ganda' }
  ];

  const categories = [
    { value: 'A', label: 'Kategori A - Risiko Rendah' },
    { value: 'B', label: 'Kategori B - Risiko Menengah' },
    { value: 'C', label: 'Kategori C - Risiko Tinggi' },
    { value: 'D', label: 'Kategori D - Risiko Sangat Tinggi' },
    { value: 'E', label: 'Kategori E - Risiko Ekstrim' }
  ];

  // Calculate derived parameters
  const sms = data.ss * (data.fa || 1.0);
  const sm1 = data.s1 * (data.fv || 1.0);
  const sds = (2/3) * sms;
  const sd1 = (2/3) * sm1;
  const ts = sd1 / sds;
  const t0 = 0.2 * ts;
  const tl = data.tl || 8.0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter Seismik</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Parameter Dasar Gempa */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isSeismic"
              checked={data.isSeismic}
              onChange={(e) => handleBooleanChange('isSeismic', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isSeismic" className="text-lg font-medium">Aktifkan Analisis Seismik</Label>
          </div>
          
          {data.isSeismic && (
            <>
              <h4 className="text-md font-medium text-gray-900">Parameter Spektral Percepatan</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ss">SS - Spektral Percepatan (0.2s) *</Label>
                  <Input
                    id="ss"
                    type="number"
                    value={data.ss.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('ss', e.target.value)}
                    placeholder="0.8"
                    min="0.1"
                    max="2.5"
                    step="0.01"
                    className={errors.some(e => e.includes('SS')) ? 'border-red-500' : ''}
                  />
                  <div className="text-xs text-gray-500">Dari peta hazard gempa Indonesia</div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="s1">S1 - Spektral Percepatan (1.0s) *</Label>
                  <Input
                    id="s1"
                    type="number"
                    value={data.s1.toString()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('s1', e.target.value)}
                    placeholder="0.3"
                    min="0.05"
                    max="1.5"
                    step="0.01"
                    className={errors.some(e => e.includes('S1')) ? 'border-red-500' : ''}
                  />
                  <div className="text-xs text-gray-500">Dari peta hazard gempa Indonesia</div>
                </div>
              </div>

              {/* Kelas Situs */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Klasifikasi Situs</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteClass">Kelas Situs *</Label>
                    <SimpleSelect
                      value={data.siteClass}
                      onChange={(value: string) => handleSelectChange('siteClass', value)}
                      options={siteClasses}
                      placeholder="Pilih kelas situs"
                      className={errors.some(e => e.includes('Kelas situs')) ? 'border-red-500' : ''}
                    />
                    <div className="text-xs text-gray-500">Berdasarkan kecepatan gelombang geser (Vs30)</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fa">Fa - Faktor Amplifikasi (0.2s)</Label>
                    <Input
                      id="fa"
                      type="number"
                      value={(data.fa || 1.0).toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fa', e.target.value)}
                      placeholder="1.0"
                      min="0.8"
                      max="2.5"
                      step="0.1"
                    />
                    <div className="text-xs text-gray-500">Tabel berdasarkan SS dan kelas situs</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fv">Fv - Faktor Amplifikasi (1.0s)</Label>
                    <Input
                      id="fv"
                      type="number"
                      value={(data.fv || 1.0).toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('fv', e.target.value)}
                      placeholder="1.0"
                      min="0.8"
                      max="3.5"
                      step="0.1"
                    />
                    <div className="text-xs text-gray-500">Tabel berdasarkan S1 dan kelas situs</div>
                  </div>
                </div>
              </div>

              {/* Parameter Desain */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Parameter Desain Seismik</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="importance">Faktor Keutamaan (I) *</Label>
                    <SimpleSelect
                      value={data.importance.toString()}
                      onChange={(value: string) => handleInputChange('importance', value)}
                      options={importanceFactors}
                      placeholder="Pilih kategori risiko"
                    />
                    <div className="text-xs text-gray-500">Berdasarkan kategori risiko bangunan</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="r">Faktor Modifikasi Respons (R) *</Label>
                    <SimpleSelect
                      value={data.r.toString()}
                      onChange={(value: string) => handleInputChange('r', value)}
                      options={structuralSystems}
                      placeholder="Pilih sistem struktur"
                      className={errors.some(e => e.includes('Faktor R')) ? 'border-red-500' : ''}
                    />
                    <div className="text-xs text-gray-500">Berdasarkan sistem penahan gaya lateral</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cd">Faktor Amplifikasi Defleksi (Cd)</Label>
                    <Input
                      id="cd"
                      type="number"
                      value={data.cd.toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('cd', e.target.value)}
                      placeholder="5.5"
                      min="1.0"
                      max="8.0"
                      step="0.5"
                    />
                    <div className="text-xs text-gray-500">Biasanya Cd ≈ 0.75R</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="omega">Faktor Overstrength (Ω0)</Label>
                    <Input
                      id="omega"
                      type="number"
                      value={data.omega.toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('omega', e.target.value)}
                      placeholder="3.0"
                      min="1.0"
                      max="4.0"
                      step="0.5"
                    />
                    <div className="text-xs text-gray-500">Faktor kelebihan kekuatan</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tl">TL - Periode Transisi Panjang (s)</Label>
                    <Input
                      id="tl"
                      type="number"
                      value={(data.tl || 8.0).toString()}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('tl', e.target.value)}
                      placeholder="8.0"
                      min="4.0"
                      max="12.0"
                      step="0.5"
                    />
                    <div className="text-xs text-gray-500">Dari peta TL Indonesia</div>
                  </div>
                </div>
              </div>

              {/* Kategori Desain Seismik */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Kategori Desain Seismik</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori Desain Seismik</Label>
                    <SimpleSelect
                      value={data.category || 'C'}
                      onChange={(value: string) => handleSelectChange('category', value)}
                      options={categories}
                      placeholder="Akan dihitung otomatis"
                    />
                    <div className="text-xs text-gray-500">
                      Ditentukan berdasarkan SDS, SD1, dan kategori risiko
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameter Kalkulasi */}
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-md">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Parameter Terhitung:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
                  <div>
                    <span className="font-medium">SMS:</span>
                    <div>{sms.toFixed(3)} g</div>
                  </div>
                  <div>
                    <span className="font-medium">SM1:</span>
                    <div>{sm1.toFixed(3)} g</div>
                  </div>
                  <div>
                    <span className="font-medium">SDS:</span>
                    <div>{sds.toFixed(3)} g</div>
                  </div>
                  <div>
                    <span className="font-medium">SD1:</span>
                    <div>{sd1.toFixed(3)} g</div>
                  </div>
                  <div>
                    <span className="font-medium">TS:</span>
                    <div>{ts.toFixed(3)} s</div>
                  </div>
                  <div>
                    <span className="font-medium">T0:</span>
                    <div>{t0.toFixed(3)} s</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-purple-600">
                  <div>SMS = SS × Fa, SM1 = S1 × Fv</div>
                  <div>SDS = (2/3) × SMS, SD1 = (2/3) × SM1</div>
                  <div>TS = SD1/SDS, T0 = 0.2 × TS</div>
                </div>
              </div>

              {/* Spektrum Respons Desain */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Spektrum Respons Desain</h4>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="text-sm text-gray-700">
                    <div className="font-medium mb-2">Persamaan Spektrum:</div>
                    <div className="space-y-1">
                      <div>• T ≤ T0: Sa = SDS × (0.4 + 0.6T/T0)</div>
                      <div>• T0 ≤ T ≤ TS: Sa = SDS</div>
                      <div>• TS ≤ T ≤ TL: Sa = SD1/T</div>
                      <div>• T ≥ TL: Sa = SD1×TL/T²</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">Kesalahan Input:</h4>
            <ul className="list-disc list-inside text-sm text-red-700">
              {errors.filter(e => e.includes('Seismik')).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};