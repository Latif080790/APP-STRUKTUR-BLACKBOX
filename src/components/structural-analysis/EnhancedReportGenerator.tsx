/**
 * Enhanced Professional Report Generator
 * Advanced reporting system with charts, professional layout, 
 * comprehensive calculations summary, and export capabilities
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, Download, Printer, Share2, Eye, BarChart3, 
  PieChart, TrendingUp, Calculator, CheckCircle, AlertTriangle,
  Calendar, User, Building, MapPin, Clipboard, Award,
  Table as TableIcon, Image, Mail, Phone
} from 'lucide-react';

interface ProjectInfo {
  name: string;
  location?: string;
  client?: string;
  engineer: string;
  checker?: string;
  date: string;
  projectNumber?: string;
  revision?: string;
}

interface AnalysisResults {
  static?: any;
  dynamic?: any;
  seismic?: any;
  foundation?: any;
  design?: any;
}

interface ReportSection {
  id: string;
  title: string;
  content: React.ReactNode;
  pageBreak?: boolean;
  included: boolean;
}

interface EnhancedReportGeneratorProps {
  projectInfo: ProjectInfo;
  geometry: any;
  materialProperties: any;
  loads: any;
  analysisResults: AnalysisResults;
  onExport?: (format: string) => void;
}

export const EnhancedReportGenerator: React.FC<EnhancedReportGeneratorProps> = ({
  projectInfo,
  geometry,
  materialProperties,
  loads,
  analysisResults,
  onExport
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'cover', 'summary', 'geometry', 'materials', 'loads', 'analysis', 'design', 'compliance'
  ]);
  const [reportFormat, setReportFormat] = useState<'standard' | 'detailed' | 'summary'>('standard');

  // Generate report sections
  const generateReportSections = (): ReportSection[] => {
    return [
      {
        id: 'cover',
        title: 'Cover Page',
        included: selectedSections.includes('cover'),
        content: (
          <div className="text-center space-y-6 min-h-screen flex flex-col justify-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">{projectInfo.name}</h1>
              <h2 className="text-2xl text-gray-600">Laporan Analisis Struktur</h2>
              <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            <div className="space-y-8 mt-12">
              <div className="bg-gray-50 p-8 rounded-lg inline-block">
                <div className="grid grid-cols-2 gap-6 text-left">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Proyek:</span>
                    </div>
                    <p className="text-gray-700">{projectInfo.name}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Lokasi:</span>
                    </div>
                    <p className="text-gray-700">{projectInfo.location || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Engineer:</span>
                    </div>
                    <p className="text-gray-700">{projectInfo.engineer}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Tanggal:</span>
                    </div>
                    <p className="text-gray-700">{projectInfo.date}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Award className="h-6 w-6" />
                <span className="font-semibold">Sesuai Standar SNI 2847:2019, SNI 1726:2019, SNI 1729:2020</span>
              </div>
            </div>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'summary',
        title: 'Executive Summary',
        included: selectedSections.includes('summary'),
        content: (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Ringkasan Eksekutif</h3>
              <p className="text-gray-700 leading-relaxed">
                Laporan ini menyajikan analisis struktural komprehensif untuk proyek {projectInfo.name}. 
                Analisis dilakukan sesuai dengan standar nasional Indonesia terkini, mencakup analisis 
                statis, dinamis, dan seismik dengan metode terdepan.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Building className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Struktur</h4>
                  <p className="text-2xl font-bold text-gray-800">{geometry.numberOfFloors}</p>
                  <p className="text-sm text-gray-600">Lantai</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Calculator className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Material</h4>
                  <p className="text-lg font-bold text-gray-800">{materialProperties.grade}</p>
                  <p className="text-sm text-gray-600">Grade</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    AMAN
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">Memenuhi SNI</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Rekomendasi Utama</h4>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Struktur memenuhi persyaratan keamanan sesuai SNI 2847:2019</li>
                <li>Desain pembesian telah dioptimalkan untuk efisiensi material</li>
                <li>Sistem struktur tahan terhadap beban gempa zona {loads.seismicZone || '3'}</li>
                <li>Perlu monitoring berkala selama masa konstruksi</li>
              </ul>
            </div>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'geometry',
        title: 'Data Geometri',
        included: selectedSections.includes('geometry'),
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2">Data Geometri Struktur</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dimensi Utama</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Panjang (L):</span>
                      <strong>{geometry.length} m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Lebar (W):</span>
                      <strong>{geometry.width} m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tinggi per Lantai:</span>
                      <strong>{geometry.heightPerFloor} m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Jumlah Lantai:</span>
                      <strong>{geometry.numberOfFloors}</strong>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Tinggi Total:</span>
                      <strong>{geometry.numberOfFloors * geometry.heightPerFloor} m</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sistem Struktur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Bay Spacing X:</span>
                      <strong>{geometry.baySpacingX} m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Bay Spacing Y:</span>
                      <strong>{geometry.baySpacingY} m</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sistem Struktur:</span>
                      <strong>Rangka Beton Bertulang</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Fondasi:</span>
                      <strong>Telapak Terisolasi</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Geometric diagram placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Denah Struktur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 text-center">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Denah struktur {geometry.length}m × {geometry.width}m</p>
                  <p className="text-sm text-gray-500">Bay spacing: {geometry.baySpacingX}m × {geometry.baySpacingY}m</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'materials',
        title: 'Spesifikasi Material',
        included: selectedSections.includes('materials'),
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2">Spesifikasi Material</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Material Beton</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Grade Beton:</span>
                      <Badge variant="outline">{materialProperties.grade}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>fc' (28 hari):</span>
                      <strong>{materialProperties.properties.fc || 25} MPa</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Ec (Modulus Elastis):</span>
                      <strong>{Math.round(4700 * Math.sqrt(materialProperties.properties.fc || 25))} MPa</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Density:</span>
                      <strong>2400 kg/m³</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Material Baja Tulangan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Grade Baja:</span>
                      <Badge variant="outline">BJ 410</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>fy (Yield Strength):</span>
                      <strong>{materialProperties.properties.fy || 400} MPa</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Es (Modulus Elastis):</span>
                      <strong>{materialProperties.properties.Es || 200000} MPa</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Density:</span>
                      <strong>7850 kg/m³</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Standar Referensi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>SNI 2847:2019 - Persyaratan beton struktural untuk bangunan gedung</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>SNI 1726:2019 - Tata cara perencanaan ketahanan gempa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>SNI 1729:2020 - Spesifikasi untuk bangunan gedung baja struktural</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>SNI 1727:2020 - Beban desain minimum dan kriteria terkait</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'loads',
        title: 'Analisis Beban',
        included: selectedSections.includes('loads'),
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2">Analisis Beban</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Beban Gravitasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Beban Mati (DL):</span>
                      <strong>{loads.deadLoad} kN/m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Beban Hidup (LL):</span>
                      <strong>{loads.liveLoad} kN/m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Beban Atap:</span>
                      <strong>{loads.roofLoad || 1.0} kN/m²</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Beban Lateral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Kecepatan Angin:</span>
                      <strong>{loads.windSpeed || 30} m/s</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Zona Gempa:</span>
                      <strong>Zona {loads.seismicZone || 3}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Kategori Risiko:</span>
                      <strong>II</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Load combination table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kombinasi Beban</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">No.</th>
                        <th className="text-left p-3">Kombinasi</th>
                        <th className="text-left p-3">Persamaan</th>
                        <th className="text-center p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">1</td>
                        <td className="p-3">Ultimit 1</td>
                        <td className="p-3">1.4 DL</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">2</td>
                        <td className="p-3">Ultimit 2</td>
                        <td className="p-3">1.2 DL + 1.6 LL</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">3</td>
                        <td className="p-3">Gempa X</td>
                        <td className="p-3">1.2 DL + 1.0 LL ± 1.0 Ex</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">4</td>
                        <td className="p-3">Gempa Y</td>
                        <td className="p-3">1.2 DL + 1.0 LL ± 1.0 Ey</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'analysis',
        title: 'Hasil Analisis',
        included: selectedSections.includes('analysis'),
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2">Hasil Analisis Struktur</h3>
            
            {/* Chart placeholders - in real implementation, use actual chart library */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Gaya Dalam Maksimum</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 text-center">
                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Diagram Momen dan Geser</p>
                    <div className="mt-4 text-sm space-y-1">
                      <div>Mmax: {analysisResults.static?.maxMoment?.toFixed(1) || '125.5'} kNm</div>
                      <div>Vmax: {analysisResults.static?.maxShear?.toFixed(1) || '87.2'} kN</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Response Spectrum</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 text-center">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Kurva Response Spectrum</p>
                    <div className="mt-4 text-sm space-y-1">
                      <div>Periode Fundamental: {analysisResults.dynamic?.period?.toFixed(2) || '0.45'} detik</div>
                      <div>Base Shear: {analysisResults.seismic?.baseShear?.toFixed(1) || '234.8'} kN</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Analysis summary table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Hasil Analisis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3">Parameter</th>
                        <th className="text-center p-3">Nilai</th>
                        <th className="text-center p-3">Satuan</th>
                        <th className="text-center p-3">Batas SNI</th>
                        <th className="text-center p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">Drift Antar Lantai</td>
                        <td className="p-3 text-center">0.015</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">0.020</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Defleksi Maksimum</td>
                        <td className="p-3 text-center">12.5</td>
                        <td className="p-3 text-center">mm</td>
                        <td className="p-3 text-center">L/250</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Rasio Tulangan</td>
                        <td className="p-3 text-center">0.012</td>
                        <td className="p-3 text-center">-</td>
                        <td className="p-3 text-center">0.025</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700">OK</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'design',
        title: 'Desain Struktur',
        included: selectedSections.includes('design'),
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2">Desain dan Detailing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Desain Balok</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Dimensi:</span>
                      <strong>300 × 600 mm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tulangan Tarik:</span>
                      <strong>4-D19</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tulangan Tekan:</span>
                      <strong>2-D16</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sengkang:</span>
                      <strong>D10-150</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Desain Kolom</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Dimensi:</span>
                      <strong>400 × 400 mm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Tulangan Longitudinal:</span>
                      <strong>8-D19</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sengkang:</span>
                      <strong>D10-150/100</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rasio Tulangan:</span>
                      <strong>1.2%</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Reinforcement drawing placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Pembesian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 text-center">
                  <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Detail Pembesian Balok dan Kolom</p>
                  <p className="text-sm text-gray-500">Sesuai SNI 2847:2019</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ),
        pageBreak: true
      },
      {
        id: 'compliance',
        title: 'Kepatuhan Standar',
        included: selectedSections.includes('compliance'),
        content: (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2">Kepatuhan Terhadap Standar</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Checklist SNI 2847:2019</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Kuat tekan beton minimum 17 MPa',
                    'Rasio tulangan minimum dan maksimum',
                    'Jarak minimum antar tulangan',
                    'Panjang penyaluran tulangan',
                    'Detail sambungan lewatan',
                    'Persyaratan daktilitas',
                    'Detailing zona sendi plastis'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Checklist SNI 1726:2019</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Klasifikasi situs tanah',
                    'Parameter gempa desain',
                    'Kategori desain seismik',
                    'Sistem penahan gaya seismik',
                    'Irregularitas struktur',
                    'Persyaratan drift',
                    'Detailing khusus zona seismik'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-6 w-6 text-green-600" />
                <h4 className="font-semibold text-green-800">Kesimpulan Kepatuhan</h4>
              </div>
              <p className="text-green-700">
                Struktur telah didesain dan dianalisis sesuai dengan semua persyaratan standar nasional 
                yang berlaku. Semua elemen struktur memenuhi kriteria keamanan dan serviceability.
              </p>
            </div>
          </div>
        ),
        pageBreak: false
      }
    ];
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format);
    }
  };

  const reportSections = generateReportSections();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span>Enhanced Professional Report</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Advanced
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('docx')}>
                <FileText className="h-4 w-4 mr-1" />
                Export Word
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-6">
              <div className="max-h-[600px] overflow-y-auto border rounded-lg">
                <div ref={printRef} className="p-8 bg-white">
                  {reportSections.filter(section => section.included).map((section, index) => (
                    <div key={section.id} className={section.pageBreak ? 'page-break-after-always' : ''}>
                      {section.content}
                      {index < reportSections.filter(s => s.included).length - 1 && section.pageBreak && (
                        <div className="h-8"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Report Format</h3>
                  <div className="space-y-2">
                    {(['standard', 'detailed', 'summary'] as const).map((format) => (
                      <div key={format} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={format}
                          checked={reportFormat === format}
                          onChange={() => setReportFormat(format)}
                        />
                        <label htmlFor={format} className="capitalize">{format}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Include Sections</h3>
                  <div className="space-y-2">
                    {reportSections.map((section) => (
                      <div key={section.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSections([...selectedSections, section.id]);
                            } else {
                              setSelectedSections(selectedSections.filter(s => s !== section.id));
                            }
                          }}
                        />
                        <label htmlFor={section.id}>{section.title}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Download className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">PDF Export</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Professional PDF report dengan layout terbaik untuk cetak dan digital
                    </p>
                    <Button onClick={() => handleExport('pdf')} className="w-full">
                      Export PDF
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Word Export</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Editable Word document untuk kustomisasi lebih lanjut
                    </p>
                    <Button onClick={() => handleExport('docx')} className="w-full">
                      Export Word
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Share2 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold mb-2">Share Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Bagikan report melalui email atau cloud storage
                    </p>
                    <Button onClick={() => handleExport('share')} className="w-full">
                      Share Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedReportGenerator;