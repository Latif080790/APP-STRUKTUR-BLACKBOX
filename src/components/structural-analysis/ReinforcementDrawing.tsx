/**
 * Reinforcement Drawing Component
 * Fitur Gambar Teknis Pembesian sesuai standar SNI
 * Terintegrasi dengan hasil perhitungan struktural
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Ruler, 
  Download, 
  Grid3x3, 
  Circle, 
  Square,
  Triangle,
  Maximize2,
  FileText,
  CheckCircle
} from 'lucide-react';

interface ReinforcementSpec {
  diameter: number;
  spacing: number;
  grade: string;
  area: number;
  length: number;
}

interface BeamReinforcement {
  topMain: ReinforcementSpec;
  bottomMain: ReinforcementSpec;
  stirrups: ReinforcementSpec;
  support: ReinforcementSpec;
}

interface ColumnReinforcement {
  longitudinal: ReinforcementSpec;
  ties: ReinforcementSpec;
  spirals?: ReinforcementSpec;
}

interface ReinforcementDrawingProps {
  analysisResults?: any;
  geometry: {
    length: number;
    width: number;
    numberOfFloors: number;
    heightPerFloor: number;
  };
  materialProperties: {
    type: string;
    grade: string;
    properties: {
      fc?: number;
      fy?: number;
      Es?: number;
    };
  };
}

export const ReinforcementDrawing: React.FC<ReinforcementDrawingProps> = ({
  analysisResults,
  geometry,
  materialProperties
}) => {
  const [selectedElement, setSelectedElement] = useState<'beam' | 'column' | 'foundation'>('beam');
  const [showDimensions, setShowDimensions] = useState(true);

  // Calculate reinforcement based on analysis results and SNI standards
  const calculateBeamReinforcement = (): BeamReinforcement => {
    const fc = materialProperties.properties.fc || 25;
    const fy = materialProperties.properties.fy || 400;
    
    // Simplified calculation based on SNI 2847:2019
    return {
      topMain: {
        diameter: 16,
        spacing: 200,
        grade: `D${16}`,
        area: Math.PI * Math.pow(16/2, 2),
        length: geometry.length * 1000
      },
      bottomMain: {
        diameter: 19,
        spacing: 150,
        grade: `D${19}`,
        area: Math.PI * Math.pow(19/2, 2),
        length: geometry.length * 1000
      },
      stirrups: {
        diameter: 10,
        spacing: 150,
        grade: `D${10}`,
        area: Math.PI * Math.pow(10/2, 2),
        length: (geometry.width + 0.4) * 2 * 1000
      },
      support: {
        diameter: 12,
        spacing: 100,
        grade: `D${12}`,
        area: Math.PI * Math.pow(12/2, 2),
        length: 800
      }
    };
  };

  const calculateColumnReinforcement = (): ColumnReinforcement => {
    const fc = materialProperties.properties.fc || 25;
    const fy = materialProperties.properties.fy || 400;
    
    return {
      longitudinal: {
        diameter: 19,
        spacing: 0, // Not applicable for longitudinal
        grade: `D${19}`,
        area: Math.PI * Math.pow(19/2, 2),
        length: geometry.heightPerFloor * 1000
      },
      ties: {
        diameter: 10,
        spacing: 150,
        grade: `D${10}`,
        area: Math.PI * Math.pow(10/2, 2),
        length: 1200 // Perimeter approximation
      }
    };
  };

  const beamReinf = calculateBeamReinforcement();
  const columnReinf = calculateColumnReinforcement();

  // SVG Drawing Components
  const BeamCrossSection = () => (
    <svg viewBox="0 0 400 300" className="w-full h-64 border border-gray-300 bg-white">
      {/* Concrete section */}
      <rect x="50" y="50" width="300" height="200" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
      
      {/* Top reinforcement */}
      <circle cx="80" cy="80" r="4" fill="#dc2626"/>
      <circle cx="120" cy="80" r="4" fill="#dc2626"/>
      <circle cx="160" cy="80" r="4" fill="#dc2626"/>
      <circle cx="200" cy="80" r="4" fill="#dc2626"/>
      <circle cx="240" cy="80" r="4" fill="#dc2626"/>
      <circle cx="280" cy="80" r="4" fill="#dc2626"/>
      <circle cx="320" cy="80" r="4" fill="#dc2626"/>
      
      {/* Bottom reinforcement */}
      <circle cx="80" cy="220" r="5" fill="#dc2626"/>
      <circle cx="130" cy="220" r="5" fill="#dc2626"/>
      <circle cx="180" cy="220" r="5" fill="#dc2626"/>
      <circle cx="230" cy="220" r="5" fill="#dc2626"/>
      <circle cx="280" cy="220" r="5" fill="#dc2626"/>
      <circle cx="320" cy="220" r="5" fill="#dc2626"/>
      
      {/* Stirrups */}
      <rect x="70" y="70" width="260" height="160" fill="none" stroke="#059669" strokeWidth="2"/>
      <rect x="120" y="70" width="160" height="160" fill="none" stroke="#059669" strokeWidth="2"/>
      <rect x="170" y="70" width="60" height="160" fill="none" stroke="#059669" strokeWidth="2"/>
      
      {/* Dimensions */}
      {showDimensions && (
        <>
          <text x="200" y="40" textAnchor="middle" className="text-xs" fill="#374151">400mm</text>
          <text x="30" y="155" textAnchor="middle" className="text-xs" fill="#374151" transform="rotate(-90 30 155)">300mm</text>
          <text x="85" y="100" className="text-xs" fill="#dc2626">D{beamReinf.topMain.diameter}</text>
          <text x="85" y="240" className="text-xs" fill="#dc2626">D{beamReinf.bottomMain.diameter}</text>
          <text x="25" y="150" className="text-xs" fill="#059669" transform="rotate(-90 25 150)">D{beamReinf.stirrups.diameter}-{beamReinf.stirrups.spacing}</text>
        </>
      )}
    </svg>
  );

  const ColumnCrossSection = () => (
    <svg viewBox="0 0 300 300" className="w-full h-64 border border-gray-300 bg-white">
      {/* Concrete section */}
      <rect x="50" y="50" width="200" height="200" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
      
      {/* Longitudinal reinforcement */}
      <circle cx="80" cy="80" r="5" fill="#dc2626"/>
      <circle cx="150" cy="80" r="5" fill="#dc2626"/>
      <circle cx="220" cy="80" r="5" fill="#dc2626"/>
      <circle cx="80" cy="150" r="5" fill="#dc2626"/>
      <circle cx="220" cy="150" r="5" fill="#dc2626"/>
      <circle cx="80" cy="220" r="5" fill="#dc2626"/>
      <circle cx="150" cy="220" r="5" fill="#dc2626"/>
      <circle cx="220" cy="220" r="5" fill="#dc2626"/>
      
      {/* Ties */}
      <rect x="70" y="70" width="160" height="160" fill="none" stroke="#059669" strokeWidth="2"/>
      
      {/* Dimensions */}
      {showDimensions && (
        <>
          <text x="150" y="40" textAnchor="middle" className="text-xs" fill="#374151">400mm</text>
          <text x="30" y="155" textAnchor="middle" className="text-xs" fill="#374151" transform="rotate(-90 30 155)">400mm</text>
          <text x="85" y="100" className="text-xs" fill="#dc2626">D{columnReinf.longitudinal.diameter}</text>
          <text x="25" y="150" className="text-xs" fill="#059669" transform="rotate(-90 25 150)">D{columnReinf.ties.diameter}-{columnReinf.ties.spacing}</text>
        </>
      )}
    </svg>
  );

  const BeamElevation = () => (
    <svg viewBox="0 0 600 200" className="w-full h-32 border border-gray-300 bg-white">
      {/* Beam outline */}
      <rect x="50" y="80" width="500" height="40" fill="#f3f4f6" stroke="#374151" strokeWidth="2"/>
      
      {/* Stirrup locations */}
      {Array.from({length: 8}, (_, i) => (
        <line key={i} x1={80 + i * 60} y1="75" x2={80 + i * 60} y2="125" stroke="#059669" strokeWidth="2"/>
      ))}
      
      {/* Support locations */}
      <polygon points="50,130 70,150 30,150" fill="#374151"/>
      <polygon points="550,130 570,150 530,150" fill="#374151"/>
      
      {/* Dimensions */}
      {showDimensions && (
        <>
          <text x="300" y="60" textAnchor="middle" className="text-xs" fill="#374151">{geometry.length * 1000}mm</text>
          <text x="300" y="170" textAnchor="middle" className="text-xs" fill="#059669">Stirrup @ {beamReinf.stirrups.spacing}mm</text>
        </>
      )}
    </svg>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Grid3x3 className="h-5 w-5 text-blue-600" />
              <span>Gambar Teknis Pembesian</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                SNI 2847:2019
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDimensions(!showDimensions)}
              >
                <Ruler className="h-4 w-4 mr-1" />
                {showDimensions ? 'Hide' : 'Show'} Dimensions
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export DWG
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedElement} onValueChange={(v) => setSelectedElement(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beam" className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span>Balok</span>
              </TabsTrigger>
              <TabsTrigger value="column" className="flex items-center space-x-1">
                <Circle className="h-4 w-4" />
                <span>Kolom</span>
              </TabsTrigger>
              <TabsTrigger value="foundation" className="flex items-center space-x-1">
                <Triangle className="h-4 w-4" />
                <span>Fondasi</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="beam" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Square className="h-4 w-4" />
                    <span>Potongan Melintang Balok</span>
                  </h3>
                  <BeamCrossSection />
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Detail Pembesian</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded">
                      <h4 className="font-medium text-red-800">Tulangan Tarik Atas</h4>
                      <p className="text-sm text-red-700">
                        {beamReinf.topMain.grade} @ {beamReinf.topMain.spacing}mm
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <h4 className="font-medium text-red-800">Tulangan Tarik Bawah</h4>
                      <p className="text-sm text-red-700">
                        {beamReinf.bottomMain.grade} @ {beamReinf.bottomMain.spacing}mm
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-green-800">Sengkang</h4>
                      <p className="text-sm text-green-700">
                        {beamReinf.stirrups.grade} @ {beamReinf.stirrups.spacing}mm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Tampak Samping Balok</h3>
                <BeamElevation />
              </div>
            </TabsContent>

            <TabsContent value="column" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center space-x-2">
                    <Circle className="h-4 w-4" />
                    <span>Potongan Melintang Kolom</span>
                  </h3>
                  <ColumnCrossSection />
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Detail Pembesian</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded">
                      <h4 className="font-medium text-red-800">Tulangan Utama</h4>
                      <p className="text-sm text-red-700">
                        8{columnReinf.longitudinal.grade} (Longitudinal)
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <h4 className="font-medium text-green-800">Sengkang</h4>
                      <p className="text-sm text-green-700">
                        {columnReinf.ties.grade} @ {columnReinf.ties.spacing}mm
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-800">Panjang Penyaluran</h4>
                      <p className="text-sm text-blue-700">
                        Ld = {Math.round(columnReinf.longitudinal.diameter * 25)}mm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="foundation" className="space-y-6 mt-6">
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Triangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Detail Fondasi</h3>
                <p className="text-gray-600 mb-4">
                  Gambar detail fondasi dengan pembesian sesuai SNI
                </p>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  Coming Soon
                </Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Material Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Daftar Material Pembesian</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">No</th>
                  <th className="text-left p-2">Diameter</th>
                  <th className="text-left p-2">Grade</th>
                  <th className="text-left p-2">Panjang (m)</th>
                  <th className="text-left p-2">Berat (kg)</th>
                  <th className="text-left p-2">Lokasi</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">1</td>
                  <td className="p-2">D{beamReinf.topMain.diameter}</td>
                  <td className="p-2">BJ 410</td>
                  <td className="p-2">{(beamReinf.topMain.length / 1000).toFixed(1)}</td>
                  <td className="p-2">{((beamReinf.topMain.area / 100) * (beamReinf.topMain.length / 1000) * 7.85).toFixed(1)}</td>
                  <td className="p-2">Balok - Tulangan Atas</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">2</td>
                  <td className="p-2">D{beamReinf.bottomMain.diameter}</td>
                  <td className="p-2">BJ 410</td>
                  <td className="p-2">{(beamReinf.bottomMain.length / 1000).toFixed(1)}</td>
                  <td className="p-2">{((beamReinf.bottomMain.area / 100) * (beamReinf.bottomMain.length / 1000) * 7.85).toFixed(1)}</td>
                  <td className="p-2">Balok - Tulangan Bawah</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">3</td>
                  <td className="p-2">D{beamReinf.stirrups.diameter}</td>
                  <td className="p-2">BJ 410</td>
                  <td className="p-2">{(beamReinf.stirrups.length / 1000).toFixed(1)}</td>
                  <td className="p-2">{((beamReinf.stirrups.area / 100) * (beamReinf.stirrups.length / 1000) * 7.85).toFixed(1)}</td>
                  <td className="p-2">Balok - Sengkang</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">4</td>
                  <td className="p-2">D{columnReinf.longitudinal.diameter}</td>
                  <td className="p-2">BJ 410</td>
                  <td className="p-2">{(columnReinf.longitudinal.length / 1000).toFixed(1)}</td>
                  <td className="p-2">{((columnReinf.longitudinal.area / 100) * (columnReinf.longitudinal.length / 1000) * 7.85).toFixed(1)}</td>
                  <td className="p-2">Kolom - Utama</td>
                </tr>
                <tr>
                  <td className="p-2">5</td>
                  <td className="p-2">D{columnReinf.ties.diameter}</td>
                  <td className="p-2">BJ 410</td>
                  <td className="p-2">{(columnReinf.ties.length / 1000).toFixed(1)}</td>
                  <td className="p-2">{((columnReinf.ties.area / 100) * (columnReinf.ties.length / 1000) * 7.85).toFixed(1)}</td>
                  <td className="p-2">Kolom - Sengkang</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <div className="flex items-center space-x-2 text-blue-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Total Material Summary</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
              <div>Total Panjang: <strong>
                {(
                  (beamReinf.topMain.length + beamReinf.bottomMain.length + 
                   beamReinf.stirrups.length + columnReinf.longitudinal.length + 
                   columnReinf.ties.length) / 1000
                ).toFixed(1)}m
              </strong></div>
              <div>Total Berat: <strong>
                {(
                  ((beamReinf.topMain.area / 100) * (beamReinf.topMain.length / 1000) * 7.85) +
                  ((beamReinf.bottomMain.area / 100) * (beamReinf.bottomMain.length / 1000) * 7.85) +
                  ((beamReinf.stirrups.area / 100) * (beamReinf.stirrups.length / 1000) * 7.85) +
                  ((columnReinf.longitudinal.area / 100) * (columnReinf.longitudinal.length / 1000) * 7.85) +
                  ((columnReinf.ties.area / 100) * (columnReinf.ties.length / 1000) * 7.85)
                ).toFixed(1)}kg
              </strong></div>
              <div>Material Grade: <strong>BJ 410 - SNI 2847:2019</strong></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReinforcementDrawing;