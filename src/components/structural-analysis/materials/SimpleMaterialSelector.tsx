/**
 * Simple Material Selector - Single Material Type Only
 * Untuk penggunaan sederhana dengan hanya 1 jenis material
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Info, Check } from 'lucide-react';

interface MaterialGrade {
  grade: string;
  fc?: number; // Concrete compressive strength (MPa)
  fy?: number; // Steel yield strength (MPa)
  fu?: number; // Steel ultimate strength (MPa)
  density: number; // kg/m³
  E: number; // Elastic modulus (MPa)
  description: string;
  applications: string[];
}

interface SimpleMaterialSelectorProps {
  selectedMaterial: MaterialGrade | null;
  onMaterialChange: (material: MaterialGrade) => void;
  materialType?: 'concrete' | 'steel' | 'composite';
}

// Material database - hanya essentials
const MATERIAL_DATABASE = {
  concrete: [
    {
      grade: 'K-225',
      fc: 18.7,
      density: 2400,
      E: 23500,
      description: 'Beton Normal K-225 (SNI 2847:2019)',
      applications: ['Struktur umum', 'Balok', 'Kolom', 'Pelat']
    },
    {
      grade: 'K-300',
      fc: 25.0,
      density: 2400,
      E: 25000,
      description: 'Beton Normal K-300 (SNI 2847:2019)',
      applications: ['Struktur bertingkat', 'Kolom utama', 'Balok utama']
    },
    {
      grade: 'K-400',
      fc: 33.2,
      density: 2400,
      E: 27500,
      description: 'Beton Mutu Tinggi K-400 (SNI 2847:2019)',
      applications: ['Gedung tinggi', 'Struktur khusus', 'Precast']
    }
  ],
  steel: [
    {
      grade: 'BJ-37',
      fy: 240,
      fu: 370,
      density: 7850,
      E: 200000,
      description: 'Baja Struktur BJ-37 (SNI 1729:2020)',
      applications: ['Struktur ringan', 'Rangka atap', 'Struktur sekunder']
    },
    {
      grade: 'BJ-41',
      fy: 250,
      fu: 410,
      density: 7850,
      E: 200000,
      description: 'Baja Struktur BJ-41 (SNI 1729:2020)',
      applications: ['Struktur utama', 'Portal', 'Kolom baja']
    },
    {
      grade: 'BJ-55',
      fy: 410,
      fu: 550,
      density: 7850,
      E: 200000,
      description: 'Baja Mutu Tinggi BJ-55 (SNI 1729:2020)',
      applications: ['Gedung tinggi', 'Struktur khusus', 'Beban berat']
    }
  ],
  composite: [
    {
      grade: 'KOMPOSIT-STD',
      fc: 25,
      fy: 240,
      density: 2200,
      E: 22000,
      description: 'Material Komposit Standard (Beton + Baja)',
      applications: ['Struktur campuran', 'Balok komposit', 'Lantai komposit']
    }
  ]
};

export const SimpleMaterialSelector: React.FC<SimpleMaterialSelectorProps> = ({
  selectedMaterial,
  onMaterialChange,
  materialType = 'concrete'
}) => {
  const [currentType, setCurrentType] = useState<'concrete' | 'steel' | 'composite'>(materialType);
  
  const availableMaterials = MATERIAL_DATABASE[currentType];

  const handleMaterialSelect = (material: MaterialGrade) => {
    onMaterialChange(material);
  };

  const handleTypeChange = (newType: 'concrete' | 'steel' | 'composite') => {
    setCurrentType(newType);
    // Auto select first material of new type
    const firstMaterial = MATERIAL_DATABASE[newType][0];
    onMaterialChange(firstMaterial);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Pilih Material Struktur</span>
          <Badge variant="secondary">Mode Sederhana</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Material Type Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Jenis Material</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={currentType === 'concrete' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('concrete')}
              className="w-full"
            >
              Beton
            </Button>
            <Button
              variant={currentType === 'steel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('steel')}
              className="w-full"
            >
              Baja
            </Button>
            <Button
              variant={currentType === 'composite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeChange('composite')}
              className="w-full"
            >
              Komposit
            </Button>
          </div>
        </div>

        {/* Material Grade Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Grade Material</label>
          <Select 
            value={selectedMaterial?.grade || ''} 
            onValueChange={(grade) => {
              const material = availableMaterials.find(m => m.grade === grade);
              if (material) handleMaterialSelect(material);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih grade material..." />
            </SelectTrigger>
            <SelectContent>
              {availableMaterials.map((material) => (
                <SelectItem key={material.grade} value={material.grade}>
                  <div className="flex items-center justify-between w-full">
                    <span>{material.grade}</span>
                    <Badge variant="outline" className="ml-2">
                      {currentType === 'concrete' ? `fc'=${material.fc}MPa` : 
                       currentType === 'steel' ? `fy=${material.fy}MPa` : 
                       'Komposit'}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Material Info */}
        {selectedMaterial && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Check className="h-4 w-4 text-green-600" />
              <span className="font-medium">Material Terpilih: {selectedMaterial.grade}</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">{selectedMaterial.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <span className="font-medium">Properti Mekanik:</span>
                  <ul className="mt-1 space-y-1 text-xs">
                    {selectedMaterial.fc && <li>fc' = {selectedMaterial.fc} MPa</li>}
                    {selectedMaterial.fy && <li>fy = {selectedMaterial.fy} MPa</li>}
                    {selectedMaterial.fu && <li>fu = {selectedMaterial.fu} MPa</li>}
                    <li>E = {selectedMaterial.E.toLocaleString()} MPa</li>
                    <li>ρ = {selectedMaterial.density} kg/m³</li>
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium">Aplikasi:</span>
                  <ul className="mt-1 space-y-1 text-xs">
                    {selectedMaterial.applications.slice(0, 3).map((app, idx) => (
                      <li key={idx}>• {app}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
          <Info className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">Mode Sederhana</p>
            <p>Pilih hanya 1 jenis material untuk seluruh struktur. Material ini akan digunakan untuk semua elemen struktural (kolom, balok, pelat, dll).</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default SimpleMaterialSelector;