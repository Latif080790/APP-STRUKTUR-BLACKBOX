/**
 * Enhanced Material Properties
 * 3 Kategori Material: Beton, Baja Struktur, Baja Komposit
 * Tampilan lebih efisien dan efektif
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Layers, 
  Hammer, 
  Zap, 
  CheckCircle,
  Settings,
  Info
} from 'lucide-react';

// ============= BETON MATERIAL =============
export interface ConcreteGrade {
  name: string;
  fc: number;      // Kuat tekan karakteristik (MPa)
  fct: number;     // Kuat tarik (MPa)  
  Ec: number;      // Modulus elastisitas (MPa)
  density: number; // Kg/m³
  wc: number;      // Water-cement ratio
  slump: string;   // Slump range
  applications: string[];
  sniCode: string;
}

export const CONCRETE_GRADES: Record<string, ConcreteGrade> = {
  'K-175': {
    name: 'K-175 (fc\' = 14.5 MPa)',
    fc: 14.5,
    fct: 1.2,
    Ec: 22360,
    density: 2400,
    wc: 0.87,
    slump: '60-180 mm',
    applications: ['Non-struktural', 'Lantai kerja', 'Perkerasan'],
    sniCode: 'SNI 2847:2019'
  },
  'K-225': {
    name: 'K-225 (fc\' = 18.7 MPa)', 
    fc: 18.7,
    fct: 1.4,
    Ec: 25400,
    density: 2400,
    wc: 0.78,
    slump: '60-180 mm',
    applications: ['Struktur ringan', 'Pondasi dangkal', 'Dinding penahan'],
    sniCode: 'SNI 2847:2019'
  },
  'K-300': {
    name: 'K-300 (fc\' = 25 MPa)',
    fc: 25,
    fct: 1.8,
    Ec: 29400,
    density: 2400,
    wc: 0.68,
    slump: '60-180 mm', 
    applications: ['Struktur umum', 'Balok & kolom gedung', 'Jalan raya'],
    sniCode: 'SNI 2847:2019'
  },
  'K-350': {
    name: 'K-350 (fc\' = 29.2 MPa)',
    fc: 29.2,
    fct: 2.1,
    Ec: 31780,
    density: 2400,
    wc: 0.62,
    slump: '60-180 mm',
    applications: ['Gedung bertingkat', 'Jembatan', 'Struktur prategang'],
    sniCode: 'SNI 2847:2019'
  },
  'K-400': {
    name: 'K-400 (fc\' = 33.2 MPa)',
    fc: 33.2,
    fct: 2.3,
    Ec: 33890,
    density: 2400,
    wc: 0.57,
    slump: '60-180 mm',
    applications: ['Gedung tinggi', 'Struktur prategang', 'Dermaga'],
    sniCode: 'SNI 2847:2019'
  }
};

// ============= BAJA STRUKTUR =============
export interface SteelGrade {
  name: string;
  fy: number;        // Tegangan leleh (MPa)
  fu: number;        // Tegangan tarik ultimate (MPa)
  Es: number;        // Modulus elastisitas (MPa)
  density: number;   // Kg/m³
  profile: string[];  // Available profiles
  weldability: string;
  applications: string[];
  sniCode: string;
}

export const STRUCTURAL_STEEL: Record<string, SteelGrade> = {
  'BJ-34': {
    name: 'BJ-34 (fy = 210 MPa)',
    fy: 210,
    fu: 340,
    Es: 200000,
    density: 7850,
    profile: ['IWF', 'H-Beam', 'C-Channel', 'Angle', 'Plate'],
    weldability: 'Sangat Baik',
    applications: ['Struktur ringan', 'Gudang', 'Bangunan industri'],
    sniCode: 'SNI 1729:2020'
  },
  'BJ-37': {
    name: 'BJ-37 (fy = 240 MPa)',
    fy: 240,
    fu: 370,
    Es: 200000,
    density: 7850,
    profile: ['IWF', 'H-Beam', 'C-Channel', 'Angle', 'Plate'],
    weldability: 'Baik',
    applications: ['Gedung bertingkat menengah', 'Jembatan kecil', 'Tower'],
    sniCode: 'SNI 1729:2020'
  },
  'BJ-41': {
    name: 'BJ-41 (fy = 250 MPa)',
    fy: 250,
    fu: 410,
    Es: 200000,
    density: 7850,
    profile: ['IWF', 'H-Beam', 'C-Channel', 'HSS', 'Plate'],
    weldability: 'Baik',
    applications: ['Gedung bertingkat tinggi', 'Jembatan menengah', 'Crane'],
    sniCode: 'SNI 1729:2020'
  },
  'BJ-50': {
    name: 'BJ-50 (fy = 290 MPa)',
    fy: 290,
    fu: 500,
    Es: 200000,
    density: 7850,
    profile: ['IWF', 'H-Beam', 'HSS', 'Built-up Section'],
    weldability: 'Sedang',
    applications: ['High-rise building', 'Jembatan besar', 'Offshore'],
    sniCode: 'SNI 1729:2020'
  },
  'BJ-55': {
    name: 'BJ-55 (fy = 410 MPa)',
    fy: 410,
    fu: 550,
    Es: 200000,
    density: 7850,
    profile: ['IWF', 'HSS', 'Built-up Section', 'Special Profiles'],
    weldability: 'Memerlukan Prosedur Khusus',
    applications: ['Skyscraper', 'Long-span bridge', 'Offshore platform'],
    sniCode: 'SNI 1729:2020'
  }
};

// ============= BAJA KOMPOSIT =============
export interface CompositeSteel {
  name: string;
  steelGrade: string;
  concreteGrade: string;
  shearConnector: string;
  fy: number;
  fc: number;
  efficiency: number; // %
  applications: string[];
  advantages: string[];
}

export const COMPOSITE_STEEL: Record<string, CompositeSteel> = {
  'COMP-1': {
    name: 'BJ-37 + K-300 Komposit',
    steelGrade: 'BJ-37',
    concreteGrade: 'K-300',
    shearConnector: 'Stud Φ16@200',
    fy: 240,
    fc: 25,
    efficiency: 85,
    applications: ['Balok komposit gedung', 'Deck komposit'],
    advantages: ['Bentang lebih panjang', 'Defleksi lebih kecil', 'Getaran berkurang']
  },
  'COMP-2': {
    name: 'BJ-41 + K-350 Komposit',
    steelGrade: 'BJ-41', 
    concreteGrade: 'K-350',
    shearConnector: 'Stud Φ19@150',
    fy: 250,
    fc: 29.2,
    efficiency: 88,
    applications: ['High-rise building', 'Jembatan komposit'],
    advantages: ['Kapasitas tinggi', 'Kekakuan optimal', 'Ekonomis']
  },
  'COMP-3': {
    name: 'BJ-50 + K-400 Komposit',
    steelGrade: 'BJ-50',
    concreteGrade: 'K-400', 
    shearConnector: 'Stud Φ22@125',
    fy: 290,
    fc: 33.2,
    efficiency: 92,
    applications: ['Long-span bridge', 'Stadium', 'Convention center'],
    advantages: ['Performa maksimal', 'Bentang sangat panjang', 'Tahan gempa']
  }
};

interface MaterialSelectorProps {
  onMaterialChange: (material: any) => void;
  selectedMaterial?: any;
}

export const EnhancedMaterialSelector: React.FC<MaterialSelectorProps> = ({
  onMaterialChange,
  selectedMaterial
}) => {
  const [activeTab, setActiveTab] = useState('concrete');
  const [selectedConcrete, setSelectedConcrete] = useState<string>('K-300');
  const [selectedSteel, setSelectedSteel] = useState<string>('BJ-41');
  const [selectedComposite, setSelectedComposite] = useState<string>('COMP-2');

  const handleConcreteSelect = (grade: string) => {
    setSelectedConcrete(grade);
    onMaterialChange({
      type: 'concrete',
      grade,
      properties: CONCRETE_GRADES[grade]
    });
  };

  const handleSteelSelect = (grade: string) => {
    setSelectedSteel(grade);
    onMaterialChange({
      type: 'steel',
      grade,
      properties: STRUCTURAL_STEEL[grade]
    });
  };

  const handleCompositeSelect = (grade: string) => {
    setSelectedComposite(grade);
    onMaterialChange({
      type: 'composite',
      grade,
      properties: COMPOSITE_STEEL[grade]
    });
  };

  return (
    <div className="space-y-6">
      {/* Material Selection Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="concrete" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Beton</span>
          </TabsTrigger>
          <TabsTrigger value="steel" className="flex items-center space-x-2">
            <Hammer className="h-4 w-4" />
            <span>Baja Struktur</span>
          </TabsTrigger>
          <TabsTrigger value="composite" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Baja Komposit</span>
          </TabsTrigger>
        </TabsList>

        {/* BETON TAB */}
        <TabsContent value="concrete">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Layers className="h-5 w-5" />
                <span>Material Beton (SNI 2847:2019)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(CONCRETE_GRADES).map(([key, concrete]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedConcrete === key 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConcreteSelect(key)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{concrete.name}</h4>
                      {selectedConcrete === key && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>fc' = <span className="font-semibold">{concrete.fc} MPa</span></div>
                      <div>Ec = <span className="font-semibold">{concrete.Ec} MPa</span></div>
                      <div>Density = <span className="font-semibold">{concrete.density} kg/m³</span></div>
                      <div className="text-xs text-blue-600 mt-2">
                        {concrete.applications[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Concrete Details */}
              {selectedConcrete && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Detail {CONCRETE_GRADES[selectedConcrete].name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>W/C Ratio: <span className="font-semibold">{CONCRETE_GRADES[selectedConcrete].wc}</span></div>
                    <div>Slump: <span className="font-semibold">{CONCRETE_GRADES[selectedConcrete].slump}</span></div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-semibold">Aplikasi:</div>
                    <div className="text-xs text-gray-600">
                      {CONCRETE_GRADES[selectedConcrete].applications.join(', ')}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BAJA STRUKTUR TAB */}
        <TabsContent value="steel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hammer className="h-5 w-5" />
                <span>Baja Struktur (SNI 1729:2020)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(STRUCTURAL_STEEL).map(([key, steel]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedSteel === key 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSteelSelect(key)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{steel.name}</h4>
                      {selectedSteel === key && <CheckCircle className="h-5 w-5 text-orange-500" />}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>fy = <span className="font-semibold">{steel.fy} MPa</span></div>
                      <div>fu = <span className="font-semibold">{steel.fu} MPa</span></div>
                      <div>Weldability: <span className="font-semibold">{steel.weldability}</span></div>
                      <div className="text-xs text-orange-600 mt-2">
                        {steel.applications[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Steel Details */}
              {selectedSteel && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Detail {STRUCTURAL_STEEL[selectedSteel].name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Es: <span className="font-semibold">{STRUCTURAL_STEEL[selectedSteel].Es} MPa</span></div>
                    <div>Density: <span className="font-semibold">{STRUCTURAL_STEEL[selectedSteel].density} kg/m³</span></div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-semibold">Profil Tersedia:</div>
                    <div className="flex gap-2 mt-1">
                      {STRUCTURAL_STEEL[selectedSteel].profile.map((profile, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BAJA KOMPOSIT TAB */}
        <TabsContent value="composite">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Struktur Baja Komposit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(COMPOSITE_STEEL).map(([key, composite]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedComposite === key 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleCompositeSelect(key)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{composite.name}</h4>
                      {selectedComposite === key && <CheckCircle className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <div>Steel: <span className="font-semibold">{composite.steelGrade}</span></div>
                        <div>Concrete: <span className="font-semibold">{composite.concreteGrade}</span></div>
                      </div>
                      <div>
                        <div>Shear Connector: <span className="font-semibold">{composite.shearConnector}</span></div>
                        <div>Efficiency: <span className="font-semibold">{composite.efficiency}%</span></div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-purple-600">
                        {composite.advantages.slice(0, 2).join(' • ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Composite Details */}
              {selectedComposite && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Detail {COMPOSITE_STEEL[selectedComposite].name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>fy Steel: <span className="font-semibold">{COMPOSITE_STEEL[selectedComposite].fy} MPa</span></div>
                    <div>fc' Concrete: <span className="font-semibold">{COMPOSITE_STEEL[selectedComposite].fc} MPa</span></div>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-semibold">Keunggulan:</div>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {COMPOSITE_STEEL[selectedComposite].advantages.map((advantage, idx) => (
                        <li key={idx}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Panel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Material Terpilih
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">Beton</div>
              <div>{selectedConcrete}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">Baja Struktur</div>
              <div>{selectedSteel}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">Komposit</div>
              <div>{selectedComposite}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMaterialSelector;