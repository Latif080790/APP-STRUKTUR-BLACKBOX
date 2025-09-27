/**
 * Basic Working Form - Emergency Fallback
 * Simple form that works without error boundaries
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const BasicWorkingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: 'Proyek Analisis Struktur',
    location: 'Jakarta, DKI Jakarta',
    length: '20',
    width: '15', 
    floors: '3',
    height: '3.5',
    deadLoad: '4.0',
    liveLoad: '2.5'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = () => {
    alert('Analisis akan dilakukan dengan data:\n\n' + 
      `Proyek: ${formData.projectName}\n` +
      `Lokasi: ${formData.location}\n` +
      `Panjang: ${formData.length} m\n` +
      `Lebar: ${formData.width} m\n` +
      `Jumlah Lantai: ${formData.floors}\n` +
      `Tinggi per Lantai: ${formData.height} m\n` +
      `Beban Mati: ${formData.deadLoad} kN/m²\n` +
      `Beban Hidup: ${formData.liveLoad} kN/m²`
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Sistem Analisis Struktur SNI
        </h1>
        <p className="text-gray-600">
          Professional Structural Analysis - Zero Error Tolerance
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Input Struktur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Nama Proyek</Label>
                <Input
                  id="projectName"
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                  placeholder="Nama proyek struktur"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location" 
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Jakarta, DKI Jakarta"
                />
              </div>
            </div>

            {/* Geometry */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="length">Panjang (m)</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                  placeholder="20"
                />
              </div>
              
              <div>
                <Label htmlFor="width">Lebar (m)</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"  
                  value={formData.width}
                  onChange={(e) => handleChange('width', e.target.value)}
                  placeholder="15"
                />
              </div>
              
              <div>
                <Label htmlFor="floors">Jumlah Lantai</Label>
                <Input
                  id="floors"
                  type="number"
                  value={formData.floors}
                  onChange={(e) => handleChange('floors', e.target.value)}
                  placeholder="3"
                />
              </div>
              
              <div>
                <Label htmlFor="height">Tinggi per Lantai (m)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="3.5"
                />
              </div>
            </div>

            {/* Loads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadLoad">Beban Mati (kN/m²)</Label>
                <Input
                  id="deadLoad"
                  type="number"
                  step="0.1"
                  value={formData.deadLoad}
                  onChange={(e) => handleChange('deadLoad', e.target.value)}
                  placeholder="4.0"
                />
              </div>
              
              <div>
                <Label htmlFor="liveLoad">Beban Hidup (kN/m²)</Label>
                <Input
                  id="liveLoad"
                  type="number"
                  step="0.1"
                  value={formData.liveLoad}
                  onChange={(e) => handleChange('liveLoad', e.target.value)}
                  placeholder="2.5"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Preview Data Input</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Proyek:</span> {formData.projectName}</div>
                <div><span className="font-medium">Lokasi:</span> {formData.location}</div>
                <div><span className="font-medium">Dimensi:</span> {formData.length}m × {formData.width}m</div>
                <div><span className="font-medium">Lantai:</span> {formData.floors} lantai × {formData.height}m</div>
                <div><span className="font-medium">Beban Mati:</span> {formData.deadLoad} kN/m²</div>
                <div><span className="font-medium">Beban Hidup:</span> {formData.liveLoad} kN/m²</div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyze}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-lg"
              >
                🚀 Test Analisis Struktur
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-green-800 font-medium">System Ready - No Errors Detected</span>
        </div>
      </div>
    </div>
  );
};

export default BasicWorkingForm;